import React, { useState } from 'react';
import PopupBase, { TabConfig } from './PopupBase';
import './PanelPopup.css';

// Import all the detailed screen components
import TreasuryScreen from './extracted/TreasuryScreen';
import TradeScreen from './extracted/TradeScreen';
import BusinessScreen from './extracted/BusinessScreen';
import CentralBankScreen from './extracted/CentralBankScreen';
import CentralBankEnhancedScreen from './CentralBankEnhancedScreen';
import SovereignWealthFundScreen from './SovereignWealthFundScreen';
import { GovernmentBondsScreen } from './GovernmentBondsScreen';
import FinancialMarketsScreen from './extracted/FinancialMarketsScreen';
import EconomicEcosystemScreen from './extracted/EconomicEcosystemScreen';

import DefenseScreen from './security/DefenseScreen';
import CitiesScreen from './extracted/CitiesScreen';
import DemographicsScreen from './extracted/DemographicsScreen';
import MigrationScreen from './extracted/MigrationScreen';
import ProfessionsScreen from './extracted/ProfessionsScreen';
import EducationScreen from './extracted/EducationScreen';
import HealthScreen from './extracted/HealthScreen';
import CorporateResearchScreen from './extracted/CorporateResearchScreen';
import IntelligenceScreen from './extracted/IntelligenceScreen';
import CommunicationsScreen from './extracted/CommunicationsScreen';
import NewsScreen from './extracted/NewsScreen';
import SecurityOperationsScreen from './extracted/SecurityOperationsScreen';
import PolicyScreen from './extracted/PolicyScreen';
import LegislativeScreen from './extracted/LegislativeScreen';
import SupremeCourtScreen from './extracted/SupremeCourtScreen';
import PoliticalPartiesScreen from './extracted/PoliticalPartiesScreen';
import PlanetaryConquestScreen from './extracted/PlanetaryConquestScreen';
import CabinetScreen from './government/CabinetScreen';
import MilitaryScreen from './security/MilitaryScreen';
import SpeechesScreen from './extracted/SpeechesScreen';
import WitterScreen from './extracted/WitterScreen';
import GalaxyMapScreen from './extracted/GalaxyMapScreen';
import ExplorationScreen from './extracted/ExplorationScreen';
import JointChiefsScreen from './extracted/JointChiefsScreen';
import TechnologyScreen from './extracted/TechnologyScreen';
import GovernmentScreen from './extracted/GovernmentScreen';
import ConstitutionScreen from './extracted/ConstitutionScreen';
import ExportControlsScreen from './extracted/ExportControlsScreen';
import GovernmentContractsScreen from './extracted/GovernmentContractsScreen';
import MissionsScreen from './extracted/MissionsScreen';
import ScienceTechnologyScreen from './extracted/ScienceTechnologyScreen';
import ClassifiedResearchScreen from './extracted/ClassifiedResearchScreen';
import UniversityResearchScreen from './extracted/UniversityResearchScreen';
import VisualSystemsScreen from './extracted/VisualSystemsScreen';
import InstitutionalOverrideScreen from './extracted/InstitutionalOverrideScreen';
import EntertainmentTourismScreen from './extracted/EntertainmentTourismScreen';
import GalaxyWondersScreen from './extracted/GalaxyWondersScreen';
import HouseholdEconomicsScreen from './extracted/HouseholdEconomicsScreen';
import BusinessCycleScreen from './BusinessCycleScreen';
import WorldWondersEnhancedScreen from './WorldWondersScreen';

import CharacterAwarenessScreen from './CharacterAwarenessScreen';
import EnhancedKnobsControlCenter from './EnhancedKnobsControlCenter';
import WhoseAppMain from '../../WhoseApp/WhoseAppMain';

interface PanelInfo {
  id: string;
  name: string;
  icon: string;
  category: string;
}

interface PanelPopupProps {
  panel: PanelInfo;
  playerId: string;
  isVisible: boolean;
  onClose: () => void;
}

