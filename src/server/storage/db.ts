import { Pool } from 'pg'
import { migrateLLMMessagesTable as migrateLLMMetricsTable } from '../database/llmMetrics.js';

let pool: Pool | null = null;
let isPostgreSQLAvailable = true;

// Check if PostgreSQL is available
async function checkPostgreSQLAvailability(): Promise<boolean> {
  if (!isPostgreSQLAvailable) return false;
  
  try {
    const pgPool = getPool();
    await pgPool.query('SELECT 1');
    return true;
  } catch (error) {
    console.log('💡 PostgreSQL not available, using fallback mode');
    isPostgreSQLAvailable = false;
    return false;
  }
}

// Lazy initialization of PostgreSQL pool
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://gtw:gtw@localhost:5432/gtw'
    });
    
    // Handle connection errors gracefully
    pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
      isPostgreSQLAvailable = false;
    });
  }
  return pool;
}

// Export db object with lazy connection
export const db = {
  transaction: (callback: (tx: any) => any) => callback({}),
  query: async (text: string, params?: any[]) => {
    if (!await checkPostgreSQLAvailability()) {
      throw new Error('PostgreSQL not available');
    }
    try {
      const pgPool = getPool();
      return await pgPool.query(text, params);
    } catch (error) {
      console.error('PostgreSQL query error:', error);
      throw error;
    }
  }
}

async function migrateTaxRates() {
  try {
    const pgPool = getPool();
    // Check if tax_rates table exists
    const t = await pgPool.query("select to_regclass('public.tax_rates') as exists")
    const exists = !!t.rows[0]?.exists
    if (!exists) return
    // Check if region column exists
    const cols = await pgPool.query("select column_name from information_schema.columns where table_name='tax_rates'")
    const colNames = cols.rows.map((r: any) => r.column_name)
    if (!colNames.includes('region')) return
    // Ensure at least one system exists and get an id
    let sysId: number | null = null
    try {
      const sc = await pgPool.query('select id from systems order by id asc limit 1')
      if (sc.rows[0]?.id) sysId = Number(sc.rows[0].id)
    } catch {}
    if (sysId == null) {
      const ins = await pgPool.query("insert into systems(name, sector, x, y) values ('Default Region','Core',0,0) returning id")
      sysId = Number(ins.rows[0].id)
    }
    // Backfill null region values
    await pgPool.query('update tax_rates set region=$1 where region is null', [sysId])
  } catch (error) {
    console.error('Tax rates migration failed:', error);
  }
}

