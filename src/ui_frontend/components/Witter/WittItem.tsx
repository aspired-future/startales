import React, { useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Witt } from './WitterFeed';
import './WittItem.css';

interface WittItemProps {
  witt: Witt;
  isFollowing: boolean;
  onInteraction: (wittId: string, type: 'LIKE' | 'SHARE' | 'COMMENT', content?: string) => void;
  onFollow: (entityId: string, entityType: string, isFollowing: boolean) => void;
  onOpenComments: (wittId: string) => void;
  onViewProfile: (profileId: string) => void;
  gameContext: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
  };
}

export const WittItem: React.FC<WittItemProps> = ({
  witt,
  isFollowing,
  onInteraction,
  onFollow,
  onOpenComments,
  onViewProfile,
  gameContext
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);

  // Get author type display info
  const getAuthorTypeInfo = (authorType: string) => {
    switch (authorType) {
      case 'CITIZEN':
        return { icon: '👤', label: 'Citizen', color: '#6B7280' };
      case 'PERSONALITY':
        return { icon: '⭐', label: 'Personality', color: '#F59E0B' };
      case 'CITY_LEADER':
        return { icon: '🏛️', label: 'City Leader', color: '#3B82F6' };
      case 'PLANET_LEADER':
        return { icon: '🌍', label: 'Planet Leader', color: '#10B981' };
      case 'DIVISION_LEADER':
        return { icon: '⚔️', label: 'Division Leader', color: '#EF4444' };
      case 'PLAYER':
        return { icon: '🎮', label: 'Player', color: '#8B5CF6' };
      default:
        return { icon: '❓', label: 'Unknown', color: '#6B7280' };
    }
  };

  const authorInfo = getAuthorTypeInfo(witt.authorType);

  // Handle interaction with loading state
  const handleInteractionClick = useCallback(async (type: 'LIKE' | 'SHARE' | 'COMMENT', content?: string) => {
    if (isInteracting) return;
    
    setIsInteracting(true);
    try {
      await onInteraction(witt.id, type, content);
      
      if (type === 'COMMENT') {
        setCommentText('');
        setShowComments(true);
      }
    } finally {
      setIsInteracting(false);
    }
  }, [isInteracting, onInteraction, witt.id]);

  // Handle follow/unfollow
  const handleFollowClick = useCallback(() => {
    onFollow(witt.authorId, witt.authorType, isFollowing);
  }, [onFollow, witt.authorId, witt.authorType, isFollowing]);

  // Handle comment submission
  const handleCommentSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      handleInteractionClick('COMMENT', commentText.trim());
    }
  }, [commentText, handleInteractionClick]);

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(witt.timestamp), { addSuffix: true });

  // Check if content is contextually relevant
  const isContextuallyRelevant = witt.metadata.relevantEntities.some(entity => 
    gameContext.currentLocation?.includes(entity) ||
    gameContext.recentEvents?.some(event => event.includes(entity))
  );

  return (
    <div className={`witt-item ${isContextuallyRelevant ? 'contextually-relevant' : ''}`}>
      <div className="witt-header">
        <div className="witt-author">
          <div className="author-avatar">
            {witt.authorAvatar ? (
              <img src={witt.authorAvatar} alt={witt.authorName} />
            ) : (
              <span className="avatar-placeholder" style={{ backgroundColor: authorInfo.color }}>
                {authorInfo.icon}
              </span>
            )}
          </div>
          
          <div className="author-info">
            <div className="author-name">
              <button 
                className="name-button"
                onClick={() => onViewProfile(witt.authorId)}
                title="View profile"
              >
                {witt.authorName}
              </button>
              <span className="author-type" style={{ color: authorInfo.color }}>
                {authorInfo.icon} {authorInfo.label}
              </span>
            </div>
            <div className="witt-timestamp">{timeAgo}</div>
          </div>
        </div>

        <div className="witt-actions">
          {witt.authorType !== 'PLAYER' && (
            <button
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowClick}
              disabled={isInteracting}
            >
              {isFollowing ? '✓ Following' : '+ Follow'}
            </button>
          )}
          
          {witt.visibility === 'PERSONALIZED' && (
            <span className="visibility-indicator" title="Personalized content">
              🎯
            </span>
          )}
          
          {isContextuallyRelevant && (
            <span className="relevance-indicator" title="Relevant to your current context">
              ⚡
            </span>
          )}
        </div>
      </div>

      <div className="witt-content">
        <p>{witt.content}</p>
        
        {witt.metadata.gameContext && (
          <div className="witt-context">
            <span className="context-tag">📍 {witt.metadata.gameContext}</span>
          </div>
        )}
      </div>

      <div className="witt-interactions">
        <button
          className={`interaction-btn like-btn ${witt.isLiked ? 'active' : ''}`}
          onClick={() => handleInteractionClick('LIKE')}
          disabled={isInteracting}
        >
          <span className="icon">👍</span>
          <span className="count">{witt.metrics.likes}</span>
        </button>

        <button
          className={`interaction-btn share-btn ${witt.isShared ? 'active' : ''}`}
          onClick={() => handleInteractionClick('SHARE')}
          disabled={isInteracting}
        >
          <span className="icon">🔄</span>
          <span className="count">{witt.metrics.shares}</span>
        </button>

        <button
          className="interaction-btn comment-btn"
          onClick={() => onOpenComments(witt.id)}
        >
          <span className="icon">💬</span>
          <span className="count">{witt.metrics.comments}</span>
        </button>
      </div>


    </div>
  );
};

export default WittItem;
