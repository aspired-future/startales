import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ModernWitterFeed.css';

interface WittPost {
  id: string;
  authorId: string;
  authorName: string;
  authorType: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  isLiked: boolean;
  isShared: boolean;
  avatar?: string;
  followers?: number;
  image?: {
    url: string;
    alt: string;
    type: string;
  };
  metadata: {
    gameContext: string;
    location: string;
    civilization?: string;
    sourceType?: string;
    category: string;
    topics: string[];
    personality: string;
    hasImage?: boolean;
  };
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorType: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

interface ModernWitterFeedProps {
  playerId: string;
}

export const ModernWitterFeed: React.FC<ModernWitterFeedProps> = ({ playerId }) => {
  const [posts, setPosts] = useState<WittPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [civilizationFilter, setCivilizationFilter] = useState('all');
  const [starSystemFilter, setStarSystemFilter] = useState('all');
  const [planetFilter, setPlanetFilter] = useState('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState('all');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Map<string, Comment[]>>(new Map());
  const [newComment, setNewComment] = useState<Map<string, string>>(new Map());
  const [follows, setFollows] = useState<Set<string>>(new Set());
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());
  const [showProfile, setShowProfile] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');
  const [filters, setFilters] = useState<any>({ civilizations: [], starSystems: [], planets: [], sourceTypes: [] });
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async (offset = 0, reset = false) => {
    try {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        limit: '10',
        offset: offset.toString(),
        playerId
      });
      
      if (civilizationFilter !== 'all') {
        params.append('civilization', civilizationFilter);
      }
      
      if (starSystemFilter !== 'all') {
        params.append('starSystem', starSystemFilter);
      }
      
      if (planetFilter !== 'all') {
        params.append('planet', planetFilter);
      }
      
      if (sourceTypeFilter !== 'all') {
        params.append('sourceType', sourceTypeFilter);
      }
      
      const url = `http://localhost:4000/api/witter/feed?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.posts) {
        if (reset || offset === 0) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.pagination?.hasMore || false);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('❌ Failed to fetch Witter posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [civilizationFilter, starSystemFilter, planetFilter, sourceTypeFilter]);

  const loadFilters = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/witter/filters');
      if (response.ok) {
        const data = await response.json();
        setFilters(data);
      }
    } catch (err) {
      console.error('Failed to load filters:', err);
    }
  }, []);

  useEffect(() => {
    loadFilters();
    loadPosts(0, true);
  }, [loadPosts, loadFilters]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || loadingMore || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadPosts(posts.length);
    }
  }, [posts.length, loadingMore, hasMore, loadPosts]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/witter/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prev => prev.map(post => 
          post.id === postId ? updatedPost.post : post
        ));
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/witter/posts/${postId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prev => prev.map(post => 
          post.id === postId ? updatedPost.post : post
        ));
      }
    } catch (err) {
      console.error('Failed to share post:', err);
    }
  };

  const loadComments = async (postId: string) => {
    if (loadingComments.has(postId)) return;
    
    setLoadingComments(prev => new Set(prev).add(postId));
    
    try {
      const response = await fetch(`http://localhost:4000/api/witter/post/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(prev => new Map(prev).set(postId, data.comments));
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments.has(postId);
    
    if (isExpanded) {
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setExpandedComments(prev => new Set(prev).add(postId));
      if (!comments.has(postId)) {
        await loadComments(postId);
      }
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const commentContent = newComment.get(postId);
    if (!commentContent?.trim()) return;

    try {
      const response = await fetch(`http://localhost:4000/api/witter/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          authorId: playerId,
          authorName: 'Commander Alpha'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update comments
        setComments(prev => {
          const newComments = new Map(prev);
          const postComments = newComments.get(postId) || [];
          newComments.set(postId, [...postComments, data.comment]);
          return newComments;
        });
        
        // Update post comment count
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, comments: post.comments + 1 } : post
        ));
        
        // Clear comment input
        setNewComment(prev => {
          const newMap = new Map(prev);
          newMap.delete(postId);
          return newMap;
        });

        // Auto-scroll to the new comment after a brief delay
        setTimeout(() => {
          const commentSection = document.querySelector(`[data-post-id="${postId}"] .comments-section`);
          if (commentSection) {
            commentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 500);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const submitReply = async (commentId: string, postId: string) => {
    if (!newReply.trim()) return;

    try {
      const response = await fetch(`http://localhost:4000/api/witter/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newReply.trim(),
          authorId: playerId,
          authorName: 'Commander Alpha'
        })
      });

