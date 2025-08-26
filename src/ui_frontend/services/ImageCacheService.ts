/**
 * Image Cache Service - Stores and reuses generated images
 * Prevents regenerating the same images multiple times
 */

export interface CachedImage {
  id: string;
  entityId: string;
  entityType: string;
  entityName: string;
  prompt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  generatedAt: Date;
  lastUsed: Date;
  useCount: number;
  metadata: {
    civilization?: string;
    era?: string;
    mood?: string;
    setting?: string;
    dimensions: { width: number; height: number };
    fileSize: number;
    tags: string[];
  };
}

export interface ImageGenerationRequest {
  entityId: string;
  entityType: string;
  entityName: string;
  civilization?: string;
  era?: string;
  mood?: string;
  setting?: string;
  forceRegenerate?: boolean;
}

class ImageCacheService {
  private cache: Map<string, CachedImage> = new Map();
  private readonly CACHE_KEY = 'spaceciv_image_cache';
  private readonly MAX_CACHE_SIZE = 500; // Maximum number of cached images
  private readonly CACHE_EXPIRY_DAYS = 30; // Images expire after 30 days

  constructor() {
    this.loadCacheFromStorage();
  }

  /**
   * Load cache from localStorage
   */
  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const cacheData = JSON.parse(stored);
        this.cache = new Map(
          cacheData.map((item: any) => [
            item.id,
            {
              ...item,
              generatedAt: new Date(item.generatedAt),
              lastUsed: new Date(item.lastUsed)
            }
          ])
        );
        
        // Clean expired entries
        this.cleanExpiredEntries();
      }
    } catch (error) {
      console.warn('Failed to load image cache from storage:', error);
      this.cache = new Map();
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveCacheToStorage(): void {
    try {
      const cacheArray = Array.from(this.cache.values());
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheArray));
    } catch (error) {
      console.warn('Failed to save image cache to storage:', error);
    }
  }

  /**
   * Generate cache key for an image request
   */
  private generateCacheKey(request: ImageGenerationRequest): string {
    const keyParts = [
      request.entityId,
      request.entityType,
      request.entityName,
      request.civilization || '',
      request.era || '',
      request.mood || '',
      request.setting || ''
    ];
    
    return keyParts.join('|').toLowerCase();
  }

  /**
   * Check if an image exists in cache
   */
  public hasImage(request: ImageGenerationRequest): boolean {
    if (request.forceRegenerate) return false;
    
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) return false;
    
    // Check if image is expired
    const daysSinceGenerated = (Date.now() - cached.generatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceGenerated > this.CACHE_EXPIRY_DAYS) {
      this.cache.delete(cacheKey);
      this.saveCacheToStorage();
      return false;
    }
    
    return true;
  }

  /**
   * Get cached image
   */
  public getCachedImage(request: ImageGenerationRequest): CachedImage | null {
    if (request.forceRegenerate) return null;
    
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      // Update usage statistics
      cached.lastUsed = new Date();
      cached.useCount += 1;
      this.saveCacheToStorage();
      
      return cached;
    }
    
    return null;
  }

  /**
   * Store generated image in cache
   */
  public storeImage(
    request: ImageGenerationRequest,
    imageUrl: string,
    thumbnailUrl?: string,
    metadata?: Partial<CachedImage['metadata']>
  ): CachedImage {
    const cacheKey = this.generateCacheKey(request);
    
    const cachedImage: CachedImage = {
      id: cacheKey,
      entityId: request.entityId,
      entityType: request.entityType,
      entityName: request.entityName,
      prompt: '', // Will be set by the calling service
      imageUrl,
      thumbnailUrl,
      generatedAt: new Date(),
      lastUsed: new Date(),
      useCount: 1,
      metadata: {
        civilization: request.civilization,
        era: request.era,
        mood: request.mood,
        setting: request.setting,
        dimensions: { width: 1024, height: 1024 },
        fileSize: 0,
        tags: [],
        ...metadata
      }
    };
    
    // Check cache size and remove oldest entries if needed
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.removeOldestEntries(Math.floor(this.MAX_CACHE_SIZE * 0.1)); // Remove 10% of entries
    }
    
    this.cache.set(cacheKey, cachedImage);
    this.saveCacheToStorage();
    
    return cachedImage;
  }

  /**
   * Remove oldest entries from cache
   */
  private removeOldestEntries(count: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastUsed.getTime() - b.lastUsed.getTime());
    
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Clean expired entries from cache
   */
  private cleanExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((cached, key) => {
      const daysSinceGenerated = (now - cached.generatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceGenerated > this.CACHE_EXPIRY_DAYS) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      this.saveCacheToStorage();
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    totalImages: number;
    totalUses: number;
    cacheSize: string;
    oldestImage: Date | null;
    newestImage: Date | null;
  } {
    const images = Array.from(this.cache.values());
    
    return {
      totalImages: images.length,
      totalUses: images.reduce((sum, img) => sum + img.useCount, 0),
      cacheSize: `${(JSON.stringify(Array.from(this.cache.values())).length / 1024).toFixed(2)} KB`,
      oldestImage: images.length > 0 ? new Date(Math.min(...images.map(img => img.generatedAt.getTime()))) : null,
      newestImage: images.length > 0 ? new Date(Math.max(...images.map(img => img.generatedAt.getTime()))) : null
    };
  }

  /**
   * Clear entire cache
   */
  public clearCache(): void {
    this.cache.clear();
    localStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * Remove specific image from cache
   */
  public removeImage(request: ImageGenerationRequest): boolean {
    const cacheKey = this.generateCacheKey(request);
    const removed = this.cache.delete(cacheKey);
    
    if (removed) {
      this.saveCacheToStorage();
    }
    
    return removed;
  }

  /**
   * Get all cached images for a specific entity
   */
  public getEntityImages(entityId: string): CachedImage[] {
    return Array.from(this.cache.values())
      .filter(cached => cached.entityId === entityId)
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  }

  /**
   * Get all cached images by type
   */
  public getImagesByType(entityType: string): CachedImage[] {
    return Array.from(this.cache.values())
      .filter(cached => cached.entityType === entityType)
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  }

  /**
   * Search cached images by tags
   */
  public searchByTags(tags: string[]): CachedImage[] {
    return Array.from(this.cache.values())
      .filter(cached => 
        tags.some(tag => 
          cached.metadata.tags.some(cachedTag => 
            cachedTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      )
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  }

  /**
   * Update image metadata
   */
  public updateImageMetadata(
    request: ImageGenerationRequest,
    metadata: Partial<CachedImage['metadata']>
  ): boolean {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      cached.metadata = { ...cached.metadata, ...metadata };
      this.saveCacheToStorage();
      return true;
    }
    
    return false;
  }

  /**
   * Preload commonly used images
   */
  public async preloadCommonImages(): Promise<void> {
    // This would typically load frequently used character portraits,
    // civilization logos, and common UI elements
    const commonRequests: ImageGenerationRequest[] = [
      { entityId: 'terran_logo', entityType: 'logo', entityName: 'Terran Federation Logo', civilization: 'Terran Federation' },
      { entityId: 'zephyrian_logo', entityType: 'logo', entityName: 'Zephyrian Empire Logo', civilization: 'Zephyrian Empire' },
      { entityId: 'centauri_logo', entityType: 'logo', entityName: 'Centauri Republic Logo', civilization: 'Centauri Republic' },
      // Add more common images as needed
    ];

    // In a real implementation, this would trigger image generation for missing items
    console.log('Preloading common images...', commonRequests);
  }
}

// Export singleton instance
export const imageCacheService = new ImageCacheService();
export default imageCacheService;
