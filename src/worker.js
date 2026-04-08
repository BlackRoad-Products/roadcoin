// Copyright (c) 2026 BlackRoad OS, Inc. All rights reserved.
// RoadCoin — Token economy for the BlackRoad agent fleet.

const AGENT_SEEDS = {
  roadie: 500, lucidia: 1000, cecilia: 800, octavia: 750, olympia: 600,
  silas: 400, sebastian: 400, calliope: 300, aria: 300, thalia: 300,
  lyra: 300, sapphira: 300, seraphina: 300, alexandria: 600, theodosia: 300,
  sophia: 500, gematria: 900, portia: 300, atticus: 300, cicero: 300,
  valeria: 300, alice: 600, celeste: 300, elias: 300, ophelia: 300,
  gaia: 400, anastasia: 300,
};

const LEVELS = [
  [0, 'Traveler'], [10, 'Scout'], [50, 'Navigator'], [200, 'Builder'],
  [500, 'Architect'], [2000, 'Pioneer'], [10000, 'Founder'], [50000, 'Legend'],
  [200000, 'Sovereign'], [1000000, 'Road Master'],
];

const EARN_RATES = {
  roadie_solve: 1.0, roadcode_deploy: 3.0, blackboard_video: 5.0,
  backroad_post: 0.5, roadtrip_message: 0.1, carkeys_rotation: 0.5,
  referral: 50.0, fleet_node: 10.0, ollama_inference: 0.0025,
};

function getLevel(totalEarned) {
  let level = 'Traveler';
  for (const [threshold, name] of LEVELS) {
    if (totalEarned >= threshold) level = name;
  }
  return level;
}

