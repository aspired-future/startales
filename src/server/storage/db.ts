import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://gtw:gtw@localhost:5432/gtw'
})

// Export db object for testing
export const db = {
  transaction: (callback: (tx: any) => any) => callback({}),
  query: pool.query.bind(pool)
}

async function migrateTaxRates() {
  // Check if tax_rates table exists
  const t = await pool.query("select to_regclass('public.tax_rates') as exists")
  const exists = !!t.rows[0]?.exists
  if (!exists) return
  // Check if region column exists
  const cols = await pool.query("select column_name from information_schema.columns where table_name='tax_rates'")
  const colNames = cols.rows.map((r: any) => r.column_name)
  if (!colNames.includes('region')) return
  // Ensure at least one system exists and get an id
  let sysId: number | null = null
  try {
    const sc = await pool.query('select id from systems order by id asc limit 1')
    if (sc.rows[0]?.id) sysId = Number(sc.rows[0].id)
  } catch {}
  if (sysId == null) {
    const ins = await pool.query("insert into systems(name, sector, x, y) values ('Default Region','Core',0,0) returning id")
    sysId = Number(ins.rows[0].id)
  }
  // Backfill null region values
  await pool.query('update tax_rates set region=$1 where region is null', [sysId])
}

export async function initDb() {
  await pool.query(`
    create table if not exists vezy_goals (
      id serial primary key,
      story int not null default 100,
      empire int not null default 100,
      discovery int not null default 100,
      social int not null default 100
    );
    create table if not exists vezy_score (
      id serial primary key,
      story int not null default 0,
      empire int not null default 0,
      discovery int not null default 0,
      social int not null default 0
    );
    create table if not exists settings (
      id serial primary key,
      resolution_mode text not null default 'outcome',
      revial_policy text not null default 'standard',
      game_mode text not null default 'hero',
      backstory text,
      win_criteria text,
      visual_level text
    );
    insert into vezy_goals (story,empire,discovery,social)
    select 100,100,100,100 where not exists (select 1 from vezy_goals);
    insert into vezy_score (story,empire,discovery,social)
    select 0,0,0,0 where not exists (select 1 from vezy_score);
    insert into settings (resolution_mode, revial_policy, game_mode)
    select 'outcome','standard','hero' where not exists (select 1 from settings);
    create table if not exists planets (
      id serial primary key,
      name text not null,
      biome text not null,
      gravity numeric not null,
      hazard int not null default 0
    );
    create table if not exists systems (
      id serial primary key,
      name text not null,
      sector text,
      x numeric,
      y numeric
    );
    do $$ begin
      begin
        alter table planets add column system_id int references systems(id) on delete set null;
      exception when duplicate_column then null; end;
    end $$;
    create table if not exists deposits (
      id serial primary key,
      planet_id int not null references planets(id) on delete cascade,
      resource text not null,
      richness int not null check (richness >= 0 and richness <= 5)
    );
    create table if not exists stockpiles (
      id serial primary key,
      planet_id int not null references planets(id) on delete cascade,
      resource text not null,
      amount numeric not null default 0
    );
    create table if not exists queues (
      id serial primary key,
      planet_id int not null references planets(id) on delete cascade,
      item_type text not null,
      cost_resource text not null,
      cost_amount numeric not null,
      work_required numeric not null,
      progress numeric not null default 0,
      status text not null default 'pending'
    );
    create table if not exists units (
      id serial primary key,
      planet_id int not null references planets(id) on delete cascade,
      kind text not null,
      created_at timestamp not null default now()
    );
    create table if not exists tariffs (
      id serial primary key,
      system_id int not null references systems(id) on delete cascade,
      resource text not null,
      rate numeric not null default 0,
      unique(system_id, resource)
    );
    create table if not exists routes (
      id serial primary key,
      from_system_id int not null references systems(id) on delete cascade,
      to_system_id int not null references systems(id) on delete cascade,
      capacity numeric not null default 0,
      risk numeric not null default 0
    );
    create table if not exists corps (
      id serial primary key,
      name text not null,
      sector text,
      hq_system_id int references systems(id)
    );
    create table if not exists corp_shares (
      corp_id int not null references corps(id) on delete cascade,
      owner_id text not null,
      shares numeric not null default 0,
      primary key (corp_id, owner_id)
    );
    create table if not exists corp_dividends (
      id serial primary key,
      corp_id int not null references corps(id) on delete cascade,
      amount numeric not null,
      declared_at timestamp not null default now()
    );
    create table if not exists contracts (
      id serial primary key,
      buyer_system_id int not null references systems(id) on delete cascade,
      seller_system_id int not null references systems(id) on delete cascade,
      resource text not null,
      qty numeric not null,
      price numeric not null,
      deliver_at timestamp not null default now()
    );
    create table if not exists corp_kpis (
      id serial primary key,
      corp_id int not null references corps(id) on delete cascade,
      ts timestamp not null default now(),
      output numeric,
      margin numeric,
      on_time_rate numeric
    );
    create table if not exists tax_rates (
      id serial primary key,
      tax_type text not null unique,
      rate numeric not null default 0
    );
    do $$ begin
      begin
        alter table tax_rates add column if not exists tax_type text;
      exception when others then null; end;
      begin
        alter table tax_rates add column if not exists rate numeric default 0;
      exception when others then null; end;
      begin
        alter table tax_rates add column if not exists region int;
      exception when others then null; end;
      begin
        update tax_rates set region = 0 where region is null;
      exception when others then null; end;
      begin
        alter table tax_rates alter column region set default 0;
      exception when others then null; end;
      begin
        alter table tax_rates alter column region set not null;
      exception when others then null; end;
      begin
        alter table tax_rates add column if not exists corp_tax numeric default 0.2;
      exception when others then null; end;
      begin
        alter table tax_rates add column if not exists tariff_default numeric default 0.05;
      exception when others then null; end;
      begin
        alter table tax_rates add column if not exists vat numeric default 0.05;
      exception when others then null; end;
    end $$;
    create table if not exists policies (
      id serial primary key,
      title text not null,
      body text not null,
      scope text not null default 'campaign',
      tags jsonb,
      effective_at timestamp,
      expires_at timestamp,
      author text,
      created_at timestamp not null default now()
    );
    do $$ begin
      begin alter table policies add column if not exists title text; exception when others then null; end;
      begin alter table policies add column if not exists body text; exception when others then null; end;
      begin alter table policies add column if not exists scope text default 'campaign'; exception when others then null; end;
      begin alter table policies add column if not exists tags jsonb; exception when others then null; end;
      begin alter table policies add column if not exists effective_at timestamp; exception when others then null; end;
      begin alter table policies add column if not exists expires_at timestamp; exception when others then null; end;
      begin alter table policies add column if not exists author text; exception when others then null; end;
      begin alter table policies add column if not exists created_at timestamp default now(); exception when others then null; end;
      -- Compatibility columns for legacy helpers
      begin alter table policies add column if not exists type text; exception when others then null; end;
      begin alter table policies add column if not exists value jsonb; exception when others then null; end;
      begin alter table policies add column if not exists ts timestamp default now(); exception when others then null; end;
      -- Ensure legacy columns are nullable to avoid insert failures
      begin alter table policies alter column type drop not null; exception when others then null; end;
      begin alter table policies alter column value drop not null; exception when others then null; end;
    end $$;
    create table if not exists policy_modifiers (
      id serial primary key,
      policy_id int not null references policies(id) on delete cascade,
      key text not null,
      value numeric not null,
      cap_min numeric,
      cap_max numeric,
      approved_at timestamp not null default now(),
      approved_by text
    );
    create table if not exists pending_actions (
      id serial primary key,
      domain text not null,
      payload jsonb not null,
      created_at timestamp not null default now(),
      approved_at timestamp,
      executed_at timestamp
    );
    create index if not exists idx_policy_mods_policy on policy_modifiers(policy_id);
    create table if not exists kpi_snapshots (
      id serial primary key,
      scope text not null,
      region_or_campaign_id int not null,
      ts timestamp not null default now(),
      metrics jsonb not null
    );
  `)
  // Perform post-DDL migrations that require querying
  await migrateTaxRates()
}

