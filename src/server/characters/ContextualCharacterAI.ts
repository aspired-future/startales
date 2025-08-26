/**
 * Contextual Character AI Service
 * 
 * Integrates game state awareness and specialty knowledge into character interactions,
 * making characters respond with appropriate context and expertise.
 */

import { GameStateAwarenessService, CharacterAwarenessContext, CharacterResponse } from './GameStateAwareness';
import { DynamicCharacter } from './characterInterfaces';

export interface ConversationContext {
  conversationId: string;
  participantId: string; // Player or other character
  topic: string;
  context: string;
  previousMessages: Array<{
    speaker: string;
    message: string;
    timestamp: Date;
    emotional_tone?: string;
  }>;
  relationship_status: string;
  conversation_goals: string[];
}

export interface CharacterInteractionRequest {
  characterId: string;
  prompt: string;
  interactionType: 'conversation' | 'interview' | 'briefing' | 'consultation' | 'casual_chat' | 'formal_meeting';
  context: ConversationContext;
  gameState?: any;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  confidentiality: 'public' | 'private' | 'confidential' | 'classified';
}

export interface CharacterInteractionResponse {
  characterId: string;
  response: CharacterResponse;
  interaction_metadata: {
    processing_time: number;
    confidence_score: number;
    context_used: string[];
    knowledge_sources: string[];
    emotional_state_change?: {
      before: string;
      after: string;
      reason: string;
    };
  };
  follow_up_actions: Array<{
    action_type: string;
    description: string;
    priority: number;
    timeline: string;
  }>;
  relationship_impact: {
    trust_change: number;
    respect_change: number;
    influence_change: number;
    notes: string[];
  };
}

export interface AIPersonalityProfile {
  communication_style: {
    formality_level: number; // 0-100
    directness: number; // 0-100
    emotional_expression: number; // 0-100
    technical_detail: number; // 0-100
    storytelling_tendency: number; // 0-100
  };
  
  knowledge_sharing: {
    openness: number; // 0-100
    detail_level: number; // 0-100
    speculation_willingness: number; // 0-100
    confidentiality_respect: number; // 0-100
  };
  
  decision_making: {
    analytical_approach: number; // 0-100
    intuitive_approach: number; // 0-100
    risk_assessment: number; // 0-100
    consensus_seeking: number; // 0-100
  };
  
  social_behavior: {
    relationship_building: number; // 0-100
    conflict_avoidance: number; // 0-100
    leadership_tendency: number; // 0-100
    collaboration_preference: number; // 0-100
  };
}

export class ContextualCharacterAI {
  private gameStateService: GameStateAwarenessService;
  private characterContextCache: Map<string, CharacterAwarenessContext> = new Map();
  private conversationHistory: Map<string, ConversationContext[]> = new Map();
  private personalityProfiles: Map<string, AIPersonalityProfile> = new Map();
  
  constructor() {
    this.gameStateService = new GameStateAwarenessService();
  }
  
  /**
   * Process character interaction with full contextual awareness
   */
  async processCharacterInteraction(
    character: DynamicCharacter,
    request: CharacterInteractionRequest
  ): Promise<CharacterInteractionResponse> {
    const startTime = Date.now();
    
    try {
      // Get or create character awareness context
      const awarenessContext = await this.getCharacterAwarenessContext(
        character,
        request.context.conversationId
      );
      
      // Update context with current conversation
      await this.updateConversationContext(character.id, request.context);
      
      // Generate personality-aware response
      const personalityProfile = await this.getPersonalityProfile(character);
      
      // Process the interaction with full context
      const response = await this.generateContextualResponse(
        character,
        request,
        awarenessContext,
        personalityProfile
      );
      
      // Calculate relationship impact
      const relationshipImpact = this.calculateRelationshipImpact(
        character,
        request,
        response
      );
      
      // Generate follow-up actions
      const followUpActions = this.generateFollowUpActions(
        character,
        request,
        response
      );
      
      const processingTime = Date.now() - startTime;
      
      return {
        characterId: character.id,
        response,
        interaction_metadata: {
          processing_time: processingTime,
          confidence_score: this.calculateConfidenceScore(response),
          context_used: this.getContextSources(awarenessContext),
          knowledge_sources: this.getKnowledgeSources(awarenessContext),
          emotional_state_change: this.detectEmotionalStateChange(character, response)
        },
        follow_up_actions: followUpActions,
        relationship_impact: relationshipImpact
      };
      
    } catch (error) {
      console.error('❌ Error processing character interaction:', error);
      
      // Return fallback response
      return this.generateFallbackResponse(character, request, Date.now() - startTime);
    }
  }
  
