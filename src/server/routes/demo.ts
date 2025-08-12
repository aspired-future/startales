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
</style>
</head><body>
  <h1>Minimal HUD</h1>
  <div class="row">
    <label>Resolution Mode
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
  <pre id="log"></pre>
  <script>
  async function loadSettings(){
    const s = await fetch('/api/settings').then(r=>r.json());
    document.getElementById('mode').value = s.resolutionMode;
  }
  loadSettings();
  document.getElementById('save').onclick = async ()=>{
    const body = { resolutionMode: document.getElementById('mode').value };
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


