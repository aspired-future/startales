import React, { useState, useEffect } from 'react';
import './ConstitutionScreen.css';
// Temporarily commented out to debug
// import { FlagCustomizer } from '../../Visual/FlagCustomizer';
// import { CivilizationFlag } from '../../Visual/CivilizationFlag';

interface ConstitutionScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface Constitution {
  id: string;
  name: string;
  countryId: string;
  governmentType: string;
  preamble: string;
  foundingPrinciples: string[];
  politicalPartySystem: {
    type: 'multiparty' | 'two_party' | 'single_party' | 'no_party';
    description: string;
    constraints: any;
    advantages: string[];
    disadvantages: string[];
    stabilityFactors: {
      governmentStability: number;
      democraticLegitimacy: number;
      representationQuality: number;
      decisionMakingEfficiency: number;
    };
  };
  constitutionalPoints: {
    totalPoints: number;
    allocatedPoints: {
      executivePower: number;
      legislativePower: number;
      judicialPower: number;
      citizenRights: number;
      federalismBalance: number;
      emergencyPowers: number;
      amendmentDifficulty: number;
      partySystemFlexibility: number;
    };
  };
  ratificationStatus: string;
  publicSupport: number;
  adoptionDate: string;
  lastAmended?: string;
}

interface PartySystemOption {
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  stabilityFactors: {
    governmentStability: number;
    democraticLegitimacy: number;
    representationQuality: number;
    decisionMakingEfficiency: number;
  };
  recommendedFor: string[];
}

interface AIProvision {
  provisions: string[];
  protections: string[];
  limitations: string[];
  enforcementMechanisms: string[];
}