export async function getGoals() {
  const { rows } = await pool.query('select story,empire,discovery,social from vezy_goals limit 1')
  return rows[0]
}

export async function setGoals(g: {story?:number;empire?:number;discovery?:number;social?:number}) {
  const current = await getGoals()
  const next = {
    story: Number.isFinite(g.story) ? g.story! : current.story,
    empire: Number.isFinite(g.empire) ? g.empire! : current.empire,
    discovery: Number.isFinite(g.discovery) ? g.discovery! : current.discovery,
    social: Number.isFinite(g.social) ? g.social! : current.social
  }
  await pool.query('update vezy_goals set story=$1,empire=$2,discovery=$3,social=$4', [next.story,next.empire,next.discovery,next.social])
  return next
}

export async function upsertSystem(s: { name: string; sector?: string; x?: number; y?: number }) {
  const { rows } = await pool.query('insert into systems(name, sector, x, y) values ($1,$2,$3,$4) returning id', [s.name, s.sector ?? null, s.x ?? null, s.y ?? null])
  return rows[0].id as number
}

export async function countSystems(): Promise<number> {
  const { rows } = await pool.query('select count(*)::int as c from systems')
  return rows[0]?.c ?? 0
}

export async function upsertPlanet(p: { name: string; biome: string; gravity: number; deposits: {resource:string;richness:number}[]; systemId?: number }) {
  const { rows } = await pool.query('insert into planets(name, biome, gravity, system_id) values ($1,$2,$3,$4) returning id', [p.name, p.biome, p.gravity, p.systemId ?? null])
  const planetId = rows[0].id as number
  for (const d of p.deposits) {
    await pool.query('insert into deposits(planet_id, resource, richness) values ($1,$2,$3)', [planetId, d.resource, d.richness])
  }
  return planetId
}

