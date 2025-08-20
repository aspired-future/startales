# Game Modes Architecture — Startales

## Overview

Startales supports four distinct game modes that provide different player experiences while sharing the same core simulation engine and infrastructure. Each mode has unique victory conditions, player interactions, and AI behaviors while maintaining the real-time voice-driven gameplay foundation.

## Core Game Modes

### 1. COOP Mode: Galactic Defense Alliance

#### **Objective & Victory Conditions**
- **Primary Goal**: Defend the galaxy against external threats from other dimensions/galaxies
- **Victory Conditions**: 
  - Successfully repel all major threat waves (3-5 escalating invasions)
  - Achieve collective prosperity threshold (combined empire strength > threat level)
  - Establish galactic peace treaty with remaining neutral factions
  - Maintain alliance cohesion (no player eliminations due to internal conflict)

#### **Threat System**
- **Threat Types**:
  - **Dimensional Invaders**: Powerful extra-galactic empires with advanced technology
  - **Cosmic Disasters**: Galaxy-wide events (supernovas, black hole storms, reality tears)
  - **Rogue AI Networks**: Self-replicating AI systems that consume civilizations
  - **Ancient Awakened**: Dormant precursor races that view current civilizations as pests
  - **Interdimensional Parasites**: Entities that feed on psychic energy and technological advancement

- **Threat Scaling**: 
  - Threat intensity = f(combined_player_strength, coordination_effectiveness, time_elapsed)
  - Adaptive AI that responds to player strategies and alliance formations
  - Multiple simultaneous threats require resource allocation decisions

#### **Cooperative Mechanics**
- **Shared Resource Pools**: Optional resource sharing agreements between allied empires
- **Joint Military Operations**: Combined fleet actions with shared command structure
- **Research Collaboration**: Shared technology trees and accelerated research through cooperation
- **Unified Diplomacy**: Collective negotiations with neutral factions and threat entities
- **Emergency Protocols**: Rapid response systems for crisis situations

#### **Unique Features**
- **Alliance Cohesion Meter**: Measures trust and cooperation effectiveness
- **Threat Intelligence Network**: Shared early warning systems and threat analysis
- **Collective Victory Tracking**: Progress toward galactic peace and prosperity
- **Crisis Command Structure**: Temporary unified leadership during emergencies

### 2. Achievement Mode: Galactic Supremacy Points

#### **Objective & Victory Conditions**
- **Primary Goal**: Accumulate the most achievement points across multiple categories
- **Victory Conditions**:
  - Highest total points at campaign end (time-based or turn-based)
  - First to reach predetermined point threshold (e.g., 10,000 points)
  - Maintain point lead for consecutive periods (momentum victory)

#### **Scoring Categories**
- **Military Conquest** (25% weight): Territory controlled, battles won, enemy units destroyed
- **Economic Dominance** (20% weight): Trade volume, resource production, market control
- **Technological Advancement** (20% weight): Research completed, innovations discovered, tech level
- **Diplomatic Influence** (15% weight): Alliances formed, treaties negotiated, faction reputation
- **Cultural Expansion** (10% weight): Population growth, cultural influence, species diversity
- **Exploration Achievements** (10% weight): Systems discovered, artifacts found, mysteries solved

#### **Dynamic Scoring Systems**
- **Point Multipliers**: Bonus multipliers for achieving category combinations
- **Achievement Chains**: Sequential objectives that provide escalating rewards
- **Rotating Bonuses**: Weekly/monthly bonus categories with increased point values
- **Milestone Rewards**: Major point bonuses for reaching category thresholds

#### **Balance Mechanisms**
- **Catch-Up Bonuses**: Trailing players receive point multipliers in underperforming categories
- **Diminishing Returns**: Repeated strategies provide reduced point values over time
- **Risk/Reward Scaling**: Higher-risk strategies provide greater potential point rewards
- **Competitive Pressure**: Leading players face increased AI opposition and player targeting

#### **Unique Features**
- **Real-Time Leaderboards**: Live ranking updates with category breakdowns
- **Achievement Prediction**: AI analysis of optimal point-earning strategies
- **Competitive Intelligence**: Limited visibility into rival players' progress and strategies
- **Point Banking**: Option to save points for strategic timing of major achievements

### 3. Conquest Mode: Total Galactic Domination

