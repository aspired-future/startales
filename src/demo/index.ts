import express from 'express';
import cors from 'cors';

type PRNG = () => number;

function createSeededPrng(seed: number): PRNG {
  let a = (seed >>> 0) || 1;
  return () => {
    a ^= a << 13;
    a ^= a >>> 17;
    a ^= a << 5;
    return (a >>> 0) / 0xffffffff;
  };
}

export type KPISnapshot = {
  production: number;
  queues: number;
  readiness: number;
};

class EngineState {
  private prng: PRNG;
  public kpi: KPISnapshot;
  public stepCount: number;

  constructor(seed: number) {
    this.prng = createSeededPrng(seed);
    this.stepCount = 0;
    this.kpi = { production: 50, queues: 50, readiness: 50 };
  }

  step(): KPISnapshot {
    this.stepCount += 1;
    const delta = (this.prng() - 0.5) * 10;
    const delta2 = (this.prng() - 0.5) * 6;
    const delta3 = (this.prng() - 0.5) * 4;
    this.kpi = {
      production: clamp01(this.kpi.production + delta),
      queues: clamp01(this.kpi.queues + delta2),
      readiness: clamp01(this.kpi.readiness + delta3),
    };
    return this.kpi;
  }
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

const app = express();
app.use(cors());
app.use(express.json());

const engine = new EngineState(1337);
const snapshots: KPISnapshot[] = [];
type Policy = { id: string; title: string; body: string; scope: string; suggestions?: any };
type Modifier = { key: string; value: number; capMin?: number|null; capMax?: number|null };
const policies: Policy[] = [];
let activeModifiers: Modifier[] = [];

// Opinions (simple cohort model 0..1)
type Cohort = 'workers' | 'investors' | 'scientists' | 'military' | 'civil';
const cohorts: Cohort[] = ['workers', 'investors', 'scientists', 'military', 'civil'];
const opinions: Record<Cohort, number> = {
  workers: 0.5, investors: 0.5, scientists: 0.5, military: 0.5, civil: 0.5,
};
const speechHistory: { hash: string; count: number }[] = [];

function normalizeText(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function hashText(t: string): string {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16);
}
function clamp01f(v: number): number { return Math.max(0, Math.min(1, v)); }

function applyOpinionShift(aud: Cohort | 'all', shift: number) {
  const applyOne = (c: Cohort) => { opinions[c] = clamp01f(opinions[c] + shift); };
  if (aud === 'all') cohorts.forEach(applyOne); else applyOne(aud);
}

// Simple id generator
function nextId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}



app.get('/api/analytics/empire', (_req, res) => {
  res.json({ latest: engine.kpi, step: engine.stepCount });
});

app.get('/api/analytics/snapshots', (_req, res) => {
  res.json({ count: snapshots.length, snapshots });
});

// Policies (MVP)
app.post('/api/policies', (req, res) => {
  const { title = 'Untitled', body = '', scope = 'campaign' } = req.body || {};
  const id = nextId('pol');
  const suggestions = inferSuggestionsFromBody(body);
  const policy: Policy = { id, title: String(title), body: String(body), scope: String(scope), suggestions };
  policies.unshift(policy);
  res.json({ id, suggestions });
});

app.get('/api/policies/active', (_req, res) => {
  res.json({ modifiers: activeModifiers });
});

app.post('/api/policies/activate', (req, res) => {
  const { modifiers = [] } = req.body || {};
  const parsed: Modifier[] = Array.isArray(modifiers)
    ? modifiers.map((m: any) => ({ key: String(m.key), value: Number(m.value), capMin: m.capMin ?? null, capMax: m.capMax ?? null }))
    : [];
  activeModifiers = parsed;
  res.json({ ok: true, modifiers: activeModifiers });
});

