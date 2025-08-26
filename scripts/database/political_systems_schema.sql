-- Political Systems Database Schema
-- Manages multiparty, two-party, and single-party political systems

-- Main political systems table
CREATE TABLE IF NOT EXISTS political_systems (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    system_type VARCHAR(50) NOT NULL CHECK (system_type IN ('multiparty', 'two_party', 'single_party', 'no_party')),
    constitutional_framework JSONB NOT NULL,
    electoral_system JSONB NOT NULL,
    political_stability DECIMAL(6,4) NOT NULL DEFAULT 0.7,
    democratic_index DECIMAL(6,4) NOT NULL DEFAULT 0.5,
    political_polarization DECIMAL(6,4) NOT NULL DEFAULT 0.3,
    voter_turnout DECIMAL(6,4) NOT NULL DEFAULT 0.65,
    last_election TIMESTAMP WITH TIME ZONE,
    next_election TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, civilization_id)
);

-- Political parties table
CREATE TABLE IF NOT EXISTS political_parties (
    id SERIAL PRIMARY KEY,
    party_id VARCHAR(100) NOT NULL,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    ideology VARCHAR(100) NOT NULL,
    support_percentage DECIMAL(6,4) NOT NULL DEFAULT 0.0,
    seats_held INTEGER DEFAULT 0,
    leadership JSONB DEFAULT '[]',
    platform JSONB DEFAULT '[]',
    coalition_partners JSONB DEFAULT '[]',
    is_ruling BOOLEAN DEFAULT false,
    founded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'banned', 'dissolved', 'merged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, civilization_id, party_id)
);

-- Election results table
CREATE TABLE IF NOT EXISTS election_results (
    id SERIAL PRIMARY KEY,
    election_id VARCHAR(100) NOT NULL,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    election_date TIMESTAMP WITH TIME ZONE NOT NULL,
    election_type VARCHAR(50) NOT NULL CHECK (election_type IN ('general', 'primary', 'local', 'referendum')),
    results JSONB NOT NULL,
    voter_turnout DECIMAL(6,4) NOT NULL,
    legitimacy DECIMAL(6,4) NOT NULL DEFAULT 1.0,
    international_observers BOOLEAN DEFAULT false,
    disputes_resolved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, civilization_id, election_id)
);

