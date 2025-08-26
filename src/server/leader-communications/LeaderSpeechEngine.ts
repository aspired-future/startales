/**
 * Leader Speech Engine
 * 
 * AI-powered speech generation system that creates leader speeches and
 * calculates their impact on simulation outcomes and public sentiment.
 */

import { 
  LeaderSpeech, 
  SpeechRequest, 
  SpeechType,
  SpeechAudience,
  SpeechImpact,
  SimulationEffect,
  NaturalLanguageEffect
} from './types.js';
import { LLMProvider, SimpleLLMProvider } from '../providers/LLMProvider.js';
import { vectorMemory } from '../storage/VectorMemory.js';
import { db } from '../storage/db.js';
import { nanoid } from 'nanoid';

export class LeaderSpeechEngine {
  private llmProvider: LLMProvider;

  constructor() {
    this.llmProvider = new SimpleLLMProvider();
  }

  /**
   * Generate a leader speech with simulation impact analysis
   */
  async generateSpeech(request: SpeechRequest): Promise<LeaderSpeech> {
    const startTime = Date.now();

    try {
      // 1. Gather context for speech generation
      const context = await this.gatherSpeechContext(request);
      
      // 2. Generate speech content
      const speechContent = await this.generateSpeechContent(request, context);
      
      // 3. Analyze expected impact
      const expectedImpact = await this.analyzeExpectedImpact(speechContent, request, context);
      
      // 4. Generate simulation effects
      const simulationEffects = await this.generateSimulationEffects(speechContent, expectedImpact, request);
      
      // 5. Estimate public reaction
      const publicReaction = await this.estimatePublicReaction(speechContent, request, context);

      const generationTime = Date.now() - startTime;

      const speech: LeaderSpeech = {
        id: nanoid(),
        type: request.type,
        title: speechContent.title,
        content: speechContent.content,
        summary: speechContent.summary,
        
        campaignId: request.campaignId,
        tickId: request.tickId,
        leaderCharacterId: request.leaderCharacterId,
        
        audience: request.audience,
        venue: request.occasion || 'Government House',
        occasion: request.occasion || 'Official Address',
        
        tone: this.determineSpeechTone(request, speechContent),
        duration: this.estimateDuration(speechContent.content),
        keyMessages: speechContent.keyMessages,
        deliveryMode: request.deliveryMode || 'avatar',
        
        expectedImpact,
        simulationEffects,
        publicReaction,
        
        generationContext: {
          aiModel: 'gpt-4',
          prompt: 'Leader speech generation',
          temperature: 0.6,
          confidence: 0.8,
          generationTime,
          styleGuide: request.styleGuide
        },
        
        createdAt: new Date(),
        scheduledFor: request.scheduledFor,
        status: 'draft',
        priority: this.determineSpeechPriority(request.type, expectedImpact)
      };

      return speech;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw new Error(`Failed to generate speech: ${error}`);
    }
  }

  /**
   * Apply speech effects to simulation
   */
  async applySpeechEffects(speech: LeaderSpeech): Promise<NaturalLanguageEffect[]> {
    const effects: NaturalLanguageEffect[] = [];

    try {
      for (const simEffect of speech.simulationEffects) {
        const nlEffect: NaturalLanguageEffect = {
          id: nanoid(),
          source: 'speech',
          sourceId: speech.id,
          description: `Speech impact: ${simEffect.description}`,
          category: this.mapSystemToCategory(simEffect.system),
          targetSystems: [simEffect.system],
          effects: [simEffect],
          narrativeContext: this.extractNarrativeContext(speech),
          emotionalTone: speech.tone,
          rhetoricalDevices: this.identifyRhetoricalDevices(speech.content),
          appliedAt: new Date(),
          duration: simEffect.duration,
          status: 'pending'
        };

        effects.push(nlEffect);
      }

      // Store effects in database
      await this.storeNaturalLanguageEffects(effects);

      // Update speech with actual impact
      speech.actualImpact = speech.expectedImpact;
      speech.status = 'delivered';
      speech.deliveredAt = new Date();

      return effects;
    } catch (error) {
      console.error('Error applying speech effects:', error);
      throw error;
    }
  }

