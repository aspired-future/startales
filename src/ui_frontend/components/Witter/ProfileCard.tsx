import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PlayerProfile } from '../../services/PlayerInteractionService';
import './ProfileCard.css';

interface ProfileCardProps {
  profile: PlayerProfile;
  isFollowing: boolean;
  onFollow: (profileId: string, isFollowing: boolean) => void;
  onClose?: () => void;
  compact?: boolean;
  showFollowButton?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isFollowing,
  onFollow,
  onClose,
  compact = false,
  showFollowButton = true
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats'>('overview');

  // Get type styling
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'PLAYER':
        return { icon: '🎮', label: 'Player', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' };
      case 'CITIZEN':
        return { icon: '👤', label: 'Citizen', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' };
      case 'PERSONALITY':
        return { icon: '⭐', label: 'Personality', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' };
      case 'CITY_LEADER':
        return { icon: '🏛️', label: 'City Leader', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' };
      case 'PLANET_LEADER':
        return { icon: '🌍', label: 'Planet Leader', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' };
      case 'DIVISION_LEADER':
        return { icon: '⚔️', label: 'Division Leader', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
      default:
        return { icon: '❓', label: 'Unknown', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' };
    }
  };

  const typeInfo = getTypeInfo(profile.type);
  const lastActiveText = formatDistanceToNow(new Date(profile.stats.lastActive), { addSuffix: true });

  // Get reputation color
  const getReputationColor = (score: number) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 70) return '#3B82F6'; // Blue
    if (score >= 50) return '#F59E0B'; // Yellow
    if (score >= 30) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  // Get achievement rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': return '#FFD700';
      case 'EPIC': return '#A855F7';
      case 'RARE': return '#3B82F6';
      case 'UNCOMMON': return '#10B981';
      case 'COMMON': return '#6B7280';
      default: return '#6B7280';
    }
  };

  if (compact) {
    return (
      <div className="profile-card compact">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <span className="avatar-placeholder" style={{ backgroundColor: typeInfo.color }}>
                {typeInfo.icon}
              </span>
            )}
          </div>
          
          <div className="profile-info">
            <div className="profile-name-row">
              <h3 className="profile-name">{profile.name}</h3>
              <span className="profile-type" style={{ color: typeInfo.color }}>
                {typeInfo.icon} {typeInfo.label}
              </span>
            </div>
            
            <div className="profile-location">
              📍 {profile.location.currentCity || profile.location.currentPlanet}, {profile.location.currentSystem}
            </div>
            
            <div className="profile-stats-compact">
              <span className="stat">👥 {profile.stats.followerCount.toLocaleString()}</span>
              <span className="stat">📝 {profile.stats.wittCount.toLocaleString()}</span>
              <span className="stat">⭐ {profile.reputation.overall}/100</span>
            </div>
          </div>

          {showFollowButton && profile.type !== 'PLAYER' && (
            <button
              className={`follow-btn-compact ${isFollowing ? 'following' : ''}`}
              onClick={() => onFollow(profile.id, isFollowing)}
            >
              {isFollowing ? '✓' : '+'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card-overlay">
      <div className="profile-card full">
        <div className="profile-card-header">
          <h2>Profile</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-avatar-large">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                <span className="avatar-placeholder-large" style={{ backgroundColor: typeInfo.color }}>
                  {typeInfo.icon}
                </span>
              )}
              
              <div className="online-status" title={`Last active ${lastActiveText}`}>
                <div className={`status-dot ${Date.now() - new Date(profile.stats.lastActive).getTime() < 300000 ? 'online' : 'offline'}`} />
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-name-section">
                <h1 className="profile-name-large">{profile.name}</h1>
                <div className="profile-type-badge" style={{ backgroundColor: typeInfo.bgColor, color: typeInfo.color }}>
                  {typeInfo.icon} {typeInfo.label}
                </div>
              </div>

              <div className="profile-location-detailed">
                <div className="location-item">
                  <span className="location-label">🌌 System:</span>
                  <span className="location-value">{profile.location.currentSystem}</span>
                </div>
                <div className="location-item">
                  <span className="location-label">🌍 Planet:</span>
                  <span className="location-value">{profile.location.currentPlanet}</span>
                </div>
                {profile.location.currentCity && (
                  <div className="location-item">
                    <span className="location-label">🏙️ City:</span>
                    <span className="location-value">{profile.location.currentCity}</span>
                  </div>
                )}
                {profile.location.coordinates && (
                  <div className="location-item">
                    <span className="location-label">📍 Coordinates:</span>
                    <span className="location-value">
                      {profile.location.coordinates.x.toFixed(1)}, {profile.location.coordinates.y.toFixed(1)}, {profile.location.coordinates.z.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="profile-stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{profile.stats.followerCount.toLocaleString()}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profile.stats.followingCount.toLocaleString()}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{profile.stats.wittCount.toLocaleString()}</span>
                  <span className="stat-label">Witts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value" style={{ color: getReputationColor(profile.reputation.overall) }}>
                    {profile.reputation.overall}/100
                  </span>
                  <span className="stat-label">Reputation</span>
                </div>
              </div>

              {showFollowButton && profile.type !== 'PLAYER' && (
                <button
                  className={`follow-btn-large ${isFollowing ? 'following' : ''}`}
                  onClick={() => onFollow(profile.id, isFollowing)}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              )}
            </div>
          </div>

          <div className="profile-tabs">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
                onClick={() => setActiveTab('achievements')}
              >
                Achievements ({profile.achievements.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Stats
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  {profile.faction && (
                    <div className="faction-info">
                      <h3>Faction</h3>
                      <div className="faction-details">
                        <div className="faction-item">
                          <span className="faction-label">Organization:</span>
                          <span className="faction-value">{profile.faction.name}</span>
                        </div>
                        <div className="faction-item">
                          <span className="faction-label">Rank:</span>
                          <span className="faction-value">{profile.faction.rank}</span>
                        </div>
                        <div className="faction-item">
                          <span className="faction-label">Role:</span>
                          <span className="faction-value">{profile.faction.role}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.civilization && (
                    <div className="civilization-info">
                      <h3>Civilization</h3>
                      <div className="civilization-details">
                        <div className="civilization-item">
                          <span className="civilization-label">Name:</span>
                          <span className="civilization-value">{profile.civilization.name}</span>
                        </div>
                        <div className="civilization-item">
                          <span className="civilization-label">Type:</span>
                          <span className="civilization-value">{profile.civilization.type}</span>
                        </div>
                        <div className="civilization-item">
                          <span className="civilization-label">Level:</span>
                          <span className="civilization-value">{profile.civilization.level}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="reputation-breakdown">
                    <h3>Reputation Breakdown</h3>
                    <div className="reputation-bars">
                      {Object.entries(profile.reputation.categories).map(([category, score]) => (
                        <div key={category} className="reputation-bar">
                          <div className="reputation-bar-header">
                            <span className="reputation-category">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                            <span className="reputation-score">{score}/100</span>
                          </div>
                          <div className="reputation-bar-track">
                            <div 
                              className="reputation-bar-fill" 
                              style={{ 
                                width: `${score}%`,
                                backgroundColor: getReputationColor(score)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="achievements-tab">
                  {profile.achievements.length > 0 ? (
                    <div className="achievements-list">
                      {profile.achievements.filter(a => a.publiclyVisible).map(achievement => (
                        <div key={achievement.id} className="achievement-item">
                          <div className="achievement-header">
                            <span 
                              className="achievement-rarity" 
                              style={{ color: getRarityColor(achievement.rarity) }}
                            >
                              ★ {achievement.rarity}
                            </span>
                            <span className="achievement-date">
                              {formatDistanceToNow(new Date(achievement.dateEarned), { addSuffix: true })}
                            </span>
                          </div>
                          <h4 className="achievement-title">{achievement.title}</h4>
                          <p className="achievement-description">{achievement.description}</p>
                          <span className="achievement-category">{achievement.category}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-achievements">
                      <p>No public achievements to display.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="stats-tab">
                  <div className="stats-grid">
                    <div className="stats-section">
                      <h3>Activity</h3>
                      <div className="stats-list">
                        <div className="stats-item">
                          <span className="stats-label">Member since:</span>
                          <span className="stats-value">
                            {new Date(profile.stats.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="stats-item">
                          <span className="stats-label">Last active:</span>
                          <span className="stats-value">{lastActiveText}</span>
                        </div>
                        <div className="stats-item">
                          <span className="stats-label">Total Witts:</span>
                          <span className="stats-value">{profile.stats.wittCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="stats-section">
                      <h3>Social</h3>
                      <div className="stats-list">
                        <div className="stats-item">
                          <span className="stats-label">Followers:</span>
                          <span className="stats-value">{profile.stats.followerCount.toLocaleString()}</span>
                        </div>
                        <div className="stats-item">
                          <span className="stats-label">Following:</span>
                          <span className="stats-value">{profile.stats.followingCount.toLocaleString()}</span>
                        </div>
                        <div className="stats-item">
                          <span className="stats-label">Engagement ratio:</span>
                          <span className="stats-value">
                            {profile.stats.followingCount > 0 
                              ? (profile.stats.followerCount / profile.stats.followingCount).toFixed(1)
                              : '∞'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {profile.personalityTraits && (
                      <div className="stats-section">
                        <h3>Personality Traits</h3>
                        <div className="personality-traits">
                          {Object.entries(profile.personalityTraits).map(([trait, value]) => (
                            <div key={trait} className="trait-item">
                              <div className="trait-header">
                                <span className="trait-name">{trait.charAt(0).toUpperCase() + trait.slice(1)}</span>
                                <span className="trait-value">{Math.round(value * 100)}%</span>
                              </div>
                              <div className="trait-bar">
                                <div 
                                  className="trait-bar-fill" 
                                  style={{ 
                                    width: `${value * 100}%`,
                                    backgroundColor: `hsl(${value * 120}, 70%, 50%)`
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
