# LivelyGalaxy.ai API Reference

## Overview
Comprehensive documentation of all 64 production APIs in the LivelyGalaxy.ai galactic civilization management system. Each API includes 24 AI-controllable knobs for dynamic game behavior adjustment.

**Total APIs**: 64  
**Total AI Knobs**: 1,536 (64 × 24)  
**Total Enhanced Endpoints**: 192 (64 × 3)  

---

## 🏛️ **Government & Leadership APIs**

### Executive Branch
- **`/api/leader-communications`** - Executive communication and decision support
  - *File*: `src/server/leader-communications/leaderRoutes.ts`
  - *Purpose*: Presidential/leader communications, executive orders, decision support

- **`/api/delegation`** - Authority management and delegation
  - *File*: `src/server/delegation/delegationRoutes.ts`
  - *Purpose*: Authority delegation, responsibility assignment, chain of command

- **`/api/cabinet`** - Cabinet meetings and coordination
  - *File*: `src/server/cabinet/cabinetRoutes.ts`
  - *Purpose*: Cabinet member management, meeting coordination, policy alignment

- **`/api/cabinet/workflow`** - Cabinet workflow management
  - *File*: `src/server/cabinet/workflowRoutes.ts`
  - *Purpose*: Cabinet workflow processes, task assignment, progress tracking

### Department Secretaries
- **`/api/defense`** - Department of Defense
  - *File*: `src/server/defense/defenseRoutes.ts`
  - *Purpose*: National defense, military policy, security strategy

- **`/api/state`** - Department of State
  - *File*: `src/server/state/stateRoutes.ts`
  - *Purpose*: Foreign affairs, diplomacy, international relations

- **`/api/treasury`** - Department of Treasury
  - *File*: `src/server/treasury/treasuryRoutes.ts`
  - *Purpose*: Government finances, fiscal policy, revenue management

- **`/api/treasury/budget`** - Department budget management
  - *File*: `src/server/treasury/departmentBudgetRoutes.ts`
  - *Purpose*: Departmental budget allocation, spending oversight

- **`/api/justice`** - Department of Justice
  - *File*: `src/server/justice/justiceRoutes.ts`
  - *Purpose*: Law enforcement, legal affairs, judicial administration

- **`/api/interior`** - Department of Interior
  - *File*: `src/server/interior/interiorRoutes.ts`
  - *Purpose*: Internal affairs, resource management, territorial administration

- **`/api/commerce`** - Department of Commerce
  - *File*: `src/server/commerce/commerceRoutes.ts`
  - *Purpose*: Trade regulation, business development, economic growth

- **`/api/health`** - Department of Health
  - *File*: `src/server/health/healthRoutes.ts`
  - *Purpose*: Public health, healthcare policy, medical services

- **`/api/science`** - Department of Science
  - *File*: `src/server/science/scienceRoutes.ts`
  - *Purpose*: Scientific research, technology development, innovation policy

- **`/api/communications`** - Department of Communications
  - *File*: `src/server/communications/communicationsRoutes.ts`
  - *Purpose*: Government communications, public relations, media engagement

- **`/api/media-control`** - Media Control & Press Conference System
  - *File*: `src/server/media-control/mediaControlRoutes.ts`
  - *Purpose*: Media oversight, press conferences (leader vs press secretary), media policies, press freedom management
  - *Enhanced Features*:
    - **Leader vs Press Secretary Press Conferences**: Choose between high-impact leader appearances (90% authenticity, 65% political risk, +25% effectiveness bonus) or lower-risk press secretary briefings (65% authenticity, 25% political risk)
    - **Press Conference Management**: Schedule, conduct, and analyze press conferences with detailed impact tracking
    - **Media Outlet Oversight**: Monitor and regulate media outlets with government control percentages, credibility ratings, and political bias tracking
    - **Press Freedom Analytics**: Real-time press freedom scoring, media independence tracking, and international ranking
    - **Media Policy Framework**: Create and enforce media policies with configurable control intensity and compliance monitoring
  - *Key Endpoints*:
    - `GET /press-conferences/:campaignId` - List press conferences with filtering
    - `POST /press-conferences/:campaignId` - Schedule new press conference
    - `PUT /press-conferences/:campaignId/:conferenceId/complete` - Complete conference with impact calculation
    - `GET /press-secretary/:campaignId` - Get active press secretary information
    - `GET /press-conferences/:campaignId/:conferenceId/questions` - Get Q&A details
  - *30 AI Knobs*: Press freedom control, censorship intensity, leader appearance rate, question screening, hostile question management, message coordination, media outlet licensing, propaganda effectiveness, journalist safety, crisis communication powers
  - *AI Simulation Integration*: Real-time knob adjustments based on press conference performance, media freedom monitoring, automatic event generation for press conferences and media crises
  - *WebSocket Events*: Live media events (`media_event`, `press_conference`) broadcast to HUD with severity levels and knob adjustment recommendations
  - *Deterministic System*: Integrated with comprehensive simulation orchestrator for cross-system media impact analysis