export async function listPlanets() {
  const { rows } = await pool.query('select id, name, biome, gravity, hazard from planets order by id desc limit 50')
  return rows
}

export async function listSystems() {
  const { rows } = await pool.query('select id, name, sector, x, y from systems order by id desc limit 100')
  return rows
}

export async function listPlanetsBySystem(systemId: number) {
  const { rows } = await pool.query('select id, name, biome, gravity, hazard from planets where system_id=$1 order by id desc', [systemId])
  return rows
}

export async function getPlanetDeposits(planetId: number) {
  const { rows } = await pool.query('select resource, richness from deposits where planet_id=$1', [planetId])
  return rows
}

export async function getStockpiles(planetId: number) {
  const { rows } = await pool.query('select resource, amount from stockpiles where planet_id=$1', [planetId])
  return rows
}

export async function applyProductionTick(planetId: number) {
  // Apply active policy modifiers (uptime/throughput multipliers) if present
  const mods = await getActiveModifiersAggregate().catch(() => ({ uptime_mult: 1, throughput_mult: 1 })) as any
  const mult = Number(mods.uptime_mult || 1) * Number(mods.throughput_mult || 1)
  const { rows: deps } = await pool.query('select resource, richness from deposits where planet_id=$1', [planetId])
  for (const d of deps) {
    await pool.query(
      `insert into stockpiles(planet_id, resource, amount) values ($1,$2,0)
       on conflict do nothing`,
      [planetId, d.resource]
    )
    const base = Number(d.richness) * 10
    const delta = Math.max(0, Math.round(base * (Number.isFinite(mult) ? mult : 1)))
    await pool.query(
      'update stockpiles set amount = amount + $1 where planet_id=$2 and resource=$3',
      [delta, planetId, d.resource]
    )
  }
  return getStockpiles(planetId)
}

