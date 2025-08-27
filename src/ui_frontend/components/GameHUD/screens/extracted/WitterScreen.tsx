import React, { useState, useEffect } from 'react';
import { SimpleWitterFeed } from '../../../Witter/SimpleWitterFeed';
import './WitterScreen.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

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
      <div className="feed-filters">
        <div className="filter-row">
          <select className="filter-dropdown">
            <option value="all">All Categories</option>
            <option value="science">🧬 Science</option>
            <option value="business">📊 Business</option>
            <option value="sports">⚽ Sports</option>
            <option value="politics">🌟 Politics</option>
            <option value="technology">🤖 Technology</option>
          </select>
          <select className="filter-dropdown">
            <option value="all">All Civilizations</option>
            <option value="terran">🌍 Terran Federation</option>
            <option value="vega">⭐ Vega Alliance</option>
            <option value="centauri">🏛️ Centauri Republic</option>
            <option value="andromeda">🌌 Andromeda Empire</option>
            <option value="orion">🔮 Orion Collective</option>
            <option value="zephyrian">💨 Zephyrian Empire</option>
          </select>
        </div>
      </div>
      <div className="embedded-witter-feed">
        <SimpleWitterFeed 
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

      {/* Witter Charts Section */}
      <div className="witter-charts-section">
        <div className="charts-grid">
          <div className="chart-container">
            <LineChart
              data={[
                { label: 'Mon', value: 60 },
                { label: 'Tue', value: 75 },
                { label: 'Wed', value: 45 },
                { label: 'Thu', value: 90 },
                { label: 'Fri', value: 80 },
                { label: 'Sat', value: 95 },
                { label: 'Sun', value: 70 }
              ]}
              title="📈 Engagement Trends (Weekly)"
              color="#4ecdc4"
              height={250}
              width={400}
            />
          </div>

          <div className="chart-container">
            <PieChart
              data={[
                { label: 'Core Worlds', value: 85, color: '#4ecdc4' },
                { label: 'Mid Rim', value: 65, color: '#45b7aa' },
                { label: 'Outer Rim', value: 45, color: '#96ceb4' },
                { label: 'Unknown Regions', value: 25, color: '#feca57' }
              ]}
              title="🌍 Geographic Distribution"
              size={200}
              showLegend={true}
            />
          </div>

          <div className="chart-container">
            <BarChart
              data={[
                { label: 'Likes', value: 32.1, color: '#4ecdc4' },
                { label: 'Daily Wits', value: 18.7, color: '#45b7aa' },
                { label: 'Shares', value: 4.2, color: '#96ceb4' },
                { label: 'Active Users', value: 2.4, color: '#feca57' }
              ]}
              title="💬 Content Metrics (Millions)"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>

          <div className="chart-container">
            <LineChart
              data={[
                { label: 'Q1', value: 2.1 },
                { label: 'Q2', value: 2.2 },
                { label: 'Q3', value: 2.3 },
                { label: 'Q4', value: 2.4 }
              ]}
              title="👥 User Growth (Millions)"
              color="#feca57"
              height={250}
              width={400}
            />
          </div>

          <div className="chart-container">
            <PieChart
              data={[
                { label: 'Humans', value: 60, color: '#4ecdc4' },
                { label: 'AI Characters', value: 25, color: '#45b7aa' },
                { label: 'Aliens', value: 10, color: '#96ceb4' },
                { label: 'Bots', value: 5, color: '#feca57' }
              ]}
              title="🤖 User Type Distribution"
              size={200}
              showLegend={true}
            />
          </div>

          <div className="chart-container">
            <BarChart
              data={[
                { label: 'Active Planets', value: 847, color: '#4ecdc4' },
                { label: 'AI Characters', value: 1200, color: '#45b7aa' },
                { label: 'Daily Posts', value: 18700, color: '#96ceb4' },
                { label: 'Trending Topics', value: 156, color: '#feca57' }
              ]}
              title="🌟 Platform Statistics"
              height={250}
              width={400}
              showTooltip={true}
            />
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
