/**
 * Policy Screen - Government Policy Management
 * 
 * This screen focuses on policy creation, management, and analysis including:
 * - Policy creation and modification
 * - Policy analytics and effectiveness tracking
 * - AI-powered policy recommendations
 * - Active policy modifiers and effects
 * - Policy impact analysis
 * 
 * Theme: Government (blue color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './PolicyScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

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

const PolicyScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'recommendations' | 'modifiers' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'policies', label: 'Policies', icon: '📋' },
    { id: 'recommendations', label: 'AI Recommendations', icon: '🤖' },
    { id: 'modifiers', label: 'Active Modifiers', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

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
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/policies');
      if (response.ok) {
        const apiData = await response.json();
        setPolicyData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch policy data:', err);
      
      // Comprehensive mock data
      const mockPolicies: Policy[] = [
        {
          id: 'pol-001',
          name: 'Universal Basic Income',
          category: 'Social',
          status: 'active',
          description: 'Provides basic income to all citizens to reduce poverty and inequality',
          effects: [
            { type: 'Happiness', value: 15, description: 'Citizens feel more secure' },
            { type: 'Economy', value: -8, description: 'High cost to implement' },
            { type: 'Productivity', value: -5, description: 'Some reduction in work incentive' }
          ],
          cost: 2500000,
          duration: 365,
          approvalImpact: 12,
          economicImpact: -8,
          createdAt: '2387.145.10:30',
          expiresAt: '2388.145.10:30'
        },
        {
          id: 'pol-002',
          name: 'Green Energy Initiative',
          category: 'Environmental',
          status: 'active',
          description: 'Massive investment in renewable energy infrastructure',
          effects: [
            { type: 'Environment', value: 25, description: 'Significant pollution reduction' },
            { type: 'Economy', value: 10, description: 'Job creation in green sector' },
            { type: 'Energy Independence', value: 20, description: 'Reduced reliance on imports' }
          ],
          cost: 5000000,
          duration: 1095,
          approvalImpact: 18,
          economicImpact: 10,
          createdAt: '2387.120.14:15',
          expiresAt: '2390.120.14:15'
        },
        {
          id: 'pol-003',
          name: 'Defense Modernization',
          category: 'Military',
          status: 'pending',
          description: 'Upgrade military equipment and training programs',
          effects: [
            { type: 'Military Strength', value: 30, description: 'Enhanced defense capabilities' },
            { type: 'Economy', value: -12, description: 'High military spending' },
            { type: 'International Relations', value: 5, description: 'Stronger negotiating position' }
          ],
          cost: 8000000,
          duration: 730,
          approvalImpact: 8,
          economicImpact: -12,
          createdAt: '2387.150.09:45'
        },
        {
          id: 'pol-004',
          name: 'Education Reform',
          category: 'Education',
          status: 'active',
          description: 'Comprehensive overhaul of educational system with focus on STEM',
          effects: [
            { type: 'Research', value: 20, description: 'Better educated workforce' },
            { type: 'Happiness', value: 8, description: 'Improved opportunities for citizens' },
            { type: 'Economy', value: 15, description: 'Long-term economic benefits' }
          ],
          cost: 3200000,
          duration: 1460,
          approvalImpact: 15,
          economicImpact: 15,
          createdAt: '2387.100.16:20',
          expiresAt: '2391.100.16:20'
        },
        {
          id: 'pol-005',
          name: 'Healthcare Expansion',
          category: 'Healthcare',
          status: 'active',
          description: 'Universal healthcare coverage for all citizens',
          effects: [
            { type: 'Health', value: 35, description: 'Improved public health outcomes' },
            { type: 'Happiness', value: 20, description: 'Citizens feel more secure' },
            { type: 'Economy', value: -15, description: 'High implementation costs' }
          ],
          cost: 4500000,
          duration: 1095,
          approvalImpact: 22,
          economicImpact: -15,
          createdAt: '2387.080.11:30',
          expiresAt: '2390.080.11:30'
        }
      ];

      const mockAnalytics: PolicyAnalytics = {
        totalPolicies: 5,
        activePolicies: 4,
        totalCost: 17200000,
        averageApproval: 15.0,
        categoryBreakdown: {
          'Social': 1,
          'Environmental': 1,
          'Military': 1,
          'Education': 1,
          'Healthcare': 1
        },
        effectivenessScore: 78.5,
        recommendations: [
          'Consider balancing economic costs with social benefits',
          'Monitor long-term impacts of education reform',
          'Evaluate defense spending efficiency'
        ]
      };

      const mockRecommendations: AIRecommendation[] = [
        {
          id: 'rec-001',
          title: 'Tax Incentives for Innovation',
          description: 'Provide tax breaks for companies investing in research and development',
          category: 'Economic',
          priority: 'high',
          expectedImpact: {
            approval: 8,
            economy: 12,
            research: 18,
            military: 2
          },
          reasoning: 'Current research output is below optimal levels. Tax incentives could stimulate private sector innovation while generating long-term economic benefits.',
          suggestedPolicy: {
            name: 'R&D Tax Credit Program',
            effects: [
              { type: 'Research', value: 18, description: 'Increased private R&D investment' },
              { type: 'Economy', value: 12, description: 'Economic growth from innovation' }
            ],
            cost: 1800000
          }
        },
        {
          id: 'rec-002',
          title: 'Infrastructure Investment',
          description: 'Major investment in transportation and digital infrastructure',
          category: 'Infrastructure',
          priority: 'critical',
          expectedImpact: {
            approval: 15,
            economy: 20,
            research: 5,
            military: 3
          },
          reasoning: 'Aging infrastructure is limiting economic growth. Strategic investment could provide significant long-term benefits and job creation.',
          suggestedPolicy: {
            name: 'National Infrastructure Renewal',
            effects: [
              { type: 'Economy', value: 20, description: 'Job creation and improved efficiency' },
              { type: 'Happiness', value: 10, description: 'Better quality of life' }
            ],
            cost: 6500000
          }
        },
        {
          id: 'rec-003',
          title: 'Climate Adaptation Program',
          description: 'Prepare infrastructure and communities for climate change impacts',
          category: 'Environmental',
          priority: 'medium',
          expectedImpact: {
            approval: 12,
            economy: -5,
            research: 8,
            military: 1
          },
          reasoning: 'Climate risks are increasing. Proactive adaptation measures could prevent larger future costs and improve resilience.',
          suggestedPolicy: {
            name: 'Climate Resilience Initiative',
            effects: [
              { type: 'Environment', value: 15, description: 'Improved climate resilience' },
              { type: 'Health', value: 8, description: 'Reduced climate health impacts' }
            ],
            cost: 2200000
          }
        }
      ];

      const mockActiveModifiers: ActiveModifier[] = [
        {
          id: 'mod-001',
          name: 'UBI Economic Impact',
          source: 'Universal Basic Income',
          type: 'economic',
          value: -8,
          description: 'Ongoing cost of universal basic income program',
          duration: 365,
          remainingTime: 220
        },
        {
          id: 'mod-002',
          name: 'Green Energy Boost',
          source: 'Green Energy Initiative',
          type: 'economic',
          value: 10,
          description: 'Economic benefits from green energy job creation',
          duration: 1095,
          remainingTime: 875
        },
        {
          id: 'mod-003',
          name: 'Education Research Bonus',
          source: 'Education Reform',
          type: 'research',
          value: 20,
          description: 'Improved research capabilities from better education',
          duration: 1460,
          remainingTime: 1315
        },
        {
          id: 'mod-004',
          name: 'Healthcare Happiness',
          source: 'Healthcare Expansion',
          type: 'social',
          value: 20,
          description: 'Increased citizen satisfaction from healthcare access',
          duration: 1095,
          remainingTime: 950
        }
      ];

      setPolicyData({
        policies: mockPolicies,
        analytics: mockAnalytics,
        recommendations: mockRecommendations,
        activeModifiers: mockActiveModifiers
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicyData();
  }, [fetchPolicyData]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'inactive': return '#6b7280';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#fb7185';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getModifierTypeColor = (type: string) => {
    switch (type) {
      case 'economic': return '#10b981';
      case 'social': return '#3b82f6';
      case 'military': return '#ef4444';
      case 'research': return '#8b5cf6';
      case 'diplomatic': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Filter policies
  const filteredPolicies = policyData?.policies.filter(policy => {
    const categoryMatch = selectedCategory === 'all' || policy.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || policy.status === selectedStatus;
    return categoryMatch && statusMatch;
  }) || [];

  // Chart data
  const categoryData = policyData ? Object.entries(policyData.analytics.categoryBreakdown).map(([label, value]) => ({
    label,
    value
  })) : [];

  const statusData = policyData ? [
    { label: 'Active', value: policyData.policies.filter(p => p.status === 'active').length },
    { label: 'Pending', value: policyData.policies.filter(p => p.status === 'pending').length },
    { label: 'Inactive', value: policyData.policies.filter(p => p.status === 'inactive').length },
    { label: 'Expired', value: policyData.policies.filter(p => p.status === 'expired').length }
  ] : [];

  const impactData = policyData ? policyData.policies.map(policy => ({
    label: policy.name.substring(0, 15) + '...',
    value: policy.approvalImpact
  })) : [];

  const renderOverview = () => (
    <>
      {/* Policy Overview Metrics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Policy Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Policies</span>
            <span className="standard-metric-value">
              {policyData?.analytics.totalPolicies || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Active Policies</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {policyData?.analytics.activePolicies || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Total Cost</span>
            <span className="standard-metric-value">
              {(policyData?.analytics.totalCost || 0).toLocaleString()} Credits
            </span>
          </div>
          <div className="standard-metric">
            <span>Average Approval</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {policyData?.analytics.averageApproval || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Effectiveness Score</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {policyData?.analytics.effectivenessScore || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Policy Analytics Charts */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📈 Policy Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Policy Categories
            </h4>
            <PieChart data={categoryData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Status Distribution
            </h4>
            <BarChart data={statusData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Approval Impact
            </h4>
            <LineChart data={impactData} />
          </div>
        </div>
      </div>
    </>
  );

  const renderPolicies = () => (
    <>
      {/* Policy Filters */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🔍 Filter Policies</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Category:</label>
            <div className="standard-action-buttons">
              {['all', 'Social', 'Environmental', 'Military', 'Education', 'Healthcare', 'Economic'].map(category => (
                <button
                  key={category}
                  className={`standard-btn government-theme ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Status:</label>
            <div className="standard-action-buttons">
              {['all', 'active', 'pending', 'inactive', 'expired'].map(status => (
                <button
                  key={status}
                  className={`standard-btn government-theme ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📋 Policy Management</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Approval Impact</th>
                <th>Economic Impact</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map(policy => (
                <tr key={policy.id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{policy.name}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                      {policy.description.substring(0, 50)}...
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      color: 'var(--government-accent)'
                    }}>
                      {policy.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(policy.status),
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {policy.status}
                    </span>
                  </td>
                  <td>{policy.cost.toLocaleString()} Credits</td>
                  <td style={{ color: policy.approvalImpact >= 0 ? '#10b981' : '#ef4444' }}>
                    {policy.approvalImpact >= 0 ? '+' : ''}{policy.approvalImpact}%
                  </td>
                  <td style={{ color: policy.economicImpact >= 0 ? '#10b981' : '#ef4444' }}>
                    {policy.economicImpact >= 0 ? '+' : ''}{policy.economicImpact}%
                  </td>
                  <td>{policy.duration} days</td>
                  <td>
                    <button className="standard-btn government-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderRecommendations = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">🤖 AI Policy Recommendations</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        {policyData?.recommendations.map(rec => (
          <div key={rec.id} className="standard-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h4 style={{ color: 'var(--government-accent)', margin: '0' }}>
                {rec.title}
              </h4>
              <span style={{ 
                color: getPriorityColor(rec.priority),
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.8em'
              }}>
                {rec.priority} Priority
              </span>
            </div>
            <p style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>
              {rec.description}
            </p>
            <div style={{ marginBottom: '15px', fontSize: '0.9em', color: 'var(--text-muted)' }}>
              <strong>Category:</strong> {rec.category}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Expected Impact:</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginTop: '8px' }}>
                <div>Approval: <span style={{ color: rec.expectedImpact.approval >= 0 ? '#10b981' : '#ef4444' }}>
                  {rec.expectedImpact.approval >= 0 ? '+' : ''}{rec.expectedImpact.approval}%
                </span></div>
                <div>Economy: <span style={{ color: rec.expectedImpact.economy >= 0 ? '#10b981' : '#ef4444' }}>
                  {rec.expectedImpact.economy >= 0 ? '+' : ''}{rec.expectedImpact.economy}%
                </span></div>
                <div>Research: <span style={{ color: rec.expectedImpact.research >= 0 ? '#10b981' : '#ef4444' }}>
                  {rec.expectedImpact.research >= 0 ? '+' : ''}{rec.expectedImpact.research}%
                </span></div>
                <div>Military: <span style={{ color: rec.expectedImpact.military >= 0 ? '#10b981' : '#ef4444' }}>
                  {rec.expectedImpact.military >= 0 ? '+' : ''}{rec.expectedImpact.military}%
                </span></div>
              </div>
            </div>
            <div style={{ marginBottom: '15px', fontSize: '0.9em' }}>
              <strong>AI Reasoning:</strong>
              <p style={{ marginTop: '5px', fontStyle: 'italic' }}>{rec.reasoning}</p>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Suggested Policy:</strong> {rec.suggestedPolicy.name}
              <div style={{ fontSize: '0.8em', color: 'var(--text-muted)', marginTop: '5px' }}>
                Cost: {rec.suggestedPolicy.cost.toLocaleString()} Credits
              </div>
            </div>
            <button className="standard-btn government-theme">
              Implement Policy
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModifiers = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">⚡ Active Policy Modifiers</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Modifier Name</th>
              <th>Source Policy</th>
              <th>Type</th>
              <th>Effect Value</th>
              <th>Description</th>
              <th>Remaining Time</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {policyData?.activeModifiers.map(modifier => (
              <tr key={modifier.id}>
                <td style={{ fontWeight: 'bold' }}>{modifier.name}</td>
                <td>{modifier.source}</td>
                <td>
                  <span style={{ 
                    color: getModifierTypeColor(modifier.type),
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {modifier.type}
                  </span>
                </td>
                <td style={{ color: modifier.value >= 0 ? '#10b981' : '#ef4444' }}>
                  {modifier.value >= 0 ? '+' : ''}{modifier.value}
                </td>
                <td style={{ fontSize: '0.8em' }}>{modifier.description}</td>
                <td>{modifier.remainingTime} days</td>
                <td>
                  <div style={{ 
                    width: '100px', 
                    height: '8px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${((modifier.duration - modifier.remainingTime) / modifier.duration) * 100}%`,
                      height: '100%',
                      backgroundColor: 'var(--government-accent)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <>
      {/* Detailed Analytics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📈 Detailed Policy Analytics</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Policy Success Rate</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {((policyData?.analytics.activePolicies || 0) / (policyData?.analytics.totalPolicies || 1) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Average Policy Cost</span>
            <span className="standard-metric-value">
              {((policyData?.analytics.totalCost || 0) / (policyData?.analytics.totalPolicies || 1)).toLocaleString()} Credits
            </span>
          </div>
          <div className="standard-metric">
            <span>Most Popular Category</span>
            <span className="standard-metric-value">
              {policyData ? Object.entries(policyData.analytics.categoryBreakdown).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'N/A'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Active Modifiers</span>
            <span className="standard-metric-value">
              {policyData?.activeModifiers.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">💡 System Recommendations</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {policyData?.analytics.recommendations.map((recommendation, index) => (
            <div key={index} className="standard-card" style={{ padding: '15px' }}>
              <p style={{ margin: '0', color: 'var(--text-primary)' }}>
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchPolicyData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container government-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && policyData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'policies' && renderPolicies()}
              {activeTab === 'recommendations' && renderRecommendations()}
              {activeTab === 'modifiers' && renderModifiers()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading policy data...' : 
               error ? `Error: ${error}` : 
               'No policy data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default PolicyScreen;
