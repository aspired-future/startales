# Visual Systems Architecture — Startales

## Overview

Startales is designed as a text-first narrative game with optional visual enhancements that maintain consistency across all generated content. The visual system supports characters, species, planets, cities, spaceships, units, tools, weapons, and cinematic videos while ensuring visual coherence through advanced identity preservation and style management.

## Visual Content Categories

### 1. **Character & Species Visuals**

#### **Species Templates (Renamed from "Races")**
- **Base Species Archetypes**: Humans, Zephyrians, Mechanoids, Crystalline Collective, Void Walkers, Bio-Shapers, Quantum Entities, Ancient Remnants
- **Species Consistency**: Each species has a defined visual template with consistent:
  - Anatomical structure and proportions
  - Skin/surface textures and colors
  - Facial features and expressions
  - Cultural clothing and accessories
  - Technology integration (cybernetics, bio-mods, etc.)

#### **Individual Character Variation**
- **Genetic Diversity**: Subtle variations within species parameters
- **Clothing & Equipment**: Role-specific uniforms, armor, civilian wear
- **Age & Experience**: Visual indicators of rank, experience, battle scars
- **Customization Options**: Player-controlled appearance modifications
- **Expression System**: Emotional states reflected in facial expressions and posture

#### **Character Identity Preservation**
- **Seed-Based Generation**: Each character has a unique seed for consistent appearance
- **Reference Image System**: Master portraits stored and referenced for consistency
- **Clothing Layers**: Separate generation for base character + clothing/equipment
- **Expression Variants**: Multiple expressions of same character using base seed

### 2. **Environmental Visuals**

#### **Planets & Worlds**
- **Biome Categories**: Desert, Ocean, Forest, Ice, Volcanic, Gas Giant, Artificial, Void
- **Atmospheric Conditions**: Weather patterns, lighting, atmospheric composition
- **Civilization Levels**: Primitive, Industrial, Advanced, Post-Scarcity, Ruins
- **Unique Features**: Distinctive landmarks, megastructures, natural phenomena

#### **Cities & Settlements**
- **Architectural Styles**: Species-specific building designs and urban planning
- **Technology Integration**: Level of technological advancement visible in infrastructure
- **Population Density**: From small outposts to massive megacities
- **Cultural Elements**: Species-specific decorations, monuments, public spaces

#### **Space Environments**
- **Stellar Phenomena**: Nebulae, star systems, black holes, cosmic storms
- **Space Stations**: Various designs from utilitarian to luxury
- **Fleet Formations**: Military and civilian ship arrangements
- **Battle Scenes**: Combat environments with debris and energy effects

### 3. **Technology & Equipment Visuals**

#### **Spaceships & Vehicles**
- **Ship Classes**: Fighters, Cruisers, Battleships, Carriers, Civilian vessels
- **Species Design Language**: Each species has distinctive ship aesthetics
- **Damage States**: Visual representation of ship condition and battle damage
- **Customization**: Player modifications and upgrades visible on ships

#### **Weapons & Tools**
- **Technology Levels**: Primitive, Kinetic, Energy, Exotic, Psychic
- **Species Variants**: Same weapon type with species-specific design elements
- **Condition States**: New, worn, damaged, modified, legendary
- **Scale Variants**: Personal, vehicle-mounted, ship-mounted, planetary

#### **Units & Military Assets**
- **Ground Forces**: Infantry, vehicles, mechs, defensive installations
- **Naval Forces**: Ships, submarines, amphibious units
- **Air Forces**: Fighters, bombers, transports, drones
- **Space Forces**: Fighters, capital ships, space marines, orbital platforms

## Visual Consistency Framework

### 1. **Style Profile System**

#### **Campaign Style Profiles**
```typescript
interface StyleProfile {
  id: string;
  name: string; // e.g., "Gritty Space Opera", "Retro-Futurist Neon", "Bio-Organic Horror"
  basePromptTokens: string[];
  colorPalette: ColorScheme;
  lightingStyle: LightingPreset;
  artStyle: ArtStylePreset;
  technicalLevel: TechAesthetic;
  moodTone: MoodPreset;
}

interface ColorScheme {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
}
```

#### **Style Inheritance Hierarchy**
1. **Campaign Style**: Base visual theme for entire campaign
2. **Species Modifiers**: Species-specific variations within campaign style
3. **Location Modifiers**: Environmental influences on appearance
4. **Temporal Modifiers**: Time period and technological era influences
5. **Situational Modifiers**: Combat, diplomatic, exploration context variations