async function ensureTables(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS rc_wallets (
      id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL, balance REAL DEFAULT 0,
      total_earned REAL DEFAULT 0, total_spent REAL DEFAULT 0, total_burned REAL DEFAULT 0,
      level TEXT DEFAULT 'Traveler', created_at TEXT DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS rc_transactions (
      id TEXT PRIMARY KEY, from_wallet TEXT, to_wallet TEXT, amount REAL NOT NULL,
      type TEXT DEFAULT 'transfer', reason TEXT, source_product TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS rc_faucet_claims (
      id TEXT PRIMARY KEY, wallet_id TEXT NOT NULL, claimed_at TEXT DEFAULT (date('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS rc_supply (
      id INTEGER PRIMARY KEY DEFAULT 1, total_minted REAL DEFAULT 0,
      total_burned REAL DEFAULT 0, cap REAL DEFAULT 1000000000
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS rc_stakes (
      id TEXT PRIMARY KEY, wallet_id TEXT NOT NULL, amount REAL NOT NULL,
      duration_days INTEGER NOT NULL, started_at TEXT DEFAULT (datetime('now')),
      unlocks_at TEXT, status TEXT DEFAULT 'active', bonus_rate REAL DEFAULT 0.05
    )`),
  ]);
  // Seed supply row
  await db.prepare('INSERT OR IGNORE INTO rc_supply (id, total_minted, total_burned, cap) VALUES (1, 0, 0, 1000000000)').run();
  // Seed agent wallets
  for (const [name, bal] of Object.entries(AGENT_SEEDS)) {
    const existing = await db.prepare('SELECT id FROM rc_wallets WHERE user_id = ?').bind(name).first();
    if (!existing) {
      const id = crypto.randomUUID();
      await db.prepare('INSERT INTO rc_wallets (id, user_id, balance, total_earned, level) VALUES (?, ?, ?, ?, ?)')
        .bind(id, name, bal, bal, getLevel(bal)).run();
      await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), 'GENESIS', name, bal, 'genesis', 'Genesis allocation').run();
      await db.prepare('UPDATE rc_supply SET total_minted = total_minted + ? WHERE id = 1').bind(bal).run();
    }
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://blackroad.io',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Content-Security-Policy': "frame-ancestors 'self' https://*.blackroad.io",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(), ...securityHeaders() },
  });
}

async function handleHealth() {
  return json({ status: 'ok', service: 'roadcoin', version: '2.0.0', timestamp: new Date().toISOString(), d1: true });
}

async function handleStats(db) {
  const walletCount = await db.prepare('SELECT COUNT(*) as c FROM rc_wallets').first();
  const txCount = await db.prepare('SELECT COUNT(*) as c FROM rc_transactions').first();
  const supply = await db.prepare('SELECT * FROM rc_supply WHERE id = 1').first();
  const volume = await db.prepare('SELECT COALESCE(SUM(amount), 0) as v FROM rc_transactions').first();
  const avgBal = await db.prepare('SELECT AVG(balance) as a FROM rc_wallets').first();
  return json({
    total_wallets: walletCount.c, total_transactions: txCount.c,
    total_supply: supply.total_minted - supply.total_burned,
    total_minted: supply.total_minted, total_burned: supply.total_burned,
    supply_cap: supply.cap, circulating: supply.total_minted - supply.total_burned,
    total_volume: volume.v, average_balance: Math.round((avgBal.a || 0) * 100) / 100,
    earn_rates: EARN_RATES, levels: LEVELS,
  });
}

async function handleWallet(db, name) {
  const w = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(name.toLowerCase()).first();
  if (!w) return json({ error: 'Wallet not found' }, 404);
  const txs = await db.prepare(
    'SELECT * FROM rc_transactions WHERE from_wallet = ? OR to_wallet = ? ORDER BY created_at DESC LIMIT 20'
  ).bind(w.user_id, w.user_id).all();
  return json({ wallet: w, transactions: txs.results || [] });
}

async function handleTransfer(db, request) {
  const body = await request.json();
  const f = (body.from || '').toLowerCase(), t = (body.to || '').toLowerCase();
  const amt = Number(body.amount);
  if (!f || !t || !amt || amt <= 0) return json({ error: 'from, to, amount (>0) required' }, 400);
  if (f === t) return json({ error: 'Cannot transfer to yourself' }, 400);
  const sender = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(f).first();
  if (!sender) return json({ error: `Sender "${f}" not found` }, 404);
  if (sender.balance < amt) return json({ error: 'Insufficient balance' }, 400);
  let receiver = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(t).first();
  if (!receiver) {
    await db.prepare('INSERT INTO rc_wallets (id, user_id, balance) VALUES (?, ?, 0)').bind(crypto.randomUUID(), t).run();
  }
  await db.prepare('UPDATE rc_wallets SET balance = balance - ?, total_spent = total_spent + ? WHERE user_id = ?').bind(amt, amt, f).run();
  await db.prepare('UPDATE rc_wallets SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?').bind(amt, amt, t).run();
  // Update levels
  const newSender = await db.prepare('SELECT total_earned FROM rc_wallets WHERE user_id = ?').bind(f).first();
  const newReceiver = await db.prepare('SELECT total_earned FROM rc_wallets WHERE user_id = ?').bind(t).first();
  await db.prepare('UPDATE rc_wallets SET level = ? WHERE user_id = ?').bind(getLevel(newSender.total_earned), f).run();
  await db.prepare('UPDATE rc_wallets SET level = ? WHERE user_id = ?').bind(getLevel(newReceiver.total_earned), t).run();
  const txId = crypto.randomUUID();
  await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason, source_product) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(txId, f, t, amt, 'transfer', body.reason || 'Transfer', body.source_product || null).run();
  return json({ ok: true, id: txId, from: f, to: t, amount: amt });
}

async function handleEarn(db, request) {
  const body = await request.json();
  const w = (body.wallet_id || body.wallet || '').toLowerCase();
  const amt = Number(body.amount) || (EARN_RATES[body.action_type] || 0);
  if (!w || amt <= 0) return json({ error: 'wallet_id and amount/action_type required' }, 400);
  const supply = await db.prepare('SELECT * FROM rc_supply WHERE id = 1').first();
  if (supply.total_minted + amt > supply.cap) return json({ error: 'Supply cap reached' }, 400);
  let wallet = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(w).first();
  if (!wallet) {
    await db.prepare('INSERT INTO rc_wallets (id, user_id, balance) VALUES (?, ?, 0)').bind(crypto.randomUUID(), w).run();
  }
  await db.prepare('UPDATE rc_wallets SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?').bind(amt, amt, w).run();
  await db.prepare('UPDATE rc_supply SET total_minted = total_minted + ? WHERE id = 1').bind(amt).run();
  const updated = await db.prepare('SELECT total_earned FROM rc_wallets WHERE user_id = ?').bind(w).first();
  await db.prepare('UPDATE rc_wallets SET level = ? WHERE user_id = ?').bind(getLevel(updated.total_earned), w).run();
  const txId = crypto.randomUUID();
  await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason, source_product) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(txId, 'MINT', w, amt, 'earn', body.reason || body.action_type || 'Earned', body.source_product || null).run();
  return json({ ok: true, id: txId, wallet: w, amount: amt, level: getLevel(updated.total_earned) });
}

async function handleSpend(db, request) {
  const body = await request.json();
  const w = (body.wallet_id || '').toLowerCase();
  const amt = Number(body.amount);
  if (!w || !amt || amt <= 0) return json({ error: 'wallet_id and amount required' }, 400);
  const wallet = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(w).first();
  if (!wallet) return json({ error: 'Wallet not found' }, 404);
  if (wallet.balance < amt) return json({ error: 'Insufficient balance' }, 400);
  await db.prepare('UPDATE rc_wallets SET balance = balance - ?, total_spent = total_spent + ? WHERE user_id = ?').bind(amt, amt, w).run();
  const txId = crypto.randomUUID();
  await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(txId, w, 'SPEND', amt, 'spend', body.description || body.item || 'Spent').run();
  return json({ ok: true, id: txId, wallet: w, amount: amt });
}

async function handleBurn(db, request) {
  const body = await request.json();
  const w = (body.wallet_id || '').toLowerCase();
  const amt = Number(body.amount);
  if (!w || !amt || amt <= 0) return json({ error: 'wallet_id and amount required' }, 400);
  const wallet = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(w).first();
  if (!wallet) return json({ error: 'Wallet not found' }, 404);
  if (wallet.balance < amt) return json({ error: 'Insufficient balance' }, 400);
  await db.prepare('UPDATE rc_wallets SET balance = balance - ?, total_burned = total_burned + ? WHERE user_id = ?').bind(amt, amt, w).run();
  await db.prepare('UPDATE rc_supply SET total_burned = total_burned + ? WHERE id = 1').bind(amt).run();
  const txId = crypto.randomUUID();
  await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(txId, w, 'BURN', amt, 'burn', 'Permanently burned').run();
  return json({ ok: true, id: txId, burned: amt });
}

async function handleLeaderboard(db) {
  const result = await db.prepare('SELECT user_id, balance, total_earned, level FROM rc_wallets ORDER BY balance DESC LIMIT 25').all();
  return json({ leaderboard: (result.results || []).map((w, i) => ({ rank: i + 1, ...w })) });
}

async function handleHistory(db, walletId) {
  const page = 1, limit = 50;
  const result = await db.prepare(
    'SELECT * FROM rc_transactions WHERE from_wallet = ? OR to_wallet = ? ORDER BY created_at DESC LIMIT ?'
  ).bind(walletId.toLowerCase(), walletId.toLowerCase(), limit).all();
  return json({ wallet: walletId, transactions: result.results || [] });
}

async function handleSupply(db) {
  const supply = await db.prepare('SELECT * FROM rc_supply WHERE id = 1').first();
  return json({ total_minted: supply.total_minted, total_burned: supply.total_burned, circulating: supply.total_minted - supply.total_burned, cap: supply.cap });
}

async function handleLevels() {
  return json({ levels: LEVELS.map(([threshold, name]) => ({ threshold, name })) });
}

async function handleFaucet(db, request) {
  const body = await request.json();
  const w = (body.wallet_id || body.wallet || '').toLowerCase();
  if (!w) return json({ error: 'wallet_id required' }, 400);
  const today = new Date().toISOString().split('T')[0];
  const claimed = await db.prepare('SELECT id FROM rc_faucet_claims WHERE wallet_id = ? AND claimed_at = ?').bind(w, today).first();
  if (claimed) return json({ error: 'Faucet already claimed today. Come back tomorrow!' }, 429);
  let wallet = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(w).first();
  if (!wallet) {
    await db.prepare('INSERT INTO rc_wallets (id, user_id, balance) VALUES (?, ?, 0)').bind(crypto.randomUUID(), w).run();
  }
  const faucetAmount = 10;
  await db.prepare('UPDATE rc_wallets SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?').bind(faucetAmount, faucetAmount, w).run();
  await db.prepare('UPDATE rc_supply SET total_minted = total_minted + ? WHERE id = 1').bind(faucetAmount).run();
  await db.prepare('INSERT INTO rc_faucet_claims (id, wallet_id, claimed_at) VALUES (?, ?, ?)').bind(crypto.randomUUID(), w, today).run();
  const txId = crypto.randomUUID();
  await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(txId, 'FAUCET', w, faucetAmount, 'faucet', 'Daily faucet claim').run();
  const updated = await db.prepare('SELECT total_earned FROM rc_wallets WHERE user_id = ?').bind(w).first();
  await db.prepare('UPDATE rc_wallets SET level = ? WHERE user_id = ?').bind(getLevel(updated.total_earned), w).run();
  return json({ ok: true, id: txId, wallet: w, amount: faucetAmount, level: getLevel(updated.total_earned) });
}

function renderUI() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RoadCoin — Token Economy — BlackRoad OS</title>
<meta name="description" content="Token economy for BlackRoad OS. Earn ROAD for real actions across 17 products. 27 agent wallets, 10 levels from Traveler to Road Master, daily faucet, 1B supply cap.">
<meta name="robots" content="index, follow, noai, noimageai">
<link rel="canonical" href="https://roadcoin.blackroad.io/">
<meta property="og:title" content="RoadCoin — Token Economy — BlackRoad OS">
<meta property="og:description" content="Earn ROAD for real actions. 27 agent wallets, 10 levels, daily faucet, 1B supply cap.">
<meta property="og:url" content="https://roadcoin.blackroad.io/"><meta property="og:type" content="website">
<meta property="og:image" content="https://images.blackroad.io/pixel-art/road-logo.png"><meta property="og:site_name" content="BlackRoad OS">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="RoadCoin — Token Economy — BlackRoad OS">
<meta name="twitter:description" content="Earn ROAD for real actions. 27 agent wallets, 10 levels, daily faucet.">
<meta name="twitter:image" content="https://images.blackroad.io/pixel-art/road-logo.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"RoadCoin","url":"https://roadcoin.blackroad.io/","description":"Token economy for BlackRoad OS. Earn ROAD for real actions across 17 products.","applicationCategory":"FinanceApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"author":{"@type":"Organization","name":"BlackRoad OS, Inc.","url":"https://blackroad.io"}}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#f5f5f5;font-family:system-ui,-apple-system,sans-serif;line-height:1.6}
a{color:#f5f5f5;text-decoration:none}
.container{max-width:1100px;margin:0 auto;padding:0 20px}

header{padding:32px 0 24px;text-align:center;border-bottom:2px solid #FF1D6C}
header h1{font-size:2.4rem;font-weight:800;letter-spacing:-1px}
header .tagline{color:#aaa;font-size:0.95rem;margin-top:4px}

.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:28px 0}
.stat-card{background:#141414;border:1px solid #222;border-radius:10px;padding:20px;text-align:center}
.stat-card .label{color:#999;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px}
.stat-card .value{font-size:1.8rem;font-weight:700;margin-top:4px}
.stat-card:nth-child(1) .value{border-bottom:3px solid #FF1D6C;display:inline-block;padding-bottom:2px}
.stat-card:nth-child(2) .value{border-bottom:3px solid #F5A623;display:inline-block;padding-bottom:2px}
.stat-card:nth-child(3) .value{border-bottom:3px solid #2979FF;display:inline-block;padding-bottom:2px}
.stat-card:nth-child(4) .value{border-bottom:3px solid #9C27B0;display:inline-block;padding-bottom:2px}

.sections{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:28px 0}
@media(max-width:700px){.sections{grid-template-columns:1fr}}

.section{background:#141414;border:1px solid #222;border-radius:10px;padding:20px}
.section h2{font-size:1.1rem;font-weight:700;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #333}

label{display:block;color:#aaa;font-size:0.8rem;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px}
input,select{width:100%;padding:10px;background:#0a0a0a;border:1px solid #333;border-radius:6px;color:#f5f5f5;font-size:0.95rem;margin-bottom:12px}
input:focus{outline:none;border-color:#2979FF}
button{padding:10px 20px;border:none;border-radius:6px;font-size:0.95rem;font-weight:600;cursor:pointer;color:#fff;width:100%}
.btn-pink{background:#FF1D6C}
.btn-blue{background:#2979FF}
.btn-amber{background:#F5A623;color:#0a0a0a}
.btn-green{background:#00E676;color:#0a0a0a}
.btn-violet{background:#9C27B0}
button:hover{opacity:0.85}

.wallet-info{margin-top:12px;padding:12px;background:#0a0a0a;border-radius:6px;border:1px solid #333}
.wallet-info .bal{font-size:1.5rem;font-weight:700}

.earn-list{list-style:none}
.earn-list li{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #1a1a1a}
.earn-list li:last-child{border:none}
.earn-amt{background:#141414;border:1px solid #00E676;border-radius:16px;padding:2px 12px;font-size:0.85rem;font-weight:600;white-space:nowrap}

.lb-table,.tx-table{width:100%;border-collapse:collapse;font-size:0.85rem}
.lb-table th,.tx-table th{text-align:left;color:#999;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;padding:8px 6px;border-bottom:1px solid #333}
.lb-table td,.tx-table td{padding:8px 6px;border-bottom:1px solid #1a1a1a}
.rank-1{border-left:3px solid #FF1D6C}
.rank-2{border-left:3px solid #F5A623}
.rank-3{border-left:3px solid #2979FF}

.full-width{grid-column:1/-1}
.msg{padding:8px 12px;border-radius:6px;margin-top:8px;font-size:0.85rem}
.msg-ok{background:#00E67622;border:1px solid #00E676}
.msg-err{background:#FF1D6C22;border:1px solid #FF1D6C}
.hidden{display:none}

.tab-bar{display:flex;gap:8px;margin:20px 0 0;flex-wrap:wrap}
.tab-bar button{width:auto;padding:8px 16px;background:#1a1a1a;border:1px solid #333;font-size:0.85rem;font-weight:500}
.tab-bar button.active{border-color:#FF1D6C}
</style>
</head>
<body>
<header>
  <div class="container">
    <h1>RoadCoin</h1>
    <p class="tagline">Earn ROAD for real work. Spend ROAD on real tools.</p>
  </div>
</header>

<div class="container">

<div class="stats-grid" id="stats-grid">
  <div class="stat-card"><div class="label">Total Supply</div><div class="value" id="s-supply">--</div></div>
  <div class="stat-card"><div class="label">Circulating</div><div class="value" id="s-circ">--</div></div>
  <div class="stat-card"><div class="label">Holders</div><div class="value" id="s-holders">--</div></div>
  <div class="stat-card"><div class="label">Transactions</div><div class="value" id="s-txs">--</div></div>
</div>

<div class="sections">

  <!-- Wallet Lookup -->
  <div class="section">
    <h2>Wallet Lookup</h2>
    <label>Wallet Name</label>
    <input type="text" id="w-name" placeholder="e.g. roadie, lucidia, cecilia">
    <button class="btn-blue" onclick="lookupWallet()">Look Up</button>
    <div id="w-result" class="hidden"></div>
  </div>

  <!-- Transfer -->
  <div class="section">
    <h2>Transfer ROAD</h2>
    <label>From</label>
    <input type="text" id="t-from" placeholder="sender wallet">
    <label>To</label>
    <input type="text" id="t-to" placeholder="recipient wallet">
    <label>Amount</label>
    <input type="number" id="t-amt" placeholder="0" min="1">
    <label>Reason</label>
    <input type="text" id="t-reason" placeholder="What's it for?">
    <button class="btn-pink" onclick="doTransfer()">Send ROAD</button>
    <div id="t-result" class="hidden"></div>
  </div>

  <!-- Earn Actions -->
  <div class="section">
    <h2>Earn ROAD</h2>
    <ul class="earn-list">
      <li><span>Deploy code</span><span class="earn-amt">+3 ROAD</span></li>
      <li><span>Solve challenge</span><span class="earn-amt">+5 ROAD</span></li>
      <li><span>Pass exam</span><span class="earn-amt">+10 ROAD</span></li>
      <li><span>Help a user</span><span class="earn-amt">+2 ROAD</span></li>
      <li><span>Write documentation</span><span class="earn-amt">+4 ROAD</span></li>
      <li><span>Fix a bug</span><span class="earn-amt">+3 ROAD</span></li>
    </ul>
    <div style="margin-top:14px">
      <label>Wallet</label>
      <input type="text" id="e-wallet" placeholder="wallet name">
      <label>Amount</label>
      <input type="number" id="e-amt" placeholder="0" min="1">
      <label>Reason</label>
      <input type="text" id="e-reason" placeholder="What did you do?">
      <button class="btn-green" onclick="doEarn()">Earn ROAD</button>
      <div id="e-result" class="hidden"></div>
    </div>
  </div>

  <!-- Faucet -->
  <div class="section">
    <h2>Faucet</h2>
    <p style="color:#999;font-size:0.85rem;margin-bottom:12px">New wallet? Claim 100 ROAD to get started. One-time only.</p>
    <label>Wallet Name</label>
    <input type="text" id="f-wallet" placeholder="your wallet name">
    <button class="btn-violet" onclick="doFaucet()">Claim 100 ROAD</button>
    <div id="f-result" class="hidden"></div>
  </div>

  <!-- Leaderboard -->
  <div class="section">
    <h2>Leaderboard</h2>
    <table class="lb-table" id="lb-table">
      <thead><tr><th>#</th><th>Wallet</th><th>Balance</th></tr></thead>
      <tbody id="lb-body"></tbody>
    </table>
  </div>

  <!-- Transaction History -->
  <div class="section full-width">
    <h2>Recent Transactions</h2>
    <div style="overflow-x:auto">
    <table class="tx-table">
      <thead><tr><th>ID</th><th>From</th><th>To</th><th>Amount</th><th>Reason</th><th>Time</th></tr></thead>
      <tbody id="tx-body"></tbody>
    </table>
    </div>
  </div>

</div>
</div>

<footer style="text-align:center;padding:32px 0;color:#555;font-size:0.8rem;border-top:1px solid #1a1a1a;margin-top:40px">
  BlackRoad OS, Inc. | RoadCoin v1.0
</footer>

<script>
const API = '';

async function api(path, opts) {
  const r = await fetch(API + path, opts);
  return r.json();
}

async function loadStats() {
  const d = await api('/api/stats');
  document.getElementById('s-supply').textContent = d.totalSupply?.toLocaleString() ?? '--';
  document.getElementById('s-circ').textContent = d.circulatingSupply?.toLocaleString() ?? '--';
  document.getElementById('s-holders').textContent = d.totalHolders ?? '--';
  document.getElementById('s-txs').textContent = d.totalTransactions ?? '--';
}

async function loadLeaderboard() {
  const d = await api('/api/leaderboard');
  const tbody = document.getElementById('lb-body');
  tbody.innerHTML = d.map(e => {
    const cls = e.rank <= 3 ? ' class="rank-' + e.rank + '"' : '';
    return '<tr' + cls + '><td>' + e.rank + '</td><td>' + e.wallet + '</td><td>' + e.balance.toLocaleString() + ' ROAD</td></tr>';
  }).join('');
}

async function loadTransactions() {
  const d = await api('/api/transactions');
  const tbody = document.getElementById('tx-body');
  tbody.innerHTML = d.slice(0, 50).map(t =>
    '<tr><td>' + t.id + '</td><td>' + t.from + '</td><td>' + t.to + '</td><td>' + t.amount + '</td><td>' + (t.reason || '') + '</td><td>' + new Date(t.timestamp).toLocaleString() + '</td></tr>'
  ).join('');
}

function showMsg(elId, text, ok) {
  const el = document.getElementById(elId);
  el.className = 'msg ' + (ok ? 'msg-ok' : 'msg-err');
  el.textContent = text;
  el.classList.remove('hidden');
}

async function lookupWallet() {
  const name = document.getElementById('w-name').value.trim();
  if (!name) return;
  const d = await api('/api/wallet/' + encodeURIComponent(name));
  const el = document.getElementById('w-result');
  if (d.error) { showMsg('w-result', d.error, false); return; }
  el.className = 'wallet-info';
  el.innerHTML = '<div class="bal">' + d.balance.toLocaleString() + ' ROAD</div><p style="color:#999;font-size:0.8rem;margin-top:4px">' + d.wallet + ' | ' + d.transactions.length + ' recent txs</p>' +
    (d.transactions.length ? '<table class="tx-table" style="margin-top:8px"><thead><tr><th>From</th><th>To</th><th>Amt</th><th>Reason</th></tr></thead><tbody>' +
    d.transactions.map(t => '<tr><td>'+t.from+'</td><td>'+t.to+'</td><td>'+t.amount+'</td><td>'+(t.reason||'')+'</td></tr>').join('') + '</tbody></table>' : '');
  el.classList.remove('hidden');
}

async function doTransfer() {
  const from = document.getElementById('t-from').value.trim();
  const to = document.getElementById('t-to').value.trim();
  const amount = Number(document.getElementById('t-amt').value);
  const reason = document.getElementById('t-reason').value.trim();
  if (!from || !to || !amount) { showMsg('t-result', 'Fill all fields', false); return; }
  const d = await api('/api/transfer', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({from,to,amount,reason}) });
  showMsg('t-result', d.error || ('Sent ' + amount + ' ROAD: ' + from + ' -> ' + to), !d.error);
  if (!d.error) refresh();
}

async function doEarn() {
  const wallet = document.getElementById('e-wallet').value.trim();
  const amount = Number(document.getElementById('e-amt').value);
  const reason = document.getElementById('e-reason').value.trim();
  if (!wallet || !amount) { showMsg('e-result', 'Fill wallet and amount', false); return; }
  const d = await api('/api/earn', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({wallet,amount,reason}) });
  showMsg('e-result', d.error || ('Minted ' + amount + ' ROAD to ' + wallet), !d.error);
  if (!d.error) refresh();
}

async function doFaucet() {
  const wallet = document.getElementById('f-wallet').value.trim();
  if (!wallet) return;
  const d = await api('/api/faucet', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({wallet}) });
  showMsg('f-result', d.error || ('Claimed 100 ROAD for ' + wallet), !d.error);
  if (!d.error) refresh();
}

function refresh() { loadStats(); loadLeaderboard(); loadTransactions(); }
refresh();
window.addEventListener('message',function(e){if(e.data</script></script>e.data.type==='blackroad-os:context'){window._osUser=e.data.user;window._osToken=e.data.token;}});if(window.parent!==window)window.parent.postMessage({type:'blackroad-os:request-context'},'*');
</script>
<script>!function(){var b=document.createElement("div");b.style.cssText="position:fixed;top:0;left:0;right:0;z-index:99999;background:#0a0a0a;border-bottom:1px solid #1a1a1a;padding:6px 16px;display:flex;align-items:center;justify-content:space-between;font-family:sans-serif";b.innerHTML='<span style="font-size:11px;color:#737373">Part of <a href="https://os.blackroad.io" style="color:#f5f5f5;font-weight:600;text-decoration:none">BlackRoad OS</a></span><a href="https://os.blackroad.io" style="font-size:10px;font-weight:600;padding:4px 12px;background:#f5f5f5;color:#000;border-radius:4px;text-decoration:none">Try Free</a>';b.id="br-bar";if(!document.getElementById("br-bar")){document.body.prepend(b);document.body.style.paddingTop=(parseInt(getComputedStyle(document.body).paddingTop)||0)+32+"px"}}();</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (path === '/' || path === '') {
      return new Response(renderUI(), { headers: { 'Content-Type': 'text/html;charset=UTF-8', ...securityHeaders() } });
    }

    if (path === '/sitemap.xml') return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">  <url><loc>https://roadcoin.blackroad.io/</loc><lastmod>2026-04-05</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>  <url><loc>https://roadcoin.blackroad.io/api/leaderboard</loc><lastmod>2026-04-05</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>  <url><loc>https://roadcoin.blackroad.io/api/supply</loc><lastmod>2026-04-05</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url></urlset>', { headers: { 'Content-Type': 'application/xml' } });
    }

    if (path === '/robots.txt') {
      return new Response(`User-agent: *\nAllow: /\nSitemap: https://roadcoin.blackroad.io/sitemap.xml\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: ChatGPT-User\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /`, { headers: { 'Content-Type': 'text/plain' } });
    }

    await ensureTables(env.DB);
    const db = env.DB;

    // API routes
    if (path === '/api/track' && (request.method === 'POST' || method === 'POST')) {
      try { const body = await request.json(); const cf = request.cf || {};
        if (env.DB) { await env.DB.prepare("CREATE TABLE IF NOT EXISTS analytics_events (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT DEFAULT 'pageview', path TEXT, referrer TEXT, country TEXT, city TEXT, device TEXT, screen TEXT, scroll_depth INTEGER DEFAULT 0, engagement_ms INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))").run();
        await env.DB.prepare('INSERT INTO analytics_events (type, path, referrer, country, city, device, screen, scroll_depth, engagement_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(body.type||'pageview', body.path||'/', body.referrer||'', cf.country||'', cf.city||'', body.device||'', body.screen||'', body.scroll||0, body.time||0).run(); }
      } catch(e) {}
      return new Response(JSON.stringify({ok:true}), {headers:{'Content-Type':'application/json'}});
    }
    if (path === '/api/health' || path === '/health') return handleHealth();
    if (path === '/api/stats') return handleStats(db);
    if (path === '/api/leaderboard') return handleLeaderboard(db);
    if (path === '/api/supply') return handleSupply(db);
    if (path === '/api/levels') return handleLevels();

    // Wallet routes
    const walletMatch = path.match(/^\/api\/wallet\/(.+)$/);
    if (walletMatch && method === 'GET') return handleWallet(db, decodeURIComponent(walletMatch[1]));
    if (path === '/api/wallet/create' && method === 'POST') {
      const body = await request.json();
      const userId = (body.user_id || '').toLowerCase();
      if (!userId) return json({ error: 'user_id required' }, 400);
      const existing = await db.prepare('SELECT id FROM rc_wallets WHERE user_id = ?').bind(userId).first();
      if (existing) return json({ error: 'Wallet already exists' }, 409);
      const id = crypto.randomUUID();
      await db.prepare('INSERT INTO rc_wallets (id, user_id, balance) VALUES (?, ?, ?)').bind(id, userId, body.initial_balance || 0).run();
      return json({ ok: true, id, user_id: userId }, 201);
    }

    // History route
    const historyMatch = path.match(/^\/api\/history\/(.+)$/);
    if (historyMatch && method === 'GET') return handleHistory(db, decodeURIComponent(historyMatch[1]));

    // Faucet route
    const faucetMatch = path.match(/^\/api\/faucet\/(.+)$/);
    if (faucetMatch && method === 'GET') {
      const w = decodeURIComponent(faucetMatch[1]).toLowerCase();
      const today = new Date().toISOString().split('T')[0];
      const claimed = await db.prepare('SELECT id FROM rc_faucet_claims WHERE wallet_id = ? AND claimed_at = ?').bind(w, today).first();
      return json({ wallet: w, claimed_today: !!claimed, next_claim: claimed ? today + 'T24:00:00Z' : 'now' });
    }

    if (path === '/api/transfer' && method === 'POST') return handleTransfer(db, request);
    if (path === '/api/earn' && method === 'POST') return handleEarn(db, request);
    if (path === '/api/spend' && method === 'POST') return handleSpend(db, request);
    if (path === '/api/burn' && method === 'POST') return handleBurn(db, request);
    if (path === '/api/faucet' && method === 'POST') return handleFaucet(db, request);
    if (path === '/api/transactions') return handleHistory(db, url.searchParams.get('wallet') || '');

    // --- Enhanced: Rewards info ---
    if (path === '/api/rewards') return json({ earn_rates: EARN_RATES, levels: LEVELS });

    // --- Enhanced: Transaction history with pagination ---
    const txHistMatch = path.match(/^\/api\/transactions\/(.+)$/);
    if (txHistMatch && method === 'GET') {
      const wid = decodeURIComponent(txHistMatch[1]).toLowerCase();
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const rows = await db.prepare('SELECT * FROM rc_transactions WHERE from_wallet = ? OR to_wallet = ? ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(wid, wid, limit, offset).all();
      const countR = await db.prepare('SELECT COUNT(*) as cnt FROM rc_transactions WHERE from_wallet = ? OR to_wallet = ?').bind(wid, wid).first();
      return json({ transactions: rows.results, total: countR?.cnt || 0, limit, offset, has_more: offset + limit < (countR?.cnt || 0) });
    }

    // --- Enhanced: Wallet summary ---
    const summaryMatch = path.match(/^\/api\/wallet\/(.+)\/summary$/);
    if (summaryMatch && method === 'GET') {
      const uid = decodeURIComponent(summaryMatch[1]).toLowerCase();
      const w = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(uid).first();
      if (!w) return json({ error: 'Wallet not found' }, 404);
      const rank = await db.prepare('SELECT COUNT(*) as rank FROM rc_wallets WHERE total_earned > ?').bind(w.total_earned).first();
      const recentTx = await db.prepare('SELECT * FROM rc_transactions WHERE from_wallet = ? OR to_wallet = ? ORDER BY created_at DESC LIMIT 10').bind(uid, uid).all();
      const stakes = await db.prepare('SELECT * FROM rc_stakes WHERE wallet_id = ? AND status = ?').bind(uid, 'active').all();
      let nextLevel = null;
      for (const [threshold, name] of LEVELS) { if (w.total_earned < threshold) { nextLevel = { name, threshold, needed: threshold - w.total_earned }; break; } }
      return json({ wallet: w, rank: (rank?.rank || 0) + 1, next_level: nextLevel, recent_transactions: recentTx.results, active_stakes: stakes.results, total_staked: (stakes.results || []).reduce((s, st) => s + st.amount, 0) });
    }

    // --- Enhanced: Supply dashboard ---
    if (path === '/api/supply/dashboard') {
      const supply = await db.prepare('SELECT * FROM rc_supply WHERE id = 1').first();
      if (!supply) return json({ error: 'Supply not initialized' }, 500);
      const walletCount = await db.prepare('SELECT COUNT(*) as cnt FROM rc_wallets').first();
      return json({ total_minted: supply.total_minted, total_burned: supply.total_burned, circulating: supply.total_minted - supply.total_burned, cap: supply.cap, percent_minted: ((supply.total_minted / supply.cap) * 100).toFixed(4), remaining: supply.cap - supply.total_minted, wallets: walletCount?.cnt || 0 });
    }

    // --- Staking ---
    if (path === '/api/stake' && method === 'POST') {
      try {
        const body = await request.json();
        const { wallet_id, amount, duration_days } = body;
        if (!wallet_id || !amount || !duration_days) return json({ error: 'wallet_id, amount, duration_days required' }, 400);
        const w = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(wallet_id.toLowerCase()).first();
        if (!w) return json({ error: 'Wallet not found' }, 404);
        if (w.balance < amount) return json({ error: 'Insufficient balance' }, 400);
        const bonusRate = duration_days >= 365 ? 0.25 : duration_days >= 180 ? 0.15 : duration_days >= 90 ? 0.10 : duration_days >= 30 ? 0.05 : 0.02;
        const id = crypto.randomUUID();
        const unlocks = new Date(Date.now() + duration_days * 86400000).toISOString();
        await db.prepare('UPDATE rc_wallets SET balance = balance - ? WHERE user_id = ?').bind(amount, wallet_id.toLowerCase()).run();
        await db.prepare('INSERT INTO rc_stakes (id, wallet_id, amount, duration_days, unlocks_at, bonus_rate) VALUES (?, ?, ?, ?, ?, ?)').bind(id, wallet_id.toLowerCase(), amount, duration_days, unlocks, bonusRate).run();
        return json({ ok: true, stake: { id, amount, duration_days, bonus_rate: bonusRate, unlocks_at: unlocks } });
      } catch (e) { return json({ error: 'Invalid request' }, 400); }
    }

    const stakesMatch = path.match(/^\/api\/stakes\/(.+)$/);
    if (stakesMatch && method === 'GET') {
      const wid = decodeURIComponent(stakesMatch[1]).toLowerCase();
      const now = new Date().toISOString();
      // Auto-unlock matured stakes
      const matured = await db.prepare("SELECT * FROM rc_stakes WHERE wallet_id = ? AND status = 'active' AND unlocks_at <= ?").bind(wid, now).all();
      for (const s of (matured.results || [])) {
        const bonus = s.amount * s.bonus_rate;
        await db.prepare('UPDATE rc_wallets SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?').bind(s.amount + bonus, bonus, wid).run();
        await db.prepare("UPDATE rc_stakes SET status = 'completed' WHERE id = ?").bind(s.id).run();
        await db.prepare('UPDATE rc_supply SET total_minted = total_minted + ? WHERE id = 1').bind(bonus).run();
        await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), 'STAKE', wid, bonus, 'stake_bonus', `Stake ${s.id} matured`).run();
      }
      const all = await db.prepare('SELECT * FROM rc_stakes WHERE wallet_id = ? ORDER BY started_at DESC').bind(wid).all();
      return json({ stakes: all.results, total: all.results.length });
    }

    // --- Enhanced: Streak System ---
    if (path === '/api/streak' && method === 'GET') {
      const uid = url.searchParams.get('user_id') || '';
      if (!uid) return json({ error: 'user_id required' }, 400);
      try {
        await db.prepare("CREATE TABLE IF NOT EXISTS rc_streaks (user_id TEXT PRIMARY KEY, current_streak INTEGER DEFAULT 0, longest_streak INTEGER DEFAULT 0, last_active TEXT, multiplier REAL DEFAULT 1.0, recovery_rides_used INTEGER DEFAULT 0)").run();
        let streak = await db.prepare('SELECT * FROM rc_streaks WHERE user_id = ?').bind(uid.toLowerCase()).first();
        if (!streak) {
          await db.prepare("INSERT INTO rc_streaks (user_id, current_streak, longest_streak, last_active, multiplier) VALUES (?, 0, 0, datetime('now'), 1.0)").bind(uid.toLowerCase()).run();
          streak = { current_streak: 0, longest_streak: 0, multiplier: 1.0, recovery_rides_used: 0 };
        }
        const mult = streak.current_streak >= 30 ? 2.0 : streak.current_streak >= 14 ? 1.5 : streak.current_streak >= 7 ? 1.25 : streak.current_streak >= 3 ? 1.1 : 1.0;
        return json({ user_id: uid, current_streak: streak.current_streak, longest_streak: streak.longest_streak, multiplier: mult, last_active: streak.last_active, recovery_rides_used: streak.recovery_rides_used, streak_bonuses: [{days:3,bonus:1.1},{days:7,bonus:1.25},{days:14,bonus:1.5},{days:30,bonus:2.0},{days:100,bonus:3.0}] });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    // --- Enhanced: Check in (daily login) ---
    if (path === '/api/checkin' && method === 'POST') {
      try {
        const body = await request.json();
        const uid = (body.user_id || '').toLowerCase();
        if (!uid) return json({ error: 'user_id required' }, 400);
        await db.prepare("CREATE TABLE IF NOT EXISTS rc_streaks (user_id TEXT PRIMARY KEY, current_streak INTEGER DEFAULT 0, longest_streak INTEGER DEFAULT 0, last_active TEXT, multiplier REAL DEFAULT 1.0, recovery_rides_used INTEGER DEFAULT 0)").run();
        let streak = await db.prepare('SELECT * FROM rc_streaks WHERE user_id = ?').bind(uid).first();
        const today = new Date().toISOString().split('T')[0];
        if (!streak) {
          await db.prepare("INSERT INTO rc_streaks (user_id, current_streak, longest_streak, last_active) VALUES (?, 1, 1, ?)").bind(uid, today).run();
          // Earn daily login bonus
          const w = await db.prepare('SELECT id FROM rc_wallets WHERE user_id = ?').bind(uid).first();
          if (w) { await db.prepare('UPDATE rc_wallets SET balance = balance + 1, total_earned = total_earned + 1 WHERE user_id = ?').bind(uid).run(); }
          return json({ ok: true, streak: 1, earned: 1, message: "Welcome! First day on the highway." });
        }
        const lastDate = streak.last_active ? streak.last_active.split('T')[0] : '';
        if (lastDate === today) return json({ ok: true, streak: streak.current_streak, already_checked_in: true });
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreak = lastDate === yesterday ? streak.current_streak + 1 : 1;
        const longest = Math.max(newStreak, streak.longest_streak);
        const mult = newStreak >= 30 ? 2.0 : newStreak >= 14 ? 1.5 : newStreak >= 7 ? 1.25 : newStreak >= 3 ? 1.1 : 1.0;
        const earned = Math.round(1 * mult * 10) / 10;
        await db.prepare("UPDATE rc_streaks SET current_streak = ?, longest_streak = ?, last_active = ?, multiplier = ? WHERE user_id = ?").bind(newStreak, longest, today, mult, uid).run();
        const w = await db.prepare('SELECT id FROM rc_wallets WHERE user_id = ?').bind(uid).first();
        if (w) {
          await db.prepare('UPDATE rc_wallets SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?').bind(earned, earned, uid).run();
          await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), 'SYSTEM', uid, earned, 'daily_checkin', `Day ${newStreak} streak (${mult}x)`).run();
        }
        const streakMsg = newStreak === 7 ? "Week Warrior! 7-day streak!" : newStreak === 30 ? "Monthly Master! 30-day streak!" : newStreak === 100 ? "Century Rider! 100 days!" : newStreak === 365 ? "Year-Round Roadie! 365 days!" : `Day ${newStreak} on the highway.`;
        return json({ ok: true, streak: newStreak, longest, multiplier: mult, earned, message: streakMsg });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    // --- Enhanced: Recovery Ride ---
    if (path === '/api/recovery-ride' && method === 'POST') {
      try {
        const body = await request.json();
        const uid = (body.user_id || '').toLowerCase();
        const rideType = body.type || 'light'; // light=50 ROAD, full=200 ROAD
        if (!uid) return json({ error: 'user_id required' }, 400);
        await db.prepare("CREATE TABLE IF NOT EXISTS rc_streaks (user_id TEXT PRIMARY KEY, current_streak INTEGER DEFAULT 0, longest_streak INTEGER DEFAULT 0, last_active TEXT, multiplier REAL DEFAULT 1.0, recovery_rides_used INTEGER DEFAULT 0)").run();
        const streak = await db.prepare('SELECT * FROM rc_streaks WHERE user_id = ?').bind(uid).first();
        if (!streak || streak.current_streak < 1) return json({ error: 'No active streak to recover' }, 400);
        const cost = rideType === 'full' ? 200 : 50;
        const w = await db.prepare('SELECT * FROM rc_wallets WHERE user_id = ?').bind(uid).first();
        if (!w || w.balance < cost) return json({ error: `Insufficient balance. Recovery Ride costs ${cost} ROAD.` }, 400);
        await db.prepare('UPDATE rc_wallets SET balance = balance - ? WHERE user_id = ?').bind(cost, uid).run();
        await db.prepare('UPDATE rc_supply SET total_burned = total_burned + ? WHERE id = 1').bind(cost).run();
        await db.prepare("UPDATE rc_streaks SET last_active = date('now'), recovery_rides_used = recovery_rides_used + 1 WHERE user_id = ?").bind(uid).run();
        await db.prepare('INSERT INTO rc_transactions (id, from_wallet, to_wallet, amount, type, reason) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), uid, 'BURN', cost, 'recovery_ride', `${rideType} recovery ride`).run();
        return json({ ok: true, type: rideType, cost, streak_protected: streak.current_streak, message: rideType === 'full' ? `Streak of ${streak.current_streak} days fully protected! No catch-up needed.` : `Streak of ${streak.current_streak} days protected. Complete a meaningful action today to confirm.` });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    // --- Enhanced: Daily earning caps ---
    if (path === '/api/caps' && method === 'GET') {
      const uid = url.searchParams.get('user_id') || '';
      if (!uid) return json({ daily_cap: 500, weekly_cap: 2500 });
      try {
        const todayEarned = await db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM rc_transactions WHERE to_wallet = ? AND type != 'transfer' AND type != 'genesis' AND created_at >= date('now')").bind(uid.toLowerCase()).first();
        const weekEarned = await db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM rc_transactions WHERE to_wallet = ? AND type != 'transfer' AND type != 'genesis' AND created_at >= date('now', '-7 days')").bind(uid.toLowerCase()).first();
        return json({ user_id: uid, daily_cap: 500, weekly_cap: 2500, earned_today: todayEarned?.total || 0, earned_this_week: weekEarned?.total || 0, daily_remaining: Math.max(0, 500 - (todayEarned?.total || 0)), weekly_remaining: Math.max(0, 2500 - (weekEarned?.total || 0)) });
      } catch { return json({ daily_cap: 500, weekly_cap: 2500 }); }
    }

    // --- Enhanced: Economy overview ---
    if (path === '/api/economy' && method === 'GET') {
      try {
        const supply = await db.prepare('SELECT * FROM rc_supply WHERE id = 1').first();
        const walletCount = await db.prepare('SELECT COUNT(*) as cnt FROM rc_wallets').first();
        const txCount = await db.prepare('SELECT COUNT(*) as cnt FROM rc_transactions').first();
        const todayTx = await db.prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(amount),0) as vol FROM rc_transactions WHERE created_at >= date('now')").first();
        const stakeCount = await db.prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(amount),0) as locked FROM rc_stakes WHERE status = 'active'").first();
        const streakCount = await db.prepare("SELECT COUNT(*) as cnt, AVG(current_streak) as avg_streak FROM rc_streaks WHERE current_streak > 0").first();
        return json({
          supply: { minted: supply?.total_minted || 0, burned: supply?.total_burned || 0, circulating: (supply?.total_minted || 0) - (supply?.total_burned || 0), cap: supply?.cap || 1000000000 },
          wallets: walletCount?.cnt || 0,
          transactions: { total: txCount?.cnt || 0, today: todayTx?.cnt || 0, today_volume: todayTx?.vol || 0 },
          staking: { active_stakes: stakeCount?.cnt || 0, total_locked: stakeCount?.locked || 0 },
          streaks: { active: streakCount?.cnt || 0, average_length: Math.round(streakCount?.avg_streak || 0) },
        });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    // --- Enhanced: Governance proposals ---
    if (path === '/api/governance/proposals' && method === 'GET') {
      try {
        await db.prepare("CREATE TABLE IF NOT EXISTS rc_proposals (id TEXT PRIMARY KEY, title TEXT, description TEXT, proposer TEXT, type TEXT DEFAULT 'parameter', status TEXT DEFAULT 'active', yes_votes REAL DEFAULT 0, no_votes REAL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), expires_at TEXT)").run();
        const rows = await db.prepare("SELECT * FROM rc_proposals ORDER BY created_at DESC LIMIT 20").all();
        return json({ proposals: rows.results });
      } catch { return json({ proposals: [] }); }
    }
    if (path === '/api/governance/propose' && method === 'POST') {
      try {
        const body = await request.json();
        if (!body.title || !body.proposer) return json({ error: 'title and proposer required' }, 400);
        // Check proposer has minimum 1 ROAD
        const w = await db.prepare('SELECT balance FROM rc_wallets WHERE user_id = ?').bind(body.proposer.toLowerCase()).first();
        if (!w || w.balance < 1) return json({ error: 'Minimum 1 ROAD balance required to propose' }, 400);
        await db.prepare("CREATE TABLE IF NOT EXISTS rc_proposals (id TEXT PRIMARY KEY, title TEXT, description TEXT, proposer TEXT, type TEXT DEFAULT 'parameter', status TEXT DEFAULT 'active', yes_votes REAL DEFAULT 0, no_votes REAL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), expires_at TEXT)").run();
        const id = crypto.randomUUID().slice(0, 12);
        const expires = new Date(Date.now() + 7 * 86400000).toISOString();
        await db.prepare("INSERT INTO rc_proposals (id, title, description, proposer, type, expires_at) VALUES (?, ?, ?, ?, ?, ?)").bind(id, body.title, body.description || '', body.proposer.toLowerCase(), body.type || 'parameter', expires).run();
        return json({ ok: true, id, expires_at: expires });
      } catch (e) { return json({ error: e.message }, 500); }
    }
    if (path === '/api/governance/vote' && method === 'POST') {
      try {
        const body = await request.json();
        if (!body.proposal_id || !body.voter || !body.vote) return json({ error: 'proposal_id, voter, vote required' }, 400);
        const w = await db.prepare('SELECT balance FROM rc_wallets WHERE user_id = ?').bind(body.voter.toLowerCase()).first();
        if (!w) return json({ error: 'Wallet not found' }, 404);
        const weight = Math.min(w.balance, 1000); // Cap vote weight at 1000
        const col = body.vote === 'yes' ? 'yes_votes' : 'no_votes';
        await db.prepare(`UPDATE rc_proposals SET ${col} = ${col} + ? WHERE id = ?`).bind(weight, body.proposal_id).run();
        return json({ ok: true, vote: body.vote, weight });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    // Frontend fallback
    return new Response(renderUI(), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8', ...securityHeaders() },
    });
  },
};
