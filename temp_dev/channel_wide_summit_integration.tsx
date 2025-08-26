/**
 * Enhanced WhoseApp Integration with Channel-Wide Summit Scheduling
 * Shows how to schedule summits with all players in a channel
 */

import React, { useState } from 'react';
import SummitScheduler, { Summit, SummitParticipant } from '../src/ui_frontend/components/WhoseApp/SummitScheduler';

interface Channel {
  id: string;
  name: string;
  type: 'department' | 'project' | 'cabinet' | 'emergency' | 'general';
  description: string;
  participants: SummitParticipant[];
}

const WhoseAppWithChannelSummits: React.FC = () => {
  const [showSummitScheduler, setShowSummitScheduler] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [scheduledSummits, setScheduledSummits] = useState<Summit[]>([]);

  // Mock channels with participants
  const channels: Channel[] = [
    {
      id: 'channel_cabinet',
      name: 'Cabinet',
      type: 'cabinet',
      description: 'High-level government discussions',
      participants: [
        {
          id: 'player_001',
          name: 'President Johnson',
          type: 'player',
          avatar: '/api/avatars/president.jpg',
          title: 'President',
          availability: 'available'
        },
        {
          id: 'player_002', 
          name: 'Vice President Smith',
          type: 'player',
          avatar: '/api/avatars/vp.jpg',
          title: 'Vice President',
          availability: 'available'
        },
        {
          id: 'char_diplomat_001',
          name: 'Secretary of State Elena Vasquez',
          type: 'character',
          avatar: '/api/characters/avatars/elena_vasquez.jpg',
          title: 'Secretary of State',
          availability: 'available'
        },
        {
          id: 'char_economist_001',
          name: 'Treasury Secretary Marcus Chen',
          type: 'character',
          avatar: '/api/characters/avatars/marcus_chen.jpg',
          title: 'Treasury Secretary',
          availability: 'busy'
        },
        {
          id: 'char_commander_001',
          name: 'Defense Secretary Alpha',
          type: 'character',
          avatar: '/api/characters/avatars/commander_alpha.jpg',
          title: 'Defense Secretary',
          availability: 'available'
        }
      ]
    },
    {
      id: 'channel_defense',
      name: 'Defense',
      type: 'department',
      description: 'Military and security coordination',
      participants: [
        {
          id: 'player_001',
          name: 'President Johnson',
          type: 'player',
          avatar: '/api/avatars/president.jpg',
          title: 'Commander in Chief',
          availability: 'available'
        },
        {
          id: 'player_003',
          name: 'General Martinez',
          type: 'player',
          avatar: '/api/avatars/general.jpg',
          title: 'Joint Chiefs Chair',
          availability: 'available'
        },
        {
          id: 'char_commander_001',
          name: 'Defense Secretary Alpha',
          type: 'character',
          avatar: '/api/characters/avatars/commander_alpha.jpg',
          title: 'Defense Secretary',
          availability: 'available'
        },
        {
          id: 'char_intelligence_001',
          name: 'Director Sarah Black',
          type: 'character',
          avatar: '/api/characters/avatars/sarah_black.jpg',
          title: 'Intelligence Director',
          availability: 'available'
        }
      ]
    },
    {
      id: 'channel_crisis',
      name: 'Crisis Response',
      type: 'emergency',
      description: 'Emergency coordination channel',
      participants: [
        {
          id: 'player_001',
          name: 'President Johnson',
          type: 'player',
          avatar: '/api/avatars/president.jpg',
          title: 'President',
          availability: 'available'
        },
        {
          id: 'player_002',
          name: 'Vice President Smith', 
          type: 'player',
          avatar: '/api/avatars/vp.jpg',
          title: 'Vice President',
          availability: 'available'
        },
        {
          id: 'player_004',
          name: 'Emergency Director Wilson',
          type: 'player',
          avatar: '/api/avatars/emergency.jpg',
          title: 'Emergency Management Director',
          availability: 'available'
        },
        {
          id: 'char_commander_001',
          name: 'Defense Secretary Alpha',
          type: 'character',
          avatar: '/api/characters/avatars/commander_alpha.jpg',
          title: 'Defense Secretary',
          availability: 'available'
        },
        {
          id: 'char_health_001',
          name: 'Health Secretary Dr. Kim',
          type: 'character',
          avatar: '/api/characters/avatars/dr_kim.jpg',
          title: 'Health Secretary',
          availability: 'available'
        }
      ]
    }
  ];

  // Get all unique participants across channels for the scheduler
  const getAllParticipants = (): SummitParticipant[] => {
    const allParticipants = new Map<string, SummitParticipant>();
    
    channels.forEach(channel => {
      channel.participants.forEach(participant => {
        allParticipants.set(participant.id, participant);
      });
    });
    
    return Array.from(allParticipants.values());
  };

  const handleScheduleSummit = (summitData: Omit<Summit, 'id' | 'status'>) => {
    const newSummit: Summit = {
      ...summitData,
      id: `summit_${Date.now()}`,
      status: 'scheduled'
    };

    setScheduledSummits(prev => [...prev, newSummit]);
    setShowSummitScheduler(false);

    // Show success message with participant breakdown
    const playerCount = newSummit.participants.filter(p => p.type === 'player').length;
    const characterCount = newSummit.participants.filter(p => p.type === 'character').length;
    
    alert(`Summit "${newSummit.title}" scheduled successfully!\n` +
          `Participants: ${playerCount} players, ${characterCount} characters\n` +
          `Date: ${newSummit.scheduledTime.toLocaleString()}`);

    console.log('Channel-wide summit scheduled:', newSummit);
  };

  const openChannelSummitScheduler = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowSummitScheduler(true);
  };

  const renderChannelCard = (channel: Channel) => {
    const playerCount = channel.participants.filter(p => p.type === 'player').length;
    const characterCount = channel.participants.filter(p => p.type === 'character').length;
    const availableCount = channel.participants.filter(p => p.availability === 'available').length;

    return (
      <div
        key={channel.id}
        style={{
          background: 'rgba(15, 15, 35, 0.8)',
          border: '1px solid rgba(78, 205, 196, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h3 style={{ color: '#4ecdc4', margin: '0 0 4px 0', fontSize: '18px' }}>
              #{channel.name}
            </h3>
            <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>
              {channel.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666' }}>
              <span>👥 {playerCount} players</span>
              <span>🤖 {characterCount} characters</span>
              <span>✅ {availableCount} available</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => openChannelSummitScheduler(channel)}
              style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid rgba(76, 175, 80, 0.4)',
                color: '#4CAF50',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📅 Schedule Channel Summit
            </button>
            
            {playerCount > 1 && (
              <button
                onClick={() => {
                  // Quick schedule with all players
                  setSelectedChannel(channel);
                  setShowSummitScheduler(true);
                  // Auto-select all players when scheduler opens
                  setTimeout(() => {
                    // This would trigger the "All Channel Players" button
                  }, 100);
                }}
                style={{
                  background: 'rgba(33, 150, 243, 0.2)',
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  color: '#2196F3',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                👥 All {playerCount} Players
              </button>
            )}
          </div>
        </div>

        {/* Show channel participants */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {channel.participants.slice(0, 6).map(participant => (
            <div
              key={participant.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(26, 26, 46, 0.6)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                border: `1px solid ${participant.availability === 'available' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 152, 0, 0.4)'}`
              }}
            >
              <img
                src={participant.avatar}
                alt={participant.name}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%234ecdc4"/><text x="8" y="11" text-anchor="middle" fill="white" font-size="10">${participant.name.charAt(0)}</text></svg>`;
                }}
              />
              <span style={{ color: participant.type === 'player' ? '#FFC107' : '#888' }}>
                {participant.name.split(' ')[0]}
              </span>
              {participant.type === 'player' && (
                <span style={{ color: '#FFC107', fontSize: '10px' }}>👤</span>
              )}
            </div>
          ))}
          {channel.participants.length > 6 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              color: '#666',
              fontSize: '11px'
            }}>
              +{channel.participants.length - 6} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      padding: '24px',
      background: 'rgba(15, 15, 35, 0.9)',
      minHeight: '100vh',
      color: '#e8e8e8'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#4ecdc4', marginBottom: '8px' }}>
          📅 Channel Summit Scheduling
        </h1>
        <p style={{ color: '#888', marginBottom: '32px' }}>
          Schedule summits with all players in specific channels for coordinated decision-making.
        </p>

        {/* Scheduled Summits Overview */}
        {scheduledSummits.length > 0 && (
          <div style={{
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(78, 205, 196, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h2 style={{ color: '#4ecdc4', margin: '0 0 16px 0', fontSize: '18px' }}>
              📋 Upcoming Summits ({scheduledSummits.length})
            </h2>
            
            {scheduledSummits.map(summit => (
              <div key={summit.id} style={{
                background: 'rgba(15, 15, 35, 0.6)',
                border: '1px solid rgba(78, 205, 196, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#e8e8e8', margin: '0 0 4px 0', fontSize: '16px' }}>
                      {summit.title}
                    </h3>
                    <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>
                      {summit.scheduledTime.toLocaleString()} • {summit.duration} min • {summit.type.toUpperCase()}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#666' }}>
                      <span>
                        👥 {summit.participants.filter(p => p.type === 'player').length} players
                      </span>
                      <span>
                        🤖 {summit.participants.filter(p => p.type === 'character').length} characters
                      </span>
                    </div>
                  </div>
                  
                  <button style={{
                    background: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                    color: '#4CAF50',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Join Summit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Channels List */}
        <div>
          <h2 style={{ color: '#4ecdc4', marginBottom: '16px', fontSize: '20px' }}>
            🏛️ Available Channels
          </h2>
          
          {channels.map(renderChannelCard)}
        </div>

        {/* Summit Scheduler Modal */}
        {showSummitScheduler && selectedChannel && (
          <SummitScheduler
            availableParticipants={getAllParticipants()}
            currentUserId="player_001"
            onScheduleSummit={handleScheduleSummit}
            onClose={() => {
              setShowSummitScheduler(false);
              setSelectedChannel(null);
            }}
            existingSummits={scheduledSummits}
            channelContext={{
              channelId: selectedChannel.id,
              channelName: selectedChannel.name,
              channelType: selectedChannel.type,
              allChannelParticipants: selectedChannel.participants
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WhoseAppWithChannelSummits;