### 2. **Identity Preservation System**

#### **Seed-Based Consistency**
```typescript
interface VisualIdentity {
  entityId: string;
  entityType: 'character' | 'species' | 'location' | 'ship' | 'item';
  baseSeed: string; // Deterministic seed for core appearance
  styleProfile: string; // Reference to campaign style
  referenceImages: ReferenceImage[];
  variations: VariationSet[];
}

interface ReferenceImage {
  id: string;
  type: 'portrait' | 'full_body' | 'profile' | 'action';
  imageUrl: string;
  promptUsed: string;
  seedUsed: string;
  isCanonical: boolean;
}
```

#### **Variation Generation**
- **Clothing Changes**: Same character with different outfits/equipment
- **Expression Variants**: Different emotions while maintaining identity
- **Age Progression**: Showing character development over time
- **Damage States**: Battle damage, wear, modifications
- **Environmental Adaptation**: Same entity in different environments

### 3. **Cross-Media Consistency**

#### **Image-to-Video Coherence**
- **Reference Frame System**: Videos use generated images as keyframes
- **Character Continuity**: Same character appearance across images and videos
- **Environmental Consistency**: Locations look identical in images and videos
- **Style Preservation**: Video generation maintains campaign art style

#### **Asset Reuse Pipeline**
1. **Master Asset Generation**: Create canonical reference images
2. **Variation Generation**: Create variants using reference as base
3. **Video Integration**: Use reference images as video keyframes
4. **Consistency Validation**: Automated checks for visual coherence
5. **Asset Library**: Centralized storage with tagging and search

## Technical Implementation

### 1. **Image Generation Pipeline**

#### **Prompt Template System**
```typescript
interface PromptTemplate {
  category: 'character' | 'environment' | 'item' | 'ship';
  baseTemplate: string;
  styleTokens: string[];
  consistencyTokens: string[];
  variationTokens: string[];
  negativePrompts: string[];
}

// Example Character Template
const characterTemplate: PromptTemplate = {
  category: 'character',
  baseTemplate: '{style_tokens}, {species_tokens}, {role_tokens}, {clothing_tokens}, {expression_tokens}, portrait, {lighting_tokens}',
  styleTokens: ['campaign_style', 'art_direction'],
  consistencyTokens: ['character_seed', 'species_traits'],
  variationTokens: ['clothing', 'expression', 'pose'],
  negativePrompts: ['deformed', 'duplicate', 'inconsistent_style']
};
```

#### **Generation Workflow**
1. **Request Processing**: Parse visual generation request
2. **Template Selection**: Choose appropriate prompt template
3. **Token Substitution**: Fill template with entity-specific data
4. **Consistency Check**: Verify against existing reference images
5. **Generation**: Create image using provider adapter
6. **Validation**: Check for style consistency and quality
7. **Storage**: Save with metadata and reference links
8. **Notification**: Publish image-available event

### 2. **Video Generation Pipeline**

#### **Video Types & Use Cases**
```typescript
interface VideoRequest {
  type: 'kickoff' | 'plot_twist' | 'battle' | 'diplomacy' | 'exploration' | 'ending';
  duration: number; // 3-30 seconds
  style: StyleProfile;
  characters: CharacterReference[];
  locations: LocationReference[];
  narrative: string;
  keyframes?: ImageReference[];
}

// Game Event Video Types
enum VideoEventType {
  GAME_KICKOFF = 'kickoff',           // Campaign/session start
  MAJOR_PLOT_TWIST = 'plot_twist',    // Narrative surprises
  BATTLE_SEQUENCE = 'battle',         // Combat highlights
  DIPLOMATIC_MEETING = 'diplomacy',   // Important negotiations
  EXPLORATION_DISCOVERY = 'exploration', // New worlds/artifacts
  VICTORY_ENDING = 'ending',          // Campaign conclusion
  SPECIES_INTRODUCTION = 'species',   // First contact scenarios
  TECHNOLOGY_BREAKTHROUGH = 'tech',   // Major discoveries
}
```

#### **Video Generation Workflow**
1. **Event Detection**: Identify video-worthy game events
2. **Storyboard Creation**: Generate sequence of key moments
3. **Reference Gathering**: Collect relevant character/location images
4. **Prompt Generation**: Create video-specific prompts
5. **Video Synthesis**: Generate video using reference images
6. **Post-Processing**: Add effects, transitions, audio
7. **Integration**: Embed in game UI with appropriate triggers

### 3. **Database Schema Extensions**

