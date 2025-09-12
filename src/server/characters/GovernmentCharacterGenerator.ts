/**
 * Government Character Generator
 * 
 * Dynamically generates government officials, cabinet members, and other political
 * characters based on the current game state, civilization, and political system.
 */

import { Pool } from 'pg';
import { ProceduralCharacterGenerator, CharacterGenerationContext } from './ProceduralCharacterGenerator';
import { DynamicCharacter, CharacterTemplate } from './DynamicCharacterEngine';

export interface GovernmentStructure {
  government_type: 'democracy' | 'republic' | 'monarchy' | 'federation' | 'empire' | 'confederation';
  leadership_style: 'presidential' | 'parliamentary' | 'council' | 'autocratic' | 'technocratic';
  cabinet_size: number;
  term_length: number; // in years
  election_cycle: 'regular' | 'irregular' | 'none';
  power_distribution: 'centralized' | 'distributed' | 'federal';
}

export interface PoliticalContext {
  current_crisis: string[];
  approval_rating: number; // 0-100
  economic_situation: 'excellent' | 'good' | 'fair' | 'poor' | 'crisis';
  external_threats: string[];
  internal_challenges: string[];
  recent_elections: boolean;
  coalition_government: boolean;
}

export interface GovernmentPosition {
  id: string;
  title: string;
  department: string;
  level: 'cabinet' | 'deputy' | 'undersecretary' | 'advisor' | 'staff';
  responsibilities: string[];
  required_skills: string[];
  appointment_method: 'elected' | 'appointed' | 'career' | 'political';
  term_length?: number;
  reports_to?: string;
}

