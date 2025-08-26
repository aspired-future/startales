/**
 * Character Profile Modal
 * Displays detailed character information when clicking on character names/avatars
 */

import React, { useState, useEffect } from 'react';
import './CharacterProfileModal.css';

interface CharacterProfileModalProps {
  characterId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

interface DynamicCharacter {
  id: string;
  name: {
    first: string;
    last: string;
    title?: string;
    full_display: string;
  };
  category: string;
  subcategory: string;
  civilization_id: number;
  appearance: {
    physical_description: string;
    style_description: string;
    distinctive_features: string[];
    avatar_url: string;
  };
  personality: {
    core_traits: string[];
    values: string[];
    fears: string[];
    motivations: string[];
    quirks: string[];
    communication_style: string;
  };
  attributes: {
    intelligence: number;
    charisma: number;
    ambition: number;
    integrity: number;
    creativity: number;
    empathy: number;
    resilience: number;
    leadership: number;
    technical_skill: number;
    social_influence: number;
  };
  profession: {
    current_job: string;
    job_title: string;
    employer: string;
    industry: string;
    career_level: string;
    income_level: number;
    work_satisfaction: number;
  };
  background: {
    birthplace: string;
    education: string[];
    career_history: string[];
    major_life_events: string[];
    achievements: string[];
  };
  social_media: {
    witter_handle: string;
    follower_count: number;
    posting_frequency: string;
    content_style: string[];
    influence_level: number;
  };
  opinions: {
    political_views: { [topic: string]: number };
    economic_views: { [topic: string]: number };
    social_views: { [topic: string]: number };
  };
  current_status: {
    mood: string;
    energy_level: number;
    stress_level: number;
    health_status: string;
    current_activity: string;
    availability: string;
  };
}

const CharacterProfileModal: React.FC<CharacterProfileModalProps> = ({
  characterId,
  isVisible,
  onClose
}) => {
  const [character, setCharacter] = useState<DynamicCharacter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'personality' | 'background' | 'opinions'>('overview');

  useEffect(() => {
    if (characterId && isVisible) {
      loadCharacter(characterId);
    }
  }, [characterId, isVisible]);

  const loadCharacter = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/characters/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCharacter(data.character);
      } else {
        // Fallback to mock data
        setCharacter(generateMockCharacter(id));
      }
    } catch (err) {
      console.error('Failed to load character:', err);
      setCharacter(generateMockCharacter(id));
    } finally {
      setLoading(false);
    }
  };

  const generateMockCharacter = (id: string): DynamicCharacter => {
    const mockCharacters: { [key: string]: DynamicCharacter } = {
      'char_diplomat_001': {
        id: 'char_diplomat_001',
        name: {
          first: 'Elena',
          last: 'Vasquez',
          title: 'Ambassador',
          full_display: 'Ambassador Elena Vasquez'
        },
        category: 'official',
        subcategory: 'diplomat',
        civilization_id: 1,
        appearance: {
          physical_description: 'Tall, elegant woman with silver-streaked dark hair and piercing green eyes',
          style_description: 'Professional diplomatic attire with subtle cultural accessories',
          distinctive_features: ['Diplomatic insignia pin', 'Confident posture', 'Multilingual accent'],
          avatar_url: '/api/characters/avatars/elena_vasquez.jpg'
        },
        personality: {
          core_traits: ['Diplomatic', 'Intelligent', 'Persuasive', 'Culturally Aware', 'Patient'],
          values: ['Peace', 'Cultural Understanding', 'Justice', 'Cooperation', 'Wisdom'],
          fears: ['War', 'Cultural Misunderstanding', 'Failed Negotiations'],
          motivations: ['Galactic Peace', 'Cultural Exchange', 'Economic Prosperity'],
          quirks: ['Collects rare teas from different worlds', 'Speaks in metaphors', 'Always carries a cultural artifact'],
          communication_style: 'Formal yet warm, uses diplomatic language with cultural references'
        },
        attributes: {
          intelligence: 92,
          charisma: 88,
          ambition: 75,
          integrity: 95,
          creativity: 70,
          empathy: 85,
          resilience: 80,
          leadership: 82,
          technical_skill: 60,
          social_influence: 90
        },
        profession: {
          current_job: 'Chief Diplomatic Officer',
          job_title: 'Ambassador',
          employer: 'Terran Federation Diplomatic Corps',
          industry: 'Government - Foreign Affairs',
          career_level: 'Senior Executive',
          income_level: 8,
          work_satisfaction: 85
        },
        background: {
          birthplace: 'New Geneva, Earth',
          education: ['Galactic Relations PhD - University of Terra', 'Cultural Anthropology Masters - Centauri Institute'],
          career_history: ['Junior Diplomat - Earth Embassy', 'Cultural Attaché - Vega Station', 'Senior Negotiator - Trade Commission'],
          major_life_events: ['First Contact Protocol Development', 'Zephyrian Peace Accords', 'Cultural Exchange Program Launch'],
          achievements: ['Galactic Peace Medal', 'Cultural Bridge Award', 'Outstanding Diplomatic Service']
        },
        social_media: {
          witter_handle: '@AmbassadorElena',
          follower_count: 2400000,
          posting_frequency: 'Daily',
          content_style: ['Diplomatic Updates', 'Cultural Insights', 'Peace Advocacy'],
          influence_level: 85
        },
        opinions: {
          political_views: {
            'Galactic Unity': 95,
            'Trade Liberalization': 80,
            'Cultural Preservation': 90,
            'Military Intervention': 25
          },
          economic_views: {
            'Free Trade': 85,
            'Economic Cooperation': 95,
            'Resource Sharing': 80,
            'Protectionism': 20
          },
          social_views: {
            'Cultural Diversity': 95,
            'Education Access': 90,
            'Individual Rights': 85,
            'Social Equality': 88
          }
        },
        current_status: {
          mood: 'Focused',
          energy_level: 75,
          stress_level: 60,
          health_status: 'Excellent',
          current_activity: 'Reviewing trade proposals',
          availability: 'Available for urgent matters'
        }
      },
      'char_economist_001': {
        id: 'char_economist_001',
        name: {
          first: 'Marcus',
          last: 'Chen',
          title: 'Dr.',
          full_display: 'Dr. Marcus Chen'
        },
        category: 'official',
        subcategory: 'economist',
        civilization_id: 1,
        appearance: {
          physical_description: 'Middle-aged Asian man with graying temples and analytical eyes behind smart glasses',
          style_description: 'Business casual with data-pad always in hand',
          distinctive_features: ['Smart glasses with HUD display', 'Economic data tattoos on forearm', 'Calculating expression'],
          avatar_url: '/api/characters/avatars/marcus_chen.jpg'
        },
        personality: {
          core_traits: ['Analytical', 'Detail-oriented', 'Pragmatic', 'Data-driven', 'Strategic'],
          values: ['Economic Stability', 'Data Accuracy', 'Fiscal Responsibility', 'Innovation', 'Efficiency'],
          fears: ['Economic Collapse', 'Data Corruption', 'Policy Failures'],
          motivations: ['Economic Growth', 'Fiscal Stability', 'Innovation Funding'],
          quirks: ['Quotes economic statistics in casual conversation', 'Predicts market trends as a hobby', 'Collects vintage calculators'],
          communication_style: 'Precise and data-heavy, uses charts and graphs to explain concepts'
        },
        attributes: {
          intelligence: 95,
          charisma: 65,
          ambition: 80,
          integrity: 90,
          creativity: 75,
          empathy: 70,
          resilience: 85,
          leadership: 75,
          technical_skill: 90,
          social_influence: 70
        },
        profession: {
          current_job: 'Chief Economic Advisor',
          job_title: 'Senior Economic Analyst',
          employer: 'Terran Federation Treasury Department',
          industry: 'Government - Economic Policy',
          career_level: 'Senior Executive',
          income_level: 7,
          work_satisfaction: 90
        },
        background: {
          birthplace: 'Neo Singapore, Mars Colony',
          education: ['Economics PhD - Martian Institute of Technology', 'Applied Mathematics Masters - Earth Central University'],
          career_history: ['Junior Analyst - Colonial Bank', 'Senior Economist - Trade Ministry', 'Policy Advisor - Treasury'],
          major_life_events: ['Mars Economic Crisis Response', 'Interplanetary Trade Agreement', 'AI Economic Model Development'],
          achievements: ['Economic Excellence Award', 'Policy Innovation Recognition', 'Galactic Economics Prize']
        },
        social_media: {
          witter_handle: '@EconMarcus',
          follower_count: 890000,
          posting_frequency: 'Several times daily',
          content_style: ['Economic Analysis', 'Market Predictions', 'Policy Explanations'],
          influence_level: 75
        },
        opinions: {
          political_views: {
            'Fiscal Conservatism': 85,
            'Regulated Markets': 80,
            'Innovation Investment': 95,
            'Social Programs': 70
          },
          economic_views: {
            'Free Markets': 75,
            'Government Regulation': 80,
            'Innovation Funding': 95,
            'Wealth Redistribution': 60
          },
          social_views: {
            'Education Investment': 95,
            'Healthcare Access': 80,
            'Technology Adoption': 90,
            'Traditional Values': 50
          }
        },
        current_status: {
          mood: 'Analytical',
          energy_level: 80,
          stress_level: 70,
          health_status: 'Good',
          current_activity: 'Analyzing budget projections',
          availability: 'Available during business hours'
        }
      }
    };

    return mockCharacters[id] || mockCharacters['char_diplomat_001'];
  };

  const formatAttribute = (value: number) => {
    if (value >= 90) return { text: 'Exceptional', color: '#4ecdc4' };
    if (value >= 80) return { text: 'High', color: '#45b7aa' };
    if (value >= 70) return { text: 'Good', color: '#96ceb4' };
    if (value >= 60) return { text: 'Average', color: '#feca57' };
    if (value >= 50) return { text: 'Below Average', color: '#ff9ff3' };
    return { text: 'Low', color: '#ff6b6b' };
  };

  const formatOpinion = (value: number) => {
    if (value >= 80) return { text: 'Strongly Supports', color: '#4ecdc4' };
    if (value >= 60) return { text: 'Supports', color: '#96ceb4' };
    if (value >= 40) return { text: 'Neutral', color: '#feca57' };
    if (value >= 20) return { text: 'Opposes', color: '#ff9ff3' };
    return { text: 'Strongly Opposes', color: '#ff6b6b' };
  };

  if (!isVisible) return null;

  return (
    <div className="character-profile-modal-overlay" onClick={onClose}>
      <div className="character-profile-modal" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading character profile...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <h3>❌ Error Loading Profile</h3>
            <p>{error}</p>
            <button onClick={onClose}>Close</button>
          </div>
        ) : character ? (
          <>
            {/* Header */}
            <div className="profile-header">
              <button className="close-button" onClick={onClose}>✕</button>
              <div className="character-avatar">
                <img 
                  src={character.appearance.avatar_url} 
                  alt={character.name.full_display}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%234ecdc4"/><text x="40" y="45" text-anchor="middle" fill="white" font-size="24">${character.name.first.charAt(0)}</text></svg>`;
                  }}
                />
              </div>
              <div className="character-info">
                <h2>{character.name.full_display}</h2>
                <p className="character-title">{character.profession.job_title}</p>
                <p className="character-employer">{character.profession.employer}</p>
                <div className="status-indicators">
                  <span className="status-mood">😊 {character.current_status.mood}</span>
                  <span className="status-availability">🟢 {character.current_status.availability}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="profile-tabs">
              {[
                { id: 'overview', label: '📋 Overview', icon: '📋' },
                { id: 'personality', label: '🧠 Personality', icon: '🧠' },
                { id: 'background', label: '📚 Background', icon: '📚' },
                { id: 'opinions', label: '💭 Opinions', icon: '💭' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="profile-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-grid">
                    <div className="overview-section">
                      <h3>👤 Basic Information</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Category:</span>
                          <span className="value">{character.category} - {character.subcategory}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Current Activity:</span>
                          <span className="value">{character.current_status.current_activity}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Energy Level:</span>
                          <span className="value">{character.current_status.energy_level}%</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Stress Level:</span>
                          <span className="value">{character.current_status.stress_level}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="overview-section">
                      <h3>💼 Professional</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Industry:</span>
                          <span className="value">{character.profession.industry}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Career Level:</span>
                          <span className="value">{character.profession.career_level}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Work Satisfaction:</span>
                          <span className="value">{character.profession.work_satisfaction}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="overview-section">
                      <h3>📱 Social Media</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Witter Handle:</span>
                          <span className="value">{character.social_media.witter_handle}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Followers:</span>
                          <span className="value">{character.social_media.follower_count.toLocaleString()}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Influence Level:</span>
                          <span className="value">{character.social_media.influence_level}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'personality' && (
                <div className="personality-tab">
                  <div className="personality-grid">
                    <div className="personality-section">
                      <h3>🎯 Core Traits</h3>
                      <div className="traits-list">
                        {character.personality.core_traits.map((trait, index) => (
                          <span key={index} className="trait-tag">{trait}</span>
                        ))}
                      </div>
                    </div>

                    <div className="personality-section">
                      <h3>💎 Values</h3>
                      <div className="traits-list">
                        {character.personality.values.map((value, index) => (
                          <span key={index} className="value-tag">{value}</span>
                        ))}
                      </div>
                    </div>

                    <div className="personality-section">
                      <h3>🎭 Quirks</h3>
                      <ul className="quirks-list">
                        {character.personality.quirks.map((quirk, index) => (
                          <li key={index}>{quirk}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="personality-section">
                      <h3>📊 Attributes</h3>
                      <div className="attributes-grid">
                        {Object.entries(character.attributes).map(([key, value]) => {
                          const formatted = formatAttribute(value);
                          return (
                            <div key={key} className="attribute-item">
                              <span className="attribute-name">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                              <div className="attribute-bar">
                                <div 
                                  className="attribute-fill" 
                                  style={{ width: `${value}%`, backgroundColor: formatted.color }}
                                ></div>
                              </div>
                              <span className="attribute-value" style={{ color: formatted.color }}>
                                {formatted.text} ({value})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'background' && (
                <div className="background-tab">
                  <div className="background-grid">
                    <div className="background-section">
                      <h3>🎓 Education</h3>
                      <ul>
                        {character.background.education.map((edu, index) => (
                          <li key={index}>{edu}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="background-section">
                      <h3>💼 Career History</h3>
                      <ul>
                        {character.background.career_history.map((career, index) => (
                          <li key={index}>{career}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="background-section">
                      <h3>🏆 Achievements</h3>
                      <ul>
                        {character.background.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="background-section">
                      <h3>📍 Origin</h3>
                      <p><strong>Birthplace:</strong> {character.background.birthplace}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'opinions' && (
                <div className="opinions-tab">
                  <div className="opinions-grid">
                    <div className="opinion-category">
                      <h3>🏛️ Political Views</h3>
                      <div className="opinions-list">
                        {Object.entries(character.opinions.political_views).map(([topic, value]) => {
                          const formatted = formatOpinion(value);
                          return (
                            <div key={topic} className="opinion-item">
                              <span className="opinion-topic">{topic}</span>
                              <div className="opinion-bar">
                                <div 
                                  className="opinion-fill" 
                                  style={{ width: `${value}%`, backgroundColor: formatted.color }}
                                ></div>
                              </div>
                              <span className="opinion-stance" style={{ color: formatted.color }}>
                                {formatted.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="opinion-category">
                      <h3>💰 Economic Views</h3>
                      <div className="opinions-list">
                        {Object.entries(character.opinions.economic_views).map(([topic, value]) => {
                          const formatted = formatOpinion(value);
                          return (
                            <div key={topic} className="opinion-item">
                              <span className="opinion-topic">{topic}</span>
                              <div className="opinion-bar">
                                <div 
                                  className="opinion-fill" 
                                  style={{ width: `${value}%`, backgroundColor: formatted.color }}
                                ></div>
                              </div>
                              <span className="opinion-stance" style={{ color: formatted.color }}>
                                {formatted.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="opinion-category">
                      <h3>👥 Social Views</h3>
                      <div className="opinions-list">
                        {Object.entries(character.opinions.social_views).map(([topic, value]) => {
                          const formatted = formatOpinion(value);
                          return (
                            <div key={topic} className="opinion-item">
                              <span className="opinion-topic">{topic}</span>
                              <div className="opinion-bar">
                                <div 
                                  className="opinion-fill" 
                                  style={{ width: `${value}%`, backgroundColor: formatted.color }}
                                ></div>
                              </div>
                              <span className="opinion-stance" style={{ color: formatted.color }}>
                                {formatted.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-character">
            <h3>Character Not Found</h3>
            <button onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterProfileModal;

