# Civilization Memory System Architecture

## 🎯 **Three-Tier Memory Architecture**

### **Tier 1: Database Storage (Perfect Recall)**
- PostgreSQL tables for complete data persistence
- All events, speeches, news, analysis stored permanently

### **Tier 2: Individual Character Memory (Personal Context)**
- Separate Qdrant collections per character: `character_memory_npc_scientist_zara`
- Personal conversations and their own Witter posts

### **Tier 3: Civilization Memory (Shared Context)** *(NEW)*
- Civilization-wide Qdrant collections: `civilization_memory_human_empire_001`
- Shared events, leader speeches, AI analysis, galactic news
- Provides context for Psychology and AI Analysis simulation steps

---

## 🏛️ **Civilization Memory Scope**

### ✅ **Store in Civilization Memory:**

#### 1. **Leader Speeches & Announcements**
- **Presidential addresses**, **Prime Minister speeches**, **Military briefings**
- **Policy announcements**, **War declarations**, **Peace treaties**
- **State of the Union** addresses, **Emergency broadcasts**

#### 2. **Civilization Events**
- **Major technological breakthroughs** affecting the civilization
- **Natural disasters**, **Economic crises**, **Social upheavals**
- **Military victories/defeats**, **Diplomatic successes/failures**
- **Cultural milestones**, **Scientific discoveries**

#### 3. **AI Analysis Outputs**
- **AI Analysis Engine results** from previous simulation steps
- **Economic trend analysis**, **Social stability assessments**
- **Threat analysis**, **Opportunity identification**
- **Predictive insights** and **Strategic recommendations**

#### 4. **Galactic & Civilization News**
- **Inter-civilization diplomatic events**
- **Galactic trade developments**, **Alliance formations**
- **War declarations between civilizations**
- **Major galactic discoveries** or **cosmic events**

#### 5. **System Integration Outputs**
- **Psychology System analysis** of civilization-wide trends
- **Population sentiment shifts** and **Social movements**
- **Economic system outputs** affecting the entire civilization
- **Technology adoption** and **Innovation cascades**

---

## 🏗️ **Implementation Architecture**

### **Civilization Memory Data Models**

```typescript
enum CivilizationMemoryType {
  LEADER_SPEECH = 'leader_speech',
  CIVILIZATION_EVENT = 'civilization_event',
  AI_ANALYSIS_OUTPUT = 'ai_analysis_output',
  GALACTIC_NEWS = 'galactic_news',
  DIPLOMATIC_EVENT = 'diplomatic_event',
  ECONOMIC_REPORT = 'economic_report',
  TECHNOLOGY_BREAKTHROUGH = 'technology_breakthrough',
  SOCIAL_MOVEMENT = 'social_movement',
  MILITARY_EVENT = 'military_event',
  CULTURAL_EVENT = 'cultural_event'
}

interface CivilizationMemoryEntry {
  id: string;
  civilizationId: string;
  campaignId: number;
  type: CivilizationMemoryType;
  title: string;
  content: string;
  embedding: number[];
  timestamp: Date;
  
  metadata: {
    source: string;           // 'ai_analysis_engine', 'leader_speech', 'galactic_news'
    importance: number;       // 1-10 scale
    affectedSystems: string[]; // ['psychology', 'economy', 'military']
    entities: string[];       // People, places, technologies mentioned
    sentiment: 'positive' | 'negative' | 'neutral';
    impact: {
      scope: 'local' | 'regional' | 'civilization' | 'galactic';
      duration: 'immediate' | 'short_term' | 'long_term' | 'permanent';
      intensity: number;      // 1-10 scale
    };
    relatedEvents: string[];  // IDs of related civilization events
    tags: string[];          // Searchable tags
  };
}

interface CivilizationMemoryProfile {
  civilizationId: string;
  campaignId: number;
  
  // Memory statistics
  memoryStats: {
    totalEvents: number;
    totalSpeeches: number;
    totalAnalysis: number;
    totalNews: number;
    averageImportance: number;
    recentSentiment: 'positive' | 'negative' | 'neutral';
    majorThemes: string[];
  };
  
  // Current state derived from memory
  currentContext: {
    recentMajorEvents: CivilizationMemoryEntry[];
    ongoingSituations: string[];
    publicMood: string;
    leadershipStyle: string;
    diplomaticStance: string;
    economicTrend: string;
    militaryPosture: string;
  };
}
```

