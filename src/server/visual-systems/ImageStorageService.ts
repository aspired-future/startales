/**
 * Image Storage Service - Handles storage and retrieval of generated images with metadata
 */

import { Pool } from 'pg';
import { EntityImageResult } from './EntityVisualGenerator';

export interface StoredImage {
  id: string;
  entityId: string;
  entityType: string;
  imageUrl: string;
  thumbnailUrl?: string;
  metadata: {
    generatedAt: Date;
    prompt: string;
    style: string;
    dimensions: { width: number; height: number };
    tags: string[];
    fileSize?: number;
    format?: string;
    quality?: string;
  };
  status: 'generating' | 'completed' | 'failed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageSearchFilters {
  entityType?: string;
  entityId?: string;
  tags?: string[];
  style?: string;
  status?: string;
  dateRange?: { start: Date; end: Date };
  limit?: number;
  offset?: number;
}

export class ImageStorageService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Initialize the image storage database schema
   */
  async initializeSchema(): Promise<void> {
    const client = await this.pool.connect();
    try {
      console.log('🖼️ Initializing Image Storage database schema...');

      // Main images table
      await client.query(`
        CREATE TABLE IF NOT EXISTS generated_images (
          id VARCHAR(255) PRIMARY KEY,
          entity_id VARCHAR(255) NOT NULL,
          entity_type VARCHAR(100) NOT NULL,
          image_url TEXT NOT NULL,
          thumbnail_url TEXT,
          metadata JSONB NOT NULL,
          status VARCHAR(50) DEFAULT 'generating',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_generated_images_entity 
        ON generated_images(entity_id, entity_type)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_generated_images_type 
        ON generated_images(entity_type)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_generated_images_status 
        ON generated_images(status)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_generated_images_created 
        ON generated_images(created_at DESC)
      `);

      // GIN index for metadata JSONB queries
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_generated_images_metadata 
        ON generated_images USING GIN(metadata)
      `);

      // Image tags table for better tag searching
      await client.query(`
        CREATE TABLE IF NOT EXISTS image_tags (
          id SERIAL PRIMARY KEY,
          image_id VARCHAR(255) NOT NULL,
          tag VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (image_id) REFERENCES generated_images(id) ON DELETE CASCADE
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_image_tags_image 
        ON image_tags(image_id)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_image_tags_tag 
        ON image_tags(tag)
      `);

      console.log('✅ Image Storage schema initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing Image Storage schema:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Store a generated image with metadata
   */
  async storeImage(imageResult: EntityImageResult): Promise<string> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const imageId = `img_${imageResult.entityId}_${Date.now()}`;

      // Insert main image record
      await client.query(`
        INSERT INTO generated_images (
          id, entity_id, entity_type, image_url, thumbnail_url, metadata, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        imageId,
        imageResult.entityId,
        imageResult.entityType,
        imageResult.imageUrl,
        imageResult.thumbnailUrl,
        JSON.stringify(imageResult.metadata),
        'completed'
      ]);

      // Insert tags
      if (imageResult.metadata.tags && imageResult.metadata.tags.length > 0) {
        for (const tag of imageResult.metadata.tags) {
          await client.query(`
            INSERT INTO image_tags (image_id, tag) VALUES ($1, $2)
          `, [imageId, tag]);
        }
      }

      await client.query('COMMIT');
      console.log(`✅ Stored image for ${imageResult.entityType} ${imageResult.entityId}`);
      return imageId;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error storing image:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get image by entity ID and type
   */
  async getImageByEntity(entityId: string, entityType: string): Promise<StoredImage | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM generated_images 
        WHERE entity_id = $1 AND entity_type = $2 AND status = 'completed'
        ORDER BY created_at DESC 
        LIMIT 1
      `, [entityId, entityType]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToStoredImage(result.rows[0]);

    } catch (error) {
      console.error('❌ Error getting image by entity:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get image by ID
   */
  async getImageById(imageId: string): Promise<StoredImage | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM generated_images WHERE id = $1
      `, [imageId]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToStoredImage(result.rows[0]);

    } catch (error) {
      console.error('❌ Error getting image by ID:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Search images with filters
   */
  async searchImages(filters: ImageSearchFilters): Promise<{ images: StoredImage[]; total: number }> {
    const client = await this.pool.connect();
    try {
      let whereConditions: string[] = [];
      let queryParams: any[] = [];
      let paramIndex = 1;

      // Build WHERE conditions
      if (filters.entityType) {
        whereConditions.push(`entity_type = $${paramIndex++}`);
        queryParams.push(filters.entityType);
      }

      if (filters.entityId) {
        whereConditions.push(`entity_id = $${paramIndex++}`);
        queryParams.push(filters.entityId);
      }

      if (filters.status) {
        whereConditions.push(`status = $${paramIndex++}`);
        queryParams.push(filters.status);
      }

      if (filters.style) {
        whereConditions.push(`metadata->>'style' = $${paramIndex++}`);
        queryParams.push(filters.style);
      }

      if (filters.dateRange) {
        whereConditions.push(`created_at >= $${paramIndex++} AND created_at <= $${paramIndex++}`);
        queryParams.push(filters.dateRange.start, filters.dateRange.end);
      }

      // Handle tags filter
      if (filters.tags && filters.tags.length > 0) {
        const tagConditions = filters.tags.map(() => `$${paramIndex++}`).join(',');
        whereConditions.push(`
          id IN (
            SELECT DISTINCT image_id FROM image_tags 
            WHERE tag IN (${tagConditions})
          )
        `);
        queryParams.push(...filters.tags);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Get total count
      const countResult = await client.query(`
        SELECT COUNT(*) as total FROM generated_images ${whereClause}
      `, queryParams);

      const total = parseInt(countResult.rows[0].total);

      // Get images with pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;

      const imagesResult = await client.query(`
        SELECT * FROM generated_images 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `, [...queryParams, limit, offset]);

      const images = imagesResult.rows.map(row => this.mapRowToStoredImage(row));

      return { images, total };

    } catch (error) {
      console.error('❌ Error searching images:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update image status
   */
  async updateImageStatus(imageId: string, status: StoredImage['status']): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        UPDATE generated_images 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `, [status, imageId]);

      console.log(`✅ Updated image ${imageId} status to ${status}`);

    } catch (error) {
      console.error('❌ Error updating image status:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete image
   */
  async deleteImage(imageId: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Delete tags first (foreign key constraint)
      await client.query(`DELETE FROM image_tags WHERE image_id = $1`, [imageId]);

      // Delete image record
      await client.query(`DELETE FROM generated_images WHERE id = $1`, [imageId]);

      await client.query('COMMIT');
      console.log(`✅ Deleted image ${imageId}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error deleting image:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get images by entity type with pagination
   */
  async getImagesByEntityType(
    entityType: string, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<{ images: StoredImage[]; total: number }> {
    return this.searchImages({
      entityType,
      status: 'completed',
      limit,
      offset
    });
  }

  /**
   * Get recent images
   */
  async getRecentImages(limit: number = 10): Promise<StoredImage[]> {
    const result = await this.searchImages({
      status: 'completed',
      limit
    });
    return result.images;
  }

  /**
   * Get images by tags
   */
  async getImagesByTags(tags: string[], limit: number = 20): Promise<StoredImage[]> {
    const result = await this.searchImages({
      tags,
      status: 'completed',
      limit
    });
    return result.images;
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalImages: number;
    imagesByType: { [entityType: string]: number };
    imagesByStatus: { [status: string]: number };
    recentActivity: { date: string; count: number }[];
  }> {
    const client = await this.pool.connect();
    try {
      // Total images
      const totalResult = await client.query(`SELECT COUNT(*) as total FROM generated_images`);
      const totalImages = parseInt(totalResult.rows[0].total);

      // Images by type
      const typeResult = await client.query(`
        SELECT entity_type, COUNT(*) as count 
        FROM generated_images 
        GROUP BY entity_type 
        ORDER BY count DESC
      `);
      const imagesByType: { [entityType: string]: number } = {};
      typeResult.rows.forEach(row => {
        imagesByType[row.entity_type] = parseInt(row.count);
      });

      // Images by status
      const statusResult = await client.query(`
        SELECT status, COUNT(*) as count 
        FROM generated_images 
        GROUP BY status 
        ORDER BY count DESC
      `);
      const imagesByStatus: { [status: string]: number } = {};
      statusResult.rows.forEach(row => {
        imagesByStatus[row.status] = parseInt(row.count);
      });

      // Recent activity (last 7 days)
      const activityResult = await client.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM generated_images 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at) 
        ORDER BY date DESC
      `);
      const recentActivity = activityResult.rows.map(row => ({
        date: row.date,
        count: parseInt(row.count)
      }));

      return {
        totalImages,
        imagesByType,
        imagesByStatus,
        recentActivity
      };

    } catch (error) {
      console.error('❌ Error getting storage stats:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Map database row to StoredImage object
   */
  private mapRowToStoredImage(row: any): StoredImage {
    return {
      id: row.id,
      entityId: row.entity_id,
      entityType: row.entity_type,
      imageUrl: row.image_url,
      thumbnailUrl: row.thumbnail_url,
      metadata: row.metadata,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Clean up old images (archive or delete based on age)
   */
  async cleanupOldImages(daysOld: number = 90): Promise<number> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        UPDATE generated_images 
        SET status = 'archived', updated_at = CURRENT_TIMESTAMP
        WHERE created_at < CURRENT_DATE - INTERVAL '${daysOld} days' 
        AND status = 'completed'
      `);

      const archivedCount = result.rowCount || 0;
      console.log(`✅ Archived ${archivedCount} old images`);
      return archivedCount;

    } catch (error) {
      console.error('❌ Error cleaning up old images:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Global instance for easy access
let globalImageStorageService: ImageStorageService | null = null;

export function getImageStorageService(pool?: Pool): ImageStorageService {
  if (!globalImageStorageService && pool) {
    globalImageStorageService = new ImageStorageService(pool);
  }
  if (!globalImageStorageService) {
    throw new Error('ImageStorageService not initialized. Please provide a database pool.');
  }
  return globalImageStorageService;
}

export function initializeImageStorageService(pool: Pool): ImageStorageService {
  globalImageStorageService = new ImageStorageService(pool);
  return globalImageStorageService;
}
