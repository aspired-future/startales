import React from 'react';
import { ScreenProps } from './BaseScreen';

// Government Screens
import CabinetScreen from './government/CabinetScreen';

// Security Screens  
import MilitaryScreen from './security/MilitaryScreen';
import DefenseScreen from './security/DefenseScreen';

// Extracted Demo Screens
import DemographicsScreen from './extracted/DemographicsScreen';
import TradeScreen from './extracted/TradeScreen';
import PolicyScreen from './extracted/PolicyScreen';
import TechnologyScreen from './extracted/TechnologyScreen';

import CommunicationsScreen from './extracted/CommunicationsScreen';
import IntelligenceScreen from './extracted/IntelligenceScreen';
import EducationScreen from './extracted/EducationScreen';
import HealthScreen from './extracted/HealthScreen';
import TreasuryScreen from './extracted/TreasuryScreen';
import VisualSystemsScreen from './extracted/VisualSystemsScreen';
import NewsScreen from './extracted/NewsScreen';
import CitiesScreen from './extracted/CitiesScreen';
import FinancialMarketsScreen from './extracted/FinancialMarketsScreen';
import CentralBankScreen from './extracted/CentralBankScreen';
import BusinessScreen from './extracted/BusinessScreen';
import ProfessionsScreen from './extracted/ProfessionsScreen';
import MigrationScreen from './extracted/MigrationScreen';
import EconomicEcosystemScreen from './extracted/EconomicEcosystemScreen';
import ScienceTechnologyScreen from './extracted/ScienceTechnologyScreen';
import CorporateResearchScreen from './extracted/CorporateResearchScreen';
import ClassifiedResearchScreen from './extracted/ClassifiedResearchScreen';
import UniversityResearchScreen from './extracted/UniversityResearchScreen';
import LegislativeScreen from './extracted/LegislativeScreen';
import SupremeCourtScreen from './extracted/SupremeCourtScreen';
import PoliticalPartiesScreen from './extracted/PoliticalPartiesScreen';
import SecurityOperationsScreen from './extracted/SecurityOperationsScreen';
import PlanetaryConquestScreen from './extracted/PlanetaryConquestScreen';
import JointChiefsScreen from './extracted/JointChiefsScreen';
import WitterScreen from './extracted/WitterScreen';
import WhoseAppScreen from './WhoseAppScreen';
import GalaxyMapScreen from './extracted/GalaxyMapScreen';
import GalaxyDataScreen from './extracted/GalaxyDataScreen';
import Enhanced3DGalaxyMapScreen from './Enhanced3DGalaxyMapScreen';
import EntertainmentTourismScreen from './extracted/EntertainmentTourismScreen';
import GalaxyWondersScreen from './extracted/GalaxyWondersScreen';
import HouseholdEconomicsScreen from './extracted/HouseholdEconomicsScreen';
import BusinessCycleScreen from './BusinessCycleScreen';

import EnhancedKnobsControlCenter from './EnhancedKnobsControlCenter';
import TreasuryEnhancedScreen from './TreasuryEnhancedScreen';
import CharacterAwarenessScreen from './CharacterAwarenessScreen';
import ExplorationScreen from './extracted/ExplorationScreen';
import GovernmentScreen from './extracted/GovernmentScreen';
import ConstitutionScreen from './extracted/ConstitutionScreen';
import SpeechesScreen from './extracted/SpeechesScreen';
import StoryScreen from './extracted/StoryScreen';
import CivilizationOverviewScreen from './extracted/CivilizationOverviewScreen';


// Economy Screens (placeholders for now)
// import TreasuryScreen from './economy/TreasuryScreen';

// Population Screens (placeholders for now)
// import DemographicsScreen from './population/DemographicsScreen';

// Science Screens (placeholders for now)
// import TechnologyScreen from './science/TechnologyScreen';

// Communications Screens (placeholders for now)
// import NewsScreen from './communications/NewsScreen';

// Galaxy Screens (placeholders for now)
// import ConquestScreen from './galaxy/ConquestScreen';

interface ScreenConfig {
  component: React.ComponentType<ScreenProps>;
  title: string;
  icon: string;
  category: string;
}

// Placeholder component for screens not yet implemented
const PlaceholderScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      color: '#4ecdc4',
      background: 'rgba(26, 26, 46, 0.8)',
      borderRadius: '8px',
      border: '1px solid rgba(78, 205, 196, 0.3)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>{icon}</div>
      <h2 style={{ marginBottom: '15px', color: '#4ecdc4' }}>{title}</h2>
      <p style={{ color: '#b8bcc8', marginBottom: '20px' }}>
        This screen is under development and will integrate with the following APIs:
      </p>
      <div style={{ 
        background: 'rgba(15, 15, 35, 0.8)', 
        padding: '20px', 
        borderRadius: '6px',
        textAlign: 'left',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '10px' }}>🔧 Planned API Integration:</h3>
        <ul style={{ color: '#b8bcc8', fontSize: '14px', lineHeight: '1.6' }}>
          <li>GET /api/{screenId}/status</li>
          <li>GET /api/{screenId}/data</li>
          <li>POST /api/{screenId}/action</li>
          <li>WebSocket: /ws/{screenId}</li>
        </ul>
      </div>
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        background: 'rgba(78, 205, 196, 0.1)',
        borderRadius: '6px',
        border: '1px solid rgba(78, 205, 196, 0.3)'
      }}>
        <p style={{ color: '#4ecdc4', fontSize: '14px', margin: 0 }}>
          🚀 <strong>Coming Soon:</strong> Real-time data, interactive controls, and AI-generated visuals
        </p>
      </div>
    </div>
  );
};

