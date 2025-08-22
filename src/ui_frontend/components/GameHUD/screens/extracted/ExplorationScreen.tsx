import React, { useState, useEffect } from 'react';
import { ExplorationDashboard } from '../../../Exploration/ExplorationDashboard';
import { GalacticExplorationService } from '../../../../services/GalacticExplorationService';
import './ExplorationScreen.css';

interface ExplorationScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface ExplorationStats {
  activeExpeditions: number;
  discoveredSystems: number;
  firstContacts: number;
  anomaliesFound: number;
  explorationBudget: string;
  successRate: number;
}

const ExplorationScreen: React.FC<ExplorationScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'missions' | 'discoveries' | 'contacts' | 'analytics'>('dashboard');
  const [explorationStats, setExplorationStats] = useState<ExplorationStats>({
    activeExpeditions: 0,
    discoveredSystems: 0,
    firstContacts: 0,
    anomaliesFound: 0,
    explorationBudget: '$0',
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explorationService] = useState(() => new GalacticExplorationService());

  useEffect(() => {
    const fetchExplorationStats = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('/api/exploration/stats');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        if (data.success) {
          setExplorationStats(data.stats);
        }
      } catch (err) {
        console.warn('Exploration API not available, using mock data');
        // Use mock data
        setExplorationStats({
          activeExpeditions: 8,
          discoveredSystems: 156,
          firstContacts: 12,
          anomaliesFound: 34,
          explorationBudget: '$2.4B',
          successRate: 87.3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExplorationStats();
  }, []);

  const handleAction = (action: string, context?: any) => {
    console.log(`Exploration Action: ${action}`, context);
    alert(`Exploration System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const renderDashboardTab = () => (
    <div className="dashboard-tab">
      <div className="dashboard-header">
        <h2>🚀 Exploration Dashboard</h2>
        <p>Comprehensive space exploration management and discovery tracking</p>
      </div>
      
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-value">{explorationStats.activeExpeditions}</div>
            <div className="stat-label">Active Expeditions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{explorationStats.discoveredSystems}</div>
            <div className="stat-label">Discovered Systems</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👽</div>
          <div className="stat-content">
            <div className="stat-value">{explorationStats.firstContacts}</div>
            <div className="stat-label">First Contacts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌌</div>
          <div className="stat-content">
            <div className="stat-value">{explorationStats.anomaliesFound}</div>
            <div className="stat-label">Anomalies Found</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{explorationStats.explorationBudget}</div>
            <div className="stat-label">Exploration Budget</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{explorationStats.successRate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      <div className="embedded-exploration-dashboard">
        <ExplorationDashboard
          explorationService={explorationService}
          playerId="player-1"
          isVisible={true}
          onClose={() => {}}
        />
      </div>
    </div>
  );

  const renderMissionsTab = () => (
    <div className="missions-tab">
      <div className="missions-header">
        <h2>🚀 Exploration Missions</h2>
        <p>Active and planned exploration expeditions</p>
      </div>

      <div className="missions-grid">
        <div className="mission-card">
          <div className="mission-header">
            <h3>Deep Space Survey Alpha</h3>
            <div className="mission-status active">Active</div>
          </div>
          <div className="mission-info">
            <div className="info-row">
              <span className="info-label">Target Zone:</span>
              <span className="info-value">Outer Rim Sector 7</span>
            </div>
            <div className="info-row">
              <span className="info-label">Progress:</span>
              <span className="info-value">67%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ships:</span>
              <span className="info-value">3 Exploration Vessels</span>
            </div>
            <div className="info-row">
              <span className="info-label">Crew:</span>
              <span className="info-value">450 Personnel</span>
            </div>
            <div className="info-row">
              <span className="info-label">Duration:</span>
              <span className="info-value">6 months</span>
            </div>
            <div className="info-row">
              <span className="info-label">ETA:</span>
              <span className="info-value">14 days</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '67%' }}></div>
          </div>
          <div className="mission-actions">
            <button className="btn" onClick={() => handleAction('Mission Status', 'Deep Space Survey Alpha')}>
              📊 Status
            </button>
            <button className="btn secondary" onClick={() => handleAction('Contact Mission', 'Deep Space Survey Alpha')}>
              📡 Contact
            </button>
          </div>
        </div>

        <div className="mission-card">
          <div className="mission-header">
            <h3>Anomaly Investigation Beta</h3>
            <div className="mission-status planning">Planning</div>
          </div>
          <div className="mission-info">
            <div className="info-row">
              <span className="info-label">Target Zone:</span>
              <span className="info-value">Unknown Signal Source</span>
            </div>
            <div className="info-row">
              <span className="info-label">Progress:</span>
              <span className="info-value">0%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ships:</span>
              <span className="info-value">2 Science Vessels</span>
            </div>
            <div className="info-row">
              <span className="info-label">Crew:</span>
              <span className="info-value">180 Personnel</span>
            </div>
            <div className="info-row">
              <span className="info-label">Duration:</span>
              <span className="info-value">3 months</span>
            </div>
            <div className="info-row">
              <span className="info-label">Launch:</span>
              <span className="info-value">5 days</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '0%' }}></div>
          </div>
          <div className="mission-actions">
            <button className="btn" onClick={() => handleAction('Launch Mission', 'Anomaly Investigation Beta')}>
              🚀 Launch
            </button>
            <button className="btn secondary" onClick={() => handleAction('Edit Mission', 'Anomaly Investigation Beta')}>
              ✏️ Edit
            </button>
          </div>
        </div>

        <div className="mission-card">
          <div className="mission-header">
            <h3>First Contact Protocol Gamma</h3>
            <div className="mission-status completed">Completed</div>
          </div>
          <div className="mission-info">
            <div className="info-row">
              <span className="info-label">Target Zone:</span>
              <span className="info-value">Kepler-442 System</span>
            </div>
            <div className="info-row">
              <span className="info-label">Progress:</span>
              <span className="info-value">100%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ships:</span>
              <span className="info-value">1 Diplomatic Vessel</span>
            </div>
            <div className="info-row">
              <span className="info-label">Crew:</span>
              <span className="info-value">85 Personnel</span>
            </div>
            <div className="info-row">
              <span className="info-label">Duration:</span>
              <span className="info-value">4 months</span>
            </div>
            <div className="info-row">
              <span className="info-label">Completed:</span>
              <span className="info-value">3 days ago</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
          <div className="mission-actions">
            <button className="btn" onClick={() => handleAction('Mission Report', 'First Contact Protocol Gamma')}>
              📋 Report
            </button>
            <button className="btn secondary" onClick={() => handleAction('Archive Mission', 'First Contact Protocol Gamma')}>
              📦 Archive
            </button>
          </div>
        </div>
      </div>

      <div className="missions-actions">
        <button className="btn" onClick={() => handleAction('Plan New Mission')}>
          🚀 New Mission
        </button>
        <button className="btn secondary" onClick={() => handleAction('Mission Templates')}>
          📋 Templates
        </button>
        <button className="btn secondary" onClick={() => handleAction('Fleet Management')}>
          🚢 Fleet
        </button>
      </div>
    </div>
  );

  const renderDiscoveriesTab = () => (
    <div className="discoveries-tab">
      <div className="discoveries-header">
        <h2>🔍 Recent Discoveries</h2>
        <p>New systems, planets, and phenomena discovered by exploration missions</p>
      </div>

      <div className="discoveries-grid">
        <div className="discovery-card">
          <div className="discovery-header">
            <h3>Kepler-186f</h3>
            <div className="discovery-type planet">Planet</div>
          </div>
          <div className="discovery-info">
            <div className="info-row">
              <span className="info-label">System:</span>
              <span className="info-value">Kepler-186</span>
            </div>
            <div className="info-row">
              <span className="info-label">Habitability:</span>
              <span className="info-value">82%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Resources:</span>
              <span className="info-value">Rich</span>
            </div>
            <div className="info-row">
              <span className="info-label">Discovered:</span>
              <span className="info-value">2 weeks ago</span>
            </div>
          </div>
          <div className="discovery-actions">
            <button className="btn" onClick={() => handleAction('Detailed Survey', 'Kepler-186f')}>
              🔬 Survey
            </button>
            <button className="btn secondary" onClick={() => handleAction('Colonization Assessment', 'Kepler-186f')}>
              🏠 Assess
            </button>
          </div>
        </div>

        <div className="discovery-card">
          <div className="discovery-header">
            <h3>Quantum Vortex Anomaly</h3>
            <div className="discovery-type anomaly">Anomaly</div>
          </div>
          <div className="discovery-info">
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">Sector 12-Alpha</span>
            </div>
            <div className="info-row">
              <span className="info-label">Energy Level:</span>
              <span className="info-value">Extreme</span>
            </div>
            <div className="info-row">
              <span className="info-label">Danger Level:</span>
              <span className="info-value">High</span>
            </div>
            <div className="info-row">
              <span className="info-label">Discovered:</span>
              <span className="info-value">5 days ago</span>
            </div>
          </div>
          <div className="discovery-actions">
            <button className="btn" onClick={() => handleAction('Study Anomaly', 'Quantum Vortex')}>
              🔬 Study
            </button>
            <button className="btn secondary" onClick={() => handleAction('Safety Protocol', 'Quantum Vortex')}>
              ⚠️ Protocol
            </button>
          </div>
        </div>

        <div className="discovery-card">
          <div className="discovery-header">
            <h3>Ancient Artifact Site</h3>
            <div className="discovery-type artifact">Artifact</div>
          </div>
          <div className="discovery-info">
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">Ross-128b</span>
            </div>
            <div className="info-row">
              <span className="info-label">Age:</span>
              <span className="info-value">~50,000 years</span>
            </div>
            <div className="info-row">
              <span className="info-label">Technology:</span>
              <span className="info-value">Unknown</span>
            </div>
            <div className="info-row">
              <span className="info-label">Discovered:</span>
              <span className="info-value">1 month ago</span>
            </div>
          </div>
          <div className="discovery-actions">
            <button className="btn" onClick={() => handleAction('Archaeological Survey', 'Ancient Artifact Site')}>
              🏺 Survey
            </button>
            <button className="btn secondary" onClick={() => handleAction('Secure Site', 'Ancient Artifact Site')}>
              🔒 Secure
            </button>
          </div>
        </div>
      </div>

      <div className="discoveries-actions">
        <button className="btn" onClick={() => handleAction('Discovery Archive')}>
          📚 Archive
        </button>
        <button className="btn secondary" onClick={() => handleAction('Research Priorities')}>
          🎯 Priorities
        </button>
        <button className="btn secondary" onClick={() => handleAction('Share Discoveries')}>
          📡 Share
        </button>
      </div>
    </div>
  );

  const renderContactsTab = () => (
    <div className="contacts-tab">
      <div className="contacts-header">
        <h2>👽 First Contact Protocols</h2>
        <p>Diplomatic relations with newly discovered civilizations</p>
      </div>

      <div className="contacts-grid">
        <div className="contact-card">
          <div className="contact-header">
            <h3>Aquatic Collective</h3>
            <div className="contact-status peaceful">Peaceful</div>
          </div>
          <div className="contact-info">
            <div className="info-row">
              <span className="info-label">Species:</span>
              <span className="info-value">Aquatic Humanoids</span>
            </div>
            <div className="info-row">
              <span className="info-label">Technology:</span>
              <span className="info-value">Advanced</span>
            </div>
            <div className="info-row">
              <span className="info-label">Disposition:</span>
              <span className="info-value">Curious</span>
            </div>
            <div className="info-row">
              <span className="info-label">First Contact:</span>
              <span className="info-value">3 months ago</span>
            </div>
          </div>
          <div className="contact-actions">
            <button className="btn" onClick={() => handleAction('Diplomatic Mission', 'Aquatic Collective')}>
              🤝 Diplomacy
            </button>
            <button className="btn secondary" onClick={() => handleAction('Cultural Exchange', 'Aquatic Collective')}>
              🎭 Exchange
            </button>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-header">
            <h3>Silicon-Based Entities</h3>
            <div className="contact-status neutral">Neutral</div>
          </div>
          <div className="contact-info">
            <div className="info-row">
              <span className="info-label">Species:</span>
              <span className="info-value">Crystalline Beings</span>
            </div>
            <div className="info-row">
              <span className="info-label">Technology:</span>
              <span className="info-value">Unknown</span>
            </div>
            <div className="info-row">
              <span className="info-label">Disposition:</span>
              <span className="info-value">Cautious</span>
            </div>
            <div className="info-row">
              <span className="info-label">First Contact:</span>
              <span className="info-value">1 month ago</span>
            </div>
          </div>
          <div className="contact-actions">
            <button className="btn" onClick={() => handleAction('Establish Communication', 'Silicon-Based Entities')}>
              📡 Communicate
            </button>
            <button className="btn secondary" onClick={() => handleAction('Study Species', 'Silicon-Based Entities')}>
              🔬 Study
            </button>
          </div>
        </div>
      </div>

      <div className="contacts-actions">
        <button className="btn" onClick={() => handleAction('Contact Protocols')}>
          📋 Protocols
        </button>
        <button className="btn secondary" onClick={() => handleAction('Diplomatic Corps')}>
          🎖️ Corps
        </button>
        <button className="btn secondary" onClick={() => handleAction('Translation Services')}>
          🗣️ Translation
        </button>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>📊 Exploration Analytics</h2>
        <p>Performance metrics and exploration efficiency analysis</p>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h3>📈 Discovery Rate Over Time</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{ height: '45%' }}></div>
              <div className="bar" style={{ height: '60%' }}></div>
              <div className="bar" style={{ height: '75%' }}></div>
              <div className="bar" style={{ height: '55%' }}></div>
              <div className="bar" style={{ height: '90%' }}></div>
              <div className="bar" style={{ height: '80%' }}></div>
              <div className="bar" style={{ height: '95%' }}></div>
            </div>
            <div className="chart-labels">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>🎯 Mission Success Rate</h3>
          <div className="success-breakdown">
            <div className="success-item">
              <span className="success-label">Successful</span>
              <div className="success-bar">
                <div className="success-fill" style={{ width: '87%', backgroundColor: '#4CAF50' }}></div>
              </div>
              <span className="success-value">87%</span>
            </div>
            <div className="success-item">
              <span className="success-label">Partial Success</span>
              <div className="success-bar">
                <div className="success-fill" style={{ width: '8%', backgroundColor: '#FF9800' }}></div>
              </div>
              <span className="success-value">8%</span>
            </div>
            <div className="success-item">
              <span className="success-label">Failed</span>
              <div className="success-bar">
                <div className="success-fill" style={{ width: '5%', backgroundColor: '#F44336' }}></div>
              </div>
              <span className="success-value">5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button className="btn" onClick={() => handleAction('Detailed Analytics')}>
          📊 Detailed Report
        </button>
        <button className="btn secondary" onClick={() => handleAction('Efficiency Analysis')}>
          ⚡ Efficiency
        </button>
        <button className="btn secondary" onClick={() => handleAction('Cost Analysis')}>
          💰 Cost Analysis
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="exploration-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading exploration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exploration-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          🚀 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveTab('missions')}
        >
          🎯 Missions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'discoveries' ? 'active' : ''}`}
          onClick={() => setActiveTab('discoveries')}
        >
          🔍 Discoveries
        </button>
        <button 
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          👽 Contacts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'missions' && renderMissionsTab()}
        {activeTab === 'discoveries' && renderDiscoveriesTab()}
        {activeTab === 'contacts' && renderContactsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default ExplorationScreen;
