import React from 'react';
import './FollowSuggestions.css';

export interface FollowSuggestionsProps {
  playerId: string;
  onFollow?: (profileId: string) => void;
}

export const FollowSuggestions: React.FC<FollowSuggestionsProps> = ({
  playerId,
  onFollow
}) => {
  // Placeholder suggestions - in a real implementation, this would be dynamic
  const suggestions = [
    {
      id: 'npc_scientist_zara',
      name: 'Dr. Zara Chen',
      title: 'Xenobiologist',
      location: 'Mars Research Station',
      followers: 1247,
      avatar: '🧬'
    },
    {
      id: 'npc_trader_kex',
      name: 'Captain Kex Vorthan',
      title: 'Trade Captain',
      location: 'Alpha Centauri Hub',
      followers: 892,
      avatar: '🚀'
    },
    {
      id: 'npc_diplomat_aria',
      name: 'Ambassador Aria Sol',
      title: 'Diplomatic Envoy',
      location: 'Earth Embassy',
      followers: 2156,
      avatar: '🌟'
    }
  ];

  const handleFollow = (profileId: string) => {
    if (onFollow) {
      onFollow(profileId);
    }
  };

  return (
    <div className="follow-suggestions">
      <h3>Suggested Connections</h3>
      <div className="suggestions-list">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="suggestion-card">
            <div className="suggestion-avatar">{suggestion.avatar}</div>
            <div className="suggestion-info">
              <div className="suggestion-name">{suggestion.name}</div>
              <div className="suggestion-title">{suggestion.title}</div>
              <div className="suggestion-location">{suggestion.location}</div>
              <div className="suggestion-followers">{suggestion.followers} followers</div>
            </div>
            <button 
              className="follow-btn"
              onClick={() => handleFollow(suggestion.id)}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