const ConstitutionScreen: React.FC<ConstitutionScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'national-symbols' | 'government-types' | 'party-system' | 'structure' | 'rights' | 'ai-provisions' | 'amendments' | 'points' | 'government-config'>('structure');
  const [constitution, setConstitution] = useState<Constitution | null>(null);
  const [partySystemOptions, setPartySystemOptions] = useState<Record<string, PartySystemOption>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartySystem, setSelectedPartySystem] = useState<string>('');
  const [showPartySystemModal, setShowPartySystemModal] = useState(false);
  const [aiProvisions, setAiProvisions] = useState<Record<string, AIProvision>>({});
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);
  const [editingPreamble, setEditingPreamble] = useState<string>('');
  const [editingPrinciples, setEditingPrinciples] = useState<string[]>([]);
  const [pendingGovernmentType, setPendingGovernmentType] = useState<string>('');
  const [flagOptions, setFlagOptions] = useState<any>({});
  const [isGeneratingFlag, setIsGeneratingFlag] = useState(false);
  const [currentFlagUrl, setCurrentFlagUrl] = useState<string | null>(null);
  
  // Government Types state
  const [governmentTypes, setGovernmentTypes] = useState<any[]>([]);
  const [currentGovernment, setCurrentGovernment] = useState<any>(null);
  const [selectedGovernmentType, setSelectedGovernmentType] = useState<string>('');

  useEffect(() => {
    fetchConstitutionData();
    fetchPartySystemOptions();
    fetchGovernmentTypes();
  }, []);

  const fetchConstitutionData = async () => {
    try {
      console.log('🏛️ ConstitutionScreen: Starting to fetch constitution data...');
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/constitution/civilization/campaign_1/player_civ');
      
      if (!response.ok) {
        throw new Error('API not available');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        console.log('✅ Constitution data loaded from API:', data.data);
        setConstitution(data.data);
        setSelectedPartySystem(data.data.politicalPartySystem?.type || 'multiparty');
      } else {
        console.log('⚠️ No constitution data from API, using mock');
        const mockConst = createMockConstitution();
        console.log('📝 Mock constitution created:', mockConst);
        setConstitution(mockConst);
      }
    } catch (err) {
      console.warn('❌ Constitution API not available, using mock data', err);
      const mockConst = createMockConstitution();
      console.log('📝 Mock constitution created (fallback):', mockConst);
      setConstitution(mockConst);
    } finally {
      console.log('🏁 ConstitutionScreen: Loading complete, setting loading to false');
      setLoading(false);
    }
  };

  const fetchPartySystemOptions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/constitution/party-systems/options');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPartySystemOptions(data.data);
        }
      }
    } catch (err) {
      console.warn('Party system options API not available, using defaults');
      setPartySystemOptions(getDefaultPartySystemOptions());
    }
  };

  const fetchGovernmentTypes = async () => {
    try {
      // Fetch available government types
      const typesResponse = await fetch('http://localhost:4000/api/government-types/types');
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        if (typesData.success) {
          setGovernmentTypes(typesData.data);
        }
      }

      // Fetch current government
      const currentResponse = await fetch('http://localhost:4000/api/government-types/civilization/campaign_1/player_civ');
      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        if (currentData.success) {
          setCurrentGovernment(currentData.data);
        }
      }
    } catch (err) {
      console.warn('Government Types API not available, using mock data');
      // Use mock data
      setGovernmentTypes(createMockGovernmentTypes());
      setCurrentGovernment(createMockCurrentGovernment());
    }
  };

  const createMockConstitution = (): Constitution => ({
    id: 'mock_constitution_1',
    name: 'Constitution of the Galactic Federation',
    countryId: 'player_civ',
    governmentType: 'parliamentary',
    preamble: 'We, the people of the Galactic Federation, in order to form a more perfect union among the stars, establish justice across worlds, ensure interplanetary tranquility, provide for the common defense against cosmic threats, promote the general welfare of all sentient beings, and secure the blessings of liberty to ourselves and our posterity throughout the galaxy, do ordain and establish this Constitution.',
    foundingPrinciples: [
      'Democratic governance across star systems',
      'Universal rights for all sentient beings',
      'Peaceful coexistence among species',
      'Sustainable development of galactic resources',
      'Scientific advancement for the common good',
      'Cultural diversity and preservation'
    ],
    politicalPartySystem: {
      type: 'multiparty',
      description: 'A competitive multi-party system allowing unlimited political parties to form and compete in elections across the galaxy.',
      constraints: {
        maxParties: null,
        minParties: 2,
        partyFormationRequirements: {
          minimumMembers: 10000,
          registrationProcess: 'Submit petition with member signatures from at least 3 star systems',
          fundingRequirements: 500000,
          ideologicalRestrictions: ['No parties advocating species supremacy', 'No parties promoting galactic warfare']
        }
      },
      advantages: [
        'Diverse representation across species and systems',
        'Competitive elections promote accountability',
        'Coalition governments encourage interspecies cooperation',
        'Protection of minority species voices',
        'Innovation in galactic policy through competition'
      ],
      disadvantages: [
        'Potential for political fragmentation across systems',
        'Coalition instability during crises',
        'High campaign costs across multiple worlds',
        'Voter confusion with many galactic choices',
        'Risk of extremist movements gaining traction'
      ],
      stabilityFactors: {
        governmentStability: 78,
        democraticLegitimacy: 92,
        representationQuality: 92,
        decisionMakingEfficiency: 72
      }
    },
    constitutionalPoints: {
      totalPoints: 1000,
      allocatedPoints: {
        executivePower: 150,
        legislativePower: 200,
        judicialPower: 150,
        citizenRights: 200,
        federalismBalance: 120,
        emergencyPowers: 50,
        amendmentDifficulty: 80,
        partySystemFlexibility: 50
      }
    },
    ratificationStatus: 'ratified',
    publicSupport: 84.7,
    adoptionDate: '2387-03-15T10:30:00Z',
    lastAmended: '2389-11-22T14:15:00Z'
  });

  const getDefaultPartySystemOptions = (): Record<string, PartySystemOption> => ({
    multiparty: {
      name: 'Multi-Party System',
      description: 'Competitive system allowing unlimited political parties',
      advantages: [
        'Diverse representation of political viewpoints',
        'Competitive elections promote accountability',
        'Coalition governments encourage compromise',
        'Protection of minority political voices'
      ],
      disadvantages: [
        'Potential for political fragmentation',
        'Coalition instability',
        'Increased campaign costs',
        'Voter confusion with many choices'
      ],
      stabilityFactors: {
        governmentStability: 75,
        democraticLegitimacy: 90,
        representationQuality: 85,
        decisionMakingEfficiency: 70
      },
      recommendedFor: ['Large diverse populations', 'Established democracies', 'Pluralistic societies']
    },
    two_party: {
      name: 'Two-Party System',
      description: 'Structured system with exactly two major political parties',
      advantages: [
        'Political stability and predictability',
        'Clear governing majorities',
        'Simplified voter choices',
        'Moderate, centrist policies'
      ],
      disadvantages: [
        'Limited political diversity',
        'Potential for polarization',
        'Barriers to new political movements',
        'Reduced representation of minority views'
      ],
      stabilityFactors: {
        governmentStability: 85,
        democraticLegitimacy: 75,
        representationQuality: 65,
        decisionMakingEfficiency: 90
      },
      recommendedFor: ['Stable democracies', 'Clear ideological divisions', 'Need for decisive governance']
    },
    single_party: {
      name: 'Single-Party System',
      description: 'One constitutional governing party with internal democracy',
      advantages: [
        'Unity and stability in governance',
        'Rapid implementation of policies',
        'Long-term strategic planning',
        'Ideological consistency'
      ],
      disadvantages: [
        'Limited political pluralism',
        'Potential for authoritarianism',
        'Reduced individual political expression',
        'Risk of policy stagnation'
      ],
      stabilityFactors: {
        governmentStability: 95,
        democraticLegitimacy: 60,
        representationQuality: 70,
        decisionMakingEfficiency: 95
      },
      recommendedFor: ['Revolutionary periods', 'Nation-building phases', 'Crisis situations']
    },
    no_party: {
      name: 'Non-Partisan System',
      description: 'System where political parties are prohibited',
      advantages: [
        'No partisan politics',
        'Individual merit focus',
        'Reduced political polarization',
        'Issue-based governance'
      ],
      disadvantages: [
        'Lack of organized opposition',
        'Difficulty organizing policy alternatives',
        'Potential for elite capture',
        'Reduced democratic competition'
      ],
      stabilityFactors: {
        governmentStability: 80,
        democraticLegitimacy: 50,
        representationQuality: 60,
        decisionMakingEfficiency: 85
      },
      recommendedFor: ['Small communities', 'Traditional societies', 'Post-conflict reconciliation']
    }
  });

  const createMockGovernmentTypes = () => [
    {
      id: 'democracy',
      name: 'Parliamentary Democracy',
      description: 'A representative democracy with elected officials and constitutional protections.',
      ideology: 'Liberal Democracy',
      powerStructure: 'distributed',
      legitimacySource: 'popular_mandate',
      successionMethod: 'election',
      decisionSpeed: 6,
      economicControl: 40,
      civilLiberties: 85,
      stabilityFactors: {
        succession: 90,
        legitimacy: 85,
        institutionalStrength: 80,
        popularSupport: 75
      },
      advantages: ['High civil liberties', 'Peaceful transitions', 'Innovation-friendly'],
      disadvantages: ['Slower decision making', 'Political gridlock possible', 'Populist risks']
    },
    {
      id: 'monarchy',
      name: 'Constitutional Monarchy',
      description: 'A traditional monarchy with constitutional limits and ceremonial roles.',
      ideology: 'Constitutional Traditionalism',
      powerStructure: 'mixed',
      legitimacySource: 'tradition',
      successionMethod: 'hereditary',
      decisionSpeed: 7,
      economicControl: 30,
      civilLiberties: 70,
      stabilityFactors: {
        succession: 95,
        legitimacy: 70,
        institutionalStrength: 85,
        popularSupport: 65
      },
      advantages: ['Stable succession', 'Cultural continuity', 'Ceremonial unity'],
      disadvantages: ['Limited democratic input', 'Hereditary risks', 'Modernization challenges']
    },
    {
      id: 'technocracy',
      name: 'Scientific Technocracy',
      description: 'Rule by technical experts and scientists based on evidence and expertise.',
      ideology: 'Scientific Rationalism',
      powerStructure: 'centralized',
      legitimacySource: 'party_ideology',
      successionMethod: 'meritocracy',
      decisionSpeed: 9,
      economicControl: 60,
      civilLiberties: 60,
      stabilityFactors: {
        succession: 75,
        legitimacy: 80,
        institutionalStrength: 90,
        popularSupport: 70
      },
      advantages: ['Evidence-based policy', 'Rapid innovation', 'Efficient decisions'],
      disadvantages: ['Limited popular input', 'Technocratic elitism', 'Social disconnect']
    }
  ];

  const createMockCurrentGovernment = () => ({
    id: 'current_gov_1',
    governmentTypeId: 'democracy',
    governmentTypeName: 'Parliamentary Democracy',
    effectiveness: 78,
    stability: 82,
    popularSupport: 75,
    transitionInProgress: false
  });

  const handleGovernmentTransition = async (targetTypeId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/government-types/civilization/campaign_1/player_civ/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetGovernmentType: targetTypeId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Government transition initiated successfully!');
          fetchGovernmentTypes(); // Refresh data
        }
      }
    } catch (error) {
      console.error('Transition failed:', error);
      alert('Government transition failed. This is a demo - transitions will be available in the full system.');
    }
  };

  const handlePartySystemChange = async () => {
    if (!constitution || selectedPartySystem === constitution.politicalPartySystem.type) {
      setShowPartySystemModal(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/constitution/${constitution.id}/party-system`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPartySystemType: selectedPartySystem,
          reason: `Constitutional reform to transition to ${partySystemOptions[selectedPartySystem]?.name || selectedPartySystem} system`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConstitution(data.data);
          setShowPartySystemModal(false);
          alert('Party system successfully updated!');
        }
      } else {
        throw new Error('Failed to update party system');
      }
    } catch (error) {
      console.error('Error updating party system:', error);
      alert('Failed to update party system. This is a demo - changes are simulated.');
      // Simulate the change for demo purposes
      if (constitution) {
        const newOption = partySystemOptions[selectedPartySystem];
        setConstitution({
          ...constitution,
          politicalPartySystem: {
            ...constitution.politicalPartySystem,
            type: selectedPartySystem as any,
            description: newOption.description,
            advantages: newOption.advantages,
            disadvantages: newOption.disadvantages,
            stabilityFactors: newOption.stabilityFactors
          }
        });
      }
      setShowPartySystemModal(false);
    }
  };

  const generateAIProvisions = async (category: string) => {
    if (!constitution) return;

    setGeneratingAI(category);
    try {
      const response = await fetch(`http://localhost:4000/api/constitution/${constitution.id}/ai-provisions/${category}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: `Generate ${category} provisions for a ${constitution.governmentType} government with ${constitution.politicalPartySystem.type} party system`,
          requirements: constitution.foundingPrinciples
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAiProvisions(prev => ({
            ...prev,
            [category]: data.data
          }));
        }
      } else {
        throw new Error('Failed to generate AI provisions');
      }
    } catch (error) {
      console.error('Error generating AI provisions:', error);
      // Generate mock provisions for demo
      const mockProvisions = generateMockAIProvisions(category);
      setAiProvisions(prev => ({
        ...prev,
        [category]: mockProvisions
      }));
    } finally {
      setGeneratingAI(null);
    }
  };

  const generateMockAIProvisions = (category: string): AIProvision => {
    const provisions = {
      economicRights: {
        provisions: [
          'Every citizen has the right to economic opportunity and fair compensation',
          'The state shall ensure equal access to economic resources across all star systems',
          'Private property rights are protected, subject to galactic environmental standards'
        ],
        protections: [
          'Anti-discrimination in employment across species',
          'Protection against economic exploitation',
          'Right to form interplanetary trade unions'
        ],
        limitations: [
          'Economic rights may be limited during galactic emergencies',
          'Property rights subject to environmental protection laws',
          'Economic activities must comply with interspecies safety standards'
        ],
        enforcementMechanisms: [
          'Galactic Economic Rights Commission',
          'Interplanetary labor courts',
          'Economic ombudsman for each star system'
        ]
      },
      socialRights: {
        provisions: [
          'Universal access to education for all sentient beings',
          'Right to healthcare regardless of species or system of origin',
          'Protection of family structures across different species'
        ],
        protections: [
          'Anti-discrimination based on species, origin, or belief system',
          'Protection of cultural and religious practices',
          'Right to social security and welfare support'
        ],
        limitations: [
          'Social rights subject to available galactic resources',
          'Cultural practices must not harm other sentient beings',
          'Healthcare rationing during resource scarcity'
        ],
        enforcementMechanisms: [
          'Galactic Social Rights Tribunal',
          'Species equality commissions',
          'Interplanetary social welfare administration'
        ]
      }
    };

    return provisions[category] || provisions.economicRights;
  };

  // Government configuration handlers
  const handleGovernmentTypeChange = (newType: string) => {
    setPendingGovernmentType(newType);
  };

  const applyGovernmentChanges = async () => {
    if (!constitution || !pendingGovernmentType) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/constitution/${constitution.id}/government-type`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ governmentType: pendingGovernmentType })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConstitution(data.data);
          alert('Government type updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error updating government type:', error);
      // Simulate the change for demo
      if (constitution) {
        setConstitution({
          ...constitution,
          governmentType: pendingGovernmentType as any
        });
        alert('Government type updated (demo mode)!');
      }
    }
  };

  const handlePreambleChange = (newPreamble: string) => {
    setEditingPreamble(newPreamble);
  };

  const savePreambleChanges = async () => {
    if (!constitution) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/constitution/${constitution.id}/preamble`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preamble: editingPreamble })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConstitution(data.data);
          alert('Preamble updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error updating preamble:', error);
      // Simulate the change for demo
      setConstitution({
        ...constitution,
        preamble: editingPreamble
      });
      alert('Preamble updated (demo mode)!');
    }
  };

  const handlePrincipleChange = (index: number, newValue: string) => {
    const newPrinciples = [...editingPrinciples];
    newPrinciples[index] = newValue;
    setEditingPrinciples(newPrinciples);
  };

  const removePrinciple = (index: number) => {
    const newPrinciples = editingPrinciples.filter((_, i) => i !== index);
    setEditingPrinciples(newPrinciples);
  };

  const addNewPrinciple = () => {
    setEditingPrinciples([...editingPrinciples, 'New founding principle']);
  };

  const savePrinciplesChanges = async () => {
    if (!constitution) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/constitution/${constitution.id}/principles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foundingPrinciples: editingPrinciples })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConstitution(data.data);
          alert('Founding principles updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error updating principles:', error);
      // Simulate the change for demo
      setConstitution({
        ...constitution,
        foundingPrinciples: editingPrinciples
      });
      alert('Founding principles updated (demo mode)!');
    }
  };

  const generateConstitutionalChanges = async () => {
    alert('AI Constitutional Assistant is coming soon! This will generate comprehensive constitutional changes based on your requirements.');
  };

  const handleFlagOptionsChange = (options: any) => {
    setFlagOptions(options);
  };

  const handleFlagGenerate = async (options: any) => {
    if (!constitution) return;
    
    setIsGeneratingFlag(true);
    try {
      // In a real implementation, this would call the flag generation API
      console.log('Generating flag with options:', options);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated flag URL
      setCurrentFlagUrl('/api/visual/images/civilization/' + constitution.id + '/flag');
      
      alert('Flag generated successfully! (Demo mode)');
    } catch (error) {
      console.error('Failed to generate flag:', error);
      alert('Failed to generate flag. Please try again.');
    } finally {
      setIsGeneratingFlag(false);
    }
  };

  // Initialize editing states when constitution loads
  useEffect(() => {
    if (constitution) {
      setEditingPreamble(constitution.preamble);
      setEditingPrinciples([...constitution.foundingPrinciples]);
      setPendingGovernmentType(constitution.governmentType);
      

    }
  }, [constitution]);

  console.log('🎯 ConstitutionScreen render - loading:', loading, 'error:', error, 'constitution:', !!constitution, 'activeTab:', activeTab);

  if (loading) {
    console.log('🔄 ConstitutionScreen: Showing loading state');
    return (
      <div className="constitution-screen loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading constitutional framework...</p>
        </div>
      </div>
    );
  }

  if (error || !constitution) {
    console.log('❌ ConstitutionScreen: Showing error state - error:', error, 'constitution:', !!constitution);
    return (
      <div className="constitution-screen error">
        <div className="error-message">
          <h3>⚠️ Constitutional System Unavailable</h3>
          <p>Unable to load constitutional data. Please try again later.</p>
          <p>Debug: loading={String(loading)}, error={String(error)}, constitution={String(!!constitution)}</p>
        </div>
      </div>
    );
  }

  console.log('✅ ConstitutionScreen: Rendering main content with activeTab:', activeTab);

  return (
    <div className="constitution-screen">
      <div className="screen-header">
        <div className="header-left">
          <span className="screen-icon">{icon}</span>
          <div className="header-text">
            <h2>{title}</h2>
            <p>Constitutional Framework & Governance Structure</p>
          </div>
        </div>
        <div className="header-right">
          <div className="constitution-status">
            <span className={`status-badge ${constitution.ratificationStatus}`}>
              {constitution.ratificationStatus.toUpperCase()}
            </span>
            <div className="public-support">
              <span>Public Support: {constitution.publicSupport.toFixed(1)}%</span>
              <div className="support-bar">
                <div 
                  className="support-fill" 
                  style={{ width: `${constitution.publicSupport}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'national-symbols', label: 'National Symbols', icon: '🏴' },
          { id: 'government-types', label: 'Government Types', icon: '🏛️' },
          { id: 'party-system', label: 'Party System', icon: '🎭' },
          { id: 'structure', label: 'Government Structure', icon: '🏛️' },
          { id: 'rights', label: 'Rights & Freedoms', icon: '⚖️' },
          { id: 'ai-provisions', label: 'AI Provisions', icon: '🤖' },
          { id: 'amendments', label: 'Amendments', icon: '📝' },
          { id: 'points', label: 'Points System', icon: '🎯' },
          { id: 'government-config', label: 'Government Config', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="constitution-overview">
              <div className="constitution-header">
                <h3>{constitution.name}</h3>
                <div className="constitution-meta">
                  <span>Government Type: <strong>{constitution.governmentType}</strong></span>
                  <span>Adopted: <strong>{new Date(constitution.adoptionDate).toLocaleDateString()}</strong></span>
                  {constitution.lastAmended && (
                    <span>Last Amended: <strong>{new Date(constitution.lastAmended).toLocaleDateString()}</strong></span>
                  )}
                </div>
              </div>

              <div className="preamble-section">
                <h4>📜 Preamble</h4>
                <p className="preamble-text">{constitution.preamble}</p>
              </div>

              <div className="principles-section">
                <h4>⭐ Founding Principles</h4>
                <div className="principles-grid">
                  {constitution.foundingPrinciples.map((principle, index) => (
                    <div key={index} className="principle-card">
                      <span className="principle-number">{index + 1}</span>
                      <span className="principle-text">{principle}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-stats">
                <div className="stat-card">
                  <div className="stat-icon">🏛️</div>
                  <div className="stat-content">
                    <span className="stat-label">Government Stability</span>
                    <span className="stat-value">{constitution.politicalPartySystem.stabilityFactors.governmentStability}%</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🗳️</div>
                  <div className="stat-content">
                    <span className="stat-label">Democratic Legitimacy</span>
                    <span className="stat-value">{constitution.politicalPartySystem.stabilityFactors.democraticLegitimacy}%</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <span className="stat-label">Representation Quality</span>
                    <span className="stat-value">{constitution.politicalPartySystem.stabilityFactors.representationQuality}%</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <span className="stat-label">Decision Efficiency</span>
                    <span className="stat-value">{constitution.politicalPartySystem.stabilityFactors.decisionMakingEfficiency}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'national-symbols' && (
          <div className="national-symbols-tab">
            <div className="symbols-header">
              <h3>🏴 National Flag & Symbols</h3>
              <p>Design and customize your civilization's flag and national symbols</p>
            </div>

            <div className="symbols-content">
              <div className="current-flag-section">
                <h4>Current National Flag</h4>
                <div className="current-flag-display">
                  {currentFlagUrl ? (
                    <div className="flag-placeholder">
                      <p>Flag component temporarily disabled for debugging</p>
                    </div>
                  ) : (
                    <div className="no-flag-placeholder">
                      <div className="placeholder-icon">🏴</div>
                      <div className="placeholder-text">
                        <h5>No Flag Designed</h5>
                        <p>Use the customizer below to design your civilization's flag</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flag-customizer-section">
                <div className="flag-customizer-placeholder">
                  <h4>Flag Customizer</h4>
                  <p>Flag customizer component temporarily disabled for debugging</p>
                  <p>Civilization: {constitution.name}</p>
                  <button onClick={() => alert('Flag customizer will be restored once debugging is complete')}>
                    🎨 Generate Flag (Debug)
                  </button>
                </div>
              </div>

              <div className="other-symbols-section">
                <h4>National Symbols & Identity</h4>
                <div className="symbols-grid">
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🏛️</div>
                    <div className="symbol-info">
                      <h5>National Emblem</h5>
                      <p>Official government seal and coat of arms</p>
                      <button className="customize-btn">🎨 Design</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🦅</div>
                    <div className="symbol-info">
                      <h5>National Animal</h5>
                      <p>Sacred creature representing your civilization</p>
                      <button className="customize-btn">🔍 Choose</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🌸</div>
                    <div className="symbol-info">
                      <h5>National Flower</h5>
                      <p>Botanical symbol of natural beauty</p>
                      <button className="customize-btn">🌺 Select</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🎵</div>
                    <div className="symbol-info">
                      <h5>National Anthem</h5>
                      <p>Musical expression of national pride</p>
                      <button className="customize-btn">🎼 Compose</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">💎</div>
                    <div className="symbol-info">
                      <h5>National Gemstone</h5>
                      <p>Precious mineral of cultural significance</p>
                      <button className="customize-btn">💍 Pick</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🌳</div>
                    <div className="symbol-info">
                      <h5>National Tree</h5>
                      <p>Ancient guardian of the homeland</p>
                      <button className="customize-btn">🌲 Choose</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🏔️</div>
                    <div className="symbol-info">
                      <h5>Sacred Mountain</h5>
                      <p>Spiritual peak of your civilization</p>
                      <button className="customize-btn">⛰️ Designate</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🌊</div>
                    <div className="symbol-info">
                      <h5>National Waters</h5>
                      <p>Life-giving rivers, lakes, or seas</p>
                      <button className="customize-btn">🏞️ Name</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🎭</div>
                    <div className="symbol-info">
                      <h5>Cultural Festival</h5>
                      <p>Annual celebration of national heritage</p>
                      <button className="customize-btn">🎉 Create</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🍽️</div>
                    <div className="symbol-info">
                      <h5>National Dish</h5>
                      <p>Traditional cuisine representing your people</p>
                      <button className="customize-btn">👨‍🍳 Define</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">🏺</div>
                    <div className="symbol-info">
                      <h5>Historical Artifact</h5>
                      <p>Ancient relic of foundational importance</p>
                      <button className="customize-btn">🔍 Discover</button>
                    </div>
                  </div>
                  
                  <div className="symbol-card interactive">
                    <div className="symbol-icon">⭐</div>
                    <div className="symbol-info">
                      <h5>Guiding Star</h5>
                      <p>Celestial body of navigation and hope</p>
                      <button className="customize-btn">🔭 Identify</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="national-values-section">
                <h4>Core National Values</h4>
                <div className="values-grid">
                  <div className="value-card">
                    <div className="value-icon">⚖️</div>
                    <div className="value-content">
                      <h5>Justice</h5>
                      <p>Fair treatment and equality for all citizens</p>
                      <div className="value-strength">
                        <span>Strength: </span>
                        <div className="strength-bar">
                          <div className="strength-fill" style={{width: '85%'}}></div>
                        </div>
                        <span>85%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="value-card">
                    <div className="value-icon">🔬</div>
                    <div className="value-content">
                      <h5>Innovation</h5>
                      <p>Advancement through science and technology</p>
                      <div className="value-strength">
                        <span>Strength: </span>
                        <div className="strength-bar">
                          <div className="strength-fill" style={{width: '92%'}}></div>
                        </div>
                        <span>92%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="value-card">
                    <div className="value-icon">🤝</div>
                    <div className="value-content">
                      <h5>Unity</h5>
                      <p>Cooperation and solidarity among peoples</p>
                      <div className="value-strength">
                        <span>Strength: </span>
                        <div className="strength-bar">
                          <div className="strength-fill" style={{width: '78%'}}></div>
                        </div>
                        <span>78%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="value-card">
                    <div className="value-icon">🌱</div>
                    <div className="value-content">
                      <h5>Sustainability</h5>
                      <p>Environmental stewardship and conservation</p>
                      <div className="value-strength">
                        <span>Strength: </span>
                        <div className="strength-bar">
                          <div className="strength-fill" style={{width: '67%'}}></div>
                        </div>
                        <span>67%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="value-card">
                    <div className="value-icon">🎓</div>
                    <div className="value-content">
                      <h5>Education</h5>
                      <p>Knowledge and learning for all citizens</p>
                      <div className="value-strength">
                        <span>Strength: </span>
                        <div className="strength-bar">
                          <div className="strength-fill" style={{width: '89%'}}></div>
                        </div>
                        <span>89%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="value-card">
                    <div className="value-icon">🛡️</div>
                    <div className="value-content">
                      <h5>Security</h5>
                      <p>Protection and safety of the homeland</p>
                      <div className="value-strength">
                        <span>Strength: </span>
                        <div className="strength-bar">
                          <div className="strength-fill" style={{width: '74%'}}></div>
                        </div>
                        <span>74%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="national-motto-section">
                <h4>National Motto & Creed</h4>
                <div className="motto-content">
                  <div className="motto-display">
                    <div className="motto-text">
                      <h5>"Unity Through Progress, Strength Through Wisdom"</h5>
                      <p className="motto-translation">Ancient Terran • "Unitas per Progressum, Fortitudo per Sapientiam"</p>
                    </div>
                    <button className="edit-motto-btn">✏️ Edit Motto</button>
                  </div>
                  
                  <div className="creed-display">
                    <h6>National Creed</h6>
                    <div className="creed-text">
                      <p>We, the citizens of this great civilization, pledge to uphold the values of justice, innovation, and unity. We shall protect our homeland, advance our knowledge, and ensure prosperity for all who call this realm home. In times of peace, we build; in times of trial, we stand together.</p>
                    </div>
                    <button className="edit-creed-btn">📜 Edit Creed</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'government-types' && (
          <div className="government-types-tab">
            <div className="government-types-header">
              <h3>🏛️ Government Types & Transitions</h3>
              <p>Manage your civilization's government type and plan transitions</p>
            </div>

            <div className="government-types-content">
              {/* Current Government Overview */}
              <div className="current-government-section">
                <h4>Current Government</h4>
                {currentGovernment && (
                  <div className="current-gov-card">
                    <div className="gov-header">
                      <h5>{currentGovernment.governmentTypeName}</h5>
                      <div className="gov-metrics">
                        <span className="metric">Effectiveness: {currentGovernment.effectiveness}%</span>
                        <span className="metric">Stability: {currentGovernment.stability}%</span>
                        <span className="metric">Support: {currentGovernment.popularSupport}%</span>
                      </div>
                    </div>
                    {currentGovernment.transitionInProgress && (
                      <div className="transition-notice">
                        🔄 Government transition in progress
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Available Government Types */}
              <div className="available-types-section">
                <h4>Available Government Types</h4>
                <div className="government-types-grid">
                  {governmentTypes.map((type: any) => {
                    const isCurrent = currentGovernment?.governmentTypeId === type.id;
                    return (
                      <div key={type.id} className={`gov-type-card ${isCurrent ? 'current' : ''}`}>
                        <div className="type-header">
                          <h6>{type.name}</h6>
                          <span className="ideology-badge">{type.ideology}</span>
                        </div>
                        
                        <p className="type-description">{type.description}</p>
                        
                        <div className="type-characteristics">
                          <div className="characteristic">
                            <span>Power Structure:</span>
                            <span>{type.powerStructure}</span>
                          </div>
                          <div className="characteristic">
                            <span>Decision Speed:</span>
                            <span>{type.decisionSpeed}/10</span>
                          </div>
                          <div className="characteristic">
                            <span>Civil Liberties:</span>
                            <span>{type.civilLiberties}%</span>
                          </div>
                        </div>

                        <div className="stability-overview">
                          <h6>Stability Factors:</h6>
                          <div className="stability-mini-grid">
                            {Object.entries(type.stabilityFactors).map(([key, value]: [string, any]) => (
                              <div key={key} className="stability-mini-item">
                                <span className="stability-mini-label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                <span className="stability-mini-value">{value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="advantages-disadvantages-mini">
                          <div className="advantages-mini">
                            <strong>✅ Advantages:</strong>
                            <ul>
                              {type.advantages.slice(0, 2).map((advantage: string, index: number) => (
                                <li key={index}>{advantage}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="disadvantages-mini">
                            <strong>❌ Disadvantages:</strong>
                            <ul>
                              {type.disadvantages.slice(0, 2).map((disadvantage: string, index: number) => (
                                <li key={index}>{disadvantage}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="type-actions">
                          {isCurrent ? (
                            <span className="current-badge">Current Government</span>
                          ) : (
                            <button 
                              className="transition-btn"
                              onClick={() => handleGovernmentTransition(type.id)}
                            >
                              Transition to {type.name}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transition Information */}
              <div className="transition-info-section">
                <h4>Government Transition System</h4>
                <div className="transition-requirements">
                  <div className="requirements-card">
                    <h5>Transition Requirements</h5>
                    <ul>
                      <li>Popular support above 40%</li>
                      <li>Government stability above 30%</li>
                      <li>No active crises or conflicts</li>
                      <li>Constitutional amendment process (if required)</li>
                    </ul>
                  </div>
                  <div className="transition-effects">
                    <h5>Transition Effects</h5>
                    <ul>
                      <li>Temporary stability reduction during transition</li>
                      <li>Policy implementation delays</li>
                      <li>Potential civil unrest if unpopular</li>
                      <li>International relations impact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'party-system' && (
          <div className="party-system-tab" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255, 0, 0, 0.2)', padding: '10px', marginBottom: '10px', borderRadius: '4px', color: '#fff', textAlign: 'center' }}>
              🔧 PARTY SYSTEM TAB - FIXED VERSION - Constitution loaded: {constitution ? 'YES' : 'NO'}
            </div>
            <div className="current-system" style={{ background: 'rgba(26, 26, 46, 0.6)', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)', overflow: 'hidden' }}>
              <div className="system-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 30px', background: 'rgba(15, 15, 35, 0.8)', borderBottom: '1px solid rgba(78, 205, 196, 0.2)' }}>
                <h3 style={{ color: '#4ecdc4', margin: 0, fontSize: '22px' }}>Current Political Party System</h3>
                <button 
                  className="change-system-btn"
                  onClick={() => setShowPartySystemModal(true)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#4ecdc4',
                    color: '#0f0f23',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  🔄 Change System
                </button>
              </div>

              <div className="system-details" style={{ padding: '30px' }}>
                <div className="system-info" style={{ marginBottom: '30px' }}>
                  <div style={{ background: 'rgba(0, 255, 0, 0.1)', padding: '10px', marginBottom: '15px', borderRadius: '4px', fontSize: '12px', color: '#4ecdc4' }}>
                    DEBUG: Type = {constitution?.politicalPartySystem?.type || 'undefined'} | 
                    Has Description = {constitution?.politicalPartySystem?.description ? 'YES' : 'NO'} |
                    Has Advantages = {constitution?.politicalPartySystem?.advantages?.length || 0} |
                    Has Stability = {constitution?.politicalPartySystem?.stabilityFactors ? 'YES' : 'NO'}
                  </div>
                  <h4 style={{ color: '#4ecdc4', margin: '0 0 15px 0', fontSize: '20px' }}>
                    {constitution?.politicalPartySystem?.type ? 
                      (partySystemOptions[constitution.politicalPartySystem.type]?.name || constitution.politicalPartySystem.type.charAt(0).toUpperCase() + constitution.politicalPartySystem.type.slice(1) + ' System') 
                      : 'Multi-Party System'}
                  </h4>
                  <p style={{ color: '#b8bcc8', lineHeight: '1.6', margin: '0 0 30px 0' }}>
                    {constitution?.politicalPartySystem?.description || 'A competitive multi-party system allowing unlimited political parties to form and compete in elections across the galaxy.'}
                  </p>
                </div>

                <div className="system-metrics" style={{ marginBottom: '30px' }}>
                  <h5 style={{ color: '#4ecdc4', margin: '0 0 20px 0', fontSize: '16px' }}>📊 System Metrics</h5>
                  <div className="metrics-grid" style={{ display: 'grid', gap: '20px' }}>
                    {Object.entries(constitution?.politicalPartySystem?.stabilityFactors || {
                      governmentStability: 78,
                      democraticLegitimacy: 92,
                      representationQuality: 92,
                      decisionMakingEfficiency: 72
                    }).map(([key, value]) => (
                      <div key={key} className="metric-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span className="metric-label" style={{ minWidth: '200px', color: '#e8e8e8', fontSize: '14px', fontWeight: '500' }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <div className="metric-bar" style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                          <div 
                            className="metric-fill" 
                            style={{ 
                              width: `${value}%`, 
                              height: '100%',
                              background: 'linear-gradient(90deg, #ff6b6b 0%, #ffd93d 50%, #4ecdc4 100%)',
                              borderRadius: '4px',
                              transition: 'width 0.5s ease'
                            }}
                          ></div>
                        </div>
                        <span className="metric-value" style={{ minWidth: '50px', textAlign: 'right', color: '#4ecdc4', fontWeight: '600', fontSize: '14px' }}>
                          {value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="advantages-disadvantages" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div className="advantages">
                    <h5 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#4caf50' }}>✅ Advantages</h5>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {(constitution?.politicalPartySystem?.advantages || [
                        'Diverse representation across species and systems',
                        'Competitive elections promote accountability',
                        'Coalition governments encourage cooperation',
                        'Protection of minority voices'
                      ]).map((advantage, index) => (
                        <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#b8bcc8', fontSize: '14px', lineHeight: '1.5' }}>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="disadvantages">
                    <h5 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#ff6b6b' }}>❌ Disadvantages</h5>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {(constitution?.politicalPartySystem?.disadvantages || [
                        'Potential for political fragmentation',
                        'Coalition instability during crises',
                        'High campaign costs across worlds',
                        'Voter confusion with many choices'
                      ]).map((disadvantage, index) => (
                        <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#b8bcc8', fontSize: '14px', lineHeight: '1.5' }}>
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="structure-tab">
            <div className="debug-info" style={{ background: 'rgba(255, 0, 0, 0.2)', padding: '10px', marginBottom: '20px', borderRadius: '4px', color: '#fff', fontSize: '12px' }}>
              🔧 DEBUG: Structure Tab - Constitution loaded: {constitution ? 'YES' : 'NO'} | Loading: {loading ? 'YES' : 'NO'} | Error: {error || 'NONE'}
            </div>
            <div className="structure-header">
              <h3>Government Structure</h3>
              <p>Constitutional framework defining the organization and powers of government branches</p>
            </div>

            <div className="structure-content">
              {constitution ? (
                <>
                <div className="branches-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div className="branch-card" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                    <div className="branch-header" style={{ marginBottom: '15px' }}>
                      <h4 style={{ color: '#4ecdc4', margin: '0 0 5px 0' }}>🏛️ Executive Branch</h4>
                      <span className="power-level" style={{ background: 'rgba(78, 205, 196, 0.2)', color: '#4ecdc4', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>High Authority</span>
                    </div>
                    <div className="branch-details" style={{ color: '#b8bcc8', fontSize: '14px', lineHeight: '1.6' }}>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Head:</strong> {constitution.governmentType === 'presidential' ? 'President' : 'Prime Minister'}</p>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Term:</strong> 4 years</p>
                      <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Powers:</strong> Execute laws, command military, appoint officials</p>
                    </div>
                  </div>

                <div className="branch-card" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                  <div className="branch-header" style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#4ecdc4', margin: '0 0 5px 0' }}>⚖️ Legislative Branch</h4>
                    <span className="power-level" style={{ background: 'rgba(78, 205, 196, 0.2)', color: '#4ecdc4', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>Primary Authority</span>
                  </div>
                  <div className="branch-details" style={{ color: '#b8bcc8', fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Body:</strong> Galactic Parliament</p>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Members:</strong> 500 representatives</p>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Powers:</strong> Create laws, control budget, oversight</p>
                  </div>
                </div>

                <div className="branch-card" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                  <div className="branch-header" style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#4ecdc4', margin: '0 0 5px 0' }}>🏛️ Judicial Branch</h4>
                    <span className="power-level" style={{ background: 'rgba(78, 205, 196, 0.2)', color: '#4ecdc4', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>Independent Authority</span>
                  </div>
                  <div className="branch-details" style={{ color: '#b8bcc8', fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Head:</strong> Chief Justice</p>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Term:</strong> Life tenure</p>
                    <p style={{ margin: '8px 0' }}><strong style={{ color: '#e8e8e8' }}>Powers:</strong> Interpret laws, constitutional review</p>
                  </div>
                </div>
              </div>

              <div className="checks-balances" style={{ background: 'rgba(26, 26, 46, 0.4)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                <h4 style={{ color: '#4ecdc4', margin: '0 0 20px 0' }}>🔄 Checks and Balances</h4>
                <div className="balance-items" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="balance-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                    <span className="balance-from" style={{ color: '#4ecdc4', fontWeight: 'bold', minWidth: '80px' }}>Executive</span>
                    <span className="balance-arrow" style={{ color: '#b8bcc8' }}>→</span>
                    <span className="balance-to" style={{ color: '#4ecdc4', fontWeight: 'bold', minWidth: '80px' }}>Legislative</span>
                    <span className="balance-power" style={{ color: '#e8e8e8', fontSize: '14px' }}>Veto Power</span>
                  </div>
                  <div className="balance-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                    <span className="balance-from" style={{ color: '#4ecdc4', fontWeight: 'bold', minWidth: '80px' }}>Legislative</span>
                    <span className="balance-arrow" style={{ color: '#b8bcc8' }}>→</span>
                    <span className="balance-to" style={{ color: '#4ecdc4', fontWeight: 'bold', minWidth: '80px' }}>Executive</span>
                    <span className="balance-power" style={{ color: '#e8e8e8', fontSize: '14px' }}>Override Veto (2/3 majority)</span>
                  </div>
                  <div className="balance-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                    <span className="balance-from" style={{ color: '#4ecdc4', fontWeight: 'bold', minWidth: '80px' }}>Judicial</span>
                    <span className="balance-arrow" style={{ color: '#b8bcc8' }}>→</span>
                    <span className="balance-to" style={{ color: '#4ecdc4', fontWeight: 'bold', minWidth: '80px' }}>Both</span>
                    <span className="balance-power" style={{ color: '#e8e8e8', fontSize: '14px' }}>Constitutional Review & Judicial Review</span>
                  </div>
                </div>
              </div>
              </>
              ) : (
                <div className="structure-fallback" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(26, 26, 46, 0.6)', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                  <div className="fallback-icon" style={{ fontSize: '64px', marginBottom: '20px', opacity: '0.7' }}>🏛️</div>
                  <h4 style={{ color: '#4ecdc4', marginBottom: '15px' }}>Government Structure</h4>
                  <p style={{ color: '#888', marginBottom: '25px', lineHeight: '1.6' }}>
                    The government structure defines how power is organized and distributed across different branches of government.
                  </p>
                  
                  <div className="default-structure" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                    <div className="branch-summary" style={{ marginBottom: '20px', padding: '15px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                      <h5 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>🏛️ Executive Branch</h5>
                      <p style={{ color: '#ccc', fontSize: '14px', margin: '0' }}>Responsible for implementing and enforcing laws, led by the head of government.</p>
                    </div>
                    
                    <div className="branch-summary" style={{ marginBottom: '20px', padding: '15px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                      <h5 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>⚖️ Legislative Branch</h5>
                      <p style={{ color: '#ccc', fontSize: '14px', margin: '0' }}>Creates laws and controls government spending, represents the people's interests.</p>
                    </div>
                    
                    <div className="branch-summary" style={{ marginBottom: '20px', padding: '15px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                      <h5 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>🏛️ Judicial Branch</h5>
                      <p style={{ color: '#ccc', fontSize: '14px', margin: '0' }}>Interprets laws and ensures constitutional compliance, provides checks on other branches.</p>
                    </div>
                  </div>
                  
                  <p style={{ color: '#888', fontSize: '12px', marginTop: '25px' }}>
                    Complete your constitution setup to see detailed government structure information.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rights' && constitution && (
          <div className="rights-tab">
            <div className="rights-header">
              <h3>Rights & Freedoms</h3>
              <p>Fundamental rights and freedoms guaranteed by the constitution</p>
            </div>

            <div className="rights-content">
              <div className="rights-categories" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
                <div className="rights-category" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                  <h4 style={{ color: '#4ecdc4', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🗽</span> Civil Rights
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Freedom of speech and expression</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Freedom of assembly and association</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Freedom of religion and belief</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to privacy and data protection</li>
                    <li style={{ padding: '8px 0', color: '#e8e8e8', fontSize: '14px' }}>Equal protection under law</li>
                  </ul>
                </div>

                <div className="rights-category" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                  <h4 style={{ color: '#4ecdc4', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>⚖️</span> Legal Rights
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to fair trial</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Presumption of innocence</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to legal representation</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Protection from cruel punishment</li>
                    <li style={{ padding: '8px 0', color: '#e8e8e8', fontSize: '14px' }}>Right to appeal</li>
                  </ul>
                </div>

                <div className="rights-category" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                  <h4 style={{ color: '#4ecdc4', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🏠</span> Social Rights
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to education</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to healthcare</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to housing</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to work</li>
                    <li style={{ padding: '8px 0', color: '#e8e8e8', fontSize: '14px' }}>Social security protection</li>
                  </ul>
                </div>

                <div className="rights-category" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                  <h4 style={{ color: '#4ecdc4', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🌌</span> Galactic Rights
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Freedom of interplanetary travel</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to planetary citizenship</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Protection from species discrimination</li>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#e8e8e8', fontSize: '14px' }}>Right to cultural preservation</li>
                    <li style={{ padding: '8px 0', color: '#e8e8e8', fontSize: '14px' }}>Environmental protection rights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'amendments' && constitution && (
          <div className="amendments-tab">
            <div className="amendments-header">
              <h3>Constitutional Amendments</h3>
              <p>History of changes and modifications to the constitution</p>
            </div>

            <div className="amendments-content">
              <div className="amendment-process" style={{ background: 'rgba(26, 26, 46, 0.4)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)', marginBottom: '30px' }}>
                <h4 style={{ color: '#4ecdc4', margin: '0 0 15px 0' }}>📋 Amendment Process</h4>
                <div className="process-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div className="process-step" style={{ textAlign: 'center', padding: '15px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
                    <div style={{ color: '#4ecdc4', fontWeight: 'bold', marginBottom: '4px' }}>Proposal</div>
                    <div style={{ color: '#b8bcc8', fontSize: '12px' }}>2/3 Parliament Vote</div>
                  </div>
                  <div className="process-step" style={{ textAlign: 'center', padding: '15px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗳️</div>
                    <div style={{ color: '#4ecdc4', fontWeight: 'bold', marginBottom: '4px' }}>Referendum</div>
                    <div style={{ color: '#b8bcc8', fontSize: '12px' }}>60% Public Support</div>
                  </div>
                  <div className="process-step" style={{ textAlign: 'center', padding: '15px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚖️</div>
                    <div style={{ color: '#4ecdc4', fontWeight: 'bold', marginBottom: '4px' }}>Review</div>
                    <div style={{ color: '#b8bcc8', fontSize: '12px' }}>Constitutional Court</div>
                  </div>
                  <div className="process-step" style={{ textAlign: 'center', padding: '15px', background: 'rgba(15, 15, 35, 0.6)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                    <div style={{ color: '#4ecdc4', fontWeight: 'bold', marginBottom: '4px' }}>Ratification</div>
                    <div style={{ color: '#b8bcc8', fontSize: '12px' }}>Official Adoption</div>
                  </div>
                </div>
              </div>

              <div className="amendments-history">
                <h4 style={{ color: '#4ecdc4', margin: '0 0 20px 0' }}>📜 Amendment History</h4>
                <div className="amendments-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="amendment-item" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h5 style={{ color: '#4ecdc4', margin: 0 }}>Amendment I - Digital Rights</h5>
                      <span style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>Ratified</span>
                    </div>
                    <p style={{ color: '#b8bcc8', margin: '8px 0', fontSize: '14px', lineHeight: '1.5' }}>
                      Established fundamental digital rights including data privacy, AI transparency, and protection from algorithmic discrimination.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                      <span>Adopted: 2389-11-22</span>
                      <span>Support: 73.2%</span>
                    </div>
                  </div>

                  <div className="amendment-item" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h5 style={{ color: '#4ecdc4', margin: 0 }}>Amendment II - Environmental Protection</h5>
                      <span style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>Ratified</span>
                    </div>
                    <p style={{ color: '#b8bcc8', margin: '8px 0', fontSize: '14px', lineHeight: '1.5' }}>
                      Mandated environmental protection across all member worlds and established the Galactic Environmental Council.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                      <span>Adopted: 2388-07-15</span>
                      <span>Support: 81.7%</span>
                    </div>
                  </div>

                  <div className="amendment-item" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255, 193, 7, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h5 style={{ color: '#4ecdc4', margin: 0 }}>Proposed Amendment III - AI Citizenship</h5>
                      <span style={{ background: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>Under Review</span>
                    </div>
                    <p style={{ color: '#b8bcc8', margin: '8px 0', fontSize: '14px', lineHeight: '1.5' }}>
                      Proposes granting citizenship rights to advanced AI entities that meet specific consciousness and autonomy criteria.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                      <span>Proposed: 2390-03-10</span>
                      <span>Current Support: 47.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-provisions' && (
          <div className="ai-provisions-tab">
            <div className="provisions-header">
              <h3>AI-Generated Constitutional Provisions</h3>
              <p>Generate modern constitutional provisions using advanced AI analysis</p>
            </div>

            <div className="provisions-categories">
              {[
                { id: 'economicRights', name: 'Economic Rights', icon: '💰', description: 'Rights related to economic opportunity, property, and commerce' },
                { id: 'socialRights', name: 'Social Rights', icon: '👥', description: 'Rights to education, healthcare, and social welfare' },
                { id: 'culturalRights', name: 'Cultural Rights', icon: '🎭', description: 'Rights to cultural expression, language, and heritage' },
                { id: 'environmentalRights', name: 'Environmental Rights', icon: '🌍', description: 'Rights to clean environment and sustainable development' },
                { id: 'digitalRights', name: 'Digital Rights', icon: '💻', description: 'Rights in the digital age: privacy, access, and protection' },
                { id: 'governanceInnovations', name: 'Governance Innovations', icon: '⚙️', description: 'Modern governance mechanisms and democratic innovations' }
              ].map(category => (
                <div key={category.id} className="provision-category">
                  <div className="category-header">
                    <div className="category-info">
                      <span className="category-icon">{category.icon}</span>
                      <div>
                        <h4>{category.name}</h4>
                        <p>{category.description}</p>
                      </div>
                    </div>
                    <button 
                      className="generate-btn"
                      onClick={() => generateAIProvisions(category.id)}
                      disabled={generatingAI === category.id}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        background: generatingAI === category.id ? '#666' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        cursor: generatingAI === category.id ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {generatingAI === category.id ? '🔄 Generating...' : '🤖 Generate'}
                    </button>
                  </div>

                  {aiProvisions[category.id] && (
                    <div className="generated-provisions">
                      <div className="provisions-section">
                        <h5>📋 Provisions</h5>
                        <ul>
                          {aiProvisions[category.id].provisions.map((provision, index) => (
                            <li key={index}>{provision}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="provisions-section">
                        <h5>🛡️ Protections</h5>
                        <ul>
                          {aiProvisions[category.id].protections.map((protection, index) => (
                            <li key={index}>{protection}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="provisions-section">
                        <h5>⚠️ Limitations</h5>
                        <ul>
                          {aiProvisions[category.id].limitations.map((limitation, index) => (
                            <li key={index}>{limitation}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="provisions-section">
                        <h5>⚖️ Enforcement</h5>
                        <ul>
                          {aiProvisions[category.id].enforcementMechanisms.map((mechanism, index) => (
                            <li key={index}>{mechanism}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="points-tab">
            <div className="points-header">
              <h3>Constitutional Points System</h3>
              <p>Allocation of constitutional authority and power balance</p>
              <div className="total-points">
                Total Points: <strong>{constitution.constitutionalPoints.totalPoints}</strong>
              </div>
            </div>

            <div className="points-allocation">
              {Object.entries(constitution.constitutionalPoints.allocatedPoints).map(([category, points]) => (
                <div key={category} className="point-category">
                  <div className="point-info">
                    <span className="point-label">
                      {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="point-value">{points} points</span>
                  </div>
                  <div className="point-bar">
                    <div 
                      className="point-fill" 
                      style={{ width: `${(points / constitution.constitutionalPoints.totalPoints) * 100}%` }}
                    ></div>
                  </div>
                  <div className="point-percentage">
                    {((points / constitution.constitutionalPoints.totalPoints) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'government-config' && constitution && (
          <div className="government-config-tab">
            <div className="config-header">
              <h3>Government Configuration</h3>
              <p>Configure the fundamental structure and operation of your government</p>
            </div>

            <div className="config-sections">
              <div className="config-section">
                <h4>🏛️ Government Type</h4>
                <div className="config-options">
                  <select 
                    value={pendingGovernmentType || constitution.governmentType} 
                    onChange={(e) => handleGovernmentTypeChange(e.target.value)}
                    className="config-select"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #4ecdc4',
                      background: '#1a1a2e',
                      color: '#4ecdc4',
                      fontSize: '14px'
                    }}
                  >
                    <option value="presidential">Presidential System</option>
                    <option value="parliamentary">Parliamentary System</option>
                    <option value="semi_presidential">Semi-Presidential System</option>
                    <option value="constitutional_monarchy">Constitutional Monarchy</option>
                  </select>
                  <button 
                    className="apply-btn" 
                    onClick={() => applyGovernmentChanges()}
                    style={{
                      padding: '8px 16px',
                      marginLeft: '10px',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#4ecdc4',
                      color: '#0f0f23',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    disabled={!pendingGovernmentType || pendingGovernmentType === constitution.governmentType}
                  >
                    Apply Changes
                  </button>
                </div>
              </div>

              <div className="config-section">
                <h4>📜 Constitutional Framework</h4>
                <div className="framework-editor">
                  <label style={{ color: '#4ecdc4', marginBottom: '8px', display: 'block' }}>Preamble:</label>
                  <textarea 
                    value={editingPreamble}
                    onChange={(e) => handlePreambleChange(e.target.value)}
                    className="preamble-editor"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #4ecdc4',
                      background: '#1a1a2e',
                      color: '#b8bcc8',
                      fontSize: '14px',
                      resize: 'vertical',
                      marginBottom: '10px'
                    }}
                  />
                  <button 
                    className="save-btn" 
                    onClick={() => savePreambleChanges()}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#4ecdc4',
                      color: '#0f0f23',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    disabled={editingPreamble === constitution.preamble}
                  >
                    Save Preamble
                  </button>
                </div>
              </div>

              <div className="config-section">
                <h4>🎯 Founding Principles</h4>
                <div className="principles-editor">
                  {editingPrinciples.map((principle, index) => (
                    <div key={index} className="principle-item" style={{ display: 'flex', marginBottom: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={principle}
                        onChange={(e) => handlePrincipleChange(index, e.target.value)}
                        className="principle-input"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #4ecdc4',
                          background: '#1a1a2e',
                          color: '#b8bcc8',
                          fontSize: '14px',
                          marginRight: '8px'
                        }}
                      />
                      <button 
                        className="remove-btn"
                        onClick={() => removePrinciple(index)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#e74c3c',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      className="add-btn" 
                      onClick={() => addNewPrinciple()}
                      style={{
                        padding: '8px 16px',
                        marginRight: '10px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#27ae60',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      + Add Principle
                    </button>
                    <button 
                      className="save-btn" 
                      onClick={() => savePrinciplesChanges()}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#4ecdc4',
                        color: '#0f0f23',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      disabled={JSON.stringify(editingPrinciples) === JSON.stringify(constitution.foundingPrinciples)}
                    >
                      Save Principles
                    </button>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h4>🤖 AI Constitutional Assistant</h4>
                <div className="ai-assistant">
                  <textarea 
                    placeholder="Describe what constitutional changes you'd like to make..."
                    className="ai-prompt"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #4ecdc4',
                      background: '#1a1a2e',
                      color: '#b8bcc8',
                      fontSize: '14px',
                      resize: 'vertical',
                      marginBottom: '10px'
                    }}
                  />
                  <button 
                    className="ai-generate-btn" 
                    onClick={() => generateConstitutionalChanges()}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '4px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    🤖 Generate Constitutional Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Party System Change Modal */}
      {showPartySystemModal && (
        <div className="modal-overlay">
          <div className="modal-content party-system-modal">
            <div className="modal-header">
              <h3>Change Political Party System</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPartySystemModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>Select a new political party system for your constitution:</p>
              
              <div className="party-system-options">
                {Object.entries(partySystemOptions).map(([key, option]) => (
                  <div 
                    key={key}
                    className={`system-option ${selectedPartySystem === key ? 'selected' : ''}`}
                    onClick={() => setSelectedPartySystem(key)}
                  >
                    <div className="option-header">
                      <input 
                        type="radio" 
                        name="partySystem" 
                        value={key}
                        checked={selectedPartySystem === key}
                        onChange={() => setSelectedPartySystem(key)}
                      />
                      <h4>{option.name}</h4>
                    </div>
                    <p>{option.description}</p>
                    
                    <div className="option-metrics">
                      {Object.entries(option.stabilityFactors).map(([metric, value]) => (
                        <div key={metric} className="mini-metric">
                          <span>{metric.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{value}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="option-recommended">
                      <strong>Recommended for:</strong> {option.recommendedFor.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowPartySystemModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handlePartySystemChange}
                disabled={selectedPartySystem === constitution.politicalPartySystem.type}
              >
                Change System
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstitutionScreen;