#### **Visual Assets Tables**
```sql
-- Style profiles for campaigns
CREATE TABLE style_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  style_tokens JSONB NOT NULL,
  color_scheme JSONB NOT NULL,
  lighting_preset VARCHAR(50),
  art_style VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Visual identities for entities
CREATE TABLE visual_identities (
  id SERIAL PRIMARY KEY,
  entity_id VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  base_seed VARCHAR(100) NOT NULL,
  style_profile_id INTEGER REFERENCES style_profiles(id),
  canonical_image_id INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_id, entity_type)
);

-- Generated images with consistency tracking
CREATE TABLE generated_images (
  id SERIAL PRIMARY KEY,
  visual_identity_id INTEGER REFERENCES visual_identities(id),
  image_type VARCHAR(50) NOT NULL, -- portrait, full_body, environment, item
  file_path VARCHAR(500) NOT NULL,
  prompt_used TEXT NOT NULL,
  seed_used VARCHAR(100) NOT NULL,
  style_profile_id INTEGER REFERENCES style_profiles(id),
  generation_metadata JSONB,
  is_canonical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated videos with reference tracking
CREATE TABLE generated_videos (
  id SERIAL PRIMARY KEY,
  video_type VARCHAR(50) NOT NULL,
  campaign_id INTEGER REFERENCES campaigns(id),
  duration_seconds INTEGER NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  style_profile_id INTEGER REFERENCES style_profiles(id),
  reference_images JSONB, -- Array of image IDs used as references
  prompt_used TEXT NOT NULL,
  generation_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Visual consistency validation results
CREATE TABLE consistency_checks (
  id SERIAL PRIMARY KEY,
  source_image_id INTEGER REFERENCES generated_images(id),
  target_image_id INTEGER REFERENCES generated_images(id),
  consistency_score DECIMAL(3,2), -- 0.00 to 1.00
  validation_method VARCHAR(50),
  validation_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. **API Endpoints**

#### **Image Generation APIs**
```typescript
// Generate character image
POST /api/images/character
{
  characterId: string;
  imageType: 'portrait' | 'full_body' | 'action';
  variations?: {
    clothing?: string;
    expression?: string;
    pose?: string;
  };
  useReference?: boolean;
}

// Generate environment image
POST /api/images/environment
{
  locationId: string;
  viewType: 'overview' | 'detail' | 'interior';
  timeOfDay?: string;
  weather?: string;
  population?: 'empty' | 'populated' | 'crowded';
}

// Generate item/ship image
POST /api/images/item
{
  itemId: string;
  itemType: 'weapon' | 'tool' | 'ship' | 'vehicle';
  condition?: 'pristine' | 'used' | 'damaged' | 'legendary';
  scale?: 'detail' | 'context' | 'comparison';
}
```

#### **Video Generation APIs**
```typescript
// Generate event video
POST /api/videos/event
{
  eventType: VideoEventType;
  campaignId: string;
  duration: number;
  characters: string[];
  locations: string[];
  narrative: string;
  urgency?: 'low' | 'medium' | 'high';
}

// Generate cinematic sequence
POST /api/videos/cinematic
{
  storyboard: KeyFrame[];
  style: StyleProfile;
  duration: number;
  audioTrack?: string;
}
```

#### **Consistency Management APIs**
```typescript
// Get visual identity
GET /api/visual/identity/:entityId

// Update visual identity
PUT /api/visual/identity/:entityId
{
  baseSeed?: string;
  styleProfile?: string;
  canonicalImage?: string;
}

// Validate consistency
POST /api/visual/validate
{
  sourceImageId: string;
  targetImageId: string;
  validationMethod: 'facial_recognition' | 'style_matching' | 'color_analysis';
}
```

## Integration with Game Systems

### 1. **Game Mode Integration**

#### **COOP Mode Visuals**
- **Threat Visualization**: Dramatic images/videos of galactic threats
- **Alliance Ceremonies**: Formal diplomatic meetings and treaty signings
- **Joint Operations**: Combined fleet actions and coordinated battles
- **Victory Celebrations**: Collective achievements and peace treaties

#### **Achievement Mode Visuals**
- **Leaderboard Portraits**: Dynamic character portraits showing current ranking
- **Achievement Unlocks**: Celebratory videos for major milestones
- **Competition Highlights**: Battle sequences and economic achievements
- **Progress Visualization**: Charts and graphs with character overlays

#### **Conquest Mode Visuals**
- **Territory Maps**: Visual representation of galactic control
- **Battle Sequences**: Epic space and ground combat videos
- **Conquest Ceremonies**: Formal surrender and occupation scenes
- **Superweapon Deployment**: Dramatic videos of ultimate weapons

#### **Hero Mode Visuals**
- **Character Progression**: Visual evolution of heroes over time
- **Villain Reveals**: Dramatic introduction videos for antagonists
- **Legendary Equipment**: Detailed images of powerful artifacts
- **Epic Confrontations**: Cinematic boss battle sequences

### 2. **UI Integration Points**

#### **Text-First Design with Visual Enhancements**
- **Progressive Enhancement**: Text content loads first, visuals enhance
- **Graceful Degradation**: Full functionality without images/videos
- **Loading States**: Elegant placeholders during generation
- **Bandwidth Adaptation**: Quality scaling based on connection

#### **Visual Trigger Points**
```typescript
interface VisualTrigger {
  event: GameEvent;
  priority: 'low' | 'medium' | 'high' | 'critical';
  visualType: 'image' | 'video' | 'both';
  generationDelay: number; // milliseconds
  cacheDuration: number; // hours
}

