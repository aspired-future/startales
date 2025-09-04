import React, { useState, useEffect } from 'react';
import { QuickActionTabBase, QuickActionProps, TabConfig } from './QuickActionTabBase';
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

interface SystemStatusData {
  systems: SystemComponent[];
  metrics: SystemMetrics;
  performance: PerformanceData;
  alerts: any[];
  logs: any[];
}

// Tab Content Component
interface TabContentProps {
  tabId: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export const SystemStatusScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [systemData, setSystemData] = useState<SystemStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'systems', label: 'Systems', icon: '🖥️' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'alerts', label: 'Alerts', icon: '🚨' },
    { id: 'logs', label: 'Logs', icon: '📋' }
  ];

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

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/system-status');
      if (response.ok) {
        const apiData = await response.json();
        setSystemData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch system status data:', err);
      
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

      const mockAlerts = [
        {
          id: 'alert-001',
          severity: 'warning',
          title: 'High Memory Usage',
          description: 'Legislative System showing elevated memory consumption',
          timestamp: '2387.156.14:20',
          system: 'gov-001'
        },
        {
          id: 'alert-002',
          severity: 'info',
          title: 'Scheduled Maintenance',
          description: 'Population Services undergoing routine maintenance',
          timestamp: '2387.156.14:15',
          system: 'soc-001'
        }
      ];

      const mockLogs = [
        {
          id: 'log-001',
          timestamp: '2387.156.14:23',
          level: 'info',
          system: 'core-001',
          message: 'System health check completed successfully'
        },
        {
          id: 'log-002',
          timestamp: '2387.156.14:22',
          level: 'warning',
          system: 'gov-001',
          message: 'Memory usage threshold exceeded: 85%'
        },
        {
          id: 'log-003',
          timestamp: '2387.156.14:21',
          level: 'info',
          system: 'econ-001',
          message: 'Economic data sync completed'
        }
      ];

      setSystemData({
        systems: mockSystems,
        metrics: mockMetrics,
        performance: mockPerformance,
        alerts: mockAlerts,
        logs: mockLogs
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const filteredSystems = selectedCategory === 'all' 
    ? systemData?.systems || []
    : systemData?.systems.filter(system => system.category === selectedCategory) || [];

  // Chart data
  const systemStatusData = systemData ? [
    { label: 'Online', value: systemData.systems.filter(s => s.status === 'online').length },
    { label: 'Warning', value: systemData.systems.filter(s => s.status === 'warning').length },
    { label: 'Critical', value: systemData.systems.filter(s => s.status === 'critical').length },
    { label: 'Offline', value: systemData.systems.filter(s => s.status === 'offline').length },
    { label: 'Maintenance', value: systemData.systems.filter(s => s.status === 'maintenance').length }
  ] : [];

  const performanceData = systemData?.performance ? [
    { label: 'CPU', value: systemData.performance.cpu },
    { label: 'Memory', value: systemData.performance.memory },
    { label: 'Network', value: systemData.performance.network },
    { label: 'Storage', value: systemData.performance.storage }
  ] : [];

  const uptimeData = systemData ? systemData.systems.map(system => ({
    label: system.name.substring(0, 10) + '...',
    value: system.uptime
  })) : [];

  if (loading) {
    return (
      <QuickActionTabBase
        onClose={onClose}
        isVisible={isVisible}
        title="System Status"
        icon="🖥️"
        theme="technology-theme"
        tabs={tabs}
      >
        <TabContent tabId="overview">
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#a0a9ba',
            fontSize: '1.1rem'
          }}>
            Loading system status data...
          </div>
        </TabContent>
      </QuickActionTabBase>
    );
  }

  return (
    <QuickActionTabBase
      onClose={onClose}
      isVisible={isVisible}
      title="System Status"
      icon="🖥️"
      theme="technology-theme"
      tabs={tabs}
    >
      {/* Overview Tab */}
      <TabContent tabId="overview">
        {/* System Health Overview */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">🏥 System Health Overview</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <span>Overall Health</span>
              <span className="standard-metric-value" style={{ color: getHealthColor(systemData?.metrics.overallHealth || 0) }}>
                {systemData?.metrics.overallHealth || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Systems Online</span>
              <span className="standard-metric-value" style={{ color: '#10b981' }}>
                {systemData?.metrics.onlineSystems || 0}/{systemData?.metrics.totalSystems || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Critical Alerts</span>
              <span className="standard-metric-value" style={{ color: systemData?.metrics.criticalAlerts > 0 ? '#ef4444' : '#10b981' }}>
                {systemData?.metrics.criticalAlerts || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Warning Alerts</span>
              <span className="standard-metric-value" style={{ color: systemData?.metrics.warningAlerts > 0 ? '#f59e0b' : '#10b981' }}>
                {systemData?.metrics.warningAlerts || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Average Uptime</span>
              <span className="standard-metric-value">
                {systemData?.metrics.averageUptime?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Avg Response Time</span>
              <span className="standard-metric-value">
                {systemData?.metrics.averageResponseTime || 0}ms
              </span>
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📊 System Analytics</h3>
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
      </TabContent>

      {/* Systems Tab */}
      <TabContent tabId="systems">
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
      </TabContent>

      {/* Performance Tab */}
      <TabContent tabId="performance">
        {/* Performance Metrics */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">⚡ Performance Metrics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <span>CPU Usage</span>
              <span className="standard-metric-value" style={{ color: systemData?.performance.cpu > 80 ? '#ef4444' : '#10b981' }}>
                {systemData?.performance.cpu || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Memory Usage</span>
              <span className="standard-metric-value" style={{ color: systemData?.performance.memory > 80 ? '#ef4444' : '#10b981' }}>
                {systemData?.performance.memory || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Network Usage</span>
              <span className="standard-metric-value">
                {systemData?.performance.network || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Storage Usage</span>
              <span className="standard-metric-value" style={{ color: systemData?.performance.storage > 85 ? '#ef4444' : '#10b981' }}>
                {systemData?.performance.storage || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Active Connections</span>
              <span className="standard-metric-value">
                {systemData?.performance.activeConnections?.toLocaleString() || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Throughput</span>
              <span className="standard-metric-value">
                {systemData?.performance.throughput || 0} GB/s
              </span>
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📈 Performance Trends</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="chart-container">
              <h4 style={{ color: 'var(--tech-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Resource Utilization
              </h4>
              <BarChart data={performanceData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--tech-accent)', marginBottom: '10px', textAlign: 'center' }}>
                System Uptime Comparison
              </h4>
              <LineChart data={uptimeData} />
            </div>
          </div>
        </div>
      </TabContent>

      {/* Alerts Tab */}
      <TabContent tabId="alerts">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">🚨 System Alerts</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>System</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {systemData?.alerts.map(alert => (
                  <tr key={alert.id}>
                    <td>
                      <span style={{ 
                        color: alert.severity === 'critical' ? '#ef4444' : 
                               alert.severity === 'warning' ? '#f59e0b' : '#10b981',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{alert.title}</td>
                    <td>{alert.description}</td>
                    <td>{alert.system}</td>
                    <td>{alert.timestamp}</td>
                    <td>
                      <button className="standard-btn technology-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                        Acknowledge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>

      {/* Logs Tab */}
      <TabContent tabId="logs">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📋 System Logs</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Level</th>
                  <th>System</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {systemData?.logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.timestamp}</td>
                    <td>
                      <span style={{ 
                        color: log.level === 'error' ? '#ef4444' : 
                               log.level === 'warning' ? '#f59e0b' : '#10b981',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {log.level}
                      </span>
                    </td>
                    <td>{log.system}</td>
                    <td>{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>
    </QuickActionTabBase>
  );
};

export default SystemStatusScreen;
