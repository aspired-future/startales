/**
 * Channel Messaging Service
 * Handles channel messaging with AI character responses
 */

export interface ChannelMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderType: 'player' | 'character';
  content: string;
  messageType: 'text' | 'voice' | 'system' | 'action';
  timestamp: Date;
  mentions?: string[];
  replyTo?: string;
  reactions?: { emoji: string; userId: string; userName: string }[];
}

export interface ChannelParticipant {
  id: string;
  name: string;
  type: 'player' | 'character';
  role: string;
  department?: string;
  isOnline: boolean;
  lastSeen?: Date;
  responseStyle?: 'formal' | 'casual' | 'technical' | 'diplomatic';
}

export interface CharacterResponseContext {
  characterId: string;
  channelId: string;
  channelType: string;
  recentMessages: ChannelMessage[];
  mentionedCharacters: string[];
  currentTopic?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

class ChannelMessagingService {
  private messageHistory: Map<string, ChannelMessage[]> = new Map();
  private channelParticipants: Map<string, ChannelParticipant[]> = new Map();
  private responseTimeouts: Map<string, NodeJS.Timeout> = new Map();

  // Send message to channel
  public async sendMessage(
    channelId: string,
    senderId: string,
    content: string,
    messageType: 'text' | 'voice' = 'text'
  ): Promise<ChannelMessage> {
    const message: ChannelMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channelId,
      senderId,
      senderName: await this.getSenderName(senderId),
      senderType: senderId.startsWith('player_') ? 'player' : 'character',
      content,
      messageType,
      timestamp: new Date(),
      mentions: this.extractMentions(content),
      reactions: []
    };

    // Add message to history
    if (!this.messageHistory.has(channelId)) {
      this.messageHistory.set(channelId, []);
    }
    this.messageHistory.get(channelId)!.push(message);

    // Trigger character responses if needed
    await this.processMessageForResponses(message);

    return message;
  }

  // Extract @mentions from message content
  private extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  // Get sender name (mock implementation)
  private async getSenderName(senderId: string): Promise<string> {
    // In a real implementation, this would fetch from character/player database
    const nameMap: { [key: string]: string } = {
      'player_001': 'You',
      'char_diplomat_001': 'Ambassador Elena Vasquez',
      'char_economist_001': 'Dr. Marcus Chen',
      'char_commander_001': 'Commander Alpha',
      'char_scientist_001': 'Dr. Sarah Mitchell',
      'char_engineer_001': 'Chief Engineer Thompson'
    };

    return nameMap[senderId] || `User ${senderId}`;
  }

  // Process message for potential character responses
  private async processMessageForResponses(message: ChannelMessage): Promise<void> {
    if (message.senderType === 'character') {
      return; // Don't respond to character messages
    }

    const participants = this.getChannelParticipants(message.channelId);
    const recentMessages = this.getRecentMessages(message.channelId, 10);

    // Determine which characters should respond
    const respondingCharacters = this.determineRespondingCharacters(
      message,
      participants,
      recentMessages
    );

    // Schedule responses with realistic delays
    respondingCharacters.forEach((characterId, index) => {
      const delay = this.calculateResponseDelay(characterId, message, index);
      
      const timeoutId = setTimeout(async () => {
        await this.generateCharacterResponse(characterId, message, recentMessages);
        this.responseTimeouts.delete(`${message.channelId}_${characterId}`);
      }, delay);

      this.responseTimeouts.set(`${message.channelId}_${characterId}`, timeoutId);
    });
  }

  // Determine which characters should respond to a message
  private determineRespondingCharacters(
    message: ChannelMessage,
    participants: ChannelParticipant[],
    recentMessages: ChannelMessage[]
  ): string[] {
    const respondingCharacters: string[] = [];
    const characters = participants.filter(p => p.type === 'character' && p.isOnline);

    // Always respond if directly mentioned
    if (message.mentions && message.mentions.length > 0) {
      message.mentions.forEach(mention => {
        const character = characters.find(c => 
          c.name.toLowerCase().includes(mention.toLowerCase()) ||
          c.id.includes(mention.toLowerCase())
        );
        if (character && !respondingCharacters.includes(character.id)) {
          respondingCharacters.includes(character.id);
        }
      });
    }

    // Respond based on relevance to character's role/department
    const messageContent = message.content.toLowerCase();
    characters.forEach(character => {
      if (this.isMessageRelevantToCharacter(messageContent, character)) {
        if (!respondingCharacters.includes(character.id)) {
          // Add some randomness to avoid all characters always responding
          if (Math.random() < this.getResponseProbability(character, message)) {
            respondingCharacters.push(character.id);
          }
        }
      }
    });

    // Limit responses to avoid spam (max 2-3 characters per message)
    return respondingCharacters.slice(0, 3);
  }

