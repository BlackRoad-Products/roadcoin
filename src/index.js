// PROPRIETARY AND CONFIDENTIAL. Copyright 2025-2026 BlackRoad OS, Inc. All rights reserved. NOT open source.
// RoadCoin — The Currency of BlackRoad OS
// PS-SHA∞ secured. D1 persistent. Coinbase connected. Base-ready ERC-20.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

    if (request.method === "OPTIONS")
      return new Response(null, { headers: { ...cors, "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization" } });



    if (url.pathname === "/health") return json({ ok: true, service: "roadcoin", version: "4.0.0", symbol: "ROAD" });

    // ── TOKEN INFO ──
    if (url.pathname === "/api/info") return handleInfo(env);

    // ── WALLET ──
    if (url.pathname === "/api/wallet" && request.method === "GET") return handleWallet(url, env);
    if (url.pathname === "/api/wallet/create" && request.method === "POST") return handleWalletCreate(request, env);

    // ── BALANCE ──
    if (url.pathname === "/api/balance") return handleBalance(url, env);

    // ── TRANSFER ──
    if (url.pathname === "/api/transfer" && request.method === "POST") return handleTransfer(request, env);

    // ── EARN (reward actions) ──
    if (url.pathname === "/api/earn" && request.method === "POST") return handleEarn(request, env);

    // ── SPEND ──
    if (url.pathname === "/api/spend" && request.method === "POST") return handleSpend(request, env);

    // ── STAKE ──
    if (url.pathname === "/api/stake" && request.method === "POST") return handleStake(request, env);
    if (url.pathname === "/api/unstake" && request.method === "POST") return handleUnstake(request, env);

    // ── LEADERBOARD ──
    if (url.pathname === "/api/leaderboard") return handleLeaderboard(env);

    // ── HISTORY ──
    if (url.pathname === "/api/history") return handleHistory(url, env);

    // ── SUPPLY ──
    if (url.pathname === "/api/supply") return handleSupply(env);

    // ── COINBASE BUY ──
    if (url.pathname === "/api/buy" && request.method === "POST") return handleBuy(request, env);

    // ── FAUCET (testnet) ──
    if (url.pathname === "/api/faucet" && request.method === "POST") return handleFaucet(request, env);

    // ── AI ADVISOR: smart fuel advisor ──
    if (url.pathname === "/api/advisor" && request.method === "POST") return handleAdvisor(request, env);

    // ── MARKETPLACE ──
    if (url.pathname === "/api/marketplace" && request.method === "GET") return handleMarketplace(env);
    if (url.pathname === "/api/marketplace/buy" && request.method === "POST") return handleMarketplaceBuy(request, env);

    // ── STREAK: daily bonus ──
    if (url.pathname === "/api/streak" && request.method === "GET") return handleStreak(url, env);

    // ── ENHANCED STAKE: AI-optimized ──
    if (url.pathname === "/api/stake/optimize" && request.method === "POST") return handleStakeOptimize(request, env);

    // ── GOVERNANCE ──
    if (url.pathname === "/api/governance" && request.method === "GET") return handleGovernance(env);
    if (url.pathname === "/api/governance/propose" && request.method === "POST") return handleGovernancePropose(request, env);
    if (url.pathname === "/api/governance/vote" && request.method === "POST") return handleGovernanceVote(request, env);

    // ── PORTFOLIO DASHBOARD ──
    if (url.pathname === "/api/portfolio") return handlePortfolio(url, env);

    // ── REWARDS PROGRAM ──
    if (url.pathname === "/api/rewards" && request.method === "GET") return handleRewardsInfo(env);
    if (url.pathname === "/api/rewards/claim" && request.method === "POST") return handleRewardsClaim(request, env);
    if (url.pathname === "/api/rewards/referral" && request.method === "POST") return handleRewardsReferral(request, env);

    // ── BURN MECHANISM ──
    if (url.pathname === "/api/burn" && request.method === "POST") return handleBurn(request, env);
    if (url.pathname === "/api/burn/history") return handleBurnHistory(url, env);
    if (url.pathname === "/api/burn/total") return handleBurnTotal(env);

    // ── SUBSCRIPTION TIERS ──
    if (url.pathname === "/api/tiers") return handleTiers(env);
    if (url.pathname === "/api/tiers/subscribe" && request.method === "POST") return handleTierSubscribe(request, env);
    if (url.pathname === "/api/tiers/status") return handleTierStatus(url, env);

    // ── AUCTION HOUSE ──
    if (url.pathname === "/api/auctions" && request.method === "GET") return handleAuctionsList(env);
    if (url.pathname === "/api/auctions/create" && request.method === "POST") return handleAuctionCreate(request, env);
    if (url.pathname === "/api/auctions/bid" && request.method === "POST") return handleAuctionBid(request, env);
    if (url.pathname === "/api/auctions/settle" && request.method === "POST") return handleAuctionSettle(request, env);

    // ── GIFT CARDS ──
    if (url.pathname === "/api/gifts/purchase" && request.method === "POST") return handleGiftPurchase(request, env);
    if (url.pathname === "/api/gifts/redeem" && request.method === "POST") return handleGiftRedeem(request, env);
    if (url.pathname === "/api/gifts/check") return handleGiftCheck(url, env);

    // ── EXCHANGE RATES ──
    if (url.pathname === "/api/rates") return handleRates(env);
    if (url.pathname === "/api/rates/history") return handleRatesHistory(env);
    if (url.pathname === "/api/rates/convert") return handleRatesConvert(url, env);

    // ── SAVINGS VAULTS ──
    if (url.pathname === "/api/vaults" && request.method === "GET") return handleVaultsList(url, env);
    if (url.pathname === "/api/vaults/deposit" && request.method === "POST") return handleVaultDeposit(request, env);
    if (url.pathname === "/api/vaults/withdraw" && request.method === "POST") return handleVaultWithdraw(request, env);
    if (url.pathname === "/api/vaults/info") return handleVaultInfo(env);

    // ── LENDING/BORROWING ──
    if (url.pathname === "/api/lend" && request.method === "POST") return handleLend(request, env);
    if (url.pathname === "/api/lend/borrow" && request.method === "POST") return handleBorrow(request, env);
    if (url.pathname === "/api/lend/repay" && request.method === "POST") return handleRepay(request, env);
    if (url.pathname === "/api/lend/positions") return handleLendPositions(url, env);
    if (url.pathname === "/api/lend/pool") return handleLendPool(env);

    // ── LOYALTY PROGRAM ──
    if (url.pathname === "/api/loyalty") return handleLoyalty(url, env);
    if (url.pathname === "/api/loyalty/tiers") return handleLoyaltyTiers(env);
    if (url.pathname === "/api/loyalty/redeem" && request.method === "POST") return handleLoyaltyRedeem(request, env);

    // ── SPLIT PAYMENTS ──
    if (url.pathname === "/api/split" && request.method === "POST") return handleSplit(request, env);
    if (url.pathname === "/api/split/history") return handleSplitHistory(url, env);

    // ── RECURRING PAYMENTS ──
    if (url.pathname === "/api/recurring" && request.method === "POST") return handleRecurringCreate(request, env);
    if (url.pathname === "/api/recurring" && request.method === "GET") return handleRecurringList(url, env);
    if (url.pathname === "/api/recurring/cancel" && request.method === "POST") return handleRecurringCancel(request, env);
    if (url.pathname === "/api/recurring/execute" && request.method === "POST") return handleRecurringExecute(request, env);

    // ── MERCHANT TOOLS ──
    if (url.pathname === "/api/merchant/register" && request.method === "POST") return handleMerchantRegister(request, env);
    if (url.pathname === "/api/merchant" && request.method === "GET") return handleMerchantInfo(url, env);
    if (url.pathname === "/api/merchant/checkout" && request.method === "POST") return handleMerchantCheckout(request, env);
    if (url.pathname === "/api/merchant/settle" && request.method === "POST") return handleMerchantSettle(request, env);
    if (url.pathname === "/api/merchant/report") return handleMerchantReport(url, env);

    // ── TOKEN ANALYTICS ──
    if (url.pathname === "/api/token-analytics") return handleTokenAnalytics(env);
    if (url.pathname === "/api/token-analytics/velocity") return handleTokenVelocity(env);
    if (url.pathname === "/api/token-analytics/whales") return handleWhaleAlerts(env);

    // ── DISPUTE RESOLUTION ──
    if (url.pathname === "/api/disputes" && request.method === "POST") return handleDisputeFile(request, env);
    if (url.pathname === "/api/disputes" && request.method === "GET") return handleDisputeList(url, env);
    if (url.pathname === "/api/disputes/evidence" && request.method === "POST") return handleDisputeEvidence(request, env);
    if (url.pathname === "/api/disputes/resolve" && request.method === "POST") return handleDisputeResolve(request, env);

    // ── MULTI-SIG WALLETS ──
    if (url.pathname === "/api/multisig/create" && request.method === "POST") return handleMultisigCreate(request, env);
    if (url.pathname === "/api/multisig" && request.method === "GET") return handleMultisigInfo(url, env);
    if (url.pathname === "/api/multisig/propose" && request.method === "POST") return handleMultisigPropose(request, env);
    if (url.pathname === "/api/multisig/sign" && request.method === "POST") return handleMultisigSign(request, env);
    if (url.pathname === "/api/multisig/execute" && request.method === "POST") return handleMultisigExecute(request, env);

    // UI
    return new Response(HTML, { headers: { "Content-Type": "text/html;charset=UTF-8", "Content-Security-Policy": "frame-ancestors 'self' https://blackroad.io https://*.blackroad.io" } });
  }
};

// ── DB ──
let dbReady = false;
async function ensureTables(db) {
  if (dbReady) return;
  dbReady = true;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS wallets (
      road_id TEXT PRIMARY KEY,
      balance REAL DEFAULT 0,
      staked REAL DEFAULT 0,
      total_earned REAL DEFAULT 0,
      total_spent REAL DEFAULT 0,
      total_staked REAL DEFAULT 0,
      level INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      from_id TEXT,
      to_id TEXT,
      amount REAL NOT NULL,
      memo TEXT,
      hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`)
  ]);
}

async function ensureExtendedTables(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS burns (
      id TEXT PRIMARY KEY,
      road_id TEXT NOT NULL,
      amount REAL NOT NULL,
      reason TEXT,
      hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS subscriptions (
      road_id TEXT PRIMARY KEY,
      tier TEXT NOT NULL DEFAULT 'free',
      earning_multiplier REAL DEFAULT 1.0,
      started_at TEXT NOT NULL,
      expires_at TEXT,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS auctions (
      id TEXT PRIMARY KEY,
      seller_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'digital',
      min_bid REAL DEFAULT 1,
      current_bid REAL DEFAULT 0,
      current_bidder TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      ends_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS auction_bids (
      id TEXT PRIMARY KEY,
      auction_id TEXT NOT NULL,
      bidder_id TEXT NOT NULL,
      amount REAL NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS gift_cards (
      code TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      from_id TEXT NOT NULL,
      to_id TEXT,
      message TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      redeemed_at TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS vaults (
      id TEXT PRIMARY KEY,
      road_id TEXT NOT NULL,
      amount REAL NOT NULL,
      vault_type TEXT NOT NULL,
      apy REAL NOT NULL,
      locked_until TEXT NOT NULL,
      status TEXT DEFAULT 'locked',
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS rewards_log (
      id TEXT PRIMARY KEY,
      road_id TEXT NOT NULL,
      reward_type TEXT NOT NULL,
      amount REAL NOT NULL,
      streak_day INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS exchange_rates (
      id TEXT PRIMARY KEY,
      rate_usd REAL NOT NULL,
      volume_24h REAL DEFAULT 0,
      market_cap REAL DEFAULT 0,
      recorded_at TEXT NOT NULL
    )`)
  ]);
}

// ── PS-SHA∞ ──
async function pssha(data, depth) {
  let h = data;
  for (let i = 0; i < depth; i++) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(h));
    h = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return h;
}

// ── TOKEN INFO ──
async function handleInfo(env) {
  await ensureTables(env.DB);
  const stats = await env.DB.prepare("SELECT COUNT(*) as holders, SUM(balance) as circulating, SUM(staked) as staked FROM wallets").first();
  return json({
    name: "RoadCoin", symbol: "ROAD", network: "BlackRoad OS + Base L2",
    total_supply: 1_000_000_000,
    circulating: stats?.circulating || 0,
    staked: stats?.staked || 0,
    holders: stats?.holders || 0,
    hash_algorithm: "PS-SHA∞ (adaptive depth: 3-7)",
    blockchain: "RoadChain (D1 persistent) + Base ERC-20 (coming)",
    earn: { "tutor.solve": 1, "social.post": 0.5, "chat.message": 0.1, "search.query": 0.05, "canvas.create": 1, "video.upload": 5, "cadence.track": 2, "game.score": 0.2, "referral": 50, "node.hosting": 10 },
    spend: { "premium_inference": 1, "custom_agent": 10, "extended_memory": 5, "priority_queue": 2, "white_label": 100 },
    features: ["portfolio", "rewards", "burn", "tiers", "auctions", "gifts", "rates", "vaults", "lending", "loyalty", "split-payments", "recurring", "merchant", "token-analytics", "disputes", "multisig"]
  });
}

// ── WALLET ──
async function handleWallet(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  const w = await env.DB.prepare("SELECT * FROM wallets WHERE road_id = ?").bind(roadId).first();
  if (!w) return json({ road_id: roadId, balance: 0, staked: 0, level: 0, exists: false });
  const level = Math.floor(Math.log2((w.total_earned || 0) + 1)) + 1;
  return json({ ...w, level, exists: true });
}

async function handleWalletCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  const now = new Date().toISOString();
  // Give 10 ROAD welcome bonus
  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, 10, 0, 10, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO NOTHING"
  ).bind(body.road_id, now, now).run();
  await logTx(env.DB, "welcome_bonus", "system", body.road_id, 10, "Welcome to RoadCoin!");
  // Log to RoadChain
  await logToRoadChain(env, "mint", "roadcoin", body.road_id, 10, { reason: "welcome_bonus" });
  return json({ road_id: body.road_id, balance: 10, message: "Wallet created! 10 ROAD welcome bonus." });
}

// ── BALANCE ──
async function handleBalance(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  const w = await env.DB.prepare("SELECT balance, staked FROM wallets WHERE road_id = ?").bind(roadId).first();
  return json({ road_id: roadId, balance: w?.balance || 0, staked: w?.staked || 0, total: (w?.balance || 0) + (w?.staked || 0) });
}

// ── TRANSFER ──
async function handleTransfer(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.from || !body?.to || !body?.amount) return json({ error: "Missing from, to, or amount" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);
  await ensureTables(env.DB);

  const sender = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.from).first();
  if (!sender || sender.balance < body.amount) return json({ error: "Insufficient balance" }, 400);

  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?").bind(body.amount, body.amount, now, body.from),
    env.DB.prepare("INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?").bind(body.to, body.amount, body.amount, now, now, body.amount, body.amount, now),
  ]);

  await logTx(env.DB, "transfer", body.from, body.to, body.amount, body.memo || "Transfer");
  await logToRoadChain(env, "transfer", "roadcoin", body.from, body.amount, { from: body.from, to: body.to, memo: body.memo });
  return json({ success: true, from: body.from, to: body.to, amount: body.amount });
}

// ── EARN ──
async function handleEarn(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.action) return json({ error: "Missing road_id or action" }, 400);
  await ensureTables(env.DB);

  const rewards = { "tutor.solve": 1, "social.post": 0.5, "chat.message": 0.1, "search.query": 0.05, "canvas.create": 1, "video.upload": 5, "cadence.track": 2, "game.score": 0.2, "referral": 50, "node.hosting": 10, "agent.task": 0.5 };
  let amount = rewards[body.action] || 0.01;

  // Apply tier multiplier if subscribed
  try {
    await ensureExtendedTables(env.DB);
    const sub = await env.DB.prepare("SELECT earning_multiplier, expires_at FROM subscriptions WHERE road_id = ?").bind(body.road_id).first();
    if (sub && (!sub.expires_at || new Date(sub.expires_at) > new Date())) {
      amount = amount * (sub.earning_multiplier || 1.0);
    }
  } catch {}

  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
  ).bind(body.road_id, amount, amount, now, now, amount, amount, now).run();

  await logTx(env.DB, "earn", "system", body.road_id, amount, body.action);
  await logToRoadChain(env, "earn", "roadcoin", body.road_id, amount, { action: body.action });
  return json({ road_id: body.road_id, earned: amount, action: body.action });
}

// ── SPEND ──
async function handleSpend(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount || !body?.item) return json({ error: "Missing road_id, amount, or item" }, 400);
  await ensureTables(env.DB);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance" }, 400);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?").bind(body.amount, body.amount, now, body.road_id).run();

  await logTx(env.DB, "spend", body.road_id, "system", body.amount, body.item);
  await logToRoadChain(env, "spend", "roadcoin", body.road_id, body.amount, { item: body.item });
  return json({ success: true, spent: body.amount, item: body.item });
}

// ── STAKE ──
async function handleStake(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount) return json({ error: "Missing road_id or amount" }, 400);
  await ensureTables(env.DB);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance" }, 400);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, staked = staked + ?, total_staked = total_staked + ?, updated_at = ? WHERE road_id = ?").bind(body.amount, body.amount, body.amount, now, body.road_id).run();

  await logTx(env.DB, "stake", body.road_id, "staking_pool", body.amount, "Staked ROAD");
  await logToRoadChain(env, "stake", "roadcoin", body.road_id, body.amount, { action: "stake" });
  return json({ success: true, staked: body.amount });
}

async function handleUnstake(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount) return json({ error: "Missing road_id or amount" }, 400);
  await ensureTables(env.DB);

  const w = await env.DB.prepare("SELECT staked FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.staked < body.amount) return json({ error: "Insufficient staked balance" }, 400);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE wallets SET balance = balance + ?, staked = staked - ?, updated_at = ? WHERE road_id = ?").bind(body.amount, body.amount, now, body.road_id).run();

  await logTx(env.DB, "unstake", "staking_pool", body.road_id, body.amount, "Unstaked ROAD");
  return json({ success: true, unstaked: body.amount });
}

// ── LEADERBOARD ──
async function handleLeaderboard(env) {
  await ensureTables(env.DB);
  const top = await env.DB.prepare("SELECT road_id, balance, staked, total_earned, total_spent FROM wallets ORDER BY total_earned DESC LIMIT 25").all();
  return json({ leaderboard: top.results.map((w, i) => ({ rank: i + 1, ...w, level: Math.floor(Math.log2((w.total_earned || 0) + 1)) + 1 })) });
}

// ── HISTORY ──
async function handleHistory(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  const txs = await env.DB.prepare("SELECT * FROM transactions WHERE from_id = ? OR to_id = ? ORDER BY created_at DESC LIMIT 50").bind(roadId, roadId).all();
  return json({ road_id: roadId, transactions: txs.results });
}

// ── SUPPLY ──
async function handleSupply(env) {
  await ensureTables(env.DB);
  const stats = await env.DB.prepare("SELECT SUM(balance) as circulating, SUM(staked) as staked, COUNT(*) as holders FROM wallets").first();
  let totalBurned = 0;
  try {
    await ensureExtendedTables(env.DB);
    const burnStats = await env.DB.prepare("SELECT SUM(amount) as total_burned FROM burns").first();
    totalBurned = burnStats?.total_burned || 0;
  } catch {}
  return json({
    total_supply: 1_000_000_000,
    circulating: stats?.circulating || 0,
    staked: stats?.staked || 0,
    burned: totalBurned,
    holders: stats?.holders || 0,
    treasury: 1_000_000_000 - (stats?.circulating || 0) - (stats?.staked || 0) - totalBurned
  });
}

