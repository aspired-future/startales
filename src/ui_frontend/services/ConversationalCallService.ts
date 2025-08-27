/**
 * Conversational Call Service for WhoseApp
 * 
 * Manages natural conversation flow during calls with:
 * - Real-time STT with conversation context
 * - Natural TTS with character personalities
 * - Seamless turn-taking and interruption handling
 * - Conversation state management
 */

import { voiceService } from './VoiceService';
import { CharacterProfile, WhoseAppMessage } from '../types/WhoseAppTypes';

export interface ConversationState {
  isActive: boolean;
  currentSpeaker: 'user' | 'character' | null;
  conversationId: string;
  characterId: string;
  turnHistory: ConversationTurn[];
  context: ConversationContext;
  settings: ConversationSettings;
}

export interface ConversationTurn {
  id: string;
  speaker: 'user' | 'character';
  content: string;
  timestamp: Date;
  audioBlob?: Blob;
  duration?: number;
  confidence?: number;
  emotionalTone?: string;
  interrupted?: boolean;
}

export interface ConversationContext {
  topic: string;
  mood: 'casual' | 'formal' | 'urgent' | 'friendly' | 'professional';
  relationshipLevel: 'stranger' | 'acquaintance' | 'friend' | 'close' | 'professional';
  conversationGoals: string[];
  recentEvents: string[];
  characterPersonality: CharacterPersonality;
}

export interface CharacterPersonality {
  speakingStyle: 'formal' | 'casual' | 'energetic' | 'calm' | 'witty' | 'serious';
  responseSpeed: 'immediate' | 'thoughtful' | 'quick' | 'measured';
  interruptionTolerance: 'high' | 'medium' | 'low';
  voiceCharacteristics: {
    rate: number;
    pitch: number;
    volume: number;
    accent?: string;
    emotionalRange: number;
  };
}

export interface ConversationSettings {
  autoRespond: boolean;
  allowInterruptions: boolean;
  responseDelay: number; // milliseconds
  contextWindow: number; // number of previous turns to consider
  confidenceThreshold: number; // STT confidence threshold
  naturalPauses: boolean; // Add natural pauses in speech
}

export class ConversationalCallService {
  private conversationState: ConversationState | null = null;
  private isListening = false;
  private isSpeaking = false;
  private currentRecognition: any = null;
  private responseTimeout: NodeJS.Timeout | null = null;
  private silenceTimeout: NodeJS.Timeout | null = null;
  private onMessageCallback: ((message: WhoseAppMessage) => void) | null = null;
  private onStateChangeCallback: ((state: ConversationState) => void) | null = null;

  constructor() {
    this.setupVoiceEventHandlers();
  }

  /**
   * Start a conversational call with a character
   */
  async startConversationalCall(
    character: CharacterProfile,
    conversationId: string,
    settings?: Partial<ConversationSettings>
  ): Promise<boolean> {
    try {
      // Initialize conversation state
      this.conversationState = {
        isActive: true,
        currentSpeaker: null,
        conversationId,
        characterId: character.id,
        turnHistory: [],
        context: this.createCharacterContext(character),
        settings: {
          autoRespond: true,
          allowInterruptions: true,
          responseDelay: 800, // Natural thinking pause
          contextWindow: 5,
          confidenceThreshold: 0.7,
          naturalPauses: true,
          ...settings
        }
      };

      // Start with character greeting
      await this.generateCharacterResponse("Hello! Thanks for calling. How can I help you today?", 'greeting');
      
      // Begin listening for user input
      await this.startConversationalListening();

      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error('❌ Failed to start conversational call:', error);
      return false;
    }
  }

  /**
   * End the conversational call
   */
  async endConversationalCall(): Promise<void> {
    if (!this.conversationState) return;

    // Stop all voice activities
    this.stopListening();
    this.stopSpeaking();
    
    // Generate farewell message
    if (this.conversationState.isActive) {
      await this.generateCharacterResponse("Thanks for calling! Have a great day!", 'farewell');
    }

    // Clear state
    this.conversationState = null;
    this.notifyStateChange();
  }

  /**
   * Start conversational listening with context awareness
   */
  private async startConversationalListening(): Promise<void> {
    if (!this.conversationState || this.isListening) return;

    this.isListening = true;
    this.conversationState.currentSpeaker = 'user';

    try {
      await voiceService.speechToText(
        (transcript, isFinal, confidence) => {
          this.handleUserSpeech(transcript, isFinal, confidence);
        },
        (error) => {
          console.error('STT Error:', error);
          this.handleSpeechError(error);
        }
      );
    } catch (error) {
      console.error('Failed to start conversational listening:', error);
      this.isListening = false;
    }
  }