  // Check if message is relevant to character's expertise
  private isMessageRelevantToCharacter(messageContent: string, character: ChannelParticipant): boolean {
    const roleKeywords: { [key: string]: string[] } = {
      'diplomat': ['trade', 'negotiation', 'alliance', 'treaty', 'diplomatic', 'foreign', 'relations'],
      'economist': ['economy', 'budget', 'finance', 'trade', 'market', 'economic', 'money', 'cost'],
      'commander': ['military', 'defense', 'security', 'strategy', 'tactical', 'operation', 'threat'],
      'scientist': ['research', 'technology', 'science', 'study', 'analysis', 'data', 'experiment'],
      'engineer': ['infrastructure', 'construction', 'technical', 'system', 'maintenance', 'engineering']
    };

    const characterRole = character.role.toLowerCase();
    const keywords = roleKeywords[characterRole] || [];

    return keywords.some(keyword => messageContent.includes(keyword));
  }

  // Calculate response probability based on character and message
  private getResponseProbability(character: ChannelParticipant, message: ChannelMessage): number {
    let probability = 0.3; // Base probability

    // Higher probability for relevant expertise
    if (this.isMessageRelevantToCharacter(message.content.toLowerCase(), character)) {
      probability += 0.4;
    }

    // Higher probability for urgent messages
    if (message.content.includes('urgent') || message.content.includes('emergency')) {
      probability += 0.3;
    }

    // Lower probability if character responded recently
    const recentMessages = this.getRecentMessages(message.channelId, 5);
    const recentCharacterMessages = recentMessages.filter(m => m.senderId === character.id);
    if (recentCharacterMessages.length > 0) {
      probability -= 0.2;
    }

    return Math.max(0.1, Math.min(0.9, probability));
  }

  // Calculate realistic response delay
  private calculateResponseDelay(characterId: string, message: ChannelMessage, responseIndex: number): number {
    // Base delay: 2-8 seconds
    let delay = 2000 + Math.random() * 6000;

    // Add staggered delay for multiple responders
    delay += responseIndex * (1000 + Math.random() * 2000);

    // Shorter delay for urgent messages
    if (message.content.includes('urgent') || message.content.includes('emergency')) {
      delay *= 0.5;
    }

    // Longer delay for complex topics
    if (message.content.length > 100) {
      delay *= 1.3;
    }

    return Math.round(delay);
  }

  // Generate character response using AI
  private async generateCharacterResponse(
    characterId: string,
    triggerMessage: ChannelMessage,
    recentMessages: ChannelMessage[]
  ): Promise<void> {
    try {
      const context: CharacterResponseContext = {
        characterId,
        channelId: triggerMessage.channelId,
        channelType: this.getChannelType(triggerMessage.channelId),
        recentMessages: recentMessages.slice(-5), // Last 5 messages for context
        mentionedCharacters: triggerMessage.mentions || [],
        urgency: this.determineUrgency(triggerMessage),
        currentTopic: this.extractTopic(recentMessages)
      };

      const response = await this.generateAIResponse(context, triggerMessage);
      
      if (response && response.trim()) {
        // Send the character's response
        await this.sendMessage(
          triggerMessage.channelId,
          characterId,
          response,
          'text'
        );
      }
    } catch (error) {
      console.error('Error generating character response:', error);
    }
  }

