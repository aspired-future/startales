/**
 * Defense Screen - Defense Policy, Strategic Planning, and National Security Coordination
 * 
 * This screen focuses on high-level defense policy, strategic planning, and coordination
 * between civilian leadership and military services. It's distinct from:
 * - Military Screen: Operational military units, fleets, bases
 * - Joint Chiefs Screen: Military command hierarchy and service leadership
 */

import React, { useState, useCallback, useEffect } from 'react';
import { BaseScreen } from '../BaseScreen';
import { ScreenProps } from '../ScreenFactory';
import { APIEndpoint } from '../BaseScreen';
import './DefenseScreen.css';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'policy' | 'planning' | 'threats' | 'budget' | 'cooperation'>('policy');

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/defense/dashboard', description: 'Get defense dashboard data' },
    { method: 'GET', path: '/api/defense/policy', description: 'Get defense policy framework' },
    { method: 'GET', path: '/api/defense/strategic-planning', description: 'Get strategic planning data' },
    { method: 'GET', path: '/api/defense/threat-assessment', description: 'Get threat assessment reports' },
    { method: 'PUT', path: '/api/defense/policy', description: 'Update defense policy' },
    { method: 'POST', path: '/api/defense/strategic-review', description: 'Initiate strategic review' }
  ];

  const fetchDefenseData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for now - replace with actual API calls
      const mockData: DefenseData = {
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
            },
            {
              region: 'Border Systems',
              threat_level: 0.5,
              primary_concerns: ['Smuggling', 'Illegal Immigration', 'Arms Trafficking']
            }
          ],
          emerging_threats: [
            {
              type: 'AI Warfare',
              probability: 0.7,
              impact: 0.9,
              timeline: '5-10 years'
            },
            {
              type: 'Space-based Weapons',
              probability: 0.5,
              impact: 0.8,
              timeline: '10-15 years'
            },
            {
              type: 'Quantum Computing Attacks',
              probability: 0.6,
              impact: 0.7,
              timeline: '3-7 years'
            }
          ]
        },
        defenseSecretaryAuthority: {
          name: 'Admiral Sarah Chen',
          authority_level: 0.85,
          active_initiatives: [
            'Force Modernization Program',
            'Cyber Defense Enhancement',
            'Alliance Strengthening Initiative'
          ],
          recent_decisions: [
            {
              decision: 'Approved new cyber warfare doctrine',
              date: '2024-08-20',
              impact: 'Enhanced digital defense capabilities'
            },
            {
              decision: 'Authorized joint training exercises',
              date: '2024-08-18',
              impact: 'Improved inter-service cooperation'
            }
          ]
        },
        budgetAllocation: {
          total_defense_budget: 45000000000,
          personnel_costs: 18000000000,
          operations_maintenance: 13500000000,
          procurement: 9000000000,
          research_development: 3600000000,
          military_construction: 900000000
        },
        internationalCooperation: {
          active_alliances: ['Galactic Defense Alliance', 'Core Worlds Security Pact', 'Outer Rim Cooperation Treaty'],
          defense_agreements: 12,
          joint_exercises: 8,
          technology_sharing_programs: 5
        }
      };

      setDefenseData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load defense data');
    } finally {
      setLoading(false);
    }
  }, [gameContext]);

  useEffect(() => {
    fetchDefenseData();
  }, [fetchDefenseData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const renderPolicyTab = () => (
    <div className="policy-tab">
      <div className="policy-grid">
        <div className="policy-card">
          <h3>🎯 Strategic Doctrine</h3>
          <div className="doctrine-display">
            <div className="current-doctrine">{defenseData?.defensePolicy.strategic_doctrine}</div>
            <p>Current defense posture and strategic approach</p>
          </div>
          <div className="policy-metrics">
            <div className="metric">
              <span>Threat Assessment Level</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(defenseData?.defensePolicy.threat_assessment_level || 0) * 100}%` }}
                />
              </div>
              <span>{formatPercentage(defenseData?.defensePolicy.threat_assessment_level || 0)}</span>
            </div>
            <div className="metric">
              <span>Defense Spending (% of GDP)</span>
              <div className="spending-display">
                {formatPercentage(defenseData?.defensePolicy.defense_spending_ratio || 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="policy-card">
          <h3>🌐 International Engagement</h3>
          <div className="engagement-metrics">
            <div className="metric">
              <span>Engagement Level</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(defenseData?.defensePolicy.international_engagement_level || 0) * 100}%` }}
                />
              </div>
              <span>{formatPercentage(defenseData?.defensePolicy.international_engagement_level || 0)}</span>
            </div>
            <div className="metric">
              <span>Technology Modernization Priority</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(defenseData?.defensePolicy.technology_modernization_priority || 0) * 100}%` }}
                />
              </div>
              <span>{formatPercentage(defenseData?.defensePolicy.technology_modernization_priority || 0)}</span>
            </div>
          </div>
        </div>

        <div className="policy-card">
          <h3>👤 Defense Secretary Authority</h3>
          <div className="secretary-info">
            <div className="secretary-name">{defenseData?.defenseSecretaryAuthority.name}</div>
            <div className="authority-level">
              Authority Level: {formatPercentage(defenseData?.defenseSecretaryAuthority.authority_level || 0)}
            </div>
            <div className="active-initiatives">
              <h4>Active Initiatives:</h4>
              <ul>
                {defenseData?.defenseSecretaryAuthority.active_initiatives.map((initiative, index) => (
                  <li key={index}>{initiative}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlanningTab = () => (
    <div className="planning-tab">
      <div className="planning-grid">
        <div className="planning-card">
          <h3>📋 Force Structure Planning</h3>
          <div className="force-targets">
            <div className="target-item">
              <span>Active Forces</span>
              <span>{defenseData?.strategicPlanning.force_structure_planning.active_force_target.toLocaleString()}</span>
            </div>
            <div className="target-item">
              <span>Reserve Forces</span>
              <span>{defenseData?.strategicPlanning.force_structure_planning.reserve_force_target.toLocaleString()}</span>
            </div>
            <div className="target-item">
              <span>Civilian Support</span>
              <span>{defenseData?.strategicPlanning.force_structure_planning.civilian_support_target.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="planning-card">
          <h3>🎯 Capability Development Priorities</h3>
          <div className="capabilities-grid">
            {Object.entries(defenseData?.strategicPlanning.capability_development_priorities || {}).map(([capability, priority]) => (
              <div key={capability} className="capability-item">
                <span className="capability-name">
                  {capability.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <div className="priority-bar">
                  <div 
                    className="priority-fill" 
                    style={{ width: `${priority * 100}%` }}
                  />
                </div>
                <span className="priority-value">{formatPercentage(priority)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="planning-card">
          <h3>🔄 Strategic Review Cycle</h3>
          <div className="review-info">
            <div className="cycle-duration">
              <span>Review Cycle:</span>
              <span>{defenseData?.strategicPlanning.defense_strategy_review_cycle} years</span>
            </div>
            <div className="next-review">
              <span>Next Review:</span>
              <span>2027</span>
            </div>
            <button className="btn primary">Initiate Strategic Review</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThreatsTab = () => (
    <div className="threats-tab">
      <div className="threats-grid">
        <div className="threat-card">
          <h3>🌍 Global Threat Level</h3>
          <div className="global-threat">
            <div className="threat-gauge">
              <div 
                className="threat-level" 
                style={{ 
                  width: `${(defenseData?.threatAssessment.global_threat_level || 0) * 100}%`,
                  backgroundColor: defenseData?.threatAssessment.global_threat_level && defenseData.threatAssessment.global_threat_level > 0.7 ? '#ff4444' : 
                                   defenseData?.threatAssessment.global_threat_level && defenseData.threatAssessment.global_threat_level > 0.4 ? '#ffaa00' : '#44ff44'
                }}
              />
            </div>
            <span>{formatPercentage(defenseData?.threatAssessment.global_threat_level || 0)}</span>
          </div>
        </div>

        <div className="threat-card">
          <h3>🗺️ Regional Threats</h3>
          <div className="regional-threats">
            {defenseData?.threatAssessment.regional_threats.map((threat, index) => (
              <div key={index} className="regional-threat">
                <div className="threat-header">
                  <span className="region-name">{threat.region}</span>
                  <span className="threat-level">{formatPercentage(threat.threat_level)}</span>
                </div>
                <div className="threat-concerns">
                  {threat.primary_concerns.map((concern, idx) => (
                    <span key={idx} className="concern-tag">{concern}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="threat-card">
          <h3>🚨 Emerging Threats</h3>
          <div className="emerging-threats">
            {defenseData?.threatAssessment.emerging_threats.map((threat, index) => (
              <div key={index} className="emerging-threat">
                <div className="threat-type">{threat.type}</div>
                <div className="threat-metrics">
                  <div className="metric">
                    <span>Probability:</span>
                    <span>{formatPercentage(threat.probability)}</span>
                  </div>
                  <div className="metric">
                    <span>Impact:</span>
                    <span>{formatPercentage(threat.impact)}</span>
                  </div>
                  <div className="metric">
                    <span>Timeline:</span>
                    <span>{threat.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBudgetTab = () => (
    <div className="budget-tab">
      <div className="budget-grid">
        <div className="budget-card">
          <h3>💰 Total Defense Budget</h3>
          <div className="total-budget">
            {formatCurrency(defenseData?.budgetAllocation.total_defense_budget || 0)}
          </div>
        </div>

        <div className="budget-card">
          <h3>📊 Budget Allocation</h3>
          <div className="allocation-breakdown">
            <div className="allocation-item">
              <span>Personnel Costs</span>
              <span>{formatCurrency(defenseData?.budgetAllocation.personnel_costs || 0)}</span>
              <span>{formatPercentage((defenseData?.budgetAllocation.personnel_costs || 0) / (defenseData?.budgetAllocation.total_defense_budget || 1))}</span>
            </div>
            <div className="allocation-item">
              <span>Operations & Maintenance</span>
              <span>{formatCurrency(defenseData?.budgetAllocation.operations_maintenance || 0)}</span>
              <span>{formatPercentage((defenseData?.budgetAllocation.operations_maintenance || 0) / (defenseData?.budgetAllocation.total_defense_budget || 1))}</span>
            </div>
            <div className="allocation-item">
              <span>Procurement</span>
              <span>{formatCurrency(defenseData?.budgetAllocation.procurement || 0)}</span>
              <span>{formatPercentage((defenseData?.budgetAllocation.procurement || 0) / (defenseData?.budgetAllocation.total_defense_budget || 1))}</span>
            </div>
            <div className="allocation-item">
              <span>Research & Development</span>
              <span>{formatCurrency(defenseData?.budgetAllocation.research_development || 0)}</span>
              <span>{formatPercentage((defenseData?.budgetAllocation.research_development || 0) / (defenseData?.budgetAllocation.total_defense_budget || 1))}</span>
            </div>
            <div className="allocation-item">
              <span>Military Construction</span>
              <span>{formatCurrency(defenseData?.budgetAllocation.military_construction || 0)}</span>
              <span>{formatPercentage((defenseData?.budgetAllocation.military_construction || 0) / (defenseData?.budgetAllocation.total_defense_budget || 1))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCooperationTab = () => (
    <div className="cooperation-tab">
      <div className="cooperation-grid">
        <div className="cooperation-card">
          <h3>🤝 Active Alliances</h3>
          <div className="alliances-list">
            {defenseData?.internationalCooperation.active_alliances.map((alliance, index) => (
              <div key={index} className="alliance-item">
                <span className="alliance-name">{alliance}</span>
                <span className="alliance-status">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cooperation-card">
          <h3>📋 Cooperation Metrics</h3>
          <div className="cooperation-metrics">
            <div className="metric-item">
              <span>Defense Agreements</span>
              <span>{defenseData?.internationalCooperation.defense_agreements}</span>
            </div>
            <div className="metric-item">
              <span>Joint Exercises</span>
              <span>{defenseData?.internationalCooperation.joint_exercises}</span>
            </div>
            <div className="metric-item">
              <span>Technology Sharing Programs</span>
              <span>{defenseData?.internationalCooperation.technology_sharing_programs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        gameContext={gameContext}
        apiEndpoints={apiEndpoints}
        onRefresh={fetchDefenseData}
      >
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading defense data...</p>
        </div>
      </BaseScreen>
    );
  }

  if (error) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        gameContext={gameContext}
        apiEndpoints={apiEndpoints}
        onRefresh={fetchDefenseData}
      >
        <div className="error-state">
          <h3>⚠️ Error Loading Defense Data</h3>
          <p>{error}</p>
          <button onClick={fetchDefenseData}>Retry</button>
        </div>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchDefenseData}
    >
      <div className="defense-screen">
        <div className="screen-header">
          <h1>🏰 Defense Policy & Strategic Planning</h1>
          <p>National Defense Strategy • Policy Coordination • Strategic Planning</p>
        </div>

        {/* Tab Navigation */}
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'policy' ? 'active' : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            📋 Policy
          </button>
          <button 
            className={`tab ${activeTab === 'planning' ? 'active' : ''}`}
            onClick={() => setActiveTab('planning')}
          >
            🎯 Planning
          </button>
          <button 
            className={`tab ${activeTab === 'threats' ? 'active' : ''}`}
            onClick={() => setActiveTab('threats')}
          >
            🚨 Threats
          </button>
          <button 
            className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            💰 Budget
          </button>
          <button 
            className={`tab ${activeTab === 'cooperation' ? 'active' : ''}`}
            onClick={() => setActiveTab('cooperation')}
          >
            🤝 Cooperation
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'policy' && renderPolicyTab()}
          {activeTab === 'planning' && renderPlanningTab()}
          {activeTab === 'threats' && renderThreatsTab()}
          {activeTab === 'budget' && renderBudgetTab()}
          {activeTab === 'cooperation' && renderCooperationTab()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default DefenseScreen;