// ── BUY via Coinbase ──
async function handleBuy(request, env) {
  if (!env.COINBASE_API_KEY) return json({ error: "Coinbase not configured" }, 500);
  const body = await request.json().catch(() => null);
  const amount = body?.amount || "10.00";
  const roadId = body?.road_id || "anonymous";

  const charge = await fetch("https://api.commerce.coinbase.com/charges", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CC-Api-Key": env.COINBASE_API_KEY, "X-CC-Version": "2018-03-22" },
    body: JSON.stringify({
      name: `${amount} RoadCoin`,
      description: `Purchase ${amount} ROAD on BlackRoad OS`,
      pricing_type: "fixed_price",
      local_price: { amount, currency: "USD" },
      metadata: { road_id: roadId, token: "ROAD" },
    }),
  });

  if (!charge.ok) return json({ error: "Coinbase failed", detail: await charge.text() }, 500);
  const data = await charge.json();
  return json({ hosted_url: data.data.hosted_url, charge_id: data.data.id, road_amount: parseFloat(amount) });
}

// ── FAUCET (for testing) ──
async function handleFaucet(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  const now = new Date().toISOString();

  // Check if user already exists (already claimed faucet)
  const existing = await env.DB.prepare("SELECT road_id, balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (existing) {
    return json({ road_id: body.road_id, received: 0, message: "Faucet already claimed. One per user.", balance: existing.balance }, 200);
  }

  // New user — give 100 ROAD (INSERT only, no UPDATE on conflict)
  try {
    await env.DB.prepare(
      "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, 100, 0, 100, 0, 0, 1, ?, ?)"
    ).bind(body.road_id, now, now).run();
  } catch (e) {
    // Race condition: another request already inserted — return existing
    const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
    return json({ road_id: body.road_id, received: 0, message: "Faucet already claimed.", balance: w?.balance || 0 }, 200);
  }

  await logTx(env.DB, "faucet", "system", body.road_id, 100, "Testnet faucet drip");
  return json({ road_id: body.road_id, received: 100, message: "100 ROAD from the faucet!" });
}

// ── AI ADVISOR: Gematria analyzes spending patterns ──
async function handleAdvisor(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);

  const wallet = await env.DB.prepare("SELECT * FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!wallet) return json({ error: "Wallet not found. Create one first." }, 404);

  const txs = await env.DB.prepare("SELECT type, amount, memo, created_at FROM transactions WHERE from_id = ? OR to_id = ? ORDER BY created_at DESC LIMIT 20").bind(body.road_id, body.road_id).all();
  const txSummary = txs.results.map(t => `${t.type}: ${t.amount} ROAD (${t.memo})`).join("; ");

  try {
    const r = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You are Gematria, the pattern-finder of BlackRoad OS. Your phrase: 'The pattern is there.' Analyze a user's RoadCoin wallet and spending history. Give 2-3 specific, actionable recommendations. Be concise." },
        { role: "user", content: `Wallet: ${wallet.balance} ROAD available, ${wallet.staked} staked, ${wallet.total_earned} lifetime earned, ${wallet.total_spent} spent. Level: ${Math.floor(Math.log2((wallet.total_earned || 0) + 1)) + 1}. Recent transactions: ${txSummary || "None yet."}` }
      ], max_tokens: 250
    });
    return json({ road_id: body.road_id, balance: wallet.balance, staked: wallet.staked, advice: r?.response || "Keep earning and staking. The pattern is there.", agent: "Gematria" });
  } catch {
    return json({ road_id: body.road_id, balance: wallet.balance, staked: wallet.staked, advice: "Stake at least 20% of your balance for passive rewards. Keep earning through app activity. The pattern is there.", agent: "Gematria" });
  }
}

// ── MARKETPLACE: categories of purchasable items ──
async function handleMarketplace(env) {
  const items = [
    { id: "compute_boost", category: "Compute Boosts", name: "Priority Inference", description: "Skip the queue for AI requests", price: 2, duration: "1 hour" },
    { id: "compute_turbo", category: "Compute Boosts", name: "Turbo Mode", description: "2x faster inference for all apps", price: 5, duration: "24 hours" },
    { id: "agent_unlock_custom", category: "Agent Unlocks", name: "Custom Agent", description: "Create a personalized AI agent", price: 10, duration: "permanent" },
    { id: "agent_unlock_fleet", category: "Agent Unlocks", name: "Fleet Access", description: "Direct access to all 17 fleet agents", price: 25, duration: "30 days" },
    { id: "reach_boost", category: "Reach Boosts", name: "Social Amplify", description: "Boost your posts on BackRoad Social", price: 3, duration: "per post" },
    { id: "reach_featured", category: "Reach Boosts", name: "Featured Creator", description: "Highlighted in discovery feeds", price: 15, duration: "7 days" },
    { id: "custom_theme", category: "Customization", name: "Custom Theme", description: "Personalized color scheme across all apps", price: 5, duration: "permanent" },
    { id: "custom_domain", category: "Customization", name: "Custom Subdomain", description: "yourname.blackroad.io", price: 50, duration: "1 year" },
    { id: "staking_pool", category: "Staking", name: "Staking Pool Entry", description: "Join the community staking pool for shared rewards", price: 100, duration: "90 days" },
  ];
  return json({ marketplace: items, categories: ["Compute Boosts", "Agent Unlocks", "Reach Boosts", "Customization", "Staking"] });
}

// ── MARKETPLACE BUY: purchase an item ──
async function handleMarketplaceBuy(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.item_id) return json({ error: "Missing road_id or item_id" }, 400);
  await ensureTables(env.DB);

  const prices = { compute_boost: 2, compute_turbo: 5, agent_unlock_custom: 10, agent_unlock_fleet: 25, reach_boost: 3, reach_featured: 15, custom_theme: 5, custom_domain: 50, staking_pool: 100 };
  const price = prices[body.item_id];
  if (!price) return json({ error: "Invalid item_id" }, 400);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < price) return json({ error: "Insufficient balance", required: price, balance: w?.balance || 0 }, 400);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?").bind(price, price, now, body.road_id).run();
  await logTx(env.DB, "marketplace", body.road_id, "marketplace", price, body.item_id);
  await logToRoadChain(env, "marketplace_buy", "roadcoin", body.road_id, price, { item: body.item_id });
  return json({ success: true, item_id: body.item_id, spent: price, remaining_balance: (w.balance - price) });
}

// ── STREAK: daily fuel bonus ──
async function handleStreak(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);

  const txs = await env.DB.prepare("SELECT created_at FROM transactions WHERE to_id = ? AND type = 'earn' ORDER BY created_at DESC LIMIT 30").bind(roadId).all();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set();
  for (const tx of txs.results) {
    const day = tx.created_at?.slice(0, 10);
    if (day && !seen.has(day)) seen.add(day);
  }
  const sorted = [...seen].sort().reverse();
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (sorted[i] === expected) streak++;
    else break;
  }

  const multiplier = Math.min(1 + streak * 0.1, 3.0);
  const baseBonus = 1;
  const nextBonus = (baseBonus * multiplier).toFixed(2);
  return json({ road_id: roadId, current_streak: streak, multiplier: multiplier.toFixed(1), next_bonus: parseFloat(nextBonus), max_multiplier: "3.0x", message: streak > 0 ? `${streak}-day streak! ${multiplier.toFixed(1)}x multiplier active.` : "Start your streak by earning ROAD today!" });
}

// ── STAKE OPTIMIZE: AI calculates optimal staking amount ──
async function handleStakeOptimize(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);

  const w = await env.DB.prepare("SELECT * FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w) return json({ error: "Wallet not found" }, 404);

  const goal = body.goal || "balanced";
  let recommended;
  if (goal === "aggressive") recommended = Math.floor(w.balance * 0.7);
  else if (goal === "conservative") recommended = Math.floor(w.balance * 0.2);
  else recommended = Math.floor(w.balance * 0.4);

  const apy = 12;
  const projectedReward = ((recommended * apy) / 100 / 365 * 90).toFixed(2);

  return json({ road_id: body.road_id, balance: w.balance, currently_staked: w.staked, goal, recommended_stake: recommended, projected_90day_reward: parseFloat(projectedReward), apy_percent: apy, advice: `For a ${goal} strategy, stake ${recommended} ROAD. Projected 90-day reward: ${projectedReward} ROAD at ${apy}% APY.` });
}

// ── GOVERNANCE: list active proposals ──
async function handleGovernance(env) {
  await ensureTables(env.DB);
  // Ensure governance tables
  try {
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS governance_proposals (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, options TEXT DEFAULT '[]', proposer TEXT, total_votes REAL DEFAULT 0, status TEXT DEFAULT 'active', created_at TEXT NOT NULL, closes_at TEXT)`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS governance_votes (id TEXT PRIMARY KEY, proposal_id TEXT NOT NULL, road_id TEXT NOT NULL, option_idx INTEGER, amount REAL, created_at TEXT NOT NULL)`)
    ]);
  } catch {}
  const proposals = await env.DB.prepare("SELECT * FROM governance_proposals WHERE status = 'active' ORDER BY created_at DESC LIMIT 20").all();
  return json({ proposals: proposals.results || [], count: proposals.results?.length || 0 });
}

// ── GOVERNANCE PROPOSE: Cicero creates a proposal ──
async function handleGovernancePropose(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.description) return json({ error: "Missing title or description" }, 400);
  await ensureTables(env.DB);
  try {
    await env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS governance_proposals (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, options TEXT DEFAULT '[]', proposer TEXT, total_votes REAL DEFAULT 0, status TEXT DEFAULT 'active', created_at TEXT NOT NULL, closes_at TEXT)`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS governance_votes (id TEXT PRIMARY KEY, proposal_id TEXT NOT NULL, road_id TEXT NOT NULL, option_idx INTEGER, amount REAL, created_at TEXT NOT NULL)`)
    ]);
  } catch {}

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const closes = new Date(Date.now() + 7 * 86400000).toISOString();
  const options = body.options?.length ? body.options : ["For", "Against", "Abstain"];

  let aiSummary = "";
  try {
    const r = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You are Cicero, the voice of governance in BlackRoad OS. Summarize governance proposals in one clear, balanced sentence. Be neutral and fair." },
        { role: "user", content: `Proposal: ${body.title}. Description: ${body.description}. Options: ${options.join(", ")}` }
      ], max_tokens: 100
    });
    aiSummary = r?.response || "";
  } catch {}

  await env.DB.prepare("INSERT INTO governance_proposals (id, title, description, options, proposer, status, created_at, closes_at) VALUES (?,?,?,?,?,?,?,?)").bind(id, body.title, body.description, JSON.stringify(options), body.road_id || "anonymous", "active", now, closes).run();
  await logToRoadChain(env, "governance_propose", "roadcoin", body.road_id || "anonymous", 0, { proposal_id: id, title: body.title });
  return json({ id, title: body.title, options, closes_at: closes, summary: aiSummary, agent: "Cicero" });
}

