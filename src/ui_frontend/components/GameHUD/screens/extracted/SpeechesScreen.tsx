import React, { useState, useEffect } from 'react';
import './SpeechesScreen.css';

interface SpeechesScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface Speech {
  id: string;
  title: string;
  speaker: string;
  occasion: string;
  date: string;
  duration: number;
  status: 'draft' | 'scheduled' | 'delivered' | 'cancelled';
  audience: string;
  topic: string;
  approvalRating?: number;
  viewCount?: number;
  transcript?: string;
}

interface SpeechTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedDuration: number;
  keyPoints: string[];
}

interface SpeechAnalytics {
  totalSpeeches: number;
  averageRating: number;
  totalViews: number;
  upcomingSpeeches: number;
  popularTopics: string[];
  engagementRate: number;
}

const SpeechesScreen: React.FC<SpeechesScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'speeches' | 'schedule' | 'templates' | 'analytics' | 'delivery'>('speeches');
  const [speechData, setSpeechData] = useState<{
    speeches: Speech[];
    templates: SpeechTemplate[];
    analytics: SpeechAnalytics;
  }>({
    speeches: [],
    templates: [],
    analytics: {
      totalSpeeches: 0,
      averageRating: 0,
      totalViews: 0,
      upcomingSpeeches: 0,
      popularTopics: [],
      engagementRate: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);

  useEffect(() => {
    const fetchSpeechData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('/api/speeches/overview');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        if (data.success) {
          setSpeechData(data.data);
        }
      } catch (err) {
        console.warn('Speeches API not available, using mock data');
        // Use comprehensive mock data
        setSpeechData({
          speeches: [
            {
              id: 'speech_001',
              title: 'State of the Galaxy Address',
              speaker: 'President Sarah Chen',
              occasion: 'Annual Address',
              date: '2024-03-15',
              duration: 45,
              status: 'delivered',
              audience: 'Galactic Citizens',
              topic: 'Government Policy',
              approvalRating: 87.3,
              viewCount: 2400000,
              transcript: 'Fellow citizens of the galaxy, today we stand at a crossroads of unprecedented opportunity...'
            },
            {
              id: 'speech_002',
              title: 'Economic Recovery Plan Announcement',
              speaker: 'Secretary of Treasury',
              occasion: 'Press Conference',
              date: '2024-03-22',
              duration: 30,
              status: 'scheduled',
              audience: 'Media & Public',
              topic: 'Economic Policy',
              approvalRating: undefined,
              viewCount: undefined
            },
            {
              id: 'speech_003',
              title: 'Space Exploration Initiative Launch',
              speaker: 'Director of Space Agency',
              occasion: 'Launch Event',
              date: '2024-04-01',
              duration: 25,
              status: 'draft',
              audience: 'Scientists & Engineers',
              topic: 'Science & Technology',
              approvalRating: undefined,
              viewCount: undefined
            },
            {
              id: 'speech_004',
              title: 'Diplomatic Relations Update',
              speaker: 'Secretary of State',
              occasion: 'UN Assembly',
              date: '2024-02-28',
              duration: 35,
              status: 'delivered',
              audience: 'International Delegates',
              topic: 'Foreign Policy',
              approvalRating: 92.1,
              viewCount: 1800000
            },
            {
              id: 'speech_005',
              title: 'Climate Action Summit Opening',
              speaker: 'Environmental Secretary',
              occasion: 'Climate Summit',
              date: '2024-04-15',
              duration: 20,
              status: 'scheduled',
              audience: 'Environmental Leaders',
              topic: 'Environmental Policy',
              approvalRating: undefined,
              viewCount: undefined
            }
          ],
          templates: [
            {
              id: 'template_001',
              name: 'State Address Template',
              category: 'Government',
              description: 'Comprehensive template for annual state addresses',
              estimatedDuration: 45,
              keyPoints: ['Current State Overview', 'Major Achievements', 'Future Plans', 'Call to Action']
            },
            {
              id: 'template_002',
              name: 'Crisis Response Template',
              category: 'Emergency',
              description: 'Template for addressing national emergencies',
              estimatedDuration: 15,
              keyPoints: ['Situation Assessment', 'Immediate Actions', 'Public Safety', 'Next Steps']
            },
            {
              id: 'template_003',
              name: 'Policy Announcement Template',
              category: 'Policy',
              description: 'Standard format for new policy announcements',
              estimatedDuration: 25,
              keyPoints: ['Policy Overview', 'Benefits & Impact', 'Implementation Timeline', 'Public Input']
            },
            {
              id: 'template_004',
              name: 'Diplomatic Address Template',
              category: 'Diplomacy',
              description: 'Template for international diplomatic speeches',
              estimatedDuration: 30,
              keyPoints: ['Relationship Status', 'Mutual Interests', 'Cooperation Areas', 'Future Partnership']
            }
          ],
          analytics: {
            totalSpeeches: 47,
            averageRating: 84.7,
            totalViews: 15600000,
            upcomingSpeeches: 8,
            popularTopics: ['Economic Policy', 'Foreign Relations', 'Environmental Policy', 'Technology', 'Healthcare'],
            engagementRate: 78.2
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpeechData();
  }, []);

  const handleAction = (action: string, context?: any) => {
    console.log(`Speeches Action: ${action}`, context);
    alert(`Speeches System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const renderSpeechesTab = () => (
    <div className="speeches-tab">
      <div className="speeches-header">
        <h2>🎤 Speech Management</h2>
        <p>Manage speeches, addresses, and public communications</p>
      </div>

      <div className="speeches-grid">
        {speechData.speeches.map(speech => (
          <div key={speech.id} className="speech-card">
            <div className="speech-header">
              <h3>{speech.title}</h3>
              <div className={`speech-status ${speech.status}`}>
                {speech.status.charAt(0).toUpperCase() + speech.status.slice(1)}
              </div>
            </div>
            <div className="speech-info">
              <div className="info-row">
                <span className="info-label">Speaker:</span>
                <span className="info-value">{speech.speaker}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Occasion:</span>
                <span className="info-value">{speech.occasion}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date:</span>
                <span className="info-value">{speech.date}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Duration:</span>
                <span className="info-value">{speech.duration} minutes</span>
              </div>
              <div className="info-row">
                <span className="info-label">Audience:</span>
                <span className="info-value">{speech.audience}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Topic:</span>
                <span className="info-value">{speech.topic}</span>
              </div>
              {speech.approvalRating && (
                <div className="info-row">
                  <span className="info-label">Approval:</span>
                  <span className="info-value">{speech.approvalRating}%</span>
                </div>
              )}
              {speech.viewCount && (
                <div className="info-row">
                  <span className="info-label">Views:</span>
                  <span className="info-value">{speech.viewCount.toLocaleString()}</span>
                </div>
              )}
            </div>
            {speech.approvalRating && (
              <div className="approval-bar">
                <div className="approval-fill" style={{ width: `${speech.approvalRating}%` }}></div>
              </div>
            )}
            <div className="speech-actions">
              <button className="btn" onClick={() => handleAction('View Speech', speech.title)}>
                📄 View
              </button>
              <button className="btn secondary" onClick={() => handleAction('Edit Speech', speech.title)}>
                ✏️ Edit
              </button>
              {speech.status === 'draft' && (
                <button className="btn secondary" onClick={() => handleAction('Schedule Speech', speech.title)}>
                  📅 Schedule
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="speeches-actions">
        <button className="btn" onClick={() => handleAction('Create New Speech')}>
          ➕ New Speech
        </button>
        <button className="btn secondary" onClick={() => handleAction('Import Speech')}>
          📥 Import
        </button>
        <button className="btn secondary" onClick={() => handleAction('Speech Archive')}>
          📚 Archive
        </button>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="schedule-tab">
      <div className="schedule-header">
        <h2>📅 Speech Schedule</h2>
        <p>Upcoming speeches and scheduling management</p>
      </div>

      <div className="schedule-calendar">
        <div className="calendar-header">
          <h3>📆 March 2024</h3>
          <div className="calendar-controls">
            <button className="btn secondary" onClick={() => handleAction('Previous Month')}>
              ← Prev
            </button>
            <button className="btn secondary" onClick={() => handleAction('Next Month')}>
              Next →
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-day-header">Sun</div>
          <div className="calendar-day-header">Mon</div>
          <div className="calendar-day-header">Tue</div>
          <div className="calendar-day-header">Wed</div>
          <div className="calendar-day-header">Thu</div>
          <div className="calendar-day-header">Fri</div>
          <div className="calendar-day-header">Sat</div>

          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2; // Start from March 1st (assuming March 1st is on a Friday)
            const isCurrentMonth = day > 0 && day <= 31;
            const hasEvent = [15, 22].includes(day); // March 15 and 22 have speeches
            
            return (
              <div key={i} className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${hasEvent ? 'has-event' : ''}`}>
                {isCurrentMonth && (
                  <>
                    <span className="day-number">{day}</span>
                    {hasEvent && (
                      <div className="event-indicator">
                        {day === 15 ? '🎤 State Address' : '🎤 Economic Plan'}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="upcoming-speeches">
        <h3>📋 Upcoming Speeches</h3>
        <div className="upcoming-list">
          {speechData.speeches.filter(s => s.status === 'scheduled').map(speech => (
            <div key={speech.id} className="upcoming-item">
              <div className="upcoming-date">
                <div className="date-day">{new Date(speech.date).getDate()}</div>
                <div className="date-month">{new Date(speech.date).toLocaleDateString('en', { month: 'short' })}</div>
              </div>
              <div className="upcoming-details">
                <h4>{speech.title}</h4>
                <p>{speech.speaker} • {speech.occasion}</p>
                <p>{speech.duration} minutes • {speech.audience}</p>
              </div>
              <div className="upcoming-actions">
                <button className="btn" onClick={() => handleAction('Prepare Speech', speech.title)}>
                  📝 Prepare
                </button>
                <button className="btn secondary" onClick={() => handleAction('Reschedule', speech.title)}>
                  📅 Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="schedule-actions">
        <button className="btn" onClick={() => handleAction('Schedule New Speech')}>
          📅 Schedule Speech
        </button>
        <button className="btn secondary" onClick={() => handleAction('Venue Management')}>
          🏛️ Venues
        </button>
        <button className="btn secondary" onClick={() => handleAction('Media Coordination')}>
          📺 Media
        </button>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="templates-tab">
      <div className="templates-header">
        <h2>📝 Speech Templates</h2>
        <p>Pre-built templates for different types of speeches</p>
      </div>

      <div className="templates-grid">
        {speechData.templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <h3>{template.name}</h3>
              <div className="template-category">{template.category}</div>
            </div>
            <div className="template-info">
              <p className="template-description">{template.description}</p>
              <div className="info-row">
                <span className="info-label">Duration:</span>
                <span className="info-value">{template.estimatedDuration} minutes</span>
              </div>
              <div className="template-points">
                <h4>Key Points:</h4>
                <ul>
                  {template.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="template-actions">
              <button className="btn" onClick={() => handleAction('Use Template', template.name)}>
                📄 Use Template
              </button>
              <button className="btn secondary" onClick={() => handleAction('Customize Template', template.name)}>
                ✏️ Customize
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="templates-actions">
        <button className="btn" onClick={() => handleAction('Create Template')}>
          ➕ New Template
        </button>
        <button className="btn secondary" onClick={() => handleAction('Import Template')}>
          📥 Import
        </button>
        <button className="btn secondary" onClick={() => handleAction('Template Library')}>
          📚 Library
        </button>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>📊 Speech Analytics</h2>
        <p>Performance metrics and audience engagement analysis</p>
      </div>

      <div className="analytics-stats">
        <div className="stat-card">
          <div className="stat-icon">🎤</div>
          <div className="stat-content">
            <div className="stat-value">{speechData.analytics.totalSpeeches}</div>
            <div className="stat-label">Total Speeches</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{speechData.analytics.averageRating}%</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-value">{(speechData.analytics.totalViews / 1000000).toFixed(1)}M</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{speechData.analytics.upcomingSpeeches}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">{speechData.analytics.engagementRate}%</div>
            <div className="stat-label">Engagement Rate</div>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h3>📈 Speech Performance Over Time</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{ height: '75%' }}></div>
              <div className="bar" style={{ height: '82%' }}></div>
              <div className="bar" style={{ height: '68%' }}></div>
              <div className="bar" style={{ height: '91%' }}></div>
              <div className="bar" style={{ height: '87%' }}></div>
              <div className="bar" style={{ height: '94%' }}></div>
              <div className="bar" style={{ height: '89%' }}></div>
            </div>
            <div className="chart-labels">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>🏷️ Popular Topics</h3>
          <div className="topics-breakdown">
            {speechData.analytics.popularTopics.map((topic, index) => (
              <div key={index} className="topic-item">
                <span className="topic-label">{topic}</span>
                <div className="topic-bar">
                  <div className="topic-fill" style={{ width: `${90 - index * 15}%` }}></div>
                </div>
                <span className="topic-value">{90 - index * 15}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button className="btn" onClick={() => handleAction('Generate Analytics Report')}>
          📋 Full Report
        </button>
        <button className="btn secondary" onClick={() => handleAction('Audience Analysis')}>
          👥 Audience
        </button>
        <button className="btn secondary" onClick={() => handleAction('Performance Trends')}>
          📈 Trends
        </button>
      </div>
    </div>
  );

  const renderDeliveryTab = () => (
    <div className="delivery-tab">
      <div className="delivery-header">
        <h2>🎯 Speech Delivery</h2>
        <p>Live speech delivery and teleprompter system</p>
      </div>

      <div className="delivery-system">
        <div className="teleprompter-card">
          <h3>📺 Teleprompter</h3>
          <div className="teleprompter-screen">
            <div className="teleprompter-text">
              <p>Fellow citizens of the galaxy, today we stand at a crossroads of unprecedented opportunity...</p>
              <p>Our economic recovery plan will create millions of jobs across all sectors...</p>
              <p>Together, we will build a stronger, more prosperous future for all...</p>
            </div>
          </div>
          <div className="teleprompter-controls">
            <button className="btn secondary" onClick={() => handleAction('Slow Down')}>
              ⏪ Slower
            </button>
            <button className="btn" onClick={() => handleAction('Play/Pause')}>
              ⏯️ Play/Pause
            </button>
            <button className="btn secondary" onClick={() => handleAction('Speed Up')}>
              ⏩ Faster
            </button>
          </div>
        </div>

        <div className="delivery-tools">
          <div className="tool-card">
            <h4>🎤 Audio Check</h4>
            <div className="audio-levels">
              <div className="level-bar">
                <div className="level-fill" style={{ width: '75%' }}></div>
              </div>
              <span>75%</span>
            </div>
            <button className="btn secondary" onClick={() => handleAction('Test Audio')}>
              🔊 Test
            </button>
          </div>

          <div className="tool-card">
            <h4>📹 Camera Setup</h4>
            <div className="camera-preview">
              <div className="preview-placeholder">📹 Camera Preview</div>
            </div>
            <button className="btn secondary" onClick={() => handleAction('Adjust Camera')}>
              📷 Adjust
            </button>
          </div>

          <div className="tool-card">
            <h4>⏱️ Timer</h4>
            <div className="speech-timer">
              <div className="timer-display">00:00</div>
              <div className="timer-target">Target: 45:00</div>
            </div>
            <button className="btn secondary" onClick={() => handleAction('Start Timer')}>
              ⏱️ Start
            </button>
          </div>
        </div>
      </div>

      <div className="live-feedback">
        <h3>📊 Live Feedback</h3>
        <div className="feedback-metrics">
          <div className="feedback-item">
            <span className="feedback-label">Audience Engagement</span>
            <div className="feedback-bar">
              <div className="feedback-fill" style={{ width: '82%', backgroundColor: '#4CAF50' }}></div>
            </div>
            <span className="feedback-value">82%</span>
          </div>
          <div className="feedback-item">
            <span className="feedback-label">Speaking Pace</span>
            <div className="feedback-bar">
              <div className="feedback-fill" style={{ width: '65%', backgroundColor: '#FF9800' }}></div>
            </div>
            <span className="feedback-value">Optimal</span>
          </div>
          <div className="feedback-item">
            <span className="feedback-label">Voice Clarity</span>
            <div className="feedback-bar">
              <div className="feedback-fill" style={{ width: '90%', backgroundColor: '#4CAF50' }}></div>
            </div>
            <span className="feedback-value">Excellent</span>
          </div>
        </div>
      </div>

      <div className="delivery-actions">
        <button className="btn" onClick={() => handleAction('Start Live Speech')}>
          🔴 Go Live
        </button>
        <button className="btn secondary" onClick={() => handleAction('Practice Mode')}>
          🎭 Practice
        </button>
        <button className="btn secondary" onClick={() => handleAction('Record Speech')}>
          📹 Record
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="speeches-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading speeches data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="speeches-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'speeches' ? 'active' : ''}`}
          onClick={() => setActiveTab('speeches')}
        >
          🎤 Speeches
        </button>
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📝 Templates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivery')}
        >
          🎯 Delivery
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'speeches' && renderSpeechesTab()}
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'delivery' && renderDeliveryTab()}
      </div>
    </div>
  );
};

export default SpeechesScreen;
