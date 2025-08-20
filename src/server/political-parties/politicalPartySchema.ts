import { Pool } from 'pg';

/**
 * Initialize Enhanced Political Party System database schema
 */
export async function initializePoliticalPartySchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Enhance existing political_parties table with additional columns
    await client.query(`
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS party_backstory TEXT;
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS founding_date TIMESTAMP;
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS key_historical_events JSONB DEFAULT '[]';
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS current_leadership_structure JSONB DEFAULT '{}';
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS membership_demographics JSONB DEFAULT '{}';
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS electoral_history JSONB DEFAULT '[]';
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS fundraising_data JSONB DEFAULT '{}';
      ALTER TABLE political_parties ADD COLUMN IF NOT EXISTS media_strategy JSONB DEFAULT '{}';
    `);

    // Party Leadership
    await client.query(`
      CREATE TABLE IF NOT EXISTS party_leadership (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        party_id INTEGER REFERENCES political_parties(id),
        leadership_position VARCHAR(50) NOT NULL, -- 'party_leader', 'deputy_leader', 'whip', 'spokesperson', etc.
        leader_name VARCHAR(100) NOT NULL,
        appointment_date TIMESTAMP NOT NULL,
        leadership_style VARCHAR(50) NOT NULL, -- 'charismatic', 'technocratic', 'populist', 'moderate', etc.
        approval_rating DECIMAL(4,1) CHECK (approval_rating BETWEEN 0 AND 100),
        specialization JSONB NOT NULL DEFAULT '[]',
        political_background TEXT,
        leadership_priorities JSONB NOT NULL DEFAULT '[]',
        public_statements INTEGER DEFAULT 0,
        media_appearances INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'interim', 'resigned', 'challenged')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Party Policy Positions (detailed)
    await client.query(`
      CREATE TABLE IF NOT EXISTS party_policy_positions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        party_id INTEGER REFERENCES political_parties(id),
        policy_area VARCHAR(50) NOT NULL, -- 'economic', 'social', 'security', 'environmental', 'international'
        policy_topic VARCHAR(100) NOT NULL, -- 'taxation', 'healthcare', 'defense_spending', etc.
        position_summary TEXT NOT NULL,
        detailed_position TEXT NOT NULL,
        position_strength VARCHAR(20) CHECK (position_strength IN ('core_principle', 'strong_support', 'moderate_support', 'neutral', 'moderate_opposition', 'strong_opposition')),
        flexibility_level VARCHAR(20) CHECK (flexibility_level IN ('non_negotiable', 'firm', 'flexible', 'very_flexible')),
        public_messaging TEXT,
        supporting_arguments JSONB NOT NULL DEFAULT '[]',
        policy_evolution JSONB NOT NULL DEFAULT '[]',
        last_updated TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Party Witter Activity
    await client.query(`
      CREATE TABLE IF NOT EXISTS party_witter_activity (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        party_id INTEGER REFERENCES political_parties(id),
        account_type VARCHAR(30) NOT NULL, -- 'official_party', 'party_leader', 'spokesperson', 'rapid_response'
        account_handle VARCHAR(50) NOT NULL,
        post_type VARCHAR(30) NOT NULL, -- 'policy_statement', 'event_response', 'opposition_critique', 'rally_announcement', etc.
        post_content TEXT NOT NULL,
        hashtags JSONB NOT NULL DEFAULT '[]',
        mentions JSONB NOT NULL DEFAULT '[]',
        engagement_metrics JSONB NOT NULL DEFAULT '{}',
        response_to_post_id INTEGER,
        political_context TEXT,
        messaging_strategy VARCHAR(50),
        post_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Party Electoral Performance
    await client.query(`
      CREATE TABLE IF NOT EXISTS party_electoral_performance (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        party_id INTEGER REFERENCES political_parties(id),
        election_type VARCHAR(30) NOT NULL, -- 'general', 'primary', 'special', 'local'
        election_date TIMESTAMP NOT NULL,
        vote_share DECIMAL(5,2) CHECK (vote_share BETWEEN 0 AND 100),
        seats_won INTEGER DEFAULT 0,
        seats_contested INTEGER DEFAULT 0,
        voter_turnout_impact DECIMAL(4,1),
        demographic_performance JSONB NOT NULL DEFAULT '{}',
        geographic_performance JSONB NOT NULL DEFAULT '{}',
        issue_performance JSONB NOT NULL DEFAULT '{}',
        campaign_spending BIGINT DEFAULT 0,
        campaign_strategy TEXT,
        election_outcome VARCHAR(20) CHECK (election_outcome IN ('major_victory', 'victory', 'narrow_victory', 'narrow_loss', 'loss', 'major_loss')),
        post_election_analysis TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Party Coalitions & Alliances
    await client.query(`
      CREATE TABLE IF NOT EXISTS party_coalitions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        coalition_name VARCHAR(100) NOT NULL,
        coalition_type VARCHAR(30) NOT NULL, -- 'governing', 'opposition', 'issue_based', 'electoral'
        member_parties JSONB NOT NULL DEFAULT '[]',
        coalition_agreement TEXT,
        policy_priorities JSONB NOT NULL DEFAULT '[]',
        leadership_structure JSONB NOT NULL DEFAULT '{}',
        formation_date TIMESTAMP NOT NULL,
        expected_duration VARCHAR(50),
        success_metrics JSONB NOT NULL DEFAULT '{}',
        internal_tensions JSONB NOT NULL DEFAULT '[]',
        public_approval DECIMAL(4,1) CHECK (public_approval BETWEEN 0 AND 100),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('forming', 'active', 'strained', 'dissolved')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Party Events & Activities
    await client.query(`
      CREATE TABLE IF NOT EXISTS party_events (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        party_id INTEGER REFERENCES political_parties(id),
        event_type VARCHAR(30) NOT NULL, -- 'rally', 'convention', 'fundraiser', 'town_hall', 'press_conference'
        event_title VARCHAR(200) NOT NULL,
        event_description TEXT,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(200),
        expected_attendance INTEGER,
        actual_attendance INTEGER,
        key_speakers JSONB NOT NULL DEFAULT '[]',
        event_agenda JSONB NOT NULL DEFAULT '[]',
        media_coverage BOOLEAN DEFAULT FALSE,
        witter_coverage BOOLEAN DEFAULT TRUE,
        event_outcomes JSONB NOT NULL DEFAULT '{}',
        public_reception VARCHAR(20) CHECK (public_reception IN ('very_positive', 'positive', 'mixed', 'negative', 'very_negative')),
        fundraising_total BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_party_leadership_campaign_party 
      ON party_leadership(campaign_id, party_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_party_policy_positions_campaign_area 
      ON party_policy_positions(campaign_id, policy_area, policy_topic);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_party_witter_activity_campaign_date 
      ON party_witter_activity(campaign_id, post_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_party_electoral_performance_campaign_date 
      ON party_electoral_performance(campaign_id, election_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_party_coalitions_campaign_status 
      ON party_coalitions(campaign_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_party_events_campaign_date 
      ON party_events(campaign_id, event_date DESC);
    `);

    // Update existing political parties with enhanced data
    await client.query(`
      UPDATE political_parties SET 
        party_backstory = CASE party_name
          WHEN 'Progressive Alliance' THEN 'Emerged from merger of Environmental Justice Party and Social Democratic Union during the Great Climate Crisis of 2145. Founded on principles of social justice, environmental sustainability, and economic equality. Led major reforms including Universal Healthcare Act (2148) and Digital Rights Amendment advocacy (2154).'
          WHEN 'Conservative Coalition' THEN 'United traditional conservatives with business interests during the Economic Stabilization Crisis of 2143. Built on fiscal responsibility, traditional values, and strong defense principles. Authored Fiscal Responsibility Act (2147) and championed Defense Modernization Initiative (2153).'
          WHEN 'Centrist Party' THEN 'Created by moderate politicians from both major parties seeking pragmatic governance in 2149. Focuses on evidence-based policy and bipartisan cooperation. Brokered Infrastructure Compromise (2152) and mediated Digital Privacy Negotiations (2154).'
          WHEN 'Libertarian Movement' THEN 'Grassroots movement formalized during Government Expansion Debates of 2146. Champions individual liberty, minimal government, and free markets. Challenged Surveillance Authorization Act (2153) and promoted Economic Freedom Initiative (2154).'
          WHEN 'Nationalist Party' THEN 'Emerged during Interplanetary Trade Disputes of 2151 as civilization-first movement. Advocates for sovereignty, cultural preservation, and economic protectionism. Led Trade Protection Movement (2152) and championed Sovereignty Act (2154).'
        END,
        founding_date = CASE party_name
          WHEN 'Progressive Alliance' THEN '2145-03-15'::timestamp
          WHEN 'Conservative Coalition' THEN '2143-08-22'::timestamp
          WHEN 'Centrist Party' THEN '2149-11-10'::timestamp
          WHEN 'Libertarian Movement' THEN '2146-06-04'::timestamp
          WHEN 'Nationalist Party' THEN '2151-09-18'::timestamp
        END,
        key_historical_events = CASE party_name
          WHEN 'Progressive Alliance' THEN '[
            {"event": "Great Climate Crisis Response", "date": "2145-03-15", "impact": "Party formation catalyst"},
            {"event": "Universal Healthcare Act Leadership", "date": "2148-05-20", "impact": "Major legislative victory"},
            {"event": "Great Climate March Organization", "date": "2151-04-22", "impact": "Grassroots mobilization success"},
            {"event": "Digital Rights Amendment Advocacy", "date": "2154-01-10", "impact": "Constitutional reform leadership"}
          ]'::jsonb
          WHEN 'Conservative Coalition' THEN '[
            {"event": "Economic Stabilization Crisis", "date": "2143-08-22", "impact": "Party unification moment"},
            {"event": "Fiscal Responsibility Act", "date": "2147-12-01", "impact": "Signature legislative achievement"},
            {"event": "Universal Healthcare Opposition", "date": "2148-05-20", "impact": "Successful opposition campaign"},
            {"event": "Defense Modernization Initiative", "date": "2153-07-15", "impact": "Security policy leadership"}
          ]'::jsonb
          WHEN 'Centrist Party' THEN '[
            {"event": "Moderate Coalition Formation", "date": "2149-11-10", "impact": "Cross-party unity achievement"},
            {"event": "Infrastructure Compromise", "date": "2152-03-18", "impact": "Bipartisan negotiation success"},
            {"event": "Digital Privacy Mediation", "date": "2154-02-28", "impact": "Constitutional compromise leadership"},
            {"event": "Democratic Reform Initiative", "date": "2155-01-05", "impact": "Institutional improvement advocacy"}
          ]'::jsonb
          WHEN 'Libertarian Movement' THEN '[
            {"event": "Government Expansion Debates", "date": "2146-06-04", "impact": "Movement formalization catalyst"},
            {"event": "Surveillance Act Challenge", "date": "2153-09-12", "impact": "Civil liberties advocacy"},
            {"event": "Economic Freedom Initiative", "date": "2154-04-30", "impact": "Free market promotion"},
            {"event": "Deregulation Campaign", "date": "2155-02-14", "impact": "Government reduction advocacy"}
          ]'::jsonb
          WHEN 'Nationalist Party' THEN '[
            {"event": "Interplanetary Trade Disputes", "date": "2151-09-18", "impact": "Party emergence catalyst"},
            {"event": "Trade Protection Movement", "date": "2152-01-25", "impact": "Economic sovereignty campaign"},
            {"event": "Cultural Exchange Opposition", "date": "2153-06-08", "impact": "Cultural preservation advocacy"},
            {"event": "Sovereignty Act Championship", "date": "2154-11-20", "impact": "National independence legislation"}
          ]'::jsonb
        END
      WHERE campaign_id = 1
    `);

    // Insert detailed party leadership
    await client.query(`
      INSERT INTO party_leadership (
        campaign_id, party_id, leadership_position, leader_name, appointment_date,
        leadership_style, approval_rating, specialization, political_background, leadership_priorities
      ) 
      SELECT 
        1, p.id, 'party_leader', 
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'Dr. Elena Vasquez'
          WHEN 'Conservative Coalition' THEN 'Admiral James Morrison'
          WHEN 'Centrist Party' THEN 'Dr. Michael Rodriguez'
          WHEN 'Libertarian Movement' THEN 'Dr. Rachel Freeman'
          WHEN 'Nationalist Party' THEN 'General Patricia Stone'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN '2150-01-15'::timestamp
          WHEN 'Conservative Coalition' THEN '2148-03-20'::timestamp
          WHEN 'Centrist Party' THEN '2152-09-12'::timestamp
          WHEN 'Libertarian Movement' THEN '2149-11-08'::timestamp
          WHEN 'Nationalist Party' THEN '2154-02-18'::timestamp
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'charismatic'
          WHEN 'Conservative Coalition' THEN 'technocratic'
          WHEN 'Centrist Party' THEN 'moderate'
          WHEN 'Libertarian Movement' THEN 'populist'
          WHEN 'Nationalist Party' THEN 'charismatic'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 85.2
          WHEN 'Conservative Coalition' THEN 72.8
          WHEN 'Centrist Party' THEN 78.9
          WHEN 'Libertarian Movement' THEN 68.5
          WHEN 'Nationalist Party' THEN 61.3
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN '["Social Justice", "Environmental Policy", "Healthcare Reform"]'::jsonb
          WHEN 'Conservative Coalition' THEN '["Fiscal Policy", "Defense Strategy", "Constitutional Law"]'::jsonb
          WHEN 'Centrist Party' THEN '["Policy Analysis", "Bipartisan Negotiation", "Institutional Reform"]'::jsonb
          WHEN 'Libertarian Movement' THEN '["Constitutional Rights", "Economic Freedom", "Civil Liberties"]'::jsonb
          WHEN 'Nationalist Party' THEN '["National Security", "Cultural Policy", "Economic Sovereignty"]'::jsonb
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'Former university professor and civil rights activist. Led environmental justice movement before entering politics. Known for passionate advocacy and grassroots organizing.'
          WHEN 'Conservative Coalition' THEN 'Retired military admiral with extensive defense and security experience. Transitioned to politics after distinguished naval career. Emphasizes discipline and strategic thinking.'
          WHEN 'Centrist Party' THEN 'Academic researcher and former government advisor. PhD in Political Science with expertise in comparative governance. Known for evidence-based approach to policy.'
          WHEN 'Libertarian Movement' THEN 'Philosophy professor and constitutional scholar. Long-time advocate for individual rights and limited government. Published extensively on liberty and democracy.'
          WHEN 'Nationalist Party' THEN 'Former military general and veteran advocate. Strong background in national security and defense policy. Passionate about civilization sovereignty and cultural preservation.'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN '["Climate Action", "Social Justice", "Economic Equality", "Healthcare Access"]'::jsonb
          WHEN 'Conservative Coalition' THEN '["Fiscal Discipline", "Strong Defense", "Traditional Values", "Economic Growth"]'::jsonb
          WHEN 'Centrist Party' THEN '["Bipartisan Cooperation", "Evidence-Based Policy", "Institutional Reform", "Pragmatic Solutions"]'::jsonb
          WHEN 'Libertarian Movement' THEN '["Individual Freedom", "Constitutional Rights", "Limited Government", "Free Markets"]'::jsonb
          WHEN 'Nationalist Party' THEN '["National Sovereignty", "Cultural Preservation", "Economic Protection", "Border Security"]'::jsonb
        END
      FROM political_parties p 
      WHERE p.campaign_id = 1
      ON CONFLICT DO NOTHING
    `);

    // Insert sample detailed policy positions
    await client.query(`
      INSERT INTO party_policy_positions (
        campaign_id, party_id, policy_area, policy_topic, position_summary, detailed_position,
        position_strength, flexibility_level, public_messaging, supporting_arguments
      )
      SELECT 
        1, p.id, 'economic', 'taxation',
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'Progressive taxation with higher rates for wealthy individuals and corporations'
          WHEN 'Conservative Coalition' THEN 'Lower tax rates across all income levels to stimulate economic growth'
          WHEN 'Centrist Party' THEN 'Balanced tax system that ensures revenue while promoting growth'
          WHEN 'Libertarian Movement' THEN 'Minimal taxation with maximum individual economic freedom'
          WHEN 'Nationalist Party' THEN 'Tax policies that protect domestic industries and workers'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'We believe in progressive taxation where those who benefit most from our civilization contribute proportionally more. Higher tax rates on wealthy individuals and corporations fund essential social programs, infrastructure, and environmental protection. Tax policy should reduce inequality and ensure everyone has opportunity to succeed.'
          WHEN 'Conservative Coalition' THEN 'Lower tax rates stimulate economic growth, job creation, and individual prosperity. Reducing tax burden on businesses and individuals encourages investment, innovation, and economic expansion. Tax policy should maximize economic freedom and minimize government interference in private enterprise.'
          WHEN 'Centrist Party' THEN 'Tax policy should balance revenue needs with economic growth incentives. Evidence-based approach to taxation that considers both social needs and economic impacts. Moderate tax rates with efficient collection and strategic incentives for beneficial economic activities.'
          WHEN 'Libertarian Movement' THEN 'Taxation should be minimal and voluntary whenever possible. Individuals should keep maximum portion of their earnings. Government should be funded through user fees, voluntary contributions, and minimal taxes on activities that create negative externalities.'
          WHEN 'Nationalist Party' THEN 'Tax policy should prioritize our civilization first. Protective tariffs on imports, tax incentives for domestic production, and tax penalties for companies that outsource jobs. Tax system should strengthen our economic sovereignty and protect our workers.'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'core_principle'
          WHEN 'Conservative Coalition' THEN 'core_principle'
          WHEN 'Centrist Party' THEN 'flexible'
          WHEN 'Libertarian Movement' THEN 'core_principle'
          WHEN 'Nationalist Party' THEN 'strong_support'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'firm'
          WHEN 'Conservative Coalition' THEN 'non_negotiable'
          WHEN 'Centrist Party' THEN 'very_flexible'
          WHEN 'Libertarian Movement' THEN 'non_negotiable'
          WHEN 'Nationalist Party' THEN 'flexible'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'Fair taxation for a fair society. Those who prosper most should contribute most to our shared prosperity.'
          WHEN 'Conservative Coalition' THEN 'Lower taxes mean more jobs, more growth, and more opportunity for everyone in our civilization.'
          WHEN 'Centrist Party' THEN 'Smart tax policy balances revenue needs with economic growth. Evidence-based solutions work.'
          WHEN 'Libertarian Movement' THEN 'Your money, your choice. Minimal taxation maximizes individual freedom and economic prosperity.'
          WHEN 'Nationalist Party' THEN 'Our tax system should work for our people first. Protect our workers and strengthen our economy.'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN '["Reduces inequality", "Funds social programs", "Promotes shared prosperity", "Ensures public investment"]'::jsonb
          WHEN 'Conservative Coalition' THEN '["Stimulates growth", "Creates jobs", "Increases investment", "Maximizes individual prosperity"]'::jsonb
          WHEN 'Centrist Party' THEN '["Balances needs", "Evidence-based approach", "Promotes efficiency", "Considers all impacts"]'::jsonb
          WHEN 'Libertarian Movement' THEN '["Maximizes freedom", "Reduces government size", "Promotes voluntary exchange", "Respects property rights"]'::jsonb
          WHEN 'Nationalist Party' THEN '["Protects workers", "Strengthens sovereignty", "Supports domestic industry", "Ensures economic security"]'::jsonb
        END
      FROM political_parties p 
      WHERE p.campaign_id = 1
      ON CONFLICT DO NOTHING
    `);

    // Insert sample Witter activity
    await client.query(`
      INSERT INTO party_witter_activity (
        campaign_id, party_id, account_type, account_handle, post_type, post_content,
        hashtags, political_context, messaging_strategy, post_date
      )
      SELECT 
        1, p.id, 'official_party', p.witter_handle, 'policy_statement',
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'The Infrastructure Investment Act represents exactly the kind of bold, forward-thinking policy our civilization needs. 500 billion credits invested in our future means jobs, sustainability, and prosperity for all. #InvestInOurFuture #ProgressiveValues'
          WHEN 'Conservative Coalition' THEN 'While we support infrastructure development, we must ensure fiscal responsibility. The proposed 500 billion credit program needs careful oversight and phased implementation to protect taxpayers. #FiscalResponsibility #SmartSpending'
          WHEN 'Centrist Party' THEN 'The Infrastructure Investment Act shows what we can achieve through bipartisan cooperation. We worked with all parties to create a balanced approach that invests in our future while maintaining fiscal discipline. #BipartisanSuccess #EvidenceBasedPolicy'
          WHEN 'Libertarian Movement' THEN 'Government infrastructure spending crowds out private investment and increases debt burden on citizens. Market-based solutions would deliver better results at lower cost with greater efficiency. #FreeMarkets #LimitedGovernment'
          WHEN 'Nationalist Party' THEN 'Infrastructure investment must prioritize our civilization first. We support the bill but demand guarantees that jobs go to our workers and contracts go to our companies. #CivilizationFirst #ProtectOurWorkers'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN '["InvestInOurFuture", "ProgressiveValues", "ClimateAction", "SocialJustice"]'::jsonb
          WHEN 'Conservative Coalition' THEN '["FiscalResponsibility", "SmartSpending", "TaxpayerProtection", "ConservativeValues"]'::jsonb
          WHEN 'Centrist Party' THEN '["BipartisanSuccess", "EvidenceBasedPolicy", "PragmaticSolutions", "ModerateApproach"]'::jsonb
          WHEN 'Libertarian Movement' THEN '["FreeMarkets", "LimitedGovernment", "IndividualFreedom", "PrivateSolutions"]'::jsonb
          WHEN 'Nationalist Party' THEN '["CivilizationFirst", "ProtectOurWorkers", "EconomicSovereignty", "NationalPride"]'::jsonb
        END,
        'Infrastructure Investment Act legislative response',
        'coordinated_messaging',
        NOW() - INTERVAL '2 hours'
      FROM political_parties p 
      WHERE p.campaign_id = 1
      ON CONFLICT DO NOTHING
    `);

    // Insert sample electoral performance data
    await client.query(`
      INSERT INTO party_electoral_performance (
        campaign_id, party_id, election_type, election_date, vote_share, seats_won,
        seats_contested, demographic_performance, campaign_strategy, election_outcome
      )
      SELECT 
        1, p.id, 'general', '2156-11-08'::timestamp,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 28.30
          WHEN 'Conservative Coalition' THEN 31.20
          WHEN 'Centrist Party' THEN 22.80
          WHEN 'Libertarian Movement' THEN 12.40
          WHEN 'Nationalist Party' THEN 5.30
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 52
          WHEN 'Conservative Coalition' THEN 58
          WHEN 'Centrist Party' THEN 42
          WHEN 'Libertarian Movement' THEN 23
          WHEN 'Nationalist Party' THEN 10
        END,
        185, -- Total seats contested
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN '{"young_voters": 45, "urban_voters": 38, "educated_voters": 42, "minority_voters": 52}'::jsonb
          WHEN 'Conservative Coalition' THEN '{"older_voters": 48, "rural_voters": 41, "business_owners": 55, "military_veterans": 62}'::jsonb
          WHEN 'Centrist Party' THEN '{"suburban_voters": 35, "moderate_voters": 58, "independent_voters": 41, "professional_voters": 38}'::jsonb
          WHEN 'Libertarian Movement' THEN '{"tech_workers": 28, "entrepreneurs": 35, "young_professionals": 22, "rural_libertarians": 18}'::jsonb
          WHEN 'Nationalist Party' THEN '{"industrial_workers": 15, "rural_voters": 12, "older_voters": 8, "traditionalist_voters": 22}'::jsonb
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'Grassroots mobilization focused on climate action and social justice. Heavy digital campaigning and youth outreach.'
          WHEN 'Conservative Coalition' THEN 'Traditional campaign approach emphasizing fiscal responsibility and security. Strong business community support and veteran outreach.'
          WHEN 'Centrist Party' THEN 'Evidence-based campaign highlighting bipartisan achievements and pragmatic solutions. Targeted suburban and independent voters.'
          WHEN 'Libertarian Movement' THEN 'Focused on individual freedom message and government overreach concerns. Strong online presence and tech community engagement.'
          WHEN 'Nationalist Party' THEN 'Civilization-first messaging emphasizing sovereignty and cultural preservation. Targeted industrial and rural communities.'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'narrow_victory'
          WHEN 'Conservative Coalition' THEN 'victory'
          WHEN 'Centrist Party' THEN 'narrow_victory'
          WHEN 'Libertarian Movement' THEN 'narrow_loss'
          WHEN 'Nationalist Party' THEN 'loss'
        END
      FROM political_parties p 
      WHERE p.campaign_id = 1
      ON CONFLICT DO NOTHING
    `);

    // Insert sample coalition data
    await client.query(`
      INSERT INTO party_coalitions (
        campaign_id, coalition_name, coalition_type, member_parties, coalition_agreement,
        policy_priorities, leadership_structure, formation_date, public_approval
      ) VALUES 
      (
        1, 'Infrastructure Development Coalition', 'issue_based',
        '["Progressive Alliance", "Centrist Party", "Nationalist Party"]',
        'Temporary coalition supporting the Interstellar Infrastructure Investment Act with focus on job creation, environmental sustainability, and domestic industry protection.',
        '["Infrastructure Investment", "Job Creation", "Environmental Standards", "Domestic Industry Protection"]',
        '{"lead_party": "Progressive Alliance", "coordination_party": "Centrist Party", "support_party": "Nationalist Party"}',
        NOW() - INTERVAL '1 month', 68.5
      ),
      (
        1, 'Fiscal Responsibility Alliance', 'opposition',
        '["Conservative Coalition", "Libertarian Movement"]',
        'Opposition coalition focused on fiscal discipline, reduced government spending, and taxpayer protection in response to large infrastructure spending proposals.',
        '["Fiscal Discipline", "Reduced Spending", "Taxpayer Protection", "Government Efficiency"]',
        '{"lead_party": "Conservative Coalition", "support_party": "Libertarian Movement"}',
        NOW() - INTERVAL '3 weeks', 42.8
      ) ON CONFLICT DO NOTHING
    `);

    // Insert sample party events
    await client.query(`
      INSERT INTO party_events (
        campaign_id, party_id, event_type, event_title, event_description, event_date,
        location, expected_attendance, key_speakers, media_coverage, public_reception
      )
      SELECT 
        1, p.id, 'rally',
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'Climate Action & Social Justice Rally'
          WHEN 'Conservative Coalition' THEN 'Fiscal Responsibility Town Hall'
          WHEN 'Centrist Party' THEN 'Bipartisan Solutions Forum'
          WHEN 'Libertarian Movement' THEN 'Freedom & Liberty Convention'
          WHEN 'Nationalist Party' THEN 'Civilization First Rally'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'Major rally focusing on climate action, social justice, and the Infrastructure Investment Act. Features environmental activists, labor leaders, and progressive policy experts.'
          WHEN 'Conservative Coalition' THEN 'Town hall meeting discussing fiscal responsibility concerns about large government spending programs. Features business leaders, fiscal policy experts, and taxpayer advocates.'
          WHEN 'Centrist Party' THEN 'Forum highlighting bipartisan cooperation and evidence-based policy solutions. Features moderate politicians, policy researchers, and civic leaders from across the political spectrum.'
          WHEN 'Libertarian Movement' THEN 'Convention celebrating individual freedom and constitutional rights. Features civil liberties advocates, free market economists, and constitutional scholars.'
          WHEN 'Nationalist Party' THEN 'Rally emphasizing civilization sovereignty and cultural preservation. Features veterans, cultural leaders, and economic sovereignty advocates.'
        END,
        NOW() + INTERVAL '1 week',
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'New Geneva Convention Center'
          WHEN 'Conservative Coalition' THEN 'Capital City Business District'
          WHEN 'Centrist Party' THEN 'University Auditorium'
          WHEN 'Libertarian Movement' THEN 'Freedom Plaza'
          WHEN 'Nationalist Party' THEN 'Veterans Memorial Hall'
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 5000
          WHEN 'Conservative Coalition' THEN 3500
          WHEN 'Centrist Party' THEN 2000
          WHEN 'Libertarian Movement' THEN 1500
          WHEN 'Nationalist Party' THEN 800
        END,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN '["Dr. Elena Vasquez", "Environmental Leader Maria Santos", "Labor Leader David Chen"]'::jsonb
          WHEN 'Conservative Coalition' THEN '["Admiral James Morrison", "Business Leader Victoria Sterling", "Fiscal Expert Robert Hayes"]'::jsonb
          WHEN 'Centrist Party' THEN '["Dr. Michael Rodriguez", "Former Diplomat Lisa Park", "Policy Analyst David Kim"]'::jsonb
          WHEN 'Libertarian Movement' THEN '["Dr. Rachel Freeman", "Entrepreneur Alex Thompson", "Civil Rights Lawyer Jordan Miller"]'::jsonb
          WHEN 'Nationalist Party' THEN '["General Patricia Stone", "Cultural Leader Thomas Wright", "Labor Advocate Maria Santos"]'::jsonb
        END,
        TRUE,
        CASE p.party_name
          WHEN 'Progressive Alliance' THEN 'positive'
          WHEN 'Conservative Coalition' THEN 'mixed'
          WHEN 'Centrist Party' THEN 'positive'
          WHEN 'Libertarian Movement' THEN 'mixed'
          WHEN 'Nationalist Party' THEN 'mixed'
        END
      FROM political_parties p 
      WHERE p.campaign_id = 1
      ON CONFLICT DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Enhanced Political Party System schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Political Party System schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
