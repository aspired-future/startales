/**
 * Memory Migration Service
 * Handles migration of existing Witter data and conversations to the new memory system
 */

import { witterStorage } from './witterStorage.js';
import { characterVectorMemory } from './characterVectorMemory.js';
import { civilizationVectorMemory } from './civilizationVectorMemory.js';
import { enhancedConversationStorage } from './conversationStorageNew.js';
import { MigrationResult, LegacyWittPost } from './types.js';

export interface MigrationOptions {
  batchSize?: number;
  dryRun?: boolean;
  skipVectorization?: boolean;
  campaignId?: number;
  civilizationId?: string;
}

export class MemoryMigrationService {
  
  /**
   * Migrate legacy Witter posts from gameState to new system
   */
  async migrateLegacyWitterPosts(
    legacyPosts: LegacyWittPost[],
    options: MigrationOptions = {}
  ): Promise<MigrationResult> {
    const startTime = Date.now();
    const { batchSize = 50, dryRun = false, skipVectorization = false, campaignId, civilizationId } = options;
    
    let postsProcessed = 0;
    let vectorsCreated = 0;
    const errors: string[] = [];

    console.log(`🚀 Starting Witter migration: ${legacyPosts.length} posts (dryRun: ${dryRun})`);

    try {
      // Process posts in batches
      for (let i = 0; i < legacyPosts.length; i += batchSize) {
        const batch = legacyPosts.slice(i, i + batchSize);
        
        for (const post of batch) {
          try {
            if (!dryRun) {
              // 1. Store in PostgreSQL for perfect recall
              await witterStorage.createPost({
                id: post.id,
                characterId: post.authorId,
                authorName: post.authorName,
                authorType: post.authorType as any,
                content: post.content,
                timestamp: new Date(post.timestamp),
                likes: post.likes,
                shares: post.shares,
                comments: post.comments,
                isLiked: post.isLiked,
                isShared: post.isShared,
                metadata: post.metadata,
                campaignId
              });

              // 2. Store in character vector memory (if not skipping vectorization)
              if (!skipVectorization) {
                await characterVectorMemory.storeCharacterMemory(
                  post.authorId,
                  post.content,
                  'witter_post',
                  {
                    ...post.metadata,
                    likes: post.likes,
                    shares: post.shares,
                    comments: post.comments,
                    originalTimestamp: post.timestamp
                  },
                  campaignId,
                  post.id
                );
                vectorsCreated++;
              }

              // 3. If this is a significant post, also store in civilization memory
              if (this.isSignificantPost(post) && civilizationId) {
                await civilizationVectorMemory.storeCivilizationMemory(
                  civilizationId,
                  `${post.authorName}: ${post.content}`,
                  'major_event',
                  'PUBLIC',
                  {
                    ...post.metadata,
                    originalAuthor: post.authorName,
                    originalTimestamp: post.timestamp,
                    postId: post.id,
                    significance: 'high_engagement'
                  },
                  campaignId,
                  post.id
                );
              }
            }

            postsProcessed++;

            if (postsProcessed % 10 === 0) {
              console.log(`📊 Migrated ${postsProcessed}/${legacyPosts.length} posts...`);
            }

          } catch (error) {
            const errorMsg = `Failed to migrate post ${post.id}: ${error}`;
            errors.push(errorMsg);
            console.error(`❌ ${errorMsg}`);
          }
        }
      }

      const duration = Date.now() - startTime;
      const result: MigrationResult = {
        success: errors.length === 0,
        postsProcessed,
        conversationsProcessed: 0,
        vectorsCreated,
        errors,
        duration
      };

      console.log(`✅ Witter migration completed in ${duration}ms`);
      console.log(`📊 Posts: ${postsProcessed}, Vectors: ${vectorsCreated}, Errors: ${errors.length}`);

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Migration failed:', error);
      
      return {
        success: false,
        postsProcessed,
        conversationsProcessed: 0,
        vectorsCreated,
        errors: [...errors, `Migration failed: ${error}`],
        duration
      };
    }
  }