### **Civilization Memory Service**

```typescript
// src/server/memory/CivilizationMemoryService.ts
export class CivilizationMemoryService {
  
  async initializeCivilizationMemory(civilizationId: string, campaignId: number): Promise<void> {
    // Create civilization-specific vector collection
    const collectionName = `civilization_memory_${civilizationId}`;
    await this.qdrantClient.createCollection(collectionName, {
      vectorSize: 1536,
      distance: 'Cosine'
    });
    
    console.log(`🏛️ Initialized civilization memory for ${civilizationId}`);
  }
  
  async storeLeaderSpeech(
    civilizationId: string, 
    speech: LeaderSpeechData
  ): Promise<void> {
    const collectionName = `civilization_memory_${civilizationId}`;
    
    const embedding = await embeddingService.embedSingle(speech.content);
    
    const memoryEntry: CivilizationMemoryEntry = {
      id: `speech_${speech.id}`,
      civilizationId,
      campaignId: speech.campaignId,
      type: CivilizationMemoryType.LEADER_SPEECH,
      title: speech.title,
      content: speech.content,
      embedding,
      timestamp: speech.timestamp,
      
      metadata: {
        source: 'leader_speech',
        importance: speech.importance || 8, // Speeches are generally important
        affectedSystems: ['psychology', 'population', 'politics'],
        entities: speech.mentionedEntities || [],
        sentiment: speech.sentiment || 'neutral',
        impact: {
          scope: 'civilization',
          duration: speech.isEmergency ? 'immediate' : 'long_term',
          intensity: speech.importance || 8
        },
        relatedEvents: [],
        tags: speech.tags || ['leadership', 'announcement']
      }
    };
    
    await this.qdrantClient.upsert(collectionName, [memoryEntry]);
    
    console.log(`🎤 Stored leader speech in ${civilizationId} memory: ${speech.title}`);
  }
  
  async storeAIAnalysisOutput(
    civilizationId: string,
    analysisOutput: AIAnalysisOutput
  ): Promise<void> {
    const collectionName = `civilization_memory_${civilizationId}`;
    
    const embedding = await embeddingService.embedSingle(analysisOutput.summary);
    
    const memoryEntry: CivilizationMemoryEntry = {
      id: `analysis_${analysisOutput.id}`,
      civilizationId,
      campaignId: analysisOutput.campaignId,
      type: CivilizationMemoryType.AI_ANALYSIS_OUTPUT,
      title: `AI Analysis: ${analysisOutput.analysisType}`,
      content: analysisOutput.summary,
      embedding,
      timestamp: analysisOutput.timestamp,
      
      metadata: {
        source: 'ai_analysis_engine',
        importance: analysisOutput.criticalityScore,
        affectedSystems: analysisOutput.affectedSystems,
        entities: analysisOutput.keyEntities,
        sentiment: analysisOutput.overallSentiment,
        impact: {
          scope: analysisOutput.scope,
          duration: analysisOutput.timeframe,
          intensity: analysisOutput.criticalityScore
        },
        relatedEvents: analysisOutput.relatedEventIds || [],
        tags: ['ai_analysis', analysisOutput.analysisType, ...analysisOutput.categories]
      }
    };
    
    await this.qdrantClient.upsert(collectionName, [memoryEntry]);
    
    console.log(`🤖 Stored AI analysis in ${civilizationId} memory: ${analysisOutput.analysisType}`);
  }
  
  async storeCivilizationEvent(
    civilizationId: string,
    event: CivilizationEventData
  ): Promise<void> {
    const collectionName = `civilization_memory_${civilizationId}`;
    
    const embedding = await embeddingService.embedSingle(event.description);
    
    const memoryEntry: CivilizationMemoryEntry = {
      id: `event_${event.id}`,
      civilizationId,
      campaignId: event.campaignId,
      type: event.eventType as CivilizationMemoryType,
      title: event.title,
      content: event.description,
      embedding,
      timestamp: event.timestamp,
      
      metadata: {
        source: event.source || 'simulation_engine',
        importance: event.importance,
        affectedSystems: event.affectedSystems,
        entities: event.involvedEntities,
        sentiment: event.sentiment,
        impact: event.impact,
        relatedEvents: event.relatedEvents || [],
        tags: event.tags || []
      }
    };
    
    await this.qdrantClient.upsert(collectionName, [memoryEntry]);
    
    console.log(`📰 Stored civilization event in ${civilizationId} memory: ${event.title}`);
  }
  
  async getCivilizationContext(
    civilizationId: string, 
    contextQuery: string,
    systemType?: string
  ): Promise<string> {
    const collectionName = `civilization_memory_${civilizationId}`;
    
    // Search for relevant civilization memories
    const queryEmbedding = await embeddingService.embedSingle(contextQuery);
    
    const searchResults = await this.qdrantClient.search(collectionName, {
      vector: queryEmbedding,
      limit: 15,
      filter: systemType ? { 
        affectedSystems: { contains: systemType }
      } : undefined
    });
    
    const relevantMemories = searchResults.map(result => result.payload as CivilizationMemoryEntry);
    
    // Organize by type and importance
    const speeches = relevantMemories.filter(m => m.type === CivilizationMemoryType.LEADER_SPEECH);
    const aiAnalysis = relevantMemories.filter(m => m.type === CivilizationMemoryType.AI_ANALYSIS_OUTPUT);
    const events = relevantMemories.filter(m => m.type === CivilizationMemoryType.CIVILIZATION_EVENT);
    const news = relevantMemories.filter(m => m.type === CivilizationMemoryType.GALACTIC_NEWS);
    
    return `
