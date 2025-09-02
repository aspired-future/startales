/**
 * Galaxy Wonders Screen - Galactic Wonders and Megastructures
 * 
 * This screen manages galactic wonders including:
 * - Wonder templates and available projects
 * - Construction progress and resource management
 * - Strategic benefits and cultural impact
 * - Construction history and achievements
 * - Wonder maintenance and upgrades
 * 
 * Uses the space theme with blue color scheme for galaxy aesthetics
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './GalaxyWondersScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface WonderTemplate {
  id: string;
  name: string;
  category: 'ancient' | 'knowledge' | 'spiritual' | 'engineering' | 'cosmic' | 'technological';
  description: string;
  baseCost: Record<string, number>;
  strategicBenefits: Record<string, number>;
  constructionTime: number;
  maintenanceCost: number;
  prestige: number;
  requirements: string[];
  unlockCondition: string;
}

interface Wonder {
  id: string;
  templateId: string;
  name: string;
  location: string;
  status: 'planning' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'maintenance';
  completionPercentage: number;
  currentPhase: string;
  investedResources: Record<string, number>;
  strategicBenefits: Record<string, number>;
  startDate: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  totalCost: number;
  currentBudget: number;
  workforce: number;
  quality: number;
}

interface ConstructionPhase {
  id: string;
  wonderId: string;
  phase: string;
  progressPercentage: number;
  resourcesInvested: Record<string, number>;
  workforce: number;
  startDate: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  challenges: string[];
  achievements: string[];
}

interface WonderMaintenance {
  id: string;
  wonderId: string;
  type: 'routine' | 'repair' | 'upgrade' | 'expansion';
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  cost: number;
  duration: number;
  startDate: string;
  completionDate?: string;
  assignedTeam: string;
}

interface GalaxyWondersData {
  overview: {
    totalWonders: number;
    completedWonders: number;
    underConstruction: number;
    totalPrestige: number;
    averageQuality: number;
    totalInvestment: number;
    culturalImpact: number;
    strategicValue: number;
  };
  templates: WonderTemplate[];
  wonders: Wonder[];
  constructionPhases: ConstructionPhase[];
  maintenance: WonderMaintenance[];
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    unlockDate?: string;
    prestige: number;
  }>;
}

const GalaxyWondersScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [wondersData, setWondersData] = useState<GalaxyWondersData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'construction' | 'maintenance' | 'achievements'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '🏛️' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'construction', label: 'Construction', icon: '🚧' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/wonders', description: 'Get wonders data' },
    { method: 'GET', path: '/api/wonders/templates', description: 'Get wonder templates' },
    { method: 'POST', path: '/api/wonders', description: 'Start wonder construction' }
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
      case 'in_progress': return '#3b82f6';
      case 'planning': return '#f59e0b';
      case 'paused': return '#ef4444';
      case 'cancelled': return '#6b7280';
      case 'maintenance': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ancient': return '#f59e0b';
      case 'knowledge': return '#3b82f6';
      case 'spiritual': return '#8b5cf6';
      case 'engineering': return '#ef4444';
      case 'cosmic': return '#10b981';
      case 'technological': return '#06b6d4';
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

  const fetchWondersData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/wonders');
      if (response.ok) {
        const data = await response.json();
        setWondersData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch wonders data:', err);
      // Use comprehensive mock data
      setWondersData({
        overview: {
          totalWonders: 47,
          completedWonders: 32,
          underConstruction: 8,
          totalPrestige: 2847,
          averageQuality: 87.3,
          totalInvestment: 1250000000000,
          culturalImpact: 92.5,
          strategicValue: 78.9
        },
        templates: [
          {
            id: 'temp-1',
            name: 'Galactic Pyramids',
            category: 'ancient',
            description: 'Massive stone monuments that demonstrate architectural mastery and provide lasting cultural benefits across the galaxy.',
            baseCost: { stone: 10000000000, gold: 5000000000, labor: 8000000000 },
            strategicBenefits: { culture: 25, tourism: 15, prestige: 30 },
            constructionTime: 120,
            maintenanceCost: 50000000,
            prestige: 100,
            requirements: ['Advanced Masonry', 'Large Population'],
            unlockCondition: 'Population > 1B, Culture > 50'
          },
          {
            id: 'temp-2',
            name: 'Galactic Archive',
            category: 'knowledge',
            description: 'A vast repository of galactic knowledge that accelerates research and educational advancement across star systems.',
            baseCost: { stone: 6000000000, gold: 8000000000, crystals: 2000000000 },
            strategicBenefits: { research: 40, education: 25, culture: 20 },
            constructionTime: 90,
            maintenanceCost: 75000000,
            prestige: 85,
            requirements: ['Advanced Computing', 'Research Centers'],
            unlockCondition: 'Research > 75, Education > 60'
          },
          {
            id: 'temp-3',
            name: 'Stellar Sanctuaries',
            category: 'spiritual',
            description: 'Magnificent spiritual structures that inspire galactic populations and provide guidance across the stars.',
            baseCost: { stone: 8000000000, gold: 6000000000, crystals: 3000000000 },
            strategicBenefits: { culture: 35, happiness: 20, stability: 15 },
            constructionTime: 75,
            maintenanceCost: 60000000,
            prestige: 70,
            requirements: ['Religious Centers', 'Cultural Unity'],
            unlockCondition: 'Happiness > 70, Stability > 80'
          },
          {
            id: 'temp-4',
            name: 'Galactic Colossus',
            category: 'engineering',
            description: 'A towering metallic monument that showcases galactic engineering prowess and serves as a beacon across star systems.',
            baseCost: { metal: 12000000000, energy: 8000000000, gold: 4000000000 },
            strategicBenefits: { prestige: 40, defense: 20, tourism: 25 },
            constructionTime: 150,
            maintenanceCost: 100000000,
            prestige: 120,
            requirements: ['Advanced Metallurgy', 'Energy Grid'],
            unlockCondition: 'Engineering > 85, Defense > 60'
          }
        ],
        wonders: [
          {
            id: 'wonder-1',
            templateId: 'temp-1',
            name: 'Galactic Pyramids of Alpha Centauri',
            location: 'Alpha Centauri Prime',
            status: 'completed',
            completionPercentage: 100,
            currentPhase: 'Operational',
            investedResources: { stone: 10000000000, gold: 5000000000, labor: 8000000000 },
            strategicBenefits: { culture: 25, tourism: 15, prestige: 30 },
            startDate: '2020-03-15',
            estimatedCompletion: '2022-03-15',
            actualCompletion: '2022-03-15',
            totalCost: 23000000000,
            currentBudget: 50000000,
            workforce: 50000,
            quality: 95
          },
          {
            id: 'wonder-2',
            templateId: 'temp-2',
            name: 'Galactic Archive of Vega',
            location: 'Vega System',
            status: 'in_progress',
            completionPercentage: 67,
            currentPhase: 'Knowledge Core Construction',
            investedResources: { stone: 4000000000, gold: 5400000000, crystals: 1340000000 },
            strategicBenefits: { research: 27, education: 17, culture: 13 },
            startDate: '2023-06-20',
            estimatedCompletion: '2024-09-20',
            totalCost: 16000000000,
            currentBudget: 3200000000,
            workforce: 35000,
            quality: 89
          },
          {
            id: 'wonder-3',
            templateId: 'temp-3',
            name: 'Stellar Sanctuary of Sirius',
            location: 'Sirius Prime',
            status: 'planning',
            completionPercentage: 0,
            currentPhase: 'Design Phase',
            investedResources: { stone: 0, gold: 0, crystals: 0 },
            strategicBenefits: { culture: 0, happiness: 0, stability: 0 },
            startDate: '2024-12-01',
            estimatedCompletion: '2026-03-01',
            totalCost: 17000000000,
            currentBudget: 17000000000,
            workforce: 0,
            quality: 0
          }
        ],
        constructionPhases: [
          {
            id: 'phase-1',
            wonderId: 'wonder-2',
            phase: 'Foundation',
            progressPercentage: 100,
            resourcesInvested: { stone: 2000000000, gold: 1000000000, crystals: 500000000 },
            workforce: 15000,
            startDate: '2023-06-20',
            estimatedCompletion: '2023-09-20',
            actualCompletion: '2023-09-20',
            challenges: ['Unstable ground conditions'],
            achievements: ['Completed ahead of schedule']
          },
          {
            id: 'phase-2',
            wonderId: 'wonder-2',
            phase: 'Knowledge Core Construction',
            progressPercentage: 67,
            resourcesInvested: { stone: 2000000000, gold: 4400000000, crystals: 840000000 },
            workforce: 35000,
            startDate: '2023-09-20',
            estimatedCompletion: '2024-06-20',
            challenges: ['Complex AI integration', 'Data security protocols'],
            achievements: ['AI core operational', 'Security systems active']
          }
        ],
        maintenance: [
          {
            id: 'maint-1',
            wonderId: 'wonder-1',
            type: 'routine',
            status: 'scheduled',
            priority: 'low',
            description: 'Annual structural integrity check and minor repairs',
            cost: 5000000,
            duration: 7,
            startDate: '2024-04-01',
            assignedTeam: 'Alpha Centauri Maintenance Crew'
          },
          {
            id: 'maint-2',
            wonderId: 'wonder-1',
            type: 'upgrade',
            status: 'in_progress',
            priority: 'medium',
            description: 'Tourism enhancement systems upgrade',
            cost: 25000000,
            duration: 21,
            startDate: '2024-03-15',
            estimatedCompletion: '2024-04-05',
            assignedTeam: 'Tourism Enhancement Team'
          }
        ],
        achievements: [
          {
            id: 'ach-1',
            name: 'First Wonder',
            description: 'Complete your first galactic wonder',
            unlocked: true,
            unlockDate: '2022-03-15',
            prestige: 50
          },
          {
            id: 'ach-2',
            name: 'Wonder Architect',
            description: 'Complete 5 galactic wonders',
            unlocked: false,
            prestige: 200
          },
          {
            id: 'ach-3',
            name: 'Cultural Beacon',
            description: 'Achieve 1000 total prestige from wonders',
            unlocked: false,
            prestige: 500
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWondersData();
  }, [fetchWondersData]);

  const renderOverview = () => (
    <>
      {/* Wonders Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🏛️ Galaxy Wonders Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Wonders</span>
            <span className="standard-metric-value">{wondersData?.overview.totalWonders}</span>
          </div>
          <div className="standard-metric">
            <span>Completed</span>
            <span className="standard-metric-value">{wondersData?.overview.completedWonders}</span>
          </div>
          <div className="standard-metric">
            <span>Under Construction</span>
            <span className="standard-metric-value">{wondersData?.overview.underConstruction}</span>
          </div>
          <div className="standard-metric">
            <span>Total Prestige</span>
            <span className="standard-metric-value">{wondersData?.overview.totalPrestige}</span>
          </div>
          <div className="standard-metric">
            <span>Average Quality</span>
            <span className="standard-metric-value">{wondersData?.overview.averageQuality}%</span>
          </div>
          <div className="standard-metric">
            <span>Total Investment</span>
            <span className="standard-metric-value">{formatNumber(wondersData?.overview.totalInvestment || 0)}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Wonders Analysis')}>Wonders Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Strategic Review')}>Strategic Review</button>
        </div>
      </div>

      {/* Cultural Impact - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🌟 Cultural & Strategic Impact</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Cultural Impact</span>
            <span className="standard-metric-value">{wondersData?.overview.culturalImpact}%</span>
          </div>
          <div className="standard-metric">
            <span>Strategic Value</span>
            <span className="standard-metric-value">{wondersData?.overview.strategicValue}%</span>
          </div>
          <div className="standard-metric">
            <span>Completion Rate</span>
            <span className="standard-metric-value">
              {wondersData?.overview.totalWonders ? Math.round((wondersData.overview.completedWonders / wondersData.overview.totalWonders) * 100) : 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Construction Efficiency</span>
            <span className="standard-metric-value">
              {wondersData?.overview.underConstruction ? Math.round((wondersData.overview.underConstruction / (wondersData.overview.totalWonders - wondersData.overview.completedWonders)) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Wonders Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel space-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Wonders Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <PieChart
                data={[
                  { label: 'Completed', value: wondersData?.overview.completedWonders || 0, color: '#10b981' },
                  { label: 'Under Construction', value: wondersData?.overview.underConstruction || 0, color: '#3b82f6' },
                  { label: 'Planning', value: (wondersData?.overview.totalWonders || 0) - (wondersData?.overview.completedWonders || 0) - (wondersData?.overview.underConstruction || 0), color: '#f59e0b' }
                ]}
                title="🏛️ Wonder Status Distribution"
                size={200}
                showLegend={true}
              />
            </div>
            <div className="chart-container">
              <BarChart
                data={wondersData?.wonders?.slice(0, 5).map(wonder => ({
                  label: wonder.name.substring(0, 15) + '...',
                  value: wonder.quality,
                  color: wonder.status === 'completed' ? '#10b981' : '#3b82f6'
                })) || []}
                title="⭐ Wonder Quality Scores"
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

  const renderTemplates = () => (
    <>
      {/* Wonder Templates - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📋 Available Wonder Templates</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('New Wonder')}>Start New Wonder</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Template Analysis')}>Template Analysis</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Wonder</span>
            <span>Category</span>
            <span>Base Cost</span>
            <span>Construction Time</span>
            <span>Prestige</span>
            <span>Strategic Benefits</span>
            <span>Actions</span>
          </div>
          {wondersData?.templates?.map(template => (
            <div key={template.id} className="table-row">
              <span>🏛️ {template.name}</span>
              <span style={{ color: getCategoryColor(template.category) }}>
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </span>
              <span>{formatNumber(Object.values(template.baseCost).reduce((a, b) => a + b, 0))}</span>
              <span>{template.constructionTime} days</span>
              <span>{template.prestige}</span>
              <span>{Object.keys(template.strategicBenefits).length} benefits</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Start</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderConstruction = () => (
    <>
      {/* Construction Progress - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🚧 Construction Progress</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Construction Report')}>Construction Report</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Resource Allocation')}>Resource Allocation</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Wonder</span>
            <span>Location</span>
            <span>Status</span>
            <span>Progress</span>
            <span>Current Phase</span>
            <span>Workforce</span>
            <span>Budget</span>
            <span>Actions</span>
          </div>
          {wondersData?.wonders?.map(wonder => (
            <div key={wonder.id} className="table-row">
              <span>🏛️ {wonder.name}</span>
              <span>⭐ {wonder.location}</span>
              <span style={{ color: getStatusColor(wonder.status) }}>
                {wonder.status.replace('_', ' ')}
              </span>
              <span>{wonder.completionPercentage}%</span>
              <span>{wonder.currentPhase}</span>
              <span>{wonder.workforce.toLocaleString()}</span>
              <span>{formatNumber(wonder.currentBudget)}</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Manage</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderMaintenance = () => (
    <>
      {/* Maintenance Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🔧 Wonder Maintenance</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Maintenance Schedule')}>Maintenance Schedule</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Upgrade Planning')}>Upgrade Planning</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Wonder</span>
            <span>Maintenance Type</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Cost</span>
            <span>Duration</span>
            <span>Team</span>
            <span>Actions</span>
          </div>
          {wondersData?.maintenance?.map(maint => (
            <div key={maint.id} className="table-row">
              <span>🏛️ {wondersData.wonders.find(w => w.id === maint.wonderId)?.name || 'Unknown'}</span>
              <span>{maint.type.charAt(0).toUpperCase() + maint.type.slice(1)}</span>
              <span style={{ color: getStatusColor(maint.status) }}>
                {maint.status.replace('_', ' ')}
              </span>
              <span style={{ color: getPriorityColor(maint.priority) }}>
                {maint.priority.charAt(0).toUpperCase() + maint.priority.slice(1)}
              </span>
              <span>{formatNumber(maint.cost)}</span>
              <span>{maint.duration} days</span>
              <span>{maint.assignedTeam}</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Review</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderAchievements = () => (
    <>
      {/* Achievements Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🏆 Wonder Achievements</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Achievement Analysis')}>Achievement Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Progress Report')}>Progress Report</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Achievement</span>
            <span>Description</span>
            <span>Status</span>
            <span>Prestige</span>
            <span>Unlock Date</span>
            <span>Actions</span>
          </div>
          {wondersData?.achievements?.map(achievement => (
            <div key={achievement.id} className="table-row">
              <span>🏆 {achievement.name}</span>
              <span>{achievement.description}</span>
              <span style={{ color: achievement.unlocked ? '#10b981' : '#6b7280' }}>
                {achievement.unlocked ? 'Unlocked' : 'Locked'}
              </span>
              <span>{achievement.prestige}</span>
              <span>{achievement.unlockDate || 'Not yet unlocked'}</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                  {achievement.unlocked ? 'View' : 'Progress'}
                </button>
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
      onRefresh={fetchWondersData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container space-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && wondersData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'templates' && renderTemplates()}
              {activeTab === 'construction' && renderConstruction()}
              {activeTab === 'maintenance' && renderMaintenance()}
              {activeTab === 'achievements' && renderAchievements()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading wonders data...' : 'No wonders data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default GalaxyWondersScreen;
