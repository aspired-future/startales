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
    // Load mock data immediately
    setWitts(mockWitts);
  }, []);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const additionalWitts = mockWitts.map((witt, index) => ({
        ...witt,
        id: `mock-page2-${index}`,
        content: witt.content + ' [Page 2]',
        timestamp: `${4 + index} hours ago`
      }));
      setWitts(prev => [...prev, ...additionalWitts]);
      setLoading(false);
    }, 500);
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