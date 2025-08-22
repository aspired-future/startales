import React, { useState, useEffect } from 'react';
import { WitterFeed } from '../../../Witter/WitterFeed';
import './WitterScreen.css';

interface WitterScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

const WitterScreen: React.FC<WitterScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'analytics' | 'management'>('feed');
  const [loading, setLoading] = useState(false);

  const handleAction = (action: string, context?: any) => {
    console.log(`Witter Action: ${action}`, context);
    alert(`Witter System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const renderFeedTab = () => (
    <div className="witter-feed-tab">
      <div className="feed-header">
        <h2>🐦 Witty Galaxy Social Network</h2>
        <p>Real-time galactic social media feed with AI-generated content</p>
      </div>
      <div className="embedded-witter-feed">
        <WitterFeed 
          gameContext={gameContext}
          playerId="player-1"
          className="full-witter-feed"
        />
      </div>
    </div>
  );

  const renderTrendingTab = () => (
    <div className="trending-tab">
      <div className="trending-header">
        <h2>📈 Trending Topics</h2>
        <p>Most popular topics across the galaxy</p>
      </div>
      
      <div className="trending-grid">
        <div className="trending-card">
          <div className="trending-rank">#1</div>
          <div className="trending-content">
            <h3>#GalacticElections</h3>
            <p>2.4M wits • Trending in Politics</p>
            <div className="trending-sample">
              "The upcoming elections are heating up across all sectors..."
            </div>
          </div>
        </div>

        <div className="trending-card">
          <div className="trending-rank">#2</div>
          <div className="trending-content">
            <h3>#SpaceExploration</h3>
            <p>1.8M wits • Trending in Science</p>
            <div className="trending-sample">
              "New discoveries in the outer rim are changing everything..."
            </div>
          </div>
        </div>

        <div className="trending-card">
          <div className="trending-rank">#3</div>
          <div className="trending-content">
            <h3>#TradeWars</h3>
            <p>1.2M wits • Trending in Economy</p>
            <div className="trending-sample">
              "Trade disputes between sectors are affecting markets..."
            </div>
          </div>
        </div>

        <div className="trending-card">
          <div className="trending-rank">#4</div>
          <div className="trending-content">
            <h3>#AlienContact</h3>
            <p>950K wits • Trending in News</p>
            <div className="trending-sample">
              "First contact protocols are being updated after recent..."
            </div>
          </div>
        </div>

        <div className="trending-card">
          <div className="trending-rank">#5</div>
          <div className="trending-content">
            <h3>#TechBreakthrough</h3>
            <p>720K wits • Trending in Technology</p>
            <div className="trending-sample">
              "Revolutionary new FTL technology promises faster travel..."
            </div>
          </div>
        </div>

        <div className="trending-card">
          <div className="trending-rank">#6</div>
          <div className="trending-content">
            <h3>#CulturalExchange</h3>
            <p>680K wits • Trending in Society</p>
            <div className="trending-sample">
              "Inter-species cultural festivals are bringing unity..."
            </div>
          </div>
        </div>
      </div>

      <div className="trending-actions">
        <button className="btn" onClick={() => handleAction('Refresh Trending')}>
          🔄 Refresh Trends
        </button>
        <button className="btn secondary" onClick={() => handleAction('View Historical Trends')}>
          📊 Historical Data
        </button>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>📊 Witter Analytics</h2>
        <p>Social media metrics and engagement analysis</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">2.4M</div>
            <div className="metric-label">Active Users</div>
            <div className="metric-change positive">+12.3%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-content">
            <div className="metric-value">18.7M</div>
            <div className="metric-label">Daily Wits</div>
            <div className="metric-change positive">+8.7%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔄</div>
          <div className="metric-content">
            <div className="metric-value">4.2M</div>
            <div className="metric-label">Shares</div>
            <div className="metric-change positive">+15.2%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-content">
            <div className="metric-value">32.1M</div>
            <div className="metric-label">Likes</div>
            <div className="metric-change positive">+9.4%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌍</div>
          <div className="metric-content">
            <div className="metric-value">847</div>
            <div className="metric-label">Active Planets</div>
            <div className="metric-change positive">+2.1%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🤖</div>
          <div className="metric-content">
            <div className="metric-value">1.2M</div>
            <div className="metric-label">AI Characters</div>
            <div className="metric-change positive">+18.9%</div>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h3>📈 Engagement Over Time</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{ height: '60%' }}></div>
              <div className="bar" style={{ height: '75%' }}></div>
              <div className="bar" style={{ height: '45%' }}></div>
              <div className="bar" style={{ height: '90%' }}></div>
              <div className="bar" style={{ height: '80%' }}></div>
              <div className="bar" style={{ height: '95%' }}></div>
              <div className="bar" style={{ height: '70%' }}></div>
            </div>
            <div className="chart-labels">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>🌍 Geographic Distribution</h3>
          <div className="geo-stats">
            <div className="geo-item">
              <span className="geo-label">Core Worlds</span>
              <div className="geo-bar">
                <div className="geo-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="geo-value">85%</span>
            </div>
            <div className="geo-item">
              <span className="geo-label">Mid Rim</span>
              <div className="geo-bar">
                <div className="geo-fill" style={{ width: '65%' }}></div>
              </div>
              <span className="geo-value">65%</span>
            </div>
            <div className="geo-item">
              <span className="geo-label">Outer Rim</span>
              <div className="geo-bar">
                <div className="geo-fill" style={{ width: '45%' }}></div>
              </div>
              <span className="geo-value">45%</span>
            </div>
            <div className="geo-item">
              <span className="geo-label">Unknown Regions</span>
              <div className="geo-bar">
                <div className="geo-fill" style={{ width: '25%' }}></div>
              </div>
              <span className="geo-value">25%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button className="btn" onClick={() => handleAction('Generate Report')}>
          📋 Generate Report
        </button>
        <button className="btn secondary" onClick={() => handleAction('Export Data')}>
          📤 Export Data
        </button>
        <button className="btn secondary" onClick={() => handleAction('Schedule Analysis')}>
          ⏰ Schedule Analysis
        </button>
      </div>
    </div>
  );

  const renderManagementTab = () => (
    <div className="management-tab">
      <div className="management-header">
        <h2>⚙️ Content Management</h2>
        <p>Moderate content and manage AI-generated posts</p>
      </div>

      <div className="management-grid">
        <div className="management-card">
          <h3>🤖 AI Content Generation</h3>
          <div className="management-stats">
            <div className="stat-item">
              <span className="stat-label">Generated Today</span>
              <span className="stat-value">12,847</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Approval Rate</span>
              <span className="stat-value">94.2%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Personalities</span>
              <span className="stat-value">2,156</span>
            </div>
          </div>
          <div className="management-actions">
            <button className="btn" onClick={() => handleAction('Configure AI Generation')}>
              ⚙️ Configure
            </button>
            <button className="btn secondary" onClick={() => handleAction('Review Queue')}>
              📋 Review Queue
            </button>
          </div>
        </div>

        <div className="management-card">
          <h3>🛡️ Content Moderation</h3>
          <div className="management-stats">
            <div className="stat-item">
              <span className="stat-label">Flagged Posts</span>
              <span className="stat-value">23</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Auto-Removed</span>
              <span className="stat-value">156</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Appeals</span>
              <span className="stat-value">7</span>
            </div>
          </div>
          <div className="management-actions">
            <button className="btn" onClick={() => handleAction('Review Flagged Content')}>
              🚨 Review Flagged
            </button>
            <button className="btn secondary" onClick={() => handleAction('Moderation Settings')}>
              ⚙️ Settings
            </button>
          </div>
        </div>

        <div className="management-card">
          <h3>📊 Engagement Optimization</h3>
          <div className="management-stats">
            <div className="stat-item">
              <span className="stat-label">Boost Campaigns</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reach Increase</span>
              <span className="stat-value">+34%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">ROI</span>
              <span className="stat-value">287%</span>
            </div>
          </div>
          <div className="management-actions">
            <button className="btn" onClick={() => handleAction('Create Campaign')}>
              🚀 New Campaign
            </button>
            <button className="btn secondary" onClick={() => handleAction('Optimize Algorithm')}>
              🎯 Optimize
            </button>
          </div>
        </div>

        <div className="management-card">
          <h3>👥 User Management</h3>
          <div className="management-stats">
            <div className="stat-item">
              <span className="stat-label">Verified Users</span>
              <span className="stat-value">45,892</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Suspended</span>
              <span className="stat-value">234</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">VIP Members</span>
              <span className="stat-value">1,847</span>
            </div>
          </div>
          <div className="management-actions">
            <button className="btn" onClick={() => handleAction('User Directory')}>
              📖 Directory
            </button>
            <button className="btn secondary" onClick={() => handleAction('Verification Queue')}>
              ✅ Verify Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="witter-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          🐦 Feed
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          📈 Trending
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
        >
          ⚙️ Management
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'feed' && renderFeedTab()}
        {activeTab === 'trending' && renderTrendingTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'management' && renderManagementTab()}
      </div>
    </div>
  );
};

export default WitterScreen;
