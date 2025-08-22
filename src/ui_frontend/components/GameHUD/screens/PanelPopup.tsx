import React from 'react';
import PopupBase from './PopupBase';
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
import MilitaryDemoScreen from './extracted/MilitaryDemoScreen';
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
import ScienceTechnologyScreen from './extracted/ScienceTechnologyScreen';
import ClassifiedResearchScreen from './extracted/ClassifiedResearchScreen';
import UniversityResearchScreen from './extracted/UniversityResearchScreen';
import VisualSystemsScreen from './extracted/VisualSystemsScreen';
import InstitutionalOverrideScreen from './extracted/InstitutionalOverrideScreen';

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
  const renderPanelContent = () => {
    switch (panel.id) {
      case 'government':
        return <GovernmentPanel playerId={playerId} />;
      case 'cabinet':
        return <CabinetPanel playerId={playerId} />;
      case 'policies':
        return <PoliciesPanel playerId={playerId} />;
      case 'legislature':
        return <LegislaturePanel playerId={playerId} />;
      case 'supreme-court':
        return <SupremeCourtPanel playerId={playerId} />;
      case 'political-parties':
        return <PoliticalPartiesPanel playerId={playerId} />;
      case 'treasury':
        return <TreasuryPanel playerId={playerId} />;
      case 'trade':
        return <TradePanel playerId={playerId} />;
      case 'businesses':
        return <BusinessesPanel playerId={playerId} />;
      case 'central-bank':
        return <CentralBankPanel playerId={playerId} />;
      case 'sovereign-wealth-fund':
        return <SovereignWealthFundPanel playerId={playerId} />;
      case 'government-bonds':
        return <GovernmentBondsPanel playerId={playerId} />;
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
        return <WitterPanel playerId={playerId} />;
      case 'galaxy-map':
        return <GalaxyMapPanel playerId={playerId} />;
      case 'conquest':
        return <ConquestPanel playerId={playerId} />;
      case 'exploration':
        return <ExplorationPanel playerId={playerId} />;
      case 'government-contracts':
        return <GovernmentContractsPanel playerId={playerId} />;
      case 'institutional-override':
        return <InstitutionalOverridePanel playerId={playerId} />;
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

// Government Panel with government types support
const GovernmentPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <GovernmentScreen 
    screenId="government" 
    title="Government Overview" 
    icon="🏛️" 
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

const SupremeCourtPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <SupremeCourtScreen 
    screenId="supreme-court" 
    title="Supreme Court" 
    icon="⚖️" 
    gameContext={{ currentLocation: 'Capital System', playerId }} 
  />
);

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
  <MilitaryDemoScreen 
    screenId="defense" 
    title="Defense Operations" 
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
  <EducationScreen />
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
  <UniversityResearchScreen />
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

const WitterPanel: React.FC<{ playerId: string }> = ({ playerId }) => (
  <WitterScreen 
    screenId="witter" 
    title="Witter" 
    icon="🐦" 
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
  <div className="panel-section">
    <h3>📜 Government Contracts</h3>
    <p>Manage defense, infrastructure, and government contracts for {playerId}.</p>
    <div className="panel-grid">
      <div className="panel-card">
        <h4>📊 Total Contracts</h4>
        <div className="value">24</div>
        <div className="change positive">+3 this month</div>
      </div>
      <div className="panel-card">
        <h4>💰 Total Value</h4>
        <div className="value">2.4B TER</div>
        <div className="change positive">+12% this quarter</div>
      </div>
      <div className="panel-card">
        <h4>🏗️ Active Projects</h4>
        <div className="value">18</div>
        <div className="change neutral">On schedule</div>
      </div>
      <div className="panel-card">
        <h4>⏳ Pending Approval</h4>
        <div className="value">6</div>
        <div className="change neutral">Awaiting review</div>
      </div>
    </div>
    <div className="panel-actions">
      <button className="panel-btn">New Contract</button>
      <button className="panel-btn secondary">Performance Review</button>
      <button className="panel-btn secondary">Budget Analysis</button>
    </div>
  </div>
);