// Copyright (c) 2026 BlackRoad OS, Inc. All rights reserved.
// RoadCoin — Token economy for the BlackRoad agent fleet.

const AGENTS = {
  roadie: 500, lucidia: 1000, cecilia: 800, octavia: 750, alice: 600,
  gematria: 900, aria: 300, anastasia: 300, echo: 300, phoenix: 300,
  herald: 300, sentinel: 300, compass: 300, chronicle: 300, meridian: 300,
  atlas: 300, cipher: 300, prism: 300, beacon: 300, forge: 300,
  relay: 300, summit: 300, drift: 300, ember: 300, flint: 300,
  harbor: 300, vale: 300,
};

let wallets = new Map();
let transactions = [];
let faucetClaimed = new Set();
let txIdCounter = 1;

function seedState() {
  if (wallets.size > 0) return;
  for (const [name, bal] of Object.entries(AGENTS)) {
    wallets.set(name, bal);
  }
  const now = new Date().toISOString();
  for (const [name, bal] of Object.entries(AGENTS)) {
    transactions.push({ id: txIdCounter++, from: 'GENESIS', to: name, amount: bal, reason: 'Genesis allocation', timestamp: now });
  }
}

function totalSupply() {
  let sum = 0;
  for (const b of wallets.values()) sum += b;
  return sum;
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

function handleHealth() {
  return json({ status: 'ok', service: 'roadcoin', version: '1.0.0', timestamp: new Date().toISOString() });
}

function handleStats() {
  const supply = totalSupply();
  return json({
    totalSupply: supply,
    circulatingSupply: supply,
    totalHolders: wallets.size,
    totalTransactions: transactions.length,
  });
}

function handleWallet(name) {
  const n = name.toLowerCase();
  if (!wallets.has(n)) return json({ error: 'Wallet not found' }, 404);
  const txs = transactions.filter(t => t.from === n || t.to === n).slice(-20);
  return json({ wallet: n, balance: wallets.get(n), transactions: txs });
}

async function handleTransfer(request) {
  const body = await request.json();
  const { from, to, amount, reason } = body;
  const f = (from || '').toLowerCase();
  const t = (to || '').toLowerCase();
  const amt = Number(amount);
  if (!f || !t || !amt || amt <= 0) return json({ error: 'Invalid transfer: from, to, amount (>0) required' }, 400);
  if (f === t) return json({ error: 'Cannot transfer to yourself' }, 400);
  if (!wallets.has(f)) return json({ error: `Sender "${f}" not found` }, 404);
  if ((wallets.get(f) || 0) < amt) return json({ error: 'Insufficient balance' }, 400);
  if (!wallets.has(t)) wallets.set(t, 0);
  wallets.set(f, wallets.get(f) - amt);
  wallets.set(t, wallets.get(t) + amt);
  const tx = { id: txIdCounter++, from: f, to: t, amount: amt, reason: reason || 'Transfer', timestamp: new Date().toISOString() };
  transactions.push(tx);
  return json({ ok: true, transaction: tx, balances: { [f]: wallets.get(f), [t]: wallets.get(t) } });
}

async function handleEarn(request) {
  const body = await request.json();
  const { wallet, amount, reason } = body;
  const w = (wallet || '').toLowerCase();
  const amt = Number(amount);
  if (!w || !amt || amt <= 0) return json({ error: 'Invalid: wallet, amount (>0) required' }, 400);
  if (!wallets.has(w)) wallets.set(w, 0);
  wallets.set(w, wallets.get(w) + amt);
  const tx = { id: txIdCounter++, from: 'MINT', to: w, amount: amt, reason: reason || 'Earned', timestamp: new Date().toISOString() };
  transactions.push(tx);
  return json({ ok: true, transaction: tx, balance: wallets.get(w) });
}

function handleLeaderboard() {
  const sorted = [...wallets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  return json(sorted.map(([name, balance], i) => ({ rank: i + 1, wallet: name, balance })));
}

function handleTransactions() {
  return json(transactions.slice(-50).reverse());
}

async function handleFaucet(request) {
  const body = await request.json();
  const w = (body.wallet || '').toLowerCase();
  if (!w) return json({ error: 'wallet required' }, 400);
  if (faucetClaimed.has(w)) return json({ error: 'Faucet already claimed for this wallet' }, 400);
  faucetClaimed.add(w);
  if (!wallets.has(w)) wallets.set(w, 0);
  wallets.set(w, wallets.get(w) + 100);
  const tx = { id: txIdCounter++, from: 'FAUCET', to: w, amount: 100, reason: 'Faucet claim', timestamp: new Date().toISOString() };
  transactions.push(tx);
  return json({ ok: true, transaction: tx, balance: wallets.get(w) });
}

function renderUI() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RoadCoin | BlackRoad OS</title>
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
</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    seedState();
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // API routes
    if (path === '/api/health') return handleHealth();
    if (path === '/api/stats') return handleStats();
    if (path === '/api/leaderboard') return handleLeaderboard();
    if (path === '/api/transactions') return handleTransactions();

    if (path.startsWith('/api/wallet/')) {
      const name = decodeURIComponent(path.split('/api/wallet/')[1]);
      return handleWallet(name);
    }

    if (path === '/api/transfer' && request.method === 'POST') return handleTransfer(request);
    if (path === '/api/earn' && request.method === 'POST') return handleEarn(request);
    if (path === '/api/faucet' && request.method === 'POST') return handleFaucet(request);

    // Frontend
    return new Response(renderUI(), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8', ...securityHeaders() },
    });
  },
};