// Player-to-people communications (speech)
// POST /api/comms/speech { audience?: Cohort|"all", text: string, goals?: string }
// Returns bounded effects with decay/backfire and updated opinions
app.post('/api/comms/speech', (req, res) => {
  const audience: Cohort | 'all' = (req.body?.audience && cohorts.includes(req.body.audience)) ? req.body.audience : 'all';
  const text: string = String(req.body?.text || '');
  const goals: string = String(req.body?.goals || '');
  const norm = normalizeText(text + ' ' + goals);
  const h = hashText(norm);
  let entry = speechHistory.find(e => e.hash === h);
  if (!entry) { entry = { hash: h, count: 0 }; speechHistory.push(entry); }
  entry.count += 1;
  const decay = 1 / (1 + (entry.count - 1)); // 1, 1/2, 1/3...

  // Heuristic base shift from keywords
  let baseShift = 0;
  if (/(unity|together|solidarity)/.test(norm)) baseShift += 0.02;
  if (/(sacrifice|austerity)/.test(norm)) baseShift -= 0.01;
  if (/(jobs|wages|work)/.test(norm)) baseShift += 0.015;
  if (/(science|research|innovation)/.test(norm)) baseShift += 0.015;
  if (/(war|mobilize|threat)/.test(norm)) baseShift += 0.01;

  // Backfire if claims contradict KPIs (very simple heuristic)
  let backfire = 0;
  if (/record production/.test(norm) && engine.kpi.production < 60) backfire = 0.02;
  if (/queues down/.test(norm) && engine.kpi.queues > 55) backfire = 0.02;

  // Apply bounded shift
  const shift = Math.max(-0.05, Math.min(0.05, (baseShift * decay) - backfire));
  applyOpinionShift(audience, shift);

  res.json({
    audience, text, goals,
    parsedModifiers: { opinion_shift: shift, decayFactor: decay, backfire },
    opinions,
  });
});

// Cabinet voice meeting (transcript-based, text-only stub)
// POST /api/gov/cabinet/meeting { segments: [{ speaker: string, text: string }] }
app.post('/api/gov/cabinet/meeting', (req, res) => {
  const segments: Array<{ speaker: string; text: string }> = Array.isArray(req.body?.segments) ? req.body.segments : [];
  const joined = normalizeText(segments.map(s => s.text).join(' '));
  const h = hashText(joined);
  // Simple keyword-driven modifiers
  let coord = 1.0; // coordination_efficiency_mult
  let crisis = 0;  // crisis_response_readiness_add
  let align = 0;   // policy_alignment_add
  let msg = 0;     // media_messaging_coherence_add
  if (/(coordinate|align|plan)/.test(joined)) { coord += 0.02; align += 0.02; }
  if (/(emergency|drill|readiness|incident)/.test(joined)) { crisis += 0.02; }
  if (/(message|talking points|press)/.test(joined)) { msg += 0.02; }
  // clamp caps
  coord = Math.min(coord, 1.05);
  crisis = Math.min(crisis, 0.04);
  align = Math.min(align, 0.05);
  msg = Math.min(msg, 0.05);
  res.json({ transcriptHash: h, parsedModifiers: {
    coordination_efficiency_mult: coord,
    crisis_response_readiness_add: crisis,
    policy_alignment_add: align,
    media_messaging_coherence_add: msg,
  }});
});

function inferSuggestionsFromBody(body: string | undefined) {
  const text = (body || '').toLowerCase();
  const s: Record<string, number> = {};
  if (text.includes('research')) s.research_rate_mult = 1.1;
  if (text.includes('tax')) s.tax_rate = 0.05;
  if (text.includes('production')) s.production_rate_mult = 1.05;
  return Object.keys(s).length ? s : { production_rate_mult: 1.02 };
}

// Advisors (MVP)
app.post('/api/advisors/:domain/query', (req, res) => {
  const { domain } = req.params;
  const { question = '' } = req.body || {};
  const recommendations = [
    `${domain}: increase research by 5%`,
    `${domain}: allocate budgets to high ROI areas`,
  ];
  res.json({ domain, question, recommendations });
});

app.post('/api/advisors/:domain/propose', (req, res) => {
  const id = nextId('adv');
  res.json({ id });
});