### Legislative Branch
- **`/api/legislature`** - Legislative body management
  - *File*: `src/server/legislature/legislatureRoutes.ts`
  - *Purpose*: Legislative processes, bill management, voting systems, executive override capabilities

- **`/api/institutional-override`** - Institutional Override System ⭐ **NEW**
  - *File*: `src/server/institutional-override/institutionalOverrideRoutes.ts`
  - *Purpose*: Executive override of Legislature, Central Bank, and Supreme Court decisions with consequences
  - *Enhanced Features*: 24 AI knobs, political cost modeling, constitutional analysis, simulation integration
  - *Key Endpoints*:
    - `GET /analyze/:institutionType/:decisionId` - Analyze override feasibility and consequences
    - `POST /initiate` - Initiate institutional override with justification
    - `POST /execute/:overrideId` - Execute approved override with monitoring
    - `GET /knobs/:campaignId` - Get AI override analysis knobs (24 parameters)
    - `POST /knobs/:campaignId` - Update AI override settings
    - `POST /simulate/:overrideId` - Run AI override consequence simulation
    - `GET /history/:campaignId` - Override history and patterns
    - `GET /metrics/:campaignId` - Override effectiveness and trust metrics
    - `GET /challenges/:overrideId` - Legal and political challenges tracking

- **`/api/political-parties`** - Political party system
  - *File*: `src/server/political-parties/politicalPartyRoutes.ts`
  - *Purpose*: Political party management, elections, democratic processes

- **`/api/governance`** - General governance systems
  - *File*: `src/server/governance/governanceRoutes.ts`
  - *Purpose*: Governance structures, policy implementation, administrative systems

- **`/api/government-types`** - Government type management
  - *File*: `src/server/governance/governmentTypesRoutes.ts`
  - *Purpose*: Government ideologies, transitions, legitimacy, stability analysis
  - *Enhanced Features*: 24 AI knobs for government stability, economic control, social policies
  - *AI Integration*: Stability analysis, transition assessment, crisis response, policy effectiveness

- **`/api/government-contracts`** - Government contract system
  - *File*: `src/server/governance/governmentContractsRoutes.ts`
  - *Purpose*: Contract management, bidding, performance tracking, budget allocation
  - *Enhanced Features*: 24 AI knobs for bidding process, performance monitoring, financial management
  - *AI Integration*: Contract optimization, bidding strategy, performance analysis, risk assessment

- **`/api/missions`** - Mission management and Game Master AI integration
  - *File*: `src/server/missions/missionsRoutes.ts`
  - *Purpose*: AI-driven mission generation, story integration, character involvement
  - *Enhanced Features*: 24 AI knobs for mission generation, difficulty, rewards, story integration
  - *AI Integration*: Dynamic mission creation, story arc advancement, character development

- **`/api/export-controls`** - Export control policies and license management
  - *File*: `src/server/export-controls/exportControlsRoutes.ts`
  - *Purpose*: Technology export restrictions, trade policy enforcement, license processing
  - *Enhanced Features*: 24 AI knobs for policy strictness, risk assessment, compliance monitoring
  - *AI Integration*: Automated risk assessment, policy optimization, violation detection

### Judicial Branch
- **`/api/supreme-court`** - Supreme Court system
  - *File*: `src/server/supreme-court/supremeCourtRoutes.ts`
  - *Purpose*: Constitutional review, judicial oversight, legal precedents

- **`/api/legal`** - Legal system administration
  - *File*: `src/server/legal/legalRoutes.ts`
  - *Purpose*: Legal system management, court administration, justice processes

