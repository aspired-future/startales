/**
 * Logo Visual Integration - Hooks image generation into civilization and organization logo creation
 */

import { EntityVisualGenerator, EntityImageResult } from './EntityVisualGenerator.js';

export interface LogoData {
  id: string;
  name: string;
  type: 'civilization' | 'organization' | 'corporation' | 'military' | 'government' | 'alliance' | 'faction';
  values?: string[];
  colors?: string[];
  symbols?: string[];
  style?: 'modern' | 'traditional' | 'futuristic' | 'military' | 'corporate' | 'mystical' | 'technological';
  description?: string;
  culturalInfluences?: string[];
  primaryFunction?: string;
  targetAudience?: string;
  brandPersonality?: string[];
}

export interface CivilizationData {
  id: string;
  name: string;
  type?: string;
  race?: string;
  values?: string[];
  government?: string;
  culture?: any;
  technology?: any;
  homeworld?: string;
  philosophy?: string;
}

export class LogoVisualIntegration {
  private visualGenerator: EntityVisualGenerator;
  private autoGenerateLogos: boolean = true;
  private generatedLogos: Set<string> = new Set();

  constructor(visualGenerator?: EntityVisualGenerator) {
    this.visualGenerator = visualGenerator || new EntityVisualGenerator();
  }

  /**
   * Hook into civilization creation to automatically generate logos
   */
  async onCivilizationCreated(civilizationData: CivilizationData): Promise<EntityImageResult | null> {
    if (!this.autoGenerateLogos || this.generatedLogos.has(civilizationData.id)) {
      return null;
    }

    try {
      console.log(`🏛️ Generating logo for civilization: ${civilizationData.name}`);
      
      const logoData = this.convertCivilizationToLogoData(civilizationData);
      const result = await this.visualGenerator.generateLogoImage(logoData);
      
      this.generatedLogos.add(civilizationData.id);
      console.log(`✅ Generated logo for civilization ${civilizationData.name}: ${result.imageUrl}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate logo for civilization ${civilizationData.name}:`, error);
      return null;
    }
  }

  /**
   * Generate logo for any organization or entity
   */
  async generateEntityLogo(logoData: LogoData): Promise<EntityImageResult | null> {
    if (this.generatedLogos.has(logoData.id)) {
      return this.visualGenerator.getEntityImage(logoData.id) || null;
    }

    try {
      console.log(`🎨 Generating logo for ${logoData.type}: ${logoData.name}`);
      
      const result = await this.visualGenerator.generateLogoImage(logoData);
      
      this.generatedLogos.add(logoData.id);
      console.log(`✅ Generated logo for ${logoData.type} ${logoData.name}: ${result.imageUrl}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate logo for ${logoData.type} ${logoData.name}:`, error);
      return null;
    }
  }

  /**
   * Queue logo generation for batch processing
   */
  queueLogoGeneration(logoData: LogoData, priority: 'low' | 'medium' | 'high' = 'low'): void {
    if (this.generatedLogos.has(logoData.id)) {
      return;
    }

    this.visualGenerator.queueImageGeneration({
      entityType: 'logo',
      entityId: logoData.id,
      entityData: logoData,
      priority
    });

    this.generatedLogos.add(logoData.id);
  }

