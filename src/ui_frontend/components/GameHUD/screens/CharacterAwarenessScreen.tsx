import React, { useState, useEffect } from 'react';
import { ScreenProps } from './BaseScreen';
import './CharacterAwarenessScreen.css';

interface CharacterAwareness {
  gameStateAwareness: {
    level: number;
    politicalSituation: number;
    economicContext: number;
    militarySituation: number;
    technologicalProgress: number;
    socialCultural: number;
    crisisRecognition: number;
    historicalContext: number;
  };
  specialtyKnowledge: {
    professionalExpertise: number;
    crossDomainKnowledge: number;
    strategicThinking: number;
    technicalCompetency: number;
    advisoryQuality: number;
    innovationCreativity: number;
    riskAssessment: number;
    decisionSupport: number;
  };
  responsivenessAdaptation: {
    situationalAdaptability: number;
    informationProcessing: number;
    proactiveInitiative: number;
    collaborativeEngagement: number;
    feedbackResponsiveness: number;
    learningAdaptation: number;
    stressPerformance: number;
    changeManagement: number;
  };
}

interface SpecialtyAnalysis {
  expertiseMetrics: {
    professionalDepth: number;
    crossDomainBreadth: number;
    strategicCapability: number;
    technicalSkills: number;
  };
  performanceIndicators: {
    advisoryQuality: number;
    innovationLevel: number;
    riskAssessmentAccuracy: number;
    decisionSupportValue: number;
  };
  adaptabilityFactors: {
    situationalFlexibility: number;
    learningSpeed: number;
    stressResilience: number;
    changeLeadership: number;
  };
  overallRating: number;
}

interface KnobConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
}

const CharacterAwarenessScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [characterAwareness, setCharacterAwareness] = useState<CharacterAwareness | null>(null);
  const [specialtyAnalysis, setSpecialtyAnalysis] = useState<SpecialtyAnalysis | null>(null);
  const [knobConfigs, setKnobConfigs] = useState<{ [key: string]: KnobConfig }>({});
  const [knobValues, setKnobValues] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'awareness' | 'specialty' | 'knobs'>('awareness');

  useEffect(() => {
    fetchCharacterData();
    fetchKnobConfigs();
  }, [gameContext]);

  const fetchCharacterData = async () => {
    try {
      setLoading(true);
      const { campaignId, civilizationId } = gameContext;

      // Fetch character awareness data
      const awarenessResponse = await fetch(`/api/characters/game-state-awareness?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      const awarenessData = await awarenessResponse.json();

      // Fetch specialty analysis
      const specialtyResponse = await fetch(`/api/characters/specialty-analysis?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      const specialtyData = await specialtyResponse.json();

      // Fetch current knob values
      const knobResponse = await fetch(`/api/characters/knobs?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      const knobData = await knobResponse.json();

      setCharacterAwareness(awarenessData.data);
      setSpecialtyAnalysis(specialtyData.data);
      setKnobValues(knobData.values || {});
    } catch (err) {
      setError('Failed to fetch character awareness data');
      console.error('Character awareness data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKnobConfigs = async () => {
    try {
      const response = await fetch('/api/characters/knobs/help');
      const data = await response.json();
      setKnobConfigs(data.knobs || {});
    } catch (err) {
      console.error('Failed to fetch knob configs:', err);
    }
  };

  const handleKnobChange = async (knobId: string, value: number) => {
    try {
      const { campaignId, civilizationId } = gameContext;
      
      const response = await fetch('/api/characters/knobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          civilizationId,
          knobs: { [knobId]: value }
        }),
      });

      if (response.ok) {
        // Update local state
        setKnobValues(prev => ({ ...prev, [knobId]: value }));
        
        // Refresh data to see effects
        setTimeout(() => fetchCharacterData(), 500);
      }
    } catch (err) {
      console.error('Failed to update knob:', err);
    }
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getAwarenessLevel = (value: number): string => {
    if (value >= 90) return 'Exceptional';
    if (value >= 80) return 'High';
    if (value >= 70) return 'Good';
    if (value >= 60) return 'Moderate';
    if (value >= 50) return 'Basic';
    return 'Limited';
  };

  const getAwarenessColor = (value: number): string => {
    if (value >= 80) return '#4caf50';
    if (value >= 60) return '#ff9800';
    return '#f44336';
  };

  const renderKnobSlider = (knobId: string, config: KnobConfig) => {
    const currentValue = knobValues[knobId] ?? config.default;
    
    return (
      <div key={knobId} className="knob-control">
        <div className="knob-header">
          <label className="knob-label">{config.name}</label>
          <span className="knob-value">
            {currentValue}{config.unit}
          </span>
        </div>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={currentValue}
          onChange={(e) => handleKnobChange(knobId, parseFloat(e.target.value))}
          className="knob-slider"
        />
        <div className="knob-description">{config.description}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="character-awareness-screen loading">
        <div className="loading-spinner">Loading Character Awareness Data...</div>
      </div>
    );
  }

  if (error || !characterAwareness || !specialtyAnalysis) {
    return (
      <div className="character-awareness-screen error">
        <div className="error-message">{error || 'No character awareness data available'}</div>
        <button onClick={fetchCharacterData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="character-awareness-screen">
      <div className="screen-header">
        <h2>🧠 Character Awareness & Expertise</h2>
        <div className="awareness-summary">
          <div className="summary-stat">
            <span className="stat-label">Game State Awareness</span>
            <span className="stat-value" style={{ color: getAwarenessColor(characterAwareness.gameStateAwareness.level) }}>
              {getAwarenessLevel(characterAwareness.gameStateAwareness.level)}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Professional Expertise</span>
            <span className="stat-value" style={{ color: getAwarenessColor(characterAwareness.specialtyKnowledge.professionalExpertise) }}>
              {formatPercentage(characterAwareness.specialtyKnowledge.professionalExpertise)}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Overall Rating</span>
            <span className="stat-value" style={{ color: getAwarenessColor(specialtyAnalysis.overallRating) }}>
              {formatPercentage(specialtyAnalysis.overallRating)}
            </span>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'awareness' ? 'active' : ''}`}
          onClick={() => setActiveTab('awareness')}
        >
          Game State Awareness
        </button>
        <button
          className={`tab-button ${activeTab === 'specialty' ? 'active' : ''}`}
          onClick={() => setActiveTab('specialty')}
        >
          Specialty Analysis
        </button>
        <button
          className={`tab-button ${activeTab === 'knobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('knobs')}
        >
          Awareness Controls
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'awareness' && (
          <div className="awareness-tab">
            <div className="awareness-categories">
              <div className="awareness-category">
                <h3>Game State Knowledge</h3>
                <div className="awareness-grid">
                  <div className="awareness-item">
                    <div className="awareness-label">Overall Level</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.gameStateAwareness.level}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.gameStateAwareness.level)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.gameStateAwareness.level)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Political Situation</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.gameStateAwareness.politicalSituation}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.gameStateAwareness.politicalSituation)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.gameStateAwareness.politicalSituation)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Economic Context</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.gameStateAwareness.economicContext}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.gameStateAwareness.economicContext)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.gameStateAwareness.economicContext)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Military Situation</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.gameStateAwareness.militarySituation}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.gameStateAwareness.militarySituation)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.gameStateAwareness.militarySituation)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Technology Progress</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.gameStateAwareness.technologicalProgress}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.gameStateAwareness.technologicalProgress)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.gameStateAwareness.technologicalProgress)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Social & Cultural</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.gameStateAwareness.socialCultural}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.gameStateAwareness.socialCultural)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.gameStateAwareness.socialCultural)}</div>
                  </div>
                </div>
              </div>
              
              <div className="awareness-category">
                <h3>Responsiveness & Adaptation</h3>
                <div className="awareness-grid">
                  <div className="awareness-item">
                    <div className="awareness-label">Situational Adaptability</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.responsivenessAdaptation.situationalAdaptability}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.responsivenessAdaptation.situationalAdaptability)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.responsivenessAdaptation.situationalAdaptability)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Information Processing</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.responsivenessAdaptation.informationProcessing}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.responsivenessAdaptation.informationProcessing)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.responsivenessAdaptation.informationProcessing)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Proactive Initiative</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.responsivenessAdaptation.proactiveInitiative}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.responsivenessAdaptation.proactiveInitiative)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.responsivenessAdaptation.proactiveInitiative)}</div>
                  </div>
                  
                  <div className="awareness-item">
                    <div className="awareness-label">Learning & Adaptation</div>
                    <div className="awareness-bar">
                      <div 
                        className="awareness-fill"
                        style={{ 
                          width: `${characterAwareness.responsivenessAdaptation.learningAdaptation}%`,
                          backgroundColor: getAwarenessColor(characterAwareness.responsivenessAdaptation.learningAdaptation)
                        }}
                      ></div>
                    </div>
                    <div className="awareness-value">{formatPercentage(characterAwareness.responsivenessAdaptation.learningAdaptation)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specialty' && (
          <div className="specialty-tab">
            <div className="specialty-analysis">
              <div className="analysis-section">
                <h3>Expertise Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Professional Depth</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.expertiseMetrics.professionalDepth)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Cross-Domain Breadth</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.expertiseMetrics.crossDomainBreadth)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Strategic Capability</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.expertiseMetrics.strategicCapability)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Technical Skills</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.expertiseMetrics.technicalSkills)}</span>
                  </div>
                </div>
              </div>
              
              <div className="analysis-section">
                <h3>Performance Indicators</h3>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Advisory Quality</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.performanceIndicators.advisoryQuality)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Innovation Level</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.performanceIndicators.innovationLevel)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Risk Assessment</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.performanceIndicators.riskAssessmentAccuracy)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Decision Support</span>
                    <span className="metric-value">{formatPercentage(specialtyAnalysis.performanceIndicators.decisionSupportValue)}</span>
                  </div>
                </div>
              </div>
              
              <div className="overall-rating">
                <h3>Overall Specialty Rating</h3>
                <div className="rating-display">
                  <div className="rating-circle" style={{ borderColor: getAwarenessColor(specialtyAnalysis.overallRating) }}>
                    <span className="rating-value" style={{ color: getAwarenessColor(specialtyAnalysis.overallRating) }}>
                      {formatPercentage(specialtyAnalysis.overallRating)}
                    </span>
                  </div>
                  <div className="rating-label">
                    {getAwarenessLevel(specialtyAnalysis.overallRating)} Performance
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knobs' && (
          <div className="knobs-tab">
            <div className="knobs-categories">
              <div className="knobs-category">
                <h3>Game State Awareness Controls</h3>
                <div className="knobs-grid">
                  {Object.entries(knobConfigs)
                    .filter(([_, config]) => config.category === 'game-state-awareness')
                    .map(([knobId, config]) => renderKnobSlider(knobId, config))}
                </div>
              </div>
              
              <div className="knobs-category">
                <h3>Specialty Knowledge Controls</h3>
                <div className="knobs-grid">
                  {Object.entries(knobConfigs)
                    .filter(([_, config]) => config.category === 'specialty-knowledge')
                    .map(([knobId, config]) => renderKnobSlider(knobId, config))}
                </div>
              </div>
              
              <div className="knobs-category">
                <h3>Responsiveness & Adaptation Controls</h3>
                <div className="knobs-grid">
                  {Object.entries(knobConfigs)
                    .filter(([_, config]) => config.category === 'responsiveness-adaptation')
                    .map(([knobId, config]) => renderKnobSlider(knobId, config))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterAwarenessScreen;