export async function listQueuesByPlanet(planetId: number) {
  const { rows } = await pool.query('select * from queues where planet_id=$1 order by id desc', [planetId])
  return rows
}

async function ensureStock(planetId: number, resource: string, amount: number) {
  const { rows } = await pool.query('select amount from stockpiles where planet_id=$1 and resource=$2', [planetId, resource])
  const have = rows[0]?.amount ? Number(rows[0].amount) : 0
  if (have < amount) return false
  await pool.query('update stockpiles set amount = amount - $1 where planet_id=$2 and resource=$3', [amount, planetId, resource])
  return true
}

export async function createQueueAuto(planetId: number) {
  // Use richest deposit resource for a small demo build
  const { rows: deps } = await pool.query('select resource, richness from deposits where planet_id=$1 order by richness desc limit 1', [planetId])
  if (!deps.length) throw new Error('no_deposits')
  const resource = deps[0].resource as string
  const cost = 10
  const work = 30
  const ok = await ensureStock(planetId, resource, cost)
  if (!ok) throw new Error('insufficient_resources')
  const { rows } = await pool.query(
    `insert into queues(planet_id, item_type, cost_resource, cost_amount, work_required)
     values ($1,$2,$3,$4,$5) returning *`, [planetId, 'build:demo', resource, cost, work]
  )
  return rows[0]
}

export async function tickQueue(queueId: number, work: number = 10) {
  const { rows } = await pool.query('select * from queues where id=$1', [queueId])
  if (!rows.length) throw new Error('queue_not_found')
  const q = rows[0]
  if (q.status === 'done') return q
  const progress = Number(q.progress) + work
  const status = progress >= Number(q.work_required) ? 'done' : 'pending'
  const { rows: upd } = await pool.query('update queues set progress=$1, status=$2 where id=$3 returning *', [progress, status, queueId])
  const nq = upd[0]
  if (nq.status === 'done' && typeof nq.item_type === 'string' && nq.item_type.startsWith('unit:')) {
    const kind = (nq.item_type as string).split(':')[1] || 'infantry'
    await pool.query('insert into units(planet_id, kind) values ($1,$2)', [nq.planet_id, kind])
  }
  return nq
}

export async function listUnitsByPlanet(planetId: number) {
  const { rows } = await pool.query('select id, kind, created_at from units where planet_id=$1 order by id desc', [planetId])
  return rows
}

export async function enqueueInfantry(planetId: number) {
  // consume alloys if available
  const costResource = 'Alloys'
  const costAmount = 20
  const workRequired = 50
  const ok = await ensureStock(planetId, costResource, costAmount)
  if (!ok) throw new Error('insufficient_resources')
  const { rows } = await pool.query(
    `insert into queues(planet_id, item_type, cost_resource, cost_amount, work_required)
     values ($1,$2,$3,$4,$5) returning *`, [planetId, 'unit:infantry', costResource, costAmount, workRequired]
  )
  return rows[0]
}

export async function getScore() {
  const { rows } = await pool.query('select story,empire,discovery,social from vezy_score limit 1')
  return rows[0]
}

export async function addEvent(category: 'story'|'empire'|'discovery'|'social', value: number) {
  const column = category
  await pool.query(`update vezy_score set ${column} = ${column} + $1`, [value])
  return getScore()
}

export type StoredSettings = {
  resolutionMode: 'outcome'|'classic'
  revialPolicy: 'story'|'standard'|'hardcore'
  gameMode: 'hero'|'empire'
  backstory?: string | null
  winCriteria?: string | null
  visualLevel?: 'off'|'characters'|'worlds'|'everything' | null
}

