import { GameStateProvider } from './WitterAIService.js';

/**
 * Implementation of GameStateProvider that integrates with actual game systems
 */
export class DefaultGameStateProvider implements GameStateProvider {
  private campaignId?: number;
  private civilizationGenerator?: any;
  private gameEngine?: any;
  
  constructor(campaignId?: number, civilizationGenerator?: any, gameEngine?: any) {
    this.campaignId = campaignId;
    this.civilizationGenerator = civilizationGenerator;
    this.gameEngine = gameEngine;
  }

  async getCivilizations(): Promise<Map<string, any>> {
    if (this.civilizationGenerator && this.civilizationGenerator.civilizations) {
      return this.civilizationGenerator.civilizations;
    }
    
    // Fallback to demo data if no generator available
    const civilizations = new Map();
    const demoData = [
      { id: 'terran_federation', name: 'Terran Federation', type: 'Democratic Republic', level: 10 },
      { id: 'centauri_republic', name: 'Centauri Republic', type: 'Military Alliance', level: 8 },
      { id: 'vegan_collective', name: 'Vegan Collective', type: 'Scientific Collective', level: 9 },
      { id: 'sirian_empire', name: 'Sirian Empire', type: 'Trade Consortium', level: 9 },
      { id: 'kepler_technocracy', name: 'Kepler Technocracy', type: 'Technocratic Meritocracy', level: 7 },
      { id: 'andromedan_alliance', name: 'Andromedan Alliance', type: 'Diplomatic Federation', level: 6 },
      { id: 'rigellian_consortium', name: 'Rigellian Consortium', type: 'Corporate Oligarchy', level: 8 },
      { id: 'betelgeuse_coalition', name: 'Betelgeuse Coalition', type: 'Military Junta', level: 5 }
    ];
    
    demoData.forEach(civ => civilizations.set(civ.id, civ));
    return civilizations;
  }

  async getStarSystems(): Promise<Map<string, any>> {
    if (this.civilizationGenerator && this.civilizationGenerator.systems) {
      return this.civilizationGenerator.systems;
    }
    
    // Fallback to demo data
    const systems = new Map();
    const demoData = [
      { id: 'sol', name: 'Sol', starType: 'G', age: 4.6, totalPopulation: 12000000000 },
      { id: 'alpha_centauri', name: 'Alpha Centauri', starType: 'G', age: 6.0, totalPopulation: 8500000000 },
      { id: 'vega', name: 'Vega', starType: 'A', age: 0.455, totalPopulation: 3200000000 },
      { id: 'sirius', name: 'Sirius', starType: 'A', age: 0.242, totalPopulation: 6700000000 },
      { id: 'kepler', name: 'Kepler-442', starType: 'K', age: 2.9, totalPopulation: 1800000000 },
      { id: 'andromeda', name: 'Andromeda Outpost', starType: 'M', age: 8.2, totalPopulation: 450000000 },
      { id: 'rigel', name: 'Rigel', starType: 'B', age: 0.01, totalPopulation: 2100000000 },
      { id: 'betelgeuse', name: 'Betelgeuse', starType: 'M', age: 0.01, totalPopulation: 890000000 }
    ];
    
    demoData.forEach(system => systems.set(system.id, system));
    return systems;
  }

