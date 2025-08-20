import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { GalacticExplorationService, ExplorationState, ExplorationEvent, Expedition, DiscoveryZone, CosmicAnomaly, FirstContactProtocol } from '../../services/GalacticExplorationService';
import './ExplorationDashboard.css';

interface ExplorationDashboardProps {
  explorationService: GalacticExplorationService;
  playerId: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ExplorationDashboard: React.FC<ExplorationDashboardProps> = ({
  explorationService,
  playerId,
  isVisible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'expeditions' | 'discoveries' | 'contacts' | 'zones'>('overview');
  const [explorationState, setExplorationState] = useState<ExplorationState | null>(null);
  const [discoveryZones, setDiscoveryZones] = useState<DiscoveryZone[]>([]);
  const [cosmicAnomalies, setCosmicAnomalies] = useState<CosmicAnomaly[]>([]);
  const [firstContacts, setFirstContacts] = useState<FirstContactProtocol[]>([]);
  const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);
  const [newExpeditionForm, setNewExpeditionForm] = useState<{
    name: string;
    targetZone: string;
    duration: number;
    objectives: string[];
  }>({
    name: '',
    targetZone: '',
    duration: 4,
    objectives: []
  });

  // Update data periodically
  useEffect(() => {
    if (!isVisible) return;

    const updateData = () => {
      const state = explorationService.getPlayerExplorationState(playerId);
      setExplorationState(state);
      
      setDiscoveryZones(explorationService.getDiscoveryZones());
      setCosmicAnomalies(explorationService.getCosmicAnomalies());
      setFirstContacts(explorationService.getFirstContacts(playerId));
    };

    updateData();
    const interval = setInterval(updateData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isVisible, explorationService, playerId]);

  const handleLaunchExpedition = async () => {
    if (!newExpeditionForm.name || !newExpeditionForm.targetZone) return;

    try {
      const targetZone = discoveryZones.find(z => z.id === newExpeditionForm.targetZone);
      if (!targetZone) return;

      const expedition = await explorationService.launchExpedition(playerId, {
        name: newExpeditionForm.name,
        targetLocation: {
          coordinates: targetZone.centerCoordinates,
          searchRadius: targetZone.radius
        },
        estimatedDuration: newExpeditionForm.duration,
        objectives: newExpeditionForm.objectives.map((obj, index) => ({
          id: `obj_${index}`,
          type: 'MAP_SYSTEM',
          description: obj,
          completed: false,
          reward: [{ type: 'EXPLORATION_POINTS', amount: 25, description: 'Objective completion' }]
        }))
      });

      setSelectedExpedition(expedition);
      
      // Reset form
      setNewExpeditionForm({
        name: '',
        targetZone: '',
        duration: 4,
        objectives: []
      });
      
    } catch (error) {
      console.error('Failed to launch expedition:', error);
    }
  };

  const getSignificanceColor = (significance: string): string => {
    switch (significance) {
      case 'LEGENDARY': return '#FFD700';
      case 'HISTORIC': return '#FF6B6B';
      case 'MAJOR': return '#4ECDC4';
      case 'MINOR': return '#95A5A6';
      default: return '#95A5A6';
    }
  };

  const getExpeditionStatusColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED': return '#2ECC71';
      case 'EXPLORING': return '#3498DB';
      case 'IN_TRANSIT': return '#F39C12';
      case 'FAILED': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const getDiplomaticStatusColor = (status: string): string => {
    switch (status) {
      case 'ALLIED': return '#2ECC71';
      case 'FRIENDLY': return '#27AE60';
      case 'NEUTRAL': return '#95A5A6';
      case 'TENSE': return '#F39C12';
      case 'HOSTILE': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  if (!isVisible || !explorationState) return null;

  return (
    <div className="exploration-dashboard-overlay">
      <div className="exploration-dashboard">
        <div className="exploration-dashboard-header">
          <h2>🚀 Galactic Exploration Command</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="exploration-dashboard-content">
          {/* Tab Navigation */}
          <div className="exploration-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'expeditions' ? 'active' : ''}`}
              onClick={() => setActiveTab('expeditions')}
            >
              Expeditions ({explorationState.activeExpeditions.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'discoveries' ? 'active' : ''}`}
              onClick={() => setActiveTab('discoveries')}
            >
              Discoveries ({explorationState.explorationHistory.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              First Contacts ({firstContacts.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'zones' ? 'active' : ''}`}
              onClick={() => setActiveTab('zones')}
            >
              Discovery Zones
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                {/* Explorer Stats */}
                <div className="explorer-stats">
                  <div className="stat-card">
                    <div className="stat-value">Level {explorationState.explorationLevel}</div>
                    <div className="stat-label">Explorer Rank</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{explorationState.explorationPoints}</div>
                    <div className="stat-label">Exploration Points</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{explorationState.discoveredSystems.size}</div>
                    <div className="stat-label">Systems Discovered</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{explorationState.discoveredRaces.size}</div>
                    <div className="stat-label">Races Encountered</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{explorationState.discoveryStreak}</div>
                    <div className="stat-label">Discovery Streak</div>
                  </div>
                </div>

                {/* Current Location */}
                <div className="current-location">
                  <h3>Current Location</h3>
                  <div className="location-info">
                    <span className="location-system">📍 {explorationState.currentLocation.systemId}</span>
                    {explorationState.currentLocation.planetId && (
                      <span className="location-planet">🌍 {explorationState.currentLocation.planetId}</span>
                    )}
                  </div>
                </div>

                {/* Recent Discoveries */}
                <div className="recent-discoveries">
                  <h3>Recent Discoveries</h3>
                  <div className="discovery-list">
                    {explorationState.explorationHistory.slice(-5).reverse().map(discovery => (
                      <div key={discovery.id} className="discovery-item">
                        <div className="discovery-header">
                          <span 
                            className="discovery-significance" 
                            style={{ color: getSignificanceColor(discovery.significance) }}
                          >
                            ⭐ {discovery.significance}
                          </span>
                          <span className="discovery-date">
                            {formatDistanceToNow(new Date(discovery.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="discovery-name">{discovery.discoveredEntity?.name}</div>
                        <div className="discovery-description">{discovery.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Expeditions Summary */}
                <div className="active-expeditions-summary">
                  <h3>Active Expeditions</h3>
                  {explorationState.activeExpeditions.length > 0 ? (
                    <div className="expedition-summary-list">
                      {explorationState.activeExpeditions.map(expedition => (
                        <div key={expedition.id} className="expedition-summary-item">
                          <div className="expedition-name">{expedition.name}</div>
                          <div className="expedition-status" style={{ color: getExpeditionStatusColor(expedition.status) }}>
                            {expedition.status}
                          </div>
                          <div className="expedition-progress">
                            {expedition.discoveries.length} discoveries so far
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-expeditions">
                      <p>No active expeditions. Launch one from the Expeditions tab!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'expeditions' && (
              <div className="expeditions-tab">
                {/* Launch New Expedition */}
                <div className="new-expedition-form">
                  <h3>Launch New Expedition</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expedition Name:</label>
                      <input
                        type="text"
                        value={newExpeditionForm.name}
                        onChange={(e) => setNewExpeditionForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Deep Space Survey Alpha"
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Zone:</label>
                      <select
                        value={newExpeditionForm.targetZone}
                        onChange={(e) => setNewExpeditionForm(prev => ({ ...prev, targetZone: e.target.value }))}
                      >
                        <option value="">Select Discovery Zone</option>
                        {discoveryZones.map(zone => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} (Level {zone.recommendedLevel})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Duration (hours):</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={newExpeditionForm.duration}
                        onChange={(e) => setNewExpeditionForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <button 
                    className="launch-expedition-btn"
                    onClick={handleLaunchExpedition}
                    disabled={!newExpeditionForm.name || !newExpeditionForm.targetZone || explorationState.explorationPoints < 50}
                  >
                    🚀 Launch Expedition (50 EP)
                  </button>
                </div>

                {/* Active Expeditions */}
                <div className="active-expeditions">
                  <h3>Active Expeditions</h3>
                  {explorationState.activeExpeditions.length > 0 ? (
                    <div className="expedition-list">
                      {explorationState.activeExpeditions.map(expedition => (
                        <div key={expedition.id} className="expedition-item">
                          <div className="expedition-header">
                            <div className="expedition-name">{expedition.name}</div>
                            <div className="expedition-status" style={{ color: getExpeditionStatusColor(expedition.status) }}>
                              {expedition.status}
                            </div>
                          </div>
                          <div className="expedition-details">
                            <div className="expedition-info">
                              <span>Duration: {expedition.estimatedDuration}h</span>
                              <span>Risk Level: {expedition.riskLevel}/10</span>
                              <span>Crew: {expedition.crew.length}</span>
                            </div>
                            <div className="expedition-progress">
                              <span>Discoveries: {expedition.discoveries.length}</span>
                              <span>Objectives: {expedition.objectives.filter(o => o.completed).length}/{expedition.objectives.length}</span>
                            </div>
                          </div>
                          {expedition.discoveries.length > 0 && (
                            <div className="expedition-discoveries">
                              <h4>Recent Discoveries:</h4>
                              {expedition.discoveries.slice(-3).map(discovery => (
                                <div key={discovery.id} className="mini-discovery">
                                  <span style={{ color: getSignificanceColor(discovery.significance) }}>
                                    {discovery.discoveredEntity?.name}
                                  </span>
                                  <span className="mini-discovery-type">
                                    ({discovery.type.replace('_', ' ')})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-expeditions">
                      <p>No active expeditions. Launch your first expedition above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'discoveries' && (
              <div className="discoveries-tab">
                <div className="discoveries-list">
                  {explorationState.explorationHistory.length > 0 ? (
                    explorationState.explorationHistory.slice().reverse().map(discovery => (
                      <div key={discovery.id} className="discovery-card">
                        <div className="discovery-card-header">
                          <div className="discovery-card-title">
                            <span 
                              className="discovery-significance-badge" 
                              style={{ backgroundColor: getSignificanceColor(discovery.significance) }}
                            >
                              {discovery.significance}
                            </span>
                            <span className="discovery-entity-name">
                              {discovery.discoveredEntity?.name}
                            </span>
                          </div>
                          <div className="discovery-timestamp">
                            {formatDistanceToNow(new Date(discovery.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                        
                        <div className="discovery-card-content">
                          <div className="discovery-type">
                            {discovery.type.replace('_', ' ')} • {discovery.discoveredEntity?.type.replace('_', ' ')}
                          </div>
                          <div className="discovery-description">
                            {discovery.description}
                          </div>
                          <div className="discovery-location">
                            📍 {discovery.location.systemId}
                            {discovery.location.planetId && ` • ${discovery.location.planetId}`}
                          </div>
                        </div>

                        {discovery.rewards.length > 0 && (
                          <div className="discovery-rewards">
                            <h4>Rewards:</h4>
                            <div className="reward-list">
                              {discovery.rewards.map((reward, index) => (
                                <div key={index} className="reward-item">
                                  <span className="reward-amount">+{reward.amount}</span>
                                  <span className="reward-type">{reward.type.replace('_', ' ')}</span>
                                  <span className="reward-description">{reward.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {discovery.sharedWithNetwork && (
                          <div className="discovery-shared">
                            🌐 Shared on Galactic Network
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-discoveries">
                      <p>No discoveries yet. Launch expeditions to explore the galaxy!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="contacts-tab">
                {firstContacts.length > 0 ? (
                  <div className="contacts-list">
                    {firstContacts.map(contact => (
                      <div key={`${contact.raceId}_${contact.contactingPlayerId}`} className="contact-card">
                        <div className="contact-header">
                          <div className="contact-race-name">{contact.raceId}</div>
                          <div 
                            className="diplomatic-status" 
                            style={{ color: getDiplomaticStatusColor(contact.diplomaticStatus) }}
                          >
                            {contact.diplomaticStatus}
                          </div>
                        </div>
                        
                        <div className="contact-details">
                          <div className="contact-info-row">
                            <span className="contact-label">First Contact:</span>
                            <span className="contact-value">
                              {formatDistanceToNow(new Date(contact.contactDate), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="contact-info-row">
                            <span className="contact-label">Initial Reaction:</span>
                            <span className="contact-value">{contact.initialReaction}</span>
                          </div>
                          <div className="contact-info-row">
                            <span className="contact-label">Communication:</span>
                            <span className="contact-value">
                              {contact.communicationEstablished ? '✅ Established' : '❌ Difficult'}
                            </span>
                          </div>
                          <div className="contact-info-row">
                            <span className="contact-label">Cultural Exchange:</span>
                            <span className="contact-value">{contact.culturalExchangeLevel}/10</span>
                          </div>
                          <div className="contact-info-row">
                            <span className="contact-label">Trade Relations:</span>
                            <span className="contact-value">
                              {contact.tradeRelations ? '✅ Active' : '❌ None'}
                            </span>
                          </div>
                        </div>

                        {contact.sharedTechnologies.length > 0 && (
                          <div className="shared-technologies">
                            <h4>Shared Technologies:</h4>
                            <div className="tech-list">
                              {contact.sharedTechnologies.map(tech => (
                                <span key={tech} className="tech-item">{tech}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {contact.ongoingNegotiations.length > 0 && (
                          <div className="ongoing-negotiations">
                            <h4>Ongoing Negotiations:</h4>
                            <div className="negotiation-list">
                              {contact.ongoingNegotiations.map(negotiation => (
                                <div key={negotiation} className="negotiation-item">{negotiation}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-contacts">
                    <p>No first contacts yet. Explore the galaxy to discover new civilizations!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'zones' && (
              <div className="zones-tab">
                <div className="zones-grid">
                  {discoveryZones.map(zone => (
                    <div key={zone.id} className="zone-card">
                      <div className="zone-header">
                        <div className="zone-name">{zone.name}</div>
                        <div className="zone-level">Level {zone.recommendedLevel}</div>
                      </div>
                      
                      <div className="zone-stats">
                        <div className="zone-stat">
                          <span className="zone-stat-label">Discovery Density:</span>
                          <span className="zone-stat-value">{Math.round(zone.discoveryDensity * 100)}%</span>
                        </div>
                        <div className="zone-stat">
                          <span className="zone-stat-label">Danger Level:</span>
                          <span className="zone-stat-value">{zone.dangerLevel}/10</span>
                        </div>
                        <div className="zone-stat">
                          <span className="zone-stat-label">Radius:</span>
                          <span className="zone-stat-value">{zone.radius} LY</span>
                        </div>
                      </div>

                      <div className="zone-characteristics">
                        <h4>Characteristics:</h4>
                        <div className="characteristic-list">
                          {zone.specialCharacteristics.map(char => (
                            <span key={char} className="characteristic-item">{char}</span>
                          ))}
                        </div>
                      </div>

                      <div className="zone-phenomena">
                        <h4>Phenomena:</h4>
                        <div className="phenomena-list">
                          {zone.dominantPhenomena.map(phenomenon => (
                            <span key={phenomenon} className="phenomenon-item">{phenomenon}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorationDashboard;
