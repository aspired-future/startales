# Planetary Government System Design

## Overview
Implement automated planetary-level government systems that manage planets similar to how city management works, but at a larger scale with multiple cities, regions, and planetary-wide policies.

## Core Concept
Each planet within a civilization has its own automated government that handles:
- **Local Governance**: Managing multiple cities and regions on the planet
- **Resource Management**: Planetary resource allocation and distribution
- **Infrastructure**: Planet-wide infrastructure projects and maintenance
- **Economic Policy**: Planetary economic planning and trade coordination
- **Population Management**: Migration, housing, employment across the planet
- **Environmental Management**: Planetary ecosystem and sustainability
- **Defense Coordination**: Local defense and security coordination with civilization

## System Architecture

### 1. Database Schema

#### Planetary Governments Table
```sql
CREATE TABLE planetary_governments (
  id SERIAL PRIMARY KEY,
  planet_id TEXT NOT NULL,
  civilization_id TEXT NOT NULL,
  government_name VARCHAR(100) NOT NULL,
  government_type VARCHAR(50) NOT NULL, -- 'autonomous', 'federal', 'colonial', 'corporate'
  
  -- Leadership
  planetary_governor VARCHAR(100) NOT NULL,
  deputy_governors JSONB DEFAULT '[]'::jsonb,
  governing_council JSONB DEFAULT '[]'::jsonb,
  
  -- Government Structure
  autonomy_level INTEGER DEFAULT 50, -- 0-100, how much independence from civilization
  reporting_frequency VARCHAR(20) DEFAULT 'monthly', -- how often reports to central gov
  
  -- Budget & Economics
  planetary_budget DECIMAL(15,2) DEFAULT 0,
  tax_collection_rate DECIMAL(5,2) DEFAULT 15.00,
  central_government_funding DECIMAL(15,2) DEFAULT 0,
  economic_specialization VARCHAR(50), -- 'industrial', 'agricultural', 'research', 'trade', 'mining'
  
  -- Population & Demographics
  total_population BIGINT DEFAULT 0,
  population_growth_rate DECIMAL(5,4) DEFAULT 0.0200,
  employment_rate DECIMAL(5,2) DEFAULT 85.00,
  education_level DECIMAL(5,2) DEFAULT 60.00,
  quality_of_life DECIMAL(5,2) DEFAULT 70.00,
  
  -- Infrastructure
  infrastructure_level DECIMAL(5,2) DEFAULT 50.00,
  transportation_network DECIMAL(5,2) DEFAULT 40.00,
  communication_network DECIMAL(5,2) DEFAULT 60.00,
  energy_grid DECIMAL(5,2) DEFAULT 55.00,
  water_systems DECIMAL(5,2) DEFAULT 50.00,
  
  -- Resources & Environment
  resource_reserves JSONB DEFAULT '{}'::jsonb,
  environmental_health DECIMAL(5,2) DEFAULT 75.00,
  sustainability_rating DECIMAL(5,2) DEFAULT 60.00,
  
  -- Policies & Governance
  current_policies JSONB DEFAULT '[]'::jsonb,
  policy_priorities JSONB DEFAULT '[]'::jsonb,
  approval_rating DECIMAL(5,2) DEFAULT 65.00,
  
  -- Status & Metadata
  establishment_date DATE DEFAULT CURRENT_DATE,
  last_election_date DATE,
  next_election_date DATE,
  government_status VARCHAR(20) DEFAULT 'active', -- 'active', 'transition', 'crisis'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Planetary Cities Management Table
```sql
CREATE TABLE planetary_city_management (
  id SERIAL PRIMARY KEY,
  planetary_government_id INTEGER REFERENCES planetary_governments(id),
  city_id TEXT NOT NULL,
  city_name VARCHAR(100) NOT NULL,
  
  -- City Status
  population INTEGER DEFAULT 0,
  economic_output DECIMAL(15,2) DEFAULT 0,
  infrastructure_rating DECIMAL(5,2) DEFAULT 50.00,
  specialization VARCHAR(50),
  
  -- Management
  city_manager VARCHAR(100),
  management_budget DECIMAL(15,2) DEFAULT 0,
  development_priority VARCHAR(20) DEFAULT 'balanced', -- 'growth', 'maintenance', 'specialization'
  
  -- Automated Decisions
  last_infrastructure_upgrade DATE,
  next_planned_project VARCHAR(200),
  resource_allocation JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Planetary AI Knobs Table
```sql
CREATE TABLE planetary_government_knobs (
  id SERIAL PRIMARY KEY,
  planetary_government_id INTEGER REFERENCES planetary_governments(id),
  knob_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. AI Knobs System (25 Knobs)

#### Economic Management (8 knobs)
1. **budgetAllocation** - How aggressively to allocate budget vs save reserves
2. **taxationPolicy** - Balance between high revenue vs economic growth
3. **tradeOpenness** - How open to interplanetary trade and commerce
4. **economicDiversification** - Focus on specialization vs diversified economy
5. **infrastructureInvestment** - Priority level for infrastructure projects
6. **resourceExploitation** - Balance between extraction and conservation
7. **businessRegulation** - Level of business oversight and regulation
8. **innovationIncentives** - Investment in research and technological advancement

#### Population & Social (6 knobs)
9. **immigrationPolicy** - Openness to population from other planets
10. **educationInvestment** - Priority for educational system development
11. **healthcareInvestment** - Healthcare system funding and accessibility
12. **housingPolicy** - Balance between affordable housing and market freedom
13. **socialServices** - Level of social safety net and welfare programs
14. **culturalPreservation** - Investment in local culture vs civilization integration

#### Governance & Administration (6 knobs)
15. **autonomyAssertion** - How much independence to seek from central government
16. **bureaucracyEfficiency** - Focus on streamlined vs thorough administration
17. **transparencyLevel** - Government openness and public information sharing
18. **participatoryGovernance** - Level of citizen involvement in decision making
19. **interCityCoordination** - Coordination between cities vs local autonomy
20. **emergencyPreparedness** - Investment in crisis response and resilience

#### Environmental & Infrastructure (5 knobs)
21. **environmentalProtection** - Balance between development and conservation
22. **sustainabilityFocus** - Long-term sustainability vs short-term growth
23. **planetaryPlanning** - Coordinated development vs organic growth
24. **energyPolicy** - Renewable energy investment vs traditional sources
25. **transportationDevelopment** - Investment in planetary transportation networks

### 3. Service Layer

#### PlanetaryGovernmentService.ts
- **Government Management**: Create, update, manage planetary governments
- **Budget Operations**: Handle planetary budgets, tax collection, funding allocation
- **Policy Implementation**: Execute and track policy decisions
- **Performance Monitoring**: Track government effectiveness and approval ratings
- **City Coordination**: Manage relationships with multiple cities on planet
- **Resource Management**: Allocate planetary resources efficiently
- **Infrastructure Planning**: Coordinate planet-wide infrastructure projects

#### PlanetaryGovernmentEngine.ts
- **Automated Decision Making**: AI-driven policy and budget decisions
- **Performance Simulation**: Model outcomes of different policy choices
- **Crisis Management**: Handle planetary emergencies and challenges
- **Election Simulation**: Manage democratic processes and leadership changes
- **Economic Modeling**: Simulate planetary economic growth and development
- **Population Dynamics**: Model population growth, migration, and demographics

### 4. API Endpoints

#### Core Government Management
- `GET /api/planetary-government/:planetId` - Get planetary government details
- `POST /api/planetary-government/:planetId` - Create new planetary government
- `PUT /api/planetary-government/:planetId` - Update government settings
- `DELETE /api/planetary-government/:planetId` - Dissolve planetary government

#### Dashboard & Analytics
- `GET /api/planetary-government/:planetId/dashboard` - Government dashboard data
- `GET /api/planetary-government/:planetId/performance` - Performance metrics
- `GET /api/planetary-government/:planetId/budget` - Budget and financial data
- `GET /api/planetary-government/:planetId/cities` - Managed cities overview

#### Policy & Decision Making
- `GET /api/planetary-government/:planetId/policies` - Current policies
- `POST /api/planetary-government/:planetId/policies` - Implement new policy
- `GET /api/planetary-government/:planetId/decisions` - Recent decisions log
- `POST /api/planetary-government/:planetId/emergency` - Declare emergency status

#### AI Knobs & Simulation
- `GET /api/planetary-government/:planetId/knobs` - Get AI knob settings
- `POST /api/planetary-government/:planetId/knobs` - Update AI knob settings
- `POST /api/planetary-government/:planetId/simulate` - Run government simulation
- `GET /api/planetary-government/:planetId/recommendations` - Get AI recommendations

### 5. UI Integration

#### New HUD Panel: "Planetary Gov"
- **Location**: Government section of HUD
- **Icon**: 🌍 (planet with government building)
- **Tabs**:
  1. **Overview** - Government summary, approval rating, key metrics
  2. **Cities** - All cities on planet with management status
  3. **Budget** - Financial overview, revenue, expenditures, projects
  4. **Policies** - Current policies and their effects
  5. **AI Settings** - Configure the 25 AI knobs for automated governance

#### PlanetaryGovernmentScreen.tsx
- Comprehensive interface for managing planetary governments
- Real-time updates via WebSocket
- Integration with existing city management systems
- Policy recommendation engine
- Crisis management interface

### 6. Integration Points

#### With Existing Systems
- **City Management**: Coordinate with existing city systems
- **Civilization Government**: Report to and receive directives from central government
- **Economic Systems**: Interface with trade, currency, and financial markets
- **Military Systems**: Coordinate with defense and security systems
- **AI Simulation Engine**: Integrate with orchestrator for realistic governance simulation

#### With Galaxy Map
- **Planet Selection**: Click planet to access its government
- **Visual Indicators**: Show government type, stability, and performance on map
- **Inter-Planetary Relations**: Display relationships between planetary governments

## Implementation Benefits

### For Players
- **Reduced Micromanagement**: Planets handle day-to-day governance automatically
- **Strategic Focus**: Players focus on high-level civilization decisions
- **Realistic Complexity**: Planets develop unique characteristics and challenges
- **Emergent Gameplay**: Planetary governments create interesting scenarios and conflicts

### For Simulation
- **Scalability**: Handle large civilizations with many planets efficiently
- **Realism**: More accurate representation of how large space civilizations would work
- **Narrative Opportunities**: Planetary governments create stories and conflicts
- **Economic Modeling**: More sophisticated economic simulation across multiple worlds

## Next Steps
1. Create database schema and migrations
2. Implement service layer with basic government operations
3. Build API endpoints for government management
4. Create UI components and integrate with HUD
5. Implement AI knobs and simulation integration
6. Add WebSocket support for real-time updates
7. Test with existing city and civilization systems

This system will provide rich, automated planetary governance that scales with civilization growth while maintaining player control over strategic decisions.