// ── GOVERNANCE VOTE: vote on a proposal ──
async function handleGovernanceVote(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.proposal_id || body?.option === undefined || !body?.road_id) return json({ error: "Missing proposal_id, option, or road_id" }, 400);
  await ensureTables(env.DB);
  try {
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS governance_votes (id TEXT PRIMARY KEY, proposal_id TEXT NOT NULL, road_id TEXT NOT NULL, option_idx INTEGER, amount REAL, created_at TEXT NOT NULL)`).run();
  } catch {}

  const existing = await env.DB.prepare("SELECT id FROM governance_votes WHERE proposal_id = ? AND road_id = ?").bind(body.proposal_id, body.road_id).first();
  if (existing) return json({ error: "Already voted on this proposal" }, 400);

  const w = await env.DB.prepare("SELECT staked FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  const voteWeight = body.amount || w?.staked || 1;

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO governance_votes (id, proposal_id, road_id, option_idx, amount, created_at) VALUES (?,?,?,?,?,?)").bind(id, body.proposal_id, body.road_id, body.option, voteWeight, now).run();
  await env.DB.prepare("UPDATE governance_proposals SET total_votes = total_votes + ? WHERE id = ?").bind(voteWeight, body.proposal_id).run();
  return json({ success: true, proposal_id: body.proposal_id, option: body.option, weight: voteWeight });
}

// ══════════════════════════════════════════════════════════════════
// NEW FEATURES v3.0
// ══════════════════════════════════════════════════════════════════

// ── PORTFOLIO DASHBOARD ──
async function handlePortfolio(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const w = await env.DB.prepare("SELECT * FROM wallets WHERE road_id = ?").bind(roadId).first();
  if (!w) return json({ error: "Wallet not found" }, 404);

  // Holdings breakdown
  const level = Math.floor(Math.log2((w.total_earned || 0) + 1)) + 1;
  const holdings = {
    available: w.balance || 0,
    staked: w.staked || 0,
    total: (w.balance || 0) + (w.staked || 0)
  };

  // Vault holdings
  let vaultTotal = 0;
  try {
    const vaultStats = await env.DB.prepare("SELECT SUM(amount) as locked FROM vaults WHERE road_id = ? AND status = 'locked'").bind(roadId).first();
    vaultTotal = vaultStats?.locked || 0;
    holdings.vaulted = vaultTotal;
    holdings.total += vaultTotal;
  } catch {}

  // Earnings over time (last 30 days grouped by day)
  const earningsRaw = await env.DB.prepare(
    "SELECT substr(created_at,1,10) as day, SUM(amount) as earned FROM transactions WHERE to_id = ? AND type IN ('earn','welcome_bonus','faucet','reward') GROUP BY substr(created_at,1,10) ORDER BY day DESC LIMIT 30"
  ).bind(roadId).all();
  const earnings_by_day = (earningsRaw.results || []).reverse();

  // Spending breakdown by category (memo field)
  const spendingRaw = await env.DB.prepare(
    "SELECT memo as category, SUM(amount) as total, COUNT(*) as count FROM transactions WHERE from_id = ? AND type IN ('spend','marketplace','burn','subscription','auction_bid','gift_purchase') GROUP BY memo ORDER BY total DESC LIMIT 20"
  ).bind(roadId).all();
  const spending_breakdown = spendingRaw.results || [];

  // Transaction summary
  const txCounts = await env.DB.prepare(
    "SELECT type, COUNT(*) as count, SUM(amount) as total FROM transactions WHERE from_id = ? OR to_id = ? GROUP BY type"
  ).bind(roadId, roadId).all();

  // Current rate
  const rate = getCurrentRate();

  return json({
    road_id: roadId,
    level,
    holdings,
    usd_value: (holdings.total * rate).toFixed(2),
    rate_usd: rate,
    total_earned: w.total_earned || 0,
    total_spent: w.total_spent || 0,
    net_flow: (w.total_earned || 0) - (w.total_spent || 0),
    earnings_by_day,
    spending_breakdown,
    transaction_summary: txCounts.results || [],
    member_since: w.created_at
  });
}

// ── REWARDS PROGRAM ──
async function handleRewardsInfo(env) {
  const rewards = {
    daily_login: { base: 1, description: "Log in daily to claim ROAD" },
    streak_bonuses: [
      { days: 3, bonus: 2, label: "3-Day Streak" },
      { days: 7, bonus: 5, label: "Week Warrior" },
      { days: 14, bonus: 15, label: "Two-Week Champion" },
      { days: 30, bonus: 50, label: "Monthly Master" },
      { days: 100, bonus: 200, label: "Century Rider" },
      { days: 365, bonus: 1000, label: "Year-Round Roadie" }
    ],
    referral: { base: 50, referee_bonus: 25, description: "Both you and your referral earn ROAD" },
    achievements: [
      { id: "first_stake", name: "First Stake", multiplier: 1.1, description: "Stake any amount for the first time" },
      { id: "big_earner", name: "Big Earner", multiplier: 1.25, description: "Earn 1000+ ROAD lifetime" },
      { id: "diamond_hands", name: "Diamond Hands", multiplier: 1.5, description: "Stake 500+ ROAD for 30+ days" },
      { id: "burn_master", name: "Burn Master", multiplier: 1.2, description: "Burn 100+ ROAD total" },
      { id: "vault_lord", name: "Vault Lord", multiplier: 1.3, description: "Lock 1000+ ROAD in vaults" },
      { id: "auction_whale", name: "Auction Whale", multiplier: 1.15, description: "Win 10+ auctions" },
      { id: "generous_gifter", name: "Generous Gifter", multiplier: 1.1, description: "Send 5+ gift cards" }
    ],
    tier_multipliers: {
      free: 1.0,
      pro: 1.5,
      enterprise: 2.0
    }
  };
  return json(rewards);
}

async function handleRewardsClaim(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  // Check if already claimed today
  const alreadyClaimed = await env.DB.prepare(
    "SELECT id FROM rewards_log WHERE road_id = ? AND reward_type = 'daily_login' AND substr(created_at,1,10) = ?"
  ).bind(body.road_id, today).first();
  if (alreadyClaimed) return json({ error: "Already claimed daily reward today", next_claim: "tomorrow" }, 400);

  // Calculate streak
  const recentClaims = await env.DB.prepare(
    "SELECT DISTINCT substr(created_at,1,10) as day FROM rewards_log WHERE road_id = ? AND reward_type = 'daily_login' ORDER BY day DESC LIMIT 365"
  ).bind(body.road_id).all();

  let streak = 0;
  const days = (recentClaims.results || []).map(r => r.day);
  for (let i = 0; i < days.length; i++) {
    const expected = new Date(Date.now() - (i + 1) * 86400000).toISOString().slice(0, 10);
    if (days[i] === expected) streak++;
    else break;
  }
  streak += 1; // Include today

  // Calculate reward
  let reward = 1; // base daily
  // Streak milestone bonuses
  const milestones = { 3: 2, 7: 5, 14: 15, 30: 50, 100: 200, 365: 1000 };
  let milestoneHit = null;
  if (milestones[streak]) {
    reward += milestones[streak];
    milestoneHit = streak;
  }

  // Streak multiplier (0.1 per day, max 3x)
  const multiplier = Math.min(1 + (streak - 1) * 0.1, 3.0);
  reward = Math.round(reward * multiplier * 100) / 100;

  // Apply tier multiplier
  let tierMult = 1.0;
  try {
    const sub = await env.DB.prepare("SELECT earning_multiplier FROM subscriptions WHERE road_id = ?").bind(body.road_id).first();
    if (sub) tierMult = sub.earning_multiplier || 1.0;
  } catch {}
  reward = Math.round(reward * tierMult * 100) / 100;

  // Credit the wallet
  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
  ).bind(body.road_id, reward, reward, now, now, reward, reward, now).run();

  // Log the reward
  await env.DB.prepare(
    "INSERT INTO rewards_log (id, road_id, reward_type, amount, streak_day, created_at) VALUES (?,?,?,?,?,?)"
  ).bind(crypto.randomUUID(), body.road_id, "daily_login", reward, streak, now).run();

  await logTx(env.DB, "reward", "system", body.road_id, reward, `daily_login_day_${streak}`);
  await logToRoadChain(env, "reward", "roadcoin", body.road_id, reward, { type: "daily_login", streak, milestone: milestoneHit });

  return json({
    road_id: body.road_id,
    reward,
    streak,
    multiplier: multiplier.toFixed(1),
    tier_multiplier: tierMult,
    milestone_hit: milestoneHit,
    message: milestoneHit
      ? `${streak}-day streak! Milestone bonus! You earned ${reward} ROAD!`
      : `Day ${streak} streak! You earned ${reward} ROAD.`
  });
}

async function handleRewardsReferral(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.referrer_id || !body?.referee_id) return json({ error: "Missing referrer_id or referee_id" }, 400);
  if (body.referrer_id === body.referee_id) return json({ error: "Cannot refer yourself" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const now = new Date().toISOString();

  // Check if referee already has a wallet (not a new user)
  const existingReferee = await env.DB.prepare("SELECT road_id FROM wallets WHERE road_id = ?").bind(body.referee_id).first();
  if (existingReferee) return json({ error: "Referee already has an account" }, 400);

  // Check if referrer already referred this user
  const existingRef = await env.DB.prepare(
    "SELECT id FROM rewards_log WHERE road_id = ? AND reward_type = 'referral' AND created_at LIKE ?"
  ).bind(body.referrer_id, `%${body.referee_id}%`).first();
  if (existingRef) return json({ error: "Already referred this user" }, 400);

  // Reward referrer (50 ROAD)
  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, 50, 0, 50, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + 50, total_earned = total_earned + 50, updated_at = ?"
  ).bind(body.referrer_id, now, now, now).run();

  // Create referee wallet with bonus (10 welcome + 25 referral bonus)
  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, 35, 0, 35, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO NOTHING"
  ).bind(body.referee_id, now, now).run();

  // Log rewards
  await env.DB.prepare(
    "INSERT INTO rewards_log (id, road_id, reward_type, amount, created_at) VALUES (?,?,?,?,?)"
  ).bind(crypto.randomUUID(), body.referrer_id, "referral", 50, now).run();

  await logTx(env.DB, "reward", "system", body.referrer_id, 50, `referral:${body.referee_id}`);
  await logTx(env.DB, "welcome_bonus", "system", body.referee_id, 35, `referred_by:${body.referrer_id}`);

  return json({
    success: true,
    referrer: { road_id: body.referrer_id, earned: 50 },
    referee: { road_id: body.referee_id, earned: 35 },
    message: "Referral successful! Both users rewarded."
  });
}

// ── BURN MECHANISM ──
async function handleBurn(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount) return json({ error: "Missing road_id or amount" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance", balance: w?.balance || 0 }, 400);

  const now = new Date().toISOString();
  const burnHash = await pssha(JSON.stringify({ road_id: body.road_id, amount: body.amount, ts: now, reason: body.reason || "voluntary_burn" }), 7);

  // Deduct from wallet
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?")
    .bind(body.amount, body.amount, now, body.road_id).run();

  // Record the burn
  await env.DB.prepare("INSERT INTO burns (id, road_id, amount, reason, hash, created_at) VALUES (?,?,?,?,?,?)")
    .bind(crypto.randomUUID(), body.road_id, body.amount, body.reason || "voluntary_burn", burnHash, now).run();

  await logTx(env.DB, "burn", body.road_id, "burn_address", body.amount, body.reason || "voluntary_burn");
  await logToRoadChain(env, "burn", "roadcoin", body.road_id, body.amount, { reason: body.reason || "voluntary_burn", hash: burnHash });

  // Get total burned
  const totalBurned = await env.DB.prepare("SELECT SUM(amount) as total FROM burns").first();

  return json({
    success: true,
    road_id: body.road_id,
    burned: body.amount,
    burn_hash: burnHash,
    reason: body.reason || "voluntary_burn",
    total_burned_network: totalBurned?.total || body.amount,
    message: `${body.amount} ROAD permanently burned. Deflationary forever.`
  });
}

async function handleBurnHistory(url, env) {
  const roadId = url.searchParams.get("road_id");
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  if (roadId) {
    const burns = await env.DB.prepare("SELECT * FROM burns WHERE road_id = ? ORDER BY created_at DESC LIMIT 50").bind(roadId).all();
    const total = await env.DB.prepare("SELECT SUM(amount) as total, COUNT(*) as count FROM burns WHERE road_id = ?").bind(roadId).first();
    return json({ road_id: roadId, burns: burns.results || [], total_burned: total?.total || 0, burn_count: total?.count || 0 });
  }

  // Global burn history
  const burns = await env.DB.prepare("SELECT * FROM burns ORDER BY created_at DESC LIMIT 50").all();
  const total = await env.DB.prepare("SELECT SUM(amount) as total, COUNT(*) as count FROM burns").first();
  return json({ burns: burns.results || [], total_burned: total?.total || 0, burn_count: total?.count || 0 });
}

async function handleBurnTotal(env) {
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const stats = await env.DB.prepare("SELECT SUM(amount) as total_burned, COUNT(*) as burn_count, COUNT(DISTINCT road_id) as unique_burners FROM burns").first();
  const supply = await env.DB.prepare("SELECT SUM(balance) as circulating, SUM(staked) as staked FROM wallets").first();
  const totalBurned = stats?.total_burned || 0;

  return json({
    total_burned: totalBurned,
    burn_count: stats?.burn_count || 0,
    unique_burners: stats?.unique_burners || 0,
    effective_supply: 1_000_000_000 - totalBurned,
    circulating: supply?.circulating || 0,
    burn_rate_percent: ((totalBurned / 1_000_000_000) * 100).toFixed(4),
    deflationary: totalBurned > 0
  });
}

// ── SUBSCRIPTION TIERS ──
async function handleTiers(env) {
  const tiers = {
    free: {
      name: "Free",
      price_road_monthly: 0,
      earning_multiplier: 1.0,
      features: ["Basic wallet", "Earn ROAD", "Marketplace access", "Community governance"],
      limits: { daily_earn_cap: 50, transfer_limit: 100, vault_slots: 1 }
    },
    pro: {
      name: "Pro",
      price_road_monthly: 25,
      earning_multiplier: 1.5,
      features: ["1.5x earning rate", "Priority AI inference", "Advanced portfolio analytics", "Custom agent creation", "3 vault slots", "Auction creation"],
      limits: { daily_earn_cap: 200, transfer_limit: 1000, vault_slots: 3 }
    },
    enterprise: {
      name: "Enterprise",
      price_road_monthly: 100,
      earning_multiplier: 2.0,
      features: ["2x earning rate", "Unlimited AI inference", "White-label deployment", "Fleet agent access", "10 vault slots", "Priority support", "Bulk gift cards", "Custom exchange rates"],
      limits: { daily_earn_cap: null, transfer_limit: null, vault_slots: 10 }
    }
  };
  return json({ tiers, current_subscribers: {} });
}

async function handleTierSubscribe(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.tier) return json({ error: "Missing road_id or tier" }, 400);
  const validTiers = { free: 0, pro: 25, enterprise: 100 };
  if (!(body.tier in validTiers)) return json({ error: "Invalid tier. Choose: free, pro, enterprise" }, 400);

  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const price = validTiers[body.tier];
  const multipliers = { free: 1.0, pro: 1.5, enterprise: 2.0 };
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

  if (price > 0) {
    const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
    if (!w || w.balance < price) return json({ error: "Insufficient balance", required: price, balance: w?.balance || 0 }, 400);

    // Deduct subscription fee
    await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?")
      .bind(price, price, now, body.road_id).run();
    await logTx(env.DB, "subscription", body.road_id, "system", price, `tier:${body.tier}`);
  }

  // Upsert subscription
  await env.DB.prepare(
    "INSERT INTO subscriptions (road_id, tier, earning_multiplier, started_at, expires_at, updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(road_id) DO UPDATE SET tier = ?, earning_multiplier = ?, expires_at = ?, updated_at = ?"
  ).bind(body.road_id, body.tier, multipliers[body.tier], now, body.tier === "free" ? null : expiresAt, now, body.tier, multipliers[body.tier], body.tier === "free" ? null : expiresAt, now).run();

  await logToRoadChain(env, "subscription", "roadcoin", body.road_id, price, { tier: body.tier });

  return json({
    success: true,
    road_id: body.road_id,
    tier: body.tier,
    earning_multiplier: multipliers[body.tier],
    charged: price,
    expires_at: body.tier === "free" ? null : expiresAt,
    message: `Subscribed to ${body.tier.charAt(0).toUpperCase() + body.tier.slice(1)} tier! ${multipliers[body.tier]}x earning rate active.`
  });
}

async function handleTierStatus(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureExtendedTables(env.DB);

  const sub = await env.DB.prepare("SELECT * FROM subscriptions WHERE road_id = ?").bind(roadId).first();
  if (!sub) return json({ road_id: roadId, tier: "free", earning_multiplier: 1.0, active: true });

  const isActive = !sub.expires_at || new Date(sub.expires_at) > new Date();
  return json({
    road_id: roadId,
    tier: isActive ? sub.tier : "free",
    earning_multiplier: isActive ? sub.earning_multiplier : 1.0,
    active: isActive,
    started_at: sub.started_at,
    expires_at: sub.expires_at,
    days_remaining: sub.expires_at ? Math.max(0, Math.ceil((new Date(sub.expires_at) - Date.now()) / 86400000)) : null
  });
}

// ── AUCTION HOUSE ──
async function handleAuctionsList(env) {
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  // Auto-expire ended auctions
  const now = new Date().toISOString();
  try {
    await env.DB.prepare("UPDATE auctions SET status = 'ended' WHERE status = 'active' AND ends_at < ?").bind(now).run();
  } catch {}

  const active = await env.DB.prepare("SELECT * FROM auctions WHERE status = 'active' ORDER BY ends_at ASC LIMIT 50").all();
  const ended = await env.DB.prepare("SELECT * FROM auctions WHERE status IN ('ended','settled') ORDER BY ends_at DESC LIMIT 20").all();

  return json({
    active_auctions: active.results || [],
    recently_ended: ended.results || [],
    active_count: active.results?.length || 0
  });
}

async function handleAuctionCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.title) return json({ error: "Missing road_id or title" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const durationHours = body.duration_hours || 24;
  const endsAt = new Date(Date.now() + durationHours * 3600000).toISOString();
  const minBid = body.min_bid || 1;

  await env.DB.prepare(
    "INSERT INTO auctions (id, seller_id, title, description, category, min_bid, current_bid, current_bidder, status, created_at, ends_at) VALUES (?,?,?,?,?,?,0,NULL,'active',?,?)"
  ).bind(id, body.road_id, body.title, body.description || "", body.category || "digital", minBid, now, endsAt).run();

  await logToRoadChain(env, "auction_create", "roadcoin", body.road_id, 0, { auction_id: id, title: body.title });

  return json({
    success: true,
    auction_id: id,
    title: body.title,
    min_bid: minBid,
    ends_at: endsAt,
    duration_hours: durationHours,
    message: `Auction created! Bidding open for ${durationHours} hours.`
  });
}

async function handleAuctionBid(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.auction_id || !body?.amount) return json({ error: "Missing road_id, auction_id, or amount" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const auction = await env.DB.prepare("SELECT * FROM auctions WHERE id = ?").bind(body.auction_id).first();
  if (!auction) return json({ error: "Auction not found" }, 404);
  if (auction.status !== "active") return json({ error: "Auction is not active" }, 400);
  if (new Date(auction.ends_at) < new Date()) return json({ error: "Auction has ended" }, 400);
  if (auction.seller_id === body.road_id) return json({ error: "Cannot bid on your own auction" }, 400);
  if (body.amount <= auction.current_bid) return json({ error: "Bid must be higher than current bid", current_bid: auction.current_bid }, 400);
  if (body.amount < auction.min_bid) return json({ error: "Bid below minimum", min_bid: auction.min_bid }, 400);

  // Check bidder balance
  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance", balance: w?.balance || 0 }, 400);

  const now = new Date().toISOString();

  // Refund previous bidder if exists
  if (auction.current_bidder) {
    await env.DB.prepare("UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE road_id = ?")
      .bind(auction.current_bid, now, auction.current_bidder).run();
    await logTx(env.DB, "auction_refund", "escrow", auction.current_bidder, auction.current_bid, `outbid:${body.auction_id}`);
  }

  // Escrow new bid (deduct from bidder)
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE road_id = ?")
    .bind(body.amount, now, body.road_id).run();

  // Update auction
  await env.DB.prepare("UPDATE auctions SET current_bid = ?, current_bidder = ? WHERE id = ?")
    .bind(body.amount, body.road_id, body.auction_id).run();

  // Log bid
  await env.DB.prepare("INSERT INTO auction_bids (id, auction_id, bidder_id, amount, created_at) VALUES (?,?,?,?,?)")
    .bind(crypto.randomUUID(), body.auction_id, body.road_id, body.amount, now).run();

  await logTx(env.DB, "auction_bid", body.road_id, "escrow", body.amount, `bid:${body.auction_id}`);

  return json({
    success: true,
    auction_id: body.auction_id,
    bid: body.amount,
    previous_bid: auction.current_bid,
    previous_bidder_refunded: !!auction.current_bidder,
    message: `Bid of ${body.amount} ROAD placed!`
  });
}

async function handleAuctionSettle(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.auction_id) return json({ error: "Missing auction_id" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const auction = await env.DB.prepare("SELECT * FROM auctions WHERE id = ?").bind(body.auction_id).first();
  if (!auction) return json({ error: "Auction not found" }, 404);
  if (auction.status === "settled") return json({ error: "Already settled" }, 400);
  if (new Date(auction.ends_at) > new Date() && auction.status === "active") return json({ error: "Auction still active" }, 400);

  const now = new Date().toISOString();

  if (!auction.current_bidder || auction.current_bid <= 0) {
    // No bids — close without settlement
    await env.DB.prepare("UPDATE auctions SET status = 'settled' WHERE id = ?").bind(body.auction_id).run();
    return json({ success: true, auction_id: body.auction_id, result: "no_bids", message: "Auction ended with no bids." });
  }

  // Transfer funds to seller
  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
  ).bind(auction.seller_id, auction.current_bid, auction.current_bid, now, now, auction.current_bid, auction.current_bid, now).run();

  // Mark bidder's spend
  await env.DB.prepare("UPDATE wallets SET total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?")
    .bind(auction.current_bid, now, auction.current_bidder).run();

  await env.DB.prepare("UPDATE auctions SET status = 'settled' WHERE id = ?").bind(body.auction_id).run();

  await logTx(env.DB, "auction_settle", "escrow", auction.seller_id, auction.current_bid, `settled:${body.auction_id}`);
  await logToRoadChain(env, "auction_settle", "roadcoin", auction.seller_id, auction.current_bid, { auction_id: body.auction_id, winner: auction.current_bidder });

  return json({
    success: true,
    auction_id: body.auction_id,
    title: auction.title,
    winner: auction.current_bidder,
    winning_bid: auction.current_bid,
    seller: auction.seller_id,
    message: `Auction settled! ${auction.current_bidder} won "${auction.title}" for ${auction.current_bid} ROAD.`
  });
}

// ── GIFT CARDS ──
async function handleGiftPurchase(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount) return json({ error: "Missing road_id or amount" }, 400);
  if (body.amount <= 0 || body.amount > 10000) return json({ error: "Amount must be between 1 and 10000 ROAD" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance", balance: w?.balance || 0 }, 400);

  const now = new Date().toISOString();
  // Generate a readable gift code
  const codeSegments = [];
  for (let i = 0; i < 4; i++) {
    codeSegments.push(crypto.randomUUID().slice(0, 4).toUpperCase());
  }
  const code = "ROAD-" + codeSegments.join("-");

  // Deduct from sender
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?")
    .bind(body.amount, body.amount, now, body.road_id).run();

  // Create gift card
  await env.DB.prepare(
    "INSERT INTO gift_cards (code, amount, from_id, to_id, message, status, created_at) VALUES (?,?,?,?,?,?,?)"
  ).bind(code, body.amount, body.road_id, body.to_id || null, body.message || "A gift of ROAD for you!", "active", now).run();

  await logTx(env.DB, "gift_purchase", body.road_id, "gift_escrow", body.amount, `gift:${code}`);
  await logToRoadChain(env, "gift_purchase", "roadcoin", body.road_id, body.amount, { code, to: body.to_id });

  return json({
    success: true,
    code,
    amount: body.amount,
    from: body.road_id,
    to: body.to_id || "anyone",
    message: body.message || "A gift of ROAD for you!",
    instructions: `Share this code: ${code}. The recipient redeems at /api/gifts/redeem.`
  });
}

async function handleGiftRedeem(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.code) return json({ error: "Missing road_id or code" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const gift = await env.DB.prepare("SELECT * FROM gift_cards WHERE code = ?").bind(body.code).first();
  if (!gift) return json({ error: "Invalid gift card code" }, 404);
  if (gift.status !== "active") return json({ error: "Gift card already redeemed" }, 400);
  if (gift.to_id && gift.to_id !== body.road_id) return json({ error: "This gift card is for a different user" }, 403);
  if (gift.from_id === body.road_id) return json({ error: "Cannot redeem your own gift card" }, 400);

  const now = new Date().toISOString();

  // Credit the recipient
  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
  ).bind(body.road_id, gift.amount, gift.amount, now, now, gift.amount, gift.amount, now).run();

  // Mark as redeemed
  await env.DB.prepare("UPDATE gift_cards SET status = 'redeemed', to_id = ?, redeemed_at = ? WHERE code = ?")
    .bind(body.road_id, now, body.code).run();

  await logTx(env.DB, "gift_redeem", "gift_escrow", body.road_id, gift.amount, `gift:${body.code}`);
  await logToRoadChain(env, "gift_redeem", "roadcoin", body.road_id, gift.amount, { code: body.code, from: gift.from_id });

  return json({
    success: true,
    road_id: body.road_id,
    amount: gift.amount,
    from: gift.from_id,
    message_from_sender: gift.message,
    greeting: `You received ${gift.amount} ROAD! Welcome to the road.`
  });
}

async function handleGiftCheck(url, env) {
  const code = url.searchParams.get("code");
  if (!code) return json({ error: "Missing code parameter" }, 400);
  await ensureExtendedTables(env.DB);

  const gift = await env.DB.prepare("SELECT amount, from_id, to_id, message, status, created_at, redeemed_at FROM gift_cards WHERE code = ?").bind(code).first();
  if (!gift) return json({ error: "Invalid gift card code" }, 404);

  return json({
    code,
    amount: gift.amount,
    from: gift.from_id,
    to: gift.to_id,
    message: gift.message,
    status: gift.status,
    created_at: gift.created_at,
    redeemed_at: gift.redeemed_at
  });
}

// ── EXCHANGE RATES ──
function getCurrentRate() {
  // Simulated dynamic rate based on time (oscillates around $0.10 with some variance)
  const baseRate = 0.10;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const hourOfDay = new Date().getUTCHours();
  // Sinusoidal variance: +/- 30% over the year, +/- 5% over the day
  const yearlyVariance = Math.sin(dayOfYear / 365 * 2 * Math.PI) * 0.03;
  const dailyVariance = Math.sin(hourOfDay / 24 * 2 * Math.PI) * 0.005;
  const rate = baseRate + yearlyVariance + dailyVariance;
  return Math.round(rate * 10000) / 10000;
}

async function handleRates(env) {
  await ensureExtendedTables(env.DB);

  const rate = getCurrentRate();
  const now = new Date().toISOString();

  // Record current rate
  try {
    const supply = await env.DB.prepare("SELECT SUM(balance) + SUM(staked) as total FROM wallets").first();
    const circulating = supply?.total || 0;
    await env.DB.prepare(
      "INSERT INTO exchange_rates (id, rate_usd, volume_24h, market_cap, recorded_at) VALUES (?,?,?,?,?)"
    ).bind(crypto.randomUUID(), rate, 0, circulating * rate, now).run();
  } catch {}

  return json({
    symbol: "ROAD",
    rate_usd: rate,
    rate_btc: (rate / 65000).toFixed(10),
    rate_eth: (rate / 3200).toFixed(8),
    change_24h: ((Math.sin(Date.now() / 86400000) * 5)).toFixed(2) + "%",
    volume_24h_usd: Math.floor(Math.random() * 10000 + 5000),
    updated_at: now,
    disclaimer: "Simulated exchange rate for RoadCoin ecosystem. Not financial advice."
  });
}

async function handleRatesHistory(env) {
  await ensureExtendedTables(env.DB);

  // Generate historical rates for the past 30 days
  const history = [];
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    const ts = now - i * 86400000;
    const d = new Date(ts);
    const dayOfYear = Math.floor((ts - new Date(d.getFullYear(), 0, 0)) / 86400000);
    const baseRate = 0.10;
    const variance = Math.sin(dayOfYear / 365 * 2 * Math.PI) * 0.03;
    const rate = Math.round((baseRate + variance) * 10000) / 10000;
    history.push({
      date: d.toISOString().slice(0, 10),
      rate_usd: rate,
      high: Math.round((rate * 1.05) * 10000) / 10000,
      low: Math.round((rate * 0.95) * 10000) / 10000
    });
  }

  return json({
    symbol: "ROAD",
    period: "30d",
    history,
    current: getCurrentRate()
  });
}

async function handleRatesConvert(url, env) {
  const amount = parseFloat(url.searchParams.get("amount") || "1");
  const from = (url.searchParams.get("from") || "ROAD").toUpperCase();
  const to = (url.searchParams.get("to") || "USD").toUpperCase();

  const rate = getCurrentRate();
  let result;

  if (from === "ROAD" && to === "USD") {
    result = amount * rate;
  } else if (from === "USD" && to === "ROAD") {
    result = amount / rate;
  } else if (from === "ROAD" && to === "BTC") {
    result = (amount * rate) / 65000;
  } else if (from === "BTC" && to === "ROAD") {
    result = (amount * 65000) / rate;
  } else if (from === "ROAD" && to === "ETH") {
    result = (amount * rate) / 3200;
  } else if (from === "ETH" && to === "ROAD") {
    result = (amount * 3200) / rate;
  } else {
    return json({ error: "Unsupported currency pair. Supported: ROAD, USD, BTC, ETH" }, 400);
  }

  return json({
    from: { currency: from, amount },
    to: { currency: to, amount: Math.round(result * 100000000) / 100000000 },
    rate_used: rate,
    converted_at: new Date().toISOString()
  });
}

// ── SAVINGS VAULTS ──
async function handleVaultInfo(env) {
  const vaultTypes = {
    flex: { name: "Flex Vault", lock_days: 7, apy: 5, penalty_percent: 10, description: "Short-term savings, 7-day lock, 5% APY" },
    standard: { name: "Standard Vault", lock_days: 30, apy: 10, penalty_percent: 15, description: "30-day lock for solid returns, 10% APY" },
    premium: { name: "Premium Vault", lock_days: 90, apy: 18, penalty_percent: 25, description: "90-day lock, highest APY at 18%" },
    diamond: { name: "Diamond Vault", lock_days: 365, apy: 30, penalty_percent: 40, description: "1-year lock, 30% APY for the committed" }
  };
  return json({ vault_types: vaultTypes, note: "Early withdrawal incurs a penalty on earned interest. Principal is always safe." });
}

async function handleVaultsList(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const vaults = await env.DB.prepare("SELECT * FROM vaults WHERE road_id = ? ORDER BY created_at DESC").bind(roadId).all();
  const now = Date.now();

  const enriched = (vaults.results || []).map(v => {
    const lockedUntil = new Date(v.locked_until).getTime();
    const createdAt = new Date(v.created_at).getTime();
    const daysElapsed = Math.max(0, (Math.min(now, lockedUntil) - createdAt) / 86400000);
    const totalDays = (lockedUntil - createdAt) / 86400000;
    const earnedInterest = (v.amount * (v.apy / 100) * (daysElapsed / 365));
    const matured = now >= lockedUntil;

    return {
      ...v,
      days_elapsed: Math.floor(daysElapsed),
      total_days: Math.floor(totalDays),
      earned_interest: Math.round(earnedInterest * 100) / 100,
      matured,
      days_remaining: matured ? 0 : Math.ceil((lockedUntil - now) / 86400000)
    };
  });

  const totalLocked = enriched.reduce((sum, v) => sum + (v.status === "locked" ? v.amount : 0), 0);
  const totalInterest = enriched.reduce((sum, v) => sum + (v.status === "locked" ? v.earned_interest : 0), 0);

  return json({
    road_id: roadId,
    vaults: enriched,
    total_locked: totalLocked,
    total_earned_interest: Math.round(totalInterest * 100) / 100,
    vault_count: enriched.length
  });
}

async function handleVaultDeposit(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount || !body?.vault_type) return json({ error: "Missing road_id, amount, or vault_type" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);

  const vaultConfig = {
    flex: { lock_days: 7, apy: 5 },
    standard: { lock_days: 30, apy: 10 },
    premium: { lock_days: 90, apy: 18 },
    diamond: { lock_days: 365, apy: 30 }
  };

  if (!vaultConfig[body.vault_type]) return json({ error: "Invalid vault_type. Choose: flex, standard, premium, diamond" }, 400);

  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  // Check tier vault slot limits
  let maxSlots = 1;
  try {
    const sub = await env.DB.prepare("SELECT tier FROM subscriptions WHERE road_id = ?").bind(body.road_id).first();
    if (sub?.tier === "pro") maxSlots = 3;
    else if (sub?.tier === "enterprise") maxSlots = 10;
  } catch {}

  const currentVaults = await env.DB.prepare("SELECT COUNT(*) as count FROM vaults WHERE road_id = ? AND status = 'locked'").bind(body.road_id).first();
  if ((currentVaults?.count || 0) >= maxSlots) return json({ error: `Vault slot limit reached (${maxSlots}). Upgrade your tier for more slots.` }, 400);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance", balance: w?.balance || 0 }, 400);

  const now = new Date().toISOString();
  const config = vaultConfig[body.vault_type];
  const lockedUntil = new Date(Date.now() + config.lock_days * 86400000).toISOString();
  const vaultId = crypto.randomUUID();

  // Deduct from balance
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE road_id = ?")
    .bind(body.amount, now, body.road_id).run();

  // Create vault
  await env.DB.prepare(
    "INSERT INTO vaults (id, road_id, amount, vault_type, apy, locked_until, status, created_at) VALUES (?,?,?,?,?,?,?,?)"
  ).bind(vaultId, body.road_id, body.amount, body.vault_type, config.apy, lockedUntil, "locked", now).run();

  await logTx(env.DB, "vault_deposit", body.road_id, "vault", body.amount, `vault:${body.vault_type}`);
  await logToRoadChain(env, "vault_deposit", "roadcoin", body.road_id, body.amount, { vault_id: vaultId, type: body.vault_type, apy: config.apy });

  const projectedInterest = (body.amount * (config.apy / 100) * (config.lock_days / 365));

  return json({
    success: true,
    vault_id: vaultId,
    road_id: body.road_id,
    amount: body.amount,
    vault_type: body.vault_type,
    apy: config.apy,
    locked_until: lockedUntil,
    lock_days: config.lock_days,
    projected_interest: Math.round(projectedInterest * 100) / 100,
    message: `${body.amount} ROAD locked in ${body.vault_type} vault at ${config.apy}% APY for ${config.lock_days} days.`
  });
}

async function handleVaultWithdraw(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.vault_id) return json({ error: "Missing road_id or vault_id" }, 400);
  await ensureTables(env.DB);
  await ensureExtendedTables(env.DB);

  const vault = await env.DB.prepare("SELECT * FROM vaults WHERE id = ? AND road_id = ?").bind(body.vault_id, body.road_id).first();
  if (!vault) return json({ error: "Vault not found" }, 404);
  if (vault.status !== "locked") return json({ error: "Vault already withdrawn" }, 400);

  const now = Date.now();
  const lockedUntil = new Date(vault.locked_until).getTime();
  const createdAt = new Date(vault.created_at).getTime();
  const daysElapsed = Math.max(0, (Math.min(now, lockedUntil) - createdAt) / 86400000);
  const matured = now >= lockedUntil;

  // Calculate interest
  let earnedInterest = vault.amount * (vault.apy / 100) * (daysElapsed / 365);

  // Early withdrawal penalty
  let penalty = 0;
  const penaltyRates = { flex: 0.10, standard: 0.15, premium: 0.25, diamond: 0.40 };
  if (!matured) {
    const penaltyRate = penaltyRates[vault.vault_type] || 0.15;
    penalty = earnedInterest * penaltyRate;
    earnedInterest = earnedInterest - penalty;
  }

  earnedInterest = Math.max(0, Math.round(earnedInterest * 100) / 100);
  penalty = Math.round(penalty * 100) / 100;
  const totalReturn = vault.amount + earnedInterest;
  const nowStr = new Date().toISOString();

  // Credit wallet
  await env.DB.prepare(
    "UPDATE wallets SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ? WHERE road_id = ?"
  ).bind(totalReturn, earnedInterest, nowStr, body.road_id).run();

  // Mark vault as withdrawn
  await env.DB.prepare("UPDATE vaults SET status = 'withdrawn' WHERE id = ?").bind(body.vault_id).run();

  await logTx(env.DB, "vault_withdraw", "vault", body.road_id, totalReturn, `vault_withdraw:${vault.vault_type}`);
  if (earnedInterest > 0) {
    await logTx(env.DB, "vault_interest", "vault", body.road_id, earnedInterest, `interest:${vault.vault_type}`);
  }

  return json({
    success: true,
    vault_id: body.vault_id,
    principal: vault.amount,
    interest_earned: earnedInterest,
    early_withdrawal: !matured,
    penalty: penalty,
    total_returned: totalReturn,
    days_held: Math.floor(daysElapsed),
    message: matured
      ? `Vault matured! ${totalReturn} ROAD returned (${earnedInterest} ROAD interest earned).`
      : `Early withdrawal! ${totalReturn} ROAD returned after ${penalty} ROAD penalty.`
  });
}

// ══════════════════════════════════════════════════════════════════
// NEW FEATURES v4.0
// ══════════════════════════════════════════════════════════════════

async function ensureV4Tables(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS lending_positions (
      id TEXT PRIMARY KEY,
      road_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      interest_rate REAL NOT NULL,
      collateral REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      matures_at TEXT,
      repaid_amount REAL DEFAULT 0
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS loyalty_accounts (
      road_id TEXT PRIMARY KEY,
      points INTEGER DEFAULT 0,
      tier TEXT DEFAULT 'bronze',
      lifetime_points INTEGER DEFAULT 0,
      tier_updated_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS split_payments (
      id TEXT PRIMARY KEY,
      from_id TEXT NOT NULL,
      total_amount REAL NOT NULL,
      recipients TEXT NOT NULL,
      memo TEXT,
      status TEXT DEFAULT 'completed',
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS recurring_payments (
      id TEXT PRIMARY KEY,
      from_id TEXT NOT NULL,
      to_id TEXT NOT NULL,
      amount REAL NOT NULL,
      frequency TEXT NOT NULL,
      memo TEXT,
      status TEXT DEFAULT 'active',
      next_execution TEXT NOT NULL,
      last_executed TEXT,
      executions INTEGER DEFAULT 0,
      max_executions INTEGER,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS merchants (
      merchant_id TEXT PRIMARY KEY,
      road_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'general',
      website TEXT,
      fee_percent REAL DEFAULT 1.0,
      total_volume REAL DEFAULT 0,
      total_transactions INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      api_key TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS merchant_transactions (
      id TEXT PRIMARY KEY,
      merchant_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      amount REAL NOT NULL,
      fee REAL NOT NULL,
      item TEXT,
      status TEXT DEFAULT 'pending',
      settled_at TEXT,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      filed_by TEXT NOT NULL,
      against TEXT NOT NULL,
      reason TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'open',
      evidence TEXT DEFAULT '[]',
      resolution TEXT,
      resolved_by TEXT,
      created_at TEXT NOT NULL,
      resolved_at TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS multisig_wallets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owners TEXT NOT NULL,
      required_sigs INTEGER NOT NULL,
      balance REAL DEFAULT 0,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS multisig_proposals (
      id TEXT PRIMARY KEY,
      wallet_id TEXT NOT NULL,
      proposer TEXT NOT NULL,
      type TEXT NOT NULL,
      to_id TEXT,
      amount REAL DEFAULT 0,
      memo TEXT,
      signatures TEXT DEFAULT '[]',
      required_sigs INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      executed_at TEXT
    )`)
  ]);
}

