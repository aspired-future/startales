/**
 * Character System Interfaces
 * 
 * Type definitions for the Dynamic Character System
 */

export interface DynamicCharacter {
  id: string;
  name: {
    first: string;
    last: string;
    title?: string;
    full_display: string;
  };
  category: string; // citizen, media, official, business, military, academic
  subcategory: string; // journalist, politician, CEO, etc.
  civilization_id: number;
  planet_id: number;
  city_id?: number;
  location: {
    current: string;
    home: string;
    workplace: string;
    favorite_places: string[];
  };
  demographics: {
    age: number;
    gender: string;
    species: string;
    social_class: string;
  };
  appearance: {
    physical_description: string;
    style_description: string;
    distinctive_features: string[];
    avatar_url: string;
  };
  personality: {
    core_traits: string[];
    values: string[];
    fears: string[];
    motivations: string[];
    quirks: string[];
    communication_style: string;
  };
  attributes: {
    intelligence: number;
    charisma: number;
    ambition: number;
    integrity: number;
    creativity: number;
    empathy: number;
    resilience: number;
    leadership: number;
    technical_skill: number;
    social_influence: number;
  };
  profession: {
    current_job: string;
    job_title: string;
    employer: string;
    industry: string;
    career_level: string;
    income_level: number;
    work_satisfaction: number;
  };
  background: {
    birthplace: string;
    education: string[];
    career_history: string[];
    major_life_events: string[];
    achievements: string[];
    failures: string[];
    secrets: any[];
  };
  skills: {
    [category: string]: {
      category: string;
      skills: { [skill: string]: number };
      certifications: string[];
      experience_years: number;
    };
  };
  relationships: {
    family: CharacterRelationship[];
    friends: CharacterRelationship[];
    colleagues: CharacterRelationship[];
    rivals: CharacterRelationship[];
  };
  social_media: {
    witter_handle: string;
    follower_count: number;
    posting_frequency: string;
    content_style: string[];
    influence_level: number;
  };
  opinions: {
    political_views: { [topic: string]: number };
    economic_views: { [topic: string]: number };
    social_views: { [topic: string]: number };
    current_mood: number;
    life_satisfaction: number;
  };
  status: {
    health: number;
    wealth: number;
    reputation: number;
    stress_level: number;
    energy_level: number;
    current_activity: string;
  };
  ai_behavior: {
    decision_making_style: string;
    risk_tolerance: number;
    adaptability: number;
    learning_rate: number;
    memory_retention: number;
    emotional_stability: number;
  };
  lifecycle: {
    created_at: Date;
    emergence_reason: string;
    life_stage: string;
    expected_lifespan: number;
    major_life_goals: string[];
    current_priorities: string[];
  };
  game_integration: {
    story_importance: string;
    player_interaction_history: PlayerInteraction[];
    plot_hooks: string[];
    available_for_recruitment: boolean;
    loyalty_to_player: number;
  };
  metadata: {
    generation_seed: string;
    template_used: string;
    last_updated: Date;
    update_frequency: string;
    tags: string[];
  };
}

export interface CharacterRelationship {
  character_id: string;
  relationship_type: string;
  strength: number; // -100 to 100
  history: string;
  current_status: string;
  last_interaction: Date;
}

export interface PlayerInteraction {
  interaction_id: string;
  interaction_type: string;
  date: Date;
  outcome: string;
  reputation_change: number;
  loyalty_change: number;
  notes: string;
}

export interface CharacterTemplate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  baseAttributes: {
    intelligence: number;
    charisma: number;
    ambition: number;
    integrity: number;
    creativity: number;
    empathy: number;
    resilience: number;
    leadership: number;
    technical_skill: number;
    social_influence: number;
  };
  professionPool: string[];
  skillSets: SkillSet[];
  personalityTraits: string[];
  emergenceConditions: EmergenceCondition[];
  storyImportance: number;
}

export interface SkillSet {
  category: string;
  skills: { [skill: string]: number };
  certifications: string[];
  experience_years: number;
}

export interface EmergenceCondition {
  condition_type: string;
  trigger_value: number;
  probability: number;
  context_requirements: string[];
}

export interface CharacterAnalytics {
  character_id: string;
  civilization_id: number;
  analytics_date: Date;
  social_influence_score: number;
  public_approval_rating: number;
  media_mentions: number;
  witter_engagement: number;
  relationship_network_size: number;
  professional_success_score: number;
  life_satisfaction_trend: number[];
  behavioral_consistency_score: number;
  story_involvement_level: number;
}

export interface CharacterEvent {
  id: string;
  character_id: string;
  event_type: string;
  event_category: string;
  description: string;
  date: Date;
  impact_level: number;
  affected_attributes: { [attribute: string]: number };
  affected_relationships: { [character_id: string]: number };
  public_visibility: boolean;
  media_coverage: boolean;
  player_involvement: boolean;
  consequences: string[];
}
