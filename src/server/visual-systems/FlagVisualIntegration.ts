/**
 * Flag Visual Integration - AI flag generation for player-designed civilizations
 */

import { EntityVisualGenerator, EntityImageResult } from './EntityVisualGenerator';

export interface PlayerCivilizationData {
  id: string;
  name: string;
  playerId: string;
  playerName?: string;
  species?: string;
  governmentType?: string;
  values?: string[];
  colors?: string[];
  symbols?: string[];
  homeworld?: string;
  culturalTraits?: string[];
  philosophy?: string;
  flagStyle?: 'traditional' | 'modern' | 'futuristic' | 'minimalist' | 'heraldic' | 'geometric';
  flagLayout?: 'horizontal_stripes' | 'vertical_stripes' | 'canton' | 'cross' | 'diagonal' | 'centered_emblem' | 'quartered';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  emblemType?: 'star' | 'eagle' | 'lion' | 'tree' | 'mountain' | 'sun' | 'moon' | 'crown' | 'sword' | 'shield' | 'custom';
  customEmblem?: string;
}

export interface FlagGenerationOptions {
  includePlayerName?: boolean;
  includeEstablishmentDate?: boolean;
  addMottoRibbon?: boolean;
  generateVariants?: boolean;
  style?: 'ceremonial' | 'battle' | 'diplomatic' | 'naval';
  aspectRatio?: '1:1' | '2:3' | '3:5' | '1:2';
}

export class FlagVisualIntegration {
  private visualGenerator: EntityVisualGenerator;
  private autoGenerateFlags: boolean = true;
  private generatedFlags: Set<string> = new Set();

  constructor(visualGenerator?: EntityVisualGenerator) {
    this.visualGenerator = visualGenerator || new EntityVisualGenerator();
  }

  /**
   * Generate flag for player civilization
   */
  async generatePlayerCivilizationFlag(
    civilizationData: PlayerCivilizationData,
    options: FlagGenerationOptions = {}
  ): Promise<EntityImageResult | null> {
    if (this.generatedFlags.has(civilizationData.id)) {
      return this.visualGenerator.getEntityImage(civilizationData.id) || null;
    }

    try {
      console.log(`🏴 Generating flag for player civilization: ${civilizationData.name}`);
      
      const flagPrompt = this.buildPlayerFlagPrompt(civilizationData, options);
      
      const generationPrompt = {
        text: flagPrompt,
        style: {
          artistic: 'HERALDIC',
          technical: {
            renderingEngine: 'VECTOR',
            quality: 'HIGH',
            optimization: 'STANDARD',
            format: 'PNG'
          },
          composition: {
            layout: 'CENTERED',
            framing: 'FULL',
            perspective: 'FRONT',
            focus: 'SHARP',
            balance: 'SYMMETRICAL'
          }
        },
        mood: {
          emotional: 'PROUD',
          atmospheric: 'CLEAR',
          energy: 'MODERATE',
          tension: 'NONE'
        },
        details: [
          'high contrast colors',
          'clean vector design',
          'flag proportions',
          'heraldic style',
          'symbolic elements'
        ],
        negativePrompts: [
          'blurry',
          'low resolution',
          'photographic',
          'realistic fabric texture',
          'wrinkled',
          'shadowed'
        ]
      };

      const response = await this.visualGenerator.visualEngine.createAsset(
        'IMAGE',
        'LOGO',
        generationPrompt,
        { priority: 'high' }
      );

      const result: EntityImageResult = {
        entityId: civilizationData.id,
        entityType: 'flag',
        imageUrl: response.asset?.url || '',
        metadata: {
          generatedAt: new Date(),
          prompt: flagPrompt,
          style: civilizationData.flagStyle || 'traditional',
          dimensions: this.getFlagDimensions(options.aspectRatio),
          tags: this.generateFlagTags(civilizationData)
        }
      };

      this.generatedFlags.add(civilizationData.id);
      
      // Store in database if storage service is available
      await this.storeFlag(result);
      
      console.log(`✅ Generated flag for ${civilizationData.name}: ${result.imageUrl}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate flag for ${civilizationData.name}:`, error);
      return null;
    }
  }