  /**
   * Get or create character awareness context
   */
  private async getCharacterAwarenessContext(
    character: DynamicCharacter,
    conversationId: string
  ): Promise<CharacterAwarenessContext> {
    const cacheKey = `${character.id}_${conversationId}`;
    
    if (this.characterContextCache.has(cacheKey)) {
      return this.characterContextCache.get(cacheKey)!;
    }
    
    // Create new awareness context
    const context = await this.gameStateService.createCharacterContext(
      character.id,
      character,
      'default_campaign' // TODO: Get from request
    );
    
    this.characterContextCache.set(cacheKey, context);
    return context;
  }
  
  /**
   * Update conversation context for character
   */
  private async updateConversationContext(
    characterId: string,
    context: ConversationContext
  ): Promise<void> {
    if (!this.conversationHistory.has(characterId)) {
      this.conversationHistory.set(characterId, []);
    }
    
    const history = this.conversationHistory.get(characterId)!;
    
    // Add or update conversation context
    const existingIndex = history.findIndex(c => c.conversationId === context.conversationId);
    if (existingIndex >= 0) {
      history[existingIndex] = context;
    } else {
      history.push(context);
    }
    
    // Keep only recent conversations (last 10)
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
  }
  
  /**
   * Get or generate personality profile for character
   */
  private async getPersonalityProfile(character: DynamicCharacter): Promise<AIPersonalityProfile> {
    if (this.personalityProfiles.has(character.id)) {
      return this.personalityProfiles.get(character.id)!;
    }
    
    const profile = this.generatePersonalityProfile(character);
    this.personalityProfiles.set(character.id, profile);
    return profile;
  }
  
  /**
   * Generate personality profile from character data
   */
  private generatePersonalityProfile(character: DynamicCharacter): AIPersonalityProfile {
    const traits = character.personality?.core_traits || [];
    const profession = character.profession?.current_job || '';
    const attributes = character.attributes || {};
    
    // Calculate communication style
    const communication_style = {
      formality_level: this.calculateFormalityLevel(character),
      directness: this.calculateDirectness(character),
      emotional_expression: attributes.empathy || 50,
      technical_detail: attributes.technical_skill || 50,
      storytelling_tendency: attributes.creativity || 50
    };
    
    // Calculate knowledge sharing tendencies
    const knowledge_sharing = {
      openness: this.calculateOpenness(character),
      detail_level: attributes.intelligence || 50,
      speculation_willingness: this.calculateSpeculationWillingness(character),
      confidentiality_respect: attributes.integrity || 50
    };
    
    // Calculate decision making style
    const decision_making = {
      analytical_approach: attributes.intelligence || 50,
      intuitive_approach: 100 - (attributes.intelligence || 50),
      risk_assessment: this.calculateRiskAssessment(character),
      consensus_seeking: attributes.empathy || 50
    };
    
    // Calculate social behavior
    const social_behavior = {
      relationship_building: attributes.charisma || 50,
      conflict_avoidance: this.calculateConflictAvoidance(character),
      leadership_tendency: attributes.leadership || 50,
      collaboration_preference: this.calculateCollaborationPreference(character)
    };
    
    return {
      communication_style,
      knowledge_sharing,
      decision_making,
      social_behavior
    };
  }
  
  /**
   * Generate contextually aware response
   */
  private async generateContextualResponse(
    character: DynamicCharacter,
    request: CharacterInteractionRequest,
    awarenessContext: CharacterAwarenessContext,
    personalityProfile: AIPersonalityProfile
  ): Promise<CharacterResponse> {
    
    // Apply personality filters to response generation
    const responseStyle = this.determineResponseStyle(
      request.interactionType,
      personalityProfile,
      request.confidentiality
    );
    
    // Generate base response using game state awareness
    const baseResponse = await this.gameStateService.generateAwareResponse(
      character.id,
      request.prompt,
      awarenessContext
    );
    
    // Apply personality and context modifications
    const enhancedResponse = this.applyPersonalityToResponse(
      baseResponse,
      personalityProfile,
      responseStyle,
      character
    );
    
    // Add professional context and terminology
    const professionalResponse = this.addProfessionalContext(
      enhancedResponse,
      awarenessContext.specialtyKnowledge,
      request.interactionType
    );
    
    // Add relationship and emotional context
    const contextualResponse = this.addRelationshipContext(
      professionalResponse,
      character,
      request.context
    );
    
    return contextualResponse;
  }
  
