import express from 'express';
import cors from 'cors';
import populationRoutes from '../server/population/populationRoutes';
import populationDemo from './population';
import professionRoutes from '../server/professions/professionRoutes';
import professionDemo from './professions';
import businessRoutes from '../server/businesses/businessRoutes';
import businessDemo from './businesses';
import cityRoutes from '../server/cities/cityRoutes';
import cityDemo from './cities';
import cityEmergenceDemo from './city-emergence';
import corporateLifecycleDemo from './corporate-lifecycle';
import characterSystemDemo from './character-system';
import smallBusinessDemo from './small-business';
import economicTierDemo from './economic-tiers';
import educationDemo from './education';
import migrationRoutes from '../server/migration/migrationRoutes';
import migrationDemo from './migration';
import psychologyRoutes from '../server/psychology/psychologyRoutes';
import psychologyDemo from './psychology';
import legalRoutes from '../server/legal/legalRoutes';
import legalDemo from './legal';
import securityRoutes from '../server/security/securityRoutes';
import securityDemo from './security';
import demographicsRoutes from '../server/demographics/demographicsRoutes';
import demographicsDemo from './demographics';
import technologyRoutes from '../server/technology/technologyRoutes';
import technologyDemo from './technology';
import aiAnalysisRoutes from '../server/ai-analysis/aiAnalysisRoutes';
import aiAnalysisDemo from './ai-analysis';
import gameModesRoutes from '../server/game-modes/gameModesRoutes';
import gameModesDemo from './game-modes';
import visualSystemsRoutes from '../server/visual-systems/visualSystemsRoutes';
import visualSystemsDemo from './visual-systems';
// import hybridSimulationRoutes from '../server/hybrid-simulation/hybridSimulationRoutes'; // TODO: Create this module
import hybridSimulationDemo from './hybrid-simulation';
import newsRoutes from '../server/news/newsRoutes';
import newsDemo from './news';
import leaderRoutes from '../server/leader-communications/leaderRoutes';
import leaderDemo from './leader-communications';
import delegationRoutes from '../server/delegation/delegationRoutes';
import delegationDemo from './delegation';
import cabinetRoutes from '../server/cabinet/cabinetRoutes';
import cabinetDemo from './cabinet';
import militaryRoutes from '../server/military/militaryRoutes';
import militaryDemo from './military';
import treasuryRoutes from '../server/treasury/treasuryRoutes';
import treasuryDemo from './treasury';
import defenseRoutes from '../server/defense/defenseRoutes';
import defenseDemo from './defense';
import inflationRoutes from '../server/economics/inflationRoutes';
import inflationDemo from './inflation';
import stateRoutes from '../server/state/stateRoutes';
import stateDemo from './state';
import interiorRoutes from '../server/interior/interiorRoutes';
import interiorDemo from './interior';
import justiceRoutes from '../server/justice/justiceRoutes';
import justiceDemo from './justice';
import commerceRoutes from '../server/commerce/commerceRoutes';
import commerceDemo from './commerce';
import workflowRoutes from '../server/cabinet/workflowRoutes';
import cabinetWorkflowDemo from './cabinet-workflow';
import scienceRoutes from '../server/science/scienceRoutes';
import scienceDemo from './science';
import communicationsRoutes from '../server/communications/communicationsRoutes';
import communicationsDemo from './communications';
import centralBankRoutes from '../server/central-bank/centralBankRoutes';
import centralBankDemo from './central-bank';
import legislatureRoutes from '../server/legislature/legislatureRoutes';
import legislatureDemo from './legislature';
import supremeCourtRoutes from '../server/supreme-court/supremeCourtRoutes';
import supremeCourtDemo from './supreme-court';
import politicalPartyRoutes from '../server/political-parties/politicalPartyRoutes';
import politicalPartyDemo from './political-parties';
import jointChiefsRoutes from '../server/joint-chiefs/jointChiefsRoutes';
import jointChiefsDemo from './joint-chiefs';
import intelligenceDirectorsRoutes from '../server/intelligence/intelligenceRoutes';
import intelligenceDirectorsDemo from './intelligence';
import currencyExchangeRoutes from '../server/currency-exchange/currencyExchangeRoutes';
import currencyExchangeDemo from './currency-exchange';
import fiscalSimulationRoutes from '../server/fiscal-simulation/fiscalSimulationRoutes';
import financialMarketsRoutes from '../server/financial-markets/financialMarketsRoutes';
import economicEcosystemRoutes from '../server/economic-ecosystem/economicEcosystemRoutes';
import healthRoutes from '../server/health/healthRoutes';
import fiscalSimulationDemo from './fiscal-simulation';
import financialMarketsDemo from './financial-markets';
import economicEcosystemDemo from './economic-ecosystem';
import healthDemo from './health';
import witterEnhancedDemo from './witter-enhanced';

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

// Population system routes
app.use('/api/population', populationRoutes);
app.use(populationDemo);

// Profession & Industry System routes
app.use('/api/professions', professionRoutes);
app.use(professionDemo);

// Small Business & Entrepreneurship System routes
app.use('/api/businesses', businessRoutes);
app.use(businessDemo);

// City Specialization & Geography System routes
app.use('/api/cities', cityRoutes);
app.use(cityDemo);
app.use(cityEmergenceDemo);
app.use(corporateLifecycleDemo);
app.use(characterSystemDemo);
app.use(smallBusinessDemo);
app.use(economicTierDemo);
app.use(educationDemo);

// Immigration & Migration System routes
app.use('/api/migration', migrationRoutes);
app.use(migrationDemo);

// Psychology & Behavioral Economics System routes
app.use('/api/psychology', psychologyRoutes);
app.use(psychologyDemo);

