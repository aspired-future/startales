import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';

interface SystemComponent {
  id: string;
  name: string;
  category: 'core' | 'government' | 'military' | 'economic' | 'social' | 'infrastructure';
  status: 'online' | 'warning' | 'critical' | 'offline' | 'maintenance';
  uptime: number; // percentage
  lastCheck: string;
  responseTime: number; // in ms
  errorCount: number;
  description: string;
  dependencies: string[];
  criticalLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemMetrics {
  overallHealth: number;
  totalSystems: number;
  onlineSystems: number;
  criticalAlerts: number;
  warningAlerts: number;
  averageUptime: number;
  averageResponseTime: number;
  lastFullCheck: string;
}

interface PerformanceData {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
  activeConnections: number;
  throughput: number;
}

export const SystemStatusScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [systems, setSystems] = useState<SystemComponent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<SystemComponent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadSystemData();
      // Set up real-time updates
      const interval = setInterval(loadSystemData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSystems: SystemComponent[] = [
        {
          id: 'core-001',
          name: 'Primary Command Center',
          category: 'core',
          status: 'online',
          uptime: 99.8,
          lastCheck: '2387.156.14:23',
          responseTime: 45,
          errorCount: 0,
          description: 'Central command and control system',
          dependencies: [],
          criticalLevel: 'critical'
        },
        {
          id: 'core-002',
          name: 'AI Decision Engine',
          category: 'core',
          status: 'online',
          uptime: 99.5,
          lastCheck: '2387.156.14:22',
          responseTime: 120,
          errorCount: 2,
          description: 'AI-powered decision support system',
          dependencies: ['core-001'],
          criticalLevel: 'critical'
        },
        {
          id: 'gov-001',
          name: 'Legislative System',
          category: 'government',
          status: 'online',
          uptime: 98.7,
          lastCheck: '2387.156.14:20',
          responseTime: 200,
          errorCount: 5,
          description: 'Parliamentary and legislative management',
          dependencies: ['core-001'],
          criticalLevel: 'high'
        },
        {
          id: 'gov-002',
          name: 'Cabinet Workflow',
          category: 'government',
          status: 'warning',
          uptime: 97.2,
          lastCheck: '2387.156.14:18',
          responseTime: 350,
          errorCount: 12,
          description: 'Cabinet meeting and decision workflow',
          dependencies: ['core-001', 'core-002'],
          criticalLevel: 'high'
        },
        {
          id: 'mil-001',
          name: 'Defense Network',
          category: 'military',
          status: 'online',
          uptime: 99.9,
          lastCheck: '2387.156.14:23',
          responseTime: 25,
          errorCount: 0,
          description: 'Military command and defense systems',
          dependencies: ['core-001'],
          criticalLevel: 'critical'
        },
        {
          id: 'mil-002',
          name: 'Intelligence Network',
          category: 'military',
          status: 'online',
          uptime: 99.1,
          lastCheck: '2387.156.14:21',
          responseTime: 80,
          errorCount: 3,
          description: 'Intelligence gathering and analysis',
          dependencies: ['core-001', 'mil-001'],
          criticalLevel: 'critical'
        },
        {
          id: 'econ-001',
          name: 'Financial Markets',
          category: 'economic',
          status: 'online',
          uptime: 99.3,
          lastCheck: '2387.156.14:22',
          responseTime: 150,
          errorCount: 1,
          description: 'Financial market monitoring and trading',
          dependencies: ['core-001'],
          criticalLevel: 'high'
        },
        {
          id: 'econ-002',
          name: 'Trade Management',
          category: 'economic',
          status: 'warning',
          uptime: 96.8,
          lastCheck: '2387.156.14:19',
          responseTime: 400,
          errorCount: 18,
          description: 'Interstellar trade route management',
          dependencies: ['core-001', 'econ-001'],
          criticalLevel: 'medium'
        },
        {
          id: 'soc-001',
          name: 'Population Database',
          category: 'social',
          status: 'online',
          uptime: 98.9,
          lastCheck: '2387.156.14:21',
          responseTime: 180,
          errorCount: 4,
          description: 'Citizen registration and demographics',
          dependencies: ['core-001'],
          criticalLevel: 'high'
        },
        {
          id: 'soc-002',
          name: 'Communication Hub',
          category: 'social',
          status: 'critical',
          uptime: 85.2,
          lastCheck: '2387.156.14:15',
          responseTime: 800,
          errorCount: 45,
          description: 'Public communication and media systems',
          dependencies: ['core-001'],
          criticalLevel: 'medium'
        },
        {
          id: 'infra-001',
          name: 'Power Grid',
          category: 'infrastructure',
          status: 'online',
          uptime: 99.7,
          lastCheck: '2387.156.14:23',
          responseTime: 30,
          errorCount: 1,
          description: 'Galactic power distribution network',
          dependencies: [],
          criticalLevel: 'critical'
        },
        {
          id: 'infra-002',
          name: 'Transportation Network',
          category: 'infrastructure',
          status: 'maintenance',
          uptime: 92.1,
          lastCheck: '2387.156.12:00',
          responseTime: 0,
          errorCount: 0,
          description: 'Interplanetary transport coordination',
          dependencies: ['infra-001'],
          criticalLevel: 'high'
        }
      ];

      const mockMetrics: SystemMetrics = {
        overallHealth: 94,
        totalSystems: mockSystems.length,
        onlineSystems: mockSystems.filter(s => s.status === 'online').length,
        criticalAlerts: mockSystems.filter(s => s.status === 'critical').length,
        warningAlerts: mockSystems.filter(s => s.status === 'warning').length,
        averageUptime: mockSystems.reduce((sum, s) => sum + s.uptime, 0) / mockSystems.length,
        averageResponseTime: mockSystems.filter(s => s.responseTime > 0).reduce((sum, s) => sum + s.responseTime, 0) / mockSystems.filter(s => s.responseTime > 0).length,
        lastFullCheck: '2387.156.14:23'
      };

      const mockPerformance: PerformanceData = {
        cpu: 67,
        memory: 72,
        network: 45,
        storage: 58,
        activeConnections: 2847,
        throughput: 1.2 // GB/s
      };

      setSystems(mockSystems);
      setMetrics(mockMetrics);
      setPerformance(mockPerformance);
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'warning': return '#ffc107';
      case 'critical': return '#dc3545';
      case 'offline': return '#6c757d';
      case 'maintenance': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return '🔧';
      case 'government': return '🏛️';
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'social': return '👥';
      case 'infrastructure': return '🏗️';
      default: return '⚙️';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return '#28a745';
    if (health >= 85) return '#ffc107';
    if (health >= 70) return '#fd7e14';
    return '#dc3545';
  };