Civilization ${civilizationId} Memory Context:

Recent Leader Communications:
${speeches.slice(0, 3).map(s => `- ${s.timestamp.toISOString()}: ${s.title}\n  "${s.content.substring(0, 200)}..."`).join('\n')}

Previous AI Analysis:
${aiAnalysis.slice(0, 3).map(a => `- ${a.timestamp.toISOString()}: ${a.title}\n  Key Finding: ${a.content.substring(0, 150)}...`).join('\n')}

Recent Civilization Events:
${events.slice(0, 5).map(e => `- ${e.timestamp.toISOString()}: ${e.title} (Impact: ${e.metadata.impact.intensity}/10)`).join('\n')}

Galactic Context:
${news.slice(0, 3).map(n => `- ${n.timestamp.toISOString()}: ${n.title}`).join('\n')}

Current Civilization Mood: ${this.analyzeCivilizationMood(relevantMemories)}
Key Ongoing Themes: ${this.extractKeyThemes(relevantMemories).join(', ')}
    `;
  }
  
  private analyzeCivilizationMood(memories: CivilizationMemoryEntry[]): string {
    const recentMemories = memories
      .filter(m => Date.now() - m.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000) // Last 7 days
      .slice(0, 10);
    
    const sentiments = recentMemories.map(m => m.metadata.sentiment);
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    
    if (positiveCount > negativeCount * 1.5) return 'Optimistic';
    if (negativeCount > positiveCount * 1.5) return 'Concerned';
    return 'Cautiously Neutral';
  }
  
  private extractKeyThemes(memories: CivilizationMemoryEntry[]): string[] {
    const allTags = memories.flatMap(m => m.metadata.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  }
}
```

---

## 🔄 **Integration with Simulation Engine**

### **Psychology System Integration**

```typescript
// src/server/psychology/PsychologyEngine.ts (Enhanced)
export class PsychologyEngine {
  
  async analyzePopulationPsychology(
    civilizationId: string, 
    currentGameState: any
  ): Promise<PsychologyAnalysisResult> {
    
    // Get civilization memory context
    const civContext = await civilizationMemoryService.getCivilizationContext(
      civilizationId, 
      'population psychology social sentiment leadership',
      'psychology'
    );
    
    // Enhanced analysis with civilization memory
    const analysis = await this.llmProvider.generateAnalysis({
      context: civContext,
      currentState: currentGameState,
      analysisType: 'population_psychology',
      prompt: `
Analyze the current population psychology considering:
1. Recent leader speeches and their impact on public sentiment
2. Previous AI analysis findings about social trends
3. Major civilization events and their psychological effects
4. Galactic context affecting citizen morale

Civilization Memory Context:
${civContext}

