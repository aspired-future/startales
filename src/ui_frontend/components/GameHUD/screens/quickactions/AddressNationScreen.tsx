import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';

interface QuickSpeechOption {
  id: string;
  name: string;
  category: 'policy' | 'crisis' | 'celebration' | 'diplomatic' | 'economic' | 'military';
  description: string;
  urgency: 'immediate' | 'scheduled' | 'planned';
  estimatedDuration: number;
  icon: string;
}

interface PublicSentiment {
  overallApproval: number;
  economicConfidence: number;
  securityConfidence: number;
  leadershipTrust: number;
  recentTrends: {
    approval: 'rising' | 'falling' | 'stable';
    concerns: string[];
    positives: string[];
  };
}

interface AddressMetrics {
  lastAddress: string;
  totalAddresses: number;
  averageApprovalBoost: number;
  mostEffectiveCategory: string;
  upcomingEvents: string[];
}

export const AddressNationScreen: React.FC<QuickActionProps & { onOpenScreen?: (screenId: string) => void }> = ({ 
  onClose, 
  isVisible, 
  onOpenScreen 
}) => {
  const [quickOptions, setQuickOptions] = useState<QuickSpeechOption[]>([]);
  const [publicSentiment, setPublicSentiment] = useState<PublicSentiment | null>(null);
  const [metrics, setMetrics] = useState<AddressMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadAddressData();
    }
  }, [isVisible]);

  const loadAddressData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockQuickOptions: QuickSpeechOption[] = [
        {
          id: 'emergency-address',
          name: 'Emergency Address',
          category: 'crisis',
          description: 'Immediate address to the nation about urgent matters',
          urgency: 'immediate',
          estimatedDuration: 15,
          icon: '🚨'
        },
        {
          id: 'policy-announcement',
          name: 'Policy Announcement',
          category: 'policy',
          description: 'Announce new policies or government initiatives',
          urgency: 'scheduled',
          estimatedDuration: 30,
          icon: '📜'
        },
        {
          id: 'victory-celebration',
          name: 'Victory Celebration',
          category: 'celebration',
          description: 'Celebrate achievements and victories',
          urgency: 'planned',
          estimatedDuration: 20,
          icon: '🎉'
        },
        {
          id: 'economic-update',
          name: 'Economic Update',
          category: 'economic',
          description: 'Address economic conditions and financial policies',
          urgency: 'scheduled',
          estimatedDuration: 25,
          icon: '💰'
        },
        {
          id: 'diplomatic-statement',
          name: 'Diplomatic Statement',
          category: 'diplomatic',
          description: 'Address international relations and diplomatic matters',
          urgency: 'scheduled',
          estimatedDuration: 20,
          icon: '🤝'
        },
        {
          id: 'military-address',
          name: 'Military Address',
          category: 'military',
          description: 'Address military personnel and defense matters',
          urgency: 'planned',
          estimatedDuration: 25,
          icon: '⚔️'
        }
      ];

      const mockSentiment: PublicSentiment = {
        overallApproval: 67,
        economicConfidence: 72,
        securityConfidence: 84,
        leadershipTrust: 69,
        recentTrends: {
          approval: 'rising',
          concerns: ['Economic inequality', 'Border security', 'Healthcare costs'],
          positives: ['Job growth', 'Technological advancement', 'Diplomatic progress']
        }
      };

      const mockMetrics: AddressMetrics = {
        lastAddress: '2387.145.19:30',
        totalAddresses: 23,
        averageApprovalBoost: 4.2,
        mostEffectiveCategory: 'economic',
        upcomingEvents: ['Trade Summit', 'Military Parade', 'Science Fair']
      };

      setQuickOptions(mockQuickOptions);
      setPublicSentiment(mockSentiment);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load address data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (value: number) => {
    if (value >= 70) return '#28a745';
    if (value >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return '#dc3545';
      case 'scheduled': return '#ffc107';
      case 'planned': return '#28a745';
      default: return '#6c757d';
    }
  };

  const handleQuickSpeech = (option: QuickSpeechOption) => {
    console.log(`Initiating quick speech: ${option.name}`);
    // This would typically create a new speech in the system and open the speeches screen
    if (onOpenScreen) {
      onOpenScreen('speeches');
    }
    onClose();
  };

  const handleOpenFullSpeechSystem = () => {
    if (onOpenScreen) {
      onOpenScreen('speeches');
    }
    onClose();
  };

  if (loading) {
    return (
      <QuickActionBase
        title="Address the Nation"
        icon="🎤"
        onClose={onClose}
        isVisible={isVisible}
        className="address-nation"
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ color: '#4ecdc4', fontSize: '18px' }}>Loading address options...</div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="Address the Nation"
      icon="🎤"
      onClose={onClose}
      isVisible={isVisible}
      className="address-nation"
    >
      {/* Public Sentiment Overview */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>📊 Public Sentiment Overview</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value" style={{ color: getSentimentColor(publicSentiment?.overallApproval || 0) }}>
              {publicSentiment?.overallApproval || 0}%
            </div>
            <div className="metric-label">Overall Approval</div>
            <div className={`metric-change ${publicSentiment?.recentTrends.approval === 'rising' ? 'positive' : publicSentiment?.recentTrends.approval === 'falling' ? 'negative' : ''}`}>
              {publicSentiment?.recentTrends.approval === 'rising' ? '↗️ Rising' : 
               publicSentiment?.recentTrends.approval === 'falling' ? '↘️ Falling' : '→ Stable'}
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: getSentimentColor(publicSentiment?.economicConfidence || 0) }}>
              {publicSentiment?.economicConfidence || 0}%
            </div>
            <div className="metric-label">Economic Confidence</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: getSentimentColor(publicSentiment?.securityConfidence || 0) }}>
              {publicSentiment?.securityConfidence || 0}%
            </div>
            <div className="metric-label">Security Confidence</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: getSentimentColor(publicSentiment?.leadershipTrust || 0) }}>
              {publicSentiment?.leadershipTrust || 0}%
            </div>
            <div className="metric-label">Leadership Trust</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">+{metrics?.averageApprovalBoost || 0}%</div>
            <div className="metric-label">Avg Approval Boost</div>
          </div>
        </div>
      </div>

      {/* Current Issues */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="action-card">
            <h3 style={{ color: '#dc3545' }}>⚠️ Current Concerns</h3>
            <ul style={{ color: '#ccc', margin: '10px 0', fontSize: '14px' }}>
              {publicSentiment?.recentTrends.concerns.map((concern, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{concern}</li>
              ))}
            </ul>
          </div>
          <div className="action-card">
            <h3 style={{ color: '#28a745' }}>✅ Recent Positives</h3>
            <ul style={{ color: '#ccc', margin: '10px 0', fontSize: '14px' }}>
              {publicSentiment?.recentTrends.positives.map((positive, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{positive}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Speech Options */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>🎤 Quick Speech Options</h3>
        <div className="action-grid">
          {quickOptions.map(option => (
            <div key={option.id} className="action-card">
              <h3 style={{ color: getUrgencyColor(option.urgency) }}>
                {option.icon} {option.name}
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <span className={`status-indicator ${option.urgency === 'immediate' ? 'critical' : option.urgency === 'scheduled' ? 'warning' : 'online'}`}>
                  {option.urgency.toUpperCase()}
                </span>
                <span className="status-indicator online" style={{ marginLeft: '10px' }}>
                  {option.estimatedDuration} MIN
                </span>
              </div>
              <p>{option.description}</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className={`action-btn ${option.urgency === 'immediate' ? 'urgent' : ''}`}
                  onClick={() => handleQuickSpeech(option)}
                >
                  🎤 Start Speech
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full System Access */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>🎯 Advanced Options</h3>
        <div className="action-grid">
          <div className="action-card">
            <h3>📝 Full Speech System</h3>
            <p>Access the complete speech management system with templates, scheduling, and analytics</p>
            <button 
              className="action-btn"
              onClick={handleOpenFullSpeechSystem}
            >
              🎤 Open Speech System
            </button>
          </div>
          <div className="action-card">
            <h3>📺 Live Broadcast</h3>
            <p>Start immediate live address to all citizens across all channels</p>
            <button className="action-btn urgent">📡 Go Live Now</button>
          </div>
          <div className="action-card">
            <h3>📊 Speech Analytics</h3>
            <p>Review past addresses and their effectiveness on public opinion</p>
            <button 
              className="action-btn secondary"
              onClick={handleOpenFullSpeechSystem}
            >
              📈 View Analytics
            </button>
          </div>
          <div className="action-card">
            <h3>📅 Schedule Address</h3>
            <p>Plan and schedule future addresses for optimal timing and impact</p>
            <button 
              className="action-btn secondary"
              onClick={handleOpenFullSpeechSystem}
            >
              📅 Schedule Speech
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>📈 Recent Activity</h3>
        <div style={{ 
          background: 'rgba(26, 26, 46, 0.6)', 
          border: '1px solid rgba(78, 205, 196, 0.2)', 
          borderRadius: '8px', 
          padding: '20px' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <div style={{ color: '#888', fontSize: '12px' }}>Last Address</div>
              <div style={{ color: '#4ecdc4', fontSize: '14px' }}>{metrics?.lastAddress}</div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '12px' }}>Total Addresses</div>
              <div style={{ color: '#4ecdc4', fontSize: '14px' }}>{metrics?.totalAddresses}</div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '12px' }}>Most Effective</div>
              <div style={{ color: '#4ecdc4', fontSize: '14px', textTransform: 'capitalize' }}>{metrics?.mostEffectiveCategory}</div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '12px' }}>Upcoming Events</div>
              <div style={{ color: '#4ecdc4', fontSize: '14px' }}>{metrics?.upcomingEvents?.length || 0} scheduled</div>
            </div>
          </div>
        </div>
      </div>
    </QuickActionBase>
  );
};

export default AddressNationScreen;