export async function getSettings(): Promise<StoredSettings> {
  const { rows } = await pool.query('select resolution_mode, revial_policy, game_mode, backstory, win_criteria, visual_level from settings limit 1')
  const r = rows[0] || {}
  const resolutionMode = r.resolution_mode === 'classic' ? 'classic' : 'outcome'
  const rev = r.revial_policy === 'story' ? 'story' : (r.revial_policy === 'hardcore' ? 'hardcore' : 'standard')
  const game = r.game_mode === 'empire' ? 'empire' : 'hero'
  const visual: any = ['off','characters','worlds','everything'].includes(r.visual_level) ? r.visual_level : null
  return {
    resolutionMode,
    revialPolicy: rev,
    gameMode: game,
    backstory: r.backstory ?? null,
    winCriteria: r.win_criteria ?? null,
    visualLevel: visual
  }
}

export async function setSettings(partial: Partial<StoredSettings>): Promise<StoredSettings> {
  const current = await getSettings()
  const next: StoredSettings = {
    resolutionMode: partial.resolutionMode === 'classic' ? 'classic' : current.resolutionMode,
    revialPolicy: partial.revialPolicy === 'story' ? 'story' : (partial.revialPolicy === 'hardcore' ? 'hardcore' : current.revialPolicy),
    gameMode: partial.gameMode === 'empire' ? 'empire' : (partial.gameMode === 'hero' ? 'hero' : current.gameMode),
    backstory: typeof partial.backstory === 'string' ? partial.backstory : current.backstory ?? null,
    winCriteria: typeof partial.winCriteria === 'string' ? partial.winCriteria : current.winCriteria ?? null,
    visualLevel: (partial.visualLevel && ['off','characters','worlds','everything'].includes(partial.visualLevel)) ? partial.visualLevel : (current.visualLevel ?? null) as any
  }
  await pool.query(
    `update settings set resolution_mode=$1, revial_policy=$2, game_mode=$3, backstory=$4, win_criteria=$5, visual_level=$6`,
    [next.resolutionMode, next.revialPolicy, next.gameMode, next.backstory ?? null, next.winCriteria ?? null, next.visualLevel ?? null]
  )
  return next
}

// Trade helpers
export async function sumSystemStockpiles(systemId: number) {
  const { rows } = await pool.query(
    `select s.resource, coalesce(sum(s.amount),0) as amount
     from planets p left join stockpiles s on s.planet_id = p.id
     where p.system_id=$1
     group by s.resource`,
    [systemId]
  )
  return rows.filter((r: any) => r.resource)
}

export async function getTariffs(systemId: number) {
  const { rows } = await pool.query('select resource, rate from tariffs where system_id=$1', [systemId])
  return rows
}

export async function setTariff(systemId: number, resource: string, rate: number) {
  await pool.query(
    `insert into tariffs(system_id, resource, rate) values ($1,$2,$3)
     on conflict (system_id, resource) do update set rate=excluded.rate`,
    [systemId, resource, rate]
  )
}

async function ensureStockRow(planetId: number, resource: string) {
  await pool.query(
    `insert into stockpiles(planet_id, resource, amount) values ($1,$2,0)
     on conflict do nothing`,
    [planetId, resource]
  )
}

export async function incrementPlanetStock(planetId: number, resource: string, delta: number) {
  await ensureStockRow(planetId, resource)
  await pool.query('update stockpiles set amount = amount + $1 where planet_id=$2 and resource=$3', [delta, planetId, resource])
}

export async function transferBetweenSystems(resource: string, qty: number, sellerSystemId: number, buyerSystemId: number) {
  const sellerPlanets = await pool.query('select id from planets where system_id=$1 order by id asc', [sellerSystemId])
  let remaining = qty
  for (const row of sellerPlanets.rows) {
    if (remaining <= 0) break
    await ensureStockRow(row.id, resource)
    const { rows } = await pool.query('select amount from stockpiles where planet_id=$1 and resource=$2', [row.id, resource])
    const have = Number(rows[0]?.amount ?? 0)
    if (have <= 0) continue
    const use = Math.min(have, remaining)
    await pool.query('update stockpiles set amount = amount - $1 where planet_id=$2 and resource=$3', [use, row.id, resource])
    remaining -= use
  }
  const buyer = await pool.query('select id from planets where system_id=$1 order by id asc limit 1', [buyerSystemId])
  const transferred = qty - remaining
  if (buyer.rows[0] && transferred > 0) {
    await incrementPlanetStock(buyer.rows[0].id, resource, transferred)
  }
  return { transferred }
}

