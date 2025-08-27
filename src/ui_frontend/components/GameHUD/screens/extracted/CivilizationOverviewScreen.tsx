import React, { useState, useEffect } from 'react';
import BaseScreen, { ScreenProps } from '../BaseScreen';
import './CivilizationOverviewScreen.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface CivilizationStats {
  // Core Stats
  name: string;
  population: number;
  territory: number;
  gdp: number;
  approval: number;
  
  // Military & Security
  militaryStrength: number;
  defenseSpending: number;
  securityLevel: number;
  
  // Economy
  treasury: number;
  debtToGDP: number;
  tradeBalance: number;
  unemployment: number;
  
  // Technology & Research
  researchProjects: number;
  techLevel: number;
  innovationIndex: number;
  
  // Social & Culture
  educationLevel: number;
  healthIndex: number;
  culturalInfluence: number;
  
  // Space & Galaxy
  controlledSystems: number;
  exploredSectors: number;
  diplomaticRelations: number;
  
  // Government
  governmentType: string;
  stability: number;
  corruption: number;
}

interface CivilizationOverviewScreenProps extends ScreenProps {}

const CivilizationOverviewScreen: React.FC<CivilizationOverviewScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'military' | 'economy' | 'technology' | 'society' | 'galaxy'>('overview');
  const [loading, setLoading] = useState(false);
  const [civilizationStats, setCivilizationStats] = useState<CivilizationStats>({
    // Mock data for comprehensive civilization overview
    name: "United Terran Federation",
    population: 2847000000,
    territory: 847,
    gdp: 45600000000000,
    approval: 73,
    
    militaryStrength: 85,
    defenseSpending: 12.4,
    securityLevel: 78,
    
    treasury: 2340000000000,
    debtToGDP: 34.2,
    tradeBalance: 156000000000,
    unemployment: 4.2,
    
    researchProjects: 247,
    techLevel: 8.7,
    innovationIndex: 82,
    
    educationLevel: 91,
    healthIndex: 88,
    culturalInfluence: 76,
    
    controlledSystems: 23,
    exploredSectors: 156,
    diplomaticRelations: 12,
    
    governmentType: "Federal Republic",
    stability: 81,
    corruption: 23
  });

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (value: number, threshold: { good: number; warning: number }): string => {
    if (value >= threshold.good) return '#4caf50';
    if (value >= threshold.warning) return '#ff9800';
    return '#f44336';
  };

  const renderOverviewTab = () => (
    <div className="overview-tab">
      <div className="civ-header">
        <h2>🏛️ {civilizationStats.name}</h2>
        <div className="civ-type">{civilizationStats.governmentType}</div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-category">
          <h3>🌍 Core Statistics</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Population</span>
              <span className="stat-value">{formatNumber(civilizationStats.population)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Territory</span>
              <span className="stat-value">{civilizationStats.territory} sectors</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">GDP</span>
              <span className="stat-value">${formatNumber(civilizationStats.gdp)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Approval Rating</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.approval, {good: 70, warning: 50})}}>{civilizationStats.approval}%</span>
            </div>
          </div>
        </div>

        <div className="stat-category">
          <h3>⚔️ Military & Security</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Military Strength</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.militaryStrength, {good: 80, warning: 60})}}>{civilizationStats.militaryStrength}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Defense Spending</span>
              <span className="stat-value">{civilizationStats.defenseSpending}% of GDP</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Security Level</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.securityLevel, {good: 75, warning: 50})}}>{civilizationStats.securityLevel}%</span>
            </div>
          </div>
        </div>

        <div className="stat-category">
          <h3>💰 Economy</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Treasury</span>
              <span className="stat-value">${formatNumber(civilizationStats.treasury)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Debt to GDP</span>
              <span className="stat-value" style={{color: getStatusColor(100 - civilizationStats.debtToGDP, {good: 60, warning: 40})}}>{civilizationStats.debtToGDP}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Trade Balance</span>
              <span className="stat-value" style={{color: civilizationStats.tradeBalance > 0 ? '#4caf50' : '#f44336'}}>${formatNumber(civilizationStats.tradeBalance)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unemployment</span>
              <span className="stat-value" style={{color: getStatusColor(100 - civilizationStats.unemployment, {good: 95, warning: 90})}}>{civilizationStats.unemployment}%</span>
            </div>
          </div>
        </div>

        <div className="stat-category">
          <h3>🔬 Technology & Research</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Active Projects</span>
              <span className="stat-value">{civilizationStats.researchProjects}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tech Level</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.techLevel * 10, {good: 80, warning: 60})}}>{civilizationStats.techLevel}/10</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Innovation Index</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.innovationIndex, {good: 80, warning: 60})}}>{civilizationStats.innovationIndex}/100</span>
            </div>
          </div>
        </div>

        <div className="stat-category">
          <h3>👥 Society & Culture</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Education Level</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.educationLevel, {good: 85, warning: 70})}}>{civilizationStats.educationLevel}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Health Index</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.healthIndex, {good: 85, warning: 70})}}>{civilizationStats.healthIndex}/100</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cultural Influence</span>
              <span className="stat-value" style={{color: getStatusColor(civilizationStats.culturalInfluence, {good: 75, warning: 50})}}>{civilizationStats.culturalInfluence}/100</span>
            </div>
          </div>
        </div>

        <div className="stat-category">
          <h3>🌌 Galaxy & Space</h3>
          <div className="stat-items">
            <div className="stat-item">
              <span className="stat-label">Controlled Systems</span>
              <span className="stat-value">{civilizationStats.controlledSystems}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Explored Sectors</span>
              <span className="stat-value">{civilizationStats.exploredSectors}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Diplomatic Relations</span>
              <span className="stat-value">{civilizationStats.diplomaticRelations} active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          <div className="chart-container">
            <LineChart
              data={[
                { label: 'Jan', value: 68 },
                { label: 'Feb', value: 71 },
                { label: 'Mar', value: 69 },
                { label: 'Apr', value: 73 },
                { label: 'May', value: 75 },
                { label: 'Jun', value: civilizationStats.approval }
              ]}
              title="📊 Approval Rating Trend"
              color="#4ecdc4"
              height={200}
              width={350}
            />
          </div>

          <div className="chart-container">
            <PieChart
              data={[
                { label: 'Military', value: civilizationStats.defenseSpending, color: '#ff6b6b' },
                { label: 'Education', value: 25, color: '#4ecdc4' },
                { label: 'Healthcare', value: 20, color: '#45b7aa' },
                { label: 'Infrastructure', value: 18, color: '#96ceb4' },
                { label: 'Research', value: 12, color: '#feca57' },
                { label: 'Other', value: 100 - civilizationStats.defenseSpending - 75, color: '#ff9ff3' }
              ]}
              title="💰 Budget Allocation"
              size={180}
              showLegend={true}
            />
          </div>

          <div className="chart-container">
            <BarChart
              data={[
                { label: 'Military', value: civilizationStats.militaryStrength, color: '#ff6b6b' },
                { label: 'Economy', value: Math.min(100, civilizationStats.gdp / 1000000), color: '#4ecdc4' },
                { label: 'Technology', value: civilizationStats.techLevel * 10, color: '#45b7aa' },
                { label: 'Education', value: civilizationStats.educationLevel, color: '#96ceb4' },
                { label: 'Health', value: civilizationStats.healthIndex, color: '#feca57' }
              ]}
              title="🏛️ Civilization Strength"
              height={200}
              width={350}
              color="#4ecdc4"
            />
          </div>

          <div className="chart-container">
            <LineChart
              data={[
                { label: 'Q1', value: Math.max(0, civilizationStats.gdp * 0.85) },
                { label: 'Q2', value: Math.max(0, civilizationStats.gdp * 0.92) },
                { label: 'Q3', value: Math.max(0, civilizationStats.gdp * 0.97) },
                { label: 'Q4', value: civilizationStats.gdp }
              ]}
              title="📈 GDP Growth"
              color="#feca57"
              height={200}
              width={350}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'military':
        return (
          <div className="military-tab">
            <h3>⚔️ Military Overview</h3>
            <div className="stats-grid">
              <div className="stat-category">
                <h4>🛡️ Defense Forces</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Active Personnel</span>
                    <span className="stat-value">2.4M</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Reserve Forces</span>
                    <span className="stat-value">8.7M</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Fleet Strength</span>
                    <span className="stat-value">847 vessels</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Orbital Platforms</span>
                    <span className="stat-value">23 active</span>
                  </div>
                </div>
              </div>
              <div className="stat-category">
                <h4>🚀 Space Assets</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Battlecruisers</span>
                    <span className="stat-value">12</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Destroyers</span>
                    <span className="stat-value">45</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Frigates</span>
                    <span className="stat-value">156</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Support Vessels</span>
                    <span className="stat-value">634</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'economy':
        return (
          <div className="economy-tab">
            <h3>💰 Economic Analysis</h3>
            <div className="stats-grid">
              <div className="stat-category">
                <h4>💼 Economic Sectors</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Manufacturing</span>
                    <span className="stat-value">34.2% of GDP</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Services</span>
                    <span className="stat-value">28.7% of GDP</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Technology</span>
                    <span className="stat-value">18.9% of GDP</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Space Mining</span>
                    <span className="stat-value">12.1% of GDP</span>
                  </div>
                </div>
              </div>
              <div className="stat-category">
                <h4>📈 Trade & Commerce</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Export Volume</span>
                    <span className="stat-value">$2.8T annually</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Import Volume</span>
                    <span className="stat-value">$2.6T annually</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Trade Partners</span>
                    <span className="stat-value">47 civilizations</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Trade Routes</span>
                    <span className="stat-value">156 active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'technology':
        return (
          <div className="technology-tab">
            <h3>🔬 Technology Status</h3>
            <div className="stats-grid">
              <div className="stat-category">
                <h4>🧪 Active Research</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Quantum Computing</span>
                    <span className="stat-value">87% complete</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Fusion Propulsion</span>
                    <span className="stat-value">62% complete</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Neural Interfaces</span>
                    <span className="stat-value">45% complete</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Terraforming Tech</span>
                    <span className="stat-value">23% complete</span>
                  </div>
                </div>
              </div>
              <div className="stat-category">
                <h4>🏭 Research Facilities</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Government Labs</span>
                    <span className="stat-value">47 facilities</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">University Research</span>
                    <span className="stat-value">156 programs</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Corporate R&D</span>
                    <span className="stat-value">289 projects</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Space Stations</span>
                    <span className="stat-value">12 research hubs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'society':
        return (
          <div className="society-tab">
            <h3>👥 Social Metrics</h3>
            <div className="stats-grid">
              <div className="stat-category">
                <h4>🎓 Education & Culture</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Literacy Rate</span>
                    <span className="stat-value">99.7%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Higher Education</span>
                    <span className="stat-value">78.3%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Cultural Centers</span>
                    <span className="stat-value">2,847</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Art Installations</span>
                    <span className="stat-value">15,692</span>
                  </div>
                </div>
              </div>
              <div className="stat-category">
                <h4>🏥 Health & Welfare</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Life Expectancy</span>
                    <span className="stat-value">127 years</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Healthcare Access</span>
                    <span className="stat-value">100%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Mental Health Index</span>
                    <span className="stat-value">8.4/10</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Social Mobility</span>
                    <span className="stat-value">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'galaxy':
        return (
          <div className="galaxy-tab">
            <h3>🌌 Galactic Presence</h3>
            <div className="stats-grid">
              <div className="stat-category">
                <h4>🚀 Space Territories</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Star Systems</span>
                    <span className="stat-value">23 controlled</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Habitable Worlds</span>
                    <span className="stat-value">67 planets</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Mining Operations</span>
                    <span className="stat-value">156 sites</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Space Stations</span>
                    <span className="stat-value">89 operational</span>
                  </div>
                </div>
              </div>
              <div className="stat-category">
                <h4>🤝 Diplomatic Relations</h4>
                <div className="stat-items">
                  <div className="stat-item">
                    <span className="stat-label">Allied Civilizations</span>
                    <span className="stat-value">7 active</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Trade Agreements</span>
                    <span className="stat-value">23 treaties</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Non-Aggression Pacts</span>
                    <span className="stat-value">12 signed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Embassy Networks</span>
                    <span className="stat-value">34 locations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      onRefresh={() => setLoading(true)}
    >
      <div className="civilization-overview-screen">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🏛️ Overview
          </button>
          <button 
            className={`tab ${activeTab === 'military' ? 'active' : ''}`}
            onClick={() => setActiveTab('military')}
          >
            ⚔️ Military
          </button>
          <button 
            className={`tab ${activeTab === 'economy' ? 'active' : ''}`}
            onClick={() => setActiveTab('economy')}
          >
            💰 Economy
          </button>
          <button 
            className={`tab ${activeTab === 'technology' ? 'active' : ''}`}
            onClick={() => setActiveTab('technology')}
          >
            🔬 Technology
          </button>
          <button 
            className={`tab ${activeTab === 'society' ? 'active' : ''}`}
            onClick={() => setActiveTab('society')}
          >
            👥 Society
          </button>
          <button 
            className={`tab ${activeTab === 'galaxy' ? 'active' : ''}`}
            onClick={() => setActiveTab('galaxy')}
          >
            🌌 Galaxy
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content-container">
          {renderTabContent()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CivilizationOverviewScreen;