Current Game State:
${JSON.stringify(currentGameState, null, 2)}
      `
    });
    
    // Store this analysis back to civilization memory
    await civilizationMemoryService.storeAIAnalysisOutput(civilizationId, {
      id: `psych_analysis_${Date.now()}`,
      campaignId: currentGameState.campaignId,
      analysisType: 'population_psychology',
      summary: analysis.summary,
      criticalityScore: analysis.criticalityScore,
      affectedSystems: ['population', 'politics', 'economy'],
      keyEntities: analysis.keyEntities,
      overallSentiment: analysis.sentiment,
      scope: 'civilization',
      timeframe: 'short_term',
      categories: ['psychology', 'population', 'sentiment'],
      timestamp: new Date()
    });
    
    return analysis;
  }
}
```

### **AI Analysis Engine Integration**

```typescript
// src/server/ai-analysis/AIAnalysisEngine.ts (Enhanced)
export class AIAnalysisEngine {
  
  async performComprehensiveAnalysis(
    civilizationId: string,
    analysisRequest: AnalysisRequest
  ): Promise<AnalysisResult> {
    
    // Get relevant civilization memory
    const civContext = await civilizationMemoryService.getCivilizationContext(
      civilizationId,
      analysisRequest.focusArea,
      analysisRequest.systemType
    );
    
    // Enhanced analysis with historical context
    const analysis = await this.llmProvider.generateAnalysis({
      context: civContext,
      currentData: analysisRequest.currentData,
      analysisType: analysisRequest.type,
      prompt: `
Perform comprehensive analysis considering:
1. Historical patterns from previous AI analysis
2. Impact of recent leader decisions and speeches
3. Civilization events and their ongoing effects
4. Galactic context and external pressures

Historical Context:
${civContext}

Current Situation:
${JSON.stringify(analysisRequest.currentData, null, 2)}
      `
    });
    
    // Store analysis results in civilization memory
    await civilizationMemoryService.storeAIAnalysisOutput(civilizationId, {
      id: analysis.id,
      campaignId: analysisRequest.campaignId,
      analysisType: analysis.type,
      summary: analysis.summary,
      criticalityScore: analysis.criticalityScore,
      affectedSystems: analysis.affectedSystems,
      keyEntities: analysis.keyEntities,
      overallSentiment: analysis.sentiment,
      scope: analysis.scope,
      timeframe: analysis.timeframe,
      categories: analysis.categories,
      timestamp: new Date()
    });
    
    return analysis;
  }
}
```

---

## 📊 **API Endpoints**

### **Civilization Memory APIs**

```typescript
// GET /api/memory/civilizations/:id/context?query=economic+trends&system=psychology
// Get civilization memory context for specific analysis

// POST /api/memory/civilizations/:id/speeches
// Store leader speech in civilization memory

// POST /api/memory/civilizations/:id/events
// Store civilization event in memory

// POST /api/memory/civilizations/:id/analysis
// Store AI analysis output in civilization memory

// GET /api/memory/civilizations/:id/recent?type=leader_speech&limit=10
// Get recent events of specific type

// GET /api/memory/civilizations/:id/search
// Semantic search through civilization memory

// GET /api/memory/civilizations/:id/profile
// Get civilization memory profile and current context
```

---

## 🎯 **Updated Task 72.5: Character & Civilization Memory Enhancement**

### **Enhanced Scope:**
1. **Individual Character Memory** - Personal conversations and own Witter posts
2. **Civilization Memory** - Shared events, speeches, AI analysis, galactic news
3. **Privacy Protection** - Player communications remain private
4. **Simulation Integration** - Psychology and AI Analysis use civilization memory context
5. **Cross-System Context** - Civilization memory informs all simulation systems

### **Implementation Components:**
- **Three-tier memory architecture** (Database + Character Vectors + Civilization Vectors)
- **Civilization Memory Service** with event classification and storage
- **Enhanced Psychology System** using civilization memory context
- **Enhanced AI Analysis Engine** with historical context awareness
- **Integrated APIs** for civilization memory management

This creates a **comprehensive memory ecosystem** where:
- **Characters** remember personal interactions
- **Civilizations** remember shared history and context  
- **Systems** use appropriate memory context for realistic analysis
- **Privacy** is completely protected for player communications

Ready to implement this enhanced memory architecture!

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
