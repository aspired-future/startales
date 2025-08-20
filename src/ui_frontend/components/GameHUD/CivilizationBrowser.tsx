import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { GalacticCivilizationGenerator, Civilization, GalacticRace } from '../../services/GalacticCivilizationGenerator';
import { CivilizationLoreGenerator, CivilizationLore, NotableIndividual } from '../../services/CivilizationLoreGenerator';
import './CivilizationBrowser.css';

interface CivilizationBrowserProps {
  civilizationGenerator: GalacticCivilizationGenerator;
  loreGenerator: CivilizationLoreGenerator;
  playerId: string;
  onSelectCivilization?: (civilizationId: string) => void;
  onSelectCharacter?: (characterId: string) => void;
}

export const CivilizationBrowser: React.FC<CivilizationBrowserProps> = ({
  civilizationGenerator,
  loreGenerator,
  playerId,
  onSelectCivilization,
  onSelectCharacter
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'civilizations' | 'races' | 'characters' | 'history'>('overview');
  const [selectedCivilization, setSelectedCivilization] = useState<Civilization | null>(null);
  const [selectedCivilizationLore, setSelectedCivilizationLore] = useState<CivilizationLore | null>(null);
  const [selectedRace, setSelectedRace] = useState<GalacticRace | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<NotableIndividual | null>(null);
  const [civilizations, setCivilizations] = useState<Civilization[]>([]);
  const [races, setRaces] = useState<GalacticRace[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'government' | 'race' | 'technology'>('all');

  useEffect(() => {
    setCivilizations(civilizationGenerator.getAllCivilizations());
    setRaces(civilizationGenerator.getAllRaces());
  }, [civilizationGenerator]);

  const handleCivilizationSelect = async (civilization: Civilization) => {
    setSelectedCivilization(civilization);
    const lore = loreGenerator.getCivilizationLore(civilization.id);
    setSelectedCivilizationLore(lore);
    onSelectCivilization?.(civilization.id);
  };

  const handleCharacterSelect = (character: NotableIndividual) => {
    setSelectedCharacter(character);
    onSelectCharacter?.(character.id);
  };

  const filteredCivilizations = civilizations.filter(civ => {
    const matchesSearch = civ.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'government') return matchesSearch && civ.government.type.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'race') {
      const race = civilizationGenerator.getRaceById(civ.race);
      return matchesSearch && race?.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (filterType === 'technology') {
      return matchesSearch && civ.technology.overall >= 7; // High-tech civilizations
    }
    
    return matchesSearch;
  });

  const getTechnologyLevelColor = (level: number): string => {
    if (level >= 9) return '#FFD700'; // Gold
    if (level >= 7) return '#4ECDC4'; // Teal
    if (level >= 5) return '#95A5A6'; // Gray
    if (level >= 3) return '#E67E22'; // Orange
    return '#E74C3C'; // Red
  };

  const getGovernmentTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'DEMOCRACY': '#2ECC71',
      'REPUBLIC': '#3498DB',
      'MONARCHY': '#9B59B6',
      'THEOCRACY': '#F39C12',
      'CORPORATE': '#1ABC9C',
      'MILITARY': '#E74C3C',
      'HIVE_MIND': '#8E44AD',
      'AI_CONTROLLED': '#34495E'
    };
    return colors[type] || '#95A5A6';
  };

  const getRaceTypeIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      'HUMANOID': '👤',
      'SILICON_BASED': '💎',
      'ENERGY_BEING': '⚡',
      'HIVE_MIND': '🐝',
      'MACHINE': '🤖',
      'AQUATIC': '🐙',
      'GASEOUS': '☁️',
      'CRYSTALLINE': '💎',
      'SYNTHETIC': '🔧',
      'HYBRID': '🧬'
    };
    return icons[type] || '❓';
  };

  return (
    <div className="civilization-browser">
      <div className="civilization-browser-header">
        <h2>🏛️ Galactic Civilizations Database</h2>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search civilizations, races, or characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="government">Government Type</option>
            <option value="race">Race</option>
            <option value="technology">High Technology</option>
          </select>
        </div>
      </div>

      <div className="civilization-browser-content">
        {/* Tab Navigation */}
        <div className="browser-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'civilizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('civilizations')}
          >
            Civilizations ({civilizations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'races' ? 'active' : ''}`}
            onClick={() => setActiveTab('races')}
          >
            Races ({races.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            Notable Individuals
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Galactic History
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="galaxy-stats">
                <div className="stat-card">
                  <div className="stat-value">{civilizations.length}</div>
                  <div className="stat-label">Known Civilizations</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{races.length}</div>
                  <div className="stat-label">Discovered Races</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{civilizationGenerator.getAllSystems().length}</div>
                  <div className="stat-label">Mapped Systems</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {Math.round(civilizations.reduce((sum, civ) => sum + civ.technology.overall, 0) / civilizations.length * 10) / 10}
                  </div>
                  <div className="stat-label">Avg Tech Level</div>
                </div>
              </div>

              <div className="recent-discoveries">
                <h3>Recent Civilizations Discovered</h3>
                <div className="discovery-list">
                  {civilizations.slice(0, 5).map(civ => {
                    const race = civilizationGenerator.getRaceById(civ.race);
                    return (
                      <div key={civ.id} className="discovery-item" onClick={() => handleCivilizationSelect(civ)}>
                        <div className="discovery-icon">{getRaceTypeIcon(race?.type || 'HUMANOID')}</div>
                        <div className="discovery-info">
                          <div className="discovery-name">{civ.name}</div>
                          <div className="discovery-details">
                            {race?.name} • {civ.government.type.replace('_', ' ')} • Tech Level {civ.technology.overall}
                          </div>
                        </div>
                        <div className="discovery-population">
                          {(civ.population / 1000000).toFixed(1)}M citizens
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="technology-distribution">
                <h3>Technology Distribution</h3>
                <div className="tech-chart">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => {
                    const count = civilizations.filter(civ => Math.floor(civ.technology.overall) === level).length;
                    const percentage = (count / civilizations.length) * 100;
                    return (
                      <div key={level} className="tech-bar">
                        <div className="tech-level">Level {level}</div>
                        <div className="tech-bar-container">
                          <div 
                            className="tech-bar-fill" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: getTechnologyLevelColor(level)
                            }}
                          />
                        </div>
                        <div className="tech-count">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'civilizations' && (
            <div className="civilizations-tab">
              <div className="civilizations-grid">
                {filteredCivilizations.map(civilization => {
                  const race = civilizationGenerator.getRaceById(civilization.race);
                  const lore = loreGenerator.getCivilizationLore(civilization.id);
                  
                  return (
                    <div 
                      key={civilization.id} 
                      className="civilization-card"
                      onClick={() => handleCivilizationSelect(civilization)}
                    >
                      <div className="civilization-header">
                        <div className="civilization-icon">
                          {getRaceTypeIcon(race?.type || 'HUMANOID')}
                        </div>
                        <div className="civilization-title">
                          <h3>{civilization.name}</h3>
                          <div className="civilization-subtitle">
                            {race?.name} {civilization.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>

                      <div className="civilization-stats">
                        <div className="stat-row">
                          <span className="stat-label">Population:</span>
                          <span className="stat-value">{(civilization.population / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Government:</span>
                          <span 
                            className="stat-value government-type"
                            style={{ color: getGovernmentTypeColor(civilization.government.type) }}
                          >
                            {civilization.government.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Technology:</span>
                          <span 
                            className="stat-value tech-level"
                            style={{ color: getTechnologyLevelColor(civilization.technology.overall) }}
                          >
                            Level {civilization.technology.overall}
                          </span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Territory:</span>
                          <span className="stat-value">{civilization.territory.length} systems</span>
                        </div>
                      </div>

                      {lore && (
                        <div className="civilization-preview">
                          <p className="founding-story-preview">
                            {lore.foundingStory.substring(0, 120)}...
                          </p>
                        </div>
                      )}

                      <div className="civilization-tags">
                        {race?.culturalTraits.values.slice(0, 3).map(value => (
                          <span key={value} className="civilization-tag">{value}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'races' && (
            <div className="races-tab">
              <div className="races-grid">
                {races.map(race => (
                  <div 
                    key={race.id} 
                    className="race-card"
                    onClick={() => setSelectedRace(race)}
                  >
                    <div className="race-header">
                      <div className="race-icon">
                        {getRaceTypeIcon(race.type)}
                      </div>
                      <div className="race-title">
                        <h3>{race.name}</h3>
                        <div className="race-subtitle">
                          {race.type.replace('_', ' ')} • {race.origin}
                        </div>
                      </div>
                    </div>

                    <div className="race-characteristics">
                      <div className="characteristic-row">
                        <span className="char-label">Height:</span>
                        <span className="char-value">{race.physicalTraits.averageHeight}m</span>
                      </div>
                      <div className="characteristic-row">
                        <span className="char-label">Lifespan:</span>
                        <span className="char-value">{race.physicalTraits.averageLifespan} years</span>
                      </div>
                      <div className="characteristic-row">
                        <span className="char-label">Intelligence:</span>
                        <span className="char-value">{race.mentalTraits.intelligence}/10</span>
                      </div>
                      <div className="characteristic-row">
                        <span className="char-label">Social Structure:</span>
                        <span className="char-value">{race.culturalTraits.socialStructure.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="race-traits">
                      <div className="trait-section">
                        <h4>Special Features:</h4>
                        <div className="trait-list">
                          {race.physicalTraits.specialFeatures.slice(0, 3).map(feature => (
                            <span key={feature} className="trait-tag">{feature.replace('_', ' ')}</span>
                          ))}
                        </div>
                      </div>

                      <div className="trait-section">
                        <h4>Core Values:</h4>
                        <div className="trait-list">
                          {race.culturalTraits.values.slice(0, 3).map(value => (
                            <span key={value} className="trait-tag">{value}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="race-technology">
                      <h4>Technology Specializations:</h4>
                      <div className="tech-specializations">
                        {Object.entries(race.technologicalLevel.specializations)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([field, level]) => (
                            <div key={field} className="tech-spec">
                              <span className="tech-field">{field}</span>
                              <span 
                                className="tech-level"
                                style={{ color: getTechnologyLevelColor(level) }}
                              >
                                {level}/10
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="characters-tab">
              <div className="characters-grid">
                {loreGenerator.getAllCivilizationLore().flatMap(lore => 
                  lore.notableIndividuals.map(individual => {
                    const civilization = civilizations.find(civ => civ.id === lore.id);
                    const race = civilization ? civilizationGenerator.getRaceById(civilization.race) : null;
                    
                    return (
                      <div 
                        key={individual.id} 
                        className="character-card"
                        onClick={() => handleCharacterSelect(individual)}
                      >
                        <div className="character-header">
                          <div className="character-icon">
                            {getRaceTypeIcon(race?.type || 'HUMANOID')}
                          </div>
                          <div className="character-title">
                            <h3>{individual.name}</h3>
                            <div className="character-subtitle">
                              {individual.profession} • {race?.name}
                            </div>
                          </div>
                          <div className="character-status">
                            <span className={`status-badge ${individual.currentStatus.toLowerCase()}`}>
                              {individual.currentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="character-details">
                          <div className="character-info">
                            <div className="info-row">
                              <span className="info-label">Age:</span>
                              <span className="info-value">
                                {individual.deathYear 
                                  ? `${individual.birthYear - (individual.deathYear || 0)} years (deceased)`
                                  : `${individual.birthYear} years old`
                                }
                              </span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Civilization:</span>
                              <span className="info-value">{civilization?.name}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Reputation:</span>
                              <span className={`info-value reputation ${individual.publicReputation >= 0 ? 'positive' : 'negative'}`}>
                                {individual.publicReputation >= 0 ? '+' : ''}{individual.publicReputation}
                              </span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Significance:</span>
                              <span className={`info-value significance ${individual.historicalSignificance.toLowerCase()}`}>
                                {individual.historicalSignificance}
                              </span>
                            </div>
                          </div>

                          <div className="character-personality">
                            <h4>Personality Traits:</h4>
                            <div className="personality-traits">
                              {individual.personality.traits.slice(0, 3).map(trait => (
                                <div key={trait.name} className="personality-trait">
                                  <span className="trait-name">{trait.name}</span>
                                  <div className="trait-strength">
                                    <div 
                                      className="trait-bar"
                                      style={{ width: `${trait.strength * 10}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="character-achievements">
                            <h4>Notable Achievements:</h4>
                            <div className="achievement-list">
                              {individual.achievements.slice(0, 2).map((achievement, index) => (
                                <div key={index} className="achievement-item">
                                  {achievement}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="character-motivations">
                            <h4>Motivations:</h4>
                            <div className="motivation-list">
                              {individual.motivations.slice(0, 3).map((motivation, index) => (
                                <span key={index} className="motivation-tag">{motivation}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <div className="galactic-timeline">
                <h3>Galactic Historical Timeline</h3>
                <div className="timeline">
                  {loreGenerator.getAllCivilizationLore().flatMap(lore => 
                    lore.historicalEras.map(era => ({
                      ...era,
                      civilizationName: lore.name,
                      civilizationId: lore.id
                    }))
                  )
                  .sort((a, b) => b.startYear - a.startYear) // Most recent first
                  .slice(0, 20) // Limit to 20 most recent events
                  .map(era => (
                    <div key={`${era.civilizationId}_${era.id}`} className="timeline-item">
                      <div className="timeline-marker" />
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{era.name}</h4>
                          <span className="timeline-date">
                            {era.startYear} - {era.endYear} years ago
                          </span>
                        </div>
                        <div className="timeline-civilization">
                          {era.civilizationName}
                        </div>
                        <div className="timeline-description">
                          {era.description}
                        </div>
                        <div className="timeline-impact">
                          <span className={`impact-badge ${era.impact.toLowerCase()}`}>
                            {era.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed View Modals */}
      {selectedCivilization && selectedCivilizationLore && (
        <div className="civilization-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCivilization.name}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setSelectedCivilization(null);
                  setSelectedCivilizationLore(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="civilization-detail-content">
                <div className="founding-story">
                  <h3>Founding Story</h3>
                  <p>{selectedCivilizationLore.foundingStory}</p>
                </div>
                
                <div className="historical-eras">
                  <h3>Historical Eras</h3>
                  <div className="eras-list">
                    {selectedCivilizationLore.historicalEras.map(era => (
                      <div key={era.id} className="era-item">
                        <div className="era-header">
                          <h4>{era.name}</h4>
                          <span className="era-period">
                            {era.startYear} - {era.endYear} years ago
                          </span>
                        </div>
                        <p className="era-description">{era.description}</p>
                        <div className="era-impact">
                          <span className={`impact-badge ${era.impact.toLowerCase()}`}>
                            {era.impact} Impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="notable-individuals">
                  <h3>Notable Individuals</h3>
                  <div className="individuals-grid">
                    {selectedCivilizationLore.notableIndividuals.slice(0, 6).map(individual => (
                      <div 
                        key={individual.id} 
                        className="individual-card"
                        onClick={() => handleCharacterSelect(individual)}
                      >
                        <h4>{individual.name}</h4>
                        <div className="individual-profession">{individual.profession}</div>
                        <div className="individual-status">{individual.currentStatus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CivilizationBrowser;