  const getPerformanceColor = (value: number) => {
    if (value <= 60) return '#28a745';
    if (value <= 80) return '#ffc107';
    return '#dc3545';
  };

  const filteredSystems = selectedCategory === 'all' 
    ? systems 
    : systems.filter(system => system.category === selectedCategory);

  const handleSystemAction = (systemId: string, action: string) => {
    console.log(`Executing ${action} on system ${systemId}`);
    // Implement system actions (restart, maintenance, etc.)
  };

  if (loading) {
    return (
      <QuickActionBase
        title="System Status Monitor"
        icon="🔄"
        onClose={onClose}
        isVisible={isVisible}
        className="system-status"
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ color: '#4ecdc4', fontSize: '18px' }}>Loading system status...</div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="System Status Monitor"
      icon="🔄"
      onClose={onClose}
      isVisible={isVisible}
      className="system-status"
    >
      {/* Overall System Health */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>🏥 Overall System Health</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value" style={{ color: getHealthColor(metrics?.overallHealth || 0) }}>
              {metrics?.overallHealth || 0}%
            </div>
            <div className="metric-label">System Health</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: '#28a745' }}>
              {metrics?.onlineSystems || 0}/{metrics?.totalSystems || 0}
            </div>
            <div className="metric-label">Systems Online</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: metrics?.criticalAlerts > 0 ? '#dc3545' : '#28a745' }}>
              {metrics?.criticalAlerts || 0}
            </div>
            <div className="metric-label">Critical Alerts</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: metrics?.warningAlerts > 0 ? '#ffc107' : '#28a745' }}>
              {metrics?.warningAlerts || 0}
            </div>
            <div className="metric-label">Warnings</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{metrics?.averageUptime?.toFixed(1) || 0}%</div>
            <div className="metric-label">Average Uptime</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>📊 Performance Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value" style={{ color: getPerformanceColor(performance?.cpu || 0) }}>
              {performance?.cpu || 0}%
            </div>
            <div className="metric-label">CPU Usage</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: getPerformanceColor(performance?.memory || 0) }}>
              {performance?.memory || 0}%
            </div>
            <div className="metric-label">Memory Usage</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: getPerformanceColor(performance?.network || 0) }}>
              {performance?.network || 0}%
            </div>
            <div className="metric-label">Network Load</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: getPerformanceColor(performance?.storage || 0) }}>
              {performance?.storage || 0}%
            </div>
            <div className="metric-label">Storage Usage</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{performance?.activeConnections?.toLocaleString() || 0}</div>
            <div className="metric-label">Active Connections</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>🗂️ Filter by Category</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {['all', 'core', 'government', 'military', 'economic', 'social', 'infrastructure'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`action-btn ${selectedCategory === category ? '' : 'secondary'}`}
              style={{ 
                textTransform: 'capitalize',
                fontSize: '12px',
                padding: '8px 16px'
              }}
            >
              {category === 'all' ? '📋 All' : `${getCategoryIcon(category)} ${category}`}
            </button>
          ))}
        </div>
      </div>

      {/* System Components */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>
          ⚙️ System Components ({filteredSystems.length})
        </h3>
        <div className="action-grid">
          {filteredSystems.map(system => (
            <div key={system.id} className="action-card" style={{
              border: system.status === 'critical' ? '2px solid #dc3545' : 
                     system.status === 'warning' ? '2px solid #ffc107' : 
                     '1px solid rgba(78, 205, 196, 0.3)'
            }}>
              <h3 style={{ color: getStatusColor(system.status) }}>
                {getCategoryIcon(system.category)} {system.name}
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <span className={`status-indicator ${
                  system.status === 'critical' ? 'critical' : 
                  system.status === 'warning' ? 'warning' : 
                  system.status === 'online' ? 'online' : 'offline'
                }`}>
                  {system.status.toUpperCase()}
                </span>
                <span className={`status-indicator ${
                  system.criticalLevel === 'critical' ? 'critical' : 
                  system.criticalLevel === 'high' ? 'warning' : 'online'
                }`} style={{ marginLeft: '10px' }}>
                  {system.criticalLevel.toUpperCase()}
                </span>
              </div>
              <p>{system.description}</p>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
                <div>⏱️ Uptime: {system.uptime}%</div>
                <div>📡 Response: {system.responseTime}ms</div>
                <div>❌ Errors: {system.errorCount}</div>
                <div>🔗 Dependencies: {system.dependencies.length}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className="action-btn"
                  onClick={() => setSelectedSystem(system)}
                >
                  📖 Details
                </button>
                {system.status === 'warning' || system.status === 'critical' ? (
                  <button 
                    className="action-btn urgent"
                    onClick={() => handleSystemAction(system.id, 'restart')}
                  >
                    🔄 Restart
                  </button>
                ) : (
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleSystemAction(system.id, 'maintenance')}
                  >
                    🔧 Maintenance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>⚡ System Actions</h3>
        <div className="action-grid">
          <div className="action-card">
            <h3>🔄 Full System Refresh</h3>
            <p>Refresh all system status and performance data</p>
            <button className="action-btn" onClick={loadSystemData}>
              Refresh Now
            </button>
          </div>
          <div className="action-card">
            <h3>🚨 Emergency Restart</h3>
            <p>Restart all critical systems in emergency sequence</p>
            <button className="action-btn urgent">Emergency Restart</button>
          </div>
          <div className="action-card">
            <h3>📊 Generate Report</h3>
            <p>Create comprehensive system health report</p>
            <button className="action-btn secondary">Generate Report</button>
          </div>
          <div className="action-card">
            <h3>⚙️ System Diagnostics</h3>
            <p>Run full diagnostic scan on all systems</p>
            <button className="action-btn secondary">Run Diagnostics</button>
          </div>
        </div>
      </div>

      {/* System Detail Modal */}
      {selectedSystem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
            border: '2px solid #4ecdc4',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#4ecdc4', margin: 0 }}>
                {getCategoryIcon(selectedSystem.category)} {selectedSystem.name}
              </h2>
              <button 
                onClick={() => setSelectedSystem(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #ff453a',
                  color: '#ff453a',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span className={`status-indicator ${
                  selectedSystem.status === 'critical' ? 'critical' : 
                  selectedSystem.status === 'warning' ? 'warning' : 
                  selectedSystem.status === 'online' ? 'online' : 'offline'
                }`}>
                  {selectedSystem.status.toUpperCase()}
                </span>
                <span className={`status-indicator ${
                  selectedSystem.criticalLevel === 'critical' ? 'critical' : 
                  selectedSystem.criticalLevel === 'high' ? 'warning' : 'online'
                }`}>
                  {selectedSystem.criticalLevel.toUpperCase()} PRIORITY
                </span>
              </div>
              
              <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '20px' }}>
                {selectedSystem.description}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>📊 Performance Metrics:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <div style={{ color: '#888', fontSize: '12px' }}>Uptime</div>
                  <div style={{ color: '#4ecdc4', fontSize: '18px' }}>{selectedSystem.uptime}%</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '12px' }}>Response Time</div>
                  <div style={{ color: '#4ecdc4', fontSize: '18px' }}>{selectedSystem.responseTime}ms</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '12px' }}>Error Count</div>
                  <div style={{ color: selectedSystem.errorCount > 10 ? '#dc3545' : '#4ecdc4', fontSize: '18px' }}>
                    {selectedSystem.errorCount}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '12px' }}>Last Check</div>
                  <div style={{ color: '#4ecdc4', fontSize: '14px' }}>{selectedSystem.lastCheck}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>🔗 Dependencies:</h4>
              {selectedSystem.dependencies.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {selectedSystem.dependencies.map((dep, index) => (
                    <span key={index} className="status-indicator online">{dep}</span>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No dependencies</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {selectedSystem.status === 'warning' || selectedSystem.status === 'critical' ? (
                <button 
                  className="action-btn urgent"
                  onClick={() => {
                    handleSystemAction(selectedSystem.id, 'restart');
                    setSelectedSystem(null);
                  }}
                >
                  🔄 Restart System
                </button>
              ) : (
                <button 
                  className="action-btn"
                  onClick={() => {
                    handleSystemAction(selectedSystem.id, 'maintenance');
                    setSelectedSystem(null);
                  }}
                >
                  🔧 Schedule Maintenance
                </button>
              )}
              <button 
                className="action-btn secondary"
                onClick={() => setSelectedSystem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </QuickActionBase>
  );
};

export default SystemStatusScreen;