// Analytics helpers
export async function writeKpiSnapshot(scope: 'campaign'|'region', id: number, metrics: Record<string, any>) {
  await pool.query('insert into kpi_snapshots(scope, region_or_campaign_id, metrics) values ($1,$2,$3)', [scope, id, metrics])
}

export async function getLatestKpiSnapshot(scope: 'campaign'|'region', id: number) {
  const { rows } = await pool.query(
    'select scope, region_or_campaign_id as id, ts, metrics from kpi_snapshots where scope=$1 and region_or_campaign_id=$2 order by ts desc limit 1',
    [scope, id]
  )
  return rows[0] || { scope, id, ts: new Date().toISOString(), metrics: {} }
}

export async function listKpiSnapshots(scope: 'campaign'|'region', id: number, windowCount: number) {
  const { rows } = await pool.query(
    'select scope, region_or_campaign_id as id, ts, metrics from kpi_snapshots where scope=$1 and region_or_campaign_id=$2 order by ts desc limit $3',
    [scope, id, windowCount]
  )
  return rows
}

export async function getKpiBasics() {
  const totalStock = await pool.query('select coalesce(sum(amount),0)::numeric as total from stockpiles')
  const queueCount = await pool.query('select count(*)::int as c from queues')
  const unitCount = await pool.query('select count(*)::int as c from units')
  return {
    stockpileTotal: Number(totalStock.rows[0]?.total ?? 0),
    queueCount: Number(queueCount.rows[0]?.c ?? 0),
    unitCount: Number(unitCount.rows[0]?.c ?? 0)
  }
}

// Policies & Taxes helpers (stubs with persistence)
export async function setPolicy(type: string, value: any) {
  await pool.query('insert into policies(type, value) values ($1,$2)', [type, value])
}

export async function listPolicies(limit = 20) {
  const { rows } = await pool.query('select type, value, ts from policies order by ts desc limit $1', [limit])
  return rows
}

export async function setTaxRate(taxType: string, rate: number) {
  // Try modern shape first: tax_type unique
  try {
    const upd = await pool.query('update tax_rates set rate=$2 where tax_type=$1', [taxType, rate])
    if ((upd.rowCount || 0) === 0) {
      await pool.query('insert into tax_rates(tax_type, rate) values ($1,$2)', [taxType, rate])
    }
    return
  } catch {
    // Fall back to legacy region-based schema with FK to systems(id)
  }
  // Determine a valid region id to satisfy FK
  let regionId: number | null = null
  try {
    const existing = await pool.query('select region from tax_rates where region is not null limit 1')
    if (existing.rows[0]?.region != null) {
      regionId = Number(existing.rows[0].region)
    }
  } catch {}
  if (regionId == null) {
    try {
      const sysCount = await countSystems()
      if (sysCount === 0) {
        regionId = await upsertSystem({ name: 'Default Region', sector: 'Core', x: 0, y: 0 })
      } else {
        const systems = await listSystems()
        regionId = systems[0]?.id || null
      }
    } catch {}
  }
  if (regionId == null) throw new Error('no_region_available')
  // Update legacy row for region; otherwise insert a new one with reasonable defaults
  const updLegacy = await pool.query('update tax_rates set tax_type=$1, rate=$2 where region=$3', [taxType, rate, regionId])
  if ((updLegacy.rowCount || 0) === 0) {
    try {
      await pool.query('insert into tax_rates(region, corp_tax, tariff_default, vat, tax_type, rate) values ($1, 0.2, 0.05, 0.05, $2, $3)', [regionId, taxType, rate])
    } catch (e) {
      // Final fallback: if insert fails, rethrow for route to handle
      throw e
    }
  }
}