// Legal & Justice System routes
app.use('/api/legal', legalRoutes);
app.use(legalDemo);

// Security & Defense System routes
app.use('/api/security', securityRoutes);
app.use(securityDemo);

// Demographics & Lifecycle System routes
app.use('/api/demographics', demographicsRoutes);

// Technology & Cyber Warfare Systems API
app.use('/api/technology', technologyRoutes);

// AI Analysis Engine API
app.use('/api/ai-analysis', aiAnalysisRoutes);

// Game Modes API
app.use('/api/game-modes', gameModesRoutes);

// Visual Systems API
app.use('/api/visual-systems', visualSystemsRoutes);

// Hybrid Simulation Engine
// app.use('/api/hybrid-simulation', hybridSimulationRoutes); // TODO: Create this module

// Intelligence Reporting System API
app.use('/api/intelligence', intelligenceDirectorsRoutes);

// Dynamic News Generation System API
app.use('/api/news', newsRoutes);

// Leader Communications System API
app.use('/api/leader', leaderRoutes);

// Delegation & Authority Management System API
app.use('/api/delegation', delegationRoutes);
app.use('/api/cabinet', cabinetRoutes);
app.use('/api/military', militaryRoutes);
app.use('/api/treasury', treasuryRoutes);
app.use('/api/defense', defenseRoutes);
app.use('/api/inflation', inflationRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/interior', interiorRoutes);
app.use('/api/justice', justiceRoutes);
app.use('/api/commerce', commerceRoutes);
app.use('/api/cabinet', workflowRoutes);
app.use('/api/science', scienceRoutes);
app.use('/api/communications', communicationsRoutes);
app.use('/api/central-bank', centralBankRoutes);
app.use('/api/legislature', legislatureRoutes);
app.use('/api/supreme-court', supremeCourtRoutes);
app.use('/api/political-parties', politicalPartyRoutes);
app.use('/api/joint-chiefs', jointChiefsRoutes);
app.use('/api/intelligence', intelligenceDirectorsRoutes);
app.use('/api/currency-exchange', currencyExchangeRoutes);
app.use('/api/fiscal-simulation', fiscalSimulationRoutes);
app.use('/api/financial-markets', financialMarketsRoutes);
app.use('/api/economic-ecosystem', economicEcosystemRoutes);
app.use('/api/health', healthRoutes);

// Demo routes
app.use(demographicsDemo);
app.use(technologyDemo);
app.use(aiAnalysisDemo);
app.use(gameModesDemo);
app.use(visualSystemsDemo);
app.use('/demo/hybrid-simulation', hybridSimulationDemo);
app.use(intelligenceDirectorsDemo);
app.use(newsDemo);
app.use(leaderDemo);
app.use(delegationDemo);
app.use(cabinetDemo);
app.use(militaryDemo);
app.use(treasuryDemo);
app.use(defenseDemo);
app.use(inflationDemo);
app.use(stateDemo);
app.use(interiorDemo);
app.use(justiceDemo);
app.use(commerceDemo);
app.use(cabinetWorkflowDemo);
app.use(scienceDemo);
app.use(communicationsDemo);
app.use(centralBankDemo);
app.use(legislatureDemo);
app.use(supremeCourtDemo);
app.use(politicalPartyDemo);
app.use(jointChiefsDemo);
app.use(intelligenceDirectorsDemo);
app.use(currencyExchangeDemo);
app.use(fiscalSimulationDemo);
app.use(financialMarketsDemo);
app.use(economicEcosystemDemo);
app.use(healthDemo);
app.use(witterEnhancedDemo);

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

// Speech Demo - Redirect to comprehensive leader communications system
app.get('/demo/speech', (_req, res) => {
  res.redirect('/demo/leader-communications');
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
      body { font-family: system-ui, sans-serif; padding: 16px; background: #0a0a0a; color: #e0e0e0; }
      .container { max-width: 1200px; margin: 0 auto; }
      .game-mode-selector { background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #333; }
      .mode-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px; }
      .mode-card { background: #2a2a2a; padding: 15px; border-radius: 6px; border: 2px solid #444; cursor: pointer; transition: all 0.3s; }
      .mode-card:hover { border-color: #4ade80; background: #333; }
      .mode-card.selected { border-color: #4ade80; background: #1a3a1a; }
      .mode-title { font-weight: bold; color: #4ade80; margin-bottom: 8px; }
      .mode-desc { font-size: 0.9em; color: #ccc; }
      .hud-section { background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; }
      .bar { height: 12px; background: #444; border-radius: 6px; margin: 8px 0; }
      .fill { height: 100%; background: #4ade80; border-radius: 6px; transition: width 0.3s; }
      button { padding: 8px 12px; background: #4ade80; color: #000; border: none; border-radius: 4px; cursor: pointer; }
      button:hover { background: #22c55e; }
      .row { display: flex; gap: 12px; align-items: center; margin-bottom: 15px; }
      .victory-conditions { background: #2a2a2a; padding: 15px; border-radius: 6px; margin-top: 15px; }
      .victory-title { color: #fbbf24; font-weight: bold; margin-bottom: 10px; }
      .victory-item { margin: 5px 0; padding: 5px; background: #333; border-radius: 4px; }
      h1 { color: #4ade80; text-align: center; margin-bottom: 30px; }
      h2 { color: #fbbf24; }
      .visual-preview { background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-top: 20px; }
      .visual-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px; }
      .visual-card { background: #2a2a2a; border-radius: 6px; overflow: hidden; border: 1px solid #444; }
      .visual-placeholder { width: 100%; height: 120px; background: linear-gradient(45deg, #333, #444); display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.9em; }
      .visual-info { padding: 10px; }
      .visual-title { color: #4ade80; font-weight: bold; margin-bottom: 5px; }
      .visual-desc { color: #ccc; font-size: 0.8em; }
      .visual-controls { margin-top: 15px; }
      .visual-toggle { margin-right: 15px; }
      .visual-toggle input { margin-right: 5px; }
      
      /* Production Features Styles */
      .production-preview { background: #1a1a1a; border-radius: 10px; padding: 20px; margin: 20px 0; border: 1px solid #333; }
      .feature-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
      .tab-button { background: #333; color: #ccc; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; transition: all 0.3s; }
      .tab-button.active { background: #4ade80; color: #000; }
      .tab-button:hover { background: #555; }
      .tab-button.active:hover { background: #4ade80; }
      .tab-content { display: none; }
      .tab-content.active { display: block; }
      
      /* User Accounts Styles */
      .account-mockup { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .login-section, .profile-section { background: #222; padding: 15px; border-radius: 8px; }
      .auth-options { display: flex; flex-direction: column; gap: 10px; }
      .auth-btn { padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
      .auth-btn.primary { background: #4ade80; color: #000; }
      .auth-btn.social { background: #333; color: #ccc; }
      .auth-btn:hover { transform: translateY(-2px); }
      .profile-card { display: flex; gap: 15px; align-items: center; }
      .avatar-section { text-align: center; }
      .character-avatar { font-size: 3em; margin-bottom: 10px; }
      .generate-btn { background: #4ade80; color: #000; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
      .profile-info { flex: 1; }
      .profile-info input, .species-select { width: 100%; padding: 8px; margin-bottom: 10px; background: #333; color: #ccc; border: 1px solid #555; border-radius: 4px; }
      .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .stat { background: #333; padding: 8px; border-radius: 4px; text-align: center; font-size: 0.9em; }
      
      /* Campaign Setup Styles */
      .campaign-wizard { max-width: 600px; }
      .wizard-steps { display: flex; gap: 10px; margin-bottom: 20px; }
      .step { background: #333; color: #ccc; padding: 8px 16px; border-radius: 4px; font-size: 0.9em; }
      .step.active { background: #4ade80; color: #000; }
      .form-group { margin-bottom: 15px; }
      .form-group label { display: block; margin-bottom: 5px; color: #4ade80; font-weight: bold; }
      .form-group input, .form-group select { width: 100%; padding: 10px; background: #333; color: #ccc; border: 1px solid #555; border-radius: 4px; }
      .player-slider { width: 100%; }
      .player-count { color: #4ade80; font-weight: bold; }
      .ai-generation { background: #222; padding: 15px; border-radius: 6px; margin-top: 10px; }
      .generation-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .generation-options label { display: flex; align-items: center; gap: 8px; }
      .total-cost { background: #4ade80; color: #000; padding: 15px; border-radius: 6px; text-align: center; margin-top: 15px; }
      
      /* Pricing Styles */
      .pricing-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
      .tier { background: #222; padding: 20px; border-radius: 8px; border: 2px solid #333; }
      .tier.featured { border-color: #4ade80; }
      .tier h4 { color: #4ade80; margin-bottom: 10px; }
      .price { font-size: 1.5em; font-weight: bold; color: #fff; margin-bottom: 15px; }
      .tier ul { list-style: none; padding: 0; }
      .tier li { padding: 5px 0; color: #ccc; }
      .tier li:before { content: "✓ "; color: #4ade80; }
      .subscription-card { background: #222; padding: 15px; border-radius: 8px; }
      .current-plan { color: #4ade80; font-weight: bold; margin-bottom: 5px; }
      .manage-btn { background: #4ade80; color: #000; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
      
      /* Admin Tools Styles */
      .admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
      .stat-card { background: #222; padding: 15px; border-radius: 8px; text-align: center; }
      .stat-number { font-size: 1.8em; font-weight: bold; color: #4ade80; }
      .stat-label { color: #ccc; font-size: 0.9em; }
      .admin-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .moderation-queue, .campaign-monitoring { background: #222; padding: 15px; border-radius: 8px; }
      .report-item, .campaign-item { background: #333; padding: 10px; border-radius: 4px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
      .report-actions, .campaign-item { display: flex; gap: 5px; }
      .action-btn, .monitor-btn { padding: 4px 8px; border: none; border-radius: 3px; cursor: pointer; font-size: 0.8em; }
      .action-btn.warn { background: #fbbf24; color: #000; }
      .action-btn.suspend { background: #ef4444; color: #fff; }
      .action-btn.dismiss { background: #6b7280; color: #fff; }
      .action-btn.approve { background: #4ade80; color: #000; }
      .action-btn.regenerate { background: #3b82f6; color: #fff; }
      .action-btn.block { background: #ef4444; color: #fff; }
      .monitor-btn { background: #4ade80; color: #000; }
      .health-indicator { padding: 2px 8px; border-radius: 3px; font-size: 0.8em; }
      .health-indicator.good { background: #4ade80; color: #000; }
      .health-indicator.warning { background: #fbbf24; color: #000; }
      .timestamp { color: #888; font-size: 0.8em; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🚀 Startales: Galactic Strategy Demo</h1>
      
      <!-- Production Features Preview -->
      <div class="production-preview">
        <h2>🚀 Production Features Preview</h2>
        <div class="feature-tabs">
          <button class="tab-button active" data-tab="accounts">User Accounts</button>
          <button class="tab-button" data-tab="campaigns">Campaign Setup</button>
          <button class="tab-button" data-tab="pricing">Pricing & Billing</button>
          <button class="tab-button" data-tab="admin">Admin Tools</button>
        </div>
        
        <!-- User Accounts Tab -->
        <div id="accounts-tab" class="tab-content active">
          <div class="account-mockup">
            <div class="login-section">
              <h3>Player Authentication</h3>
              <div class="auth-options">
                <button class="auth-btn primary">🎮 Sign Up with Email</button>
                <button class="auth-btn social">🔗 Continue with Google</button>
                <button class="auth-btn social">💬 Continue with Discord</button>
                <button class="auth-btn social">🎯 Continue with Steam</button>
              </div>
            </div>
            <div class="profile-section">
              <h3>Player Profile</h3>
              <div class="profile-card">
                <div class="avatar-section">
                  <div class="character-avatar">🧑‍🚀</div>
                  <button class="generate-btn">Generate New Avatar</button>
                </div>
                <div class="profile-info">
                  <input type="text" placeholder="Player Handle" value="GalacticCommander42">
                  <select class="species-select">
                    <option>Human Empire</option>
                    <option>Zephyrian Collective</option>
                    <option>Mechanoid Syndicate</option>
                    <option>Crystalline Hive</option>
                  </select>
                  <div class="stats-grid">
                    <div class="stat">Campaigns: 12</div>
                    <div class="stat">Victories: 8</div>
                    <div class="stat">Rank: Admiral</div>
                    <div class="stat">Friends: 23</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Campaign Setup Tab -->
        <div id="campaigns-tab" class="tab-content">
          <div class="campaign-wizard">
            <h3>Create New Campaign</h3>
            <div class="wizard-steps">
              <div class="step active">1. Basic Setup</div>
              <div class="step">2. Game Mode</div>
              <div class="step">3. AI & Content</div>
              <div class="step">4. Scheduling</div>
              <div class="step">5. Payment</div>
            </div>
            <div class="setup-form">
              <div class="form-group">
                <label>Campaign Name</label>
                <input type="text" placeholder="The Orion Conflict" value="The Orion Conflict">
              </div>
              <div class="form-group">
                <label>Duration</label>
                <select class="duration-select">
                  <option value="4">4 Weeks ($120)</option>
                  <option value="12" selected>12 Weeks ($300)</option>
                  <option value="24">24 Weeks ($500)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Player Count</label>
                <input type="range" min="2" max="50" value="8" class="player-slider">
                <span class="player-count">8 Players (+$40)</span>
              </div>
              <div class="form-group">
                <label>AI Model Tier</label>
                <select class="ai-tier">
                  <option value="ollama">Ollama (Free)</option>
                  <option value="gemini">Gemini Pro ($50)</option>
                  <option value="claude" selected>Claude Sonnet ($100)</option>
                  <option value="gpt4">GPT-4 Turbo ($150)</option>
                </select>
              </div>
              <div class="ai-generation">
                <h4>AI-Generated Content</h4>
                <div class="generation-options">
                  <label><input type="checkbox" checked> Backstory Generation</label>
                  <label><input type="checkbox" checked> NPC Characters</label>
                  <label><input type="checkbox" checked> Galaxy Map</label>
                  <label><input type="checkbox"> Visual Assets (+$25)</label>
                  <label><input type="checkbox"> Cinematic Videos (+$50)</label>
                </div>
              </div>
              <div class="total-cost">
                <strong>Total Cost: $440 ($55/player)</strong>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pricing & Billing Tab -->
        <div id="pricing-tab" class="tab-content">
          <div class="pricing-mockup">
            <h3>Pricing Calculator</h3>
            <div class="pricing-tiers">
              <div class="tier">
                <h4>Casual Explorer</h4>
                <div class="price">$15-30/campaign</div>
                <ul>
                  <li>4-week campaigns</li>
                  <li>2-6 players</li>
                  <li>Ollama/Gemini AI</li>
                  <li>Basic features</li>
                </ul>
              </div>
              <div class="tier featured">
                <h4>Galactic Commander</h4>
                <div class="price">$40-80/campaign</div>
                <ul>
                  <li>12-week campaigns</li>
                  <li>4-12 players</li>
                  <li>Claude/GPT-4 AI</li>
                  <li>Visual generation</li>
                  <li>Advanced features</li>
                </ul>
              </div>
              <div class="tier">
                <h4>Empire Builder</h4>
                <div class="price">$80-150/campaign</div>
                <ul>
                  <li>24-week campaigns</li>
                  <li>8-50 players</li>
                  <li>Premium AI models</li>
                  <li>Cinematic videos</li>
                  <li>Priority support</li>
                </ul>
              </div>
            </div>
            <div class="billing-info">
              <h4>Subscription Management</h4>
              <div class="subscription-card">
                <div class="current-plan">Current: Galactic Commander</div>
                <div class="next-billing">Next billing: March 15, 2024</div>
                <div class="payment-method">💳 •••• 4242</div>
                <button class="manage-btn">Manage Subscription</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Admin Tools Tab -->
        <div id="admin-tab" class="tab-content">
          <div class="admin-mockup">
            <h3>Admin Dashboard</h3>
            <div class="admin-stats">
              <div class="stat-card">
                <div class="stat-number">1,247</div>
                <div class="stat-label">Active Players</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">89</div>
                <div class="stat-label">Running Campaigns</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">12</div>
                <div class="stat-label">Pending Reports</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">$45,230</div>
                <div class="stat-label">Monthly Revenue</div>
              </div>
            </div>
            <div class="admin-sections">
              <div class="moderation-queue">
                <h4>Content Moderation Queue</h4>
                <div class="report-item">
                  <div class="report-info">
                    <strong>Player: SpaceVandal99</strong>
                    <div>Inappropriate language in campaign chat</div>
                    <div class="timestamp">2 hours ago</div>
                  </div>
                  <div class="report-actions">
                    <button class="action-btn warn">Warn</button>
                    <button class="action-btn suspend">Suspend</button>
                    <button class="action-btn dismiss">Dismiss</button>
                  </div>
                </div>
                <div class="report-item">
                  <div class="report-info">
                    <strong>Campaign: The Dark Nebula</strong>
                    <div>AI-generated content flagged for review</div>
                    <div class="timestamp">4 hours ago</div>
                  </div>
                  <div class="report-actions">
                    <button class="action-btn approve">Approve</button>
                    <button class="action-btn regenerate">Regenerate</button>
                    <button class="action-btn block">Block</button>
                  </div>
                </div>
              </div>
              <div class="campaign-monitoring">
                <h4>Campaign Monitoring</h4>
                <div class="campaign-list">
                  <div class="campaign-item">
                    <strong>The Orion Wars</strong> - 12 players - Week 8/12
                    <div class="health-indicator good">Healthy</div>
                    <button class="monitor-btn">Monitor</button>
                  </div>
                  <div class="campaign-item">
                    <strong>Galactic Uprising</strong> - 6 players - Week 3/4
                    <div class="health-indicator warning">Attention Needed</div>
                    <button class="monitor-btn">Intervene</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="game-mode-selector">
        <h2>Select Game Mode</h2>
        <div class="mode-grid">
          <div class="mode-card" data-mode="coop">
            <div class="mode-title">🛡️ COOP: Galactic Defense</div>
            <div class="mode-desc">Work together to defend against galactic threats. 4-12 players unite against AI villains and cosmic disasters.</div>
          </div>
          <div class="mode-card" data-mode="achievement">
            <div class="mode-title">🏆 Achievement: Supremacy Points</div>
            <div class="mode-desc">Compete for achievement points across military, economic, and diplomatic categories. 2-16 players.</div>
          </div>
          <div class="mode-card" data-mode="conquest">
            <div class="mode-title">⚔️ Conquest: Galactic Domination</div>
            <div class="mode-desc">Total galactic conquest through military might and diplomatic manipulation. 2-20 players compete for control.</div>
          </div>
          <div class="mode-card" data-mode="hero">
            <div class="mode-title">🦸 Hero: Legendary Adventures</div>
            <div class="mode-desc">Small party of heroes works together to defeat powerful villains. 2-6 heroes with special abilities.</div>
          </div>
        </div>
        
        <div class="victory-conditions" id="victoryConditions" style="display: none;">
          <div class="victory-title">Victory Conditions</div>
          <div id="victoryList"></div>
        </div>
      </div>

      <div class="hud-section">
        <h2>Simulation Engine</h2>
        <div class="row">
          <button id="step">Step Engine</button> 
          <span>Step: <span id="stepCount">0</span></span>
          <span id="modeDisplay" style="color: #4ade80; font-weight: bold;"></span>
        </div>
    <div>Production <span id="pLabel">50</span></div>
    <div class="bar"><div id="p" class="fill" style="width:50%"></div></div>
    <div>Queues <span id="qLabel">50</span></div>
    <div class="bar"><div id="q" class="fill" style="width:50%"></div></div>
    <div>Readiness <span id="rLabel">50</span></div>
    <div class="bar"><div id="r" class="fill" style="width:50%"></div></div>
        
        <div class="victory-conditions" id="gameProgress" style="display: none;">
          <div class="victory-title">Game Progress</div>
          <div id="progressList"></div>
        </div>
      </div>

      <div class="visual-preview">
        <h2>Visual Systems Preview</h2>
        <p style="color: #ccc; margin-bottom: 15px;">
          Startales will feature AI-generated visuals that enhance the text-based gameplay. 
          These mockups show how characters, species, environments, and equipment will be visualized with consistent identity preservation.
        </p>
        
        <div class="visual-controls">
          <label class="visual-toggle">
            <input type="checkbox" id="enableVisuals" checked> Enable Visual Generation
          </label>
          <label class="visual-toggle">
            <input type="checkbox" id="enableVideos"> Enable Cinematic Videos
          </label>
          <label class="visual-toggle">
            <input type="checkbox" id="enableAnimations"> Enable UI Animations
          </label>
        </div>

        <div class="visual-grid" id="visualGrid">
          <div class="visual-card">
            <div class="visual-placeholder" id="characterPortrait">
              👤 Character Portrait
            </div>
            <div class="visual-info">
              <div class="visual-title">Species Leader</div>
              <div class="visual-desc">AI-generated portrait with consistent identity across sessions</div>
            </div>
          </div>

          <div class="visual-card">
            <div class="visual-placeholder" id="planetView">
              🌍 Planet Environment
            </div>
            <div class="visual-info">
              <div class="visual-title">Home World</div>
              <div class="visual-desc">Species-specific architecture and environmental design</div>
            </div>
          </div>

          <div class="visual-card">
            <div class="visual-placeholder" id="fleetView">
              🚀 Fleet Formation
            </div>
            <div class="visual-info">
              <div class="visual-title">Battle Fleet</div>
              <div class="visual-desc">Military assets with damage states and modifications</div>
            </div>
          </div>

          <div class="visual-card">
            <div class="visual-placeholder" id="diplomaticScene">
              🤝 Diplomatic Meeting
            </div>
            <div class="visual-info">
              <div class="visual-title">Alliance Ceremony</div>
              <div class="visual-desc">Event-driven video for major plot developments</div>
            </div>
          </div>

          <div class="visual-card">
            <div class="visual-placeholder" id="battleScene">
              ⚔️ Battle Highlight
            </div>
            <div class="visual-info">
              <div class="visual-title">Epic Combat</div>
              <div class="visual-desc">Cinematic sequences for major conflicts</div>
            </div>
          </div>

          <div class="visual-card">
            <div class="visual-placeholder" id="technologyView">
              🔧 Equipment Design
            </div>
            <div class="visual-info">
              <div class="visual-title">Advanced Weaponry</div>
              <div class="visual-desc">Technology visualization with species-specific aesthetics</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #2a2a2a; border-radius: 6px;">
          <div style="color: #fbbf24; font-weight: bold; margin-bottom: 10px;">🎨 Visual Consistency Features</div>
          <div style="color: #ccc; font-size: 0.9em; line-height: 1.4;">
            • <strong>Identity Preservation:</strong> Characters look identical across all appearances using seed-based generation<br/>
            • <strong>Species Design Languages:</strong> Each species has distinctive visual aesthetics and cultural elements<br/>
            • <strong>Style Profiles:</strong> Campaign-wide art direction ensures visual coherence (e.g., "Gritty Space Opera")<br/>
            • <strong>Progressive Enhancement:</strong> Full gameplay available with text-only, visuals enhance experience<br/>
            • <strong>Cross-Media Consistency:</strong> Videos use existing character images as references for identical appearance<br/>
            • <strong>Environmental Continuity:</strong> Locations maintain consistent appearance across images and videos
          </div>
        </div>
      </div>
    </div>
    <script>
      // Game mode data
      const gameModes = {
        coop: {
          name: '🛡️ COOP: Galactic Defense',
          victories: [
            'Repel all major threat waves (3-5 invasions)',
            'Achieve collective prosperity threshold',
            'Establish galactic peace treaty',
            'Maintain alliance cohesion (no eliminations)'
          ]
        },
        achievement: {
          name: '🏆 Achievement: Supremacy Points',
          victories: [
            'Highest total points at campaign end',
            'First to reach 10,000 points threshold',
            'Maintain point lead for 5 consecutive periods',
            'Complete 3 major achievement chains'
          ]
        },
        conquest: {
          name: '⚔️ Conquest: Galactic Domination',
          victories: [
            'Control 75% of galaxy territory',
            'Eliminate all rival empires',
            'Achieve diplomatic hegemony',
            'Control 80% of galactic trade routes'
          ]
        },
        hero: {
          name: '🦸 Hero: Legendary Adventures',
          victories: [
            'Defeat the primary villain',
            'Prevent galactic catastrophe',
            'Recover all legendary artifacts',
            'Achieve legendary hero status'
          ]
        }
      };

      let currentMode = null;
      let gameProgress = {};

      // DOM elements
      const stepBtn = document.getElementById('step');
      const stepCount = document.getElementById('stepCount');
      const modeDisplay = document.getElementById('modeDisplay');
      const p = document.getElementById('p');
      const q = document.getElementById('q');
      const r = document.getElementById('r');
      const pLabel = document.getElementById('pLabel');
      const qLabel = document.getElementById('qLabel');
      const rLabel = document.getElementById('rLabel');
      const victoryConditions = document.getElementById('victoryConditions');
      const victoryList = document.getElementById('victoryList');
      const gameProgressDiv = document.getElementById('gameProgress');
      const progressList = document.getElementById('progressList');

      // Mode selection
      document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
          // Remove previous selection
          document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
          
          // Select new mode
          card.classList.add('selected');
          const mode = card.dataset.mode;
          currentMode = mode;
          
          // Update display
          modeDisplay.textContent = \`Mode: \${gameModes[mode].name}\`;
          
          // Show victory conditions
          victoryConditions.style.display = 'block';
          victoryList.innerHTML = gameModes[mode].victories
            .map(v => \`<div class="victory-item">• \${v}</div>\`)
            .join('');
          
          // Initialize game progress
          gameProgress = {};
          updateGameProgress();
        });
      });

      // Simulation step
      stepBtn.addEventListener('click', async () => {
        if (!currentMode) {
          alert('Please select a game mode first!');
          return;
        }

        try {
          const res = await fetch('/api/sim/step', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              campaignId: 1, 
              seed: 'hud-demo-' + Date.now(),
              gameMode: currentMode
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

            // Update mode-specific progress
            updateModeProgress(data.data);
          } else {
            console.error('Simulation step failed:', data.error);
          }
        } catch (error) {
          console.error('Request failed:', error);
        }
      });

      function updateModeProgress(data) {
        const step = data.step;
        
        switch (currentMode) {
          case 'coop':
            gameProgress.threatsRepelled = Math.floor(step / 10);
            gameProgress.allianceStrength = Math.min(100, step * 2);
            gameProgress.galacticPeace = Math.min(100, step * 1.5);
            break;
            
          case 'achievement':
            gameProgress.totalPoints = step * 150 + Math.floor(Math.random() * 100);
            gameProgress.militaryPoints = Math.floor(gameProgress.totalPoints * 0.25);
            gameProgress.economicPoints = Math.floor(gameProgress.totalPoints * 0.20);
            gameProgress.techPoints = Math.floor(gameProgress.totalPoints * 0.20);
            break;
            
          case 'conquest':
            gameProgress.territoryControl = Math.min(75, step * 1.8);
            gameProgress.militaryStrength = Math.min(100, step * 2.2);
            gameProgress.diplomaticInfluence = Math.min(100, step * 1.3);
            break;
            
          case 'hero':
            gameProgress.villainProgress = Math.min(100, step * 1.5);
            gameProgress.heroLevel = Math.floor(step / 5) + 1;
            gameProgress.artifactsFound = Math.floor(step / 8);
            gameProgress.storyProgress = Math.min(100, step * 1.2);
            break;
        }
        
        updateGameProgress();
      }

      function updateGameProgress() {
        if (!currentMode || Object.keys(gameProgress).length === 0) {
          gameProgressDiv.style.display = 'none';
          return;
        }

        gameProgressDiv.style.display = 'block';
        
        let progressHTML = '';
        
        switch (currentMode) {
          case 'coop':
            progressHTML = \`
              <div class="victory-item">Threats Repelled: \${gameProgress.threatsRepelled}/5</div>
              <div class="victory-item">Alliance Strength: \${gameProgress.allianceStrength}%</div>
              <div class="victory-item">Galactic Peace: \${gameProgress.galacticPeace}%</div>
            \`;
            break;
            
          case 'achievement':
            progressHTML = \`
              <div class="victory-item">Total Points: \${gameProgress.totalPoints}/10,000</div>
              <div class="victory-item">Military: \${gameProgress.militaryPoints} pts</div>
              <div class="victory-item">Economic: \${gameProgress.economicPoints} pts</div>
              <div class="victory-item">Technology: \${gameProgress.techPoints} pts</div>
            \`;
            break;
            
          case 'conquest':
            progressHTML = \`
              <div class="victory-item">Territory Control: \${gameProgress.territoryControl}%/75%</div>
              <div class="victory-item">Military Strength: \${gameProgress.militaryStrength}%</div>
              <div class="victory-item">Diplomatic Influence: \${gameProgress.diplomaticInfluence}%</div>
            \`;
            break;
            
          case 'hero':
            progressHTML = \`
              <div class="victory-item">Villain Threat: \${gameProgress.villainProgress}%</div>
              <div class="victory-item">Hero Level: \${gameProgress.heroLevel}</div>
              <div class="victory-item">Artifacts Found: \${gameProgress.artifactsFound}/5</div>
              <div class="victory-item">Story Progress: \${gameProgress.storyProgress}%</div>
            \`;
            break;
        }
        
        progressList.innerHTML = progressHTML;
      }

      // Visual system controls
      const enableVisualsCheckbox = document.getElementById('enableVisuals');
      const enableVideosCheckbox = document.getElementById('enableVideos');
      const enableAnimationsCheckbox = document.getElementById('enableAnimations');
      const visualGrid = document.getElementById('visualGrid');

      function updateVisualPlaceholders() {
        const visualsEnabled = enableVisualsCheckbox.checked;
        const videosEnabled = enableVideosCheckbox.checked;
        const animationsEnabled = enableAnimationsCheckbox.checked;

        // Update visual placeholders based on current mode and settings
        if (visualsEnabled && currentMode) {
          // Simulate visual generation based on game mode
          updateModeSpecificVisuals(currentMode, videosEnabled);
        } else {
          // Show default placeholders
          resetVisualPlaceholders();
        }

        // Apply animation effects
        if (animationsEnabled) {
          visualGrid.style.transition = 'all 0.3s ease';
        } else {
          visualGrid.style.transition = 'none';
        }
      }

      function updateModeSpecificVisuals(mode, videosEnabled) {
        const characterPortrait = document.getElementById('characterPortrait');
        const planetView = document.getElementById('planetView');
        const fleetView = document.getElementById('fleetView');
        const diplomaticScene = document.getElementById('diplomaticScene');
        const battleScene = document.getElementById('battleScene');
        const technologyView = document.getElementById('technologyView');

        switch (mode) {
          case 'coop':
            characterPortrait.innerHTML = '🛡️ Alliance Leader';
            planetView.innerHTML = '🌍 Defended World';
            fleetView.innerHTML = '🚀 Joint Fleet';
            diplomaticScene.innerHTML = videosEnabled ? '📹 Alliance Treaty' : '🤝 Treaty Signing';
            battleScene.innerHTML = videosEnabled ? '📹 Defense Battle' : '⚔️ Threat Response';
            technologyView.innerHTML = '🔧 Shared Tech';
            break;

          case 'achievement':
            characterPortrait.innerHTML = '🏆 Competitor';
            planetView.innerHTML = '🌍 Developed World';
            fleetView.innerHTML = '🚀 Elite Fleet';
            diplomaticScene.innerHTML = videosEnabled ? '📹 Victory Ceremony' : '🤝 Achievement';
            battleScene.innerHTML = videosEnabled ? '📹 Conquest Highlight' : '⚔️ Military Victory';
            technologyView.innerHTML = '🔧 Advanced Tech';
            break;

          case 'conquest':
            characterPortrait.innerHTML = '⚔️ Conqueror';
            planetView.innerHTML = '🌍 Conquered Territory';
            fleetView.innerHTML = '🚀 War Fleet';
            diplomaticScene.innerHTML = videosEnabled ? '📹 Surrender Ceremony' : '🤝 Capitulation';
            battleScene.innerHTML = videosEnabled ? '📹 Epic Battle' : '⚔️ Total War';
            technologyView.innerHTML = '🔧 War Machine';
            break;

          case 'hero':
            characterPortrait.innerHTML = '🦸 Hero Portrait';
            planetView.innerHTML = '🌍 Quest Location';
            fleetView.innerHTML = '🚀 Hero Ship';
            diplomaticScene.innerHTML = videosEnabled ? '📹 Villain Reveal' : '🤝 NPC Encounter';
            battleScene.innerHTML = videosEnabled ? '📹 Boss Battle' : '⚔️ Epic Confrontation';
            technologyView.innerHTML = '🔧 Legendary Gear';
            break;
        }

        // Add visual generation simulation
        if (Math.random() > 0.7) {
          simulateVisualGeneration();
        }
      }

      function resetVisualPlaceholders() {
        document.getElementById('characterPortrait').innerHTML = '👤 Character Portrait';
        document.getElementById('planetView').innerHTML = '🌍 Planet Environment';
        document.getElementById('fleetView').innerHTML = '🚀 Fleet Formation';
        document.getElementById('diplomaticScene').innerHTML = '🤝 Diplomatic Meeting';
        document.getElementById('battleScene').innerHTML = '⚔️ Battle Highlight';
        document.getElementById('technologyView').innerHTML = '🔧 Equipment Design';
      }

      function simulateVisualGeneration() {
        const cards = document.querySelectorAll('.visual-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        const placeholder = randomCard.querySelector('.visual-placeholder');
        
        // Simulate generation process
        const originalContent = placeholder.innerHTML;
        placeholder.innerHTML = '⏳ Generating...';
        placeholder.style.background = 'linear-gradient(45deg, #4ade80, #22c55e)';
        
        setTimeout(() => {
          placeholder.innerHTML = originalContent;
          placeholder.style.background = 'linear-gradient(45deg, #333, #444)';
          
          // Add generated indicator
          setTimeout(() => {
            placeholder.style.border = '2px solid #4ade80';
            setTimeout(() => {
              placeholder.style.border = 'none';
            }, 1000);
          }, 500);
        }, 2000);
      }

      // Visual control event listeners
      enableVisualsCheckbox.addEventListener('change', updateVisualPlaceholders);
      enableVideosCheckbox.addEventListener('change', updateVisualPlaceholders);
      enableAnimationsCheckbox.addEventListener('change', updateVisualPlaceholders);

      // Initialize with COOP mode selected
      document.querySelector('[data-mode="coop"]').click();
      
      // Update visuals when mode changes
      const originalModeSelection = document.querySelectorAll('.mode-card');
      originalModeSelection.forEach(card => {
        card.addEventListener('click', () => {
          setTimeout(updateVisualPlaceholders, 100);
        });
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
    const { step } = await import('../simulation/engine/engine');
    
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
        
        // Production Features Tab Functionality
        function initProductionFeatures() {
          // Tab switching
          document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
              const tabName = button.dataset.tab;
              
              // Update active tab button
              document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
              button.classList.add('active');
              
              // Update active tab content
              document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
              document.getElementById(\`\${tabName}-tab\`).classList.add('active');
            });
          });
          
          // Campaign setup interactivity
          const playerSlider = document.querySelector('.player-slider');
          const playerCount = document.querySelector('.player-count');
          const durationSelect = document.querySelector('.duration-select');
          const aiTierSelect = document.querySelector('.ai-tier');
          const totalCostDiv = document.querySelector('.total-cost');
          
          function updateCampaignCost() {
            if (!playerSlider || !durationSelect || !aiTierSelect || !totalCostDiv) return;
            
            const players = parseInt(playerSlider.value);
            const duration = parseInt(durationSelect.value);
            const aiTier = aiTierSelect.value;
            
            // Base pricing
            let baseCost = duration === 4 ? 120 : duration === 12 ? 300 : 500;
            
            // AI tier pricing
            const aiCosts = { ollama: 0, gemini: 50, claude: 100, gpt4: 150 };
            baseCost += aiCosts[aiTier] || 0;
            
            // Player scaling
            const playerCost = Math.max(0, players - 2) * 5;
            baseCost += playerCost;
            
            // Visual assets
            const visualAssets = document.querySelector('input[type="checkbox"]:nth-of-type(4)');
            const cinematicVideos = document.querySelector('input[type="checkbox"]:nth-of-type(5)');
            if (visualAssets && visualAssets.checked) baseCost += 25;
            if (cinematicVideos && cinematicVideos.checked) baseCost += 50;
            
            const costPerPlayer = Math.round(baseCost / players);
            totalCostDiv.innerHTML = \`<strong>Total Cost: $\${baseCost} ($\${costPerPlayer}/player)</strong>\`;
          }
          
          if (playerSlider) {
            playerSlider.addEventListener('input', () => {
              if (playerCount) {
                const players = playerSlider.value;
                const playerCost = Math.max(0, players - 2) * 5;
                playerCount.textContent = \`\${players} Players (+$\${playerCost})\`;
              }
              updateCampaignCost();
            });
          }
          
          if (durationSelect) durationSelect.addEventListener('change', updateCampaignCost);
          if (aiTierSelect) aiTierSelect.addEventListener('change', updateCampaignCost);
          
          // Visual assets checkboxes
          document.querySelectorAll('.generation-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateCampaignCost);
          });
          
          // Character avatar generation
          const generateBtn = document.querySelector('.generate-btn');
          const characterAvatar = document.querySelector('.character-avatar');
          if (generateBtn && characterAvatar) {
            const avatars = ['🧑‍🚀', '👩‍🚀', '🤖', '👽', '🧙‍♂️', '🧙‍♀️', '🦸‍♂️', '🦸‍♀️', '👨‍💼', '👩‍💼'];
            generateBtn.addEventListener('click', () => {
              const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
              characterAvatar.textContent = randomAvatar;
            });
          }
          
          // Admin action buttons
          document.querySelectorAll('.action-btn, .monitor-btn').forEach(button => {
            button.addEventListener('click', () => {
              const action = button.textContent.toLowerCase();
              alert(\`Admin action: \${action} - This would trigger the corresponding admin workflow in production.\`);
            });
          });
          
          // Auth buttons
          document.querySelectorAll('.auth-btn').forEach(button => {
            button.addEventListener('click', () => {
              const authType = button.textContent;
              alert(\`Authentication: \${authType} - This would redirect to the authentication provider in production.\`);
            });
          });
          
          // Initial cost calculation
          updateCampaignCost();
        }
        
        // Initialize
        log('Simulation engine demo ready');
        initProductionFeatures();
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

