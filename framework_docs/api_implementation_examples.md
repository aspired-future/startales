# 🛠️ StarTales: API Implementation Examples & Code Snippets

## Table of Contents
1. [Game State Management Examples](#game-state-management-examples)
2. [API Knobs Implementation](#api-knobs-implementation)
3. [AI Prompt Template Usage](#ai-prompt-template-usage)
4. [HUD Component Integration](#hud-component-integration)
5. [WebSocket Real-Time Updates](#websocket-real-time-updates)
6. [Simulation Engine Integration](#simulation-engine-integration)

---

## Game State Management Examples

### Basic Game State Access
```typescript
// Get current game state
const gameState = await fetch('/api/game-state/current')
  .then(res => res.json());

console.log('Current Turn:', gameState.currentTurn);
console.log('Game Phase:', gameState.gamePhase);
console.log('Player Civilization:', gameState.playerCivilization);
```

### Game State Updates
```typescript
// Update game state with new data
const updateGameState = async (updates: Partial<GameStateSnapshot>) => {
  const response = await fetch('/api/game-state/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  
  return response.json();
};

// Example: Update civilization progress
await updateGameState({
  playerCivilization: {
    ...currentState.playerCivilization,
    technology_level: currentState.playerCivilization.technology_level + 1
  }
});
```

### Historical Game State Queries
```typescript
// Get game state history for analysis
const getGameStateHistory = async (startTurn: number, endTurn: number) => {
  const response = await fetch(
    `/api/game-state/history?start=${startTurn}&end=${endTurn}`
  );
  return response.json();
};

// Analyze civilization growth over time
const history = await getGameStateHistory(1, 50);
const populationGrowth = history.map(state => ({
  turn: state.currentTurn,
  population: state.playerCivilization.total_population
}));
```

---

## API Knobs Implementation

### Reading Current Knob Values
```typescript
// Get all current knob settings
const getCurrentKnobs = async () => {
  const response = await fetch('/api/knobs/current');
  return response.json();
};

// Get specific system knobs
const getMissionKnobs = async () => {
  const response = await fetch('/api/knobs/missions');
  return response.json();
};

const knobs = await getMissionKnobs();
console.log('Mission Generation Rate:', knobs.missionGenerationRate);
console.log('Difficulty Scaling:', knobs.difficultyScaling);
```

### Updating Knob Values
```typescript
// Update multiple knobs at once
const updateKnobs = async (knobUpdates: Record<string, number>) => {
  const response = await fetch('/api/knobs/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(knobUpdates)
  });
  return response.json();
};

// Example: Increase mission difficulty and frequency
await updateKnobs({
  missionGenerationRate: 85,
  difficultyScaling: 75,
  emergencyMissionFrequency: 60
});
```

### Knob Presets
```typescript
// Apply predefined knob presets
const applyKnobPreset = async (presetName: string) => {
  const response = await fetch(`/api/knobs/presets/${presetName}`, {
    method: 'POST'
  });
  return response.json();
};

// Apply "high-difficulty" preset
await applyKnobPreset('high-difficulty');

// Apply "story-focused" preset
await applyKnobPreset('story-focused');
```

### Dynamic Knob Adjustment Based on AI Analysis
```typescript
// AI-driven knob optimization
const optimizeKnobsWithAI = async (performanceMetrics: any) => {
  const response = await fetch('/api/ai/optimize-knobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentMetrics: performanceMetrics,
      optimizationGoals: ['player_engagement', 'story_pacing', 'challenge_balance']
    })
  });
  
  const recommendations = await response.json();
  
  // Apply AI recommendations
  if (recommendations.confidence > 0.8) {
    await updateKnobs(recommendations.knobAdjustments);
  }
};
```

---

## AI Prompt Template Usage

### Mission Generation with APT
```typescript
// Generate mission using AI prompt template
const generateMission = async (civilizationId: string) => {
  const gameState = await getCurrentGameState();
  
  const prompt = MISSIONS_AI_PROMPTS.MISSION_GENERATION
    .replace('{civilizationId}', civilizationId)
    .replace('{civilizationProgress}', gameState.playerCivilization.technology_level.toString())
    .replace('{availableResources}', JSON.stringify(gameState.economicSituation))
    .replace('{activeConflicts}', JSON.stringify(gameState.politicalSituation.activeWars))
    .replace('{currentStoryArc}', gameState.currentStoryArc || 'Early Expansion')
    .replace('{recentEvents}', JSON.stringify(gameState.recentEvents));
  
  const response = await fetch('/api/ai/generate-mission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, civilizationId })
  });
  
  return response.json();
};
```

### Financial Analysis with APT
```typescript
// Analyze financial decision using AI
const analyzeFinancialDecision = async (action: FinancialAction) => {
  const marketData = await fetch('/api/economy/market-data').then(r => r.json());
  const characterData = await fetch(`/api/characters/${action.characterId}`).then(r => r.json());
  
  const prompt = buildFinancialAnalysisPrompt({
    marketContext: describeMarketContext(marketData),
    characterContext: describeCharacterFinances(characterData),
    actionContext: describeAction(action)
  });
  
  const response = await fetch('/api/ai/financial-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, action })
  });
  
  return response.json();
};

const buildFinancialAnalysisPrompt = (context: any) => {
  return FINANCIAL_ANALYSIS_APT
    .replace('{marketContext}', context.marketContext)
    .replace('{characterContext}', context.characterContext)
    .replace('{actionContext}', context.actionContext);
};
```

### Institutional Override Analysis
```typescript
// Analyze institutional override scenario
const analyzeInstitutionalOverride = async (overrideData: OverrideScenario) => {
  const prompt = INSTITUTIONAL_OVERRIDE_AI_PROMPTS.OVERRIDE_ANALYSIS
    .replace('{institutionType}', overrideData.institutionType)
    .replace('{decisionTitle}', overrideData.decisionTitle)
    .replace('{overrideType}', overrideData.overrideType)
    .replace('{leaderStanding}', overrideData.leaderStanding.toString());
  
  const response = await fetch('/api/ai/institutional-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      scenario: overrideData,
      analysisType: 'constitutional_impact'
    })
  });
  
  return response.json();
};
```

---

## HUD Component Integration

### Real-Time Metrics Display
```tsx
// Live metrics component with WebSocket updates
const LiveMetricsDisplay: React.FC<{playerId: string}> = ({ playerId }) => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    population: 0,
    gdp: 0,
    militaryStrength: 0,
    researchProjects: 0,
    approval: 0,
    treasury: 0,
    securityLevel: 0,
    threatLevel: 'Low',
    debtToGDP: 0
  });

  useEffect(() => {
    // Initial data fetch
    const fetchMetrics = async () => {
      const response = await fetch(`/api/civilizations/${playerId}/metrics`);
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();

    // WebSocket for real-time updates
    const ws = new WebSocket(`ws://localhost:3001/metrics/${playerId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setMetrics(prev => ({ ...prev, ...update }));
    };

    return () => ws.close();
  }, [playerId]);

  return (
    <div className="live-metrics">
      <div className="metric">
        <span className="label">Population:</span>
        <span className="value">{metrics.population.toLocaleString()}</span>
      </div>
      <div className="metric">
        <span className="label">GDP:</span>
        <span className="value">${metrics.gdp.toLocaleString()}</span>
      </div>
      <div className="metric">
        <span className="label">Approval:</span>
        <span className="value">{metrics.approval}%</span>
      </div>
      <div className="metric">
        <span className="label">Threat Level:</span>
        <span className={`value threat-${metrics.threatLevel.toLowerCase()}`}>
          {metrics.threatLevel}
        </span>
      </div>
    </div>
  );
};
```

### Dynamic Screen Rendering
```tsx
// Screen factory for dynamic HUD panels
const ScreenFactory: React.FC<{screenType: string, props: any}> = ({ screenType, props }) => {
  const renderScreen = () => {
    switch (screenType) {
      case 'cabinet-management':
        return <CabinetManagementScreen {...props} />;
      case 'military-command':
        return <MilitaryCommandScreen {...props} />;
      case 'treasury-finance':
        return <TreasuryFinanceScreen {...props} />;
      case 'missions':
        return <MissionsScreen {...props} />;
      case 'galaxy-map':
        return <GalaxyMapComponent {...props} />;
      case 'witter-feed':
        return <SimpleWitterFeed {...props} />;
      case 'whoseapp':
        return <WhoseAppMain {...props} />;
      default:
        return <div>Screen not found: {screenType}</div>;
    }
  };

  return (
    <div className="dynamic-screen">
      {renderScreen()}
    </div>
  );
};
```

### Interactive Galaxy Map
```tsx
// Galaxy map with real-time exploration data
const InteractiveGalaxyMap: React.FC<{playerId: string}> = ({ playerId }) => {
  const [galaxyData, setGalaxyData] = useState<GalaxyData | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalaxyData = async () => {
      const response = await fetch(`/api/galaxy/map?playerId=${playerId}`);
      const data = await response.json();
      setGalaxyData(data);
    };

    fetchGalaxyData();
  }, [playerId]);

  const handleSystemClick = async (systemId: string) => {
    setSelectedSystem(systemId);
    
    // Fetch detailed system information
    const response = await fetch(`/api/galaxy/systems/${systemId}`);
    const systemData = await response.json();
    
    // Update UI with system details
    // ... handle system details display
  };

  const handleExploreSystem = async (systemId: string) => {
    const response = await fetch('/api/galaxy/explore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemId, playerId })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Update galaxy data with exploration results
      setGalaxyData(prev => ({
        ...prev,
        systems: prev.systems.map(system => 
          system.id === systemId 
            ? { ...system, explored: true, ...result.discoveredData }
            : system
        )
      }));
    }
  };

  return (
    <div className="galaxy-map">
      <svg viewBox="0 0 1000 1000" className="galaxy-svg">
        {galaxyData?.systems.map(system => (
          <g key={system.id}>
            <circle
              cx={system.x}
              cy={system.y}
              r={system.size}
              fill={system.explored ? '#4CAF50' : '#FFC107'}
              onClick={() => handleSystemClick(system.id)}
              className="system-node"
            />
            <text
              x={system.x}
              y={system.y + system.size + 15}
              textAnchor="middle"
              className="system-label"
            >
              {system.name}
            </text>
          </g>
        ))}
      </svg>
      
      {selectedSystem && (
        <div className="system-details">
          <h3>System Details</h3>
          <button onClick={() => handleExploreSystem(selectedSystem)}>
            Explore System
          </button>
        </div>
      )}
    </div>
  );
};
```

---

## WebSocket Real-Time Updates

### WhoseApp WebSocket Integration
```typescript
// WhoseApp WebSocket hook for real-time communication
export const useWhoseAppWebSocket = (config: {
  civilizationId: string;
  autoConnect: boolean;
}) => {
  const [data, setData] = useState({
    messages: [],
    players: [],
    conversations: [],
    connectionStatus: 'disconnected' as const
  });

  useEffect(() => {
    if (!config.autoConnect) return;

    const ws = new WebSocket(`ws://localhost:3001/whoseapp/${config.civilizationId}`);
    
    ws.onopen = () => {
      setData(prev => ({ ...prev, connectionStatus: 'connected' }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'new_message':
          setData(prev => ({
            ...prev,
            messages: [...prev.messages, message.payload]
          }));
          break;
          
        case 'player_update':
          setData(prev => ({
            ...prev,
            players: prev.players.map(player => 
              player.id === message.payload.id 
                ? { ...player, ...message.payload }
                : player
            )
          }));
          break;
          
        case 'conversation_update':
          setData(prev => ({
            ...prev,
            conversations: prev.conversations.map(conv =>
              conv.id === message.payload.id
                ? { ...conv, ...message.payload }
                : conv
            )
          }));
          break;
      }
    };

    ws.onclose = () => {
      setData(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    };

    return () => ws.close();
  }, [config.civilizationId, config.autoConnect]);

  return data;
};
```

### Game State WebSocket Updates
```typescript
// Game state WebSocket for live simulation updates
class GameStateWebSocket {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(playerId: string) {
    this.ws = new WebSocket(`ws://localhost:3001/gamestate/${playerId}`);
    
    this.ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      this.notifyListeners(update.type, update.payload);
    };
  }

  subscribe(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  private notifyListeners(eventType: string, payload: any) {
    const callbacks = this.listeners.get(eventType) || [];
    callbacks.forEach(callback => callback(payload));
  }

  sendAction(action: GameAction) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'player_action',
        payload: action
      }));
    }
  }
}

