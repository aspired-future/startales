/**
 * Example integration of Summit Scheduler into WhoseApp
 * This shows how to add the "Schedule Summit" functionality to channels
 */

import React, { useState } from 'react';
import SummitScheduler, { Summit, SummitParticipant } from '../src/ui_frontend/components/WhoseApp/SummitScheduler';

// Example of how to integrate summit scheduling into WhoseApp channels
const WhoseAppChannelWithSummits: React.FC = () => {
  const [showSummitScheduler, setShowSummitScheduler] = useState(false);
  const [scheduledSummits, setScheduledSummits] = useState<Summit[]>([]);

  // Mock channel participants (in real app, this would come from channel data)
  const channelParticipants: SummitParticipant[] = [
    {
      id: 'player_001',
      name: 'You',
      type: 'player',
      avatar: '/api/avatars/player_default.jpg',
      title: 'Civilization Leader',
      availability: 'available'
    },
    {
      id: 'char_diplomat_001',
      name: 'Ambassador Elena Vasquez',
      type: 'character',
      avatar: '/api/characters/avatars/elena_vasquez.jpg',
      title: 'Chief Diplomat',
      availability: 'available'
    },
    {
      id: 'char_economist_001',
      name: 'Dr. Marcus Chen',
      type: 'character',
      avatar: '/api/characters/avatars/marcus_chen.jpg',
      title: 'Economic Advisor',
      availability: 'busy'
    },
    {
      id: 'char_commander_001',
      name: 'Commander Alpha',
      type: 'character',
      avatar: '/api/characters/avatars/commander_alpha.jpg',
      title: 'Military Commander',
      availability: 'available'
    }
  ];

  const handleScheduleSummit = (summitData: Omit<Summit, 'id' | 'status'>) => {
    const newSummit: Summit = {
      ...summitData,
      id: `summit_${Date.now()}`,
      status: 'scheduled'
    };

    setScheduledSummits(prev => [...prev, newSummit]);
    setShowSummitScheduler(false);

    // In a real app, you would also:
    // 1. Save to backend/database
    // 2. Send notifications to participants
    // 3. Add to calendar system
    // 4. Create WebSocket room for the summit

    console.log('Summit scheduled:', newSummit);
    alert(`Summit "${newSummit.title}" scheduled successfully!`);
  };

  return (
    <div className="channel-view">
      {/* Channel Header with Summit Button */}
      <div className="channel-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: 'rgba(26, 26, 46, 0.6)',
        border: '1px solid rgba(78, 205, 196, 0.2)',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <h3 style={{ color: '#4ecdc4', margin: '0 0 4px 0' }}>
            # Strategic Planning
          </h3>
          <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>
            {channelParticipants.length} members
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowSummitScheduler(true)}
            style={{
              background: 'rgba(78, 205, 196, 0.2)',
              border: '1px solid #4ecdc4',
              borderRadius: '8px',
              color: '#4ecdc4',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(78, 205, 196, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(78, 205, 196, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📅 Schedule Summit
          </button>
          
          <button
            style={{
              background: 'rgba(78, 205, 196, 0.1)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: '8px',
              color: '#888',
              padding: '8px 12px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Scheduled Summits Display */}
      {scheduledSummits.length > 0 && (
        <div className="scheduled-summits" style={{
          background: 'rgba(26, 26, 46, 0.4)',
          border: '1px solid rgba(78, 205, 196, 0.2)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#4ecdc4', margin: '0 0 12px 0', fontSize: '14px' }}>
            📅 Upcoming Summits ({scheduledSummits.length})
          </h4>
          
          {scheduledSummits.map(summit => (
            <div key={summit.id} style={{
              background: 'rgba(15, 15, 35, 0.6)',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#e8e8e8', fontWeight: 'bold', fontSize: '14px' }}>
                    {summit.title}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    {summit.scheduledTime.toLocaleString()} • {summit.duration} min • {summit.type.toUpperCase()}
                  </div>
                  <div style={{ color: '#888', fontSize: '11px' }}>
                    {summit.participants.length} participants
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{
                    background: summit.priority === 'critical' ? 'rgba(244, 67, 54, 0.2)' :
                               summit.priority === 'high' ? 'rgba(255, 152, 0, 0.2)' :
                               'rgba(78, 205, 196, 0.2)',
                    color: summit.priority === 'critical' ? '#F44336' :
                           summit.priority === 'high' ? '#FF9800' :
                           '#4ecdc4',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {summit.priority}
                  </span>
                  
                  <button style={{
                    background: 'rgba(76, 175, 80, 0.2)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                    color: '#4CAF50',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}>
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Channel Messages Area */}
      <div className="channel-messages" style={{
        background: 'rgba(15, 15, 35, 0.6)',
        border: '1px solid rgba(78, 205, 196, 0.2)',
        borderRadius: '8px',
        padding: '16px',
        minHeight: '300px'
      }}>
        <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
          Channel messages would appear here...
          <br />
          <small>Characters will respond to messages based on their expertise</small>
        </div>
      </div>

      {/* Summit Scheduler Modal */}
      {showSummitScheduler && (
        <SummitScheduler
          availableParticipants={channelParticipants}
          currentUserId="player_001"
          onScheduleSummit={handleScheduleSummit}
          onClose={() => setShowSummitScheduler(false)}
          existingSummits={scheduledSummits}
        />
      )}
    </div>
  );
};

export default WhoseAppChannelWithSummits;

