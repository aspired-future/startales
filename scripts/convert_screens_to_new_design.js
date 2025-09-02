#!/usr/bin/env node

/**
 * Screen Conversion Script
 * Converts all screens to the new standardized design system
 */

import fs from 'fs';
import path from 'path';

// Screens that need conversion (organized by priority and theme)
const screensToConvert = [
  // HIGH PRIORITY - Core Government & Economic Screens
  {
    name: 'BusinessScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/BusinessScreen.tsx',
    theme: 'economic',
    category: 'economy',
    priority: 'high'
  },
  {
    name: 'CentralBankScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/CentralBankScreen.tsx',
    theme: 'economic',
    category: 'economy',
    priority: 'high'
  },
  {
    name: 'FinancialMarketsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/FinancialMarketsScreen.tsx',
    theme: 'economic',
    category: 'economy',
    priority: 'high'
  },
  {
    name: 'EconomicEcosystemScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/EconomicEcosystemScreen.tsx',
    theme: 'economic',
    category: 'economy',
    priority: 'high'
  },
  
  // HIGH PRIORITY - Security & Military Screens
  {
    name: 'MilitaryScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/MilitaryScreen.tsx',
    theme: 'security',
    category: 'security',
    priority: 'high'
  },
  {
    name: 'DefenseScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/DefenseScreen.tsx',
    theme: 'security',
    category: 'security',
    priority: 'high'
  },
  {
    name: 'SecurityOperationsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/SecurityOperationsScreen.tsx',
    theme: 'security',
    category: 'security',
    priority: 'high'
  },
  {
    name: 'IntelligenceScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/IntelligenceScreen.tsx',
    theme: 'security',
    category: 'security',
    priority: 'high'
  },
  
  // HIGH PRIORITY - Technology & Science Screens
  {
    name: 'ScienceTechnologyScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/ScienceTechnologyScreen.tsx',
    theme: 'technology',
    category: 'science',
    priority: 'high'
  },
  {
    name: 'CorporateResearchScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/CorporateResearchScreen.tsx',
    theme: 'technology',
    category: 'science',
    priority: 'high'
  },
  {
    name: 'UniversityResearchScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/UniversityResearchScreen.tsx',
    theme: 'technology',
    category: 'science',
    priority: 'high'
  },
  {
    name: 'ClassifiedResearchScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/ClassifiedResearchScreen.tsx',
    theme: 'technology',
    category: 'science',
    priority: 'high'
  },
  {
    name: 'VisualSystemsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/VisualSystemsScreen.tsx',
    theme: 'technology',
    category: 'technology',
    priority: 'high'
  },
  
  // MEDIUM PRIORITY - Population & Social Screens
  {
    name: 'DemographicsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/DemographicsScreen.tsx',
    theme: 'social',
    category: 'population',
    priority: 'medium'
  },
  {
    name: 'CitiesScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/CitiesScreen.tsx',
    theme: 'social',
    category: 'population',
    priority: 'medium'
  },
  
  // MEDIUM PRIORITY - Galaxy & Space Screens
  {
    name: 'ExplorationScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/ExplorationScreen.tsx',
    theme: 'space',
    category: 'galaxy',
    priority: 'medium'
  },
  {
    name: 'GalaxyDataScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/GalaxyDataScreen.tsx',
    theme: 'space',
    category: 'galaxy',
    priority: 'medium'
  },
  {
    name: 'GalaxyWondersScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/GalaxyWondersScreen.tsx',
    theme: 'space',
    category: 'galaxy',
    priority: 'medium'
  },
  {
    name: 'MissionsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/MissionsScreen.tsx',
    theme: 'space',
    category: 'galaxy',
    priority: 'medium'
  },
  
  // MEDIUM PRIORITY - Government & Policy Screens
  {
    name: 'GovernmentScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/GovernmentScreen.tsx',
    theme: 'government',
    category: 'government',
    priority: 'medium'
  },
  {
    name: 'ConstitutionScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/ConstitutionScreen.tsx',
    theme: 'government',
    category: 'government',
    priority: 'medium'
  },
  {
    name: 'GovernmentTypesScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/GovernmentTypesScreen.tsx',
    theme: 'government',
    category: 'government',
    priority: 'medium'
  },
  {
    name: 'GovernmentContractsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/GovernmentContractsScreen.tsx',
    theme: 'government',
    category: 'government',
    priority: 'medium'
  },
  {
    name: 'ExportControlsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/ExportControlsScreen.tsx',
    theme: 'government',
    category: 'government',
    priority: 'medium'
  },
  {
    name: 'InstitutionalOverrideScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/InstitutionalOverrideScreen.tsx',
    theme: 'government',
    category: 'government',
    priority: 'medium'
  },
  
  // MEDIUM PRIORITY - Communications & Media Screens
  {
    name: 'CommunicationsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/CommunicationsScreen.tsx',
    theme: 'technology',
    category: 'communications',
    priority: 'medium'
  },
  {
    name: 'NewsScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/NewsScreen.tsx',
    theme: 'technology',
    category: 'communications',
    priority: 'medium'
  },
  {
    name: 'SpeechesScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/SpeechesScreen.tsx',
    theme: 'government',
    category: 'communications',
    priority: 'medium'
  },
  {
    name: 'WitterScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/WitterScreen.tsx',
    theme: 'technology',
    category: 'communications',
    priority: 'medium'
  },
  
  // LOW PRIORITY - Entertainment & Culture Screens
  {
    name: 'EntertainmentTourismScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/EntertainmentTourismScreen.tsx',
    theme: 'social',
    category: 'society',
    priority: 'low'
  },
  {
    name: 'StoryScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/StoryScreen.tsx',
    theme: 'social',
    category: 'society',
    priority: 'low'
  },
  
  // LOW PRIORITY - Overview & Analysis Screens
  {
    name: 'CivilizationOverviewScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/extracted/CivilizationOverviewScreen.tsx',
    theme: 'government',
    category: 'overview',
    priority: 'low'
  },
  {
    name: 'CharacterAwarenessScreen',
    file: 'src/ui_frontend/components/GameHUD/screens/CharacterAwarenessScreen.tsx',
    theme: 'government',
    category: 'overview',
    priority: 'low'
  }
];

