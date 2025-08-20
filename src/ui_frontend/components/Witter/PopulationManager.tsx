import React, { useState, useEffect } from 'react';
import { PlayerInteractionService } from '../../services/PlayerInteractionService';
import './PopulationManager.css';

interface PopulationManagerProps {
  playerInteractionService: PlayerInteractionService;
  isVisible: boolean;
  onClose: () => void;
}

interface PopulationStats {
  totalGenerated: number;
  targetPopulation: number;
  completionPercentage: number;
  typeDistribution: { [type: string]: number };
  locationDistribution: { [location: string]: number };
  queuedGeneration: number;
}

export const PopulationManager: React.FC<PopulationManagerProps> = ({
  playerInteractionService,
  isVisible,
  onClose
}) => {
  const [stats, setStats] = useState<PopulationStats | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [generateCount, setGenerateCount] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationLog, setGenerationLog] = useState<string[]>([]);

  // Available locations for manual generation
  const locations = [
    { id: 'sol', name: 'Sol System' },
    { id: 'earth', name: 'Earth' },
    { id: 'mars', name: 'Mars' },
    { id: 'europa', name: 'Europa' },
    { id: 'alpha_centauri', name: 'Alpha Centauri' },
    { id: 'proxima_b', name: 'Proxima b' },
    { id: 'centauri_prime', name: 'Centauri Prime' },
    { id: 'vega', name: 'Vega System' },
    { id: 'vega_prime', name: 'Vega Prime' },
    { id: 'vega_secondary', name: 'Vega Secondary' },
    { id: 'kepler', name: 'Kepler System' },
    { id: 'kepler_442b', name: 'Kepler-442b' },
    { id: 'kepler_moon_1', name: 'Kepler Moon 1' },
    { id: 'sirius', name: 'Sirius System' },
    { id: 'sirius_station', name: 'Sirius Station' },
    { id: 'sirius_b_platform', name: 'Sirius B Platform' }
  ];

  // Update stats periodically
  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      const currentStats = playerInteractionService.getPopulationStats();
      setStats(currentStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isVisible, playerInteractionService]);

  const handleGenerateNPCs = async () => {
    if (!selectedLocation || generateCount <= 0) return;

    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      const newNPCs = await playerInteractionService.generateNPCsForLocation(selectedLocation, generateCount);
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(1);
      
      const logEntry = `Generated ${newNPCs.length} NPCs for ${selectedLocation} in ${duration}s`;
      setGenerationLog(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
      
      // Update stats
      const updatedStats = playerInteractionService.getPopulationStats();
      setStats(updatedStats);
      
    } catch (error) {
      const logEntry = `Failed to generate NPCs for ${selectedLocation}: ${error}`;
      setGenerationLog(prev => [logEntry, ...prev.slice(0, 9)]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'PERSONALITY': return '#F59E0B';
      case 'CITY_LEADER': return '#3B82F6';
      case 'PLANET_LEADER': return '#10B981';
      case 'DIVISION_LEADER': return '#EF4444';
      case 'BUSINESS_LEADER': return '#8B5CF6';
      case 'SCIENTIST': return '#06B6D4';
      case 'ARTIST': return '#EC4899';
      case 'CITIZEN': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (!isVisible) return null;

  return (
    <div className="population-manager-overlay">
      <div className="population-manager">
        <div className="population-manager-header">
          <h2>🌌 Galactic Population Manager</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="population-manager-content">
          {stats && (
            <>
              {/* Overview Stats */}
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-value">{formatNumber(stats.totalGenerated)}</div>
                  <div className="stat-label">NPCs Generated</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatNumber(stats.targetPopulation)}</div>
                  <div className="stat-label">Target Population</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.completionPercentage.toFixed(1)}%</div>
                  <div className="stat-label">Completion</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.queuedGeneration}</div>
                  <div className="stat-label">Queued Batches</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-label">Population Generation Progress</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(stats.completionPercentage, 100)}%` }}
                  />
                </div>
                <div className="progress-text">
                  {stats.totalGenerated.toLocaleString()} / {stats.targetPopulation.toLocaleString()} NPCs
                </div>
              </div>

              {/* Type Distribution */}
              <div className="distribution-section">
                <h3>NPC Type Distribution</h3>
                <div className="type-distribution">
                  {Object.entries(stats.typeDistribution).map(([type, count]) => (
                    <div key={type} className="type-item">
                      <div className="type-header">
                        <span 
                          className="type-indicator" 
                          style={{ backgroundColor: getTypeColor(type) }}
                        />
                        <span className="type-name">{type.replace('_', ' ')}</span>
                        <span className="type-count">{count.toLocaleString()}</span>
                      </div>
                      <div className="type-bar">
                        <div 
                          className="type-bar-fill" 
                          style={{ 
                            width: `${(count / stats.totalGenerated) * 100}%`,
                            backgroundColor: getTypeColor(type)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Distribution */}
              <div className="distribution-section">
                <h3>Location Distribution (Top 10)</h3>
                <div className="location-distribution">
                  {Object.entries(stats.locationDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([location, count]) => (
                      <div key={location} className="location-item">
                        <div className="location-header">
                          <span className="location-name">{location}</span>
                          <span className="location-count">{count.toLocaleString()}</span>
                        </div>
                        <div className="location-bar">
                          <div 
                            className="location-bar-fill" 
                            style={{ 
                              width: `${(count / stats.totalGenerated) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Manual Generation */}
              <div className="generation-section">
                <h3>Manual NPC Generation</h3>
                <div className="generation-controls">
                  <div className="control-group">
                    <label htmlFor="location-select">Location:</label>
                    <select 
                      id="location-select"
                      value={selectedLocation} 
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      disabled={isGenerating}
                    >
                      <option value="">Select Location</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="control-group">
                    <label htmlFor="count-input">Count:</label>
                    <input 
                      id="count-input"
                      type="number" 
                      min="1" 
                      max="1000" 
                      value={generateCount}
                      onChange={(e) => setGenerateCount(parseInt(e.target.value) || 0)}
                      disabled={isGenerating}
                    />
                  </div>
                  
                  <button 
                    className="generate-btn"
                    onClick={handleGenerateNPCs}
                    disabled={!selectedLocation || generateCount <= 0 || isGenerating}
                  >
                    {isGenerating ? '⏳ Generating...' : '🚀 Generate NPCs'}
                  </button>
                </div>

                {/* Generation Log */}
                {generationLog.length > 0 && (
                  <div className="generation-log">
                    <h4>Generation Log</h4>
                    <div className="log-entries">
                      {generationLog.map((entry, index) => (
                        <div key={index} className="log-entry">
                          <span className="log-time">
                            {new Date().toLocaleTimeString()}
                          </span>
                          <span className="log-message">{entry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopulationManager;