// Example triggers
const visualTriggers: VisualTrigger[] = [
  {
    event: 'character_introduction',
    priority: 'high',
    visualType: 'image',
    generationDelay: 0,
    cacheDuration: 168 // 1 week
  },
  {
    event: 'major_plot_twist',
    priority: 'critical',
    visualType: 'video',
    generationDelay: 2000,
    cacheDuration: 24
  },
  {
    event: 'battle_victory',
    priority: 'medium',
    visualType: 'both',
    generationDelay: 1000,
    cacheDuration: 48
  }
];
```

### 3. **Performance Considerations**

#### **Generation Prioritization**
1. **Critical**: Character portraits, species introductions
2. **High**: Major plot events, battle outcomes
3. **Medium**: Environmental scenes, equipment details
4. **Low**: Background elements, ambient content

#### **Caching Strategy**
- **Permanent Cache**: Character portraits, species templates
- **Session Cache**: Environmental scenes, temporary items
- **Event Cache**: Plot-specific videos, battle sequences
- **Cleanup Policy**: Remove unused assets after campaign completion

#### **Bandwidth Optimization**
- **Progressive Loading**: Low-res preview → full resolution
- **Format Selection**: WebP for images, WebM for videos
- **Compression Levels**: Adaptive based on content importance
- **CDN Integration**: Global distribution for faster access

## Implementation Phases

### Phase 1: Foundation (Sprint 18-19)
- **Style Profile System**: Campaign-wide visual consistency
- **Character Identity System**: Seed-based character generation
- **Basic Image Generation**: Portraits and simple scenes
- **Database Schema**: Core visual asset tables

### Phase 2: Enhanced Visuals (Sprint 20-21)
- **Environment Generation**: Planets, cities, space scenes
- **Equipment Visualization**: Ships, weapons, tools
- **Variation System**: Clothing, expressions, damage states
- **Consistency Validation**: Automated quality checks

### Phase 3: Video Integration (Sprint 22-23)
- **Event Video System**: Automated video generation for key events
- **Cinematic Sequences**: Multi-shot narrative videos
- **Reference Integration**: Videos using existing character images
- **Audio Integration**: Music and sound effects for videos

### Phase 4: Advanced Features (Sprint 24-25)
- **Real-time Generation**: On-demand visual creation
- **Player Customization**: User-controlled appearance options
- **Cross-Campaign Consistency**: Character appearance across campaigns
- **Performance Optimization**: Caching, compression, CDN integration

## Quality Assurance

### 1. **Visual Consistency Metrics**
- **Character Recognition**: Facial similarity scores across images
- **Style Coherence**: Color palette and art style consistency
- **Technical Quality**: Resolution, compression, artifact detection
- **Narrative Alignment**: Visual content matches story context

### 2. **Automated Validation**
- **Pre-generation Checks**: Prompt validation and safety filters
- **Post-generation Analysis**: Quality scoring and consistency verification
- **Cross-reference Validation**: Comparison with existing assets
- **User Feedback Integration**: Quality ratings and improvement suggestions

### 3. **Content Safety**
- **Maturity Rating Compliance**: Age-appropriate content generation
- **Cultural Sensitivity**: Respectful representation of diverse species
- **Violence Limitations**: Appropriate level of combat imagery
- **Content Filtering**: Automated detection of inappropriate content

This comprehensive visual system will transform Startales from a text-based game into a rich, visually consistent universe while maintaining the core narrative focus and ensuring all visual elements enhance rather than distract from the gameplay experience.
