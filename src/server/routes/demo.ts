import { Router } from 'express'

export const demoRouter = Router()

demoRouter.get('/outcome', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(`<!doctype html>
<html><head><meta charset="utf-8"><title>Outcome Preview</title>
<style>body{font-family:system-ui,Segoe UI,Arial;margin:24px} label{display:block;margin:8px 0}</style>
</head><body>
  <h1>Outcome Meter Preview</h1>
  <p><a href="/demo/hud">Open minimal HUD demo</a></p>
  <form id="f">
    <label>DC <input id="dc" type="number" value="12"></label>
    <label>Attribute <input id="attr" type="number" value="3"></label>
    <label>Skill <input id="skill" type="number" value="2"></label>
    <label>Modifiers <input id="mods" type="number" value="1"></label>
    <label>Momentum <input id="mom" type="number" value="1"></label>
    <label>Attempts <input id="att" type="number" value="0"></label>
    <button type="submit">Calculate</button>
  </form>
  <pre id="out"></pre>

  <hr/>
  <h2>Classic (d20) Preview</h2>
  <div>
    <button id="classicBtn">Calculate Classic</button>
  </div>
  <pre id="classicOut"></pre>

  <hr/>
  <h2>TTC (Time-to-Complete) Preview</h2>
  <form id="fTtc">
    <label>Base Time (sec) <input id="baseTime" type="number" value="60"></label>
    <label>Difficulty Factor <input id="diff" type="number" step="0.1" value="1.0"></label>
    <label>Skill Rank <input id="skillRank" type="number" value="2"></label>
    <label>Expertise Rank <input id="expRank" type="number" value="1"></label>
    <label>Tool Quality (-1..2) <input id="toolQ" type="number" value="0"></label>
    <label>Situational (0.8..1.5) <input id="situ" type="number" step="0.1" value="1.0"></label>
    <button type="submit">Calculate TTC</button>
  </form>
  <pre id="ttcOut"></pre>
  <script>
  const f = document.getElementById('f');
  const out = document.getElementById('out');
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      dc: Number(dc.value), attribute: Number(attr.value), skill: Number(skill.value),
      modifiers: Number(mods.value), momentum: Number(mom.value), attempts: Number(att.value)
    };
    const res = await fetch('/api/outcome/preview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const json = await res.json();
    out.textContent = JSON.stringify(json, null, 2);
  });

  const classicBtn = document.getElementById('classicBtn');
  const classicOut = document.getElementById('classicOut');
  classicBtn.addEventListener('click', async () => {
    const body = {
      dc: Number(dc.value), attribute: Number(attr.value), skill: Number(skill.value),
      modifiers: Number(mods.value)
    };
    const res = await fetch('/api/outcome/classic', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const json = await res.json();
    classicOut.textContent = JSON.stringify(json, null, 2);
  });

  const fTtc = document.getElementById('fTtc');
  const ttcOut = document.getElementById('ttcOut');
  fTtc.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      baseTimeSec: Number(baseTime.value), difficultyFactor: Number(diff.value),
      skillRank: Number(skillRank.value), expertiseRank: Number(expRank.value),
      toolQuality: Number(toolQ.value), situational: Number(situ.value)
    };
    const res = await fetch('/api/outcome/ttc', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const json = await res.json();
    ttcOut.textContent = JSON.stringify(json, null, 2);
  });
  </script>
</body></html>`)
})