  /**
   * Determine appropriate response style based on context
   */
  private determineResponseStyle(
    interactionType: string,
    personality: AIPersonalityProfile,
    confidentiality: string
  ): any {
    const baseFormality = personality.communication_style.formality_level;
    
    let formalityAdjustment = 0;
    switch (interactionType) {
      case 'formal_meeting':
      case 'briefing':
        formalityAdjustment = 20;
        break;
      case 'interview':
      case 'consultation':
        formalityAdjustment = 10;
        break;
      case 'casual_chat':
        formalityAdjustment = -20;
        break;
    }
    
    if (confidentiality === 'classified' || confidentiality === 'confidential') {
      formalityAdjustment += 15;
    }
    
    return {
      formality: Math.max(0, Math.min(100, baseFormality + formalityAdjustment)),
      directness: personality.communication_style.directness,
      detail_level: personality.knowledge_sharing.detail_level,
      emotional_expression: personality.communication_style.emotional_expression
    };
  }
  
  /**
   * Apply personality traits to response
   */
  private applyPersonalityToResponse(
    response: CharacterResponse,
    personality: AIPersonalityProfile,
    style: any,
    character: DynamicCharacter
  ): CharacterResponse {
    
    // Adjust response text based on personality
    let adjustedText = response.response_text;
    
    // Apply formality level
    if (style.formality > 70) {
      adjustedText = this.makeFormal(adjustedText, character);
    } else if (style.formality < 30) {
      adjustedText = this.makeCasual(adjustedText, character);
    }
    
    // Apply directness
    if (personality.communication_style.directness > 70) {
      adjustedText = this.makeMoreDirect(adjustedText);
    } else if (personality.communication_style.directness < 30) {
      adjustedText = this.makeMoreDiplomatic(adjustedText);
    }
    
    // Adjust confidence based on personality
    const confidenceAdjustment = this.calculateConfidenceAdjustment(personality, character);
    
    return {
      ...response,
      response_text: adjustedText,
      confidence_level: Math.max(0, Math.min(100, response.confidence_level + confidenceAdjustment)),
      emotional_tone: this.adjustEmotionalTone(response.emotional_tone, personality)
    };
  }
  
  /**
   * Add professional context to response
   */
  private addProfessionalContext(
    response: CharacterResponse,
    specialtyKnowledge: any,
    interactionType: string
  ): CharacterResponse {
    
    // Add professional insights based on specialty
    const professionalInsights = this.generateProfessionalInsights(
      specialtyKnowledge,
      response.response_text,
      interactionType
    );
    
    // Add professional terminology
    const professionalTerms = this.selectRelevantTerminology(
      specialtyKnowledge,
      response.response_text
    );
    
    return {
      ...response,
      specialty_insights: [...response.specialty_insights, ...professionalInsights],
      professional_terminology: [...response.professional_terminology, ...professionalTerms]
    };
  }
  
  /**
   * Add relationship and emotional context
   */
  private addRelationshipContext(
    response: CharacterResponse,
    character: DynamicCharacter,
    conversationContext: ConversationContext
  ): CharacterResponse {
    
    // Adjust response based on relationship with participant
    const relationshipAdjustment = this.calculateRelationshipAdjustment(
      character,
      conversationContext.participantId,
      conversationContext.relationship_status
    );
    
    // Add personal touches based on relationship
    const personalElements = this.addPersonalElements(
      response,
      character,
      conversationContext
    );
    
    return {
      ...response,
      ...personalElements,
      confidence_level: Math.max(0, Math.min(100, response.confidence_level + relationshipAdjustment.confidence)),
      emotional_tone: relationshipAdjustment.emotional_tone || response.emotional_tone
    };
  }
  
