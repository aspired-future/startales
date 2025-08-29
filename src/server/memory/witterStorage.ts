/**
 * Witter Storage Service
 * Handles database operations for Witter posts, comments, and interactions
 */

import { Pool } from 'pg';
import { getPool } from '../storage/db';
import {
  WitterPost,
  WitterComment,
  WitterInteraction,
  CreateWitterPostData,
  LegacyWittPost
} from './types';

export class WitterStorage {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  /**
   * Create a new Witter post
   */
  async createPost(data: CreateWitterPostData): Promise<string> {
    const query = `
      INSERT INTO witter_posts (
        id, character_id, author_name, author_type, content, 
        timestamp, likes, shares, comments, is_liked, is_shared, 
        metadata, campaign_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `;

    const values = [
      data.id,
      data.characterId,
      data.authorName,
      data.authorType || 'PERSONALITY',
      data.content,
      data.timestamp || new Date(),
      data.likes || 0,
      data.shares || 0,
      data.comments || 0,
      data.isLiked || false,
      data.isShared || false,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.campaignId
    ];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Failed to create Witter post:', error);
      throw error;
    }
  }

  /**
   * Get posts by character ID
   */
  async getPostsByCharacter(characterId: string, limit: number = 50): Promise<WitterPost[]> {
    const query = `
      SELECT * FROM witter_posts 
      WHERE character_id = $1 
      ORDER BY timestamp DESC 
      LIMIT $2
    `;

    try {
      const result = await this.pool.query(query, [characterId, limit]);
      return result.rows.map(this.mapRowToPost);
    } catch (error) {
      console.error('❌ Failed to get posts by character:', error);
      throw error;
    }
  }

  /**
   * Get posts by campaign ID
   */
  async getPostsByCampaign(campaignId: number, limit: number = 100): Promise<WitterPost[]> {
    const query = `
      SELECT * FROM witter_posts 
      WHERE campaign_id = $1 
      ORDER BY timestamp DESC 
      LIMIT $2
    `;

    try {
      const result = await this.pool.query(query, [campaignId, limit]);
      return result.rows.map(this.mapRowToPost);
    } catch (error) {
      console.error('❌ Failed to get posts by campaign:', error);
      throw error;
    }
  }

  /**
   * Get all posts (for migration or admin purposes)
   */
  async getAllPosts(limit?: number): Promise<WitterPost[]> {
    let query = `SELECT * FROM witter_posts ORDER BY timestamp DESC`;
    const values: any[] = [];

    if (limit) {
      query += ` LIMIT $1`;
      values.push(limit);
    }

    try {
      const result = await this.pool.query(query, values);
      return result.rows.map(this.mapRowToPost);
    } catch (error) {
      console.error('❌ Failed to get all posts:', error);
      throw error;
    }
  }

  /**
   * Update post engagement metrics
   */
  async updatePostEngagement(
    postId: string, 
    likes?: number, 
    shares?: number, 
    comments?: number
  ): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (likes !== undefined) {
      updates.push(`likes = $${paramIndex++}`);
      values.push(likes);
    }
    if (shares !== undefined) {
      updates.push(`shares = $${paramIndex++}`);
      values.push(shares);
    }
    if (comments !== undefined) {
      updates.push(`comments = $${paramIndex++}`);
      values.push(comments);
    }

    if (updates.length === 0) return;

    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    values.push(postId);

    const query = `
      UPDATE witter_posts 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
    `;

    try {
      await this.pool.query(query, values);
    } catch (error) {
      console.error('❌ Failed to update post engagement:', error);
      throw error;
    }
  }

  /**
   * Create a comment on a post
   */
  async createComment(data: {
    id: string;
    postId: string;
    characterId: string;
    authorName: string;
    authorType?: string;
    avatar?: string;
    content: string;
    timestamp?: Date;
    campaignId?: number;
  }): Promise<string> {
    const query = `
      INSERT INTO witter_comments (
        id, post_id, character_id, author_name, author_type, 
        avatar, content, timestamp, campaign_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const values = [
      data.id,
      data.postId,
      data.characterId,
      data.authorName,
      data.authorType || 'PERSONALITY',
      data.avatar,
      data.content,
      data.timestamp || new Date(),
      data.campaignId
    ];

    try {
      const result = await this.pool.query(query, values);
      
      // Update comment count on the post
      await this.pool.query(
        'UPDATE witter_posts SET comments = comments + 1, updated_at = NOW() WHERE id = $1',
        [data.postId]
      );

      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Failed to create comment:', error);
      throw error;
    }
  }

  /**
   * Get comments for a post
   */
  async getCommentsByPost(postId: string, limit: number = 50): Promise<WitterComment[]> {
    const query = `
      SELECT * FROM witter_comments 
      WHERE post_id = $1 
      ORDER BY timestamp ASC 
      LIMIT $2
    `;

    try {
      const result = await this.pool.query(query, [postId, limit]);
      return result.rows.map(this.mapRowToComment);
    } catch (error) {
      console.error('❌ Failed to get comments:', error);
      throw error;
    }
  }

  /**
   * Record an interaction (like, share, view)
   */
  async recordInteraction(data: {
    postId: string;
    characterId: string;
    interactionType: 'like' | 'share' | 'comment' | 'view';
    metadata?: Record<string, any>;
    campaignId?: number;
  }): Promise<void> {
    const query = `
      INSERT INTO witter_interactions (
        post_id, character_id, interaction_type, metadata, campaign_id
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (post_id, character_id, interaction_type) 
      DO UPDATE SET timestamp = NOW(), metadata = EXCLUDED.metadata
    `;

    const values = [
      data.postId,
      data.characterId,
      data.interactionType,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.campaignId
    ];

    try {
      await this.pool.query(query, values);

      // Update engagement metrics on the post
      if (data.interactionType === 'like') {
        await this.pool.query(
          'UPDATE witter_posts SET likes = likes + 1, updated_at = NOW() WHERE id = $1',
          [data.postId]
        );
      } else if (data.interactionType === 'share') {
        await this.pool.query(
          'UPDATE witter_posts SET shares = shares + 1, updated_at = NOW() WHERE id = $1',
          [data.postId]
        );
      }
    } catch (error) {
      console.error('❌ Failed to record interaction:', error);
      throw error;
    }
  }

  /**
   * Get interactions for a character
   */
  async getInteractionsByCharacter(
    characterId: string, 
    interactionType?: string, 
    limit: number = 100
  ): Promise<WitterInteraction[]> {
    let query = `
      SELECT * FROM witter_interactions 
      WHERE character_id = $1
    `;
    const values: any[] = [characterId];

    if (interactionType) {
      query += ` AND interaction_type = $2`;
      values.push(interactionType);
    }

    query += ` ORDER BY timestamp DESC LIMIT $${values.length + 1}`;
    values.push(limit);

    try {
      const result = await this.pool.query(query, values);
      return result.rows.map(this.mapRowToInteraction);
    } catch (error) {
      console.error('❌ Failed to get interactions:', error);
      throw error;
    }
  }

  /**
   * Migrate legacy Witter posts from gameState
   */
  async migrateLegacyPosts(legacyPosts: LegacyWittPost[]): Promise<{
    success: number;
    errors: string[];
  }> {
    let success = 0;
    const errors: string[] = [];

    for (const post of legacyPosts) {
      try {
        await this.createPost({
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
          metadata: post.metadata
        });
        success++;
      } catch (error) {
        errors.push(`Failed to migrate post ${post.id}: ${error}`);
      }
    }

    return { success, errors };
  }

  /**
   * Get post statistics
   */
  async getPostStats(): Promise<{
    totalPosts: number;
    totalComments: number;
    totalInteractions: number;
    postsByCharacter: Record<string, number>;
  }> {
    try {
      const [postsResult, commentsResult, interactionsResult, characterStatsResult] = await Promise.all([
        this.pool.query('SELECT COUNT(*) as count FROM witter_posts'),
        this.pool.query('SELECT COUNT(*) as count FROM witter_comments'),
        this.pool.query('SELECT COUNT(*) as count FROM witter_interactions'),
        this.pool.query(`
          SELECT character_id, COUNT(*) as count 
          FROM witter_posts 
          GROUP BY character_id 
          ORDER BY count DESC
        `)
      ]);

      const postsByCharacter: Record<string, number> = {};
      characterStatsResult.rows.forEach(row => {
        postsByCharacter[row.character_id] = parseInt(row.count);
      });

      return {
        totalPosts: parseInt(postsResult.rows[0].count),
        totalComments: parseInt(commentsResult.rows[0].count),
        totalInteractions: parseInt(interactionsResult.rows[0].count),
        postsByCharacter
      };
    } catch (error) {
      console.error('❌ Failed to get post stats:', error);
      throw error;
    }
  }

  /**
   * Map database row to WitterPost object
   */
  private mapRowToPost(row: any): WitterPost {
    return {
      id: row.id,
      characterId: row.character_id,
      authorName: row.author_name,
      authorType: row.author_type,
      content: row.content,
      timestamp: row.timestamp,
      likes: row.likes,
      shares: row.shares,
      comments: row.comments,
      isLiked: row.is_liked,
      isShared: row.is_shared,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      campaignId: row.campaign_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Map database row to WitterComment object
   */
  private mapRowToComment(row: any): WitterComment {
    return {
      id: row.id,
      postId: row.post_id,
      characterId: row.character_id,
      authorName: row.author_name,
      authorType: row.author_type,
      avatar: row.avatar,
      content: row.content,
      timestamp: row.timestamp,
      likes: row.likes,
      replies: row.replies,
      isLiked: row.is_liked,
      campaignId: row.campaign_id,
      createdAt: row.created_at
    };
  }

  /**
   * Map database row to WitterInteraction object
   */
  private mapRowToInteraction(row: any): WitterInteraction {
    return {
      id: row.id,
      postId: row.post_id,
      characterId: row.character_id,
      interactionType: row.interaction_type,
      timestamp: row.timestamp,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      campaignId: row.campaign_id,
      createdAt: row.created_at
    };
  }
}

// Export singleton instance
export const witterStorage = new WitterStorage();
