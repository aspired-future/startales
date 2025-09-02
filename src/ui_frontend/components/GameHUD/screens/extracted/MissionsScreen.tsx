/**
 * Missions Screen - Galactic Mission Management and Operations
 * 
 * This screen manages galactic missions including:
 * - Available missions and mission types
 * - Active mission tracking and progress
 * - Mission creation and template management
 * - Mission analytics and performance metrics
 * - Resource allocation and team assignments
 * 
 * Uses the space theme with blue color scheme for galaxy aesthetics
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './MissionsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'exploration' | 'diplomacy' | 'military' | 'research' | 'trade' | 'special' | 'intelligence' | 'colonization';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'available' | 'active' | 'completed' | 'failed' | 'expired' | 'paused' | 'cancelled';
  difficulty: number;
  estimatedDuration: number;
  actualDuration?: number;
  rewards: {
    credits: number;
    experience: number;
    resources: Record<string, number>;
    technology: string[];
    reputation: number;
  };
  requirements: {
    level: number;
    skills: string[];
    resources: Record<string, number>;
    technology: string[];
    reputation: number;
  };
  objectives: Array<{
    id: string;
    description: string;
    completed: boolean;
    progress: number;
    target: number;
    unit: string;
  }>;
  progress: number;
  assignedTo?: string;
  team?: string[];
  startDate?: string;
  deadline?: string;
  location?: string;
  faction?: string;
  cost: number;
  risk: number;
  successProbability: number;
}

interface MissionType {
  id: string;
  name: string;
  description: string;
  category: string;
  typicalRewards: string[];
  commonRequirements: string[];
  averageDifficulty: number;
  successRate: number;
  averageDuration: number;
  costRange: { min: number; max: number };
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

interface MissionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  objectives: string[];
  estimatedCost: number;
  estimatedDuration: number;
  difficulty: number;
  requirements: string[];
  rewards: string[];
  tags: string[];
}

interface MissionAnalytics {
  overview: {
    totalMissions: number;
    activeMissions: number;
    completedMissions: number;
    successRate: number;
    averageDuration: number;
    totalRewards: number;
    totalCost: number;
    efficiency: number;
  };
  categoryPerformance: Array<{
    category: string;
    successRate: number;
    averageDuration: number;
    totalMissions: number;
    totalRewards: number;
  }>;
  priorityDistribution: Array<{
    priority: string;
    count: number;
    successRate: number;
    averageCost: number;
  }>;
  resourceEfficiency: {
    creditsPerMission: number;
    experiencePerMission: number;
    technologyUnlocked: number;
    reputationGained: number;
  };
}

interface MissionsData {
  missions: Mission[];
  missionTypes: MissionType[];
  templates: MissionTemplate[];
  analytics: MissionAnalytics;
  teams: Array<{
    id: string;
    name: string;
    specialization: string;
    members: number;
    currentMissions: number;
    successRate: number;
    availability: boolean;
  }>;
}

const MissionsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [missionsData, setMissionsData] = useState<MissionsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'available' | 'active' | 'templates' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'available', label: 'Available', icon: '🎯' },
    { id: 'active', label: 'Active', icon: '🚀' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/missions', description: 'Get missions data' },
    { method: 'GET', path: '/api/missions/types', description: 'Get mission types' },
    { method: 'POST', path: '/api/missions', description: 'Create new mission' }
  ];

  // Utility functions
  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'active': return '#3b82f6';
      case 'available': return '#f59e0b';
      case 'paused': return '#8b5cf6';
      case 'failed': return '#ef4444';
      case 'expired': return '#6b7280';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exploration': return '#3b82f6';
      case 'diplomacy': return '#10b981';
      case 'military': return '#ef4444';
      case 'research': return '#8b5cf6';
      case 'trade': return '#f59e0b';
      case 'intelligence': return '#06b6d4';
      case 'colonization': return '#84cc16';
      case 'special': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'extreme': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchMissionsData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/missions');
      if (response.ok) {
        const data = await response.json();
        setMissionsData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch missions data:', err);
      // Use comprehensive mock data
      setMissionsData({
        missions: [
          {
            id: 'mission-1',
            title: 'First Contact Protocol',
            description: 'Establish diplomatic relations with the newly discovered Zephyrian civilization',
            category: 'diplomacy',
            priority: 'critical',
            status: 'active',
            difficulty: 8,
            estimatedDuration: 45,
            actualDuration: 23,
            rewards: {
              credits: 50000000,
              experience: 2500,
              resources: { 'diplomatic_credits': 1000, 'cultural_artifacts': 5 },
              technology: ['Advanced Communication Protocols', 'Cultural Database'],
              reputation: 500
            },
            requirements: {
              level: 15,
              skills: ['Diplomacy', 'Cultural Studies', 'Linguistics'],
              resources: { 'credits': 10000000, 'cultural_goods': 100 },
              technology: ['Universal Translator', 'Cultural Database'],
              reputation: 200
            },
            objectives: [
              { id: 'obj-1', description: 'Establish communication channel', completed: true, progress: 100, target: 1, unit: 'channel' },
              { id: 'obj-2', description: 'Exchange cultural information', completed: true, progress: 100, target: 10, unit: 'exchanges' },
              { id: 'obj-3', description: 'Negotiate trade agreement', completed: false, progress: 75, target: 1, unit: 'agreement' }
            ],
            progress: 92,
            assignedTo: 'Diplomatic Team Alpha',
            team: ['Ambassador Chen', 'Cultural Specialist Rodriguez', 'Linguist Patel'],
            startDate: '2024-02-15',
            deadline: '2024-04-01',
            location: 'Zephyrian Homeworld',
            faction: 'Zephyrian Collective',
            cost: 15000000,
            risk: 6,
            successProbability: 85
          },
          {
            id: 'mission-2',
            title: 'Deep Space Anomaly Investigation',
            description: 'Investigate unusual energy readings from the Beta Quadrant anomaly',
            category: 'exploration',
            priority: 'high',
            status: 'available',
            difficulty: 7,
            estimatedDuration: 30,
            rewards: {
              credits: 35000000,
              experience: 1800,
              resources: { 'exotic_matter': 50, 'energy_crystals': 200 },
              technology: ['Anomaly Detection Systems', 'Energy Manipulation'],
              reputation: 300
            },
            requirements: {
              level: 12,
              skills: ['Exploration', 'Science', 'Engineering'],
              resources: { 'credits': 8000000, 'scientific_equipment': 50 },
              technology: ['Advanced Sensors', 'Energy Shields'],
              reputation: 150
            },
            objectives: [
              { id: 'obj-1', description: 'Reach anomaly location', completed: false, progress: 0, target: 1, unit: 'location' },
              { id: 'obj-2', description: 'Deploy investigation probes', completed: false, progress: 0, target: 5, unit: 'probes' },
              { id: 'obj-3', description: 'Analyze energy patterns', completed: false, progress: 0, target: 10, unit: 'patterns' }
            ],
            progress: 0,
            location: 'Beta Quadrant Anomaly',
            cost: 12000000,
            risk: 8,
            successProbability: 72
          },
          {
            id: 'mission-3',
            title: 'Advanced AI Research Initiative',
            description: 'Develop next-generation artificial intelligence for autonomous exploration',
            category: 'research',
            priority: 'high',
            status: 'completed',
            difficulty: 9,
            estimatedDuration: 90,
            actualDuration: 87,
            rewards: {
              credits: 75000000,
              experience: 4000,
              resources: { 'research_data': 1000, 'ai_cores': 10 },
              technology: ['Advanced AI Framework', 'Autonomous Systems', 'Neural Networks'],
              reputation: 800
            },
            requirements: {
              level: 20,
              skills: ['AI Development', 'Computer Science', 'Mathematics'],
              resources: { 'credits': 20000000, 'computing_resources': 1000 },
              technology: ['Quantum Computing', 'Neural Interface'],
              reputation: 400
            },
            objectives: [
              { id: 'obj-1', description: 'Design AI architecture', completed: true, progress: 100, target: 1, unit: 'architecture' },
              { id: 'obj-2', description: 'Train neural networks', completed: true, progress: 100, target: 100, unit: 'networks' },
              { id: 'obj-3', description: 'Test autonomous systems', completed: true, progress: 100, target: 50, unit: 'tests' }
            ],
            progress: 100,
            assignedTo: 'AI Research Division',
            team: ['Dr. Kim', 'Dr. Johnson', 'Dr. Martinez'],
            startDate: '2023-09-01',
            deadline: '2023-12-01',
            actualCompletion: '2023-11-27',
            cost: 25000000,
            risk: 4,
            successProbability: 78
          }
        ],
        missionTypes: [
          {
            id: 'type-1',
            name: 'Exploration Mission',
            description: 'Discover new star systems, planets, and anomalies',
            category: 'exploration',
            typicalRewards: ['Credits', 'Experience', 'Resources', 'Technology', 'Reputation'],
            commonRequirements: ['Exploration Skills', 'Scientific Equipment', 'Energy Resources'],
            averageDifficulty: 6,
            successRate: 85,
            averageDuration: 25,
            costRange: { min: 5000000, max: 25000000 },
            riskLevel: 'medium'
          },
          {
            id: 'type-2',
            name: 'Diplomatic Mission',
            description: 'Establish relations with alien civilizations and negotiate agreements',
            category: 'diplomacy',
            typicalRewards: ['Credits', 'Experience', 'Cultural Artifacts', 'Trade Agreements', 'Reputation'],
            commonRequirements: ['Diplomatic Skills', 'Cultural Knowledge', 'Communication Technology'],
            averageDifficulty: 7,
            successRate: 78,
            averageDuration: 40,
            costRange: { min: 8000000, max: 35000000 },
            riskLevel: 'medium'
          },
          {
            id: 'type-3',
            name: 'Military Operation',
            description: 'Defend territory, eliminate threats, and secure strategic locations',
            category: 'military',
            typicalRewards: ['Credits', 'Experience', 'Military Equipment', 'Territory Control', 'Reputation'],
            commonRequirements: ['Combat Skills', 'Military Equipment', 'Strategic Resources'],
            averageDifficulty: 8,
            successRate: 72,
            averageDuration: 35,
            costRange: { min: 15000000, max: 50000000 },
            riskLevel: 'high'
          },
          {
            id: 'type-4',
            name: 'Research Project',
            description: 'Develop new technologies and advance scientific knowledge',
            category: 'research',
            typicalRewards: ['Credits', 'Experience', 'Technology', 'Research Data', 'Reputation'],
            commonRequirements: ['Research Skills', 'Laboratory Equipment', 'Computing Resources'],
            averageDifficulty: 7,
            successRate: 80,
            averageDuration: 60,
            costRange: { min: 10000000, max: 40000000 },
            riskLevel: 'low'
          }
        ],
        templates: [
          {
            id: 'template-1',
            name: 'Standard Exploration Template',
            category: 'exploration',
            description: 'Basic template for exploring new star systems and planets',
            objectives: ['Reach destination', 'Deploy sensors', 'Collect data', 'Return safely'],
            estimatedCost: 8000000,
            estimatedDuration: 20,
            difficulty: 5,
            requirements: ['Exploration ship', 'Basic sensors', 'Fuel'],
            rewards: ['Credits', 'Experience', 'Resources'],
            tags: ['exploration', 'basic', 'low-risk']
          },
          {
            id: 'template-2',
            name: 'First Contact Template',
            category: 'diplomacy',
            description: 'Template for establishing first contact with new civilizations',
            objectives: ['Establish communication', 'Exchange information', 'Assess intentions', 'Propose relations'],
            estimatedCost: 15000000,
            estimatedDuration: 45,
            difficulty: 8,
            requirements: ['Diplomatic team', 'Translation technology', 'Cultural database'],
            rewards: ['Credits', 'Experience', 'Cultural artifacts', 'Reputation'],
            tags: ['diplomacy', 'first-contact', 'high-value']
          }
        ],
        analytics: {
          overview: {
            totalMissions: 47,
            activeMissions: 12,
            completedMissions: 32,
            successRate: 87.2,
            averageDuration: 42.3,
            totalRewards: 1250000000,
            totalCost: 450000000,
            efficiency: 78.5
          },
          categoryPerformance: [
            { category: 'Exploration', successRate: 92, averageDuration: 28, totalMissions: 15, totalRewards: 380000000 },
            { category: 'Diplomacy', successRate: 78, averageDuration: 45, totalMissions: 12, totalRewards: 420000000 },
            { category: 'Military', successRate: 85, averageDuration: 35, totalMissions: 8, totalRewards: 280000000 },
            { category: 'Research', successRate: 90, averageDuration: 65, totalMissions: 12, totalRewards: 170000000 }
          ],
          priorityDistribution: [
            { priority: 'Critical', count: 8, successRate: 95, averageCost: 35000000 },
            { priority: 'High', count: 15, successRate: 87, averageCost: 25000000 },
            { priority: 'Medium', count: 18, successRate: 82, averageCost: 18000000 },
            { priority: 'Low', count: 6, successRate: 75, averageCost: 12000000 }
          ],
          resourceEfficiency: {
            creditsPerMission: 2800000,
            experiencePerMission: 4750,
            technologyUnlocked: 23,
            reputationGained: 12500
          }
        },
        teams: [
          {
            id: 'team-1',
            name: 'Diplomatic Team Alpha',
            specialization: 'Diplomacy',
            members: 5,
            currentMissions: 2,
            successRate: 85,
            availability: true
          },
          {
            id: 'team-2',
            name: 'Exploration Squad Beta',
            specialization: 'Exploration',
            members: 8,
            currentMissions: 3,
            successRate: 92,
            availability: true
          },
          {
            id: 'team-3',
            name: 'Research Division Gamma',
            specialization: 'Research',
            members: 12,
            currentMissions: 4,
            successRate: 88,
            availability: false
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissionsData();
  }, [fetchMissionsData]);

  const renderOverview = () => (
    <>
      {/* Missions Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Missions Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Missions</span>
            <span className="standard-metric-value">{missionsData?.analytics.overview.totalMissions}</span>
          </div>
          <div className="standard-metric">
            <span>Active Missions</span>
            <span className="standard-metric-value">{missionsData?.analytics.overview.activeMissions}</span>
          </div>
          <div className="standard-metric">
            <span>Success Rate</span>
            <span className="standard-metric-value">{missionsData?.analytics.overview.successRate}%</span>
          </div>
          <div className="standard-metric">
            <span>Average Duration</span>
            <span className="standard-metric-value">{missionsData?.analytics.overview.averageDuration} days</span>
          </div>
          <div className="standard-metric">
            <span>Total Rewards</span>
            <span className="standard-metric-value">{formatNumber(missionsData?.analytics.overview.totalRewards || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Efficiency</span>
            <span className="standard-metric-value">{missionsData?.analytics.overview.efficiency}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Mission Analysis')}>Mission Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Strategic Review')}>Strategic Review</button>
        </div>
      </div>

      {/* Available Teams - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👥 Available Teams</h3>
        <div className="standard-data-table">
          <div className="table-header">
            <span>Team</span>
            <span>Specialization</span>
            <span>Members</span>
            <span>Current Missions</span>
            <span>Success Rate</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {missionsData?.teams?.map(team => (
            <div key={team.id} className="table-row">
              <span>👥 {team.name}</span>
              <span>{team.specialization}</span>
              <span>{team.members}</span>
              <span>{team.currentMissions}</span>
              <span>{team.successRate}%</span>
              <span style={{ color: team.availability ? '#10b981' : '#6b7280' }}>
                {team.availability ? 'Available' : 'Busy'}
              </span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Assign</button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel space-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📈 Mission Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <PieChart
                data={missionsData?.analytics.categoryPerformance.map(cat => ({
                  label: cat.category,
                  value: cat.totalMissions,
                  color: getCategoryColor(cat.category.toLowerCase())
                })) || []}
                title="🎯 Mission Distribution by Category"
                size={200}
                showLegend={true}
              />
            </div>
            <div className="chart-container">
              <BarChart
                data={missionsData?.analytics.priorityDistribution.map(pri => ({
                  label: pri.priority,
                  value: pri.successRate,
                  color: getPriorityColor(pri.priority.toLowerCase())
                })) || []}
                title="⭐ Success Rate by Priority"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAvailable = () => (
    <>
      {/* Available Missions - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🎯 Available Missions</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Mission Filter')}>Filter Missions</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Quick Assign')}>Quick Assign</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Mission</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Difficulty</span>
            <span>Duration</span>
            <span>Rewards</span>
            <span>Risk</span>
            <span>Actions</span>
          </div>
          {missionsData?.missions?.filter(m => m.status === 'available').map(mission => (
            <div key={mission.id} className="table-row">
              <span>🎯 {mission.title}</span>
              <span style={{ color: getCategoryColor(mission.category) }}>
                {mission.category.charAt(0).toUpperCase() + mission.category.slice(1)}
              </span>
              <span style={{ color: getPriorityColor(mission.priority) }}>
                {mission.priority.charAt(0).toUpperCase() + mission.priority.slice(1)}
              </span>
              <span>{mission.difficulty}/10</span>
              <span>{mission.estimatedDuration} days</span>
              <span>{formatNumber(mission.rewards.credits)}</span>
              <span style={{ color: getRiskColor(mission.risk <= 3 ? 'low' : mission.risk <= 6 ? 'medium' : 'high') }}>
                {mission.risk}/10
              </span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Accept</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderActive = () => (
    <>
      {/* Active Missions - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🚀 Active Missions</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Mission Update')}>Update Progress</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Resource Allocation')}>Allocate Resources</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Mission</span>
            <span>Category</span>
            <span>Progress</span>
            <span>Current Phase</span>
            <span>Team</span>
            <span>Deadline</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {missionsData?.missions?.filter(m => m.status === 'active').map(mission => (
            <div key={mission.id} className="table-row">
              <span>🚀 {mission.title}</span>
              <span style={{ color: getCategoryColor(mission.category) }}>
                {mission.category.charAt(0).toUpperCase() + mission.category.slice(1)}
              </span>
              <span>{mission.progress}%</span>
              <span>{mission.objectives.find(o => !o.completed)?.description || 'Finalizing'}</span>
              <span>{mission.assignedTo || 'Unassigned'}</span>
              <span>{mission.deadline}</span>
              <span style={{ color: getStatusColor(mission.status) }}>
                {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
              </span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Manage</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderTemplates = () => (
    <>
      {/* Mission Templates - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📋 Mission Templates</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('New Template')}>Create Template</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Template Analysis')}>Template Analysis</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Template</span>
            <span>Category</span>
            <span>Difficulty</span>
            <span>Duration</span>
            <span>Cost</span>
            <span>Objectives</span>
            <span>Actions</span>
          </div>
          {missionsData?.templates?.map(template => (
            <div key={template.id} className="table-row">
              <span>📋 {template.name}</span>
              <span style={{ color: getCategoryColor(template.category) }}>
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </span>
              <span>{template.difficulty}/10</span>
              <span>{template.estimatedDuration} days</span>
              <span>{formatNumber(template.estimatedCost)}</span>
              <span>{template.objectives.length} objectives</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Use</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderAnalytics = () => (
    <>
      {/* Detailed Analytics - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📈 Detailed Mission Analytics</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Export Report')}>Export Report</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Trend Analysis')}>Trend Analysis</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Category</span>
            <span>Success Rate</span>
            <span>Average Duration</span>
            <span>Total Missions</span>
            <span>Total Rewards</span>
            <span>Efficiency</span>
            <span>Actions</span>
          </div>
          {missionsData?.analytics.categoryPerformance?.map(cat => (
            <div key={cat.category} className="table-row">
              <span style={{ color: getCategoryColor(cat.category.toLowerCase()) }}>
                {cat.category}
              </span>
              <span>{cat.successRate}%</span>
              <span>{cat.averageDuration} days</span>
              <span>{cat.totalMissions}</span>
              <span>{formatNumber(cat.totalRewards)}</span>
              <span>{Math.round((cat.successRate * cat.totalMissions) / 100)}</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Analyze</button>
              </span>
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
      onRefresh={fetchMissionsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container space-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && missionsData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'available' && renderAvailable()}
              {activeTab === 'active' && renderActive()}
              {activeTab === 'templates' && renderTemplates()}
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
              {loading ? 'Loading missions data...' : 'No missions data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default MissionsScreen;