  // Personality calculation methods
  private calculateFormalityLevel(character: DynamicCharacter): number {
    const profession = character.profession?.current_job || '';
    const category = character.category || '';
    
    let formality = 50; // Base level
    
    if (category === 'official' || profession.includes('minister')) formality += 30;
    if (category === 'military') formality += 25;
    if (category === 'academic') formality += 15;
    if (category === 'business' && character.profession?.career_level === 'executive') formality += 20;
    if (category === 'media') formality -= 10;
    if (category === 'citizen') formality -= 15;
    
    return Math.max(0, Math.min(100, formality));
  }
  
  private calculateDirectness(character: DynamicCharacter): number {
    const traits = character.personality?.core_traits || [];
    const attributes = character.attributes || {};
    
    let directness = 50;
    
    if (traits.includes('honest')) directness += 20;
    if (traits.includes('diplomatic')) directness -= 15;
    if (traits.includes('blunt')) directness += 25;
    if (traits.includes('tactful')) directness -= 10;
    
    directness += (attributes.integrity || 50) * 0.3;
    directness -= (attributes.empathy || 50) * 0.2;
    
    return Math.max(0, Math.min(100, directness));
  }
  
  private calculateOpenness(character: DynamicCharacter): number {
    const traits = character.personality?.core_traits || [];
    const attributes = character.attributes || {};
    
    let openness = 50;
    
    if (traits.includes('secretive')) openness -= 30;
    if (traits.includes('transparent')) openness += 25;
    if (traits.includes('helpful')) openness += 15;
    if (traits.includes('suspicious')) openness -= 20;
    
    openness += (attributes.integrity || 50) * 0.2;
    openness += (attributes.empathy || 50) * 0.1;
    
    return Math.max(0, Math.min(100, openness));
  }
  
  private calculateSpeculationWillingness(character: DynamicCharacter): number {
    const traits = character.personality?.core_traits || [];
    const attributes = character.attributes || {};
    
    let speculation = 50;
    
    if (traits.includes('cautious')) speculation -= 25;
    if (traits.includes('adventurous')) speculation += 20;
    if (traits.includes('analytical')) speculation -= 10;
    if (traits.includes('creative')) speculation += 15;
    
    speculation += (attributes.creativity || 50) * 0.3;
    speculation -= (attributes.integrity || 50) * 0.1; // High integrity = less speculation
    
    return Math.max(0, Math.min(100, speculation));
  }
  
  private calculateRiskAssessment(character: DynamicCharacter): number {
    const traits = character.personality?.core_traits || [];
    const attributes = character.attributes || {};
    
    let riskAssessment = 50;
    
    if (traits.includes('cautious')) riskAssessment += 25;
    if (traits.includes('reckless')) riskAssessment -= 30;
    if (traits.includes('analytical')) riskAssessment += 20;
    if (traits.includes('impulsive')) riskAssessment -= 20;
    
    riskAssessment += (attributes.intelligence || 50) * 0.3;
    
    return Math.max(0, Math.min(100, riskAssessment));
  }
  
  private calculateConflictAvoidance(character: DynamicCharacter): number {
    const traits = character.personality?.core_traits || [];
    const attributes = character.attributes || {};
    
    let avoidance = 50;
    
    if (traits.includes('diplomatic')) avoidance += 25;
    if (traits.includes('confrontational')) avoidance -= 30;
    if (traits.includes('peaceful')) avoidance += 20;
    if (traits.includes('aggressive')) avoidance -= 25;
    
    avoidance += (attributes.empathy || 50) * 0.2;
    avoidance -= (attributes.leadership || 50) * 0.1;
    
    return Math.max(0, Math.min(100, avoidance));
  }
  
  private calculateCollaborationPreference(character: DynamicCharacter): number {
    const traits = character.personality?.core_traits || [];
    const attributes = character.attributes || {};
    
    let collaboration = 50;
    
    if (traits.includes('team-oriented')) collaboration += 25;
    if (traits.includes('independent')) collaboration -= 20;
    if (traits.includes('helpful')) collaboration += 15;
    if (traits.includes('competitive')) collaboration -= 10;
    
    collaboration += (attributes.empathy || 50) * 0.2;
    collaboration += (attributes.charisma || 50) * 0.1;
    
    return Math.max(0, Math.min(100, collaboration));
  }
  
