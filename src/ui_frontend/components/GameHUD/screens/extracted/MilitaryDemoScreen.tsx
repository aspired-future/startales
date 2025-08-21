import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './MilitaryDemoScreen.css';

interface MilitaryUnit {
  id: string;
  name: string;
  type: string;
  strength: number;
  morale: number;
  experience: number;
  status: 'active' | 'deployed' | 'recovering' | 'training';
  location: string;
  equipment: string[];
  commander: string;
  casualties: number;
  victories: number;
}

interface Battle {
  id: string;
  name: string;
  date: string;
  participants: string[];
  outcome: 'victory' | 'defeat' | 'stalemate';
  casualties: {
    friendly: number;
    enemy: number;
  };
  duration: number;
  terrain: string;
  weather: string;
  tacticalAdvantage: number;
}

interface MoraleData {
  unitId: string;
  unitName: string;
  currentMorale: number;
  factors: {
    leadership: number;
    supplies: number;
    recentVictories: number;
    casualties: number;
    homeSupport: number;
  };
  trend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
}

interface Alliance {
  id: string;
  name: string;
  members: string[];
  strength: number;
  status: 'active' | 'forming' | 'dissolved';
  sharedResources: number;
  coordinationLevel: number;
  trustLevel: number;
  objectives: string[];
}

interface SensorNetwork {
  id: string;
  name: string;
  type: 'radar' | 'satellite' | 'ground' | 'naval' | 'cyber';
  coverage: number;
  accuracy: number;
  status: 'operational' | 'maintenance' | 'offline' | 'compromised';
  location: string;
  detectionRange: number;
  lastUpdate: string;
}

interface IntelligenceOperation {
  id: string;
  codename: string;
  type: 'reconnaissance' | 'sabotage' | 'infiltration' | 'counterintel';
  status: 'planning' | 'active' | 'completed' | 'compromised' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  risk: number;
  expectedCompletion: string;
  operatives: number;
  budget: number;
  intelligence: string[];
}

interface MilitaryData {
  units: MilitaryUnit[];
  battles: Battle[];
  moraleData: MoraleData[];
  alliances: Alliance[];
  sensorNetworks: SensorNetwork[];
  intelligenceOps: IntelligenceOperation[];
  overview: {
    totalUnits: number;
    activeOperations: number;
    moraleAverage: number;
    battleReadiness: number;
  };
}

const MilitaryDemoScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [militaryData, setMilitaryData] = useState<MilitaryData | null>(null);
  const [activeTab, setActiveTab] = useState<'units' | 'battles' | 'morale' | 'alliance' | 'sensors' | 'intelligence'>('units');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/military/units', description: 'Get all military units' },
    { method: 'GET', path: '/api/military/battles', description: 'Get battle history' },
    { method: 'GET', path: '/api/military/morale', description: 'Get morale analysis' },
    { method: 'GET', path: '/api/military/alliances', description: 'Get alliance information' },
    { method: 'GET', path: '/api/military/sensors', description: 'Get sensor network status' },
    { method: 'GET', path: '/api/military/intelligence', description: 'Get intelligence operations' },
    { method: 'POST', path: '/api/military/units', description: 'Create new military unit' },
    { method: 'POST', path: '/api/military/battles', description: 'Simulate battle' },
    { method: 'POST', path: '/api/military/intelligence', description: 'Launch intelligence operation' },
    { method: 'PUT', path: '/api/military/units/:id', description: 'Update unit status' },
    { method: 'DELETE', path: '/api/military/units/:id', description: 'Disband unit' }
  ];

  const fetchMilitaryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        unitsRes,
        battlesRes,
        moraleRes,
        alliancesRes,
        sensorsRes,
        intelligenceRes
      ] = await Promise.all([
        fetch('/api/military/units'),
        fetch('/api/military/battles'),
        fetch('/api/military/morale'),
        fetch('/api/military/alliances'),
        fetch('/api/military/sensors'),
        fetch('/api/military/intelligence')
      ]);

      const [
        units,
        battles,
        morale,
        alliances,
        sensors,
        intelligence
      ] = await Promise.all([
        unitsRes.json(),
        battlesRes.json(),
        moraleRes.json(),
        alliancesRes.json(),
        sensorsRes.json(),
        intelligenceRes.json()
      ]);

      const militaryUnits = units.units || generateMockUnits();
      const moraleAnalysis = morale.morale || generateMockMoraleData();

      setMilitaryData({
        units: militaryUnits,
        battles: battles.battles || generateMockBattles(),
        moraleData: moraleAnalysis,
        alliances: alliances.alliances || generateMockAlliances(),
        sensorNetworks: sensors.sensors || generateMockSensorNetworks(),
        intelligenceOps: intelligence.operations || generateMockIntelligenceOps(),
        overview: {
          totalUnits: militaryUnits.length,
          activeOperations: (intelligence.operations || generateMockIntelligenceOps()).filter((op: IntelligenceOperation) => op.status === 'active').length,
          moraleAverage: moraleAnalysis.reduce((sum: number, data: MoraleData) => sum + data.currentMorale, 0) / moraleAnalysis.length,
          battleReadiness: Math.round(militaryUnits.reduce((sum: number, unit: MilitaryUnit) => sum + (unit.strength * unit.morale / 100), 0) / militaryUnits.length)
        }
      });
    } catch (err) {
      console.error('Failed to fetch military data:', err);
      // Use mock data as fallback
      const mockUnits = generateMockUnits();
      const mockMorale = generateMockMoraleData();
      const mockIntelOps = generateMockIntelligenceOps();

      setMilitaryData({
        units: mockUnits,
        battles: generateMockBattles(),
        moraleData: mockMorale,
        alliances: generateMockAlliances(),
        sensorNetworks: generateMockSensorNetworks(),
        intelligenceOps: mockIntelOps,
        overview: {
          totalUnits: mockUnits.length,
          activeOperations: mockIntelOps.filter(op => op.status === 'active').length,
          moraleAverage: mockMorale.reduce((sum, data) => sum + data.currentMorale, 0) / mockMorale.length,
          battleReadiness: Math.round(mockUnits.reduce((sum, unit) => sum + (unit.strength * unit.morale / 100), 0) / mockUnits.length)
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilitaryData();
  }, [fetchMilitaryData]);

  const generateMockUnits = (): MilitaryUnit[] => [
    {
      id: 'unit-1',
      name: '1st Armored Division',
      type: 'Heavy Armor',
      strength: 850,
      morale: 78,
      experience: 85,
      status: 'active',
      location: 'Forward Base Alpha',
      equipment: ['M1A2 Abrams', 'Bradley IFV', 'Apache Helicopters'],
      commander: 'General Sarah Mitchell',
      casualties: 12,
      victories: 8
    },
    {
      id: 'unit-2',
      name: 'Elite Strike Force',
      type: 'Special Operations',
      strength: 120,
      morale: 92,
      experience: 95,
      status: 'deployed',
      location: 'Classified',
      equipment: ['Advanced Combat Suits', 'Stealth Technology', 'Cyber Warfare Tools'],
      commander: 'Colonel Marcus Kane',
      casualties: 3,
      victories: 15
    },
    {
      id: 'unit-3',
      name: '3rd Naval Fleet',
      type: 'Naval',
      strength: 2400,
      morale: 65,
      experience: 72,
      status: 'recovering',
      location: 'Port Meridian',
      equipment: ['Destroyers', 'Submarines', 'Carrier Aircraft'],
      commander: 'Admiral Elena Rodriguez',
      casualties: 45,
      victories: 5
    },
    {
      id: 'unit-4',
      name: 'Cyber Defense Corps',
      type: 'Cyber Warfare',
      strength: 300,
      morale: 88,
      experience: 90,
      status: 'active',
      location: 'Central Command',
      equipment: ['Quantum Computers', 'AI Defense Systems', 'Secure Networks'],
      commander: 'Dr. Alex Chen',
      casualties: 0,
      victories: 12
    }
  ];

  const generateMockBattles = (): Battle[] => [
    {
      id: 'battle-1',
      name: 'Operation Steel Thunder',
      date: '2024-02-15',
      participants: ['1st Armored Division', 'Enemy Coalition Forces'],
      outcome: 'victory',
      casualties: { friendly: 23, enemy: 156 },
      duration: 8,
      terrain: 'Desert',
      weather: 'Clear',
      tacticalAdvantage: 75
    },
    {
      id: 'battle-2',
      name: 'Battle of Crimson Ridge',
      date: '2024-01-28',
      participants: ['Elite Strike Force', '3rd Naval Fleet', 'Hostile Forces'],
      outcome: 'victory',
      casualties: { friendly: 8, enemy: 89 },
      duration: 12,
      terrain: 'Mountain',
      weather: 'Stormy',
      tacticalAdvantage: 60
    },
    {
      id: 'battle-3',
      name: 'Cyber Siege Defense',
      date: '2024-02-08',
      participants: ['Cyber Defense Corps', 'Unknown Cyber Attackers'],
      outcome: 'victory',
      casualties: { friendly: 0, enemy: 0 },
      duration: 72,
      terrain: 'Digital',
      weather: 'N/A',
      tacticalAdvantage: 85
    }
  ];

  const generateMockMoraleData = (): MoraleData[] => [
    {
      unitId: 'unit-1',
      unitName: '1st Armored Division',
      currentMorale: 78,
      factors: {
        leadership: 85,
        supplies: 90,
        recentVictories: 80,
        casualties: 65,
        homeSupport: 75
      },
      trend: 'stable',
      recommendations: ['Increase R&R rotation', 'Improve medical support']
    },
    {
      unitId: 'unit-2',
      unitName: 'Elite Strike Force',
      currentMorale: 92,
      factors: {
        leadership: 95,
        supplies: 100,
        recentVictories: 95,
        casualties: 90,
        homeSupport: 85
      },
      trend: 'improving',
      recommendations: ['Maintain current excellence', 'Consider expansion']
    },
    {
      unitId: 'unit-3',
      unitName: '3rd Naval Fleet',
      currentMorale: 65,
      factors: {
        leadership: 70,
        supplies: 80,
        recentVictories: 60,
        casualties: 45,
        homeSupport: 70
      },
      trend: 'declining',
      recommendations: ['Leadership review needed', 'Increase shore leave', 'Equipment upgrades']
    }
  ];

  const generateMockAlliances = (): Alliance[] => [
    {
      id: 'alliance-1',
      name: 'Northern Defense Pact',
      members: ['Terran Federation', 'Stellar Republic', 'Aurora Coalition'],
      strength: 85,
      status: 'active',
      sharedResources: 75,
      coordinationLevel: 80,
      trustLevel: 90,
      objectives: ['Mutual Defense', 'Technology Sharing', 'Joint Training']
    },
    {
      id: 'alliance-2',
      name: 'Maritime Security Alliance',
      members: ['Terran Federation', 'Ocean States Union'],
      strength: 70,
      status: 'active',
      sharedResources: 60,
      coordinationLevel: 75,
      trustLevel: 85,
      objectives: ['Naval Patrol', 'Trade Route Protection', 'Anti-Piracy']
    }
  ];

  const generateMockSensorNetworks = (): SensorNetwork[] => [
    {
      id: 'sensor-1',
      name: 'Deep Space Surveillance Array',
      type: 'satellite',
      coverage: 95,
      accuracy: 88,
      status: 'operational',
      location: 'Orbital Platform 7',
      detectionRange: 50000,
      lastUpdate: '2024-02-20T14:30:00Z'
    },
    {
      id: 'sensor-2',
      name: 'Coastal Defense Radar',
      type: 'radar',
      coverage: 78,
      accuracy: 92,
      status: 'operational',
      location: 'Cape Meridian',
      detectionRange: 800,
      lastUpdate: '2024-02-20T14:25:00Z'
    },
    {
      id: 'sensor-3',
      name: 'Cyber Threat Monitor',
      type: 'cyber',
      coverage: 85,
      accuracy: 94,
      status: 'operational',
      location: 'Central Command',
      detectionRange: 0,
      lastUpdate: '2024-02-20T14:35:00Z'
    }
  ];

  const generateMockIntelligenceOps = (): IntelligenceOperation[] => [
    {
      id: 'intel-1',
      codename: 'Operation Shadow Veil',
      type: 'reconnaissance',
      status: 'active',
      priority: 'high',
      progress: 65,
      risk: 40,
      expectedCompletion: '2024-03-15',
      operatives: 8,
      budget: 2500000,
      intelligence: ['Enemy troop movements', 'Supply chain vulnerabilities']
    },
    {
      id: 'intel-2',
      codename: 'Digital Ghost',
      type: 'counterintel',
      status: 'planning',
      priority: 'critical',
      progress: 15,
      risk: 75,
      expectedCompletion: '2024-04-01',
      operatives: 12,
      budget: 4200000,
      intelligence: ['Cyber infiltration attempts', 'Foreign agent networks']
    },
    {
      id: 'intel-3',
      codename: 'Silent Thunder',
      type: 'sabotage',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      risk: 60,
      expectedCompletion: '2024-02-10',
      operatives: 6,
      budget: 1800000,
      intelligence: ['Mission successful', 'Target neutralized', 'No casualties']
    }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
      case 'operational': return '#28a745';
      case 'deployed': return '#17a2b8';
      case 'recovering':
      case 'maintenance': return '#ffc107';
      case 'training':
      case 'planning': return '#6f42c1';
      case 'offline':
      case 'failed': return '#dc3545';
      case 'compromised': return '#e83e8c';
      case 'completed': return '#20c997';
      default: return '#4ecdc4';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#4ecdc4';
    }
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const renderUnits = () => (
    <div className="units-view">
      <div className="units-header">
        <h4>🪖 Military Units</h4>
        <div className="units-actions">
          <button className="action-btn">Refresh Units</button>
          <button className="action-btn secondary">Create Unit</button>
          <button className="action-btn">Load Overview</button>
        </div>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-value">{militaryData?.overview.totalUnits || 0}</div>
          <div className="stat-label">Total Units</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{militaryData?.overview.battleReadiness || 0}%</div>
          <div className="stat-label">Battle Readiness</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{militaryData?.overview.moraleAverage?.toFixed(0) || 0}%</div>
          <div className="stat-label">Average Morale</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{militaryData?.overview.activeOperations || 0}</div>
          <div className="stat-label">Active Operations</div>
        </div>
      </div>

      <div className="units-grid">
        {militaryData?.units.map((unit) => (
          <div key={unit.id} className="unit-card">
            <div className="unit-header">
              <div className="unit-name">{unit.name}</div>
              <div className="unit-status" style={{ color: getStatusColor(unit.status) }}>
                {unit.status.toUpperCase()}
              </div>
            </div>
            
            <div className="unit-type">{unit.type}</div>
            <div className="unit-commander">Commander: {unit.commander}</div>
            <div className="unit-location">📍 {unit.location}</div>

            <div className="unit-metrics">
              <div className="metric-row">
                <span>Strength:</span>
                <span className="metric-value">{unit.strength.toLocaleString()}</span>
              </div>
              <div className="metric-row">
                <span>Morale:</span>
                <span className="metric-value">{unit.morale}%</span>
              </div>
              <div className="metric-row">
                <span>Experience:</span>
                <span className="metric-value">{unit.experience}%</span>
              </div>
              <div className="metric-row">
                <span>Victories:</span>
                <span className="metric-value">{unit.victories}</span>
              </div>
            </div>

            <div className="unit-equipment">
              <h6>Equipment:</h6>
              <div className="equipment-list">
                {unit.equipment.map((item, i) => (
                  <span key={i} className="equipment-tag">{item}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBattles = () => (
    <div className="battles-view">
      <div className="battles-header">
        <h4>⚔️ Battle History</h4>
        <div className="battles-actions">
          <button className="action-btn">Refresh Battles</button>
          <button className="action-btn secondary">Simulate Battle</button>
        </div>
      </div>

      <div className="battles-grid">
        {militaryData?.battles.map((battle) => (
          <div key={battle.id} className="battle-card">
            <div className="battle-header">
              <div className="battle-name">{battle.name}</div>
              <div className={`battle-outcome outcome-${battle.outcome}`}>
                {battle.outcome.toUpperCase()}
              </div>
            </div>

            <div className="battle-date">{new Date(battle.date).toLocaleDateString()}</div>
            <div className="battle-duration">Duration: {battle.duration} hours</div>

            <div className="battle-conditions">
              <div className="condition-item">
                <span>Terrain:</span>
                <span>{battle.terrain}</span>
              </div>
              <div className="condition-item">
                <span>Weather:</span>
                <span>{battle.weather}</span>
              </div>
              <div className="condition-item">
                <span>Tactical Advantage:</span>
                <span>{battle.tacticalAdvantage}%</span>
              </div>
            </div>

            <div className="casualties-section">
              <h6>Casualties:</h6>
              <div className="casualties-grid">
                <div className="casualty-item friendly">
                  <span>Friendly:</span>
                  <span>{battle.casualties.friendly}</span>
                </div>
                <div className="casualty-item enemy">
                  <span>Enemy:</span>
                  <span>{battle.casualties.enemy}</span>
                </div>
              </div>
            </div>

            <div className="participants-section">
              <h6>Participants:</h6>
              <div className="participants-list">
                {battle.participants.map((participant, i) => (
                  <span key={i} className="participant-tag">{participant}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMorale = () => (
    <div className="morale-view">
      <div className="morale-header">
        <h4>🎯 Morale Analysis</h4>
        <div className="morale-actions">
          <button className="action-btn">Refresh Analysis</button>
          <button className="action-btn secondary">Generate Report</button>
        </div>
      </div>

      <div className="morale-grid">
        {militaryData?.moraleData.map((data) => (
          <div key={data.unitId} className="morale-card">
            <div className="morale-header-card">
              <div className="unit-name">{data.unitName}</div>
              <div className="morale-trend">
                {getTrendIcon(data.trend)} {data.trend}
              </div>
            </div>

            <div className="current-morale">
              <div className="morale-value">{data.currentMorale}%</div>
              <div className="morale-bar">
                <div 
                  className="morale-fill" 
                  style={{ 
                    width: `${data.currentMorale}%`,
                    backgroundColor: data.currentMorale >= 70 ? '#28a745' : data.currentMorale >= 50 ? '#ffc107' : '#dc3545'
                  }}
                ></div>
              </div>
            </div>

            <div className="morale-factors">
              <h6>Contributing Factors:</h6>
              {Object.entries(data.factors).map(([factor, value]) => (
                <div key={factor} className="factor-item">
                  <span className="factor-name">{factor.charAt(0).toUpperCase() + factor.slice(1)}:</span>
                  <span className="factor-value">{value}%</span>
                  <div className="factor-bar">
                    <div 
                      className="factor-fill" 
                      style={{ 
                        width: `${value}%`,
                        backgroundColor: value >= 70 ? '#28a745' : value >= 50 ? '#ffc107' : '#dc3545'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="recommendations">
              <h6>Recommendations:</h6>
              <div className="recommendations-list">
                {data.recommendations.map((rec, i) => (
                  <div key={i} className="recommendation-item">
                    💡 {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlliance = () => (
    <div className="alliance-view">
      <div className="alliance-header">
        <h4>🤝 Alliance Warfare</h4>
        <div className="alliance-actions">
          <button className="action-btn">Refresh Alliances</button>
          <button className="action-btn secondary">Form Alliance</button>
        </div>
      </div>

      <div className="alliance-grid">
        {militaryData?.alliances.map((alliance) => (
          <div key={alliance.id} className="alliance-card">
            <div className="alliance-header-card">
              <div className="alliance-name">{alliance.name}</div>
              <div className="alliance-status" style={{ color: getStatusColor(alliance.status) }}>
                {alliance.status.toUpperCase()}
              </div>
            </div>

            <div className="alliance-strength">
              <div className="strength-value">{alliance.strength}%</div>
              <div className="strength-label">Combined Strength</div>
            </div>

            <div className="alliance-metrics">
              <div className="metric-item">
                <span>Shared Resources:</span>
                <span>{alliance.sharedResources}%</span>
              </div>
              <div className="metric-item">
                <span>Coordination:</span>
                <span>{alliance.coordinationLevel}%</span>
              </div>
              <div className="metric-item">
                <span>Trust Level:</span>
                <span>{alliance.trustLevel}%</span>
              </div>
            </div>

            <div className="alliance-members">
              <h6>Members:</h6>
              <div className="members-list">
                {alliance.members.map((member, i) => (
                  <span key={i} className="member-tag">{member}</span>
                ))}
              </div>
            </div>

            <div className="alliance-objectives">
              <h6>Objectives:</h6>
              <div className="objectives-list">
                {alliance.objectives.map((objective, i) => (
                  <div key={i} className="objective-item">
                    🎯 {objective}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSensors = () => (
    <div className="sensors-view">
      <div className="sensors-header">
        <h4>📡 Sensor Networks</h4>
        <div className="sensors-actions">
          <button className="action-btn">Refresh Sensors</button>
          <button className="action-btn secondary">Deploy Sensor</button>
        </div>
      </div>

      <div className="sensors-grid">
        {militaryData?.sensorNetworks.map((sensor) => (
          <div key={sensor.id} className="sensor-card">
            <div className="sensor-header-card">
              <div className="sensor-name">{sensor.name}</div>
              <div className="sensor-status" style={{ color: getStatusColor(sensor.status) }}>
                {sensor.status.toUpperCase()}
              </div>
            </div>

            <div className="sensor-type">{sensor.type.toUpperCase()} Sensor</div>
            <div className="sensor-location">📍 {sensor.location}</div>

            <div className="sensor-metrics">
              <div className="metric-circle">
                <div className="metric-value">{sensor.coverage}%</div>
                <div className="metric-label">Coverage</div>
              </div>
              <div className="metric-circle">
                <div className="metric-value">{sensor.accuracy}%</div>
                <div className="metric-label">Accuracy</div>
              </div>
            </div>

            <div className="sensor-details">
              <div className="detail-item">
                <span>Detection Range:</span>
                <span>{sensor.detectionRange > 0 ? `${sensor.detectionRange.toLocaleString()} km` : 'Global'}</span>
              </div>
              <div className="detail-item">
                <span>Last Update:</span>
                <span>{new Date(sensor.lastUpdate).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntelligence = () => (
    <div className="intelligence-view">
      <div className="intelligence-header">
        <h4>🕵️ Intelligence Operations</h4>
        <div className="intelligence-actions">
          <button className="action-btn">Refresh Operations</button>
          <button className="action-btn secondary">Launch Operation</button>
        </div>
      </div>

      <div className="intelligence-grid">
        {militaryData?.intelligenceOps.map((op) => (
          <div key={op.id} className="intel-card">
            <div className="intel-header-card">
              <div className="intel-codename">{op.codename}</div>
              <div className="intel-priority" style={{ color: getPriorityColor(op.priority) }}>
                {op.priority.toUpperCase()}
              </div>
            </div>

            <div className="intel-type">{op.type.toUpperCase()}</div>
            <div className="intel-status" style={{ color: getStatusColor(op.status) }}>
              Status: {op.status.toUpperCase()}
            </div>

            <div className="intel-progress">
              <div className="progress-header">
                <span>Progress: {op.progress}%</span>
                <span>Risk: {op.risk}%</span>
              </div>
              <div className="progress-bars">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${op.progress}%` }}></div>
                </div>
                <div className="risk-bar">
                  <div className="risk-fill" style={{ width: `${op.risk}%` }}></div>
                </div>
              </div>
            </div>

            <div className="intel-details">
              <div className="detail-row">
                <span>Operatives:</span>
                <span>{op.operatives}</span>
              </div>
              <div className="detail-row">
                <span>Budget:</span>
                <span>{formatCurrency(op.budget)}</span>
              </div>
              <div className="detail-row">
                <span>Completion:</span>
                <span>{new Date(op.expectedCompletion).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="intel-intelligence">
              <h6>Intelligence Gathered:</h6>
              <div className="intelligence-list">
                {op.intelligence.map((intel, i) => (
                  <div key={i} className="intelligence-item">
                    🔍 {intel}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
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
      onRefresh={fetchMilitaryData}
    >
      <div className="military-demo-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'units' ? 'active' : ''}`}
            onClick={() => setActiveTab('units')}
          >
            🪖 Military Units
          </button>
          <button 
            className={`tab ${activeTab === 'battles' ? 'active' : ''}`}
            onClick={() => setActiveTab('battles')}
          >
            ⚔️ Battle Simulation
          </button>
          <button 
            className={`tab ${activeTab === 'morale' ? 'active' : ''}`}
            onClick={() => setActiveTab('morale')}
          >
            🎯 Morale Analysis
          </button>
          <button 
            className={`tab ${activeTab === 'alliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('alliance')}
          >
            🤝 Alliance Warfare
          </button>
          <button 
            className={`tab ${activeTab === 'sensors' ? 'active' : ''}`}
            onClick={() => setActiveTab('sensors')}
          >
            📡 Sensor Networks
          </button>
          <button 
            className={`tab ${activeTab === 'intelligence' ? 'active' : ''}`}
            onClick={() => setActiveTab('intelligence')}
          >
            🕵️ Intelligence Ops
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading military data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && (
            <>
              {activeTab === 'units' && renderUnits()}
              {activeTab === 'battles' && renderBattles()}
              {activeTab === 'morale' && renderMorale()}
              {activeTab === 'alliance' && renderAlliance()}
              {activeTab === 'sensors' && renderSensors()}
              {activeTab === 'intelligence' && renderIntelligence()}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default MilitaryDemoScreen;
