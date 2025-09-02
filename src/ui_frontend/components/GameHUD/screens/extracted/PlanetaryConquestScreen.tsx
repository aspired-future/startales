/**
 * Planetary Conquest Screen - Military Expansion and Territory Control
 * 
 * This screen focuses on planetary conquest and military expansion operations including:
 * - Military campaigns and battle planning
 * - Territory acquisition and control
 * - Strategic resource management
 * - Military intelligence and reconnaissance
 * - Conquest analytics and performance metrics
 * 
 * Theme: Security (red color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './PlanetaryConquestScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface MilitaryCampaign {
  id: string;
  name: string;
  targetPlanet: string;
  status: 'planning' | 'active' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  commander: string;
  forces: {
    infantry: number;
    armor: number;
    artillery: number;
    airSupport: number;
    orbitalSupport: number;
  };
  estimatedDuration: number;
  startDate: string;
  completionDate?: string;
  casualties: {
    friendly: number;
    enemy: number;
    civilian: number;
  };
  resources: {
    fuel: number;
    ammunition: number;
    medical: number;
    food: number;
  };
  strategicValue: number;
  riskAssessment: 'low' | 'medium' | 'high' | 'extreme';
  notes: string;
}

interface ConquestTarget {
  id: string;
  name: string;
  system: string;
  type: 'terrestrial' | 'gas_giant' | 'ice_world' | 'desert' | 'ocean' | 'volcanic';
  population: number;
  civilization: string;
  defenses: {
    planetaryShields: boolean;
    groundForces: number;
    orbitalDefenses: number;
    spaceFleet: number;
  };
  resources: string[];
  strategicImportance: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  estimatedResistance: number;
  estimatedCasualties: number;
  estimatedDuration: number;
  status: 'unexplored' | 'scouted' | 'targeted' | 'under_attack' | 'conquered' | 'resistance';
  lastIntelligence: string;
}

interface MilitaryForces {
  id: string;
  name: string;
  type: 'infantry' | 'armor' | 'artillery' | 'air' | 'orbital' | 'special_forces';
  strength: number;
  experience: number;
  equipment: string[];
  location: string;
  status: 'ready' | 'deployed' | 'training' | 'maintenance' | 'recovering';
  commander: string;
  specializations: string[];
  lastTraining: string;
  combatEfficiency: number;
}

interface ConquestAnalytics {
  overview: {
    totalCampaigns: number;
    activeCampaigns: number;
    successfulConquests: number;
    totalTerritories: number;
    militaryStrength: number;
    averageCampaignDuration: number;
  };
  campaignPerformance: Array<{
    date: string;
    campaignsLaunched: number;
    campaignsCompleted: number;
    successRate: number;
    averageCasualties: number;
    territoryGained: number;
  }>;
  targetAnalysis: Array<{
    type: string;
    count: number;
    difficulty: string;
    strategicValue: number;
    estimatedResistance: number;
  }>;
  forceDeployment: Array<{
    type: string;
    totalStrength: number;
    deployed: number;
    ready: number;
    efficiency: number;
  }>;
}

interface ConquestData {
  campaigns: MilitaryCampaign[];
  targets: ConquestTarget[];
  forces: MilitaryForces[];
  analytics: ConquestAnalytics;
}

const PlanetaryConquestScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [conquestData, setConquestData] = useState<ConquestData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'targets' | 'forces' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<MilitaryCampaign | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'campaigns', label: 'Campaigns', icon: '⚔️' },
    { id: 'targets', label: 'Targets', icon: '🎯' },
    { id: 'forces', label: 'Forces', icon: '🛡️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/conquest/campaigns', description: 'Get military campaigns' },
    { method: 'GET', path: '/api/conquest/targets', description: 'Get conquest targets' },
    { method: 'GET', path: '/api/conquest/forces', description: 'Get military forces' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#3b82f6';
      case 'active': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      case 'unexplored': return '#6b7280';
      case 'scouted': return '#3b82f6';
      case 'targeted': return '#f59e0b';
      case 'under_attack': return '#ef4444';
      case 'conquered': return '#10b981';
      case 'resistance': return '#f97316';
      case 'ready': return '#10b981';
      case 'deployed': return '#f59e0b';
      case 'training': return '#3b82f6';
      case 'maintenance': return '#8b5cf6';
      case 'recovering': return '#ef4444';
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'hard': return '#f97316';
      case 'extreme': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'extreme': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchConquestData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/conquest/campaigns');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConquestData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch conquest data:', err);
      // Use comprehensive mock data
      setConquestData({
        campaigns: [
          {
            id: 'campaign_1',
            name: 'Operation Desert Storm',
            targetPlanet: 'Arrakis Prime',
            status: 'active',
            priority: 'high',
            commander: 'General Alexander Kane',
            forces: {
              infantry: 50000,
              armor: 2500,
              artillery: 500,
              airSupport: 200,
              orbitalSupport: 15
            },
            estimatedDuration: 45,
            startDate: '2393-06-01T00:00:00Z',
            casualties: {
              friendly: 1250,
              enemy: 8500,
              civilian: 300
            },
            resources: {
              fuel: 15000,
              ammunition: 25000,
              medical: 5000,
              food: 10000
            },
            strategicValue: 8.5,
            riskAssessment: 'medium',
            notes: 'Desert warfare conditions require specialized equipment and tactics.'
          },
          {
            id: 'campaign_2',
            name: 'Ice World Liberation',
            targetPlanet: 'Frozen Haven',
            status: 'planning',
            priority: 'medium',
            commander: 'Colonel Sarah Chen',
            forces: {
              infantry: 30000,
              armor: 1500,
              artillery: 300,
              airSupport: 150,
              orbitalSupport: 10
            },
            estimatedDuration: 30,
            startDate: '2393-06-20T00:00:00Z',
            casualties: {
              friendly: 0,
              enemy: 0,
              civilian: 0
            },
            resources: {
              fuel: 12000,
              ammunition: 18000,
              medical: 4000,
              food: 8000
            },
            strategicValue: 6.8,
            riskAssessment: 'low',
            notes: 'Cold weather gear and specialized vehicles required.'
          },
          {
            id: 'campaign_3',
            name: 'Gas Giant Outpost',
            targetPlanet: 'Jupiter Station',
            status: 'completed',
            priority: 'critical',
            commander: 'Admiral Marcus Rodriguez',
            forces: {
              infantry: 15000,
              armor: 500,
              artillery: 100,
              airSupport: 50,
              orbitalSupport: 25
            },
            estimatedDuration: 15,
            startDate: '2393-05-15T00:00:00Z',
            completionDate: '2393-05-30T00:00:00Z',
            casualties: {
              friendly: 500,
              enemy: 2000,
              civilian: 0
            },
            resources: {
              fuel: 8000,
              ammunition: 12000,
              medical: 2500,
              food: 5000
            },
            strategicValue: 9.2,
            riskAssessment: 'high',
            notes: 'Successfully secured orbital control and eliminated enemy resistance.'
          }
        ],
        targets: [
          {
            id: 'target_1',
            name: 'Arrakis Prime',
            system: 'Canopus',
            type: 'desert',
            population: 25000000,
            civilization: 'Sand Nomads',
            defenses: {
              planetaryShields: true,
              groundForces: 75000,
              orbitalDefenses: 20,
              spaceFleet: 45
            },
            resources: ['Spice', 'Minerals', 'Water'],
            strategicImportance: 8.5,
            difficulty: 'hard',
            estimatedResistance: 7.5,
            estimatedCasualties: 5000,
            estimatedDuration: 45,
            status: 'under_attack',
            lastIntelligence: '2393-06-15T10:00:00Z'
          },
          {
            id: 'target_2',
            name: 'Frozen Haven',
            system: 'Polaris',
            type: 'ice_world',
            population: 15000000,
            civilization: 'Ice Miners',
            defenses: {
              planetaryShields: false,
              groundForces: 45000,
              orbitalDefenses: 15,
              spaceFleet: 30
            },
            resources: ['Ice', 'Minerals', 'Hydrocarbons'],
            strategicImportance: 6.8,
            difficulty: 'moderate',
            estimatedResistance: 5.2,
            estimatedCasualties: 2500,
            estimatedDuration: 30,
            status: 'targeted',
            lastIntelligence: '2393-06-14T15:30:00Z'
          },
          {
            id: 'target_3',
            name: 'Ocean World Alpha',
            system: 'Aquarius',
            type: 'ocean',
            population: 35000000,
            civilization: 'Aqua Collective',
            defenses: {
              planetaryShields: true,
              groundForces: 95000,
              orbitalDefenses: 25,
              spaceFleet: 60
            },
            resources: ['Water', 'Marine Life', 'Minerals'],
            strategicImportance: 7.8,
            difficulty: 'extreme',
            estimatedResistance: 9.1,
            estimatedCasualties: 8500,
            estimatedDuration: 60,
            status: 'scouted',
            lastIntelligence: '2393-06-13T12:00:00Z'
          }
        ],
        forces: [
          {
            id: 'force_1',
            name: '1st Terran Infantry Division',
            type: 'infantry',
            strength: 15000,
            experience: 85,
            equipment: ['Advanced Rifles', 'Body Armor', 'Combat Drones'],
            location: 'Training Base Alpha',
            status: 'ready',
            commander: 'Colonel James Wilson',
            specializations: ['Urban Warfare', 'Desert Operations', 'Counter-Insurgency'],
            lastTraining: '2393-06-10T00:00:00Z',
            combatEfficiency: 92
          },
          {
            id: 'force_2',
            name: '2nd Armored Regiment',
            type: 'armor',
            strength: 5000,
            experience: 78,
            equipment: ['Main Battle Tanks', 'APCs', 'Mobile Artillery'],
            location: 'Deployed - Arrakis Prime',
            status: 'deployed',
            commander: 'Major Elena Vasquez',
            specializations: ['Desert Warfare', 'Blitzkrieg Tactics', 'Armor Coordination'],
            lastTraining: '2393-05-25T00:00:00Z',
            combatEfficiency: 88
          },
          {
            id: 'force_3',
            name: 'Orbital Strike Group',
            type: 'orbital',
            strength: 2500,
            experience: 92,
            equipment: ['Orbital Platforms', 'Missile Systems', 'Electronic Warfare'],
            location: 'High Orbit - Arrakis Prime',
            status: 'deployed',
            commander: 'Captain David Kim',
            specializations: ['Orbital Bombardment', 'Space Superiority', 'Electronic Warfare'],
            lastTraining: '2393-06-01T00:00:00Z',
            combatEfficiency: 95
          }
        ],
        analytics: {
          overview: {
            totalCampaigns: 15,
            activeCampaigns: 3,
            successfulConquests: 12,
            totalTerritories: 8,
            militaryStrength: 125000,
            averageCampaignDuration: 35
          },
          campaignPerformance: [
            { date: 'Jun 10', campaignsLaunched: 15, campaignsCompleted: 12, successRate: 80, averageCasualties: 2500, territoryGained: 8 },
            { date: 'Jun 11', campaignsLaunched: 16, campaignsCompleted: 12, successRate: 75, averageCasualties: 2800, territoryGained: 8 },
            { date: 'Jun 12', campaignsLaunched: 16, campaignsCompleted: 12, successRate: 75, averageCasualties: 2600, territoryGained: 8 },
            { date: 'Jun 13', campaignsLaunched: 17, campaignsCompleted: 13, successRate: 76, averageCasualties: 2400, territoryGained: 9 },
            { date: 'Jun 14', campaignsLaunched: 18, campaignsCompleted: 13, successRate: 72, averageCasualties: 3000, territoryGained: 9 },
            { date: 'Jun 15', campaignsLaunched: 18, campaignsCompleted: 13, successRate: 72, averageCasualties: 2900, territoryGained: 9 }
          ],
          targetAnalysis: [
            { type: 'Terrestrial', count: 8, difficulty: 'moderate', strategicValue: 7.8, estimatedResistance: 6.2 },
            { type: 'Gas Giant', count: 3, difficulty: 'hard', strategicValue: 8.5, estimatedResistance: 7.8 },
            { type: 'Ice World', count: 5, difficulty: 'moderate', strategicValue: 6.5, estimatedResistance: 5.4 },
            { type: 'Desert', count: 4, difficulty: 'hard', strategicValue: 7.2, estimatedResistance: 7.1 },
            { type: 'Ocean', count: 2, difficulty: 'extreme', strategicValue: 8.8, estimatedResistance: 9.2 },
            { type: 'Volcanic', count: 3, difficulty: 'hard', strategicValue: 7.5, estimatedResistance: 7.3 }
          ],
          forceDeployment: [
            { type: 'Infantry', totalStrength: 75000, deployed: 45000, ready: 30000, efficiency: 88 },
            { type: 'Armor', totalStrength: 25000, deployed: 15000, ready: 10000, efficiency: 85 },
            { type: 'Artillery', totalStrength: 15000, deployed: 8000, ready: 7000, efficiency: 82 },
            { type: 'Air Support', totalStrength: 12000, deployed: 8000, ready: 4000, efficiency: 90 },
            { type: 'Orbital', totalStrength: 8000, deployed: 6000, ready: 2000, efficiency: 94 },
            { type: 'Special Forces', totalStrength: 5000, deployed: 3000, ready: 2000, efficiency: 96 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConquestData();
  }, [fetchConquestData]);

  const renderOverview = () => (
    <>
      {/* Conquest Overview - Full panel width */}
      <div className="standard-panel security-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>⚔️ Conquest Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
              {conquestData?.analytics.overview.totalCampaigns || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Campaigns</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
              {conquestData?.analytics.overview.activeCampaigns || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Campaigns</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
              {conquestData?.analytics.overview.successfulConquests || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Successful Conquests</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
              {formatNumber(conquestData?.analytics.overview.militaryStrength || 0)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Military Strength</div>
          </div>
        </div>
      </div>

      {/* Active Campaigns - Full panel width */}
      <div className="standard-panel security-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🔥 Active Campaigns</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Target</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Commander</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conquestData?.campaigns.filter(c => c.status === 'active').map(campaign => (
                <tr key={campaign.id}>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{campaign.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Started: {new Date(campaign.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td>{campaign.targetPlanet}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(campaign.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(campaign.status) + '20'
                    }}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getPriorityColor(campaign.priority),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getPriorityColor(campaign.priority) + '20'
                    }}>
                      {campaign.priority}
                    </span>
                  </td>
                  <td>{campaign.commander}</td>
                  <td>
                    <div style={{ width: '100px', backgroundColor: '#374151', borderRadius: '0.25rem', height: '8px' }}>
                      <div style={{ 
                        width: '60%', 
                        backgroundColor: '#ef4444', 
                        height: '100%', 
                        borderRadius: '0.25rem' 
                      }}></div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>60% Complete</div>
                  </td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderCampaigns = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>⚔️ Military Campaigns</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('New Campaign')}>⚔️ New Campaign</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Review Plans')}>📋 Review</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target Planet</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Commander</th>
                <th>Forces</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conquestData?.campaigns.map(campaign => (
                <tr key={campaign.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{campaign.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Strategic Value: {campaign.strategicValue}/10
                      </div>
                    </div>
                  </td>
                  <td>{campaign.targetPlanet}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(campaign.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(campaign.status) + '20'
                    }}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getPriorityColor(campaign.priority),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getPriorityColor(campaign.priority) + '20'
                    }}>
                      {campaign.priority}
                    </span>
                  </td>
                  <td>{campaign.commander}</td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div>Infantry: {formatNumber(campaign.forces.infantry)}</div>
                      <div>Armor: {formatNumber(campaign.forces.armor)}</div>
                      <div>Artillery: {formatNumber(campaign.forces.artillery)}</div>
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn security-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTargets = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🎯 Conquest Targets</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('New Target')}>🎯 New Target</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Scout Targets')}>🔍 Scout</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Target Name</th>
                <th>System</th>
                <th>Type</th>
                <th>Population</th>
                <th>Defenses</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conquestData?.targets.map(target => (
                <tr key={target.id}>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{target.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Strategic: {target.strategicImportance}/10
                      </div>
                    </div>
                  </td>
                  <td>{target.system}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#374151',
                      color: '#f3f4f6'
                    }}>
                      {target.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatNumber(target.population)}</td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div>Shields: {target.defenses.planetaryShields ? '✅' : '❌'}</div>
                      <div>Ground: {formatNumber(target.defenses.groundForces)}</div>
                      <div>Orbital: {target.defenses.orbitalDefenses}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getDifficultyColor(target.difficulty),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getDifficultyColor(target.difficulty) + '20'
                    }}>
                      {target.difficulty}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn security-theme">Analyze</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderForces = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🛡️ Military Forces</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('New Force')}>🛡️ New Force</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Train Forces')}>🎯 Train</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Force Name</th>
                <th>Type</th>
                <th>Strength</th>
                <th>Status</th>
                <th>Commander</th>
                <th>Efficiency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conquestData?.forces.map(force => (
                <tr key={force.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{force.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Experience: {force.experience}/100
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
                      {force.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatNumber(force.strength)}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(force.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(force.status) + '20'
                    }}>
                      {force.status}
                    </span>
                  </td>
                  <td>{force.commander}</td>
                  <td>
                    <div style={{ width: '80px', backgroundColor: '#374151', borderRadius: '0.25rem', height: '8px' }}>
                      <div style={{ 
                        width: `${force.combatEfficiency}%`, 
                        backgroundColor: '#ef4444', 
                        height: '100%', 
                        borderRadius: '0.25rem' 
                      }}></div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{force.combatEfficiency}%</div>
                  </td>
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

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📊 Conquest Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={conquestData?.analytics.campaignPerformance.map(perf => ({
                name: perf.date,
                'Campaigns Launched': perf.campaignsLaunched,
                'Campaigns Completed': perf.campaignsCompleted,
                'Success Rate': perf.successRate,
                'Average Casualties': perf.averageCasualties
              })) || []}
              title="Campaign Performance Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={conquestData?.analytics.targetAnalysis.map(target => ({
                name: target.type,
                value: target.count
              })) || []}
              title="Target Distribution by Type"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ef4444' }}>Force Deployment Analysis</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Force Type</th>
                  <th>Total Strength</th>
                  <th>Deployed</th>
                  <th>Ready</th>
                  <th>Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {conquestData?.analytics.forceDeployment.map(force => (
                  <tr key={force.type}>
                    <td>{force.type}</td>
                    <td>{formatNumber(force.totalStrength)}</td>
                    <td>{formatNumber(force.deployed)}</td>
                    <td>{formatNumber(force.ready)}</td>
                    <td>{force.efficiency}%</td>
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
      onRefresh={fetchConquestData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container security-theme">
        <div className="standard-dashboard">
          {!loading && !error && conquestData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'campaigns' && renderCampaigns()}
              {activeTab === 'targets' && renderTargets()}
              {activeTab === 'forces' && renderForces()}
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
              {loading ? 'Loading conquest data...' : 'No conquest data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default PlanetaryConquestScreen;
