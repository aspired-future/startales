import React, { useState, useEffect } from 'react';
import './GovernmentTypesScreen.css';

interface GovernmentTypesScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface GovernmentType {
  id: string;
  name: string;
  description: string;
  ideology: string;
  powerStructure: 'centralized' | 'distributed' | 'mixed';
  legitimacySource: 'divine_right' | 'popular_mandate' | 'party_ideology' | 'tradition' | 'force';
  successionMethod: 'hereditary' | 'election' | 'appointment' | 'revolution' | 'meritocracy';
  decisionSpeed: number;
  economicControl: number;
  civilLiberties: number;
  stabilityFactors: {
    succession: number;
    legitimacy: number;
    institutionalStrength: number;
    popularSupport: number;
  };
  advantages: string[];
  disadvantages: string[];
}

interface CivilizationGovernment {
  id: string;
  governmentTypeId: string;
  governmentTypeName: string;
  effectiveness: number;
  stability: number;
  popularSupport: number;
  transitionInProgress: boolean;
}

const GovernmentTypesScreen: React.FC<GovernmentTypesScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'available' | 'transition' | 'analysis'>('current');
  const [governmentTypes, setGovernmentTypes] = useState<GovernmentType[]>([]);
  const [currentGovernment, setCurrentGovernment] = useState<CivilizationGovernment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [transitionData, setTransitionData] = useState<any>(null);

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const fetchGovernmentData = async () => {
    try {
      setLoading(true);
      
      // Fetch available government types
      const typesResponse = await fetch('http://localhost:4000/api/government-types/types');
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        if (typesData.success) {
          setGovernmentTypes(typesData.data);
        }
      }

      // Fetch current government
      const currentResponse = await fetch('http://localhost:4000/api/government-types/civilization/campaign_1/player_civ');
      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        if (currentData.success) {
          setCurrentGovernment(currentData.data);
        }
      }

    } catch (err) {
      console.warn('Government Types API not available, using mock data');
      // Use mock data
      setGovernmentTypes(createMockGovernmentTypes());
      setCurrentGovernment(createMockCurrentGovernment());
    } finally {
      setLoading(false);
    }
  };

  const createMockGovernmentTypes = (): GovernmentType[] => [
    {
      id: 'democracy',
      name: 'Parliamentary Democracy',
      description: 'A representative democracy with elected officials and constitutional protections.',
      ideology: 'Liberal Democracy',
      powerStructure: 'distributed',
      legitimacySource: 'popular_mandate',
      successionMethod: 'election',
      decisionSpeed: 6,
      economicControl: 40,
      civilLiberties: 85,
      stabilityFactors: {
        succession: 90,
        legitimacy: 85,
        institutionalStrength: 80,
        popularSupport: 75
      },
      advantages: ['High civil liberties', 'Peaceful transitions', 'Innovation-friendly'],
      disadvantages: ['Slower decision making', 'Political gridlock possible', 'Populist risks']
    },
    {
      id: 'monarchy',
      name: 'Constitutional Monarchy',
      description: 'A traditional monarchy with constitutional limits and ceremonial roles.',
      ideology: 'Constitutional Traditionalism',
      powerStructure: 'mixed',
      legitimacySource: 'tradition',
      successionMethod: 'hereditary',
      decisionSpeed: 7,
      economicControl: 30,
      civilLiberties: 70,
      stabilityFactors: {
        succession: 95,
        legitimacy: 70,
        institutionalStrength: 85,
        popularSupport: 65
      },
      advantages: ['Stable succession', 'Cultural continuity', 'Ceremonial unity'],
      disadvantages: ['Limited democratic input', 'Hereditary risks', 'Modernization challenges']
    },
    {
      id: 'technocracy',
      name: 'Scientific Technocracy',
      description: 'Rule by technical experts and scientists based on evidence and expertise.',
      ideology: 'Scientific Rationalism',
      powerStructure: 'centralized',
      legitimacySource: 'party_ideology',
      successionMethod: 'meritocracy',
      decisionSpeed: 9,
      economicControl: 60,
      civilLiberties: 60,
      stabilityFactors: {
        succession: 75,
        legitimacy: 80,
        institutionalStrength: 90,
        popularSupport: 70
      },
      advantages: ['Evidence-based policy', 'Rapid innovation', 'Efficient decisions'],
      disadvantages: ['Limited popular input', 'Technocratic elitism', 'Social disconnect']
    }
  ];

  const createMockCurrentGovernment = (): CivilizationGovernment => ({
    id: 'current_gov_1',
    governmentTypeId: 'democracy',
    governmentTypeName: 'Parliamentary Democracy',
    effectiveness: 78,
    stability: 82,
    popularSupport: 75,
    transitionInProgress: false
  });

  const handleTransition = async (targetTypeId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/government-types/civilization/campaign_1/player_civ/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetGovernmentType: targetTypeId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransitionData(data.data);
          alert('Government transition initiated successfully!');
          fetchGovernmentData(); // Refresh data
        }
      }
    } catch (error) {
      console.error('Transition failed:', error);
      alert('Government transition failed. This is a demo - transitions will be available in the full system.');
    }
  };

  if (loading) {
    return (
      <div className="government-types-screen loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading government systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="government-types-screen error">
        <div className="error-message">
          <h3>⚠️ Government System Unavailable</h3>
          <p>Unable to load government data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentType = governmentTypes.find(type => type.id === currentGovernment?.governmentTypeId);

  return (
    <div className="government-types-screen">
      <div className="screen-header">
        <div className="header-left">
          <span className="screen-icon">{icon}</span>
          <div className="header-text">
            <h2>{title}</h2>
            <p>Government System Management & Transitions</p>
          </div>
        </div>
        <div className="header-right">
          <div className="government-status">
            <span className="current-government">
              Current: {currentGovernment?.governmentTypeName || 'Unknown'}
            </span>
            <div className="effectiveness-indicator">
              <span>Effectiveness: {currentGovernment?.effectiveness || 0}%</span>
              <div className="effectiveness-bar">
                <div 
                  className="effectiveness-fill" 
                  style={{ width: `${currentGovernment?.effectiveness || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {[
          { id: 'current', label: 'Current Government', icon: '🏛️' },
          { id: 'available', label: 'Available Types', icon: '📋' },
          { id: 'transition', label: 'Transition', icon: '🔄' },
          { id: 'analysis', label: 'AI Analysis', icon: '🤖' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'current' && currentType && (
          <div className="current-government-tab">
            <div className="government-overview">
              <div className="government-card">
                <div className="government-header">
                  <h3>{currentType.name}</h3>
                  <span className="ideology-badge">{currentType.ideology}</span>
                </div>
                <p className="government-description">{currentType.description}</p>
                
                <div className="government-characteristics">
                  <div className="characteristic">
                    <span className="label">Power Structure:</span>
                    <span className="value">{currentType.powerStructure}</span>
                  </div>
                  <div className="characteristic">
                    <span className="label">Legitimacy Source:</span>
                    <span className="value">{currentType.legitimacySource.replace('_', ' ')}</span>
                  </div>
                  <div className="characteristic">
                    <span className="label">Succession Method:</span>
                    <span className="value">{currentType.successionMethod}</span>
                  </div>
                </div>

                <div className="government-metrics">
                  <div className="metric">
                    <span className="metric-label">Decision Speed</span>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ width: `${currentType.decisionSpeed * 10}%` }}></div>
                    </div>
                    <span className="metric-value">{currentType.decisionSpeed}/10</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Economic Control</span>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ width: `${currentType.economicControl}%` }}></div>
                    </div>
                    <span className="metric-value">{currentType.economicControl}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Civil Liberties</span>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ width: `${currentType.civilLiberties}%` }}></div>
                    </div>
                    <span className="metric-value">{currentType.civilLiberties}%</span>
                  </div>
                </div>

                <div className="stability-factors">
                  <h4>Stability Factors</h4>
                  <div className="stability-grid">
                    {Object.entries(currentType.stabilityFactors).map(([key, value]) => (
                      <div key={key} className="stability-item">
                        <span className="stability-label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <span className="stability-value">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="advantages-disadvantages">
                  <div className="advantages">
                    <h4>✅ Advantages</h4>
                    <ul>
                      {currentType.advantages.map((advantage, index) => (
                        <li key={index}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="disadvantages">
                    <h4>❌ Disadvantages</h4>
                    <ul>
                      {currentType.disadvantages.map((disadvantage, index) => (
                        <li key={index}>{disadvantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'available' && (
          <div className="available-types-tab">
            <div className="types-grid">
              {governmentTypes.map(type => (
                <div key={type.id} className={`type-card ${type.id === currentGovernment?.governmentTypeId ? 'current' : ''}`}>
                  <div className="type-header">
                    <h4>{type.name}</h4>
                    <span className="ideology">{type.ideology}</span>
                  </div>
                  <p className="type-description">{type.description}</p>
                  
                  <div className="type-metrics">
                    <div className="mini-metric">
                      <span>Decision Speed: {type.decisionSpeed}/10</span>
                    </div>
                    <div className="mini-metric">
                      <span>Economic Control: {type.economicControl}%</span>
                    </div>
                    <div className="mini-metric">
                      <span>Civil Liberties: {type.civilLiberties}%</span>
                    </div>
                  </div>

                  <div className="type-actions">
                    {type.id === currentGovernment?.governmentTypeId ? (
                      <span className="current-badge">Current Government</span>
                    ) : (
                      <button 
                        className="transition-btn"
                        onClick={() => handleTransition(type.id)}
                      >
                        Transition to {type.name}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transition' && (
          <div className="transition-tab">
            <div className="transition-content">
              <h3>Government Transition System</h3>
              <p>Plan and execute transitions between different government types.</p>
              
              <div className="transition-status">
                {currentGovernment?.transitionInProgress ? (
                  <div className="transition-active">
                    <h4>🔄 Transition in Progress</h4>
                    <p>Your civilization is currently transitioning to a new government type.</p>
                  </div>
                ) : (
                  <div className="transition-ready">
                    <h4>✅ Government Stable</h4>
                    <p>No transitions currently in progress. You can initiate a transition from the Available Types tab.</p>
                  </div>
                )}
              </div>

              <div className="transition-info">
                <h4>Transition Requirements</h4>
                <ul>
                  <li>Popular support above 40%</li>
                  <li>Government stability above 30%</li>
                  <li>No active crises or conflicts</li>
                  <li>Constitutional amendment process (if required)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-tab">
            <div className="analysis-content">
              <h3>🤖 AI Government Analysis</h3>
              <p>AI-powered analysis of your government's performance and recommendations.</p>
              
              <div className="analysis-placeholder">
                <div className="analysis-icon">🤖</div>
                <h4>AI Analysis Coming Soon</h4>
                <p>Advanced AI analysis of government effectiveness, stability trends, and transition recommendations will be available in the full system.</p>
                
                <button className="generate-analysis-btn" disabled>
                  Generate AI Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentTypesScreen;
