import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';

interface BriefingItem {
  id: string;
  category: 'security' | 'economy' | 'diplomacy' | 'science' | 'population' | 'intelligence';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  summary: string;
  details: string;
  timestamp: string;
  source: string;
  actionRequired: boolean;
  relatedSystems: string[];
}

interface BriefingMetrics {
  totalItems: number;
  highPriorityItems: number;
  actionRequiredItems: number;
  lastUpdated: string;
  briefingCompleteness: number;
}

export const DailyBriefingScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [briefingItems, setBriefingItems] = useState<BriefingItem[]>([]);
  const [metrics, setMetrics] = useState<BriefingMetrics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BriefingItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadBriefingData();
    }
  }, [isVisible]);

  const loadBriefingData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBriefingItems: BriefingItem[] = [
        {
          id: 'brief-001',
          category: 'security',
          priority: 'high',
          title: 'Increased Pirate Activity in Outer Rim',
          summary: 'Intelligence reports show 23% increase in pirate raids over the past week.',
          details: 'Our intelligence networks have detected a significant uptick in pirate activity across the Outer Rim territories. Three major shipping lanes have been affected, with cargo losses estimated at 2.3 million credits. The Crimson Fleet appears to be coordinating these attacks, suggesting a more organized threat than previously assessed.',
          timestamp: '2387.156.06:00',
          source: 'Intelligence Division',
          actionRequired: true,
          relatedSystems: ['Security', 'Trade', 'Military']
        },
        {
          id: 'brief-002',
          category: 'economy',
          priority: 'medium',
          title: 'Quarterly GDP Growth Exceeds Projections',
          summary: 'Economic indicators show 2.8% growth, surpassing the projected 2.1%.',
          details: 'The galactic economy continues to show robust growth, driven primarily by technological innovation and expanded trade routes. Key sectors showing exceptional performance include renewable energy (+15%), interstellar shipping (+8%), and advanced manufacturing (+12%). This growth trajectory positions us well for the upcoming fiscal year.',
          timestamp: '2387.156.05:30',
          source: 'Economic Analysis Department',
          actionRequired: false,
          relatedSystems: ['Economy', 'Trade', 'Technology']
        },
        {
          id: 'brief-003',
          category: 'diplomacy',
          priority: 'critical',
          title: 'Centauri Alliance Requests Emergency Summit',
          summary: 'Ambassador Chen has requested urgent diplomatic meeting regarding border tensions.',
          details: 'The Centauri Alliance has formally requested an emergency diplomatic summit to address escalating tensions along the Neutral Zone. Recent military buildups on both sides have raised concerns about potential conflict. Ambassador Chen emphasizes the need for immediate de-escalation measures.',
          timestamp: '2387.156.04:15',
          source: 'Diplomatic Corps',
          actionRequired: true,
          relatedSystems: ['Diplomacy', 'Military', 'Intelligence']
        },
        {
          id: 'brief-004',
          category: 'science',
          priority: 'medium',
          title: 'Breakthrough in Quantum Computing Research',
          summary: 'Research team achieves 99.7% quantum coherence stability.',
          details: 'Dr. Martinez\'s team at the Galactic Research Institute has achieved a major breakthrough in quantum computing stability. This advancement could revolutionize our computational capabilities and provide significant advantages in encryption, simulation, and AI development.',
          timestamp: '2387.156.03:45',
          source: 'Galactic Research Institute',
          actionRequired: false,
          relatedSystems: ['Science', 'Technology', 'Defense']
        },
        {
          id: 'brief-005',
          category: 'population',
          priority: 'low',
          title: 'Population Growth Steady Across Core Worlds',
          summary: 'Core world populations show healthy 1.2% annual growth rate.',
          details: 'Demographic analysis indicates stable population growth across all core worlds, with Terra Nova leading at 1.8% growth. Immigration from outer colonies continues to contribute positively to workforce expansion and cultural diversity.',
          timestamp: '2387.156.02:20',
          source: 'Demographics Bureau',
          actionRequired: false,
          relatedSystems: ['Population', 'Economy', 'Immigration']
        },
        {
          id: 'brief-006',
          category: 'intelligence',
          priority: 'high',
          title: 'Unusual Energy Signatures Detected',
          summary: 'Deep space sensors detect anomalous energy patterns in unexplored sector.',
          details: 'Long-range sensors have detected unusual energy signatures in the Kepler-442 system. The patterns don\'t match any known natural phenomena or technology signatures in our databases. Recommend deploying a scientific survey mission to investigate.',
          timestamp: '2387.156.01:10',
          source: 'Deep Space Monitoring',
          actionRequired: true,
          relatedSystems: ['Intelligence', 'Science', 'Exploration']
        }
      ];

      const mockMetrics: BriefingMetrics = {
        totalItems: mockBriefingItems.length,
        highPriorityItems: mockBriefingItems.filter(item => item.priority === 'high' || item.priority === 'critical').length,
        actionRequiredItems: mockBriefingItems.filter(item => item.actionRequired).length,
        lastUpdated: '2387.156.06:00',
        briefingCompleteness: 94
      };

      setBriefingItems(mockBriefingItems);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load briefing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return '🛡️';
      case 'economy': return '💰';
      case 'diplomacy': return '🤝';
      case 'science': return '🔬';
      case 'population': return '👥';
      case 'intelligence': return '🕵️';
      default: return '📋';
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? briefingItems 
    : briefingItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <QuickActionBase
        title="Daily Intelligence Briefing"
        icon="📋"
        onClose={onClose}
        isVisible={isVisible}
        className="daily-briefing"
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ color: '#4ecdc4', fontSize: '18px' }}>Loading briefing data...</div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="Daily Intelligence Briefing"
      icon="📋"
      onClose={onClose}
      isVisible={isVisible}
      className="daily-briefing"
    >
      {/* Briefing Metrics */}
      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-value">{metrics?.totalItems || 0}</div>
          <div className="metric-label">Total Items</div>
        </div>
        <div className="metric-item">
          <div className="metric-value" style={{ color: '#fd7e14' }}>{metrics?.highPriorityItems || 0}</div>
          <div className="metric-label">High Priority</div>
        </div>
        <div className="metric-item">
          <div className="metric-value" style={{ color: '#dc3545' }}>{metrics?.actionRequiredItems || 0}</div>
          <div className="metric-label">Action Required</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{metrics?.briefingCompleteness || 0}%</div>
          <div className="metric-label">Completeness</div>
        </div>
        <div className="metric-item">
          <div className="metric-value" style={{ fontSize: '16px' }}>{metrics?.lastUpdated || 'N/A'}</div>
          <div className="metric-label">Last Updated</div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>📂 Filter by Category</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {['all', 'security', 'economy', 'diplomacy', 'science', 'population', 'intelligence'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`action-btn ${selectedCategory === category ? '' : 'secondary'}`}
              style={{ 
                textTransform: 'capitalize',
                fontSize: '12px',
                padding: '8px 16px'
              }}
            >
              {category === 'all' ? '📋 All' : `${getCategoryIcon(category)} ${category}`}
            </button>
          ))}
        </div>
      </div>

      {/* Briefing Items */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>
          📰 Briefing Items ({filteredItems.length})
        </h3>
        <div className="action-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="action-card">
              <h3 style={{ color: getPriorityColor(item.priority) }}>
                {getCategoryIcon(item.category)} {item.title}
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <span className={`status-indicator ${item.priority === 'critical' ? 'critical' : item.priority === 'high' ? 'warning' : 'online'}`}>
                  {item.priority.toUpperCase()}
                </span>
                {item.actionRequired && (
                  <span className="status-indicator critical" style={{ marginLeft: '10px' }}>
                    ACTION REQUIRED
                  </span>
                )}
              </div>
              <p>{item.summary}</p>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
                <div>⏰ {item.timestamp}</div>
                <div>📡 Source: {item.source}</div>
                <div>🔗 Systems: {item.relatedSystems.join(', ')}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className="action-btn"
                  onClick={() => setSelectedItem(item)}
                >
                  📖 Read Full Details
                </button>
                {item.actionRequired && (
                  <button className="action-btn urgent">
                    ⚡ Take Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>⚡ Briefing Actions</h3>
        <div className="action-grid">
          <div className="action-card">
            <h3>📊 Generate Full Report</h3>
            <p>Create comprehensive briefing document for cabinet review</p>
            <button className="action-btn">Generate Report</button>
          </div>
          <div className="action-card">
            <h3>📧 Share Briefing</h3>
            <p>Distribute briefing to key advisors and department heads</p>
            <button className="action-btn">Share Briefing</button>
          </div>
          <div className="action-card">
            <h3>🔄 Refresh Data</h3>
            <p>Update briefing with latest intelligence and reports</p>
            <button className="action-btn secondary" onClick={loadBriefingData}>
              Refresh Now
            </button>
          </div>
          <div className="action-card">
            <h3>📅 Schedule Follow-up</h3>
            <p>Set reminders for action items and priority issues</p>
            <button className="action-btn secondary">Schedule</button>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
            border: '2px solid #4ecdc4',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#4ecdc4', margin: 0 }}>
                {getCategoryIcon(selectedItem.category)} {selectedItem.title}
              </h2>
              <button 
                onClick={() => setSelectedItem(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #ff453a',
                  color: '#ff453a',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span className={`status-indicator ${selectedItem.priority === 'critical' ? 'critical' : selectedItem.priority === 'high' ? 'warning' : 'online'}`}>
                  {selectedItem.priority.toUpperCase()}
                </span>
                {selectedItem.actionRequired && (
                  <span className="status-indicator critical">
                    ACTION REQUIRED
                  </span>
                )}
              </div>
              
              <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
                <div>⏰ Timestamp: {selectedItem.timestamp}</div>
                <div>📡 Source: {selectedItem.source}</div>
                <div>🔗 Related Systems: {selectedItem.relatedSystems.join(', ')}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>📋 Summary:</h4>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>{selectedItem.summary}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>📖 Full Details:</h4>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>{selectedItem.details}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {selectedItem.actionRequired && (
                <button className="action-btn urgent">
                  ⚡ Take Action
                </button>
              )}
              <button className="action-btn">
                📧 Forward to Advisor
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </QuickActionBase>
  );
};

export default DailyBriefingScreen;