  /**
   * Gather context for speech generation
   */
  private async gatherSpeechContext(request: SpeechRequest): Promise<any> {
    const context: any = {
      simulationData: {},
      recentEvents: request.recentEvents || [],
      civilizationStatus: {},
      publicMood: {},
      historicalSpeeches: []
    };

    try {
      // Get current simulation state
      context.simulationData = await this.getSimulationData(request.campaignId, request.tickId);
      
      // Get civilization status
      context.civilizationStatus = await this.getCivilizationStatus(request.campaignId);
      
      // Get public mood and sentiment
      context.publicMood = await this.getPublicMood(request.campaignId);
      
      // Get historical speeches for context
      context.historicalSpeeches = await this.getHistoricalSpeeches(request.leaderCharacterId);

      return context;
    } catch (error) {
      console.error('Error gathering speech context:', error);
      return context;
    }
  }

  /**
   * Generate speech content using AI
   */
  private async generateSpeechContent(request: SpeechRequest, context: any): Promise<any> {
    const prompt = this.buildSpeechPrompt(request, context);
    
    const response = await this.llmProvider.generateText({
      prompt,
      temperature: 0.6,
      maxTokens: 1500,
      model: 'gpt-4'
    });

    return this.parseSpeechResponse(response.text, request);
  }

  /**
   * Build AI prompt for speech generation
   */
  private buildSpeechPrompt(request: SpeechRequest, context: any): string {
    return `Generate a ${request.type.replace('_', ' ')} speech for a civilization leader.

SPEECH CONTEXT:
- Type: ${request.type}
- Audience: ${request.audience.primary} (${request.audience.estimatedSize} people)
- Occasion: ${request.occasion}
- Tone: ${request.tone || 'formal'}
- Duration: ${request.duration || 10} minutes

CIVILIZATION STATUS:
- Overall Status: ${context.civilizationStatus.overall || 'stable'}
- Economic Health: ${context.civilizationStatus.economicHealth || 0.7}
- Public Mood: ${context.publicMood.overall || 'neutral'}

CURRENT SITUATION:
${JSON.stringify(context.simulationData, null, 2)}

RECENT EVENTS:
${context.recentEvents.map((e: any) => `- ${e.description || e.title}`).join('\n')}

KEY MESSAGES TO INCLUDE:
${(request.keyMessages || []).map(msg => `- ${msg}`).join('\n')}

POLICY FOCUS:
${(request.policyFocus || []).map(policy => `- ${policy}`).join('\n')}

CURRENT CHALLENGES:
${(request.currentChallenges || []).map(challenge => `- ${challenge}`).join('\n')}

STYLE GUIDE:
${request.styleGuide || 'Professional, authoritative, inspiring when appropriate'}

Generate a comprehensive speech with:
1. A compelling title
2. Full speech content (${request.duration || 10} minutes, ~${(request.duration || 10) * 150} words)
3. A brief summary (2-3 sentences)
4. 3-5 key messages
5. Appropriate tone and rhetoric for the occasion

The speech should:
- Address current challenges and opportunities
- Inspire confidence and unity
- Provide clear direction and vision
- Be appropriate for the audience and occasion
- Include specific policy references where relevant
- Demonstrate leadership and authority

Format as JSON:
{
  "title": "Speech Title",
  "content": "Full speech content...",
  "summary": "Brief summary...",
  "keyMessages": ["message1", "message2", ...]
}`;
  }

