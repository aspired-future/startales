import React, { useState, useEffect } from 'react';
import './CampaignWizard.css';

// Campaign configuration interfaces
interface CampaignConfig {
  // Basic Info
  name: string;
  description: string;
  
  // Scenario
  scenarioType: 'default' | 'ai-generated' | 'custom';
  selectedScenario?: DefaultScenario;
  aiGeneratedScenario?: AIScenario;
  customScenario?: CustomScenario;
  
  // Graphics & Theme
  graphicsTheme: string;
  graphicsOptions: GraphicsOption[];
  selectedGraphics?: GraphicsOption;
  
  // Villains & Threats
  villains: VillainConfig[];
  threatLevel: 'low' | 'medium' | 'high' | 'extreme';
  
  // Game Settings
  gameMode: GameMode;
  gameMasterPersonality: GMPersonality;
  mapSize: 'small' | 'medium' | 'large' | 'massive';
  playerCount: number;
  aiPlayerCount: number;
  
  // Scheduling
  campaignDurationWeeks: number;
  weeklySessionHours: number;
  sessionTimes: ScheduledSession[];
  
  // Difficulty & Requirements
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  minimumRank: number;
  maximumRank?: number;
  
  // Story Arc Pacing
  storyPacing?: {
    climaxPosition: 'early' | 'middle' | 'late' | 'custom';
    customClimaxWeek?: number;
    intensityProfile: 'gradual' | 'steep' | 'plateau' | 'multiple_peaks';
    celebrationDuration: number;
    eventDensity: 'sparse' | 'moderate' | 'dense';
    allowPlayerChoice: boolean;
    villainPresence: 'minimal' | 'moderate' | 'heavy';
  };

  // Enhanced Villain System
  villainConfiguration?: {
    enabled: boolean;
    count: number;
    threatLevels: number[];
    categories: string[];
    customization: 'minimal' | 'moderate' | 'extensive';
    selectedVillains: any[];
    generatedScenario?: any;
  };
  
  // Pricing
  estimatedCost: number;
  subscriptionTier: string;
  
  // Story Initialization
  storyInitialized?: boolean;
  gameId?: string;
}

interface DefaultScenario {
  id: string;
  name: string;
  description: string;
  theme: string;
  difficulty: string;
  estimatedDuration: string;
  playerCount: { min: number; max: number };
  preview: string;
}

interface AIScenario {
  prompt: string;
  generatedContent: string;
  themes: string[];
  complexity: number;
  regenerationCount: number;
}

interface CustomScenario {
  title: string;
  backstory: string;
  objectives: string[];
  specialRules: string[];
}

interface GraphicsOption {
  id: string;
  name: string;
  theme: string;
  preview: string;
  style: 'realistic' | 'stylized' | 'minimalist' | 'retro';
}

interface VillainConfig {
  id: string;
  name: string;
  type: 'galactic' | 'intergalactic' | 'player';
  threat: 'minor' | 'major' | 'ultimate';
  backstory: string;
  motivation: string;
  powerLevel: number;
}

interface GameMode {
  type: 'diplomatic' | 'conquest' | 'exploration' | 'survival' | 'hybrid';
  rules: Record<string, any>;
  objectives: string[];
}

interface GMPersonality {
  id: string;
  name: string;
  traits: string[];
  style: 'narrative' | 'strategic' | 'chaotic' | 'balanced';
  description: string;
}

interface ScheduledSession {
  dayOfWeek: number;
  startTime: string;
  duration: number;
}

const WIZARD_STEPS = [
  'Basic Info',
  'Scenario Selection', 
  'Graphics & Theme',
  'Villains & Threats',
  'Enhanced Villains',
  'Game Settings',
  'Story Pacing',
  'Scheduling',
  'Difficulty & Requirements',
  'Review & Create'
];

const DEFAULT_SCENARIOS: DefaultScenario[] = [
  {
    id: 'galactic-uprising',
    name: 'The Galactic Uprising',
    description: 'A rebellion threatens the stability of the galaxy. Unite the civilizations or crush the insurgents.',
    theme: 'Political Intrigue',
    difficulty: 'Intermediate',
    estimatedDuration: '8-12 weeks',
    playerCount: { min: 3, max: 8 },
    preview: 'Classic space opera with political maneuvering and military strategy.'
  },
  {
    id: 'void-invasion',
    name: 'Invasion from the Void',
    description: 'Ancient entities from beyond our galaxy have arrived. Survival depends on unprecedented cooperation.',
    theme: 'Cosmic Horror',
    difficulty: 'Advanced',
    estimatedDuration: '10-16 weeks',
    playerCount: { min: 4, max: 10 },
    preview: 'High-stakes survival against overwhelming odds.'
  },
  {
    id: 'trade-wars',
    name: 'The Great Trade Wars',
    description: 'Economic warfare threatens to tear apart galactic commerce. Navigate complex alliances and betrayals.',
    theme: 'Economic Strategy',
    difficulty: 'Beginner',
    estimatedDuration: '6-10 weeks',
    playerCount: { min: 2, max: 6 },
    preview: 'Focus on diplomacy, trade, and economic manipulation.'
  },
  {
    id: 'lost-civilization',
    name: 'Secrets of the Lost Civilization',
    description: 'Ancient ruins hold the key to ultimate power. Race to uncover the secrets before your rivals.',
    theme: 'Exploration & Discovery',
    difficulty: 'Intermediate',
    estimatedDuration: '8-14 weeks',
    playerCount: { min: 3, max: 7 },
    preview: 'Archaeological adventure with competitive exploration.'
  },
  {
    id: 'quantum-crisis',
    name: 'The Quantum Crisis',
    description: 'Reality itself is breaking down. Work together to prevent the collapse of the universe.',
    theme: 'Science Fiction',
    difficulty: 'Expert',
    estimatedDuration: '12-20 weeks',
    playerCount: { min: 4, max: 8 },
    preview: 'Complex scientific challenges requiring cooperation and innovation.'
  }
];