  async getPlanets(): Promise<Map<string, any>> {
    if (this.civilizationGenerator && this.civilizationGenerator.planets) {
      // Extract planets from star systems
      const planets = new Map();
      const systems = this.civilizationGenerator.systems;
      
      for (const [systemId, system] of systems) {
        if (system.planets) {
          system.planets.forEach((planet: any) => {
            planets.set(planet.id, {
              ...planet,
              systemId,
              systemName: system.name
            });
          });
        }
      }
      
      return planets;
    }
    
    // Fallback to demo data
    const planets = new Map();
    const demoData = [
      { id: 'earth', name: 'Earth', systemId: 'sol', type: 'Terrestrial', population: 8000000000 },
      { id: 'mars', name: 'Mars', systemId: 'sol', type: 'Terrestrial', population: 2500000000 },
      { id: 'europa', name: 'Europa', systemId: 'sol', type: 'Ice Moon', population: 450000000 },
      { id: 'centauri_prime', name: 'Centauri Prime', systemId: 'alpha_centauri', type: 'Terrestrial', population: 6200000000 },
      { id: 'proxima_b', name: 'Proxima b', systemId: 'alpha_centauri', type: 'Terrestrial', population: 2300000000 },
      { id: 'vega_prime', name: 'Vega Prime', systemId: 'vega', type: 'Terrestrial', population: 3200000000 },
      { id: 'sirius_alpha', name: 'Sirius Alpha', systemId: 'sirius', type: 'Terrestrial', population: 4100000000 },
      { id: 'sirius_beta', name: 'Sirius Beta', systemId: 'sirius', type: 'Ocean World', population: 2600000000 },
      { id: 'kepler_442b', name: 'Kepler-442b', systemId: 'kepler', type: 'Super Earth', population: 1800000000 }
    ];
    
    demoData.forEach(planet => planets.set(planet.id, planet));
    return planets;
  }

  async getRaces(): Promise<Map<string, any>> {
    if (this.civilizationGenerator && this.civilizationGenerator.races) {
      return this.civilizationGenerator.races;
    }
    
    // Fallback to demo data
    const races = new Map();
    const demoData = [
      { id: 'human', name: 'Human', homeworld: 'Earth', traits: ['Adaptable', 'Diplomatic', 'Innovative'] },
      { id: 'centauri', name: 'Centauri', homeworld: 'Centauri Prime', traits: ['Military-minded', 'Hierarchical', 'Disciplined'] },
      { id: 'vegan', name: 'Vegan', homeworld: 'Vega Prime', traits: ['Scientific', 'Logical', 'Collaborative'] },
      { id: 'sirian', name: 'Sirian', homeworld: 'Sirius Alpha', traits: ['Commercial', 'Networked', 'Opportunistic'] },
      { id: 'keplerian', name: 'Keplerian', homeworld: 'Kepler-442b', traits: ['Technological', 'Perfectionist', 'Methodical'] }
    ];
    
    demoData.forEach(race => races.set(race.id, race));
    return races;
  }

