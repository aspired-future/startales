/**
 * Government Contracts Screen - Contract Management and Procurement
 * 
 * This screen focuses on government contract operations including:
 * - Contract creation and management
 * - Bidding processes and vendor selection
 * - Contract performance monitoring
 * - Budget allocation and payment tracking
 * - Contract analytics and reporting
 * 
 * Theme: Government (blue color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './GovernmentContractsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface GovernmentContract {
  id: string;
  title: string;
  description: string;
  category: 'defense' | 'infrastructure' | 'research' | 'social' | 'custom';
  totalValue: number;
  budgetAllocated: number;
  fundingSource: string;
  paymentSchedule: 'milestone' | 'monthly' | 'completion' | 'custom';
  startDate: string;
  endDate: string;
  duration: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planning' | 'bidding' | 'awarded' | 'active' | 'completed' | 'cancelled' | 'disputed';
  requirements: any;
  biddingProcess: any;
  awardedTo?: any;
  performance?: any;
  createdBy: string;
  approvedBy?: string;
  progress: number;
  milestones: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'completed' | 'overdue';
    paymentAmount: number;
  }>;
}

interface ContractType {
  id: string;
  name: string;
  description: string;
  category: string;
  typicalDuration: number;
  complexityLevel: number;
  riskLevel: number;
  requiredCapabilities: string[];
  evaluationCriteria: any;
  averageValue: number;
  successRate: number;
}

interface BiddingVendor {
  id: string;
  name: string;
  rating: number;
  experience: number;
  proposedValue: number;
  timeline: number;
  capabilities: string[];
  pastPerformance: number;
  financialStability: number;
  status: 'evaluating' | 'shortlisted' | 'awarded' | 'rejected';
}

interface ContractPerformance {
  onTimeDelivery: number;
  qualityScore: number;
  costEfficiency: number;
  complianceRate: number;
  riskMitigation: number;
  overallScore: number;
  issues: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    resolution: string;
    status: 'open' | 'resolved' | 'escalated';
  }>;
}

interface ContractAnalytics {
  overview: {
    totalContracts: number;
    activeContracts: number;
    totalValue: number;
    averageDuration: number;
    completionRate: number;
    disputeRate: number;
  };
  categoryBreakdown: Array<{
    category: string;
    count: number;
    totalValue: number;
    averageDuration: number;
    successRate: number;
  }>;
  performanceTrends: Array<{
    month: string;
    contractsAwarded: number;
    totalValue: number;
    averagePerformance: number;
    disputeRate: number;
  }>;
}

interface GovernmentContractsData {
  contracts: GovernmentContract[];
  contractTypes: ContractType[];
  vendors: BiddingVendor[];
  analytics: ContractAnalytics;
}

const GovernmentContractsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [contractsData, setContractsData] = useState<GovernmentContractsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'bidding' | 'performance' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<GovernmentContract | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'contracts', label: 'Contracts', icon: '📋' },
    { id: 'bidding', label: 'Bidding', icon: '🏆' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/government-contracts/civilization/campaign_1/player_civ', description: 'Get government contracts' },
    { method: 'GET', path: '/api/government-contracts/types', description: 'Get contract types' },
    { method: 'POST', path: '/api/government-contracts', description: 'Create new contract' }
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#6b7280';
      case 'bidding': return '#3b82f6';
      case 'awarded': return '#10b981';
      case 'active': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'disputed': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'defense': return '#ef4444';
      case 'infrastructure': return '#3b82f6';
      case 'research': return '#8b5cf6';
      case 'social': return '#10b981';
      case 'custom': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const fetchContractsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch contracts
      const contractsResponse = await fetch('http://localhost:4000/api/government-contracts/civilization/campaign_1/player_civ');
      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json();
        if (contractsData.success) {
          setContractsData(contractsData.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

      // Fetch contract types
      const typesResponse = await fetch('http://localhost:4000/api/government-contracts/types');
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        if (typesData.success) {
          // Update contracts data with types
          setContractsData(prev => prev ? { ...prev, contractTypes: typesData.data } : null);
        }
      }

    } catch (err) {
      console.warn('Failed to fetch contracts data:', err);
      // Use comprehensive mock data
      setContractsData({
        contracts: [
          {
            id: 'contract_1',
            title: 'Advanced Defense Shield System',
            description: 'Development and deployment of next-generation planetary defense shields',
            category: 'defense',
            totalValue: 2500000000,
            budgetAllocated: 1800000000,
            fundingSource: 'Defense Budget',
            paymentSchedule: 'milestone',
            startDate: '2390-03-15',
            endDate: '2395-06-30',
            duration: 63,
            priority: 'critical',
            status: 'active',
            requirements: { technical: 'High', security: 'Maximum', timeline: 'Strict' },
            biddingProcess: { type: 'competitive', participants: 8, evaluation: 'ongoing' },
            awardedTo: { name: 'Quantum Defense Corp', rating: 4.8 },
            performance: { onTime: 85, quality: 92, cost: 88 },
            createdBy: 'Admiral Rodriguez',
            approvedBy: 'Defense Committee',
            progress: 67,
            milestones: [
              { id: 'm1', title: 'Design Phase Complete', dueDate: '2391-06-30', status: 'completed', paymentAmount: 500000000 },
              { id: 'm2', title: 'Prototype Testing', dueDate: '2392-12-31', status: 'completed', paymentAmount: 800000000 },
              { id: 'm3', title: 'Production Setup', dueDate: '2393-09-30', status: 'active', paymentAmount: 600000000 },
              { id: 'm4', title: 'Deployment Phase', dueDate: '2395-06-30', status: 'pending', paymentAmount: 600000000 }
            ]
          },
          {
            id: 'contract_2',
            title: 'Interstellar Highway Network',
            description: 'Construction of FTL transportation network connecting major star systems',
            category: 'infrastructure',
            totalValue: 1800000000,
            budgetAllocated: 1200000000,
            fundingSource: 'Infrastructure Fund',
            paymentSchedule: 'monthly',
            startDate: '2391-01-01',
            endDate: '2398-12-31',
            duration: 96,
            priority: 'high',
            status: 'active',
            requirements: { technical: 'Medium', security: 'Standard', timeline: 'Flexible' },
            biddingProcess: { type: 'competitive', participants: 12, evaluation: 'completed' },
            awardedTo: { name: 'Stellar Construction Ltd', rating: 4.6 },
            performance: { onTime: 78, quality: 85, cost: 82 },
            createdBy: 'Commissioner Park',
            approvedBy: 'Infrastructure Committee',
            progress: 45,
            milestones: [
              { id: 'm1', title: 'Route Planning', dueDate: '2391-06-30', status: 'completed', paymentAmount: 200000000 },
              { id: 'm2', title: 'Core Stations', dueDate: '2393-12-31', status: 'active', paymentAmount: 400000000 },
              { id: 'm3', title: 'Network Expansion', dueDate: '2396-06-30', status: 'pending', paymentAmount: 600000000 },
              { id: 'm4', title: 'Final Integration', dueDate: '2398-12-31', status: 'pending', paymentAmount: 600000000 }
            ]
          },
          {
            id: 'contract_3',
            title: 'AI Governance Framework',
            description: 'Development of comprehensive AI governance and oversight systems',
            category: 'research',
            totalValue: 850000000,
            budgetAllocated: 650000000,
            fundingSource: 'Research Budget',
            paymentSchedule: 'milestone',
            startDate: '2392-06-01',
            endDate: '2395-12-31',
            duration: 42,
            priority: 'high',
            status: 'active',
            requirements: { technical: 'Maximum', security: 'High', timeline: 'Moderate' },
            biddingProcess: { type: 'selective', participants: 5, evaluation: 'completed' },
            awardedTo: { name: 'Ethical AI Institute', rating: 4.9 },
            performance: { onTime: 92, quality: 95, cost: 89 },
            createdBy: 'Dr. Petrova',
            approvedBy: 'Science Committee',
            progress: 78,
            milestones: [
              { id: 'm1', title: 'Framework Design', dueDate: '2393-06-30', status: 'completed', paymentAmount: 200000000 },
              { id: 'm2', title: 'Prototype Development', dueDate: '2394-06-30', status: 'active', paymentAmount: 250000000 },
              { id: 'm3', title: 'Testing & Validation', dueDate: '2395-06-30', status: 'pending', paymentAmount: 200000000 },
              { id: 'm4', title: 'Deployment', dueDate: '2395-12-31', status: 'pending', paymentAmount: 200000000 }
            ]
          },
          {
            id: 'contract_4',
            title: 'Universal Healthcare System',
            description: 'Implementation of comprehensive healthcare coverage across all colonies',
            category: 'social',
            totalValue: 1200000000,
            budgetAllocated: 950000000,
            fundingSource: 'Social Services Budget',
            paymentSchedule: 'monthly',
            startDate: '2390-09-01',
            endDate: '2394-03-31',
            duration: 42,
            priority: 'medium',
            status: 'completed',
            requirements: { technical: 'Medium', security: 'High', timeline: 'Moderate' },
            biddingProcess: { type: 'competitive', participants: 15, evaluation: 'completed' },
            awardedTo: { name: 'HealthFirst Consortium', rating: 4.7 },
            performance: { onTime: 88, quality: 91, cost: 85 },
            createdBy: 'Senator Thompson',
            approvedBy: 'Social Services Committee',
            progress: 100,
            milestones: [
              { id: 'm1', title: 'System Design', dueDate: '2391-03-31', status: 'completed', paymentAmount: 300000000 },
              { id: 'm2', title: 'Infrastructure Setup', dueDate: '2392-09-30', status: 'completed', paymentAmount: 400000000 },
              { id: 'm3', title: 'Staff Training', dueDate: '2393-09-30', status: 'completed', paymentAmount: 200000000 },
              { id: 'm4', title: 'Full Deployment', dueDate: '2394-03-31', status: 'completed', paymentAmount: 300000000 }
            ]
          },
          {
            id: 'contract_5',
            title: 'Colonial Expansion Initiative',
            description: 'Establishment of new colony worlds and infrastructure development',
            category: 'infrastructure',
            totalValue: 3200000000,
            budgetAllocated: 2800000000,
            fundingSource: 'Exploration Budget',
            paymentSchedule: 'milestone',
            startDate: '2391-03-01',
            endDate: '2398-12-31',
            duration: 93,
            priority: 'high',
            status: 'active',
            requirements: { technical: 'High', security: 'Maximum', timeline: 'Flexible' },
            biddingProcess: { type: 'selective', participants: 6, evaluation: 'completed' },
            awardedTo: { name: 'Frontier Development Corp', rating: 4.5 },
            performance: { onTime: 72, quality: 88, cost: 79 },
            createdBy: 'Dr. Chen',
            approvedBy: 'Exploration Committee',
            progress: 35,
            milestones: [
              { id: 'm1', title: 'Site Selection', dueDate: '2392-03-31', status: 'completed', paymentAmount: 400000000 },
              { id: 'm2', title: 'Basic Infrastructure', dueDate: '2394-09-30', status: 'active', paymentAmount: 800000000 },
              { id: 'm3', title: 'Colony Establishment', dueDate: '2397-03-31', status: 'pending', paymentAmount: 1200000000 },
              { id: 'm4', title: 'Full Operations', dueDate: '2398-12-31', status: 'pending', paymentAmount: 800000000 }
            ]
          }
        ],
        contractTypes: [
          {
            id: 'type_1',
            name: 'Defense Contracts',
            description: 'Military and security-related contracts',
            category: 'defense',
            typicalDuration: 60,
            complexityLevel: 9,
            riskLevel: 8,
            requiredCapabilities: ['Security clearance', 'Technical expertise', 'Quality assurance'],
            evaluationCriteria: { technical: 40, cost: 30, pastPerformance: 30 },
            averageValue: 2000000000,
            successRate: 85
          },
          {
            id: 'type_2',
            name: 'Infrastructure Contracts',
            description: 'Construction and development projects',
            category: 'infrastructure',
            typicalDuration: 84,
            complexityLevel: 7,
            riskLevel: 6,
            requiredCapabilities: ['Engineering expertise', 'Project management', 'Safety compliance'],
            evaluationCriteria: { technical: 35, cost: 40, pastPerformance: 25 },
            averageValue: 1500000000,
            successRate: 78
          },
          {
            id: 'type_3',
            name: 'Research Contracts',
            description: 'Scientific research and development',
            category: 'research',
            typicalDuration: 48,
            complexityLevel: 10,
            riskLevel: 7,
            requiredCapabilities: ['Research expertise', 'Innovation capability', 'Documentation'],
            evaluationCriteria: { technical: 50, cost: 25, pastPerformance: 25 },
            averageValue: 800000000,
            successRate: 72
          },
          {
            id: 'type_4',
            name: 'Social Service Contracts',
            description: 'Public service and welfare programs',
            category: 'social',
            typicalDuration: 36,
            complexityLevel: 5,
            riskLevel: 4,
            requiredCapabilities: ['Service delivery', 'Compliance', 'Reporting'],
            evaluationCriteria: { technical: 25, cost: 45, pastPerformance: 30 },
            averageValue: 600000000,
            successRate: 88
          }
        ],
        vendors: [
          {
            id: 'vendor_1',
            name: 'Quantum Defense Corp',
            rating: 4.8,
            experience: 25,
            proposedValue: 2450000000,
            timeline: 60,
            capabilities: ['Advanced weaponry', 'Shield technology', 'Military systems'],
            pastPerformance: 92,
            financialStability: 95,
            status: 'awarded'
          },
          {
            id: 'vendor_2',
            name: 'Stellar Construction Ltd',
            rating: 4.6,
            experience: 18,
            proposedValue: 1750000000,
            timeline: 90,
            capabilities: ['Large-scale construction', 'Space infrastructure', 'Project management'],
            pastPerformance: 87,
            financialStability: 88,
            status: 'awarded'
          },
          {
            id: 'vendor_3',
            name: 'Ethical AI Institute',
            rating: 4.9,
            experience: 12,
            proposedValue: 820000000,
            timeline: 42,
            capabilities: ['AI development', 'Ethics research', 'Governance systems'],
            pastPerformance: 94,
            financialStability: 92,
            status: 'awarded'
          }
        ],
        analytics: {
          overview: {
            totalContracts: 47,
            activeContracts: 23,
            totalValue: 8570000000,
            averageDuration: 67,
            completionRate: 78.7,
            disputeRate: 4.3
          },
          categoryBreakdown: [
            { category: 'Defense', count: 12, totalValue: 3200000000, averageDuration: 58, successRate: 85 },
            { category: 'Infrastructure', count: 18, totalValue: 2800000000, averageDuration: 89, successRate: 78 },
            { category: 'Research', count: 8, totalValue: 1200000000, averageDuration: 45, successRate: 72 },
            { category: 'Social', count: 9, totalValue: 1370000000, averageDuration: 38, successRate: 88 }
          ],
          performanceTrends: [
            { month: 'Jan 2393', contractsAwarded: 4, totalValue: 680000000, averagePerformance: 82, disputeRate: 3.2 },
            { month: 'Feb 2393', contractsAwarded: 3, totalValue: 520000000, averagePerformance: 85, disputeRate: 2.8 },
            { month: 'Mar 2393', contractsAwarded: 5, totalValue: 890000000, averagePerformance: 79, disputeRate: 4.1 },
            { month: 'Apr 2393', contractsAwarded: 2, totalValue: 310000000, averagePerformance: 88, disputeRate: 1.9 },
            { month: 'May 2393', contractsAwarded: 4, totalValue: 720000000, averagePerformance: 83, disputeRate: 3.5 },
            { month: 'Jun 2393', contractsAwarded: 3, totalValue: 450000000, averagePerformance: 86, disputeRate: 2.4 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContractsData();
  }, [fetchContractsData]);

  const renderOverview = () => (
    <>
      {/* Contracts Overview - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Contracts Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Contracts</span>
            <span className="standard-metric-value">{contractsData?.analytics.overview.totalContracts}</span>
          </div>
          <div className="standard-metric">
            <span>Active Contracts</span>
            <span className="standard-metric-value">{contractsData?.analytics.overview.activeContracts}</span>
          </div>
          <div className="standard-metric">
            <span>Total Value</span>
            <span className="standard-metric-value">{formatCurrency(contractsData?.analytics.overview.totalValue || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Average Duration</span>
            <span className="standard-metric-value">{contractsData?.analytics.overview.averageDuration} months</span>
          </div>
          <div className="standard-metric">
            <span>Completion Rate</span>
            <span className="standard-metric-value">{contractsData?.analytics.overview.completionRate}%</span>
          </div>
          <div className="standard-metric">
            <span>Dispute Rate</span>
            <span className="standard-metric-value">{contractsData?.analytics.overview.disputeRate}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Create Contract')}>➕ Create Contract</button>
          <button className="standard-btn government-theme" onClick={() => console.log('View All Contracts')}>📋 View All Contracts</button>
        </div>
      </div>

      {/* Category Breakdown - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📈 Category Breakdown</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
                <th>Total Value</th>
                <th>Average Duration</th>
                <th>Success Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractsData?.analytics.categoryBreakdown.map(category => (
                <tr key={category.category}>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(category.category.toLowerCase()),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(category.category.toLowerCase()) + '20'
                    }}>
                      {category.category}
                    </span>
                  </td>
                  <td>{category.count}</td>
                  <td>{formatCurrency(category.totalValue)}</td>
                  <td>{category.averageDuration} months</td>
                  <td>
                    <span style={{ color: category.successRate >= 80 ? '#10b981' : category.successRate >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {category.successRate}%
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderContracts = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📋 Government Contracts</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Create Contract')}>➕ Create Contract</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Filter Contracts')}>🔍 Filter</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Value</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractsData?.contracts.map(contract => (
                <tr key={contract.id}>
                  <td>{contract.title}</td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(contract.category),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(contract.category) + '20'
                    }}>
                      {contract.category}
                    </span>
                  </td>
                  <td>{formatCurrency(contract.totalValue)}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(contract.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(contract.status) + '20'
                    }}>
                      {contract.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '100px', 
                        height: '8px', 
                        backgroundColor: '#374151', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${contract.progress}%`, 
                          height: '100%', 
                          backgroundColor: contract.progress >= 80 ? '#10b981' : contract.progress >= 60 ? '#f59e0b' : '#ef4444',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span>{contract.progress}%</span>
                    </div>
                  </td>
                  <td>{contract.startDate} - {contract.endDate}</td>
                  <td>
                    <button className="standard-btn government-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBidding = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🏆 Bidding & Vendor Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Invite Vendors')}>📧 Invite Vendors</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Evaluate Bids')}>📊 Evaluate Bids</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Rating</th>
                <th>Experience</th>
                <th>Proposed Value</th>
                <th>Timeline</th>
                <th>Past Performance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractsData?.vendors.map(vendor => (
                <tr key={vendor.id}>
                  <td>{vendor.name}</td>
                  <td>
                    <span style={{ color: vendor.rating >= 4.5 ? '#10b981' : vendor.rating >= 4.0 ? '#f59e0b' : '#ef4444' }}>
                      {vendor.rating}/5.0
                    </span>
                  </td>
                  <td>{vendor.experience} years</td>
                  <td>{formatCurrency(vendor.proposedValue)}</td>
                  <td>{vendor.timeline} months</td>
                  <td>
                    <span style={{ color: vendor.pastPerformance >= 90 ? '#10b981' : vendor.pastPerformance >= 80 ? '#f59e0b' : '#ef4444' }}>
                      {vendor.pastPerformance}%
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: vendor.status === 'awarded' ? '#10b981' : 
                             vendor.status === 'shortlisted' ? '#3b82f6' : 
                             vendor.status === 'evaluating' ? '#f59e0b' : '#ef4444',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: (vendor.status === 'awarded' ? '#10b981' : 
                                     vendor.status === 'shortlisted' ? '#3b82f6' : 
                                     vendor.status === 'evaluating' ? '#f59e0b' : '#ef4444') + '20'
                    }}>
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">Evaluate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📈 Contract Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Active Contract Progress</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Contract</th>
                    <th>Progress</th>
                    <th>Next Milestone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contractsData?.contracts.filter(c => c.status === 'active').map(contract => {
                    const nextMilestone = contract.milestones.find(m => m.status === 'pending');
                    return (
                      <tr key={contract.id}>
                        <td>{contract.title}</td>
                        <td>
                          <span style={{ color: contract.progress >= 80 ? '#10b981' : contract.progress >= 60 ? '#f59e0b' : '#ef4444' }}>
                            {contract.progress}%
                          </span>
                        </td>
                        <td>{nextMilestone?.title || 'N/A'}</td>
                        <td>
                          <span style={{ 
                            color: getStatusColor(contract.status),
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            backgroundColor: getStatusColor(contract.status) + '20'
                          }}>
                            {contract.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Milestone Tracking</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {contractsData?.contracts.flatMap(c => c.milestones).slice(0, 10).map(milestone => (
                    <tr key={milestone.id}>
                      <td>{milestone.title}</td>
                      <td>{milestone.dueDate}</td>
                      <td>
                        <span style={{ 
                          color: milestone.status === 'completed' ? '#10b981' : 
                                 milestone.status === 'active' ? '#f59e0b' : '#ef4444',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          backgroundColor: (milestone.status === 'completed' ? '#10b981' : 
                                         milestone.status === 'active' ? '#f59e0b' : '#ef4444') + '20'
                        }}>
                          {milestone.status}
                        </span>
                      </td>
                      <td>{formatCurrency(milestone.paymentAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Contract Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={contractsData?.analytics.performanceTrends.map(trend => ({
                name: trend.month,
                'Contracts Awarded': trend.contractsAwarded,
                'Total Value': trend.totalValue / 1000000,
                'Average Performance': trend.averagePerformance,
                'Dispute Rate': trend.disputeRate
              })) || []}
              title="Contract Performance Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={contractsData?.analytics.categoryBreakdown.map(category => ({
                name: category.category,
                value: category.totalValue
              })) || []}
              title="Contract Value by Category"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Performance Metrics</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Current</th>
                  <th>Target</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>On-Time Delivery</td>
                  <td style={{ color: '#10b981' }}>82%</td>
                  <td>85%</td>
                  <td style={{ color: '#f59e0b' }}>↗️ Improving</td>
                </tr>
                <tr>
                  <td>Cost Efficiency</td>
                  <td style={{ color: '#10b981' }}>87%</td>
                  <td>90%</td>
                  <td style={{ color: '#10b981' }}>↗️ On Track</td>
                </tr>
                <tr>
                  <td>Quality Score</td>
                  <td style={{ color: '#10b981' }}>89%</td>
                  <td>85%</td>
                  <td style={{ color: '#10b981' }}>✅ Exceeding</td>
                </tr>
                <tr>
                  <td>Vendor Satisfaction</td>
                  <td style={{ color: '#f59e0b' }}>78%</td>
                  <td>80%</td>
                  <td style={{ color: '#ef4444' }}>↘️ Declining</td>
                </tr>
              </tbody>
            </table>
          </div>
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
      onRefresh={fetchContractsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container government-theme">
        <div className="standard-dashboard">
          {!loading && !error && contractsData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'contracts' && renderContracts()}
              {activeTab === 'bidding' && renderBidding()}
              {activeTab === 'performance' && renderPerformance()}
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
              {loading ? 'Loading contracts data...' : 'No contracts data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default GovernmentContractsScreen;