// Usage example
const gameStateWS = new GameStateWebSocket();
gameStateWS.connect('player123');

gameStateWS.subscribe('civilization_update', (update) => {
  console.log('Civilization updated:', update);
});

gameStateWS.subscribe('mission_complete', (mission) => {
  console.log('Mission completed:', mission);
});
```

---

## Simulation Engine Integration

### Tick-Based Simulation
```typescript
// Simulation engine tick processing
class SimulationEngine {
  private tickRate = 120000; // 2 minutes
  private isRunning = false;
  private currentTick = 0;

  start() {
    this.isRunning = true;
    this.processTick();
  }

  private async processTick() {
    if (!this.isRunning) return;

    console.log(`Processing tick ${this.currentTick}`);
    
    try {
      // 1. Process queued actions
      await this.processActionQueue();
      
      // 2. Update simulation state
      await this.updateSimulationState();
      
      // 3. Generate AI analysis
      await this.generateAIAnalysis();
      
      // 4. Trigger events
      await this.processEvents();
      
      // 5. Update clients
      await this.broadcastUpdates();
      
      this.currentTick++;
      
    } catch (error) {
      console.error('Tick processing error:', error);
    }

    // Schedule next tick
    setTimeout(() => this.processTick(), this.tickRate);
  }

  private async processActionQueue() {
    const actions = await this.getQueuedActions();
    
    for (const action of actions) {
      await this.processAction(action);
    }
  }