-- Constitutional amendments tracking
CREATE TABLE IF NOT EXISTS constitutional_amendments (
    id SERIAL PRIMARY KEY,
    amendment_id VARCHAR(100) NOT NULL,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    amendment_text TEXT NOT NULL,
    amendment_type VARCHAR(100) NOT NULL,
    proposed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ratification_date TIMESTAMP WITH TIME ZONE,
    ratification_method VARCHAR(100),
    support_percentage DECIMAL(6,4),
    implementation_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'proposed' CHECK (status IN ('proposed', 'ratified', 'rejected', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Political system transitions tracking
CREATE TABLE IF NOT EXISTS political_system_transitions (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    old_system_type VARCHAR(50) NOT NULL,
    new_system_type VARCHAR(50) NOT NULL,
    transition_method VARCHAR(100) NOT NULL,
    justification TEXT,
    transition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stability_impact DECIMAL(6,4) DEFAULT 0.0,
    legitimacy_impact DECIMAL(6,4) DEFAULT 0.0,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Political events and crises
CREATE TABLE IF NOT EXISTS political_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(100) NOT NULL,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_description TEXT,
    event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    stability_impact DECIMAL(6,4) DEFAULT 0.0,
    legitimacy_impact DECIMAL(6,4) DEFAULT 0.0,
    affected_parties JSONB DEFAULT '[]',
    resolution_status VARCHAR(50) DEFAULT 'ongoing' CHECK (resolution_status IN ('ongoing', 'resolved', 'escalated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voter demographics and behavior
CREATE TABLE IF NOT EXISTS voter_demographics (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    demographic_group VARCHAR(100) NOT NULL,
    population_percentage DECIMAL(6,4) NOT NULL,
    voter_registration_rate DECIMAL(6,4) NOT NULL,
    turnout_rate DECIMAL(6,4) NOT NULL,
    political_preferences JSONB NOT NULL,
    key_issues JSONB DEFAULT '[]',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign finance tracking
CREATE TABLE IF NOT EXISTS campaign_finance (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    party_id VARCHAR(100) NOT NULL,
    election_cycle VARCHAR(100) NOT NULL,
    total_raised DECIMAL(15,2) DEFAULT 0.0,
    total_spent DECIMAL(15,2) DEFAULT 0.0,
    individual_donations DECIMAL(15,2) DEFAULT 0.0,
    corporate_donations DECIMAL(15,2) DEFAULT 0.0,
    public_funding DECIMAL(15,2) DEFAULT 0.0,
    spending_categories JSONB DEFAULT '{}',
    transparency_score DECIMAL(6,4) DEFAULT 1.0,
    violations INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Political systems knobs configuration
CREATE TABLE IF NOT EXISTS political_systems_knobs (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    knob_name VARCHAR(100) NOT NULL,
    knob_value DECIMAL(8,6) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by VARCHAR(100) DEFAULT 'system',
    UNIQUE(campaign_id, civilization_id, knob_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_political_systems_campaign_civ ON political_systems(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_political_parties_campaign_civ ON political_parties(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_political_parties_status ON political_parties(status);
CREATE INDEX IF NOT EXISTS idx_election_results_campaign_civ ON election_results(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_election_results_date ON election_results(election_date);
CREATE INDEX IF NOT EXISTS idx_constitutional_amendments_campaign_civ ON constitutional_amendments(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_political_system_transitions_campaign_civ ON political_system_transitions(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_political_events_campaign_civ ON political_events(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_political_events_date ON political_events(event_date);
CREATE INDEX IF NOT EXISTS idx_voter_demographics_campaign_civ ON voter_demographics(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_campaign_finance_campaign_civ ON campaign_finance(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_political_systems_knobs_campaign_civ ON political_systems_knobs(campaign_id, civilization_id);

-- Sample political systems data
INSERT INTO political_systems (campaign_id, civilization_id, system_type, constitutional_framework, electoral_system, political_stability, democratic_index, political_polarization, voter_turnout)
VALUES 
    ('campaign_1', 'player_1', 'multiparty', 
     '{"governmentStructure": "parliamentary", "separationOfPowers": 0.7, "checksAndBalances": 0.6, "civilLiberties": 0.8, "ruleOfLaw": 0.7, "federalismLevel": 0.3, "constitutionalAmendmentDifficulty": 0.7}',
     '{"votingMethod": "proportional", "electionFrequency": 4, "termLimits": false, "campaignFinanceRules": {"spendingLimits": true, "corporateDonations": false, "foreignDonations": false, "publicFunding": true, "transparencyRequirements": 0.8}, "voterEligibility": {"minimumAge": 18, "citizenshipRequired": true, "registrationRequired": true, "voterIdRequired": false, "felonVotingRights": true}, "electionIntegrity": 0.85}',
     0.75, 0.80, 0.25, 0.72),
    ('campaign_1', 'ai_civ_1', 'two_party',
     '{"governmentStructure": "presidential", "separationOfPowers": 0.8, "checksAndBalances": 0.7, "civilLiberties": 0.7, "ruleOfLaw": 0.8, "federalismLevel": 0.6, "constitutionalAmendmentDifficulty": 0.8}',
     '{"votingMethod": "fptp", "electionFrequency": 4, "termLimits": true, "campaignFinanceRules": {"spendingLimits": false, "corporateDonations": true, "foreignDonations": false, "publicFunding": false, "transparencyRequirements": 0.6}, "voterEligibility": {"minimumAge": 18, "citizenshipRequired": true, "registrationRequired": true, "voterIdRequired": true, "felonVotingRights": false}, "electionIntegrity": 0.75}',
     0.65, 0.70, 0.60, 0.68)
ON CONFLICT (campaign_id, civilization_id) DO NOTHING;

-- Sample political parties data
INSERT INTO political_parties (party_id, campaign_id, civilization_id, name, ideology, support_percentage, seats_held, leadership, platform, is_ruling)
VALUES 
    ('party_1', 'campaign_1', 'player_1', 'Progressive Alliance', 'social_democratic', 0.42, 125, '["Sarah Chen", "Marcus Rodriguez"]', '["Universal Healthcare", "Climate Action", "Economic Equality"]', true),
    ('party_2', 'campaign_1', 'player_1', 'Conservative Union', 'conservative', 0.35, 98, '["David Thompson", "Maria Kowalski"]', '["Fiscal Responsibility", "Traditional Values", "Strong Defense"]', false),
    ('party_3', 'campaign_1', 'player_1', 'Green Future', 'environmental', 0.23, 55, '["Elena Petrov", "James Wilson"]', '["Environmental Protection", "Renewable Energy", "Sustainable Development"]', false),
    ('party_dem', 'campaign_1', 'ai_civ_1', 'Democratic Party', 'liberal', 0.52, 235, '["President Johnson", "VP Williams"]', '["Social Justice", "Healthcare Reform", "Infrastructure Investment"]', true),
    ('party_rep', 'campaign_1', 'ai_civ_1', 'Republican Party', 'conservative', 0.48, 200, '["Senator Davis", "Governor Miller"]', '["Limited Government", "Free Markets", "Constitutional Rights"]', false)
ON CONFLICT (campaign_id, civilization_id, party_id) DO NOTHING;

-- Sample election results
INSERT INTO election_results (election_id, campaign_id, civilization_id, election_date, election_type, results, voter_turnout, legitimacy)
VALUES 
    ('election_2024_01', 'campaign_1', 'player_1', '2024-06-15', 'general', 
     '[{"partyId": "party_1", "votesReceived": 2500000, "votePercentage": 0.42, "seatsWon": 125, "seatPercentage": 0.45}, {"partyId": "party_2", "votesReceived": 2100000, "votePercentage": 0.35, "seatsWon": 98, "seatPercentage": 0.35}, {"partyId": "party_3", "votesReceived": 1380000, "votePercentage": 0.23, "seatsWon": 55, "seatPercentage": 0.20}]',
     0.72, 0.85),
    ('election_2024_02', 'campaign_1', 'ai_civ_1', '2024-11-05', 'general',
     '[{"partyId": "party_dem", "votesReceived": 75000000, "votePercentage": 0.52, "seatsWon": 235, "seatPercentage": 0.54}, {"partyId": "party_rep", "votesReceived": 69000000, "votePercentage": 0.48, "seatsWon": 200, "seatPercentage": 0.46}]',
     0.68, 0.78)
ON CONFLICT (campaign_id, civilization_id, election_id) DO NOTHING;

-- Sample voter demographics
INSERT INTO voter_demographics (campaign_id, civilization_id, demographic_group, population_percentage, voter_registration_rate, turnout_rate, political_preferences)
VALUES 
    ('campaign_1', 'player_1', 'young_adults_18_29', 0.18, 0.65, 0.58, '{"party_1": 0.45, "party_2": 0.25, "party_3": 0.30}'),
    ('campaign_1', 'player_1', 'middle_aged_30_54', 0.35, 0.85, 0.75, '{"party_1": 0.40, "party_2": 0.38, "party_3": 0.22}'),
    ('campaign_1', 'player_1', 'seniors_55_plus', 0.28, 0.92, 0.82, '{"party_1": 0.35, "party_2": 0.45, "party_3": 0.20}'),
    ('campaign_1', 'player_1', 'urban_voters', 0.45, 0.78, 0.70, '{"party_1": 0.48, "party_2": 0.28, "party_3": 0.24}'),
    ('campaign_1', 'player_1', 'rural_voters', 0.25, 0.72, 0.68, '{"party_1": 0.30, "party_2": 0.55, "party_3": 0.15}')
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE political_systems IS 'Main table tracking political system type and characteristics for each civilization';
COMMENT ON TABLE political_parties IS 'Political parties within each civilization with support levels and details';
COMMENT ON TABLE election_results IS 'Historical record of election results and outcomes';
COMMENT ON TABLE constitutional_amendments IS 'Constitutional amendments proposed, ratified, or rejected';
COMMENT ON TABLE political_system_transitions IS 'Record of political system changes and transitions';
COMMENT ON TABLE political_events IS 'Political events, crises, and significant developments';
COMMENT ON TABLE voter_demographics IS 'Voter demographics and political preferences by group';
COMMENT ON TABLE campaign_finance IS 'Campaign finance data and spending tracking';
COMMENT ON TABLE political_systems_knobs IS 'AI-controllable parameters for political system simulation';

COMMENT ON COLUMN political_systems.system_type IS 'Type of political system: multiparty, two_party, single_party, or no_party';
COMMENT ON COLUMN political_systems.democratic_index IS 'Democratic health index from 0 (authoritarian) to 1 (fully democratic)';
COMMENT ON COLUMN political_systems.political_polarization IS 'Level of political polarization from 0 (unified) to 1 (highly polarized)';
COMMENT ON COLUMN political_parties.status IS 'Party status: active, banned, dissolved, or merged';
COMMENT ON COLUMN election_results.legitimacy IS 'Election legitimacy score from 0 (disputed) to 1 (fully legitimate)';
