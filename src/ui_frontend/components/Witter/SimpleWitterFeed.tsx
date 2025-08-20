import React, { useState, useEffect } from 'react';

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
  metadata: {
    gameContext: string;
    location: string;
    category: string;
    topics: string[];
    personality: string;
  };
}

interface SimpleWitterFeedProps {
  playerId: string;
}

export const SimpleWitterFeed: React.FC<SimpleWitterFeedProps> = ({ playerId }) => {
  const [posts, setPosts] = useState<WittPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('🔄 Fetching Witter posts from API...');
        const response = await fetch('http://localhost:4000/api/witter/feed');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Witter posts loaded:', data);
        
        if (data.success && data.posts) {
          setPosts(data.posts);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('❌ Failed to fetch Witter posts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        headers: { 'Content-Type': 'application/json' }
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: '#4ecdc4',
        fontSize: '18px'
      }}>
        <div>
          <div style={{ marginBottom: '10px' }}>🔄 Loading Witter Feed...</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Connecting to galactic social network</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#ff6b6b', 
        background: 'rgba(255, 107, 107, 0.1)',
        border: '1px solid rgba(255, 107, 107, 0.3)',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h3>❌ Connection Error</h3>
        <p>Failed to connect to Witter API: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            background: '#4ecdc4',
            color: '#0f0f23',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      color: '#ffffff'
    }}>
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        background: 'rgba(78, 205, 196, 0.1)',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: '0 0 5px 0', color: '#4ecdc4' }}>
          📱 Galactic Witter Feed
        </h2>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
          Real-time social network connecting civilizations across the galaxy
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#b0b0b0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌌</div>
          <div>No posts found in the galactic feed</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {posts.map((post) => (
            <div 
              key={post.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(78, 205, 196, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Post Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(78, 205, 196, 0.1)'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  fontSize: '18px'
                }}>
                  {post.authorName.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#4ecdc4',
                    fontSize: '16px'
                  }}>
                    {post.authorName}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7,
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <span>📍 {post.metadata.location}</span>
                    <span>🏷️ {post.metadata.category}</span>
                    <span>⏰ {new Date(post.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div style={{ 
                marginBottom: '15px',
                lineHeight: '1.5',
                fontSize: '15px'
              }}>
                {post.content}
              </div>

              {/* Post Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '15px',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: post.isLiked ? '#4ecdc4' : 'rgba(78, 205, 196, 0.1)',
                    color: post.isLiked ? '#0f0f23' : '#4ecdc4',
                    border: '1px solid #4ecdc4',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {post.isLiked ? '❤️' : '🤍'} {post.likes}
                </button>
                
                <button
                  onClick={() => handleShare(post.id)}
                  style={{
                    background: post.isShared ? '#9c27b0' : 'rgba(156, 39, 176, 0.1)',
                    color: post.isShared ? '#ffffff' : '#9c27b0',
                    border: '1px solid #9c27b0',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  🔄 {post.shares}
                </button>
                
                <div style={{
                  color: '#b0b0b0',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  💬 {post.comments}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleWitterFeed;
