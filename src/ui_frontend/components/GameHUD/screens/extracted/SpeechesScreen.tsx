import React, { useState, useEffect } from 'react';
import './SpeechesScreen.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface SpeechesScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface SpeechGenerationRequest {
  type: string;
  audience: string;
  occasion: string;
  tone: string;
  duration: number;
  keyMessages: string[];
  issuesToAddress: string[];
  deliveryMode: 'avatar' | 'teleprompter' | 'off-the-cuff';
  styleGuide?: string;
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
  const [showNewSpeechForm, setShowNewSpeechForm] = useState(false);
  const [generatingSpeech, setGeneratingSpeech] = useState(false);
  const [speechForm, setSpeechForm] = useState<SpeechGenerationRequest>({
    type: 'policy_announcement',
    audience: 'general_public',
    occasion: 'Press Conference',
    tone: 'formal',
    duration: 15,
    keyMessages: [''],
    issuesToAddress: [''],
    deliveryMode: 'avatar',
    styleGuide: 'Professional, authoritative, inspiring when appropriate'
  });

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
              title: 'State of the Union Address',
              speaker: 'President Sarah Chen',
              occasion: 'Annual Address',
              date: '2024-03-15',
              duration: 45,
              status: 'delivered',
              audience: 'Civilization Citizens',
              topic: 'Government Policy',
              approvalRating: 87.3,
              viewCount: 2400000,
              transcript: 'Fellow citizens of our civilization, today we stand at a crossroads of unprecedented opportunity...'
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
    
    if (action === 'Create New Speech') {
      setShowNewSpeechForm(true);
      return;
    }
    
    alert(`Speeches System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const addArrayItem = (field: 'keyMessages' | 'issuesToAddress') => {
    setSpeechForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'keyMessages' | 'issuesToAddress', index: number) => {
    setSpeechForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'keyMessages' | 'issuesToAddress', index: number, value: string) => {
    setSpeechForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const generateSpeech = async () => {
    if (!speechForm.keyMessages.some(msg => msg.trim()) || !speechForm.issuesToAddress.some(issue => issue.trim())) {
      alert('Please provide at least one key message and one issue to address.');
      return;
    }

    setGeneratingSpeech(true);
    try {
      const requestPayload = {
        campaignId: gameContext?.campaignId || 1,
        tickId: gameContext?.tickId || 1,
        leaderCharacterId: gameContext?.playerId || 'player_1',
        type: speechForm.type,
        audience: {
          primary: speechForm.audience,
          demographics: [],
          estimatedSize: 1000000,
          broadcastChannels: ['National TV', 'Radio', 'Internet'],
          expectedReach: 0.8
        },
        occasion: speechForm.occasion,
        keyMessages: speechForm.keyMessages.filter(msg => msg.trim()),
        tone: speechForm.tone,
        duration: speechForm.duration,
        policyFocus: speechForm.issuesToAddress.filter(issue => issue.trim()),
        currentChallenges: speechForm.issuesToAddress.filter(issue => issue.trim()),
        styleGuide: speechForm.styleGuide,
        inspirationalLevel: speechForm.deliveryMode === 'off-the-cuff' ? 0.8 : 0.6,
        formalityLevel: speechForm.tone === 'formal' ? 0.8 : 0.5,
        deliveryMode: speechForm.deliveryMode
      };

      console.log('Generating speech with payload:', requestPayload);

      const response = await fetch('/api/leader/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Speech generation result:', result);

      if (result.success) {
        const impactLevels = {
          'avatar': 'Baseline (1.0x)',
          'teleprompter': 'Enhanced (1.2x)',
          'off-the-cuff': 'Maximum (1.5x)'
        };
        alert(`Speech Generated Successfully!\n\nTitle: ${result.data.title}\n\nDelivery Mode: ${speechForm.deliveryMode}\nExpected Impact: ${impactLevels[speechForm.deliveryMode]}\n\nThe speech has been added to your drafts.`);
        setShowNewSpeechForm(false);
        // Reset form
        setSpeechForm({
          type: 'policy_announcement',
          audience: 'general_public',
          occasion: 'Press Conference',
          tone: 'formal',
          duration: 15,
          keyMessages: [''],
          issuesToAddress: [''],
          deliveryMode: 'avatar',
          styleGuide: 'Professional, authoritative, inspiring when appropriate'
        });
        // Refresh speech data
        // fetchSpeechData(); // Would need to be extracted to call here
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      alert(`Error generating speech: ${error instanceof Error ? error.message : 'Unknown error'}\n\nFalling back to mock generation...`);
      
      // Fallback to mock generation
      const impactLevels = {
        'automated': 'Baseline (1.0x)',
        'teleprompter': 'Enhanced (1.2x)',
        'off-the-cuff': 'Maximum (1.5x)'
      };
      
      const mockSpeech = {
        title: `${speechForm.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${speechForm.occasion}`,
        content: `Mock speech content addressing: ${speechForm.issuesToAddress.filter(i => i.trim()).join(', ')}\n\nKey messages: ${speechForm.keyMessages.filter(m => m.trim()).join(', ')}\n\nDelivery mode: ${speechForm.deliveryMode}`,
        deliveryMode: speechForm.deliveryMode,
        expectedImpact: impactLevels[speechForm.deliveryMode]
      };
      
      alert(`Mock Speech Generated!\n\nTitle: ${mockSpeech.title}\n\nDelivery Mode: ${speechForm.deliveryMode}\nExpected Impact: ${mockSpeech.expectedImpact}\n\nThis is a fallback when the API is unavailable.`);
      setShowNewSpeechForm(false);
    } finally {
      setGeneratingSpeech(false);
    }
  };

  const renderNewSpeechForm = () => (
    <div className="new-speech-form">
      <div className="form-header">
        <h3>🎤 Generate New Speech</h3>
        <button className="btn secondary" onClick={() => setShowNewSpeechForm(false)}>
          ✕ Close
        </button>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <h4>📋 Basic Information</h4>
          
          <div className="form-group">
            <label>Speech Type:</label>
            <select 
              value={speechForm.type} 
              onChange={(e) => setSpeechForm(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="policy_announcement">Policy Announcement</option>
              <option value="state_of_union">State of the Union</option>
              <option value="crisis_address">Crisis Address</option>
              <option value="economic_update">Economic Update</option>
              <option value="diplomatic_address">Diplomatic Address</option>
              <option value="victory_speech">Victory Speech</option>
              <option value="rally">Rally</option>
            </select>
          </div>

          <div className="form-group">
            <label>Audience:</label>
            <select 
              value={speechForm.audience} 
              onChange={(e) => setSpeechForm(prev => ({ ...prev, audience: e.target.value }))}
            >
              <option value="general_public">General Public</option>
              <option value="government">Government Officials</option>
              <option value="military">Military Personnel</option>
              <option value="business_leaders">Business Leaders</option>
              <option value="diplomats">Diplomatic Corps</option>
              <option value="scientists">Scientific Community</option>
            </select>
          </div>

          <div className="form-group">
            <label>Occasion:</label>
            <input 
              type="text" 
              value={speechForm.occasion}
              onChange={(e) => setSpeechForm(prev => ({ ...prev, occasion: e.target.value }))}
              placeholder="e.g., Press Conference, State Dinner, Emergency Broadcast"
            />
          </div>

          <div className="form-group">
            <label>Tone:</label>
            <select 
              value={speechForm.tone} 
              onChange={(e) => setSpeechForm(prev => ({ ...prev, tone: e.target.value }))}
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="inspirational">Inspirational</option>
              <option value="somber">Somber</option>
              <option value="urgent">Urgent</option>
              <option value="celebratory">Celebratory</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration (minutes):</label>
            <input 
              type="number" 
              min="5" 
              max="60" 
              value={speechForm.duration}
              onChange={(e) => setSpeechForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
            />
          </div>
        </div>

        <div className="form-section">
          <h4>🎯 Key Messages</h4>
          <p>What are the main points you want to communicate?</p>
          
          {speechForm.keyMessages.map((message, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={message}
                onChange={(e) => updateArrayItem('keyMessages', index, e.target.value)}
                placeholder={`Key message ${index + 1}`}
              />
              {speechForm.keyMessages.length > 1 && (
                <button 
                  className="btn secondary small"
                  onClick={() => removeArrayItem('keyMessages', index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button 
            className="btn secondary small"
            onClick={() => addArrayItem('keyMessages')}
          >
            ➕ Add Key Message
          </button>
        </div>

        <div className="form-section">
          <h4>⚠️ Issues to Address</h4>
          <p>What challenges or topics should the speech address?</p>
          
          {speechForm.issuesToAddress.map((issue, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={issue}
                onChange={(e) => updateArrayItem('issuesToAddress', index, e.target.value)}
                placeholder={`Issue ${index + 1}`}
              />
              {speechForm.issuesToAddress.length > 1 && (
                <button 
                  className="btn secondary small"
                  onClick={() => removeArrayItem('issuesToAddress', index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button 
            className="btn secondary small"
            onClick={() => addArrayItem('issuesToAddress')}
          >
            ➕ Add Issue
          </button>
        </div>

        <div className="form-section">
          <h4>🎭 Delivery Mode</h4>
          <p>How will this speech be delivered?</p>
          
          <div className="delivery-mode-selector">
            <label className={`delivery-option ${speechForm.deliveryMode === 'avatar' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="deliveryMode"
                value="avatar"
                checked={speechForm.deliveryMode === 'avatar'}
                onChange={(e) => setSpeechForm(prev => ({ ...prev, deliveryMode: e.target.value as 'avatar' | 'teleprompter' | 'off-the-cuff' }))}
              />
              <div className="option-content">
                <div className="option-icon">🤖</div>
                <div className="option-details">
                  <h5>Avatar Mode</h5>
                  <p>AI avatar delivers speech, leader not present</p>
                  <small>Baseline impact, digital representation only</small>
                </div>
              </div>
            </label>

            <label className={`delivery-option ${speechForm.deliveryMode === 'teleprompter' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="deliveryMode"
                value="teleprompter"
                checked={speechForm.deliveryMode === 'teleprompter'}
                onChange={(e) => setSpeechForm(prev => ({ ...prev, deliveryMode: e.target.value as 'avatar' | 'teleprompter' | 'off-the-cuff' }))}
              />
              <div className="option-content">
                <div className="option-icon">📺</div>
                <div className="option-details">
                  <h5>Teleprompter</h5>
                  <p>Prepared, polished delivery with script</p>
                  <small>Enhanced impact, professional appearance</small>
                </div>
              </div>
            </label>

            <label className={`delivery-option ${speechForm.deliveryMode === 'off-the-cuff' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="deliveryMode"
                value="off-the-cuff"
                checked={speechForm.deliveryMode === 'off-the-cuff'}
                onChange={(e) => setSpeechForm(prev => ({ ...prev, deliveryMode: e.target.value as 'avatar' | 'teleprompter' | 'off-the-cuff' }))}
              />
              <div className="option-content">
                <div className="option-icon">🎤</div>
                <div className="option-details">
                  <h5>Off-the-Cuff</h5>
                  <p>Spontaneous, authentic delivery</p>
                  <small>Highest impact, shows authenticity and confidence</small>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          className="btn"
          onClick={generateSpeech}
          disabled={generatingSpeech}
        >
          {generatingSpeech ? '🔄 Generating...' : '🎤 Generate Speech'}
        </button>
        <button 
          className="btn secondary"
          onClick={() => setShowNewSpeechForm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderSpeechesTab = () => (
    <div className="speeches-tab">
      {showNewSpeechForm && renderNewSpeechForm()}
      
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

      {/* Speech Charts Section */}
      <div className="speech-charts-section">
        <div className="charts-grid">
          <div className="chart-container">
            <LineChart
              data={[
                { label: 'Jan', value: 75 },
                { label: 'Feb', value: 82 },
                { label: 'Mar', value: 68 },
                { label: 'Apr', value: 91 },
                { label: 'May', value: 87 },
                { label: 'Jun', value: 94 },
                { label: 'Jul', value: 89 }
              ]}
              title="📈 Speech Performance Over Time"
              color="#4ecdc4"
              height={250}
              width={400}
            />
          </div>

          <div className="chart-container">
            <PieChart
              data={speechData.analytics.popularTopics.map((topic, index) => ({
                label: topic,
                value: 90 - index * 15,
                color: ['#4ecdc4', '#45b7aa', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][index]
              }))}
              title="🏷️ Topic Popularity Breakdown"
              size={200}
              showLegend={true}
            />
          </div>

          <div className="chart-container">
            <BarChart
              data={[
                { label: 'Engagement Rate', value: speechData.analytics.engagementRate, color: '#4ecdc4' },
                { label: 'Average Rating', value: speechData.analytics.averageRating, color: '#45b7aa' },
                { label: 'Completion Rate', value: 85, color: '#96ceb4' },
                { label: 'Share Rate', value: 72, color: '#feca57' }
              ]}
              title="📊 Speech Metrics Comparison"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>

          <div className="chart-container">
            <LineChart
              data={[
                { label: 'Q1', value: speechData.analytics.totalViews * 0.7 / 1000000 },
                { label: 'Q2', value: speechData.analytics.totalViews * 0.8 / 1000000 },
                { label: 'Q3', value: speechData.analytics.totalViews * 0.9 / 1000000 },
                { label: 'Q4', value: speechData.analytics.totalViews / 1000000 }
              ]}
              title="👁️ Viewership Trends (Millions)"
              color="#feca57"
              height={250}
              width={400}
            />
          </div>

          <div className="chart-container">
            <PieChart
              data={[
                { label: 'Live Audience', value: 45, color: '#4ecdc4' },
                { label: 'Broadcast Views', value: 35, color: '#45b7aa' },
                { label: 'Online Streaming', value: 20, color: '#96ceb4' }
              ]}
              title="📺 Audience Distribution"
              size={200}
              showLegend={true}
            />
          </div>

          <div className="chart-container">
            <BarChart
              data={[
                { label: 'Scheduled', value: speechData.analytics.upcomingSpeeches, color: '#4ecdc4' },
                { label: 'Delivered', value: speechData.analytics.totalSpeeches, color: '#45b7aa' },
                { label: 'Cancelled', value: 3, color: '#ff6b6b' },
                { label: 'Rescheduled', value: 5, color: '#feca57' }
              ]}
              title="📅 Speech Status Overview"
              height={250}
              width={400}
              showTooltip={true}
            />
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

      <div className="delivery-modes-comparison">
        <h3>📊 Delivery Mode Impact Comparison</h3>
        <div className="comparison-grid three-modes">
          <div className="mode-comparison avatar-mode">
            <div className="mode-header">
              <div className="mode-icon">🤖</div>
              <h4>Avatar Mode</h4>
            </div>
            <div className="impact-metrics">
              <div className="metric">
                <span className="metric-label">Authenticity:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '40%', backgroundColor: '#F44336' }}></div>
                </div>
                <span className="metric-value">40%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Professionalism:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '70%', backgroundColor: '#FF9800' }}></div>
                </div>
                <span className="metric-value">70%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Public Trust:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '50%', backgroundColor: '#FF9800' }}></div>
                </div>
                <span className="metric-value">50%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Overall Impact:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '50%', backgroundColor: '#FF9800' }}></div>
                </div>
                <span className="metric-value">50% (1.0x)</span>
              </div>
            </div>
            <div className="mode-benefits">
              <h5>Benefits:</h5>
              <ul>
                <li>No preparation time required</li>
                <li>Leader can focus on other tasks</li>
                <li>Consistent digital representation</li>
                <li>Available 24/7 for communications</li>
              </ul>
            </div>
          </div>

          <div className="mode-comparison teleprompter-mode">
            <div className="mode-header">
              <div className="mode-icon">📺</div>
              <h4>Teleprompter Mode</h4>
            </div>
            <div className="impact-metrics">
              <div className="metric">
                <span className="metric-label">Authenticity:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '65%', backgroundColor: '#FF9800' }}></div>
                </div>
                <span className="metric-value">65%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Professionalism:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '95%', backgroundColor: '#4CAF50' }}></div>
                </div>
                <span className="metric-value">95%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Public Trust:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '75%', backgroundColor: '#2196F3' }}></div>
                </div>
                <span className="metric-value">75%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Overall Impact:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '60%', backgroundColor: '#2196F3' }}></div>
                </div>
                <span className="metric-value">60% (1.2x)</span>
              </div>
            </div>
            <div className="mode-benefits">
              <h5>Benefits:</h5>
              <ul>
                <li>Polished, error-free delivery</li>
                <li>Consistent messaging</li>
                <li>Professional appearance</li>
                <li>Leader engagement with content</li>
              </ul>
            </div>
          </div>

          <div className="mode-comparison off-the-cuff-mode">
            <div className="mode-header">
              <div className="mode-icon">🎤</div>
              <h4>Off-the-Cuff Mode</h4>
            </div>
            <div className="impact-metrics">
              <div className="metric">
                <span className="metric-label">Authenticity:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '95%', backgroundColor: '#4CAF50' }}></div>
                </div>
                <span className="metric-value">95%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Professionalism:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '70%', backgroundColor: '#FF9800' }}></div>
                </div>
                <span className="metric-value">70%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Public Trust:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '90%', backgroundColor: '#4CAF50' }}></div>
                </div>
                <span className="metric-value">90%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Overall Impact:</span>
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: '75%', backgroundColor: '#4CAF50' }}></div>
                </div>
                <span className="metric-value">75% (1.5x)</span>
              </div>
            </div>
            <div className="mode-benefits">
              <h5>Benefits:</h5>
              <ul>
                <li>Highest authenticity and relatability</li>
                <li>Shows confidence and competence</li>
                <li>Strongest emotional connection</li>
                <li>Maximum simulation impact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="delivery-system">
        <div className="teleprompter-card">
          <h3>📺 Teleprompter</h3>
          <div className="teleprompter-screen">
            <div className="teleprompter-text">
              <p>Fellow citizens of our civilization, today we stand at a crossroads of unprecedented opportunity...</p>
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