      if (response.ok) {
        // Refresh comments for this post
        loadComments(postId);
        // Clear reply state
        setReplyingTo(null);
        setNewReply('');
        
        // Auto-scroll to the new reply after a brief delay
        setTimeout(() => {
          const replyElement = document.querySelector(`[data-comment-id="${commentId}"]`);
          if (replyElement) {
            replyElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 500);
      }
    } catch (err) {
      console.error('Failed to submit reply:', err);
    }
  };

  const handleFollow = async (targetId: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/witter/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, targetId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.following) {
          setFollows(prev => new Set(prev).add(targetId));
        } else {
          setFollows(prev => {
            const newSet = new Set(prev);
            newSet.delete(targetId);
            return newSet;
          });
        }
      }
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;

    try {
      const response = await fetch('http://localhost:4000/api/witter/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          authorId: playerId,
          authorName: 'Commander Alpha'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setPosts(prev => [result.post, ...prev]);
        setNewPostContent('');
        setShowCompose(false);
      }
    } catch (err) {
      console.error('Failed to post:', err);
    }
  };

  const viewProfile = async (authorId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/witter/profile/${authorId}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setShowProfile(authorId);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="modern-witter-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading galactic feed...</div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="modern-witter-error">
        <div className="error-icon">⚠️</div>
        <h3>Connection Error</h3>
        <p>Failed to connect to Witter API: {error}</p>
        <button onClick={() => loadPosts(0, true)} className="retry-button">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="modern-witter-container">
      {/* Header */}
      <div className="modern-witter-header">
        <div className="header-title">
          <h1>🌌 Galactic Witter</h1>
          <p>Connect across the stars</p>
        </div>
        <button 
          className="compose-button"
          onClick={() => setShowCompose(!showCompose)}
        >
          ✨ Compose
        </button>
      </div>

      {/* Compose Section */}
      {showCompose && (
        <div className="compose-section">
          <div className="compose-header">
            <div className="user-avatar">👨‍🚀</div>
            <div className="compose-info">
              <strong>Commander Alpha</strong>
              <span>What's happening in the galaxy?</span>
            </div>
          </div>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your galactic adventures..."
            className="compose-textarea"
            maxLength={280}
          />
          <div className="compose-actions">
            <span className="character-count">
              {280 - newPostContent.length} characters remaining
            </span>
            <div className="compose-buttons">
              <button 
                onClick={() => setShowCompose(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostSubmit}
                className="post-button"
                disabled={!newPostContent.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Dropdowns */}
      <div className="filter-section">
        <div className="filter-dropdowns-row">
          <div className="filter-dropdown-container">
            <label className="filter-label">Civilization:</label>
            <select 
              className="filter-dropdown"
              value={civilizationFilter}
              onChange={(e) => setCivilizationFilter(e.target.value)}
            >
              <option value="all">🌌 All Civilizations</option>
              {filters.civilizations?.map((civ: string) => (
                <option key={civ} value={civ}>🏛️ {civ}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-dropdown-container">
            <label className="filter-label">Star System:</label>
            <select 
              className="filter-dropdown"
              value={starSystemFilter}
              onChange={(e) => setStarSystemFilter(e.target.value)}
            >
              <option value="all">⭐ All Systems</option>
              {filters.starSystems?.map((system: string) => (
                <option key={system} value={system}>🌟 {system}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-dropdown-container">
            <label className="filter-label">Planet:</label>
            <select 
              className="filter-dropdown"
              value={planetFilter}
              onChange={(e) => setPlanetFilter(e.target.value)}
            >
              <option value="all">🪐 All Planets</option>
              {filters.planets?.map((planet: string) => (
                <option key={planet} value={planet}>🌍 {planet}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-dropdown-container">
            <label className="filter-label">Source:</label>
            <select 
              className="filter-dropdown"
              value={sourceTypeFilter}
              onChange={(e) => setSourceTypeFilter(e.target.value)}
            >
              <option value="all">📡 All Sources</option>
              {filters.sourceTypes?.map((source: string) => (
                <option key={source} value={source}>
                  {source === 'citizen' ? '👥' : source === 'media' ? '📺' : '🏛️'} {source}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Quick Reset Button */}
        {(civilizationFilter !== 'all' || starSystemFilter !== 'all' || planetFilter !== 'all' || sourceTypeFilter !== 'all') && (
          <div className="filter-reset">
            <button
              className="reset-filters-button"
              onClick={() => {
                setCivilizationFilter('all');
                setStarSystemFilter('all');
                setPlanetFilter('all');
                setSourceTypeFilter('all');
              }}
            >
              🔄 Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Posts Feed */}
      <div className="posts-container" ref={scrollRef}>
        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">🌌</div>
            <h3>No posts found</h3>
            <p>Be the first to share something in the galactic feed!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="author-avatar">
                    {post.avatar || post.authorName.charAt(0)}
                  </div>
                                  <div className="author-info">
                  <div 
                    className="author-name clickable"
                    onClick={() => viewProfile(post.authorId)}
                  >
                    {post.authorName}
                    {post.followers && (
                      <span className="follower-count">
                        {post.followers >= 1000000 ? `${(post.followers / 1000000).toFixed(1)}M` :
                         post.followers >= 1000 ? `${(post.followers / 1000).toFixed(1)}K` :
                         post.followers} followers
                      </span>
                    )}
                  </div>
                  <div className="post-meta">
                    <span className="location">📍 {post.location}</span>
                    <span className="category">🏷️ {post.category}</span>
                    <span className="timestamp">{formatTimeAgo(post.timestamp)}</span>
                  </div>
                </div>
                </div>

                <div className="post-content">
                  {post.content}
                </div>
                
                {/* Image Content */}
                {post.image && (
                  <div className="post-image">
                    <img 
                      src={post.image.url} 
                      alt={post.image.alt}
                      className={`post-img ${post.image.type}`}
                      loading="lazy"
                    />
                    {post.image.type === 'meme' && (
                      <div className="meme-badge">🎭 Meme</div>
                    )}
                  </div>
                )}

                <div className="post-actions">
                  <button
                    className={`action-button like-button ${post.isLiked ? 'active' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <span className="action-icon">{post.isLiked ? '❤️' : '🤍'}</span>
                    <span className="action-count">{post.likes}</span>
                  </button>

                  <button 
                    className={`action-button comment-button ${expandedComments.has(post.id) ? 'active' : ''}`}
                    onClick={() => toggleComments(post.id)}
                  >
                    <span className="action-icon">💬</span>
                    <span className="action-count">{post.comments}</span>
                  </button>

                  <button
                    className={`action-button share-button ${post.isShared ? 'active' : ''}`}
                    onClick={() => handleShare(post.id)}
                  >
                    <span className="action-icon">🔄</span>
                    <span className="action-count">{post.shares}</span>
                  </button>

                  {post.authorId !== playerId && (
                    <button 
                      className={`action-button follow-button ${follows.has(post.authorId) ? 'active' : ''}`}
                      onClick={() => handleFollow(post.authorId)}
                    >
                      <span className="action-icon">{follows.has(post.authorId) ? '✅' : '➕'}</span>
                      <span className="action-text">{follows.has(post.authorId) ? 'Following' : 'Follow'}</span>
                    </button>
                  )}
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="comments-section">
                    {loadingComments.has(post.id) ? (
                      <div className="comments-loading">
                        <div className="loading-spinner small"></div>
                        <span>Loading comments...</span>
                      </div>
                    ) : (
                      <>
                        {/* Comment Input */}
                        <div className="comment-input-section">
                          <div className="comment-input-header">
                            <div className="user-avatar small">👨‍🚀</div>
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={newComment.get(post.id) || ''}
                              onChange={(e) => setNewComment(prev => new Map(prev).set(post.id, e.target.value))}
                              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                              className="comment-input"
                            />
                            <button 
                              onClick={() => handleCommentSubmit(post.id)}
                              className="comment-submit"
                              disabled={!newComment.get(post.id)?.trim()}
                            >
                              Post
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="comments-list">
                          {comments.get(post.id)?.map((comment) => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-header">
                                <div className="comment-avatar">
                                  {comment.avatar}
                                </div>
                                <div className="comment-info">
                                  <span className="comment-author">{comment.authorName}</span>
                                  <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                                </div>
                              </div>
                              <div className="comment-content">
                                {comment.content}
                              </div>
                              <div className="comment-actions">
                                <button className="comment-action-button">
                                  <span className="action-icon">🤍</span>
                                  <span className="action-count">{comment.likes}</span>
                                </button>
                                <button 
                                  className="comment-action-button"
                                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                >
                                  <span className="action-icon">↩️</span>
                                  <span className="action-text">Reply</span>
                                </button>
                              </div>
                              
                              {/* Reply Input */}
                              {replyingTo === comment.id && (
                                <div className="reply-input-section">
                                  <div className="reply-input-wrapper">
                                    <input
                                      type="text"
                                      placeholder={`Reply to ${comment.authorName}...`}
                                      value={newReply}
                                      onChange={(e) => setNewReply(e.target.value)}
                                      onKeyPress={(e) => e.key === 'Enter' && submitReply(comment.id, post.id)}
                                      className="reply-input"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => submitReply(comment.id, post.id)}
                                      className="reply-submit"
                                      disabled={!newReply.trim()}
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loadingMore && (
              <div className="loading-more">
                <div className="loading-spinner small"></div>
                <span>Loading more posts...</span>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="end-of-feed">
                <div className="end-icon">🌟</div>
                <p>You've reached the end of the galactic feed!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && profileData && (
        <div className="modal-overlay" onClick={() => setShowProfile(null)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <div className="profile-header">
              <div className="profile-avatar">
                {profileData.avatar || profileData.name?.charAt(0) || '👤'}
              </div>
              <div className="profile-info">
                <h2>{profileData.name}</h2>
                <p className="profile-type">{profileData.type?.toUpperCase()}</p>
                <p className="profile-location">📍 {profileData.location}</p>
                <div className="profile-stats">
                  <span>{profileData.followers?.toLocaleString() || 0} followers</span>
                  <span>{profileData.following?.toLocaleString() || 0} following</span>
                </div>
              </div>
              <button 
                className="close-button"
                onClick={() => setShowProfile(null)}
              >
                ✕
              </button>
            </div>
            <div className="profile-content">
              <p>{profileData.bio || 'No bio available'}</p>
              {profileData.interests && (
                <div className="profile-interests">
                  <h4>Interests:</h4>
                  <div className="interest-tags">
                    {profileData.interests.map((interest: string, idx: number) => (
                      <span key={idx} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="profile-actions">
              <button 
                className={`follow-button ${follows.has(showProfile) ? 'following' : ''}`}
                onClick={() => toggleFollow(showProfile)}
              >
                {follows.has(showProfile) ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernWitterFeed;