export async function initDb() {
  try {
    const pgPool = getPool();
    await pgPool.query(`
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
    
    -- Civilizations table for AI systems
    create table if not exists civilizations (
      id text primary key,
      name text not null,
      species text not null,
      government_type text not null default 'democracy',
      population bigint not null default 1000000,
      territory_systems text[] not null default '{}',
      capital_system_id int references systems(id),
      diplomatic_status jsonb not null default '{}',
      technology_level int not null default 1,
      culture_values jsonb not null default '{}',
      economic_strength numeric not null default 1.0,
      military_strength numeric not null default 1.0,
      research_focus text[] not null default '{}',
      trade_relations jsonb not null default '{}',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );
    
    -- City markets table for city emergence system
    create table if not exists city_markets (
      id text primary key,
      city_id text not null,
      system_id int references systems(id),
      market_type text not null,
      goods_traded text[] not null default '{}',
      market_size text not null default 'small',
      trade_volume numeric not null default 0,
      price_indices jsonb not null default '{}',
      supply_demand jsonb not null default '{}',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
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
    create table if not exists civilization_analytics_history (
      id serial primary key,
      campaign_id int not null,
      step int not null,
      timestamp timestamp not null,
      economic_health numeric,
      gini_coefficient numeric,
      social_mobility_index numeric,
      analytics_data text,
      created_at timestamp default now(),
      unique(campaign_id, step)
    );
    -- Witter System Tables for Perfect Recall
    create table if not exists witter_posts (
      id text primary key,
      character_id text not null,
      author_name text not null,
      author_type text not null default 'PERSONALITY',
      content text not null,
      timestamp timestamp not null default now(),
      likes int not null default 0,
      shares int not null default 0,
      comments int not null default 0,
      is_liked boolean not null default false,
      is_shared boolean not null default false,
      metadata jsonb,
      campaign_id int,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );
    create table if not exists witter_comments (
      id text primary key,
      post_id text not null references witter_posts(id) on delete cascade,
      character_id text not null,
      author_name text not null,
      author_type text not null default 'PERSONALITY',
      avatar text,
      content text not null,
      timestamp timestamp not null default now(),
      likes int not null default 0,
      replies int not null default 0,
      is_liked boolean not null default false,
      campaign_id int,
      created_at timestamp not null default now()
    );
    create table if not exists witter_interactions (
      id serial primary key,
      post_id text not null references witter_posts(id) on delete cascade,
      character_id text not null,
      interaction_type text not null check (interaction_type in ('like', 'share', 'comment', 'view')),
      timestamp timestamp not null default now(),
      metadata jsonb,
      campaign_id int,
      created_at timestamp not null default now(),
      unique(post_id, character_id, interaction_type)
    );
    -- Conversation Memory Tables
    create table if not exists conversations (
      id text primary key,
      campaign_id int not null,
      participant_ids text[] not null,
      conversation_type text not null check (conversation_type in ('character-player', 'player-player', 'alliance', 'party', 'system')),
      is_private boolean not null default true,
      metadata jsonb,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );
    create table if not exists conversation_messages (
      id text primary key,
      conversation_id text not null references conversations(id) on delete cascade,
      sender_id text not null,
      sender_type text not null check (sender_type in ('player', 'character', 'system')),
      content text not null,
      timestamp timestamp not null default now(),
      message_index int not null,
      entities text[],
      action_type text,
      game_state jsonb,
      vector_id text,
      is_stored_in_memory boolean not null default false,
      campaign_id int,
      created_at timestamp not null default now(),
      unique(conversation_id, message_index)
    );
    -- Character Memory Metadata
    create table if not exists character_memory_collections (
      id serial primary key,
      character_id text not null unique,
      collection_name text not null unique,
      campaign_id int,
      memory_count int not null default 0,
      last_updated timestamp not null default now(),
      metadata jsonb,
      created_at timestamp not null default now()
    );
    -- Civilization Memory Metadata  
    create table if not exists civilization_memory_collections (
      id serial primary key,
      civilization_id text not null unique,
      collection_name text not null unique,
      campaign_id int,
      memory_count int not null default 0,
      last_updated timestamp not null default now(),
      metadata jsonb,
      created_at timestamp not null default now()
    );

    -- Psychology Memory Metadata
    create table if not exists psychology_memory_collections (
      id serial primary key,
      campaign_id int not null unique,
      collection_name text not null unique,
      memory_count int not null default 0,
      last_updated timestamp not null default now(),
      analysis_types jsonb,
      average_confidence real not null default 0,
      trend_stability real not null default 0,
      metadata jsonb,
      created_at timestamp not null default now()
    );

    -- AI Analysis Memory Metadata
    create table if not exists ai_analysis_memory_collections (
      id serial primary key,
      campaign_id int not null unique,
      collection_name text not null unique,
      memory_count int not null default 0,
      last_updated timestamp not null default now(),
      analysis_types jsonb,
      average_confidence real not null default 0,
      average_novelty real not null default 0,
      prediction_accuracy real not null default 0,
      metadata jsonb,
      created_at timestamp not null default now()
    );
    -- Indexes for performance
    create index if not exists idx_witter_posts_character_timestamp on witter_posts(character_id, timestamp desc);
    create index if not exists idx_witter_posts_campaign_timestamp on witter_posts(campaign_id, timestamp desc);
    create index if not exists idx_witter_comments_post_timestamp on witter_comments(post_id, timestamp desc);
    create index if not exists idx_witter_interactions_character_timestamp on witter_interactions(character_id, timestamp desc);
    create index if not exists idx_conversations_campaign_type on conversations(campaign_id, conversation_type);
    create index if not exists idx_conversation_messages_conversation_index on conversation_messages(conversation_id, message_index);
    create index if not exists idx_conversation_messages_sender_timestamp on conversation_messages(sender_id, timestamp desc);
    create index if not exists idx_character_memory_character on character_memory_collections(character_id);
    create index if not exists idx_civilization_memory_civ on civilization_memory_collections(civilization_id);
    create index if not exists idx_psychology_memory_campaign on psychology_memory_collections(campaign_id);
    create index if not exists idx_ai_analysis_memory_campaign on ai_analysis_memory_collections(campaign_id);

    -- News System Tables
    create table if not exists news_outlets (
      id text primary key,
      name text not null,
      type text not null,
      civilization_id text not null,
      perspective jsonb not null,
      target_audience jsonb,
      specializations jsonb,
      credibility real not null default 0.5,
      reach real not null default 0.1,
      metadata jsonb,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    create table if not exists news_articles (
      id text primary key,
      headline text not null,
      subheadline text,
      content text not null,
      summary text not null,
      category text not null,
      scope text not null,
      priority text not null,
      outlet_id text not null,
      outlet_name text not null,
      source_events jsonb,
      related_entities jsonb,
      factual_accuracy real not null default 0.5,
      estimated_reach real not null default 0.1,
      public_reaction jsonb,
      published_at timestamp not null,
      tick_id int not null,
      campaign_id int not null,
      tags jsonb,
      generation_context jsonb,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    create table if not exists news_feeds (
      id text primary key,
      name text not null,
      description text,
      sources jsonb,
      categories jsonb,
      scopes jsonb,
      max_articles_per_tick int not null default 10,
      priority_weights jsonb,
      category_weights jsonb,
      credibility_threshold real not null default 0.3,
      target_demographics jsonb,
      civilization_id text not null,
      access_level text not null default 'public',
      metadata jsonb,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    create table if not exists news_event_triggers (
      id text primary key,
      name text not null,
      description text,
      event_types jsonb,
      thresholds jsonb,
      categories jsonb,
      priority text not null,
      scope text not null,
      urgency real not null default 0.5,
      preferred_outlets jsonb,
      excluded_outlets jsonb,
      content_template text,
      required_elements jsonb,
      optional_elements jsonb,
      metadata jsonb,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- News system indexes
    create index if not exists idx_news_articles_campaign on news_articles(campaign_id);
    create index if not exists idx_news_articles_tick on news_articles(tick_id);
    create index if not exists idx_news_articles_outlet on news_articles(outlet_id);
    create index if not exists idx_news_articles_category on news_articles(category);
    create index if not exists idx_news_articles_scope on news_articles(scope);
    create index if not exists idx_news_articles_priority on news_articles(priority);
    create index if not exists idx_news_articles_published on news_articles(published_at);
    create index if not exists idx_news_outlets_civilization on news_outlets(civilization_id);
    create index if not exists idx_news_feeds_civilization on news_feeds(civilization_id);

    -- Leader Communications System Tables
    create table if not exists leader_briefings (
      id text primary key,
      type text not null,
      title text not null,
      summary text not null,
      content text not null,
      campaign_id int not null,
      tick_id int not null,
      leader_character_id text not null,
      sections jsonb not null default '[]',
      key_points jsonb not null default '[]',
      recommendations jsonb not null default '[]',
      urgent_matters jsonb not null default '[]',
      pending_decisions jsonb not null default '[]',
      advisor_inputs jsonb not null default '[]',
      civilization_status jsonb not null default '{}',
      threat_assessment jsonb not null default '{}',
      opportunity_analysis jsonb not null default '{}',
      generation_context jsonb not null default '{}',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      scheduled_for timestamp,
      delivered_at timestamp,
      read_at timestamp,
      acknowledged boolean not null default false,
      priority text not null default 'medium',
      classification text not null default 'internal'
    );

    create table if not exists leader_speeches (
      id text primary key,
      type text not null,
      title text not null,
      content text not null,
      summary text not null,
      campaign_id int not null,
      tick_id int not null,
      leader_character_id text not null,
      audience jsonb not null default '{}',
      venue text,
      occasion text not null,
      tone text not null,
      duration int not null default 10,
      key_messages jsonb not null default '[]',
      expected_impact jsonb not null default '{}',
      actual_impact jsonb not null default '{}',
      simulation_effects jsonb not null default '[]',
      public_reaction jsonb not null default '{}',
      generation_context jsonb not null default '{}',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      scheduled_for timestamp,
      delivered_at timestamp,
      status text not null default 'draft',
      priority text not null default 'medium'
    );

    create table if not exists pending_decisions (
      id text primary key,
      title text not null,
      description text not null,
      category text not null,
      urgency text not null,
      background text,
      stakeholders jsonb not null default '[]',
      constraints jsonb not null default '[]',
      options jsonb not null default '[]',
      recommended_option text,
      risk_assessment jsonb not null default '{}',
      cost_benefit_analysis jsonb not null default '{}',
      deadline timestamp not null,
      escalation_date timestamp,
      ai_recommendation jsonb not null default '{}',
      campaign_id int not null,
      tick_id int not null,
      leader_character_id text not null,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      decided_at timestamp,
      implemented_at timestamp,
      status text not null default 'pending',
      priority real not null default 0.5,
      feedback text
    );

    create table if not exists decision_implementations (
      id text primary key,
      decision_id text not null references pending_decisions(id),
      selected_option_id text not null,
      implementation_date timestamp not null default now(),
      effects jsonb not null default '[]',
      success_metrics jsonb not null default '{}',
      actual_outcomes jsonb not null default '{}',
      lessons_learned text,
      campaign_id int not null,
      tick_id int not null,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Leader communications system indexes
    create index if not exists idx_leader_briefings_campaign on leader_briefings(campaign_id);
    create index if not exists idx_leader_briefings_tick on leader_briefings(tick_id);
    create index if not exists idx_leader_briefings_leader on leader_briefings(leader_character_id);
    create index if not exists idx_leader_briefings_type on leader_briefings(type);
    create index if not exists idx_leader_briefings_priority on leader_briefings(priority);
    create index if not exists idx_leader_briefings_created on leader_briefings(created_at);
    create index if not exists idx_leader_briefings_scheduled on leader_briefings(scheduled_for);

    create index if not exists idx_leader_speeches_campaign on leader_speeches(campaign_id);
    create index if not exists idx_leader_speeches_tick on leader_speeches(tick_id);
    create index if not exists idx_leader_speeches_leader on leader_speeches(leader_character_id);
    create index if not exists idx_leader_speeches_type on leader_speeches(type);
    create index if not exists idx_leader_speeches_status on leader_speeches(status);
    create index if not exists idx_leader_speeches_created on leader_speeches(created_at);
    create index if not exists idx_leader_speeches_scheduled on leader_speeches(scheduled_for);

    create index if not exists idx_pending_decisions_campaign on pending_decisions(campaign_id);
    create index if not exists idx_pending_decisions_tick on pending_decisions(tick_id);
    create index if not exists idx_pending_decisions_leader on pending_decisions(leader_character_id);
    create index if not exists idx_pending_decisions_category on pending_decisions(category);
    create index if not exists idx_pending_decisions_urgency on pending_decisions(urgency);
    create index if not exists idx_pending_decisions_status on pending_decisions(status);
    create index if not exists idx_pending_decisions_deadline on pending_decisions(deadline);
    create index if not exists idx_pending_decisions_priority on pending_decisions(priority);

    create index if not exists idx_decision_implementations_decision on decision_implementations(decision_id);
    create index if not exists idx_decision_implementations_campaign on decision_implementations(campaign_id);
    create index if not exists idx_decision_implementations_tick on decision_implementations(tick_id);
    create index if not exists idx_decision_implementations_date on decision_implementations(implementation_date);

    -- Delegation & Authority Management System Tables
    
    -- Government Roles
    create table if not exists government_roles (
      id text primary key,
      name text not null,
      title text not null,
      department text not null,
      description text not null,
      base_authority_level int not null check (base_authority_level >= 0 and base_authority_level <= 5),
      default_permissions jsonb not null default '[]',
      required_clearance_level int not null default 1,
      can_delegate boolean not null default true,
      max_delegation_level int not null default 3 check (max_delegation_level >= 0 and max_delegation_level <= 5),
      succession_order int not null default 999,
      is_active boolean not null default true,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Permissions
    create table if not exists permissions (
      id text primary key,
      name text not null,
      category text not null,
      description text not null,
      required_authority_level int not null check (required_authority_level >= 0 and required_authority_level <= 5),
      scope jsonb not null default '[]',
      conditions jsonb not null default '[]',
      is_revocable boolean not null default true,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Authority Delegations
    create table if not exists authority_delegations (
      id text primary key,
      delegator_id text not null,
      delegatee_id text not null,
      role_id text not null references government_roles(id),
      campaign_id int not null,
      scope text not null check (scope in ('full', 'limited', 'approval-required', 'advisory-only', 'emergency-only')),
      permissions jsonb not null default '[]',
      conditions jsonb not null default '[]',
      limitations jsonb not null default '[]',
      start_date timestamp not null default now(),
      end_date timestamp,
      is_active boolean not null default true,
      is_revocable boolean not null default true,
      revocation_reason text,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      revoked_at timestamp
    );

    -- Decisions
    create table if not exists decisions (
      id text primary key,
      title text not null,
      description text not null,
      category text not null,
      impact text not null check (impact in ('low', 'medium', 'high', 'critical')),
      urgency text not null check (urgency in ('low', 'medium', 'high', 'critical')),
      required_authority_level int not null check (required_authority_level >= 0 and required_authority_level <= 5),
      required_permissions jsonb not null default '[]',
      campaign_id int not null,
      tick_id int not null,
      initiator_id text not null,
      assigned_to_id text,
      options jsonb not null default '[]',
      selected_option_id text,
      approval_chain jsonb not null default '[]',
      current_approval_step int not null default 0,
      status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'escalated', 'timeout', 'auto-approved')),
      deadline timestamp not null,
      escalation_date timestamp,
      auto_approval_rules jsonb not null default '[]',
      context jsonb not null default '{}',
      audit_trail jsonb not null default '[]',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      decided_at timestamp,
      implemented_at timestamp
    );

    -- Emergency Powers
    create table if not exists emergency_powers (
      id text primary key,
      name text not null,
      description text not null,
      activation_conditions jsonb not null default '[]',
      expanded_authorities jsonb not null default '[]',
      temporary_delegations jsonb not null default '[]',
      duration int not null default 24, -- in ticks
      auto_deactivation_rules jsonb not null default '[]',
      is_active boolean not null default false,
      activated_by text,
      activated_at timestamp,
      deactivated_at timestamp,
      usage_history jsonb not null default '[]',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Authority Audit Log
    create table if not exists authority_audit (
      id text primary key,
      subject_id text not null,
      subject_type text not null check (subject_type in ('user', 'role', 'delegation')),
      action text not null check (action in ('granted', 'revoked', 'modified', 'used', 'exceeded')),
      authority_type text not null,
      details jsonb not null default '{}',
      performed_by text not null,
      timestamp timestamp not null default now(),
      campaign_id int not null,
      tick_id int,
      ip_address text,
      user_agent text
    );

    -- Delegation Performance Metrics
    create table if not exists delegation_performance (
      id text primary key,
      delegation_id text not null references authority_delegations(id),
      delegatee_id text not null,
      role_id text not null references government_roles(id),
      period_start timestamp not null,
      period_end timestamp not null,
      decisions_handled int not null default 0,
      average_decision_time int not null default 0, -- minutes
      approval_rate real not null default 0 check (approval_rate >= 0 and approval_rate <= 1),
      escalation_rate real not null default 0 check (escalation_rate >= 0 and escalation_rate <= 1),
      player_satisfaction_score real not null default 0 check (player_satisfaction_score >= 0 and player_satisfaction_score <= 1),
      error_rate real not null default 0 check (error_rate >= 0 and error_rate <= 1),
      efficiency_score real not null default 0 check (efficiency_score >= 0 and efficiency_score <= 1),
      feedback jsonb not null default '[]',
      recommendations jsonb not null default '[]',
      calculated_at timestamp not null default now()
    );

    -- Auto-Approval Rules
    create table if not exists auto_approval_rules (
      id text primary key,
      name text not null,
      description text not null,
      conditions jsonb not null default '[]',
      actions jsonb not null default '[]',
      is_active boolean not null default true,
      priority int not null default 0,
      created_by text not null,
      created_at timestamp not null default now(),
      last_used timestamp,
      usage_count int not null default 0
    );

    -- System Configuration
    create table if not exists delegation_system_config (
      id text primary key,
      campaign_id int not null unique,
      settings jsonb not null default '{}',
      global_rules jsonb not null default '[]',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Delegation system indexes
    create index if not exists idx_government_roles_department on government_roles(department);
    create index if not exists idx_government_roles_active on government_roles(is_active);
    create index if not exists idx_government_roles_succession on government_roles(succession_order);

    create index if not exists idx_permissions_category on permissions(category);
    create index if not exists idx_permissions_authority_level on permissions(required_authority_level);

    create index if not exists idx_authority_delegations_campaign on authority_delegations(campaign_id);
    create index if not exists idx_authority_delegations_delegator on authority_delegations(delegator_id);
    create index if not exists idx_authority_delegations_delegatee on authority_delegations(delegatee_id);
    create index if not exists idx_authority_delegations_role on authority_delegations(role_id);
    create index if not exists idx_authority_delegations_active on authority_delegations(is_active);
    create index if not exists idx_authority_delegations_dates on authority_delegations(start_date, end_date);

    create index if not exists idx_decisions_campaign on decisions(campaign_id);
    create index if not exists idx_decisions_tick on decisions(tick_id);
    create index if not exists idx_decisions_category on decisions(category);
    create index if not exists idx_decisions_status on decisions(status);
    create index if not exists idx_decisions_urgency on decisions(urgency);
    create index if not exists idx_decisions_deadline on decisions(deadline);
    create index if not exists idx_decisions_assigned on decisions(assigned_to_id);
    create index if not exists idx_decisions_initiator on decisions(initiator_id);

    create index if not exists idx_emergency_powers_active on emergency_powers(is_active);
    create index if not exists idx_emergency_powers_activated on emergency_powers(activated_at);

    create index if not exists idx_authority_audit_campaign on authority_audit(campaign_id);
    create index if not exists idx_authority_audit_subject on authority_audit(subject_id, subject_type);
    create index if not exists idx_authority_audit_action on authority_audit(action);
    create index if not exists idx_authority_audit_timestamp on authority_audit(timestamp);
    create index if not exists idx_authority_audit_performed_by on authority_audit(performed_by);

    create index if not exists idx_delegation_performance_delegation on delegation_performance(delegation_id);
    create index if not exists idx_delegation_performance_delegatee on delegation_performance(delegatee_id);
    create index if not exists idx_delegation_performance_period on delegation_performance(period_start, period_end);

    create index if not exists idx_auto_approval_rules_active on auto_approval_rules(is_active);
    create index if not exists idx_auto_approval_rules_priority on auto_approval_rules(priority);

    create index if not exists idx_delegation_system_config_campaign on delegation_system_config(campaign_id);

    -- Cabinet & Bureaucracy Management System Tables
    
    -- Cabinet Members
    create table if not exists cabinet_members (
      id text primary key,
      user_id text not null,
      role_id text not null references government_roles(id),
      name text not null,
      title text not null,
      department text not null,
      appointed_date timestamp not null,
      confirmed_date timestamp,
      status text not null default 'nominated' check (status in ('nominated', 'confirmed', 'active', 'suspended', 'resigned', 'dismissed')),
      security_clearance int not null default 1,
      personality_profile jsonb not null default '{}',
      performance_metrics jsonb not null default '{}',
      communication_preferences jsonb not null default '{}',
      emergency_contact_info jsonb not null default '{}',
      biography text,
      qualifications jsonb not null default '[]',
      previous_experience jsonb not null default '[]',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Cabinet Assignments
    create table if not exists cabinet_assignments (
      id text primary key,
      title text not null,
      description text not null,
      category text not null,
      priority text not null check (priority in ('low', 'medium', 'high', 'critical')),
      status text not null default 'assigned' check (status in ('assigned', 'in-progress', 'completed', 'overdue', 'cancelled')),
      assigned_by text not null,
      assigned_to text not null references cabinet_members(id),
      assigned_date timestamp not null default now(),
      due_date timestamp not null,
      completed_date timestamp,
      estimated_hours int not null default 0,
      actual_hours int,
      dependencies jsonb not null default '[]',
      deliverables jsonb not null default '[]',
      progress int not null default 0 check (progress >= 0 and progress <= 100),
      notes text,
      attachments jsonb not null default '[]',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Bureaucratic Processes
    create table if not exists bureaucratic_processes (
      id text primary key,
      name text not null,
      description text not null,
      department text not null,
      category text not null,
      steps jsonb not null default '[]',
      required_approvals jsonb not null default '[]',
      estimated_duration int not null default 0, -- minutes
      priority text not null check (priority in ('low', 'medium', 'high', 'critical')),
      status text not null default 'draft' check (status in ('draft', 'active', 'suspended', 'deprecated')),
      version text not null default '1.0',
      effective_date timestamp not null default now(),
      expiration_date timestamp,
      created_by text not null,
      approved_by jsonb not null default '[]',
      related_policies jsonb not null default '[]',
      compliance_requirements jsonb not null default '[]',
      performance_metrics jsonb not null default '{}',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Process Instances
    create table if not exists process_instances (
      id text primary key,
      process_id text not null references bureaucratic_processes(id),
      initiated_by text not null,
      initiated_date timestamp not null default now(),
      current_step int not null default 0,
      status text not null default 'running' check (status in ('running', 'completed', 'failed', 'cancelled', 'suspended')),
      priority text not null check (priority in ('low', 'medium', 'high', 'critical')),
      inputs jsonb not null default '{}',
      outputs jsonb not null default '{}',
      step_history jsonb not null default '[]',
      estimated_completion timestamp,
      actual_completion timestamp,
      assigned_personnel jsonb not null default '[]',
      notes text,
      attachments jsonb not null default '[]',
      audit_trail jsonb not null default '[]',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Cabinet Meetings
    create table if not exists cabinet_meetings (
      id text primary key,
      title text not null,
      type text not null check (type in ('regular', 'emergency', 'special', 'crisis')),
      scheduled_date timestamp not null,
      duration int not null default 60, -- minutes
      location text not null,
      chairperson text not null,
      attendees jsonb not null default '[]',
      agenda jsonb not null default '[]',
      minutes jsonb not null default '{}',
      decisions jsonb not null default '[]',
      action_items jsonb not null default '[]',
      status text not null default 'scheduled' check (status in ('scheduled', 'in-progress', 'completed', 'cancelled', 'postponed')),
      security_classification text not null default 'internal' check (security_classification in ('public', 'internal', 'confidential', 'secret', 'top-secret')),
      recording_allowed boolean not null default false,
      created_by text not null,
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Decision Support Requests
    create table if not exists decision_support_requests (
      id text primary key,
      requester_id text not null,
      title text not null,
      description text not null,
      category text not null,
      urgency text not null check (urgency in ('low', 'medium', 'high', 'critical')),
      context jsonb not null default '{}',
      options jsonb not null default '[]',
      constraints jsonb not null default '[]',
      stakeholders jsonb not null default '[]',
      timeline jsonb not null default '{}',
      required_analysis jsonb not null default '[]',
      budget_impact jsonb not null default '{}',
      risk_assessment jsonb not null default '{}',
      recommendations jsonb not null default '[]',
      status text not null default 'draft' check (status in ('draft', 'analysis', 'review', 'decision', 'implementation', 'completed')),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      decided_at timestamp,
      implemented_at timestamp
    );

    -- Cabinet Activity Log
    create table if not exists cabinet_activity_log (
      id text primary key,
      type text not null,
      title text not null,
      description text not null,
      timestamp timestamp not null default now(),
      participants jsonb not null default '[]',
      impact text not null check (impact in ('low', 'medium', 'high', 'critical')),
      status text not null,
      metadata jsonb not null default '{}'
    );

    -- Cabinet System Configuration
    create table if not exists cabinet_system_config (
      id text primary key,
      campaign_id int not null unique,
      settings jsonb not null default '{}',
      workflow_settings jsonb not null default '{}',
      security_settings jsonb not null default '{}',
      integration_settings jsonb not null default '{}',
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Cabinet system indexes
    create index if not exists idx_cabinet_members_role on cabinet_members(role_id);
    create index if not exists idx_cabinet_members_status on cabinet_members(status);
    create index if not exists idx_cabinet_members_department on cabinet_members(department);
    create index if not exists idx_cabinet_members_appointed on cabinet_members(appointed_date);

    create index if not exists idx_cabinet_assignments_assigned_to on cabinet_assignments(assigned_to);
    create index if not exists idx_cabinet_assignments_status on cabinet_assignments(status);
    create index if not exists idx_cabinet_assignments_due_date on cabinet_assignments(due_date);
    create index if not exists idx_cabinet_assignments_priority on cabinet_assignments(priority);

    create index if not exists idx_bureaucratic_processes_department on bureaucratic_processes(department);
    create index if not exists idx_bureaucratic_processes_status on bureaucratic_processes(status);
    create index if not exists idx_bureaucratic_processes_category on bureaucratic_processes(category);

    create index if not exists idx_process_instances_process on process_instances(process_id);
    create index if not exists idx_process_instances_status on process_instances(status);
    create index if not exists idx_process_instances_initiated on process_instances(initiated_date);

    create index if not exists idx_cabinet_meetings_scheduled on cabinet_meetings(scheduled_date);
    create index if not exists idx_cabinet_meetings_status on cabinet_meetings(status);
    create index if not exists idx_cabinet_meetings_type on cabinet_meetings(type);

    create index if not exists idx_decision_support_requests_requester on decision_support_requests(requester_id);
    create index if not exists idx_decision_support_requests_status on decision_support_requests(status);
    create index if not exists idx_decision_support_requests_urgency on decision_support_requests(urgency);

    create index if not exists idx_cabinet_activity_log_timestamp on cabinet_activity_log(timestamp);
    create index if not exists idx_cabinet_activity_log_type on cabinet_activity_log(type);

    create index if not exists idx_cabinet_system_config_campaign on cabinet_system_config(campaign_id);

    -- Enhanced War Simulator System Tables
    
    -- Military Units
    create table if not exists military_units (
      id text primary key,
      name text not null,
      type text not null,
      classification text not null,
      domain text not null check (domain in ('land', 'sea', 'air', 'space', 'cyber', 'multi-domain')),
      size int not null default 0,
      max_size int not null default 0,
      
      -- Combat Statistics
      combat_stats jsonb not null default '{}',
      
      -- Morale System (AI-Driven)
      morale jsonb not null default '{}',
      
      -- Technology & Equipment
      technology jsonb not null default '{}',
      equipment jsonb not null default '[]',
      
      -- Position & Movement
      location jsonb not null default '{}',
      movement jsonb not null default '{}',
      
      -- Command & Control
      command jsonb not null default '{}',
      
      -- Experience & Training
      experience jsonb not null default '{}',
      training jsonb not null default '{}',
      
      -- Supply & Logistics
      supply jsonb not null default '{}',
      
      -- Special Capabilities
      special_capabilities jsonb not null default '[]',
      
      -- Status & Condition
      status jsonb not null default '{}',
      condition jsonb not null default '{}',
      
      -- Alliance & Coalition
      allegiance jsonb not null default '{}',
      
      -- Campaign Association
      campaign_id int not null,
      civilization_id text not null,
      
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      last_combat timestamp
    );

    -- Battle History
    create table if not exists battle_history (
      id text primary key,
      battle_name text not null,
      
      -- Battle Participants
      attacker_units jsonb not null default '[]',
      defender_units jsonb not null default '[]',
      alliance_forces jsonb not null default '[]',
      
      -- Battle Conditions
      conditions jsonb not null default '{}',
      
      -- Battle Results
      outcome text not null check (outcome in ('attacker-victory', 'defender-victory', 'stalemate', 'mutual-destruction')),
      decisiveness real not null check (decisiveness >= 0 and decisiveness <= 1),
      duration real not null default 0, -- hours
      
      -- Casualties
      attacker_casualties jsonb not null default '{}',
      defender_casualties jsonb not null default '{}',
      
      -- Battle Analysis
      key_factors jsonb not null default '[]',
      turning_points jsonb not null default '[]',
      
      -- Post-Battle Status
      territory_control jsonb not null default '{}',
      strategic_impact jsonb not null default '{}',
      
      -- Lessons Learned
      tactical_lessons jsonb not null default '[]',
      strategic_lessons jsonb not null default '[]',
      
      -- Battle Statistics
      statistics jsonb not null default '{}',
      
      -- Location & Context
      location jsonb not null default '{}',
      campaign_id int not null,
      
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Morale Events
    create table if not exists morale_events (
      id text primary key,
      unit_id text not null references military_units(id),
      event_type text not null,
      event_subtype text not null,
      severity text not null check (severity in ('minor', 'moderate', 'major', 'critical')),
      duration text not null check (duration in ('instant', 'short', 'medium', 'long', 'permanent')),
      
      -- Morale Impact
      morale_before real not null check (morale_before >= 0 and morale_before <= 100),
      morale_after real not null check (morale_after >= 0 and morale_after <= 100),
      impact real not null, -- can be negative
      
      -- Event Details
      description text not null,
      factors jsonb not null default '{}',
      
      -- Context
      campaign_id int not null,
      tick_id int,
      battle_id text,
      
      created_at timestamp not null default now()
    );

    -- Sensor Networks
    create table if not exists sensor_networks (
      id text primary key,
      name text not null,
      deployment_id text not null,
      
      -- Network Configuration
      coverage jsonb not null default '{}',
      sensors jsonb not null default '[]',
      
      -- Network Status
      operational boolean not null default true,
      coverage_percentage real not null default 0 check (coverage_percentage >= 0 and coverage_percentage <= 1),
      detection_capability jsonb not null default '{}',
      
      -- Network Performance
      detection_accuracy real not null default 0 check (detection_accuracy >= 0 and detection_accuracy <= 1),
      false_positive_rate real not null default 0 check (false_positive_rate >= 0 and false_positive_rate <= 1),
      response_time real not null default 0, -- seconds
      
      -- Vulnerabilities & Maintenance
      vulnerabilities jsonb not null default '[]',
      maintenance_requirements jsonb not null default '[]',
      last_maintenance timestamp,
      next_maintenance timestamp,
      
      -- Ownership & Access
      owner_civilization text not null,
      shared_with jsonb not null default '[]', -- alliance access
      
      -- Location & Context
      deployment_area jsonb not null default '{}',
      campaign_id int not null,
      
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      deactivated_at timestamp
    );

    -- Intelligence Operations
    create table if not exists intelligence_operations (
      id text primary key,
      operation_name text not null,
      operation_type text not null,
      
      -- Operation Details
      target jsonb not null default '{}',
      assets jsonb not null default '[]', -- unit IDs involved
      
      -- Operation Status
      status text not null default 'planned' check (status in ('planned', 'active', 'completed', 'failed', 'aborted', 'compromised')),
      priority int not null default 3 check (priority >= 1 and priority <= 5),
      
      -- Operation Timeline
      planned_start timestamp not null,
      actual_start timestamp,
      planned_end timestamp not null,
      actual_end timestamp,
      
      -- Operation Results
      success boolean,
      intelligence_collected jsonb not null default '{}',
      casualties jsonb not null default '{}',
      exposure_level real check (exposure_level >= 0 and exposure_level <= 1),
      
      -- Follow-up
      follow_up_recommendations jsonb not null default '[]',
      follow_up_operations jsonb not null default '[]',
      
      -- Security & Access
      classification text not null default 'secret' check (classification in ('unclassified', 'confidential', 'secret', 'top-secret')),
      compartments jsonb not null default '[]',
      authorized_personnel jsonb not null default '[]',
      
      -- Context
      campaign_id int not null,
      civilization_id text not null,
      
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Alliance Military Coordination
    create table if not exists alliance_military_coordination (
      id text primary key,
      operation_name text not null,
      
      -- Alliance Participants
      primary_alliance text not null,
      participating_alliances jsonb not null default '[]',
      
      -- Force Composition
      alliance_forces jsonb not null default '[]',
      total_units int not null default 0,
      
      -- Coordination Details
      supreme_commander text not null,
      command_structure jsonb not null default '{}',
      coordination_efficiency real not null default 0 check (coordination_efficiency >= 0 and coordination_efficiency <= 1),
      
      -- Operation Status
      status text not null default 'planning' check (status in ('planning', 'coordinating', 'executing', 'completed', 'failed', 'cancelled')),
      
      -- Operation Timeline
      planned_start timestamp not null,
      actual_start timestamp,
      planned_end timestamp not null,
      actual_end timestamp,
      
      -- Results
      success boolean,
      alliance_performance jsonb not null default '{}',
      trust_impact jsonb not null default '{}', -- alliance ID -> trust change
      
      -- Context
      campaign_id int not null,
      
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Military Commanders
    create table if not exists military_commanders (
      id text primary key,
      name text not null,
      rank text not null,
      
      -- Leadership Qualities
      leadership jsonb not null default '{}',
      
      -- Experience & Skills
      experience jsonb not null default '{}',
      skills jsonb not null default '{}',
      
      -- Personal Traits
      traits jsonb not null default '[]',
      
      -- Status
      status text not null default 'active' check (status in ('active', 'wounded', 'missing', 'captured', 'dead', 'retired')),
      morale real not null default 75 check (morale >= 0 and morale <= 100),
      fatigue real not null default 0 check (fatigue >= 0 and fatigue <= 100),
      
      -- Background
      background text,
      achievements jsonb not null default '[]',
      
      -- Current Assignment
      current_unit text, -- references military_units(id)
      assignment_date timestamp,
      
      -- Context
      campaign_id int not null,
      civilization_id text not null,
      
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );

    -- Military Infrastructure
    create table if not exists military_infrastructure (
      id text primary key,
      name text not null,
      type text not null check (type in ('base', 'depot', 'factory', 'shipyard', 'spaceport', 'command-center', 'intelligence-facility')),
      
      -- Location
      location jsonb not null default '{}',
      
      -- Infrastructure Capabilities
      capacity int not null default 0,
      current_utilization int not null default 0,
      production_capability jsonb not null default '{}',
      
      -- Defense & Security
      defensive_rating int not null default 0,
      security_level int not null default 1,
      garrison_units jsonb not null default '[]',
      
      -- Supply & Logistics
      supply_capacity jsonb not null default '{}',
      current_supplies jsonb not null default '{}',
      
      -- Status & Condition
      operational_status text not null default 'operational' check (operational_status in ('operational', 'limited', 'non-operational', 'destroyed')),
      condition_rating real not null default 1 check (condition_rating >= 0 and condition_rating <= 1),
      
      -- Ownership
      owner_civilization text not null,
      shared_access jsonb not null default '[]', -- alliance access
      
      -- Context
      campaign_id int not null,
      
      created_at timestamp not null default now(),
      updated_at timestamp not null default now(),
      destroyed_at timestamp
    );

    -- Military system indexes
    create index if not exists idx_military_units_campaign on military_units(campaign_id);
    create index if not exists idx_military_units_civilization on military_units(civilization_id);
    create index if not exists idx_military_units_type on military_units(type);
    create index if not exists idx_military_units_domain on military_units(domain);
    create index if not exists idx_military_units_status on military_units(((status->>'operational')));
    create index if not exists idx_military_units_location on military_units using gin(location);

    create index if not exists idx_battle_history_campaign on battle_history(campaign_id);
    create index if not exists idx_battle_history_outcome on battle_history(outcome);
    create index if not exists idx_battle_history_created on battle_history(created_at);
    create index if not exists idx_battle_history_participants on battle_history using gin(attacker_units, defender_units);

    create index if not exists idx_morale_events_unit on morale_events(unit_id);
    create index if not exists idx_morale_events_campaign on morale_events(campaign_id);
    create index if not exists idx_morale_events_type on morale_events(event_type);
    create index if not exists idx_morale_events_created on morale_events(created_at);

    create index if not exists idx_sensor_networks_campaign on sensor_networks(campaign_id);
    create index if not exists idx_sensor_networks_owner on sensor_networks(owner_civilization);
    create index if not exists idx_sensor_networks_operational on sensor_networks(operational);
    create index if not exists idx_sensor_networks_coverage on sensor_networks using gin(coverage);

    create index if not exists idx_intelligence_operations_campaign on intelligence_operations(campaign_id);
    create index if not exists idx_intelligence_operations_civilization on intelligence_operations(civilization_id);
    create index if not exists idx_intelligence_operations_type on intelligence_operations(operation_type);
    create index if not exists idx_intelligence_operations_status on intelligence_operations(status);
    create index if not exists idx_intelligence_operations_classification on intelligence_operations(classification);

    create index if not exists idx_alliance_military_coordination_campaign on alliance_military_coordination(campaign_id);
    create index if not exists idx_alliance_military_coordination_alliance on alliance_military_coordination(primary_alliance);
    create index if not exists idx_alliance_military_coordination_status on alliance_military_coordination(status);

    create index if not exists idx_military_commanders_campaign on military_commanders(campaign_id);
    create index if not exists idx_military_commanders_civilization on military_commanders(civilization_id);
    create index if not exists idx_military_commanders_status on military_commanders(status);
    create index if not exists idx_military_commanders_unit on military_commanders(current_unit);

    create index if not exists idx_military_infrastructure_campaign on military_infrastructure(campaign_id);
    create index if not exists idx_military_infrastructure_owner on military_infrastructure(owner_civilization);
    create index if not exists idx_military_infrastructure_type on military_infrastructure(type);
    create index if not exists idx_military_infrastructure_status on military_infrastructure(operational_status);
    create index if not exists idx_military_infrastructure_location on military_infrastructure using gin(location);
  `)
    // Perform post-DDL migrations that require querying
    await migrateTaxRates()
    
    // Initialize LLM metrics table
    await migrateLLMMetricsTable()
    
    // Initialize Treasury system schema - skip for now as it only has interfaces
    console.log('✅ Treasury system interfaces loaded (no schema initialization needed)');
    
        // Initialize Defense Secretary schema
    try {
      const { initializeDefenseSchema } = await import('../defense/defenseSchema.js');
      await initializeDefenseSchema(pgPool);
    } catch (error) {
      console.error('Defense schema initialization failed:', error);
    }

    // Initialize Inflation Tracking schema
    try {
      const { initializeInflationSchema } = await import('../economics/inflationSchema.js');
      await initializeInflationSchema(pgPool);
    } catch (error) {
      console.error('Inflation schema initialization failed:', error);
    }

    // Initialize State Department schema
    try {
      const { initializeStateSchema } = await import('../state/stateSchema.js');
      await initializeStateSchema(pgPool);
    } catch (error) {
      console.error('State Department schema initialization failed:', error);
    }

    // Initialize Interior Department schema
    try {
      const { initializeInteriorSchema } = await import('../interior/interiorSchema.js');
      await initializeInteriorSchema(pgPool);
    } catch (error) {
      console.error('Interior Department schema initialization failed:', error);
    }

    // Initialize Justice Department schema
    try {
      const { initializeJusticeSchema } = await import('../justice/justiceSchema.js');
      await initializeJusticeSchema(pgPool);
    } catch (error) {
      console.error('Justice Department schema initialization failed:', error);
    }

    // Initialize Commerce Department schema - skip for now as it references non-existent campaigns table
    console.log('✅ Commerce Department schema skipped (requires campaigns table migration)');

    // Initialize Cabinet Workflow Automation schema
    try {
      const { initializeWorkflowSchema } = await import('../cabinet/workflowSchema.js');
      await initializeWorkflowSchema(pgPool);
    } catch (error) {
      console.error('Cabinet Workflow Automation schema initialization failed:', error);
    }

    // Initialize Science Secretary schema
    try {
      const { initializeScienceSchema } = await import('../science/scienceSchema.js');
      await initializeScienceSchema(pgPool);
    } catch (error) {
      console.error('Science Secretary schema initialization failed:', error);
    }

    // Initialize Communications Secretary schema
    try {
      const { initializeCommunicationsSchema } = await import('../communications/communicationsSchema.js');
      await initializeCommunicationsSchema(pgPool);
    } catch (error) {
      console.error('Communications Secretary schema initialization failed:', error);
    }

    // Initialize Central Bank Advisory System schema
    try {
      const { initializeCentralBankSchema } = await import('../central-bank/centralBankSchema.js');
      await initializeCentralBankSchema(pgPool);
    } catch (error) {
      console.error('Central Bank Advisory System schema initialization failed:', error);
    }

    // Initialize Central Bank Enhancements (Gold Reserves, QE, Multi-Currency)
    try {
      console.log('🏦 Initializing Central Bank Enhancements schema...');
      const { initializeCentralBankEnhancements } = await import('../central-bank/centralBankEnhancements.js');
      await initializeCentralBankEnhancements(pgPool);
      console.log('✅ Central Bank Enhancements schema initialized successfully');
    } catch (error) {
      console.error('❌ Central Bank Enhancements schema initialization failed:', error);
      // Don't throw - continue with other initializations
    }

    // Initialize Sovereign Wealth Fund system
    try {
      console.log('💰 Initializing Sovereign Wealth Fund schema...');
      const { initializeSovereignWealthFundSchema } = await import('../sovereign-wealth-fund/sovereignWealthFundSchema.js');
      await initializeSovereignWealthFundSchema(pgPool);
      console.log('✅ Sovereign Wealth Fund schema initialized successfully');
    } catch (error) {
      console.error('❌ Sovereign Wealth Fund schema initialization failed:', error);
      // Don't throw - continue with other initializations
    }

    // Initialize WhoseApp system
    try {
      console.log('💬 Initializing WhoseApp schema...');
      const { initializeWhoseAppSchema } = await import('../whoseapp/whoseAppSchema.js');
      await initializeWhoseAppSchema(pgPool);
      console.log('✅ WhoseApp schema initialized successfully');
    } catch (error) {
      console.error('❌ WhoseApp schema initialization failed:', error);
      // Don't throw - continue with other initializations
    }

    // Initialize Government Bonds system
    try {
      console.log('💰 Initializing Government Bonds schema...');
      const { initializeGovernmentBondsSchema } = await import('../government-bonds/governmentBondsSchema.js');
      await initializeGovernmentBondsSchema(pgPool);
      console.log('✅ Government Bonds schema initialized successfully');
    } catch (error) {
      console.error('❌ Government Bonds schema initialization failed:', error);
      // Don't throw - continue with other initializations
    }

      // Initialize Planetary Government system
  try {
    console.log('🌍 Initializing Planetary Government schema...');
    const { initializePlanetaryGovernmentSchema, insertPlanetaryGovernmentSeedData } = await import('../planetary-government/planetaryGovernmentSchema.js');
    await initializePlanetaryGovernmentSchema(pgPool);
    await insertPlanetaryGovernmentSeedData(pgPool);
    console.log('✅ Planetary Government schema initialized successfully');
  } catch (error) {
    console.error('❌ Planetary Government schema initialization failed:', error);
    // Don't throw - continue with other initializations
  }

      // Initialize Institutional Override system
    try {
      console.log('⚖️ Initializing Institutional Override schema...');
      const { initializeInstitutionalOverrideSchema, insertInstitutionalOverrideSeedData } = await import('../institutional-override/institutionalOverrideSchema.js');
      await initializeInstitutionalOverrideSchema(pgPool);
      await insertInstitutionalOverrideSeedData(pgPool);
      console.log('✅ Institutional Override schema initialized successfully');
    } catch (error) {
      console.error('❌ Institutional Override schema initialization failed:', error);
      // Don't throw - continue with other initializations
    }

    // Initialize Media Control system
    try {
      console.log('📺 Initializing Media Control schema...');
      const { initializeMediaControlSchema, insertMediaControlSeedData } = await import('../media-control/mediaControlSchema.js');
      await initializeMediaControlSchema(pgPool);
      await insertMediaControlSeedData(pgPool);
      console.log('✅ Media Control schema initialized successfully');
    } catch (error) {
      console.error('❌ Media Control schema initialization failed:', error);
      // Don't throw - continue with other initializations
    }

    // Initialize Legislative Bodies Advisory System schema
    try {
      const { initializeLegislatureSchema } = await import('../legislature/legislatureSchema.js');
      await initializeLegislatureSchema(pgPool);
    } catch (error) {
      console.error('Legislative Bodies Advisory System schema initialization failed:', error);
    }

    // Initialize Supreme Court Advisory System schema
    try {
      const { initializeSupremeCourtSchema } = await import('../supreme-court/supremeCourtSchema.js');
      await initializeSupremeCourtSchema(pgPool);
    } catch (error) {
      console.error('Supreme Court Advisory System schema initialization failed:', error);
    }

    // Initialize Enhanced Political Party System schema
    try {
      const { initializePoliticalPartySchema } = await import('../political-parties/politicalPartySchema.js');
      await initializePoliticalPartySchema(pgPool);
    } catch (error) {
      console.error('Enhanced Political Party System schema initialization failed:', error);
    }

    // Initialize Government Types System schema
    try {
      const { initializeGovernmentTypesSchema } = await import('../governance/governmentTypesSchema.js');
      await initializeGovernmentTypesSchema(pgPool);
    } catch (error) {
      console.error('Government Types System schema initialization failed:', error);
    }

    // Initialize Government Contracts System schema
    try {
      const { initializeGovernmentContractsSchema } = await import('../governance/governmentContractsSchema.js');
      await initializeGovernmentContractsSchema(pgPool);
    } catch (error) {
      console.error('Government Contracts System schema initialization failed:', error);
    }

    // Initialize Sim Engine System schema
    try {
      const { initializeSimEngineSchema } = await import('../sim-engine/simEngineSchema.js');
      await initializeSimEngineSchema(pgPool);
    } catch (error) {
      console.error('Sim Engine System schema initialization failed:', error);
    }

    // Initialize Joint Chiefs of Staff & Service Chiefs schema
    try {
      const { initializeJointChiefsSchema } = await import('../joint-chiefs/jointChiefsSchema.js');
      await initializeJointChiefsSchema(pgPool);
    } catch (error) {
      console.error('Joint Chiefs of Staff schema initialization failed:', error);
    }

    // Initialize Intelligence Directors System schema
    try {
      const { initializeIntelligenceSchema } = await import('../intelligence/intelligenceSchema.js');
      await initializeIntelligenceSchema(pgPool);
    } catch (error) {
      console.error('Intelligence Directors System schema initialization failed:', error);
    }

    // Initialize Currency Exchange System schema
    try {
      const { initializeCurrencyExchangeSchema } = await import('../currency-exchange/currencyExchangeSchema.js');
      await initializeCurrencyExchangeSchema(pgPool);
    } catch (error) {
      console.error('Currency Exchange System schema initialization failed:', error);
    }

    // Initialize Fiscal Policy Simulation Integration schema
    try {
      const { initializeFiscalSimulationSchema } = await import('../fiscal-simulation/fiscalSimulationSchema.js');
      await initializeFiscalSimulationSchema(pgPool);
    } catch (error) {
      console.error('Fiscal Policy Simulation Integration schema initialization failed:', error);
    }

    // Initialize Financial Markets System schema
    try {
      const { initializeFinancialMarketsSchema } = await import('../financial-markets/financialMarketsSchema.js');
      await initializeFinancialMarketsSchema(pgPool);
    } catch (error) {
      console.error('Financial Markets System schema initialization failed:', error);
    }

    // Initialize Economic Ecosystem schema
    try {
      const { initializeEconomicEcosystemSchema } = await import('../economic-ecosystem/economicEcosystemSchema.js');
      await initializeEconomicEcosystemSchema(pgPool);
    } catch (error) {
      console.error('Economic Ecosystem schema initialization failed:', error);
    }

    // Initialize Health & Human Services schema
    try {
      const { initializeHealthSchema } = await import('../health/healthSchema.js');
      await initializeHealthSchema(pgPool);
      
      // Initialize Character System schema
      const { initializeCharacterSchema } = await import('../characters/characterSchema.js');
      await initializeCharacterSchema(pgPool);
      
      // Initialize Small Business Ecosystem schema
      const { initializeSmallBusinessSchema } = await import('../small-business/smallBusinessSchema.js');
      await initializeSmallBusinessSchema(pgPool);
      
      // Initialize Economic Tier Evolution schema
      const { initializeEconomicTierSchema } = await import('../economic-tiers/economicTierSchema.js');
      await initializeEconomicTierSchema(pgPool);
      
      // Initialize Education System schema
      const { initializeEducationSchema } = await import('../education/educationSchema.js');
      await initializeEducationSchema(pgPool);
    } catch (error) {
      console.error('Health & Human Services schema initialization failed:', error);
    }

    console.log('✅ PostgreSQL database initialized');
  } catch (error) {
    console.error('❌ PostgreSQL initialization failed:', error);
    console.log('💡 This is expected if PostgreSQL is not available - some features may be limited');
    // Don't throw error - allow app to continue with limited functionality
  }
}