  /**
   * Migrate existing conversation data to new privacy-aware system
   */
  async migrateConversations(
    legacyConversations: Array<{
      id: string;
      participants: string[];
      messages: Array<{
        id: string;
        senderId: string;
        content: string;
        timestamp: Date;
        role: 'user' | 'assistant' | 'system';
      }>;
      campaignId?: number;
    }>,
    options: MigrationOptions = {}
  ): Promise<MigrationResult> {
    const startTime = Date.now();
    const { dryRun = false, skipVectorization = false } = options;
    
    let conversationsProcessed = 0;
    let vectorsCreated = 0;
    const errors: string[] = [];

    console.log(`🚀 Starting conversation migration: ${legacyConversations.length} conversations`);

    try {
      for (const conversation of legacyConversations) {
        try {
          if (!dryRun) {
            // Determine conversation type based on participants
            const conversationType = this.determineConversationType(conversation.participants);

            // Create conversation record
            await enhancedConversationStorage.createConversation({
              id: conversation.id,
              campaignId: conversation.campaignId || 1,
              participantIds: conversation.participants,
              conversationType,
              isPrivate: conversationType !== 'character-player',
              metadata: {
                migratedFrom: 'legacy',
                originalParticipants: conversation.participants
              }
            });

            // Migrate messages
            for (let i = 0; i < conversation.messages.length; i++) {
              const message = conversation.messages[i];
              
              await enhancedConversationStorage.addMessage({
                id: message.id,
                conversationId: conversation.id,
                senderId: message.senderId,
                senderType: this.determineSenderType(message.senderId, message.role),
                content: message.content,
                timestamp: message.timestamp,
                messageIndex: i,
                campaignId: conversation.campaignId
              });

              // Store in character memory if it's a character-player conversation and not skipping vectorization
              if (!skipVectorization && conversationType === 'character-player') {
                const characterId = this.getCharacterFromParticipants(conversation.participants, message.senderId);
                if (characterId) {
                  await characterVectorMemory.storeCharacterMemory(
                    characterId,
                    message.content,
                    'conversation',
                    {
                      conversationId: conversation.id,
                      messageId: message.id,
                      senderType: message.role,
                      originalTimestamp: message.timestamp.toISOString()
                    },
                    conversation.campaignId,
                    message.id
                  );
                  vectorsCreated++;
                }
              }
            }
          }

          conversationsProcessed++;

          if (conversationsProcessed % 5 === 0) {
            console.log(`📊 Migrated ${conversationsProcessed}/${legacyConversations.length} conversations...`);
          }

        } catch (error) {
          const errorMsg = `Failed to migrate conversation ${conversation.id}: ${error}`;
          errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      const duration = Date.now() - startTime;
      const result: MigrationResult = {
        success: errors.length === 0,
        postsProcessed: 0,
        conversationsProcessed,
        vectorsCreated,
        errors,
        duration
      };

      console.log(`✅ Conversation migration completed in ${duration}ms`);
      console.log(`📊 Conversations: ${conversationsProcessed}, Vectors: ${vectorsCreated}, Errors: ${errors.length}`);

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Conversation migration failed:', error);
      
      return {
        success: false,
        postsProcessed: 0,
        conversationsProcessed,
        vectorsCreated,
        errors: [...errors, `Migration failed: ${error}`],
        duration
      };
    }
  }

  /**
   * Full migration: posts + conversations
   */
  async migrateAll(
    legacyData: {
      posts: LegacyWittPost[];
      conversations?: Array<any>;
    },
    options: MigrationOptions = {}
  ): Promise<MigrationResult> {
    console.log('🚀 Starting full memory system migration...');
    
    const startTime = Date.now();
    let totalPostsProcessed = 0;
    let totalConversationsProcessed = 0;
    let totalVectorsCreated = 0;
    const allErrors: string[] = [];

    try {
      // 1. Migrate Witter posts
      if (legacyData.posts && legacyData.posts.length > 0) {
        console.log('📝 Migrating Witter posts...');
        const postResult = await this.migrateLegacyWitterPosts(legacyData.posts, options);
        
        totalPostsProcessed = postResult.postsProcessed;
        totalVectorsCreated += postResult.vectorsCreated;
        allErrors.push(...postResult.errors);
      }

      // 2. Migrate conversations
      if (legacyData.conversations && legacyData.conversations.length > 0) {
        console.log('💬 Migrating conversations...');
        const conversationResult = await this.migrateConversations(legacyData.conversations, options);
        
        totalConversationsProcessed = conversationResult.conversationsProcessed;
        totalVectorsCreated += conversationResult.vectorsCreated;
        allErrors.push(...conversationResult.errors);
      }

      const totalDuration = Date.now() - startTime;
      const finalResult: MigrationResult = {
        success: allErrors.length === 0,
        postsProcessed: totalPostsProcessed,
        conversationsProcessed: totalConversationsProcessed,
        vectorsCreated: totalVectorsCreated,
        errors: allErrors,
        duration: totalDuration
      };

      console.log('🎉 Full migration completed!');
      console.log(`📊 Final stats: Posts: ${totalPostsProcessed}, Conversations: ${totalConversationsProcessed}, Vectors: ${totalVectorsCreated}`);
      console.log(`⏱️ Total duration: ${totalDuration}ms`);
      console.log(`❌ Errors: ${allErrors.length}`);

      return finalResult;

    } catch (error) {
      console.error('❌ Full migration failed:', error);
      
      return {
        success: false,
        postsProcessed: totalPostsProcessed,
        conversationsProcessed: totalConversationsProcessed,
        vectorsCreated: totalVectorsCreated,
        errors: [...allErrors, `Full migration failed: ${error}`],
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Rollback migration (delete migrated data)
   */
  async rollbackMigration(options: {
    deleteWitterPosts?: boolean;
    deleteConversations?: boolean;
    deleteVectorMemories?: boolean;
    characterIds?: string[];
    civilizationIds?: string[];
  } = {}): Promise<{
    success: boolean;
    deletedPosts: number;
    deletedConversations: number;
    deletedVectorCollections: number;
    errors: string[];
  }> {
    console.log('🔄 Starting migration rollback...');
    
    let deletedPosts = 0;
    let deletedConversations = 0;
    let deletedVectorCollections = 0;
    const errors: string[] = [];

    try {
      // Delete Witter posts
      if (options.deleteWitterPosts) {
        // Note: This would require implementing a delete all posts method in witterStorage
        console.log('⚠️ Witter posts rollback not implemented - would require manual database cleanup');
      }

      // Delete conversations
      if (options.deleteConversations) {
        console.log('⚠️ Conversations rollback not implemented - would require manual database cleanup');
      }

      // Delete vector collections
      if (options.deleteVectorMemories) {
        if (options.characterIds) {
          for (const characterId of options.characterIds) {
            try {
              await characterVectorMemory.clearCharacterMemories(characterId);
              deletedVectorCollections++;
            } catch (error) {
              errors.push(`Failed to clear character memories for ${characterId}: ${error}`);
            }
          }
        }

        if (options.civilizationIds) {
          for (const civilizationId of options.civilizationIds) {
            try {
              await civilizationVectorMemory.clearCivilizationMemories(civilizationId);
              deletedVectorCollections++;
            } catch (error) {
              errors.push(`Failed to clear civilization memories for ${civilizationId}: ${error}`);
            }
          }
        }
      }

      console.log(`✅ Rollback completed. Deleted ${deletedVectorCollections} vector collections`);

      return {
        success: errors.length === 0,
        deletedPosts,
        deletedConversations,
        deletedVectorCollections,
        errors
      };

    } catch (error) {
      console.error('❌ Rollback failed:', error);
      
      return {
        success: false,
        deletedPosts,
        deletedConversations,
        deletedVectorCollections,
        errors: [...errors, `Rollback failed: ${error}`]
      };
    }
  }

  /**
   * Validate migration results
   */
  async validateMigration(options: {
    expectedPosts?: number;
    expectedConversations?: number;
    characterIds?: string[];
    civilizationIds?: string[];
  } = {}): Promise<{
    valid: boolean;
    issues: string[];
    stats: {
      postsInDatabase: number;
      characterCollections: number;
      civilizationCollections: number;
      conversationsInDatabase: number;
    };
  }> {
    console.log('🔍 Validating migration results...');
    
    const issues: string[] = [];
    
    try {
      // Get stats from Witter storage
      const witterStats = await witterStorage.getPostStats();
      
      // Get character collections
      const characterCollections = await characterVectorMemory.getAllCharacterCollections();
      
      // Get civilization collections
      const civilizationCollections = await civilizationVectorMemory.getAllCivilizationCollections();
      
      // Get conversation stats
      const conversationStats = await enhancedConversationStorage.getConversationStats();

      const stats = {
        postsInDatabase: witterStats.totalPosts,
        characterCollections: characterCollections.length,
        civilizationCollections: civilizationCollections.length,
        conversationsInDatabase: conversationStats.totalConversations
      };

      // Validate expected counts
      if (options.expectedPosts !== undefined && stats.postsInDatabase !== options.expectedPosts) {
        issues.push(`Expected ${options.expectedPosts} posts, found ${stats.postsInDatabase}`);
      }

      if (options.expectedConversations !== undefined && stats.conversationsInDatabase !== options.expectedConversations) {
        issues.push(`Expected ${options.expectedConversations} conversations, found ${stats.conversationsInDatabase}`);
      }

      // Validate character collections
      if (options.characterIds) {
        const foundCharacterIds = new Set(characterCollections.map(c => c.characterId));
        for (const expectedId of options.characterIds) {
          if (!foundCharacterIds.has(expectedId)) {
            issues.push(`Missing character collection for ${expectedId}`);
          }
        }
      }

      // Validate civilization collections
      if (options.civilizationIds) {
        const foundCivilizationIds = new Set(civilizationCollections.map(c => c.civilizationId));
        for (const expectedId of options.civilizationIds) {
          if (!foundCivilizationIds.has(expectedId)) {
            issues.push(`Missing civilization collection for ${expectedId}`);
          }
        }
      }

      console.log(`✅ Validation completed. Found ${issues.length} issues`);
      console.log('📊 Migration stats:', stats);

      return {
        valid: issues.length === 0,
        issues,
        stats
      };

    } catch (error) {
      console.error('❌ Validation failed:', error);
      
      return {
        valid: false,
        issues: [`Validation failed: ${error}`],
        stats: {
          postsInDatabase: 0,
          characterCollections: 0,
          civilizationCollections: 0,
          conversationsInDatabase: 0
        }
      };
    }
  }

  /**
   * Helper: Determine if a post is significant enough for civilization memory
   */
  private isSignificantPost(post: LegacyWittPost): boolean {
    // Consider posts significant if they have high engagement or contain important keywords
    const highEngagement = (post.likes + post.shares + post.comments) > 50;
    const importantKeywords = ['discovery', 'breakthrough', 'crisis', 'war', 'peace', 'alliance', 'threat'];
    const hasImportantContent = importantKeywords.some(keyword => 
      post.content.toLowerCase().includes(keyword)
    );
    
    return highEngagement || hasImportantContent;
  }

  /**
   * Helper: Determine conversation type from participants
   */
  private determineConversationType(participants: string[]): 'character-player' | 'player-player' | 'alliance' | 'party' | 'system' {
    // Simple heuristic - in a real system, you'd have more sophisticated logic
    if (participants.length === 2) {
      // Check if one participant is a character (starts with 'npc_' or 'character_')
      const hasCharacter = participants.some(p => p.startsWith('npc_') || p.startsWith('character_'));
      return hasCharacter ? 'character-player' : 'player-player';
    }
    
    // Multi-participant conversations are likely alliance or party
    return participants.length > 4 ? 'alliance' : 'party';
  }

  /**
   * Helper: Determine sender type from sender ID and role
   */
  private determineSenderType(senderId: string, role: string): 'player' | 'character' | 'system' {
    if (role === 'system') return 'system';
    if (senderId.startsWith('npc_') || senderId.startsWith('character_')) return 'character';
    return 'player';
  }

  /**
   * Helper: Get character ID from conversation participants
   */
  private getCharacterFromParticipants(participants: string[], senderId: string): string | null {
    // If sender is a character, return sender ID
    if (senderId.startsWith('npc_') || senderId.startsWith('character_')) {
      return senderId;
    }
    
    // Otherwise, find the character in participants
    const character = participants.find(p => p.startsWith('npc_') || p.startsWith('character_'));
    return character || null;
  }
}

// Export singleton instance
export const memoryMigrationService = new MemoryMigrationService();