export const PanelPopup: React.FC<PanelPopupProps> = ({
  panel,
  playerId,
  isVisible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Define tabs for Supreme Court (optimized for space)
  const supremeCourtTabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'reviews', label: 'Reviews', icon: '📋' },
    { id: 'justices', label: 'Justices', icon: '👩‍⚖️' },
    { id: 'precedents', label: 'Cases', icon: '📚' },
    { id: 'relations', label: 'Relations', icon: '🤝' }
  ];

  const renderPanelContent = () => {
    switch (panel.id) {
      case 'constitution':
        return <ConstitutionPanel playerId={playerId} />;
      case 'cabinet':
        return <CabinetPanel playerId={playerId} />;
      case 'policies':
        return <PoliciesPanel playerId={playerId} />;
      case 'legislature':
        return <LegislaturePanel playerId={playerId} />;
      case 'supreme-court':
        return (
          <SupremeCourtScreen 
            screenId="supreme-court" 
            title="Supreme Court" 
            icon="⚖️" 
            gameContext={{ currentLocation: 'Capital System', playerId }}
            isPopup={true}
            onClose={onClose}
            tabs={supremeCourtTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        );
      case 'political-parties':
        return <PoliticalPartiesPanel playerId={playerId} />;
      case 'treasury':
        return (
          <TreasuryScreen 
            screenId="treasury" 
            title="Treasury" 
            icon="💰" 
            gameContext={{ currentLocation: 'Capital System', playerId }}
            isPopup={true}
            onClose={onClose}
          />
        );
      case 'trade':
        return <TradePanel playerId={playerId} />;
      case 'businesses':
        return <BusinessesPanel playerId={playerId} />;
      case 'business-cycle':
        return (
          <BusinessCycleScreen
            screenId="business-cycle"
            title="Business Cycle Management"
            icon="📊"
            gameContext={{ currentLocation: 'Capital System', playerId }}
          />
        );
      case 'central-bank':
        return <CentralBankPanel playerId={playerId} />;
      case 'sovereign-wealth-fund':
        return <SovereignWealthFundPanel playerId={playerId} />;
      case 'government-bonds':
        return <GovernmentBondsPanel playerId={playerId} />;
      case 'government':
        return <GovernmentPanel playerId={playerId} />;
      case 'financial-markets':
        return <FinancialMarketsPanel playerId={playerId} />;
      case 'economic-ecosystem':
        return <EconomicEcosystemPanel playerId={playerId} />;
      case 'military':
        return <MilitaryPanel playerId={playerId} />;
      case 'defense':
        return <DefensePanel playerId={playerId} />;
      case 'security':
        return <SecurityPanel playerId={playerId} />;
      case 'joint-chiefs':
        return <JointChiefsPanel playerId={playerId} />;
      case 'intelligence':
        return <IntelligencePanel playerId={playerId} />;
      case 'demographics':
        return <DemographicsPanel playerId={playerId} />;
      case 'cities':
        return <CitiesPanel playerId={playerId} />;
      case 'migration':
        return <MigrationPanel playerId={playerId} />;
      case 'professions':
        return <ProfessionsPanel playerId={playerId} />;
      case 'education':
        return <EducationPanel playerId={playerId} />;
      case 'health':
        return <HealthPanel playerId={playerId} />;
      case 'government-research':
        return <GovernmentResearchPanel playerId={playerId} />;
      case 'corporate-research':
        return <CorporateResearchPanel playerId={playerId} />;
      case 'university-research':
        return <UniversityResearchPanel playerId={playerId} />;
      case 'classified-research':
        return <ClassifiedResearchPanel playerId={playerId} />;
      case 'technology':
        return <TechnologyPanel playerId={playerId} />;
      case 'visual-systems':
        return <VisualSystemsPanel playerId={playerId} />;
      case 'communications':
        return <CommunicationsPanel playerId={playerId} />;
      case 'news':
        return <NewsPanel playerId={playerId} />;
      case 'speeches':
        return <SpeechesPanel playerId={playerId} />;
      case 'witter':
        return <WitterScreen 
          screenId="witter" 
          title="Witter" 
          icon="🐦" 
          gameContext={{ currentLocation: 'Capital System', playerId }} 
        />;
      case 'galaxy-map':
        return <GalaxyMapPanel playerId={playerId} />;
      case 'conquest':
        return <ConquestPanel playerId={playerId} />;
      case 'exploration':
        return <ExplorationPanel playerId={playerId} />;
      case 'missions':
        return <MissionsPanel playerId={playerId} />;
      case 'government-contracts':
        return <GovernmentContractsPanel playerId={playerId} />;
      case 'export-controls':
        return <ExportControlsPanel playerId={playerId} />;
      case 'institutional-override':
        return <InstitutionalOverridePanel playerId={playerId} />;
      case 'entertainment-tourism':
        return <EntertainmentTourismPanel playerId={playerId} />;
      case 'world-wonders':
      case 'world-wonders-enhanced':
        return (
          <GalaxyWondersScreen
            screenId="world-wonders"
            title="Galaxy Wonders"
            icon="🏛️"
            gameContext={{ currentLocation: 'Capital System', playerId }}
          />
        );
      case 'household-economics':
        return (
          <HouseholdEconomicsScreen
            screenId="household-economics"
            title="Household Economics"
            icon="🏠"
            gameContext={{ currentLocation: 'Capital System', playerId }}
          />
        );
      case 'character-awareness':
        return (
          <CharacterAwarenessScreen
            screenId="character-awareness"
            title="Character AI Control (Game Master)"
            icon="🧠"
            gameContext={{ currentLocation: 'Capital System', playerId }}
          />
        );
      case 'enhanced-knobs-control':
        return (
          <EnhancedKnobsControlCenter
            screenId="enhanced-knobs-control"
            title="Enhanced Knobs Control Center"
            icon="🎛️"
            gameContext={{ currentLocation: 'Capital System', playerId }}
          />
        );
      case 'whoseapp':
        return <WhoseAppPanel playerId={playerId} />;
      default:
        return <DefaultPanel panel={panel} playerId={playerId} />;
    }
  };

  return (
    <PopupBase
      title={panel.name}
      icon={panel.icon}
      onClose={onClose}
      isVisible={isVisible}
      size="large"
    >
      {renderPanelContent()}
    </PopupBase>
  );
};