export async function getGoals() {
  try {
    const pgPool = getPool();
    const { rows } = await pgPool.query('select story,empire,discovery,social from vezy_goals limit 1')
    return rows[0]
  } catch (error) {
    console.error('Failed to get goals:', error);
    return { story: 100, empire: 100, discovery: 100, social: 100 };
  }
}

export async function setGoals(g: {story?:number;empire?:number;discovery?:number;social?:number}) {
  try {
    const current = await getGoals()
    const next = {
      story: Number.isFinite(g.story) ? g.story! : current.story,
      empire: Number.isFinite(g.empire) ? g.empire! : current.empire,
      discovery: Number.isFinite(g.discovery) ? g.discovery! : current.discovery,
      social: Number.isFinite(g.social) ? g.social! : current.social
    }
    const pgPool = getPool();
    await pgPool.query('update vezy_goals set story=$1,empire=$2,discovery=$3,social=$4', [next.story,next.empire,next.discovery,next.social])
    return next
  } catch (error) {
    console.error('Failed to set goals:', error);
    throw error;
  }
}

export async function upsertSystem(s: { name: string; sector?: string; x?: number; y?: number }) {
  const pgPool = getPool();
  const { rows } = await pgPool.query('insert into systems(name, sector, x, y) values ($1,$2,$3,$4) returning id', [s.name, s.sector ?? null, s.x ?? null, s.y ?? null])
  return rows[0].id as number
}