const GM_PERSONALITIES: GMPersonality[] = [
  {
    id: 'storyteller',
    name: 'The Storyteller',
    traits: ['Narrative-focused', 'Character-driven', 'Dramatic'],
    style: 'narrative',
    description: 'Emphasizes rich storytelling, character development, and dramatic moments.'
  },
  {
    id: 'strategist',
    name: 'The Strategist',
    traits: ['Tactical', 'Analytical', 'Challenging'],
    style: 'strategic',
    description: 'Focuses on strategic depth, complex decisions, and tactical challenges.'
  },
  {
    id: 'wildcard',
    name: 'The Wildcard',
    traits: ['Unpredictable', 'Creative', 'Surprising'],
    style: 'chaotic',
    description: 'Introduces unexpected twists, creative solutions, and surprising developments.'
  },
  {
    id: 'balanced',
    name: 'The Balanced Guide',
    traits: ['Fair', 'Adaptive', 'Supportive'],
    style: 'balanced',
    description: 'Provides a well-rounded experience balancing all aspects of gameplay.'
  }
];

export const CampaignWizard: React.FC<{ onComplete: (config: CampaignConfig) => void; onCancel: () => void }> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<CampaignConfig>({
    name: '',
    description: '',
    scenarioType: 'default',
    graphicsTheme: 'default',
    graphicsOptions: [],
    villains: [],
    threatLevel: 'medium',
    gameMode: {
      type: 'diplomatic',
      rules: {},
      objectives: []
    },
    gameMasterPersonality: GM_PERSONALITIES[0],
    mapSize: 'medium',
    playerCount: 4,
    aiPlayerCount: 2,
    campaignDurationWeeks: 10,
    weeklySessionHours: 3,
    sessionTimes: [],
    difficulty: 'intermediate',
    minimumRank: 0,
    maximumRank: undefined,
    storyPacing: {
      climaxPosition: 'middle',
      intensityProfile: 'gradual',
      celebrationDuration: 2,
      eventDensity: 'moderate',
      allowPlayerChoice: true,
      villainPresence: 'moderate'
    },
    villainConfiguration: {
      enabled: true,
      count: 2,
      threatLevels: [3, 4],
      categories: ['galactic', 'political', 'technological'],
      customization: 'moderate',
      selectedVillains: [],
      generatedScenario: undefined
    },
    estimatedCost: 0,
    subscriptionTier: 'standard'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingGame, setCreatingGame] = useState(false);
  const [storyInitializing, setStoryInitializing] = useState(false);

  // Update configuration
  const updateConfig = (updates: Partial<CampaignConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Generate AI scenario
  const generateAIScenario = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/campaign/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, preferences: config })
      });
      
      if (!response.ok) throw new Error('Failed to generate scenario');
      
      const aiScenario = await response.json();
      updateConfig({ 
        scenarioType: 'ai-generated',
        aiGeneratedScenario: aiScenario
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Create game with story initialization
  const createGameWithStory = async () => {
    setCreatingGame(true);
    setStoryInitializing(true);
    setError(null);

    try {
      // Convert campaign config to game config format
      const gameConfig = {
        name: config.name,
        description: config.description,
        theme: mapScenarioToTheme(config.selectedScenario?.theme || config.aiGeneratedScenario?.themes?.[0] || 'Adventure'),
        maxPlayers: config.playerCount + config.aiPlayerCount,
        storyComplexity: mapDifficultyToComplexity(config.difficulty),
        gameMode: mapGameModeToMode(config.gameMode.type),
        duration: mapDurationToDuration(config.campaignDurationWeeks)
      };

      // Create the game with story initialization
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostPlayerId: 'campaign-host-' + Date.now(), // Generate a temporary host ID
          gameConfig
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Initialize the Game Master Story Engine with detailed campaign parameters
        const civilizationId = parseInt(data.game.id.replace(/\D/g, '').slice(0, 8)) || 1;
        
        const storySetup = {
          civilizationId,
          gameTheme: config.selectedScenario?.theme || config.aiGeneratedScenario?.themes?.[0] || 'political intrigue',
          storyGenre: mapScenarioToGenre(config.selectedScenario?.name || 'space opera'),
          playerActions: [],
          currentEvents: [],
          majorStorylines: generateStorylines(config),
          characterPopulationTarget: Math.max(50, config.playerCount * 20),
          storyTension: mapDifficultyToTension(config.difficulty)
        };

        // Initialize the dynamic story system
        const storyResponse = await fetch('/api/witter/initialize-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(storySetup)
        });

        if (!storyResponse.ok) {
          console.warn('Story initialization failed, but continuing with game creation');
        }
        
        // Update config with game information
        const enhancedConfig = {
          ...config,
          gameId: data.game.id,
          civilizationId,
          storyInitialized: storyResponse.ok
        };

        // Wait a moment for story initialization to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Call the original onComplete with enhanced config
        onComplete(enhancedConfig);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create game');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      console.error('Error creating game with story:', err);
    } finally {
      setCreatingGame(false);
      setStoryInitializing(false);
    }
  };

  // Helper functions to map campaign config to game config
  const mapScenarioToTheme = (scenarioTheme: string): string => {
    const themeMap: { [key: string]: string } = {
      'Political Intrigue': 'space_opera',
      'Cosmic Horror': 'space_opera',
      'Economic Strategy': 'modern_politics',
      'Exploration & Discovery': 'space_opera',
      'Science Fiction': 'cyberpunk',
      'Adventure': 'space_opera',
      'Strategy': 'space_opera',
      'Diplomacy': 'modern_politics'
    };
    return themeMap[scenarioTheme] || 'space_opera';
  };

  const mapDifficultyToComplexity = (difficulty: string): 'simple' | 'moderate' | 'complex' | 'epic' => {
    const complexityMap: { [key: string]: 'simple' | 'moderate' | 'complex' | 'epic' } = {
      'beginner': 'simple',
      'intermediate': 'moderate',
      'advanced': 'complex',
      'expert': 'epic'
    };
    return complexityMap[difficulty] || 'moderate';
  };

  const mapGameModeToMode = (gameMode: string): 'cooperative' | 'competitive' | 'mixed' => {
    const modeMap: { [key: string]: 'cooperative' | 'competitive' | 'mixed' } = {
      'diplomatic': 'cooperative',
      'conquest': 'competitive',
      'exploration': 'cooperative',
      'survival': 'cooperative',
      'hybrid': 'mixed'
    };
    return modeMap[gameMode] || 'cooperative';
  };

  const mapDurationToDuration = (weeks: number): 'short' | 'medium' | 'long' | 'campaign' => {
    if (weeks <= 6) return 'short';
    if (weeks <= 12) return 'medium';
    if (weeks <= 20) return 'long';
    return 'campaign';
  };

  // New helper functions for story initialization
  const mapScenarioToGenre = (scenarioName: string): string => {
    const genreMap: { [key: string]: string } = {
      'The Galactic Uprising': 'space opera',
      'Invasion from the Void': 'cosmic horror',
      'The Great Trade Wars': 'economic thriller',
      'Secrets of the Lost Civilization': 'archaeological adventure',
      'The Quantum Crisis': 'hard science fiction'
    };
    return genreMap[scenarioName] || 'space opera';
  };

  const mapDifficultyToTension = (difficulty: string): number => {
    const tensionMap: { [key: string]: number } = {
      'beginner': 3,
      'intermediate': 5,
      'advanced': 7,
      'expert': 9
    };
    return tensionMap[difficulty] || 5;
  };

  const generateStorylines = (config: CampaignConfig): string[] => {
    const baseStorylines = [];
    
    // Add storylines based on selected scenario
    if (config.selectedScenario) {
      switch (config.selectedScenario.id) {
        case 'galactic-uprising':
          baseStorylines.push('Rebel faction gains momentum', 'Government corruption exposed', 'Military loyalty questioned');
          break;
        case 'void-invasion':
          baseStorylines.push('Ancient entities awaken', 'Reality distortions increase', 'Survival alliances form');
          break;
        case 'trade-wars':
          baseStorylines.push('Economic manipulation detected', 'Trade route disruptions', 'Corporate espionage revealed');
          break;
        case 'lost-civilization':
          baseStorylines.push('Archaeological discoveries accelerate', 'Ancient technology activated', 'Rival expeditions compete');
          break;
        case 'quantum-crisis':
          baseStorylines.push('Quantum anomalies spread', 'Scientific breakthrough needed', 'Reality becomes unstable');
          break;
        default:
          baseStorylines.push('Political tensions rise', 'Technological breakthrough', 'Diplomatic crisis emerges');
      }
    }
    
    // Add storylines based on villains and threats
    if (config.villains && config.villains.length > 0) {
      baseStorylines.push('Villain network expands', 'Hidden agenda revealed');
    }
    
    // Add storylines based on game mode
    if (config.gameMode.type === 'competitive') {
      baseStorylines.push('Inter-faction rivalry intensifies', 'Resource competition escalates');
    } else if (config.gameMode.type === 'cooperative') {
      baseStorylines.push('Unity against common threat', 'Collaborative breakthrough achieved');
    }
    
    return baseStorylines.slice(0, 5); // Limit to 5 major storylines
  };

  // Generate graphics options
  const generateGraphicsOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/campaign/generate-graphics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: config.selectedScenario || config.aiGeneratedScenario })
      });
      
      if (!response.ok) throw new Error('Failed to generate graphics');
      
      const options = await response.json();
      updateConfig({ graphicsOptions: options });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate estimated cost
  const calculateCost = () => {
    let baseCost = 10; // Base campaign cost
    baseCost += config.campaignDurationWeeks * 2; // Duration cost
    baseCost += config.weeklySessionHours * 1.5; // Session length cost
    baseCost += config.playerCount * 0.5; // Player count cost
    
    // AI model multiplier
    const aiMultiplier = config.gameMasterPersonality.style === 'narrative' ? 1.5 : 1.2;
    
    return Math.round(baseCost * aiMultiplier);
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.name.trim() !== '';
      case 1: return config.scenarioType !== 'default' || config.selectedScenario;
      case 2: return config.selectedGraphics;
      case 3: return config.villains.length > 0;
      case 4: return true; // Game settings have defaults
      case 5: return config.sessionTimes.length > 0;
      case 6: return true; // Difficulty has defaults
      default: return true;
    }
  };

  // Update estimated cost when config changes
  useEffect(() => {
    updateConfig({ estimatedCost: calculateCost() });
  }, [config.campaignDurationWeeks, config.weeklySessionHours, config.playerCount, config.gameMasterPersonality]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep config={config} updateConfig={updateConfig} />;
      case 1:
        return <ScenarioSelectionStep config={config} updateConfig={updateConfig} onGenerateAI={generateAIScenario} loading={loading} />;
      case 2:
        return <GraphicsThemeStep config={config} updateConfig={updateConfig} onGenerate={generateGraphicsOptions} loading={loading} />;
      case 3:
        return <VillainsThreatsStep config={config} updateConfig={updateConfig} />;
      case 4:
        return <EnhancedVillainsStep config={config} updateConfig={updateConfig} loading={loading} />;
      case 5:
        return <GameSettingsStep config={config} updateConfig={updateConfig} />;
      case 6:
        return <StoryPacingStep config={config} updateConfig={updateConfig} />;
      case 7:
        return <SchedulingStep config={config} updateConfig={updateConfig} />;
      case 8:
        return <DifficultyRequirementsStep config={config} updateConfig={updateConfig} />;
      case 9:
        return <ReviewCreateStep config={config} onComplete={() => onComplete(config)} />;
      default:
        return null;
    }
  };

  return (
    <div className="campaign-wizard">
      <div className="wizard-header">
        <h1>🎮 Campaign Setup Wizard</h1>
        <div className="progress-bar">
          {WIZARD_STEPS.map((step, index) => (
            <div 
              key={step}
              className={`progress-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-name">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-content">
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        
        {renderStep()}
      </div>

      <div className="wizard-footer">
        <button 
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        
        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button 
              onClick={prevStep}
              className="btn-secondary"
            >
              ← Previous
            </button>
          )}
          
          {currentStep < WIZARD_STEPS.length - 1 ? (
            <button 
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn-primary"
            >
              Next →
            </button>
          ) : (
            <button 
              onClick={() => onComplete(config)}
              className="btn-success"
            >
              🚀 Create Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step Components
const BasicInfoStep: React.FC<{ config: CampaignConfig; updateConfig: (updates: Partial<CampaignConfig>) => void }> = ({
  config, updateConfig
}) => (
  <div className="wizard-step">
    <h2>📝 Basic Campaign Information</h2>
    <div className="form-group">
      <label>Campaign Name *</label>
      <input
        type="text"
        value={config.name}
        onChange={(e) => updateConfig({ name: e.target.value })}
        placeholder="Enter a memorable name for your campaign"
        maxLength={50}
      />
    </div>
    
    <div className="form-group">
      <label>Description</label>
      <textarea
        value={config.description}
        onChange={(e) => updateConfig({ description: e.target.value })}
        placeholder="Describe the theme and goals of your campaign"
        rows={4}
        maxLength={500}
      />
    </div>
  </div>
);

const ScenarioSelectionStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
  onGenerateAI: (prompt: string) => void;
  loading: boolean;
}> = ({ config, updateConfig, onGenerateAI, loading }) => {
  const [aiPrompt, setAiPrompt] = useState('');

  return (
    <div className="wizard-step">
      <h2>🎭 Scenario Selection</h2>
      
      <div className="scenario-options">
        <div className="option-tabs">
          <button 
            className={config.scenarioType === 'default' ? 'active' : ''}
            onClick={() => updateConfig({ scenarioType: 'default' })}
          >
            📚 Default Scenarios
          </button>
          <button 
            className={config.scenarioType === 'ai-generated' ? 'active' : ''}
            onClick={() => updateConfig({ scenarioType: 'ai-generated' })}
          >
            🤖 AI Generated
          </button>
          <button 
            className={config.scenarioType === 'custom' ? 'active' : ''}
            onClick={() => updateConfig({ scenarioType: 'custom' })}
          >
            ✏️ Custom
          </button>
        </div>

        {config.scenarioType === 'default' && (
          <div className="default-scenarios">
            {DEFAULT_SCENARIOS.map(scenario => (
              <div 
                key={scenario.id}
                className={`scenario-card ${config.selectedScenario?.id === scenario.id ? 'selected' : ''}`}
                onClick={() => updateConfig({ selectedScenario: scenario })}
              >
                <h3>{scenario.name}</h3>
                <p className="scenario-theme">{scenario.theme} • {scenario.difficulty}</p>
                <p className="scenario-description">{scenario.description}</p>
                <div className="scenario-details">
                  <span>⏱️ {scenario.estimatedDuration}</span>
                  <span>👥 {scenario.playerCount.min}-{scenario.playerCount.max} players</span>
                </div>
                <p className="scenario-preview">{scenario.preview}</p>
              </div>
            ))}
          </div>
        )}

        {config.scenarioType === 'ai-generated' && (
          <div className="ai-generation">
            <div className="form-group">
              <label>Describe your ideal campaign:</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="I want a campaign about space pirates fighting an evil empire, with lots of ship battles and treasure hunting..."
                rows={4}
              />
            </div>
            <button 
              onClick={() => onGenerateAI(aiPrompt)}
              disabled={loading || !aiPrompt.trim()}
              className="btn-primary"
            >
              {loading ? '🤖 Generating...' : '✨ Generate Scenario'}
            </button>
            
            {config.aiGeneratedScenario && (
              <div className="generated-scenario">
                <h3>Generated Scenario</h3>
                <p>{config.aiGeneratedScenario.generatedContent}</p>
                <div className="scenario-themes">
                  {config.aiGeneratedScenario.themes.map(theme => (
                    <span key={theme} className="theme-tag">{theme}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GraphicsThemeStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
  onGenerate: () => void;
  loading: boolean;
}> = ({ config, updateConfig, onGenerate, loading }) => (
  <div className="wizard-step">
    <h2>🎨 Graphics & Theme</h2>
    
    {config.graphicsOptions.length === 0 ? (
      <div className="generate-graphics">
        <p>Generate custom graphics options based on your selected scenario:</p>
        <button 
          onClick={onGenerate}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? '🎨 Generating...' : '✨ Generate Graphics Options'}
        </button>
      </div>
    ) : (
      <div className="graphics-options">
        {config.graphicsOptions.map(option => (
          <div 
            key={option.id}
            className={`graphics-card ${config.selectedGraphics?.id === option.id ? 'selected' : ''}`}
            onClick={() => updateConfig({ selectedGraphics: option })}
          >
            <div className="graphics-preview">
              <img src={option.preview} alt={option.name} />
            </div>
            <h3>{option.name}</h3>
            <p>{option.theme} • {option.style}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const VillainsThreatsStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
}> = ({ config, updateConfig }) => (
  <div className="wizard-step">
    <h2>👹 Villains & Threats</h2>
    <p>Configure the antagonists that will challenge your players throughout the campaign.</p>
    
    <div className="threat-level">
      <label>Overall Threat Level:</label>
      <select 
        value={config.threatLevel}
        onChange={(e) => updateConfig({ threatLevel: e.target.value as any })}
      >
        <option value="low">🟢 Low - Manageable challenges</option>
        <option value="medium">🟡 Medium - Balanced difficulty</option>
        <option value="high">🟠 High - Serious threats</option>
        <option value="extreme">🔴 Extreme - Overwhelming odds</option>
      </select>
    </div>

    <div className="villain-placeholder">
      <p>🚧 Villain configuration will be integrated with the Dynamic Villain System (Task 19)</p>
      <p>For now, selecting default villains based on threat level...</p>
    </div>
  </div>
);

const GameSettingsStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
}> = ({ config, updateConfig }) => (
  <div className="wizard-step">
    <h2>⚙️ Game Settings</h2>
    
    <div className="settings-grid">
      <div className="form-group">
        <label>Game Mode:</label>
        <select 
          value={config.gameMode.type}
          onChange={(e) => updateConfig({ 
            gameMode: { ...config.gameMode, type: e.target.value as any }
          })}
        >
          <option value="diplomatic">🤝 Diplomatic - Focus on negotiation</option>
          <option value="conquest">⚔️ Conquest - Military expansion</option>
          <option value="exploration">🚀 Exploration - Discovery focused</option>
          <option value="survival">🛡️ Survival - Overcome threats</option>
          <option value="hybrid">🔄 Hybrid - Mixed objectives</option>
        </select>
      </div>

      <div className="form-group">
        <label>Game Master Personality:</label>
        <select 
          value={config.gameMasterPersonality.id}
          onChange={(e) => {
            const personality = GM_PERSONALITIES.find(p => p.id === e.target.value);
            if (personality) updateConfig({ gameMasterPersonality: personality });
          }}
        >
          {GM_PERSONALITIES.map(gm => (
            <option key={gm.id} value={gm.id}>
              {gm.name} - {gm.description}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Map Size:</label>
        <select 
          value={config.mapSize}
          onChange={(e) => updateConfig({ mapSize: e.target.value as any })}
        >
          <option value="small">🔸 Small - Quick games</option>
          <option value="medium">🔹 Medium - Balanced</option>
          <option value="large">🔷 Large - Epic scope</option>
          <option value="massive">💎 Massive - Grand campaigns</option>
        </select>
      </div>

      <div className="form-group">
        <label>Player Count:</label>
        <input
          type="number"
          min="2"
          max="12"
          value={config.playerCount}
          onChange={(e) => updateConfig({ playerCount: parseInt(e.target.value) })}
        />
      </div>

      <div className="form-group">
        <label>AI Player Count:</label>
        <input
          type="number"
          min="0"
          max="8"
          value={config.aiPlayerCount}
          onChange={(e) => updateConfig({ aiPlayerCount: parseInt(e.target.value) })}
        />
      </div>
    </div>
  </div>
);

const SchedulingStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
}> = ({ config, updateConfig }) => {
  const addSession = () => {
    const newSession: ScheduledSession = {
      dayOfWeek: 0,
      startTime: '19:00',
      duration: 3
    };
    updateConfig({ 
      sessionTimes: [...config.sessionTimes, newSession]
    });
  };

  return (
    <div className="wizard-step">
      <h2>📅 Campaign Scheduling</h2>
      
      <div className="scheduling-grid">
        <div className="form-group">
          <label>Campaign Duration (weeks):</label>
          <input
            type="number"
            min="4"
            max="52"
            value={config.campaignDurationWeeks}
            onChange={(e) => updateConfig({ campaignDurationWeeks: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Weekly Session Hours:</label>
          <input
            type="number"
            min="1"
            max="8"
            step="0.5"
            value={config.weeklySessionHours}
            onChange={(e) => updateConfig({ weeklySessionHours: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="session-scheduling">
        <h3>Session Times</h3>
        {config.sessionTimes.length === 0 ? (
          <p>Add at least one session time to continue.</p>
        ) : (
          <div className="session-list">
            {config.sessionTimes.map((session, index) => (
              <div key={index} className="session-item">
                <select 
                  value={session.dayOfWeek}
                  onChange={(e) => {
                    const updated = [...config.sessionTimes];
                    updated[index].dayOfWeek = parseInt(e.target.value);
                    updateConfig({ sessionTimes: updated });
                  }}
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
                <input
                  type="time"
                  value={session.startTime}
                  onChange={(e) => {
                    const updated = [...config.sessionTimes];
                    updated[index].startTime = e.target.value;
                    updateConfig({ sessionTimes: updated });
                  }}
                />
                <span>{session.duration}h</span>
                <button 
                  onClick={() => {
                    const updated = config.sessionTimes.filter((_, i) => i !== index);
                    updateConfig({ sessionTimes: updated });
                  }}
                  className="btn-danger-small"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button onClick={addSession} className="btn-secondary">
          + Add Session Time
        </button>
      </div>
    </div>
  );
};

const EnhancedVillainsStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
  loading: boolean;
}> = ({ config, updateConfig, loading }) => {
  const [generatingVillains, setGeneratingVillains] = useState(false);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);

  const updateVillainConfig = (updates: Partial<CampaignConfig['villainConfiguration']>) => {
    updateConfig({
      villainConfiguration: {
        ...config.villainConfiguration!,
        ...updates
      }
    });
  };

  const generateVillains = async () => {
    setGeneratingVillains(true);
    try {
      const response = await fetch('/api/campaign/generate-villains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignConfig: config,
          villainPreferences: config.villainConfiguration
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateVillainConfig({
          selectedVillains: data.villains,
          generatedScenario: data.scenario
        });
      }
    } catch (error) {
      console.error('Error generating villains:', error);
    } finally {
      setGeneratingVillains(false);
    }
  };

  const villainCategories = [
    { id: 'galactic', name: '🌌 Galactic', description: 'Empire builders, warlords, galactic threats' },
    { id: 'intergalactic', name: '🚀 Intergalactic', description: 'Invaders from other galaxies' },
    { id: 'cosmic', name: '🌠 Cosmic', description: 'Incomprehensible entities from beyond' },
    { id: 'political', name: '🏛️ Political', description: 'Manipulators, corrupt officials, fallen heroes' },
    { id: 'technological', name: '🤖 Technological', description: 'Rogue AIs, tech corporations, cyber threats' }
  ];

  const threatLevelDescriptions = {
    1: '🟢 Minor - Local disruption',
    2: '🟡 Moderate - Regional threat',
    3: '🟠 Major - System-wide danger',
    4: '🔴 Severe - Galactic crisis',
    5: '⚫ Existential - Reality-ending threat'
  };

  return (
    <div className="wizard-step">
      <h2>🦹 Enhanced Villain System</h2>
      <p>Configure sophisticated antagonists with dynamic storylines and customizable threat levels.</p>
      
      <div className="villain-config-grid">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={config.villainConfiguration?.enabled ?? true}
              onChange={(e) => updateVillainConfig({ enabled: e.target.checked })}
            />
            Enable Enhanced Villain System
          </label>
          <small>Generate dynamic antagonists with personalized storylines</small>
        </div>

        {config.villainConfiguration?.enabled && (
          <>
            <div className="form-group">
              <label>Number of Villains:</label>
              <input
                type="range"
                min="1"
                max="5"
                value={config.villainConfiguration?.count || 2}
                onChange={(e) => updateVillainConfig({ count: parseInt(e.target.value) })}
              />
              <span className="range-value">{config.villainConfiguration?.count || 2} villains</span>
              <small>More villains create complex storylines but require more management</small>
            </div>

            <div className="form-group">
              <label>Customization Level:</label>
              <select 
                value={config.villainConfiguration?.customization || 'moderate'}
                onChange={(e) => updateVillainConfig({ customization: e.target.value as any })}
              >
                <option value="minimal">🟢 Minimal - Quick generation</option>
                <option value="moderate">🟡 Moderate - Balanced detail</option>
                <option value="extensive">🔴 Extensive - Maximum customization</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Villain Categories:</label>
              <div className="category-grid">
                {villainCategories.map(category => (
                  <div 
                    key={category.id}
                    className={`category-card ${config.villainConfiguration?.categories.includes(category.id) ? 'selected' : ''}`}
                    onClick={() => {
                      const categories = config.villainConfiguration?.categories || [];
                      const newCategories = categories.includes(category.id)
                        ? categories.filter(c => c !== category.id)
                        : [...categories, category.id];
                      updateVillainConfig({ categories: newCategories });
                    }}
                  >
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Threat Levels:</label>
              <div className="threat-level-grid">
                {[1, 2, 3, 4, 5].map(level => (
                  <div 
                    key={level}
                    className={`threat-level-card ${config.villainConfiguration?.threatLevels.includes(level) ? 'selected' : ''}`}
                    onClick={() => {
                      const levels = config.villainConfiguration?.threatLevels || [];
                      const newLevels = levels.includes(level)
                        ? levels.filter(l => l !== level)
                        : [...levels, level];
                      updateVillainConfig({ threatLevels: newLevels });
                    }}
                  >
                    <div className="threat-level-indicator">
                      {threatLevelDescriptions[level as keyof typeof threatLevelDescriptions]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <button 
                className="generate-villains-btn"
                onClick={generateVillains}
                disabled={generatingVillains || (config.villainConfiguration?.categories.length === 0)}
              >
                {generatingVillains ? '🎭 Generating Villains...' : '🎭 Generate Villains'}
              </button>
            </div>

            {config.villainConfiguration?.selectedVillains?.length > 0 && (
              <div className="generated-villains">
                <h3>🦹 Generated Villains</h3>
                <div className="villains-grid">
                  {config.villainConfiguration.selectedVillains.map((villain: any, index: number) => (
                    <div key={villain.id || index} className="villain-card">
                      <div className="villain-header">
                        <h4>{villain.title || villain.name}</h4>
                        <span className="threat-badge">Threat Level {villain.configuration?.threatLevel || 3}</span>
                      </div>
                      <p className="villain-description">{villain.description}</p>
                      <div className="villain-details">
                        <div className="detail-section">
                          <strong>Category:</strong> {villain.configuration?.archetype?.category || 'Unknown'}
                        </div>
                        <div className="detail-section">
                          <strong>Emergence:</strong> Week {villain.storyIntegration?.emergenceWeek || 1}
                        </div>
                        <div className="detail-section">
                          <strong>Role:</strong> {villain.storyIntegration?.climaxRole || 'Secondary'}
                        </div>
                      </div>
                      <div className="villain-traits">
                        <strong>Traits:</strong> {villain.personalityTraits?.join(', ') || 'Mysterious'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {config.villainConfiguration?.generatedScenario && (
              <div className="threat-scenario">
                <h3>🎯 Threat Scenario</h3>
                <div className="scenario-card">
                  <h4>{config.villainConfiguration.generatedScenario.name}</h4>
                  <p>{config.villainConfiguration.generatedScenario.description}</p>
                  <div className="scenario-details">
                    <div><strong>Complexity:</strong> {config.villainConfiguration.generatedScenario.complexity}</div>
                    <div><strong>Duration:</strong> {config.villainConfiguration.generatedScenario.duration} weeks</div>
                    <div><strong>Themes:</strong> {config.villainConfiguration.generatedScenario.themes?.join(', ')}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const StoryPacingStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
}> = ({ config, updateConfig }) => {
  const updateStoryPacing = (updates: Partial<CampaignConfig['storyPacing']>) => {
    updateConfig({
      storyPacing: {
        ...config.storyPacing!,
        ...updates
      }
    });
  };

  const calculateClimaxWeek = () => {
    const { campaignDurationWeeks } = config;
    const { climaxPosition, customClimaxWeek, celebrationDuration } = config.storyPacing!;
    const maxClimaxWeek = campaignDurationWeeks - celebrationDuration;
    
    switch (climaxPosition) {
      case 'early':
        return Math.floor(campaignDurationWeeks * 0.6);
      case 'middle':
        return Math.floor(campaignDurationWeeks * 0.75);
      case 'late':
        return Math.min(Math.floor(campaignDurationWeeks * 0.85), maxClimaxWeek);
      case 'custom':
        return Math.min(customClimaxWeek || Math.floor(campaignDurationWeeks * 0.75), maxClimaxWeek);
      default:
        return Math.floor(campaignDurationWeeks * 0.75);
    }
  };

  return (
    <div className="wizard-step">
      <h2>📖 Story Arc Pacing</h2>
      <p>Configure how your campaign's story will unfold over time for maximum dramatic impact.</p>
      
      <div className="pacing-grid">
        <div className="form-group">
          <label>Climax Timing:</label>
          <select 
            value={config.storyPacing?.climaxPosition || 'middle'}
            onChange={(e) => updateStoryPacing({ climaxPosition: e.target.value as any })}
          >
            <option value="early">🟢 Early (60% through) - Quick resolution</option>
            <option value="middle">🟡 Middle (75% through) - Classic structure</option>
            <option value="late">🟠 Late (85% through) - Extended buildup</option>
            <option value="custom">🔧 Custom - Choose specific week</option>
          </select>
        </div>

        {config.storyPacing?.climaxPosition === 'custom' && (
          <div className="form-group">
            <label>Custom Climax Week:</label>
            <input
              type="number"
              min="3"
              max={config.campaignDurationWeeks - (config.storyPacing?.celebrationDuration || 2)}
              value={config.storyPacing?.customClimaxWeek || Math.floor(config.campaignDurationWeeks * 0.75)}
              onChange={(e) => updateStoryPacing({ customClimaxWeek: parseInt(e.target.value) })}
            />
            <small>Week when the main climax occurs</small>
          </div>
        )}

        <div className="form-group">
          <label>Intensity Profile:</label>
          <select 
            value={config.storyPacing?.intensityProfile || 'gradual'}
            onChange={(e) => updateStoryPacing({ intensityProfile: e.target.value as any })}
          >
            <option value="gradual">📈 Gradual - Steady buildup</option>
            <option value="steep">⛰️ Steep - Rapid escalation</option>
            <option value="plateau">🏔️ Plateau - Sustained tension</option>
            <option value="multiple_peaks">🎢 Multiple Peaks - Roller coaster</option>
          </select>
        </div>

        <div className="form-group">
          <label>Event Density:</label>
          <select 
            value={config.storyPacing?.eventDensity || 'moderate'}
            onChange={(e) => updateStoryPacing({ eventDensity: e.target.value as any })}
          >
            <option value="sparse">🟢 Sparse - Relaxed pacing</option>
            <option value="moderate">🟡 Moderate - Balanced events</option>
            <option value="dense">🔴 Dense - Action-packed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Celebration Duration:</label>
          <input
            type="number"
            min="1"
            max="4"
            value={config.storyPacing?.celebrationDuration || 2}
            onChange={(e) => updateStoryPacing({ celebrationDuration: parseInt(e.target.value) })}
          />
          <small>Weeks of celebration/resolution after climax</small>
        </div>

        <div className="form-group">
          <label>Villain Presence:</label>
          <select 
            value={config.storyPacing?.villainPresence || 'moderate'}
            onChange={(e) => updateStoryPacing({ villainPresence: e.target.value as any })}
          >
            <option value="minimal">🟢 Minimal - Background threat</option>
            <option value="moderate">🟡 Moderate - Regular encounters</option>
            <option value="heavy">🔴 Heavy - Constant pressure</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={config.storyPacing?.allowPlayerChoice ?? true}
              onChange={(e) => updateStoryPacing({ allowPlayerChoice: e.target.checked })}
            />
            Include player choice points throughout the story
          </label>
        </div>
      </div>

      <div className="pacing-preview">
        <h3>📊 Story Arc Preview</h3>
        <div className="preview-info">
          <p><strong>Climax Week:</strong> {calculateClimaxWeek()} of {config.campaignDurationWeeks}</p>
          <p><strong>Story Structure:</strong> {config.storyPacing?.intensityProfile} intensity with {config.storyPacing?.eventDensity} event density</p>
          <p><strong>Celebration Period:</strong> {config.storyPacing?.celebrationDuration} weeks of resolution and celebration</p>
          <p><strong>Player Agency:</strong> {config.storyPacing?.allowPlayerChoice ? 'High' : 'Low'} - {config.storyPacing?.allowPlayerChoice ? 'Multiple decision points' : 'Guided narrative'}</p>
        </div>
        
        <div className="intensity-visualization">
          <div className="intensity-bar">
            {Array.from({ length: config.campaignDurationWeeks }, (_, i) => {
              const week = i + 1;
              const climaxWeek = calculateClimaxWeek();
              let intensity = 2;
              
              if (week <= climaxWeek) {
                intensity = 2 + (week / climaxWeek) * 6;
              } else {
                intensity = Math.max(1, 8 - ((week - climaxWeek) / (config.campaignDurationWeeks - climaxWeek)) * 6);
              }
              
              if (week === climaxWeek) intensity = 10;
              
              return (
                <div 
                  key={week}
                  className="intensity-week"
                  style={{ 
                    height: `${intensity * 10}%`,
                    backgroundColor: week === climaxWeek ? '#e74c3c' : week <= climaxWeek ? '#3498db' : '#2ecc71'
                  }}
                  title={`Week ${week}: Intensity ${Math.round(intensity)}`}
                />
              );
            })}
          </div>
          <div className="intensity-labels">
            <span>Introduction</span>
            <span>Rising Action</span>
            <span>Climax</span>
            <span>Resolution</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DifficultyRequirementsStep: React.FC<{
  config: CampaignConfig;
  updateConfig: (updates: Partial<CampaignConfig>) => void;
}> = ({ config, updateConfig }) => {
  // Auto-set rank requirements based on difficulty
  const handleDifficultyChange = (difficulty: string) => {
    const updates: Partial<CampaignConfig> = { difficulty: difficulty as any };
    
    // Set appropriate rank ranges for each difficulty
    switch (difficulty) {
      case 'beginner':
        updates.minimumRank = 0;
        updates.maximumRank = 25; // Cap for beginners
        break;
      case 'intermediate':
        updates.minimumRank = 10;
        updates.maximumRank = 75;
        break;
      case 'advanced':
        updates.minimumRank = 50;
        updates.maximumRank = undefined; // No cap
        break;
      case 'expert':
        updates.minimumRank = 80;
        updates.maximumRank = undefined; // No cap
        break;
    }
    
    updateConfig(updates);
  };

  return (
    <div className="wizard-step">
      <h2>🎯 Difficulty & Requirements</h2>
      
      <div className="difficulty-grid">
        <div className="form-group">
          <label>Difficulty Level:</label>
          <select 
            value={config.difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
          >
            <option value="beginner">🟢 Beginner - New players welcome</option>
            <option value="intermediate">🟡 Intermediate - Some experience helpful</option>
            <option value="advanced">🟠 Advanced - Experienced players</option>
            <option value="expert">🔴 Expert - Masters only</option>
          </select>
        </div>

        <div className="form-group">
          <label>Minimum Player Rank:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={config.minimumRank}
            onChange={(e) => updateConfig({ minimumRank: parseInt(e.target.value) })}
          />
          <small>Players must have achieved this rank to join</small>
        </div>

        {(config.difficulty === 'beginner' || config.difficulty === 'intermediate') && (
          <div className="form-group">
            <label>Maximum Player Rank:</label>
            <input
              type="number"
              min={config.minimumRank || 0}
              max="100"
              value={config.maximumRank || ''}
              onChange={(e) => updateConfig({ 
                maximumRank: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              placeholder="No limit"
            />
            <small>Prevents experienced players from dominating beginner games</small>
          </div>
        )}
      </div>

    <div className="difficulty-description">
      <h3>What this means:</h3>
      {config.difficulty === 'beginner' && (
        <div>
          <p>🟢 Forgiving gameplay with helpful hints and lower stakes. Perfect for learning the game.</p>
          <p><strong>Rank Range:</strong> 0-25 (protects new players from experienced veterans)</p>
        </div>
      )}
      {config.difficulty === 'intermediate' && (
        <div>
          <p>🟡 Balanced challenge with moderate consequences for poor decisions. Good for developing skills.</p>
          <p><strong>Rank Range:</strong> 10-75 (mixed experience levels welcome)</p>
        </div>
      )}
      {config.difficulty === 'advanced' && (
        <div>
          <p>🟠 Serious challenges with real consequences. Requires strategic thinking and teamwork.</p>
          <p><strong>Rank Range:</strong> 50+ (experienced players only)</p>
        </div>
      )}
      {config.difficulty === 'expert' && (
        <div>
          <p>🔴 Maximum difficulty with high chance of failure. Only for the most skilled players.</p>
          <p><strong>Rank Range:</strong> 80+ (masters and legends only)</p>
        </div>
      )}
    </div>
  </div>
);

const ReviewCreateStep: React.FC<{
  config: CampaignConfig;
  onComplete: () => void;
}> = ({ config, onComplete }) => (
  <div className="wizard-step">
    <h2>📋 Review & Create Campaign</h2>
    
    <div className="campaign-summary">
      <div className="summary-section">
        <h3>📝 Basic Information</h3>
        <p><strong>Name:</strong> {config.name}</p>
        <p><strong>Description:</strong> {config.description || 'No description provided'}</p>
      </div>

      <div className="summary-section">
        <h3>🎭 Scenario</h3>
        <p><strong>Type:</strong> {config.scenarioType}</p>
        {config.selectedScenario && (
          <p><strong>Scenario:</strong> {config.selectedScenario.name}</p>
        )}
      </div>

      <div className="summary-section">
        <h3>⚙️ Game Settings</h3>
        <p><strong>Mode:</strong> {config.gameMode.type}</p>
        <p><strong>GM Personality:</strong> {config.gameMasterPersonality.name}</p>
        <p><strong>Map Size:</strong> {config.mapSize}</p>
        <p><strong>Players:</strong> {config.playerCount} human, {config.aiPlayerCount} AI</p>
      </div>

      <div className="summary-section">
        <h3>📖 Story Pacing</h3>
        <p><strong>Climax Timing:</strong> {config.storyPacing?.climaxPosition || 'middle'}</p>
        <p><strong>Intensity:</strong> {config.storyPacing?.intensityProfile || 'gradual'}</p>
        <p><strong>Event Density:</strong> {config.storyPacing?.eventDensity || 'moderate'}</p>
        <p><strong>Villain Presence:</strong> {config.storyPacing?.villainPresence || 'moderate'}</p>
      </div>

      <div className="summary-section">
        <h3>📅 Scheduling</h3>
        <p><strong>Duration:</strong> {config.campaignDurationWeeks} weeks</p>
        <p><strong>Session Length:</strong> {config.weeklySessionHours} hours</p>
        <p><strong>Sessions:</strong> {config.sessionTimes.length} scheduled</p>
      </div>

      <div className="summary-section">
        <h3>🎯 Difficulty</h3>
        <p><strong>Level:</strong> {config.difficulty}</p>
        <p><strong>Rank Requirements:</strong> {config.minimumRank}{config.maximumRank ? `-${config.maximumRank}` : '+'}</p>
        {config.maximumRank && (
          <p><small>Protected environment for skill level {config.minimumRank}-{config.maximumRank}</small></p>
        )}
      </div>

      <div className="summary-section pricing">
        <h3>💰 Estimated Cost</h3>
        <p className="cost-amount">${config.estimatedCost}/month</p>
        <p className="cost-details">Based on {config.campaignDurationWeeks} weeks, {config.weeklySessionHours}h/week</p>
      </div>
    </div>

    <div className="create-actions">
      <button 
        onClick={createGameWithStory} 
        className="btn-success-large"
        disabled={creatingGame}
      >
        {creatingGame ? (
          storyInitializing ? '📖 Initializing Story...' : '🔄 Creating Campaign...'
        ) : (
          '🚀 Create Campaign & Initialize Story'
        )}
      </button>
      
      {storyInitializing && (
        <div className="story-init-status">
          <p>🎭 Generating your epic story...</p>
          <p>This may take a few moments as we create characters, plot arcs, and set the stage for your adventure!</p>
        </div>
      )}
    </div>
  </div>
);

export default CampaignWizard;
