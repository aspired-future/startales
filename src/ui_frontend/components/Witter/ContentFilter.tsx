import React from 'react';
import './ContentFilter.css';

export type ContentCategory = 
  | 'all'
  | 'news'
  | 'discoveries'
  | 'social'
  | 'trade'
  | 'politics'
  | 'science'
  | 'exploration'
  | 'military'
  | 'culture';

export interface ContentFilterProps {
  selectedCategory: ContentCategory;
  onCategoryChange: (category: ContentCategory) => void;
  postCounts?: Record<ContentCategory, number>;
}

export const ContentFilter: React.FC<ContentFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  postCounts = {}
}) => {
  const categories: Array<{ key: ContentCategory; label: string; icon: string }> = [
    { key: 'all', label: 'All Posts', icon: '📋' },
    { key: 'news', label: 'Galactic News', icon: '📰' },
    { key: 'discoveries', label: 'Discoveries', icon: '🔬' },
    { key: 'social', label: 'Social', icon: '👥' },
    { key: 'trade', label: 'Trade', icon: '💰' },
    { key: 'politics', label: 'Politics', icon: '🏛️' },
    { key: 'science', label: 'Science', icon: '🧪' },
    { key: 'exploration', label: 'Exploration', icon: '🚀' },
    { key: 'military', label: 'Military', icon: '⚔️' },
    { key: 'culture', label: 'Culture', icon: '🎭' }
  ];

  return (
    <div className="content-filter">
      <div className="filter-header">
        <h3>Filter Content</h3>
      </div>
      <div className="filter-categories">
        {categories.map((category) => (
          <button
            key={category.key}
            className={`filter-btn ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.key)}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-label">{category.label}</span>
            {postCounts[category.key] !== undefined && (
              <span className="filter-count">{postCounts[category.key]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};