  async getCurrentEvents(): Promise<string[]> {
    if (this.gameEngine && this.gameEngine.getCurrentEvents) {
      return await this.gameEngine.getCurrentEvents();
    }
    
    // Get real-time data from APIs to create dynamic events
    try {
      const [techResponse, campaignResponse, newsResponse] = await Promise.all([
        fetch('http://localhost:4000/api/technology/tree').catch(() => null),
        fetch('http://localhost:4000/api/campaigns').catch(() => null),
        fetch('http://localhost:4000/api/news/headlines').catch(() => null)
      ]);

      const events: string[] = [];

      // Add technology-based events
      if (techResponse?.ok) {
        const techData = await techResponse.json();
        const activeTech = techData.technologies?.filter((t: any) => t.progress > 0 && t.progress < 100);
        if (activeTech?.length > 0) {
          const tech = activeTech[Math.floor(Math.random() * activeTech.length)];
          events.push(`Research breakthrough: ${tech.name} project reaches ${tech.progress}% completion`);
        }
        
        const completedTech = techData.technologies?.filter((t: any) => t.progress === 100);
        if (completedTech?.length > 0) {
          const tech = completedTech[Math.floor(Math.random() * completedTech.length)];
          events.push(`Major achievement: ${tech.name} technology successfully deployed across the galaxy`);
        }
      }

      // Add campaign-based events
      if (campaignResponse?.ok) {
        const campaignData = await campaignResponse.json();
        if (campaignData.campaigns?.length > 0) {
          const campaign = campaignData.campaigns[0]; // Use first active campaign
          if (campaign.currentWeek && campaign.totalWeeks) {
            const progress = Math.round((campaign.currentWeek / campaign.totalWeeks) * 100);
            events.push(`Campaign "${campaign.name}" enters critical phase - ${progress}% complete`);
          }
        }
      }

      // Add news-based events
      if (newsResponse?.ok) {
        const newsData = await newsResponse.json();
        if (newsData.headlines?.length > 0) {
          const headline = newsData.headlines[Math.floor(Math.random() * newsData.headlines.length)];
          events.push(`Breaking: ${headline.title}`);
        }
      }

      // If we got some real events, supplement with a few dynamic ones
      if (events.length > 0) {
        const supplementalEvents = [
          'Diplomatic summit scheduled between major civilizations',
          'New trade routes opening in outer rim territories',
          'Scientific expedition discovers anomalous readings in deep space',
          'Cultural exchange programs expanding across star systems',
          'Military readiness exercises conducted in neutral zones'
        ];
        const shuffled = supplementalEvents.sort(() => 0.5 - Math.random());
        events.push(...shuffled.slice(0, 2));
        
        return events.slice(0, 5); // Return up to 5 events
      }
    } catch (error) {
      console.warn('Failed to fetch real-time events, using fallback:', error);
    }
    
    // Fallback to demo events if API calls fail
    const fallbackEvents = [
      'Galactic Trade Summit begins on Centauri Prime',
      'New hyperspace route discovered between Vega and Sirius systems',
      'Technological breakthrough in quantum computing announced by Kepler Technocracy',
      'Diplomatic tensions rise between Terran Federation and Sirian Empire',
      'Archaeological discovery on ancient ruins found in Rigel system',
      'Economic sanctions imposed on rogue mining operations in outer rim',
      'Cultural exchange program launched between Vegan Collective and Andromedan Alliance',
      'Military exercises conducted in neutral space near Betelgeuse',
      'Scientific expedition reports unusual energy readings from uncharted system',
      'Peace treaty negotiations scheduled between warring factions'
    ];
    
    // Return 3-5 random current events
    const shuffled = fallbackEvents.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
  }

  async getPoliticalClimate(): Promise<string> {
    if (this.gameEngine && this.gameEngine.getPoliticalClimate) {
      return await this.gameEngine.getPoliticalClimate();
    }
    
    // Try to get real-time political data from APIs
    try {
      const [securityResponse, intelligenceResponse, approvalResponse] = await Promise.all([
        fetch('http://localhost:4000/api/security/status').catch(() => null),
        fetch('http://localhost:4000/api/intelligence/reports').catch(() => null),
        fetch('http://localhost:4010/api/approval/rating').catch(() => null)
      ]);

      // Base climate on security status
      if (securityResponse?.ok) {
        const securityData = await securityResponse.json();
        const status = securityData.overallStatus?.toLowerCase();
        
        if (status === 'critical' || securityData.activeIncidents > 3) {
          return 'Crisis mode - multiple security threats requiring immediate attention';
        } else if (status === 'elevated' || securityData.activeIncidents > 1) {
          return 'Tense but manageable - heightened security concerns affecting diplomatic relations';
        } else if (status === 'green' || status === 'normal') {
          return 'Stable and cooperative - favorable conditions for diplomatic initiatives';
        }
      }

      // Factor in approval ratings if available
      if (approvalResponse?.ok) {
        const approvalData = await approvalResponse.json();
        const rating = approvalData.currentRating || approvalData.rating;
        
        if (rating > 75) {
          return 'Highly favorable - strong public support enabling bold diplomatic initiatives';
        } else if (rating < 40) {
          return 'Challenging - low approval ratings constraining political maneuvering';
        }
      }

      // Factor in intelligence reports
      if (intelligenceResponse?.ok) {
        const intelData = await intelligenceResponse.json();
        if (intelData.reports?.some((r: any) => r.classification === 'top-secret')) {
          return 'Cautious - classified intelligence affecting strategic decisions';
        }
      }
    } catch (error) {
      console.warn('Failed to fetch political climate data, using fallback:', error);
    }
    
    // Fallback to demo climate
    const climates = [
      'Tense but stable - major powers maintaining uneasy peace',
      'Optimistic - recent diplomatic breakthroughs showing promise',
      'Volatile - several border disputes escalating',
      'Cooperative - increased inter-civilization collaboration',
      'Uncertain - shifting alliances creating unpredictable dynamics',
      'Strained - economic pressures affecting diplomatic relations'
    ];
    
    return climates[Math.floor(Math.random() * climates.length)];
  }