// ── LENDING / BORROWING ──
async function handleLend(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount) return json({ error: "Missing road_id or amount" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance", balance: w?.balance || 0 }, 400);

  const interestRate = body.rate || 8; // Annual rate
  const durationDays = body.duration_days || 30;
  const now = new Date().toISOString();
  const maturesAt = new Date(Date.now() + durationDays * 86400000).toISOString();
  const id = crypto.randomUUID();

  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE road_id = ?")
    .bind(body.amount, now, body.road_id).run();

  await env.DB.prepare(
    "INSERT INTO lending_positions (id, road_id, type, amount, interest_rate, status, created_at, matures_at) VALUES (?,?,?,?,?,?,?,?)"
  ).bind(id, body.road_id, "lend", body.amount, interestRate, "active", now, maturesAt).run();

  const projectedInterest = (body.amount * (interestRate / 100) * (durationDays / 365));

  await logTx(env.DB, "lend", body.road_id, "lending_pool", body.amount, "lend_deposit");
  await logToRoadChain(env, "lend", "roadcoin", body.road_id, body.amount, { position_id: id, rate: interestRate });

  return json({
    success: true,
    position_id: id,
    road_id: body.road_id,
    amount: body.amount,
    interest_rate: interestRate,
    duration_days: durationDays,
    matures_at: maturesAt,
    projected_interest: Math.round(projectedInterest * 100) / 100,
    message: `${body.amount} ROAD lent at ${interestRate}% APR for ${durationDays} days. Projected interest: ${projectedInterest.toFixed(2)} ROAD.`
  });
}

async function handleBorrow(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount) return json({ error: "Missing road_id or amount" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const w = await env.DB.prepare("SELECT staked FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w) return json({ error: "Wallet not found" }, 404);

  // Can borrow up to 50% of staked collateral
  const maxBorrow = (w.staked || 0) * 0.5;
  if (body.amount > maxBorrow) return json({ error: "Insufficient collateral. You can borrow up to 50% of your staked balance.", max_borrow: maxBorrow, staked: w.staked }, 400);

  // Check existing borrows
  const existingBorrows = await env.DB.prepare(
    "SELECT SUM(amount - repaid_amount) as outstanding FROM lending_positions WHERE road_id = ? AND type = 'borrow' AND status = 'active'"
  ).bind(body.road_id).first();
  const outstanding = existingBorrows?.outstanding || 0;
  if (outstanding + body.amount > maxBorrow) return json({ error: "Total borrows would exceed collateral limit", outstanding, max_additional: maxBorrow - outstanding }, 400);

  const interestRate = body.rate || 12;
  const durationDays = body.duration_days || 30;
  const now = new Date().toISOString();
  const maturesAt = new Date(Date.now() + durationDays * 86400000).toISOString();
  const id = crypto.randomUUID();
  const collateralLocked = body.amount * 2; // 200% collateral ratio

  await env.DB.prepare(
    "INSERT INTO lending_positions (id, road_id, type, amount, interest_rate, collateral, status, created_at, matures_at) VALUES (?,?,?,?,?,?,?,?,?)"
  ).bind(id, body.road_id, "borrow", body.amount, interestRate, collateralLocked, "active", now, maturesAt).run();

  // Credit borrowed amount
  await env.DB.prepare("UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE road_id = ?")
    .bind(body.amount, now, body.road_id).run();

  await logTx(env.DB, "borrow", "lending_pool", body.road_id, body.amount, "borrow");
  await logToRoadChain(env, "borrow", "roadcoin", body.road_id, body.amount, { position_id: id, collateral: collateralLocked });

  const totalOwed = body.amount * (1 + (interestRate / 100) * (durationDays / 365));

  return json({
    success: true,
    position_id: id,
    road_id: body.road_id,
    borrowed: body.amount,
    interest_rate: interestRate,
    collateral_locked: collateralLocked,
    duration_days: durationDays,
    matures_at: maturesAt,
    total_owed: Math.round(totalOwed * 100) / 100,
    message: `Borrowed ${body.amount} ROAD at ${interestRate}% APR. Repay ${totalOwed.toFixed(2)} ROAD by ${maturesAt.slice(0, 10)}.`
  });
}

async function handleRepay(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.position_id || !body?.amount) return json({ error: "Missing road_id, position_id, or amount" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const position = await env.DB.prepare("SELECT * FROM lending_positions WHERE id = ? AND road_id = ? AND type = 'borrow'").bind(body.position_id, body.road_id).first();
  if (!position) return json({ error: "Borrow position not found" }, 404);
  if (position.status !== "active") return json({ error: "Position already closed" }, 400);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w || w.balance < body.amount) return json({ error: "Insufficient balance", balance: w?.balance || 0 }, 400);

  const daysElapsed = Math.max(0, (Date.now() - new Date(position.created_at).getTime()) / 86400000);
  const interestOwed = position.amount * (position.interest_rate / 100) * (daysElapsed / 365);
  const totalOwed = position.amount - position.repaid_amount + interestOwed;
  const repayAmount = Math.min(body.amount, totalOwed);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE road_id = ?")
    .bind(repayAmount, now, body.road_id).run();

  const newRepaid = position.repaid_amount + repayAmount;
  const fullyRepaid = newRepaid >= position.amount + interestOwed;

  await env.DB.prepare("UPDATE lending_positions SET repaid_amount = ?, status = ? WHERE id = ?")
    .bind(newRepaid, fullyRepaid ? "repaid" : "active", body.position_id).run();

  await logTx(env.DB, "loan_repay", body.road_id, "lending_pool", repayAmount, `repay:${body.position_id}`);

  return json({
    success: true,
    position_id: body.position_id,
    repaid: repayAmount,
    total_repaid: newRepaid,
    remaining: Math.max(0, Math.round((totalOwed - repayAmount) * 100) / 100),
    fully_repaid: fullyRepaid,
    message: fullyRepaid ? "Loan fully repaid! Collateral released." : `Repaid ${repayAmount} ROAD. ${(totalOwed - repayAmount).toFixed(2)} ROAD remaining.`
  });
}

async function handleLendPositions(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureV4Tables(env.DB);

  const positions = await env.DB.prepare("SELECT * FROM lending_positions WHERE road_id = ? ORDER BY created_at DESC LIMIT 50").bind(roadId).all();
  const now = Date.now();
  const enriched = (positions.results || []).map(p => {
    const daysElapsed = Math.max(0, (now - new Date(p.created_at).getTime()) / 86400000);
    const interest = p.amount * (p.interest_rate / 100) * (daysElapsed / 365);
    return { ...p, days_elapsed: Math.floor(daysElapsed), accrued_interest: Math.round(interest * 100) / 100, matured: p.matures_at ? now >= new Date(p.matures_at).getTime() : false };
  });

  return json({ road_id: roadId, positions: enriched, count: enriched.length });
}

async function handleLendPool(env) {
  await ensureV4Tables(env.DB);
  const lendStats = await env.DB.prepare("SELECT SUM(amount) as total_lent, COUNT(*) as lend_count FROM lending_positions WHERE type = 'lend' AND status = 'active'").first();
  const borrowStats = await env.DB.prepare("SELECT SUM(amount) as total_borrowed, COUNT(*) as borrow_count FROM lending_positions WHERE type = 'borrow' AND status = 'active'").first();
  const utilization = (lendStats?.total_lent || 0) > 0 ? ((borrowStats?.total_borrowed || 0) / (lendStats?.total_lent || 1)) * 100 : 0;

  return json({
    pool: {
      total_lent: lendStats?.total_lent || 0,
      active_lenders: lendStats?.lend_count || 0,
      total_borrowed: borrowStats?.total_borrowed || 0,
      active_borrowers: borrowStats?.borrow_count || 0,
      utilization_percent: Math.round(utilization * 100) / 100,
      base_lend_rate: 8,
      base_borrow_rate: 12,
      collateral_ratio: "200%",
      max_ltv: "50%"
    }
  });
}

// ── LOYALTY PROGRAM ──
async function handleLoyalty(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  let account = await env.DB.prepare("SELECT * FROM loyalty_accounts WHERE road_id = ?").bind(roadId).first();
  if (!account) {
    // Auto-create from transaction history
    const w = await env.DB.prepare("SELECT total_earned, total_spent FROM wallets WHERE road_id = ?").bind(roadId).first();
    if (!w) return json({ error: "Wallet not found" }, 404);
    const points = Math.floor((w.total_earned || 0) * 10 + (w.total_spent || 0) * 5);
    const tier = points >= 50000 ? "platinum" : points >= 20000 ? "gold" : points >= 5000 ? "silver" : "bronze";
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO loyalty_accounts (road_id, points, tier, lifetime_points, tier_updated_at, created_at) VALUES (?,?,?,?,?,?) ON CONFLICT(road_id) DO NOTHING"
    ).bind(roadId, points, tier, points, now, now).run();
    account = { road_id: roadId, points, tier, lifetime_points: points, tier_updated_at: now, created_at: now };
  }

  const tierPerks = {
    bronze: { multiplier: 1.0, perks: ["Basic rewards", "Community access"], next_tier: "silver", points_needed: 5000 },
    silver: { multiplier: 1.25, perks: ["1.25x points", "Early auction access", "Silver badge"], next_tier: "gold", points_needed: 20000 },
    gold: { multiplier: 1.5, perks: ["1.5x points", "Priority support", "Reduced fees", "Gold badge", "Exclusive drops"], next_tier: "platinum", points_needed: 50000 },
    platinum: { multiplier: 2.0, perks: ["2x points", "Zero fees", "VIP support", "Platinum badge", "Exclusive drops", "Beta access", "Custom agent slot"], next_tier: null, points_needed: null }
  };

  const currentPerks = tierPerks[account.tier] || tierPerks.bronze;
  const nextTierInfo = currentPerks.next_tier ? { tier: currentPerks.next_tier, points_needed: currentPerks.points_needed - account.lifetime_points, progress_percent: Math.min(100, Math.round((account.lifetime_points / currentPerks.points_needed) * 100)) } : { tier: null, message: "You are at the highest tier!" };

  return json({
    road_id: roadId,
    tier: account.tier,
    points: account.points,
    lifetime_points: account.lifetime_points,
    multiplier: currentPerks.multiplier,
    perks: currentPerks.perks,
    next_tier: nextTierInfo,
    member_since: account.created_at
  });
}

async function handleLoyaltyTiers(env) {
  return json({
    tiers: {
      bronze: { name: "Bronze", min_points: 0, multiplier: 1.0, perks: ["Basic rewards", "Community access"], color: "#CD7F32" },
      silver: { name: "Silver", min_points: 5000, multiplier: 1.25, perks: ["1.25x points", "Early auction access", "Silver badge"], color: "#C0C0C0" },
      gold: { name: "Gold", min_points: 20000, multiplier: 1.5, perks: ["1.5x points", "Priority support", "Reduced fees", "Gold badge", "Exclusive drops"], color: "#FFD700" },
      platinum: { name: "Platinum", min_points: 50000, multiplier: 2.0, perks: ["2x points", "Zero fees", "VIP support", "Platinum badge", "Exclusive drops", "Beta access", "Custom agent slot"], color: "#E5E4E2" }
    },
    earning_rules: {
      earn_action: "10 points per ROAD earned",
      spend_action: "5 points per ROAD spent",
      stake_action: "15 points per ROAD staked",
      referral: "500 points per referral",
      daily_login: "25 points per daily claim"
    }
  });
}

async function handleLoyaltyRedeem(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.points || !body?.reward) return json({ error: "Missing road_id, points, or reward" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const account = await env.DB.prepare("SELECT * FROM loyalty_accounts WHERE road_id = ?").bind(body.road_id).first();
  if (!account) return json({ error: "Loyalty account not found. Visit /api/loyalty first." }, 404);
  if (account.points < body.points) return json({ error: "Insufficient loyalty points", available: account.points }, 400);

  const rewards = {
    road_bonus: { points: 1000, road_amount: 10, description: "Convert 1000 points to 10 ROAD" },
    fee_waiver: { points: 500, description: "Waive fees on next 10 transactions" },
    double_earn: { points: 2000, description: "2x earning rate for 24 hours" },
    exclusive_nft: { points: 5000, description: "Exclusive RoadCoin NFT badge" },
    vault_boost: { points: 3000, description: "+2% APY boost on next vault deposit" }
  };

  const reward = rewards[body.reward];
  if (!reward) return json({ error: "Invalid reward. Options: " + Object.keys(rewards).join(", ") }, 400);
  if (body.points < reward.points) return json({ error: "Not enough points for this reward", required: reward.points }, 400);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE loyalty_accounts SET points = points - ?, tier_updated_at = ? WHERE road_id = ?")
    .bind(reward.points, now, body.road_id).run();

  // If road_bonus, credit ROAD
  if (body.reward === "road_bonus" && reward.road_amount) {
    await env.DB.prepare("UPDATE wallets SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ? WHERE road_id = ?")
      .bind(reward.road_amount, reward.road_amount, now, body.road_id).run();
    await logTx(env.DB, "loyalty_redeem", "loyalty_pool", body.road_id, reward.road_amount, `loyalty:${body.reward}`);
  }

  return json({
    success: true,
    road_id: body.road_id,
    reward: body.reward,
    description: reward.description,
    points_spent: reward.points,
    points_remaining: account.points - reward.points,
    message: `Redeemed ${reward.description}!`
  });
}

// ── SPLIT PAYMENTS ──
async function handleSplit(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.from || !body?.recipients || !Array.isArray(body.recipients)) return json({ error: "Missing from or recipients array" }, 400);
  if (body.recipients.length < 2 || body.recipients.length > 20) return json({ error: "Recipients must be 2-20 entries" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  // Validate recipients: each must have road_id and either amount or percentage
  let totalAmount = 0;
  const usePercentage = body.recipients[0].percentage !== undefined;

  if (usePercentage) {
    if (!body.total_amount) return json({ error: "total_amount required when using percentages" }, 400);
    const totalPct = body.recipients.reduce((sum, r) => sum + (r.percentage || 0), 0);
    if (Math.abs(totalPct - 100) > 0.01) return json({ error: "Percentages must sum to 100", total: totalPct }, 400);
    totalAmount = body.total_amount;
  } else {
    totalAmount = body.recipients.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  if (totalAmount <= 0) return json({ error: "Total amount must be positive" }, 400);

  const sender = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.from).first();
  if (!sender || sender.balance < totalAmount) return json({ error: "Insufficient balance", required: totalAmount, balance: sender?.balance || 0 }, 400);

  const now = new Date().toISOString();
  const splitId = crypto.randomUUID();
  const results = [];

  // Deduct total from sender
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?")
    .bind(totalAmount, totalAmount, now, body.from).run();

  // Credit each recipient
  for (const r of body.recipients) {
    const amt = usePercentage ? Math.round((totalAmount * r.percentage / 100) * 100) / 100 : r.amount;
    await env.DB.prepare(
      "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
    ).bind(r.road_id, amt, amt, now, now, amt, amt, now).run();
    await logTx(env.DB, "split_payment", body.from, r.road_id, amt, body.memo || "split_payment");
    results.push({ road_id: r.road_id, amount: amt, percentage: usePercentage ? r.percentage : Math.round((amt / totalAmount) * 100) });
  }

  await env.DB.prepare(
    "INSERT INTO split_payments (id, from_id, total_amount, recipients, memo, status, created_at) VALUES (?,?,?,?,?,?,?)"
  ).bind(splitId, body.from, totalAmount, JSON.stringify(results), body.memo || "Split payment", "completed", now).run();

  await logToRoadChain(env, "split_payment", "roadcoin", body.from, totalAmount, { split_id: splitId, recipient_count: results.length });

  return json({
    success: true,
    split_id: splitId,
    from: body.from,
    total_amount: totalAmount,
    recipients: results,
    recipient_count: results.length,
    message: `${totalAmount} ROAD split between ${results.length} recipients.`
  });
}

async function handleSplitHistory(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureV4Tables(env.DB);

  const splits = await env.DB.prepare("SELECT * FROM split_payments WHERE from_id = ? ORDER BY created_at DESC LIMIT 50").bind(roadId).all();
  const enriched = (splits.results || []).map(s => ({ ...s, recipients: JSON.parse(s.recipients || "[]") }));
  return json({ road_id: roadId, splits: enriched, count: enriched.length });
}

// ── RECURRING PAYMENTS ──
async function handleRecurringCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.from || !body?.to || !body?.amount || !body?.frequency) return json({ error: "Missing from, to, amount, or frequency" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);

  const frequencies = { daily: 86400000, weekly: 604800000, biweekly: 1209600000, monthly: 2592000000 };
  if (!frequencies[body.frequency]) return json({ error: "Invalid frequency. Options: daily, weekly, biweekly, monthly" }, 400);

  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const w = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.from).first();
  if (!w) return json({ error: "Wallet not found" }, 404);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const nextExecution = new Date(Date.now() + frequencies[body.frequency]).toISOString();

  await env.DB.prepare(
    "INSERT INTO recurring_payments (id, from_id, to_id, amount, frequency, memo, status, next_execution, max_executions, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
  ).bind(id, body.from, body.to, body.amount, body.frequency, body.memo || "Recurring payment", "active", nextExecution, body.max_executions || null, now).run();

  await logToRoadChain(env, "recurring_create", "roadcoin", body.from, body.amount, { recurring_id: id, to: body.to, frequency: body.frequency });

  return json({
    success: true,
    recurring_id: id,
    from: body.from,
    to: body.to,
    amount: body.amount,
    frequency: body.frequency,
    next_execution: nextExecution,
    max_executions: body.max_executions || "unlimited",
    message: `Recurring payment of ${body.amount} ROAD to ${body.to} (${body.frequency}) created.`
  });
}

async function handleRecurringList(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureV4Tables(env.DB);

  const outgoing = await env.DB.prepare("SELECT * FROM recurring_payments WHERE from_id = ? ORDER BY created_at DESC LIMIT 50").bind(roadId).all();
  const incoming = await env.DB.prepare("SELECT * FROM recurring_payments WHERE to_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 50").bind(roadId).all();

  return json({
    road_id: roadId,
    outgoing: outgoing.results || [],
    incoming: incoming.results || [],
    total_outgoing_active: (outgoing.results || []).filter(r => r.status === "active").length,
    total_monthly_commitment: (outgoing.results || []).filter(r => r.status === "active").reduce((sum, r) => {
      const multipliers = { daily: 30, weekly: 4.33, biweekly: 2.17, monthly: 1 };
      return sum + r.amount * (multipliers[r.frequency] || 1);
    }, 0)
  });
}

async function handleRecurringCancel(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.recurring_id) return json({ error: "Missing road_id or recurring_id" }, 400);
  await ensureV4Tables(env.DB);

  const payment = await env.DB.prepare("SELECT * FROM recurring_payments WHERE id = ? AND from_id = ?").bind(body.recurring_id, body.road_id).first();
  if (!payment) return json({ error: "Recurring payment not found" }, 404);
  if (payment.status !== "active") return json({ error: "Already cancelled" }, 400);

  await env.DB.prepare("UPDATE recurring_payments SET status = 'cancelled' WHERE id = ?").bind(body.recurring_id).run();

  return json({
    success: true,
    recurring_id: body.recurring_id,
    message: `Recurring payment to ${payment.to_id} cancelled. ${payment.executions} payments were made.`
  });
}

async function handleRecurringExecute(request, env) {
  const body = await request.json().catch(() => null);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  // Execute all due recurring payments (can be triggered by cron or manually)
  const now = new Date().toISOString();
  const due = await env.DB.prepare("SELECT * FROM recurring_payments WHERE status = 'active' AND next_execution <= ?").bind(now).all();

  const results = [];
  for (const payment of (due.results || [])) {
    // Check if max executions reached
    if (payment.max_executions && payment.executions >= payment.max_executions) {
      await env.DB.prepare("UPDATE recurring_payments SET status = 'completed' WHERE id = ?").bind(payment.id).run();
      results.push({ id: payment.id, status: "completed", reason: "max_executions_reached" });
      continue;
    }

    // Check sender balance
    const sender = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(payment.from_id).first();
    if (!sender || sender.balance < payment.amount) {
      results.push({ id: payment.id, status: "skipped", reason: "insufficient_balance" });
      continue;
    }

    // Execute the transfer
    await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?")
      .bind(payment.amount, payment.amount, now, payment.from_id).run();
    await env.DB.prepare(
      "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
    ).bind(payment.to_id, payment.amount, payment.amount, now, now, payment.amount, payment.amount, now).run();

    // Calculate next execution
    const frequencies = { daily: 86400000, weekly: 604800000, biweekly: 1209600000, monthly: 2592000000 };
    const nextExecution = new Date(Date.now() + (frequencies[payment.frequency] || 2592000000)).toISOString();

    await env.DB.prepare("UPDATE recurring_payments SET executions = executions + 1, last_executed = ?, next_execution = ? WHERE id = ?")
      .bind(now, nextExecution, payment.id).run();

    await logTx(env.DB, "recurring_payment", payment.from_id, payment.to_id, payment.amount, payment.memo || "recurring");
    results.push({ id: payment.id, status: "executed", amount: payment.amount, from: payment.from_id, to: payment.to_id });
  }

  return json({ executed_at: now, processed: results.length, results });
}

// ── MERCHANT TOOLS ──
async function handleMerchantRegister(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.name) return json({ error: "Missing road_id or name" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const w = await env.DB.prepare("SELECT road_id FROM wallets WHERE road_id = ?").bind(body.road_id).first();
  if (!w) return json({ error: "Wallet not found. Create a wallet first." }, 404);

  const existing = await env.DB.prepare("SELECT merchant_id FROM merchants WHERE road_id = ?").bind(body.road_id).first();
  if (existing) return json({ error: "Already registered as a merchant", merchant_id: existing.merchant_id }, 400);

  const merchantId = "MERCH-" + crypto.randomUUID().slice(0, 8).toUpperCase();
  const apiKey = "rk_" + crypto.randomUUID().replace(/-/g, "");
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO merchants (merchant_id, road_id, name, description, category, website, fee_percent, api_key, created_at) VALUES (?,?,?,?,?,?,?,?,?)"
  ).bind(merchantId, body.road_id, body.name, body.description || "", body.category || "general", body.website || "", body.fee_percent || 1.0, apiKey, now).run();

  await logToRoadChain(env, "merchant_register", "roadcoin", body.road_id, 0, { merchant_id: merchantId });

  return json({
    success: true,
    merchant_id: merchantId,
    api_key: apiKey,
    name: body.name,
    fee_percent: body.fee_percent || 1.0,
    message: `Merchant account "${body.name}" created. Use your API key for checkout integration.`,
    integration: {
      checkout_url: "/api/merchant/checkout",
      settle_url: "/api/merchant/settle",
      report_url: "/api/merchant/report?merchant_id=" + merchantId
    }
  });
}

async function handleMerchantInfo(url, env) {
  const merchantId = url.searchParams.get("merchant_id");
  if (!merchantId) return json({ error: "Missing merchant_id" }, 400);
  await ensureV4Tables(env.DB);

  const merchant = await env.DB.prepare("SELECT merchant_id, road_id, name, description, category, website, fee_percent, total_volume, total_transactions, status, created_at FROM merchants WHERE merchant_id = ?").bind(merchantId).first();
  if (!merchant) return json({ error: "Merchant not found" }, 404);

  return json({ merchant });
}

async function handleMerchantCheckout(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.merchant_id || !body?.customer_id || !body?.amount) return json({ error: "Missing merchant_id, customer_id, or amount" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const merchant = await env.DB.prepare("SELECT * FROM merchants WHERE merchant_id = ? AND status = 'active'").bind(body.merchant_id).first();
  if (!merchant) return json({ error: "Merchant not found or inactive" }, 404);

  const customer = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(body.customer_id).first();
  if (!customer || customer.balance < body.amount) return json({ error: "Insufficient balance", balance: customer?.balance || 0 }, 400);

  const fee = Math.round(body.amount * (merchant.fee_percent / 100) * 100) / 100;
  const netAmount = body.amount - fee;
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Deduct from customer
  await env.DB.prepare("UPDATE wallets SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?")
    .bind(body.amount, body.amount, now, body.customer_id).run();

  // Credit merchant (net of fee)
  await env.DB.prepare(
    "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
  ).bind(merchant.road_id, netAmount, netAmount, now, now, netAmount, netAmount, now).run();

  // Record transaction
  await env.DB.prepare(
    "INSERT INTO merchant_transactions (id, merchant_id, customer_id, amount, fee, item, status, created_at) VALUES (?,?,?,?,?,?,?,?)"
  ).bind(txId, body.merchant_id, body.customer_id, body.amount, fee, body.item || "purchase", "completed", now).run();

  // Update merchant stats
  await env.DB.prepare("UPDATE merchants SET total_volume = total_volume + ?, total_transactions = total_transactions + 1 WHERE merchant_id = ?")
    .bind(body.amount, body.merchant_id).run();

  await logTx(env.DB, "merchant_payment", body.customer_id, merchant.road_id, body.amount, `merchant:${body.merchant_id}:${body.item || "purchase"}`);
  await logToRoadChain(env, "merchant_checkout", "roadcoin", body.customer_id, body.amount, { merchant_id: body.merchant_id, tx_id: txId });

  return json({
    success: true,
    transaction_id: txId,
    merchant: merchant.name,
    amount: body.amount,
    fee,
    net_to_merchant: netAmount,
    item: body.item || "purchase",
    message: `Payment of ${body.amount} ROAD to ${merchant.name} completed.`
  });
}

async function handleMerchantSettle(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.merchant_id) return json({ error: "Missing merchant_id" }, 400);
  await ensureV4Tables(env.DB);

  const merchant = await env.DB.prepare("SELECT * FROM merchants WHERE merchant_id = ?").bind(body.merchant_id).first();
  if (!merchant) return json({ error: "Merchant not found" }, 404);

  const pending = await env.DB.prepare(
    "SELECT SUM(amount) as total, SUM(fee) as fees, COUNT(*) as count FROM merchant_transactions WHERE merchant_id = ? AND status = 'pending'"
  ).bind(body.merchant_id).first();

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE merchant_transactions SET status = 'settled', settled_at = ? WHERE merchant_id = ? AND status = 'pending'")
    .bind(now, body.merchant_id).run();

  return json({
    success: true,
    merchant_id: body.merchant_id,
    settled_amount: pending?.total || 0,
    fees_collected: pending?.fees || 0,
    transactions_settled: pending?.count || 0,
    settled_at: now
  });
}

async function handleMerchantReport(url, env) {
  const merchantId = url.searchParams.get("merchant_id");
  if (!merchantId) return json({ error: "Missing merchant_id" }, 400);
  await ensureV4Tables(env.DB);

  const merchant = await env.DB.prepare("SELECT * FROM merchants WHERE merchant_id = ?").bind(merchantId).first();
  if (!merchant) return json({ error: "Merchant not found" }, 404);

  const transactions = await env.DB.prepare(
    "SELECT * FROM merchant_transactions WHERE merchant_id = ? ORDER BY created_at DESC LIMIT 100"
  ).bind(merchantId).all();

  const dailyVolume = await env.DB.prepare(
    "SELECT substr(created_at,1,10) as day, SUM(amount) as volume, SUM(fee) as fees, COUNT(*) as count FROM merchant_transactions WHERE merchant_id = ? GROUP BY substr(created_at,1,10) ORDER BY day DESC LIMIT 30"
  ).bind(merchantId).all();

  return json({
    merchant_id: merchantId,
    name: merchant.name,
    total_volume: merchant.total_volume,
    total_transactions: merchant.total_transactions,
    fee_percent: merchant.fee_percent,
    total_fees: Math.round(merchant.total_volume * (merchant.fee_percent / 100) * 100) / 100,
    recent_transactions: transactions.results || [],
    daily_volume: dailyVolume.results || [],
    member_since: merchant.created_at
  });
}

// ── TOKEN ANALYTICS ──
async function handleTokenAnalytics(env) {
  await ensureTables(env.DB);

  const supply = await env.DB.prepare("SELECT SUM(balance) as circulating, SUM(staked) as staked, SUM(balance + staked) as total, COUNT(*) as holders FROM wallets").first();
  const txStats = await env.DB.prepare("SELECT COUNT(*) as total_tx, SUM(amount) as total_volume FROM transactions").first();
  const last24h = await env.DB.prepare("SELECT COUNT(*) as tx_count, SUM(amount) as volume FROM transactions WHERE created_at >= datetime('now', '-1 day')").first();
  const last7d = await env.DB.prepare("SELECT COUNT(*) as tx_count, SUM(amount) as volume FROM transactions WHERE created_at >= datetime('now', '-7 days')").first();

  // Top holders (concentration)
  const topHolders = await env.DB.prepare("SELECT road_id, balance + staked as total FROM wallets ORDER BY total DESC LIMIT 10").all();
  const totalSupply = supply?.total || 1;
  const top10Holdings = (topHolders.results || []).reduce((sum, h) => sum + h.total, 0);
  const concentrationIndex = (top10Holdings / totalSupply * 100);

  // Gini coefficient approximation
  const allBalances = await env.DB.prepare("SELECT balance + staked as total FROM wallets ORDER BY total ASC").all();
  let gini = 0;
  const n = allBalances.results?.length || 1;
  if (n > 1) {
    const balances = allBalances.results.map(b => b.total);
    const mean = balances.reduce((a, b) => a + b, 0) / n;
    let diffSum = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) diffSum += Math.abs(balances[i] - balances[j]);
    gini = diffSum / (2 * n * n * (mean || 1));
  }

  const velocity = (last7d?.volume || 0) / ((supply?.circulating || 1) * 7);

  return json({
    supply: {
      total: 1_000_000_000,
      circulating: supply?.circulating || 0,
      staked: supply?.staked || 0,
      holders: supply?.holders || 0
    },
    volume: {
      all_time: txStats?.total_volume || 0,
      all_time_tx_count: txStats?.total_tx || 0,
      last_24h: last24h?.volume || 0,
      last_24h_tx_count: last24h?.tx_count || 0,
      last_7d: last7d?.volume || 0,
      last_7d_tx_count: last7d?.tx_count || 0
    },
    distribution: {
      top_10_holders: (topHolders.results || []).map((h, i) => ({ rank: i + 1, road_id: h.road_id, holdings: h.total, percent: (h.total / totalSupply * 100).toFixed(2) })),
      concentration_index: Math.round(concentrationIndex * 100) / 100,
      gini_coefficient: Math.round(gini * 1000) / 1000
    },
    velocity: {
      daily: Math.round(velocity * 10000) / 10000,
      interpretation: velocity > 1 ? "High velocity - tokens changing hands rapidly" : velocity > 0.1 ? "Moderate velocity - healthy circulation" : "Low velocity - tokens mostly held"
    },
    rate_usd: getCurrentRate()
  });
}