// Minimal Policies Demo Page
app.get('/demo/policies', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Policies Demo</title>
  </head>
  <body>
    <h1>Policies & Advisors Demo</h1>
    <div>
      <input id="title" placeholder="Policy Title" />
      <input id="scope" placeholder="Scope" value="campaign" />
    </div>
    <div>
      <textarea id="body" rows="4" cols="50" placeholder="Write policy text including keywords like research/production/tax..."></textarea>
    </div>
    <button id="create">Create Policy</button>
    <button id="activate">Activate Suggestions</button>
    <pre id="out"></pre>
    <hr/>
    <div>
      <select id="domain">
        <option>economy</option>
        <option>science</option>
        <option>military</option>
      </select>
      <input id="q" placeholder="Ask advisor..." />
      <button id="ask">Ask</button>
    </div>
    <pre id="adv"></pre>
    <script>
      let last = { suggestions: null };
      document.getElementById('create').onclick = async () => {
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const scope = document.getElementById('scope').value || 'campaign';
        const r = await fetch('/api/policies', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, body, scope }) });
        const j = await r.json();
        last = j;
        document.getElementById('out').textContent = JSON.stringify(j, null, 2);
      };
      document.getElementById('activate').onclick = async () => {
        const suggestions = last.suggestions || {};
        const mods = Array.isArray(suggestions) ? suggestions : Object.keys(suggestions).map(k=>({ key:k, value:Number(suggestions[k]) }));
        const r = await fetch('/api/policies/activate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ modifiers: mods }) });
        const j = await r.json();
        document.getElementById('out').textContent = JSON.stringify(j, null, 2);
      };
      document.getElementById('ask').onclick = async () => {
        const domain = document.getElementById('domain').value;
        const question = document.getElementById('q').value;
        const r = await fetch('/api/advisors/'+encodeURIComponent(domain)+'/query', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ question }) });
        const j = await r.json();
        document.getElementById('adv').textContent = JSON.stringify(j, null, 2);
      };
    </script>
  </body>
  </html>`);
});

// Speech Demo Page
app.get('/demo/speech', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Speech Demo</title>
  </head>
  <body>
    <h1>Leader Speech</h1>
    <label>Audience
      <select id="aud">
        <option value="all">all</option>
        <option>workers</option>
        <option>investors</option>
        <option>scientists</option>
        <option>military</option>
        <option>civil</option>
      </select>
    </label>
    <div><textarea id="text" rows="5" cols="60" placeholder="Write a short address..."></textarea></div>
    <button id="send">Speak</button>
    <pre id="out"></pre>
    <script>
      document.getElementById('send').onclick = async () => {
        const aud = document.getElementById('aud').value;
        const text = document.getElementById('text').value;
        const r = await fetch('/api/comms/speech', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ audience: aud, text }) });
        const j = await r.json();
        document.getElementById('out').textContent = JSON.stringify(j, null, 2);
      };
    </script>
  </body>
  </html>`);
});

