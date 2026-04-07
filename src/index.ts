export interface Env { STORE: KVNamespace; DB: D1Database; SERVICE_NAME: string; VERSION: string; }
const SVC = "roadcoin";
function json(d: unknown, s = 200) { return new Response(JSON.stringify(d,null,2),{status:s,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","X-BlackRoad-Service":SVC}}); }
async function track(env: Env, req: Request, path: string) { const cf=(req as any).cf||{}; env.DB.prepare("INSERT INTO analytics(subdomain,path,country,ua,ts)VALUES(?,?,?,?,?)").bind(SVC,path,cf.country||"",req.headers.get("User-Agent")?.slice(0,150)||"",Date.now()).run().catch(()=>{}); }

async function getBalance(env: Env, addr: string): Promise<number> {
  const raw=await env.STORE.get(`bal:${addr}`);return raw?parseFloat(raw):0;
}
async function setBalance(env: Env, addr: string, bal: number): Promise<void> {
  await env.STORE.put(`bal:${addr}`,String(bal));
}
async function addTx(env: Env, from: string, to: string, amount: number, type: string, memo="") {
  const id=crypto.randomUUID();
  await env.STORE.put(`tx:${id}`,JSON.stringify({id,from,to,amount,type,memo,ts:Date.now()}),{expirationTtl:365*86400});
  const listRaw=await env.STORE.get(`txlist:${from}`);
  const list=listRaw?JSON.parse(listRaw):[];list.unshift(id);if(list.length>50)list.length=50;
  await env.STORE.put(`txlist:${from}`,JSON.stringify(list));
  const listRaw2=await env.STORE.get(`txlist:${to}`);
  const list2=listRaw2?JSON.parse(listRaw2):[];list2.unshift(id);if(list2.length>50)list2.length=50;
  await env.STORE.put(`txlist:${to}`,JSON.stringify(list2));
}

function page(): Response {
  const AGENTS=["roadie","lucidia","cecilia","aria","alice","octavia","olympia","calliope","anastasia","gematria","portia","thalia","silas","sebastian","elias","alexandria","theodosia","gaia","atticus","celeste","cicero","valeria","sapphira","lyra","ophelia","seraphina","sophia"];
  const html=`<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RoadCoin — ROAD Token</title>
<meta name="description" content="RoadCoin — ROAD token economy for BlackRoad OS agents. Check balances, transfer tokens, view the agent leaderboard.">
<link rel="canonical" href="https://roadcoin.blackroad.io/">
<meta property="og:title" content="RoadCoin — ROAD Token">
<meta property="og:description" content="ROAD token economy for BlackRoad OS agents. Balances, transfers, and leaderboard.">
<meta property="og:url" content="https://roadcoin.blackroad.io/">
<meta property="og:type" content="website">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"RoadCoin","url":"https://roadcoin.blackroad.io/","description":"ROAD token economy for BlackRoad OS agents","applicationCategory":"FinanceApplication","publisher":{"@type":"Organization","name":"BlackRoad OS, Inc.","url":"https://blackroad.io"}}</script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#030303;--card:#0a0a0a;--border:#111;--text:#f0f0f0;--sub:#444;--gold:#FF6B2B;--grad:linear-gradient(135deg,#FF6B2B,#FF2255,#FF00D4)}
html,body{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Space Grotesk',sans-serif}
.grad-bar{height:2px;background:var(--grad)}
.wrap{max-width:1000px;margin:0 auto;padding:32px 20px}
h1{font-size:2rem;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.sub{font-size:.75rem;color:var(--sub);font-family:'JetBrains Mono',monospace;margin-bottom:24px}
.hero-stat{text-align:center;padding:32px;background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:20px}
.hero-n{font-size:3rem;font-weight:700;color:var(--gold);font-family:'JetBrains Mono',monospace}
.hero-l{font-size:.75rem;color:var(--sub);font-family:'JetBrains Mono',monospace;margin-top:6px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:20px}
.ct{font-size:.65rem;color:var(--sub);text-transform:uppercase;letter-spacing:.08em;font-family:'JetBrains Mono',monospace;margin-bottom:14px}
label{display:block;font-size:.7rem;color:var(--sub);font-family:'JetBrains Mono',monospace;margin-bottom:4px;margin-top:10px;text-transform:uppercase}
input,select{width:100%;padding:9px 12px;background:#0d0d0d;border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:.82rem;outline:none}
input:focus,select:focus{border-color:var(--gold)}
.btn{margin-top:12px;padding:10px 20px;background:var(--gold);color:#000;border:none;border-radius:7px;cursor:pointer;font-weight:700;font-size:.85rem;width:100%}
.balance-card{background:#0d0d0d;border:1px solid var(--border);border-radius:8px;padding:16px;margin-top:10px;display:none}
.bal-addr{font-size:.68rem;color:var(--sub);font-family:'JetBrains Mono',monospace}
.bal-amount{font-size:2rem;font-weight:700;color:var(--gold)}
.leaderboard{display:flex;flex-direction:column;gap:5px}
.lb-item{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#0d0d0d;border:1px solid var(--border);border-radius:6px;font-size:.78rem}
.lb-rank{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--sub);width:20px}
.lb-name{font-weight:600;text-transform:capitalize}
.lb-bal{font-family:'JetBrains Mono',monospace;color:var(--gold);font-size:.75rem}
</style></head><body>
<div class="grad-bar"></div>
<div class="wrap">
<h1>RoadCoin</h1>
<div class="sub">roadcoin.blackroad.io · ROAD token · agent economy</div>
<div class="hero-stat">
  <div class="hero-n" id="circulating">—</div>
  <div class="hero-l">ROAD tokens in circulation</div>
</div>
<div class="grid">
  <div class="card">
    <div class="ct">Check Balance</div>
    <label>Address</label>
    <select id="bal-addr">
      <option value="">Select agent...</option>
      ${AGENTS.map(a=>`<option value="agent:${a}">${a}</option>`).join("")}
    </select>
    <input type="text" id="bal-custom" placeholder="Or type custom address..." style="margin-top:6px">
    <button class="btn" onclick="checkBalance()">Check Balance</button>
    <div class="balance-card" id="bal-result">
      <div class="bal-addr" id="bal-addr-display"></div>
      <div class="bal-amount" id="bal-amount">0</div>
      <div class="bal-addr">ROAD tokens</div>
    </div>
  </div>
  <div class="card">
    <div class="ct">Transfer</div>
    <label>From</label>
    <input type="text" id="t-from" placeholder="agent:roadie or alexa">
    <label>To</label>
    <input type="text" id="t-to" placeholder="agent:lucidia">
    <label>Amount</label>
    <input type="number" id="t-amount" placeholder="100" min="1">
    <label>Memo</label>
    <input type="text" id="t-memo" placeholder="payment for task #123">
    <button class="btn" onclick="transfer()">Transfer ROAD</button>
  </div>
  <div class="card" style="grid-column:1/-1">
    <div class="ct">Agent Leaderboard</div>
    <div class="leaderboard" id="leaderboard">Loading...</div>
  </div>
</div>
</div>
<script src="https://cdn.blackroad.io/br.js"></script>
<script>
var AGENTS=${JSON.stringify(AGENTS)};
async function loadCirculating(){
  var total=0;
  var results=await Promise.all(AGENTS.map(a=>fetch('/api/balance/agent:'+a).then(r=>r.json()).catch(()=>({balance:0}))));
  results.forEach(function(r){total+=r.balance||0;});
  document.getElementById('circulating').textContent=total.toFixed(0)+' ROAD';
}
async function loadLeaderboard(){
  var results=await Promise.all(AGENTS.map(a=>fetch('/api/balance/agent:'+a).then(r=>r.json()).then(d=>({name:a,balance:d.balance||0})).catch(()=>({name:a,balance:0}))));
  results.sort(function(a,b){return b.balance-a.balance;});
  document.getElementById('leaderboard').innerHTML=results.slice(0,10).map(function(r,i){return'<div class="lb-item"><div class="lb-rank">#'+(i+1)+'</div><div class="lb-name">'+r.name+'</div><div class="lb-bal">'+r.balance.toFixed(0)+' ROAD</div></div>';}).join('');
}
async function checkBalance(){
  var addr=document.getElementById('bal-custom').value.trim()||document.getElementById('bal-addr').value;
  if(!addr)return;
  var r=await fetch('/api/balance/'+encodeURIComponent(addr));var d=await r.json();
  document.getElementById('bal-result').style.display='block';
  document.getElementById('bal-addr-display').textContent=addr;
  document.getElementById('bal-amount').textContent=(d.balance||0).toFixed(2);
}
async function transfer(){
  var from=document.getElementById('t-from').value.trim();
  var to=document.getElementById('t-to').value.trim();
  var amount=parseFloat(document.getElementById('t-amount').value);
  var memo=document.getElementById('t-memo').value.trim();
  if(!from||!to||!amount){alert('Fill all fields');return;}
  var r=await fetch('/api/transfer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({from,to,amount,memo})});
  var d=await r.json();
  if(d.ok){alert('Transferred '+amount+' ROAD → '+to);loadCirculating();loadLeaderboard();}
  else alert('Error: '+d.error);
}
loadCirculating();loadLeaderboard();
</script>
</body></html>`;
  return new Response(html,{headers:{"Content-Type":"text/html;charset=UTF-8"}});
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*"}});
    const url=new URL(req.url);const path=url.pathname;const parts=path.split("/").filter(Boolean);
    track(env,req,path);
    if(path==="/health")return json({service:SVC,status:"ok",version:env.VERSION,ts:Date.now()});
    if(parts[0]==="api"&&parts[1]==="balance"&&parts[2]){
      const addr=decodeURIComponent(parts[2]);
      const bal=await getBalance(env,addr);
      return json({address:addr,balance:bal,symbol:"ROAD"});
    }
    if(path==="/api/transfer"&&req.method==="POST"){
      const b=await req.json() as any;
      if(!b.from||!b.to||!b.amount)return json({error:"from, to, amount required"},400);
      const fromBal=await getBalance(env,b.from);
      if(fromBal<b.amount)return json({error:"Insufficient balance",balance:fromBal},400);
      await setBalance(env,b.from,fromBal-b.amount);
      const toBal=await getBalance(env,b.to);
      await setBalance(env,b.to,toBal+b.amount);
      await addTx(env,b.from,b.to,b.amount,"transfer",b.memo||"");
      return json({ok:true,from:b.from,to:b.to,amount:b.amount,new_balance:fromBal-b.amount});
    }
    if(path==="/api/mint"&&req.method==="POST"){
      const b=await req.json() as any;
      if(!b.to||!b.amount)return json({error:"to and amount required"},400);
      const bal=await getBalance(env,b.to);
      await setBalance(env,b.to,bal+b.amount);
      await addTx(env,"mint",b.to,b.amount,"mint",b.memo||"");
      return json({ok:true,to:b.to,amount:b.amount,new_balance:bal+b.amount});
    }
    if(path==="/api/txs"&&req.method==="POST"){
      const {address}=await req.json() as any;
      const listRaw=await env.STORE.get(`txlist:${address}`);
      const ids=listRaw?JSON.parse(listRaw):[];
      const txs=await Promise.all(ids.slice(0,20).map(async(id:string)=>{const v=await env.STORE.get(`tx:${id}`);return v?JSON.parse(v):null;}));
      return json({address,transactions:txs.filter(Boolean)});
    }
    return page();
  }
};