### Military & Security
- **`/api/military`** - Military operations
  - *File*: `src/server/military/militaryRoutes.ts`
  - *Purpose*: Military units, operations, strategic planning

- **`/api/joint-chiefs`** - Joint Chiefs of Staff
  - *File*: `src/server/joint-chiefs/jointChiefsRoutes.ts`
  - *Purpose*: Military leadership, strategic coordination, defense planning

- **`/api/intelligence`** - Intelligence services
  - *File*: `src/server/intelligence/intelligenceRoutes.ts`
  - *Purpose*: Intelligence gathering, analysis, security operations

- **`/api/security`** - Security systems
  - *File*: `src/server/security/securityRoutes.ts`
  - *Purpose*: National security, threat assessment, protection services

---

## 💰 **Economic & Financial APIs**

### Core Economic Systems
- **`/api/economics/inflation`** - Inflation management
  - *File*: `src/server/economics/inflationRoutes.ts`
  - *Purpose*: Inflation tracking, monetary policy, price stability

- **`/api/central-bank`** - Central banking system
  - *File*: `src/server/central-bank/centralBankRoutes.ts`
  - *Purpose*: Monetary policy, interest rates, currency management

- **`/api/central-bank-enhanced`** - Enhanced Central Bank system
  - *File*: `src/server/central-bank/centralBankEnhancementsRoutes.ts`
  - *Purpose*: Gold reserves, multi-currency holdings, quantitative easing, money supply management

- **`/api/sovereign-wealth-fund`** - Sovereign Wealth Fund management
  - *File*: `src/server/sovereign-wealth-fund/sovereignWealthFundRoutes.ts`
  - *Purpose*: National investment fund, portfolio management, domestic/foreign investments, currency diversification
  - *Enhanced Features*: 
    - Multi-currency investment capabilities
    - Domestic and foreign market access
    - Government bonds, corporate bonds, equities, index funds

- **`/api/government-bonds`** - Government Bond Issuance & Management
  - *File*: `src/server/government-bonds/governmentBondsRoutes.ts`
  - *Purpose*: Government bond issuance in domestic/foreign currencies, debt management, auction systems
  - *Enhanced Features*:
    - Multi-currency bond issuance (USC, EUR, GBP, JPY, etc.)
    - Treasury, Infrastructure, Green, Development, and War bonds
    - Primary market auctions (competitive, non-competitive, Dutch)
    - Secondary market price tracking and trading volumes
    - Credit rating management and sovereign risk assessment
    - Debt service scheduling and payment tracking
    - Callable bond features and early redemption options
    - Bond holder tracking and ownership management
    - **20 AI Knobs**: Issuance strategy, pricing models, risk management, market operations
  - *Key Endpoints*:
    - `GET /dashboard/:civilizationId` - Comprehensive bonds dashboard
    - `POST /issue` - Issue new government bonds
    - `GET /debt-service/:civilizationId` - Debt service summary and schedule
    - `GET /auctions/:civilizationId` - Bond auction history and upcoming auctions
    - `GET /knobs/:civilizationId` - Get AI knob settings
    - `POST /knobs/:civilizationId` - Update AI knob settings
    - `POST /simulate/:civilizationId` - Run AI simulation with current knobs
    - Risk management and performance tracking
    - AI-driven portfolio optimization with 24 controllable knobs

- **`/api/currency-exchange`** - Currency exchange system
  - *File*: `src/server/currency-exchange/currencyExchangeRoutes.ts`
  - *Purpose*: Currency trading, exchange rates, international finance

- **`/api/financial-markets`** - Financial markets
  - *File*: `src/server/financial-markets/financialMarketsRoutes.ts`
  - *Purpose*: Stock markets, securities trading, investment management

- **`/api/fiscal-simulation`** - Fiscal policy simulation
  - *File*: `src/server/fiscal-simulation/fiscalSimulationRoutes.ts`
  - *Purpose*: Fiscal policy modeling, budget simulation, economic forecasting

### Business & Commerce
- **`/api/businesses`** - Business management
  - *File*: `src/server/businesses/businessRoutes.ts`
  - *Purpose*: Business registration, operations, commercial activities

- **`/api/small-business`** - Small business ecosystem
  - *File*: `src/server/small-business/smallBusinessRoutes.ts`
  - *Purpose*: Small business support, entrepreneurship, local commerce