export async function countSystems(): Promise<number> {
  const pgPool = getPool();
  const { rows } = await pgPool.query('select count(*)::int as c from systems')
  return rows[0]?.c ?? 0
}

export async function upsertPlanet(p: { name: string; biome: string; gravity: number; deposits: {resource:string;richness:number}[]; systemId?: number }) {
  const { rows } = await getPool().query('insert into planets(name, biome, gravity, system_id) values ($1,$2,$3,$4) returning id', [p.name, p.biome, p.gravity, p.systemId ?? null])
  const planetId = rows[0].id as number
  for (const d of p.deposits) {
    await getPool().query('insert into deposits(planet_id, resource, richness) values ($1,$2,$3)', [planetId, d.resource, d.richness])
  }
  return planetId
}

export async function listPlanets() {
  const { rows } = await getPool().query('select id, name, biome, gravity, hazard from planets order by id desc limit 50')
  return rows
}

export async function listSystems() {
  const { rows } = await getPool().query('select id, name, sector, x, y from systems order by id desc limit 100')
  return rows
}

export async function listPlanetsBySystem(systemId: number) {
  const { rows } = await getPool().query('select id, name, biome, gravity, hazard from planets where system_id=$1 order by id desc', [systemId])
  return rows
}

export async function getPlanetDeposits(planetId: number) {
  const { rows } = await getPool().query('select resource, richness from deposits where planet_id=$1', [planetId])
  return rows
}

