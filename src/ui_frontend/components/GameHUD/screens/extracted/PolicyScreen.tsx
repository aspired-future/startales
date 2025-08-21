import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './PolicyScreen.css';

interface Policy {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  description: string;
  effects: PolicyEffect[];
  cost: number;
  duration: number;
  approvalImpact: number;
  economicImpact: number;
  createdAt: string;
  expiresAt?: string;
}

interface PolicyEffect {
  type: string;
  value: number;
  description: string;
}

interface PolicyAnalytics {
  totalPolicies: number;
  activePolicies: number;
  totalCost: number;
  averageApproval: number;
  categoryBreakdown: { [key: string]: number };
  effectivenessScore: number;
  recommendations: string[];
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedImpact: {
    approval: number;
    economy: number;
    research: number;
    military: number;
  };
  reasoning: string;
  suggestedPolicy: {
    name: string;
    effects: PolicyEffect[];
    cost: number;
  };
}

interface ActiveModifier {
  id: string;
  name: string;
  source: string;
  type: 'economic' | 'social' | 'military' | 'research' | 'diplomatic';
  value: number;
  description: string;
  duration: number;
  remainingTime: number;
}

interface PolicyData {
  policies: Policy[];
  analytics: PolicyAnalytics;
  recommendations: AIRecommendation[];
  activeModifiers: ActiveModifier[];
}

const PolicyScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [activeTab, setActiveTab] = useState<'policies' | 'analytics' | 'recommendations' | 'modifiers'>('policies');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/policies', description: 'Get all policies with optional filters' },
    { method: 'GET', path: '/api/policies/analytics', description: 'Get policy analytics and metrics' },
    { method: 'POST', path: '/api/policies/recommendations', description: 'Get AI-generated policy recommendations' },
    { method: 'GET', path: '/api/policies/active', description: 'Get active policy modifiers' },
    { method: 'POST', path: '/api/policies', description: 'Create a new policy' },
    { method: 'PUT', path: '/api/policies/:id', description: 'Update an existing policy' },
    { method: 'DELETE', path: '/api/policies/:id', description: 'Delete a policy' }
  ];

  const fetchPolicyData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [policiesRes, analyticsRes, recommendationsRes, modifiersRes] = await Promise.all([
        fetch('/api/policies'),
        fetch('/api/policies/analytics'),
        fetch('/api/policies/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameState: {
              economicOutput: 750000,
              approvalRating: 65,
              researchOutput: 8500,
              militaryStrength: 1200
            }
          })
        }),
        fetch('/api/policies/active')
      ]);

      const [policies, analytics, recommendations, modifiers] = await Promise.all([
        policiesRes.json(),
        analyticsRes.json(),
        recommendationsRes.json(),
        modifiersRes.json()
      ]);

      setPolicyData({
        policies: policies.policies || generateMockPolicies(),
        analytics: analytics.analytics || generateMockAnalytics(),
        recommendations: recommendations.recommendations || generateMockRecommendations(),
        activeModifiers: modifiers.modifiers || generateMockModifiers()
      });
    } catch (err) {
      console.error('Failed to fetch policy data:', err);
      // Use mock data as fallback - don't set error since we have fallback data
      setPolicyData({
        policies: generateMockPolicies(),
        analytics: generateMockAnalytics(),
        recommendations: generateMockRecommendations(),
        activeModifiers: generateMockModifiers()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicyData();
  }, [fetchPolicyData]);

  const generateMockPolicies = (): Policy[] => [
    {
      id: 'pol-1',
      name: 'Universal Basic Income',
      category: 'Economic',
      status: 'active',
      description: 'Provide basic income to all citizens to reduce poverty and stimulate economic growth',
      effects: [
        { type: 'approval', value: 15, description: '+15% Approval Rating' },
        { type: 'economy', value: -10, description: '-10% Government Revenue' },
        { type: 'social', value: 20, description: '+20% Social Stability' }
      ],
      cost: 50000,
      duration: 365,
      approvalImpact: 15,
      economicImpact: -10,
      createdAt: '2024-01-15',
      expiresAt: '2025-01-15'
    },
    {
      id: 'pol-2',
      name: 'Research Tax Incentives',
      category: 'Science',
      status: 'active',
      description: 'Tax breaks for corporations investing in research and development',
      effects: [
        { type: 'research', value: 25, description: '+25% Research Output' },
        { type: 'economy', value: -5, description: '-5% Tax Revenue' },
        { type: 'approval', value: 5, description: '+5% Corporate Approval' }
      ],
      cost: 25000,
      duration: 180,
      approvalImpact: 5,
      economicImpact: -5,
      createdAt: '2024-02-01',
      expiresAt: '2024-08-01'
    },
    {
      id: 'pol-3',
      name: 'Military Modernization',
      category: 'Defense',
      status: 'pending',
      description: 'Upgrade military equipment and training programs',
      effects: [
        { type: 'military', value: 30, description: '+30% Military Effectiveness' },
        { type: 'economy', value: -15, description: '-15% Budget Allocation' },
        { type: 'approval', value: -5, description: '-5% Peace Activist Approval' }
      ],
      cost: 75000,
      duration: 270,
      approvalImpact: -5,
      economicImpact: -15,
      createdAt: '2024-02-10'
    },
    {
      id: 'pol-4',
      name: 'Green Energy Initiative',
      category: 'Environment',
      status: 'inactive',
      description: 'Transition to renewable energy sources and reduce carbon emissions',
      effects: [
        { type: 'environment', value: 40, description: '+40% Environmental Score' },
        { type: 'economy', value: 10, description: '+10% Long-term Growth' },
        { type: 'approval', value: 12, description: '+12% Environmental Approval' }
      ],
      cost: 60000,
      duration: 365,
      approvalImpact: 12,
      economicImpact: 10,
      createdAt: '2024-01-20'
    }
  ];

  const generateMockAnalytics = (): PolicyAnalytics => ({
    totalPolicies: 12,
    activePolicies: 7,
    totalCost: 285000,
    averageApproval: 68.5,
    categoryBreakdown: {
      'Economic': 4,
      'Science': 3,
      'Defense': 2,
      'Environment': 2,
      'Social': 1
    },
    effectivenessScore: 78.2,
    recommendations: [
      'Consider reducing military spending to improve approval ratings',
      'Environmental policies show high ROI - expand green initiatives',
      'Social programs are underfunded compared to other sectors'
    ]
  });

  const generateMockRecommendations = (): AIRecommendation[] => [
    {
      id: 'rec-1',
      title: 'Education Investment Program',
      description: 'Increase funding for educational institutions and research universities',
      category: 'Education',
      priority: 'high',
      expectedImpact: {
        approval: 18,
        economy: 15,
        research: 35,
        military: 0
      },
      reasoning: 'Current research output is below optimal levels. Education investment will boost long-term economic growth and citizen satisfaction.',
      suggestedPolicy: {
        name: 'Advanced Education Initiative',
        effects: [
          { type: 'research', value: 35, description: '+35% Research Output' },
          { type: 'approval', value: 18, description: '+18% Approval Rating' },
          { type: 'economy', value: 15, description: '+15% Long-term Growth' }
        ],
        cost: 45000
      }
    },
    {
      id: 'rec-2',
      title: 'Healthcare Modernization',
      description: 'Upgrade medical facilities and implement advanced healthcare technologies',
      category: 'Healthcare',
      priority: 'critical',
      expectedImpact: {
        approval: 25,
        economy: 8,
        research: 10,
        military: 0
      },
      reasoning: 'Healthcare satisfaction is critically low. Immediate investment required to prevent social unrest.',
      suggestedPolicy: {
        name: 'Universal Healthcare Plus',
        effects: [
          { type: 'approval', value: 25, description: '+25% Approval Rating' },
          { type: 'social', value: 30, description: '+30% Social Stability' },
          { type: 'economy', value: 8, description: '+8% Productivity' }
        ],
        cost: 80000
      }
    },
    {
      id: 'rec-3',
      title: 'Trade Expansion Program',
      description: 'Establish new trade routes and reduce tariffs with allied civilizations',
      category: 'Economic',
      priority: 'medium',
      expectedImpact: {
        approval: 8,
        economy: 22,
        research: 5,
        military: -2
      },
      reasoning: 'Economic growth has stagnated. Trade expansion will boost revenue and create jobs.',
      suggestedPolicy: {
        name: 'Galactic Trade Agreement',
        effects: [
          { type: 'economy', value: 22, description: '+22% Trade Revenue' },
          { type: 'approval', value: 8, description: '+8% Business Approval' },
          { type: 'diplomatic', value: 15, description: '+15% Foreign Relations' }
        ],
        cost: 35000
      }
    }
  ];

  const generateMockModifiers = (): ActiveModifier[] => [
    {
      id: 'mod-1',
      name: 'Economic Stimulus',
      source: 'Universal Basic Income',
      type: 'economic',
      value: 12,
      description: 'Increased consumer spending from UBI program',
      duration: 365,
      remainingTime: 287
    },
    {
      id: 'mod-2',
      name: 'Research Boost',
      source: 'Research Tax Incentives',
      type: 'research',
      value: 25,
      description: 'Enhanced R&D output from corporate tax breaks',
      duration: 180,
      remainingTime: 95
    },
    {
      id: 'mod-3',
      name: 'Social Stability',
      source: 'Universal Basic Income',
      type: 'social',
      value: 18,
      description: 'Reduced crime and social unrest',
      duration: 365,
      remainingTime: 287
    },
    {
      id: 'mod-4',
      name: 'Environmental Progress',
      source: 'Green Energy Initiative',
      type: 'economic',
      value: 8,
      description: 'Long-term economic benefits from clean energy',
      duration: 365,
      remainingTime: 312
    }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'inactive': return '#9e9e9e';
      case 'expired': return '#f44336';
      default: return '#4ecdc4';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#4ecdc4';
      case 'low': return '#9e9e9e';
      default: return '#4ecdc4';
    }
  };

  const getModifierTypeIcon = (type: string): string => {
    switch (type) {
      case 'economic': return '💰';
      case 'social': return '👥';
      case 'military': return '⚔️';
      case 'research': return '🔬';
      case 'diplomatic': return '🤝';
      default: return '⚙️';
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const filteredPolicies = policyData?.policies.filter(policy => {
    const categoryMatch = selectedCategory === 'all' || policy.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || policy.status === selectedStatus;
    return categoryMatch && statusMatch;
  }) || [];

  const renderPolicies = () => (
    <div className="policies-view">
      <div className="policies-header">
        <h3>📋 Policy Management</h3>
        <div className="policy-filters">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Economic">Economic</option>
            <option value="Science">Science</option>
            <option value="Defense">Defense</option>
            <option value="Environment">Environment</option>
            <option value="Social">Social</option>
          </select>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
          <button 
            className="create-policy-btn"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Create Policy
          </button>
        </div>
      </div>

      <div className="policies-grid">
        {filteredPolicies.map((policy) => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <div className="policy-name">{policy.name}</div>
              <div className="policy-status" style={{ color: getStatusColor(policy.status) }}>
                {policy.status.toUpperCase()}
              </div>
            </div>
            <div className="policy-category">{policy.category}</div>
            <div className="policy-description">{policy.description}</div>
            
            <div className="policy-effects">
              {policy.effects.map((effect, i) => (
                <div key={i} className="effect-item">
                  <span className="effect-description">{effect.description}</span>
                </div>
              ))}
            </div>

            <div className="policy-metrics">
              <div className="policy-cost">Cost: {formatCurrency(policy.cost)}</div>
              <div className="policy-duration">Duration: {policy.duration} days</div>
              {policy.expiresAt && (
                <div className="policy-expires">Expires: {policy.expiresAt}</div>
              )}
            </div>

            <div className="policy-impact">
              <div className={`impact-item ${policy.approvalImpact >= 0 ? 'positive' : 'negative'}`}>
                Approval: {policy.approvalImpact >= 0 ? '+' : ''}{policy.approvalImpact}%
              </div>
              <div className={`impact-item ${policy.economicImpact >= 0 ? 'positive' : 'negative'}`}>
                Economy: {policy.economicImpact >= 0 ? '+' : ''}{policy.economicImpact}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-view">
      <h3>📊 Policy Analytics</h3>
      
      {policyData?.analytics && (
        <>
          <div className="analytics-overview">
            <div className="metric-card">
              <div className="metric-value">{policyData.analytics.totalPolicies}</div>
              <div className="metric-label">Total Policies</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{policyData.analytics.activePolicies}</div>
              <div className="metric-label">Active Policies</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatCurrency(policyData.analytics.totalCost)}</div>
              <div className="metric-label">Total Cost</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{policyData.analytics.averageApproval.toFixed(1)}%</div>
              <div className="metric-label">Avg Approval</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{policyData.analytics.effectivenessScore.toFixed(1)}</div>
              <div className="metric-label">Effectiveness</div>
            </div>
          </div>

          <div className="category-breakdown">
            <h4>Policy Distribution by Category</h4>
            <div className="category-chart">
              {Object.entries(policyData.analytics.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="category-item">
                  <div className="category-name">{category}</div>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{ 
                        width: `${(count / policyData.analytics.totalPolicies) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="category-count">{count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-recommendations">
            <h4>System Recommendations</h4>
            <div className="recommendations-list">
              {policyData.analytics.recommendations.map((rec, i) => (
                <div key={i} className="recommendation-item">
                  💡 {rec}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="recommendations-view">
      <h3>🤖 AI Policy Recommendations</h3>
      
      <div className="recommendations-grid">
        {policyData?.recommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <div className="rec-header">
              <div className="rec-title">{rec.title}</div>
              <div className="rec-priority" style={{ color: getPriorityColor(rec.priority) }}>
                {rec.priority.toUpperCase()}
              </div>
            </div>
            
            <div className="rec-category">{rec.category}</div>
            <div className="rec-description">{rec.description}</div>
            
            <div className="rec-impact">
              <h5>Expected Impact:</h5>
              <div className="impact-grid">
                <div className="impact-metric">
                  <span>Approval:</span>
                  <span className={rec.expectedImpact.approval >= 0 ? 'positive' : 'negative'}>
                    {rec.expectedImpact.approval >= 0 ? '+' : ''}{rec.expectedImpact.approval}%
                  </span>
                </div>
                <div className="impact-metric">
                  <span>Economy:</span>
                  <span className={rec.expectedImpact.economy >= 0 ? 'positive' : 'negative'}>
                    {rec.expectedImpact.economy >= 0 ? '+' : ''}{rec.expectedImpact.economy}%
                  </span>
                </div>
                <div className="impact-metric">
                  <span>Research:</span>
                  <span className={rec.expectedImpact.research >= 0 ? 'positive' : 'negative'}>
                    {rec.expectedImpact.research >= 0 ? '+' : ''}{rec.expectedImpact.research}%
                  </span>
                </div>
                <div className="impact-metric">
                  <span>Military:</span>
                  <span className={rec.expectedImpact.military >= 0 ? 'positive' : 'negative'}>
                    {rec.expectedImpact.military >= 0 ? '+' : ''}{rec.expectedImpact.military}%
                  </span>
                </div>
              </div>
            </div>

            <div className="rec-reasoning">
              <h5>AI Reasoning:</h5>
              <p>{rec.reasoning}</p>
            </div>

            <div className="suggested-policy">
              <h5>Suggested Policy: {rec.suggestedPolicy.name}</h5>
              <div className="policy-cost">Cost: {formatCurrency(rec.suggestedPolicy.cost)}</div>
              <div className="policy-effects">
                {rec.suggestedPolicy.effects.map((effect, i) => (
                  <div key={i} className="effect-tag">{effect.description}</div>
                ))}
              </div>
            </div>

            <button className="implement-btn">Implement Policy</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModifiers = () => (
    <div className="modifiers-view">
      <h3>⚙️ Active Policy Modifiers</h3>
      
      <div className="modifiers-grid">
        {policyData?.activeModifiers.map((modifier) => (
          <div key={modifier.id} className="modifier-card">
            <div className="modifier-header">
              <div className="modifier-icon">{getModifierTypeIcon(modifier.type)}</div>
              <div className="modifier-name">{modifier.name}</div>
              <div className="modifier-value">
                {modifier.value >= 0 ? '+' : ''}{modifier.value}%
              </div>
            </div>
            
            <div className="modifier-source">Source: {modifier.source}</div>
            <div className="modifier-description">{modifier.description}</div>
            
            <div className="modifier-duration">
              <div className="duration-bar">
                <div 
                  className="duration-fill" 
                  style={{ 
                    width: `${(modifier.remainingTime / modifier.duration) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="duration-text">
                {modifier.remainingTime} / {modifier.duration} days remaining
              </div>
            </div>
          </div>
        ))}
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
      onRefresh={fetchPolicyData}
    >
      <div className="policy-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            📋 Policies
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            🤖 AI Recommendations
          </button>
          <button 
            className={`tab ${activeTab === 'modifiers' ? 'active' : ''}`}
            onClick={() => setActiveTab('modifiers')}
          >
            ⚙️ Active Modifiers
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading policy data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && (
            <>
              {activeTab === 'policies' && renderPolicies()}
              {activeTab === 'analytics' && renderAnalytics()}
              {activeTab === 'recommendations' && renderRecommendations()}
              {activeTab === 'modifiers' && renderModifiers()}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default PolicyScreen;
