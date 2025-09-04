import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

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

  // Utility functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#fb7185';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return '#ef4444';
      case 'economy': return '#fbbf24';
      case 'diplomacy': return '#10b981';
      case 'science': return '#9333ea';
      case 'population': return '#06b6d4';
      case 'intelligence': return '#6b7280';
      default: return '#4facfe';
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadBriefingData();
      const interval = setInterval(loadBriefingData, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const loadBriefingData = async () => {
    setLoading(true);
    try {
      // Try API first, fallback to mock data
      const response = await fetch('http://localhost:4000/api/daily-briefing');
      if (response.ok) {
        const data = await response.json();
        setBriefingItems(data.briefingItems);
        setMetrics(data.metrics);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      // Comprehensive mock data
      const mockBriefingItems: BriefingItem[] = [
        {
          id: 'brief-001',
          category: 'security',
          priority: 'high',
          title: 'Increased Pirate Activity in Outer Rim',
          summary: 'Intelligence reports show 23% increase in pirate raids over the past week.',
          details: 'Our surveillance networks have detected a significant uptick in pirate activity along the Outer Rim trade routes. The Crimson Fleet appears to be coordinating larger-scale operations, targeting merchant vessels carrying rare minerals. Recommend increasing patrol frequency and deploying additional escort ships for high-value cargo runs.',
          timestamp: '2387.156.08:30',
          source: 'Naval Intelligence Division',
          actionRequired: true,
          relatedSystems: ['Naval Command', 'Trade Security', 'Intelligence Network']
        },
        {
          id: 'brief-002',
          category: 'economy',
          priority: 'medium',
          title: 'Quarterly Economic Growth Projections',
          summary: 'Economic analysts project 4.2% growth for Q3, driven by technological exports.',
          details: 'The latest economic models indicate robust growth in the technology sector, particularly in AI systems and quantum computing exports. Manufacturing output has increased by 12% compared to last quarter. However, concerns remain about resource allocation for infrastructure projects and potential supply chain vulnerabilities.',
          timestamp: '2387.156.07:45',
          source: 'Economic Planning Bureau',
          actionRequired: false,
          relatedSystems: ['Economic Monitoring', 'Trade Networks', 'Manufacturing']
        },
        {
          id: 'brief-003',
          category: 'diplomacy',
          priority: 'critical',
          title: 'Urgent: Ambassador Recall from Centauri Prime',
          summary: 'Diplomatic crisis escalating - immediate response required.',
          details: 'The Centauri government has issued an ultimatum regarding our mining operations in the disputed Kepler-442 system. Ambassador Chen reports that negotiations have stalled and the Centauri are threatening to withdraw from the Non-Aggression Pact. Recommend immediate high-level diplomatic intervention to prevent conflict escalation.',
          timestamp: '2387.156.09:15',
          source: 'Diplomatic Corps',
          actionRequired: true,
          relatedSystems: ['Diplomatic Network', 'Military Command', 'Mining Operations']
        },
        {
          id: 'brief-004',
          category: 'science',
          priority: 'high',
          title: 'Breakthrough in Quantum Communication',
          summary: 'Research team achieves stable quantum entanglement over 50 light-years.',
          details: 'Dr. Sarah Kim\'s team at the Advanced Physics Institute has successfully maintained quantum entanglement between particles separated by 50.3 light-years, breaking the previous record by 300%. This breakthrough could revolutionize interstellar communications, reducing message delays from years to instantaneous. Recommend immediate funding increase for Phase 2 trials.',
          timestamp: '2387.156.06:20',
          source: 'Advanced Physics Institute',
          actionRequired: true,
          relatedSystems: ['Research Network', 'Communications', 'Funding Authority']
        },
        {
          id: 'brief-005',
          category: 'population',
          priority: 'medium',
          title: 'Colonial Population Milestone Reached',
          summary: 'New Terra colony reaches 1 million inhabitants ahead of schedule.',
          details: 'The New Terra colonial project has exceeded population growth projections, reaching the 1 million inhabitant milestone 18 months ahead of schedule. Infrastructure is keeping pace with growth, but resource allocation may need adjustment. The success has generated interest from other potential colonial sites.',
          timestamp: '2387.156.05:30',
          source: 'Colonial Administration',
          actionRequired: false,
          relatedSystems: ['Colonial Network', 'Resource Management', 'Infrastructure']
        },
        {
          id: 'brief-006',
          category: 'intelligence',
          priority: 'high',
          title: 'Suspicious Activity Near Research Station Omega',
          summary: 'Unidentified vessels detected conducting surveillance of classified facility.',
          details: 'Long-range sensors have detected three unidentified vessels maintaining position near Research Station Omega for the past 72 hours. The ships appear to be conducting passive scans of our quantum research facility. Signal analysis suggests possible Zephyrian origin, but confirmation pending. Recommend increased security protocols.',
          timestamp: '2387.156.04:45',
          source: 'Intelligence Operations',
          actionRequired: true,
          relatedSystems: ['Intelligence Network', 'Research Security', 'Naval Command']
        },
        {
          id: 'brief-007',
          category: 'economy',
          priority: 'low',
          title: 'Routine Trade Agreement Renewal',
          summary: 'Standard trade agreements with Vegan Confederation up for renewal.',
          details: 'The five-year trade agreement with the Vegan Confederation expires in six months. Terms have been generally favorable, with steady growth in agricultural imports and technology exports. Preliminary discussions suggest both parties are interested in renewal with minor adjustments to tariff structures.',
          timestamp: '2387.156.03:00',
          source: 'Trade Commission',
          actionRequired: false,
          relatedSystems: ['Trade Networks', 'Agricultural Systems', 'Legal Affairs']
        }
      ];

      const mockMetrics: BriefingMetrics = {
        totalItems: mockBriefingItems.length,
        highPriorityItems: mockBriefingItems.filter(item => 
          item.priority === 'high' || item.priority === 'critical'
        ).length,
        actionRequiredItems: mockBriefingItems.filter(item => item.actionRequired).length,
        lastUpdated: '2387.156.09:30',
        briefingCompleteness: 94.7
      };

      setBriefingItems(mockBriefingItems);
      setMetrics(mockMetrics);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? briefingItems 
    : briefingItems.filter(item => item.category === selectedCategory);

  const handleMarkAsRead = (itemId: string) => {
    // Implement mark as read functionality
    console.log(`Marking item ${itemId} as read`);
  };

  const handleTakeAction = (itemId: string) => {
    // Implement action taking functionality
    console.log(`Taking action on item ${itemId}`);
  };

  // Chart data
  const itemsByCategory = [
    { label: 'Security', value: briefingItems.filter(item => item.category === 'security').length },
    { label: 'Economy', value: briefingItems.filter(item => item.category === 'economy').length },
    { label: 'Diplomacy', value: briefingItems.filter(item => item.category === 'diplomacy').length },
    { label: 'Science', value: briefingItems.filter(item => item.category === 'science').length },
    { label: 'Population', value: briefingItems.filter(item => item.category === 'population').length },
    { label: 'Intelligence', value: briefingItems.filter(item => item.category === 'intelligence').length }
  ];

  const itemsByPriority = [
    { label: 'Critical', value: briefingItems.filter(item => item.priority === 'critical').length },
    { label: 'High', value: briefingItems.filter(item => item.priority === 'high').length },
    { label: 'Medium', value: briefingItems.filter(item => item.priority === 'medium').length },
    { label: 'Low', value: briefingItems.filter(item => item.priority === 'low').length }
  ];

  const actionRequiredData = [
    { label: 'Action Required', value: briefingItems.filter(item => item.actionRequired).length },
    { label: 'Information Only', value: briefingItems.filter(item => !item.actionRequired).length }
  ];

  if (loading) {
    return (
      <QuickActionBase
        title="Daily Briefing"
        icon="📋"
        onClose={onClose}
        isVisible={isVisible}
        className="government-theme"
      >
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'var(--gov-accent)',
            fontSize: '18px'
          }}>
            Loading daily briefing...
          </div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="Daily Briefing"
      icon="📋"
      onClose={onClose}
      isVisible={isVisible}
      className="government-theme"
    >
      {/* Briefing Overview */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📋 Briefing Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Items</span>
            <span className="standard-metric-value">
              {metrics?.totalItems || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>High Priority</span>
            <span className="standard-metric-value" style={{ color: '#ef4444' }}>
              {metrics?.highPriorityItems || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Action Required</span>
            <span className="standard-metric-value" style={{ color: '#f59e0b' }}>
              {metrics?.actionRequiredItems || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Completeness</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {metrics?.briefingCompleteness || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Last Updated</span>
            <span className="standard-metric-value">
              {metrics?.lastUpdated || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Briefing Analytics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Briefing Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Items by Category
            </h4>
            <PieChart data={itemsByCategory} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Priority Distribution
            </h4>
            <BarChart data={itemsByPriority} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Action Status
            </h4>
            <PieChart data={actionRequiredData} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🔍 Filter by Category</h3>
        <div className="standard-action-buttons">
          {['all', 'security', 'economy', 'diplomacy', 'science', 'population', 'intelligence'].map(category => (
            <button
              key={category}
              className={`standard-btn government-theme ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? '📋 All' : `${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Briefing Items */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📄 Briefing Items</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Summary</th>
                <th>Source</th>
                <th>Time</th>
                <th>Action</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2em' }}>{getCategoryIcon(item.category)}</span>
                      <span style={{ 
                        textTransform: 'capitalize',
                        color: getCategoryColor(item.category)
                      }}>
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getPriorityColor(item.priority),
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {item.priority}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                      {item.summary}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    {item.source}
                  </td>
                  <td style={{ fontSize: '0.8em' }}>{item.timestamp}</td>
                  <td>
                    {item.actionRequired ? (
                      <span style={{ 
                        color: '#ef4444', 
                        fontWeight: 'bold',
                        fontSize: '0.9em'
                      }}>
                        ⚠️ REQUIRED
                      </span>
                    ) : (
                      <span style={{ 
                        color: '#10b981',
                        fontSize: '0.9em'
                      }}>
                        ℹ️ Info Only
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="standard-action-buttons">
                      <button
                        className="standard-btn government-theme"
                        onClick={() => setSelectedItem(item)}
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                      >
                        Details
                      </button>
                      {item.actionRequired && (
                        <button
                          className="standard-btn government-theme"
                          onClick={() => handleTakeAction(item.id)}
                          style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        >
                          Act
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="standard-card" style={{ 
          gridColumn: '1 / -1', 
          marginTop: '20px',
          border: '2px solid var(--gov-accent)',
          backgroundColor: 'rgba(79, 172, 254, 0.1)'
        }}>
          <h3 className="standard-card-title">
            {getCategoryIcon(selectedItem.category)} {selectedItem.title}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px' }}>Item Details</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Category</span>
                  <span className="standard-metric-value" style={{ color: getCategoryColor(selectedItem.category) }}>
                    {selectedItem.category}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Priority</span>
                  <span className="standard-metric-value" style={{ color: getPriorityColor(selectedItem.priority) }}>
                    {selectedItem.priority}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Source</span>
                  <span className="standard-metric-value">{selectedItem.source}</span>
                </div>
                <div className="standard-metric">
                  <span>Timestamp</span>
                  <span className="standard-metric-value">{selectedItem.timestamp}</span>
                </div>
              </div>
              
              <h4 style={{ color: 'var(--gov-accent)', marginTop: '15px', marginBottom: '10px' }}>Summary</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                {selectedItem.summary}
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px' }}>Detailed Information</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {selectedItem.details}
              </p>
              
              <h4 style={{ color: 'var(--gov-accent)', marginTop: '15px', marginBottom: '10px' }}>
                Related Systems
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedItem.relatedSystems.map((system, index) => (
                  <span key={index} style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(79, 172, 254, 0.2)',
                    borderRadius: '4px',
                    fontSize: '0.8em',
                    color: 'var(--gov-accent)'
                  }}>
                    {system}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="standard-action-buttons">
            <button
              className="standard-btn government-theme"
              onClick={() => handleMarkAsRead(selectedItem.id)}
            >
              Mark as Read
            </button>
            {selectedItem.actionRequired && (
              <button
                className="standard-btn government-theme"
                onClick={() => handleTakeAction(selectedItem.id)}
              >
                Take Action
              </button>
            )}
            <button
              className="standard-btn government-theme"
              onClick={() => setSelectedItem(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </QuickActionBase>
  );
};

export default DailyBriefingScreen;