export async function getStockpiles(planetId: number) {
  const { rows } = await getPool().query('select resource, amount from stockpiles where planet_id=$1', [planetId])
  return rows
}

export async function applyProductionTick(planetId: number) {
  // Apply active policy modifiers (uptime/throughput multipliers) if present
  const mods = await getActiveModifiersAggregate().catch(() => ({ uptime_mult: 1, throughput_mult: 1 })) as any
  const mult = Number(mods.uptime_mult || 1) * Number(mods.throughput_mult || 1)
  const { rows: deps } = await getPool().query('select resource, richness from deposits where planet_id=$1', [planetId])
  for (const d of deps) {
    await getPool().query(
      `insert into stockpiles(planet_id, resource, amount) values ($1,$2,0)
       on conflict do nothing`,
      [planetId, d.resource]
    )
    const base = Number(d.richness) * 10
    const delta = Math.max(0, Math.round(base * (Number.isFinite(mult) ? mult : 1)))
    await getPool().query(
      'update stockpiles set amount = amount + $1 where planet_id=$2 and resource=$3',
      [delta, planetId, d.resource]
    )
  }
  return getStockpiles(planetId)
}

export async function listQueuesByPlanet(planetId: number) {
  const { rows } = await getPool().query('select * from queues where planet_id=$1 order by id desc', [planetId])
  return rows
}