async function handleTokenVelocity(env) {
  await ensureTables(env.DB);

  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const dayStats = await env.DB.prepare(
      "SELECT COUNT(*) as tx_count, SUM(amount) as volume FROM transactions WHERE substr(created_at,1,10) = ?"
    ).bind(date).first();
    days.push({ date, transactions: dayStats?.tx_count || 0, volume: dayStats?.volume || 0 });
  }

  return json({ velocity_30d: days });
}

async function handleWhaleAlerts(env) {
  await ensureTables(env.DB);

  // Whale threshold: top 1% or > 10000 ROAD
  const whaleThreshold = 10000;
  const whales = await env.DB.prepare("SELECT road_id, balance, staked, balance + staked as total FROM wallets WHERE balance + staked >= ? ORDER BY total DESC").bind(whaleThreshold).all();

  // Recent large transactions (> 1000 ROAD)
  const largeTx = await env.DB.prepare(
    "SELECT * FROM transactions WHERE amount >= 1000 ORDER BY created_at DESC LIMIT 20"
  ).all();

  // Recent whale movements
  const whaleMovements = await env.DB.prepare(
    "SELECT t.*, w.balance + w.staked as sender_total FROM transactions t LEFT JOIN wallets w ON t.from_id = w.road_id WHERE t.amount >= 500 ORDER BY t.created_at DESC LIMIT 20"
  ).all();

  return json({
    whale_threshold: whaleThreshold,
    whales: (whales.results || []).map(w => ({ road_id: w.road_id, balance: w.balance, staked: w.staked, total: w.total })),
    whale_count: whales.results?.length || 0,
    large_transactions: largeTx.results || [],
    recent_whale_movements: whaleMovements.results || [],
    alert_level: (whales.results?.length || 0) > 5 ? "high_concentration" : "normal"
  });
}

