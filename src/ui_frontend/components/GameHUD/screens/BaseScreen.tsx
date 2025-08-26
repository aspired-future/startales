import React, { useState, useEffect } from 'react';
import './BaseScreen.css';

// Screen to government official mapping
const SCREEN_OFFICIALS: Record<string, { name: string; title: string; department: string }> = {
  // Government & Leadership
  'cabinet': { name: 'Prime Minister Elena Vasquez', title: 'Prime Minister', department: 'Executive Office' },
  'policy': { name: 'Chief Policy Advisor Marcus Chen', title: 'Chief Policy Advisor', department: 'Policy Development' },
  
  // Military & Security
  'military': { name: 'General Sarah Kim', title: 'Secretary of Defense', department: 'Defense' },
  'intelligence': { name: 'Director Alex Rodriguez', title: 'Intelligence Director', department: 'Intelligence' },
  
  // Economy & Finance
  'trade': { name: 'Minister Lisa Wong', title: 'Trade Minister', department: 'Trade & Commerce' },
  'treasury': { name: 'Secretary David Park', title: 'Treasury Secretary', department: 'Treasury' },
  'central-bank': { name: 'Governor Maria Santos', title: 'Central Bank Governor', department: 'Central Bank' },
  'financial-markets': { name: 'Commissioner James Liu', title: 'Financial Markets Commissioner', department: 'Financial Regulation' },
  'businesses': { name: 'Secretary Ahmed Hassan', title: 'Commerce Secretary', department: 'Commerce' },
  'economic-ecosystem': { name: 'Director Rachel Green', title: 'Economic Development Director', department: 'Economic Development' },
  
  // Population & Society
  'demographics': { name: 'Director Michael Brown', title: 'Demographics Director', department: 'Population Statistics' },
  'cities': { name: 'Secretary Jennifer Davis', title: 'Urban Development Secretary', department: 'Urban Planning' },
  'migration': { name: 'Commissioner Carlos Martinez', title: 'Immigration Commissioner', department: 'Immigration Services' },
  'professions': { name: 'Secretary Linda Johnson', title: 'Labor Secretary', department: 'Labor & Employment' },
  'education': { name: 'Secretary Dr. Patricia Wilson', title: 'Education Secretary', department: 'Education' },
  'health': { name: 'Secretary Dr. Robert Taylor', title: 'Health Secretary', department: 'Health & Human Services' },
  
  // Science & Technology
  'government-research': { name: 'Director Dr. Emily Zhang', title: 'National Research Director', department: 'National Science Foundation' },
  'corporate-research': { name: 'Commissioner Dr. Kevin Lee', title: 'R&D Commissioner', department: 'Innovation & Technology' },
  'university-research': { name: 'Director Dr. Susan Clark', title: 'Academic Research Director', department: 'Higher Education Research' },
  'classified-research': { name: 'Director [CLASSIFIED]', title: 'Classified Research Director', department: 'National Security Research' },
  'technology': { name: 'Secretary Dr. Thomas Anderson', title: 'Technology Secretary', department: 'Science & Technology' },
  'visual-systems': { name: 'Director Maya Patel', title: 'Digital Systems Director', department: 'Digital Infrastructure' },
  
  // Communications & Media
  'communications': { name: 'Secretary Anna Rodriguez', title: 'Communications Secretary', department: 'Communications' },
  'news': { name: 'Director Mark Thompson', title: 'Media Relations Director', department: 'Public Information' },
  
  // Default fallback
  'default': { name: 'Chief of Staff Victoria Chang', title: 'Chief of Staff', department: 'Executive Office' }
};

// Function to open WhoseApp with the appropriate official for the screen
const openWhoseAppForScreen = (screenId: string) => {
  const official = SCREEN_OFFICIALS[screenId] || SCREEN_OFFICIALS['default'];
  
  // Create a custom event to communicate with the main HUD
  const whoseAppEvent = new CustomEvent('openWhoseApp', {
    detail: {
      targetOfficial: official,
      context: `Direct line from ${screenId} screen`,
      priority: 'normal'
    }
  });
  
  // Dispatch the event
  window.dispatchEvent(whoseAppEvent);
  
  // Also show a notification that the communication is being initiated
  console.log(`📞 Opening WhoseApp to contact ${official.name} (${official.title}) regarding ${screenId} screen`);
  
  // Optional: Show a brief toast notification
  const toast = document.createElement('div');
  toast.className = 'whoseapp-toast';
  toast.innerHTML = `📞 Connecting to ${official.name}...`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(79, 195, 247, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
};

export interface ScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext: any;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
}