// Screens that are already converted (for reference)
const alreadyConverted = [
  'EducationScreen',
  'HealthScreen',
  'MigrationScreen',
  'ProfessionsScreen',
  'HouseholdEconomicsScreen',
  'LegislativeScreen',
  'SupremeCourtScreen',
  'PoliticalPartiesScreen',
  'CabinetScreen',
  'TradeScreen',
  'TreasuryScreen',
  'TechnologyScreen',
  'JointChiefsScreen'
];

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

// Generate conversion report
function generateConversionReport() {
  console.log('🎯 SCREEN CONVERSION REPORT');
  console.log('==========================\n');
  
  console.log('✅ ALREADY CONVERTED:');
  alreadyConverted.forEach(screen => {
    console.log(`  - ${screen}`);
  });
  
  console.log('\n🔄 NEEDS CONVERSION:');
  const highPriority = screensToConvert.filter(s => s.priority === 'high');
  const mediumPriority = screensToConvert.filter(s => s.priority === 'medium');
  const lowPriority = screensToConvert.filter(s => s.priority === 'low');
  
  console.log('\n🔥 HIGH PRIORITY:');
  highPriority.forEach(screen => {
    console.log(`  - ${screen.name} (${screen.theme} theme)`);
  });
  
  console.log('\n⚡ MEDIUM PRIORITY:');
  mediumPriority.forEach(screen => {
    console.log(`  - ${screen.name} (${screen.theme} theme)`);
  });
  
  console.log('\n📋 LOW PRIORITY:');
  lowPriority.forEach(screen => {
    console.log(`  - ${screen.name} (${screen.theme} theme)`);
  });
  
  console.log('\n📊 SUMMARY:');
  console.log(`  Total screens to convert: ${screensToConvert.length}`);
  console.log(`  High priority: ${highPriority.length}`);
  console.log(`  Medium priority: ${mediumPriority.length}`);
  console.log(`  Low priority: ${lowPriority.length}`);
  console.log(`  Already converted: ${alreadyConverted.length}`);
  
  console.log('\n🎨 THEME BREAKDOWN:');
  const themeCounts = {};
  screensToConvert.forEach(screen => {
    themeCounts[screen.theme] = (themeCounts[screen.theme] || 0) + 1;
  });
  Object.entries(themeCounts).forEach(([theme, count]) => {
    console.log(`  ${theme}: ${count} screens`);
  });
}