  async getEconomicStatus(): Promise<string> {
    if (this.gameEngine && this.gameEngine.getEconomicStatus) {
      return await this.gameEngine.getEconomicStatus();
    }
    
    // Try to get real-time economic data from APIs
    try {
      const [tradeResponse, businessResponse, populationResponse] = await Promise.all([
        fetch('http://localhost:4000/api/trade/indices').catch(() => null),
        fetch('http://localhost:4000/api/businesses/list').catch(() => null),
        fetch('http://localhost:4000/api/population/stats').catch(() => null)
      ]);

      // Base status on trade indices
      if (tradeResponse?.ok) {
        const tradeData = await tradeResponse.json();
        const indices = tradeData.indices || [];
        
        if (indices.length > 0) {
          const avgChange = indices.reduce((sum: number, idx: any) => sum + (idx.change || 0), 0) / indices.length;
          
          if (avgChange > 5) {
            return `Booming - trade indices up ${avgChange.toFixed(1)}% with strong growth across all sectors`;
          } else if (avgChange > 2) {
            return `Growing - steady economic expansion with trade indices up ${avgChange.toFixed(1)}%`;
          } else if (avgChange > -2) {
            return 'Stable - balanced economic performance with minor fluctuations';
          } else if (avgChange > -5) {
            return `Declining - economic concerns as trade indices drop ${Math.abs(avgChange).toFixed(1)}%`;
          } else {
            return `Crisis - severe economic downturn with indices down ${Math.abs(avgChange).toFixed(1)}%`;
          }
        }
      }

      // Factor in business activity
      if (businessResponse?.ok) {
        const businessData = await businessResponse.json();
        const businesses = businessData.businesses || [];
        const activeBusinesses = businesses.filter((b: any) => b.status === 'active').length;
        
        if (activeBusinesses > businesses.length * 0.8) {
          return 'Thriving - high business activity with most enterprises operating at full capacity';
        } else if (activeBusinesses < businesses.length * 0.5) {
          return 'Struggling - many businesses facing operational challenges';
        }
      }

      // Factor in population economic indicators
      if (populationResponse?.ok) {
        const popData = await populationResponse.json();
        if (popData.employmentRate > 85) {
          return `Strong - high employment rate of ${popData.employmentRate}% driving economic growth`;
        } else if (popData.employmentRate < 70) {
          return `Concerning - employment rate of ${popData.employmentRate}% indicating economic stress`;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch economic status data, using fallback:', error);
    }
    
    // Fallback to demo status
    const statuses = [
      'Growing - galactic trade volume up 12% this quarter',
      'Stable - steady growth across most sectors',
      'Recovering - bouncing back from recent market volatility',
      'Booming - unprecedented expansion in technology and mining sectors',
      'Challenging - resource shortages affecting supply chains',
      'Mixed - strong performance in some regions, struggles in others'
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  // Method to update the provider with actual game instances
  updateGameInstances(campaignId: number, civilizationGenerator?: any, gameEngine?: any) {
    this.campaignId = campaignId;
    this.civilizationGenerator = civilizationGenerator;
    this.gameEngine = gameEngine;
  }
}

export default DefaultGameStateProvider;
