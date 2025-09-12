/**
 * Message Storage Service
 * 
 * Handles local storage and management of conversation messages
 * for WhoseApp conversations and channels
 */

export interface StoredMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'player' | 'character' | 'system';
  content: string;
  messageType: 'text' | 'voice' | 'system';
  timestamp: Date;
  metadata?: {
    characterMood?: string;
    confidentialityLevel?: string;
    urgency?: string;
    voiceTranscript?: string;
    aiContext?: any;
  };
}

export interface ConversationMetadata {
  id: string;
  participants: string[];
  participantNames: string[];
  conversationType: 'direct' | 'group' | 'channel';
  title?: string;
  createdAt: Date;
  lastActivity: Date;
  messageCount: number;
  unreadCount: number;
  isActive: boolean;
  isPinned: boolean;
}

class MessageStorageService {
  private readonly MESSAGES_KEY = 'whoseapp_messages';
  private readonly CONVERSATIONS_KEY = 'whoseapp_conversations';
  private readonly MAX_MESSAGES_PER_CONVERSATION = 1000;

  /**
   * Get all messages for a conversation
   */
  getMessages(conversationId: string): StoredMessage[] {
    try {
      const allMessages = this.getAllMessages();
      return allMessages
        .filter(msg => msg.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Add a new message to a conversation
   */
  addMessage(message: Omit<StoredMessage, 'id' | 'timestamp'>): StoredMessage {
    try {
      const newMessage: StoredMessage = {
        ...message,
        id: this.generateMessageId(),
        timestamp: new Date()
      };

      const allMessages = this.getAllMessages();
      allMessages.push(newMessage);

      // Keep only the most recent messages per conversation
      const messagesByConversation = this.groupMessagesByConversation(allMessages);
      const trimmedMessages: StoredMessage[] = [];

      Object.values(messagesByConversation).forEach(conversationMessages => {
        const sorted = conversationMessages.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        trimmedMessages.push(...sorted.slice(0, this.MAX_MESSAGES_PER_CONVERSATION));
      });

      this.saveAllMessages(trimmedMessages);
      this.updateConversationMetadata(message.conversationId, newMessage);

      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  /**
   * Get conversation metadata
   */
  getConversationMetadata(conversationId: string): ConversationMetadata | null {
    try {
      const conversations = this.getAllConversations();
      return conversations.find(conv => conv.id === conversationId) || null;
    } catch (error) {
      console.error('Error getting conversation metadata:', error);
      return null;
    }
  }

  /**
   * Create or update conversation metadata
   */
  updateConversationMetadata(conversationId: string, lastMessage?: StoredMessage): ConversationMetadata {
    try {
      const conversations = this.getAllConversations();
      const existingIndex = conversations.findIndex(conv => conv.id === conversationId);
      
      const messages = this.getMessages(conversationId);
      const now = new Date();

      let conversation: ConversationMetadata;

      if (existingIndex >= 0) {
        // Update existing conversation
        conversation = {
          ...conversations[existingIndex],
          lastActivity: lastMessage?.timestamp || now,
          messageCount: messages.length,
          unreadCount: lastMessage?.senderType !== 'player' 
            ? conversations[existingIndex].unreadCount + 1 
            : conversations[existingIndex].unreadCount
        };
        conversations[existingIndex] = conversation;
      } else {
        // Create new conversation metadata
        conversation = {
          id: conversationId,
          participants: lastMessage ? [lastMessage.senderId] : [],
          participantNames: lastMessage ? [lastMessage.senderName] : [],
          conversationType: 'direct', // Default, should be updated by caller
          createdAt: now,
          lastActivity: lastMessage?.timestamp || now,
          messageCount: messages.length,
          unreadCount: lastMessage?.senderType !== 'player' ? 1 : 0,
          isActive: true,
          isPinned: false
        };
        conversations.push(conversation);
      }

      this.saveAllConversations(conversations);
      return conversation;
    } catch (error) {
      console.error('Error updating conversation metadata:', error);
      throw error;
    }
  }

  /**
   * Mark conversation as read
   */
  markConversationAsRead(conversationId: string): void {
    try {
      const conversations = this.getAllConversations();
      const conversation = conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        conversation.unreadCount = 0;
        this.saveAllConversations(conversations);
      }
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }

  /**
   * Get recent conversations with message previews
   */
  getRecentConversations(limit: number = 20): Array<ConversationMetadata & { lastMessage?: string }> {
    try {
      const conversations = this.getAllConversations()
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
        .slice(0, limit);

      return conversations.map(conv => {
        const messages = this.getMessages(conv.id);
        const lastMessage = messages[messages.length - 1];
        
        return {
          ...conv,
          lastMessage: lastMessage?.content || ''
        };
      });
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      return [];
    }
  }

  /**
   * Search messages across all conversations
   */
  searchMessages(query: string, conversationId?: string): StoredMessage[] {
    try {
      const allMessages = this.getAllMessages();
      const searchLower = query.toLowerCase();

      return allMessages
        .filter(msg => {
          if (conversationId && msg.conversationId !== conversationId) {
            return false;
          }
          return msg.content.toLowerCase().includes(searchLower) ||
                 msg.senderName.toLowerCase().includes(searchLower);
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }

  /**
   * Clear all messages for a conversation
   */
  clearConversation(conversationId: string): void {
    try {
      const allMessages = this.getAllMessages();
      const filteredMessages = allMessages.filter(msg => msg.conversationId !== conversationId);
      this.saveAllMessages(filteredMessages);

      // Update conversation metadata
      this.updateConversationMetadata(conversationId);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  }

  /**
   * Delete a conversation and all its messages
   */
  deleteConversation(conversationId: string): void {
    try {
      // Remove messages
      const allMessages = this.getAllMessages();
      const filteredMessages = allMessages.filter(msg => msg.conversationId !== conversationId);
      this.saveAllMessages(filteredMessages);

      // Remove conversation metadata
      const conversations = this.getAllConversations();
      const filteredConversations = conversations.filter(conv => conv.id !== conversationId);
      this.saveAllConversations(filteredConversations);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  /**
   * Get statistics about messages and conversations
   */
  getStatistics(): {
    totalMessages: number;
    totalConversations: number;
    unreadMessages: number;
    activeConversations: number;
  } {
    try {
      const messages = this.getAllMessages();
      const conversations = this.getAllConversations();

      return {
        totalMessages: messages.length,
        totalConversations: conversations.length,
        unreadMessages: conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
        activeConversations: conversations.filter(conv => conv.isActive).length
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalMessages: 0,
        totalConversations: 0,
        unreadMessages: 0,
        activeConversations: 0
      };
    }
  }

  // Private helper methods

  private getAllMessages(): StoredMessage[] {
    try {
      const stored = localStorage.getItem(this.MESSAGES_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error parsing stored messages:', error);
      return [];
    }
  }

  private saveAllMessages(messages: StoredMessage[]): void {
    try {
      localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }

  private getAllConversations(): ConversationMetadata[] {
    try {
      const stored = localStorage.getItem(this.CONVERSATIONS_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        lastActivity: new Date(conv.lastActivity)
      }));
    } catch (error) {
      console.error('Error parsing stored conversations:', error);
      return [];
    }
  }

  private saveAllConversations(conversations: ConversationMetadata[]): void {
    try {
      localStorage.setItem(this.CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }

  private groupMessagesByConversation(messages: StoredMessage[]): Record<string, StoredMessage[]> {
    return messages.reduce((groups, message) => {
      if (!groups[message.conversationId]) {
        groups[message.conversationId] = [];
      }
      groups[message.conversationId].push(message);
      return groups;
    }, {} as Record<string, StoredMessage[]>);
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const messageStorageService = new MessageStorageService();
