# Alliance & Hero Party System Architecture

## Overview

This document outlines the architecture for a comprehensive alliance and hero party system that operates on two distinct levels:
1. **Empire/Nation Alliances** - Political and economic partnerships between civilizations
2. **Hero Parties** - Small groups of individual heroes undertaking shared adventures and quests

## Core Systems

### 1. Empire Alliance System

#### Alliance Types
- **Trade Alliances**: Economic partnerships with shared markets and reduced tariffs
- **Military Alliances**: Mutual defense pacts and coordinated military actions
- **Research Alliances**: Shared technology development and knowledge exchange
- **Cultural Alliances**: Diplomatic ties with citizen exchange and cultural benefits

#### Alliance Mechanics
- **Formation**: Diplomatic negotiations with AI-powered treaty generation
- **Maintenance**: Ongoing relationship management with trust/reputation systems
- **Benefits**: Economic bonuses, military support, technology sharing, cultural exchange
- **Conflicts**: Alliance tensions, betrayals, and dissolution mechanics
- **Hierarchy**: Alliance leadership, voting systems, and collective decision-making

#### Political Dynamics
- **Reputation System**: Track trustworthiness and diplomatic standing
- **Treaty Complexity**: Multi-clause agreements with conditional terms
- **Economic Integration**: Shared infrastructure projects and joint ventures
- **Military Coordination**: Joint operations and resource sharing
- **Intelligence Sharing**: Coordinated espionage and counter-intelligence

### 2. Hero Party System

#### Party Formation
- **Recruitment**: Heroes can form or join parties (2-6 members typically)
- **Roles**: Tank, DPS, Support, Specialist roles with complementary skills
- **Leadership**: Party leader makes decisions, distributes loot, manages resources
- **Dynamics**: Personality compatibility affects party effectiveness

#### Party Mechanics
- **Shared Resources**: Party treasury, equipment sharing, collective reputation
- **Skill Synergies**: Combined abilities unlock special party actions
- **Experience Sharing**: Balanced XP distribution with bonus for teamwork
- **Communication**: In-party chat, strategy planning, real-time coordination

### 3. Intergalactic Quest System

#### Quest Categories
- **Exploration Quests**: Discover new worlds, ancient ruins, cosmic phenomena
- **Combat Encounters**: Epic battles against cosmic threats, alien invasions
- **Diplomatic Missions**: First contact scenarios, inter-species negotiations
- **Research Expeditions**: Scientific discoveries, artifact recovery, technology acquisition
- **Economic Ventures**: Trade route establishment, resource extraction, market expansion

#### Shared Encounter Mechanics
- **Instanced Content**: Private quest instances for each party
- **Persistent World Events**: Galaxy-wide events affecting all players
- **Cross-Party Interactions**: Multiple parties can encounter each other
- **Dynamic Scaling**: Quest difficulty adapts to party size and skill level
- **Branching Narratives**: Choices affect quest outcomes and future opportunities

#### Quest Progression
- **Multi-Stage Quests**: Complex storylines spanning multiple sessions
- **Prerequisites**: Unlock advanced quests through achievements and reputation
- **Consequences**: Quest outcomes affect empire relations and galaxy state
- **Rewards**: Unique equipment, technologies, territories, and reputation

### 4. Integration with Economic Simulation

#### Alliance Economic Impact
- **Trade Networks**: Alliances create preferential trade routes and markets
- **Resource Sharing**: Joint resource extraction and infrastructure projects
- **Economic Warfare**: Trade embargos, sanctions, and economic espionage
- **Currency Systems**: Alliance currencies and exchange rate dynamics
- **Gift Exchanges**: Diplomatic gifts between alliance members and external entities
- **Tribute Systems**: Tribute collection from vassals and protection payments
- **Resource Transfers**: Coordinated resource sharing and emergency aid

#### Hero Economic Participation
- **Quest Rewards**: Heroes earn money, equipment, and resources
- **Empire Contribution**: Hero achievements benefit their home empires
- **Independent Economy**: Heroes can operate as free agents or mercenaries
- **Investment Opportunities**: Heroes can invest in empire projects or start businesses
- **Gift Exchanges**: Heroes can gift items and resources to other heroes and parties
- **Tribute Payments**: Heroes may pay tribute to empires or receive tribute from followers
- **Party Resource Sharing**: Shared party treasury and equipment distribution

### 5. Real-Time Coordination

#### Alliance Communication
- **Diplomatic Channels**: Secure communication between alliance leaders
- **Public Forums**: Alliance-wide announcements and discussions
- **Intelligence Networks**: Shared information and strategic planning
- **Emergency Protocols**: Rapid response to threats and opportunities

#### Hero Party Coordination
- **Real-Time Chat**: Voice and text communication during quests
- **Tactical Planning**: Shared maps, objective tracking, strategy tools
- **Resource Management**: Inventory sharing, equipment distribution
- **Progress Synchronization**: Shared quest states and objective completion

## Technical Architecture

### Database Schema Extensions

