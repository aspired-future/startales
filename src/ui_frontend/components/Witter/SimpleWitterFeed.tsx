import React, { useState, useEffect } from 'react';
import './WitterFeed.css';
import './TwitterLikeStyles.css';
import CharacterProfileModal from '../WhoseApp/CharacterProfileModal';

interface SimpleWitt {
  id: string;
  author: string;
  handle: string;
  title?: string; // Character title/position
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  category: string;
  avatar: string;
  verified: boolean;
  location: string;
  characterId?: string; // For profile linking
}

interface SimpleWitterFeedProps {
  playerId: string;
  gameContext: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
  };
  className?: string;
}

export const SimpleWitterFeed: React.FC<SimpleWitterFeedProps> = ({
  playerId,
  gameContext,
  className = ''
}) => {
  const [witts, setWitts] = useState<SimpleWitt[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCharacterForProfile, setSelectedCharacterForProfile] = useState<string | null>(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const handleCharacterClick = (characterId: string, authorName: string) => {
    console.log(`Opening profile for ${authorName} (${characterId})`);
    setSelectedCharacterForProfile(characterId);
    setIsProfileModalVisible(true);
  };

  const mockWitts: SimpleWitt[] = [
    {
      id: 'mock-1',
      author: "Dr. Elena Vasquez",
      handle: "@DrElenaV",
      title: "Chief Science Officer",
      characterId: "char-elena-vasquez",
      content: "🧬 Breakthrough in quantum genetics! Our team just discovered how to enhance crop yields by 300% using quantum-entangled DNA sequences. The future of galactic agriculture is here! #QuantumScience #GalacticAgriculture",
      timestamp: "15m",
      likes: 1247,
      reposts: 89,
      replies: 34,
      category: 'SCIENCE',
      avatar: "🧬",
      verified: true,
      location: "Kepler Research Station"
    },
    {
      id: 'mock-2',
      author: "Marcus Chen",
      handle: "@MarcusReports",
      title: "Economic Correspondent",
      characterId: "char-marcus-chen",
      content: "📈 BREAKING: Galactic Trade Federation announces new interstellar commerce routes! Expected to boost GDP by 15% across all member civilizations. The Andromeda-Milky Way Express is officially operational! 🚀✨ #GalacticEconomy #Trade",
      timestamp: "45m",
      likes: 892,
      reposts: 156,
      replies: 67,
      category: 'BUSINESS',
      avatar: "📊",
      verified: true,
      location: "Central Trade Hub"
    },
    {
      id: 'mock-3',
      author: "Captain Sarah Nova",
      handle: "@CaptainNova",
      title: "Sports Commentator",
      characterId: "char-sarah-nova",
      content: "🏆 What a match! The Centauri Comets just defeated the Vega Vipers 4-2 in the most intense zero-gravity soccer final I've ever witnessed! That last-minute goal by Rodriguez was INSANE! 🥅⚽ #ZeroGSoccer #GalacticSports",
      timestamp: "1h",
      likes: 2156,
      reposts: 234,
      replies: 89,
      category: 'SPORTS',
      avatar: "⚽",
      verified: false,
      location: "Orbital Sports Complex"
    },
    {
      id: 'mock-4',
      author: "Ambassador Zara Kim",
      handle: "@AmbassadorZara",
      title: "Chief Diplomatic Officer",
      characterId: "char-zara-kim",
      content: "🌟 Honored to represent our civilization at the Intergalactic Peace Summit. Today we signed historic agreements on resource sharing and cultural exchange. Together, we build a brighter future among the stars! 🤝✨ #Diplomacy #Peace",
      timestamp: "2h",
      likes: 3421,
      reposts: 445,
      replies: 123,
      category: 'POLITICS',
      avatar: "🌟",
      verified: true,
      location: "Diplomatic Quarter"
    },
    {
      id: 'mock-5',
      author: "Tech Innovator Alex",
      handle: "@TechAlexInnovates",
      title: "AI Research Director",
      characterId: "char-alex-tech",
      content: "🤖 Just finished beta testing the new AI-powered personal assistants! These little guys can manage your entire household, optimize your daily schedule, AND they make the best synthetic coffee in the galaxy! ☕🤖 #AITech #Innovation",
      timestamp: "3h",
      likes: 1876,
      reposts: 298,
      replies: 156,
      category: 'TECHNOLOGY',
      avatar: "🤖",
      verified: false,
      location: "Innovation District"
    }
  ];

  useEffect(() => {
    loadCharacterDrivenWitts();
  }, []);

  const loadCharacterDrivenWitts = async () => {
    setLoading(true);
    try {
      // Try to fetch Character AI generated posts
      const response = await fetch(`/api/witter/character-driven-posts?civilizationId=1&count=10`);
      
      if (response.ok) {
        const data = await response.json();
        const characterPosts = data.posts || [];
        
        // Convert character posts to SimpleWitt format
        const characterWitts: SimpleWitt[] = characterPosts.map((post: any) => ({
          id: post.id,
          author: post.characterName || post.authorName,
          handle: `@${(post.characterName || post.authorName).replace(/\s+/g, '')}`,
          title: post.characterTitle || post.authorType,
          characterId: post.characterId || post.authorId,
          content: post.content,
          timestamp: formatTimestamp(post.timestamp),
          likes: post.metrics?.likes || Math.floor(Math.random() * 1000) + 50,
          reposts: post.metrics?.shares || Math.floor(Math.random() * 100) + 10,
          replies: post.metrics?.comments || Math.floor(Math.random() * 50) + 5,
          category: post.category || 'GENERAL',
          avatar: getAvatarForCategory(post.category || 'GENERAL'),
          verified: post.characterId ? true : false,
          location: post.location || 'Unknown Location'
        }));
        
        if (characterWitts.length > 0) {
          console.log(`✅ Loaded ${characterWitts.length} Character AI generated posts`);
          setWitts(characterWitts);
        } else {
          console.log('❌ No Character AI posts available, using fallback');
          setWitts(mockWitts);
        }
      } else {
        console.log('❌ Character AI posts API failed, using mock data');
        setWitts(mockWitts);
      }
    } catch (error) {
      console.error('Failed to load Character AI posts:', error);
      setWitts(mockWitts);
    }
    setLoading(false);
  };

  const formatTimestamp = (timestamp: string | Date): string => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${Math.floor(diffHours / 24)}d`;
    }
  };

  const getAvatarForCategory = (category: string): string => {
    const avatars = {
      'SCIENCE': '🧬',
      'BUSINESS': '📊', 
      'SPORTS': '⚽',
      'POLITICS': '🌟',
      'TECHNOLOGY': '🤖',
      'MILITARY': '⚔️',
      'DIPLOMACY': '🤝',
      'GENERAL': '👤'
    };
    return avatars[category.toUpperCase()] || '👤';
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      // Try to load more Character AI posts
      const response = await fetch(`/api/witter/character-driven-posts?civilizationId=1&count=5&offset=${witts.length}`);
      
      if (response.ok) {
        const data = await response.json();
        const characterPosts = data.posts || [];
        
        const newCharacterWitts: SimpleWitt[] = characterPosts.map((post: any) => ({
          id: post.id,
          author: post.characterName || post.authorName,
          handle: `@${(post.characterName || post.authorName).replace(/\s+/g, '')}`,
          title: post.characterTitle || post.authorType,
          characterId: post.characterId || post.authorId,
          content: post.content,
          timestamp: formatTimestamp(post.timestamp),
          likes: post.metrics?.likes || Math.floor(Math.random() * 1000) + 50,
          reposts: post.metrics?.shares || Math.floor(Math.random() * 100) + 10,
          replies: post.metrics?.comments || Math.floor(Math.random() * 50) + 5,
          category: post.category || 'GENERAL',
          avatar: getAvatarForCategory(post.category || 'GENERAL'),
          verified: post.characterId ? true : false,
          location: post.location || 'Unknown Location'
        }));
        
        if (newCharacterWitts.length > 0) {
          setWitts(prev => [...prev, ...newCharacterWitts]);
          console.log(`✅ Loaded ${newCharacterWitts.length} more Character AI posts`);
        } else {
          // Fallback to mock data if no more Character AI posts
          const additionalWitts = mockWitts.slice(0, 3).map((witt, index) => ({
            ...witt,
            id: `fallback-${Date.now()}-${index}`,
            content: witt.content + ' [Updated]',
            timestamp: `${Math.floor(Math.random() * 12) + 1}h`
          }));
          setWitts(prev => [...prev, ...additionalWitts]);
        }
      } else {
        // Fallback to mock data
        const additionalWitts = mockWitts.slice(0, 3).map((witt, index) => ({
          ...witt,
          id: `fallback-${Date.now()}-${index}`,
          content: witt.content + ' [Fallback]',
          timestamp: `${Math.floor(Math.random() * 12) + 1}h`
        }));
        setWitts(prev => [...prev, ...additionalWitts]);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
      // Fallback to mock data
      const additionalWitts = mockWitts.slice(0, 3).map((witt, index) => ({
        ...witt,
        id: `error-fallback-${Date.now()}-${index}`,
        content: witt.content + ' [Error Fallback]',
        timestamp: `${Math.floor(Math.random() * 12) + 1}h`
      }));
      setWitts(prev => [...prev, ...additionalWitts]);
    }
    setLoading(false);
  };

  return (
    <div className={`witter-feed ${className}`}>
      <div className="witter-header">
        <h2>🐦 Witter</h2>
        <div className="feed-status">✨ Live Galactic Feed</div>
      </div>
      
      <div className="witter-list">
        {witts.map((witt) => (
          <div key={witt.id} className="witt-item">
            <div className="witt-avatar-container">
              <div className="witt-avatar">{witt.avatar}</div>
            </div>
            
            <div className="witt-main">
              <div className="witt-header">
                <div className="witt-author-info">
                  <div className="witt-author-line">
                    <span 
                      className="witt-author clickable" 
                      onClick={() => witt.characterId && handleCharacterClick(witt.characterId, witt.author)}
                    >
                      {witt.author}
                    </span>
                    {witt.verified && <span className="verified-badge">✓</span>}
                    {witt.title && <span className="witt-title">• {witt.title}</span>}
                  </div>
                  <div className="witt-meta-line">
                    <span className="witt-handle">@{witt.handle.replace('@', '')}</span>
                    <span className="witt-separator">·</span>
                    <span className="witt-timestamp">{witt.timestamp}</span>
                  </div>
                </div>
                <div className={`category-badge category-${witt.category.toLowerCase()}`}>{witt.category}</div>
              </div>
              
              <div className="witt-content">{witt.content}</div>
              
              <div className="witt-actions">
                <button className="witt-action reply">
                  <span className="action-icon">💬</span>
                  <span className="action-count">{witt.replies}</span>
                </button>
                <button className="witt-action repost">
                  <span className="action-icon">🔄</span>
                  <span className="action-count">{witt.reposts}</span>
                </button>
                <button className="witt-action like">
                  <span className="action-icon">❤️</span>
                  <span className="action-count">{witt.likes.toLocaleString()}</span>
                </button>
                <button className="witt-action share">
                  <span className="action-icon">📤</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="load-more-section">
        <button 
          className="load-more-btn" 
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? (
            <><span className="loading-spinner"></span> Loading...</>
          ) : (
            'Load More Wits'
          )}
        </button>
      </div>

      {/* Character Profile Modal */}
      {isProfileModalVisible && selectedCharacterForProfile && (
        <CharacterProfileModal
          characterId={selectedCharacterForProfile}
          isVisible={isProfileModalVisible}
          onClose={() => {
            setIsProfileModalVisible(false);
            setSelectedCharacterForProfile(null);
          }}
        />
      )}
    </div>
  );
};

export default SimpleWitterFeed;