demoRouter.get('/hud', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(`<!doctype html>
<html><head><meta charset="utf-8"><title>HUD Demo</title>
<style>
body{font-family:system-ui,Segoe UI,Arial;margin:24px}
.bar{width:320px;height:16px;background:#eee;position:relative;border-radius:8px;overflow:hidden}
.fill{height:100%;background:#4caf50;width:0%}
.row{margin:12px 0}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.panel{border:1px solid #ddd;border-radius:8px;padding:12px}
</style>
</head><body>
  <h1>Vezy.ai — Vezy Up Your Galaxy</h1>
  <h2>Minimal HUD</h2>
  <div class="row">
    <label>Game Mode
      <select id="gameMode">
        <option value="hero">Hero</option>
        <option value="empire">Empire</option>
      </select>
    </label>
    <label style="margin-left:12px">Resolution Mode
      <select id="mode">
        <option value="outcome">Outcome</option>
        <option value="classic">Classic</option>
      </select>
    </label>
    <button id="save">Save</button>
  </div>
  <div class="row">
    <button id="tick">Encounter Tick</button>
    <div class="bar"><div id="clockFill" class="fill"></div></div>
  </div>
  <div class="row">
    <button id="preview">Preview Outcome</button>
    <div class="bar"><div id="successFill" class="fill" style="background:#2196f3"></div></div>
  </div>
  <div class="row">
    <button id="stepEngine">Step Engine</button>
  </div>
  <div class="grid">
    <div class="panel">
      <h3>Backpack</h3>
      <ul id="backpack"><li>Multitool</li><li>Medkit</li><li>Rations</li></ul>
    </div>
    <div class="panel">
      <h3>Credits & Resources</h3>
      <div>Credits: <span id="credits">1,000</span></div>
      <div>Alloys: <span id="alloys">20</span> | Fuel: <span id="fuel">50</span></div>
    </div>
    <div class="panel">
      <h3>Map / Planet</h3>
      <div>Planet: <strong>Vezara Prime</strong></div>
      <div>Location: Northern Reach — Sector 3</div>
    </div>
    <div class="panel">
      <h3>Empire</h3>
      <div>Name: <strong>Vezari Coalition</strong></div>
      <div>Holdings: 3 systems | Fleets: 2</div>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Backstory & History</h3>
      <textarea id="backstory" rows="4" style="width:100%" placeholder="Add a backstory..."></textarea>
      <button id="saveStory" style="margin-top:8px">Save Backstory</button>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Alien Civilizations — Diverse Personalities</h3>
      <ul>
        <li><strong>Qel’Nari</strong> — Stoic scientists, value logic and treaties.</li>
        <li><strong>Fyr’Kesh</strong> — Honor-bound warriors, competitive and proud.</li>
        <li><strong>Lumi’tha</strong> — Curious explorers, humorous and whimsical.</li>
        <li><strong>Tal’Vor</strong> — Diplomatic merchants, inspirational storytellers.</li>
      </ul>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Vezy Score</h3>
      <div>Goals: <span id="goals"></span></div>
      <div>Score: <span id="score"></span></div>
      <div style="margin-top:8px">
        <div>Story</div>
        <div class="bar"><div id="barStory" class="fill" style="background:#8e24aa"></div></div>
        <div>Empire</div>
        <div class="bar"><div id="barEmpire" class="fill" style="background:#fb8c00"></div></div>
        <div>Discovery</div>
        <div class="bar"><div id="barDiscovery" class="fill" style="background:#43a047"></div></div>
        <div>Social</div>
        <div class="bar"><div id="barSocial" class="fill" style="background:#1e88e5"></div></div>
      </div>
      <button id="addStory">+5 Story</button>
      <button id="addEmpire">+5 Empire</button>
      <button id="addDiscovery">+5 Discovery</button>
      <button id="addSocial">+5 Social</button>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Planet/Civilization Generator</h3>
      <button id="genPlanet">Generate Planet</button>
      <pre id="planetOut"></pre>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Empire — Planets & Production</h3>
      <button id="empireCreate">Create Planet (Empire)</button>
      <button id="empireTick">Production Tick</button>
      <div style="margin-top:8px">Planets:</div>
      <ul id="empirePlanets"></ul>
      <div>Production Preview (latest):</div>
      <pre id="empireProd"></pre>
      <div>Stockpiles (latest):</div>
      <pre id="empireStocks"></pre>
      <div>Build Queue (latest):</div>
      <button id="queueAdd">Add Demo Build</button>
      <button id="queueTick">Work Tick</button>
      <div class="bar"><div id="queueProg" class="fill" style="background:#9c27b0"></div></div>
      <pre id="empireQueue"></pre>
      <div>Units</div>
      <button id="unitTrain">Train Infantry</button>
      <pre id="empireUnits"></pre>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Analytics (MVP)</h3>
      <button id="analyticsLoad">Load Analytics</button>
      <button id="analyticsSnap">Snapshot</button>
      <pre id="analyticsOut"></pre>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Policies (Free-form)</h3>
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px">
        <input id="polTitle" placeholder="Policy Title" style="flex:1" />
        <select id="polScope">
          <option value="campaign">campaign</option>
          <option value="region">region</option>
          <option value="system">system</option>
        </select>
        <button id="polCreate">Create & Suggest</button>
        <button id="polActivate">Activate Modifiers</button>
      </div>
      <textarea id="polBody" rows="5" style="width:100%" placeholder="Write policy text..."></textarea>
      <div style="margin-top:6px">Suggestions / Modifiers JSON:</div>
      <pre id="polOut"></pre>
    </div>
    <div class="panel" style="grid-column:1/3">
      <h3>Advisors</h3>
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px">
        <select id="advDomain">
          <option>economy</option>
          <option>military</option>
          <option>science</option>
          <option>logistics</option>
          <option>governance</option>
          <option>diplomacy</option>
        </select>
        <input id="advQuestion" placeholder="Ask the advisor..." style="flex:1" />
        <button id="advAsk">Ask</button>
        <button id="advPropose">Propose First</button>
      </div>
      <pre id="advOut"></pre>
    </div>
  </div>
  <pre id="log"></pre>
  <script>
  async function loadSettings(){
    const s = await fetch('/api/settings').then(r=>r.json());
    document.getElementById('mode').value = s.resolutionMode;
    document.getElementById('gameMode').value = s.gameMode || 'hero';
    if (s.backstory) document.getElementById('backstory').value = s.backstory;
  }
  loadSettings();
  document.getElementById('save').onclick = async ()=>{
    const body = { resolutionMode: document.getElementById('mode').value, gameMode: document.getElementById('gameMode').value };
    const s = await fetch('/api/settings', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then(r=>r.json());
    document.getElementById('log').textContent = 'Saved: '+JSON.stringify(s);
  };
  document.getElementById('saveStory').onclick = async ()=>{
    const body = { backstory: document.getElementById('backstory').value };
    const s = await fetch('/api/settings', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then(r=>r.json());
    document.getElementById('log').textContent = 'Saved: '+JSON.stringify(s);
  };
  document.getElementById('tick').onclick = async ()=>{
    await fetch('/api/encounter/start', {method:'POST'});
    const r = await fetch('/api/encounter/tick', {method:'POST'}).then(r=>r.json());
    document.getElementById('clockFill').style.width = r.clock+'%';
  };
  document.getElementById('preview').onclick = async ()=>{
    const body = { dc: 12, attribute: 3, skill: 2, modifiers: 1, momentum: 1, attempts: 0 };
    const r = await fetch('/api/outcome/preview', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then(r=>r.json());
    const p = Math.round(r.chance.success*100);
    document.getElementById('successFill').style.width = p+'%';
  };
  document.getElementById('stepEngine').onclick = async ()=>{
    // Step: ensure a planet exists, apply production tick, advance one queue if present, then refresh panels
    try {
      let latest = await fetch('/api/empire/planets/latest').then(r=>r.json()).catch(()=>null);
      if (!latest || !latest.planet) {
        await fetch('/api/empire/planets', { method:'POST' }).catch(()=>{});
        latest = await fetch('/api/empire/planets/latest').then(r=>r.json()).catch(()=>null);
      }
      if (latest && latest.planet && latest.planet.id) {
        const pid = latest.planet.id;
        await fetch('/api/empire/planets/'+pid+'/tick', { method:'POST' }).catch(()=>{});
        const queues = await fetch('/api/empire/planets/'+pid+'/queues').then(r=>r.json()).catch(()=>({ queues: [] }));
        const qid = (queues && queues.queues && queues.queues[0] && queues.queues[0].id) || (queues.id);
        if (qid) {
          await fetch('/api/empire/queues/'+qid+'/tick', { method:'POST' }).catch(()=>{});
        }
      }
    } catch {}
    await loadEmpire();
    await loadAnalytics();
  };
  async function loadVezy(){
    const g = await fetch('/api/vezy/goals').then(r=>r.json());
    const s = await fetch('/api/vezy/score').then(r=>r.json());
    document.getElementById('goals').textContent = JSON.stringify(g);
    document.getElementById('score').textContent = JSON.stringify(s);
    function pct(val, goal){ return Math.max(0, Math.min(100, Math.round((val/Math.max(1,goal))*100))) }
    document.getElementById('barStory').style.width = pct(s.story, g.story) + '%';
    document.getElementById('barEmpire').style.width = pct(s.empire, g.empire) + '%';
    document.getElementById('barDiscovery').style.width = pct(s.discovery, g.discovery) + '%';
    document.getElementById('barSocial').style.width = pct(s.social, g.social) + '%';
  }
  loadVezy();
  function add(cat){
    fetch('/api/vezy/event', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({category:cat, value:5})})
      .then(()=>loadVezy());
  }
  document.getElementById('addStory').onclick = ()=>add('story');
  document.getElementById('addEmpire').onclick = ()=>add('empire');
  document.getElementById('addDiscovery').onclick = ()=>add('discovery');
  document.getElementById('addSocial').onclick = ()=>add('social');
  document.getElementById('genPlanet').onclick = async ()=>{
    const p = await fetch('/api/generator/planet').then(r=>r.json());
    document.getElementById('planetOut').textContent = JSON.stringify(p, null, 2);
  }
  async function loadEmpire(){
    const ul = document.getElementById('empirePlanets');
    ul.innerHTML = '';
    let list = await fetch('/api/empire/planets').then(r=>r.json()).catch(()=>({ planets: [] }));
    if (!(list.planets||[]).length){
      try { await fetch('/api/empire/planets', { method:'POST' }) } catch {}
      list = await fetch('/api/empire/planets').then(r=>r.json()).catch(()=>({ planets: [] }));
    }
    for (const p of (list.planets||[])){
      const li = document.createElement('li');
      li.textContent = p.id+': '+p.name+' — '+p.biome+' (g='+p.gravity+')';
      ul.appendChild(li);
    }
    if ((list.planets||[]).length){
      const latest = list.planets[0];
      const prod = await fetch('/api/empire/planets/'+latest.id+'/production').then(r=>r.json());
      document.getElementById('empireProd').textContent = JSON.stringify(prod, null, 2);
      const stocks = await fetch('/api/empire/planets/'+latest.id+'/stockpiles').then(r=>r.json());
      document.getElementById('empireStocks').textContent = JSON.stringify(stocks, null, 2);
      const queues = await fetch('/api/empire/planets/'+latest.id+'/queues').then(r=>r.json());
      renderQueue(queues);
      const units = await fetch('/api/empire/planets/'+latest.id+'/units').then(r=>r.json());
      document.getElementById('empireUnits').textContent = JSON.stringify(units, null, 2);
    } else {
      document.getElementById('empireProd').textContent = '';
      document.getElementById('empireStocks').textContent = '';
      document.getElementById('empireQueue').textContent = '';
      document.getElementById('empireUnits').textContent = '';
    }
  }
  document.getElementById('empireCreate').onclick = async ()=>{
    await fetch('/api/empire/planets', { method: 'POST' });
    await loadEmpire();
  };
  document.getElementById('empireTick').onclick = async ()=>{
    const list = await fetch('/api/empire/planets').then(r=>r.json());
    if ((list.planets||[]).length){
      const latest = list.planets[0];
      const stocks = await fetch('/api/empire/planets/'+latest.id+'/tick', { method:'POST' }).then(r=>r.json());
      document.getElementById('empireStocks').textContent = JSON.stringify(stocks, null, 2);
    }
  };
  function setQueueProgress(q){
    try {
      const progress = q.progress ?? ((q.queues && q.queues[0] && q.queues[0].progress) || 0);
      const req = q.work_required ?? ((q.queues && q.queues[0] && q.queues[0].work_required) || 0);
      const pct = req > 0 ? Math.max(0, Math.min(100, Math.round((progress/req)*100))) : 0;
      document.getElementById('queueProg').style.width = pct + '%';
    } catch { document.getElementById('queueProg').style.width = '0%'; }
  }
  function renderQueue(q){
    document.getElementById('empireQueue').textContent = JSON.stringify(q, null, 2);
    setQueueProgress(q);
  }
  document.getElementById('queueAdd').onclick = async ()=>{
    const list = await fetch('/api/empire/planets').then(r=>r.json());
    if ((list.planets||[]).length){
      const latest = list.planets[0];
      const q = await fetch('/api/empire/planets/'+latest.id+'/queues', { method:'POST' }).then(r=>r.json());
      renderQueue(q);
    }
  };
  document.getElementById('queueTick').onclick = async ()=>{
    const q = JSON.parse(document.getElementById('empireQueue').textContent||'{}');
    const id = (q.id) || (q.queues && q.queues[0] && q.queues[0].id);
    if (id){
      const upd = await fetch('/api/empire/queues/'+id+'/tick', { method:'POST' }).then(r=>r.json());
      renderQueue(upd);
    }
  };
  document.getElementById('unitTrain').onclick = async ()=>{
    const list = await fetch('/api/empire/planets').then(r=>r.json());
    if ((list.planets||[]).length){
      const latest = list.planets[0];
      const res = await fetch('/api/empire/planets/'+latest.id+'/units/infantry', { method:'POST' }).then(r=>r.json());
      document.getElementById('empireQueue').textContent = JSON.stringify(res, null, 2);
    }
  };
  // Analytics panel
  async function loadAnalytics(){
    const r = await fetch('/api/analytics/empire?scope=campaign&id=1').then(r=>r.json()).catch(()=>({ metrics:{} }));
    document.getElementById('analyticsOut').textContent = JSON.stringify(r || { metrics: {} }, null, 2);
  }
  document.getElementById('analyticsLoad').onclick = loadAnalytics;
  document.getElementById('analyticsSnap').onclick = async ()=>{
    const current = await fetch('/api/analytics/empire?scope=campaign&id=1').then(r=>r.json()).catch(()=>({ metrics:{} }));
    await fetch('/api/analytics/snapshot', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ scope:'campaign', id:1, metrics: current.metrics||{} }) });
    await loadAnalytics();
  };
  // Policies panel
  let lastPolicyId = null;
  let lastSuggestions = null;
  document.getElementById('polCreate').onclick = async ()=>{
    var _t=document.getElementById('polTitle'); var title=((_t&&_t['value'])||'Untitled Policy');
    var _s=document.getElementById('polScope'); var scope=((_s&&_s['value'])||'campaign');
    var _b=document.getElementById('polBody'); var body=((_b&&_b['value'])||'');
    const res = await fetch('/api/policies', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, body, scope }) }).then(r=>r.json()).catch(()=>({}));
    lastPolicyId = res.id || null;
    lastSuggestions = res.suggestions || null;
    document.getElementById('polOut').textContent = JSON.stringify({ id: lastPolicyId, suggestions: lastSuggestions }, null, 2);
  };
  document.getElementById('polActivate').onclick = async ()=>{
    if (!lastPolicyId){ document.getElementById('polOut').textContent = 'No policy created yet.'; return; }
    // Build modifiers from suggestions or accept JSON pasted in the box
    let mods = [];
    try {
      if (lastSuggestions && !Array.isArray(lastSuggestions) && typeof lastSuggestions === 'object'){
        // object map -> array
        mods = Object.keys(lastSuggestions).map(k => ({ key: k, value: Number(lastSuggestions[k]), capMin: k.endsWith('_mult')?0.5:-0.5, capMax: k.endsWith('_mult')?1.5:0.5 }));
      } else if (Array.isArray(lastSuggestions)) {
        mods = lastSuggestions.map((m)=>({ key: String(m.key), value: Number(m.value), capMin: m.capMin ?? (String(m.key).endsWith('_mult')?0.5:-0.5), capMax: m.capMax ?? (String(m.key).endsWith('_mult')?1.5:0.5) }));
      }
    } catch { mods = []; }
    if (!mods.length) {
      // fallback: try to read JSON from suggestions box
      try {
        const txt = (document.getElementById('polOut') as any).textContent || '{}';
        const obj = JSON.parse(txt);
        if (obj && obj.suggestions){
          const s = obj.suggestions;
          if (Array.isArray(s)) mods = s.map((m)=>({ key: String(m.key), value: Number(m.value), capMin: m.capMin ?? null, capMax: m.capMax ?? null }));
          else if (typeof s === 'object') mods = Object.keys(s).map(k => ({ key: k, value: Number(s[k]) }));
        }
      } catch {}
    }
    if (!mods.length){ document.getElementById('polOut').textContent = 'No modifiers to activate.'; return; }
    await fetch('/api/policies/activate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ policyId: lastPolicyId, modifiers: mods }) }).catch(()=>{});
    const active = await fetch('/api/policies/active').then(r=>r.json()).catch(()=>({ modifiers: [] }));
    document.getElementById('polOut').textContent = JSON.stringify({ activated: mods, activeModifiers: active.modifiers }, null, 2);
  };
  // Advisors panel
  let lastAdvisorRecs = [];
  document.getElementById('advAsk').onclick = async ()=>{
    var _d=document.getElementById('advDomain'); var domain=((_d&&_d['value'])||'economy');
    var _q=document.getElementById('advQuestion'); var question=((_q&&_q['value'])||'');
    const res = await fetch('/api/advisors/'+encodeURIComponent(domain)+'/query', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ question }) }).then(r=>r.json()).catch(()=>({}));
    lastAdvisorRecs = Array.isArray(res.recommendations) ? res.recommendations : [];
    document.getElementById('advOut').textContent = JSON.stringify(res, null, 2);
  };
  document.getElementById('advPropose').onclick = async ()=>{
    const domain = (document.getElementById('advDomain') as any).value || 'economy';
    const rec = lastAdvisorRecs && lastAdvisorRecs[0];
    if (!rec){ document.getElementById('advOut').textContent = 'No recommendation to propose.'; return; }
    const r = await fetch('/api/advisors/'+encodeURIComponent(domain)+'/propose', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ payload: { action: rec } }) }).then(r=>r.json()).catch(()=>({}));
    document.getElementById('advOut').textContent = JSON.stringify({ proposed: rec, id: r.id }, null, 2);
  };
  loadEmpire();
  // Also auto-load analytics for tests/demo convenience
  loadAnalytics();
  // Auto-refresh empire panel periodically to avoid UI race in demos/tests
  setInterval(loadEmpire, 1000);
  </script>
</body></html>`)
})