// Default panel component for panels that don't have specific implementations yet
const DefaultPanel: React.FC<{ panel: PanelInfo; playerId: string }> = ({ panel, playerId }) => {
  return (
    <div className="panel-section">
      <h3>{panel.icon} {panel.name}</h3>
      <p>This panel is under development. More functionality coming soon!</p>
      <div className="panel-grid">
        <div className="panel-card">
          <h4>📊 Status</h4>
          <div className="value">Active</div>
          <div className="change neutral">Player: {playerId}</div>
        </div>
      </div>
    </div>
  );
};

// Constitution Panel with political party system configuration
const ConstitutionPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <ConstitutionScreen 
    screenId="constitution" 
    title="Constitution" 
    icon="📜" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const CabinetPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <CabinetScreen 
    screenId="cabinet" 
    title="Cabinet Management" 
    icon="👥" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const PoliciesPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <PolicyScreen 
    screenId="policies" 
    title="Policy Management" 
    icon="⚖️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const LegislaturePanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <LegislativeScreen 
    screenId="legislature" 
    title="Legislative Affairs" 
    icon="🏛️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const SupremeCourtPanel: React.FC<{ playerId: string }> = ({ playerId }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'reviews', label: 'Reviews', icon: '📋' },
    { id: 'justices', label: 'Justices', icon: '👩‍⚖️' },
    { id: 'precedents', label: 'Precedents', icon: '📚' },
    { id: 'relations', label: 'Relations', icon: '🤝' }
  ];

  return (
    <SupremeCourtScreen 
      screenId="supreme-court" 
      title="Supreme Court" 
      icon="⚖️" 
      gameContext={{ currentLocation: 'Capital System', playerId }}
      hideHeader={true}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

const PoliticalPartiesPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <PoliticalPartiesScreen 
    screenId="political-parties" 
    title="Political Parties" 
    icon="🎭" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const TreasuryPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <TreasuryScreen 
    screenId="treasury" 
    title="Treasury Management" 
    icon="💰" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const TradePanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <TradeScreen 
    screenId="trade" 
    title="Trade & Commerce" 
    icon="📈" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const BusinessesPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <BusinessScreen 
    screenId="businesses" 
    title="Business Ecosystem" 
    icon="🏢" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const CentralBankPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <CentralBankEnhancedScreen 
    screenId="central-bank" 
    title="Enhanced Central Bank" 
    icon="🏦" 
    gameContext={{ currentLocation: 'Capital System', playerId }}
  />
);

const SovereignWealthFundPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <SovereignWealthFundScreen 
    screenId="sovereign-wealth-fund" 
    title="Sovereign Wealth Fund" 
    icon="💰" 
    gameContext={{ currentLocation: 'Capital System', playerId }}
  />
);

const GovernmentBondsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <GovernmentBondsScreen civilizationId={playerId} />
);

const GovernmentPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <GovernmentScreen 
    screenId="government" 
    title="Government Performance" 
    icon="📊"
    gameContext={{ currentLocation: 'Capital System', playerId }}
  />
);

const WhoseAppPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <WhoseAppMain 
    playerId={playerId}
    gameContext={{ currentLocation: 'Capital System', playerId }}
  />
);

const FinancialMarketsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <FinancialMarketsScreen 
    screenId="financial-markets" 
    title="Financial Markets" 
    icon="📊" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const EconomicEcosystemPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <EconomicEcosystemScreen 
    screenId="economic-ecosystem" 
    title="Economic Systems" 
    icon="🌐" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const MilitaryPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <MilitaryScreen 
    screenId="military" 
    title="Military Command" 
    icon="🛡️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const DefensePanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <DefenseScreen 
    screenId="defense" 
    title="Defense Policy" 
    icon="🏰" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const SecurityPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <SecurityOperationsScreen 
    screenId="security" 
    title="Security Operations" 
    icon="🔒" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const JointChiefsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <JointChiefsScreen 
    screenId="joint-chiefs" 
    title="Joint Chiefs" 
    icon="⭐" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const IntelligencePanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <IntelligenceScreen 
    screenId="intelligence" 
    title="Intelligence Operations" 
    icon="🕵️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const DemographicsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <DemographicsScreen 
    screenId="demographics" 
    title="Demographics" 
    icon="👥" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const CitiesPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <CitiesScreen 
    screenId="cities" 
    title="City Management" 
    icon="🏙️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const MigrationPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <MigrationScreen 
    screenId="migration" 
    title="Migration" 
    icon="🚶" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const ProfessionsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <ProfessionsScreen 
    screenId="professions" 
    title="Professions & Careers" 
    icon="💼" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const EducationPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <EducationScreen 
    screenId="education" 
    title="Education" 
    icon="🎓" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const HealthPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <HealthScreen 
    screenId="health" 
    title="Health & Welfare" 
    icon="🏥" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const GovernmentResearchPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <ScienceTechnologyScreen />
);

const CorporateResearchPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <CorporateResearchScreen />
);

const UniversityResearchPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <UniversityResearchScreen 
    screenId="university-research" 
    title="University Research" 
    icon="🔬" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const ClassifiedResearchPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <ClassifiedResearchScreen />
);

const TechnologyPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <TechnologyScreen 
    screenId="technology" 
    title="Technology Systems" 
    icon="⚙️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const VisualSystemsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <VisualSystemsScreen 
    screenId="visual-systems" 
    title="Visual Systems" 
    icon="🎨" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const CommunicationsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <CommunicationsScreen 
    screenId="communications" 
    title="Communications Hub" 
    icon="📡" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const NewsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <NewsScreen 
    screenId="news" 
    title="News" 
    icon="📰" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const SpeechesPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <SpeechesScreen 
    screenId="speeches" 
    title="Speeches" 
    icon="🎤" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);



const GalaxyMapPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <GalaxyMapScreen 
    screenId="galaxy-map" 
    title="Galaxy Map" 
    icon="🗺️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const ConquestPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <PlanetaryConquestScreen 
    screenId="conquest" 
    title="Conquest" 
    icon="⚔️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const ExplorationPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <ExplorationScreen 
    screenId="exploration" 
    title="Exploration" 
    icon="🚀" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const InstitutionalOverridePanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <InstitutionalOverrideScreen 
    screenId="institutional-override" 
    title="Institutional Override System" 
    icon="⚖️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

const GovernmentContractsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <GovernmentContractsScreen 
    screenId="government-contracts" 
    title="Government Contracts" 
    icon="📜" 
    gameContext={{ currentLocation: 'Capital System', playerId }}
  />
);

const MissionsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <MissionsScreen 
    screenId="missions" 
    title="Missions" 
    icon="🎯" 
    gameContext={{ currentLocation: 'Capital System', playerId }}
  />
);

const ExportControlsPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <ExportControlsScreen 
    screenId="export-controls" 
    title="Export Controls" 
    icon="🛡️" 
    gameContext={{ currentLocation: 'Capital System', playerId }}
  />
);

const EntertainmentTourismPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <EntertainmentTourismScreen 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);