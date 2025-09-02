/**
 * Civilization Overview Screen - High-Level Civilization Management
 * 
 * This screen focuses on overall civilization management and overview including:
 * - Civilization status and metrics
 * - Population and demographics overview
 * - Economic and resource summary
 * - Government and political status
 * - Technology and development progress
 * 
 * Theme: Government (blue color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './CivilizationOverviewScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface CivilizationMetrics {
  id: string;
  name: string;
  population: number;
  growthRate: number;
  happiness: number;
  stability: number;
  technology: number;
  economy: number;
  military: number;
  culture: number;
  lastUpdated: string;
}

interface PopulationData {
  total: number;
  growth: number;
  density: number;
  distribution: Array<{
    ageGroup: string;
    count: number;
    percentage: number;
  }>;
  migration: {
    incoming: number;
    outgoing: number;
    net: number;
  };
  urbanization: number;
  education: number;
  health: number;
}

interface EconomicData {
  gdp: number;
  growth: number;
  inflation: number;
  unemployment: number;
  sectors: Array<{
    name: string;
    value: number;
    percentage: number;
    growth: number;
  }>;
  trade: {
    imports: number;
    exports: number;
    balance: number;
  };
  resources: Array<{
    name: string;
    quantity: number;
    value: number;
    status: 'abundant' | 'adequate' | 'scarce' | 'critical';
  }>;
}

interface GovernmentData {
  type: string;
  stability: number;
  approval: number;
  efficiency: number;
  policies: Array<{
    name: string;
    status: 'active' | 'pending' | 'failed' | 'expired';
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  departments: Array<{
    name: string;
    performance: number;
    budget: number;
    status: 'excellent' | 'good' | 'adequate' | 'poor';
  }>;
  elections: Array<{
    type: string;
    date: string;
    status: 'upcoming' | 'active' | 'completed';
    turnout: number;
  }>;
}

interface TechnologyData {
  overall: number;
  research: number;
  innovation: number;
  adoption: number;
  fields: Array<{
    name: string;
    level: number;
    progress: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  projects: Array<{
    name: string;
    status: 'research' | 'development' | 'testing' | 'deployment';
    progress: number;
    funding: number;
    expectedCompletion: string;
  }>;
  breakthroughs: Array<{
    name: string;
    date: string;
    impact: 'major' | 'moderate' | 'minor';
    description: string;
  }>;
}

interface CivilizationOverviewData {
  metrics: CivilizationMetrics;
  population: PopulationData;
  economy: EconomicData;
  government: GovernmentData;
  technology: TechnologyData;
}

const CivilizationOverviewScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [overviewData, setOverviewData] = useState<CivilizationOverviewData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'population' | 'economy' | 'government' | 'technology'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'population', label: 'Population', icon: '👥' },
    { id: 'economy', label: 'Economy', icon: '💰' },
    { id: 'government', label: 'Government', icon: '🏛️' },
    { id: 'technology', label: 'Technology', icon: '🔬' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/civilization/overview', description: 'Get civilization overview' },
    { method: 'GET', path: '/api/civilization/metrics', description: 'Get civilization metrics' },
    { method: 'GET', path: '/api/civilization/status', description: 'Get civilization status' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'adequate': return '#f59e0b';
      case 'poor': return '#ef4444';
      case 'abundant': return '#10b981';
      case 'adequate': return '#3b82f6';
      case 'scarce': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'neutral': return '#6b7280';
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'expired': return '#6b7280';
      case 'upcoming': return '#3b82f6';
      case 'completed': return '#6b7280';
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      case 'major': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'minor': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return '#10b981';
    if (value >= 60) return '#3b82f6';
    if (value >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const fetchOverviewData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/civilization/overview');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOverviewData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch civilization overview data:', err);
      // Use comprehensive mock data
      setOverviewData({
        metrics: {
          id: 'civ_1',
          name: 'Terran Federation',
          population: 12500000000,
          growthRate: 2.3,
          happiness: 78,
          stability: 85,
          technology: 72,
          economy: 89,
          military: 76,
          culture: 81,
          lastUpdated: '2393-06-15T10:00:00Z'
        },
        population: {
          total: 12500000000,
          growth: 2.3,
          density: 145.8,
          distribution: [
            { ageGroup: '0-14', count: 1875000000, percentage: 15 },
            { ageGroup: '15-24', count: 2500000000, percentage: 20 },
            { ageGroup: '25-54', count: 5000000000, percentage: 40 },
            { ageGroup: '55-64', count: 1250000000, percentage: 10 },
            { ageGroup: '65+', count: 1875000000, percentage: 15 }
          ],
          migration: {
            incoming: 1250000,
            outgoing: 875000,
            net: 375000
          },
          urbanization: 78.5,
          education: 85.2,
          health: 88.7
        },
        economy: {
          gdp: 4560000000000000,
          growth: 3.2,
          inflation: 2.1,
          unemployment: 4.8,
          sectors: [
            { name: 'Technology', value: 912000000000000, percentage: 20, growth: 4.5 },
            { name: 'Manufacturing', value: 820800000000000, percentage: 18, growth: 2.8 },
            { name: 'Services', value: 1236000000000000, percentage: 27, growth: 3.8 },
            { name: 'Agriculture', value: 456000000000000, percentage: 10, growth: 1.2 },
            { name: 'Energy', value: 638400000000000, percentage: 14, growth: 3.1 },
            { name: 'Other', value: 501600000000000, percentage: 11, growth: 2.5 }
          ],
          trade: {
            imports: 456000000000000,
            exports: 547200000000000,
            balance: 91200000000000
          },
          resources: [
            { name: 'Energy', quantity: 1000000, value: 456000000000000, status: 'abundant' },
            { name: 'Minerals', quantity: 500000, value: 228000000000000, status: 'adequate' },
            { name: 'Food', quantity: 2000000, value: 182400000000000, status: 'abundant' },
            { name: 'Water', quantity: 1500000, value: 136800000000000, status: 'adequate' },
            { name: 'Rare Earths', quantity: 50000, value: 91200000000000, status: 'scarce' }
          ]
        },
        government: {
          type: 'Federal Republic',
          stability: 85,
          approval: 72,
          efficiency: 78,
          policies: [
            { name: 'Universal Healthcare', status: 'active', impact: 'positive', description: 'Comprehensive healthcare coverage for all citizens' },
            { name: 'Green Energy Initiative', status: 'active', impact: 'positive', description: 'Transition to renewable energy sources' },
            { name: 'Education Reform', status: 'pending', impact: 'neutral', description: 'Modernization of educational systems' },
            { name: 'Tax Restructuring', status: 'active', impact: 'negative', description: 'New tax policies affecting middle class' }
          ],
          departments: [
            { name: 'Health & Human Services', performance: 92, budget: 456000000000000, status: 'excellent' },
            { name: 'Defense', performance: 88, budget: 638400000000000, status: 'good' },
            { name: 'Education', performance: 85, budget: 364800000000000, status: 'good' },
            { name: 'Transportation', performance: 78, budget: 273600000000000, status: 'adequate' },
            { name: 'Agriculture', performance: 72, budget: 182400000000000, status: 'adequate' }
          ],
          elections: [
            { type: 'Presidential', date: '2394-11-05', status: 'upcoming', turnout: 0 },
            { type: 'Congressional', date: '2393-11-07', status: 'completed', turnout: 68.5 },
            { type: 'Local', date: '2393-05-15', status: 'completed', turnout: 45.2 }
          ]
        },
        technology: {
          overall: 72,
          research: 78,
          innovation: 75,
          adoption: 68,
          fields: [
            { name: 'Artificial Intelligence', level: 8, progress: 85, priority: 'high' },
            { name: 'Quantum Computing', level: 7, progress: 72, priority: 'high' },
            { name: 'Biotechnology', level: 8, progress: 78, priority: 'medium' },
            { name: 'Space Technology', level: 9, progress: 92, priority: 'high' },
            { name: 'Renewable Energy', level: 8, progress: 88, priority: 'medium' },
            { name: 'Nanotechnology', level: 6, progress: 65, priority: 'low' }
          ],
          projects: [
            { name: 'Quantum Internet', status: 'development', progress: 65, funding: 45600000000000, expectedCompletion: '2395-03-15' },
            { name: 'AI Governance System', status: 'testing', progress: 88, funding: 22800000000000, expectedCompletion: '2393-12-01' },
            { name: 'Space Elevator', status: 'research', progress: 45, funding: 91200000000000, expectedCompletion: '2398-06-20' },
            { name: 'Fusion Power Grid', status: 'deployment', progress: 95, funding: 136800000000000, expectedCompletion: '2393-08-30' }
          ],
          breakthroughs: [
            { name: 'Quantum Entanglement Communication', date: '2393-05-20', impact: 'major', description: 'Revolutionary communication technology' },
            { name: 'Synthetic Organ Generation', date: '2393-04-15', impact: 'moderate', description: 'Advanced medical technology' },
            { name: 'Space Mining Automation', date: '2393-03-10', impact: 'moderate', description: 'Automated resource extraction' }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  const renderOverview = () => (
    <>
      {/* Civilization Metrics - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🏛️ Civilization Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {overviewData?.metrics.name || 'Unknown'}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Civilization Name</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {formatNumber(overviewData?.metrics.population || 0)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Population</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {formatCurrency(overviewData?.economy.gdp || 0)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total GDP</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {overviewData?.metrics.stability || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Stability</div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators - Full panel width */}
      <div className="standard-panel government-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Key Performance Indicators</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getPerformanceColor(overviewData?.metrics.happiness || 0), marginBottom: '0.5rem' }}>
              {overviewData?.metrics.happiness || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Happiness</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getPerformanceColor(overviewData?.metrics.economy || 0), marginBottom: '0.5rem' }}>
              {overviewData?.metrics.economy || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Economy</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getPerformanceColor(overviewData?.metrics.military || 0), marginBottom: '0.5rem' }}>
              {overviewData?.metrics.military || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Military</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getPerformanceColor(overviewData?.metrics.technology || 0), marginBottom: '0.5rem' }}>
              {overviewData?.metrics.technology || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Technology</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getPerformanceColor(overviewData?.metrics.culture || 0), marginBottom: '0.5rem' }}>
              {overviewData?.metrics.culture || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Culture</div>
          </div>
        </div>
      </div>
    </>
  );

  const renderPopulation = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👥 Population & Demographics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <PieChart
              data={overviewData?.population.distribution.map(group => ({
                name: group.ageGroup,
                value: group.count
              })) || []}
              title="Age Distribution"
              size={250}
              showLegend={true}
            />
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Population Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.population.growth || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Growth Rate</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.population.urbanization || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Urbanization</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.population.education || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Education Level</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.population.health || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Health Index</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEconomy = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>💰 Economic Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <PieChart
              data={overviewData?.economy.sectors.map(sector => ({
                name: sector.name,
                value: sector.value
              })) || []}
              title="Economic Sectors"
              size={250}
              showLegend={true}
            />
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Economic Indicators</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.economy.growth || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>GDP Growth</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.economy.inflation || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Inflation Rate</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.economy.unemployment || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Unemployment</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {formatCurrency(overviewData?.economy.trade.balance || 0)}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Trade Balance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGovernment = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🏛️ Government Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Government Metrics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.government.stability || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Stability</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.government.approval || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Approval Rating</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.government.efficiency || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Efficiency</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.government.type || 'Unknown'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Government Type</div>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Department Performance</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Performance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewData?.government.departments.map(dept => (
                    <tr key={dept.name}>
                      <td>{dept.name}</td>
                      <td>{dept.performance}%</td>
                      <td>
                        <span style={{ 
                          color: getStatusColor(dept.status),
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          backgroundColor: getStatusColor(dept.status) + '20'
                        }}>
                          {dept.status}
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
    </div>
  );

  const renderTechnology = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🔬 Technology & Innovation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Technology Metrics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.technology.overall || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Overall Level</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.technology.research || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Research</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.technology.innovation || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Innovation</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {overviewData?.technology.adoption || 0}%
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Adoption</div>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>Active Projects</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewData?.technology.projects.map(project => (
                    <tr key={project.name}>
                      <td>{project.name}</td>
                      <td>{project.progress}%</td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          backgroundColor: '#374151',
                          color: '#f3f4f6'
                        }}>
                          {project.status}
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
    </div>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchOverviewData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container government-theme">
        <div className="standard-dashboard">
          {!loading && !error && overviewData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'population' && renderPopulation()}
              {activeTab === 'economy' && renderEconomy()}
              {activeTab === 'government' && renderGovernment()}
              {activeTab === 'technology' && renderTechnology()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading civilization overview data...' : 'No civilization overview data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CivilizationOverviewScreen;
