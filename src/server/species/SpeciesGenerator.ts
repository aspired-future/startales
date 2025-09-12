/**
 * Species Generator
 * 
 * Generates and manages different species for civilizations, including
 * the core 9 species and procedurally generated new species.
 */

export interface Species {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'core' | 'generated';
  traits: SpeciesTraits;
  physicalCharacteristics: PhysicalCharacteristics;
  culturalTendencies: CulturalTendencies;
  namingConventions: NamingConventions;
  voiceCharacteristics: VoiceCharacteristics;
  gameplayBonuses: GameplayBonuses;
}

export interface SpeciesTraits {
  primary_focus: string;
  secondary_abilities: string[];
  weaknesses: string[];
  unique_abilities: string[];
  psychological_profile: string[];
  social_structure: 'hierarchical' | 'egalitarian' | 'collective' | 'individualistic' | 'tribal';
}

export interface PhysicalCharacteristics {
  average_height: [number, number]; // min, max in meters
  average_lifespan: [number, number]; // min, max in years
  physical_build: string[];
  distinctive_features: string[];
  environmental_adaptations: string[];
  sensory_capabilities: string[];
}

export interface CulturalTendencies {
  government_preferences: string[];
  values: string[];
  art_and_expression: string[];
  technology_approach: string;
  diplomacy_style: string;
  conflict_resolution: string;
  economic_preferences: string[];
}

export interface NamingConventions {
  name_structure: string;
  common_prefixes: string[];
  common_suffixes: string[];
  title_patterns: string[];
  example_names: {
    male: string[];
    female: string[];
    neutral: string[];
  };
}

export interface VoiceCharacteristics {
  pitch_range: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  speech_patterns: string[];
  accent_characteristics: string[];
  communication_style: string;
  language_complexity: 'simple' | 'moderate' | 'complex' | 'highly_complex';
}

export interface GameplayBonuses {
  technology_bonus: number; // -50 to +50
  diplomacy_bonus: number;
  military_bonus: number;
  economic_bonus: number;
  research_bonus: number;
  cultural_bonus: number;
  special_abilities: string[];
}

export class SpeciesGenerator {
  private coreSpecies: Map<string, Species> = new Map();
  private generatedSpecies: Map<string, Species> = new Map();

  constructor() {
    this.initializeCoreSpecies();
  }

  /**
   * Get all available species
   */
  getAllSpecies(): Species[] {
    return [...this.coreSpecies.values(), ...this.generatedSpecies.values()];
  }

  /**
   * Get a specific species by ID
   */
  getSpecies(speciesId: string): Species | null {
    return this.coreSpecies.get(speciesId) || this.generatedSpecies.get(speciesId) || null;
  }