- **`/api/economic-ecosystem`** - Economic ecosystem management
  - *File*: `src/server/economic-ecosystem/economicEcosystemRoutes.ts`
  - *Purpose*: Economic system coordination, market dynamics, ecosystem health

- **`/api/economic-ecosystem/corporate`** - Corporate lifecycle management
  - *File*: `src/server/economic-ecosystem/corporateLifecycleRoutes.ts`
  - *Purpose*: Corporate development, business lifecycle, enterprise management

- **`/api/economic-tiers`** - Economic tier system
  - *File*: `src/server/economic-tiers/economicTierRoutes.ts`
  - *Purpose*: Economic stratification, wealth distribution, class systems

- **`/api/trade`** - Trade & commerce system
  - *File*: `src/server/trade/tradeRoutes.ts`
  - *Purpose*: Trade routes, resource trading, commercial relationships

---

## 👥 **Population & Social APIs**

### Demographics & Population
- **`/api/population`** - Population management
  - *File*: `src/server/population/populationRoutes.ts`
  - *Purpose*: Population tracking, demographics, growth management

- **`/api/demographics`** - Demographic analysis
  - *File*: `src/server/demographics/demographicsRoutes.ts`
  - *Purpose*: Demographic data, population analysis, social statistics

- **`/api/migration`** - Migration systems
  - *File*: `src/server/migration/migrationRoutes.ts`
  - *Purpose*: Population movement, immigration, settlement patterns

- **`/api/planetary-government`** - Planetary Government Management ⭐ **NEW**
  - *File*: `src/server/planetary-government/planetaryGovernmentRoutes.ts`
  - *Purpose*: Automated planetary-level governance, city coordination, autonomous administration
  - *Enhanced Features*: Multi-government types (Federal, Colonial, Autonomous), 25 AI knobs, performance tracking
  - *Key Endpoints*:
    - `GET /civilization/:id` - List all planetary governments for civilization
    - `GET /:planetId/dashboard` - Comprehensive planetary government dashboard
    - `GET /:planetId/cities` - Cities managed by planetary government
    - `GET /:planetId/knobs` - Get AI governance knobs (25 parameters)
    - `POST /:planetId/knobs` - Update AI governance settings
    - `POST /:planetId/simulate` - Run AI governance simulation
    - `GET /:planetId/decisions` - Recent government decisions log
    - `GET /:planetId/metrics` - Performance metrics and trends
    - `GET /:planetId/recommendations` - AI-generated governance recommendations

### Social Systems
- **`/api/characters`** - Character management
  - *File*: `src/server/characters/characterRoutes.ts`
  - *Purpose*: Individual character tracking, personality, relationships

- **`/api/psychology`** - Psychological systems
  - *File*: `src/server/psychology/psychologyRoutes.ts`
  - *Purpose*: Population psychology, mental health, behavioral analysis

- **`/api/professions`** - Professional systems
  - *File*: `src/server/professions/professionRoutes.ts`
  - *Purpose*: Career management, skill development, workforce planning

- **`/api/education`** - Education system
  - *File*: `src/server/education/educationRoutes.ts`
  - *Purpose*: Educational institutions, learning systems, knowledge development

### Urban Development
- **`/api/cities`** - City management
  - *File*: `src/server/cities/cityRoutes.ts`
  - *Purpose*: Urban planning, city administration, municipal services

- **`/api/cities/emergence`** - City emergence system
  - *File*: `src/server/cities/cityEmergenceRoutes.ts`
  - *Purpose*: New city development, urban growth, settlement emergence

---

## 🌌 **Space & Galaxy APIs**

### Galaxy Management
- **`/api/galaxy`** - Galaxy map & space systems
  - *File*: `src/server/galaxy/galaxyRoutes.ts`
  - *Purpose*: Galaxy navigation, star systems, space exploration
  
#### Enhanced Galaxy API Endpoints

**Core Galaxy Data:**
- **`GET /api/galaxy/map`** - Get galaxy map data with sectors and star systems
- **`GET /api/galaxy/systems/:systemId`** - Get detailed star system information
- **`GET /api/galaxy/territories`** - Get territorial control and civilization data
- **`GET /api/galaxy/discoveries`** - Get exploration discoveries and scientific findings

**Exploration & Navigation:**
- **`POST /api/galaxy/explore`** - Initiate exploration missions
- **`POST /api/galaxy/navigate`** - Calculate navigation routes between systems