// Check if file exists and needs conversion
function needsConversion(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already using new design
  const hasNewDesign = content.includes('standard-panel') && 
                      content.includes('standard-metric-grid') &&
                      content.includes('standard-screen-container');
  
  // Check if using old design
  const hasOldDesign = content.includes('className="') && 
                      (content.includes('-screen"') || content.includes('-screen '));
  
  return hasOldDesign && !hasNewDesign;
}

// Generate conversion template for a screen
function generateConversionTemplate(screen) {
  const themeColor = themeColors[screen.theme];
  const themeClass = themeClasses[screen.theme];
  
  return `import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './${screen.name}.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

// TODO: Define proper interfaces for ${screen.name}
interface ${screen.name}Data {
  // Define your data structure here
}

const ${screen.name}: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [data, setData] = useState<${screen.name}Data | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tab2' | 'tab3' | 'tab4' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tab2', label: 'Tab 2', icon: '🏷️' },
    { id: 'tab3', label: 'Tab 3', icon: '📈' },
    { id: 'tab4', label: 'Tab 4', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/${screen.name.toLowerCase()}', description: 'Get ${screen.name.toLowerCase()} data' }
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/${screen.name.toLowerCase()}');
      if (response.ok) {
        const apiData = await response.json();
        setData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch data:', err);
      // Use comprehensive mock data
      setData({
        // TODO: Add comprehensive mock data
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderOverview = () => (
    <>
      {/* Overview - Full panel width */}
      <div className="standard-panel ${themeClass}">
        <h3 style={{ marginBottom: '1rem', color: '${themeColor}' }}>📊 ${screen.name} Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Metric 1</span>
            <span className="standard-metric-value">Value 1</span>
          </div>
          <div className="standard-metric">
            <span>Metric 2</span>
            <span className="standard-metric-value">Value 2</span>
          </div>
          <div className="standard-metric">
            <span>Metric 3</span>
            <span className="standard-metric-value">Value 3</span>
          </div>
          <div className="standard-metric">
            <span>Metric 4</span>
            <span className="standard-metric-value">Value 4</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn ${themeClass}" onClick={() => console.log('Action 1')}>Action 1</button>
          <button className="standard-btn ${themeClass}" onClick={() => console.log('Action 2')}>Action 2</button>
        </div>
      </div>

      {/* Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel ${themeClass} table-panel">
          <h3 style={{ marginBottom: '1rem', color: '${themeColor}' }}>📊 Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={[]}
                title="Chart 1"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={[]}
                title="Chart 2"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderTab2 = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel ${themeClass} table-panel">
        <h3 style={{ marginBottom: '1rem', color: '${themeColor}' }}>🏷️ Tab 2</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn ${themeClass}" onClick={() => console.log('Action')}>Action</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data 1</td>
                <td>Data 2</td>
                <td>Data 3</td>
                <td>
                  <button className="standard-btn ${themeClass}">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTab3 = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel ${themeClass} table-panel">
        <h3 style={{ marginBottom: '1rem', color: '${themeColor}' }}>📈 Tab 3</h3>
        {/* TODO: Add content */}
      </div>
    </div>
  );

  const renderTab4 = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel ${themeClass} table-panel">
        <h3 style={{ marginBottom: '1rem', color: '${themeColor}' }}>📋 Tab 4</h3>
        {/* TODO: Add content */}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel ${themeClass} table-panel">
        <h3 style={{ marginBottom: '1rem', color: '${themeColor}' }}>📊 Analytics</h3>
        {/* TODO: Add analytics content */}
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
      onRefresh={fetchData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container ${themeClass}">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && data ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'tab2' && renderTab2()}
              {activeTab === 'tab3' && renderTab3()}
              {activeTab === 'tab4' && renderTab4()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading data...' : 'No data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default ${screen.name};`;
}

// Main execution
generateConversionReport();

console.log('\n🚀 CONVERSION TEMPLATES:');
console.log('========================\n');

screensToConvert.slice(0, 3).forEach(screen => {
  console.log(`📝 Template for ${screen.name}:`);
  console.log('```typescript');
  console.log(generateConversionTemplate(screen));
  console.log('```\n');
});

console.log('\n💡 NEXT STEPS:');
console.log('1. Start with HIGH PRIORITY screens');
console.log('2. Use the template above as a base');
console.log('3. Add proper interfaces and mock data');
console.log('4. Test each screen after conversion');
console.log('5. Ensure all charts and tables are included');
console.log('6. Verify theme colors and styling');
