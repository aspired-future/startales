#!/usr/bin/env python3
import json

# Load current tasks
with open('.taskmaster/tasks/tasks.json', 'r') as f:
    data = json.load(f)

# Define the 5 civilization expansion tasks
civilization_tasks = [
    {
        "id": 41,
        "title": "Culture & Social Systems",
        "description": "Implement comprehensive cultural mechanics with dynamic values, social policies, and cultural influence on trade and economy systems.",
        "details": """**Objective:** Build rich cultural and social systems that affect all aspects of civilization

**Core Cultural Mechanics:**
- Cultural Values System: Liberty, Order, Tradition, Progress, Community, Individualism (0-100 scales)
- Cultural Evolution: Values shift based on policy decisions, random events, and player choices
- Cultural Influence: Affects trade relationships, worker productivity, and social stability
- Traditions & Festivals: Periodic cultural events boosting happiness and providing economic benefits

**Social Policy Framework:**
- Government Decisions: Policy choices affecting cultural development and economic outcomes
- Public Opinion System: Dynamic citizen satisfaction tracking with cultural alignment metrics
- Cultural Buildings: Libraries, theaters, museums providing cultural and educational bonuses
- Education System: Schools and universities influencing cultural progress and technological advancement

**Integration Features:**
- Trade Impact: Cultural values affect demand patterns and trade relationship bonuses
- Campaign Integration: Long-term cultural decisions influencing civilization development
- Event Sourcing: All cultural changes tracked in SQLite for historical analysis
- Vector Memory: AI advisors remember cultural preferences and policy outcomes

**Database Schema:**
```sql
-- Core cultural values and metrics
CREATE TABLE cultures (
  campaign_id INTEGER REFERENCES campaigns(id),
  liberty/order/tradition/progress/community/individualism (0-100),
  stability_index, happiness_level, cultural_events tracking
);
```

**API Endpoints:**
- `GET /api/culture/:campaignId` - Current cultural state and metrics
- `POST /api/culture/policy` - Implement cultural policy decisions
- `GET /api/culture/events` - Active and upcoming cultural events
- `POST /api/culture/buildings` - Construct cultural infrastructure

**Performance Requirements:**
- Cultural calculations: < 100ms for policy impact assessment
- Real-time cultural metrics updating during gameplay
- Cultural influence on trade prices: < 50ms additional latency""",
        "testStrategy": """**Unit Testing:**
- Cultural value calculation accuracy and boundary conditions
- Policy impact verification on different cultural metrics
- Cultural building bonus calculations and stacking effects
- Event system triggering and cultural impact measurement

**Integration Testing:**
- Cultural influence on existing trade system pricing and demand
- Campaign system integration with long-term cultural development
- Vector memory integration for AI cultural advice and consistency
- Database consistency between cultural events and main campaign state

**User Acceptance Testing:**
- Cultural policy decisions creating meaningful gameplay impacts
- Visual feedback for cultural changes and their economic effects
- Cultural building construction providing noticeable civilization benefits
- Festival and tradition events enhancing player engagement and satisfaction""",
        "priority": "high",
        "dependencies": [1, 7, 40], # Monorepo, Docker, Vector Memory
        "status": "pending"
    },
    {
        "id": 42,
        "title": "World Wonders & Monuments", 
        "description": "Create multi-stage world wonder construction system with strategic benefits, resource requirements, and cultural legacy mechanics.",
        "details": """**Objective:** Implement epic wonder construction providing strategic advantages and cultural identity

**Wonder Categories & Benefits:**
- Ancient Wonders: Pyramids (+culture, +tourism), Temples (+happiness, +stability), Colossus (+trade income)
- Engineering Marvels: Aqueducts (+population capacity), Great Wall (+defense, +tourism), Roads (+trade efficiency)
- Cultural Icons: Great Library (+research, +education), National Theater (+culture, +happiness)
- Modern Achievements: Space Center (+technology, +prestige), Digital Network (+information, +efficiency)

**Construction Mechanics:**
- Multi-Stage Building: Wonders require 5-20 campaign steps to complete depending on complexity
- Massive Resource Investment: Thousands of resources over extended time periods
- Construction Phases: Planning → Foundation → Structure → Details → Completion
- Strategic Decisions: Rush construction (expensive) vs. steady progress vs. resource optimization

**Wonder Benefits System:**
- Permanent Bonuses: Ongoing effects on trade, culture, defense, technology, or tourism
- Scaling Benefits: Some wonders provide larger bonuses as civilization grows
- Cultural Legacy: Completed wonders become major tourist attractions and cultural symbols
- Wonder Synergies: Multiple wonders of same type provide additional combined bonuses

**Long-term Project Management:**
```sql
CREATE TABLE world_wonders (
  campaign_id, wonder_type, construction_status,
  completion_percentage, total_cost (JSONB),
  invested_resources, construction_time,
  strategic_benefits (JSONB), tourism_attraction_level
);
```

**Integration with Existing Systems:**
- Trade System: Wonder construction creates massive demand for specific resources
- Campaign System: Multi-step construction projects spanning multiple campaign phases
- Tourism System: Completed wonders become major attractions (Task 44 integration)
- Cultural System: Wonders provide significant cultural influence and happiness bonuses""",
        "testStrategy": """**Construction Testing:**
- Multi-phase construction progression and resource tracking accuracy
- Wonder completion bonus application and persistence across campaign steps
- Construction pause/resume functionality and resource cost calculations
- Wonder cancellation and resource recovery mechanisms

**Strategic Impact Testing:**
- Wonder benefit calculation and application to relevant game systems
- Tourism attraction value and visitor impact from completed wonders
- Cultural significance calculation and influence on civilization metrics
- Wonder synergy bonuses when multiple wonders of same type are built

**Integration Testing:**
- Trade system impact during wonder construction (resource demand spikes)
- Campaign system integration with long-term construction timelines
- Database consistency for wonder states across campaign saves and loads
- Vector memory integration for AI advice on wonder construction strategies""",
        "priority": "high", 
        "dependencies": [1, 7, 41], # Monorepo, Docker, Culture Systems
        "status": "pending"
    },
    {
        "id": 43,
        "title": "Household Economic Simulation",
        "description": "Implement realistic household economic stratification with poor/median/rich tiers affecting demand patterns and social mobility mechanics.",
        "details": """**Objective:** Create realistic socioeconomic simulation driving authentic demand patterns and social dynamics

**Economic Stratification Model:**
- Poor Households (40% of population): Subsistence living, basic goods focus, limited purchasing power
- Median Households (50% of population): Standard consumption, main drivers of regular goods demand
- Rich Households (10% of population): High consumption, luxury goods demand, investment capital source

**Household Economic Dynamics:**
- Income Distribution: Realistic economic distribution based on employment, business ownership, and inheritance
- Consumption Patterns: Tier-specific preferences (poor: food/shelter, median: comfort goods, rich: luxury items)
- Price Elasticity: Different sensitivity to price changes by economic tier
- Seasonal Variations: Income and spending patterns changing with economic cycles

**Social Mobility System:**
- Education Investment: Households can invest in education to improve economic prospects
- Business Opportunities: Economic tiers affecting ability to start businesses or invest
- Life Events: Marriage, inheritance, business success/failure affecting household tier movement
- Economic Policy Impact: Government decisions affecting income distribution and mobility

**Enhanced Trade Integration:**
```sql
CREATE TABLE household_tiers (
  campaign_id, tier_name ('poor'/'median'/'rich'),
  household_count, average_income, consumption_power,
  luxury_demand_multiplier, basic_goods_demand_multiplier,
  savings_rate, investment_capacity
);

CREATE TABLE household_consumption (
  campaign_id, tier_name, resource_id,
  base_demand, seasonal_multiplier, cultural_influence_multiplier,
  price_elasticity -- How demand changes with price
);
```

**Demand Pattern Revolution:**
- Luxury Goods: High-end items primarily demanded by rich households
- Basic Necessities: Food, shelter, clothing with inelastic demand from poor/median
- Social Goods: Items bridging tiers (median households aspiring to rich consumption)
- Cultural Influence: Cultural values affecting consumption preferences across all tiers""",
        "testStrategy": """**Economic Model Testing:**
- Household tier distribution accuracy and realistic income ratios
- Consumption pattern validation against real-world economic data
- Social mobility mechanism testing with various economic scenarios
- Price elasticity response accuracy for different household tiers and goods

**Trade System Integration:**
- Enhanced demand calculation incorporating household tier preferences
- Price impact testing with tier-specific elasticity responses
- Resource shortage impact on different economic tiers (poor affected most)
- Luxury vs. necessity demand patterns during economic growth and recession

**Social Mobility Testing:**
- Education investment impact on household tier advancement
- Business opportunity access and success rates by economic tier
- Life event system affecting household economic status changes
- Long-term social mobility trends and realistic constraint modeling""",
        "priority": "high",
        "dependencies": [1, 7, 41], # Monorepo, Docker, Culture Systems
        "status": "pending"
    },
    {
        "id": 44,
        "title": "Tourism & Entertainment Systems",
        "description": "Build comprehensive tourism economy with attractions, visitor simulation, hospitality services, and entertainment venues generating significant revenue.",
        "details": """**Objective:** Create new economic layer through tourism generating 15-25% of total civilization income

**Tourism Infrastructure:**
- Natural Attractions: Scenic locations, natural wonders, unique geographical features
- Cultural Sites: Museums, historical buildings, cultural districts, traditional markets
- Entertainment Venues: Theaters, concert halls, sports arenas, amusement parks
- Hospitality Services: Hotels, restaurants, tour guides, transportation systems

**Visitor Simulation Engine:**
- Visitor Origins: Different civilizations and regions with varying preferences and spending power
- Visit Duration: Day trips vs. extended stays affecting total economic impact
- Visitor Satisfaction: Quality metrics affecting repeat visits and word-of-mouth marketing
- Seasonal Patterns: Tourism flows changing with weather, cultural events, and economic conditions

**Entertainment & Events System:**
- Cultural Festivals: Periodic events drawing tourists and providing economic boosts
- Sporting Events: Competitions attracting visitors and generating media revenue
- Arts & Culture: Performances, exhibitions, and cultural showcases
- Adventure Tourism: Outdoor activities, extreme sports, nature expeditions

**Economic Impact Model:**
```sql
CREATE TABLE tourism_attractions (
  campaign_id, attraction_type ('wonder'/'natural'/'cultural'/'entertainment'),
  name, attraction_level (1-10), visitor_capacity,
  maintenance_cost, ticket_revenue, economic_multiplier,
  infrastructure_requirements (JSONB)
);

CREATE TABLE visitor_flows (
  campaign_id, campaign_step, total_visitors,
  visitor_satisfaction, revenue_generated,
  visitor_origin (JSONB), length_of_stay, spending_per_visitor
);
```

**Integration with Wonder System:**
- Completed wonders become major tourist attractions with high visitor appeal
- Wonder construction creating temporary tourism (construction site tourism)
- Cultural wonders providing higher cultural tourism value
- Modern wonders attracting technology and innovation tourists""",
        "testStrategy": """**Tourism Economics Testing:**
- Visitor flow simulation accuracy and realistic tourism patterns
- Revenue generation calculation and economic impact measurement
- Tourism attraction capacity limits and visitor satisfaction correlation
- Seasonal tourism variation and economic cycle impact validation

**Entertainment System Testing:**
- Cultural event scheduling and tourism boost calculation
- Entertainment venue capacity management and revenue optimization
- Visitor preference matching with available attractions and activities
- Tourism marketing effectiveness and visitor acquisition cost analysis

**Integration Testing:**
- Wonder system integration with tourism attraction values
- Cultural system influence on tourism appeal and visitor satisfaction
- Household economic impact from tourism employment and local spending
- Infrastructure requirements and tourism development cost-benefit analysis""",
        "priority": "medium",
        "dependencies": [1, 7, 41, 42], # Monorepo, Docker, Culture, Wonders
        "status": "pending"
    },
    {
        "id": 45,
        "title": "Civilization Analytics & Metrics",
        "description": "Implement comprehensive civilization health monitoring with advanced metrics, predictive modeling, and AI-powered advisory dashboard.",
        "details": """**Objective:** Provide deep analytical insights for strategic civilization management and optimization

**Advanced Metrics Suite:**
- Economic Health: GDP, per capita income, Gini coefficient (inequality), unemployment, inflation rates
- Social Indicators: Happiness index, education levels, health metrics, social mobility index
- Cultural Vitality: Cultural diversity, tradition preservation, innovation index, cultural influence
- Infrastructure Quality: Transportation, utilities, communications, wonder completion rates
- Sustainability Index: Resource management, environmental impact, long-term viability

**Analytics Dashboard Components:**
- Real-time Monitoring: Live civilization health metrics with color-coded status indicators
- Historical Trends: Long-term analysis showing civilization evolution over multiple campaigns
- Comparative Analysis: Benchmarking against historical periods or other civilizations
- Predictive Modeling: AI-powered forecasting of social, economic, and cultural trends

**Composite Scoring System:**
```sql
CREATE TABLE civilization_metrics (
  campaign_id, campaign_step, recorded_at,
  
  -- Economic: gdp_total, gdp_per_capita, gini_coefficient, unemployment_rate, inflation_rate
  -- Social: happiness_index, education_level, health_index, social_mobility_index  
  -- Cultural: cultural_diversity_index, cultural_vitality_score, tradition_preservation, innovation_index
  -- Infrastructure: infrastructure_quality, tourism_satisfaction, wonder_completion_rate
  -- Composite: civilization_health_index, sustainability_index, overall_prosperity_score
);
```

**AI-Powered Advisory System:**
- Trend Analysis: Identification of concerning trends before they become critical problems
- Optimization Recommendations: AI suggestions for improving specific civilization metrics
- Policy Impact Prediction: Forecasting effects of proposed cultural, economic, or social policies
- Strategic Planning: Long-term development recommendations based on current trajectory

**Integration & Data Sources:**
- Trade System: Economic metrics from resource flows, pricing, and market activity
- Cultural System: Social and cultural indicators from cultural values and policy decisions
- Household System: Social mobility and inequality metrics from household tier analysis
- Tourism System: Infrastructure and satisfaction metrics from visitor feedback
- Wonder System: Cultural significance and tourism attraction metrics""",
        "testStrategy": """**Metrics Accuracy Testing:**
- Composite score calculation verification with known test scenarios
- Historical trend analysis accuracy with recorded civilization development
- Predictive model validation against actual civilization development outcomes
- Dashboard real-time update performance and data visualization accuracy

**AI Advisory Testing:**
- Advisory recommendation relevance and actionability assessment
- Policy impact prediction accuracy against actual implemented policy results
- Trend detection sensitivity and false positive/negative rate analysis
- Strategic planning recommendation effectiveness measurement

**Integration Testing:**
- Data pipeline integration from all civilization systems (trade, culture, household, tourism, wonders)
- Performance testing with large datasets and complex metric calculations
- Real-time dashboard responsiveness during high-activity gameplay periods
- Database query optimization for complex analytical queries across multiple systems""",
        "priority": "medium",
        "dependencies": [1, 7, 40, 41, 42, 43, 44], # All previous systems for complete data
        "status": "pending"
    }
]

# Add all civilization tasks to the master tasks
for task in civilization_tasks:
    data['master']['tasks'].append(task)

# Save the updated tasks
with open('.taskmaster/tasks/tasks.json', 'w') as f:
    json.dump(data, f, indent=2)

print('🏛️ CIVILIZATION EXPANSION TASKS ADDED SUCCESSFULLY!')
print('=' * 60)
print(f'✅ Added {len(civilization_tasks)} comprehensive civilization tasks:')
print()

for i, task in enumerate(civilization_tasks, 1):
    deps_str = f" (depends on: {task['dependencies']})" if task['dependencies'] else ""
    print(f"   Task {task['id']}: {task['title']}")
    print(f"      Priority: {task['priority']} | Status: {task['status']}{deps_str}")

print()
print('🎯 COMPREHENSIVE CIVILIZATION SIMULATION READY!')
print('📊 Systems: Culture → Wonders → Households → Tourism → Analytics')
print('🔗 Full integration with Trade, Campaigns, and Vector Memory')
print('🎮 Transform Startales into rich civilization builder experience!')