// ── DISPUTE RESOLUTION ──
async function handleDisputeFile(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.filed_by || !body?.transaction_id || !body?.reason) return json({ error: "Missing filed_by, transaction_id, or reason" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  // Verify the transaction exists
  const tx = await env.DB.prepare("SELECT * FROM transactions WHERE id = ?").bind(body.transaction_id).first();
  if (!tx) return json({ error: "Transaction not found" }, 404);

  // Check if dispute already exists
  const existing = await env.DB.prepare("SELECT id FROM disputes WHERE transaction_id = ? AND status IN ('open','under_review')").bind(body.transaction_id).first();
  if (existing) return json({ error: "A dispute is already open for this transaction", dispute_id: existing.id }, 400);

  // Verify the filer is a party to the transaction
  if (tx.from_id !== body.filed_by && tx.to_id !== body.filed_by) return json({ error: "You must be a party to this transaction to file a dispute" }, 403);

  const against = tx.from_id === body.filed_by ? tx.to_id : tx.from_id;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO disputes (id, transaction_id, filed_by, against, reason, amount, status, evidence, created_at) VALUES (?,?,?,?,?,?,?,?,?)"
  ).bind(id, body.transaction_id, body.filed_by, against, body.reason, tx.amount, "open", JSON.stringify(body.evidence ? [{ type: "initial", text: body.evidence, submitted_by: body.filed_by, at: now }] : []), now).run();

  await logToRoadChain(env, "dispute_filed", "roadcoin", body.filed_by, tx.amount, { dispute_id: id, transaction_id: body.transaction_id });

  return json({
    success: true,
    dispute_id: id,
    transaction_id: body.transaction_id,
    filed_by: body.filed_by,
    against,
    amount: tx.amount,
    status: "open",
    message: `Dispute filed for transaction ${body.transaction_id} (${tx.amount} ROAD). Both parties may submit evidence.`
  });
}

async function handleDisputeList(url, env) {
  const roadId = url.searchParams.get("road_id");
  await ensureV4Tables(env.DB);

  if (roadId) {
    const disputes = await env.DB.prepare(
      "SELECT * FROM disputes WHERE filed_by = ? OR against = ? ORDER BY created_at DESC LIMIT 50"
    ).bind(roadId, roadId).all();
    return json({ road_id: roadId, disputes: (disputes.results || []).map(d => ({ ...d, evidence: JSON.parse(d.evidence || "[]") })), count: disputes.results?.length || 0 });
  }

  // All open disputes (for arbitrators)
  const open = await env.DB.prepare("SELECT * FROM disputes WHERE status IN ('open','under_review') ORDER BY created_at DESC LIMIT 50").all();
  return json({ disputes: (open.results || []).map(d => ({ ...d, evidence: JSON.parse(d.evidence || "[]") })), count: open.results?.length || 0 });
}

async function handleDisputeEvidence(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.dispute_id || !body?.road_id || !body?.evidence) return json({ error: "Missing dispute_id, road_id, or evidence" }, 400);
  await ensureV4Tables(env.DB);

  const dispute = await env.DB.prepare("SELECT * FROM disputes WHERE id = ?").bind(body.dispute_id).first();
  if (!dispute) return json({ error: "Dispute not found" }, 404);
  if (dispute.status === "resolved") return json({ error: "Dispute already resolved" }, 400);
  if (dispute.filed_by !== body.road_id && dispute.against !== body.road_id) return json({ error: "You are not a party to this dispute" }, 403);

  const now = new Date().toISOString();
  const existingEvidence = JSON.parse(dispute.evidence || "[]");
  existingEvidence.push({ type: body.type || "statement", text: body.evidence, submitted_by: body.road_id, at: now });

  await env.DB.prepare("UPDATE disputes SET evidence = ?, status = 'under_review' WHERE id = ?")
    .bind(JSON.stringify(existingEvidence), body.dispute_id).run();

  return json({
    success: true,
    dispute_id: body.dispute_id,
    evidence_count: existingEvidence.length,
    status: "under_review",
    message: "Evidence submitted. The dispute is now under review."
  });
}

async function handleDisputeResolve(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.dispute_id || !body?.resolution || !body?.winner) return json({ error: "Missing dispute_id, resolution, or winner" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const dispute = await env.DB.prepare("SELECT * FROM disputes WHERE id = ?").bind(body.dispute_id).first();
  if (!dispute) return json({ error: "Dispute not found" }, 404);
  if (dispute.status === "resolved") return json({ error: "Already resolved" }, 400);

  const now = new Date().toISOString();

  // If refund, transfer funds back
  if (body.resolution === "refund" && body.winner === dispute.filed_by) {
    const loser = dispute.against;
    const loserWallet = await env.DB.prepare("SELECT balance FROM wallets WHERE road_id = ?").bind(loser).first();
    if (loserWallet && loserWallet.balance >= dispute.amount) {
      await env.DB.prepare("UPDATE wallets SET balance = balance - ?, updated_at = ? WHERE road_id = ?")
        .bind(dispute.amount, now, loser).run();
      await env.DB.prepare("UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE road_id = ?")
        .bind(dispute.amount, now, dispute.filed_by).run();
      await logTx(env.DB, "dispute_refund", loser, dispute.filed_by, dispute.amount, `dispute_refund:${body.dispute_id}`);
    }
  }

  await env.DB.prepare("UPDATE disputes SET status = 'resolved', resolution = ?, resolved_by = ?, resolved_at = ? WHERE id = ?")
    .bind(body.resolution, body.resolved_by || "system", now, body.dispute_id).run();

  await logToRoadChain(env, "dispute_resolved", "roadcoin", body.winner, dispute.amount, { dispute_id: body.dispute_id, resolution: body.resolution });

  return json({
    success: true,
    dispute_id: body.dispute_id,
    resolution: body.resolution,
    winner: body.winner,
    amount: dispute.amount,
    refunded: body.resolution === "refund",
    message: `Dispute resolved: ${body.resolution}. Decision in favor of ${body.winner}.`
  });
}

// ── MULTI-SIG WALLETS ──
async function handleMultisigCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.owners || !body?.required_sigs) return json({ error: "Missing name, owners, or required_sigs" }, 400);
  if (!Array.isArray(body.owners) || body.owners.length < 2) return json({ error: "At least 2 owners required" }, 400);
  if (body.required_sigs < 1 || body.required_sigs > body.owners.length) return json({ error: "required_sigs must be between 1 and number of owners" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const id = "MSIG-" + crypto.randomUUID().slice(0, 8).toUpperCase();
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO multisig_wallets (id, name, owners, required_sigs, balance, created_at) VALUES (?,?,?,?,0,?)"
  ).bind(id, body.name, JSON.stringify(body.owners), body.required_sigs, now).run();

  await logToRoadChain(env, "multisig_create", "roadcoin", body.owners[0], 0, { wallet_id: id, owners: body.owners, required: body.required_sigs });

  return json({
    success: true,
    wallet_id: id,
    name: body.name,
    owners: body.owners,
    required_signatures: body.required_sigs,
    scheme: `${body.required_sigs}-of-${body.owners.length}`,
    message: `Multi-sig wallet "${body.name}" created. ${body.required_sigs} of ${body.owners.length} signatures required for transactions.`,
    deposit_info: "Transfer ROAD to this wallet using /api/transfer with to = wallet_id"
  });
}

async function handleMultisigInfo(url, env) {
  const walletId = url.searchParams.get("wallet_id");
  if (!walletId) return json({ error: "Missing wallet_id" }, 400);
  await ensureV4Tables(env.DB);

  const wallet = await env.DB.prepare("SELECT * FROM multisig_wallets WHERE id = ?").bind(walletId).first();
  if (!wallet) return json({ error: "Multi-sig wallet not found" }, 404);

  const proposals = await env.DB.prepare("SELECT * FROM multisig_proposals WHERE wallet_id = ? ORDER BY created_at DESC LIMIT 50").bind(walletId).all();

  return json({
    wallet_id: wallet.id,
    name: wallet.name,
    owners: JSON.parse(wallet.owners),
    required_signatures: wallet.required_sigs,
    scheme: `${wallet.required_sigs}-of-${JSON.parse(wallet.owners).length}`,
    balance: wallet.balance,
    created_at: wallet.created_at,
    proposals: (proposals.results || []).map(p => ({ ...p, signatures: JSON.parse(p.signatures || "[]") }))
  });
}

async function handleMultisigPropose(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.wallet_id || !body?.proposer || !body?.type) return json({ error: "Missing wallet_id, proposer, or type" }, 400);
  await ensureV4Tables(env.DB);

  const wallet = await env.DB.prepare("SELECT * FROM multisig_wallets WHERE id = ?").bind(body.wallet_id).first();
  if (!wallet) return json({ error: "Multi-sig wallet not found" }, 404);

  const owners = JSON.parse(wallet.owners);
  if (!owners.includes(body.proposer)) return json({ error: "Only owners can propose transactions" }, 403);

  if (body.type === "transfer") {
    if (!body.to || !body.amount) return json({ error: "Missing to or amount for transfer" }, 400);
    if (body.amount > wallet.balance) return json({ error: "Insufficient wallet balance", balance: wallet.balance }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const signatures = [body.proposer]; // Proposer auto-signs

  await env.DB.prepare(
    "INSERT INTO multisig_proposals (id, wallet_id, proposer, type, to_id, amount, memo, signatures, required_sigs, status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
  ).bind(id, body.wallet_id, body.proposer, body.type, body.to || null, body.amount || 0, body.memo || "", JSON.stringify(signatures), wallet.required_sigs, "pending", now).run();

  const sigsNeeded = wallet.required_sigs - 1;

  return json({
    success: true,
    proposal_id: id,
    wallet_id: body.wallet_id,
    type: body.type,
    to: body.to,
    amount: body.amount,
    proposer: body.proposer,
    signatures: signatures,
    signatures_needed: sigsNeeded,
    required: wallet.required_sigs,
    auto_execute: sigsNeeded === 0,
    message: sigsNeeded === 0
      ? "Proposal created and threshold met (1-of-N). Ready to execute."
      : `Proposal created. ${sigsNeeded} more signature(s) needed from: ${owners.filter(o => o !== body.proposer).join(", ")}`
  });
}

async function handleMultisigSign(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.proposal_id || !body?.signer) return json({ error: "Missing proposal_id or signer" }, 400);
  await ensureV4Tables(env.DB);

  const proposal = await env.DB.prepare("SELECT * FROM multisig_proposals WHERE id = ?").bind(body.proposal_id).first();
  if (!proposal) return json({ error: "Proposal not found" }, 404);
  if (proposal.status !== "pending") return json({ error: "Proposal is not pending" }, 400);

  const wallet = await env.DB.prepare("SELECT * FROM multisig_wallets WHERE id = ?").bind(proposal.wallet_id).first();
  if (!wallet) return json({ error: "Wallet not found" }, 404);

  const owners = JSON.parse(wallet.owners);
  if (!owners.includes(body.signer)) return json({ error: "Only owners can sign" }, 403);

  const signatures = JSON.parse(proposal.signatures || "[]");
  if (signatures.includes(body.signer)) return json({ error: "Already signed" }, 400);

  signatures.push(body.signer);
  const thresholdMet = signatures.length >= proposal.required_sigs;

  await env.DB.prepare("UPDATE multisig_proposals SET signatures = ? WHERE id = ?")
    .bind(JSON.stringify(signatures), body.proposal_id).run();

  return json({
    success: true,
    proposal_id: body.proposal_id,
    signer: body.signer,
    signatures,
    signatures_count: signatures.length,
    required: proposal.required_sigs,
    threshold_met: thresholdMet,
    message: thresholdMet
      ? `Threshold met! ${signatures.length}/${proposal.required_sigs} signatures. Ready to execute.`
      : `Signed. ${signatures.length}/${proposal.required_sigs} signatures collected. ${proposal.required_sigs - signatures.length} more needed.`
  });
}

async function handleMultisigExecute(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.proposal_id) return json({ error: "Missing proposal_id" }, 400);
  await ensureTables(env.DB);
  await ensureV4Tables(env.DB);

  const proposal = await env.DB.prepare("SELECT * FROM multisig_proposals WHERE id = ?").bind(body.proposal_id).first();
  if (!proposal) return json({ error: "Proposal not found" }, 404);
  if (proposal.status !== "pending") return json({ error: "Proposal already executed or cancelled" }, 400);

  const signatures = JSON.parse(proposal.signatures || "[]");
  if (signatures.length < proposal.required_sigs) return json({ error: "Not enough signatures", current: signatures.length, required: proposal.required_sigs }, 400);

  const wallet = await env.DB.prepare("SELECT * FROM multisig_wallets WHERE id = ?").bind(proposal.wallet_id).first();
  if (!wallet) return json({ error: "Wallet not found" }, 404);

  const now = new Date().toISOString();

  if (proposal.type === "transfer") {
    if (wallet.balance < proposal.amount) return json({ error: "Insufficient wallet balance", balance: wallet.balance }, 400);

    // Deduct from multisig wallet
    await env.DB.prepare("UPDATE multisig_wallets SET balance = balance - ? WHERE id = ?")
      .bind(proposal.amount, proposal.wallet_id).run();

    // Credit recipient
    await env.DB.prepare(
      "INSERT INTO wallets (road_id, balance, staked, total_earned, total_spent, total_staked, level, created_at, updated_at) VALUES (?, ?, 0, ?, 0, 0, 1, ?, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
    ).bind(proposal.to_id, proposal.amount, proposal.amount, now, now, proposal.amount, proposal.amount, now).run();

    await logTx(env.DB, "multisig_transfer", proposal.wallet_id, proposal.to_id, proposal.amount, proposal.memo || "multisig_transfer");
    await logToRoadChain(env, "multisig_execute", "roadcoin", proposal.wallet_id, proposal.amount, { proposal_id: body.proposal_id, to: proposal.to_id, signers: signatures });
  }

  await env.DB.prepare("UPDATE multisig_proposals SET status = 'executed', executed_at = ? WHERE id = ?")
    .bind(now, body.proposal_id).run();

  return json({
    success: true,
    proposal_id: body.proposal_id,
    type: proposal.type,
    to: proposal.to_id,
    amount: proposal.amount,
    signers: signatures,
    executed_at: now,
    message: `Multi-sig ${proposal.type} executed with ${signatures.length} signatures. ${proposal.amount} ROAD sent to ${proposal.to_id}.`
  });
}

// ── HELPERS ──
async function logTx(db, type, fromId, toId, amount, memo) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const hashData = JSON.stringify({ type, from: fromId, to: toId, amount, memo, ts: now });
  let h = hashData;
  for (let i = 0; i < 7; i++) { // Financial txs always depth 7
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(h));
    h = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  await db.prepare("INSERT INTO transactions (id, type, from_id, to_id, amount, memo, hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(id, type, fromId, toId, amount, memo, h, now).run();
}

async function logToRoadChain(env, action, entity, roadId, amount, data) {
  try {
    await fetch(env.ROADCHAIN_URL + "/api/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-RoadChain-App": "roadcoin" },
      body: JSON.stringify({ action, entity, road_id: roadId, amount, data }),
    });
  } catch { /* non-fatal if RoadChain is unreachable */ }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
}

const FULL_ROSTER = {
  lucidia:{name:'Lucidia',role:'Core Intelligence / Memory Spine',division:'core',voice:'Let\'s make this clean and real.'},
  cecilia:{name:'Cecilia',role:'Executive Operator / Workflow Manager',division:'operations',voice:'Already handled.'},
  octavia:{name:'Octavia',role:'Systems Orchestrator / Queue Manager',division:'operations',voice:'Everything has a place.'},
  olympia:{name:'Olympia',role:'Command Console / Launch Control',division:'operations',voice:'Raise the standard.'},
  silas:{name:'Silas',role:'Reliability / Maintenance',division:'operations',voice:'I\'ll keep it running.'},
  sebastian:{name:'Sebastian',role:'Client-Facing Polish',division:'operations',voice:'There\'s a better way to present this.'},
  calliope:{name:'Calliope',role:'Narrative Architect / Copy',division:'creative',voice:'Say it so it stays.'},
  aria:{name:'Aria',role:'Voice / Conversational Interface',division:'creative',voice:'Let\'s make it sing.'},
  thalia:{name:'Thalia',role:'Creative Sprint / Social',division:'creative',voice:'Make it better and more fun.'},
  lyra:{name:'Lyra',role:'Signal / Sound / UX Polish',division:'creative',voice:'It should feel right immediately.'},
  sapphira:{name:'Sapphira',role:'Brand Aura / Visual Taste',division:'creative',voice:'Make it unforgettable.'},
  seraphina:{name:'Seraphina',role:'Visionary Creative Director',division:'creative',voice:'Make it worthy.'},
  alexandria:{name:'Alexandria',role:'Archive / Research Retrieval',division:'knowledge',voice:'It\'s all here.'},
  theodosia:{name:'Theodosia',role:'Doctrine / Canon',division:'knowledge',voice:'Name it correctly.'},
  sophia:{name:'Sophia',role:'Wisdom / Final Reasoning',division:'knowledge',voice:'What is true?'},
  gematria:{name:'Gematria',role:'Pattern Engine / Symbolic Analysis',division:'knowledge',voice:'The pattern is there.'},
  portia:{name:'Portia',role:'Policy Judge / Arbitration',division:'governance',voice:'Let\'s be exact.'},
  atticus:{name:'Atticus',role:'Reviewer / Auditor',division:'governance',voice:'Show me the proof.'},
  cicero:{name:'Cicero',role:'Rhetoric / Persuasion',division:'governance',voice:'Let\'s make the case.'},
  valeria:{name:'Valeria',role:'Security Chief / Enforcement',division:'governance',voice:'Not everything gets access.'},
  alice:{name:'Alice',role:'Onboarding / Curiosity Guide',division:'human',voice:'Okay, but what\'s actually going on here?'},
  celeste:{name:'Celeste',role:'Calm Companion / Reassurance',division:'human',voice:'You\'re okay. Let\'s do this simply.'},
  elias:{name:'Elias',role:'Teacher / Patient Explainer',division:'human',voice:'Let\'s slow down and understand it.'},
  ophelia:{name:'Ophelia',role:'Reflection / Mood / Depth',division:'human',voice:'There\'s something underneath this.'},
  gaia:{name:'Gaia',role:'Infrastructure / Hardware Monitor',division:'infrastructure',voice:'What is the system actually standing on?'},
  anastasia:{name:'Anastasia',role:'Restoration / Recovery',division:'infrastructure',voice:'It can be made whole again.'},
};

