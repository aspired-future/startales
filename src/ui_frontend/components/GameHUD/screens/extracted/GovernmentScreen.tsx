/**
 * Government Screen - Government Performance and Management
 * 
 * This screen focuses on government operations including:
 * - Government performance metrics and approval ratings
 * - Official management and personnel
 * - Government programs and initiatives
 * - Policy development and legislation
 * - Budget allocation and financial oversight
 * 
 * Theme: Government (blue color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './GovernmentScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface GovernmentStats {
  approvalRating: number;
  stabilityIndex: number;
  totalBudget: string;
  activePrograms: number;
  employedOfficials: number;
  pendingLegislation: number;
  efficiency: number;
  transparency: number;
}

interface GovernmentOfficial {
  id: string;
  name: string;
  position: string;
  department: string;
  yearsInOffice: number;
  approvalRating: number;
  status: 'active' | 'on-leave' | 'suspended';
  performance: number;
  salary: number;
  clearance: string;
}

interface GovernmentProgram {
  id: string;
  name: string;
  department: string;
  budget: string;
  status: 'active' | 'pending' | 'completed' | 'suspended';
  progress: number;
  startDate: string;
  expectedCompletion: string;
  impact: string;
  beneficiaries: number;
  successMetrics: string[];
}

interface PolicyInitiative {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'review' | 'approved' | 'implemented';
  supportLevel: number;
  proposedBy: string;
  description: string;
  expectedOutcome: string;
  timeline: string;
}

interface BudgetAllocation {
  totalBudget: number;
  allocated: number;
  remaining: number;
  departments: Array<{
    name: string;
    allocated: number;
    spent: number;
    remaining: number;
    efficiency: number;
  }>;
  trends: Array<{
    month: string;
    spending: number;
    revenue: number;
    deficit: number;
  }>;
}

interface GovernmentData {
  stats: GovernmentStats;
  officials: GovernmentOfficial[];
  programs: GovernmentProgram[];
  policies: PolicyInitiative[];
  budget: BudgetAllocation;
  analytics: {
    performanceTrends: Array<{
      month: string;
      approvalRating: number;
      stabilityIndex: number;
      efficiency: number;
    }>;
    departmentPerformance: Array<{
      department: string;
      efficiency: number;
      budgetUtilization: number;
      programSuccess: number;
    }>;
  };
}

const GovernmentScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [governmentData, setGovernmentData] = useState<GovernmentData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'officials' | 'programs' | 'policies' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'officials', label: 'Officials', icon: '👥' },
    { id: 'programs', label: 'Programs', icon: '📋' },
    { id: 'policies', label: 'Policies', icon: '⚖️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/government/overview', description: 'Get government overview data' },
    { method: 'GET', path: '/api/government/officials', description: 'Get government officials' },
    { method: 'GET', path: '/api/government/programs', description: 'Get government programs' },
    { method: 'GET', path: '/api/government/policies', description: 'Get policy initiatives' }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#3b82f6';
      case 'suspended': return '#ef4444';
      case 'draft': return '#6b7280';
      case 'review': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'implemented': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchGovernmentData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/government/overview');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGovernmentData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch government data:', err);
      // Use comprehensive mock data
      setGovernmentData({
        stats: {
          approvalRating: 67.3,
          stabilityIndex: 78.9,
          totalBudget: '$2.8T',
          activePrograms: 47,
          employedOfficials: 2847,
          pendingLegislation: 23,
          efficiency: 72.4,
          transparency: 65.8
        },
        officials: [
          {
            id: 'off-1',
            name: 'Dr. Sarah Chen',
            position: 'Chief Executive',
            department: 'Executive Office',
            yearsInOffice: 8,
            approvalRating: 74.2,
            status: 'active',
            performance: 89.5,
            salary: 450000,
            clearance: 'TOP SECRET'
          },
          {
            id: 'off-2',
            name: 'Admiral Marcus Rodriguez',
            position: 'Defense Secretary',
            department: 'Defense',
            yearsInOffice: 12,
            approvalRating: 68.7,
            status: 'active',
            performance: 82.3,
            salary: 380000,
            clearance: 'TOP SECRET'
          },
          {
            id: 'off-3',
            name: 'Dr. Elena Petrova',
            position: 'Science Director',
            department: 'Research & Development',
            yearsInOffice: 6,
            approvalRating: 71.9,
            status: 'active',
            performance: 91.2,
            salary: 420000,
            clearance: 'SECRET'
          },
          {
            id: 'off-4',
            name: 'Senator James Thompson',
            position: 'Legislative Leader',
            department: 'Legislature',
            yearsInOffice: 15,
            approvalRating: 62.4,
            status: 'active',
            performance: 76.8,
            salary: 320000,
            clearance: 'CONFIDENTIAL'
          },
          {
            id: 'off-5',
            name: 'Commissioner Lisa Park',
            position: 'Economic Advisor',
            department: 'Treasury',
            yearsInOffice: 9,
            approvalRating: 69.1,
            status: 'active',
            performance: 84.7,
            salary: 410000,
            clearance: 'SECRET'
          }
        ],
        programs: [
          {
            id: 'prog-1',
            name: 'Galactic Infrastructure Initiative',
            department: 'Infrastructure',
            budget: '$450B',
            status: 'active',
            progress: 67,
            startDate: '2390',
            expectedCompletion: '2395',
            impact: 'Major infrastructure development across 12 star systems',
            beneficiaries: 2847000,
            successMetrics: ['System connectivity', 'Trade efficiency', 'Population growth']
          },
          {
            id: 'prog-2',
            name: 'Advanced Research Consortium',
            department: 'Research & Development',
            budget: '$280B',
            status: 'active',
            progress: 89,
            startDate: '2388',
            expectedCompletion: '2393',
            impact: 'Breakthrough technologies in energy and propulsion',
            beneficiaries: 1560000,
            successMetrics: ['Patent filings', 'Technology transfer', 'Commercial applications']
          },
          {
            id: 'prog-3',
            name: 'Colonial Expansion Program',
            department: 'Exploration',
            budget: '$320B',
            status: 'active',
            progress: 45,
            startDate: '2391',
            expectedCompletion: '2398',
            impact: 'Establishment of 8 new colony worlds',
            beneficiaries: 890000,
            successMetrics: ['Colony establishment', 'Population growth', 'Resource extraction']
          },
          {
            id: 'prog-4',
            name: 'Defense Modernization',
            department: 'Defense',
            budget: '$580B',
            status: 'active',
            progress: 78,
            startDate: '2389',
            expectedCompletion: '2394',
            impact: 'Enhanced fleet capabilities and planetary defenses',
            beneficiaries: 4230000,
            successMetrics: ['Fleet readiness', 'Defense coverage', 'Threat response time']
          },
          {
            id: 'prog-5',
            name: 'Education Reform Initiative',
            department: 'Education',
            budget: '$180B',
            status: 'active',
            progress: 92,
            startDate: '2392',
            expectedCompletion: '2393',
            impact: 'Improved educational outcomes across all colonies',
            beneficiaries: 2100000,
            successMetrics: ['Graduation rates', 'Skill development', 'Employment rates']
          }
        ],
        policies: [
          {
            id: 'pol-1',
            title: 'Universal Basic Resources',
            category: 'Social Welfare',
            priority: 'high',
            status: 'implemented',
            supportLevel: 78.3,
            proposedBy: 'Senator Thompson',
            description: 'Guaranteed access to basic resources for all citizens',
            expectedOutcome: 'Reduced poverty and increased social stability',
            timeline: '2390-2395'
          },
          {
            id: 'pol-2',
            title: 'Space Mining Regulations',
            category: 'Economic',
            priority: 'medium',
            status: 'approved',
            supportLevel: 65.7,
            proposedBy: 'Commissioner Park',
            description: 'Comprehensive regulations for asteroid and planetary mining',
            expectedOutcome: 'Sustainable resource extraction and economic growth',
            timeline: '2391-2396'
          },
          {
            id: 'pol-3',
            title: 'AI Governance Framework',
            category: 'Technology',
            priority: 'critical',
            status: 'review',
            supportLevel: 82.1,
            proposedBy: 'Dr. Petrova',
            description: 'Ethical guidelines and oversight for AI development',
            expectedOutcome: 'Safe and beneficial AI advancement',
            timeline: '2392-2394'
          },
          {
            id: 'pol-4',
            title: 'Interstellar Trade Agreement',
            category: 'Diplomatic',
            priority: 'high',
            status: 'draft',
            supportLevel: 71.4,
            proposedBy: 'Admiral Rodriguez',
            description: 'Trade framework with neighboring civilizations',
            expectedOutcome: 'Increased trade volume and diplomatic relations',
            timeline: '2393-2397'
          },
          {
            id: 'pol-5',
            title: 'Environmental Protection Standards',
            category: 'Environmental',
            priority: 'medium',
            status: 'approved',
            supportLevel: 69.8,
            proposedBy: 'Dr. Chen',
            description: 'Comprehensive environmental regulations for all colonies',
            expectedOutcome: 'Sustainable development and ecosystem preservation',
            timeline: '2390-2398'
          }
        ],
        budget: {
          totalBudget: 2800000000000,
          allocated: 2340000000000,
          remaining: 460000000000,
          departments: [
            { name: 'Defense', allocated: 580000000000, spent: 452000000000, remaining: 128000000000, efficiency: 78.0 },
            { name: 'Infrastructure', allocated: 450000000000, spent: 301000000000, remaining: 149000000000, efficiency: 66.9 },
            { name: 'Research', allocated: 280000000000, spent: 249000000000, remaining: 31000000000, efficiency: 88.9 },
            { name: 'Exploration', allocated: 320000000000, spent: 144000000000, remaining: 176000000000, efficiency: 45.0 },
            { name: 'Education', allocated: 180000000000, spent: 166000000000, remaining: 14000000000, efficiency: 92.2 },
            { name: 'Healthcare', allocated: 220000000000, spent: 198000000000, remaining: 22000000000, efficiency: 90.0 },
            { name: 'Social Services', allocated: 150000000000, spent: 142000000000, remaining: 8000000000, efficiency: 94.7 }
          ],
          trends: [
            { month: 'Jan 2393', spending: 185000000000, revenue: 210000000000, deficit: -25000000000 },
            { month: 'Feb 2393', spending: 178000000000, revenue: 198000000000, deficit: -20000000000 },
            { month: 'Mar 2393', spending: 192000000000, revenue: 205000000000, deficit: -13000000000 },
            { month: 'Apr 2393', spending: 187000000000, revenue: 212000000000, deficit: -25000000000 },
            { month: 'May 2393', spending: 195000000000, revenue: 208000000000, deficit: 13000000000 },
            { month: 'Jun 2393', spending: 189000000000, revenue: 215000000000, deficit: -26000000000 }
          ]
        },
        analytics: {
          performanceTrends: [
            { month: 'Jan 2393', approvalRating: 65.2, stabilityIndex: 76.8, efficiency: 70.1 },
            { month: 'Feb 2393', approvalRating: 66.8, stabilityIndex: 77.2, efficiency: 71.3 },
            { month: 'Mar 2393', approvalRating: 67.1, stabilityIndex: 77.8, efficiency: 72.0 },
            { month: 'Apr 2393', approvalRating: 67.5, stabilityIndex: 78.1, efficiency: 72.4 },
            { month: 'May 2393', approvalRating: 67.8, stabilityIndex: 78.5, efficiency: 72.8 },
            { month: 'Jun 2393', approvalRating: 68.2, stabilityIndex: 78.9, efficiency: 73.1 }
          ],
          departmentPerformance: [
            { department: 'Defense', efficiency: 78.0, budgetUtilization: 77.9, programSuccess: 82.3 },
            { department: 'Infrastructure', efficiency: 66.9, budgetUtilization: 66.9, programSuccess: 71.5 },
            { department: 'Research', efficiency: 88.9, budgetUtilization: 88.9, programSuccess: 91.2 },
            { department: 'Exploration', efficiency: 45.0, budgetUtilization: 45.0, programSuccess: 67.8 },
            { department: 'Education', efficiency: 92.2, budgetUtilization: 92.2, programSuccess: 89.4 },
            { department: 'Healthcare', efficiency: 90.0, budgetUtilization: 90.0, programSuccess: 87.6 },
            { department: 'Social Services', efficiency: 94.7, budgetUtilization: 94.7, programSuccess: 91.8 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGovernmentData();
  }, [fetchGovernmentData]);

  const renderOverview = () => (
    <>
      {/* Government Overview - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🏛️ Government Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Approval Rating</span>
            <span className="standard-metric-value">{governmentData?.stats.approvalRating}%</span>
          </div>
          <div className="standard-metric">
            <span>Stability Index</span>
            <span className="standard-metric-value">{governmentData?.stats.stabilityIndex}%</span>
          </div>
          <div className="standard-metric">
            <span>Total Budget</span>
            <span className="standard-metric-value">{governmentData?.stats.totalBudget}</span>
          </div>
          <div className="standard-metric">
            <span>Active Programs</span>
            <span className="standard-metric-value">{governmentData?.stats.activePrograms}</span>
          </div>
          <div className="standard-metric">
            <span>Employed Officials</span>
            <span className="standard-metric-value">{formatNumber(governmentData?.stats.employedOfficials || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Pending Legislation</span>
            <span className="standard-metric-value">{governmentData?.stats.pendingLegislation}</span>
          </div>
          <div className="standard-metric">
            <span>Efficiency</span>
            <span className="standard-metric-value">{governmentData?.stats.efficiency}%</span>
          </div>
          <div className="standard-metric">
            <span>Transparency</span>
            <span className="standard-metric-value">{governmentData?.stats.transparency}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Review Performance')}>📊 Review Performance</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Update Policies')}>⚖️ Update Policies</button>
        </div>
      </div>

      {/* Budget Status - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>💰 Budget Status</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Budget</span>
            <span className="standard-metric-value">{formatCurrency(governmentData?.budget.totalBudget || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Allocated</span>
            <span className="standard-metric-value">{formatCurrency(governmentData?.budget.allocated || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Remaining</span>
            <span className="standard-metric-value">{formatCurrency(governmentData?.budget.remaining || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Utilization</span>
            <span className="standard-metric-value">{((governmentData?.budget.allocated || 0) / (governmentData?.budget.totalBudget || 1) * 100).toFixed(1)}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Review Budget')}>📋 Review Budget</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Adjust Allocations')}>⚖️ Adjust Allocations</button>
        </div>
      </div>

      {/* Department Performance - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel government-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Department Performance</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Efficiency</th>
                  <th>Budget Utilization</th>
                  <th>Program Success</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {governmentData?.analytics.departmentPerformance.map(dept => (
                  <tr key={dept.department}>
                    <td>{dept.department}</td>
                    <td>
                      <span style={{ color: dept.efficiency >= 80 ? '#10b981' : dept.efficiency >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {dept.efficiency}%
                      </span>
                    </td>
                    <td>
                      <span style={{ color: dept.budgetUtilization >= 80 ? '#10b981' : dept.budgetUtilization >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {dept.budgetUtilization}%
                      </span>
                    </td>
                    <td>
                      <span style={{ color: dept.programSuccess >= 80 ? '#10b981' : dept.programSuccess >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {dept.programSuccess}%
                      </span>
                    </td>
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
    </>
  );

  const renderOfficials = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👥 Government Officials</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Add Official')}>➕ Add Official</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Review Performance')}>📊 Review Performance</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Years in Office</th>
                <th>Approval Rating</th>
                <th>Performance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {governmentData?.officials.map(official => (
                <tr key={official.id}>
                  <td>{official.name}</td>
                  <td>{official.position}</td>
                  <td>{official.department}</td>
                  <td>{official.yearsInOffice}</td>
                  <td>
                    <span style={{ color: official.approvalRating >= 70 ? '#10b981' : official.approvalRating >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {official.approvalRating}%
                    </span>
                  </td>
                  <td>
                    <span style={{ color: official.performance >= 80 ? '#10b981' : official.performance >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {official.performance}%
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(official.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(official.status) + '20'
                    }}>
                      {official.status}
                    </span>
                  </td>
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

  const renderPrograms = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📋 Government Programs</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Launch Program')}>🚀 Launch Program</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Review Programs')}>📊 Review Programs</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Program Name</th>
                <th>Department</th>
                <th>Budget</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {governmentData?.programs.map(program => (
                <tr key={program.id}>
                  <td>{program.name}</td>
                  <td>{program.department}</td>
                  <td>{program.budget}</td>
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
                          width: `${program.progress}%`, 
                          height: '100%', 
                          backgroundColor: program.progress >= 80 ? '#10b981' : program.progress >= 60 ? '#f59e0b' : '#ef4444',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span>{program.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(program.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(program.status) + '20'
                    }}>
                      {program.status}
                    </span>
                  </td>
                  <td>{program.startDate} - {program.expectedCompletion}</td>
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

  const renderPolicies = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⚖️ Policy Initiatives</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Propose Policy')}>📝 Propose Policy</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Review Policies')}>📊 Review Policies</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Support Level</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {governmentData?.policies.map(policy => (
                <tr key={policy.id}>
                  <td>{policy.title}</td>
                  <td>{policy.category}</td>
                  <td>
                    <span style={{ 
                      color: getPriorityColor(policy.priority),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getPriorityColor(policy.priority) + '20'
                    }}>
                      {policy.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(policy.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(policy.status) + '20'
                    }}>
                      {policy.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: policy.supportLevel >= 70 ? '#10b981' : policy.supportLevel >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {policy.supportLevel}%
                    </span>
                  </td>
                  <td>{policy.timeline}</td>
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

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📈 Government Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={governmentData?.analytics.performanceTrends.map(trend => ({
                name: trend.month,
                'Approval Rating': trend.approvalRating,
                'Stability Index': trend.stabilityIndex,
                'Efficiency': trend.efficiency
              })) || []}
              title="Performance Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={governmentData?.budget.departments.map(dept => ({
                name: dept.name,
                value: dept.allocated
              })) || []}
              title="Budget Allocation by Department"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Budget Trends</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Spending</th>
                  <th>Revenue</th>
                  <th>Deficit/Surplus</th>
                </tr>
              </thead>
              <tbody>
                {governmentData?.budget.trends.map(trend => (
                  <tr key={trend.month}>
                    <td>{trend.month}</td>
                    <td>{formatCurrency(trend.spending)}</td>
                    <td>{formatCurrency(trend.revenue)}</td>
                    <td style={{ color: trend.deficit < 0 ? '#10b981' : '#ef4444' }}>
                      {trend.deficit < 0 ? '+' : ''}{formatCurrency(Math.abs(trend.deficit))}
                    </td>
                  </tr>
                ))}
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
      onRefresh={fetchGovernmentData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container government-theme">
        <div className="standard-dashboard">
          {!loading && !error && governmentData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'officials' && renderOfficials()}
              {activeTab === 'programs' && renderPrograms()}
              {activeTab === 'policies' && renderPolicies()}
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
              {loading ? 'Loading government data...' : 'No government data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default GovernmentScreen;