  /**
   * Handle user speech with conversation context
   */
  private handleUserSpeech(transcript: string, isFinal: boolean, confidence?: number): void {
    if (!this.conversationState) return;

    // Clear silence timeout - user is speaking
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }

    // Handle interruptions
    if (this.isSpeaking && this.conversationState.settings.allowInterruptions) {
      this.handleUserInterruption(transcript);
      return;
    }

    // Process final transcript
    if (isFinal && transcript.trim().length > 0) {
      const confidenceLevel = confidence || 1.0;
      
      if (confidenceLevel >= this.conversationState.settings.confidenceThreshold) {
        this.processUserTurn(transcript, confidenceLevel);
      } else {
        // Ask for clarification if confidence is low
        this.generateCharacterResponse("I'm sorry, I didn't catch that. Could you repeat that?", 'clarification');
      }
    }

    // Set silence timeout to detect end of user speech
    if (isFinal) {
      this.silenceTimeout = setTimeout(() => {
        this.handleUserSilence();
      }, 1500); // Wait 1.5 seconds of silence
    }
  }

  /**
   * Process a complete user turn
   */
  private async processUserTurn(transcript: string, confidence: number): Promise<void> {
    if (!this.conversationState) return;

    // Create user turn record
    const userTurn: ConversationTurn = {
      id: `turn_${Date.now()}_user`,
      speaker: 'user',
      content: transcript,
      timestamp: new Date(),
      confidence,
      interrupted: false
    };

    // Add to turn history
    this.conversationState.turnHistory.push(userTurn);
    
    // Trim history to context window
    if (this.conversationState.turnHistory.length > this.conversationState.settings.contextWindow * 2) {
      this.conversationState.turnHistory = this.conversationState.turnHistory.slice(-this.conversationState.settings.contextWindow * 2);
    }

    // Send user message
    this.sendMessage(transcript, 'text', userTurn.id);

    // Generate character response if auto-respond is enabled
    if (this.conversationState.settings.autoRespond) {
      // Add natural thinking pause
      setTimeout(() => {
        this.generateContextualCharacterResponse(transcript);
      }, this.conversationState.settings.responseDelay);
    }

    this.notifyStateChange();
  }

  /**
   * Generate contextual character response
   */
  private async generateContextualCharacterResponse(userInput: string): Promise<void> {
    if (!this.conversationState) return;

    try {
      // Build conversation context
      const conversationContext = this.buildConversationContext(userInput);
      
      // Call character AI service
      const response = await this.callCharacterAI(conversationContext);
      
      // Generate character response with TTS
      await this.generateCharacterResponse(response.content, response.emotionalTone);
      
    } catch (error) {
      console.error('Failed to generate character response:', error);
      // Fallback response
      await this.generateCharacterResponse("I see. Tell me more about that.", 'neutral');
    }
  }

  /**
   * Generate character response with natural TTS
   */
  private async generateCharacterResponse(
    content: string, 
    emotionalTone: string = 'neutral'
  ): Promise<void> {
    if (!this.conversationState) return;

    // Create character turn record
    const characterTurn: ConversationTurn = {
      id: `turn_${Date.now()}_character`,
      speaker: 'character',
      content,
      timestamp: new Date(),
      emotionalTone,
      interrupted: false
    };

    // Add to turn history
    this.conversationState.turnHistory.push(characterTurn);
    this.conversationState.currentSpeaker = 'character';

    // Send character message
    this.sendMessage(content, 'text', characterTurn.id);

    // Speak with character voice
    await this.speakWithCharacterVoice(content, emotionalTone);

    // Resume listening after speaking
    this.conversationState.currentSpeaker = null;
    this.notifyStateChange();
  }

  /**
   * Speak with character-specific voice and personality
   */
  private async speakWithCharacterVoice(content: string, emotionalTone: string): Promise<void> {
    if (!this.conversationState) return;

    this.isSpeaking = true;
    
    try {
      const personality = this.conversationState.context.characterPersonality;
      
      // Adjust voice characteristics based on emotional tone
      const voiceOptions = this.adjustVoiceForEmotion(personality.voiceCharacteristics, emotionalTone);
      
      // Add natural pauses if enabled
      const processedContent = this.conversationState.settings.naturalPauses 
        ? this.addNaturalPauses(content)
        : content;

      await voiceService.textToSpeech(processedContent, {
        characterId: this.conversationState.characterId,
        rate: voiceOptions.rate,
        pitch: voiceOptions.pitch,
        volume: voiceOptions.volume
      });

    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      this.isSpeaking = false;
    }
  }

  /**
   * Handle user interruption during character speech
   */
  private handleUserInterruption(transcript: string): void {
    if (!this.conversationState) return;

    console.log('🔄 User interrupted character speech:', transcript);
    
    // Stop character speech
    this.stopSpeaking();
    
    // Mark last character turn as interrupted
    const lastTurn = this.conversationState.turnHistory[this.conversationState.turnHistory.length - 1];
    if (lastTurn && lastTurn.speaker === 'character') {
      lastTurn.interrupted = true;
    }

    // Process interruption as new user turn
    this.processUserTurn(transcript, 1.0);
  }

  /**
   * Handle user silence (end of turn)
   */
  private handleUserSilence(): void {
    if (!this.conversationState) return;

    console.log('🔇 User silence detected, ready for character response');
    // Character can now respond if needed
  }

  /**
   * Build conversation context for AI
   */
  private buildConversationContext(userInput: string): any {
    if (!this.conversationState) return {};

    const recentTurns = this.conversationState.turnHistory.slice(-this.conversationState.settings.contextWindow);
    
    return {
      characterId: this.conversationState.characterId,
      conversationId: this.conversationState.conversationId,
      userInput,
      conversationHistory: recentTurns.map(turn => ({
        speaker: turn.speaker,
        content: turn.content,
        timestamp: turn.timestamp,
        emotionalTone: turn.emotionalTone
      })),
      context: this.conversationState.context,
      interactionType: 'voice_call',
      urgency: 'normal',
      confidentiality: 'normal'
    };
  }

  /**
   * Call character AI service
   */
  private async callCharacterAI(context: any): Promise<any> {
    try {
      const response = await fetch(`/api/characters/${context.characterId}/interact-aware`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          content: result.interaction?.response_text || "I understand. What would you like to discuss?",
          emotionalTone: result.interaction?.emotional_tone || 'neutral'
        };
      } else {
        throw new Error(`AI service error: ${response.status}`);
      }
    } catch (error) {
      console.error('Character AI call failed:', error);
      return {
        content: "I'm listening. Please continue.",
        emotionalTone: 'neutral'
      };
    }
  }

  /**
   * Create character context from profile
   */
  private createCharacterContext(character: CharacterProfile): ConversationContext {
    return {
      topic: 'General Discussion',
      mood: 'friendly',
      relationshipLevel: 'acquaintance',
      conversationGoals: ['assist_user', 'provide_information', 'maintain_engagement'],
      recentEvents: [],
      characterPersonality: {
        speakingStyle: this.determineSpeakingStyle(character),
        responseSpeed: 'thoughtful',
        interruptionTolerance: 'medium',
        voiceCharacteristics: {
          rate: this.determineVoiceRate(character),
          pitch: this.determineVoicePitch(character),
          volume: 0.8,
          emotionalRange: 0.7
        }
      }
    };
  }

  /**
   * Determine speaking style from character profile
   */
  private determineSpeakingStyle(character: CharacterProfile): CharacterPersonality['speakingStyle'] {
    // Analyze character traits to determine speaking style
    const role = character.role?.toLowerCase() || '';
    const personality = character.personality?.toLowerCase() || '';
    
    if (role.includes('diplomat') || role.includes('ambassador')) return 'formal';
    if (personality.includes('energetic') || personality.includes('enthusiastic')) return 'energetic';
    if (personality.includes('serious') || personality.includes('stern')) return 'serious';
    if (personality.includes('witty') || personality.includes('humorous')) return 'witty';
    if (personality.includes('calm') || personality.includes('peaceful')) return 'calm';
    
    return 'casual'; // Default
  }

  /**
   * Determine voice rate from character
   */
  private determineVoiceRate(character: CharacterProfile): number {
    const personality = character.personality?.toLowerCase() || '';
    
    if (personality.includes('energetic') || personality.includes('excited')) return 1.2;
    if (personality.includes('calm') || personality.includes('thoughtful')) return 0.9;
    if (personality.includes('serious') || personality.includes('formal')) return 0.95;
    
    return 1.0; // Default
  }

  /**
   * Determine voice pitch from character
   */
  private determineVoicePitch(character: CharacterProfile): number {
    // Could be enhanced with character age, gender, personality
    return 1.0; // Default for now
  }

  /**
   * Adjust voice characteristics based on emotional tone
   */
  private adjustVoiceForEmotion(base: CharacterPersonality['voiceCharacteristics'], emotion: string): typeof base {
    const adjusted = { ...base };
    
    switch (emotion) {
      case 'excited':
      case 'enthusiastic':
        adjusted.rate *= 1.1;
        adjusted.pitch *= 1.05;
        break;
      case 'concerned':
      case 'worried':
        adjusted.rate *= 0.9;
        adjusted.pitch *= 0.95;
        break;
      case 'angry':
        adjusted.rate *= 1.15;
        adjusted.volume *= 1.1;
        break;
      case 'calm':
      case 'peaceful':
        adjusted.rate *= 0.85;
        adjusted.pitch *= 0.98;
        break;
    }
    
    return adjusted;
  }

  /**
   * Add natural pauses to speech content
   */
  private addNaturalPauses(content: string): string {
    return content
      .replace(/\./g, '. ') // Pause after periods
      .replace(/,/g, ', ') // Short pause after commas
      .replace(/\?/g, '? ') // Pause after questions
      .replace(/!/g, '! ') // Pause after exclamations
      .replace(/;/g, '; ') // Pause after semicolons
      .replace(/:/g, ': ') // Pause after colons
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  }

  /**
   * Stop listening
   */
  private stopListening(): void {
    this.isListening = false;
    if (this.currentRecognition) {
      this.currentRecognition.stop();
      this.currentRecognition = null;
    }
  }

  /**
   * Stop speaking
   */
  private stopSpeaking(): void {
    this.isSpeaking = false;
    voiceService.stopSpeech();
  }

  /**
   * Handle speech recognition errors
   */
  private handleSpeechError(error: any): void {
    console.error('Speech recognition error:', error);
    this.isListening = false;
    
    // Try to restart listening after a brief delay
    setTimeout(() => {
      if (this.conversationState?.isActive) {
        this.startConversationalListening();
      }
    }, 2000);
  }

  /**
   * Send message through callback
   */
  private sendMessage(content: string, type: string, turnId: string): void {
    if (!this.onMessageCallback || !this.conversationState) return;

    const message: WhoseAppMessage = {
      id: `msg_${turnId}`,
      conversationId: this.conversationState.conversationId,
      senderId: type === 'text' && this.conversationState.currentSpeaker === 'user' 
        ? 'current_user' 
        : this.conversationState.characterId,
      senderName: type === 'text' && this.conversationState.currentSpeaker === 'user' 
        ? 'You' 
        : 'Character',
      content,
      timestamp: new Date(),
      messageType: type,
      isRead: true,
      attachments: [],
      reactions: []
    };

    this.onMessageCallback(message);
  }

  /**
   * Notify state change
   */
  private notifyStateChange(): void {
    if (this.onStateChangeCallback && this.conversationState) {
      this.onStateChangeCallback(this.conversationState);
    }
  }

  /**
   * Setup voice event handlers
   */
  private setupVoiceEventHandlers(): void {
    // Could add additional voice service event handlers here
  }

  // Public methods for external control

  /**
   * Set message callback
   */
  setOnMessageCallback(callback: (message: WhoseAppMessage) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * Set state change callback
   */
  setOnStateChangeCallback(callback: (state: ConversationState) => void): void {
    this.onStateChangeCallback = callback;
  }

  /**
   * Get current conversation state
   */
  getConversationState(): ConversationState | null {
    return this.conversationState;
  }

  /**
   * Toggle auto-respond
   */
  toggleAutoRespond(): void {
    if (this.conversationState) {
      this.conversationState.settings.autoRespond = !this.conversationState.settings.autoRespond;
      this.notifyStateChange();
    }
  }

  /**
   * Toggle interruptions
   */
  toggleInterruptions(): void {
    if (this.conversationState) {
      this.conversationState.settings.allowInterruptions = !this.conversationState.settings.allowInterruptions;
      this.notifyStateChange();
    }
  }

  /**
   * Manually trigger character response
   */
  async triggerCharacterResponse(prompt?: string): Promise<void> {
    if (!this.conversationState) return;

    const lastUserTurn = this.conversationState.turnHistory
      .slice()
      .reverse()
      .find(turn => turn.speaker === 'user');

    const responsePrompt = prompt || lastUserTurn?.content || "Please continue the conversation.";
    
    await this.generateContextualCharacterResponse(responsePrompt);
  }
}

// Export singleton instance
export const conversationalCallService = new ConversationalCallService();