  private async updateSimulationState() {
    // Update civilization states
    const civilizations = await this.getAllCivilizations();
    
    for (const civ of civilizations) {
      await this.updateCivilizationState(civ);
    }
    
    // Update galaxy state
    await this.updateGalaxyState();
    
    // Update economic systems
    await this.updateEconomicSystems();
  }

  private async generateAIAnalysis() {
    const gameState = await this.getCurrentGameState();
    
    // Generate AI insights for each civilization
    const civilizations = await this.getAllCivilizations();
    
    for (const civ of civilizations) {
      const analysis = await this.aiAnalysisEngine.analyze({
        civilization: civ,
        gameState: gameState,
        tick: this.currentTick
      });
      
      await this.storeAIAnalysis(civ.id, analysis);
    }
  }
}
```

### AI-Driven Knob Adjustment
```typescript
// Automatic knob adjustment based on AI analysis
class AIKnobManager {
  async adjustKnobsBasedOnPerformance(performanceData: PerformanceMetrics) {
    const analysis = await this.analyzePerformance(performanceData);
    
    if (analysis.playerEngagement < 0.6) {
      // Increase mission frequency and rewards
      await this.updateKnobs({
        missionGenerationRate: Math.min(100, analysis.currentKnobs.missionGenerationRate + 15),
        rewardGenerosity: Math.min(100, analysis.currentKnobs.rewardGenerosity + 10)
      });
    }
    
    if (analysis.difficultyBalance > 0.8) {
      // Game is too easy, increase challenge
      await this.updateKnobs({
        difficultyScaling: Math.min(100, analysis.currentKnobs.difficultyScaling + 10),
        competitionIntensity: Math.min(100, analysis.currentKnobs.competitionIntensity + 5)
      });
    }
    
    if (analysis.storyPacing < 0.5) {
      // Story is moving too slowly
      await this.updateKnobs({
        storyPacing: Math.min(100, analysis.currentKnobs.storyPacing + 20),
        narrativeBranching: Math.min(100, analysis.currentKnobs.narrativeBranching + 10)
      });
    }
  }