**Enhanced Simulation Integration:**
- **`GET /api/galaxy/simulation/status`** - Get real-time simulation status and performance metrics
- **`POST /api/galaxy/simulation/events`** - Trigger galaxy simulation events
- **`GET /api/galaxy/ai/recommendations`** - Get AI-powered recommendations for knob adjustments
- **`POST /api/galaxy/knobs/batch-update`** - Batch update multiple simulation knobs
- **`GET /api/galaxy/analytics/performance`** - Get detailed performance analytics and trends

**Enhanced Knob System:**
- **`GET /api/galaxy/knobs`** - Get current knob states and configurations
- **`POST /api/galaxy/knobs/adjust`** - Adjust individual knobs with AI validation
- **`GET /api/galaxy/knobs/recommendations`** - Get AI recommendations for knob optimization
- **`POST /api/galaxy/knobs/reset`** - Reset knobs to default or recommended values

#### Galaxy Knob System Architecture

The enhanced Galaxy API includes a comprehensive knob system with 40+ configurable parameters organized into categories:

**Galaxy Generation & Procedural Content:**
- `galaxy_size_scale` - Galaxy size and star system density
- `procedural_generation_complexity` - Content generation detail level
- `star_system_diversity` - Unique system characteristics
- `stellar_classification_accuracy` - Scientific detail accuracy

**Exploration & Discovery:**
- `exploration_reward_frequency` - Discovery incentive rates
- `unknown_region_mystery` - Exploration intrigue levels
- `discovery_significance_weighting` - Importance scaling
- `xenoarchaeology_discovery_rate` - Ancient artifact frequency
- `scientific_anomaly_frequency` - Research opportunities

**Navigation & Travel:**
- `faster_than_light_efficiency` - FTL travel speed
- `navigation_accuracy` - Route precision
- `space_hazard_frequency` - Travel dangers
- `hyperspace_stability` - Jump reliability

**Planetary Systems & Habitability:**
- `habitable_planet_frequency` - Colonization opportunities
- `planetary_resource_abundance` - Extraction potential
- `atmospheric_diversity` - Environmental variety
- `terraforming_potential` - Planetary modification

**Galactic Politics & Territories:**
- `territorial_boundary_clarity` - Sovereignty definition
- `neutral_zone_stability` - Diplomatic buffer areas
- `border_dispute_frequency` - Territorial conflicts
- `diplomatic_complexity` - Inter-civilization relations

**AI Integration Features:**
- Real-time performance monitoring
- Automatic knob adjustment recommendations
- Confidence scoring for AI suggestions
- Impact prediction for knob changes
- Batch update capabilities for coordinated adjustments

### Character Spatial Intelligence
- **`/api/characters`** - Character spatial awareness & intelligence systems
  - *File*: `src/server/characters/spatialIntelligenceRoutes.ts`
  - *Purpose*: Character AI spatial awareness, military intelligence, trade logistics, sensor systems

#### Character Spatial Intelligence API Endpoints

**Character Intelligence:**
- **`GET /api/characters/spatial/intelligence/:characterId`** - Get character's spatial intelligence profile
- **`POST /api/characters/spatial/scan`** - Perform spatial scan operations
- **`GET /api/characters/spatial/distances`** - Calculate distances and travel times between positions

**Military Intelligence:**
- **`GET /api/characters/military/intelligence`** - Get military intelligence summary and threat assessment
- **`POST /api/characters/military/scan`** - Initiate military reconnaissance scans
- **`GET /api/characters/military/threats`** - Get current threat analysis and fleet movements

**Trade & Economic Intelligence:**
- **`GET /api/characters/trade/opportunities`** - Get trade opportunities analysis
- **`GET /api/characters/trade/routes`** - Get optimized trade route recommendations
- **`GET /api/characters/trade/markets`** - Get market analysis and commodity intelligence

**Sensor Systems:**
- **`GET /api/characters/sensors/contacts`** - Get sensor contacts and detection data
- **`POST /api/characters/sensors/sweep`** - Initiate sensor sweep operations
- **`GET /api/characters/sensors/status`** - Get sensor network status and capabilities