export async function listTaxRates() {
  const { rows } = await pool.query('select tax_type, rate from tax_rates order by tax_type asc')
  return rows
}

// Policies & Advisors helpers
export type PolicyInput = { title: string; body: string; scope?: string; tags?: any; author?: string }
export async function createPolicy(p: PolicyInput) {
  const { rows } = await pool.query(
    'insert into policies(title, body, scope, tags, author, type, value, ts) values ($1,$2,$3,$4,$5,$6,$7,coalesce($8, now())) returning id',
    [p.title, p.body, p.scope || 'campaign', p.tags || null, p.author || null, 'freeform', JSON.stringify({}), null]
  )
  return rows[0].id as number
}

export type ModifierInput = { policyId: number; key: string; value: number; capMin?: number|null; capMax?: number|null; approvedBy?: string|null }
export async function activatePolicyModifiers(mods: ModifierInput[]) {
  for (const m of mods) {
    await pool.query(
      'insert into policy_modifiers(policy_id, key, value, cap_min, cap_max, approved_by) values ($1,$2,$3,$4,$5,$6)',
      [m.policyId, m.key, m.value, m.capMin ?? null, m.capMax ?? null, m.approvedBy ?? null]
    )
  }
}

function clampValue(val: number, min?: number|null, max?: number|null) {
  let v = Number(val)
  if (Number.isFinite(min as number)) v = Math.max(v, Number(min))
  if (Number.isFinite(max as number)) v = Math.min(v, Number(max))
  return v
}

export async function listActiveModifiers() {
  const { rows } = await pool.query('select policy_id, key, value, cap_min, cap_max from policy_modifiers')
  return rows
}

export async function getActiveModifiersAggregate() {
  const rows = await listActiveModifiers()
  const agg: any = { uptime_mult: 1, throughput_mult: 1, capacity_mult: 1, risk_delta: 0, tariff_delta: 0, subsidy_delta: 0, velocity_mult: 1, readiness_mult: 1 }
  for (const r of rows) {
    const key = String(r.key)
    const val = clampValue(Number(r.value), r.cap_min, r.cap_max)
    if (key.endsWith('_mult')) {
      agg[key] = Number(agg[key] || 1) * val
    } else if (key.endsWith('_delta')) {
      agg[key] = Number(agg[key] || 0) + val
    } else {
      agg[key] = val
    }
  }
  // Clamp common ranges
  agg.uptime_mult = clampValue(agg.uptime_mult, 0.5, 1.5)
  agg.throughput_mult = clampValue(agg.throughput_mult, 0.5, 1.5)
  agg.capacity_mult = clampValue(agg.capacity_mult, 0.5, 2.0)
  agg.velocity_mult = clampValue(agg.velocity_mult, 0.5, 2.0)
  agg.readiness_mult = clampValue(agg.readiness_mult, 0.5, 1.5)
  agg.risk_delta = clampValue(agg.risk_delta, -0.5, 0.5)
  agg.tariff_delta = clampValue(agg.tariff_delta, -0.2, 0.5)
  agg.subsidy_delta = clampValue(agg.subsidy_delta, -0.5, 0.5)
  return agg
}

export async function createPendingAction(domain: string, payload: any) {
  const { rows } = await pool.query('insert into pending_actions(domain, payload) values ($1,$2) returning id', [domain, payload])
  return rows[0].id as number
}

export async function approvePendingAction(id: number) {
  await pool.query('update pending_actions set approved_at = now() where id=$1', [id])
}

export async function listPendingActions(status: 'pending'|'approved'|'executed'|'all' = 'pending') {
  let q = 'select id, domain, payload, created_at, approved_at, executed_at from pending_actions'
  if (status !== 'all') {
    if (status === 'pending') q += ' where approved_at is null'
    if (status === 'approved') q += ' where approved_at is not null and executed_at is null'
    if (status === 'executed') q += ' where executed_at is not null'
  }
  const { rows } = await pool.query(q)
  return rows
}


