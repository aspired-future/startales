import React, { useState, useEffect } from 'react';
import { BaseScreen, ScreenProps } from '../BaseScreen';
import './WorldWondersScreen.css';

interface GameContext {
  currentLocation: string;
  playerId: string;
}

interface WonderTemplate {
  wonder_type: string;
  display_name: string;
  wonder_category: string;
  base_cost: Record<string, number>;
  strategic_benefits: Record<string, number>;
  description: string;
}

interface Wonder {
  id: string;
  campaign_id: number;
  wonder_type: string;
  wonder_name: string;
  construction_status: 'in_progress' | 'paused' | 'completed' | 'cancelled';
  completion_percentage: number;
  construction_phase: string;
  invested_resources: Record<string, number>;
  strategic_benefits: Record<string, number>;
  started_at: string;
  completed_at?: string;
}

interface ConstructionProgress {
  id: string;
  wonder_id: string;
  phase: string;
  progress_percentage: number;
  resources_invested: Record<string, number>;
  timestamp: string;
}

const GalaxyWondersScreen: React.FC<ScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  console.log('🏛️ GalaxyWondersScreen: Component rendering with gameContext:', gameContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [availableWonders, setAvailableWonders] = useState<WonderTemplate[]>([]);
  const [campaignWonders, setCampaignWonders] = useState<Wonder[]>([]);
  const [constructionHistory, setConstructionHistory] = useState<ConstructionProgress[]>([]);

  const fetchWorldWondersData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use dummy data since the API endpoints might not be fully connected
      const dummyTemplates: WonderTemplate[] = [
        {
          wonder_type: 'PYRAMIDS',
          display_name: 'Galactic Pyramids',
          wonder_category: 'Ancient',
          base_cost: { stone: 10000, gold: 5000, labor: 8000 },
          strategic_benefits: { culture: 25, tourism: 15, prestige: 30 },
          description: 'Massive stone monuments that demonstrate architectural mastery and provide lasting cultural benefits across the galaxy.'
        },
        {
          wonder_type: 'GREAT_LIBRARY',
          display_name: 'Galactic Archive',
          wonder_category: 'Knowledge',
          base_cost: { stone: 6000, gold: 8000, crystals: 2000 },
          strategic_benefits: { research: 40, education: 25, culture: 20 },
          description: 'A vast repository of galactic knowledge that accelerates research and educational advancement across star systems.'
        },
        {
          wonder_type: 'TEMPLES',
          display_name: 'Stellar Sanctuaries',
          wonder_category: 'Spiritual',
          base_cost: { stone: 8000, gold: 6000, crystals: 3000 },
          strategic_benefits: { culture: 35, happiness: 20, stability: 15 },
          description: 'Magnificent spiritual structures that inspire galactic populations and provide guidance across the stars.'
        },
        {
          wonder_type: 'COLOSSUS',
          display_name: 'Galactic Colossus',
          wonder_category: 'Engineering',
          base_cost: { metal: 12000, energy: 8000, gold: 4000 },
          strategic_benefits: { prestige: 40, defense: 20, tourism: 25 },
          description: 'A towering metallic monument that showcases galactic engineering prowess and serves as a beacon across star systems.'
        }
      ];

      const dummyCampaignWonders: Wonder[] = [
        {
          id: '1',
          campaign_id: 1,
          wonder_type: 'PYRAMIDS',
          wonder_name: 'Capital Pyramids',
          construction_status: 'in_progress',
          completion_percentage: 65.4,
          construction_phase: 'Foundation Complete',
          invested_resources: { stone: 6540, gold: 3270, labor: 5232 },
          strategic_benefits: { culture: 25, tourism: 15, prestige: 30 },
          started_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          campaign_id: 1,
          wonder_type: 'GREAT_LIBRARY',
          wonder_name: 'Central Library',
          construction_status: 'completed',
          completion_percentage: 100,
          construction_phase: 'Completed',
          invested_resources: { stone: 6000, gold: 8000, crystals: 2000 },
          strategic_benefits: { research: 40, education: 25, culture: 20 },
          started_at: '2023-11-20T14:15:00Z',
          completed_at: '2024-01-10T09:45:00Z'
        }
      ];

      const dummyHistory: ConstructionProgress[] = [
        {
          id: '1',
          wonder_id: '1',
          phase: 'Planning',
          progress_percentage: 15.2,
          resources_invested: { stone: 1520, gold: 760, labor: 1216 },
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          wonder_id: '1',
          phase: 'Foundation',
          progress_percentage: 45.8,
          resources_invested: { stone: 3040, gold: 1520, labor: 2432 },
          timestamp: '2024-01-20T16:20:00Z'
        },
        {
          id: '3',
          wonder_id: '1',
          phase: 'Foundation Complete',
          progress_percentage: 65.4,
          resources_invested: { stone: 1980, gold: 990, labor: 1584 },
          timestamp: '2024-01-25T11:10:00Z'
        }
      ];

      setAvailableWonders(dummyTemplates);
      setCampaignWonders(dummyCampaignWonders);
      setConstructionHistory(dummyHistory);

    } catch (err) {
      console.error('Failed to fetch world wonders data:', err);
      setError('Failed to load world wonders data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorldWondersData();
  }, [gameContext]);

  const renderOverviewTab = () => {
    const completedWonders = campaignWonders.filter(w => w.construction_status === 'completed');
    const inProgressWonders = campaignWonders.filter(w => w.construction_status === 'in_progress');
    const totalBenefits = campaignWonders.reduce((acc, wonder) => {
      Object.entries(wonder.strategic_benefits).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="overview-tab">
        <div className="tab-header">
          <h3>🏛️ World Wonders Overview</h3>
          <p>Monumental achievements that provide lasting benefits to your civilization</p>
        </div>

        <div className="section">
          <h4>Wonder Statistics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <div className="metric-title">Completed Wonders</div>
                <div className="metric-value">{completedWonders.length}</div>
                <div className="metric-description">Fully constructed monuments</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🚧</div>
              <div className="metric-content">
                <div className="metric-title">In Progress</div>
                <div className="metric-value">{inProgressWonders.length}</div>
                <div className="metric-description">Currently under construction</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <div className="metric-title">Available Templates</div>
                <div className="metric-value">{availableWonders.length}</div>
                <div className="metric-description">Wonder types you can build</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⭐</div>
              <div className="metric-content">
                <div className="metric-title">Total Prestige</div>
                <div className="metric-value">{totalBenefits.prestige || 0}</div>
                <div className="metric-description">Civilization prestige bonus</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Strategic Benefits</h4>
          <div className="benefits-grid">
            {Object.entries(totalBenefits).map(([benefit, value]) => (
              <div key={benefit} className="benefit-card">
                <div className="benefit-name">{benefit.charAt(0).toUpperCase() + benefit.slice(1)}</div>
                <div className="benefit-value">+{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAvailableTab = () => {
    return (
      <div className="available-tab">
        <div className="tab-header">
          <h3>🎯 Available Wonders</h3>
          <p>Wonder templates you can construct for your civilization</p>
        </div>

        <div className="wonders-grid">
          {availableWonders.map((wonder) => (
            <div key={wonder.wonder_type} className="wonder-template-card">
              <div className="wonder-header">
                <h4>{wonder.display_name}</h4>
                <span className="wonder-category">{wonder.wonder_category}</span>
              </div>
              
              <div className="wonder-description">
                {wonder.description}
              </div>

              <div className="wonder-costs">
                <h5>Construction Cost:</h5>
                <div className="cost-list">
                  {Object.entries(wonder.base_cost).map(([resource, amount]) => (
                    <div key={resource} className="cost-item">
                      <span className="resource-name">{resource}</span>
                      <span className="resource-amount">{amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wonder-benefits">
                <h5>Strategic Benefits:</h5>
                <div className="benefits-list">
                  {Object.entries(wonder.strategic_benefits).map(([benefit, value]) => (
                    <div key={benefit} className="benefit-item">
                      <span className="benefit-name">{benefit}</span>
                      <span className="benefit-value">+{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="start-construction-btn">
                Start Construction
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConstructionTab = () => {
    return (
      <div className="construction-tab">
        <div className="tab-header">
          <h3>🚧 Construction Projects</h3>
          <p>Monitor ongoing wonder construction and progress</p>
        </div>

        <div className="construction-projects">
          {campaignWonders.map((wonder) => (
            <div key={wonder.id} className="construction-card">
              <div className="construction-header">
                <h4>{wonder.wonder_name}</h4>
                <span className={`status-badge ${wonder.construction_status}`}>
                  {wonder.construction_status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="progress-section">
                <div className="progress-info">
                  <span>Progress: {wonder.completion_percentage.toFixed(1)}%</span>
                  <span>Phase: {wonder.construction_phase}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${wonder.completion_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="resources-invested">
                <h5>Resources Invested:</h5>
                <div className="resource-list">
                  {Object.entries(wonder.invested_resources).map(([resource, amount]) => (
                    <div key={resource} className="resource-item">
                      <span className="resource-name">{resource}</span>
                      <span className="resource-amount">{amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="construction-actions">
                {wonder.construction_status === 'in_progress' && (
                  <>
                    <button className="action-btn invest-btn">Invest Resources</button>
                    <button className="action-btn pause-btn">Pause Construction</button>
                  </>
                )}
                {wonder.construction_status === 'paused' && (
                  <button className="action-btn resume-btn">Resume Construction</button>
                )}
                {wonder.construction_status !== 'completed' && (
                  <button className="action-btn cancel-btn">Cancel Project</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="history-tab">
        <div className="tab-header">
          <h3>📚 Construction History</h3>
          <p>Track the progress and milestones of your wonder construction projects</p>
        </div>

        <div className="history-timeline">
          {constructionHistory.map((entry) => {
            const wonder = campaignWonders.find(w => w.id === entry.wonder_id);
            return (
              <div key={entry.id} className="history-entry">
                <div className="history-timestamp">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
                <div className="history-content">
                  <h5>{wonder?.wonder_name || 'Unknown Wonder'}</h5>
                  <p>Phase: {entry.phase}</p>
                  <p>Progress: {entry.progress_percentage.toFixed(1)}%</p>
                  <div className="history-resources">
                    Resources: {Object.entries(entry.resources_invested)
                      .map(([r, a]) => `${r}: ${a.toLocaleString()}`)
                      .join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="world-wonders-screen loading">
        <div className="loading-spinner"></div>
        <p>Loading world wonders data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="world-wonders-screen error">
        <div className="error-message">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={fetchWorldWondersData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      onRefresh={fetchWorldWondersData}
      apiEndpoints={[
        { method: 'GET', path: '/api/wonders/templates', description: 'List available wonder templates' },
        { method: 'GET', path: '/api/wonders', description: 'List campaign wonders and status' },
        { method: 'GET', path: '/api/wonders/history', description: 'Construction history timeline' },
        { method: 'POST', path: '/api/wonders', description: 'Start a new wonder construction' }
      ]}
    >
      <div className="galaxy-wonders-screen">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            🎯 Available Wonders
          </button>
          <button 
            className={`tab-button ${activeTab === 'construction' ? 'active' : ''}`}
            onClick={() => setActiveTab('construction')}
          >
            🚧 Construction
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📚 History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'available' && renderAvailableTab()}
          {activeTab === 'construction' && renderConstructionTab()}
          {activeTab === 'history' && renderHistoryTab()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default GalaxyWondersScreen;
