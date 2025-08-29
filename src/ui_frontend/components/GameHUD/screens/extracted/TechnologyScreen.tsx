import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './TechnologyScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Technology {
  id: string;
  name: string;
  category: string;
  level: string;
  complexity: number;
  operationalStatus: 'operational' | 'research' | 'development' | 'testing' | 'obsolete';
  securityLevel: number;
  implementationProgress: number;
  description: string;
}

interface TechnologyData {
  technologies: Technology[];
  analytics: {
    totalTechnologies: number;
    activeResearch: number;
    technologyTransfers: number;
  };
}

// Define tabs for the header (max 5 tabs)
const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'technologies', label: 'Technologies', icon: '🔬' },
  { id: 'research', label: 'Research', icon: '🧪' },
  { id: 'transfers', label: 'Transfers', icon: '🔄' }
];

const TechnologyScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [technologyData, setTechnologyData] = useState<TechnologyData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'technologies' | 'research' | 'transfers'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/technology/technologies', description: 'Get all technologies' },
    { method: 'POST', path: '/api/technology/technologies', description: 'Create new technology' }
  ];

  const fetchTechnologyData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      setTechnologyData({
        technologies: [
          {
            id: 'tech-1',
            name: 'Quantum Computing Matrix',
            category: 'Computing',
            level: 'Advanced',
            complexity: 9,
            operationalStatus: 'operational',
            securityLevel: 8,
            implementationProgress: 95,
            description: 'Advanced quantum computing system for complex calculations'
          },
          {
            id: 'tech-2',
            name: 'Neural Interface Protocol',
            category: 'Biotechnology',
            level: 'Experimental',
            complexity: 10,
            operationalStatus: 'research',
            securityLevel: 9,
            implementationProgress: 45,
            description: 'Direct neural interface for enhanced human-computer interaction'
          },
          {
            id: 'tech-3',
            name: 'Plasma Energy Conduits',
            category: 'Energy',
            level: 'Advanced',
            complexity: 7,
            operationalStatus: 'development',
            securityLevel: 6,
            implementationProgress: 78,
            description: 'High-efficiency plasma energy transmission system'
          }
        ],
        analytics: {
          totalTechnologies: 12,
          activeResearch: 8,
          technologyTransfers: 3
        }
      });
    } catch (err) {
      console.error('Failed to fetch technology data:', err);
      setError('Failed to load technology data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologyData();
  }, [fetchTechnologyData]);

  // Debug logging
  useEffect(() => {
    console.log('Technology Screen State:', {
      loading,
      error,
      activeTab,
      hasData: technologyData && technologyData.technologies.length > 0,
      technologiesCount: technologyData?.technologies?.length || 0
    });
  }, [loading, error, activeTab, technologyData]);

  const renderOverview = () => (
    <>
      {/* Technology Overview - First card in 2-column grid */}
      <div className="standard-panel academic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>📊 Technology Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="standard-metric">
            <span>Total Technologies</span>
            <span className="standard-metric-value">{technologyData?.analytics.totalTechnologies || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Active Research</span>
            <span className="standard-metric-value">{technologyData?.analytics.activeResearch || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Research Projects</span>
            <span className="standard-metric-value">{technologyData?.analytics.activeResearch || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Technology Transfers</span>
            <span className="standard-metric-value">{technologyData?.analytics.technologyTransfers || 0}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn academic-theme" onClick={() => console.log('Generate Technology Report')}>Generate Report</button>
          <button className="standard-btn academic-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
        </div>
      </div>

      {/* Technology Chart - Second card in 2-column grid */}
      <div className="standard-panel academic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>📈 Technology Progress</h3>
        <div className="chart-container">
          <LineChart
            data={[
              { label: '2019', value: (technologyData?.analytics.totalTechnologies || 0) * 0.75 },
              { label: '2020', value: (technologyData?.analytics.totalTechnologies || 0) * 0.82 },
              { label: '2021', value: (technologyData?.analytics.totalTechnologies || 0) * 0.88 },
              { label: '2022', value: (technologyData?.analytics.totalTechnologies || 0) * 0.93 },
              { label: '2023', value: (technologyData?.analytics.totalTechnologies || 0) * 0.97 },
              { label: '2024', value: technologyData?.analytics.totalTechnologies || 0 }
            ]}
            title="📈 Research Progress Over Time"
            color="#4ecdc4"
            height={250}
            width={400}
          />
        </div>
      </div>

      {/* Technology Analytics - Full width below cards */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel academic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>📊 Technology Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={[
                  { label: 'Active Research', value: technologyData?.analytics.activeResearch || 0, color: '#4ecdc4' },
                  { label: 'Technology Transfers', value: technologyData?.analytics.technologyTransfers || 0, color: '#45b7aa' },
                  { label: 'Total Technologies', value: technologyData?.analytics.totalTechnologies || 0, color: '#96ceb4' }
                ]}
                title="⚡ Technology Activities"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={[
                  { label: 'Computing', value: 28, color: '#4ecdc4' },
                  { label: 'Biotechnology', value: 24, color: '#45b7aa' },
                  { label: 'Energy', value: 18, color: '#96ceb4' },
                  { label: 'Other', value: 30, color: '#feca57' }
                ]}
                title="🧬 Technology Categories"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderTechnologies = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel academic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>🔬 Technology Portfolio</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn academic-theme" onClick={() => console.log('Refresh Technologies')}>Refresh Technologies</button>
          <button className="standard-btn academic-theme" onClick={() => console.log('Create Sample Technology')}>Create Sample Technology</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Level</th>
                <th>Complexity</th>
                <th>Status</th>
                <th>Security</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {technologyData?.technologies.map((tech) => (
                <tr key={tech.id}>
                  <td><strong>{tech.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#9c27b0',
                      color: 'white'
                    }}>
                      {tech.category}
                    </span>
                  </td>
                  <td>{tech.level}</td>
                  <td>{tech.complexity}/10</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: tech.operationalStatus === 'operational' ? '#4caf50' : '#ff9800',
                      color: 'white'
                    }}>
                      {tech.operationalStatus.charAt(0).toUpperCase() + tech.operationalStatus.slice(1)}
                    </span>
                  </td>
                  <td>{tech.securityLevel}/10</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '8px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${tech.implementationProgress}%`, 
                          height: '100%', 
                          backgroundColor: '#4caf50'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{tech.implementationProgress}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn academic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderResearch = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel academic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>🧪 Technology Research Projects</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn academic-theme" onClick={() => console.log('Start Technology Research')}>Start Technology Research</button>
          <button className="standard-btn academic-theme" onClick={() => console.log('Review Research Priorities')}>Review Priorities</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Technology Area</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Quantum Computing Matrix</strong></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#4ecdc4', color: 'white' }}>Computing</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', backgroundColor: '#4caf50' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>85%</span>
                  </div>
                </td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#4caf50', color: 'white' }}>Near Complete</span></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#ef4444', color: 'white' }}>Critical</span></td>
                <td><button className="standard-btn academic-theme">Details</button></td>
              </tr>
              <tr>
                <td><strong>Neural Interface Protocol</strong></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#9c27b0', color: 'white' }}>Biotechnology</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45%', height: '100%', backgroundColor: '#4caf50' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>45%</span>
                  </div>
                </td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#4caf50', color: 'white' }}>Active</span></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#ff9800', color: 'white' }}>High</span></td>
                <td><button className="standard-btn academic-theme">Details</button></td>
              </tr>
              <tr>
                <td><strong>Plasma Energy Conduits</strong></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#96ceb4', color: 'white' }}>Energy</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', backgroundColor: '#4caf50' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>78%</span>
                  </div>
                </td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#4caf50', color: 'white' }}>Active</span></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#22c55e', color: 'white' }}>Medium</span></td>
                <td><button className="standard-btn academic-theme">Details</button></td>
              </tr>
              <tr>
                <td><strong>Advanced AI Consciousness</strong></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#feca57', color: 'white' }}>AI/ML</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#4caf50' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>25%</span>
                  </div>
                </td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#ff9800', color: 'white' }}>Planning</span></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#22c55e', color: 'white' }}>Medium</span></td>
                <td><button className="standard-btn academic-theme">Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransfers = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel academic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>🔄 Technology Transfers</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn academic-theme" onClick={() => console.log('Initiate Transfer')}>Initiate Transfer</button>
          <button className="standard-btn academic-theme" onClick={() => console.log('Review Transfers')}>Review Transfers</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Technology</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Security Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Quantum Computing Matrix</strong></td>
                <td>Research Division</td>
                <td>Military Command</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '90%', height: '100%', backgroundColor: '#4caf50' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>90%</span>
                  </div>
                </td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#4caf50', color: 'white' }}>Near Complete</span></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#ef4444', color: 'white' }}>Top Secret</span></td>
                <td><button className="standard-btn academic-theme">Details</button></td>
              </tr>
              <tr>
                <td><strong>Neural Interface Protocol</strong></td>
                <td>Biotech Lab</td>
                <td>Healthcare System</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '60%', height: '100%', backgroundColor: '#4caf50' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>60%</span>
                  </div>
                </td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#ff9800', color: 'white' }}>In Progress</span></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#ff9800', color: 'white' }}>Classified</span></td>
                <td><button className="standard-btn academic-theme">Details</button></td>
              </tr>
              <tr>
                <td><strong>Plasma Energy Conduits</strong></td>
                <td>Energy Research</td>
                <td>Civilian Infrastructure</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '30%', height: '100%', backgroundColor: '#4caf50' }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem' }}>30%</span>
                  </div>
                </td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#22c55e', color: 'white' }}>Planning</span></td>
                <td><span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#22c55e', color: 'white' }}>Public</span></td>
                <td><button className="standard-btn academic-theme">Details</button></td>
              </tr>
            </tbody>
          </table>
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
      onRefresh={fetchTechnologyData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container academic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && technologyData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'technologies' && renderTechnologies()}
              {activeTab === 'research' && renderResearch()}
              {activeTab === 'transfers' && renderTransfers()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading technology data...' : 
               error ? `Error: ${error}` : 
               'No technology data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default TechnologyScreen;