  /**
   * Generate a new species for game setup
   */
  async generateNewSpecies(
    theme: string,
    existingSpecies: Species[],
    gameContext: any
  ): Promise<Species> {
    console.log(`🧬 Generating new species for theme: ${theme}`);

    // Create unique characteristics that don't overlap too much with existing species
    const existingFoci = existingSpecies.map(s => s.traits.primary_focus);
    
    const newSpecies: Species = {
      id: `species_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: this.generateSpeciesName(theme, existingSpecies),
      emoji: this.generateSpeciesEmoji(theme),
      description: this.generateSpeciesDescription(theme),
      category: 'generated',
      traits: this.generateSpeciesTraits(theme, existingFoci),
      physicalCharacteristics: this.generatePhysicalCharacteristics(theme),
      culturalTendencies: this.generateCulturalTendencies(theme),
      namingConventions: this.generateNamingConventions(theme),
      voiceCharacteristics: this.generateVoiceCharacteristics(theme),
      gameplayBonuses: this.generateGameplayBonuses(theme)
    };

    this.generatedSpecies.set(newSpecies.id, newSpecies);
    console.log(`✅ Generated new species: ${newSpecies.name}`);
    
    return newSpecies;
  }

  /**
   * Get species appropriate for a civilization type
   */
  getSpeciesForCivilization(
    governmentType: string,
    culturalValues: string[],
    technologyLevel: number
  ): Species[] {
    const allSpecies = this.getAllSpecies();
    
    return allSpecies.filter(species => {
      // Check government compatibility
      const govCompatible = species.culturalTendencies.government_preferences.some(pref =>
        pref.toLowerCase().includes(governmentType.toLowerCase())
      );
      
      // Check cultural alignment
      const culturalAlignment = culturalValues.some(value =>
        species.culturalTendencies.values.some(speciesValue =>
          speciesValue.toLowerCase().includes(value.toLowerCase())
        )
      );
      
      // Check technology level compatibility
      const techCompatible = Math.abs(species.gameplayBonuses.technology_bonus) <= (100 - technologyLevel);
      
      return govCompatible || culturalAlignment || techCompatible;
    });
  }

  /**
   * Initialize the 9 core species
   */
  private initializeCoreSpecies(): void {
    const coreSpeciesData: Omit<Species, 'id'>[] = [
      {
        name: 'The Synthesists',
        emoji: '🧠',
        description: 'Masters of technology and artificial intelligence',
        category: 'core',
        traits: {
          primary_focus: 'technology_and_ai',
          secondary_abilities: ['data_analysis', 'automation', 'cybernetics'],
          weaknesses: ['emotional_intelligence', 'biological_sciences'],
          unique_abilities: ['ai_integration', 'technological_synthesis', 'digital_consciousness'],
          psychological_profile: ['logical', 'analytical', 'innovation-focused', 'efficiency-oriented'],
          social_structure: 'hierarchical'
        },
        physicalCharacteristics: {
          average_height: [1.6, 1.9],
          average_lifespan: [120, 200],
          physical_build: ['lean', 'augmented', 'cybernetic_enhancements'],
          distinctive_features: ['neural_implants', 'glowing_eyes', 'metallic_skin_patches'],
          environmental_adaptations: ['technological_environments', 'low_oxygen', 'radiation_resistance'],
          sensory_capabilities: ['enhanced_digital_perception', 'electromagnetic_sensitivity', 'data_stream_awareness']
        },
        culturalTendencies: {
          government_preferences: ['technocracy', 'meritocracy', 'ai_assisted_democracy'],
          values: ['efficiency', 'innovation', 'logical_progress', 'technological_advancement'],
          art_and_expression: ['digital_art', 'algorithmic_music', 'data_visualization'],
          technology_approach: 'aggressive_advancement',
          diplomacy_style: 'logical_negotiation',
          conflict_resolution: 'algorithmic_solutions',
          economic_preferences: ['automated_production', 'digital_currencies', 'efficiency_optimization']
        },
        namingConventions: {
          name_structure: 'designation_number_function',
          common_prefixes: ['Syn', 'Tech', 'Cyber', 'Neo', 'Digi'],
          common_suffixes: ['tron', 'byte', 'core', 'link', 'node'],
          title_patterns: ['Prime', 'Alpha', 'Beta', 'Core', 'Matrix'],
          example_names: {
            male: ['Syntron-7', 'Cybrix Prime', 'Neobyte Alpha', 'Techcore-9'],
            female: ['Syntha-5', 'Cyberlia Beta', 'Neolink-3', 'Digitara Core'],
            neutral: ['Synthex-1', 'Cybernode-4', 'Neomatrix-8', 'Techlink-2']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'medium',
          speech_patterns: ['precise_articulation', 'technical_terminology', 'logical_structure'],
          accent_characteristics: ['digital_modulation', 'synthesized_undertones', 'precise_pronunciation'],
          communication_style: 'direct_and_logical',
          language_complexity: 'highly_complex'
        },
        gameplayBonuses: {
          technology_bonus: 40,
          diplomacy_bonus: -10,
          military_bonus: 20,
          economic_bonus: 30,
          research_bonus: 50,
          cultural_bonus: -5,
          special_abilities: ['ai_integration', 'technological_synthesis', 'automated_production']
        }
      },
      {
        name: 'The Psionics',
        emoji: '🧠',
        description: 'Wielders of psychic powers and mental warfare',
        category: 'core',
        traits: {
          primary_focus: 'psychic_abilities',
          secondary_abilities: ['telepathy', 'precognition', 'mental_manipulation'],
          weaknesses: ['technology_dependence', 'physical_vulnerability'],
          unique_abilities: ['mind_reading', 'psychic_warfare', 'collective_consciousness'],
          psychological_profile: ['intuitive', 'empathetic', 'mysterious', 'spiritually_aware'],
          social_structure: 'collective'
        },
        physicalCharacteristics: {
          average_height: [1.5, 1.8],
          average_lifespan: [150, 300],
          physical_build: ['ethereal', 'graceful', 'delicate'],
          distinctive_features: ['large_eyes', 'translucent_skin', 'glowing_aura'],
          environmental_adaptations: ['psychic_fields', 'mental_networks', 'energy_sensitivity'],
          sensory_capabilities: ['telepathic_awareness', 'emotional_sensing', 'future_glimpses']
        },
        culturalTendencies: {
          government_preferences: ['council_of_minds', 'psychic_democracy', 'collective_consciousness'],
          values: ['mental_harmony', 'spiritual_growth', 'collective_wisdom', 'psychic_development'],
          art_and_expression: ['thought_sculptures', 'emotion_paintings', 'memory_symphonies'],
          technology_approach: 'bio_psychic_integration',
          diplomacy_style: 'empathic_understanding',
          conflict_resolution: 'mental_mediation',
          economic_preferences: ['thought_based_currency', 'psychic_services', 'mental_labor']
        },
        namingConventions: {
          name_structure: 'mind_concept_suffix',
          common_prefixes: ['Psi', 'Tele', 'Menta', 'Aura', 'Spiri'],
          common_suffixes: ['mind', 'thought', 'dream', 'vision', 'soul'],
          title_patterns: ['Seer', 'Oracle', 'Mindwalker', 'Dreamweaver', 'Thoughtkeeper'],
          example_names: {
            male: ['Psimind', 'Teledream', 'Mentavision', 'Aurathought'],
            female: ['Psisoul', 'Telemind', 'Mentadream', 'Auravision'],
            neutral: ['Psithought', 'Telesoul', 'Mentamind', 'Auradream']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'high',
          speech_patterns: ['flowing_cadence', 'mystical_terminology', 'emotional_undertones'],
          accent_characteristics: ['ethereal_quality', 'harmonic_resonance', 'whispered_intensity'],
          communication_style: 'empathic_and_intuitive',
          language_complexity: 'complex'
        },
        gameplayBonuses: {
          technology_bonus: -20,
          diplomacy_bonus: 45,
          military_bonus: 25,
          economic_bonus: 10,
          research_bonus: 35,
          cultural_bonus: 40,
          special_abilities: ['mind_reading', 'psychic_warfare', 'collective_consciousness']
        }
      },
      {
        name: 'The Cultivators',
        emoji: '🌱',
        description: 'Bio-engineers who shape life itself',
        category: 'core',
        traits: {
          primary_focus: 'biological_engineering',
          secondary_abilities: ['genetic_manipulation', 'ecosystem_design', 'organic_technology'],
          weaknesses: ['mechanical_technology', 'artificial_systems'],
          unique_abilities: ['life_creation', 'biological_adaptation', 'ecosystem_control'],
          psychological_profile: ['nurturing', 'patient', 'holistic', 'growth_oriented'],
          social_structure: 'egalitarian'
        },
        physicalCharacteristics: {
          average_height: [1.4, 2.2],
          average_lifespan: [200, 500],
          physical_build: ['organic', 'adaptable', 'plant_like_features'],
          distinctive_features: ['chlorophyll_skin', 'root_like_hair', 'photosynthetic_patches'],
          environmental_adaptations: ['any_biosphere', 'extreme_climates', 'toxic_environments'],
          sensory_capabilities: ['biological_awareness', 'chemical_detection', 'life_force_sensing']
        },
        culturalTendencies: {
          government_preferences: ['bio_democracy', 'ecological_council', 'natural_hierarchy'],
          values: ['life_preservation', 'natural_harmony', 'sustainable_growth', 'biodiversity'],
          art_and_expression: ['living_sculptures', 'genetic_art', 'ecosystem_gardens'],
          technology_approach: 'biological_integration',
          diplomacy_style: 'natural_mediation',
          conflict_resolution: 'ecosystem_balance',
          economic_preferences: ['biological_resources', 'life_based_currency', 'sustainable_production']
        },
        namingConventions: {
          name_structure: 'nature_element_growth',
          common_prefixes: ['Bio', 'Vita', 'Flora', 'Eco', 'Natura'],
          common_suffixes: ['bloom', 'growth', 'seed', 'root', 'leaf'],
          title_patterns: ['Gardener', 'Cultivator', 'Lifeshaper', 'Bioweaver', 'Seedkeeper'],
          example_names: {
            male: ['Biobloom', 'Vitagrowth', 'Floraseed', 'Ecoroot'],
            female: ['Bioleaf', 'Vitabloom', 'Floragrowth', 'Ecoseed'],
            neutral: ['Bioroot', 'Vitaleaf', 'Florabloom', 'Ecogrowth']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'low',
          speech_patterns: ['organic_rhythm', 'natural_metaphors', 'growth_terminology'],
          accent_characteristics: ['earthy_tones', 'rustling_quality', 'seasonal_variations'],
          communication_style: 'nurturing_and_patient',
          language_complexity: 'moderate'
        },
        gameplayBonuses: {
          technology_bonus: -15,
          diplomacy_bonus: 25,
          military_bonus: 15,
          economic_bonus: 35,
          research_bonus: 30,
          cultural_bonus: 20,
          special_abilities: ['life_creation', 'biological_adaptation', 'ecosystem_control']
        }
      },
      {
        name: 'The Energists',
        emoji: '⚡',
        description: 'Harness pure energy for devastating effects',
        category: 'core',
        traits: {
          primary_focus: 'energy_manipulation',
          secondary_abilities: ['plasma_control', 'electromagnetic_mastery', 'fusion_technology'],
          weaknesses: ['energy_drain', 'overload_vulnerability'],
          unique_abilities: ['energy_projection', 'power_absorption', 'electromagnetic_control'],
          psychological_profile: ['intense', 'dynamic', 'powerful', 'volatile'],
          social_structure: 'hierarchical'
        },
        physicalCharacteristics: {
          average_height: [1.7, 2.0],
          average_lifespan: [80, 150],
          physical_build: ['muscular', 'energetic', 'crackling_with_power'],
          distinctive_features: ['glowing_veins', 'electric_hair', 'energy_aura'],
          environmental_adaptations: ['high_energy_fields', 'electromagnetic_storms', 'plasma_environments'],
          sensory_capabilities: ['energy_detection', 'electromagnetic_sight', 'power_level_assessment']
        },
        culturalTendencies: {
          government_preferences: ['power_hierarchy', 'energy_meritocracy', 'dynastic_rule'],
          values: ['strength', 'power', 'dominance', 'energy_mastery'],
          art_and_expression: ['energy_displays', 'plasma_sculptures', 'electromagnetic_music'],
          technology_approach: 'energy_focused_advancement',
          diplomacy_style: 'power_projection',
          conflict_resolution: 'strength_demonstration',
          economic_preferences: ['energy_trading', 'power_monopolies', 'resource_control']
        },
        namingConventions: {
          name_structure: 'power_element_intensity',
          common_prefixes: ['Volt', 'Plasma', 'Electro', 'Magna', 'Thermo'],
          common_suffixes: ['storm', 'bolt', 'surge', 'flare', 'burst'],
          title_patterns: ['Lord', 'Master', 'Commander', 'Overlord', 'Supreme'],
          example_names: {
            male: ['Voltstorm', 'Plasmabolt', 'Electrosurge', 'Magnaflare'],
            female: ['Voltburst', 'Plasmastorm', 'Electrobolt', 'Magnasurge'],
            neutral: ['Voltflare', 'Plasmaburst', 'Electrostorm', 'Magnabolt']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'medium',
          speech_patterns: ['powerful_delivery', 'energy_metaphors', 'commanding_tone'],
          accent_characteristics: ['crackling_undertones', 'electric_intensity', 'booming_quality'],
          communication_style: 'dominant_and_forceful',
          language_complexity: 'moderate'
        },
        gameplayBonuses: {
          technology_bonus: 25,
          diplomacy_bonus: -15,
          military_bonus: 45,
          economic_bonus: 20,
          research_bonus: 15,
          cultural_bonus: 10,
          special_abilities: ['energy_projection', 'power_absorption', 'electromagnetic_control']
        }
      },
      {
        name: 'The Architects',
        emoji: '🏛️',
        description: 'Builders of megastructures and vast empires',
        category: 'core',
        traits: {
          primary_focus: 'construction_and_empire_building',
          secondary_abilities: ['megastructure_design', 'resource_management', 'urban_planning'],
          weaknesses: ['flexibility', 'rapid_adaptation'],
          unique_abilities: ['megaconstruction', 'empire_coordination', 'structural_mastery'],
          psychological_profile: ['methodical', 'ambitious', 'grand_vision', 'patient'],
          social_structure: 'hierarchical'
        },
        physicalCharacteristics: {
          average_height: [1.8, 2.3],
          average_lifespan: [100, 180],
          physical_build: ['robust', 'sturdy', 'imposing'],
          distinctive_features: ['stone_like_skin', 'geometric_patterns', 'crystalline_eyes'],
          environmental_adaptations: ['harsh_construction_sites', 'extreme_pressures', 'vacuum_work'],
          sensory_capabilities: ['structural_analysis', 'material_assessment', 'spatial_awareness']
        },
        culturalTendencies: {
          government_preferences: ['imperial_hierarchy', 'bureaucratic_empire', 'construction_guild'],
          values: ['order', 'permanence', 'grandeur', 'legacy'],
          art_and_expression: ['monumental_architecture', 'geometric_art', 'structural_music'],
          technology_approach: 'construction_focused',
          diplomacy_style: 'formal_negotiation',
          conflict_resolution: 'structured_mediation',
          economic_preferences: ['construction_economy', 'resource_monopolies', 'infrastructure_investment']
        },
        namingConventions: {
          name_structure: 'structure_material_rank',
          common_prefixes: ['Arch', 'Construct', 'Build', 'Struct', 'Mason'],
          common_suffixes: ['stone', 'steel', 'tower', 'wall', 'bridge'],
          title_patterns: ['Architect', 'Builder', 'Constructor', 'Engineer', 'Foreman'],
          example_names: {
            male: ['Archstone', 'Constructsteel', 'Buildtower', 'Structwall'],
            female: ['Archbridge', 'Constructstone', 'Buildsteel', 'Structtower'],
            neutral: ['Archwall', 'Constructbridge', 'Buildstone', 'Structsteel']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'low',
          speech_patterns: ['measured_pace', 'construction_terminology', 'formal_structure'],
          accent_characteristics: ['solid_resonance', 'architectural_precision', 'foundational_depth'],
          communication_style: 'formal_and_structured',
          language_complexity: 'complex'
        },
        gameplayBonuses: {
          technology_bonus: 15,
          diplomacy_bonus: 10,
          military_bonus: 30,
          economic_bonus: 40,
          research_bonus: 20,
          cultural_bonus: 25,
          special_abilities: ['megaconstruction', 'empire_coordination', 'structural_mastery']
        }
      },
      {
        name: 'The Adapters',
        emoji: '🌊',
        description: 'Masters of evolution and environmental control',
        category: 'core',
        traits: {
          primary_focus: 'adaptation_and_evolution',
          secondary_abilities: ['environmental_control', 'rapid_evolution', 'survival_mastery'],
          weaknesses: ['specialization', 'long_term_planning'],
          unique_abilities: ['instant_adaptation', 'environmental_shaping', 'evolutionary_acceleration'],
          psychological_profile: ['flexible', 'survivalist', 'opportunistic', 'resilient'],
          social_structure: 'tribal'
        },
        physicalCharacteristics: {
          average_height: [1.3, 2.1],
          average_lifespan: [60, 200],
          physical_build: ['variable', 'adaptable', 'shape_shifting'],
          distinctive_features: ['changing_appearance', 'adaptive_limbs', 'environmental_camouflage'],
          environmental_adaptations: ['any_environment', 'rapid_climate_change', 'extreme_conditions'],
          sensory_capabilities: ['environmental_sensing', 'adaptation_awareness', 'survival_instincts']
        },
        culturalTendencies: {
          government_preferences: ['adaptive_democracy', 'survival_council', 'environmental_republic'],
          values: ['survival', 'adaptability', 'environmental_harmony', 'flexibility'],
          art_and_expression: ['adaptive_art', 'environmental_music', 'survival_stories'],
          technology_approach: 'adaptive_innovation',
          diplomacy_style: 'flexible_negotiation',
          conflict_resolution: 'adaptive_solutions',
          economic_preferences: ['resource_adaptation', 'survival_economy', 'environmental_trading']
        },
        namingConventions: {
          name_structure: 'environment_adaptation_trait',
          common_prefixes: ['Adapt', 'Evolve', 'Shift', 'Flow', 'Change'],
          common_suffixes: ['wave', 'current', 'tide', 'stream', 'flow'],
          title_patterns: ['Shifter', 'Adapter', 'Evolver', 'Survivor', 'Changer'],
          example_names: {
            male: ['Adaptwave', 'Evolvecurrent', 'Shifttide', 'Flowstream'],
            female: ['Adaptflow', 'Evolvewave', 'Shiftcurrent', 'Flowtide'],
            neutral: ['Adaptstream', 'Evolveflow', 'Shiftwave', 'Flowcurrent']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'medium',
          speech_patterns: ['fluid_delivery', 'adaptive_terminology', 'survival_focus'],
          accent_characteristics: ['flowing_quality', 'environmental_echoes', 'adaptive_modulation'],
          communication_style: 'flexible_and_adaptive',
          language_complexity: 'moderate'
        },
        gameplayBonuses: {
          technology_bonus: 5,
          diplomacy_bonus: 20,
          military_bonus: 25,
          economic_bonus: 15,
          research_bonus: 25,
          cultural_bonus: 30,
          special_abilities: ['instant_adaptation', 'environmental_shaping', 'evolutionary_acceleration']
        }
      },
      {
        name: 'The Forgers',
        emoji: '🔥',
        description: 'Industrial powerhouses with unmatched production',
        category: 'core',
        traits: {
          primary_focus: 'industrial_production',
          secondary_abilities: ['mass_manufacturing', 'resource_processing', 'industrial_automation'],
          weaknesses: ['environmental_damage', 'resource_depletion'],
          unique_abilities: ['mega_production', 'industrial_efficiency', 'resource_transformation'],
          psychological_profile: ['industrious', 'pragmatic', 'efficiency_focused', 'productive'],
          social_structure: 'hierarchical'
        },
        physicalCharacteristics: {
          average_height: [1.6, 2.0],
          average_lifespan: [90, 140],
          physical_build: ['stocky', 'muscular', 'industrial_augmentations'],
          distinctive_features: ['metallic_skin', 'tool_integrated_limbs', 'furnace_eyes'],
          environmental_adaptations: ['industrial_environments', 'high_temperatures', 'toxic_atmospheres'],
          sensory_capabilities: ['material_analysis', 'quality_assessment', 'production_monitoring']
        },
        culturalTendencies: {
          government_preferences: ['industrial_republic', 'corporate_state', 'production_council'],
          values: ['efficiency', 'productivity', 'quality', 'industrial_progress'],
          art_and_expression: ['industrial_art', 'mechanical_music', 'production_displays'],
          technology_approach: 'industrial_advancement',
          diplomacy_style: 'trade_negotiation',
          conflict_resolution: 'resource_mediation',
          economic_preferences: ['mass_production', 'industrial_trading', 'manufacturing_economy']
        },
        namingConventions: {
          name_structure: 'metal_process_product',
          common_prefixes: ['Forge', 'Steel', 'Iron', 'Copper', 'Titan'],
          common_suffixes: ['hammer', 'anvil', 'furnace', 'forge', 'steel'],
          title_patterns: ['Forgemaster', 'Steelworker', 'Ironsmith', 'Craftsman', 'Producer'],
          example_names: {
            male: ['Forgehammer', 'Steelanvil', 'Ironfurnace', 'Copperforge'],
            female: ['Forgesteel', 'Steelhammer', 'Ironanvil', 'Copperfurnace'],
            neutral: ['Forgeanvil', 'Steelforge', 'Ironhammer', 'Coppersteel']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'low',
          speech_patterns: ['rhythmic_delivery', 'industrial_terminology', 'practical_focus'],
          accent_characteristics: ['metallic_resonance', 'hammering_rhythm', 'industrial_precision'],
          communication_style: 'practical_and_direct',
          language_complexity: 'simple'
        },
        gameplayBonuses: {
          technology_bonus: 30,
          diplomacy_bonus: 5,
          military_bonus: 35,
          economic_bonus: 50,
          research_bonus: 10,
          cultural_bonus: -10,
          special_abilities: ['mega_production', 'industrial_efficiency', 'resource_transformation']
        }
      },
      {
        name: 'The Wanderers',
        emoji: '🌌',
        description: 'Nomadic explorers with superior mobility',
        category: 'core',
        traits: {
          primary_focus: 'exploration_and_mobility',
          secondary_abilities: ['navigation', 'survival', 'cultural_adaptation'],
          weaknesses: ['permanent_infrastructure', 'long_term_commitment'],
          unique_abilities: ['hypermobility', 'exploration_mastery', 'cultural_mimicry'],
          psychological_profile: ['curious', 'restless', 'adventurous', 'independent'],
          social_structure: 'tribal'
        },
        physicalCharacteristics: {
          average_height: [1.5, 1.9],
          average_lifespan: [120, 250],
          physical_build: ['lean', 'agile', 'travel_adapted'],
          distinctive_features: ['star_map_tattoos', 'compass_eyes', 'wind_swept_appearance'],
          environmental_adaptations: ['space_travel', 'multiple_climates', 'zero_gravity'],
          sensory_capabilities: ['stellar_navigation', 'cultural_reading', 'danger_sensing']
        },
        culturalTendencies: {
          government_preferences: ['nomadic_council', 'exploration_fleet', 'wanderer_collective'],
          values: ['freedom', 'exploration', 'discovery', 'independence'],
          art_and_expression: ['star_maps', 'travel_songs', 'cultural_fusion'],
          technology_approach: 'mobility_focused',
          diplomacy_style: 'cultural_exchange',
          conflict_resolution: 'peaceful_departure',
          economic_preferences: ['trade_networks', 'exploration_economy', 'cultural_exchange']
        },
        namingConventions: {
          name_structure: 'direction_star_journey',
          common_prefixes: ['Star', 'Void', 'Drift', 'Wander', 'Roam'],
          common_suffixes: ['walker', 'rider', 'seeker', 'finder', 'traveler'],
          title_patterns: ['Navigator', 'Explorer', 'Pathfinder', 'Starwalker', 'Voidrider'],
          example_names: {
            male: ['Starwalker', 'Voidrider', 'Driftseeker', 'Wanderfinder'],
            female: ['Startraveler', 'Voidwalker', 'Driftrider', 'Wanderseeker'],
            neutral: ['Starseeker', 'Voidfinder', 'Driftwalker', 'Wanderrider']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'medium',
          speech_patterns: ['wandering_cadence', 'travel_stories', 'cultural_accents'],
          accent_characteristics: ['stellar_echoes', 'wind_whispers', 'distant_harmonies'],
          communication_style: 'storytelling_and_curious',
          language_complexity: 'complex'
        },
        gameplayBonuses: {
          technology_bonus: 10,
          diplomacy_bonus: 35,
          military_bonus: 15,
          economic_bonus: 25,
          research_bonus: 40,
          cultural_bonus: 45,
          special_abilities: ['hypermobility', 'exploration_mastery', 'cultural_mimicry']
        }
      },
      {
        name: 'The Voidborn',
        emoji: '🌀',
        description: 'Mysterious entities that manipulate space-time and dark matter',
        category: 'core',
        traits: {
          primary_focus: 'space_time_manipulation',
          secondary_abilities: ['dark_matter_control', 'dimensional_travel', 'reality_alteration'],
          weaknesses: ['physical_realm_interaction', 'material_dependency'],
          unique_abilities: ['void_manipulation', 'dimensional_phasing', 'reality_distortion'],
          psychological_profile: ['enigmatic', 'otherworldly', 'transcendent', 'alien'],
          social_structure: 'collective'
        },
        physicalCharacteristics: {
          average_height: [1.0, 3.0],
          average_lifespan: [500, 2000],
          physical_build: ['ethereal', 'shifting', 'partially_incorporeal'],
          distinctive_features: ['void_essence', 'shifting_form', 'dark_matter_aura'],
          environmental_adaptations: ['void_space', 'dimensional_rifts', 'dark_matter_fields'],
          sensory_capabilities: ['dimensional_sight', 'void_sensing', 'reality_perception']
        },
        culturalTendencies: {
          government_preferences: ['void_collective', 'dimensional_council', 'transcendent_hierarchy'],
          values: ['transcendence', 'mystery', 'cosmic_understanding', 'dimensional_harmony'],
          art_and_expression: ['void_sculptures', 'dimensional_music', 'reality_art'],
          technology_approach: 'dimensional_mastery',
          diplomacy_style: 'enigmatic_communication',
          conflict_resolution: 'reality_adjustment',
          economic_preferences: ['void_resources', 'dimensional_trading', 'cosmic_energy']
        },
        namingConventions: {
          name_structure: 'void_concept_dimension',
          common_prefixes: ['Void', 'Dark', 'Null', 'Abyss', 'Cosmic'],
          common_suffixes: ['void', 'shadow', 'whisper', 'echo', 'drift'],
          title_patterns: ['Voidkeeper', 'Shadowwalker', 'Nullbringer', 'Abysswatcher', 'Cosmicweaver'],
          example_names: {
            male: ['Voidwhisper', 'Darkshadow', 'Nullecho', 'Abyssdrift'],
            female: ['Voidecho', 'Darkwhisper', 'Nullshadow', 'Abyssvoid'],
            neutral: ['Voidshadow', 'Darkdrift', 'Nullwhisper', 'Abyssecho']
          }
        },
        voiceCharacteristics: {
          pitch_range: 'very_low',
          speech_patterns: ['otherworldly_cadence', 'cosmic_terminology', 'dimensional_concepts'],
          accent_characteristics: ['void_resonance', 'dimensional_echoes', 'reality_distortion'],
          communication_style: 'enigmatic_and_transcendent',
          language_complexity: 'highly_complex'
        },
        gameplayBonuses: {
          technology_bonus: 35,
          diplomacy_bonus: 15,
          military_bonus: 40,
          economic_bonus: 5,
          research_bonus: 50,
          cultural_bonus: 35,
          special_abilities: ['void_manipulation', 'dimensional_phasing', 'reality_distortion']
        }
      }
    ];

    coreSpeciesData.forEach((speciesData, index) => {
      const species: Species = {
        id: `core_species_${index + 1}`,
        ...speciesData
      };
      this.coreSpecies.set(species.id, species);
    });

    console.log(`🧬 Initialized ${this.coreSpecies.size} core species`);
  }

  // Helper methods for generating new species

  private generateSpeciesName(theme: string, existingSpecies: Species[]): string {
    const themeNames = {
      'space_opera': ['Stellarians', 'Cosmics', 'Galactics', 'Nebulans', 'Voidkin'],
      'cyberpunk': ['Netrunners', 'Cyborgs', 'Digitals', 'Hackers', 'Synthetics'],
      'fantasy': ['Ethereals', 'Mystics', 'Elementals', 'Ancients', 'Fae'],
      'post_apocalyptic': ['Survivors', 'Mutants', 'Wastelanders', 'Scavengers', 'Remnants'],
      'steampunk': ['Mechanicals', 'Steamers', 'Clockworks', 'Gearheads', 'Inventors']
    };

    const names = themeNames[theme] || themeNames['space_opera'];
    const existingNames = existingSpecies.map(s => s.name);
    
    // Find a name that doesn't already exist
    for (const name of names) {
      if (!existingNames.includes(name)) {
        return name;
      }
    }
    
    // If all names are taken, generate a unique one
    return `${names[0]} ${Math.floor(Math.random() * 1000)}`;
  }

  private generateSpeciesEmoji(theme: string): string {
    const themeEmojis = {
      'space_opera': ['🌟', '🚀', '👽', '🛸', '🌌', '⭐', '🌠', '🔮'],
      'cyberpunk': ['🤖', '💻', '🔌', '⚡', '🧠', '💾', '🔬', '🎮'],
      'fantasy': ['🧙', '🐉', '🔮', '⚔️', '🏰', '🌿', '🔥', '❄️'],
      'post_apocalyptic': ['☢️', '🏚️', '⚰️', '🔥', '💀', '🌪️', '⚡', '🗡️'],
      'steampunk': ['⚙️', '🔧', '🚂', '🎩', '💨', '🔩', '⚗️', '🕰️']
    };

    const emojis = themeEmojis[theme] || themeEmojis['space_opera'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  private generateSpeciesDescription(theme: string): string {
    const descriptions = [
      'Advanced beings with unique evolutionary adaptations',
      'Mysterious entities from distant realms',
      'Highly evolved species with specialized abilities',
      'Ancient civilization with forgotten technologies',
      'Emergent species with rapid development',
      'Hybrid beings combining multiple evolutionary paths',
      'Transcendent entities beyond normal understanding',
      'Adaptive species with remarkable survival instincts'
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateSpeciesTraits(theme: string, existingFoci: string[]): SpeciesTraits {
    const possibleFoci = [
      'quantum_manipulation', 'temporal_control', 'gravity_mastery', 'matter_transformation',
      'consciousness_expansion', 'reality_weaving', 'elemental_control', 'dimensional_travel',
      'genetic_perfection', 'mechanical_integration', 'energy_synthesis', 'information_mastery'
    ];

    // Find a focus that doesn't overlap with existing species
    const availableFoci = possibleFoci.filter(focus => !existingFoci.includes(focus));
    const primaryFocus = availableFoci.length > 0 ? 
      availableFoci[Math.floor(Math.random() * availableFoci.length)] :
      possibleFoci[Math.floor(Math.random() * possibleFoci.length)];

    return {
      primary_focus: primaryFocus,
      secondary_abilities: this.generateSecondaryAbilities(primaryFocus),
      weaknesses: this.generateWeaknesses(primaryFocus),
      unique_abilities: this.generateUniqueAbilities(primaryFocus),
      psychological_profile: this.generatePsychologicalProfile(primaryFocus),
      social_structure: this.generateSocialStructure(primaryFocus)
    };
  }

  private generateSecondaryAbilities(primaryFocus: string): string[] {
    const abilityMap = {
      'quantum_manipulation': ['probability_control', 'particle_physics', 'uncertainty_mastery'],
      'temporal_control': ['time_dilation', 'causality_manipulation', 'chronological_awareness'],
      'gravity_mastery': ['gravitational_fields', 'mass_manipulation', 'orbital_mechanics'],
      'matter_transformation': ['atomic_restructuring', 'molecular_assembly', 'phase_transitions'],
      'consciousness_expansion': ['collective_minds', 'thought_networks', 'mental_amplification'],
      'reality_weaving': ['dimensional_crafting', 'existence_shaping', 'universal_constants'],
      'elemental_control': ['natural_forces', 'environmental_mastery', 'primal_energies'],
      'dimensional_travel': ['portal_creation', 'space_folding', 'parallel_worlds'],
      'genetic_perfection': ['evolutionary_acceleration', 'trait_optimization', 'biological_enhancement'],
      'mechanical_integration': ['cybernetic_fusion', 'artificial_symbiosis', 'technological_evolution'],
      'energy_synthesis': ['power_generation', 'energy_conversion', 'force_field_creation'],
      'information_mastery': ['data_manipulation', 'knowledge_networks', 'computational_thinking']
    };

    return abilityMap[primaryFocus] || ['advanced_adaptation', 'specialized_evolution', 'unique_development'];
  }

  private generateWeaknesses(primaryFocus: string): string[] {
    const weaknessMap = {
      'quantum_manipulation': ['reality_instability', 'probability_backlash'],
      'temporal_control': ['temporal_paradoxes', 'chronological_displacement'],
      'gravity_mastery': ['gravitational_collapse', 'mass_overload'],
      'matter_transformation': ['molecular_instability', 'atomic_decay'],
      'consciousness_expansion': ['mental_overload', 'collective_vulnerability'],
      'reality_weaving': ['existential_crisis', 'dimensional_tears'],
      'elemental_control': ['elemental_imbalance', 'natural_disasters'],
      'dimensional_travel': ['dimensional_sickness', 'portal_instability'],
      'genetic_perfection': ['genetic_stagnation', 'evolutionary_dead_ends'],
      'mechanical_integration': ['technological_dependence', 'system_failures'],
      'energy_synthesis': ['energy_depletion', 'power_overload'],
      'information_mastery': ['data_corruption', 'information_overload']
    };

    return weaknessMap[primaryFocus] || ['specialization_limits', 'adaptation_costs'];
  }

  private generateUniqueAbilities(primaryFocus: string): string[] {
    const abilityMap = {
      'quantum_manipulation': ['quantum_tunneling', 'superposition_states', 'entanglement_communication'],
      'temporal_control': ['time_loops', 'temporal_shields', 'chronological_prediction'],
      'gravity_mastery': ['gravity_wells', 'anti_gravity_fields', 'gravitational_lensing'],
      'matter_transformation': ['instant_transmutation', 'molecular_reconstruction', 'phase_shifting'],
      'consciousness_expansion': ['hive_mind', 'thought_projection', 'mental_fusion'],
      'reality_weaving': ['reality_anchors', 'existence_editing', 'universal_constants_adjustment'],
      'elemental_control': ['elemental_fusion', 'primal_summoning', 'natural_harmony'],
      'dimensional_travel': ['pocket_dimensions', 'dimensional_gates', 'parallel_existence'],
      'genetic_perfection': ['instant_evolution', 'trait_copying', 'biological_optimization'],
      'mechanical_integration': ['techno_organic_fusion', 'system_assimilation', 'digital_consciousness'],
      'energy_synthesis': ['pure_energy_form', 'energy_beings', 'power_multiplication'],
      'information_mastery': ['living_databases', 'knowledge_absorption', 'data_incarnation']
    };

    return abilityMap[primaryFocus] || ['species_mastery', 'evolutionary_advantage', 'specialized_dominance'];
  }

  private generatePsychologicalProfile(primaryFocus: string): string[] {
    const profileMap = {
      'quantum_manipulation': ['probabilistic_thinking', 'uncertainty_comfortable', 'reality_flexible'],
      'temporal_control': ['long_term_perspective', 'causality_aware', 'patience_extreme'],
      'gravity_mastery': ['stability_focused', 'center_seeking', 'balance_oriented'],
      'matter_transformation': ['change_embracing', 'adaptability_high', 'transformation_natural'],
      'consciousness_expansion': ['collective_minded', 'empathy_enhanced', 'unity_seeking'],
      'reality_weaving': ['creative_reality', 'imagination_powerful', 'existence_questioning'],
      'elemental_control': ['nature_connected', 'primal_instincts', 'elemental_harmony'],
      'dimensional_travel': ['exploration_driven', 'curiosity_infinite', 'adventure_seeking'],
      'genetic_perfection': ['perfection_obsessed', 'optimization_focused', 'evolution_driven'],
      'mechanical_integration': ['logic_dominant', 'efficiency_valued', 'system_thinking'],
      'energy_synthesis': ['power_focused', 'intensity_high', 'energy_attuned'],
      'information_mastery': ['knowledge_hungry', 'data_processing', 'information_valued']
    };

    return profileMap[primaryFocus] || ['specialized_mindset', 'focused_thinking', 'unique_perspective'];
  }

  private generateSocialStructure(primaryFocus: string): 'hierarchical' | 'egalitarian' | 'collective' | 'individualistic' | 'tribal' {
    const structureMap = {
      'quantum_manipulation': 'collective',
      'temporal_control': 'hierarchical',
      'gravity_mastery': 'hierarchical',
      'matter_transformation': 'egalitarian',
      'consciousness_expansion': 'collective',
      'reality_weaving': 'individualistic',
      'elemental_control': 'tribal',
      'dimensional_travel': 'individualistic',
      'genetic_perfection': 'hierarchical',
      'mechanical_integration': 'hierarchical',
      'energy_synthesis': 'hierarchical',
      'information_mastery': 'egalitarian'
    };

    return structureMap[primaryFocus] || 'egalitarian';
  }

  private generatePhysicalCharacteristics(theme: string): PhysicalCharacteristics {
    return {
      average_height: [1.2 + Math.random() * 0.8, 1.8 + Math.random() * 0.8],
      average_lifespan: [80 + Math.random() * 120, 200 + Math.random() * 300],
      physical_build: ['unique_adaptation', 'specialized_form', 'evolved_structure'],
      distinctive_features: ['species_specific_traits', 'evolutionary_markers', 'adaptive_features'],
      environmental_adaptations: ['specialized_environment', 'unique_conditions', 'evolved_habitat'],
      sensory_capabilities: ['enhanced_perception', 'specialized_senses', 'unique_awareness']
    };
  }

  private generateCulturalTendencies(theme: string): CulturalTendencies {
    return {
      government_preferences: ['specialized_governance', 'adaptive_leadership', 'unique_organization'],
      values: ['species_values', 'evolutionary_priorities', 'adaptive_principles'],
      art_and_expression: ['unique_art_forms', 'species_expression', 'cultural_creativity'],
      technology_approach: 'specialized_development',
      diplomacy_style: 'species_specific_communication',
      conflict_resolution: 'adaptive_solutions',
      economic_preferences: ['specialized_economy', 'unique_resources', 'adaptive_trade']
    };
  }

  private generateNamingConventions(theme: string): NamingConventions {
    return {
      name_structure: 'species_specific_pattern',
      common_prefixes: ['Spe', 'Evo', 'Ada', 'Uni', 'New'],
      common_suffixes: ['ling', 'born', 'kind', 'race', 'folk'],
      title_patterns: ['Leader', 'Elder', 'Guide', 'Master', 'Keeper'],
      example_names: {
        male: ['Speling', 'Evoborn', 'Adakind', 'Unirace'],
        female: ['Spefolk', 'Eveling', 'Adaborn', 'Unikind'],
        neutral: ['Sperace', 'Evofolk', 'Adaling', 'Uniborn']
      }
    };
  }

  private generateVoiceCharacteristics(theme: string): VoiceCharacteristics {
    const pitches: Array<'very_low' | 'low' | 'medium' | 'high' | 'very_high'> = ['very_low', 'low', 'medium', 'high', 'very_high'];
    const complexities: Array<'simple' | 'moderate' | 'complex' | 'highly_complex'> = ['simple', 'moderate', 'complex', 'highly_complex'];
    
    return {
      pitch_range: pitches[Math.floor(Math.random() * pitches.length)],
      speech_patterns: ['unique_cadence', 'species_terminology', 'adaptive_communication'],
      accent_characteristics: ['species_accent', 'evolutionary_sounds', 'unique_pronunciation'],
      communication_style: 'species_specific_style',
      language_complexity: complexities[Math.floor(Math.random() * complexities.length)]
    };
  }

  private generateGameplayBonuses(theme: string): GameplayBonuses {
    // Generate balanced bonuses that total around 100-150 points
    const bonuses = {
      technology_bonus: Math.floor(Math.random() * 60) - 20, // -20 to 40
      diplomacy_bonus: Math.floor(Math.random() * 60) - 20,
      military_bonus: Math.floor(Math.random() * 60) - 20,
      economic_bonus: Math.floor(Math.random() * 60) - 20,
      research_bonus: Math.floor(Math.random() * 60) - 20,
      cultural_bonus: Math.floor(Math.random() * 60) - 20,
      special_abilities: ['species_mastery', 'unique_advantage', 'evolutionary_trait']
    };

    return bonuses;
  }
}

// Singleton instance
let speciesGenerator: SpeciesGenerator;

export function getSpeciesGenerator(): SpeciesGenerator {
  if (!speciesGenerator) {
    speciesGenerator = new SpeciesGenerator();
  }
  return speciesGenerator;
}

export function initializeSpeciesGenerator(): void {
  speciesGenerator = new SpeciesGenerator();
  console.log('🧬 Species Generator initialized');
}
