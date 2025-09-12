/**
 * Enhanced Channels View for WhoseApp
 * 
 * Displays channels with multiple participants, real-time activity,
 * and meeting-style group conversations
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { WhoseAppChannel, Character } from './WhoseAppMain';
import '../GameHUD/screens/shared/StandardDesign.css';

interface ChannelsViewProps {
  channels: WhoseAppChannel[];
  characters: Character[];
  onChannelSelect: (channel: WhoseAppChannel) => void;
  onCreateChannel: () => void;
  currentUserId: string;
}

interface ChannelFilter {
  search: string;
  type: 'all' | 'department' | 'project' | 'emergency' | 'general' | 'cabinet';
  confidentiality: 'all' | 'public' | 'restricted' | 'classified' | 'top_secret';
  activity: 'all' | 'active' | 'recent' | 'archived';
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({
  channels,
  characters,
  onChannelSelect,
  onCreateChannel,
  currentUserId
}) => {
  const [filter, setFilter] = useState<ChannelFilter>({
    search: '',
    type: 'all',
    confidentiality: 'all',
    activity: 'all'
  });

  // Enhanced channel data with participant information
  const enhancedChannels = useMemo(() => {
    return channels.map(channel => {
      const participantCharacters = channel.participants
        .filter(p => p !== currentUserId)
        .map(participantId => characters.find(c => c.id === participantId))
        .filter(Boolean) as Character[];

      const onlineParticipants = participantCharacters.filter(c => 
        c.whoseAppProfile?.status === 'online'
      );

      const recentActivity = new Date(channel.lastMessageTime);
      const isRecentlyActive = (Date.now() - recentActivity.getTime()) < 3600000; // 1 hour

      return {
        ...channel,
        participantCharacters,
        onlineParticipants,
        onlineCount: onlineParticipants.length,
        isRecentlyActive,
        confidentialityColor: getConfidentialityColor(channel.confidentialityLevel),
        typeIcon: getChannelTypeIcon(channel.type)
      };
    });
  }, [channels, characters, currentUserId]);

  // Filter and sort channels
  const filteredChannels = useMemo(() => {
    let filtered = enhancedChannels;

    // Apply search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(channel => 
        channel.name.toLowerCase().includes(searchLower) ||
        channel.description.toLowerCase().includes(searchLower) ||
        channel.participantCharacters.some(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.title.toLowerCase().includes(searchLower) ||
          c.department.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply type filter
    if (filter.type !== 'all') {
      filtered = filtered.filter(channel => channel.type === filter.type);
    }

    // Apply confidentiality filter
    if (filter.confidentiality !== 'all') {
      filtered = filtered.filter(channel => channel.confidentialityLevel === filter.confidentiality);
    }

    // Apply activity filter
    if (filter.activity !== 'all') {
      switch (filter.activity) {
        case 'active':
          filtered = filtered.filter(channel => channel.isActive && channel.onlineCount > 0);
          break;
        case 'recent':
          filtered = filtered.filter(channel => channel.isRecentlyActive);
          break;
        case 'archived':
          filtered = filtered.filter(channel => !channel.isActive);
          break;
      }
    }

    // Sort by activity and online participants
    return filtered.sort((a, b) => {
      // Pinned channels first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then by online participants
      if (a.onlineCount !== b.onlineCount) {
        return b.onlineCount - a.onlineCount;
      }
      
      // Then by recent activity
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
  }, [enhancedChannels, filter]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalParticipants = channels.reduce((sum, channel) => sum + channel.participantCount, 0);
    const activeChannels = channels.filter(channel => channel.isActive).length;
    const unreadMessages = channels.reduce((sum, channel) => sum + channel.unreadCount, 0);
    const onlineNow = enhancedChannels.reduce((sum, channel) => sum + channel.onlineCount, 0);
    
    return {
      total: channels.length,
      active: activeChannels,
      participants: totalParticipants,
      unread: unreadMessages,
      online: onlineNow
    };
  }, [channels, enhancedChannels]);

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="standard-dashboard">
      {/* Header with stats and actions */}
      <div className="standard-panel" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <h3 className="standard-card-title">📺 Channels</h3>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
              {stats.total} channels • {stats.active} active • {stats.participants} participants • {stats.online} online • {stats.unread} unread
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="standard-btn social-theme"
              onClick={onCreateChannel}
            >
              + Create Channel
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search channels, participants, or topics..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="standard-input"
            style={{ fontSize: '14px' }}
          />
          
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
            className="standard-input"
            style={{ fontSize: '12px' }}
          >
            <option value="all">All Types</option>
            <option value="department">Department</option>
            <option value="project">Project</option>
            <option value="emergency">Emergency</option>
            <option value="cabinet">Cabinet</option>
            <option value="general">General</option>
          </select>

          <select
            value={filter.confidentiality}
            onChange={(e) => setFilter(prev => ({ ...prev, confidentiality: e.target.value as any }))}
            className="standard-input"
            style={{ fontSize: '12px' }}
          >
            <option value="all">All Access</option>
            <option value="public">Public</option>
            <option value="restricted">Restricted</option>
            <option value="classified">Classified</option>
            <option value="top_secret">Top Secret</option>
          </select>

          <select
            value={filter.activity}
            onChange={(e) => setFilter(prev => ({ ...prev, activity: e.target.value as any }))}
            className="standard-input"
            style={{ fontSize: '12px' }}
          >
            <option value="all">All Activity</option>
            <option value="active">Active Now</option>
            <option value="recent">Recent</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Channels list */}
      <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
        {filteredChannels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            {filter.search || filter.type !== 'all' || filter.confidentiality !== 'all' || filter.activity !== 'all' ? (
              <>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>🔍</div>
                <div>No channels match your filters</div>
                <button 
                  className="standard-btn"
                  onClick={() => setFilter({ search: '', type: 'all', confidentiality: 'all', activity: 'all' })}
                  style={{ marginTop: '10px', fontSize: '12px' }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>📺</div>
                <div>No channels yet</div>
                <button 
                  className="standard-btn social-theme"
                  onClick={onCreateChannel}
                  style={{ marginTop: '10px' }}
                >
                  Create Your First Channel
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '15px' }}>
            {filteredChannels.map(channel => (
              <div
                key={channel.id}
                onClick={() => onChannelSelect(channel)}
                style={{
                  padding: '16px',
                  border: '1px solid #555',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#333',
                  transition: 'all 0.2s ease',
                  borderLeft: `4px solid ${channel.confidentialityColor}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3a3a3a';
                  e.currentTarget.style.borderColor = '#4ecdc4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#333';
                  e.currentTarget.style.borderColor = '#555';
                }}
              >
                {/* Channel header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '16px' }}>{channel.typeIcon}</span>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: '#e8e8e8',
                        fontSize: '16px'
                      }}>
                        #{channel.name}
                      </span>
                      {channel.isPinned && <span style={{ fontSize: '12px' }}>📌</span>}
                      {channel.isRecentlyActive && <span style={{ fontSize: '8px', color: '#4ecdc4' }}>●</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {channel.description}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    {channel.unreadCount > 0 && (
                      <span 
                        className="standard-badge"
                        style={{ 
                          backgroundColor: '#ff6b6b',
                          color: 'white',
                          fontSize: '10px',
                          minWidth: '18px',
                          height: '18px',
                          borderRadius: '9px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                      </span>
                    )}
                    <span className="standard-badge social-theme" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {channel.confidentialityLevel}
                    </span>
                  </div>
                </div>

                {/* Participants */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '6px' }}>
                    Participants ({channel.participantCount}) • {channel.onlineCount} online
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {channel.participantCharacters.slice(0, 6).map(participant => (
                      <div
                        key={participant.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 6px',
                          backgroundColor: '#2a2a2a',
                          borderRadius: '12px',
                          fontSize: '11px',
                          border: participant.whoseAppProfile?.status === 'online' 
                            ? '1px solid #4ecdc4' 
                            : '1px solid #555'
                        }}
                      >
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%'
                          }}
                        />
                        <span style={{ 
                          color: participant.whoseAppProfile?.status === 'online' ? '#4ecdc4' : '#888'
                        }}>
                          {participant.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                    {channel.participantCount > 6 && (
                      <div style={{
                        padding: '2px 6px',
                        backgroundColor: '#2a2a2a',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#888',
                        border: '1px solid #555'
                      }}>
                        +{channel.participantCount - 6} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Last message and activity */}
                <div style={{ 
                  fontSize: '12px', 
                  color: '#aaa',
                  borderTop: '1px solid #444',
                  paddingTop: '8px'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Last:</strong> {channel.lastMessage || 'No messages yet'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{formatRelativeTime(new Date(channel.lastMessageTime))}</span>
                    <span className="standard-badge" style={{ 
                      fontSize: '10px',
                      backgroundColor: channel.isActive ? '#10b981' : '#6b7280'
                    }}>
                      {channel.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
function getConfidentialityColor(level: string): string {
  const colors = {
    public: '#10b981',
    restricted: '#f59e0b',
    classified: '#ef4444',
    top_secret: '#8b5cf6'
  };
  return colors[level as keyof typeof colors] || '#6b7280';
}

function getChannelTypeIcon(type: string): string {
  const icons = {
    department: '🏢',
    project: '📋',
    emergency: '🚨',
    cabinet: '🏛️',
    general: '💬'
  };
  return icons[type as keyof typeof icons] || '📺';
}