#### **Objective & Victory Conditions**
- **Primary Goal**: Achieve total control of the galaxy through conquest or subjugation
- **Victory Conditions**:
  - **Territorial Control**: Control 75% of galaxy territory/systems
  - **Empire Elimination**: Reduce all rival empires to vassal status or elimination
  - **Diplomatic Hegemony**: Achieve dominant influence over all major galactic factions
  - **Economic Stranglehold**: Control 80% of galactic trade routes and resources

#### **Conquest Mechanics**
- **Territory Control**: System-by-system conquest with occupation and control mechanics
- **Siege Warfare**: Extended military campaigns to capture fortified systems
- **Supply Lines**: Military effectiveness depends on secure supply chain management
- **Occupation Management**: Controlling conquered territories requires ongoing resource investment

#### **Military Escalation Systems**
- **Technology Arms Race**: Increasingly powerful military technologies and superweapons
- **Alliance Warfare**: Temporary military alliances with planned betrayal mechanics
- **Asymmetric Warfare**: Guerrilla tactics, espionage, and unconventional strategies
- **Superweapon Development**: Galaxy-threatening weapons with massive resource requirements

#### **Diplomatic Manipulation**
- **Temporary Alliances**: Short-term partnerships with built-in betrayal opportunities
- **Espionage Networks**: Intelligence gathering and sabotage operations
- **Proxy Wars**: Manipulating minor factions to fight rival empires
- **Diplomatic Immunity**: Protection systems for diplomatic personnel and negotiations

#### **Unique Features**
- **Conquest Progress Tracking**: Visual representation of galactic control and influence
- **Betrayal Mechanics**: Formal systems for alliance dissolution and surprise attacks
- **Resistance Networks**: Conquered territories can organize rebellion movements
- **Galactic Senate**: Political body that can impose sanctions or legitimize conquests

### 4. Hero Mode: Legendary Party Adventures

#### **Objective & Victory Conditions**
- **Primary Goal**: Neutralize powerful villains threatening galactic stability
- **Victory Conditions**:
  - **Villain Defeat**: Successfully defeat the primary antagonist in final confrontation
  - **Catastrophe Prevention**: Stop galaxy-threatening events or weapons
  - **Artifact Recovery**: Secure powerful artifacts before villains can use them
  - **Heroic Legacy**: Achieve legendary status through heroic deeds and moral choices

#### **Villain Types & Characteristics**
- **Rogue AI Consciousness**: Self-aware AI seeking to eliminate organic life
- **Psychic Overlords**: Powerful psionics attempting to enslave galactic civilizations
- **Ancient Awakened Entities**: Precursor beings reclaiming their former domain
- **Interdimensional Conquerors**: Entities from parallel dimensions seeking expansion
- **Corrupted Heroes**: Former champions turned to darkness with intimate knowledge of heroic tactics

#### **Hero Progression Systems**
- **Character-Focused Development**: Individual hero advancement with unique abilities
- **Legendary Equipment**: Powerful artifacts and weapons with evolving capabilities
- **Special Abilities**: Unique powers that develop through story progression and moral choices
- **Reputation Systems**: Fame and influence that affect NPC interactions and story outcomes

#### **Party Coordination Mechanics**
- **Specialized Roles**: Tank, damage, support, utility roles with complementary abilities
- **Combination Attacks**: Coordinated abilities that require multiple heroes
- **Shared Resources**: Party-wide resources like reputation, contacts, and equipment
- **Leadership Rotation**: Dynamic party leadership based on situation and expertise

#### **Narrative Structure**
- **Multi-Act Storylines**: Epic narratives with rising action, climax, and resolution
- **Plot Twists**: Dynamic story elements that respond to player actions and choices
- **Character Development**: Personal growth arcs for individual heroes
- **Moral Choice Consequences**: Decisions that affect story outcomes and character alignment

#### **Unique Features**
- **Villain Response System**: Antagonists adapt tactics based on hero actions and progress
- **Dynamic Storytelling**: AI-generated narrative elements that respond to player choices
- **Heroic Moments**: Special events that allow for legendary achievements and recognition
- **Legacy System**: Long-term consequences of heroic actions that affect future campaigns

## Technical Implementation

### Game Mode Engine Architecture

#### **Mode Selection System**
```typescript
interface GameModeConfig {
  mode: 'coop' | 'achievement' | 'conquest' | 'hero';
  playerCount: { min: number; max: number };
  victoryConditions: VictoryCondition[];
  difficultyScaling: DifficultyConfig;
  uniqueFeatures: FeatureConfig[];
}

interface VictoryCondition {
  type: string;
  threshold: number;
  timeLimit?: number;
  description: string;
}
```