**Enhanced Spatial Knob System:**
- **`GET /api/characters/spatial/knobs`** - Get current spatial awareness knob states
- **`POST /api/characters/spatial/knobs/adjust`** - Adjust spatial awareness knobs
- **`GET /api/characters/spatial/knobs/recommendations`** - Get AI recommendations for spatial optimization

#### Spatial Awareness Knob Categories

The Character Spatial Intelligence system includes 40+ specialized knobs organized into categories:

**Galactic Map Awareness:**
- `galactic_map_detail_level` - Level of detail characters perceive in galactic maps
- `distance_calculation_accuracy` - Accuracy of distance calculations between systems
- `planetary_terrain_awareness` - Understanding of planetary surface conditions
- `stellar_navigation_proficiency` - Skill in stellar navigation and route planning

**Military Intelligence & Awareness:**
- `fleet_movement_tracking` - Ability to track friendly and enemy fleet movements
- `military_unit_positioning` - Awareness of military unit positions and deployments
- `strategic_location_assessment` - Evaluation of strategic importance of locations
- `tactical_terrain_analysis` - Analysis of terrain for tactical advantages
- `intelligence_network_coverage` - Coverage and effectiveness of intelligence networks
- `enemy_fleet_detection_range` - Range at which enemy fleets can be detected
- `friendly_fleet_coordination` - Coordination efficiency with friendly forces
- `military_logistics_awareness` - Understanding of supply lines and logistics

**Trade & Economic Spatial Awareness:**
- `trade_route_optimization` - Efficiency in planning optimal trade routes
- `resource_deposit_knowledge` - Knowledge of resource locations and quantities
- `market_demand_spatial_analysis` - Understanding of demand patterns across space
- `corporate_presence_mapping` - Awareness of corporate facilities and influence
- `supply_chain_visibility` - Visibility into supply chain networks
- `transport_cost_calculation` - Accuracy in calculating transport costs
- `trade_security_assessment` - Assessment of trade route security risks
- `economic_zone_analysis` - Analysis of economic zones and opportunities

**Sensor Systems & Detection:**
- `sensor_range_efficiency` - Effectiveness of sensor systems across distances
- `long_range_scanning_capability` - Capability for long-range system scanning
- `stealth_detection_sensitivity` - Ability to detect stealthed or hidden objects
- `sensor_data_processing_speed` - Speed of processing sensor information
- `multi_spectrum_analysis` - Analysis across multiple sensor spectrums
- `gravitational_anomaly_detection` - Detection of gravitational disturbances
- `hyperspace_signature_tracking` - Tracking of hyperspace jump signatures
- `communication_interception` - Ability to intercept enemy communications

**Character Role Specializations:**
- `military_commander_spatial_iq` - Military commanders' spatial intelligence
- `intelligence_officer_network_reach` - Intelligence officers' information network reach
- `trade_executive_market_vision` - Trade executives' market spatial understanding
- `explorer_pathfinding_skill` - Explorers' ability to find optimal paths
- `diplomat_territorial_understanding` - Diplomats' understanding of territorial dynamics
- `scientist_anomaly_detection` - Scientists' ability to detect spatial anomalies

**AI Integration Features:**
- **Distance-aware calculations** for all spatial operations
- **Real-time fleet tracking** with movement prediction
- **Intelligent trade route optimization** based on spatial factors
- **Advanced sensor fusion** for enhanced detection capabilities
- **Role-based specialization** for different character types
- **Predictive analytics** for travel times and resource availability

- **`/api/conquest`** - Conquest & expansion
  - *File*: `src/server/conquest/conquestRoutes.ts`
  - *Purpose*: Territorial expansion, planet conquest, empire growth

### Technology & Research
- **`/api/technology`** - Technology development
  - *File*: `src/server/technology/technologyRoutes.ts`
  - *Purpose*: Research & development, technological advancement, innovation

---

## 📱 **Communication & Social Media APIs**

### Communication Systems
- **`/api/whoseapp`** - Personal communication platform
  - *File*: `src/server/whoseapp/whoseappRoutes.ts`
  - *Purpose*: Voice calls, text messaging, personal communication

- **`/api/witter`** - Social media platform (Galactic Twitter)
  - *File*: `src/server/witter/witterRoutes.ts`
  - *Purpose*: Social networking, news sharing, public discourse

- **`/api/news`** - News & media system
  - *File*: `src/server/news/newsRoutes.ts`
  - *Purpose*: News generation, media distribution, information systems