export interface ScreenData {
  loading: boolean;
  error: string | null;
  data: any;
  lastUpdated: Date | null;
}

interface BaseScreenProps extends ScreenProps {
  children: React.ReactNode;
  apiEndpoints?: APIEndpoint[];
  refreshInterval?: number;
  onRefresh?: () => Promise<void>;
  customAutoAction?: () => void;
  autoActionLabel?: string;
  autoActionActive?: boolean;
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  screenId,
  title,
  icon,
  children,
  apiEndpoints = [],
  refreshInterval = 30000, // 30 seconds default
  onRefresh,
  gameContext,
  customAutoAction,
  autoActionLabel,
  autoActionActive
}) => {
  const [screenData, setScreenData] = useState<ScreenData>({
    loading: false,
    error: null,
    data: null,
    lastUpdated: null
  });

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh && refreshInterval && onRefresh) {
      const interval = setInterval(async () => {
        try {
          await onRefresh();
          setScreenData(prev => ({ ...prev, lastUpdated: new Date() }));
        } catch (error) {
          console.error(`Auto-refresh failed for ${screenId}:`, error);
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, onRefresh, screenId]);

  const handleManualRefresh = async () => {
    if (onRefresh) {
      setScreenData(prev => ({ ...prev, loading: true, error: null }));
      try {
        await onRefresh();
        setScreenData(prev => ({ 
          ...prev, 
          loading: false, 
          lastUpdated: new Date() 
        }));
      } catch (error) {
        setScreenData(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
      }
    }
  };

  return (
    <div className="base-screen">
      {/* Screen Header */}
      <div className="screen-header">
        <div className="screen-title">
          <span className="screen-icon">{icon}</span>
          <h2>{title}</h2>
        </div>
        
        <div className="screen-controls">
          {screenData.lastUpdated && (
            <span className="last-updated">
              Last updated: {screenData.lastUpdated.toLocaleTimeString()}
            </span>
          )}
          
          <button 
            className="whoseapp-btn"
            onClick={() => openWhoseAppForScreen(screenId)}
            title="Contact responsible government official"
          >
            📞 WhoseApp
          </button>
          
          <button 
            className="refresh-btn"
            onClick={handleManualRefresh}
            disabled={screenData.loading}
          >
            {screenData.loading ? '🔄' : '↻'} Refresh
          </button>
          
          <button 
            className={`auto-refresh-btn ${customAutoAction ? (autoActionActive ? 'active' : '') : (autoRefresh ? 'active' : '')}`}
            onClick={customAutoAction || (() => setAutoRefresh(!autoRefresh))}
          >
            {customAutoAction ? 
              (autoActionLabel || (autoActionActive ? '⏸️ Auto' : '▶️ Auto')) : 
              (autoRefresh ? '⏸️ Auto' : '▶️ Auto')
            }
          </button>
        </div>
      </div>

      {/* Error Display */}
      {screenData.error && (
        <div className="screen-error">
          <span className="error-icon">⚠️</span>
          <span>Error: {screenData.error}</span>
          <button onClick={handleManualRefresh}>Retry</button>
        </div>
      )}

      {/* Loading Overlay */}
      {screenData.loading && (
        <div className="screen-loading">
          <div className="loading-spinner"></div>
          <span>Loading {title}...</span>
        </div>
      )}

      {/* Screen Content */}
      <div className="screen-content">
        {children}
      </div>

      {/* API Endpoints Info (Development) */}
      {apiEndpoints.length > 0 && (
        <div className="api-info">
          <details>
            <summary>🔧 API Endpoints ({apiEndpoints.length})</summary>
            <div className="api-list">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="api-endpoint">
                  <span className={`method method-${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                  <span className="path">{endpoint.path}</span>
                  <span className="description">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default BaseScreen;