// Cabinet Meeting Demo Page (text-only transcript)
app.get('/demo/cabinet', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cabinet Meeting Demo</title>
  </head>
  <body>
    <h1>Cabinet Meeting</h1>
    <p>Enter lines as "Speaker: text"</p>
    <textarea id="tx" rows="6" cols="70">PM: We must coordinate a response\nDefense: Readiness drill across bases\nComms: Align messaging for press briefing</textarea>
    <div><button id="run">Process Meeting</button></div>
    <pre id="out"></pre>
    <script>
      document.getElementById('run').onclick = async ()=>{
        const lines = document.getElementById('tx').value.split('\n');
        const segments = lines.map(l=>{ const i=l.indexOf(':'); return i>0?{speaker:l.slice(0,i).trim(), text:l.slice(i+1).trim()}:{speaker:'Unknown', text:l.trim()}; });
        const r = await fetch('/api/gov/cabinet/meeting', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ segments })});
        const j = await r.json();
        document.getElementById('out').textContent = JSON.stringify(j, null, 2);
      };
    </script>
  </body>
  </html>`);
});

// Trade & Economy (MVP)
type SystemName = 'Sol' | 'Vezara';
type Resource = 'alloy' | 'fuel';
const systems: SystemName[] = ['Sol', 'Vezara'];
const basePrices: Record<Resource, number> = { alloy: 100, fuel: 50 };
type Tariff = { id: string; system: SystemName; resource: Resource; rate: number };
const tariffs: Tariff[] = [];
type Contract = { id: string; type: 'spot' | 'offtake'; resource: Resource; qty: number; system: SystemName };
const contracts: Contract[] = [];
type Corp = { id: string; name: string; sector: 'mining' | 'energy' | 'logistics' };
const corps: Corp[] = [ { id: nextId('corp'), name: 'Vezara Metals', sector: 'mining' } ];

function priceFor(system: SystemName, resource: Resource): number {
  const t = tariffs.filter(t => t.system === system && t.resource === resource).reduce((a, b) => a + b.rate, 0);
  return Math.max(1, Math.round(basePrices[resource] * (1 + t)));
}

app.get('/api/trade/prices', (req, res) => {
  const systemParam = (req.query.system as string) as SystemName || 'Vezara';
  const sys = systems.includes(systemParam as SystemName) ? (systemParam as SystemName) : 'Vezara';
  const prices = {
    system: sys,
    alloy: priceFor(sys, 'alloy'),
    fuel: priceFor(sys, 'fuel')
  };
  res.json(prices);
});

app.post('/api/trade/routes', (req, res) => {
  const { system = 'Vezara', resource = 'alloy', rate = 0.05 } = req.body || {};
  const id = nextId('tariff');
  const t: Tariff = { id, system: (systems.includes(system) ? system : 'Vezara') as SystemName, resource: (resource === 'fuel' ? 'fuel' : 'alloy'), rate: Number(rate) };
  tariffs.push(t);
  res.json(t);
});

app.post('/api/trade/contracts', (req, res) => {
  const { type = 'spot', resource = 'alloy', qty = 10, system = 'Vezara' } = req.body || {};
  const c: Contract = { id: nextId('ctr'), type: (type === 'offtake' ? 'offtake' : 'spot'), resource: (resource === 'fuel' ? 'fuel' : 'alloy'), qty: Number(qty), system: (systems.includes(system) ? system : 'Vezara') as SystemName };
  contracts.push(c);
  res.json(c);
});

app.get('/api/trade/contracts', (_req, res) => {
  res.json({ contracts });
});

app.get('/api/trade/indices', (_req, res) => {
  const avgPrice = (priceFor('Vezara', 'alloy') + priceFor('Vezara', 'fuel')) / 2;
  const index = {
    priceIndex: Math.round(avgPrice),
    contracts: contracts.length,
    corps: corps.length,
  };
  res.json(index);
});

// Minimal Trade Demo Page
app.get('/demo/trade', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Trade & Economy Demo</title>
  </head>
  <body>
    <h1>Trade & Economy — Phase 1</h1>
    <div>
      <button id="loadPrices">Load Prices</button>
      <pre id="prices"></pre>
    </div>
    <div>
      <h2>Add Tariff</h2>
      <label>System <input id="sys" value="Vezara"/></label>
      <label>Resource <select id="res"><option value="alloy">alloy</option><option value="fuel">fuel</option></select></label>
      <label>Rate <input id="rate" value="0.05"/></label>
      <button id="addTariff">Add</button>
    </div>
    <div>
      <h2>Create Contract</h2>
      <label>Type <select id="ctype"><option value="spot">spot</option><option value="offtake">offtake</option></select></label>
      <label>Resource <select id="cres"><option value="alloy">alloy</option><option value="fuel">fuel</option></select></label>
      <label>Qty <input id="cqty" value="10"/></label>
      <button id="createContract">Create</button>
      <pre id="contracts"></pre>
    </div>
    <div>
      <h2>Indices</h2>
      <button id="loadIdx">Load Indices</button>
      <pre id="idx"></pre>
    </div>
    <script>
    async function loadPrices(){ const j = await fetch('/api/trade/prices').then(r=>r.json()); document.getElementById('prices').textContent = JSON.stringify(j, null, 2); }
    document.getElementById('loadPrices').onclick = loadPrices;
    document.getElementById('addTariff').onclick = async ()=>{
      const system = document.getElementById('sys').value || 'Vezara';
      const resource = document.getElementById('res').value || 'alloy';
      const rate = Number(document.getElementById('rate').value)||0.05;
      await fetch('/api/trade/routes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ system, resource, rate }) });
      await loadPrices();
    };
    document.getElementById('createContract').onclick = async ()=>{
      const type = document.getElementById('ctype').value;
      const resource = document.getElementById('cres').value;
      const qty = Number(document.getElementById('cqty').value)||10;
      await fetch('/api/trade/contracts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type, resource, qty, system:'Vezara' }) });
      const j = await fetch('/api/trade/contracts').then(r=>r.json());
      document.getElementById('contracts').textContent = JSON.stringify(j, null, 2);
    };
    document.getElementById('loadIdx').onclick = async ()=>{
      const j = await fetch('/api/trade/indices').then(r=>r.json());
      document.getElementById('idx').textContent = JSON.stringify(j, null, 2);
    };
    </script>
  </body>
  </html>`);
});

