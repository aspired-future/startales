# LivelyGalaxy.ai API Reference

## Overview
Comprehensive documentation of all 55 production APIs in the LivelyGalaxy.ai galactic civilization management system. Each API includes 24 AI-controllable knobs for dynamic game behavior adjustment.

**Total APIs**: 55  
**Total AI Knobs**: 1,320 (55 × 24)  
**Total Enhanced Endpoints**: 165 (55 × 3)  

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

### Legislative Branch
- **`/api/legislature`** - Legislative body management
  - *File*: `src/server/legislature/legislatureRoutes.ts`
  - *Purpose*: Legislative processes, bill management, voting systems

- **`/api/political-parties`** - Political party system
  - *File*: `src/server/political-parties/politicalPartyRoutes.ts`
  - *Purpose*: Political party management, elections, democratic processes

- **`/api/governance`** - General governance systems
  - *File*: `src/server/governance/governanceRoutes.ts`
  - *Purpose*: Governance structures, policy implementation, administrative systems

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
- **1,320 Total Knobs** across all APIs
- **Real-time Adjustment** during gameplay
- **Structured Outputs** for AI consumption
- **Bidirectional Control** between AI and deterministic systems

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
*Total APIs: 55 | Total Knobs: 1,320 | Coverage: 100%*