async function ensureStock(planetId: number, resource: string, amount: number) {
  const { rows } = await getPool().query('select amount from stockpiles where planet_id=$1 and resource=$2', [planetId, resource])
  const have = rows[0]?.amount ? Number(rows[0].amount) : 0
  if (have < amount) return false
  await getPool().query('update stockpiles set amount = amount - $1 where planet_id=$2 and resource=$3', [amount, planetId, resource])
  return true
}

export async function createQueueAuto(planetId: number) {
  // Use richest deposit resource for a small demo build
  const { rows: deps } = await getPool().query('select resource, richness from deposits where planet_id=$1 order by richness desc limit 1', [planetId])
  if (!deps.length) throw new Error('no_deposits')
  const resource = deps[0].resource as string
  const cost = 10
  const work = 30
  const ok = await ensureStock(planetId, resource, cost)
  if (!ok) throw new Error('insufficient_resources')
  const { rows } = await getPool().query(
    `insert into queues(planet_id, item_type, cost_resource, cost_amount, work_required)
     values ($1,$2,$3,$4,$5) returning *`, [planetId, 'build:demo', resource, cost, work]
  )
  return rows[0]
}

export async function tickQueue(queueId: number, work: number = 10) {
  const { rows } = await getPool().query('select * from queues where id=$1', [queueId])
  if (!rows.length) throw new Error('queue_not_found')
  const q = rows[0]
  if (q.status === 'done') return q
  const progress = Number(q.progress) + work
  const status = progress >= Number(q.work_required) ? 'done' : 'pending'
  const { rows: upd } = await getPool().query('update queues set progress=$1, status=$2 where id=$3 returning *', [progress, status, queueId])
  const nq = upd[0]
  if (nq.status === 'done' && typeof nq.item_type === 'string' && nq.item_type.startsWith('unit:')) {
    const kind = (nq.item_type as string).split(':')[1] || 'infantry'
    await getPool().query('insert into units(planet_id, kind) values ($1,$2)', [nq.planet_id, kind])
  }
  return nq
}