---

## 🎮 **Game Management APIs**

### Core Game Systems
- **`/api/campaigns`** - Campaign management
  - *File*: `src/server/campaigns/campaignRoutes.ts`
  - *Purpose*: Game campaign management, multiplayer coordination, progression

- **`/api/game-modes`** - Game mode management
  - *File*: `src/server/game-modes/gameModesRoutes.ts`
  - *Purpose*: Game experience control, player engagement, mode selection

- **`/api/schedules`** - Schedule management
  - *File*: `src/server/schedules/scheduleRoutes.ts`
  - *Purpose*: Event scheduling, time management, appointment coordination

### System Management
- **`/api/memory`** - Vector memory & AI context
  - *File*: `src/server/memory/memoryRoutes.ts`
  - *Purpose*: AI memory systems, context management, data storage

- **`/api/ai-analysis`** - AI analysis & insights
  - *File*: `src/server/ai-analysis/aiAnalysisRoutes.ts`
  - *Purpose*: Strategic intelligence, cross-system analysis, AI insights

- **`/api/visual-systems`** - Visual content generation
  - *File*: `src/server/visual-systems/visualSystemsRoutes.ts`
  - *Purpose*: AI-generated graphics, visual content, multimedia systems

---

## 🔧 **Enhanced Knob System**

Every API includes the Enhanced Knob System with:

### Standard Endpoints (per API)
- **`GET /api/{api-name}/knobs`** - Get current knob values
- **`POST /api/{api-name}/knobs`** - Update knob values  
- **`GET /api/{api-name}/knobs/help`** - Get knob documentation

### Knob Input Formats
- **Direct**: `0.0` to `1.0` (precise control)
- **Relative**: `-3` to `+3` (adjustment from current)
- **Semantic**: `"low"`, `"medium"`, `"high"`, `"maximum"`
- **Percentage**: `"75%"`, `"50%"` (intuitive scaling)
- **Action Words**: `"increase"`, `"decrease"`, `"maximize"`, `"minimize"`

### AI Integration
- **1,368 Total Knobs** across all APIs (updated with new Government APIs)
- **Real-time Adjustment** during gameplay
- **Structured Outputs** for AI consumption
- **Bidirectional Control** between AI and deterministic systems

---

## 🆕 **New Government Management APIs (2024)**

### Government Types API (`/api/government-types`)

**Core Endpoints:**
- `GET /government-types` - List all available government types
- `GET /government-types/{id}` - Get specific government type details
- `POST /government-types` - Create new government type
- `PUT /government-types/{id}` - Update government type
- `DELETE /government-types/{id}` - Remove government type

**Civilization Management:**
- `GET /civilization/{campaignId}/{civilizationId}` - Get current government
- `POST /civilization/{campaignId}/{civilizationId}/transition` - Transition government
- `GET /civilization/{campaignId}/{civilizationId}/effectiveness` - Analyze effectiveness
- `GET /civilization/{campaignId}/{civilizationId}/stability` - Check stability metrics

**Enhanced Knob System:**
- `GET /knobs` - Get knob settings and presets
- `POST /civilization/{campaignId}/{civilizationId}/apply-preset` - Apply government preset
- `GET /ai-prompts` - Get AI analysis prompts
- `POST /civilization/{campaignId}/{civilizationId}/ai-analysis` - Generate AI analysis

**24 AI Knobs Categories:**
1. **Government Stability (8 knobs)**: Legitimacy decay, stability volatility, succession stability, crisis response, popular support weight, institutional inertia, corruption tolerance, revolution threshold
2. **Economic Control (8 knobs)**: Market intervention, resource allocation efficiency, property protection, planning horizon, inflation control, trade regulation, labor flexibility, innovation incentives
3. **Social Control (8 knobs)**: Media control, civil liberties, cultural homogenization, education indoctrination, surveillance capacity, dissident suppression, religious freedom, social mobility

### Government Contracts API (`/api/government-contracts`)

**Core Endpoints:**
- `GET /contracts` - List all contracts
- `GET /contracts/{id}` - Get contract details
- `POST /contracts` - Create new contract
- `PUT /contracts/{id}` - Update contract
- `DELETE /contracts/{id}` - Cancel contract

