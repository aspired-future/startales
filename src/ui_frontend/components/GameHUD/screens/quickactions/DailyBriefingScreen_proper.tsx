import React, { useState, useEffect } from 'react';
import { QuickActionModal, QuickActionProps, TabConfig } from './QuickActionModal';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface BriefingItem {
  id: string;
  category: 'government' | 'military' | 'economic' | 'social' | 'diplomatic' | 'intelligence';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  summary: string;
  details: string;
  source: string;
  timestamp: string;
  status: 'new' | 'reviewed' | 'action_required' | 'resolved';
  tags: string[];
  relatedItems: string[];
}

interface BriefingMetrics {
  totalItems: number;
  newItems: number;
  criticalItems: number;
  actionRequired: number;
  averageProcessingTime: string;
  completionRate: number;
}

interface KeyEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  department: string;
}

interface BriefingData {
  items: BriefingItem[];
  metrics: BriefingMetrics;
  keyEvents: KeyEvent[];
  recommendations: any[];
  schedule: any[];
}

// Tab Content Component
interface TabContentProps {
  tabId: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export const DailyBriefingScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<BriefingItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'briefings', label: 'Briefings', icon: '📋' },
    { id: 'events', label: 'Key Events', icon: '⭐' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'schedule', label: 'Schedule', icon: '📅' }
  ];

  // Utility functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#fb7185';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#3b82f6';
      case 'reviewed': return '#10b981';
      case 'action_required': return '#f59e0b';
      case 'resolved': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government': return '🏛️';
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'social': return '👥';
      case 'diplomatic': return '🤝';
      case 'intelligence': return '🕵️';
      default: return '📄';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/daily-briefing');
      if (response.ok) {
        const apiData = await response.json();
        setBriefingData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch daily briefing data:', err);
      
      // Comprehensive mock data
      const mockItems: BriefingItem[] = [
        {
          id: 'brief-001',
          category: 'government',
          priority: 'high',
          title: 'Legislative Session Results',
          summary: 'Key bills passed in today\'s parliamentary session',
          details: 'The Infrastructure Development Act passed with 78% approval. The Education Reform Bill was tabled for further review. Budget allocation for space exploration increased by 15%.',
          source: 'Parliamentary Records',
          timestamp: '2387.156.09:30',
          status: 'reviewed',
          tags: ['legislation', 'infrastructure', 'education', 'budget'],
          relatedItems: ['brief-003']
        },
        {
          id: 'brief-002',
          category: 'military',
          priority: 'critical',
          title: 'Border Security Update',
          summary: 'Increased activity detected in outer rim sectors',
          details: 'Patrol reports indicate 23% increase in unidentified vessel sightings. Recommend enhanced surveillance protocols and additional patrol assignments.',
          source: 'Defense Command',
          timestamp: '2387.156.08:15',
          status: 'action_required',
          tags: ['security', 'border', 'surveillance', 'patrol'],
          relatedItems: []
        },
        {
          id: 'brief-003',
          category: 'economic',
          priority: 'medium',
          title: 'Trade Volume Analysis',
          summary: 'Q3 trade statistics and market trends',
          details: 'Inter-system trade volume up 12% compared to last quarter. New trade agreements with Centauri Federation showing positive results. Recommend expanding trade routes.',
          source: 'Commerce Department',
          timestamp: '2387.156.07:45',
          status: 'new',
          tags: ['trade', 'economy', 'statistics', 'centauri'],
          relatedItems: ['brief-001']
        },
        {
          id: 'brief-004',
          category: 'social',
          priority: 'medium',
          title: 'Population Wellness Report',
          summary: 'Health and social indicators for major colonies',
          details: 'Overall wellness index improved by 8%. New medical facilities operational on Mars Colony. Education enrollment rates at all-time high.',
          source: 'Social Services',
          timestamp: '2387.156.06:20',
          status: 'reviewed',
          tags: ['health', 'education', 'colonies', 'wellness'],
          relatedItems: []
        },
        {
          id: 'brief-005',
          category: 'intelligence',
          priority: 'high',
          title: 'Diplomatic Intelligence Summary',
          summary: 'Key developments in inter-system relations',
          details: 'Vegan Trade Union showing signs of internal political tension. Opportunity for favorable trade negotiations. Monitor situation closely.',
          source: 'Intelligence Division',
          timestamp: '2387.156.05:10',
          status: 'action_required',
          tags: ['diplomacy', 'vegan', 'trade', 'intelligence'],
          relatedItems: ['brief-003']
        }
      ];

      const mockMetrics: BriefingMetrics = {
        totalItems: 5,
        newItems: 1,
        criticalItems: 1,
        actionRequired: 2,
        averageProcessingTime: '2.4 hours',
        completionRate: 87.5
      };

      const mockKeyEvents: KeyEvent[] = [
        {
          id: 'event-001',
          time: '09:30',
          title: 'Parliamentary Session',
          description: 'Infrastructure Development Act passed',
          impact: 'high',
          department: 'Government'
        },
        {
          id: 'event-002',
          time: '08:15',
          title: 'Security Alert',
          description: 'Increased border activity detected',
          impact: 'high',
          department: 'Defense'
        },
        {
          id: 'event-003',
          time: '07:45',
          title: 'Trade Report',
          description: 'Q3 statistics released',
          impact: 'medium',
          department: 'Commerce'
        },
        {
          id: 'event-004',
          time: '06:20',
          title: 'Wellness Update',
          description: 'Health indicators improved',
          impact: 'medium',
          department: 'Social Services'
        }
      ];

      const mockRecommendations = [
        {
          id: 'rec-001',
          title: 'Enhance Border Security',
          description: 'Deploy additional patrol units to outer rim sectors',
          priority: 'high',
          department: 'Defense',
          estimatedCost: '2.5M Credits',
          timeline: '2 weeks'
        },
        {
          id: 'rec-002',
          title: 'Expand Trade Routes',
          description: 'Establish new commercial lanes with Centauri Federation',
          priority: 'medium',
          department: 'Commerce',
          estimatedCost: '8.2M Credits',
          timeline: '3 months'
        },
        {
          id: 'rec-003',
          title: 'Diplomatic Outreach',
          description: 'Initiate negotiations with Vegan Trade Union',
          priority: 'high',
          department: 'Foreign Affairs',
          estimatedCost: '500K Credits',
          timeline: '1 month'
        }
      ];

      const mockSchedule = [
        {
          id: 'sched-001',
          time: '10:00',
          title: 'Cabinet Meeting',
          description: 'Weekly executive briefing',
          attendees: ['Prime Minister', 'Defense Secretary', 'Commerce Minister'],
          location: 'Executive Chamber'
        },
        {
          id: 'sched-002',
          time: '14:30',
          title: 'Trade Delegation',
          description: 'Meeting with Centauri representatives',
          attendees: ['Commerce Minister', 'Trade Advisors'],
          location: 'Diplomatic Suite'
        },
        {
          id: 'sched-003',
          time: '16:00',
          title: 'Security Briefing',
          description: 'Border situation assessment',
          attendees: ['Defense Secretary', 'Intelligence Director'],
          location: 'Secure Conference Room'
        }
      ];

      setBriefingData({
        items: mockItems,
        metrics: mockMetrics,
        keyEvents: mockKeyEvents,
        recommendations: mockRecommendations,
        schedule: mockSchedule
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
      const interval = setInterval(fetchData, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const filteredItems = briefingData?.items.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const priorityMatch = filterPriority === 'all' || item.priority === filterPriority;
    return categoryMatch && priorityMatch;
  }) || [];

  // Chart data
  const categoryData = briefingData ? [
    { label: 'Government', value: briefingData.items.filter(i => i.category === 'government').length },
    { label: 'Military', value: briefingData.items.filter(i => i.category === 'military').length },
    { label: 'Economic', value: briefingData.items.filter(i => i.category === 'economic').length },
    { label: 'Social', value: briefingData.items.filter(i => i.category === 'social').length },
    { label: 'Diplomatic', value: briefingData.items.filter(i => i.category === 'diplomatic').length },
    { label: 'Intelligence', value: briefingData.items.filter(i => i.category === 'intelligence').length }
  ] : [];

  const priorityData = briefingData ? [
    { label: 'Critical', value: briefingData.items.filter(i => i.priority === 'critical').length },
    { label: 'High', value: briefingData.items.filter(i => i.priority === 'high').length },
    { label: 'Medium', value: briefingData.items.filter(i => i.priority === 'medium').length },
    { label: 'Low', value: briefingData.items.filter(i => i.priority === 'low').length }
  ] : [];

  const statusData = briefingData ? [
    { label: 'New', value: briefingData.items.filter(i => i.status === 'new').length },
    { label: 'Reviewed', value: briefingData.items.filter(i => i.status === 'reviewed').length },
    { label: 'Action Required', value: briefingData.items.filter(i => i.status === 'action_required').length },
    { label: 'Resolved', value: briefingData.items.filter(i => i.status === 'resolved').length }
  ] : [];

  if (loading) {
    return (
      <QuickActionModal
        onClose={onClose}
        isVisible={isVisible}
        title="Daily Briefing"
        icon="📋"
        theme="government-theme"
        tabs={tabs}
        onRefresh={fetchData}
      >
        <TabContent tabId="overview">
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#a0a9ba',
            fontSize: '1.1rem'
          }}>
            Loading daily briefing data...
          </div>
        </TabContent>
      </QuickActionModal>
    );
  }

  return (
    <QuickActionModal
      onClose={onClose}
      isVisible={isVisible}
      title="Daily Briefing"
      icon="📋"
      theme="government-theme"
      tabs={tabs}
      onRefresh={fetchData}
    >
      {/* Overview Tab */}
      <TabContent tabId="overview">
        {/* Briefing Metrics */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">📊 Daily Briefing Metrics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <span>Total Items</span>
              <span className="standard-metric-value">
                {briefingData?.metrics.totalItems || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>New Items</span>
              <span className="standard-metric-value" style={{ color: briefingData?.metrics.newItems > 0 ? '#3b82f6' : '#10b981' }}>
                {briefingData?.metrics.newItems || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Critical Items</span>
              <span className="standard-metric-value" style={{ color: briefingData?.metrics.criticalItems > 0 ? '#ef4444' : '#10b981' }}>
                {briefingData?.metrics.criticalItems || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Action Required</span>
              <span className="standard-metric-value" style={{ color: briefingData?.metrics.actionRequired > 0 ? '#f59e0b' : '#10b981' }}>
                {briefingData?.metrics.actionRequired || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Avg Processing Time</span>
              <span className="standard-metric-value">
                {briefingData?.metrics.averageProcessingTime || '0 hours'}
              </span>
            </div>
            <div className="standard-metric">
              <span>Completion Rate</span>
              <span className="standard-metric-value" style={{ color: '#10b981' }}>
                {briefingData?.metrics.completionRate || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📈 Briefing Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="chart-container">
              <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Categories
              </h4>
              <PieChart data={categoryData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Priority Levels
              </h4>
              <BarChart data={priorityData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Status Distribution
              </h4>
              <PieChart data={statusData} />
            </div>
          </div>
        </div>
      </TabContent>

      {/* Briefings Tab */}
      <TabContent tabId="briefings">
        {/* Filters */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">🔍 Filter Briefings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Category:</label>
              <div className="standard-action-buttons">
                {['all', 'government', 'military', 'economic', 'social', 'diplomatic', 'intelligence'].map(category => (
                  <button
                    key={category}
                    className={`standard-btn government-theme ${filterCategory === category ? 'active' : ''}`}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Priority:</label>
              <div className="standard-action-buttons">
                {['all', 'critical', 'high', 'medium', 'low'].map(priority => (
                  <button
                    key={priority}
                    className={`standard-btn government-theme ${filterPriority === priority ? 'active' : ''}`}
                    onClick={() => setFilterPriority(priority)}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Briefing Items */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📋 Briefing Items</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontSize: '1.2em', marginRight: '8px' }}>
                        {getCategoryIcon(item.category)}
                      </span>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                        {item.summary}
                      </div>
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
                    <td>
                      <span style={{ 
                        color: getStatusColor(item.status),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{item.source}</td>
                    <td>{item.timestamp}</td>
                    <td>
                      <button 
                        className="standard-btn government-theme" 
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        onClick={() => setSelectedItem(item)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>

      {/* Key Events Tab */}
      <TabContent tabId="events">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">⭐ Key Events Today</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {briefingData?.keyEvents.map(event => (
              <div key={event.id} className="standard-card" style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ color: 'var(--government-accent)', margin: '0 0 5px 0' }}>
                      {event.time} - {event.title}
                    </h4>
                    <p style={{ margin: '0', color: 'var(--text-primary)' }}>
                      {event.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-muted)', marginBottom: '5px' }}>
                      {event.department}
                    </div>
                    <span style={{ 
                      color: getImpactColor(event.impact),
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '0.8em'
                    }}>
                      {event.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabContent>

      {/* Recommendations Tab */}
      <TabContent tabId="recommendations">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">💡 Recommendations</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {briefingData?.recommendations.map(rec => (
              <div key={rec.id} className="standard-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--government-accent)', margin: '0' }}>
                    {rec.title}
                  </h4>
                  <span style={{ 
                    color: getPriorityColor(rec.priority),
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.8em'
                  }}>
                    {rec.priority} Priority
                  </span>
                </div>
                <p style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>
                  {rec.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '0.9em' }}>
                  <div>
                    <strong>Department:</strong><br />
                    {rec.department}
                  </div>
                  <div>
                    <strong>Estimated Cost:</strong><br />
                    {rec.estimatedCost}
                  </div>
                  <div>
                    <strong>Timeline:</strong><br />
                    {rec.timeline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabContent>

      {/* Schedule Tab */}
      <TabContent tabId="schedule">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📅 Today's Schedule</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {briefingData?.schedule.map(item => (
              <div key={item.id} className="standard-card" style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ color: 'var(--government-accent)', margin: '0 0 5px 0' }}>
                      {item.time} - {item.title}
                    </h4>
                    <p style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
                      {item.description}
                    </p>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                      <strong>Location:</strong> {item.location}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <strong style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>Attendees:</strong>
                  <div style={{ fontSize: '0.8em', color: 'var(--text-primary)', marginTop: '5px' }}>
                    {item.attendees.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabContent>
    </QuickActionModal>
  );
};

export default DailyBriefingScreen;
