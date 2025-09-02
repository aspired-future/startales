import React, { useState, useCallback, useEffect } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './DefenseScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface DefensePolicy {
  strategic_doctrine: string;
  threat_assessment_level: number;
  defense_spending_ratio: number;
  international_engagement_level: number;
  technology_modernization_priority: number;
}

interface StrategicPlanning {
  defense_strategy_review_cycle: number;
  force_structure_planning: {
    active_force_target: number;
    reserve_force_target: number;
    civilian_support_target: number;
  };
  capability_development_priorities: {
    air_superiority: number;
    naval_defense: number;
    ground_forces: number;
    cyber_warfare: number;
    space_operations: number;
    special_operations: number;
  };
}

interface ThreatAssessment {
  global_threat_level: number;
  regional_threats: Array<{
    region: string;
    threat_level: number;
    primary_concerns: string[];
  }>;
  emerging_threats: Array<{
    type: string;
    probability: number;
    impact: number;
    timeline: string;
  }>;
}

interface DefenseData {
  defensePolicy: DefensePolicy;
  strategicPlanning: StrategicPlanning;
  threatAssessment: ThreatAssessment;
  defenseSecretaryAuthority: {
    name: string;
    authority_level: number;
    active_initiatives: string[];
    recent_decisions: Array<{
      decision: string;
      date: string;
      impact: string;
    }>;
  };
  budgetAllocation: {
    total_defense_budget: number;
    personnel_costs: number;
    operations_maintenance: number;
    procurement: number;
    research_development: number;
    military_construction: number;
  };
  internationalCooperation: {
    active_alliances: string[];
    defense_agreements: number;
    joint_exercises: number;
    technology_sharing_programs: number;
  };
}

const DefenseScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [defenseData, setDefenseData] = useState<DefenseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'policy' | 'planning' | 'threats' | 'budget' | 'cooperation'>('policy');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'policy', label: 'Policy', icon: '📋' },
    { id: 'planning', label: 'Planning', icon: '🗺️' },
    { id: 'threats', label: 'Threats', icon: '⚠️' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'cooperation', label: 'Cooperation', icon: '🤝' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/defense', description: 'Get defense data' }
  ];

  // Utility functions
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getThreatLevelColor = (level: number) => {
    if (level >= 0.8) return '#ef4444';
    if (level >= 0.6) return '#f59e0b';
    if (level >= 0.4) return '#fbbf24';
    return '#10b981';
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 0.8) return '#ef4444';
    if (priority >= 0.6) return '#f59e0b';
    if (priority >= 0.4) return '#fbbf24';
    return '#10b981';
  };

  const fetchDefenseData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/defense');
      if (response.ok) {
        const data = await response.json();
        setDefenseData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch defense data:', err);
      // Use comprehensive mock data
      setDefenseData({
        defensePolicy: {
          strategic_doctrine: 'Defensive Deterrence',
          threat_assessment_level: 0.4,
          defense_spending_ratio: 0.025,
          international_engagement_level: 0.6,
          technology_modernization_priority: 0.7
        },
        strategicPlanning: {
          defense_strategy_review_cycle: 4,
          force_structure_planning: {
            active_force_target: 50000,
            reserve_force_target: 25000,
            civilian_support_target: 15000
          },
          capability_development_priorities: {
            air_superiority: 0.8,
            naval_defense: 0.7,
            ground_forces: 0.75,
            cyber_warfare: 0.9,
            space_operations: 0.6,
            special_operations: 0.8
          }
        },
        threatAssessment: {
          global_threat_level: 0.4,
          regional_threats: [
            {
              region: 'Outer Rim',
              threat_level: 0.6,
              primary_concerns: ['Piracy', 'Resource Disputes', 'Territorial Claims']
            },
            {
              region: 'Core Worlds',
              threat_level: 0.2,
              primary_concerns: ['Cyber Attacks', 'Economic Espionage']
            }
          ],
          emerging_threats: [
            {
              type: 'AI Warfare',
              probability: 0.7,
              impact: 0.9,
              timeline: '5-10 years'
            }
          ]
        },
        defenseSecretaryAuthority: {
          name: 'Admiral Sarah Chen',
          authority_level: 0.85,
          active_initiatives: [
            'Force Modernization Program',
            'Cyber Defense Enhancement'
          ],
          recent_decisions: [
            {
              decision: 'Increase Cyber Warfare Budget',
              date: '2024-02-14',
              impact: 'Enhanced cyber defense capabilities'
            }
          ]
        },
        budgetAllocation: {
          total_defense_budget: 85000000000,
          personnel_costs: 45000000000,
          operations_maintenance: 25000000000,
          procurement: 12000000000,
          research_development: 2500000000,
          military_construction: 500000000
        },
        internationalCooperation: {
          active_alliances: ['Vega Federation', 'Alpha Centauri Pact'],
          defense_agreements: 15,
          joint_exercises: 8,
          technology_sharing_programs: 12
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDefenseData();
  }, [fetchDefenseData]);

  // Render functions for each tab
  const renderPolicy = () => (
    <>
      {/* Defense Policy Overview - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📋 Defense Policy Framework</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Strategic Doctrine</span>
            <span className="standard-metric-value">{defenseData?.defensePolicy.strategic_doctrine}</span>
          </div>
          <div className="standard-metric">
            <span>Threat Assessment</span>
            <span className="standard-metric-value">{formatPercentage(defenseData?.defensePolicy.threat_assessment_level || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Defense Spending</span>
            <span className="standard-metric-value">{formatPercentage(defenseData?.defensePolicy.defense_spending_ratio || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>International Engagement</span>
            <span className="standard-metric-value">{formatPercentage(defenseData?.defensePolicy.international_engagement_level || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Technology Priority</span>
            <span className="standard-metric-value">{formatPercentage(defenseData?.defensePolicy.technology_modernization_priority || 0)}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Policy Analysis')}>Policy Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Update Policy')}>Update Policy</button>
        </div>
      </div>

      {/* Defense Secretary Authority - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>👤 Defense Secretary Authority</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Secretary</th>
                <th>Authority Level</th>
                <th>Active Initiatives</th>
                <th>Recent Decisions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{defenseData?.defenseSecretaryAuthority.name}</strong></td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: getPriorityColor(defenseData?.defenseSecretaryAuthority.authority_level || 0), 
                    color: 'white' 
                  }}>
                    {formatPercentage(defenseData?.defenseSecretaryAuthority.authority_level || 0)}
                  </span>
                </td>
                <td>{defenseData?.defenseSecretaryAuthority.active_initiatives?.length || 0} initiatives</td>
                <td>{defenseData?.defenseSecretaryAuthority.recent_decisions?.length || 0} decisions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderPlanning = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🗺️ Strategic Planning</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Planning Analysis')}>Planning Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Strategy Review')}>Strategy Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Priority Level</th>
                <th>Development Status</th>
                <th>Target Force</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Air Superiority</strong></td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: getPriorityColor(defenseData?.strategicPlanning.capability_development_priorities.air_superiority || 0), 
                    color: 'white' 
                  }}>
                    {formatPercentage(defenseData?.strategicPlanning.capability_development_priorities.air_superiority || 0)}
                  </span>
                </td>
                <td>High Priority</td>
                <td>{formatNumber(defenseData?.strategicPlanning.force_structure_planning.active_force_target || 0)}</td>
                <td>
                  <button className="standard-btn security-theme">Manage</button>
                </td>
              </tr>
              <tr>
                <td><strong>Cyber Warfare</strong></td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: getPriorityColor(defenseData?.strategicPlanning.capability_development_priorities.cyber_warfare || 0), 
                    color: 'white' 
                  }}>
                    {formatPercentage(defenseData?.strategicPlanning.capability_development_priorities.cyber_warfare || 0)}
                  </span>
                </td>
                <td>Critical Priority</td>
                <td>{formatNumber(defenseData?.strategicPlanning.force_structure_planning.civilian_support_target || 0)}</td>
                <td>
                  <button className="standard-btn security-theme">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderThreats = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>⚠️ Threat Assessment</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Threat Analysis')}>Threat Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Risk Assessment')}>Risk Assessment</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Region/Threat</th>
                <th>Level</th>
                <th>Probability</th>
                <th>Impact</th>
                <th>Timeline</th>
                <th>Primary Concerns</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {defenseData?.threatAssessment.regional_threats?.map((threat, index) => (
                <tr key={`regional-${index}`}>
                  <td><strong>{threat.region}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getThreatLevelColor(threat.threat_level), 
                      color: 'white' 
                    }}>
                      {formatPercentage(threat.threat_level)}
                    </span>
                  </td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>Ongoing</td>
                  <td>{threat.primary_concerns.slice(0, 2).join(', ')}</td>
                  <td>
                    <button className="standard-btn security-theme">Monitor</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>💰 Budget Allocation</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Budget Analysis')}>Budget Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Allocation Review')}>Allocation Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Personnel Costs</strong></td>
                <td>{formatCurrency(defenseData?.budgetAllocation.personnel_costs || 0)}</td>
                <td>{formatPercentage((defenseData?.budgetAllocation.personnel_costs || 0) / (defenseData?.budgetAllocation.total_defense_budget || 1))}</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: '#10b981', 
                    color: 'white' 
                  }}>
                    Approved
                  </span>
                </td>
                <td>
                  <button className="standard-btn security-theme">Review</button>
                </td>
              </tr>
              <tr>
                <td><strong>Operations & Maintenance</strong></td>
                <td>{formatCurrency(defenseData?.budgetAllocation.operations_maintenance || 0)}</td>
                <td>{formatPercentage((defenseData?.budgetAllocation.operations_maintenance || 0) / (defenseData?.budgetAllocation.total_defense_budget || 1))}</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: '#10b981', 
                    color: 'white' 
                  }}>
                    Approved
                  </span>
                </td>
                <td>
                  <button className="standard-btn security-theme">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCooperation = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🤝 International Cooperation</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Cooperation Analysis')}>Cooperation Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Alliance Review')}>Alliance Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Alliance</th>
                <th>Type</th>
                <th>Status</th>
                <th>Agreements</th>
                <th>Joint Exercises</th>
                <th>Technology Sharing</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {defenseData?.internationalCooperation.active_alliances?.map((alliance, index) => (
                <tr key={index}>
                  <td><strong>{alliance}</strong></td>
                  <td>Defense Pact</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: '#10b981', 
                      color: 'white' 
                    }}>
                      Active
                    </span>
                  </td>
                  <td>{defenseData?.internationalCooperation.defense_agreements || 0}</td>
                  <td>{defenseData?.internationalCooperation.joint_exercises || 0}</td>
                  <td>{defenseData?.internationalCooperation.technology_sharing_programs || 0}</td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchDefenseData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container security-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && defenseData ? (
            <>
              {activeTab === 'policy' && renderPolicy()}
              {activeTab === 'planning' && renderPlanning()}
              {activeTab === 'threats' && renderThreats()}
              {activeTab === 'budget' && renderBudget()}
              {activeTab === 'cooperation' && renderCooperation()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading defense data...' : 'No defense data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default DefenseScreen;