app.get('/demo/hud', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Startales Demo HUD</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      .bar { height: 12px; background: #444; border-radius: 6px; margin: 8px 0; }
      .fill { height: 100%; background: #4ade80; border-radius: 6px; }
      button { padding: 8px 12px; }
      .row { display: flex; gap: 12px; align-items: center; }
    </style>
  </head>
  <body>
    <h1>Simulation HUD</h1>
    <div class="row"><button id="step">Step Engine</button> <span id="stepCount">0</span></div>
    <div>Production <span id="pLabel">50</span></div>
    <div class="bar"><div id="p" class="fill" style="width:50%"></div></div>
    <div>Queues <span id="qLabel">50</span></div>
    <div class="bar"><div id="q" class="fill" style="width:50%"></div></div>
    <div>Readiness <span id="rLabel">50</span></div>
    <div class="bar"><div id="r" class="fill" style="width:50%"></div></div>
    <script>
      const stepBtn = document.getElementById('step');
      const stepCount = document.getElementById('stepCount');
      const p = document.getElementById('p');
      const q = document.getElementById('q');
      const r = document.getElementById('r');
      const pLabel = document.getElementById('pLabel');
      const qLabel = document.getElementById('qLabel');
      const rLabel = document.getElementById('rLabel');
      stepBtn.addEventListener('click', async () => {
        try {
          const res = await fetch('/api/sim/step', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              campaignId: 1, 
              seed: 'hud-demo-' + Date.now() 
            })
          });
          const data = await res.json();
          
          if (data.success) {
            stepCount.textContent = String(data.data.step);
            
            // Map our KPIs to the expected format
            const kpis = data.data.kpis;
            const production = Math.min(100, (kpis.production_rate || 0));
            const queues = Math.min(100, (kpis.queue_efficiency || 0) * 100);
            const readiness = Math.min(100, (kpis.military_readiness || 0) * 100);
            
            p.style.width = production + '%';
            q.style.width = queues + '%';
            r.style.width = readiness + '%';
            pLabel.textContent = String(Math.round(production));
            qLabel.textContent = String(Math.round(queues));
            rLabel.textContent = String(Math.round(readiness));
          } else {
            console.error('Simulation step failed:', data.error);
          }
        } catch (error) {
          console.error('Request failed:', error);
        }
      });
    </script>
  </body>
  </html>`);
});

app.post('/api/sim/step', async (req, res) => {
  try {
    const { campaignId, seed, actions = [] } = req.body;
    
    if (!campaignId || !seed) {
      return res.status(400).json({ 
        error: 'Campaign ID and seed are required' 
      });
    }
    
    // Import the simulation engine
    const { step } = await import('../server/sim/engine');
    
    // Execute simulation step
    const result = await step({
      campaignId: Number(campaignId),
      seed: String(seed),
      actions
    });
    
    res.json({
      success: true,
      data: {
        step: result.step,
        resources: result.resources,
        buildings: result.buildings,
        kpis: result.kpis,
        queueCount: result.queues.length,
        eventCount: result.veziesEvents.length
      }
    });
  } catch (error) {
    console.error('Simulation API error:', error);
    res.status(500).json({ 
      error: 'Simulation step failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add simulation demo page
app.get('/demo/simulation', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simulation Engine Demo</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .controls { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
        .results { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .panel { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
        button:hover { background: #0056b3; }
        input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        .resource-bar { background: #e9ecef; height: 20px; border-radius: 10px; margin: 5px 0; overflow: hidden; }
        .resource-fill { height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s ease; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .kpi-item { background: white; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Simulation Engine Demo</h1>
        <p>Test the deterministic simulation engine with different seeds and campaigns.</p>
        
        <div class="controls">
          <label>Campaign ID: <input type="number" id="campaignId" value="1" min="1"></label>
          <label>Seed: <input type="text" id="seed" value="demo-seed-123" placeholder="Enter seed"></label>
          <button onclick="runSimulation()">Run Simulation Step</button>
          <button onclick="runMultipleSteps()">Run 5 Steps</button>
          <button onclick="testDeterminism()">Test Determinism</button>
          <button onclick="clearResults()">Clear</button>
        </div>
        
        <div class="results">
          <div class="panel">
            <h3>📊 Resources</h3>
            <div id="resources">
              <div>Credits: <span id="credits">0</span></div>
              <div class="resource-bar"><div class="resource-fill" id="credits-bar" style="width: 0%"></div></div>
              <div>Materials: <span id="materials">0</span></div>
              <div class="resource-bar"><div class="resource-fill" id="materials-bar" style="width: 0%"></div></div>
              <div>Energy: <span id="energy">0</span></div>
              <div class="resource-bar"><div class="resource-fill" id="energy-bar" style="width: 0%"></div></div>
              <div>Food: <span id="food">0</span></div>
              <div class="resource-bar"><div class="resource-fill" id="food-bar" style="width: 0%"></div></div>
            </div>
          </div>
          
          <div class="panel">
            <h3>🏗️ Buildings</h3>
            <div id="buildings"></div>
          </div>
          
          <div class="panel">
            <h3>📈 KPIs</h3>
            <div class="kpi-grid" id="kpis"></div>
          </div>
          
          <div class="panel">
            <h3>📋 Simulation Log</h3>
            <div id="log" style="height: 200px; overflow-y: auto; background: white; padding: 10px; border-radius: 4px;"></div>
          </div>
        </div>
      </div>

      <script>
        let stepCount = 0;
        
        function log(message) {
          const logDiv = document.getElementById('log');
          const timestamp = new Date().toLocaleTimeString();
          logDiv.innerHTML += \`<div>[\${timestamp}] \${message}</div>\`;
          logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        function updateResourceBar(resource, value, max = 2000) {
          const percentage = Math.min(100, (value / max) * 100);
          document.getElementById(\`\${resource}-bar\`).style.width = \`\${percentage}%\`;
        }
        
        function updateDisplay(data) {
          // Update resources
          Object.entries(data.resources).forEach(([resource, value]) => {
            document.getElementById(resource).textContent = value;
            updateResourceBar(resource, value);
          });
          
          // Update buildings
          const buildingsDiv = document.getElementById('buildings');
          buildingsDiv.innerHTML = Object.entries(data.buildings)
            .map(([building, count]) => \`<div>\${building}: \${count}</div>\`)
            .join('');
          
          // Update KPIs
          const kpisDiv = document.getElementById('kpis');
          kpisDiv.innerHTML = Object.entries(data.kpis)
            .map(([kpi, value]) => {
              let displayValue = value;
              if (typeof value === 'object') {
                displayValue = JSON.stringify(value, null, 1);
              } else if (typeof value === 'number') {
                displayValue = Math.round(value * 1000) / 1000;
              }
              return \`<div class="kpi-item"><strong>\${kpi}:</strong><br>\${displayValue}</div>\`;
            }).join('');
        }
        
        async function runSimulation() {
          const campaignId = document.getElementById('campaignId').value;
          const seed = document.getElementById('seed').value;
          
          if (!seed.trim()) {
            alert('Please enter a seed value');
            return;
          }
          
          stepCount++;
          log(\`Running simulation step \${stepCount} with seed: \${seed}\`);
          
          try {
            const response = await fetch('/api/sim/step', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ campaignId: parseInt(campaignId), seed })
            });
            
            const result = await response.json();
            
            if (result.success) {
              updateDisplay(result.data);
              log(\`✅ Step \${result.data.step} completed - \${result.data.eventCount} events generated\`);
            } else {
              log(\`❌ Error: \${result.error}\`);
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`);
          }
        }
        
        async function runMultipleSteps() {
          for (let i = 0; i < 5; i++) {
            await runSimulation();
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        async function testDeterminism() {
          const seed = document.getElementById('seed').value;
          log(\`Testing determinism with seed: \${seed}\`);
          
          const results = [];
          for (let i = 0; i < 2; i++) {
            const response = await fetch('/api/sim/step', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ campaignId: 1, seed })
            });
            const result = await response.json();
            results.push(result.data.resources);
          }
          
          const match = JSON.stringify(results[0]) === JSON.stringify(results[1]);
          if (match) {
            log('✅ Determinism test passed - identical results');
          } else {
            log('❌ Determinism test failed - results differ');
          }
        }
        
        function clearResults() {
          document.getElementById('log').innerHTML = '';
          stepCount = 0;
          log('Results cleared');
        }
        
        // Initialize
        log('Simulation engine demo ready');
      </script>
    </body>
    </html>
  `);
});

// Analytics endpoints for Sprint 1
app.get('/api/analytics/empire', async (req, res) => {
  try {
    const { scope = 'campaign', id = 1 } = req.query;
    
    // Mock analytics data based on simulation engine KPIs
    const analytics = {
      scope,
      id: Number(id),
      timestamp: new Date().toISOString(),
      metrics: {
        total_population: 700,
        total_resources: 2000,
        production_rate: 70,
        queue_efficiency: 1.0,
        military_readiness: 0.75,
        science_progress: 0.60,
        logistics_efficiency: 0.85,
        market_volatility: 0.12,
        inflation_rate: 0.03
      }
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.get('/api/analytics/snapshots', async (req, res) => {
  try {
    const { scope = 'campaign', id = 1, limit = 10 } = req.query;
    
    // Mock snapshots data - in real implementation this would come from database
    const snapshots = [];
    const now = Date.now();
    
    for (let i = 0; i < Number(limit); i++) {
      snapshots.push({
        id: i + 1,
        scope,
        campaign_id: Number(id),
        timestamp: new Date(now - i * 60000).toISOString(), // 1 minute intervals
        metrics: {
          total_population: 700 + (i * 50),
          total_resources: 2000 + (i * 100),
          production_rate: 70 + (i * 5),
          queue_efficiency: Math.min(1.0, 0.8 + (i * 0.02)),
          military_readiness: Math.min(1.0, 0.5 + (i * 0.05)),
          science_progress: Math.min(1.0, 0.3 + (i * 0.03))
        }
      });
    }
    
    res.json({ snapshots: snapshots.reverse() }); // Most recent first
  } catch (error) {
    console.error('Snapshots error:', error);
    res.status(500).json({ error: 'Failed to fetch snapshots' });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4010;
if (process.env.DEMO_START === '1') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Demo server listening on http://localhost:${PORT}`);
  });
}

export default app;