export async function listUnitsByPlanet(planetId: number) {
  const { rows } = await getPool().query('select id, kind, created_at from units where planet_id=$1 order by id desc', [planetId])
  return rows
}

export async function enqueueInfantry(planetId: number) {
  // consume alloys if available
  const costResource = 'Alloys'
  const costAmount = 20
  const workRequired = 50
  const ok = await ensureStock(planetId, costResource, costAmount)
  if (!ok) throw new Error('insufficient_resources')
  const { rows } = await getPool().query(
    `insert into queues(planet_id, item_type, cost_resource, cost_amount, work_required)
     values ($1,$2,$3,$4,$5) returning *`, [planetId, 'unit:infantry', costResource, costAmount, workRequired]
  )
  return rows[0]
}

export async function getScore() {
  const { rows } = await getPool().query('select story,empire,discovery,social from vezy_score limit 1')
  return rows[0]
}

export async function addEvent(category: 'story'|'empire'|'discovery'|'social', value: number) {
  const column = category
  await getPool().query(`update vezy_score set ${column} = ${column} + $1`, [value])
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
  const { rows } = await getPool().query('select resolution_mode, revial_policy, game_mode, backstory, win_criteria, visual_level from settings limit 1')
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
  await getPool().query(
    `update settings set resolution_mode=$1, revial_policy=$2, game_mode=$3, backstory=$4, win_criteria=$5, visual_level=$6`,
    [next.resolutionMode, next.revialPolicy, next.gameMode, next.backstory ?? null, next.winCriteria ?? null, next.visualLevel ?? null]
  )
  return next
}