demoRouter.get('/ws', (req, res) => {
  const campaign = (req.query.campaign as string) || 'demo'
  const wsBase = (req.headers['x-forwarded-proto']?.toString() || 'http') === 'https' ? 'wss' : 'ws'
  const host = req.headers.host
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(`<!doctype html>
<html><head><meta charset="utf-8"><title>WS Captions</title>
<style>body{font-family:system-ui,Segoe UI,Arial;margin:24px}</style>
</head><body>
  <h1>WS Captions Demo</h1>
  <div>Campaign: <code id="camp"></code></div>
  <button id="simulate">Simulate STT</button>
  <ul id="log"></ul>
  <script>
  const campaign = ${JSON.stringify(campaign)};
  const ws = new WebSocket('${wsBase}://${host}/ws');
  document.getElementById('camp').textContent = campaign;
  const log = document.getElementById('log');
  ws.addEventListener('open', () => ws.send(JSON.stringify({ type: 'join', campaignId: campaign })));
  ws.addEventListener('message', (ev) => {
    try { const msg = JSON.parse(ev.data); if (msg?.type === 'server-broadcast' && msg?.campaignId === campaign && msg?.payload?.type === 'caption') {
      const li = document.createElement('li'); li.textContent = msg.payload.text; log.appendChild(li);
    }} catch {}
  });
  document.getElementById('simulate').addEventListener('click', async () => {
    const body = new Uint8Array(10000);
    await fetch('/api/audio/stt?campaignId=' + encodeURIComponent(campaign), { method:'POST', headers:{'Content-Type':'audio/wav'}, body });
  });
  </script>
</body></html>`)
})