  // Generate AI response (mock implementation)
  private async generateAIResponse(
    context: CharacterResponseContext,
    triggerMessage: ChannelMessage
  ): Promise<string> {
    // Mock responses based on character role and message content
    const characterResponses: { [key: string]: string[] } = {
      'char_diplomat_001': [
        "I believe we should approach this matter diplomatically. Let me reach out to our contacts.",
        "From a diplomatic perspective, this requires careful negotiation and mutual understanding.",
        "I can arrange a meeting with the relevant parties to discuss this further.",
        "This situation calls for diplomatic finesse. I recommend we proceed cautiously."
      ],
      'char_economist_001': [
        "From an economic standpoint, we need to consider the financial implications carefully.",
        "The budget analysis shows this could impact our quarterly projections significantly.",
        "I recommend we review the cost-benefit analysis before proceeding.",
        "This aligns with our economic strategy, but we should monitor market conditions."
      ],
      'char_commander_001': [
        "Roger that. I'll coordinate with security teams to ensure operational readiness.",
        "From a strategic perspective, we need to assess potential risks and countermeasures.",
        "I can deploy additional resources if needed. What's our priority level?",
        "Understood. I'll brief the tactical team and prepare contingency plans."
      ],
      'char_scientist_001': [
        "The research data supports this approach. I can provide detailed analysis if needed.",
        "From a scientific perspective, we should consider all variables and potential outcomes.",
        "I recommend we conduct additional studies to validate our assumptions.",
        "The experimental results are promising, but we need more comprehensive testing."
      ],
      'char_engineer_001': [
        "I can assess the technical feasibility and infrastructure requirements.",
        "From an engineering standpoint, this is achievable but will require system modifications.",
        "I'll need to review our current capacity and resource allocation.",
        "The technical specifications look solid, but we should plan for maintenance cycles."
      ]
    };

    const responses = characterResponses[context.characterId] || [
      "I understand the situation and will provide my input shortly.",
      "Thank you for bringing this to my attention. I'll review and respond.",
      "This is an important matter that requires careful consideration."
    ];

    // Select response based on message content and context
    let selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add context-specific modifications
    if (triggerMessage.mentions?.length > 0) {
      selectedResponse = `@${triggerMessage.senderName} ${selectedResponse}`;
    }

    if (context.urgency === 'high' || context.urgency === 'critical') {
      selectedResponse = `Priority acknowledged. ${selectedResponse}`;
    }

    return selectedResponse;
  }

  // Helper methods
  private getChannelParticipants(channelId: string): ChannelParticipant[] {
    return this.channelParticipants.get(channelId) || [];
  }

  private getRecentMessages(channelId: string, count: number): ChannelMessage[] {
    const messages = this.messageHistory.get(channelId) || [];
    return messages.slice(-count);
  }

  private getChannelType(channelId: string): string {
    // Extract channel type from ID or use mapping
    if (channelId.includes('cabinet')) return 'cabinet';
    if (channelId.includes('emergency')) return 'emergency';
    if (channelId.includes('department')) return 'department';
    if (channelId.includes('project')) return 'project';
    return 'general';
  }

  private determineUrgency(message: ChannelMessage): 'low' | 'medium' | 'high' | 'critical' {
    const content = message.content.toLowerCase();
    
    if (content.includes('emergency') || content.includes('critical') || content.includes('urgent')) {
      return 'critical';
    }
    if (content.includes('important') || content.includes('priority')) {
      return 'high';
    }
    if (content.includes('asap') || content.includes('soon')) {
      return 'medium';
    }
    
    return 'low';
  }

  private extractTopic(messages: ChannelMessage[]): string | undefined {
    // Simple topic extraction based on common keywords
    const allContent = messages.map(m => m.content).join(' ').toLowerCase();
    
    const topics = ['budget', 'security', 'trade', 'research', 'infrastructure', 'diplomacy'];
    for (const topic of topics) {
      if (allContent.includes(topic)) {
        return topic;
      }
    }
    
    return undefined;
  }

  // Public methods for managing channels
  public setChannelParticipants(channelId: string, participants: ChannelParticipant[]): void {
    this.channelParticipants.set(channelId, participants);
  }

  public getChannelMessages(channelId: string): ChannelMessage[] {
    return this.messageHistory.get(channelId) || [];
  }

  public clearChannelHistory(channelId: string): void {
    this.messageHistory.delete(channelId);
    
    // Clear any pending response timeouts
    Array.from(this.responseTimeouts.keys())
      .filter(key => key.startsWith(channelId))
      .forEach(key => {
        clearTimeout(this.responseTimeouts.get(key)!);
        this.responseTimeouts.delete(key);
      });
  }
}

export const channelMessagingService = new ChannelMessagingService();

