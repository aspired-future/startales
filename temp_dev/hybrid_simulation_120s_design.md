# Hybrid Simulation Engine - 120 Second Strategic Ticks

## 🎯 **Design Overview**

The Hybrid Simulation Engine combines deterministic economic/military calculations with AI-powered natural language analysis, running on **120-second (2-minute) strategic tick intervals** perfect for civilization-level gameplay.

## ⚡ **Core Architecture**

### **Tick Processing Flow**
```typescript
interface StrategicTick {
  tickId: number;
  campaignId: number;
  timestamp: Date;
  interval: 120000; // 120 seconds
  seed: string;
  playerActions: PlayerAction[];
  
  // Processing phases
  deterministicPhase: DeterministicResults;
  naturalLanguagePhase: NaturalLanguageResults;
  hybridIntegration: HybridResults;
  memoryUpdates: MemoryUpdate[];
}

class HybridSimulationEngine {
  private tickInterval = 120000; // 2 minutes
  private campaigns = new Map<number, CampaignTicker>();
  
  async processTick(campaignId: number): Promise<StrategicTick> {
    const campaign = await this.loadCampaign(campaignId);
    
    // Phase 1: Deterministic Processing (existing engine)
    const deterministicResults = await this.runDeterministicPhase(campaign);
    
    // Phase 2: Natural Language Analysis (new AI layer)
    const nlResults = await this.runNaturalLanguagePhase(campaign, deterministicResults);
    
    // Phase 3: Hybrid Integration (bidirectional influence)
    const hybridResults = await this.integrateHybridEffects(deterministicResults, nlResults);
    
    // Phase 4: Memory & Persistence
    await this.updateMemorySystems(campaign, hybridResults);
    await this.persistResults(campaign, hybridResults);
    
    return hybridResults;
  }
}
```

### **Phase 1: Deterministic Processing**
Uses the existing simulation engine from `src/server/sim/engine.ts`:
- **Production Reducer**: Resource generation from buildings
- **Queue Reducer**: Building/research completion
- **Logistics Reducer**: Trade routes and capacity
- **Price Reducer**: Market dynamics and pricing
- **Policy Reducer**: Government policy effects
- **KPI Reducer**: Analytics and metrics

### **Phase 2: Natural Language Analysis**
New AI-powered analysis layer:
```typescript
interface NaturalLanguageAnalysis {
  // Population sentiment analysis
  populationMood: {
    overall: 'ecstatic' | 'happy' | 'content' | 'concerned' | 'angry' | 'rebellious';
    factors: string[];
    witterSentiment: SentimentAnalysis;
  };
  
  // Economic narrative
  economicStory: {
    summary: string;
    trends: EconomicTrend[];
    predictions: string[];
    concerns: string[];
  };
  
  // Military assessment
  militaryStatus: {
    readiness: string;
    morale: string;
    threats: ThreatAssessment[];
    opportunities: string[];
  };
  
  // Diplomatic context
  diplomaticSituation: {
    relationships: RelationshipAnalysis[];
    negotiations: string[];
    tensions: string[];
  };
  
  // Technology progress
  researchNarrative: {
    breakthroughs: string[];
    setbacks: string[];
    innovations: Innovation[];
  };
}

class NaturalLanguageProcessor {
  async analyzeGameState(
    campaign: CampaignState,
    deterministicResults: DeterministicResults,
    civilizationMemory: CivilizationMemory
  ): Promise<NaturalLanguageAnalysis> {
    
    // Analyze Witter feed sentiment
    const witterAnalysis = await this.analyzeWitterSentiment(campaign.wittPosts);
    
    // Economic narrative generation
    const economicStory = await this.generateEconomicNarrative(
      deterministicResults.economic,
      civilizationMemory.economicHistory
    );
    
    // Military situation assessment
    const militaryStatus = await this.assessMilitarySituation(
      deterministicResults.military,
      civilizationMemory.militaryEvents
    );
    
    // Combine all analyses
    return {
      populationMood: this.synthesizePopulationMood(witterAnalysis, economicStory),
      economicStory,
      militaryStatus,
      diplomaticSituation: await this.analyzeDiplomacy(campaign),
      researchNarrative: await this.analyzeResearch(deterministicResults.research)
    };
  }
}
```

### **Phase 3: Hybrid Integration**
Bidirectional influence between deterministic and natural language:
```typescript
interface HybridEffects {
  // Natural language affects deterministic calculations
  sentimentModifiers: {
    productionEfficiency: number; // -0.2 to +0.2
    researchSpeed: number;        // -0.3 to +0.3
    militaryMorale: number;       // -0.4 to +0.4
    taxCompliance: number;        // -0.5 to +0.5
  };
  
  // Deterministic results inform natural language
  narrativeContext: {
    economicTrends: string[];
    militaryEvents: string[];
    researchBreakthroughs: string[];
    populationEvents: string[];
  };
  
  // Cross-system effects
  emergentEvents: EmergentEvent[];
  policyRecommendations: PolicyRecommendation[];
  crisisAlerts: CrisisAlert[];
}

class HybridIntegrator {
  async integrateEffects(
    deterministic: DeterministicResults,
    naturalLanguage: NaturalLanguageAnalysis
  ): Promise<HybridEffects> {
    
    // Calculate sentiment-based modifiers
    const sentimentModifiers = this.calculateSentimentModifiers(
      naturalLanguage.populationMood,
      naturalLanguage.economicStory
    );
    
    // Apply modifiers to deterministic results
    const modifiedResults = this.applyModifiers(deterministic, sentimentModifiers);
    
    // Generate narrative context from modified results
    const narrativeContext = this.generateNarrativeContext(modifiedResults);
    
    // Detect emergent events and crises
    const emergentEvents = await this.detectEmergentEvents(
      modifiedResults,
      naturalLanguage
    );
    
    return {
      sentimentModifiers,
      narrativeContext,
      emergentEvents,
      policyRecommendations: await this.generatePolicyRecommendations(modifiedResults),
      crisisAlerts: this.detectCrises(modifiedResults, naturalLanguage)
    };
  }
}
```

