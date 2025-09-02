/**
 * Export Controls Screen - Trade Regulation and Export Management
 * 
 * This screen focuses on export control operations including:
 * - Export license management and approval
 * - Controlled technology and goods oversight
 * - International trade compliance
 * - Export analytics and reporting
 * - Trade policy enforcement
 * 
 * Theme: Government (blue color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './ExportControlsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface ExportLicense {
  id: string;
  applicant: string;
  company: string;
  technology: string;
  destination: string;
  endUse: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'under_review' | 'approved' | 'denied' | 'expired';
  appliedDate: string;
  decisionDate?: string;
  validUntil?: string;
  conditions: string[];
  restrictions: string[];
  value: number;
  priority: 'normal' | 'expedited' | 'urgent';
}

interface ControlledTechnology {
  id: string;
  name: string;
  category: 'dual_use' | 'military' | 'nuclear' | 'chemical' | 'biological';
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  exportRestrictions: string[];
  requiredLicenses: string[];
  embargoedCountries: string[];
  lastUpdated: string;
  complianceScore: number;
}

interface TradeCompliance {
  id: string;
  company: string;
  violation: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  date: string;
  status: 'investigating' | 'resolved' | 'penalty_imposed' | 'appealed';
  penalty: number;
  correctiveActions: string[];
  complianceOfficer: string;
}

interface ExportAnalytics {
  overview: {
    totalLicenses: number;
    pendingLicenses: number;
    approvedLicenses: number;
    deniedLicenses: number;
    totalValue: number;
    complianceRate: number;
  };
  categoryBreakdown: Array<{
    category: string;
    count: number;
    totalValue: number;
    approvalRate: number;
    averageProcessingTime: number;
  }>;
  destinationAnalysis: Array<{
    country: string;
    licensesIssued: number;
    totalValue: number;
    riskLevel: string;
    complianceScore: number;
  }>;
  processingTrends: Array<{
    month: string;
    applicationsReceived: number;
    licensesApproved: number;
    averageProcessingTime: number;
    complianceViolations: number;
  }>;
}

interface ExportControlsData {
  licenses: ExportLicense[];
  controlledTechnologies: ControlledTechnology[];
  complianceCases: TradeCompliance[];
  analytics: ExportAnalytics;
}

const ExportControlsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [exportData, setExportData] = useState<ExportControlsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'licenses' | 'technologies' | 'compliance' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<ExportLicense | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'licenses', label: 'Licenses', icon: '📋' },
    { id: 'technologies', label: 'Technologies', icon: '🔬' },
    { id: 'compliance', label: 'Compliance', icon: '⚖️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/export-controls/licenses', description: 'Get export licenses' },
    { method: 'GET', path: '/api/export-controls/technologies', description: 'Get controlled technologies' },
    { method: 'POST', path: '/api/export-controls/licenses', description: 'Create export license' }
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
      case 'pending': return '#f59e0b';
      case 'under_review': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'denied': return '#ef4444';
      case 'expired': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dual_use': return '#3b82f6';
      case 'military': return '#ef4444';
      case 'nuclear': return '#8b5cf6';
      case 'chemical': return '#f59e0b';
      case 'biological': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'major': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchExportData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/export-controls/licenses');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setExportData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch export controls data:', err);
      // Use comprehensive mock data
      setExportData({
        licenses: [
          {
            id: 'license_1',
            applicant: 'Dr. Sarah Chen',
            company: 'Quantum Technologies Inc.',
            technology: 'Advanced Quantum Computing Systems',
            destination: 'Alpha Centauri Colony',
            endUse: 'Scientific research and development',
            riskLevel: 'high',
            status: 'approved',
            appliedDate: '2393-01-15',
            decisionDate: '2393-03-20',
            validUntil: '2395-03-20',
            conditions: ['End-use monitoring required', 'No re-export without permission', 'Annual compliance reports'],
            restrictions: ['No military applications', 'Limited to research institutions', 'Technology transfer restrictions'],
            value: 25000000,
            priority: 'normal'
          },
          {
            id: 'license_2',
            applicant: 'Colonel Marcus Rodriguez',
            company: 'Defense Systems Corp.',
            technology: 'Advanced Sensor Technology',
            destination: 'Proxima Centauri Military Base',
            endUse: 'Defense and security applications',
            riskLevel: 'critical',
            status: 'under_review',
            appliedDate: '2393-05-10',
            decisionDate: undefined,
            validUntil: undefined,
            conditions: ['Strict end-use monitoring', 'No civilian applications', 'Military oversight required'],
            restrictions: ['No civilian transfer', 'Classified technology', 'Restricted access only'],
            value: 45000000,
            priority: 'urgent'
          },
          {
            id: 'license_3',
            applicant: 'Dr. Elena Petrova',
            company: 'BioTech Solutions Ltd.',
            technology: 'Genetic Engineering Tools',
            destination: 'Vega Research Station',
            endUse: 'Medical research and disease prevention',
            riskLevel: 'medium',
            status: 'pending',
            appliedDate: '2393-06-01',
            decisionDate: undefined,
            validUntil: undefined,
            conditions: ['Medical use only', 'Regular safety audits', 'No weaponization'],
            restrictions: ['No military applications', 'Safety protocols required', 'Regular inspections'],
            value: 18000000,
            priority: 'normal'
          },
          {
            id: 'license_4',
            applicant: 'Professor James Thompson',
            company: 'Nuclear Power Consortium',
            technology: 'Fusion Reactor Components',
            destination: 'Sirius Energy Colony',
            endUse: 'Clean energy production',
            riskLevel: 'high',
            status: 'approved',
            appliedDate: '2392-11-15',
            decisionDate: '2393-01-20',
            validUntil: '2396-01-20',
            conditions: ['Energy production only', 'No weapons applications', 'Regular inspections'],
            restrictions: ['No military use', 'Safety protocols required', 'Technology transfer limits'],
            value: 75000000,
            priority: 'expedited'
          },
          {
            id: 'license_5',
            applicant: 'Dr. Lisa Park',
            company: 'Space Mining Corp.',
            technology: 'Advanced Mining Equipment',
            destination: 'Asteroid Belt Mining Station',
            endUse: 'Resource extraction and processing',
            riskLevel: 'low',
            status: 'approved',
            appliedDate: '2393-02-20',
            decisionDate: '2393-03-15',
            validUntil: '2398-03-15',
            conditions: ['Mining operations only', 'Environmental compliance', 'Regular safety audits'],
            restrictions: ['No military applications', 'Environmental standards', 'Safety protocols'],
            value: 32000000,
            priority: 'normal'
          }
        ],
        controlledTechnologies: [
          {
            id: 'tech_1',
            name: 'Quantum Encryption Systems',
            category: 'dual_use',
            description: 'Advanced encryption technology with potential military applications',
            riskLevel: 'high',
            exportRestrictions: ['End-use verification required', 'No military end-users', 'Technology transfer limits'],
            requiredLicenses: ['Export license', 'End-use certificate', 'Technology transfer agreement'],
            embargoedCountries: ['Hostile systems', 'Unstable regions', 'Sanctioned entities'],
            lastUpdated: '2393-06-01',
            complianceScore: 87
          },
          {
            id: 'tech_2',
            name: 'Advanced AI Systems',
            category: 'dual_use',
            description: 'Artificial intelligence with autonomous decision-making capabilities',
            riskLevel: 'critical',
            exportRestrictions: ['Strict end-use monitoring', 'No autonomous weapons', 'Human oversight required'],
            requiredLicenses: ['Export license', 'AI ethics review', 'Safety certification'],
            embargoedCountries: ['All hostile systems', 'Unstable regions', 'Sanctioned entities'],
            lastUpdated: '2393-06-01',
            complianceScore: 92
          },
          {
            id: 'tech_3',
            name: 'Military Grade Sensors',
            category: 'military',
            description: 'High-precision detection and targeting systems',
            riskLevel: 'critical',
            exportRestrictions: ['Military end-use only', 'Government approval required', 'No civilian transfer'],
            requiredLicenses: ['Military export license', 'End-use verification', 'Government certification'],
            embargoedCountries: ['All non-allied systems', 'Unstable regions', 'Sanctioned entities'],
            lastUpdated: '2393-06-01',
            complianceScore: 95
          },
          {
            id: 'tech_4',
            name: 'Nuclear Reactor Components',
            category: 'nuclear',
            description: 'Critical components for nuclear power generation',
            riskLevel: 'high',
            exportRestrictions: ['Energy use only', 'No weapons applications', 'Safety protocols required'],
            requiredLicenses: ['Nuclear export license', 'Safety certification', 'End-use verification'],
            embargoedCountries: ['Unstable regions', 'Sanctioned entities', 'Non-proliferation concerns'],
            lastUpdated: '2393-06-01',
            complianceScore: 89
          },
          {
            id: 'tech_5',
            name: 'Biotechnology Research Tools',
            category: 'biological',
            description: 'Advanced tools for genetic research and modification',
            riskLevel: 'medium',
            exportRestrictions: ['Medical research only', 'No weaponization', 'Safety protocols required'],
            requiredLicenses: ['Biotech export license', 'Safety certification', 'Research approval'],
            embargoedCountries: ['Unstable regions', 'Sanctioned entities', 'Biological weapons concerns'],
            lastUpdated: '2393-06-01',
            complianceScore: 84
          }
        ],
        complianceCases: [
          {
            id: 'case_1',
            company: 'TechCorp Industries',
            violation: 'Unauthorized technology transfer to restricted entity',
            severity: 'major',
            date: '2393-04-15',
            status: 'resolved',
            penalty: 2500000,
            correctiveActions: ['Enhanced compliance training', 'New oversight procedures', 'Regular audits'],
            complianceOfficer: 'Sarah Johnson'
          },
          {
            id: 'case_2',
            company: 'Global Exports Ltd.',
            violation: 'Failure to verify end-use of exported technology',
            severity: 'moderate',
            date: '2393-05-20',
            status: 'investigating',
            penalty: 0,
            correctiveActions: ['End-use verification procedures', 'Compliance monitoring', 'Staff training'],
            complianceOfficer: 'Michael Chen'
          },
          {
            id: 'case_3',
            company: 'Advanced Systems Inc.',
            violation: 'Export of controlled technology without license',
            severity: 'critical',
            date: '2393-03-10',
            status: 'penalty_imposed',
            penalty: 5000000,
            correctiveActions: ['License application procedures', 'Compliance officer appointment', 'Regular training'],
            complianceOfficer: 'David Rodriguez'
          }
        ],
        analytics: {
          overview: {
            totalLicenses: 47,
            pendingLicenses: 12,
            approvedLicenses: 28,
            deniedLicenses: 7,
            totalValue: 285000000,
            complianceRate: 94.2
          },
          categoryBreakdown: [
            { category: 'Dual Use', count: 18, totalValue: 120000000, approvalRate: 88.9, averageProcessingTime: 45 },
            { category: 'Military', count: 8, totalValue: 85000000, approvalRate: 75.0, averageProcessingTime: 78 },
            { category: 'Nuclear', count: 6, totalValue: 45000000, approvalRate: 83.3, averageProcessingTime: 52 },
            { category: 'Chemical', count: 5, totalValue: 15000000, approvalRate: 80.0, averageProcessingTime: 38 },
            { category: 'Biological', count: 10, totalValue: 20000000, approvalRate: 90.0, averageProcessingTime: 41 }
          ],
          destinationAnalysis: [
            { country: 'Alpha Centauri', licensesIssued: 12, totalValue: 75000000, riskLevel: 'medium', complianceScore: 89 },
            { country: 'Proxima Centauri', licensesIssued: 8, totalValue: 65000000, riskLevel: 'high', complianceScore: 92 },
            { country: 'Vega System', licensesIssued: 15, totalValue: 95000000, riskLevel: 'low', complianceScore: 87 },
            { country: 'Sirius System', licensesIssued: 6, totalValue: 35000000, riskLevel: 'medium', complianceScore: 85 },
            { country: 'Asteroid Belt', licensesIssued: 6, totalValue: 15000000, riskLevel: 'low', complianceScore: 91 }
          ],
          processingTrends: [
            { month: 'Jan 2393', applicationsReceived: 8, licensesApproved: 6, averageProcessingTime: 42, complianceViolations: 1 },
            { month: 'Feb 2393', applicationsReceived: 6, licensesApproved: 5, averageProcessingTime: 38, complianceViolations: 0 },
            { month: 'Mar 2393', applicationsReceived: 10, licensesApproved: 7, averageProcessingTime: 45, complianceViolations: 2 },
            { month: 'Apr 2393', applicationsReceived: 7, licensesApproved: 6, averageProcessingTime: 41, complianceViolations: 1 },
            { month: 'May 2393', applicationsReceived: 9, licensesApproved: 8, averageProcessingTime: 39, complianceViolations: 1 },
            { month: 'Jun 2393', applicationsReceived: 7, licensesApproved: 6, averageProcessingTime: 43, complianceViolations: 0 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExportData();
  }, [fetchExportData]);

  const renderOverview = () => (
    <>
      {/* Export Controls Overview - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Export Controls Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Licenses</span>
            <span className="standard-metric-value">{exportData?.analytics.overview.totalLicenses}</span>
          </div>
          <div className="standard-metric">
            <span>Pending Licenses</span>
            <span className="standard-metric-value">{exportData?.analytics.overview.pendingLicenses}</span>
          </div>
          <div className="standard-metric">
            <span>Approved Licenses</span>
            <span className="standard-metric-value">{exportData?.analytics.overview.approvedLicenses}</span>
          </div>
          <div className="standard-metric">
            <span>Denied Licenses</span>
            <span className="standard-metric-value">{exportData?.analytics.overview.deniedLicenses}</span>
          </div>
          <div className="standard-metric">
            <span>Total Value</span>
            <span className="standard-metric-value">{formatCurrency(exportData?.analytics.overview.totalValue || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Compliance Rate</span>
            <span className="standard-metric-value">{exportData?.analytics.overview.complianceRate}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('New License')}>📝 New License</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Review Pending')}>🔍 Review Pending</button>
        </div>
      </div>

      {/* Risk Level Distribution - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⚠️ Risk Level Distribution</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '0.5rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }}>🟢</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Low Risk</div>
            <div style={{ fontSize: '1.5rem', color: '#10b981' }}>
              {exportData?.licenses.filter(l => l.riskLevel === 'low').length || 0}
            </div>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'rgba(245, 158, 11, 0.1)', 
            borderRadius: '0.5rem',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>🟡</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>Medium Risk</div>
            <div style={{ fontSize: '1.5rem', color: '#f59e0b' }}>
              {exportData?.licenses.filter(l => l.riskLevel === 'medium').length || 0}
            </div>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'rgba(249, 115, 22, 0.1)', 
            borderRadius: '0.5rem',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', color: '#f97316', marginBottom: '0.5rem' }}>🟠</div>
            <div style={{ fontWeight: 'bold', color: '#f97316' }}>High Risk</div>
            <div style={{ fontSize: '1.5rem', color: '#f97316' }}>
              {exportData?.licenses.filter(l => l.riskLevel === 'high').length || 0}
            </div>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '0.5rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '0.5rem' }}>🔴</div>
            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>Critical Risk</div>
            <div style={{ fontSize: '1.5rem', color: '#ef4444' }}>
              {exportData?.licenses.filter(l => l.riskLevel === 'critical').length || 0}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderLicenses = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📋 Export Licenses</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('New License')}>📝 New License</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Filter Licenses')}>🔍 Filter</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Technology</th>
                <th>Destination</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportData?.licenses.map(license => (
                <tr key={license.id}>
                  <td>{license.applicant}</td>
                  <td>{license.technology}</td>
                  <td>{license.destination}</td>
                  <td>
                    <span style={{ 
                      color: getRiskColor(license.riskLevel),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getRiskColor(license.riskLevel) + '20'
                    }}>
                      {license.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(license.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(license.status) + '20'
                    }}>
                      {license.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatCurrency(license.value)}</td>
                  <td>
                    <button className="standard-btn government-theme">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTechnologies = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🔬 Controlled Technologies</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Add Technology')}>➕ Add Technology</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Update Controls')}>⚙️ Update Controls</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Technology</th>
                <th>Category</th>
                <th>Risk Level</th>
                <th>Compliance Score</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportData?.controlledTechnologies.map(tech => (
                <tr key={tech.id}>
                  <td>{tech.name}</td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(tech.category),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(tech.category) + '20'
                    }}>
                      {tech.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getRiskColor(tech.riskLevel),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getRiskColor(tech.riskLevel) + '20'
                    }}>
                      {tech.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: tech.complianceScore >= 90 ? '#10b981' : tech.complianceScore >= 80 ? '#f59e0b' : '#ef4444' }}>
                      {tech.complianceScore}%
                    </span>
                  </td>
                  <td>{tech.lastUpdated}</td>
                  <td>
                    <button className="standard-btn government-theme">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⚖️ Trade Compliance Cases</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('New Case')}>📝 New Case</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Investigate')}>🔍 Investigate</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Violation</th>
                <th>Severity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Penalty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportData?.complianceCases.map(complianceCase => (
                <tr key={complianceCase.id}>
                  <td>{complianceCase.company}</td>
                  <td>{complianceCase.violation}</td>
                  <td>
                    <span style={{ 
                      color: getSeverityColor(complianceCase.severity),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getSeverityColor(complianceCase.severity) + '20'
                    }}>
                      {complianceCase.severity}
                    </span>
                  </td>
                  <td>{complianceCase.date}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(complianceCase.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(complianceCase.status) + '20'
                    }}>
                      {complianceCase.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatCurrency(complianceCase.penalty)}</td>
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
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Export Controls Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={exportData?.analytics.processingTrends.map(trend => ({
                name: trend.month,
                'Applications Received': trend.applicationsReceived,
                'Licenses Approved': trend.licensesApproved,
                'Average Processing Time': trend.averageProcessingTime,
                'Compliance Violations': trend.complianceViolations
              })) || []}
              title="License Processing Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={exportData?.analytics.categoryBreakdown.map(category => ({
                name: category.category,
                value: category.totalValue
              })) || []}
              title="Export Value by Category"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Destination Risk Analysis</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Licenses Issued</th>
                  <th>Total Value</th>
                  <th>Risk Level</th>
                  <th>Compliance Score</th>
                </tr>
              </thead>
              <tbody>
                {exportData?.analytics.destinationAnalysis.map(destination => (
                  <tr key={destination.country}>
                    <td>{destination.country}</td>
                    <td>{destination.licensesIssued}</td>
                    <td>{formatCurrency(destination.totalValue)}</td>
                    <td>
                      <span style={{ 
                        color: getRiskColor(destination.riskLevel),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        backgroundColor: getRiskColor(destination.riskLevel) + '20'
                      }}>
                        {destination.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: destination.complianceScore >= 90 ? '#10b981' : destination.complianceScore >= 80 ? '#f59e0b' : '#ef4444' }}>
                        {destination.complianceScore}%
                      </span>
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
      onRefresh={fetchExportData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container government-theme">
        <div className="standard-dashboard">
          {!loading && !error && exportData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'licenses' && renderLicenses()}
              {activeTab === 'technologies' && renderTechnologies()}
              {activeTab === 'compliance' && renderCompliance()}
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
              {loading ? 'Loading export controls data...' : 'No export controls data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default ExportControlsScreen;