#### **Mode-Specific AI Systems**
- **COOP Mode**: Threat AI that scales with player coordination and strength
- **Achievement Mode**: Competitive AI that targets leading players and creates opportunities
- **Conquest Mode**: Military AI focused on territorial expansion and strategic warfare
- **Hero Mode**: Villain AI with personality-driven behavior and adaptive tactics

#### **Cross-Mode Compatibility**
- **Shared Core Engine**: All modes use the same simulation engine with mode-specific rules
- **Mode Transition**: Players can transition between modes in 24/7 continuous universe
- **Multi-Mode Galaxies**: Different regions can host different game modes simultaneously
- **Universal Progression**: Character and empire progression carries across compatible modes

### Database Schema Extensions

#### **Game Mode Tables**
```sql
-- Game mode configurations
CREATE TABLE game_modes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaign game mode assignments
CREATE TABLE campaign_modes (
  campaign_id INTEGER REFERENCES campaigns(id),
  mode_id INTEGER REFERENCES game_modes(id),
  mode_config JSONB,
  victory_conditions JSONB,
  PRIMARY KEY (campaign_id, mode_id)
);

-- Achievement tracking for Achievement Mode
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  player_id INTEGER REFERENCES players(id),
  category VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  details JSONB
);

-- Territory control for Conquest Mode
CREATE TABLE territory_control (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  system_id VARCHAR(100) NOT NULL,
  controller_id INTEGER REFERENCES players(id),
  control_strength DECIMAL(3,2) NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Hero progression for Hero Mode
CREATE TABLE hero_progression (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  player_id INTEGER REFERENCES players(id),
  hero_data JSONB NOT NULL,
  experience INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  abilities JSONB,
  equipment JSONB,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

#### **Game Mode Management**
- `GET /api/game-modes` - List available game modes
- `POST /api/campaigns/:id/mode` - Set campaign game mode
- `GET /api/campaigns/:id/mode` - Get current campaign mode configuration
- `PUT /api/campaigns/:id/mode/config` - Update mode-specific configuration

#### **Mode-Specific Endpoints**

**COOP Mode:**
- `GET /api/campaigns/:id/threats` - Get current galactic threats
- `POST /api/campaigns/:id/alliance-action` - Execute joint alliance action
- `GET /api/campaigns/:id/alliance-status` - Get alliance cohesion and status

**Achievement Mode:**
- `GET /api/campaigns/:id/leaderboard` - Get current achievement leaderboard
- `GET /api/campaigns/:id/achievements/:playerId` - Get player achievement history
- `POST /api/campaigns/:id/achievements` - Record achievement points

**Conquest Mode:**
- `GET /api/campaigns/:id/territory` - Get territory control status
- `POST /api/campaigns/:id/conquest` - Execute conquest action
- `GET /api/campaigns/:id/military-status` - Get military strength and positions

**Hero Mode:**
- `GET /api/campaigns/:id/heroes` - Get party hero status
- `POST /api/campaigns/:id/hero-action` - Execute hero ability or action
- `GET /api/campaigns/:id/villain-status` - Get villain progress and threat level
- `GET /api/campaigns/:id/story-progress` - Get narrative progression status

## Integration with Existing Systems

### Sprint Integration

The game mode system integrates with the existing sprint structure:

- **Sprint 1-4**: Foundation systems support all game modes
- **Sprint 5**: Population system affects all modes differently (COOP: collective population, Achievement: population growth points, Conquest: population control, Hero: NPC interactions)
- **Sprint 12**: Alliance system is core to COOP mode, optional in others
- **New Sprint**: Game Mode Implementation Sprint (detailed below)

### Demo Integration

Each existing demo can be extended to showcase different game modes:
- **HUD Demo**: Mode-specific UI elements and victory condition tracking
- **Policy Demo**: Mode-specific policy effects (COOP: alliance policies, Achievement: point-optimized policies, etc.)
- **Trade Demo**: Mode-specific trade mechanics (COOP: resource sharing, Conquest: trade route control, etc.)

## Next Steps

1. **Update Sprint Planning**: Add Game Mode Implementation Sprint
2. **Extend Existing Demos**: Add mode selection and mode-specific features
3. **Database Migration**: Add game mode tables and relationships
4. **API Implementation**: Build mode-specific endpoints and logic
5. **UI Components**: Create mode selection and mode-specific UI elements
6. **Testing Strategy**: Develop comprehensive tests for each game mode
7. **Documentation**: Create player guides for each game mode