  /**
   * Generate logo variations (different styles, colors, layouts)
   */
  async generateLogoVariations(
    logoData: LogoData,
    variations: string[] = ['primary', 'monochrome', 'simplified', 'emblem']
  ): Promise<EntityImageResult[]> {
    const results: EntityImageResult[] = [];

    for (const variation of variations) {
      try {
        const variationData = {
          ...logoData,
          id: `${logoData.id}_${variation}`,
          name: `${logoData.name} (${variation})`,
          style: this.mapVariationToStyle(variation, logoData.style),
          variation
        };

        const result = await this.visualGenerator.generateLogoImage(variationData);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${variation} variation for ${logoData.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Generate faction/alliance logos
   */
  async generateAllianceLogo(allianceData: {
    id: string;
    name: string;
    memberCivilizations: string[];
    purpose: string;
    values: string[];
  }): Promise<EntityImageResult | null> {
    const logoData: LogoData = {
      id: allianceData.id,
      name: allianceData.name,
      type: 'alliance',
      values: allianceData.values,
      style: 'modern',
      description: `Alliance logo representing unity between ${allianceData.memberCivilizations.length} civilizations`,
      primaryFunction: allianceData.purpose,
      symbols: ['unity', 'cooperation', 'strength', 'peace'],
      colors: ['blue', 'gold', 'white'],
      brandPersonality: ['trustworthy', 'diplomatic', 'powerful', 'inclusive']
    };

    return this.generateEntityLogo(logoData);
  }

  /**
   * Generate military organization logos
   */
  async generateMilitaryLogo(militaryData: {
    id: string;
    name: string;
    branch: string;
    civilization: string;
    specialization: string;
  }): Promise<EntityImageResult | null> {
    const logoData: LogoData = {
      id: militaryData.id,
      name: militaryData.name,
      type: 'military',
      style: 'military',
      description: `Military ${militaryData.branch} logo for ${militaryData.civilization}`,
      primaryFunction: militaryData.specialization,
      symbols: ['shield', 'sword', 'eagle', 'star', 'wings'],
      colors: ['red', 'black', 'gold', 'silver'],
      brandPersonality: ['strong', 'disciplined', 'honorable', 'protective'],
      values: ['duty', 'honor', 'courage', 'loyalty']
    };

    return this.generateEntityLogo(logoData);
  }

  /**
   * Generate corporate logos
   */
  async generateCorporateLogo(corporateData: {
    id: string;
    name: string;
    industry: string;
    values: string[];
    targetMarket: string;
  }): Promise<EntityImageResult | null> {
    const logoData: LogoData = {
      id: corporateData.id,
      name: corporateData.name,
      type: 'corporation',
      style: 'corporate',
      values: corporateData.values,
      description: `Corporate logo for ${corporateData.industry} company`,
      primaryFunction: corporateData.industry,
      targetAudience: corporateData.targetMarket,
      symbols: this.getIndustrySymbols(corporateData.industry),
      colors: this.getIndustryColors(corporateData.industry),
      brandPersonality: ['professional', 'innovative', 'reliable', 'forward-thinking']
    };

    return this.generateEntityLogo(logoData);
  }

  /**
   * Get generated logo for an entity
   */
  getEntityLogo(entityId: string): EntityImageResult | undefined {
    return this.visualGenerator.getEntityImage(entityId);
  }

  /**
   * Check if entity has generated logo
   */
  hasEntityLogo(entityId: string): boolean {
    return this.visualGenerator.hasEntityImage(entityId);
  }

  /**
   * Enable/disable automatic logo generation
   */
  setAutoGenerate(enabled: boolean): void {
    this.autoGenerateLogos = enabled;
  }

  /**
   * Batch generate logos for multiple entities
   */
  async batchGenerateLogos(logoDataArray: LogoData[], maxConcurrent: number = 3): Promise<EntityImageResult[]> {
    const results: EntityImageResult[] = [];
    const batches = this.chunkArray(logoDataArray, maxConcurrent);

    for (const batch of batches) {
      const batchPromises = batch.map(logoData => this.generateEntityLogo(logoData));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        } else {
          console.warn(`Failed to generate logo for ${batch[index].id}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
        }
      });

      // Delay between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    return results;
  }

  /**
   * Convert civilization data to logo data
   */
  private convertCivilizationToLogoData(civilizationData: CivilizationData): LogoData {
    return {
      id: civilizationData.id,
      name: civilizationData.name,
      type: 'civilization',
      style: this.inferStyleFromCivilization(civilizationData),
      values: civilizationData.values || this.inferValuesFromCulture(civilizationData.culture),
      colors: this.inferColorsFromRace(civilizationData.race),
      symbols: this.inferSymbolsFromCivilization(civilizationData),
      description: `Civilization logo for the ${civilizationData.name}`,
      culturalInfluences: [civilizationData.race || 'unknown'],
      primaryFunction: 'governance',
      brandPersonality: this.inferPersonalityFromGovernment(civilizationData.government)
    };
  }

  /**
   * Infer logo style from civilization characteristics
   */
  private inferStyleFromCivilization(civilizationData: CivilizationData): LogoData['style'] {
    if (civilizationData.technology?.overall > 8) return 'futuristic';
    if (civilizationData.government?.includes('military')) return 'military';
    if (civilizationData.culture?.values?.includes('tradition')) return 'traditional';
    if (civilizationData.type?.includes('corporate')) return 'corporate';
    return 'modern';
  }

  /**
   * Infer values from culture
   */
  private inferValuesFromCulture(culture: any): string[] {
    if (!culture) return ['unity', 'progress', 'strength'];
    return culture.values || culture.traits || ['unity', 'progress', 'strength'];
  }

  /**
   * Infer colors from race/species
   */
  private inferColorsFromRace(race?: string): string[] {
    const raceColorMap: { [key: string]: string[] } = {
      human: ['blue', 'white', 'gold'],
      zephyrian: ['purple', 'silver', 'blue'],
      mechanoid: ['grey', 'red', 'black'],
      crystalline: ['crystal', 'white', 'rainbow'],
      void_walker: ['black', 'purple', 'silver'],
      bio_shaper: ['green', 'brown', 'gold'],
      quantum: ['blue', 'white', 'silver'],
      ancient: ['gold', 'bronze', 'red']
    };

    return raceColorMap[race?.toLowerCase() || 'human'] || ['blue', 'white', 'gold'];
  }

  /**
   * Infer symbols from civilization characteristics
   */
  private inferSymbolsFromCivilization(civilizationData: CivilizationData): string[] {
    const symbols: string[] = [];
    
    if (civilizationData.homeworld) symbols.push('planet', 'star');
    if (civilizationData.government?.includes('democracy')) symbols.push('scales', 'circle');
    if (civilizationData.government?.includes('empire')) symbols.push('crown', 'eagle');
    if (civilizationData.technology?.overall > 7) symbols.push('gear', 'circuit');
    if (civilizationData.culture?.values?.includes('peace')) symbols.push('dove', 'olive branch');
    if (civilizationData.culture?.values?.includes('war')) symbols.push('sword', 'shield');
    
    return symbols.length > 0 ? symbols : ['star', 'circle', 'shield'];
  }

  /**
   * Infer brand personality from government type
   */
  private inferPersonalityFromGovernment(government?: string): string[] {
    const governmentPersonalities: { [key: string]: string[] } = {
      democracy: ['inclusive', 'transparent', 'fair', 'progressive'],
      empire: ['powerful', 'traditional', 'hierarchical', 'grand'],
      republic: ['balanced', 'representative', 'stable', 'diplomatic'],
      federation: ['cooperative', 'diverse', 'unified', 'flexible'],
      corporate: ['efficient', 'innovative', 'competitive', 'profitable'],
      military: ['disciplined', 'strong', 'protective', 'honorable']
    };

    return governmentPersonalities[government?.toLowerCase() || 'democracy'] || ['balanced', 'progressive', 'strong'];
  }

  /**
   * Map variation to style
   */
  private mapVariationToStyle(variation: string, originalStyle?: string): string {
    const variationStyleMap: { [key: string]: string } = {
      primary: originalStyle || 'modern',
      monochrome: 'modern',
      simplified: 'modern',
      emblem: 'traditional'
    };

    return variationStyleMap[variation] || originalStyle || 'modern';
  }

  /**
   * Get industry-specific symbols
   */
  private getIndustrySymbols(industry: string): string[] {
    const industrySymbols: { [key: string]: string[] } = {
      technology: ['circuit', 'gear', 'lightning', 'network'],
      mining: ['pickaxe', 'mountain', 'crystal', 'drill'],
      transportation: ['rocket', 'wheel', 'wings', 'arrow'],
      energy: ['lightning', 'atom', 'sun', 'battery'],
      manufacturing: ['gear', 'factory', 'hammer', 'assembly'],
      research: ['atom', 'dna', 'telescope', 'lab'],
      defense: ['shield', 'armor', 'fortress', 'guardian'],
      trade: ['scales', 'handshake', 'globe', 'exchange']
    };

    return industrySymbols[industry.toLowerCase()] || ['gear', 'star', 'circle'];
  }

  /**
   * Get industry-specific colors
   */
  private getIndustryColors(industry: string): string[] {
    const industryColors: { [key: string]: string[] } = {
      technology: ['blue', 'silver', 'white'],
      mining: ['brown', 'gold', 'grey'],
      transportation: ['red', 'blue', 'white'],
      energy: ['yellow', 'orange', 'blue'],
      manufacturing: ['grey', 'blue', 'red'],
      research: ['white', 'blue', 'green'],
      defense: ['black', 'red', 'gold'],
      trade: ['green', 'gold', 'blue']
    };

    return industryColors[industry.toLowerCase()] || ['blue', 'grey', 'white'];
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Clear generated logos cache
   */
  clearGeneratedCache(): void {
    this.generatedLogos.clear();
  }

  /**
   * Get generation statistics
   */
  getGenerationStats(): { totalGenerated: number; cacheSize: number } {
    return {
      totalGenerated: this.generatedLogos.size,
      cacheSize: this.generatedLogos.size
    };
  }
}

// Global instance for easy access
let globalLogoVisualIntegration: LogoVisualIntegration | null = null;

export function getLogoVisualIntegration(): LogoVisualIntegration {
  if (!globalLogoVisualIntegration) {
    globalLogoVisualIntegration = new LogoVisualIntegration();
  }
  return globalLogoVisualIntegration;
}

export function initializeLogoVisualIntegration(visualGenerator?: EntityVisualGenerator): LogoVisualIntegration {
  globalLogoVisualIntegration = new LogoVisualIntegration(visualGenerator);
  return globalLogoVisualIntegration;
}