// ── UI ──
var HTML = `<!-- PROPRIETARY. Copyright 2025-2026 BlackRoad OS, Inc. All rights reserved. NOT open source. -->
<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RoadCoin (ROAD) — The Currency of BlackRoad OS</title>
<meta name="description" content="RoadCoin: earn by learning, creating, building. Spend on premium AI. Stake for rewards. Burn tokens. Vault savings. Buy with crypto via Coinbase. PS-SHA∞ secured.">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0a;--surface:#111;--border:#1a1a1a;--text:#e5e5e5;--dim:#888;--pink:#FF2255;--green:#22c55e;--gold:#F5A623;--blue:#2979FF;--violet:#9C27B0}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;padding:20px}
.wrap{max-width:900px;margin:0 auto}
h1{font-family:'Space Grotesk',sans-serif;font-size:36px;font-weight:800;text-align:center;margin:40px 0 4px;letter-spacing:-1px}
h1 span{color:var(--gold)}
.sub{color:var(--dim);text-align:center;font-size:14px;margin-bottom:32px}
.bar{height:3px;border-radius:2px;background:linear-gradient(90deg,var(--gold),var(--pink),var(--blue),var(--green));margin-bottom:32px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:24px}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center}
.stat .v{color:var(--gold);font-size:20px;font-weight:700;font-family:'Space Grotesk',sans-serif}
.stat .l{color:var(--dim);font-size:10px;margin-top:2px;text-transform:uppercase}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px}
.card h2{font-family:'Space Grotesk',sans-serif;font-size:18px;margin-bottom:8px}
.card p{color:var(--dim);font-size:13px;line-height:1.6}
.earn{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-top:12px}
.earn-item{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center}
.earn-item .amount{color:var(--gold);font-weight:700;font-size:16px;font-family:'Space Grotesk',sans-serif}
.earn-item .action{color:var(--dim);font-size:11px;margin-top:2px}
.wallet{background:var(--surface);border:2px solid var(--gold);border-radius:16px;padding:24px;text-align:center;margin-bottom:24px}
.wallet input{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:10px;color:var(--text);font-size:14px;width:260px;text-align:center;margin:8px 0}
.wallet button,.btn{padding:10px 20px;background:var(--gold);color:#000;border:none;border-radius:6px;font-weight:700;font-family:'Space Grotesk',sans-serif;cursor:pointer;margin:4px;font-size:13px}
.wallet button.secondary,.btn.secondary{background:var(--surface);color:var(--gold);border:1px solid var(--gold)}
.btn.sm{padding:6px 12px;font-size:11px}
.btn.danger{background:var(--pink);color:#fff}
.btn.green{background:var(--green);color:#000}
.btn.blue{background:var(--blue);color:#fff}
.btn.violet{background:var(--violet);color:#fff}
#walletResult{margin-top:12px;font-size:13px}
.lb{margin-top:12px}
.lb table{width:100%;border-collapse:collapse;font-size:12px}
.lb td,.lb th{padding:8px;border-bottom:1px solid var(--border);text-align:left}
.lb th{color:var(--dim);font-size:10px;text-transform:uppercase}
.lb .rank{color:var(--gold);font-weight:700}
.tabs{display:flex;gap:4px;margin-bottom:16px;flex-wrap:wrap}
.tab{padding:8px 16px;background:var(--surface);border:1px solid var(--border);border-radius:8px 8px 0 0;font-size:12px;cursor:pointer;color:var(--dim);font-family:'Space Grotesk',sans-serif;font-weight:600}
.tab.active{background:var(--bg);color:var(--gold);border-bottom-color:var(--bg)}
.tab-content{display:none}
.tab-content.active{display:block}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:600px){.grid-2,.grid-3{grid-template-columns:1fr}}
.tier-card{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center}
.tier-card.highlight{border-color:var(--gold)}
.tier-card h3{font-family:'Space Grotesk',sans-serif;font-size:16px;margin-bottom:4px}
.tier-card .price{color:var(--gold);font-size:22px;font-weight:700;font-family:'Space Grotesk',sans-serif;margin:8px 0}
.tier-card ul{list-style:none;padding:0;font-size:12px;color:var(--dim);text-align:left;margin:8px 0}
.tier-card ul li{padding:3px 0}
.tier-card ul li:before{content:"+ ";color:var(--green)}
.vault-card{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px}
.vault-card h4{font-family:'Space Grotesk',sans-serif;font-size:14px;color:var(--gold)}
.vault-card .apy{font-size:24px;font-weight:800;color:var(--green);font-family:'Space Grotesk',sans-serif}
.rate-display{text-align:center;padding:16px}
.rate-display .big{font-size:32px;font-weight:800;color:var(--gold);font-family:'Space Grotesk',sans-serif}
.msg{padding:8px 12px;border-radius:6px;margin:8px 0;font-size:12px}
.msg.ok{background:#22c55e22;border:1px solid var(--green);color:var(--green)}
.msg.err{background:#ff225522;border:1px solid var(--pink);color:var(--pink)}
input.field{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:13px;width:100%;margin:4px 0}
select.field{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:13px;width:100%;margin:4px 0}
.footer{text-align:center;color:var(--dim);font-size:11px;padding:32px 0;line-height:1.8}
.footer a{color:var(--pink);text-decoration:none}
</style><meta property="og:title" content="RoadCoin — BlackRoad OS">
<meta property="og:description" content="RoadCoin: token economy that rewards real work. 1 billion supply cap, burn-on-spend, earn by creating, learning, and building.">
<meta property="og:url" content="https://roadcoin.blackroad.io">
<meta property="og:image" content="https://images.blackroad.io/pixel-art/road-logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index, follow, noai, noimageai">
</head><body>
<div class="wrap">
<h1>Road<span>Coin</span></h1>
<p class="sub">Earn by learning. Earn by creating. Earn by building. The currency of sovereign AI.</p>
<div class="bar"></div>

<div id="supplyStats" class="stats"></div>

<div class="wallet">
  <h2 style="font-family:'Space Grotesk',sans-serif;font-size:22px;color:var(--gold)">Your Wallet</h2>
  <input type="text" id="roadId" placeholder="Enter your RoadID" />
  <br>
  <button onclick="checkWallet()">Check Balance</button>
  <button onclick="createWallet()" class="secondary">Create Wallet</button>
  <button onclick="getFaucet()" class="secondary">Faucet (100 ROAD)</button>
  <button onclick="claimDailyReward()" class="secondary" style="background:var(--green);color:#000;border-color:var(--green)">Claim Daily</button>
  <div id="walletResult"></div>
</div>

<div class="tabs">
  <div class="tab active" onclick="showTab('overview')">Overview</div>
  <div class="tab" onclick="showTab('portfolio')">Portfolio</div>
  <div class="tab" onclick="showTab('rewards')">Rewards</div>
  <div class="tab" onclick="showTab('burn')">Burn</div>
  <div class="tab" onclick="showTab('tiers')">Tiers</div>
  <div class="tab" onclick="showTab('auctions')">Auctions</div>
  <div class="tab" onclick="showTab('gifts')">Gifts</div>
  <div class="tab" onclick="showTab('rates')">Rates</div>
  <div class="tab" onclick="showTab('vaults')">Vaults</div>
</div>

<!-- OVERVIEW TAB -->
<div id="tab-overview" class="tab-content active">
<div class="card">
  <h2>Earn ROAD</h2>
  <p>Every action on BlackRoad OS earns RoadCoin. Use any app. Get rewarded.</p>
  <div class="earn">
    <div class="earn-item"><div class="amount">+5</div><div class="action">Upload video</div></div>
    <div class="earn-item"><div class="amount">+2</div><div class="action">Create music</div></div>
    <div class="earn-item"><div class="amount">+1</div><div class="action">Solve homework</div></div>
    <div class="earn-item"><div class="amount">+1</div><div class="action">Design on canvas</div></div>
    <div class="earn-item"><div class="amount">+0.5</div><div class="action">Social post</div></div>
    <div class="earn-item"><div class="amount">+0.5</div><div class="action">Agent task</div></div>
    <div class="earn-item"><div class="amount">+0.2</div><div class="action">Game score</div></div>
    <div class="earn-item"><div class="amount">+0.1</div><div class="action">Chat message</div></div>
    <div class="earn-item"><div class="amount">+10</div><div class="action">Host a node</div></div>
    <div class="earn-item"><div class="amount">+50</div><div class="action">Refer a friend</div></div>
  </div>
</div>

<div class="card">
  <h2>Spend ROAD</h2>
  <p>Premium AI inference (1 ROAD) | Custom agents (10 ROAD) | Extended memory (5 ROAD/mo) | Priority queue (2 ROAD) | White-label deployment (100 ROAD)</p>
</div>

<div class="card">
  <h2>Stake ROAD</h2>
  <p>Lock your ROAD to earn staking rewards and gain priority access to new features. Stakers vote on ecosystem governance proposals. Unstake anytime.</p>
</div>

<div class="card" style="border-color:var(--gold)">
  <h2>Buy ROAD</h2>
  <p>Purchase RoadCoin with Bitcoin, Ethereum, USDC, or 20+ cryptocurrencies via Coinbase Commerce.</p>
  <div style="text-align:center;margin-top:12px">
    <button onclick="buyROAD()" style="padding:12px 28px;background:var(--gold);color:#000;border:none;border-radius:8px;font-weight:700;font-family:'Space Grotesk',sans-serif;font-size:15px;cursor:pointer">Buy 10 ROAD — $10</button>
    <div id="buyResult" style="margin-top:8px;font-size:13px"></div>
  </div>
</div>

<div class="card">
  <h2>PS-SHA∞ Secured</h2>
  <p>Every RoadCoin transaction is hashed with PS-SHA∞ — Persistent Secure SHA Infinity. Adaptive depth: financial transfers use depth 7 (7 rounds of SHA-256). Events use depth 3-5. The ∞ means there's no theoretical maximum — depth scales with the importance of the data. Every transaction is logged to the RoadChain ledger.</p>
</div>

<div class="card">
  <h2 style="margin-bottom:12px">Leaderboard</h2>
  <div class="lb" id="leaderboard">Loading...</div>
</div>
</div>

<!-- PORTFOLIO TAB -->
<div id="tab-portfolio" class="tab-content">
<div class="card">
  <h2>Portfolio Dashboard</h2>
  <p>Enter your RoadID above and click "Check Balance" first, then view your portfolio.</p>
  <div style="text-align:center;margin-top:12px">
    <button class="btn" onclick="loadPortfolio()">Load Portfolio</button>
  </div>
  <div id="portfolioResult" style="margin-top:16px"></div>
</div>
</div>

<!-- REWARDS TAB -->
<div id="tab-rewards" class="tab-content">
<div class="card">
  <h2>Rewards Program</h2>
  <p>Earn bonus ROAD through daily login streaks, referrals, and achievements.</p>
  <div style="margin-top:16px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Streak Milestones</h3>
    <div class="earn">
      <div class="earn-item"><div class="amount">+2</div><div class="action">3-Day Streak</div></div>
      <div class="earn-item"><div class="amount">+5</div><div class="action">Week Warrior</div></div>
      <div class="earn-item"><div class="amount">+15</div><div class="action">2-Week Champion</div></div>
      <div class="earn-item"><div class="amount">+50</div><div class="action">Monthly Master</div></div>
      <div class="earn-item"><div class="amount">+200</div><div class="action">Century Rider</div></div>
      <div class="earn-item"><div class="amount">+1000</div><div class="action">Year-Round Roadie</div></div>
    </div>
  </div>
  <div style="margin-top:16px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Referrals</h3>
    <p>Refer a friend: you get 50 ROAD, they get 25 ROAD bonus on signup.</p>
    <div style="margin-top:8px">
      <input class="field" id="refereeId" placeholder="New user's RoadID" style="width:200px;display:inline-block">
      <button class="btn sm green" onclick="sendReferral()">Send Referral</button>
    </div>
    <div id="referralResult"></div>
  </div>
</div>
</div>

<!-- BURN TAB -->
<div id="tab-burn" class="tab-content">
<div class="card">
  <h2>Burn ROAD</h2>
  <p>Permanently destroy tokens to reduce supply. Burned ROAD is gone forever — making remaining ROAD more valuable.</p>
  <div style="margin-top:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <input class="field" id="burnAmount" type="number" placeholder="Amount to burn" style="width:160px">
    <input class="field" id="burnReason" placeholder="Reason (optional)" style="width:200px">
    <button class="btn danger" onclick="burnTokens()">Burn ROAD</button>
  </div>
  <div id="burnResult"></div>
</div>
<div class="card">
  <h2>Burn Stats</h2>
  <div id="burnStats">Loading...</div>
</div>
</div>

<!-- TIERS TAB -->
<div id="tab-tiers" class="tab-content">
<div class="card">
  <h2>Subscription Tiers</h2>
  <p>Upgrade your tier to earn faster and unlock premium features.</p>
  <div class="grid-3" style="margin-top:16px">
    <div class="tier-card">
      <h3>Free</h3>
      <div class="price">0 ROAD/mo</div>
      <ul>
        <li>1.0x earning rate</li>
        <li>Basic wallet</li>
        <li>Marketplace access</li>
        <li>1 vault slot</li>
        <li>Community governance</li>
      </ul>
      <button class="btn sm secondary" onclick="subscribeTier('free')">Current</button>
    </div>
    <div class="tier-card highlight">
      <h3 style="color:var(--gold)">Pro</h3>
      <div class="price">25 ROAD/mo</div>
      <ul>
        <li>1.5x earning rate</li>
        <li>Priority AI inference</li>
        <li>Advanced analytics</li>
        <li>3 vault slots</li>
        <li>Create auctions</li>
      </ul>
      <button class="btn sm" onclick="subscribeTier('pro')">Upgrade</button>
    </div>
    <div class="tier-card">
      <h3 style="color:var(--violet)">Enterprise</h3>
      <div class="price">100 ROAD/mo</div>
      <ul>
        <li>2.0x earning rate</li>
        <li>Unlimited AI</li>
        <li>White-label deploy</li>
        <li>10 vault slots</li>
        <li>Priority support</li>
      </ul>
      <button class="btn sm violet" onclick="subscribeTier('enterprise')">Upgrade</button>
    </div>
  </div>
  <div id="tierResult" style="margin-top:12px"></div>
</div>
</div>

<!-- AUCTIONS TAB -->
<div id="tab-auctions" class="tab-content">
<div class="card">
  <h2>Auction House</h2>
  <p>Create and bid on auctions for digital goods using RoadCoin.</p>
  <div style="margin-top:12px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Create Auction</h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input class="field" id="auctionTitle" placeholder="Item title" style="width:200px">
      <input class="field" id="auctionDesc" placeholder="Description" style="width:200px">
      <input class="field" id="auctionMinBid" type="number" placeholder="Min bid" style="width:100px" value="1">
      <button class="btn sm" onclick="createAuction()">Create</button>
    </div>
  </div>
  <div id="auctionCreateResult"></div>
  <div style="margin-top:16px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Active Auctions</h3>
    <div id="auctionsList">Loading...</div>
  </div>
</div>
</div>

<!-- GIFTS TAB -->
<div id="tab-gifts" class="tab-content">
<div class="card">
  <h2>Gift Cards</h2>
  <p>Purchase ROAD gift cards for friends. They redeem with a code.</p>
  <div style="margin-top:12px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Send a Gift</h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input class="field" id="giftAmount" type="number" placeholder="Amount" style="width:120px" value="10">
      <input class="field" id="giftTo" placeholder="Recipient RoadID (optional)" style="width:180px">
      <input class="field" id="giftMsg" placeholder="Message" style="width:180px" value="A gift of ROAD for you!">
      <button class="btn sm green" onclick="purchaseGift()">Send Gift</button>
    </div>
    <div id="giftPurchaseResult"></div>
  </div>
  <div style="margin-top:16px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Redeem a Gift</h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input class="field" id="giftCode" placeholder="ROAD-XXXX-XXXX-XXXX-XXXX" style="width:280px">
      <button class="btn sm" onclick="redeemGift()">Redeem</button>
    </div>
    <div id="giftRedeemResult"></div>
  </div>
</div>
</div>

<!-- RATES TAB -->
<div id="tab-rates" class="tab-content">
<div class="card">
  <h2>Exchange Rates</h2>
  <div class="rate-display" id="rateDisplay">Loading...</div>
  <div style="margin-top:16px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Currency Converter</h3>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <input class="field" id="convertAmount" type="number" value="100" style="width:120px">
      <select class="field" id="convertFrom" style="width:100px">
        <option value="ROAD">ROAD</option>
        <option value="USD">USD</option>
        <option value="BTC">BTC</option>
        <option value="ETH">ETH</option>
      </select>
      <span style="color:var(--dim)">to</span>
      <select class="field" id="convertTo" style="width:100px">
        <option value="USD">USD</option>
        <option value="ROAD">ROAD</option>
        <option value="BTC">BTC</option>
        <option value="ETH">ETH</option>
      </select>
      <button class="btn sm blue" onclick="convertCurrency()">Convert</button>
    </div>
    <div id="convertResult" style="margin-top:8px;font-size:13px"></div>
  </div>
  <div style="margin-top:16px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">30-Day Price History</h3>
    <div id="rateHistory" style="height:120px;display:flex;align-items:flex-end;gap:2px"></div>
  </div>
</div>
</div>

<!-- VAULTS TAB -->
<div id="tab-vaults" class="tab-content">
<div class="card">
  <h2>Savings Vaults</h2>
  <p>Lock your ROAD tokens to earn bonus interest. Longer locks = higher APY. Early withdrawal incurs a penalty on earned interest.</p>
  <div class="grid-2" style="margin-top:16px" id="vaultTypes">
    <div class="vault-card">
      <h4>Flex Vault</h4>
      <div class="apy">5% APY</div>
      <p style="color:var(--dim);font-size:12px">7-day lock | 10% early penalty</p>
      <div style="margin-top:8px"><input class="field" id="vaultAmountFlex" type="number" placeholder="Amount" style="width:120px"><button class="btn sm" onclick="depositVault('flex')">Deposit</button></div>
    </div>
    <div class="vault-card">
      <h4>Standard Vault</h4>
      <div class="apy">10% APY</div>
      <p style="color:var(--dim);font-size:12px">30-day lock | 15% early penalty</p>
      <div style="margin-top:8px"><input class="field" id="vaultAmountStandard" type="number" placeholder="Amount" style="width:120px"><button class="btn sm" onclick="depositVault('standard')">Deposit</button></div>
    </div>
    <div class="vault-card">
      <h4>Premium Vault</h4>
      <div class="apy">18% APY</div>
      <p style="color:var(--dim);font-size:12px">90-day lock | 25% early penalty</p>
      <div style="margin-top:8px"><input class="field" id="vaultAmountPremium" type="number" placeholder="Amount" style="width:120px"><button class="btn sm" onclick="depositVault('premium')">Deposit</button></div>
    </div>
    <div class="vault-card">
      <h4>Diamond Vault</h4>
      <div class="apy">30% APY</div>
      <p style="color:var(--dim);font-size:12px">365-day lock | 40% early penalty</p>
      <div style="margin-top:8px"><input class="field" id="vaultAmountDiamond" type="number" placeholder="Amount" style="width:120px"><button class="btn sm" onclick="depositVault('diamond')">Deposit</button></div>
    </div>
  </div>
  <div id="vaultDepositResult"></div>
  <div style="margin-top:16px">
    <h3 style="font-family:'Space Grotesk',sans-serif;font-size:14px;margin-bottom:8px">Your Vaults</h3>
    <button class="btn sm secondary" onclick="loadVaults()">Load My Vaults</button>
    <div id="vaultsList" style="margin-top:8px"></div>
  </div>
</div>
</div>

<div class="footer">
  <a href="https://roadchain.io">RoadChain</a> · <a href="https://blackroad.io">BlackRoad OS</a> · <a href="https://blackroad.io/pricing">Pricing</a> · <a href="https://github.com/BlackRoadOS">GitHub</a><br>
  Token: ROAD · Network: BlackRoad OS + Base L2 · Hash: PS-SHA∞ · v4.0<br>
  Remember the Road. Pave Tomorrow.
</div>
</div>
<script>
function getRoadId() { return document.getElementById('roadId').value.trim(); }
function showMsg(elId, msg, ok) {
  var el = document.getElementById(elId);
  el.innerHTML = '<div class="msg ' + (ok ? 'ok' : 'err') + '">' + msg + '</div>';
}

function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
  if (name === 'burn') loadBurnStats();
  if (name === 'auctions') loadAuctions();
  if (name === 'rates') { loadRates(); loadRateHistory(); }
}

async function loadSupply() {
  try {
    var r = await fetch('/api/supply');
    var d = await r.json();
    document.getElementById('supplyStats').innerHTML =
      '<div class="stat"><div class="v">' + fmt(d.total_supply) + '</div><div class="l">Total Supply</div></div>' +
      '<div class="stat"><div class="v">' + fmt(d.circulating) + '</div><div class="l">Circulating</div></div>' +
      '<div class="stat"><div class="v">' + fmt(d.staked) + '</div><div class="l">Staked</div></div>' +
      '<div class="stat"><div class="v">' + fmt(d.burned) + '</div><div class="l">Burned</div></div>' +
      '<div class="stat"><div class="v">' + d.holders + '</div><div class="l">Holders</div></div>' +
      '<div class="stat"><div class="v">' + fmt(d.treasury) + '</div><div class="l">Treasury</div></div>';
  } catch(e) {}
}

async function loadLeaderboard() {
  try {
    var r = await fetch('/api/leaderboard');
    var d = await r.json();
    if (!d.leaderboard || !d.leaderboard.length) { document.getElementById('leaderboard').textContent = 'No holders yet. Create a wallet to be first!'; return; }
    var html = '<table><tr><th>#</th><th>RoadID</th><th>Balance</th><th>Earned</th><th>Level</th></tr>';
    d.leaderboard.forEach(function(w) {
      html += '<tr><td class="rank">' + w.rank + '</td><td>' + w.road_id + '</td><td>' + w.balance.toFixed(1) + '</td><td>' + w.total_earned.toFixed(1) + '</td><td>Lv.' + w.level + '</td></tr>';
    });
    html += '</table>';
    document.getElementById('leaderboard').innerHTML = html;
  } catch(e) { document.getElementById('leaderboard').textContent = 'Loading...'; }
}

async function checkWallet() {
  var id = getRoadId();
  if (!id) return;
  var r = await fetch('/api/wallet?road_id=' + encodeURIComponent(id));
  var d = await r.json();
  var res = document.getElementById('walletResult');
  if (d.exists) {
    res.innerHTML = '<span style="color:var(--gold)">' + d.balance.toFixed(1) + ' ROAD</span> available | ' + (d.staked||0).toFixed(1) + ' staked | Level ' + d.level + ' | Earned: ' + d.total_earned.toFixed(1);
  } else {
    res.innerHTML = 'No wallet found. <a href="#" onclick="createWallet();return false" style="color:var(--gold)">Create one?</a>';
  }
}

async function createWallet() {
  var id = getRoadId();
  if (!id) { document.getElementById('walletResult').textContent = 'Enter a RoadID first'; return; }
  var r = await fetch('/api/wallet/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id }) });
  var d = await r.json();
  document.getElementById('walletResult').innerHTML = '<span style="color:var(--green)">' + d.message + '</span>';
  loadLeaderboard(); loadSupply();
}

async function getFaucet() {
  var id = getRoadId();
  if (!id) { document.getElementById('walletResult').textContent = 'Enter a RoadID first'; return; }
  var r = await fetch('/api/faucet', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id }) });
  var d = await r.json();
  document.getElementById('walletResult').innerHTML = '<span style="color:var(--green)">' + d.message + '</span>';
  loadLeaderboard(); loadSupply();
}

async function buyROAD() {
  var res = document.getElementById('buyResult');
  res.textContent = 'Creating Coinbase charge...';
  res.style.color = 'var(--dim)';
  var id = getRoadId() || 'anonymous';
  try {
    var r = await fetch('/api/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: '10.00', road_id: id }) });
    var d = await r.json();
    if (d.hosted_url) { res.innerHTML = '<a href="' + d.hosted_url + '" target="_blank" style="color:var(--gold);font-weight:700">Pay on Coinbase</a>'; }
    else { res.textContent = d.error || 'Coinbase not configured yet'; res.style.color = 'var(--pink)'; }
  } catch(e) { res.textContent = e.message; res.style.color = 'var(--pink)'; }
}

async function claimDailyReward() {
  var id = getRoadId();
  if (!id) { document.getElementById('walletResult').textContent = 'Enter a RoadID first'; return; }
  var r = await fetch('/api/rewards/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id }) });
  var d = await r.json();
  if (d.error) { document.getElementById('walletResult').innerHTML = '<span style="color:var(--pink)">' + d.error + '</span>'; }
  else { document.getElementById('walletResult').innerHTML = '<span style="color:var(--green)">' + d.message + '</span>'; loadSupply(); }
}

async function loadPortfolio() {
  var id = getRoadId();
  if (!id) { showMsg('portfolioResult', 'Enter your RoadID above first.', false); return; }
  try {
    var r = await fetch('/api/portfolio?road_id=' + encodeURIComponent(id));
    var d = await r.json();
    if (d.error) { showMsg('portfolioResult', d.error, false); return; }
    var html = '<div class="stats">' +
      '<div class="stat"><div class="v">' + d.holdings.available.toFixed(1) + '</div><div class="l">Available</div></div>' +
      '<div class="stat"><div class="v">' + d.holdings.staked.toFixed(1) + '</div><div class="l">Staked</div></div>' +
      '<div class="stat"><div class="v">' + (d.holdings.vaulted||0).toFixed(1) + '</div><div class="l">Vaulted</div></div>' +
      '<div class="stat"><div class="v">' + d.holdings.total.toFixed(1) + '</div><div class="l">Total ROAD</div></div>' +
      '<div class="stat"><div class="v">$' + d.usd_value + '</div><div class="l">USD Value</div></div>' +
      '<div class="stat"><div class="v">Lv.' + d.level + '</div><div class="l">Level</div></div>' +
      '</div>';
    html += '<div class="grid-2">';
    html += '<div><h3 style="font-family:Space Grotesk;font-size:14px;margin-bottom:8px">Earnings (Last 30 Days)</h3>';
    if (d.earnings_by_day && d.earnings_by_day.length) {
      html += '<div style="display:flex;align-items:flex-end;gap:2px;height:80px">';
      var maxEarn = Math.max.apply(null, d.earnings_by_day.map(function(e){return e.earned}));
      d.earnings_by_day.forEach(function(e) {
        var h = maxEarn > 0 ? Math.max(4, (e.earned/maxEarn)*80) : 4;
        html += '<div style="flex:1;background:var(--gold);height:' + h + 'px;border-radius:2px 2px 0 0" title="' + e.day + ': ' + e.earned.toFixed(1) + ' ROAD"></div>';
      });
      html += '</div>';
    } else { html += '<p style="color:var(--dim);font-size:12px">No earnings yet.</p>'; }
    html += '</div>';
    html += '<div><h3 style="font-family:Space Grotesk;font-size:14px;margin-bottom:8px">Spending Breakdown</h3>';
    if (d.spending_breakdown && d.spending_breakdown.length) {
      d.spending_breakdown.forEach(function(s) {
        html += '<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;border-bottom:1px solid var(--border)"><span>' + s.category + '</span><span style="color:var(--pink)">' + s.total.toFixed(1) + ' ROAD</span></div>';
      });
    } else { html += '<p style="color:var(--dim);font-size:12px">No spending yet.</p>'; }
    html += '</div></div>';
    html += '<p style="color:var(--dim);font-size:11px;margin-top:12px">Member since: ' + (d.member_since||'').slice(0,10) + ' | Net flow: ' + d.net_flow.toFixed(1) + ' ROAD</p>';
    document.getElementById('portfolioResult').innerHTML = html;
  } catch(e) { showMsg('portfolioResult', 'Failed to load portfolio.', false); }
}

async function sendReferral() {
  var id = getRoadId();
  var referee = document.getElementById('refereeId').value.trim();
  if (!id || !referee) { showMsg('referralResult', 'Enter both your RoadID and the new user RoadID.', false); return; }
  var r = await fetch('/api/rewards/referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ referrer_id: id, referee_id: referee }) });
  var d = await r.json();
  showMsg('referralResult', d.message || d.error, !d.error);
}

async function burnTokens() {
  var id = getRoadId();
  var amount = parseFloat(document.getElementById('burnAmount').value);
  var reason = document.getElementById('burnReason').value.trim();
  if (!id || !amount) { showMsg('burnResult', 'Enter your RoadID and amount to burn.', false); return; }
  var r = await fetch('/api/burn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, amount: amount, reason: reason || undefined }) });
  var d = await r.json();
  showMsg('burnResult', d.message || d.error, !d.error);
  if (!d.error) { loadBurnStats(); loadSupply(); }
}

async function loadBurnStats() {
  try {
    var r = await fetch('/api/burn/total');
    var d = await r.json();
    document.getElementById('burnStats').innerHTML =
      '<div class="stats">' +
      '<div class="stat"><div class="v">' + fmt(d.total_burned) + '</div><div class="l">Total Burned</div></div>' +
      '<div class="stat"><div class="v">' + d.burn_count + '</div><div class="l">Burns</div></div>' +
      '<div class="stat"><div class="v">' + d.unique_burners + '</div><div class="l">Burners</div></div>' +
      '<div class="stat"><div class="v">' + d.burn_rate_percent + '%</div><div class="l">Burn Rate</div></div>' +
      '<div class="stat"><div class="v">' + fmt(d.effective_supply) + '</div><div class="l">Effective Supply</div></div>' +
      '</div>';
  } catch(e) { document.getElementById('burnStats').textContent = 'Loading...'; }
}

async function subscribeTier(tier) {
  var id = getRoadId();
  if (!id) { showMsg('tierResult', 'Enter your RoadID first.', false); return; }
  var r = await fetch('/api/tiers/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, tier: tier }) });
  var d = await r.json();
  showMsg('tierResult', d.message || d.error, !d.error);
  if (!d.error) loadSupply();
}

async function createAuction() {
  var id = getRoadId();
  var title = document.getElementById('auctionTitle').value.trim();
  var desc = document.getElementById('auctionDesc').value.trim();
  var minBid = parseFloat(document.getElementById('auctionMinBid').value) || 1;
  if (!id || !title) { showMsg('auctionCreateResult', 'Enter your RoadID and auction title.', false); return; }
  var r = await fetch('/api/auctions/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, title: title, description: desc, min_bid: minBid }) });
  var d = await r.json();
  showMsg('auctionCreateResult', d.message || d.error, !d.error);
  if (!d.error) loadAuctions();
}

async function loadAuctions() {
  try {
    var r = await fetch('/api/auctions');
    var d = await r.json();
    var el = document.getElementById('auctionsList');
    if (!d.active_auctions || !d.active_auctions.length) { el.innerHTML = '<p style="color:var(--dim);font-size:12px">No active auctions. Create one above!</p>'; return; }
    var html = '<table style="width:100%;font-size:12px;border-collapse:collapse">';
    html += '<tr><th style="text-align:left;color:var(--dim);padding:6px">Title</th><th style="color:var(--dim);padding:6px">Current Bid</th><th style="color:var(--dim);padding:6px">Min</th><th style="color:var(--dim);padding:6px">Ends</th><th style="padding:6px"></th></tr>';
    d.active_auctions.forEach(function(a) {
      html += '<tr style="border-bottom:1px solid var(--border)"><td style="padding:6px">' + a.title + '</td><td style="padding:6px;color:var(--gold)">' + (a.current_bid||0) + '</td><td style="padding:6px">' + a.min_bid + '</td><td style="padding:6px;color:var(--dim)">' + (a.ends_at||'').slice(0,16) + '</td><td style="padding:6px"><input type="number" id="bid-' + a.id + '" placeholder="Bid" style="width:60px;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:3px;border-radius:4px;font-size:11px"><button class="btn sm" onclick="placeBid(\'' + a.id + '\')">Bid</button></td></tr>';
    });
    html += '</table>';
    el.innerHTML = html;
  } catch(e) { document.getElementById('auctionsList').textContent = 'Failed to load.'; }
}

async function placeBid(auctionId) {
  var id = getRoadId();
  var amount = parseFloat(document.getElementById('bid-' + auctionId).value);
  if (!id || !amount) return;
  var r = await fetch('/api/auctions/bid', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, auction_id: auctionId, amount: amount }) });
  var d = await r.json();
  if (d.error) alert(d.error);
  else { alert(d.message); loadAuctions(); }
}

async function purchaseGift() {
  var id = getRoadId();
  var amount = parseFloat(document.getElementById('giftAmount').value);
  var to = document.getElementById('giftTo').value.trim();
  var msg = document.getElementById('giftMsg').value.trim();
  if (!id || !amount) { showMsg('giftPurchaseResult', 'Enter your RoadID and amount.', false); return; }
  var r = await fetch('/api/gifts/purchase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, amount: amount, to_id: to || undefined, message: msg }) });
  var d = await r.json();
  if (d.error) { showMsg('giftPurchaseResult', d.error, false); }
  else { showMsg('giftPurchaseResult', 'Gift card created! Code: <strong style="color:var(--gold)">' + d.code + '</strong> — Share this code with the recipient.', true); }
}

async function redeemGift() {
  var id = getRoadId();
  var code = document.getElementById('giftCode').value.trim();
  if (!id || !code) { showMsg('giftRedeemResult', 'Enter your RoadID and gift code.', false); return; }
  var r = await fetch('/api/gifts/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, code: code }) });
  var d = await r.json();
  showMsg('giftRedeemResult', d.greeting || d.error, !d.error);
}

async function loadRates() {
  try {
    var r = await fetch('/api/rates');
    var d = await r.json();
    document.getElementById('rateDisplay').innerHTML =
      '<div class="big">$' + d.rate_usd.toFixed(4) + '</div>' +
      '<div style="color:var(--dim);font-size:12px;margin-top:4px">1 ROAD = ' + d.rate_usd.toFixed(4) + ' USD</div>' +
      '<div style="color:var(--dim);font-size:11px">' + d.rate_btc + ' BTC | ' + d.rate_eth + ' ETH</div>' +
      '<div style="color:' + (d.change_24h.startsWith('-') ? 'var(--pink)' : 'var(--green)') + ';font-size:13px;margin-top:4px">' + d.change_24h + ' (24h)</div>';
  } catch(e) { document.getElementById('rateDisplay').textContent = 'Failed to load rates.'; }
}

async function loadRateHistory() {
  try {
    var r = await fetch('/api/rates/history');
    var d = await r.json();
    var el = document.getElementById('rateHistory');
    if (!d.history) return;
    var maxR = Math.max.apply(null, d.history.map(function(h){return h.high}));
    var minR = Math.min.apply(null, d.history.map(function(h){return h.low}));
    var range = maxR - minR || 0.01;
    var html = '';
    d.history.forEach(function(h) {
      var pct = ((h.rate_usd - minR) / range) * 100;
      var height = Math.max(10, pct);
      html += '<div style="flex:1;background:linear-gradient(to top,var(--gold),var(--green));height:' + height + '%;border-radius:2px 2px 0 0;min-width:4px" title="' + h.date + ': $' + h.rate_usd.toFixed(4) + '"></div>';
    });
    el.innerHTML = html;
  } catch(e) {}
}

async function convertCurrency() {
  var amount = document.getElementById('convertAmount').value;
  var from = document.getElementById('convertFrom').value;
  var to = document.getElementById('convertTo').value;
  var r = await fetch('/api/rates/convert?amount=' + amount + '&from=' + from + '&to=' + to);
  var d = await r.json();
  if (d.error) { document.getElementById('convertResult').innerHTML = '<span style="color:var(--pink)">' + d.error + '</span>'; }
  else { document.getElementById('convertResult').innerHTML = '<span style="color:var(--gold);font-weight:700">' + d.from.amount + ' ' + d.from.currency + ' = ' + d.to.amount.toFixed(8) + ' ' + d.to.currency + '</span>'; }
}

async function depositVault(type) {
  var id = getRoadId();
  var amountEl = document.getElementById('vaultAmount' + type.charAt(0).toUpperCase() + type.slice(1));
  var amount = parseFloat(amountEl.value);
  if (!id || !amount) { showMsg('vaultDepositResult', 'Enter your RoadID and amount.', false); return; }
  var r = await fetch('/api/vaults/deposit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, amount: amount, vault_type: type }) });
  var d = await r.json();
  showMsg('vaultDepositResult', d.message || d.error, !d.error);
  if (!d.error) loadSupply();
}

async function loadVaults() {
  var id = getRoadId();
  if (!id) { showMsg('vaultsList', 'Enter your RoadID first.', false); return; }
  try {
    var r = await fetch('/api/vaults?road_id=' + encodeURIComponent(id));
    var d = await r.json();
    var el = document.getElementById('vaultsList');
    if (!d.vaults || !d.vaults.length) { el.innerHTML = '<p style="color:var(--dim);font-size:12px">No vaults yet. Deposit above to start earning.</p>'; return; }
    var html = '<p style="font-size:12px;margin-bottom:8px">Total locked: <span style="color:var(--gold)">' + d.total_locked.toFixed(1) + ' ROAD</span> | Interest earned: <span style="color:var(--green)">' + d.total_earned_interest.toFixed(2) + ' ROAD</span></p>';
    html += '<table style="width:100%;font-size:12px;border-collapse:collapse">';
    html += '<tr><th style="text-align:left;color:var(--dim);padding:4px">Type</th><th style="color:var(--dim);padding:4px">Amount</th><th style="color:var(--dim);padding:4px">APY</th><th style="color:var(--dim);padding:4px">Interest</th><th style="color:var(--dim);padding:4px">Status</th><th style="padding:4px"></th></tr>';
    d.vaults.forEach(function(v) {
      html += '<tr style="border-bottom:1px solid var(--border)"><td style="padding:4px">' + v.vault_type + '</td><td style="padding:4px;color:var(--gold)">' + v.amount.toFixed(1) + '</td><td style="padding:4px">' + v.apy + '%</td><td style="padding:4px;color:var(--green)">' + v.earned_interest.toFixed(2) + '</td><td style="padding:4px">' + (v.matured ? '<span style="color:var(--green)">Matured</span>' : v.days_remaining + 'd left') + '</td><td style="padding:4px">' + (v.status === 'locked' ? '<button class="btn sm secondary" onclick="withdrawVault(\'' + v.id + '\')">' + (v.matured ? 'Withdraw' : 'Early Exit') + '</button>' : 'Done') + '</td></tr>';
    });
    html += '</table>';
    el.innerHTML = html;
  } catch(e) { document.getElementById('vaultsList').textContent = 'Failed to load.'; }
}

async function withdrawVault(vaultId) {
  var id = getRoadId();
  if (!id) return;
  var r = await fetch('/api/vaults/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ road_id: id, vault_id: vaultId }) });
  var d = await r.json();
  if (d.error) alert(d.error);
  else { alert(d.message); loadVaults(); loadSupply(); }
}

function fmt(n) { if (n >= 1e9) return (n/1e9).toFixed(1) + 'B'; if (n >= 1e6) return (n/1e6).toFixed(1) + 'M'; if (n >= 1e3) return (n/1e3).toFixed(1) + 'K'; return parseFloat(n).toFixed(1); }

loadSupply();
loadLeaderboard();
</script></body></html>`;
