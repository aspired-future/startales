import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface SystemComponent {
  id: string;
  name: string;
  category: 'core' | 'government' | 'military' | 'economic' | 'social' | 'infrastructure';
  status: 'online' | 'warning' | 'critical' | 'offline' | 'maintenance';
  uptime: number;
  lastCheck: string;
  responseTime: number;
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
  const [loading, setLoading] = useState(true);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'offline': return '#6b7280';
      case 'maintenance': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return '#10b981';
    if (health >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getCriticalLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#fb7185';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadSystemData();
      const interval = setInterval(loadSystemData, 30000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      // Try API first, fallback to mock data
      const response = await fetch('http://localhost:4000/api/system-status');
      if (response.ok) {
        const data = await response.json();
        setSystems(data.systems);
        setMetrics(data.metrics);
        setPerformance(data.performance);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      // Comprehensive mock data
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
          status: 'warning',
          uptime: 98.7,
          lastCheck: '2387.156.14:20',
          responseTime: 200,
          errorCount: 5,
          description: 'Parliamentary and legislative management',
          dependencies: ['core-001'],
          criticalLevel: 'high'
        },
        {
          id: 'mil-001',
          name: 'Defense Network',
          category: 'military',
          status: 'online',
          uptime: 99.9,
          lastCheck: '2387.156.14:23',
          responseTime: 30,
          errorCount: 0,
          description: 'Military command and defense systems',
          dependencies: ['core-001', 'core-002'],
          criticalLevel: 'critical'
        },
        {
          id: 'econ-001',
          name: 'Economic Monitor',
          category: 'economic',
          status: 'online',
          uptime: 97.2,
          lastCheck: '2387.156.14:21',
          responseTime: 180,
          errorCount: 12,
          description: 'Economic data processing and analysis',
          dependencies: ['core-001'],
          criticalLevel: 'medium'
        },
        {
          id: 'soc-001',
          name: 'Population Services',
          category: 'social',
          status: 'maintenance',
          uptime: 95.4,
          lastCheck: '2387.156.14:15',
          responseTime: 350,
          errorCount: 8,
          description: 'Social services and population management',
          dependencies: ['core-001'],
          criticalLevel: 'medium'
        }
      ];

      const mockMetrics: SystemMetrics = {
        overallHealth: 94.2,
        totalSystems: 6,
        onlineSystems: 4,
        criticalAlerts: 0,
        warningAlerts: 1,
        averageUptime: 98.4,
        averageResponseTime: 154,
        lastFullCheck: '2387.156.14:23'
      };

      const mockPerformance: PerformanceData = {
        cpu: 67,
        memory: 78,
        network: 45,
        storage: 82,
        activeConnections: 1247,
        throughput: 2.4
      };

      setSystems(mockSystems);
      setMetrics(mockMetrics);
      setPerformance(mockPerformance);
    } finally {
      setLoading(false);
    }
  };

  const filteredSystems = selectedCategory === 'all' 
    ? systems 
    : systems.filter(system => system.category === selectedCategory);

  // Chart data
  const systemStatusData = [
    { label: 'Online', value: systems.filter(s => s.status === 'online').length },
    { label: 'Warning', value: systems.filter(s => s.status === 'warning').length },
    { label: 'Critical', value: systems.filter(s => s.status === 'critical').length },
    { label: 'Offline', value: systems.filter(s => s.status === 'offline').length },
    { label: 'Maintenance', value: systems.filter(s => s.status === 'maintenance').length }
  ];

  const performanceData = performance ? [
    { label: 'CPU', value: performance.cpu },
    { label: 'Memory', value: performance.memory },
    { label: 'Network', value: performance.network },
    { label: 'Storage', value: performance.storage }
  ] : [];

  const uptimeData = systems.map(system => ({
    label: system.name.substring(0, 10) + '...',
    value: system.uptime
  }));

  if (loading) {
    return (
      <QuickActionBase
        title="System Status Monitor"
        icon="🔄"
        onClose={onClose}
        isVisible={isVisible}
        className="technology-theme"
      >
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'var(--tech-accent)',
            fontSize: '18px'
          }}>
            Loading system status...
          </div>
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
      className="technology-theme"
    >
      {/* Overall System Health */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🏥 Overall System Health</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>System Health</span>
            <span className="standard-metric-value" style={{ color: getHealthColor(metrics?.overallHealth || 0) }}>
              {metrics?.overallHealth || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Systems Online</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {metrics?.onlineSystems || 0}/{metrics?.totalSystems || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Critical Alerts</span>
            <span className="standard-metric-value" style={{ color: metrics?.criticalAlerts > 0 ? '#ef4444' : '#10b981' }}>
              {metrics?.criticalAlerts || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Warnings</span>
            <span className="standard-metric-value" style={{ color: metrics?.warningAlerts > 0 ? '#f59e0b' : '#10b981' }}>
              {metrics?.warningAlerts || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Average Uptime</span>
            <span className="standard-metric-value">
              {metrics?.averageUptime?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Avg Response Time</span>
            <span className="standard-metric-value">
              {metrics?.averageResponseTime || 0}ms
            </span>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Performance Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--tech-accent)', marginBottom: '10px', textAlign: 'center' }}>
              System Status Distribution
            </h4>
            <PieChart data={systemStatusData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--tech-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Resource Usage
            </h4>
            <BarChart data={performanceData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--tech-accent)', marginBottom: '10px', textAlign: 'center' }}>
              System Uptime
            </h4>
            <LineChart data={uptimeData} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🔍 Filter by Category</h3>
        <div className="standard-action-buttons">
          {['all', 'core', 'government', 'military', 'economic', 'social', 'infrastructure'].map(category => (
            <button
              key={category}
              className={`standard-btn technology-theme ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Systems Table */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">🖥️ System Components</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>System Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Uptime</th>
                <th>Response Time</th>
                <th>Errors</th>
                <th>Critical Level</th>
                <th>Last Check</th>
              </tr>
            </thead>
            <tbody>
              {filteredSystems.map(system => (
                <tr key={system.id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{system.name}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                      {system.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      textTransform: 'capitalize',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(147, 51, 234, 0.2)',
                      color: 'var(--tech-accent)'
                    }}>
                      {system.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(system.status),
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {system.status}
                    </span>
                  </td>
                  <td>{system.uptime.toFixed(1)}%</td>
                  <td>{system.responseTime}ms</td>
                  <td style={{ color: system.errorCount > 0 ? '#ef4444' : '#10b981' }}>
                    {system.errorCount}
                  </td>
                  <td>
                    <span style={{ 
                      color: getCriticalLevelColor(system.criticalLevel),
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {system.criticalLevel}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.9em' }}>{system.lastCheck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </QuickActionBase>
  );
};

export default SystemStatusScreen;