export class GovernmentCharacterGenerator {
  private pool: Pool;
  private characterGenerator: ProceduralCharacterGenerator;
  private governmentPositions: Map<string, GovernmentPosition> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.characterGenerator = new ProceduralCharacterGenerator(pool);
    this.initializeGovernmentPositions();
  }

  /**
   * Generate a complete government based on civilization and game state
   */
  async generateGovernment(
    civilizationId: number,
    planetId: number,
    governmentStructure: GovernmentStructure,
    politicalContext: PoliticalContext,
    gameContext: CharacterGenerationContext
  ): Promise<DynamicCharacter[]> {
    console.log(`🏛️ Generating government for civilization ${civilizationId}`);

    const characters: DynamicCharacter[] = [];
    
    // Generate positions based on government structure
    const positions = this.selectPositionsForGovernment(governmentStructure);
    
    // Generate characters for each position
    for (const position of positions) {
      const template = this.createTemplateForPosition(position, governmentStructure, politicalContext);
      const character = await this.characterGenerator.generateCompleteCharacter(
        template,
        gameContext,
        `gov_${civilizationId}_${position.id}`
      );
      
      // Add government-specific data
      character.profession.job_title = position.title;
      character.profession.employer = this.getGovernmentDepartmentName(position.department, civilizationId);
      character.category = 'official';
      character.subcategory = position.department;
      
      // Add political context
      character.opinions.political_views = this.generatePoliticalViews(position, politicalContext, governmentStructure);
      character.game_integration.story_importance = position.level === 'cabinet' ? 'critical' : 'major';
      character.game_integration.plot_hooks = this.generateGovernmentPlotHooks(position, politicalContext);
      
      // Add voice profile for TTS
      character.metadata.tags.push('government', position.level, position.department);
      (character as any).voiceProfile = this.generateVoiceProfile(character, position);
      
      characters.push(character);
    }

    // Generate relationships between government officials
    await this.generateGovernmentRelationships(characters, politicalContext);

    console.log(`✅ Generated ${characters.length} government officials`);
    return characters;
  }

  /**
   * Generate additional characters (business leaders, diplomats, etc.)
   */
  async generateAdditionalCharacters(
    civilizationId: number,
    planetId: number,
    gameContext: CharacterGenerationContext,
    characterTypes: string[]
  ): Promise<DynamicCharacter[]> {
    console.log(`👥 Generating additional characters: ${characterTypes.join(', ')}`);

    const characters: DynamicCharacter[] = [];

    for (const characterType of characterTypes) {
      const typeCharacters = await this.generateCharactersByType(
        characterType,
        civilizationId,
        planetId,
        gameContext
      );
      characters.push(...typeCharacters);
    }

    console.log(`✅ Generated ${characters.length} additional characters`);
    return characters;
  }

  /**
   * Generate characters by specific type
   */
  private async generateCharactersByType(
    characterType: string,
    civilizationId: number,
    planetId: number,
    gameContext: CharacterGenerationContext
  ): Promise<DynamicCharacter[]> {
    const templates = this.getTemplatesForCharacterType(characterType);
    const characters: DynamicCharacter[] = [];

    for (const template of templates) {
      const character = await this.characterGenerator.generateCompleteCharacter(
        template,
        gameContext,
        `${characterType}_${civilizationId}_${template.id}`
      );

      // Add type-specific customizations
      character.metadata.tags.push(characterType);
      (character as any).voiceProfile = this.generateVoiceProfile(character, null);
      
      characters.push(character);
    }

    return characters;
  }

  /**
   * Initialize government positions based on common governmental structures
   */
  private initializeGovernmentPositions(): void {
    const positions: GovernmentPosition[] = [
      // Executive Branch
      {
        id: 'president',
        title: 'President',
        department: 'Executive Office',
        level: 'cabinet',
        responsibilities: ['Chief Executive', 'Commander in Chief', 'Foreign Policy Leader'],
        required_skills: ['leadership', 'diplomacy', 'public_speaking', 'crisis_management'],
        appointment_method: 'elected',
        term_length: 4
      },
      {
        id: 'vice_president',
        title: 'Vice President',
        department: 'Executive Office',
        level: 'cabinet',
        responsibilities: ['Presidential Successor', 'Senate President', 'Advisory Role'],
        required_skills: ['leadership', 'diplomacy', 'public_speaking'],
        appointment_method: 'elected',
        term_length: 4
      },
      {
        id: 'chief_of_staff',
        title: 'Chief of Staff',
        department: 'Executive Office',
        level: 'cabinet',
        responsibilities: ['Executive Operations', 'Staff Management', 'Presidential Advisor'],
        required_skills: ['administration', 'management', 'political_strategy'],
        appointment_method: 'appointed'
      },

      // Cabinet Departments
      {
        id: 'secretary_state',
        title: 'Secretary of State',
        department: 'Foreign Affairs',
        level: 'cabinet',
        responsibilities: ['Foreign Policy', 'Diplomatic Relations', 'International Treaties'],
        required_skills: ['diplomacy', 'international_relations', 'negotiation'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_defense',
        title: 'Secretary of Defense',
        department: 'Defense',
        level: 'cabinet',
        responsibilities: ['Military Policy', 'National Security', 'Defense Strategy'],
        required_skills: ['military_strategy', 'leadership', 'security_analysis'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_treasury',
        title: 'Secretary of Treasury',
        department: 'Treasury',
        level: 'cabinet',
        responsibilities: ['Economic Policy', 'Fiscal Management', 'Financial Regulation'],
        required_skills: ['economics', 'finance', 'policy_analysis'],
        appointment_method: 'appointed'
      },
      {
        id: 'attorney_general',
        title: 'Attorney General',
        department: 'Justice',
        level: 'cabinet',
        responsibilities: ['Law Enforcement', 'Legal Policy', 'Civil Rights'],
        required_skills: ['law', 'legal_analysis', 'public_policy'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_interior',
        title: 'Secretary of Interior',
        department: 'Interior',
        level: 'cabinet',
        responsibilities: ['Natural Resources', 'Environmental Policy', 'Public Lands'],
        required_skills: ['environmental_science', 'resource_management', 'policy_development'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_commerce',
        title: 'Secretary of Commerce',
        department: 'Commerce',
        level: 'cabinet',
        responsibilities: ['Trade Policy', 'Business Development', 'Economic Growth'],
        required_skills: ['business_development', 'trade_policy', 'economics'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_labor',
        title: 'Secretary of Labor',
        department: 'Labor',
        level: 'cabinet',
        responsibilities: ['Worker Rights', 'Employment Policy', 'Labor Relations'],
        required_skills: ['labor_relations', 'policy_development', 'negotiation'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_health',
        title: 'Secretary of Health',
        department: 'Health',
        level: 'cabinet',
        responsibilities: ['Public Health', 'Healthcare Policy', 'Medical Research'],
        required_skills: ['healthcare_administration', 'public_health', 'policy_analysis'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_education',
        title: 'Secretary of Education',
        department: 'Education',
        level: 'cabinet',
        responsibilities: ['Education Policy', 'School Systems', 'Educational Standards'],
        required_skills: ['education_policy', 'administration', 'curriculum_development'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_energy',
        title: 'Secretary of Energy',
        department: 'Energy',
        level: 'cabinet',
        responsibilities: ['Energy Policy', 'Nuclear Security', 'Renewable Energy'],
        required_skills: ['energy_policy', 'technology_assessment', 'environmental_science'],
        appointment_method: 'appointed'
      },
      {
        id: 'secretary_transportation',
        title: 'Secretary of Transportation',
        department: 'Transportation',
        level: 'cabinet',
        responsibilities: ['Transportation Infrastructure', 'Safety Regulation', 'Transit Policy'],
        required_skills: ['transportation_planning', 'infrastructure_development', 'safety_management'],
        appointment_method: 'appointed'
      },

      // Intelligence and Security
      {
        id: 'national_security_advisor',
        title: 'National Security Advisor',
        department: 'National Security',
        level: 'cabinet',
        responsibilities: ['Security Policy', 'Intelligence Coordination', 'Crisis Response'],
        required_skills: ['intelligence_analysis', 'security_strategy', 'crisis_management'],
        appointment_method: 'appointed'
      },
      {
        id: 'cia_director',
        title: 'Director of Central Intelligence',
        department: 'Intelligence',
        level: 'cabinet',
        responsibilities: ['Intelligence Operations', 'National Security Intelligence', 'Covert Operations'],
        required_skills: ['intelligence_analysis', 'operational_security', 'strategic_planning'],
        appointment_method: 'appointed'
      },

      // Economic Advisors
      {
        id: 'economic_advisor',
        title: 'Chief Economic Advisor',
        department: 'Economic Policy',
        level: 'advisor',
        responsibilities: ['Economic Analysis', 'Policy Recommendations', 'Market Assessment'],
        required_skills: ['economics', 'data_analysis', 'policy_development'],
        appointment_method: 'appointed'
      },

      // Communications
      {
        id: 'press_secretary',
        title: 'Press Secretary',
        department: 'Communications',
        level: 'staff',
        responsibilities: ['Media Relations', 'Public Communications', 'Information Dissemination'],
        required_skills: ['public_relations', 'communications', 'media_management'],
        appointment_method: 'appointed'
      }
    ];

    positions.forEach(position => {
      this.governmentPositions.set(position.id, position);
    });

    console.log(`📋 Initialized ${positions.length} government positions`);
  }

  /**
   * Select positions based on government structure
   */
  private selectPositionsForGovernment(structure: GovernmentStructure): GovernmentPosition[] {
    const positions: GovernmentPosition[] = [];
    const allPositions = Array.from(this.governmentPositions.values());

    // Always include core executive positions
    const corePositions = ['president', 'vice_president', 'chief_of_staff'];
    corePositions.forEach(id => {
      const position = this.governmentPositions.get(id);
      if (position) positions.push(position);
    });

    // Add cabinet positions based on cabinet size
    const cabinetPositions = allPositions.filter(p => 
      p.level === 'cabinet' && !corePositions.includes(p.id)
    );
    
    const selectedCabinet = cabinetPositions
      .sort(() => Math.random() - 0.5) // Randomize
      .slice(0, Math.min(structure.cabinet_size - 3, cabinetPositions.length)); // -3 for core positions

    positions.push(...selectedCabinet);

    // Add key advisors and staff
    const advisorPositions = allPositions.filter(p => 
      p.level === 'advisor' || p.level === 'staff'
    );
    
    const selectedAdvisors = advisorPositions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, advisorPositions.length));

    positions.push(...selectedAdvisors);

    return positions;
  }

  /**
   * Create character template for a government position
   */
  private createTemplateForPosition(
    position: GovernmentPosition,
    structure: GovernmentStructure,
    context: PoliticalContext
  ): CharacterTemplate {
    const baseAttributes = this.calculateAttributesForPosition(position, context);
    
    return {
      id: `gov_${position.id}`,
      category: 'official',
      subcategory: position.department,
      rarity: position.level === 'cabinet' ? 'rare' : 'uncommon',
      baseAttributes,
      personalityTraits: this.getPersonalityTraitsForPosition(position),
      professionPool: [position.title],
      backgroundTemplates: this.getBackgroundTemplatesForPosition(position),
      namePatterns: this.getNamePatternsForPosition(position),
      appearanceTemplates: this.getAppearanceTemplatesForPosition(position),
      skillSets: this.getSkillSetsForPosition(position),
      relationshipTendencies: this.getRelationshipTendenciesForPosition(position),
      emergenceConditions: []
    };
  }

  /**
   * Calculate attributes based on position requirements
   */
  private calculateAttributesForPosition(
    position: GovernmentPosition,
    context: PoliticalContext
  ): any {
    const base = {
      intelligence: 75,
      charisma: 70,
      ambition: 80,
      integrity: 65,
      creativity: 60,
      empathy: 55,
      resilience: 75,
      leadership: 70,
      technical_skill: 50,
      social_influence: 75
    };

    // Adjust based on position type
    if (position.department === 'Executive Office') {
      base.charisma += 15;
      base.leadership += 20;
      base.social_influence += 15;
    } else if (position.department === 'Defense') {
      base.leadership += 15;
      base.resilience += 15;
      base.technical_skill += 10;
    } else if (position.department === 'Treasury') {
      base.intelligence += 15;
      base.technical_skill += 20;
      base.creativity += 10;
    } else if (position.department === 'Foreign Affairs') {
      base.charisma += 15;
      base.empathy += 15;
      base.intelligence += 10;
    }

    // Adjust based on political context
    if (context.approval_rating < 40) {
      base.resilience += 10;
      base.ambition += 5;
    }

    if (context.economic_situation === 'crisis') {
      base.intelligence += 10;
      base.technical_skill += 10;
    }

    // Ensure values stay within bounds
    Object.keys(base).forEach(key => {
      base[key] = Math.max(30, Math.min(95, base[key]));
    });

    return base;
  }

  /**
   * Generate voice profile for TTS differentiation
   */
  private generateVoiceProfile(character: DynamicCharacter, position: GovernmentPosition | null): any {
    const voiceOptions = {
      pitch: ['low', 'medium', 'high'],
      rate: [0.8, 0.9, 1.0, 1.1, 1.2],
      voice: character.demographics.gender === 'male' ? 'male' : 'female',
      accent: ['neutral', 'authoritative', 'diplomatic', 'regional'],
      tone: ['formal', 'authoritative', 'diplomatic', 'friendly', 'serious']
    };

    let tone = 'formal';
    let accent = 'neutral';
    let rate = 0.9;

    if (position) {
      if (position.department === 'Executive Office') {
        tone = 'authoritative';
        accent = 'authoritative';
        rate = 0.95;
      } else if (position.department === 'Foreign Affairs') {
        tone = 'diplomatic';
        accent = 'diplomatic';
        rate = 0.9;
      } else if (position.department === 'Defense') {
        tone = 'serious';
        accent = 'authoritative';
        rate = 1.0;
      }
    }

    return {
      pitch: voiceOptions.pitch[Math.floor(Math.random() * voiceOptions.pitch.length)],
      rate: rate + (Math.random() - 0.5) * 0.1, // Small variation
      voice: voiceOptions.voice,
      accent,
      tone
    };
  }

  /**
   * Generate templates for different character types
   */
  private getTemplatesForCharacterType(characterType: string): CharacterTemplate[] {
    const templates: CharacterTemplate[] = [];

    switch (characterType) {
      case 'business_leaders':
        templates.push(...this.createBusinessLeaderTemplates());
        break;
      case 'diplomats':
        templates.push(...this.createDiplomatTemplates());
        break;
      case 'advisors':
        templates.push(...this.createAdvisorTemplates());
        break;
      case 'other_civ_leaders':
        templates.push(...this.createOtherCivLeaderTemplates());
        break;
      default:
        console.warn(`Unknown character type: ${characterType}`);
    }

    return templates;
  }

  /**
   * Create business leader templates
   */
  private createBusinessLeaderTemplates(): CharacterTemplate[] {
    return [
      {
        id: 'ceo_major_corp',
        category: 'business',
        subcategory: 'corporate_leadership',
        rarity: 'rare',
        baseAttributes: {
          intelligence: 80, charisma: 75, ambition: 90, integrity: 60,
          creativity: 70, empathy: 50, resilience: 80, leadership: 85,
          technical_skill: 65, social_influence: 80
        },
        personalityTraits: ['ambitious', 'strategic', 'results-oriented', 'competitive'],
        professionPool: ['Chief Executive Officer', 'President', 'Managing Director'],
        backgroundTemplates: ['business_school', 'corporate_climber', 'entrepreneur'],
        namePatterns: [], appearanceTemplates: [], skillSets: [], relationshipTendencies: [], emergenceConditions: []
      },
      {
        id: 'tech_entrepreneur',
        category: 'business',
        subcategory: 'technology',
        rarity: 'uncommon',
        baseAttributes: {
          intelligence: 85, charisma: 65, ambition: 85, integrity: 70,
          creativity: 90, empathy: 60, resilience: 75, leadership: 70,
          technical_skill: 90, social_influence: 65
        },
        personalityTraits: ['innovative', 'visionary', 'analytical', 'risk-taking'],
        professionPool: ['Tech CEO', 'Startup Founder', 'CTO'],
        backgroundTemplates: ['tech_background', 'startup_experience', 'innovation_focus'],
        namePatterns: [], appearanceTemplates: [], skillSets: [], relationshipTendencies: [], emergenceConditions: []
      }
    ];
  }

  /**
   * Create diplomat templates
   */
  private createDiplomatTemplates(): CharacterTemplate[] {
    return [
      {
        id: 'ambassador',
        category: 'official',
        subcategory: 'diplomatic_corps',
        rarity: 'rare',
        baseAttributes: {
          intelligence: 80, charisma: 85, ambition: 70, integrity: 80,
          creativity: 65, empathy: 80, resilience: 75, leadership: 70,
          technical_skill: 60, social_influence: 85
        },
        personalityTraits: ['diplomatic', 'cultured', 'multilingual', 'patient'],
        professionPool: ['Ambassador', 'Consul General', 'Diplomatic Attaché'],
        backgroundTemplates: ['foreign_service', 'international_relations', 'cultural_studies'],
        namePatterns: [], appearanceTemplates: [], skillSets: [], relationshipTendencies: [], emergenceConditions: []
      }
    ];
  }

  /**
   * Create advisor templates
   */
  private createAdvisorTemplates(): CharacterTemplate[] {
    return [
      {
        id: 'policy_advisor',
        category: 'official',
        subcategory: 'advisory',
        rarity: 'uncommon',
        baseAttributes: {
          intelligence: 85, charisma: 65, ambition: 70, integrity: 75,
          creativity: 75, empathy: 70, resilience: 70, leadership: 60,
          technical_skill: 80, social_influence: 65
        },
        personalityTraits: ['analytical', 'knowledgeable', 'detail-oriented', 'strategic'],
        professionPool: ['Policy Advisor', 'Senior Analyst', 'Strategic Consultant'],
        backgroundTemplates: ['academic_background', 'think_tank_experience', 'policy_research'],
        namePatterns: [], appearanceTemplates: [], skillSets: [], relationshipTendencies: [], emergenceConditions: []
      }
    ];
  }

  /**
   * Create other civilization leader templates
   */
  private createOtherCivLeaderTemplates(): CharacterTemplate[] {
    return [
      {
        id: 'foreign_leader',
        category: 'official',
        subcategory: 'foreign_government',
        rarity: 'legendary',
        baseAttributes: {
          intelligence: 80, charisma: 85, ambition: 85, integrity: 70,
          creativity: 70, empathy: 65, resilience: 85, leadership: 90,
          technical_skill: 65, social_influence: 90
        },
        personalityTraits: ['authoritative', 'strategic', 'charismatic', 'influential'],
        professionPool: ['Prime Minister', 'Chancellor', 'President', 'Supreme Leader'],
        backgroundTemplates: ['political_career', 'military_background', 'revolutionary_leader'],
        namePatterns: [], appearanceTemplates: [], skillSets: [], relationshipTendencies: [], emergenceConditions: []
      }
    ];
  }

  // Helper methods for template creation
  private getPersonalityTraitsForPosition(position: GovernmentPosition): string[] {
    const traits = ['professional', 'dedicated', 'responsible'];
    
    if (position.level === 'cabinet') {
      traits.push('authoritative', 'strategic', 'influential');
    }
    
    if (position.department === 'Foreign Affairs') {
      traits.push('diplomatic', 'cultured', 'multilingual');
    } else if (position.department === 'Defense') {
      traits.push('decisive', 'disciplined', 'security-focused');
    } else if (position.department === 'Treasury') {
      traits.push('analytical', 'detail-oriented', 'fiscally-responsible');
    }
    
    return traits;
  }

  private getBackgroundTemplatesForPosition(position: GovernmentPosition): string[] {
    return ['political_career', 'public_service', 'professional_experience'];
  }

  private getNamePatternsForPosition(position: GovernmentPosition): any[] {
    return []; // Will be handled by the main character generator
  }

  private getAppearanceTemplatesForPosition(position: GovernmentPosition): any[] {
    return []; // Will be handled by the main character generator
  }

  private getSkillSetsForPosition(position: GovernmentPosition): any[] {
    return position.required_skills.map(skill => ({
      category: 'professional',
      skills: { [skill]: 80 },
      certifications: [],
      experience_years: 10
    }));
  }

  private getRelationshipTendenciesForPosition(position: GovernmentPosition): any[] {
    return [
      {
        relationship_type: 'colleague',
        likelihood: 80,
        preferred_character_types: ['official'],
        interaction_style: 'professional'
      }
    ];
  }

  private generatePoliticalViews(
    position: GovernmentPosition,
    context: PoliticalContext,
    structure: GovernmentStructure
  ): any {
    const views: any = {};
    
    // Generate views based on position and context
    views['government_efficiency'] = Math.floor(Math.random() * 60) + 20; // 20-80
    views['public_spending'] = Math.floor(Math.random() * 80) - 40; // -40 to 40
    views['regulation'] = Math.floor(Math.random() * 60) - 30; // -30 to 30
    
    return views;
  }

  private generateGovernmentPlotHooks(
    position: GovernmentPosition,
    context: PoliticalContext
  ): string[] {
    const hooks = [];
    
    if (position.level === 'cabinet') {
      hooks.push('Has access to classified information');
      hooks.push('Can influence major policy decisions');
    }
    
    if (context.current_crisis.length > 0) {
      hooks.push('Involved in current crisis management');
    }
    
    if (context.approval_rating < 40) {
      hooks.push('May be considering political changes');
    }
    
    return hooks;
  }

  private async generateGovernmentRelationships(
    characters: DynamicCharacter[],
    context: PoliticalContext
  ): Promise<void> {
    // Generate relationships between government officials
    // This would create professional relationships, alliances, rivalries, etc.
    console.log('🤝 Generating government relationships');
  }

  private getGovernmentDepartmentName(department: string, civilizationId: number): string {
    const departmentNames = {
      'Executive Office': 'Office of the President',
      'Foreign Affairs': 'Department of State',
      'Defense': 'Department of Defense',
      'Treasury': 'Department of Treasury',
      'Justice': 'Department of Justice',
      'Interior': 'Department of Interior',
      'Commerce': 'Department of Commerce',
      'Labor': 'Department of Labor',
      'Health': 'Department of Health',
      'Education': 'Department of Education',
      'Energy': 'Department of Energy',
      'Transportation': 'Department of Transportation',
      'National Security': 'National Security Council',
      'Intelligence': 'Central Intelligence Agency',
      'Economic Policy': 'Council of Economic Advisors',
      'Communications': 'White House Communications Office'
    };
    
    return departmentNames[department] || `Department of ${department}`;
  }
}
