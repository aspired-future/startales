/**
 * EntityImage - React component for displaying generated entity images
 * Now with detailed space civ prompts and caching
 */

import React, { useState, useEffect } from 'react';
import SpaceCivPromptGenerator, { EntityContext } from '../../utils/SpaceCivPrompts';
import imageCacheService, { ImageGenerationRequest } from '../../services/ImageCacheService';
import './EntityImage.css';

export interface EntityImageProps {
  entityId: string;
  entityType: 'planet' | 'city' | 'character' | 'species' | 'logo' | 'civilization' | 'spaceship' | 'unit' | 'weapon' | 'building' | 'environment' | 'effect' | 'cutscene';
  entityName?: string;
  civilization?: string;
  era?: 'early_space' | 'interstellar' | 'galactic' | 'transcendent';
  mood?: 'peaceful' | 'tense' | 'dramatic' | 'mysterious' | 'heroic' | 'ominous';
  setting?: 'space' | 'planet_surface' | 'city' | 'ship_interior' | 'station' | 'void';
  size?: 'small' | 'medium' | 'large' | 'xl';
  shape?: 'square' | 'circle' | 'rounded';
  showPlaceholder?: boolean;
  showMetadata?: boolean;
  forceRegenerate?: boolean;
  onClick?: () => void;
  className?: string;
  alt?: string;
}

export interface EntityImageData {
  imageUrl: string;
  thumbnailUrl?: string;
  metadata: {
    generatedAt: Date;
    prompt: string;
    style: string;
    dimensions: { width: number; height: number };
    tags: string[];
  };
}

export const EntityImage: React.FC<EntityImageProps> = ({
  entityId,
  entityType,
  entityName,
  civilization,
  era = 'interstellar',
  mood = 'heroic',
  setting = 'space',
  size = 'medium',
  shape = 'rounded',
  showPlaceholder = true,
  showMetadata = false,
  forceRegenerate = false,
  onClick,
  className = '',
  alt
}) => {
  const [imageData, setImageData] = useState<EntityImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadEntityImage();
  }, [entityId, entityType, civilization, era, mood, setting, forceRegenerate]);

  const loadEntityImage = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      // Create image generation request
      const request: ImageGenerationRequest = {
        entityId,
        entityType,
        entityName: entityName || entityId,
        civilization,
        era,
        mood,
        setting,
        forceRegenerate
      };

      // Check cache first (unless force regenerate)
      const cachedImage = imageCacheService.getCachedImage(request);
      if (cachedImage && !forceRegenerate) {
        setImageData({
          imageUrl: cachedImage.imageUrl,
          thumbnailUrl: cachedImage.thumbnailUrl,
          metadata: {
            generatedAt: cachedImage.generatedAt,
            prompt: cachedImage.prompt,
            style: 'Space Civilization Game Style',
            dimensions: cachedImage.metadata.dimensions,
            tags: cachedImage.metadata.tags
          }
        });
        setIsLoading(false);
        return;
      }

      // Generate detailed prompt using SpaceCivPromptGenerator
      const context: EntityContext = {
        entityType: entityType as any,
        entityName: entityName || entityId,
        civilization,
        era,
        mood,
        setting
      };

      const detailedPrompt = SpaceCivPromptGenerator.generatePrompt(context);

      // Try to fetch from API with detailed prompt
      const response = await fetch(`/api/visual-systems/images/${entityType}/${entityId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: detailedPrompt,
          context,
          forceRegenerate
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setImageData(data);
        
        // Store in cache
        const cached = imageCacheService.storeImage(
          request,
          data.imageUrl,
          data.thumbnailUrl,
          {
            dimensions: data.metadata?.dimensions || { width: 1024, height: 1024 },
            tags: data.metadata?.tags || [],
            fileSize: 0
          }
        );
        
        // Update cached image with prompt
        cached.prompt = detailedPrompt;
        
      } else if (response.status === 404) {
        // No image found, show placeholder if enabled
        setImageData(null);
      } else {
        throw new Error(`Failed to load image: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading entity image:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClass = () => {
    const sizeClasses = {
      small: 'entity-image--small',
      medium: 'entity-image--medium',
      large: 'entity-image--large',
      xl: 'entity-image--xl'
    };
    return sizeClasses[size];
  };

  const getShapeClass = () => {
    const shapeClasses = {
      square: 'entity-image--square',
      circle: 'entity-image--circle',
      rounded: 'entity-image--rounded'
    };
    return shapeClasses[shape];
  };

  const getPlaceholderIcon = () => {
    const icons = {
      planet: '🌍',
      city: '🏙️',
      character: '👤',
      species: '🧬',
      logo: '🎨',
      civilization: '🏛️'
    };
    return icons[entityType] || '🖼️';
  };

  const getEntityTypeLabel = () => {
    const labels = {
      planet: 'Planet',
      city: 'City',
      character: 'Character',
      species: 'Species',
      logo: 'Logo',
      civilization: 'Civilization'
    };
    return labels[entityType];
  };

  const handleImageError = () => {
    setHasError(true);
  };

  const renderImage = () => {
    if (isLoading) {
      return (
        <div className="entity-image__loading">
          <div className="entity-image__spinner"></div>
          <span>Generating...</span>
        </div>
      );
    }

    if (hasError || (!imageData && !showPlaceholder)) {
      return (
        <div className="entity-image__error">
          <span className="entity-image__error-icon">⚠️</span>
          <span>Failed to load</span>
        </div>
      );
    }

    if (!imageData && showPlaceholder) {
      return (
        <div className="entity-image__placeholder">
          <span className="entity-image__placeholder-icon">
            {getPlaceholderIcon()}
          </span>
          <span className="entity-image__placeholder-text">
            {entityName || getEntityTypeLabel()}
          </span>
        </div>
      );
    }

    if (imageData) {
      const imageUrl = imageData.thumbnailUrl || imageData.imageUrl;
      const imageAlt = alt || `${getEntityTypeLabel()} ${entityName || entityId}`;

      return (
        <>
          <img
            src={imageUrl}
            alt={imageAlt}
            className="entity-image__img"
            onError={handleImageError}
          />
          {showMetadata && (
            <div className="entity-image__metadata">
              <div className="entity-image__metadata-item">
                <span className="entity-image__metadata-label">Style:</span>
                <span className="entity-image__metadata-value">{imageData.metadata.style}</span>
              </div>
              <div className="entity-image__metadata-item">
                <span className="entity-image__metadata-label">Tags:</span>
                <span className="entity-image__metadata-value">
                  {imageData.metadata.tags.join(', ')}
                </span>
              </div>
              <div className="entity-image__metadata-item">
                <span className="entity-image__metadata-label">Generated:</span>
                <span className="entity-image__metadata-value">
                  {new Date(imageData.metadata.generatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  const containerClasses = [
    'entity-image',
    getSizeClass(),
    getShapeClass(),
    onClick ? 'entity-image--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={containerClasses}
      onClick={onClick}
      title={alt || `${getEntityTypeLabel()} ${entityName || entityId}`}
    >
      {renderImage()}
    </div>
  );
};

export default EntityImage;