// Trade helpers
export async function sumSystemStockpiles(systemId: number) {
  const { rows } = await getPool().query(
    `select s.resource, coalesce(sum(s.amount),0) as amount
     from planets p left join stockpiles s on s.planet_id = p.id
     where p.system_id=$1
     group by s.resource`,
    [systemId]
  )
  return rows.filter((r: any) => r.resource)
}

export async function getTariffs(systemId: number) {
  const { rows } = await getPool().query('select resource, rate from tariffs where system_id=$1', [systemId])
  return rows
}

export async function setTariff(systemId: number, resource: string, rate: number) {
  await getPool().query(
    `insert into tariffs(system_id, resource, rate) values ($1,$2,$3)
     on conflict (system_id, resource) do update set rate=excluded.rate`,
    [systemId, resource, rate]
  )
}

async function ensureStockRow(planetId: number, resource: string) {
  await getPool().query(
    `insert into stockpiles(planet_id, resource, amount) values ($1,$2,0)
     on conflict do nothing`,
    [planetId, resource]
  )
}

export async function incrementPlanetStock(planetId: number, resource: string, delta: number) {
  await ensureStockRow(planetId, resource)
  await getPool().query('update stockpiles set amount = amount + $1 where planet_id=$2 and resource=$3', [delta, planetId, resource])
}

export async function transferBetweenSystems(resource: string, qty: number, sellerSystemId: number, buyerSystemId: number) {
  const sellerPlanets = await getPool().query('select id from planets where system_id=$1 order by id asc', [sellerSystemId])
  let remaining = qty
  for (const row of sellerPlanets.rows) {
    if (remaining <= 0) break
    await ensureStockRow(row.id, resource)
    const { rows } = await getPool().query('select amount from stockpiles where planet_id=$1 and resource=$2', [row.id, resource])
    const have = Number(rows[0]?.amount ?? 0)
    if (have <= 0) continue
    const use = Math.min(have, remaining)
    await getPool().query('update stockpiles set amount = amount - $1 where planet_id=$2 and resource=$3', [use, row.id, resource])
    remaining -= use
  }
  const buyer = await getPool().query('select id from planets where system_id=$1 order by id asc limit 1', [buyerSystemId])
  const transferred = qty - remaining
  if (buyer.rows[0] && transferred > 0) {
    await incrementPlanetStock(buyer.rows[0].id, resource, transferred)
  }
  return { transferred }
}

// Analytics helpers
export async function writeKpiSnapshot(scope: 'campaign'|'region', id: number, metrics: Record<string, any>) {
  await getPool().query('insert into kpi_snapshots(scope, region_or_campaign_id, metrics) values ($1,$2,$3)', [scope, id, metrics])
}

export async function getLatestKpiSnapshot(scope: 'campaign'|'region', id: number) {
  const { rows } = await getPool().query(
    'select scope, region_or_campaign_id as id, ts, metrics from kpi_snapshots where scope=$1 and region_or_campaign_id=$2 order by ts desc limit 1',
    [scope, id]
  )
  return rows[0] || { scope, id, ts: new Date().toISOString(), metrics: {} }
}

export async function listKpiSnapshots(scope: 'campaign'|'region', id: number, windowCount: number) {
  const { rows } = await getPool().query(
    'select scope, region_or_campaign_id as id, ts, metrics from kpi_snapshots where scope=$1 and region_or_campaign_id=$2 order by ts desc limit $3',
    [scope, id, windowCount]
  )
  return rows
}

export async function getKpiBasics() {
  const totalStock = await getPool().query('select coalesce(sum(amount),0)::numeric as total from stockpiles')
  const queueCount = await getPool().query('select count(*)::int as c from queues')
  const unitCount = await getPool().query('select count(*)::int as c from units')
  return {
    stockpileTotal: Number(totalStock.rows[0]?.total ?? 0),
    queueCount: Number(queueCount.rows[0]?.c ?? 0),
    unitCount: Number(unitCount.rows[0]?.c ?? 0)
  }
}

// Policies & Taxes helpers (stubs with persistence)
export async function setPolicy(type: string, value: any) {
  await getPool().query('insert into policies(type, value) values ($1,$2)', [type, value])
}

export async function listPolicies(limit = 20) {
  const { rows } = await getPool().query('select type, value, ts from policies order by ts desc limit $1', [limit])
  return rows
}

export async function setTaxRate(taxType: string, rate: number) {
  // Try modern shape first: tax_type unique
  try {
    const upd = await getPool().query('update tax_rates set rate=$2 where tax_type=$1', [taxType, rate])
    if ((upd.rowCount || 0) === 0) {
      await getPool().query('insert into tax_rates(tax_type, rate) values ($1,$2)', [taxType, rate])
    }
    return
  } catch {
    // Fall back to legacy region-based schema with FK to systems(id)
  }
  // Determine a valid region id to satisfy FK
  let regionId: number | null = null
  try {
    const existing = await getPool().query('select region from tax_rates where region is not null limit 1')
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
  const updLegacy = await getPool().query('update tax_rates set tax_type=$1, rate=$2 where region=$3', [taxType, rate, regionId])
  if ((updLegacy.rowCount || 0) === 0) {
    try {
      await getPool().query('insert into tax_rates(region, corp_tax, tariff_default, vat, tax_type, rate) values ($1, 0.2, 0.05, 0.05, $2, $3)', [regionId, taxType, rate])
    } catch (e) {
      // Final fallback: if insert fails, rethrow for route to handle
      throw e
    }
  }
}

export async function listTaxRates() {
  const { rows } = await getPool().query('select tax_type, rate from tax_rates order by tax_type asc')
  return rows
}

// Policies & Advisors helpers
export type PolicyInput = { title: string; body: string; scope?: string; tags?: any; author?: string }
export async function createPolicy(p: PolicyInput) {
  const { rows } = await getPool().query(
    'insert into policies(title, body, scope, tags, author, type, value, ts) values ($1,$2,$3,$4,$5,$6,$7,coalesce($8, now())) returning id',
    [p.title, p.body, p.scope || 'campaign', p.tags || null, p.author || null, 'freeform', JSON.stringify({}), null]
  )
  return rows[0].id as number
}

export type ModifierInput = { policyId: number; key: string; value: number; capMin?: number|null; capMax?: number|null; approvedBy?: string|null }
export async function activatePolicyModifiers(mods: ModifierInput[]) {
  for (const m of mods) {
    await getPool().query(
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
  const { rows } = await getPool().query('select policy_id, key, value, cap_min, cap_max from policy_modifiers')
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
  try {
    const pgPool = getPool();
    const { rows } = await pgPool.query('insert into pending_actions(domain, payload) values ($1,$2) returning id', [domain, payload])
    return rows[0].id as number
  } catch (error) {
    console.error('Failed to create pending action:', error);
    throw error;
  }
}

export async function approvePendingAction(id: number) {
  await getPool().query('update pending_actions set approved_at = now() where id=$1', [id])
}

export async function listPendingActions(status: 'pending'|'approved'|'executed'|'all' = 'pending') {
  let q = 'select id, domain, payload, created_at, approved_at, executed_at from pending_actions'
  if (status !== 'all') {
    if (status === 'pending') q += ' where approved_at is null'
    if (status === 'approved') q += ' where approved_at is not null and executed_at is null'
    if (status === 'executed') q += ' where executed_at is not null'
  }
  const { rows } = await getPool().query(q)
  return rows
}


