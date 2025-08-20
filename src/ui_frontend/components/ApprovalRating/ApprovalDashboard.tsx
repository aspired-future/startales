import React, { useState, useEffect, useCallback } from 'react';
import './ApprovalDashboard.css';

interface ApprovalData {
  rating: number;
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: string;
  summary: {
    excellent: string;
    recommendation: string;
  };
}

interface HistoricalData {
  date: string;
  rating: number;
  event: string;
}

interface Demographics {
  byAge: Record<string, number>;
  byCivilization: Record<string, number>;
  byPlanet: Record<string, number>;
  byProfession: Record<string, number>;
}

interface Feedback {
  id: string;
  timestamp: string;
  rating: number;
  comment: string;
  category: string;
  location: string;
  anonymous: boolean;
  citizenId: string | null;
  citizenName: string;
}

interface Poll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }>;
  totalVotes: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface ApprovalDashboardProps {
  playerId: string;
}

export const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({ playerId }) => {
  const [currentData, setCurrentData] = useState<ApprovalData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'feedback' | 'poll'>('overview');
  const [newFeedback, setNewFeedback] = useState({
    rating: 5,
    comment: '',
    category: 'General',
    location: 'Earth - New Geneva',
    anonymous: false
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [currentRes, historyRes, demographicsRes, feedbackRes, pollRes] = await Promise.all([
        fetch('http://localhost:4002/api/approval/current'),
        fetch('http://localhost:4002/api/approval/history?days=7'),
        fetch('http://localhost:4002/api/approval/demographics'),
        fetch('http://localhost:4002/api/approval/feedback?limit=20'),
        fetch('http://localhost:4002/api/approval/poll')
      ]);

      if (!currentRes.ok || !historyRes.ok || !demographicsRes.ok || !feedbackRes.ok || !pollRes.ok) {
        throw new Error('Failed to fetch approval data');
      }

      const [currentData, historyData, demographicsData, feedbackData, pollData] = await Promise.all([
        currentRes.json(),
        historyRes.json(),
        demographicsRes.json(),
        feedbackRes.json(),
        pollRes.json()
      ]);

      setCurrentData(currentData);
      setHistoricalData(historyData.data || []);
      setDemographics(demographicsData);
      setFeedback(feedbackData.feedback || []);
      setPoll(pollData);
      
    } catch (err) {
      console.error('Failed to load approval data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadData]);

  const submitFeedback = async () => {
    if (!newFeedback.comment.trim() || newFeedback.comment.length < 10) {
      alert('Please provide a comment with at least 10 characters');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const response = await fetch('http://localhost:4002/api/approval/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newFeedback,
          citizenId: playerId,
          citizenName: 'Commander Alpha'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setNewFeedback({
          rating: 5,
          comment: '',
          category: 'General',
          location: 'Earth - New Geneva',
          anonymous: false
        });
        
        // Refresh data to show new feedback and updated rating
        await loadData();
        
        alert(`Feedback submitted! New approval rating: ${result.newApprovalRating.toFixed(1)}%`);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const voteInPoll = async (optionId: string) => {
    try {
      const response = await fetch('http://localhost:4002/api/approval/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, citizenId: playerId })
      });

      if (response.ok) {
        const result = await response.json();
        setPoll(result.poll);
        alert('Vote recorded successfully!');
      } else {
        throw new Error('Failed to vote');
      }
    } catch (err) {
      console.error('Failed to vote:', err);
      alert('Failed to record vote. Please try again.');
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return '#4caf50'; // Green
    if (rating >= 70) return '#8bc34a'; // Light green
    if (rating >= 60) return '#ffeb3b'; // Yellow
    if (rating >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <div className="approval-dashboard-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading approval data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="approval-dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Connection Error</h3>
        <p>Failed to load approval data: {error}</p>
        <button onClick={loadData} className="retry-button">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="approval-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Citizen Approval Dashboard</h1>
        <p>Real-time feedback and approval ratings from across the galaxy</p>
      </div>

      {/* Current Rating Card */}
      {currentData && (
        <div className="current-rating-card">
          <div className="rating-display">
            <div 
              className="rating-circle"
              style={{ borderColor: getRatingColor(currentData.rating) }}
            >
              <span className="rating-number" style={{ color: getRatingColor(currentData.rating) }}>
                {currentData.rating.toFixed(1)}%
              </span>
            </div>
            <div className="rating-info">
              <h2>Current Approval Rating</h2>
              <div className="rating-trend">
                {getTrendIcon(currentData.trend)} {currentData.trend.toUpperCase()}
              </div>
              <p className="rating-summary">{currentData.summary.excellent}</p>
              <p className="rating-recommendation">
                <strong>Recommendation:</strong> {currentData.summary.recommendation}
              </p>
              <p className="last-updated">
                Last updated: {formatTimeAgo(currentData.lastUpdated)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'demographics' ? 'active' : ''}`}
          onClick={() => setActiveTab('demographics')}
        >
          👥 Demographics
        </button>
        <button 
          className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Feedback
        </button>
        <button 
          className={`tab-button ${activeTab === 'poll' ? 'active' : ''}`}
          onClick={() => setActiveTab('poll')}
        >
          🗳️ Active Poll
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="historical-chart">
              <h3>📈 Approval History (Last 7 Days)</h3>
              <div className="chart-container">
                {historicalData.map((item, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar"
                      style={{ 
                        height: `${(item.rating / 100) * 200}px`,
                        backgroundColor: getRatingColor(item.rating)
                      }}
                    />
                    <div className="bar-label">
                      <div className="bar-rating">{item.rating.toFixed(1)}%</div>
                      <div className="bar-date">{new Date(item.date).toLocaleDateString()}</div>
                      <div className="bar-event">{item.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'demographics' && demographics && (
          <div className="demographics-tab">
            <div className="demographics-grid">
              <div className="demo-section">
                <h3>🏛️ By Civilization</h3>
                {Object.entries(demographics.byCivilization).map(([civ, rating]) => (
                  <div key={civ} className="demo-item">
                    <span className="demo-label">{civ}</span>
                    <div className="demo-bar">
                      <div 
                        className="demo-fill"
                        style={{ 
                          width: `${rating}%`,
                          backgroundColor: getRatingColor(rating)
                        }}
                      />
                    </div>
                    <span className="demo-value">{rating.toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <div className="demo-section">
                <h3>🌍 By Planet</h3>
                {Object.entries(demographics.byPlanet).map(([planet, rating]) => (
                  <div key={planet} className="demo-item">
                    <span className="demo-label">{planet}</span>
                    <div className="demo-bar">
                      <div 
                        className="demo-fill"
                        style={{ 
                          width: `${rating}%`,
                          backgroundColor: getRatingColor(rating)
                        }}
                      />
                    </div>
                    <span className="demo-value">{rating.toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <div className="demo-section">
                <h3>👥 By Age Group</h3>
                {Object.entries(demographics.byAge).map(([age, rating]) => (
                  <div key={age} className="demo-item">
                    <span className="demo-label">{age}</span>
                    <div className="demo-bar">
                      <div 
                        className="demo-fill"
                        style={{ 
                          width: `${rating}%`,
                          backgroundColor: getRatingColor(rating)
                        }}
                      />
                    </div>
                    <span className="demo-value">{rating.toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <div className="demo-section">
                <h3>💼 By Profession</h3>
                {Object.entries(demographics.byProfession).map(([profession, rating]) => (
                  <div key={profession} className="demo-item">
                    <span className="demo-label">{profession}</span>
                    <div className="demo-bar">
                      <div 
                        className="demo-fill"
                        style={{ 
                          width: `${rating}%`,
                          backgroundColor: getRatingColor(rating)
                        }}
                      />
                    </div>
                    <span className="demo-value">{rating.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-tab">
            {/* Submit Feedback Form */}
            <div className="feedback-form">
              <h3>📝 Submit Your Feedback</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Rating (1-10):</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newFeedback.rating}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="rating-slider"
                  />
                  <span className="rating-display">{newFeedback.rating}/10</span>
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={newFeedback.category}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value }))}
                    className="category-select"
                  >
                    <option value="General">General</option>
                    <option value="Economy">Economy</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Military">Military</option>
                    <option value="Environment">Environment</option>
                    <option value="Trade">Trade</option>
                    <option value="Diplomacy">Diplomacy</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Comment:</label>
                <textarea
                  value={newFeedback.comment}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts on the current leadership..."
                  className="comment-textarea"
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <label className="anonymous-checkbox">
                  <input
                    type="checkbox"
                    checked={newFeedback.anonymous}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, anonymous: e.target.checked }))}
                  />
                  Submit anonymously
                </label>
                <button
                  onClick={submitFeedback}
                  disabled={submittingFeedback || newFeedback.comment.length < 10}
                  className="submit-button"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="recent-feedback">
              <h3>💬 Recent Citizen Feedback</h3>
              <div className="feedback-list">
                {feedback.map((fb) => (
                  <div key={fb.id} className="feedback-item">
                    <div className="feedback-header">
                      <div className="feedback-author">
                        <span className="author-name">{fb.citizenName}</span>
                        <span className="feedback-location">📍 {fb.location}</span>
                      </div>
                      <div className="feedback-meta">
                        <span 
                          className="feedback-rating"
                          style={{ color: getRatingColor(fb.rating * 10) }}
                        >
                          {fb.rating}/10
                        </span>
                        <span className="feedback-time">{formatTimeAgo(fb.timestamp)}</span>
                      </div>
                    </div>
                    <div className="feedback-content">
                      <span className="feedback-category">🏷️ {fb.category}</span>
                      <p className="feedback-comment">{fb.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'poll' && poll && (
          <div className="poll-tab">
            <div className="poll-container">
              <h3>🗳️ Active Poll</h3>
              <div className="poll-question">
                <h4>{poll.question}</h4>
                <p className="poll-meta">
                  Total votes: {poll.totalVotes.toLocaleString()} | 
                  Ends: {new Date(poll.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="poll-options">
                {poll.options.map((option) => (
                  <div key={option.id} className="poll-option">
                    <button
                      onClick={() => voteInPoll(option.id)}
                      className="vote-button"
                    >
                      <div className="option-text">{option.text}</div>
                      <div className="option-stats">
                        <div className="vote-bar">
                          <div 
                            className="vote-fill"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                        <span className="vote-count">
                          {option.votes.toLocaleString()} ({option.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalDashboard;