## 🎮 **Strategic Gameplay Benefits**

### **Perfect Pacing for Civilization Games**
- **2-minute intervals**: Time to analyze results and plan next moves
- **Strategic depth**: Rich analysis between ticks provides meaningful insights
- **Decision windows**: Players can queue actions and policies between ticks
- **Anticipation**: Waiting for next tick creates strategic tension

### **Rich AI Analysis Per Tick**
With 120-second intervals, each tick can include:
- **Comprehensive sentiment analysis** of all Witter posts
- **Deep economic narrative** generation with historical context
- **Military situation assessment** with threat analysis
- **Diplomatic relationship** evaluation and trend prediction
- **Research progress** analysis with breakthrough detection

### **Player Engagement Model**
```typescript
interface PlayerEngagement {
  // Immediate responses (0-100ms)
  uiInteractions: {
    buttonClicks: 'immediate';
    menuNavigation: 'immediate';
    dataVisualization: 'immediate';
  };
  
  // Action queuing (immediate confirmation, tick execution)
  actionQueue: {
    policyChanges: 'queue_for_next_tick';
    buildingOrders: 'queue_for_next_tick';
    researchDirectives: 'queue_for_next_tick';
    militaryCommands: 'queue_for_next_tick';
  };
  
  // Strategic updates (every 120 seconds)
  simulationUpdates: {
    economicResults: 'tick_based';
    populationChanges: 'tick_based';
    militaryDevelopments: 'tick_based';
    researchProgress: 'tick_based';
    narrativeAnalysis: 'tick_based';
  };
}
```

## 🔄 **Memory Integration**

### **Character Memory Updates**
Every tick, update character memories with:
- **New Witter posts** from the tick period
- **Conversation summaries** from player interactions
- **Event participation** in civilization events

### **Civilization Memory Updates**
Every tick, add to civilization memory:
- **Tick summary** with key developments
- **AI analysis results** for future context
- **Policy changes** and their effects
- **Major events** and milestones

### **Cross-Memory Intelligence**
Use both character and civilization memories to:
- **Inform AI analysis** with historical context
- **Generate richer narratives** based on past events
- **Detect long-term trends** across multiple ticks
- **Provide strategic insights** for players

## 📊 **Performance Characteristics**

### **Resource Usage (120-Second Ticks)**
- **Database writes**: 0.5 per minute (vs 600 at 10Hz)
- **AI API calls**: 1-3 per tick (concentrated, high-value analysis)
- **CPU usage**: Intensive processing every 2 minutes, idle between
- **Memory**: Efficient caching between ticks

### **Scalability Projections**
- **100+ concurrent campaigns**: Each campaign processes independently
- **1000+ players**: Multiple players per campaign, shared tick processing
- **Cloud costs**: 95%+ reduction vs high-frequency ticking
- **Response times**: <200ms for player actions, 2-minute strategic updates

## 🚀 **Implementation Strategy**

### **Week 1: Core Hybrid Engine**
1. **Extend existing simulation engine** with natural language phase
2. **Implement tick scheduler** with 120-second intervals
3. **Create hybrid integration layer** for bidirectional effects
4. **Add memory integration** hooks

### **Week 2: Natural Language Processing**
1. **Implement sentiment analysis** for Witter feeds
2. **Create economic narrative** generation
3. **Build military assessment** system
4. **Add diplomatic analysis** capabilities

### **Week 3: Player Experience**
1. **Implement action queuing** system
2. **Create tick countdown** UI elements
3. **Build strategic dashboard** for tick results
4. **Add notification system** for important events

### **Week 4: Testing & Optimization**
1. **Performance testing** with multiple campaigns
2. **AI analysis quality** evaluation and tuning
3. **Player experience** testing and refinement
4. **Memory system** optimization and validation

## 🎯 **Success Metrics**

### **Performance Targets**
- **Tick processing time**: <30 seconds per tick
- **Database response**: <5 seconds for state persistence
- **AI analysis quality**: >80% relevance score
- **Memory integration**: <10 seconds for updates

### **Player Experience Goals**
- **Strategic engagement**: Players actively plan between ticks
- **Narrative immersion**: AI analysis enhances story understanding
- **Decision quality**: Rich information improves strategic choices
- **Long-term retention**: Sustainable gameplay pace for extended sessions

This 120-second hybrid simulation engine provides the perfect balance of strategic depth, performance efficiency, and engaging gameplay for a civilization-level strategy game.
