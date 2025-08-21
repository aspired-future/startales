/**
 * Conquest System Database Schema
 * 
 * Database schema definitions for conquest, planetary discovery,
 * territorial claims, and integration processes.
 */

export const conquestSchema = `
-- Conquest Campaigns Table
CREATE TABLE IF NOT EXISTS conquest_campaigns (
    id VARCHAR(255) PRIMARY KEY,
    civilization_id VARCHAR(255) NOT NULL,
    target_planet_id VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('military', 'diplomatic', 'economic', 'cultural')),
    status VARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'failed', 'cancelled')),
    objectives JSONB DEFAULT '[]',
    resources JSONB DEFAULT '{}',
    timeline JSONB DEFAULT '{}',
    progress DECIMAL(3,2) DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 1),
    events JSONB DEFAULT '[]',
    casualties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Planet Discoveries Table
CREATE TABLE IF NOT EXISTS planet_discoveries (
    id VARCHAR(255) PRIMARY KEY,
    civilization_id VARCHAR(255) NOT NULL,
    planet_data JSONB NOT NULL,
    discovery_method VARCHAR(50) NOT NULL CHECK (discovery_method IN ('exploration', 'intelligence', 'accident', 'trade')),
    exploration_team VARCHAR(255),
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'discovered' CHECK (status IN ('discovered', 'claimed', 'contested', 'lost'))
);

-- Territorial Claims Table
CREATE TABLE IF NOT EXISTS territorial_claims (
    id VARCHAR(255) PRIMARY KEY,
    civilization_id VARCHAR(255) NOT NULL,
    planet_id VARCHAR(255) NOT NULL,
    claim_type VARCHAR(50) NOT NULL CHECK (claim_type IN ('settlement', 'conquest', 'purchase', 'treaty')),
    justification TEXT NOT NULL,
    resources JSONB DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'recognized', 'disputed', 'rejected')),
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    recognized_at TIMESTAMP WITH TIME ZONE
);

-- Integration Processes Table
CREATE TABLE IF NOT EXISTS integration_processes (
    id VARCHAR(255) PRIMARY KEY,
    civilization_id VARCHAR(255) NOT NULL,
    territory_id VARCHAR(255) NOT NULL,
    phase VARCHAR(50) NOT NULL DEFAULT 'initial' CHECK (phase IN ('initial', 'cultural', 'economic', 'political', 'completed')),
    progress DECIMAL(3,2) DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 1),
    integration_plan JSONB NOT NULL,
    timeline JSONB NOT NULL,
    resources JSONB DEFAULT '{}',
    events JSONB DEFAULT '[]',
    challenges JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Events Table (for detailed event tracking)
CREATE TABLE IF NOT EXISTS campaign_events (
    id VARCHAR(255) PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL REFERENCES conquest_campaigns(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('battle', 'negotiation', 'discovery', 'setback', 'breakthrough')),
    description TEXT NOT NULL,
    impact VARCHAR(20) NOT NULL CHECK (impact IN ('positive', 'negative', 'neutral')),
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Integration Events Table (for detailed integration tracking)
CREATE TABLE IF NOT EXISTS integration_events (
    id VARCHAR(255) PRIMARY KEY,
    integration_id VARCHAR(255) NOT NULL REFERENCES integration_processes(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('cultural', 'economic', 'political', 'resistance', 'breakthrough')),
    description TEXT NOT NULL,
    impact DECIMAL(3,2) NOT NULL CHECK (impact >= -1 AND impact <= 1),
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conquest Analytics View
CREATE OR REPLACE VIEW conquest_analytics AS
SELECT 
    civilization_id,
    COUNT(*) as total_campaigns,
    COUNT(*) FILTER (WHERE status = 'active') as active_campaigns,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_campaigns,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_campaigns,
    COALESCE(AVG(progress) FILTER (WHERE status = 'completed'), 0) as average_completion_rate,
    COALESCE(
        COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / 
        NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'failed')), 0), 
        0
    ) as success_rate,
    MAX(updated_at) as last_activity
FROM conquest_campaigns
GROUP BY civilization_id;

-- Integration Analytics View
CREATE OR REPLACE VIEW integration_analytics AS
SELECT 
    civilization_id,
    COUNT(*) as total_integrations,
    COUNT(*) FILTER (WHERE phase = 'completed') as completed_integrations,
    AVG(progress) as average_progress,
    COUNT(DISTINCT territory_id) as territories_under_integration,
    MAX(updated_at) as last_integration_activity
FROM integration_processes
GROUP BY civilization_id;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conquest_campaigns_civilization ON conquest_campaigns(civilization_id);
CREATE INDEX IF NOT EXISTS idx_conquest_campaigns_status ON conquest_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_conquest_campaigns_target ON conquest_campaigns(target_planet_id);
CREATE INDEX IF NOT EXISTS idx_planet_discoveries_civilization ON planet_discoveries(civilization_id);
CREATE INDEX IF NOT EXISTS idx_planet_discoveries_status ON planet_discoveries(status);
CREATE INDEX IF NOT EXISTS idx_territorial_claims_civilization ON territorial_claims(civilization_id);
CREATE INDEX IF NOT EXISTS idx_territorial_claims_planet ON territorial_claims(planet_id);
CREATE INDEX IF NOT EXISTS idx_integration_processes_civilization ON integration_processes(civilization_id);
CREATE INDEX IF NOT EXISTS idx_integration_processes_territory ON integration_processes(territory_id);
CREATE INDEX IF NOT EXISTS idx_integration_processes_phase ON integration_processes(phase);
CREATE INDEX IF NOT EXISTS idx_campaign_events_campaign ON campaign_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_integration_events_integration ON integration_events(integration_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conquest_campaigns_updated_at 
    BEFORE UPDATE ON conquest_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_processes_updated_at 
    BEFORE UPDATE ON integration_processes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

export const initializeConquestSchema = async (pool: any) => {
  try {
    await pool.query(conquestSchema);
    console.log('Conquest schema initialized successfully');
  } catch (error) {
    console.error('Error initializing conquest schema:', error);
    throw error;
  }
};