  /**
   * Parse AI-generated speech response
   */
  private parseSpeechResponse(response: string, request: SpeechRequest): any {
    try {
      const parsed = JSON.parse(response);
      
      // Validate and clean up the response
      return {
        title: parsed.title || `${request.type.replace('_', ' ')} Address`,
        content: parsed.content || response,
        summary: parsed.summary || parsed.content?.substring(0, 200) + '...',
        keyMessages: parsed.keyMessages || this.extractKeyMessages(parsed.content || response)
      };
    } catch (error) {
      // Fallback parsing if JSON fails
      const lines = response.split('\n').filter(line => line.trim());
      
      return {
        title: lines[0] || `${request.type.replace('_', ' ')} Address`,
        content: response,
        summary: response.substring(0, 200) + '...',
        keyMessages: this.extractKeyMessages(response)
      };
    }
  }

  /**
   * Extract key messages from speech content
   */
  private extractKeyMessages(content: string): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    // Look for sentences with strong language or policy statements
    const keyMessages = sentences.filter(sentence => {
      const s = sentence.toLowerCase();
      return s.includes('will') || s.includes('must') || s.includes('commit') || 
             s.includes('ensure') || s.includes('pledge') || s.includes('promise');
    }).slice(0, 5);

    return keyMessages.length > 0 ? keyMessages : sentences.slice(0, 3);
  }

  /**
   * Analyze expected impact of speech
   */
  private async analyzeExpectedImpact(
    speechContent: any, 
    request: SpeechRequest, 
    context: any
  ): Promise<SpeechImpact> {
    const prompt = `Analyze the expected impact of this leader speech:

SPEECH TITLE: ${speechContent.title}
SPEECH TYPE: ${request.type}
AUDIENCE: ${request.audience.primary}
TONE: ${request.tone || 'formal'}
DELIVERY MODE: ${request.deliveryMode || 'teleprompter'}

SPEECH CONTENT:
${speechContent.content}

CURRENT CONTEXT:
- Civilization Status: ${context.civilizationStatus.overall || 'stable'}
- Public Mood: ${context.publicMood.overall || 'neutral'}
- Economic Health: ${context.civilizationStatus.economicHealth || 0.7}

Analyze the expected impact on:
1. Morale (-1 to 1)
2. Approval (-1 to 1)
3. Economic Confidence (-1 to 1)
4. Military Readiness (-1 to 1)
5. Diplomatic Standing (-1 to 1)
6. Social Cohesion (-1 to 1)

Also identify:
- Policy support changes
- Behavioral changes in population
- Economic effects
- Political effects

Consider:
- Speech tone and content
- Current public mood
- Audience type and size
- Historical context
- Policy implications
- Delivery mode impact:
  * Avatar: AI avatar delivers speech automatically, leader not personally present, digital representation
  * Teleprompter: Professional, polished, prepared delivery with leader engagement
  * Off-the-cuff: Most authentic and relatable, shows confidence and spontaneity, highest emotional impact

Format as JSON:
{
  "morale": 0.0,
  "approval": 0.0,
  "economicConfidence": 0.0,
  "militaryReadiness": 0.0,
  "diplomaticStanding": 0.0,
  "socialCohesion": 0.0,
  "policySupport": {"policy1": 0.1, "policy2": -0.05},
  "behavioralChanges": ["change1", "change2"],
  "economicEffects": ["effect1", "effect2"],
  "politicalEffects": ["effect1", "effect2"]
}`;

    try {
      const response = await this.llmProvider.generateText({
        prompt,
        temperature: 0.2,
        maxTokens: 800,
        model: 'gpt-4'
      });

      const impact = JSON.parse(response.text);
      return this.validateSpeechImpact(impact);
    } catch (error) {
      console.error('Error analyzing speech impact:', error);
      return this.getDefaultSpeechImpact(request.type);
    }
  }

  /**
   * Generate simulation effects from speech impact
   */
  private async generateSimulationEffects(
    speechContent: any, 
    impact: SpeechImpact, 
    request: SpeechRequest
  ): Promise<SimulationEffect[]> {
    const effects: SimulationEffect[] = [];
    
    // Calculate delivery mode multiplier
    const deliveryMultiplier = this.getDeliveryModeMultiplier(request.deliveryMode || 'teleprompter');

    // Convert impact metrics to simulation effects
    if (Math.abs(impact.morale) > 0.05) {
      effects.push({
        system: 'population',
        parameter: 'morale',
        effect: impact.morale > 0 ? 'increase' : 'decrease',
        value: Math.abs(impact.morale) * deliveryMultiplier,
        duration: this.calculateEffectDuration(impact.morale, 'morale'),
        description: `Leader speech ${impact.morale > 0 ? 'boosted' : 'dampened'} public morale`,
        magnitude: this.calculateEffectMagnitude(impact.morale),
        source: 'speech',
        appliedAt: new Date()
      });
    }

    if (Math.abs(impact.approval) > 0.05) {
      effects.push({
        system: 'politics',
        parameter: 'leader_approval',
        effect: impact.approval > 0 ? 'increase' : 'decrease',
        value: Math.abs(impact.approval) * deliveryMultiplier,
        duration: this.calculateEffectDuration(impact.approval, 'approval'),
        description: `Leader speech affected approval ratings`,
        magnitude: this.calculateEffectMagnitude(impact.approval),
        source: 'speech',
        appliedAt: new Date()
      });
    }

    if (Math.abs(impact.economicConfidence) > 0.05) {
      effects.push({
        system: 'economy',
        parameter: 'confidence',
        effect: impact.economicConfidence > 0 ? 'increase' : 'decrease',
        value: Math.abs(impact.economicConfidence),
        duration: this.calculateEffectDuration(impact.economicConfidence, 'economic'),
        description: `Leader speech influenced economic confidence`,
        magnitude: this.calculateEffectMagnitude(impact.economicConfidence),
        source: 'speech',
        appliedAt: new Date()
      });
    }

    if (Math.abs(impact.militaryReadiness) > 0.05) {
      effects.push({
        system: 'military',
        parameter: 'readiness',
        effect: impact.militaryReadiness > 0 ? 'increase' : 'decrease',
        value: Math.abs(impact.militaryReadiness),
        duration: this.calculateEffectDuration(impact.militaryReadiness, 'military'),
        description: `Leader speech affected military readiness`,
        magnitude: this.calculateEffectMagnitude(impact.militaryReadiness),
        source: 'speech',
        appliedAt: new Date()
      });
    }

    if (Math.abs(impact.socialCohesion) > 0.05) {
      effects.push({
        system: 'social',
        parameter: 'cohesion',
        effect: impact.socialCohesion > 0 ? 'increase' : 'decrease',
        value: Math.abs(impact.socialCohesion),
        duration: this.calculateEffectDuration(impact.socialCohesion, 'social'),
        description: `Leader speech influenced social cohesion`,
        magnitude: this.calculateEffectMagnitude(impact.socialCohesion),
        source: 'speech',
        appliedAt: new Date()
      });
    }

    // Add policy-specific effects
    if (impact.policySupport) {
      for (const [policy, support] of Object.entries(impact.policySupport)) {
        if (Math.abs(support as number) > 0.05) {
          effects.push({
            system: 'policy',
            parameter: `${policy}_support`,
            effect: (support as number) > 0 ? 'increase' : 'decrease',
            value: Math.abs(support as number),
            duration: this.calculateEffectDuration(support as number, 'policy'),
            description: `Leader speech affected support for ${policy}`,
            magnitude: this.calculateEffectMagnitude(support as number),
            source: 'speech',
            appliedAt: new Date()
          });
        }
      }
    }

    return effects;
  }

  /**
   * Estimate public reaction to speech
   */
  private async estimatePublicReaction(
    speechContent: any, 
    request: SpeechRequest, 
    context: any
  ): Promise<any> {
    // Analyze speech sentiment and tone
    const sentiment = this.analyzeSpeechSentiment(speechContent.content);
    
    // Calculate engagement based on speech type and audience
    const engagement = this.calculateEngagement(request, context);
    
    // Estimate media response
    const mediaResponse = this.estimateMediaResponse(speechContent, request, context);
    
    // Calculate social media buzz
    const socialMediaBuzz = this.calculateSocialMediaBuzz(request, sentiment, engagement);

    return {
      sentiment,
      approval: this.calculateApprovalChange(sentiment, context),
      engagement,
      mediaResponse,
      socialMediaBuzz
    };
  }

  // Helper Methods

  private determineSpeechTone(request: SpeechRequest, speechContent: any): string {
    if (request.tone) return request.tone;
    
    // Analyze content to determine tone
    const content = speechContent.content.toLowerCase();
    
    if (content.includes('crisis') || content.includes('emergency')) return 'urgent';
    if (content.includes('celebrate') || content.includes('victory')) return 'celebratory';
    if (content.includes('mourn') || content.includes('loss')) return 'somber';
    if (content.includes('inspire') || content.includes('future')) return 'inspirational';
    
    return 'formal';
  }

  private estimateDuration(content: string): number {
    // Estimate speaking time: ~150 words per minute
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 150);
  }

  private determineSpeechPriority(type: SpeechType, impact: SpeechImpact): 'routine' | 'important' | 'urgent' | 'critical' | 'emergency' {
    if (type === 'crisis_address') return 'critical';
    if (type === 'state_of_civilization') return 'important';
    
    // Base on impact magnitude
    const maxImpact = Math.max(
      Math.abs(impact.morale),
      Math.abs(impact.approval),
      Math.abs(impact.economicConfidence),
      Math.abs(impact.socialCohesion)
    );
    
    if (maxImpact > 0.3) return 'critical';
    if (maxImpact > 0.2) return 'urgent';
    if (maxImpact > 0.1) return 'important';
    return 'routine';
  }

  private validateSpeechImpact(impact: any): SpeechImpact {
    return {
      morale: this.clampValue(impact.morale || 0, -1, 1),
      approval: this.clampValue(impact.approval || 0, -1, 1),
      economicConfidence: this.clampValue(impact.economicConfidence || 0, -1, 1),
      militaryReadiness: this.clampValue(impact.militaryReadiness || 0, -1, 1),
      diplomaticStanding: this.clampValue(impact.diplomaticStanding || 0, -1, 1),
      socialCohesion: this.clampValue(impact.socialCohesion || 0, -1, 1),
      policySupport: impact.policySupport || {},
      behavioralChanges: impact.behavioralChanges || [],
      economicEffects: impact.economicEffects || [],
      politicalEffects: impact.politicalEffects || []
    };
  }

  private getDefaultSpeechImpact(type: SpeechType): SpeechImpact {
    const baseImpact = {
      morale: 0.05,
      approval: 0.03,
      economicConfidence: 0.02,
      militaryReadiness: 0.01,
      diplomaticStanding: 0.01,
      socialCohesion: 0.03,
      policySupport: {},
      behavioralChanges: ['Increased civic engagement'],
      economicEffects: ['Minor confidence boost'],
      politicalEffects: ['Slight approval increase']
    };

    // Adjust based on speech type
    switch (type) {
      case 'crisis_address':
        baseImpact.morale = 0.1;
        baseImpact.approval = 0.05;
        break;
      case 'economic_update':
        baseImpact.economicConfidence = 0.08;
        break;
      case 'military_briefing':
        baseImpact.militaryReadiness = 0.06;
        break;
      case 'victory_speech':
        baseImpact.morale = 0.15;
        baseImpact.approval = 0.1;
        break;
    }

    return baseImpact;
  }

  private calculateEffectDuration(impactValue: number, category: string): number {
    // Duration in ticks (120 seconds each)
    const baseDuration = Math.abs(impactValue) * 10; // 0.1 impact = 1 tick
    
    // Category modifiers
    const modifiers: Record<string, number> = {
      morale: 1.5,
      approval: 2.0,
      economic: 1.2,
      military: 0.8,
      social: 1.8,
      policy: 3.0
    };
    
    return Math.ceil(baseDuration * (modifiers[category] || 1.0));
  }

  private calculateEffectMagnitude(impactValue: number): 'minor' | 'moderate' | 'major' | 'transformative' {
    const abs = Math.abs(impactValue);
    
    if (abs >= 0.5) return 'transformative';
    if (abs >= 0.3) return 'major';
    if (abs >= 0.1) return 'moderate';
    return 'minor';
  }

  private mapSystemToCategory(system: string): any {
    const mapping: Record<string, any> = {
      population: 'social',
      politics: 'political',
      economy: 'economic',
      military: 'military',
      social: 'social',
      policy: 'political'
    };
    
    return mapping[system] || 'social';
  }

  private extractNarrativeContext(speech: LeaderSpeech): string {
    return `Leader ${speech.type.replace('_', ' ')} addressing ${speech.audience.primary} on ${speech.occasion}`;
  }

  private identifyRhetoricalDevices(content: string): string[] {
    const devices: string[] = [];
    
    // Simple pattern matching for rhetorical devices
    if (content.match(/we (will|must|shall)/gi)) devices.push('inclusive language');
    if (content.match(/\b(\w+),\s*\1\b/gi)) devices.push('repetition');
    if (content.match(/\?/g)) devices.push('rhetorical questions');
    if (content.match(/together|unity|united/gi)) devices.push('unity appeals');
    if (content.match(/future|tomorrow|ahead/gi)) devices.push('future vision');
    
    return devices;
  }

  private analyzeSpeechSentiment(content: string): 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive' {
    // Simple sentiment analysis
    const positiveWords = ['success', 'growth', 'progress', 'victory', 'achievement', 'prosperity', 'hope', 'future', 'strong', 'united'];
    const negativeWords = ['crisis', 'challenge', 'difficulty', 'problem', 'threat', 'concern', 'struggle', 'hardship'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
    
    const score = (positiveCount - negativeCount) / words.length * 100;
    
    if (score >= 2) return 'very_positive';
    if (score >= 0.5) return 'positive';
    if (score <= -2) return 'very_negative';
    if (score <= -0.5) return 'negative';
    return 'neutral';
  }

  private calculateEngagement(request: SpeechRequest, context: any): number {
    let engagement = 0.5; // Base engagement
    
    // Audience size factor
    const audienceSize = request.audience.estimatedSize;
    if (audienceSize > 1000000) engagement += 0.2;
    else if (audienceSize > 100000) engagement += 0.1;
    
    // Speech type factor
    const typeEngagement: Record<SpeechType, number> = {
      state_of_civilization: 0.3,
      crisis_address: 0.4,
      victory_speech: 0.3,
      policy_announcement: 0.1,
      economic_update: 0.05,
      military_briefing: 0.15,
      diplomatic_address: 0.1,
      rally: 0.25,
      memorial: 0.2,
      cultural_celebration: 0.15
    };
    
    engagement += typeEngagement[request.type] || 0.1;
    
    // Context factors
    if (context.publicMood?.overall === 'positive') engagement += 0.1;
    if (context.publicMood?.overall === 'negative') engagement += 0.15; // Crisis increases attention
    
    return this.clampValue(engagement, 0, 1);
  }

  private estimateMediaResponse(speechContent: any, request: SpeechRequest, context: any): string[] {
    const responses: string[] = [];
    
    // Generate realistic media headlines
    responses.push(`Leader Addresses ${request.audience.primary} on ${request.occasion}`);
    
    if (request.type === 'crisis_address') {
      responses.push('Emergency Address Seeks to Calm Public Concerns');
    } else if (request.type === 'economic_update') {
      responses.push('Economic Outlook Presented in Leader Address');
    } else if (request.type === 'victory_speech') {
      responses.push('Victory Celebration Marks Historic Achievement');
    }
    
    return responses;
  }

  private calculateSocialMediaBuzz(request: SpeechRequest, sentiment: string, engagement: number): number {
    let buzz = engagement * 0.8; // Base on engagement
    
    // Sentiment factor
    if (sentiment === 'very_positive' || sentiment === 'very_negative') buzz += 0.2;
    else if (sentiment === 'positive' || sentiment === 'negative') buzz += 0.1;
    
    // Speech type factor
    if (request.type === 'crisis_address' || request.type === 'victory_speech') buzz += 0.15;
    
    return this.clampValue(buzz, 0, 1);
  }

  private calculateApprovalChange(sentiment: string, context: any): number {
    const sentimentMap = {
      very_positive: 0.1,
      positive: 0.05,
      neutral: 0.01,
      negative: -0.03,
      very_negative: -0.08
    };
    
    let change = sentimentMap[sentiment as keyof typeof sentimentMap] || 0;
    
    // Context modifiers
    if (context.publicMood?.overall === 'negative' && sentiment === 'positive') {
      change += 0.05; // Positive speech during crisis has more impact
    }
    
    return this.clampValue(change, -1, 1);
  }

  private getDeliveryModeMultiplier(deliveryMode: 'avatar' | 'teleprompter' | 'off-the-cuff'): number {
    // Impact hierarchy: avatar < teleprompter < off-the-cuff
    switch (deliveryMode) {
      case 'off-the-cuff':
        return 1.5; // 50% higher impact - most authentic and engaging
      case 'teleprompter':
        return 1.2; // 20% higher impact - professional and prepared
      case 'avatar':
      default:
        return 1.0; // Baseline impact - AI avatar delivery, leader not present
    }
  }

  private clampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // Data access methods (would integrate with actual systems)
  
  private async getSimulationData(campaignId: number, tickId: number): Promise<any> {
    // Integration point with hybrid simulation engine
    return {
      economy: { gdpChange: 0.02, unemployment: 0.05 },
      politics: { approval: 0.65, stability: 0.8 },
      military: { readiness: 0.85, strength: 0.9 },
      social: { cohesion: 0.75, mood: 0.6 }
    };
  }

  private async getCivilizationStatus(campaignId: number): Promise<any> {
    return {
      overall: 'stable',
      economicHealth: 0.7,
      militaryStrength: 0.8,
      socialCohesion: 0.75
    };
  }

  private async getPublicMood(campaignId: number): Promise<any> {
    return {
      overall: 'neutral',
      confidence: 0.6,
      optimism: 0.65
    };
  }

  private async getHistoricalSpeeches(leaderCharacterId: string): Promise<any[]> {
    // Query previous speeches for context
    return [];
  }

  private async storeNaturalLanguageEffects(effects: NaturalLanguageEffect[]): Promise<void> {
    // Store effects in database for application to simulation
    try {
      for (const effect of effects) {
        await db.query(
          'INSERT INTO natural_language_effects (id, source, source_id, description, category, target_systems, effects, narrative_context, emotional_tone, rhetorical_devices, applied_at, duration, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
          [
            effect.id,
            effect.source,
            effect.sourceId,
            effect.description,
            effect.category,
            JSON.stringify(effect.targetSystems),
            JSON.stringify(effect.effects),
            effect.narrativeContext,
            effect.emotionalTone,
            JSON.stringify(effect.rhetoricalDevices),
            effect.appliedAt,
            effect.duration,
            effect.status,
            new Date()
          ]
        );
      }
    } catch (error) {
      console.error('Error storing natural language effects:', error);
    }
  }
}

export const leaderSpeechEngine = new LeaderSpeechEngine();