  /**
   * Generate multiple flag variants for a civilization
   */
  async generateFlagVariants(
    civilizationData: PlayerCivilizationData,
    variants: string[] = ['ceremonial', 'battle', 'diplomatic', 'naval']
  ): Promise<EntityImageResult[]> {
    const results: EntityImageResult[] = [];

    for (const variant of variants) {
      try {
        const variantData = {
          ...civilizationData,
          id: `${civilizationData.id}_${variant}`,
          name: `${civilizationData.name} (${variant} flag)`
        };

        const options: FlagGenerationOptions = {
          style: variant as any,
          aspectRatio: variant === 'naval' ? '1:2' : '2:3'
        };

        const result = await this.generatePlayerCivilizationFlag(variantData, options);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${variant} flag variant for ${civilizationData.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Generate flag based on player preferences and choices
   */
  async generateCustomPlayerFlag(
    playerId: string,
    flagDesign: {
      civilizationName: string;
      colors: string[];
      symbols: string[];
      layout: string;
      style: string;
      motto?: string;
      values: string[];
    }
  ): Promise<EntityImageResult | null> {
    const civilizationData: PlayerCivilizationData = {
      id: `player_civ_${playerId}`,
      name: flagDesign.civilizationName,
      playerId,
      colors: flagDesign.colors,
      symbols: flagDesign.symbols,
      flagLayout: flagDesign.layout as any,
      flagStyle: flagDesign.style as any,
      values: flagDesign.values
    };

    const options: FlagGenerationOptions = {
      includePlayerName: false,
      addMottoRibbon: !!flagDesign.motto,
      aspectRatio: '2:3'
    };

    return this.generatePlayerCivilizationFlag(civilizationData, options);
  }

  /**
   * Generate flag for alliance of player civilizations
   */
  async generateAllianceFlag(
    allianceData: {
      id: string;
      name: string;
      memberCivilizations: PlayerCivilizationData[];
      foundingDate?: Date;
      charter?: string;
    }
  ): Promise<EntityImageResult | null> {
    try {
      console.log(`🤝 Generating alliance flag for: ${allianceData.name}`);
      
      // Combine colors and symbols from member civilizations
      const combinedColors = [...new Set(
        allianceData.memberCivilizations.flatMap(civ => civ.colors || [])
      )].slice(0, 4);
      
      const combinedSymbols = [...new Set(
        allianceData.memberCivilizations.flatMap(civ => civ.symbols || [])
      )].slice(0, 3);

      const combinedValues = [...new Set(
        allianceData.memberCivilizations.flatMap(civ => civ.values || [])
      )].slice(0, 5);

      const allianceCivData: PlayerCivilizationData = {
        id: allianceData.id,
        name: allianceData.name,
        playerId: 'alliance',
        colors: combinedColors,
        symbols: [...combinedSymbols, 'unity', 'cooperation', 'alliance'],
        values: [...combinedValues, 'unity', 'cooperation'],
        flagStyle: 'modern',
        flagLayout: 'centered_emblem'
      };

      const options: FlagGenerationOptions = {
        includeEstablishmentDate: !!allianceData.foundingDate,
        aspectRatio: '2:3'
      };

      return this.generatePlayerCivilizationFlag(allianceCivData, options);
      
    } catch (error) {
      console.error(`❌ Failed to generate alliance flag for ${allianceData.name}:`, error);
      return null;
    }
  }

  /**
   * Build detailed prompt for player flag generation
   */
  private buildPlayerFlagPrompt(
    civilizationData: PlayerCivilizationData,
    options: FlagGenerationOptions
  ): string {
    let prompt = `Design a ${civilizationData.flagStyle || 'traditional'} flag for the ${civilizationData.name}, `;
    
    // Add government context
    if (civilizationData.governmentType) {
      prompt += `a ${civilizationData.governmentType.toLowerCase()}, `;
    }

    // Add species context
    if (civilizationData.species) {
      prompt += `representing the ${civilizationData.species} species, `;
    }

    // Add layout specification
    if (civilizationData.flagLayout) {
      const layoutDescriptions = {
        horizontal_stripes: 'horizontal stripes design',
        vertical_stripes: 'vertical stripes design',
        canton: 'canton in upper left corner',
        cross: 'cross pattern',
        diagonal: 'diagonal division',
        centered_emblem: 'centered emblem design',
        quartered: 'quartered field design'
      };
      prompt += `using ${layoutDescriptions[civilizationData.flagLayout]}, `;
    }

    // Add color scheme
    if (civilizationData.colors && civilizationData.colors.length > 0) {
      prompt += `primary colors: ${civilizationData.colors.slice(0, 3).join(', ')}, `;
    } else if (civilizationData.primaryColor) {
      const colors = [civilizationData.primaryColor];
      if (civilizationData.secondaryColor) colors.push(civilizationData.secondaryColor);
      if (civilizationData.accentColor) colors.push(civilizationData.accentColor);
      prompt += `colors: ${colors.join(', ')}, `;
    }

    // Add symbols and emblems
    if (civilizationData.symbols && civilizationData.symbols.length > 0) {
      prompt += `featuring symbols: ${civilizationData.symbols.slice(0, 3).join(', ')}, `;
    }

    if (civilizationData.emblemType && civilizationData.emblemType !== 'custom') {
      prompt += `with a ${civilizationData.emblemType} emblem, `;
    } else if (civilizationData.customEmblem) {
      prompt += `with a ${civilizationData.customEmblem} emblem, `;
    }

    // Add values and philosophy
    if (civilizationData.values && civilizationData.values.length > 0) {
      prompt += `representing values of ${civilizationData.values.slice(0, 3).join(', ')}, `;
    }

    if (civilizationData.philosophy) {
      prompt += `embodying ${civilizationData.philosophy} philosophy, `;
    }

    // Add style-specific elements
    const styleElements = {
      traditional: 'classic heraldic design with traditional symbolism',
      modern: 'clean modern design with bold geometric elements',
      futuristic: 'sleek futuristic design with technological elements',
      minimalist: 'simple minimalist design with essential elements only',
      heraldic: 'formal heraldic design with coat of arms elements',
      geometric: 'geometric patterns and abstract symbolic elements'
    };

    prompt += styleElements[civilizationData.flagStyle || 'traditional'] + ', ';

    // Add options-based elements
    if (options.includePlayerName && civilizationData.playerName) {
      prompt += `subtle reference to founder ${civilizationData.playerName}, `;
    }

    if (options.addMottoRibbon) {
      prompt += 'decorative ribbon banner for motto, ';
    }

    if (options.includeEstablishmentDate) {
      prompt += 'establishment date elements, ';
    }

    // Add aspect ratio and technical requirements
    const aspectRatio = options.aspectRatio || '2:3';
    prompt += `${aspectRatio} aspect ratio, `;

    // Add style-specific technical requirements
    prompt += 'high contrast vector design, clean lines, ';
    prompt += 'suitable for reproduction at any size, ';
    prompt += 'distinctive and memorable, ';
    prompt += 'appropriate for official government use, ';
    prompt += 'professional flag design standards';

    return prompt;
  }

  /**
   * Generate tags for flag metadata
   */
  private generateFlagTags(civilizationData: PlayerCivilizationData): string[] {
    const tags = ['flag', 'civilization', 'player'];
    
    if (civilizationData.species) tags.push(civilizationData.species);
    if (civilizationData.governmentType) tags.push(civilizationData.governmentType);
    if (civilizationData.flagStyle) tags.push(civilizationData.flagStyle);
    if (civilizationData.flagLayout) tags.push(civilizationData.flagLayout);
    if (civilizationData.values) tags.push(...civilizationData.values.slice(0, 3));
    if (civilizationData.colors) tags.push(...civilizationData.colors.slice(0, 3));
    
    return tags;
  }

  /**
   * Get flag dimensions based on aspect ratio
   */
  private getFlagDimensions(aspectRatio?: string): { width: number; height: number } {
    const ratios = {
      '1:1': { width: 512, height: 512 },
      '2:3': { width: 512, height: 768 },
      '3:5': { width: 512, height: 853 },
      '1:2': { width: 512, height: 1024 }
    };
    
    return ratios[aspectRatio as keyof typeof ratios] || ratios['2:3'];
  }

  /**
   * Store flag in database
   */
  private async storeFlag(result: EntityImageResult): Promise<void> {
    try {
      // Try to get storage service and store the flag
      const { getImageStorageService } = await import('./ImageStorageService.js');
      const storageService = getImageStorageService();
      await storageService.storeImage(result);
    } catch (error) {
      console.warn('Flag storage service not available, skipping database storage');
    }
  }

  /**
   * Get generated flag for a civilization
   */
  getFlagImage(civilizationId: string): EntityImageResult | undefined {
    return this.visualGenerator.getEntityImage(civilizationId);
  }

  /**
   * Check if civilization has generated flag
   */
  hasFlagImage(civilizationId: string): boolean {
    return this.generatedFlags.has(civilizationId);
  }

  /**
   * Enable/disable automatic flag generation
   */
  setAutoGenerate(enabled: boolean): void {
    this.autoGenerateFlags = enabled;
  }

  /**
   * Generate flag preview for player customization
   */
  async generateFlagPreview(
    previewData: {
      colors: string[];
      symbols: string[];
      layout: string;
      style: string;
    }
  ): Promise<EntityImageResult | null> {
    const previewCiv: PlayerCivilizationData = {
      id: `preview_${Date.now()}`,
      name: 'Preview Civilization',
      playerId: 'preview',
      colors: previewData.colors,
      symbols: previewData.symbols,
      flagLayout: previewData.layout as any,
      flagStyle: previewData.style as any
    };

    return this.generatePlayerCivilizationFlag(previewCiv, { aspectRatio: '2:3' });
  }

  /**
   * Clear generated flags cache
   */
  clearGeneratedCache(): void {
    this.generatedFlags.clear();
  }

  /**
   * Get generation statistics
   */
  getGenerationStats(): { totalGenerated: number; cacheSize: number } {
    return {
      totalGenerated: this.generatedFlags.size,
      cacheSize: this.generatedFlags.size
    };
  }
}

// Global instance for easy access
let globalFlagVisualIntegration: FlagVisualIntegration | null = null;

export function getFlagVisualIntegration(): FlagVisualIntegration {
  if (!globalFlagVisualIntegration) {
    globalFlagVisualIntegration = new FlagVisualIntegration();
  }
  return globalFlagVisualIntegration;
}

export function initializeFlagVisualIntegration(visualGenerator?: EntityVisualGenerator): FlagVisualIntegration {
  globalFlagVisualIntegration = new FlagVisualIntegration(visualGenerator);
  return globalFlagVisualIntegration;
}
