/**
 * Constitution Screen - Constitutional Framework and Government Structure
 * 
 * This screen focuses on constitutional management including:
 * - Constitutional framework and founding principles
 * - Government structure and power distribution
 * - Political party system configuration
 * - Citizen rights and protections
 * - Constitutional amendments and evolution
 * 
 * Theme: Government (blue color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './ConstitutionScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Constitution {
  id: string;
  name: string;
  countryId: string;
  governmentType: string;
  preamble: string;
  foundingPrinciples: string[];
  politicalPartySystem: {
    type: 'multiparty' | 'two_party' | 'single_party' | 'no_party';
    description: string;
    constraints: any;
    advantages: string[];
    disadvantages: string[];
    stabilityFactors: {
      governmentStability: number;
      democraticLegitimacy: number;
      representationQuality: number;
      decisionMakingEfficiency: number;
    };
  };
  constitutionalPoints: {
    totalPoints: number;
    allocatedPoints: {
      executivePower: number;
      legislativePower: number;
      judicialPower: number;
      citizenRights: number;
      federalismBalance: number;
      emergencyPowers: number;
      amendmentDifficulty: number;
      partySystemFlexibility: number;
    };
  };
  ratificationStatus: string;
  publicSupport: number;
  adoptionDate: string;
  lastAmended?: string;
}

interface PartySystemOption {
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  stabilityFactors: {
    governmentStability: number;
    democraticLegitimacy: number;
    representationQuality: number;
    decisionMakingEfficiency: number;
  };
  recommendedFor: string[];
}

interface AIProvision {
  provisions: string[];
  protections: string[];
  limitations: string[];
  enforcementMechanisms: string[];
}

interface ConstitutionalAmendment {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedDate: string;
  status: 'proposed' | 'debating' | 'voting' | 'approved' | 'rejected';
  supportLevel: number;
  oppositionLevel: number;
  impact: string;
  requiredVotes: number;
  currentVotes: number;
}

interface ConstitutionalData {
  constitution: Constitution;
  partySystemOptions: Record<string, PartySystemOption>;
  aiProvisions: Record<string, AIProvision>;
  amendments: ConstitutionalAmendment[];
  analytics: {
    stabilityTrends: Array<{
      month: string;
      governmentStability: number;
      democraticLegitimacy: number;
      representationQuality: number;
      decisionMakingEfficiency: number;
    }>;
    publicOpinion: Array<{
      issue: string;
      support: number;
      opposition: number;
      neutral: number;
    }>;
  };
}

const ConstitutionScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [constitutionalData, setConstitutionalData] = useState<ConstitutionalData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'party-system' | 'rights' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartySystem, setSelectedPartySystem] = useState<string>('');
  const [showPartySystemModal, setShowPartySystemModal] = useState(false);
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);
  const [editingPreamble, setEditingPreamble] = useState<string>('');
  const [editingPrinciples, setEditingPrinciples] = useState<string[]>([]);
  const [pendingGovernmentType, setPendingGovernmentType] = useState<string>('');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📜' },
    { id: 'structure', label: 'Structure', icon: '🏛️' },
    { id: 'party-system', label: 'Party System', icon: '🎭' },
    { id: 'rights', label: 'Rights', icon: '⚖️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/constitution', description: 'Get constitutional data' },
    { method: 'GET', path: '/api/constitution/party-systems', description: 'Get party system options' },
    { method: 'POST', path: '/api/constitution/amendments', description: 'Propose constitutional amendment' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proposed': return '#f59e0b';
      case 'debating': return '#3b82f6';
      case 'voting': return '#8b5cf6';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPartySystemColor = (type: string) => {
    switch (type) {
      case 'multiparty': return '#10b981';
      case 'two_party': return '#3b82f6';
      case 'single_party': return '#f59e0b';
      case 'no_party': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const fetchConstitutionalData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/constitution');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConstitutionalData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch constitutional data:', err);
      // Use comprehensive mock data
      setConstitutionalData({
        constitution: {
          id: 'const-1',
          name: 'Terran Federation Constitution',
          countryId: 'terran-federation',
          governmentType: 'Parliamentary Democracy',
          preamble: 'We, the people of the Terran Federation, in order to form a more perfect union, establish justice, ensure domestic tranquility, provide for the common defense, promote the general welfare, and secure the blessings of liberty to ourselves and our posterity, do ordain and establish this Constitution.',
          foundingPrinciples: [
            'Democracy and representation',
            'Separation of powers',
            'Individual rights and freedoms',
            'Rule of law',
            'Scientific advancement',
            'Interstellar cooperation',
            'Environmental stewardship',
            'Cultural diversity'
          ],
          politicalPartySystem: {
            type: 'multiparty',
            description: 'Multi-party democratic system with proportional representation',
            constraints: { minParties: 3, maxParties: 12, coalitionRequired: true },
            advantages: ['Diverse representation', 'Policy variety', 'Coalition building'],
            disadvantages: ['Potential instability', 'Complex negotiations', 'Slower decision making'],
            stabilityFactors: {
              governmentStability: 78,
              democraticLegitimacy: 85,
              representationQuality: 82,
              decisionMakingEfficiency: 65
            }
          },
          constitutionalPoints: {
            totalPoints: 100,
            allocatedPoints: {
              executivePower: 25,
              legislativePower: 35,
              judicialPower: 20,
              citizenRights: 15,
              federalismBalance: 10,
              emergencyPowers: 5,
              amendmentDifficulty: 8,
              partySystemFlexibility: 12
            }
          },
          ratificationStatus: 'ratified',
          publicSupport: 78.5,
          adoptionDate: '2385',
          lastAmended: '2390'
        },
        partySystemOptions: {
          multiparty: {
            name: 'Multi-Party System',
            description: 'Democratic system with multiple political parties competing for representation',
            advantages: ['Diverse representation', 'Policy variety', 'Coalition building'],
            disadvantages: ['Potential instability', 'Complex negotiations', 'Slower decision making'],
            stabilityFactors: {
              governmentStability: 78,
              democraticLegitimacy: 85,
              representationQuality: 82,
              decisionMakingEfficiency: 65
            },
            recommendedFor: ['Diverse populations', 'Complex societies', 'Democratic traditions']
          },
          two_party: {
            name: 'Two-Party System',
            description: 'Democratic system with two major political parties',
            advantages: ['Stable governance', 'Clear choices', 'Efficient decision making'],
            disadvantages: ['Limited options', 'Polarization', 'Excluded minorities'],
            stabilityFactors: {
              governmentStability: 85,
              democraticLegitimacy: 75,
              representationQuality: 60,
              decisionMakingEfficiency: 80
            },
            recommendedFor: ['Stable societies', 'Clear ideological divisions', 'Efficiency focus']
          },
          single_party: {
            name: 'Single-Party System',
            description: 'System with one dominant political party',
            advantages: ['Stability', 'Efficiency', 'Unity'],
            disadvantages: ['Limited choice', 'Potential corruption', 'Suppressed opposition'],
            stabilityFactors: {
              governmentStability: 90,
              democraticLegitimacy: 40,
              representationQuality: 30,
              decisionMakingEfficiency: 90
            },
            recommendedFor: ['Crisis situations', 'Unity requirements', 'Efficiency focus']
          }
        },
        aiProvisions: {
          governance: {
            provisions: ['AI-assisted policy analysis', 'Automated regulatory compliance', 'Predictive governance modeling'],
            protections: ['Human oversight required', 'Transparency in AI decisions', 'Appeal mechanisms for AI rulings'],
            limitations: ['No AI in judicial decisions', 'Human approval for major policies', 'Regular AI system audits'],
            enforcementMechanisms: ['Independent AI ethics board', 'Regular human review', 'Public transparency reports']
          },
          rights: {
            provisions: ['AI-powered rights monitoring', 'Automated discrimination detection', 'Predictive rights violations'],
            protections: ['Human rights oversight', 'AI decision transparency', 'Human appeal rights'],
            limitations: ['No AI in final rights decisions', 'Human rights court oversight', 'Regular human review'],
            enforcementMechanisms: ['Human rights ombudsman', 'AI ethics committee', 'Public rights reporting']
          }
        },
        amendments: [
          {
            id: 'amend-1',
            title: 'AI Governance Framework',
            description: 'Establish comprehensive framework for AI involvement in governance',
            proposedBy: 'Dr. Elena Petrova',
            proposedDate: '2392-06-15',
            status: 'voting',
            supportLevel: 72.3,
            oppositionLevel: 18.7,
            impact: 'High - Will establish AI governance principles',
            requiredVotes: 67,
            currentVotes: 45
          },
          {
            id: 'amend-2',
            title: 'Environmental Rights',
            description: 'Add environmental protection as fundamental constitutional right',
            proposedBy: 'Senator James Thompson',
            proposedDate: '2392-05-20',
            status: 'debating',
            supportLevel: 68.9,
            oppositionLevel: 22.1,
            impact: 'Medium - Will expand citizen rights',
            requiredVotes: 67,
            currentVotes: 0
          },
          {
            id: 'amend-3',
            title: 'Interstellar Citizenship',
            description: 'Extend citizenship rights to non-Earth colonies',
            proposedBy: 'Commissioner Lisa Park',
            proposedDate: '2392-04-10',
            status: 'approved',
            supportLevel: 81.2,
            oppositionLevel: 12.8,
            impact: 'High - Will expand federation scope',
            requiredVotes: 67,
            currentVotes: 78
          }
        ],
        analytics: {
          stabilityTrends: [
            { month: 'Jan 2393', governmentStability: 76, democraticLegitimacy: 83, representationQuality: 80, decisionMakingEfficiency: 63 },
            { month: 'Feb 2393', governmentStability: 77, democraticLegitimacy: 84, representationQuality: 81, decisionMakingEfficiency: 64 },
            { month: 'Mar 2393', governmentStability: 78, democraticLegitimacy: 85, representationQuality: 82, decisionMakingEfficiency: 65 },
            { month: 'Apr 2393', governmentStability: 79, democraticLegitimacy: 86, representationQuality: 83, decisionMakingEfficiency: 66 },
            { month: 'May 2393', governmentStability: 80, democraticLegitimacy: 87, representationQuality: 84, decisionMakingEfficiency: 67 },
            { month: 'Jun 2393', governmentStability: 81, democraticLegitimacy: 88, representationQuality: 85, decisionMakingEfficiency: 68 }
          ],
          publicOpinion: [
            { issue: 'AI Governance', support: 72.3, opposition: 18.7, neutral: 9.0 },
            { issue: 'Environmental Rights', support: 68.9, opposition: 22.1, neutral: 9.0 },
            { issue: 'Interstellar Citizenship', support: 81.2, opposition: 12.8, neutral: 6.0 },
            { issue: 'Party System Reform', support: 45.6, opposition: 38.9, neutral: 15.5 },
            { issue: 'Constitutional Amendments', support: 67.8, opposition: 25.3, neutral: 6.9 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConstitutionalData();
  }, [fetchConstitutionalData]);

  const renderOverview = () => (
    <>
      {/* Constitutional Overview - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📜 Constitutional Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Constitution Name</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.name}</span>
          </div>
          <div className="standard-metric">
            <span>Government Type</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.governmentType}</span>
          </div>
          <div className="standard-metric">
            <span>Public Support</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.publicSupport}%</span>
          </div>
          <div className="standard-metric">
            <span>Ratification Status</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.ratificationStatus}</span>
          </div>
          <div className="standard-metric">
            <span>Adoption Date</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.adoptionDate}</span>
          </div>
          <div className="standard-metric">
            <span>Last Amended</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.lastAmended || 'Never'}</span>
          </div>
          <div className="standard-metric">
            <span>Party System</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.politicalPartySystem.type.replace('_', ' ')}</span>
          </div>
          <div className="standard-metric">
            <span>Total Points</span>
            <span className="standard-metric-value">{constitutionalData?.constitution.constitutionalPoints.totalPoints}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Edit Constitution')}>✏️ Edit Constitution</button>
          <button className="standard-btn government-theme" onClick={() => console.log('Propose Amendment')}>📝 Propose Amendment</button>
        </div>
      </div>

      {/* Founding Principles - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🌟 Founding Principles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {constitutionalData?.constitution.foundingPrinciples.map((principle, index) => (
            <div key={index} style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '0.5rem',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>• {principle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preamble - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel government-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📖 Preamble</h3>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'rgba(59, 130, 246, 0.05)', 
            borderRadius: '0.5rem',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            fontStyle: 'italic',
            lineHeight: '1.6',
            fontSize: '1.1rem'
          }}>
            "{constitutionalData?.constitution.preamble}"
          </div>
        </div>
      </div>
    </>
  );

  const renderStructure = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🏛️ Constitutional Structure</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Power Distribution</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Points</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Executive Power</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.executivePower}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.executivePower || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Legislative Power</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.legislativePower}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.legislativePower || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Judicial Power</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.judicialPower}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.judicialPower || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Citizen Rights</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.citizenRights}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.citizenRights || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>System Balance</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Balance Factor</th>
                    <th>Points</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Federalism Balance</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.federalismBalance}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.federalismBalance || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Emergency Powers</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.emergencyPowers}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.emergencyPowers || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Amendment Difficulty</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.amendmentDifficulty}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.amendmentDifficulty || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>Party System Flexibility</td>
                    <td>{constitutionalData?.constitution.constitutionalPoints.allocatedPoints.partySystemFlexibility}</td>
                    <td>{((constitutionalData?.constitution.constitutionalPoints.allocatedPoints.partySystemFlexibility || 0) / (constitutionalData?.constitution.constitutionalPoints.totalPoints || 1) * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPartySystem = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🎭 Political Party System</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => console.log('Modify Party System')}>⚙️ Modify Party System</button>
          <button className="standard-btn government-theme" onClick={() => console.log('View Options')}>👁️ View Options</button>
        </div>
        
        {/* Current Party System */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Current System: {constitutionalData?.constitution.politicalPartySystem.type.replace('_', ' ')}</h4>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '0.5rem',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <p style={{ marginBottom: '1rem' }}>{constitutionalData?.constitution.politicalPartySystem.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <h5 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>Advantages:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {constitutionalData?.constitution.politicalPartySystem.advantages.map((adv, index) => (
                    <li key={index}>{adv}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>Disadvantages:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {constitutionalData?.constitution.politicalPartySystem.disadvantages.map((dis, index) => (
                    <li key={index}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stability Factors */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Stability Factors</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Government Stability</td>
                  <td>{constitutionalData?.constitution.politicalPartySystem.stabilityFactors.governmentStability}%</td>
                  <td>
                    <span style={{ 
                      color: (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.governmentStability || 0) >= 80 ? '#10b981' : 
                             (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.governmentStability || 0) >= 60 ? '#f59e0b' : '#ef4444'
                    }}>
                      {(constitutionalData?.constitution.politicalPartySystem.stabilityFactors.governmentStability || 0) >= 80 ? 'Excellent' : 
                       (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.governmentStability || 0) >= 60 ? 'Good' : 'Poor'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Democratic Legitimacy</td>
                  <td>{constitutionalData?.constitution.politicalPartySystem.stabilityFactors.democraticLegitimacy}%</td>
                  <td>
                    <span style={{ 
                      color: (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.democraticLegitimacy || 0) >= 80 ? '#10b981' : 
                             (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.democraticLegitimacy || 0) >= 60 ? '#f59e0b' : '#ef4444'
                    }}>
                      {(constitutionalData?.constitution.politicalPartySystem.stabilityFactors.democraticLegitimacy || 0) >= 80 ? 'Excellent' : 
                       (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.democraticLegitimacy || 0) >= 60 ? 'Good' : 'Poor'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Representation Quality</td>
                  <td>{constitutionalData?.constitution.politicalPartySystem.stabilityFactors.representationQuality}%</td>
                  <td>
                    <span style={{ 
                      color: (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.representationQuality || 0) >= 80 ? '#10b981' : 
                             (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.representationQuality || 0) >= 60 ? '#f59e0b' : '#ef4444'
                    }}>
                      {(constitutionalData?.constitution.politicalPartySystem.stabilityFactors.representationQuality || 0) >= 80 ? 'Excellent' : 
                       (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.representationQuality || 0) >= 60 ? 'Good' : 'Poor'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Decision Making Efficiency</td>
                  <td>{constitutionalData?.constitution.politicalPartySystem.stabilityFactors.decisionMakingEfficiency}%</td>
                  <td>
                    <span style={{ 
                      color: (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.decisionMakingEfficiency || 0) >= 80 ? '#10b981' : 
                             (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.decisionMakingEfficiency || 0) >= 60 ? '#f59e0b' : '#ef4444'
                    }}>
                      {(constitutionalData?.constitution.politicalPartySystem.stabilityFactors.decisionMakingEfficiency || 0) >= 80 ? 'Excellent' : 
                       (constitutionalData?.constitution.politicalPartySystem.stabilityFactors.decisionMakingEfficiency || 0) >= 60 ? 'Good' : 'Poor'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRights = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⚖️ Constitutional Rights & Protections</h3>
        
        {/* AI Provisions */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🤖 AI Governance Provisions</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <h5 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>Governance AI</h5>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '0.5rem',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <h6 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>Provisions:</h6>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  {constitutionalData?.aiProvisions.governance.provisions.map((provision, index) => (
                    <li key={index}>{provision}</li>
                  ))}
                </ul>
                <h6 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>Protections:</h6>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {constitutionalData?.aiProvisions.governance.protections.map((protection, index) => (
                    <li key={index}>{protection}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h5 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>Rights AI</h5>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '0.5rem',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <h6 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>Provisions:</h6>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  {constitutionalData?.aiProvisions.rights.provisions.map((provision, index) => (
                    <li key={index}>{provision}</li>
                  ))}
                </ul>
                <h6 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>Protections:</h6>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {constitutionalData?.aiProvisions.rights.protections.map((protection, index) => (
                    <li key={index}>{protection}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Amendments */}
        <div>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📝 Pending Amendments</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Support</th>
                  <th>Opposition</th>
                  <th>Impact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {constitutionalData?.amendments.map(amendment => (
                  <tr key={amendment.id}>
                    <td>{amendment.title}</td>
                    <td>
                      <span style={{ 
                        color: getStatusColor(amendment.status),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        backgroundColor: getStatusColor(amendment.status) + '20'
                      }}>
                        {amendment.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: amendment.supportLevel >= 70 ? '#10b981' : amendment.supportLevel >= 50 ? '#f59e0b' : '#ef4444' }}>
                        {amendment.supportLevel}%
                      </span>
                    </td>
                    <td>
                      <span style={{ color: amendment.oppositionLevel >= 50 ? '#ef4444' : amendment.oppositionLevel >= 30 ? '#f59e0b' : '#10b981' }}>
                        {amendment.oppositionLevel}%
                      </span>
                    </td>
                    <td>{amendment.impact}</td>
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
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📈 Constitutional Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={constitutionalData?.analytics.stabilityTrends.map(trend => ({
                name: trend.month,
                'Government Stability': trend.governmentStability,
                'Democratic Legitimacy': trend.democraticLegitimacy,
                'Representation Quality': trend.representationQuality,
                'Decision Making Efficiency': trend.decisionMakingEfficiency
              })) || []}
              title="Stability Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={constitutionalData?.analytics.publicOpinion.map(issue => ({
                name: issue.issue,
                value: issue.support
              })) || []}
              title="Public Opinion on Constitutional Issues"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Public Opinion Breakdown</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Support</th>
                  <th>Opposition</th>
                  <th>Neutral</th>
                  <th>Net Support</th>
                </tr>
              </thead>
              <tbody>
                {constitutionalData?.analytics.publicOpinion.map(issue => (
                  <tr key={issue.issue}>
                    <td>{issue.issue}</td>
                    <td style={{ color: '#10b981' }}>{issue.support}%</td>
                    <td style={{ color: '#ef4444' }}>{issue.opposition}%</td>
                    <td style={{ color: '#6b7280' }}>{issue.neutral}%</td>
                    <td style={{ 
                      color: (issue.support - issue.opposition) >= 20 ? '#10b981' : 
                             (issue.support - issue.opposition) >= 0 ? '#f59e0b' : '#ef4444'
                    }}>
                      {issue.support - issue.opposition >= 0 ? '+' : ''}{issue.support - issue.opposition}%
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
      onRefresh={fetchConstitutionalData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container government-theme">
        <div className="standard-dashboard">
          {!loading && !error && constitutionalData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'structure' && renderStructure()}
              {activeTab === 'party-system' && renderPartySystem()}
              {activeTab === 'rights' && renderRights()}
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
              {loading ? 'Loading constitutional data...' : 'No constitutional data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default ConstitutionScreen;
