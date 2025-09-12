/**
 * Character Research Service
 * Allows AI characters to research current game state via APIs before responding
 */

export interface ResearchQuery {
  characterId: string;
  department: string;
  query: string;
  relevantAPIs: string[];
}

export interface ResearchResult {
  query: string;
  apiResults: Array<{
    endpoint: string;
    data: any;
    success: boolean;
    error?: string;
  }>;
  summary: string;
  timestamp: Date;
}

export interface APIEndpoint {
  url: string;
  method: 'GET' | 'POST';
  description: string;
  department: string[];
  dataType: string;
}

export class CharacterResearchService {
  private static instance: CharacterResearchService;
  private baseUrl: string;

  // Define available APIs that characters can research (ALL PANEL APIS)
  private availableAPIs: APIEndpoint[] = [
    // Core Game Systems
    {
      url: '/api/health',
      method: 'GET',
      description: 'Healthcare system status, facilities, and metrics',
      department: ['health', 'general'],
      dataType: 'health_data'
    },
    {
      url: '/api/education',
      method: 'GET',
      description: 'Education system status and metrics',
      department: ['education', 'general'],
      dataType: 'education_data'
    },
    {
      url: '/api/species',
      method: 'GET',
      description: 'Available species and their characteristics',
      department: ['general', 'diplomatic', 'research'],
      dataType: 'species_data'
    },
    {
      url: '/api/campaigns',
      method: 'GET',
      description: 'Active campaigns and game progress',
      department: ['general', 'strategic'],
      dataType: 'campaigns_data'
    },
    {
      url: '/api/characters',
      method: 'GET',
      description: 'Available characters and their profiles',
      department: ['general', 'personnel', 'diplomatic'],
      dataType: 'characters_data'
    },
    {
      url: '/api/game',
      method: 'GET',
      description: 'Game setup and configuration data',
      department: ['general', 'administrative'],
      dataType: 'game_data'
    },
    {
      url: '/api/story',
      method: 'GET',
      description: 'Current story status and narrative events',
      department: ['general', 'narrative'],
      dataType: 'story_data'
    },

    // Economic Systems
    {
      url: '/api/economic-tiers',
      method: 'GET',
      description: 'Economic tier definitions and development pathways',
      department: ['economic', 'policy', 'general'],
      dataType: 'economic_tiers_data'
    },
    {
      url: '/api/treasury',
      method: 'GET',
      description: 'Government treasury and financial status',
      department: ['economic', 'treasury', 'finance'],
      dataType: 'treasury_data'
    },
    {
      url: '/api/central-bank',
      method: 'GET',
      description: 'Central banking operations and monetary policy',
      department: ['economic', 'finance', 'monetary'],
      dataType: 'central_bank_data'
    },
    {
      url: '/api/central-bank-enhanced',
      method: 'GET',
      description: 'Enhanced central banking features and analytics',
      department: ['economic', 'finance', 'monetary'],
      dataType: 'central_bank_enhanced_data'
    },
    {
      url: '/api/currency-exchange',
      method: 'GET',
      description: 'Currency exchange rates and foreign exchange',
      department: ['economic', 'finance', 'trade'],
      dataType: 'currency_exchange_data'
    },
    {
      url: '/api/fiscal-simulation',
      method: 'GET',
      description: 'Fiscal policy simulation and projections',
      department: ['economic', 'policy', 'finance'],
      dataType: 'fiscal_simulation_data'
    },
    {
      url: '/api/financial-markets',
      method: 'GET',
      description: 'Financial markets data and trading information',
      department: ['economic', 'finance', 'markets'],
      dataType: 'financial_markets_data'
    },
    {
      url: '/api/economic-ecosystem',
      method: 'GET',
      description: 'Comprehensive economic ecosystem analysis',
      department: ['economic', 'policy', 'analysis'],
      dataType: 'economic_ecosystem_data'
    },
    {
      url: '/api/inflation',
      method: 'GET',
      description: 'Inflation rates and economic indicators',
      department: ['economic', 'finance', 'policy'],
      dataType: 'inflation_data'
    },
    {
      url: '/api/small-business',
      method: 'GET',
      description: 'Small business sector data and statistics',
      department: ['economic', 'business', 'commerce'],
      dataType: 'small_business_data'
    },
    {
      url: '/api/commerce',
      method: 'GET',
      description: 'Commerce and trade sector information',
      department: ['economic', 'commerce', 'trade'],
      dataType: 'commerce_data'
    },
    {
      url: '/api/trade',
      method: 'GET',
      description: 'Trade routes and international commerce',
      department: ['economic', 'trade', 'diplomatic'],
      dataType: 'trade_data'
    },

    // Government and Political Systems
    {
      url: '/api/cabinet',
      method: 'GET',
      description: 'Cabinet members and government workflow',
      department: ['government', 'administrative', 'executive'],
      dataType: 'cabinet_data'
    },
    {
      url: '/api/advisors',
      method: 'GET',
      description: 'Government advisors and their recommendations',
      department: ['government', 'advisory', 'policy'],
      dataType: 'advisors_data'
    },
    {
      url: '/api/policies',
      method: 'GET',
      description: 'Government policies and regulations',
      department: ['government', 'policy', 'legislative'],
      dataType: 'policies_data'
    },
    {
      url: '/api/constitution',
      method: 'GET',
      description: 'Constitutional framework and amendments',
      department: ['government', 'legal', 'constitutional'],
      dataType: 'constitution_data'
    },
    {
      url: '/api/government-types',
      method: 'GET',
      description: 'Available government types and structures',
      department: ['government', 'political', 'administrative'],
      dataType: 'government_types_data'
    },
    {
      url: '/api/government-contracts',
      method: 'GET',
      description: 'Government contracts and procurement',
      department: ['government', 'procurement', 'contracts'],
      dataType: 'government_contracts_data'
    },
    {
      url: '/api/government-bonds',
      method: 'GET',
      description: 'Government bonds and debt instruments',
      department: ['government', 'finance', 'debt'],
      dataType: 'government_bonds_data'
    },
    {
      url: '/api/planetary-government',
      method: 'GET',
      description: 'Planetary government structure and operations',
      department: ['government', 'planetary', 'administrative'],
      dataType: 'planetary_government_data'
    },
    {
      url: '/api/sovereign-wealth-fund',
      method: 'GET',
      description: 'Sovereign wealth fund management and investments',
      department: ['government', 'finance', 'investment'],
      dataType: 'sovereign_wealth_fund_data'
    },
    {
      url: '/api/institutional-override',
      method: 'GET',
      description: 'Institutional override mechanisms and controls',
      department: ['government', 'security', 'control'],
      dataType: 'institutional_override_data'
    },

    // Legislative and Judicial
    {
      url: '/api/legislature',
      method: 'GET',
      description: 'Legislative body and lawmaking processes',
      department: ['government', 'legislative', 'law'],
      dataType: 'legislature_data'
    },
    {
      url: '/api/supreme-court',
      method: 'GET',
      description: 'Supreme court decisions and judicial review',
      department: ['government', 'judicial', 'legal'],
      dataType: 'supreme_court_data'
    },
    {
      url: '/api/political-parties',
      method: 'GET',
      description: 'Political parties and electoral systems',
      department: ['government', 'political', 'electoral'],
      dataType: 'political_parties_data'
    },
    {
      url: '/api/justice',
      method: 'GET',
      description: 'Justice system and law enforcement',
      department: ['government', 'justice', 'law'],
      dataType: 'justice_data'
    },

    // Defense and Security
    {
      url: '/api/defense',
      method: 'GET',
      description: 'Defense systems and military capabilities',
      department: ['defense', 'military', 'security'],
      dataType: 'defense_data'
    },
    {
      url: '/api/joint-chiefs',
      method: 'GET',
      description: 'Joint Chiefs of Staff and military command',
      department: ['defense', 'military', 'command'],
      dataType: 'joint_chiefs_data'
    },
    {
      url: '/api/intelligence',
      method: 'GET',
      description: 'Intelligence services and security operations',
      department: ['defense', 'intelligence', 'security'],
      dataType: 'intelligence_data'
    },
    {
      url: '/api/conquest',
      method: 'GET',
      description: 'Military conquest and territorial expansion',
      department: ['defense', 'military', 'expansion'],
      dataType: 'conquest_data'
    },
    {
      url: '/api/export-controls',
      method: 'GET',
      description: 'Export controls and trade restrictions',
      department: ['defense', 'trade', 'security'],
      dataType: 'export_controls_data'
    },

    // Science and Technology
    {
      url: '/api/science',
      method: 'GET',
      description: 'Scientific research and technological advancement',
      department: ['science', 'research', 'technology'],
      dataType: 'science_data'
    },
    {
      url: '/api/missions',
      method: 'GET',
      description: 'Scientific missions and exploration projects',
      department: ['science', 'exploration', 'research'],
      dataType: 'missions_data'
    },

    // Administrative Departments
    {
      url: '/api/state',
      method: 'GET',
      description: 'State department and diplomatic relations',
      department: ['state', 'diplomatic', 'foreign'],
      dataType: 'state_data'
    },
    {
      url: '/api/interior',
      method: 'GET',
      description: 'Interior department and domestic affairs',
      department: ['interior', 'domestic', 'administrative'],
      dataType: 'interior_data'
    },
    {
      url: '/api/communications',
      method: 'GET',
      description: 'Communications systems and networks',
      department: ['communications', 'technology', 'infrastructure'],
      dataType: 'communications_data'
    },
    {
      url: '/api/media-control',
      method: 'GET',
      description: 'Media control and information management',
      department: ['communications', 'media', 'information'],
      dataType: 'media_control_data'
    },

    // Infrastructure and Development
    {
      url: '/api/city-emergence',
      method: 'GET',
      description: 'City development and urban planning',
      department: ['development', 'urban', 'infrastructure'],
      dataType: 'city_emergence_data'
    },
    {
      url: '/api/entertainment-tourism',
      method: 'GET',
      description: 'Entertainment and tourism sector data',
      department: ['entertainment', 'tourism', 'culture'],
      dataType: 'entertainment_tourism_data'
    },

    // Space and Galaxy
    {
      url: '/api/galaxy',
      method: 'GET',
      description: 'Galaxy exploration and space operations',
      department: ['space', 'exploration', 'science'],
      dataType: 'galaxy_data'
    },
    {
      url: '/api/empire',
      method: 'GET',
      description: 'Empire management and territorial control',
      department: ['empire', 'territorial', 'expansion'],
      dataType: 'empire_data'
    },
    {
      url: '/api/map',
      method: 'GET',
      description: 'Galactic maps and territorial boundaries',
      department: ['space', 'territorial', 'navigation'],
      dataType: 'map_data'
    },

    // Analytics and Intelligence
    {
      url: '/api/analytics',
      method: 'GET',
      description: 'Government analytics and performance metrics',
      department: ['analytics', 'performance', 'intelligence'],
      dataType: 'analytics_data'
    },
    {
      url: '/api/civilization-analytics',
      method: 'GET',
      description: 'Civilization-wide analytics and trends',
      department: ['analytics', 'civilization', 'trends'],
      dataType: 'civilization_analytics_data'
    },

    // AI and Simulation
    {
      url: '/api/ai',
      method: 'GET',
      description: 'AI systems and artificial intelligence operations',
      department: ['ai', 'technology', 'automation'],
      dataType: 'ai_data'
    },
    {
      url: '/api/sim-engine',
      method: 'GET',
      description: 'Simulation engine data and modeling',
      department: ['simulation', 'modeling', 'analysis'],
      dataType: 'sim_engine_data'
    },
    {
      url: '/api/sim',
      method: 'GET',
      description: 'Simulation results and projections',
      department: ['simulation', 'analysis', 'forecasting'],
      dataType: 'sim_data'
    },

    // Communication and Social
    {
      url: '/api/whoseapp',
      method: 'GET',
      description: 'WhoseApp messaging and communication platform',
      department: ['communications', 'social', 'messaging'],
      dataType: 'whoseapp_data'
    },
    {
      url: '/api/witter',
      method: 'GET',
      description: 'Witter social media platform data',
      department: ['communications', 'social', 'media'],
      dataType: 'witter_data'
    },

    // Technical Services
    {
      url: '/api/audio',
      method: 'GET',
      description: 'Audio systems and voice processing',
      department: ['technology', 'audio', 'communications'],
      dataType: 'audio_data'
    },
    {
      url: '/api/stt',
      method: 'GET',
      description: 'Speech-to-text services and transcription',
      department: ['technology', 'audio', 'processing'],
      dataType: 'stt_data'
    },
    {
      url: '/api/imagen',
      method: 'GET',
      description: 'Image generation and visual content creation',
      department: ['technology', 'media', 'generation'],
      dataType: 'imagen_data'
    },
    {
      url: '/api/gamemaster',
      method: 'GET',
      description: 'Game master services and narrative control',
      department: ['narrative', 'game', 'control'],
      dataType: 'gamemaster_data'
    },

    // Utility and Configuration
    {
      url: '/api/settings',
      method: 'GET',
      description: 'System settings and configuration',
      department: ['system', 'configuration', 'administrative'],
      dataType: 'settings_data'
    },
    {
      url: '/api/providers',
      method: 'GET',
      description: 'Service providers and external integrations',
      department: ['system', 'integration', 'services'],
      dataType: 'providers_data'
    },
    {
      url: '/api/schedules',
      method: 'GET',
      description: 'Scheduling systems and time management',
      department: ['administrative', 'scheduling', 'management'],
      dataType: 'schedules_data'
    },
    {
      url: '/api/memory',
      method: 'GET',
      description: 'Memory systems and data storage',
      department: ['system', 'memory', 'storage'],
      dataType: 'memory_data'
    },

    // Specialized Systems
    {
      url: '/api/personalities',
      method: 'GET',
      description: 'Character personalities and behavioral profiles',
      department: ['psychology', 'character', 'behavioral'],
      dataType: 'personalities_data'
    },
    {
      url: '/api/outcome',
      method: 'GET',
      description: 'Decision outcomes and consequence tracking',
      department: ['analysis', 'outcomes', 'consequences'],
      dataType: 'outcome_data'
    },
    {
      url: '/api/encounter',
      method: 'GET',
      description: 'Encounter systems and event management',
      department: ['events', 'encounters', 'management'],
      dataType: 'encounter_data'
    },
    {
      url: '/api/vezy',
      method: 'GET',
      description: 'Vezy platform integration and services',
      department: ['integration', 'platform', 'services'],
      dataType: 'vezy_data'
    },
    {
      url: '/api/generator',
      method: 'GET',
      description: 'Content generation and procedural systems',
      department: ['generation', 'procedural', 'content'],
      dataType: 'generator_data'
    },
    {
      url: '/api/game-characters',
      method: 'GET',
      description: 'Game character management and profiles',
      department: ['characters', 'game', 'management'],
      dataType: 'game_characters_data'
    }
  ];

