/**
 * Institutional Override Screen - Emergency Powers and Constitutional Override
 * 
 * This screen focuses on emergency powers and constitutional override mechanisms including:
 * - Emergency declarations and crisis management
 * - Constitutional override procedures and safeguards
 * - Emergency powers delegation and oversight
 * - Crisis response coordination and monitoring
 * - Constitutional restoration and normalization
 * 
 * Theme: Government (blue color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './InstitutionalOverrideScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface EmergencyDeclaration {
  id: string;
  type: 'national_emergency' | 'constitutional_crisis' | 'civil_unrest' | 'external_threat' | 'economic_collapse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'escalating' | 'deescalating';
  declaredAt: string;
  declaredBy: string;
  authority: string;
  description: string;
  affectedRegions: string[];
  estimatedDuration: string;
  constitutionalBasis: string;
  overrideLevel: 'partial' | 'full' | 'targeted';
  safeguards: string[];
  oversightMechanisms: string[];
  restorationCriteria: string[];
}

interface OverrideProcedure {
  id: string;
  name: string;
  type: 'executive_order' | 'emergency_legislation' | 'constitutional_amendment' | 'judicial_review' | 'military_authority';
  status: 'proposed' | 'active' | 'reviewed' | 'expired' | 'challenged';
  proposedAt: string;
  enactedAt: string;
  expiresAt: string;
  authority: string;
  scope: 'limited' | 'moderate' | 'extensive' | 'comprehensive';
  constitutionalImpact: 'minimal' | 'moderate' | 'significant' | 'major';
  justification: string;
  opposition: string[];
  support: string[];
  legalChallenges: string[];
  oversightCommittees: string[];
}

interface EmergencyPower {
  id: string;
  name: string;
  category: 'executive' | 'legislative' | 'judicial' | 'military' | 'economic';
  status: 'granted' | 'active' | 'suspended' | 'revoked';
  grantedAt: string;
  expiresAt: string;
  authority: string;
  scope: string;
  limitations: string[];
  oversightRequirements: string[];
  reportingFrequency: string;
  renewalCriteria: string[];
  revocationTriggers: string[];
}

interface CrisisResponse {
  id: string;
  crisisType: string;
  status: 'active' | 'contained' | 'resolved' | 'escalating';
  declaredAt: string;
  responseLevel: 'alpha' | 'beta' | 'gamma' | 'delta';
  affectedSystems: string[];
  responseTeams: Array<{
    name: string;
    leader: string;
    status: 'deployed' | 'standby' | 'returning';
    effectiveness: number;
  }>;
  resourceAllocation: {
    personnel: number;
    funding: number;
    equipment: string[];
  };
  timeline: Array<{
    phase: string;
    status: 'completed' | 'in_progress' | 'planned';
    completionDate: string;
  }>;
}

interface OverrideData {
  emergencyDeclarations: EmergencyDeclaration[];
  overrideProcedures: OverrideProcedure[];
  emergencyPowers: EmergencyPower[];
  crisisResponses: CrisisResponse[];
  analytics: {
    totalEmergencies: number;
    activeOverrides: number;
    averageResponseTime: number;
    constitutionalCompliance: number;
    emergencyTypes: Array<{ type: string; count: number; percentage: number }>;
    overrideLevels: Array<{ level: string; count: number; percentage: number }>;
    responseEffectiveness: Array<{ level: string; count: number; percentage: number }>;
    restorationTrends: Array<{
      date: string;
      activeEmergencies: number;
      resolvedEmergencies: number;
      newDeclarations: number;
    }>;
  };
}

const InstitutionalOverrideScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [overrideData, setOverrideData] = useState<OverrideData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'emergencies' | 'procedures' | 'powers' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyDeclaration | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'emergencies', label: 'Emergencies', icon: '🚨' },
    { id: 'procedures', label: 'Procedures', icon: '⚖️' },
    { id: 'powers', label: 'Powers', icon: '🔐' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/institutional-override/emergencies', description: 'Get emergency declarations' },
    { method: 'GET', path: '/api/institutional-override/procedures', description: 'Get override procedures' },
    { method: 'GET', path: '/api/institutional-override/powers', description: 'Get emergency powers' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#ef4444';
      case 'resolved': return '#10b981';
      case 'escalating': return '#f97316';
      case 'deescalating': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getOverrideLevelColor = (level: string) => {
    switch (level) {
      case 'partial': return '#10b981';
      case 'full': return '#ef4444';
      case 'targeted': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getResponseLevelColor = (level: string) => {
    switch (level) {
      case 'alpha': return '#10b981';
      case 'beta': return '#f59e0b';
      case 'gamma': return '#f97316';
      case 'delta': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchOverrideData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/institutional-override/emergencies');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOverrideData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch override data:', err);
      // Use comprehensive mock data
      setOverrideData({
        emergencyDeclarations: [
          {
            id: 'emergency_1',
            type: 'national_emergency',
            severity: 'high',
            status: 'active',
            declaredAt: '2393-06-15T08:00:00Z',
            declaredBy: 'President Sarah Chen',
            authority: 'Emergency Powers Act of 2180',
            description: 'Civil unrest following economic instability requires immediate government intervention and emergency powers.',
            affectedRegions: ['Earth', 'Mars Colonies', 'Luna'],
            estimatedDuration: '30 days',
            constitutionalBasis: 'Article 12, Section 3 - Emergency Powers Clause',
            overrideLevel: 'partial',
            safeguards: ['Judicial Review', 'Legislative Oversight', 'Public Reporting'],
            oversightMechanisms: ['Emergency Oversight Committee', 'Constitutional Court Review'],
            restorationCriteria: ['Stability restored', 'Economic indicators normalized', 'Public safety assured']
          },
          {
            id: 'emergency_2',
            type: 'external_threat',
            severity: 'critical',
            status: 'escalating',
            declaredAt: '2393-06-14T16:30:00Z',
            declaredBy: 'Joint Chiefs of Staff',
            authority: 'Defense Emergency Protocol',
            description: 'Unidentified space vessels detected in outer system requiring military response and emergency powers.',
            affectedRegions: ['Outer System', 'Asteroid Belt', 'Jupiter Colonies'],
            estimatedDuration: 'Indefinite',
            constitutionalBasis: 'Article 8, Section 1 - Defense Powers',
            overrideLevel: 'full',
            safeguards: ['Military Oversight', 'Civilian Review Board', 'International Notification'],
            oversightMechanisms: ['Defense Committee', 'Security Council'],
            restorationCriteria: ['Threat neutralized', 'Space security restored', 'International cooperation confirmed']
          }
        ],
        overrideProcedures: [
          {
            id: 'procedure_1',
            name: 'Emergency Economic Stabilization Order',
            type: 'executive_order',
            status: 'active',
            proposedAt: '2393-06-15T08:00:00Z',
            enactedAt: '2393-06-15T08:15:00Z',
            expiresAt: '2393-07-15T08:15:00Z',
            authority: 'President Sarah Chen',
            scope: 'moderate',
            constitutionalImpact: 'moderate',
            justification: 'Economic crisis requires immediate intervention to prevent market collapse and civil unrest.',
            opposition: ['Civil Liberties Union', 'Constitutional Scholars Association'],
            support: ['Economic Council', 'Federal Reserve', 'Major Banks'],
            legalChallenges: ['Pending Supreme Court Review'],
            oversightCommittees: ['Economic Oversight Committee', 'Constitutional Review Board']
          },
          {
            id: 'procedure_2',
            name: 'Defense Emergency Protocol Activation',
            type: 'military_authority',
            status: 'active',
            proposedAt: '2393-06-14T16:30:00Z',
            enactedAt: '2393-06-14T16:45:00Z',
            expiresAt: '2393-09-14T16:45:00Z',
            authority: 'Joint Chiefs of Staff',
            scope: 'extensive',
            constitutionalImpact: 'significant',
            justification: 'External threat requires full military mobilization and emergency powers.',
            opposition: ['Peace Alliance', 'Civil Rights Coalition'],
            support: ['Defense Department', 'Security Council', 'Intelligence Agencies'],
            legalChallenges: ['Constitutional Court Review Pending'],
            oversightCommittees: ['Defense Oversight Committee', 'Security Council']
          }
        ],
        emergencyPowers: [
          {
            id: 'power_1',
            name: 'Economic Intervention Authority',
            category: 'executive',
            status: 'active',
            grantedAt: '2393-06-15T08:15:00Z',
            expiresAt: '2393-07-15T08:15:00Z',
            authority: 'President Sarah Chen',
            scope: 'Market regulation, price controls, emergency funding allocation',
            limitations: ['Cannot nationalize private property', 'Must report to Congress weekly'],
            oversightRequirements: ['Daily economic reports', 'Weekly congressional briefings'],
            reportingFrequency: 'Daily',
            renewalCriteria: ['Continued crisis conditions', 'Congressional approval'],
            revocationTriggers: ['Crisis resolution', 'Constitutional violation', 'Congressional override']
          },
          {
            id: 'power_2',
            name: 'Military Mobilization Authority',
            category: 'military',
            status: 'active',
            grantedAt: '2393-06-14T16:45:00Z',
            expiresAt: '2393-09-14T16:45:00Z',
            authority: 'Joint Chiefs of Staff',
            scope: 'Full military deployment, weapons authorization, strategic planning',
            limitations: ['Cannot declare war without congressional approval', 'Must respect civilian authority'],
            oversightRequirements: ['Daily military reports', 'Civilian oversight board'],
            reportingFrequency: 'Daily',
            renewalCriteria: ['Continued threat', 'Congressional approval'],
            revocationTriggers: ['Threat neutralization', 'Constitutional violation', 'Presidential order']
          }
        ],
        crisisResponses: [
          {
            id: 'response_1',
            crisisType: 'Economic Instability',
            status: 'active',
            declaredAt: '2393-06-15T08:00:00Z',
            responseLevel: 'gamma',
            affectedSystems: ['Financial Markets', 'Banking System', 'Trade Networks'],
            responseTeams: [
              { name: 'Economic Stabilization Team', leader: 'Dr. Marcus Rodriguez', status: 'deployed', effectiveness: 85 },
              { name: 'Market Intervention Team', leader: 'Sarah Williams', status: 'deployed', effectiveness: 78 },
              { name: 'Public Communication Team', leader: 'Jennifer Kim', status: 'standby', effectiveness: 92 }
            ],
            resourceAllocation: {
              personnel: 150,
              funding: 50000000000,
              equipment: ['Economic Modeling Systems', 'Communication Networks', 'Emergency Funds']
            },
            timeline: [
              { phase: 'Crisis Assessment', status: 'completed', completionDate: '2393-06-15T10:00:00Z' },
              { phase: 'Emergency Response', status: 'in_progress', completionDate: '2393-06-20T00:00:00Z' },
              { phase: 'Stabilization', status: 'planned', completionDate: '2393-07-01T00:00:00Z' },
              { phase: 'Recovery Planning', status: 'planned', completionDate: '2393-07-15T00:00:00Z' }
            ]
          },
          {
            id: 'response_2',
            crisisType: 'External Threat',
            status: 'escalating',
            declaredAt: '2393-06-14T16:30:00Z',
            responseLevel: 'delta',
            affectedSystems: ['Space Defense', 'Military Infrastructure', 'Intelligence Networks'],
            responseTeams: [
              { name: 'Space Defense Team', leader: 'Admiral James Wilson', status: 'deployed', effectiveness: 95 },
              { name: 'Intelligence Analysis Team', leader: 'Dr. Elena Vasquez', status: 'deployed', effectiveness: 88 },
              { name: 'Diplomatic Response Team', leader: 'Ambassador Robert Chen', status: 'deployed', effectiveness: 82 }
            ],
            resourceAllocation: {
              personnel: 500,
              funding: 200000000000,
              equipment: ['Space Defense Systems', 'Intelligence Networks', 'Diplomatic Channels']
            },
            timeline: [
              { phase: 'Threat Assessment', status: 'completed', completionDate: '2393-06-14T18:00:00Z' },
              { phase: 'Defense Mobilization', status: 'in_progress', completionDate: '2393-06-16T00:00:00Z' },
              { phase: 'Strategic Response', status: 'planned', completionDate: '2393-06-20T00:00:00Z' },
              { phase: 'Threat Neutralization', status: 'planned', completionDate: '2393-07-01T00:00:00Z' }
            ]
          }
        ],
        analytics: {
          totalEmergencies: 2,
          activeOverrides: 2,
          averageResponseTime: 15,
          constitutionalCompliance: 87,
          emergencyTypes: [
            { type: 'National Emergency', count: 1, percentage: 50.0 },
            { type: 'External Threat', count: 1, percentage: 50.0 }
          ],
          overrideLevels: [
            { level: 'Partial', count: 1, percentage: 50.0 },
            { level: 'Full', count: 1, percentage: 50.0 }
          ],
          responseEffectiveness: [
            { level: 'High (80-100%)', count: 1, percentage: 50.0 },
            { level: 'Medium (60-79%)', count: 1, percentage: 50.0 }
          ],
          restorationTrends: [
            { date: 'Jun 10', activeEmergencies: 0, resolvedEmergencies: 0, newDeclarations: 0 },
            { date: 'Jun 11', activeEmergencies: 0, resolvedEmergencies: 0, newDeclarations: 0 },
            { date: 'Jun 12', activeEmergencies: 0, resolvedEmergencies: 0, newDeclarations: 0 },
            { date: 'Jun 13', activeEmergencies: 0, resolvedEmergencies: 0, newDeclarations: 0 },
            { date: 'Jun 14', activeEmergencies: 1, resolvedEmergencies: 0, newDeclarations: 1 },
            { date: 'Jun 15', activeEmergencies: 2, resolvedEmergencies: 0, newDeclarations: 1 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverrideData();
  }, [fetchOverrideData]);

  const renderOverview = () => (
    <>
      {/* Emergency Overview - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🚨 Emergency & Override Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {overrideData?.analytics.totalEmergencies || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Emergencies</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {overrideData?.analytics.activeOverrides || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Overrides</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {overrideData?.analytics.averageResponseTime || 0}m
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Response Time</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {overrideData?.analytics.constitutionalCompliance || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Constitutional Compliance</div>
          </div>
        </div>
      </div>

      {/* Active Emergencies - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🚨 Active Emergency Declarations</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Declared By</th>
                <th>Override Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overrideData?.emergencyDeclarations.filter(emergency => emergency.status === 'active' || emergency.status === 'escalating').map(emergency => (
                <tr key={emergency.id}>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{emergency.type.replace('_', ' ').toUpperCase()}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {emergency.description.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getSeverityColor(emergency.severity),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getSeverityColor(emergency.severity) + '20'
                    }}>
                      {emergency.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(emergency.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(emergency.status) + '20'
                    }}>
                      {emergency.status}
                    </span>
                  </td>
                  <td>{emergency.declaredBy}</td>
                  <td>
                    <span style={{ 
                      color: getOverrideLevelColor(emergency.overrideLevel),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getOverrideLevelColor(emergency.overrideLevel) + '20'
                    }}>
                      {emergency.overrideLevel}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderEmergencies = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🚨 Emergency Declarations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('New Emergency')}>🚨 New Emergency</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Review Emergencies')}>🔍 Review</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Declared At</th>
                <th>Authority</th>
                <th>Override Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overrideData?.emergencyDeclarations.map(emergency => (
                <tr key={emergency.id}>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{emergency.type.replace('_', ' ').toUpperCase()}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {emergency.description.substring(0, 80)}...
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getSeverityColor(emergency.severity),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getSeverityColor(emergency.severity) + '20'
                    }}>
                      {emergency.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(emergency.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(emergency.status) + '20'
                    }}>
                      {emergency.status}
                    </span>
                  </td>
                  <td>{formatDate(emergency.declaredAt)}</td>
                  <td>{emergency.authority}</td>
                  <td>
                    <span style={{ 
                      color: getOverrideLevelColor(emergency.overrideLevel),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getOverrideLevelColor(emergency.overrideLevel) + '20'
                    }}>
                      {emergency.overrideLevel}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProcedures = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⚖️ Override Procedures</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('New Procedure')}>⚖️ New Procedure</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Review Procedures')}>🔍 Review</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Procedure Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Scope</th>
                <th>Constitutional Impact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overrideData?.overrideProcedures.map(procedure => (
                <tr key={procedure.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{procedure.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {procedure.justification.substring(0, 80)}...
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#374151',
                      color: '#f3f4f6'
                    }}>
                      {procedure.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(procedure.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(procedure.status) + '20'
                    }}>
                      {procedure.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#374151',
                      color: '#f3f4f6'
                    }}>
                      {procedure.scope}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: procedure.constitutionalImpact === 'minimal' ? '#10b981' : 
                             procedure.constitutionalImpact === 'moderate' ? '#f59e0b' : 
                             procedure.constitutionalImpact === 'significant' ? '#f97316' : '#ef4444',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: (procedure.constitutionalImpact === 'minimal' ? '#10b981' : 
                                     procedure.constitutionalImpact === 'moderate' ? '#f59e0b' : 
                                     procedure.constitutionalImpact === 'significant' ? '#f97316' : '#ef4444') + '20'
                    }}>
                      {procedure.constitutionalImpact}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPowers = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🔐 Emergency Powers</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Grant Power')}>🔐 Grant Power</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Review Powers')}>🔍 Review</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Power Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Scope</th>
                <th>Oversight Requirements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overrideData?.emergencyPowers.map(power => (
                <tr key={power.id}>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{power.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Authority: {power.authority}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#374151',
                      color: '#f3f4f6'
                    }}>
                      {power.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(power.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(power.status) + '20'
                    }}>
                      {power.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px', fontSize: '0.875rem' }}>
                      {power.scope}
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px', fontSize: '0.875rem' }}>
                      {power.oversightRequirements.join(', ')}
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">Manage</button>
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
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Override Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <PieChart
              data={overrideData?.analytics.emergencyTypes.map(type => ({
                label: type.type,
                value: type.count
              })) || []}
              title="Emergency Types Distribution"
              size={250}
              showLegend={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={overrideData?.analytics.overrideLevels.map(level => ({
                label: level.level,
                value: level.count
              })) || []}
              title="Override Levels Distribution"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Emergency Response Trends</h4>
          <div className="chart-container">
            <LineChart
              data={overrideData?.analytics.restorationTrends.map(trend => ({
                label: trend.date,
                value: trend.activeEmergencies,
                'Active Emergencies': trend.activeEmergencies,
                'Resolved Emergencies': trend.resolvedEmergencies,
                'New Declarations': trend.newDeclarations
              })) || []}
              title="Daily Emergency Status Trends"
              height={300}
              width={800}
              showTooltip={true}
            />
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
      onRefresh={fetchOverrideData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container government-theme">
        <div className="standard-dashboard">
          {!loading && !error && overrideData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'emergencies' && renderEmergencies()}
              {activeTab === 'procedures' && renderProcedures()}
              {activeTab === 'powers' && renderPowers()}
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
              {loading ? 'Loading override data...' : 'No override data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default InstitutionalOverrideScreen;