const screenRegistry: Record<string, ScreenConfig> = {
  // Government & Leadership
  'cabinet': {
    component: CabinetScreen,
    title: 'Cabinet Management',
    icon: '👥',
    category: 'government'
  },
  'policies': {
    component: PolicyScreen,
    title: 'Policy Management',
    icon: '⚖️',
    category: 'government'
  },
  'legislature': {
    component: LegislativeScreen,
    title: 'Legislative Affairs',
    icon: '🏛️',
    category: 'government'
  },
  'supreme-court': {
    component: SupremeCourtScreen,
    title: 'Supreme Court',
    icon: '⚖️',
    category: 'government'
  },
  'political-parties': {
    component: PoliticalPartiesScreen,
    title: 'Political Parties',
    icon: '🎭',
    category: 'government'
  },

  // Economy & Trade
  'treasury': {
    component: TreasuryScreen,
    title: 'Treasury Management',
    icon: '💰',
    category: 'economy'
  },
  'trade': {
    component: TradeScreen,
    title: 'Trade & Commerce',
    icon: '📈',
    category: 'economy'
  },
  'businesses': {
    component: BusinessScreen,
    title: 'Business Ecosystem',
    icon: '🏢',
    category: 'economy'
  },

  'central-bank': {
    component: CentralBankScreen,
    title: 'Central Banking',
    icon: '🏦',
    category: 'economy'
  },

  'professions': {
    component: ProfessionsScreen,
    title: 'Professions & Careers',
    icon: '💼',
    category: 'population'
  },
  'financial-markets': {
    component: FinancialMarketsScreen,
    title: 'Financial Markets',
    icon: '📊',
    category: 'economy'
  },
  'economic-ecosystem': {
    component: EconomicEcosystemScreen,
    title: 'Economic Systems',
    icon: '🌐',
    category: 'economy'
  },

  // Military & Security
  'military': {
    component: MilitaryScreen,
    title: 'Military Command',
    icon: '🛡️',
    category: 'security'
  },
  'defense': {
    component: DefenseScreen,
    title: 'Defense Policy',
    icon: '🏰',
    category: 'security'
  },
  'security': {
    component: SecurityOperationsScreen,
    title: 'Security Operations',
    icon: '🔒',
    category: 'security'
  },
  'intelligence': {
    component: IntelligenceScreen,
    title: 'Intelligence Services',
    icon: '🕵️',
    category: 'security'
  },

  // Population & Society
  'demographics': {
    component: DemographicsScreen,
    title: 'Demographics Dashboard',
    icon: '📊',
    category: 'population'
  },
  'migration': {
    component: MigrationScreen,
    title: 'Migration Management',
    icon: '🚶',
    category: 'population'
  },
  'cities': {
    component: CitiesScreen,
    title: 'Urban Planning',
    icon: '🏙️',
    category: 'population'
  },
  'health': {
    component: HealthScreen,
    title: 'Health',
    icon: '🏥',
    category: 'population'
  },
  'education': {
    component: EducationScreen,
    title: 'Education',
    icon: '🎓',
    category: 'population'
  },

  // Science & Technology (All Research Consolidated)
  'government-research': {
    component: ScienceTechnologyScreen,
    title: 'Government R&D',
    icon: '🏛️',
    category: 'science'
  },
  'corporate-research': {
    component: CorporateResearchScreen,
    title: 'Corporate R&D',
    icon: '🏢',
    category: 'science'
  },
  'university-research': {
    component: UniversityResearchScreen,
    title: 'University Research',
    icon: '🏫',
    category: 'science'
  },
  'classified-research': {
    component: ClassifiedResearchScreen,
    title: 'Classified Projects',
    icon: '🔒',
    category: 'science'
  },
  'technology': {
    component: TechnologyScreen,
    title: 'Tech Systems',
    icon: '⚙️',
    category: 'science'
  },
  'visual-systems': {
    component: VisualSystemsScreen,
    title: 'Visual Systems',
    icon: '🎨',
    category: 'science'
  },

  // Communications & Media
  'news': {
    component: NewsScreen,
    title: 'News & Media',
    icon: '📰',
    category: 'communications'
  },
  'communications': {
    component: CommunicationsScreen,
    title: 'Communications Hub',
    icon: '📡',
    category: 'communications'
  },


  // Galaxy & Space
  'conquest': {
    component: PlanetaryConquestScreen,
    title: 'Planetary Conquest',
    icon: '🌍',
    category: 'galaxy'
  },
  'characters': {
    component: PlaceholderScreen,
    title: 'Character Systems',
    icon: '👤',
    category: 'galaxy'
  },

  // Missing Screens
  'joint-chiefs': {
    component: JointChiefsScreen,
    title: 'Joint Chiefs',
    icon: '⭐',
    category: 'security'
  },
  'witter': {
    component: WitterScreen,
    title: 'Witter',
    icon: '🐦',
    category: 'communications'
  },
  'whoseapp': {
    component: WhoseAppScreen,
    title: 'WhoseApp',
    icon: '📱',
    category: 'communications'
  },
  'galaxy-map': {
    component: GalaxyMapScreen,
    title: 'Galaxy Map (Legacy)',
    icon: '🗺️',
    category: 'galaxy'
  },
  'enhanced-3d-galaxy-map': {
    component: Enhanced3DGalaxyMapScreen,
    title: 'Enhanced 3D Galaxy Map',
    icon: '🌌',
    category: 'galaxy'
  },
  'galaxy-data': {
    component: GalaxyDataScreen,
    title: 'Galaxy Data',
    icon: '🌌',
    category: 'galaxy'
  },
  'entertainment-tourism': {
    component: EntertainmentTourismScreen,
    title: 'Culture',
    icon: '🎭',
    category: 'society'
  },
  'world-wonders': {
    component: GalaxyWondersScreen,
    title: 'Galaxy Wonders',
    icon: '🏛️',
    category: 'civilization'
  },
  'household-economics': {
    component: HouseholdEconomicsScreen,
    title: 'Household Economics',
    icon: '🏠',
    category: 'population'
  },
  'exploration': {
    component: ExplorationScreen,
    title: 'Exploration',
    icon: '🚀',
    category: 'galaxy'
  },
  'government': {
    component: GovernmentScreen,
    title: 'Government',
    icon: '🏛️',
    category: 'government'
  },
  'constitution': {
    component: ConstitutionScreen,
    title: 'Constitution',
    icon: '📜',
    category: 'government'
  },
  'speeches': {
    component: SpeechesScreen,
    title: 'Speeches',
    icon: '🎤',
    category: 'communications'
  },
  'story': {
    component: StoryScreen,
    title: 'Story',
    icon: '📖',
    category: 'communications'
  },
  'civilization-overview': {
    component: CivilizationOverviewScreen,
    title: 'Civilization Overview',
    icon: '🏛️',
    category: 'government'
  },

  // Enhanced API Knobs Systems
  'business-cycle': {
    component: BusinessCycleScreen,
    title: 'Business Cycle Management',
    icon: '📊',
    category: 'economy'
  },
  'world-wonders-enhanced': {
    component: GalaxyWondersScreen,
    title: 'Galaxy Wonders',
    icon: '🏛️',
    category: 'culture'
  },
  'enhanced-knobs-control': {
    component: EnhancedKnobsControlCenter,
    title: 'Enhanced Knobs Control Center',
    icon: '🎛️',
    category: 'system'
  },
  'treasury-enhanced': {
    component: TreasuryEnhancedScreen,
    title: 'Treasury & Tax Management',
    icon: '💰',
    category: 'economy'
  },
  'character-awareness': {
    component: CharacterAwarenessScreen,
    title: 'Character AI Control (Game Master)',
    icon: '🧠',
    category: 'gamemaster'
  }
};

export const createScreen = (screenId: string, gameContext: any): React.ReactElement | null => {
  console.log(`🏭 ScreenFactory: createScreen called with screenId: ${screenId}`);
  const config = screenRegistry[screenId];
  
  if (!config) {
    console.warn(`❌ Screen not found: ${screenId}`);
    return null;
  }

  console.log(`✅ ScreenFactory: Found config for ${screenId}, creating component`);
  const ScreenComponent = config.component;
  
  return (
    <ScreenComponent
      screenId={screenId}
      title={config.title}
      icon={config.icon}
      gameContext={gameContext}
    />
  );
};

export const getScreenConfig = (screenId: string): ScreenConfig | null => {
  return screenRegistry[screenId] || null;
};

export const getAllScreens = (): Record<string, ScreenConfig> => {
  return screenRegistry;
};

export const getScreensByCategory = (category: string): Record<string, ScreenConfig> => {
  const filtered: Record<string, ScreenConfig> = {};
  Object.entries(screenRegistry).forEach(([id, config]) => {
    if (config.category === category) {
      filtered[id] = config;
    }
  });
  return filtered;
};

export default {
  createScreen,
  getScreenConfig,
  getAllScreens,
  getScreensByCategory
};