#### Alliance Tables
```sql
-- Alliance management
CREATE TABLE alliances (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- trade, military, research, cultural
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',
    leader_empire_id INT REFERENCES empires(id),
    charter TEXT, -- AI-generated alliance charter
    reputation_score NUMERIC DEFAULT 0
);

CREATE TABLE alliance_members (
    alliance_id INT REFERENCES alliances(id),
    empire_id INT REFERENCES empires(id),
    joined_at TIMESTAMP DEFAULT NOW(),
    role VARCHAR(50) DEFAULT 'member', -- leader, officer, member
    contribution_score NUMERIC DEFAULT 0,
    PRIMARY KEY (alliance_id, empire_id)
);

CREATE TABLE alliance_treaties (
    id SERIAL PRIMARY KEY,
    alliance_id INT REFERENCES alliances(id),
    treaty_type VARCHAR(100) NOT NULL,
    terms TEXT NOT NULL, -- JSON with treaty conditions
    signed_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);
```

#### Hero Party Tables
```sql
-- Hero party management
CREATE TABLE hero_parties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    leader_hero_id INT REFERENCES heroes(id),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',
    max_members INT DEFAULT 6,
    party_treasury NUMERIC DEFAULT 0,
    reputation_score NUMERIC DEFAULT 0
);

CREATE TABLE party_members (
    party_id INT REFERENCES hero_parties(id),
    hero_id INT REFERENCES heroes(id),
    joined_at TIMESTAMP DEFAULT NOW(),
    role VARCHAR(50), -- tank, dps, support, specialist
    contribution_score NUMERIC DEFAULT 0,
    PRIMARY KEY (party_id, hero_id)
);

CREATE TABLE intergalactic_quests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quest_type VARCHAR(100) NOT NULL,
    difficulty_level INT DEFAULT 1,
    min_party_size INT DEFAULT 1,
    max_party_size INT DEFAULT 6,
    prerequisites TEXT, -- JSON with requirements
    rewards TEXT, -- JSON with reward structure
    narrative_data TEXT, -- JSON with story elements
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'available'
);

CREATE TABLE party_quest_instances (
    id SERIAL PRIMARY KEY,
    party_id INT REFERENCES hero_parties(id),
    quest_id INT REFERENCES intergalactic_quests(id),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'in_progress',
    progress_data TEXT, -- JSON with quest state
    outcome_data TEXT -- JSON with results
);
```

### API Endpoints

#### Alliance Management
- `GET /api/alliances` - List all alliances
- `POST /api/alliances` - Create new alliance
- `GET /api/alliances/:id` - Get alliance details
- `POST /api/alliances/:id/join` - Request to join alliance
- `POST /api/alliances/:id/treaties` - Create treaty
- `GET /api/alliances/:id/members` - List alliance members
- `POST /api/alliances/:id/diplomatic-action` - Perform diplomatic action

#### Hero Party Management
- `GET /api/hero-parties` - List available parties
- `POST /api/hero-parties` - Create new party
- `GET /api/hero-parties/:id` - Get party details
- `POST /api/hero-parties/:id/join` - Join party
- `POST /api/hero-parties/:id/leave` - Leave party
- `GET /api/hero-parties/:id/quests` - List party's active quests

#### Quest System
- `GET /api/quests/intergalactic` - List available intergalactic quests
- `GET /api/quests/:id` - Get quest details
- `POST /api/quests/:id/start` - Start quest (party action)
- `POST /api/quests/:id/progress` - Update quest progress
- `POST /api/quests/:id/complete` - Complete quest
- `GET /api/quests/instances/:id` - Get quest instance state

### Real-Time Features

#### WebSocket Channels
- `alliance:{alliance_id}` - Alliance-wide communication
- `party:{party_id}` - Hero party coordination
- `quest:{instance_id}` - Real-time quest updates
- `diplomatic:{empire_id}` - Diplomatic notifications
- `galaxy:events` - Galaxy-wide event broadcasts

#### Event Types
- Alliance formation/dissolution
- Treaty negotiations and signings
- Party formation and member changes
- Quest start/progress/completion
- Diplomatic incidents and opportunities
- Galaxy-wide events and threats

## AI Integration

### Alliance AI
- **Diplomatic Negotiations**: AI-powered treaty generation and negotiation
- **Relationship Modeling**: Dynamic trust and reputation calculations
- **Economic Analysis**: Alliance benefit optimization and trade route planning
- **Conflict Resolution**: AI-mediated dispute resolution and compromise suggestions

### Quest AI
- **Dynamic Quest Generation**: AI creates unique quests based on galaxy state
- **Narrative Generation**: AI-powered storylines and dialogue
- **Encounter Scaling**: Dynamic difficulty adjustment based on party composition
- **Consequence Modeling**: AI determines long-term effects of quest outcomes

### Hero AI
- **Personality Simulation**: AI-driven hero personalities and party dynamics
- **Skill Development**: AI-guided character progression and specialization
- **Decision Making**: AI assists with tactical and strategic decisions
- **Social Interaction**: AI-powered NPC interactions and relationship building

## Integration Points

### Economic Simulation Integration
- Alliance economic benefits affect empire GDP and trade
- Hero quest rewards contribute to empire resources
- Party spending affects local economies
- Alliance projects require economic investment

### Intelligence System Integration
- Alliance intelligence sharing networks
- Hero parties gather intelligence during quests
- Espionage operations can target alliances
- Quest outcomes provide strategic intelligence

### Real-Time Coordination
- Alliance diplomatic channels use WebSocket infrastructure
- Hero party coordination requires real-time communication
- Quest instances need synchronized state management
- Galaxy events broadcast to all relevant parties

This architecture provides a comprehensive foundation for both empire-level alliance politics and individual hero adventures, creating rich multiplayer experiences at multiple scales.