  private async analyzePerformance(data: PerformanceMetrics): Promise<PerformanceAnalysis> {
    const response = await fetch('/api/ai/analyze-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return response.json();
  }
}
```

### Memory System Integration
```typescript
// Game memory system for AI context
class GameMemorySystem {
  private memories: Map<string, GameMemory[]> = new Map();

  addMemory(playerId: string, memory: GameMemory) {
    if (!this.memories.has(playerId)) {
      this.memories.set(playerId, []);
    }
    
    this.memories.get(playerId)!.push({
      ...memory,
      timestamp: new Date(),
      id: this.generateMemoryId()
    });
    
    // Limit memory size
    const playerMemories = this.memories.get(playerId)!;
    if (playerMemories.length > 1000) {
      this.memories.set(playerId, playerMemories.slice(-1000));
    }
  }

  getRecentMemories(playerId: string, count: number = 50): GameMemory[] {
    const playerMemories = this.memories.get(playerId) || [];
    return playerMemories.slice(-count);
  }

  getMemoriesByType(playerId: string, type: string): GameMemory[] {
    const playerMemories = this.memories.get(playerId) || [];
    return playerMemories.filter(memory => memory.type === type);
  }

  async generateContextForAI(playerId: string): Promise<string> {
    const recentMemories = this.getRecentMemories(playerId, 20);
    
    const context = recentMemories.map(memory => 
      `${memory.timestamp.toISOString()}: ${memory.description}`
    ).join('\n');
    
    return `Recent game context:\n${context}`;
  }
}

interface GameMemory {
  id: string;
  type: 'action' | 'event' | 'decision' | 'outcome';
  description: string;
  importance: number; // 1-10
  timestamp: Date;
  relatedEntities: string[];
}
```

This implementation guide provides concrete examples of how all the documented systems work together to create the comprehensive StarTales galactic civilization simulator. Each component integrates seamlessly with the others to provide a rich, AI-enhanced gaming experience.