  constructor(baseUrl: string = 'http://localhost:4000') {
    this.baseUrl = baseUrl;
  }

  static getInstance(): CharacterResearchService {
    if (!CharacterResearchService.instance) {
      CharacterResearchService.instance = new CharacterResearchService();
    }
    return CharacterResearchService.instance;
  }

  /**
   * Get relevant APIs for a character's department and query
   */
  getRelevantAPIs(department: string, query: string): APIEndpoint[] {
    const queryLower = query.toLowerCase();
    const departmentLower = department.toLowerCase();

    return this.availableAPIs.filter(api => {
      // Check if API is relevant to department
      const departmentMatch = api.department.some(dept => 
        dept === departmentLower || departmentLower.includes(dept)
      );

      // Check if API is relevant to query content
      const queryMatch = 
        queryLower.includes(api.dataType.replace('_', ' ')) ||
        queryLower.includes(api.description.toLowerCase()) ||
        api.description.toLowerCase().includes(queryLower.split(' ')[0]);

      return departmentMatch || queryMatch;
    });
  }

  /**
   * Research current game state for a character's query
   */
  async conductResearch(
    characterId: string,
    department: string,
    userQuery: string,
    civilizationId: string = 'terran_federation'
  ): Promise<ResearchResult> {
    console.log(`🔍 ${characterId} conducting research for: "${userQuery}"`);

    const relevantAPIs = this.getRelevantAPIs(department, userQuery);
    const apiResults: any[] = [];

    // Query each relevant API
    for (const api of relevantAPIs.slice(0, 5)) { // Limit to 5 APIs to avoid overload
      try {
        console.log(`📡 Querying ${api.url} for ${characterId}`);
        
        let url = `${this.baseUrl}${api.url}`;
        if (api.url.includes('?')) {
          url += `&civilizationId=${civilizationId}`;
        } else {
          url += `?civilizationId=${civilizationId}`;
        }

        const response = await fetch(url, {
          method: api.method,
          headers: {
            'Content-Type': 'application/json',
            'X-Character-Research': characterId
          }
        });

        if (response.ok) {
          const data = await response.json();
          apiResults.push({
            endpoint: api.url,
            description: api.description,
            dataType: api.dataType,
            data: data,
            success: true
          });
        } else {
          console.warn(`API ${api.url} returned ${response.status}: ${response.statusText}`);
          apiResults.push({
            endpoint: api.url,
            description: api.description,
            dataType: api.dataType,
            data: null,
            success: false,
            error: `HTTP ${response.status}: ${response.statusText}`
          });
        }
      } catch (error) {
        console.warn(`Failed to query ${api.url}:`, error);
        apiResults.push({
          endpoint: api.url,
          description: api.description,
          dataType: api.dataType,
          data: null,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Generate research summary
    const summary = this.generateResearchSummary(userQuery, apiResults, department);

    return {
      query: userQuery,
      apiResults,
      summary,
      timestamp: new Date()
    };
  }


  /**
   * Generate a research summary based on API results
   */
  private generateResearchSummary(query: string, apiResults: any[], department: string): string {
    const summaryParts: string[] = [];

    summaryParts.push(`Research Summary for: "${query}"`);
    summaryParts.push(`Department: ${department}`);
    summaryParts.push(`APIs Queried: ${apiResults.length}`);
    summaryParts.push('');

    // Add key findings from each API
    apiResults.forEach(result => {
      if (result.success && result.data) {
        summaryParts.push(`${result.description}:`);
        
        // Extract key information based on data type
        if (result.dataType === 'health_data' && result.data.data) {
          const healthData = result.data.data;
          if (healthData.metrics) {
            summaryParts.push(`- Life Expectancy: ${healthData.metrics.lifeExpectancy} years`);
            summaryParts.push(`- Healthcare Access: ${healthData.metrics.healthcareAccess}%`);
            summaryParts.push(`- Patient Satisfaction: ${healthData.metrics.patientSatisfaction}%`);
          }
        } else if (result.dataType === 'missions_data' && result.data.data) {
          const missions = result.data.data;
          summaryParts.push(`- Available mission types: ${missions.length}`);
          const types = [...new Set(missions.map((m: any) => m.type))];
          summaryParts.push(`- Mission categories: ${types.join(', ')}`);
        } else if (result.dataType === 'education_data' && result.data.data) {
          const eduData = result.data.data;
          if (eduData.metrics) {
            summaryParts.push(`- Total Students: ${eduData.metrics.totalStudents.toLocaleString()}`);
            summaryParts.push(`- Literacy Rate: ${eduData.metrics.literacyRate}%`);
            summaryParts.push(`- Graduation Rate: ${eduData.metrics.graduationRate}%`);
          }
        } else if (result.dataType === 'story_data') {
          summaryParts.push(`- Active Story Arcs: ${result.data.activeArcs || 0}`);
          summaryParts.push(`- Total Events: ${result.data.totalEvents || 0}`);
        } else if (result.dataType === 'economic_tiers_data' && result.data.definitions) {
          const tiers = result.data.definitions;
          summaryParts.push(`- Economic Tiers Available: ${tiers.length}`);
          const tierNames = tiers.map((t: any) => t.name).join(', ');
          summaryParts.push(`- Tier Types: ${tierNames}`);
        } else if (result.dataType === 'species_data' && result.data.species) {
          const species = result.data.species;
          summaryParts.push(`- Available Species: ${species.length}`);
          const categories = [...new Set(species.map((s: any) => s.category))];
          summaryParts.push(`- Species Categories: ${categories.join(', ')}`);
        } else if (result.dataType === 'campaigns_data' && result.data.data) {
          const campaigns = result.data.data;
          summaryParts.push(`- Total Campaigns: ${campaigns.length}`);
          const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
          summaryParts.push(`- Active Campaigns: ${activeCampaigns}`);
        } else if (result.dataType === 'characters_data' && result.data.characters) {
          const characters = result.data.characters;
          summaryParts.push(`- Available Characters: ${characters.length}`);
          const departments = [...new Set(characters.map((c: any) => c.department))];
          summaryParts.push(`- Departments: ${departments.join(', ')}`);
        } else if (result.dataType.includes('economic') || result.dataType.includes('treasury') || result.dataType.includes('finance')) {
          // Economic/Financial data
          summaryParts.push(`- Economic/Financial data available with ${Object.keys(result.data).length} metrics`);
        } else if (result.dataType.includes('government') || result.dataType.includes('cabinet') || result.dataType.includes('policy')) {
          // Government data
          summaryParts.push(`- Government/Policy data available with ${Object.keys(result.data).length} components`);
        } else if (result.dataType.includes('defense') || result.dataType.includes('military') || result.dataType.includes('security')) {
          // Defense/Security data
          summaryParts.push(`- Defense/Security data available with ${Object.keys(result.data).length} elements`);
        } else if (result.dataType.includes('science') || result.dataType.includes('research') || result.dataType.includes('technology')) {
          // Science/Technology data
          summaryParts.push(`- Science/Technology data available with ${Object.keys(result.data).length} research areas`);
        } else if (result.dataType.includes('space') || result.dataType.includes('galaxy') || result.dataType.includes('empire')) {
          // Space/Galaxy data
          summaryParts.push(`- Space/Galaxy data available with ${Object.keys(result.data).length} sectors`);
        } else if (result.dataType.includes('analytics') || result.dataType.includes('simulation') || result.dataType.includes('ai')) {
          // Analytics/AI data
          summaryParts.push(`- Analytics/AI data available with ${Object.keys(result.data).length} data points`);
        } else {
          // Generic data summary
          summaryParts.push(`- Data available: ${Object.keys(result.data).length} fields`);
        }
        summaryParts.push('');
      } else if (!result.success) {
        summaryParts.push(`${result.description}: UNAVAILABLE (${result.error})`);
        summaryParts.push('');
      }
    });

    return summaryParts.join('\n');
  }

  /**
   * Format research results for AI prompt inclusion
   */
  formatForAIPrompt(research: ResearchResult): string {
    return `
## CURRENT GAME STATE RESEARCH
**Query**: ${research.query}
**Research Timestamp**: ${research.timestamp.toISOString()}

${research.summary}

**Raw Data Available**:
${research.apiResults.map(result => 
  `- ${result.description}: ${result.success ? 'Available' : 'Failed'}`
).join('\n')}

**Key Insights**:
${research.apiResults.map(result => {
  if (!result.success || !result.data) return `${result.description}: FAILED - ${result.error}`;
  
  const insights: string[] = [];
  
  // Health data insights
  if (result.dataType === 'health_data' && result.data.data?.metrics) {
    const metrics = result.data.data.metrics;
    insights.push(`Healthcare: ${metrics.healthcareAccess}% access, ${metrics.lifeExpectancy}yr life expectancy`);
  }
  
  // Mission data insights  
  if (result.dataType === 'missions_data' && result.data.data) {
    const missions = result.data.data;
    const types = [...new Set(missions.map((m: any) => m.type))];
    insights.push(`Missions: ${missions.length} templates (${types.join(', ')})`);
  }
  
  // Education data insights
  if (result.dataType === 'education_data' && result.data.data?.metrics) {
    const metrics = result.data.data.metrics;
    insights.push(`Education: ${metrics.totalStudents.toLocaleString()} students, ${metrics.literacyRate}% literacy`);
  }
  
  // Story data insights
  if (result.dataType === 'story_data') {
    insights.push(`Story: ${result.data.activeArcs || 0} active arcs, ${result.data.totalEvents || 0} events`);
  }
  
  // Economic tiers data insights
  if (result.dataType === 'economic_tiers_data' && result.data.definitions) {
    const tiers = result.data.definitions;
    insights.push(`Economic Development: ${tiers.length} tier levels available`);
  }
  
  // Species data insights
  if (result.dataType === 'species_data' && result.data.species) {
    const species = result.data.species;
    insights.push(`Species: ${species.length} available species`);
  }
  
  // Campaigns data insights
  if (result.dataType === 'campaigns_data' && result.data.data) {
    const campaigns = result.data.data;
    const active = campaigns.filter((c: any) => c.status === 'active').length;
    insights.push(`Campaigns: ${active}/${campaigns.length} active campaigns`);
  }
  
  // Characters data insights
  if (result.dataType === 'characters_data' && result.data.characters) {
    const characters = result.data.characters;
    const available = characters.filter((c: any) => c.status === 'available').length;
    insights.push(`Personnel: ${available}/${characters.length} available characters`);
  }
  
  // Economic/Financial system insights
  if (result.dataType.includes('economic') || result.dataType.includes('treasury') || result.dataType.includes('finance')) {
    insights.push(`Economic/Financial: ${Object.keys(result.data).length} metrics available`);
  }
  
  // Government system insights
  if (result.dataType.includes('government') || result.dataType.includes('cabinet') || result.dataType.includes('policy')) {
    insights.push(`Government/Policy: ${Object.keys(result.data).length} components tracked`);
  }
  
  // Defense/Security system insights
  if (result.dataType.includes('defense') || result.dataType.includes('military') || result.dataType.includes('security')) {
    insights.push(`Defense/Security: ${Object.keys(result.data).length} security elements`);
  }
  
  // Science/Technology system insights
  if (result.dataType.includes('science') || result.dataType.includes('research') || result.dataType.includes('technology')) {
    insights.push(`Science/Technology: ${Object.keys(result.data).length} research areas`);
  }
  
  // Space/Galaxy system insights
  if (result.dataType.includes('space') || result.dataType.includes('galaxy') || result.dataType.includes('empire')) {
    insights.push(`Space/Galaxy: ${Object.keys(result.data).length} galactic sectors`);
  }
  
  // Analytics/AI system insights
  if (result.dataType.includes('analytics') || result.dataType.includes('simulation') || result.dataType.includes('ai')) {
    insights.push(`Analytics/AI: ${Object.keys(result.data).length} data points analyzed`);
  }
  
  // Generic insights for other data types
  if (insights.length === 0 && result.data) {
    insights.push(`${result.description}: Data available`);
  }
  
  return insights.join(', ');
}).filter(Boolean).join('\n')}

Use this current data to provide accurate, up-to-date responses that reflect the actual game state.
`;
  }
}
