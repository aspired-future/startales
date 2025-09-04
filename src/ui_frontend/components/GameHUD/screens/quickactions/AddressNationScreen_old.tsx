import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

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
}

export const AddressNationScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [speechOptions, setSpeechOptions] = useState<QuickSpeechOption[]>([]);
  const [sentiment, setSentiment] = useState<PublicSentiment | null>(null);
  const [metrics, setMetrics] = useState<AddressMetrics | null>(null);
  const [selectedSpeech, setSelectedSpeech] = useState<QuickSpeechOption | null>(null);
  const [loading, setLoading] = useState(true);

  // Utility functions
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return '#ef4444';
      case 'scheduled': return '#f59e0b';
      case 'planned': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'policy': return '#4facfe';
      case 'crisis': return '#ef4444';
      case 'celebration': return '#10b981';
      case 'diplomatic': return '#06b6d4';
      case 'economic': return '#fbbf24';
      case 'military': return '#fb7185';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return '#10b981';
      case 'falling': return '#ef4444';
      case 'stable': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getApprovalColor = (approval: number) => {
    if (approval >= 70) return '#10b981';
    if (approval >= 50) return '#f59e0b';
    return '#ef4444';
  };

  useEffect(() => {
    if (isVisible) {
      loadAddressData();
    }
  }, [isVisible]);

  const loadAddressData = async () => {
    setLoading(true);
    try {
      // Try API first, fallback to mock data
      const response = await fetch('http://localhost:4000/api/address-nation');
      if (response.ok) {
        const data = await response.json();
        setSpeechOptions(data.speechOptions);
        setSentiment(data.sentiment);
        setMetrics(data.metrics);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      // Comprehensive mock data
      const mockSpeechOptions: QuickSpeechOption[] = [
        {
          id: 'speech-001',
          name: 'Economic Recovery Address',
          category: 'economic',
          description: 'Address recent economic challenges and outline recovery plan',
          urgency: 'scheduled',
          estimatedDuration: 15,
          icon: '💰'
        },
        {
          id: 'speech-002',
          name: 'Security Briefing to Citizens',
          category: 'crisis',
          description: 'Inform public about recent security measures and threat assessments',
          urgency: 'immediate',
          estimatedDuration: 10,
          icon: '🛡️'
        },
        {
          id: 'speech-003',
          name: 'New Colony Celebration',
          category: 'celebration',
          description: 'Celebrate the successful establishment of New Terra colony',
          urgency: 'planned',
          estimatedDuration: 20,
          icon: '🎉'
        },
        {
          id: 'speech-004',
          name: 'Diplomatic Relations Update',
          category: 'diplomatic',
          description: 'Update on ongoing negotiations with neighboring systems',
          urgency: 'scheduled',
          estimatedDuration: 12,
          icon: '🤝'
        },
        {
          id: 'speech-005',
          name: 'Military Readiness Report',
          category: 'military',
          description: 'Report on fleet modernization and defense capabilities',
          urgency: 'planned',
          estimatedDuration: 18,
          icon: '⚔️'
        },
        {
          id: 'speech-006',
          name: 'Technology Innovation Showcase',
          category: 'policy',
          description: 'Highlight recent technological breakthroughs and their benefits',
          urgency: 'planned',
          estimatedDuration: 25,
          icon: '🚀'
        }
      ];

      const mockSentiment: PublicSentiment = {
        overallApproval: 67.3,
        economicConfidence: 72.1,
        securityConfidence: 58.9,
        leadershipTrust: 71.5,
        recentTrends: {
          approval: 'rising',
          concerns: [
            'Rising cost of living',
            'Security in outer colonies',
            'Trade route disruptions',
            'Resource allocation'
          ],
          positives: [
            'Technological advancement',
            'Diplomatic stability',
            'Military modernization',
            'Colonial expansion success'
          ]
        }
      };

      const mockMetrics: AddressMetrics = {
        lastAddress: '2387.152.16:30',
        totalAddresses: 47,
        averageApprovalBoost: 8.4,
        mostEffectiveCategory: 'celebration'
      };

      setSpeechOptions(mockSpeechOptions);
      setSentiment(mockSentiment);
      setMetrics(mockMetrics);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverSpeech = (speechId: string) => {
    // Implement speech delivery functionality
    console.log(`Delivering speech ${speechId}`);
    // This would trigger the speech delivery process
  };

  // Chart data
  const sentimentData = sentiment ? [
    { label: 'Overall Approval', value: sentiment.overallApproval },
    { label: 'Economic Confidence', value: sentiment.economicConfidence },
    { label: 'Security Confidence', value: sentiment.securityConfidence },
    { label: 'Leadership Trust', value: sentiment.leadershipTrust }
  ] : [];

  const speechCategoryData = [
    { label: 'Policy', value: speechOptions.filter(s => s.category === 'policy').length },
    { label: 'Crisis', value: speechOptions.filter(s => s.category === 'crisis').length },
    { label: 'Celebration', value: speechOptions.filter(s => s.category === 'celebration').length },
    { label: 'Diplomatic', value: speechOptions.filter(s => s.category === 'diplomatic').length },
    { label: 'Economic', value: speechOptions.filter(s => s.category === 'economic').length },
    { label: 'Military', value: speechOptions.filter(s => s.category === 'military').length }
  ];

  const urgencyData = [
    { label: 'Immediate', value: speechOptions.filter(s => s.urgency === 'immediate').length },
    { label: 'Scheduled', value: speechOptions.filter(s => s.urgency === 'scheduled').length },
    { label: 'Planned', value: speechOptions.filter(s => s.urgency === 'planned').length }
  ];

  if (loading) {
    return (
      <QuickActionBase
        title="Address the Nation"
        icon="📢"
        onClose={onClose}
        isVisible={isVisible}
        className="social-theme"
      >
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'var(--social-accent)',
            fontSize: '18px'
          }}>
            Loading address options...
          </div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="Address the Nation"
      icon="📢"
      onClose={onClose}
      isVisible={isVisible}
      className="social-theme"
    >
      {/* Public Sentiment Overview */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Public Sentiment</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Overall Approval</span>
            <span className="standard-metric-value" style={{ color: getApprovalColor(sentiment?.overallApproval || 0) }}>
              {sentiment?.overallApproval || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Economic Confidence</span>
            <span className="standard-metric-value" style={{ color: getApprovalColor(sentiment?.economicConfidence || 0) }}>
              {sentiment?.economicConfidence || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Security Confidence</span>
            <span className="standard-metric-value" style={{ color: getApprovalColor(sentiment?.securityConfidence || 0) }}>
              {sentiment?.securityConfidence || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Leadership Trust</span>
            <span className="standard-metric-value" style={{ color: getApprovalColor(sentiment?.leadershipTrust || 0) }}>
              {sentiment?.leadershipTrust || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Approval Trend</span>
            <span className="standard-metric-value" style={{ 
              color: getTrendColor(sentiment?.recentTrends.approval || 'stable'),
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}>
              {sentiment?.recentTrends.approval || 'STABLE'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Avg Approval Boost</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              +{metrics?.averageApprovalBoost || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Sentiment Analytics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📈 Sentiment Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Public Confidence Metrics
            </h4>
            <BarChart data={sentimentData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Speech Categories
            </h4>
            <PieChart data={speechCategoryData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Speech Urgency
            </h4>
            <PieChart data={urgencyData} />
          </div>
        </div>
      </div>

      {/* Public Concerns & Positives */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🗣️ Public Opinion</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#ef4444', marginBottom: '10px' }}>⚠️ Current Concerns</h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
              {sentiment?.recentTrends.concerns.map((concern, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{concern}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#10b981', marginBottom: '10px' }}>✅ Positive Feedback</h4>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
              {sentiment?.recentTrends.positives.map((positive, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{positive}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Speech Options */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">🎤 Available Speeches</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Speech</th>
                <th>Category</th>
                <th>Urgency</th>
                <th>Duration</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {speechOptions.map(speech => (
                <tr key={speech.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2em' }}>{speech.icon}</span>
                      <div style={{ fontWeight: 'bold' }}>{speech.name}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(speech.category),
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {speech.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getUrgencyColor(speech.urgency),
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {speech.urgency}
                    </span>
                  </td>
                  <td>{speech.estimatedDuration} min</td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                      {speech.description}
                    </div>
                  </td>
                  <td>
                    <div className="standard-action-buttons">
                      <button
                        className="standard-btn social-theme"
                        onClick={() => setSelectedSpeech(speech)}
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                      >
                        Preview
                      </button>
                      <button
                        className="standard-btn social-theme"
                        onClick={() => handleDeliverSpeech(speech.id)}
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                      >
                        Deliver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Speech Preview Modal */}
      {selectedSpeech && (
        <div className="standard-card" style={{ 
          gridColumn: '1 / -1', 
          marginTop: '20px',
          border: '2px solid var(--social-accent)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }}>
          <h3 className="standard-card-title">
            {selectedSpeech.icon} {selectedSpeech.name}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px' }}>Speech Details</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Category</span>
                  <span className="standard-metric-value" style={{ color: getCategoryColor(selectedSpeech.category) }}>
                    {selectedSpeech.category}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Urgency</span>
                  <span className="standard-metric-value" style={{ color: getUrgencyColor(selectedSpeech.urgency) }}>
                    {selectedSpeech.urgency}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Duration</span>
                  <span className="standard-metric-value">{selectedSpeech.estimatedDuration} minutes</span>
                </div>
              </div>
              
              <h4 style={{ color: 'var(--social-accent)', marginTop: '15px', marginBottom: '10px' }}>Description</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {selectedSpeech.description}
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px' }}>Expected Impact</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Approval Boost</span>
                  <span className="standard-metric-value" style={{ color: '#10b981' }}>
                    +{Math.floor(Math.random() * 15) + 5}%
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Reach</span>
                  <span className="standard-metric-value">
                    {(Math.random() * 50 + 70).toFixed(1)}M citizens
                  </span>
                </div>
              </div>
              
              <h4 style={{ color: 'var(--social-accent)', marginTop: '15px', marginBottom: '10px' }}>
                Recommended Timing
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                {selectedSpeech.urgency === 'immediate' ? 
                  'Deliver immediately for maximum impact' :
                  selectedSpeech.urgency === 'scheduled' ?
                  'Schedule for prime viewing hours (18:00-20:00)' :
                  'Plan for upcoming ceremonial or policy announcement events'
                }
              </p>
            </div>
          </div>
          
          <div className="standard-action-buttons">
            <button
              className="standard-btn social-theme"
              onClick={() => handleDeliverSpeech(selectedSpeech.id)}
            >
              Deliver Speech Now
            </button>
            <button
              className="standard-btn social-theme"
              onClick={() => console.log('Schedule speech')}
            >
              Schedule Speech
            </button>
            <button
              className="standard-btn social-theme"
              onClick={() => setSelectedSpeech(null)}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </QuickActionBase>
  );
};

export default AddressNationScreen;