**Civilization Management:**
- `GET /civilization/{campaignId}/{civilizationId}` - Get civilization contracts
- `GET /civilization/{campaignId}/{civilizationId}/dashboard` - Contract dashboard
- `POST /civilization/{campaignId}/{civilizationId}/create` - Create contract
- `GET /civilization/{campaignId}/{civilizationId}/performance` - Performance metrics

**Bidding & Awards:**
- `GET /contracts/{id}/bids` - Get contract bids
- `POST /contracts/{id}/bid` - Submit bid
- `POST /contracts/{id}/award` - Award contract
- `GET /contracts/{id}/evaluation` - Evaluate bids

**Enhanced Knob System:**
- `GET /knobs` - Get knob settings and category presets
- `POST /civilization/{campaignId}/{civilizationId}/apply-category-preset` - Apply category preset
- `GET /ai-prompts` - Get AI analysis prompts
- `POST /civilization/{campaignId}/{civilizationId}/ai-analysis` - Generate AI analysis

**24 AI Knobs Categories:**
1. **Bidding Process (8 knobs)**: Competitive bidding rate, bidding period length, prequalification strictness, small business preference, local contractor bonus, emergency threshold, sole-source justification, bid protest resolution
2. **Contract Performance (8 knobs)**: Monitoring intensity, milestone flexibility, quality standards, schedule compliance, cost overrun tolerance, modification ease, bonus/penalty rates, contractor rating impact
3. **Financial Management (8 knobs)**: Budget allocation speed, payment processing, funding diversification, fiscal carryover, inflation adjustment, audit frequency, fraud detection, termination penalties

---

## 🚀 **API Usage Examples**

### Basic API Call
```javascript
// Get population data
GET /api/population/stats?campaignId=123

// Update AI knobs
POST /api/population/knobs
{
  "birth_rate_modifier": 0.8,
  "migration_attractiveness": "high",
  "healthcare_quality": "75%"
}
```

### Enhanced Knob Control
```javascript
// Get knob help
GET /api/military/knobs/help

// Adjust military knobs with different formats
POST /api/military/knobs
{
  "military_readiness": 0.9,           // Direct
  "defense_spending": "+2",            // Relative
  "recruitment_rate": "maximum",       // Semantic
  "training_intensity": "85%",         // Percentage
  "morale_boost": "increase"           // Action word
}
```

### New Government APIs Usage
```javascript
// Get current government type
GET /api/government-types/civilization/1/player123

// Transition to new government type
POST /api/government-types/civilization/1/player123/transition
{
  "targetGovernmentType": "parliamentary_democracy",
  "transitionSpeed": "gradual",
  "legitimacyThreshold": 60
}

// Apply government knob preset
POST /api/government-types/civilization/1/player123/apply-preset
{
  "presetName": "parliamentary_democracy"
}

// Get contract dashboard
GET /api/government-contracts/civilization/1/player123/dashboard

// Create new defense contract
POST /api/government-contracts/civilization/1/player123/create
{
  "title": "Advanced Fighter Development",
  "category": "defense",
  "totalValue": 2500000000,
  "duration": 36,
  "priority": "high",
  "requirements": ["Top Secret Clearance", "Aerospace Experience"]
}

// Generate AI analysis for government stability
POST /api/government-types/civilization/1/player123/ai-analysis
{
  "promptType": "STABILITY_ANALYSIS",
  "parameters": {
    "legitimacy": 78,
    "popularSupport": 65,
    "recentEvents": "Economic growth, peaceful transition",
    "economicPerformance": 82,
    "governmentType": "Parliamentary Democracy"
  }
}
```

---

## 📊 **System Architecture**

### API Organization
- **Production APIs**: `src/server/*/Routes.ts`
- **Enhanced Knob System**: `src/server/shared/enhanced-knob-system.ts`
- **Server Index**: `src/server/index.ts`

### Integration Points
- **Comprehensive Simulation Orchestrator**: Master AI coordination
- **Game State Management**: Centralized state tracking
- **Real-time Updates**: WebSocket integration
- **Database Layer**: PostgreSQL with connection pooling

### Scalability Features
- **Modular Architecture**: Independent API modules
- **Horizontal Scaling**: Load balancer ready
- **Caching Layer**: Redis integration ready
- **Monitoring**: Built-in performance tracking

---

*Last Updated: December 2024*  
*Total APIs: 64 | Total Knobs: 1,536 | Coverage: 100%*