  // Response modification methods
  private makeFormal(text: string, character: DynamicCharacter): string {
    // Add formal language patterns
    const formalPhrases = [
      'I would like to respectfully suggest',
      'In my professional opinion',
      'Based on my analysis',
      'I believe it would be prudent to consider'
    ];
    
    // Simple implementation - would be more sophisticated in practice
    return text.replace(/I think/g, 'I believe')
               .replace(/maybe/g, 'perhaps')
               .replace(/can't/g, 'cannot');
  }
  
  private makeCasual(text: string, character: DynamicCharacter): string {
    // Add casual language patterns
    return text.replace(/I believe/g, 'I think')
               .replace(/perhaps/g, 'maybe')
               .replace(/cannot/g, 'can\'t');
  }
  
  private makeMoreDirect(text: string): string {
    // Make language more direct and concise
    return text.replace(/I think that perhaps/g, 'I believe')
               .replace(/It might be possible that/g, 'It\'s likely that')
               .replace(/We should consider/g, 'We should');
  }
  
  private makeMoreDiplomatic(text: string): string {
    // Add diplomatic hedging
    return text.replace(/We should/g, 'We might consider')
               .replace(/This is wrong/g, 'This presents some challenges')
               .replace(/I disagree/g, 'I see it somewhat differently');
  }
  
  private calculateConfidenceAdjustment(personality: AIPersonalityProfile, character: DynamicCharacter): number {
    const attributes = character.attributes || {};
    let adjustment = 0;
    
    // High charisma and leadership increase confidence
    adjustment += (attributes.charisma || 50) * 0.2;
    adjustment += (attributes.leadership || 50) * 0.1;
    
    // High empathy might decrease confidence (more consideration of others' views)
    adjustment -= (attributes.empathy || 50) * 0.1;
    
    return Math.max(-25, Math.min(25, adjustment));
  }
  
  private adjustEmotionalTone(
    currentTone: string,
    personality: AIPersonalityProfile
  ): 'enthusiastic' | 'concerned' | 'neutral' | 'skeptical' | 'angry' | 'excited' | 'worried' {
    
    // Adjust emotional expression based on personality
    const expressiveness = personality.communication_style.emotional_expression;
    
    if (expressiveness < 30) {
      return 'neutral'; // Low emotional expression
    }
    
    // Keep current tone if personality allows for emotional expression
    return currentTone as any;
  }
  
  private generateProfessionalInsights(
    specialtyKnowledge: any,
    responseText: string,
    interactionType: string
  ): any[] {
    const insights = [];
    
    // Generate insights based on professional knowledge
    if (specialtyKnowledge.government) {
      insights.push({
        topic: 'Policy Implications',
        insight: 'From a policy perspective, this could impact...',
        expertise_level: 85,
        source_of_knowledge: 'Government Experience'
      });
    }
    
    if (specialtyKnowledge.military) {
      insights.push({
        topic: 'Security Considerations',
        insight: 'The security implications include...',
        expertise_level: 90,
        source_of_knowledge: 'Military Training'
      });
    }
    
    if (specialtyKnowledge.business) {
      insights.push({
        topic: 'Business Impact',
        insight: 'The economic ramifications suggest...',
        expertise_level: 80,
        source_of_knowledge: 'Industry Experience'
      });
    }
    
    return insights;
  }
  
  private selectRelevantTerminology(specialtyKnowledge: any, responseText: string): string[] {
    const terms = [];
    
    // Add professional terminology based on context
    if (specialtyKnowledge.government && responseText.includes('policy')) {
      terms.push('regulatory framework', 'implementation strategy', 'stakeholder engagement');
    }
    
    if (specialtyKnowledge.military && responseText.includes('security')) {
      terms.push('threat assessment', 'operational security', 'strategic positioning');
    }
    
    if (specialtyKnowledge.business && responseText.includes('economic')) {
      terms.push('market dynamics', 'competitive analysis', 'value proposition');
    }
    
    return terms;
  }
  
  private calculateRelationshipAdjustment(
    character: DynamicCharacter,
    participantId: string,
    relationshipStatus: string
  ): any {
    
    let confidenceAdjustment = 0;
    let emotionalTone = null;
    
    switch (relationshipStatus) {
      case 'trusted_ally':
        confidenceAdjustment = 15;
        emotionalTone = 'enthusiastic';
        break;
      case 'respected_colleague':
        confidenceAdjustment = 10;
        break;
      case 'neutral':
        confidenceAdjustment = 0;
        break;
      case 'suspicious':
        confidenceAdjustment = -10;
        emotionalTone = 'skeptical';
        break;
      case 'hostile':
        confidenceAdjustment = -20;
        emotionalTone = 'concerned';
        break;
    }
    
    return { confidence: confidenceAdjustment, emotional_tone: emotionalTone };
  }
  
  private addPersonalElements(
    response: CharacterResponse,
    character: DynamicCharacter,
    conversationContext: ConversationContext
  ): Partial<CharacterResponse> {
    
    const personalAnecdotes = [];
    const suggestedTopics = [...response.suggested_topics];
    
    // Add personal touches based on relationship and context
    if (conversationContext.relationship_status === 'trusted_ally') {
      personalAnecdotes.push('This reminds me of a similar situation I encountered...');
      suggestedTopics.push('Personal experiences', 'Shared challenges');
    }
    
    if (character.background?.achievements?.length > 0) {
      personalAnecdotes.push('In my experience with similar challenges...');
    }
    
    return {
      personal_anecdotes: personalAnecdotes,
      suggested_topics: suggestedTopics
    };
  }
  
  // Utility methods
  private calculateRelationshipImpact(
    character: DynamicCharacter,
    request: CharacterInteractionRequest,
    response: CharacterResponse
  ): any {
    
    // Calculate how this interaction affects relationships
    let trustChange = 0;
    let respectChange = 0;
    let influenceChange = 0;
    const notes = [];
    
    // Positive interactions
    if (response.confidence_level > 70 && response.specialty_insights.length > 0) {
      respectChange += 2;
      notes.push('Demonstrated expertise');
    }
    
    if (response.offers_to_help.length > 0) {
      trustChange += 1;
      notes.push('Offered assistance');
    }
    
    // Negative interactions
    if (response.confidence_level < 30) {
      respectChange -= 1;
      notes.push('Appeared uncertain');
    }
    
    return {
      trust_change: trustChange,
      respect_change: respectChange,
      influence_change: influenceChange,
      notes
    };
  }
  
  private generateFollowUpActions(
    character: DynamicCharacter,
    request: CharacterInteractionRequest,
    response: CharacterResponse
  ): any[] {
    
    const actions = [];
    
    // Generate follow-up actions based on response content
    if (response.information_requests.length > 0) {
      actions.push({
        action_type: 'information_gathering',
        description: 'Research requested information',
        priority: 70,
        timeline: '24 hours'
      });
    }
    
    if (response.offers_to_help.length > 0) {
      actions.push({
        action_type: 'assistance_preparation',
        description: 'Prepare materials for assistance',
        priority: 60,
        timeline: '48 hours'
      });
    }
    
    if (request.urgency === 'urgent') {
      actions.push({
        action_type: 'urgent_follow_up',
        description: 'Immediate follow-up required',
        priority: 90,
        timeline: '2 hours'
      });
    }
    
    return actions;
  }
  
  private calculateConfidenceScore(response: CharacterResponse): number {
    let score = response.confidence_level;
    
    // Adjust based on response quality indicators
    score += response.specialty_insights.length * 5;
    score += response.game_state_awareness.length * 3;
    score += response.professional_terminology.length * 2;
    
    return Math.min(100, score);
  }
  
  private getContextSources(context: CharacterAwarenessContext): string[] {
    const sources = ['character_profile', 'specialty_knowledge'];
    
    if (context.gameState) sources.push('game_state');
    if (context.conversationContext.recent_conversations.length > 0) sources.push('conversation_history');
    if (context.recentUpdates.length > 0) sources.push('recent_updates');
    
    return sources;
  }
  
  private getKnowledgeSources(context: CharacterAwarenessContext): string[] {
    const sources = [];
    
    if (context.specialtyKnowledge.government) sources.push('government_experience');
    if (context.specialtyKnowledge.military) sources.push('military_training');
    if (context.specialtyKnowledge.business) sources.push('business_experience');
    if (context.specialtyKnowledge.academic) sources.push('academic_research');
    if (context.specialtyKnowledge.media) sources.push('journalism_experience');
    
    sources.push('professional_network', 'regional_knowledge');
    
    return sources;
  }
  
  private detectEmotionalStateChange(
    character: DynamicCharacter,
    response: CharacterResponse
  ): any | undefined {
    
    // Simple emotional state tracking
    const currentMood = character.opinions?.current_mood || 0;
    
    if (response.emotional_tone === 'enthusiastic' && currentMood < 50) {
      return {
        before: 'neutral',
        after: 'positive',
        reason: 'Engaging conversation boosted mood'
      };
    }
    
    if (response.emotional_tone === 'concerned' && currentMood > 0) {
      return {
        before: 'positive',
        after: 'concerned',
        reason: 'Discussion raised concerns'
      };
    }
    
    return undefined;
  }
  
  private generateFallbackResponse(
    character: DynamicCharacter,
    request: CharacterInteractionRequest,
    processingTime: number
  ): CharacterInteractionResponse {
    
    return {
      characterId: character.id,
      response: {
        response_text: `I appreciate you bringing this to my attention. Let me consider this from my perspective as ${character.profession?.current_job || 'a professional'}.`,
        emotional_tone: 'neutral',
        confidence_level: 50,
        specialty_insights: [],
        game_state_awareness: [],
        references_to_recent_events: [],
        professional_terminology: [],
        personal_anecdotes: [],
        suggested_topics: ['Follow-up discussion'],
        information_requests: [],
        offers_to_help: [],
        character_growth: {
          new_knowledge_gained: [],
          relationship_changes: [],
          opinion_shifts: []
        }
      },
      interaction_metadata: {
        processing_time: processingTime,
        confidence_score: 50,
        context_used: ['fallback'],
        knowledge_sources: ['basic_profile'],
        emotional_state_change: undefined
      },
      follow_up_actions: [],
      relationship_impact: {
        trust_change: 0,
        respect_change: 0,
        influence_change: 0,
        notes: ['Fallback response used']
      }
    };
  }
  
  /**
   * Update character's knowledge based on new information
   */
  async updateCharacterKnowledge(
    characterId: string,
    newInformation: {
      type: string;
      content: string;
      source: string;
      reliability: number;
      timestamp: Date;
    }
  ): Promise<void> {
    
    // Update character's awareness context with new information
    const contexts = Array.from(this.characterContextCache.entries())
      .filter(([key]) => key.startsWith(characterId));
    
    for (const [key, context] of contexts) {
      context.recentUpdates.push({
        source: newInformation.source,
        information_type: newInformation.type,
        content: newInformation.content,
        reliability: newInformation.reliability,
        timestamp: newInformation.timestamp,
        impact_on_character: this.assessInformationImpact(context.character, newInformation)
      });
      
      // Keep only recent updates (last 20)
      if (context.recentUpdates.length > 20) {
        context.recentUpdates.splice(0, context.recentUpdates.length - 20);
      }
    }
  }
  
  private assessInformationImpact(character: any, information: any): string {
    // Assess how new information impacts the character
    if (information.type === 'political' && character.profession.includes('government')) {
      return 'Directly relevant to professional responsibilities';
    }
    
    if (information.type === 'economic' && character.profession.includes('business')) {
      return 'Affects business operations and strategy';
    }
    
    if (information.type === 'military' && character.profession.includes('military')) {
      return 'Critical for security assessment';
    }
    
    return 'General awareness update';
  }
  
  /**
   * Clear caches and reset state
   */
  clearCaches(): void {
    this.characterContextCache.clear();
    this.conversationHistory.clear();
    this.personalityProfiles.clear();
    this.gameStateService.clearCaches();
  }
  
  /**
   * Get character interaction statistics
   */
  getInteractionStats(characterId: string): any {
    const conversations = this.conversationHistory.get(characterId) || [];
    const hasPersonalityProfile = this.personalityProfiles.has(characterId);
    const contextCacheEntries = Array.from(this.characterContextCache.keys())
      .filter(key => key.startsWith(characterId)).length;
    
    return {
      total_conversations: conversations.length,
      has_personality_profile: hasPersonalityProfile,
      active_context_entries: contextCacheEntries,
      last_interaction: conversations.length > 0 ? 
        Math.max(...conversations.map(c => c.previousMessages[c.previousMessages.length - 1]?.timestamp?.getTime() || 0)) : 
        null
    };
  }
}


