import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

// Template for consistent screen design across all panels
export interface ScreenTemplateProps extends ScreenProps {
  // Theme configuration
  theme: 'government' | 'economic' | 'security' | 'social' | 'technology' | 'space';
  
  // Data interface (to be defined per screen)
  dataInterface: any;
  
  // API endpoints
  apiEndpoints: APIEndpoint[];
  
  // Tab configuration (max 5 tabs)
  tabs: TabConfig[];
  
  // Mock data generator
  generateMockData: () => any;
  
  // Render functions for each tab
  renderFunctions: {
    [key: string]: () => React.ReactNode;
  };
  
  // Utility functions
  utilityFunctions?: {
    formatCurrency?: (value: number) => string;
    formatNumber?: (value: number) => string;
    getStatusColor?: (status: string) => string;
    getRiskColor?: (risk: string) => string;
    getTrendColor?: (trend: string) => string;
  };
}

// Theme color mapping
const themeColors = {
  government: '#4facfe', // Blue
  economic: '#fbbf24',   // Gold/Yellow
  security: '#ef4444',   // Red
  social: '#10b981',     // Green
  technology: '#8b5cf6', // Purple
  space: '#06b6d4'       // Cyan
};

// Theme class mapping
const themeClasses = {
  government: 'government-theme',
  economic: 'economic-theme',
  security: 'security-theme',
  social: 'social-theme',
  technology: 'technology-theme',
  space: 'space-theme'
};

export const ScreenTemplate: React.FC<ScreenTemplateProps> = ({
  screenId,
  title,
  icon,
  gameContext,
  theme,
  dataInterface,
  apiEndpoints,
  tabs,
  generateMockData,
  renderFunctions,
  utilityFunctions = {}
}) => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || 'overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeColor = themeColors[theme];
  const themeClass = themeClasses[theme];

  // Default utility functions
  const defaultFormatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const defaultFormatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const defaultGetStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'restricted': return '#f59e0b';
      case 'closed': return '#ef4444';
      case 'inactive': return '#6b7280';
      case 'dangerous': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const defaultGetRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const defaultGetTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Use provided utility functions or defaults
  const formatCurrency = utilityFunctions.formatCurrency || defaultFormatCurrency;
  const formatNumber = utilityFunctions.formatNumber || defaultFormatNumber;
  const getStatusColor = utilityFunctions.getStatusColor || defaultGetStatusColor;
  const getRiskColor = utilityFunctions.getRiskColor || defaultGetRiskColor;
  const getTrendColor = utilityFunctions.getTrendColor || defaultGetTrendColor;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch(`http://localhost:4000/api/${screenId}`);
      if (response.ok) {
        const apiData = await response.json();
        setData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn(`Failed to fetch ${screenId} data:`, err);
      // Use comprehensive mock data
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  }, [screenId, generateMockData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Standard panel wrapper with theme
  const StandardPanel: React.FC<{
    children: React.ReactNode;
    title?: string;
    fullWidth?: boolean;
    className?: string;
  }> = ({ children, title, fullWidth = false, className = '' }) => (
    <div 
      className={`standard-panel ${themeClass} ${fullWidth ? 'table-panel' : ''} ${className}`}
      style={fullWidth ? { gridColumn: '1 / -1' } : {}}
    >
      {title && (
        <h3 style={{ marginBottom: '1rem', color: themeColor }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );

  // Standard metric grid
  const MetricGrid: React.FC<{
    children: React.ReactNode;
    columns?: number;
  }> = ({ children, columns = 4 }) => (
    <div 
      className="standard-metric-grid"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}
    >
      {children}
    </div>
  );

  // Standard metric item
  const Metric: React.FC<{
    label: string;
    value: string | number;
    color?: string;
  }> = ({ label, value, color }) => (
    <div className="standard-metric">
      <span>{label}</span>
      <span 
        className="standard-metric-value"
        style={color ? { color } : {}}
      >
        {value}
      </span>
    </div>
  );

  // Standard action buttons
  const ActionButtons: React.FC<{
    actions: Array<{
      label: string;
      onClick: () => void;
    }>;
  }> = ({ actions }) => (
    <div className="standard-action-buttons">
      {actions.map((action, index) => (
        <button 
          key={index}
          className={`standard-btn ${themeClass}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );

  // Standard table
  const StandardTable: React.FC<{
    headers: string[];
    children: React.ReactNode;
  }> = ({ headers, children }) => (
    <div className="standard-table-container">
      <table className="standard-data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );

  // Standard chart container
  const ChartContainer: React.FC<{
    children: React.ReactNode;
    title?: string;
  }> = ({ children, title }) => (
    <div className="chart-container">
      {title && <h4 style={{ color: themeColor, marginBottom: '1rem' }}>{title}</h4>}
      {children}
    </div>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId)}
    >
      <div className={`standard-screen-container ${themeClass}`}>
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && data ? (
            <>
              {Object.keys(renderFunctions).map((tabId) => 
                activeTab === tabId && renderFunctions[tabId]()
              )}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? `Loading ${title.toLowerCase()} data...` : 
               error ? `Error: ${error}` : 
               `No ${title.toLowerCase()} data available`}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

// Export utility components for use in individual screens
export {
  StandardPanel,
  MetricGrid,
  Metric,
  ActionButtons,
  StandardTable,
  ChartContainer,
  themeColors,
  themeClasses
};

