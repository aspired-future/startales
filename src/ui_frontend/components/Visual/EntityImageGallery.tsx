/**
 * EntityImageGallery - React component for displaying a gallery of entity images
 */

import React, { useState, useEffect } from 'react';
import EntityImage from './EntityImage';
import './EntityImageGallery.css';

export interface GalleryItem {
  entityId: string;
  entityType: 'planet' | 'city' | 'character' | 'species' | 'logo' | 'civilization';
  entityName?: string;
  description?: string;
}

export interface EntityImageGalleryProps {
  items: GalleryItem[];
  title?: string;
  layout?: 'grid' | 'list' | 'carousel';
  imageSize?: 'small' | 'medium' | 'large' | 'xl';
  imageShape?: 'square' | 'circle' | 'rounded';
  showMetadata?: boolean;
  showPlaceholders?: boolean;
  onItemClick?: (item: GalleryItem) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export const EntityImageGallery: React.FC<EntityImageGalleryProps> = ({
  items,
  title,
  layout = 'grid',
  imageSize = 'medium',
  imageShape = 'rounded',
  showMetadata = false,
  showPlaceholders = true,
  onItemClick,
  className = '',
  emptyMessage = 'No items to display',
  loading = false
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleItemClick = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    onItemClick?.(item);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedItem(items[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedItem(items[newIndex]);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const renderGridLayout = () => (
    <div className="entity-gallery__grid">
      {items.map((item, index) => (
        <div key={`${item.entityType}-${item.entityId}`} className="entity-gallery__grid-item">
          <EntityImage
            entityId={item.entityId}
            entityType={item.entityType}
            entityName={item.entityName}
            size={imageSize}
            shape={imageShape}
            showPlaceholder={showPlaceholders}
            showMetadata={showMetadata}
            onClick={() => handleItemClick(item, index)}
            className="entity-gallery__image"
          />
          {item.entityName && (
            <div className="entity-gallery__item-name">
              {item.entityName}
            </div>
          )}
          {item.description && (
            <div className="entity-gallery__item-description">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="entity-gallery__list">
      {items.map((item, index) => (
        <div key={`${item.entityType}-${item.entityId}`} className="entity-gallery__list-item">
          <EntityImage
            entityId={item.entityId}
            entityType={item.entityType}
            entityName={item.entityName}
            size="small"
            shape={imageShape}
            showPlaceholder={showPlaceholders}
            onClick={() => handleItemClick(item, index)}
            className="entity-gallery__list-image"
          />
          <div className="entity-gallery__list-content">
            <div className="entity-gallery__list-name">
              {item.entityName || `${item.entityType} ${item.entityId}`}
            </div>
            {item.description && (
              <div className="entity-gallery__list-description">
                {item.description}
              </div>
            )}
            <div className="entity-gallery__list-type">
              {item.entityType}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className="entity-gallery__carousel">
      <div className="entity-gallery__carousel-container">
        {items.map((item, index) => (
          <div 
            key={`${item.entityType}-${item.entityId}`} 
            className={`entity-gallery__carousel-item ${index === currentIndex ? 'active' : ''}`}
          >
            <EntityImage
              entityId={item.entityId}
              entityType={item.entityType}
              entityName={item.entityName}
              size={imageSize}
              shape={imageShape}
              showPlaceholder={showPlaceholders}
              showMetadata={showMetadata}
              onClick={() => handleItemClick(item, index)}
              className="entity-gallery__carousel-image"
            />
            {item.entityName && (
              <div className="entity-gallery__carousel-name">
                {item.entityName}
              </div>
            )}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className="entity-gallery__carousel-controls">
          <button 
            className="entity-gallery__carousel-btn entity-gallery__carousel-btn--prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ‹
          </button>
          <div className="entity-gallery__carousel-indicators">
            {items.map((_, index) => (
              <button
                key={index}
                className={`entity-gallery__carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <button 
            className="entity-gallery__carousel-btn entity-gallery__carousel-btn--next"
            onClick={handleNext}
            disabled={currentIndex === items.length - 1}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="entity-gallery__loading">
          <div className="entity-gallery__spinner"></div>
          <span>Loading images...</span>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="entity-gallery__empty">
          <span className="entity-gallery__empty-icon">🖼️</span>
          <span className="entity-gallery__empty-message">{emptyMessage}</span>
        </div>
      );
    }

    switch (layout) {
      case 'list':
        return renderListLayout();
      case 'carousel':
        return renderCarouselLayout();
      case 'grid':
      default:
        return renderGridLayout();
    }
  };

  const galleryClasses = [
    'entity-gallery',
    `entity-gallery--${layout}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={galleryClasses}>
      {title && (
        <div className="entity-gallery__header">
          <h3 className="entity-gallery__title">{title}</h3>
          <div className="entity-gallery__count">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      )}
      
      <div className="entity-gallery__content">
        {renderContent()}
      </div>

      {/* Modal for enlarged view */}
      {selectedItem && (
        <div className="entity-gallery__modal" onClick={closeModal}>
          <div className="entity-gallery__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="entity-gallery__modal-close" onClick={closeModal}>
              ×
            </button>
            
            <div className="entity-gallery__modal-image">
              <EntityImage
                entityId={selectedItem.entityId}
                entityType={selectedItem.entityType}
                entityName={selectedItem.entityName}
                size="xl"
                shape="rounded"
                showPlaceholder={showPlaceholders}
                showMetadata={true}
                className="entity-gallery__modal-img"
              />
            </div>
            
            <div className="entity-gallery__modal-info">
              <h4 className="entity-gallery__modal-name">
                {selectedItem.entityName || `${selectedItem.entityType} ${selectedItem.entityId}`}
              </h4>
              <div className="entity-gallery__modal-type">
                {selectedItem.entityType}
              </div>
              {selectedItem.description && (
                <div className="entity-gallery__modal-description">
                  {selectedItem.description}
                </div>
              )}
            </div>

            {items.length > 1 && (
              <div className="entity-gallery__modal-nav">
                <button 
                  className="entity-gallery__modal-nav-btn entity-gallery__modal-nav-btn--prev"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  ‹ Previous
                </button>
                <span className="entity-gallery__modal-nav-counter">
                  {currentIndex + 1} of {items.length}
                </span>
                <button 
                  className="entity-gallery__modal-nav-btn entity-gallery__modal-nav-btn--next"
                  onClick={handleNext}
                  disabled={currentIndex === items.length - 1}
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityImageGallery;
