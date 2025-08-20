/**
 * Visual Systems Integration - Type Definitions
 * 
 * Defines comprehensive types for AI-generated graphics and videos with visual
 * consistency management, progressive enhancement, and cross-media coherence.
 */

// ===== CORE VISUAL TYPES =====

export interface VisualAsset {
  id: string;
  name: string;
  type: VisualAssetType;
  category: VisualCategory;
  format: MediaFormat;
  url: string;
  metadata: VisualMetadata;
  consistency: ConsistencyProfile;
  generation: GenerationInfo;
  usage: UsageTracking;
  quality: QualityMetrics;
}

export type VisualAssetType = 
  | 'IMAGE' | 'VIDEO' | 'ANIMATION' | 'SPRITE' | 'TEXTURE' | 'MODEL'
  | 'ICON' | 'BACKGROUND' | 'PORTRAIT' | 'LANDSCAPE' | 'UI_ELEMENT';

export type VisualCategory = 
  | 'CHARACTER' | 'SPECIES' | 'PLANET' | 'CITY' | 'SPACESHIP' | 'UNIT'
  | 'TOOL' | 'WEAPON' | 'BUILDING' | 'ENVIRONMENT' | 'EFFECT'
  | 'UI' | 'LOGO' | 'INTERFACE' | 'CUTSCENE' | 'EVENT';

export type MediaFormat = 
  | 'PNG' | 'JPG' | 'WEBP' | 'SVG' | 'GIF' | 'MP4' | 'WEBM'
  | 'OBJ' | 'FBX' | 'GLTF' | 'JSON' | 'SPRITE_SHEET';

export interface VisualMetadata {
  width: number;
  height: number;
  duration?: number; // for videos/animations
  fileSize: number;
  resolution: Resolution;
  aspectRatio: string;
  colorProfile: ColorProfile;
  tags: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resolution {
  width: number;
  height: number;
  dpi: number;
  quality: QualityLevel;
}

export type QualityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA' | 'ADAPTIVE';

export interface ColorProfile {
  primaryColors: string[];
  secondaryColors: string[];
  accentColors: string[];
  colorScheme: ColorScheme;
  brightness: number;
  contrast: number;
  saturation: number;
}

export type ColorScheme = 'MONOCHROME' | 'ANALOGOUS' | 'COMPLEMENTARY' | 'TRIADIC' | 'CUSTOM';

// ===== CONSISTENCY MANAGEMENT =====

export interface ConsistencyProfile {
  id: string;
  name: string;
  type: ConsistencyType;
  rules: ConsistencyRule[];
  styleGuide: StyleGuide;
  referenceAssets: string[]; // asset IDs
  variations: ConsistencyVariation[];
  enforcement: ConsistencyEnforcement;
}

export type ConsistencyType = 
  | 'CHARACTER_IDENTITY' | 'SPECIES_APPEARANCE' | 'ARCHITECTURAL_STYLE'
  | 'TECHNOLOGICAL_AESTHETIC' | 'ENVIRONMENTAL_THEME' | 'UI_CONSISTENCY'
  | 'BRAND_IDENTITY' | 'ARTISTIC_STYLE' | 'COLOR_PALETTE' | 'LIGHTING_STYLE';

export interface ConsistencyRule {
  id: string;
  name: string;
  description: string;
  type: RuleType;
  parameters: RuleParameters;
  weight: number; // importance 0-1
  enforcement: RuleEnforcement;
  violations: RuleViolation[];
}

export type RuleType = 
  | 'COLOR_CONSTRAINT' | 'STYLE_CONSTRAINT' | 'PROPORTION_CONSTRAINT'
  | 'LIGHTING_CONSTRAINT' | 'TEXTURE_CONSTRAINT' | 'COMPOSITION_CONSTRAINT'
  | 'IDENTITY_PRESERVATION' | 'VARIATION_LIMITS' | 'QUALITY_STANDARDS';

export interface RuleParameters {
  colorTolerance?: number;
  styleSimilarity?: number;
  proportionVariance?: number;
  lightingConsistency?: number;
  textureMatching?: number;
  compositionRules?: string[];
  identityFeatures?: IdentityFeature[];
  qualityThresholds?: QualityThreshold[];
}

export interface IdentityFeature {
  feature: FeatureType;
  importance: number;
  tolerance: number;
  description: string;
}

export type FeatureType = 
  | 'FACIAL_STRUCTURE' | 'BODY_PROPORTIONS' | 'COLOR_PATTERN'
  | 'DISTINCTIVE_MARKINGS' | 'CLOTHING_STYLE' | 'ARCHITECTURAL_ELEMENTS'
  | 'TECHNOLOGICAL_DESIGN' | 'ENVIRONMENTAL_CHARACTERISTICS';

export interface QualityThreshold {
  metric: QualityMetric;
  minimum: number;
  target: number;
  maximum: number;
}

export type QualityMetric = 
  | 'RESOLUTION' | 'SHARPNESS' | 'COLOR_ACCURACY' | 'COMPOSITION'
  | 'LIGHTING_QUALITY' | 'DETAIL_LEVEL' | 'ARTISTIC_QUALITY' | 'TECHNICAL_QUALITY';

export type RuleEnforcement = 'STRICT' | 'MODERATE' | 'FLEXIBLE' | 'ADVISORY';

export interface RuleViolation {
  ruleId: string;
  assetId: string;
  severity: ViolationSeverity;
  description: string;
  detectedAt: Date;
  resolved: boolean;
  resolution?: string;
}

export type ViolationSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';

export interface StyleGuide {
  id: string;
  name: string;
  description: string;
  artDirection: ArtDirection;
  colorPalettes: ColorPalette[];
  typography: Typography;
  layoutPrinciples: LayoutPrinciple[];
  visualHierarchy: VisualHierarchy;
  brandElements: BrandElement[];
}

export interface ArtDirection {
  style: ArtStyle;
  mood: ArtMood;
  theme: ArtTheme;
  influences: ArtInfluence[];
  techniques: ArtTechnique[];
}

export type ArtStyle = 
  | 'REALISTIC' | 'STYLIZED' | 'CARTOON' | 'PIXEL_ART' | 'MINIMALIST'
  | 'CYBERPUNK' | 'STEAMPUNK' | 'SCI_FI' | 'FANTASY' | 'RETRO_FUTURISTIC';

export type ArtMood = 
  | 'HEROIC' | 'DARK' | 'MYSTERIOUS' | 'BRIGHT' | 'GRITTY'
  | 'WHIMSICAL' | 'SERIOUS' | 'DRAMATIC' | 'PEACEFUL' | 'INTENSE';

export type ArtTheme = 
  | 'SPACE_EXPLORATION' | 'GALACTIC_EMPIRE' | 'ALIEN_CIVILIZATIONS'
  | 'TECHNOLOGICAL_ADVANCEMENT' | 'POLITICAL_INTRIGUE' | 'SOCIAL_DYNAMICS'
  | 'ECONOMIC_SYSTEMS' | 'CULTURAL_DIVERSITY' | 'ENVIRONMENTAL_CHALLENGES';

export interface ArtInfluence {
  source: string;
  description: string;
  weight: number;
  examples: string[];
}

export interface ArtTechnique {
  name: string;
  description: string;
  application: TechniqueApplication[];
  parameters: TechniqueParameters;
}

export interface TechniqueApplication {
  assetType: VisualAssetType;
  effectiveness: number;
  requirements: string[];
}

export interface TechniqueParameters {
  intensity: number;
  blendMode?: string;
  opacity?: number;
  customSettings?: Record<string, any>;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
  usage: PaletteUsage[];
}

export interface PaletteUsage {
  context: string;
  colors: string[];
  description: string;
}

export interface Typography {
  fonts: FontDefinition[];
  hierarchy: TypographyHierarchy[];
  spacing: SpacingRules;
}

export interface FontDefinition {
  name: string;
  family: string;
  weights: number[];
  styles: FontStyle[];
  usage: FontUsage[];
}

export type FontStyle = 'NORMAL' | 'ITALIC' | 'OBLIQUE';

export interface FontUsage {
  context: string;
  size: number;
  weight: number;
  style: FontStyle;
  color: string;
}

export interface TypographyHierarchy {
  level: number;
  name: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface SpacingRules {
  baseUnit: number;
  scale: number[];
  margins: SpacingDefinition[];
  padding: SpacingDefinition[];
}

export interface SpacingDefinition {
  context: string;
  value: number;
  unit: SpacingUnit;
}

export type SpacingUnit = 'PX' | 'EM' | 'REM' | 'PERCENT' | 'VW' | 'VH';

export interface LayoutPrinciple {
  name: string;
  description: string;
  rules: LayoutRule[];
  examples: LayoutExample[];
}

export interface LayoutRule {
  property: string;
  value: string | number;
  condition?: string;
}

export interface LayoutExample {
  context: string;
  description: string;
  implementation: string;
}

export interface VisualHierarchy {
  levels: HierarchyLevel[];
  principles: HierarchyPrinciple[];
}

export interface HierarchyLevel {
  level: number;
  name: string;
  importance: number;
  visualWeight: number;
  techniques: string[];
}

export interface HierarchyPrinciple {
  name: string;
  description: string;
  application: string[];
}

export interface BrandElement {
  type: BrandElementType;
  name: string;
  description: string;
  assets: string[]; // asset IDs
  usage: BrandUsage[];
}

export type BrandElementType = 'LOGO' | 'ICON' | 'PATTERN' | 'TEXTURE' | 'SYMBOL' | 'WATERMARK';

export interface BrandUsage {
  context: string;
  placement: string;
  size: string;
  opacity: number;
  variations: string[];
}

export interface ConsistencyVariation {
  id: string;
  name: string;
  description: string;
  type: VariationType;
  parameters: VariationParameters;
  limits: VariationLimits;
  examples: string[]; // asset IDs
}

export type VariationType = 
  | 'INDIVIDUAL_VARIATION' | 'CONTEXTUAL_ADAPTATION' | 'TEMPORAL_CHANGE'
  | 'ENVIRONMENTAL_ADAPTATION' | 'CULTURAL_VARIATION' | 'TECHNOLOGICAL_EVOLUTION';

export interface VariationParameters {
  intensity: number; // 0-1
  frequency: number; // how often variations occur
  scope: VariationScope;
  constraints: VariationConstraint[];
}

export type VariationScope = 'GLOBAL' | 'REGIONAL' | 'LOCAL' | 'INDIVIDUAL';

export interface VariationConstraint {
  type: ConstraintType;
  value: number;
  description: string;
}

export type ConstraintType = 
  | 'COLOR_DEVIATION' | 'SHAPE_DEVIATION' | 'SIZE_DEVIATION'
  | 'STYLE_DEVIATION' | 'COMPOSITION_DEVIATION' | 'QUALITY_MINIMUM';

export interface VariationLimits {
  maxDeviation: number;
  minSimilarity: number;
  qualityThreshold: number;
  approvalRequired: boolean;
}

export interface ConsistencyEnforcement {
  enabled: boolean;
  strictness: EnforcementStrictness;
  autoCorrection: boolean;
  humanReview: boolean;
  qualityGates: QualityGate[];
  feedback: FeedbackSystem;
}

export type EnforcementStrictness = 'PERMISSIVE' | 'BALANCED' | 'STRICT' | 'RIGID';

export interface QualityGate {
  stage: GenerationStage;
  requirements: QualityRequirement[];
  autoPass: boolean;
  reviewRequired: boolean;
}

export type GenerationStage = 
  | 'CONCEPT' | 'DRAFT' | 'REFINEMENT' | 'FINAL' | 'POST_PROCESSING';

export interface QualityRequirement {
  metric: QualityMetric;
  threshold: number;
  weight: number;
  description: string;
}

export interface FeedbackSystem {
  enabled: boolean;
  collectUserFeedback: boolean;
  automaticImprovement: boolean;
  feedbackChannels: FeedbackChannel[];
  analytics: FeedbackAnalytics;
}

export interface FeedbackChannel {
  type: FeedbackType;
  enabled: boolean;
  weight: number;
}

export type FeedbackType = 'USER_RATING' | 'USAGE_ANALYTICS' | 'A_B_TESTING' | 'EXPERT_REVIEW';

export interface FeedbackAnalytics {
  averageRating: number;
  usageFrequency: number;
  userPreferences: UserPreference[];
  improvementSuggestions: ImprovementSuggestion[];
}

export interface UserPreference {
  category: string;
  preference: string;
  strength: number;
  userCount: number;
}

export interface ImprovementSuggestion {
  area: string;
  suggestion: string;
  priority: number;
  estimatedImpact: number;
}

// ===== GENERATION SYSTEM =====

export interface GenerationRequest {
  id: string;
  type: VisualAssetType;
  category: VisualCategory;
  prompt: GenerationPrompt;
  constraints: GenerationConstraints;
  consistency: ConsistencyRequirements;
  quality: QualityRequirements;
  options: GenerationOptions;
  priority: RequestPriority;
  requestedBy: string;
  timestamp: Date;
}

export interface GenerationPrompt {
  text: string;
  style: PromptStyle;
  mood: PromptMood;
  details: PromptDetail[];
  negativePrompts: string[];
  referenceImages?: string[]; // asset IDs or URLs
  inspiration: PromptInspiration[];
}

export interface PromptStyle {
  artistic: ArtStyle;
  technical: TechnicalStyle;
  composition: CompositionStyle;
  lighting: LightingStyle;
  color: ColorStyle;
}

export interface TechnicalStyle {
  renderingEngine: RenderingEngine;
  quality: QualityLevel;
  optimization: OptimizationLevel;
  format: MediaFormat;
  compression: CompressionSettings;
}

export type RenderingEngine = 
  | 'PHOTOREALISTIC' | 'STYLIZED' | 'CARTOON' | 'PIXEL_ART'
  | 'VECTOR' | 'PROCEDURAL' | 'HYBRID' | 'AI_ENHANCED';

export type OptimizationLevel = 'NONE' | 'BASIC' | 'STANDARD' | 'AGGRESSIVE' | 'MAXIMUM';

export interface CompressionSettings {
  quality: number; // 0-100
  format: MediaFormat;
  progressive: boolean;
  lossless: boolean;
}

export interface CompositionStyle {
  layout: LayoutType;
  framing: FramingType;
  perspective: PerspectiveType;
  focus: FocusType;
  balance: BalanceType;
}

export type LayoutType = 'CENTERED' | 'RULE_OF_THIRDS' | 'GOLDEN_RATIO' | 'DYNAMIC' | 'SYMMETRICAL';
export type FramingType = 'CLOSE_UP' | 'MEDIUM' | 'WIDE' | 'EXTREME_WIDE' | 'DETAIL';
export type PerspectiveType = 'FRONT' | 'SIDE' | 'THREE_QUARTER' | 'AERIAL' | 'ISOMETRIC';
export type FocusType = 'SHARP' | 'SOFT' | 'SELECTIVE' | 'DEEP' | 'SHALLOW';
export type BalanceType = 'SYMMETRICAL' | 'ASYMMETRICAL' | 'RADIAL' | 'DYNAMIC';

export interface LightingStyle {
  type: LightingType;
  direction: LightingDirection;
  intensity: number;
  color: string;
  shadows: ShadowStyle;
  ambient: AmbientLighting;
}

export type LightingType = 'NATURAL' | 'ARTIFICIAL' | 'DRAMATIC' | 'SOFT' | 'HARSH' | 'VOLUMETRIC';
export type LightingDirection = 'FRONT' | 'BACK' | 'SIDE' | 'TOP' | 'BOTTOM' | 'MULTIPLE';

export interface ShadowStyle {
  enabled: boolean;
  intensity: number;
  softness: number;
  color: string;
}

export interface AmbientLighting {
  enabled: boolean;
  intensity: number;
  color: string;
  source: AmbientSource;
}

export type AmbientSource = 'SKY' | 'ENVIRONMENT' | 'ARTIFICIAL' | 'MIXED';

export interface ColorStyle {
  palette: string; // palette ID
  saturation: number;
  brightness: number;
  contrast: number;
  temperature: ColorTemperature;
  harmony: ColorHarmony;
}

export type ColorTemperature = 'COOL' | 'NEUTRAL' | 'WARM' | 'MIXED';
export type ColorHarmony = 'MONOCHROMATIC' | 'ANALOGOUS' | 'COMPLEMENTARY' | 'TRIADIC' | 'SPLIT_COMPLEMENTARY';

export interface PromptMood {
  emotional: EmotionalTone;
  atmospheric: AtmosphericMood;
  energy: EnergyLevel;
  tension: TensionLevel;
}

export type EmotionalTone = 
  | 'JOYFUL' | 'MELANCHOLIC' | 'MYSTERIOUS' | 'HEROIC' | 'MENACING'
  | 'PEACEFUL' | 'CHAOTIC' | 'HOPEFUL' | 'DESPERATE' | 'TRIUMPHANT';

export type AtmosphericMood = 
  | 'BRIGHT' | 'DARK' | 'MISTY' | 'CLEAR' | 'STORMY'
  | 'SERENE' | 'OMINOUS' | 'ETHEREAL' | 'GRITTY' | 'PRISTINE';

export type EnergyLevel = 'CALM' | 'MODERATE' | 'HIGH' | 'INTENSE' | 'EXPLOSIVE';
export type TensionLevel = 'RELAXED' | 'MILD' | 'MODERATE' | 'HIGH' | 'EXTREME';

export interface PromptDetail {
  aspect: DetailAspect;
  description: string;
  importance: number;
  specificity: SpecificityLevel;
}

export type DetailAspect = 
  | 'APPEARANCE' | 'CLOTHING' | 'EQUIPMENT' | 'ENVIRONMENT' | 'POSE'
  | 'EXPRESSION' | 'LIGHTING' | 'BACKGROUND' | 'FOREGROUND' | 'ATMOSPHERE';

export type SpecificityLevel = 'VAGUE' | 'GENERAL' | 'SPECIFIC' | 'DETAILED' | 'PRECISE';

export interface PromptInspiration {
  source: InspirationSource;
  reference: string;
  weight: number;
  description: string;
}

export type InspirationSource = 
  | 'EXISTING_ASSET' | 'REFERENCE_IMAGE' | 'ART_MOVEMENT' | 'CULTURAL_REFERENCE'
  | 'HISTORICAL_PERIOD' | 'FICTIONAL_WORK' | 'NATURAL_PHENOMENON' | 'ARCHITECTURAL_STYLE';

export interface GenerationConstraints {
  technical: TechnicalConstraints;
  creative: CreativeConstraints;
  consistency: ConsistencyConstraints;
  performance: PerformanceConstraints;
  legal: LegalConstraints;
}

export interface TechnicalConstraints {
  maxResolution: Resolution;
  maxFileSize: number;
  supportedFormats: MediaFormat[];
  colorDepth: number;
  compressionLimits: CompressionLimits;
}

export interface CompressionLimits {
  maxCompression: number;
  qualityFloor: number;
  preserveAlpha: boolean;
  progressiveEncoding: boolean;
}

export interface CreativeConstraints {
  styleRestrictions: StyleRestriction[];
  contentFilters: ContentFilter[];
  appropriatenessLevel: AppropriatenessLevel;
  culturalSensitivity: CulturalSensitivity;
}

export interface StyleRestriction {
  type: RestrictionType;
  description: string;
  severity: RestrictionSeverity;
}

export type RestrictionType = 
  | 'CONTENT_TYPE' | 'ARTISTIC_STYLE' | 'COLOR_USAGE' | 'COMPOSITION'
  | 'SUBJECT_MATTER' | 'CULTURAL_ELEMENTS' | 'BRAND_COMPLIANCE';

export type RestrictionSeverity = 'ADVISORY' | 'MODERATE' | 'STRICT' | 'ABSOLUTE';

export interface ContentFilter {
  type: FilterType;
  enabled: boolean;
  strictness: FilterStrictness;
  customRules: FilterRule[];
}

export type FilterType = 
  | 'VIOLENCE' | 'ADULT_CONTENT' | 'CULTURAL_SENSITIVITY' | 'BRAND_SAFETY'
  | 'COPYRIGHT' | 'TRADEMARK' | 'POLITICAL' | 'RELIGIOUS';

export type FilterStrictness = 'PERMISSIVE' | 'MODERATE' | 'STRICT' | 'MAXIMUM';

export interface FilterRule {
  pattern: string;
  action: FilterAction;
  description: string;
}

export type FilterAction = 'WARN' | 'MODIFY' | 'REJECT' | 'REVIEW';

export type AppropriatenessLevel = 'GENERAL' | 'TEEN' | 'MATURE' | 'ADULT';

export interface CulturalSensitivity {
  enabled: boolean;
  regions: string[];
  guidelines: CulturalGuideline[];
  reviewRequired: boolean;
}

export interface CulturalGuideline {
  culture: string;
  guidelines: string[];
  restrictions: string[];
  alternatives: string[];
}

export interface ConsistencyConstraints {
  profileId: string;
  strictness: EnforcementStrictness;
  referenceAssets: string[];
  allowedVariations: AllowedVariation[];
  qualityMatching: QualityMatching;
}

export interface AllowedVariation {
  type: VariationType;
  maxDeviation: number;
  context: string[];
}

export interface QualityMatching {
  enabled: boolean;
  tolerance: number;
  metrics: QualityMetric[];
  autoAdjust: boolean;
}

export interface PerformanceConstraints {
  maxGenerationTime: number; // seconds
  maxRetries: number;
  resourceLimits: ResourceLimits;
  cachingStrategy: CachingStrategy;
}

export interface ResourceLimits {
  maxMemory: number; // MB
  maxCPU: number; // percentage
  maxGPU: number; // percentage
  maxBandwidth: number; // MB/s
}

export interface CachingStrategy {
  enabled: boolean;
  ttl: number; // seconds
  maxSize: number; // MB
  strategy: CacheStrategy;
}

export type CacheStrategy = 'LRU' | 'LFU' | 'FIFO' | 'CUSTOM';

export interface LegalConstraints {
  copyrightCompliance: boolean;
  trademarkAvoidance: boolean;
  licenseRequirements: LicenseRequirement[];
  attributionNeeded: boolean;
  commercialUse: boolean;
}

export interface LicenseRequirement {
  type: LicenseType;
  terms: string[];
  attribution: string;
  restrictions: string[];
}

export type LicenseType = 'PUBLIC_DOMAIN' | 'CREATIVE_COMMONS' | 'ROYALTY_FREE' | 'LICENSED' | 'CUSTOM';

export interface ConsistencyRequirements {
  profileId: string;
  referenceAssets: string[];
  similarityThreshold: number;
  identityPreservation: IdentityPreservation;
  variationAllowance: VariationAllowance;
}

export interface IdentityPreservation {
  features: IdentityFeature[];
  strictness: number; // 0-1
  tolerance: number; // 0-1
  criticalFeatures: string[];
}

export interface VariationAllowance {
  enabled: boolean;
  maxDeviation: number;
  allowedTypes: VariationType[];
  contextualAdaptation: boolean;
}

export interface QualityRequirements {
  minResolution: Resolution;
  minQuality: QualityLevel;
  metrics: QualityMetric[];
  thresholds: QualityThreshold[];
  enhancement: QualityEnhancement;
}

export interface QualityEnhancement {
  enabled: boolean;
  upscaling: UpscalingSettings;
  denoising: DenoisingSettings;
  sharpening: SharpeningSettings;
  colorCorrection: ColorCorrectionSettings;
}

export interface UpscalingSettings {
  enabled: boolean;
  algorithm: UpscalingAlgorithm;
  maxScale: number;
  preserveDetails: boolean;
}

export type UpscalingAlgorithm = 'BICUBIC' | 'LANCZOS' | 'AI_ENHANCED' | 'SUPER_RESOLUTION';

export interface DenoisingSettings {
  enabled: boolean;
  strength: number;
  preserveDetails: boolean;
  algorithm: DenoisingAlgorithm;
}

export type DenoisingAlgorithm = 'GAUSSIAN' | 'BILATERAL' | 'NON_LOCAL_MEANS' | 'AI_DENOISING';

export interface SharpeningSettings {
  enabled: boolean;
  strength: number;
  radius: number;
  threshold: number;
}

export interface ColorCorrectionSettings {
  enabled: boolean;
  autoBalance: boolean;
  saturationBoost: number;
  contrastAdjustment: number;
  brightnessAdjustment: number;
}

export interface GenerationOptions {
  batchSize: number;
  variations: number;
  iterativeRefinement: boolean;
  userFeedbackLoop: boolean;
  qualityAssurance: QualityAssuranceOptions;
  postProcessing: PostProcessingOptions;
}

export interface QualityAssuranceOptions {
  enabled: boolean;
  automaticQC: boolean;
  humanReview: boolean;
  multipleGenerations: boolean;
  bestSelection: boolean;
}

export interface PostProcessingOptions {
  enabled: boolean;
  enhancement: boolean;
  optimization: boolean;
  formatConversion: boolean;
  watermarking: WatermarkingOptions;
}

export interface WatermarkingOptions {
  enabled: boolean;
  type: WatermarkType;
  opacity: number;
  position: WatermarkPosition;
  content: string;
}

export type WatermarkType = 'TEXT' | 'LOGO' | 'PATTERN' | 'INVISIBLE';
export type WatermarkPosition = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'CENTER';

export type RequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';

// ===== GENERATION RESPONSE =====

export interface GenerationResponse {
  id: string;
  requestId: string;
  status: GenerationStatus;
  assets: GeneratedAsset[];
  metadata: GenerationMetadata;
  quality: GenerationQuality;
  consistency: ConsistencyAnalysis;
  errors: GenerationError[];
  warnings: GenerationWarning[];
  timestamp: Date;
}

export type GenerationStatus = 
  | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'RETRYING';

export interface GeneratedAsset {
  id: string;
  url: string;
  format: MediaFormat;
  metadata: VisualMetadata;
  quality: AssetQuality;
  consistency: AssetConsistency;
  variations: AssetVariation[];
  postProcessing: PostProcessingResult[];
}

export interface AssetQuality {
  overall: number; // 0-1
  technical: TechnicalQuality;
  artistic: ArtisticQuality;
  consistency: ConsistencyScore;
  usability: UsabilityScore;
}

export interface TechnicalQuality {
  resolution: number;
  sharpness: number;
  colorAccuracy: number;
  compression: number;
  artifacts: number; // lower is better
}

export interface ArtisticQuality {
  composition: number;
  lighting: number;
  color: number;
  style: number;
  creativity: number;
}

export interface ConsistencyScore {
  overall: number;
  identity: number;
  style: number;
  quality: number;
  brand: number;
}

export interface UsabilityScore {
  clarity: number;
  readability: number;
  accessibility: number;
  performance: number;
  compatibility: number;
}

export interface AssetConsistency {
  profileId: string;
  similarity: number;
  identityMatch: number;
  styleMatch: number;
  qualityMatch: number;
  violations: ConsistencyViolation[];
}

export interface ConsistencyViolation {
  ruleId: string;
  severity: ViolationSeverity;
  description: string;
  suggestion: string;
  autoFixable: boolean;
}

export interface AssetVariation {
  id: string;
  type: VariationType;
  description: string;
  deviation: number;
  quality: number;
  approved: boolean;
}

export interface PostProcessingResult {
  operation: PostProcessingOperation;
  success: boolean;
  improvement: number;
  description: string;
  before?: ProcessingMetrics;
  after?: ProcessingMetrics;
}

export type PostProcessingOperation = 
  | 'UPSCALING' | 'DENOISING' | 'SHARPENING' | 'COLOR_CORRECTION'
  | 'COMPRESSION' | 'FORMAT_CONVERSION' | 'WATERMARKING' | 'OPTIMIZATION';

export interface ProcessingMetrics {
  fileSize: number;
  quality: number;
  resolution: Resolution;
  performance: number;
}

export interface GenerationMetadata {
  generationTime: number;
  modelUsed: string;
  promptTokens: number;
  iterations: number;
  retries: number;
  qualityChecks: QualityCheckResult[];
  consistencyChecks: ConsistencyCheckResult[];
  postProcessingSteps: string[];
}

export interface QualityCheckResult {
  metric: QualityMetric;
  score: number;
  passed: boolean;
  threshold: number;
  description: string;
}

export interface ConsistencyCheckResult {
  rule: string;
  score: number;
  passed: boolean;
  threshold: number;
  description: string;
}

export interface GenerationQuality {
  overall: number;
  technical: number;
  artistic: number;
  consistency: number;
  usability: number;
  improvements: QualityImprovement[];
}

export interface QualityImprovement {
  area: string;
  suggestion: string;
  impact: number;
  effort: number;
}

export interface ConsistencyAnalysis {
  profileMatch: number;
  identityPreservation: number;
  styleConsistency: number;
  qualityConsistency: number;
  violations: ConsistencyViolation[];
  recommendations: ConsistencyRecommendation[];
}

export interface ConsistencyRecommendation {
  type: RecommendationType;
  description: string;
  priority: number;
  autoApplicable: boolean;
}

export type RecommendationType = 
  | 'STYLE_ADJUSTMENT' | 'COLOR_CORRECTION' | 'COMPOSITION_CHANGE'
  | 'QUALITY_ENHANCEMENT' | 'IDENTITY_PRESERVATION' | 'VARIATION_REDUCTION';

export interface GenerationError {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  recoverable: boolean;
  suggestion?: string;
}

export type ErrorCode = 
  | 'INVALID_PROMPT' | 'GENERATION_FAILED' | 'QUALITY_TOO_LOW' | 'CONSISTENCY_VIOLATION'
  | 'RESOURCE_LIMIT' | 'TIMEOUT' | 'MODEL_ERROR' | 'POST_PROCESSING_FAILED';

export type ErrorSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface GenerationWarning {
  type: WarningType;
  message: string;
  suggestion: string;
  impact: number;
}

export type WarningType = 
  | 'QUALITY_CONCERN' | 'CONSISTENCY_RISK' | 'PERFORMANCE_IMPACT'
  | 'STYLE_DEVIATION' | 'RESOURCE_USAGE' | 'COMPATIBILITY_ISSUE';

// ===== VISUAL CONTENT TYPES =====

export interface CharacterVisual extends VisualAsset {
  category: 'CHARACTER';
  character: CharacterInfo;
  poses: CharacterPose[];
  expressions: CharacterExpression[];
  outfits: CharacterOutfit[];
}

export interface CharacterInfo {
  id: string;
  name: string;
  species: string;
  age: number;
  gender: string;
  role: string;
  personality: CharacterPersonality;
  physicalTraits: PhysicalTrait[];
  backstory: string;
}

export interface CharacterPersonality {
  traits: string[];
  alignment: MoralAlignment;
  motivations: string[];
  fears: string[];
  quirks: string[];
}

export type MoralAlignment = 
  | 'LAWFUL_GOOD' | 'NEUTRAL_GOOD' | 'CHAOTIC_GOOD'
  | 'LAWFUL_NEUTRAL' | 'TRUE_NEUTRAL' | 'CHAOTIC_NEUTRAL'
  | 'LAWFUL_EVIL' | 'NEUTRAL_EVIL' | 'CHAOTIC_EVIL';

export interface PhysicalTrait {
  feature: string;
  description: string;
  distinctiveness: number;
  consistency: TraitConsistency;
}

export interface TraitConsistency {
  mustPreserve: boolean;
  variationAllowed: number;
  contextualAdaptation: boolean;
}

export interface CharacterPose {
  name: string;
  description: string;
  mood: EmotionalTone;
  context: string[];
  difficulty: number;
}

export interface CharacterExpression {
  name: string;
  emotion: EmotionalTone;
  intensity: number;
  description: string;
  facialFeatures: FacialFeature[];
}

export interface FacialFeature {
  feature: string;
  adjustment: string;
  intensity: number;
}

export interface CharacterOutfit {
  name: string;
  style: string;
  context: string[];
  colors: string[];
  accessories: string[];
}

export interface SpeciesVisual extends VisualAsset {
  category: 'SPECIES';
  species: SpeciesInfo;
  variants: SpeciesVariant[];
  culturalElements: CulturalElement[];
}

export interface SpeciesInfo {
  id: string;
  name: string;
  classification: string;
  homeworld: string;
  physiology: SpeciesPhysiology;
  culture: SpeciesCulture;
  technology: SpeciesTechnology;
}

export interface SpeciesPhysiology {
  bodyType: string;
  averageHeight: number;
  averageWeight: number;
  lifespan: number;
  distinctiveFeatures: string[];
  biologicalTraits: string[];
}

export interface SpeciesCulture {
  values: string[];
  traditions: string[];
  socialStructure: string;
  artStyle: string;
  architecture: string;
}

export interface SpeciesTechnology {
  level: string;
  specializations: string[];
  uniqueTechnologies: string[];
  aesthetics: string;
}

export interface SpeciesVariant {
  name: string;
  description: string;
  frequency: number;
  traits: PhysicalTrait[];
  culturalDifferences: string[];
}

export interface CulturalElement {
  type: CulturalElementType;
  name: string;
  description: string;
  significance: number;
  visualRepresentation: string[];
}

export type CulturalElementType = 
  | 'CLOTHING' | 'ARCHITECTURE' | 'ART' | 'SYMBOLS' | 'COLORS'
  | 'PATTERNS' | 'RITUALS' | 'TECHNOLOGY' | 'ENVIRONMENT';

export interface EnvironmentVisual extends VisualAsset {
  category: 'PLANET' | 'CITY' | 'ENVIRONMENT';
  environment: EnvironmentInfo;
  weather: WeatherSystem;
  lighting: LightingSystem;
  atmosphere: AtmosphereInfo;
}

export interface EnvironmentInfo {
  id: string;
  name: string;
  type: EnvironmentType;
  biome: BiomeType;
  climate: ClimateInfo;
  geography: GeographyInfo;
  ecosystem: EcosystemInfo;
}

export type EnvironmentType = 
  | 'PLANET_SURFACE' | 'SPACE_STATION' | 'CITY' | 'WILDERNESS'
  | 'UNDERGROUND' | 'UNDERWATER' | 'AERIAL' | 'DIMENSIONAL';

export type BiomeType = 
  | 'FOREST' | 'DESERT' | 'OCEAN' | 'MOUNTAIN' | 'ARCTIC'
  | 'GRASSLAND' | 'SWAMP' | 'VOLCANIC' | 'CRYSTALLINE' | 'ARTIFICIAL';

export interface ClimateInfo {
  temperature: TemperatureRange;
  humidity: number;
  precipitation: number;
  seasons: SeasonInfo[];
  extremeWeather: WeatherEvent[];
}

export interface TemperatureRange {
  min: number;
  max: number;
  average: number;
  unit: TemperatureUnit;
}

export type TemperatureUnit = 'CELSIUS' | 'FAHRENHEIT' | 'KELVIN';

export interface SeasonInfo {
  name: string;
  duration: number;
  characteristics: string[];
  visualChanges: VisualChange[];
}

export interface VisualChange {
  aspect: string;
  description: string;
  intensity: number;
}

export interface WeatherEvent {
  type: string;
  frequency: number;
  intensity: number;
  visualEffects: VisualEffect[];
}

export interface VisualEffect {
  type: EffectType;
  description: string;
  parameters: EffectParameters;
  duration?: number;
}

export interface EffectParameters {
  intensity: number;
  color?: string;
  opacity?: number;
  speed?: number;
  direction?: string;
  customParams?: Record<string, any>;
}

export interface GeographyInfo {
  terrain: TerrainFeature[];
  landmarks: Landmark[];
  waterBodies: WaterBody[];
  elevation: ElevationInfo;
}

export interface TerrainFeature {
  type: string;
  coverage: number; // percentage
  characteristics: string[];
  visualProperties: VisualProperty[];
}

export interface VisualProperty {
  property: string;
  value: string | number;
  variability: number;
}

export interface Landmark {
  name: string;
  type: string;
  significance: number;
  visualDescription: string;
  uniqueFeatures: string[];
}

export interface WaterBody {
  type: string;
  size: number;
  characteristics: string[];
  visualProperties: VisualProperty[];
}

export interface ElevationInfo {
  minElevation: number;
  maxElevation: number;
  averageElevation: number;
  reliefIntensity: number;
}

export interface EcosystemInfo {
  flora: FloraInfo[];
  fauna: FaunaInfo[];
  biodiversity: number;
  dominantSpecies: string[];
}

export interface FloraInfo {
  type: string;
  abundance: number;
  characteristics: string[];
  visualTraits: string[];
}

export interface FaunaInfo {
  type: string;
  population: number;
  behavior: string[];
  visualTraits: string[];
}

export interface WeatherSystem {
  currentWeather: WeatherCondition;
  forecast: WeatherForecast[];
  patterns: WeatherPattern[];
  effects: WeatherEffect[];
}

export interface WeatherForecast {
  time: Date;
  condition: WeatherCondition;
  probability: number;
  visualChanges: VisualChange[];
}

export interface WeatherPattern {
  name: string;
  frequency: number;
  seasonality: string[];
  visualSignature: string;
}

export interface WeatherEffect {
  type: string;
  intensity: number;
  visualImpact: VisualImpact;
  duration: number;
}

export interface VisualImpact {
  lighting: LightingChange;
  visibility: VisibilityChange;
  colorShift: ColorShift;
  atmosphericEffects: AtmosphericEffect[];
}

export interface LightingChange {
  brightness: number;
  color: string;
  direction: string;
  quality: string;
}

export interface VisibilityChange {
  range: number;
  clarity: number;
  distortion: number;
}

export interface ColorShift {
  hue: number;
  saturation: number;
  brightness: number;
  temperature: number;
}

export interface AtmosphericEffect {
  type: string;
  intensity: number;
  distribution: string;
  movement: MovementInfo;
}

export interface MovementInfo {
  speed: number;
  direction: string;
  pattern: string;
  variability: number;
}

export interface LightingSystem {
  primary: LightSource;
  secondary: LightSource[];
  ambient: AmbientLighting;
  dynamic: DynamicLighting;
}

export interface LightSource {
  type: LightSourceType;
  position: LightPosition;
  properties: LightProperties;
  behavior: LightBehavior;
}

export type LightSourceType = 'SUN' | 'MOON' | 'STAR' | 'ARTIFICIAL' | 'BIOLUMINESCENT' | 'MAGICAL';

export interface LightPosition {
  x: number;
  y: number;
  z: number;
  relative: boolean;
}

export interface LightProperties {
  intensity: number;
  color: string;
  temperature: number;
  falloff: FalloffType;
  shadows: boolean;
}

export type FalloffType = 'LINEAR' | 'QUADRATIC' | 'INVERSE_SQUARE' | 'CONSTANT';

export interface LightBehavior {
  static: boolean;
  movement: MovementPattern;
  flickering: FlickeringPattern;
  cycling: CyclingPattern;
}

export interface MovementPattern {
  type: MovementType;
  speed: number;
  path: MovementPath;
  duration: number;
}

export type MovementType = 'CIRCULAR' | 'LINEAR' | 'RANDOM' | 'SCRIPTED' | 'REACTIVE';

export interface MovementPath {
  points: LightPosition[];
  interpolation: InterpolationType;
  looping: boolean;
}

export type InterpolationType = 'LINEAR' | 'SMOOTH' | 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_OUT';

export interface FlickeringPattern {
  enabled: boolean;
  frequency: number;
  intensity: number;
  randomness: number;
}

export interface CyclingPattern {
  enabled: boolean;
  period: number;
  phases: CyclingPhase[];
}

export interface CyclingPhase {
  duration: number;
  properties: Partial<LightProperties>;
  transition: TransitionType;
}

export type TransitionType = 'INSTANT' | 'FADE' | 'SMOOTH' | 'STEPPED';

export interface DynamicLighting {
  enabled: boolean;
  timeOfDay: TimeOfDayLighting;
  weather: WeatherLighting;
  events: EventLighting[];
}

export interface TimeOfDayLighting {
  enabled: boolean;
  cycle: LightingCycle[];
  duration: number;
  smooth: boolean;
}

export interface LightingCycle {
  time: number; // 0-24 hours
  lighting: LightingState;
  transition: number; // transition duration
}

export interface LightingState {
  ambient: AmbientLighting;
  directional: DirectionalLighting;
  color: ColorState;
  intensity: number;
}

export interface DirectionalLighting {
  direction: LightDirection;
  intensity: number;
  color: string;
  shadows: ShadowSettings;
}

export interface LightDirection {
  x: number;
  y: number;
  z: number;
}

export interface ShadowSettings {
  enabled: boolean;
  intensity: number;
  softness: number;
  length: number;
  color: string;
}

export interface ColorState {
  temperature: number;
  tint: string;
  saturation: number;
  brightness: number;
}

export interface WeatherLighting {
  conditions: WeatherLightingCondition[];
  transitions: WeatherTransition[];
}

export interface WeatherLightingCondition {
  weather: WeatherType;
  lighting: LightingState;
  visibility: number;
  atmosphere: AtmosphericLighting;
}

export interface AtmosphericLighting {
  scattering: ScatteringEffect;
  absorption: AbsorptionEffect;
  emission: EmissionEffect;
}

export interface ScatteringEffect {
  type: ScatteringType;
  intensity: number;
  color: string;
  distribution: string;
}

export type ScatteringType = 'RAYLEIGH' | 'MIE' | 'GEOMETRIC' | 'MULTIPLE';

export interface AbsorptionEffect {
  intensity: number;
  spectrum: string[];
  distance: number;
}

export interface EmissionEffect {
  sources: EmissionSource[];
  intensity: number;
  color: string;
}

export interface EmissionSource {
  type: string;
  location: string;
  intensity: number;
  color: string;
}

export interface WeatherTransition {
  from: WeatherType;
  to: WeatherType;
  duration: number;
  steps: TransitionStep[];
}

export interface TransitionStep {
  progress: number; // 0-1
  lighting: Partial<LightingState>;
  effects: VisualEffect[];
}

export interface EventLighting {
  event: string;
  trigger: LightingTrigger;
  lighting: LightingState;
  duration: number;
  priority: number;
}

export interface LightingTrigger {
  type: TriggerType;
  condition: string;
  parameters: Record<string, any>;
}

export type TriggerType = 'TIME_BASED' | 'EVENT_BASED' | 'CONDITION_BASED' | 'MANUAL';

export interface AtmosphereInfo {
  composition: AtmosphericComposition;
  density: number;
  visibility: VisibilityInfo;
  effects: AtmosphericEffect[];
}

export interface AtmosphericComposition {
  gases: GasComponent[];
  particles: ParticleComponent[];
  pressure: number;
  breathable: boolean;
}

export interface GasComponent {
  gas: string;
  percentage: number;
  visualEffect?: string;
}

export interface ParticleComponent {
  type: string;
  density: number;
  size: number;
  visualEffect: string;
}

export interface VisibilityInfo {
  range: number;
  clarity: number;
  distortion: number;
  colorShift: ColorShift;
}

// ===== VIDEO GENERATION =====

export interface VideoAsset extends VisualAsset {
  type: 'VIDEO';
  video: VideoInfo;
  scenes: VideoScene[];
  transitions: VideoTransition[];
  audio: AudioInfo;
}

export interface VideoInfo {
  duration: number;
  framerate: number;
  resolution: Resolution;
  codec: VideoCodec;
  bitrate: number;
  chapters: VideoChapter[];
}

export type VideoCodec = 'H264' | 'H265' | 'VP9' | 'AV1' | 'WEBM';

export interface VideoChapter {
  name: string;
  startTime: number;
  endTime: number;
  description: string;
  keyframes: Keyframe[];
}

export interface Keyframe {
  time: number;
  description: string;
  visualElements: VisualElement[];
}

export interface VisualElement {
  type: ElementType;
  position: ElementPosition;
  properties: ElementProperties;
  animation: AnimationInfo;
}

export type ElementType = 
  | 'CHARACTER' | 'OBJECT' | 'BACKGROUND' | 'EFFECT' | 'TEXT'
  | 'UI_ELEMENT' | 'PARTICLE' | 'LIGHT' | 'CAMERA';

export interface ElementPosition {
  x: number;
  y: number;
  z?: number;
  rotation?: Rotation;
  scale?: Scale;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

export interface Scale {
  x: number;
  y: number;
  z?: number;
}

export interface ElementProperties {
  opacity: number;
  color?: string;
  size?: Size;
  material?: MaterialProperties;
  physics?: PhysicsProperties;
}

export interface Size {
  width: number;
  height: number;
  depth?: number;
}

export interface MaterialProperties {
  diffuse: string;
  specular: string;
  normal?: string;
  roughness: number;
  metallic: number;
  emission?: string;
}

export interface PhysicsProperties {
  mass: number;
  friction: number;
  restitution: number;
  gravity: boolean;
  collision: boolean;
}

export interface AnimationInfo {
  type: AnimationType;
  duration: number;
  easing: EasingType;
  keyframes: AnimationKeyframe[];
  looping: boolean;
}

export type AnimationType = 
  | 'POSITION' | 'ROTATION' | 'SCALE' | 'OPACITY' | 'COLOR'
  | 'MORPH' | 'PARTICLE' | 'CAMERA' | 'LIGHTING' | 'COMPOSITE';

export type EasingType = 
  | 'LINEAR' | 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_OUT'
  | 'BOUNCE' | 'ELASTIC' | 'BACK' | 'CUSTOM';

export interface AnimationKeyframe {
  time: number;
  value: any;
  interpolation: InterpolationType;
}

export interface VideoScene {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  camera: CameraInfo;
  lighting: SceneLighting;
  elements: SceneElement[];
  effects: SceneEffect[];
}

export interface CameraInfo {
  position: ElementPosition;
  target: ElementPosition;
  fieldOfView: number;
  movement: CameraMovement;
  settings: CameraSettings;
}

export interface CameraMovement {
  type: CameraMovementType;
  path: MovementPath;
  speed: number;
  smoothing: number;
}

export type CameraMovementType = 
  | 'STATIC' | 'PAN' | 'TILT' | 'DOLLY' | 'ZOOM' | 'ORBIT'
  | 'FOLLOW' | 'SHAKE' | 'SCRIPTED' | 'CINEMATIC';

export interface CameraSettings {
  exposure: number;
  aperture: number;
  focusDistance: number;
  depthOfField: boolean;
  motionBlur: boolean;
}

export interface SceneLighting {
  setup: LightingSetup;
  mood: LightingMood;
  dynamic: boolean;
  changes: LightingChange[];
}

export interface LightingSetup {
  key: LightSource;
  fill: LightSource[];
  rim: LightSource[];
  background: LightSource[];
}

export interface LightingMood {
  overall: EmotionalTone;
  intensity: number;
  contrast: number;
  warmth: number;
}

export interface SceneElement {
  id: string;
  asset: VisualAsset;
  transform: ElementTransform;
  animation: ElementAnimation;
  interactions: ElementInteraction[];
}

export interface ElementTransform {
  position: ElementPosition;
  visible: boolean;
  layerOrder: number;
  blendMode: BlendMode;
}

export type BlendMode = 
  | 'NORMAL' | 'MULTIPLY' | 'SCREEN' | 'OVERLAY' | 'SOFT_LIGHT'
  | 'HARD_LIGHT' | 'COLOR_DODGE' | 'COLOR_BURN' | 'DARKEN' | 'LIGHTEN';

export interface ElementAnimation {
  timeline: AnimationTimeline;
  properties: AnimatedProperty[];
  triggers: AnimationTrigger[];
}

export interface AnimationTimeline {
  startTime: number;
  endTime: number;
  keyframes: TimelineKeyframe[];
}

export interface TimelineKeyframe {
  time: number;
  properties: Record<string, any>;
  easing: EasingType;
}

export interface AnimatedProperty {
  property: string;
  startValue: any;
  endValue: any;
  curve: AnimationCurve;
}

export interface AnimationCurve {
  type: CurveType;
  controlPoints: ControlPoint[];
  tension: number;
}

export type CurveType = 'BEZIER' | 'SPLINE' | 'LINEAR' | 'STEPPED' | 'CUSTOM';

export interface ControlPoint {
  x: number;
  y: number;
  tangentIn?: ControlPoint;
  tangentOut?: ControlPoint;
}

export interface AnimationTrigger {
  event: string;
  condition?: string;
  delay: number;
  action: TriggerAction;
}

export interface TriggerAction {
  type: ActionType;
  parameters: Record<string, any>;
  duration?: number;
}

export type ActionType = 'PLAY' | 'PAUSE' | 'STOP' | 'REVERSE' | 'LOOP' | 'GOTO' | 'CALLBACK';

export interface ElementInteraction {
  type: InteractionType;
  trigger: InteractionTrigger;
  response: InteractionResponse;
  feedback: InteractionFeedback;
}

export type InteractionType = 'CLICK' | 'HOVER' | 'DRAG' | 'SCROLL' | 'GESTURE' | 'VOICE' | 'GAZE';

export interface InteractionTrigger {
  area: InteractionArea;
  sensitivity: number;
  conditions: InteractionCondition[];
}

export interface InteractionArea {
  shape: AreaShape;
  bounds: AreaBounds;
  priority: number;
}

export type AreaShape = 'RECTANGLE' | 'CIRCLE' | 'POLYGON' | 'CUSTOM';

export interface AreaBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  points?: ElementPosition[];
}

export interface InteractionCondition {
  type: string;
  value: any;
  operator: string;
}

export interface InteractionResponse {
  immediate: ImmediateResponse[];
  delayed: DelayedResponse[];
  animation: ResponseAnimation;
}

export interface ImmediateResponse {
  type: ResponseType;
  parameters: Record<string, any>;
}

export type ResponseType = 
  | 'VISUAL_CHANGE' | 'ANIMATION_TRIGGER' | 'SOUND_EFFECT'
  | 'STATE_CHANGE' | 'NAVIGATION' | 'CALLBACK' | 'DATA_UPDATE';

export interface DelayedResponse {
  delay: number;
  response: ImmediateResponse;
  condition?: string;
}

export interface ResponseAnimation {
  type: AnimationType;
  duration: number;
  easing: EasingType;
  properties: AnimatedProperty[];
}

export interface InteractionFeedback {
  visual: VisualFeedback;
  audio: AudioFeedback;
  haptic: HapticFeedback;
}

export interface VisualFeedback {
  type: VisualFeedbackType;
  intensity: number;
  duration: number;
  color?: string;
}

export type VisualFeedbackType = 'HIGHLIGHT' | 'GLOW' | 'PULSE' | 'SHAKE' | 'SCALE' | 'COLOR_CHANGE';

export interface AudioFeedback {
  enabled: boolean;
  sound: string;
  volume: number;
  pitch: number;
}

export interface HapticFeedback {
  enabled: boolean;
  pattern: HapticPattern;
  intensity: number;
  duration: number;
}

export type HapticPattern = 'CLICK' | 'DOUBLE_CLICK' | 'LONG_PRESS' | 'PULSE' | 'CUSTOM';

export interface SceneEffect {
  id: string;
  name: string;
  type: EffectType;
  properties: EffectProperties;
  timing: EffectTiming;
  layering: EffectLayering;
}

export interface EffectProperties {
  intensity: number;
  color?: string;
  opacity: number;
  blendMode: BlendMode;
  parameters: Record<string, any>;
}

export interface EffectTiming {
  startTime: number;
  duration: number;
  fadeIn: number;
  fadeOut: number;
  looping: boolean;
}

export interface EffectLayering {
  layer: number;
  mask?: MaskInfo;
  clipping?: ClippingInfo;
}

export interface MaskInfo {
  type: MaskType;
  source: string;
  invert: boolean;
  feather: number;
}

export type MaskType = 'ALPHA' | 'LUMINANCE' | 'COLOR' | 'SHAPE' | 'CUSTOM';

export interface ClippingInfo {
  enabled: boolean;
  bounds: AreaBounds;
  softEdges: boolean;
}

export interface VideoTransition {
  id: string;
  name: string;
  type: TransitionType;
  duration: number;
  properties: TransitionProperties;
  timing: TransitionTiming;
}

export interface TransitionProperties {
  easing: EasingType;
  direction?: string;
  intensity: number;
  customParams?: Record<string, any>;
}

export interface TransitionTiming {
  startTime: number;
  overlap: number;
  delay: number;
}

export interface AudioInfo {
  enabled: boolean;
  tracks: AudioTrack[];
  mixing: AudioMixing;
  effects: AudioEffect[];
}

export interface AudioTrack {
  id: string;
  name: string;
  type: AudioTrackType;
  source: string;
  properties: AudioProperties;
  timing: AudioTiming;
}

export type AudioTrackType = 'MUSIC' | 'DIALOGUE' | 'SFX' | 'AMBIENT' | 'NARRATION';

export interface AudioProperties {
  volume: number;
  pan: number;
  pitch: number;
  speed: number;
  loop: boolean;
}

export interface AudioTiming {
  startTime: number;
  endTime: number;
  fadeIn: number;
  fadeOut: number;
}

export interface AudioMixing {
  masterVolume: number;
  trackLevels: Record<string, number>;
  compression: CompressionSettings;
  equalization: EqualizationSettings;
}

export interface EqualizationSettings {
  enabled: boolean;
  bands: EQBand[];
  preset?: string;
}

export interface EQBand {
  frequency: number;
  gain: number;
  q: number;
}

export interface AudioEffect {
  type: AudioEffectType;
  parameters: AudioEffectParameters;
  enabled: boolean;
  wetness: number;
}

export type AudioEffectType = 
  | 'REVERB' | 'DELAY' | 'CHORUS' | 'FLANGER' | 'DISTORTION'
  | 'FILTER' | 'COMPRESSOR' | 'LIMITER' | 'GATE' | 'PITCH_SHIFT';

export interface AudioEffectParameters {
  [key: string]: number | string | boolean;
}

// ===== GENERATION INFO =====

export interface GenerationInfo {
  model: AIModel;
  prompt: GenerationPrompt;
  parameters: GenerationParameters;
  iterations: number;
  seed: number;
  timestamp: Date;
  processingTime: number;
  cost: GenerationCost;
}

export interface AIModel {
  provider: AIProvider;
  model: string;
  version: string;
  capabilities: ModelCapability[];
  limitations: ModelLimitation[];
}

export type AIProvider = 
  | 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'MICROSOFT' | 'ADOBE'
  | 'STABILITY_AI' | 'MIDJOURNEY' | 'RUNWAY' | 'CUSTOM';

export interface ModelCapability {
  type: CapabilityType;
  level: CapabilityLevel;
  description: string;
}

export type CapabilityType = 
  | 'IMAGE_GENERATION' | 'VIDEO_GENERATION' | 'STYLE_TRANSFER'
  | 'UPSCALING' | 'INPAINTING' | 'OUTPAINTING' | 'ANIMATION'
  | 'CONSISTENCY_PRESERVATION' | 'BATCH_PROCESSING';

export type CapabilityLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface ModelLimitation {
  type: LimitationType;
  description: string;
  workaround?: string;
}

export type LimitationType = 
  | 'RESOLUTION_LIMIT' | 'STYLE_LIMITATION' | 'CONSISTENCY_CHALLENGE'
  | 'PROCESSING_TIME' | 'COST_FACTOR' | 'QUALITY_VARIANCE';

export interface GenerationParameters {
  steps: number;
  guidance: number;
  strength: number;
  noise: number;
  sampler: SamplerType;
  scheduler: SchedulerType;
  customParams: Record<string, any>;
}

export type SamplerType = 
  | 'DDIM' | 'DDPM' | 'EULER' | 'EULER_A' | 'HEUN' | 'DPM'
  | 'PLMS' | 'KLMS' | 'CUSTOM';

export type SchedulerType = 
  | 'LINEAR' | 'COSINE' | 'COSINE_RESTARTS' | 'POLYNOMIAL'
  | 'EXPONENTIAL' | 'CUSTOM';

export interface GenerationCost {
  computeUnits: number;
  apiCalls: number;
  processingTime: number;
  storageUsed: number;
  totalCost: number;
  currency: string;
}

// ===== USAGE TRACKING =====

export interface UsageTracking {
  views: number;
  downloads: number;
  shares: number;
  ratings: UserRating[];
  contexts: UsageContext[];
  performance: UsagePerformance;
  analytics: UsageAnalytics;
}

export interface UserRating {
  userId: string;
  rating: number; // 1-5
  comment?: string;
  timestamp: Date;
  context: string;
}

export interface UsageContext {
  context: string;
  frequency: number;
  performance: ContextPerformance;
  userFeedback: ContextFeedback;
}

export interface ContextPerformance {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
}

export interface ContextFeedback {
  averageRating: number;
  commonIssues: string[];
  suggestions: string[];
}

export interface UsagePerformance {
  averageLoadTime: number;
  averageRenderTime: number;
  cacheEfficiency: number;
  errorRate: number;
  optimizationOpportunities: OptimizationOpportunity[];
}

export interface OptimizationOpportunity {
  area: string;
  description: string;
  estimatedImprovement: number;
  effort: number;
  priority: number;
}

export interface UsageAnalytics {
  popularityScore: number;
  trendingStatus: TrendingStatus;
  userSegments: UserSegment[];
  geographicUsage: GeographicUsage[];
  temporalPatterns: TemporalPattern[];
}

export type TrendingStatus = 'DECLINING' | 'STABLE' | 'GROWING' | 'VIRAL' | 'SEASONAL';

export interface UserSegment {
  segment: string;
  usage: number;
  preferences: UserPreference[];
  behavior: UserBehavior;
}

export interface UserBehavior {
  engagementTime: number;
  interactionRate: number;
  shareRate: number;
  returnRate: number;
}

export interface GeographicUsage {
  region: string;
  usage: number;
  preferences: RegionalPreference[];
  culturalAdaptations: CulturalAdaptation[];
}

export interface RegionalPreference {
  aspect: string;
  preference: string;
  strength: number;
}

export interface CulturalAdaptation {
  element: string;
  adaptation: string;
  reason: string;
  effectiveness: number;
}

export interface TemporalPattern {
  pattern: string;
  frequency: number;
  seasonality: SeasonalityInfo;
  trends: TrendInfo[];
}

export interface SeasonalityInfo {
  seasonal: boolean;
  peaks: TimePeak[];
  cycles: TimeCycle[];
}

export interface TimePeak {
  time: string;
  intensity: number;
  duration: number;
  reason: string;
}

export interface TimeCycle {
  period: string;
  amplitude: number;
  phase: number;
}

export interface TrendInfo {
  direction: TrendDirection;
  strength: number;
  duration: string;
  drivers: TrendDriver[];
}

export type TrendDirection = 'INCREASING' | 'DECREASING' | 'STABLE' | 'CYCLICAL';

export interface TrendDriver {
  factor: string;
  influence: number;
  description: string;
}

// ===== QUALITY METRICS =====

export interface QualityMetrics {
  overall: number;
  technical: TechnicalQuality;
  artistic: ArtisticQuality;
  consistency: ConsistencyScore;
  usability: UsabilityScore;
  performance: PerformanceMetrics;
  accessibility: AccessibilityMetrics;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage: number;
  networkUsage: number;
}

export interface AccessibilityMetrics {
  colorContrast: number;
  readability: number;
  alternativeText: boolean;
  keyboardNavigation: boolean;
  screenReaderCompatibility: boolean;
  visualIndicators: boolean;
}

// ===== SYSTEM CONFIGURATION =====

export interface VisualSystemConfig {
  generation: GenerationConfig;
  consistency: ConsistencyConfig;
  quality: QualityConfig;
  performance: PerformanceConfig;
  storage: StorageConfig;
  integration: IntegrationConfig;
}

export interface GenerationConfig {
  defaultModel: AIModel;
  fallbackModels: AIModel[];
  batchSize: number;
  maxConcurrent: number;
  retryPolicy: RetryPolicy;
  qualityGates: QualityGate[];
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: BackoffStrategy;
  retryConditions: RetryCondition[];
}

export type BackoffStrategy = 'FIXED' | 'LINEAR' | 'EXPONENTIAL' | 'CUSTOM';

export interface RetryCondition {
  errorType: string;
  shouldRetry: boolean;
  maxAttempts: number;
}

export interface ConsistencyConfig {
  defaultProfile: string;
  enforcementLevel: EnforcementStrictness;
  autoCorrection: boolean;
  humanReview: boolean;
  violationHandling: ViolationHandling;
}

export interface ViolationHandling {
  autoFix: boolean;
  escalation: EscalationPolicy;
  notification: NotificationPolicy;
  logging: LoggingPolicy;
}

export interface EscalationPolicy {
  enabled: boolean;
  thresholds: EscalationThreshold[];
  actions: EscalationAction[];
}

export interface EscalationThreshold {
  severity: ViolationSeverity;
  count: number;
  timeWindow: number;
}

export interface EscalationAction {
  type: ActionType;
  parameters: Record<string, any>;
  delay: number;
}

export interface NotificationPolicy {
  enabled: boolean;
  channels: NotificationChannel[];
  frequency: NotificationFrequency;
}

export interface NotificationChannel {
  type: ChannelType;
  enabled: boolean;
  recipients: string[];
}

export type ChannelType = 'EMAIL' | 'SLACK' | 'WEBHOOK' | 'IN_APP' | 'SMS';

export type NotificationFrequency = 'IMMEDIATE' | 'BATCHED' | 'DAILY' | 'WEEKLY';

export interface LoggingPolicy {
  enabled: boolean;
  level: LogLevel;
  retention: number; // days
  format: LogFormat;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
export type LogFormat = 'JSON' | 'TEXT' | 'STRUCTURED' | 'CUSTOM';

export interface QualityConfig {
  minQuality: QualityLevel;
  targetQuality: QualityLevel;
  qualityMetrics: QualityMetric[];
  enhancement: QualityEnhancementConfig;
}

export interface QualityEnhancementConfig {
  enabled: boolean;
  automatic: boolean;
  techniques: EnhancementTechnique[];
  thresholds: EnhancementThreshold[];
}

export interface EnhancementTechnique {
  name: string;
  type: EnhancementType;
  effectiveness: number;
  cost: number;
  applicability: ApplicabilityRule[];
}

export type EnhancementType = 
  | 'UPSCALING' | 'DENOISING' | 'SHARPENING' | 'COLOR_ENHANCEMENT'
  | 'CONTRAST_IMPROVEMENT' | 'DETAIL_ENHANCEMENT' | 'ARTIFACT_REMOVAL';

export interface ApplicabilityRule {
  condition: string;
  value: any;
  operator: string;
}

export interface EnhancementThreshold {
  metric: QualityMetric;
  threshold: number;
  action: EnhancementAction;
}

export type EnhancementAction = 'APPLY' | 'SKIP' | 'REVIEW' | 'ALTERNATIVE';

export interface PerformanceConfig {
  caching: CachingConfig;
  optimization: OptimizationConfig;
  monitoring: MonitoringConfig;
  scaling: ScalingConfig;
}

export interface CachingConfig {
  enabled: boolean;
  strategy: CacheStrategy;
  ttl: number;
  maxSize: number;
  compression: boolean;
}

export interface OptimizationConfig {
  enabled: boolean;
  techniques: OptimizationTechnique[];
  aggressive: boolean;
  qualityTrade: number;
}

export interface OptimizationTechnique {
  name: string;
  type: OptimizationType;
  savings: number;
  qualityImpact: number;
  applicability: string[];
}

export type OptimizationType = 
  | 'COMPRESSION' | 'FORMAT_OPTIMIZATION' | 'RESOLUTION_SCALING'
  | 'QUALITY_REDUCTION' | 'BATCH_PROCESSING' | 'LAZY_LOADING';

export interface MonitoringConfig {
  enabled: boolean;
  metrics: MonitoringMetric[];
  alerts: AlertConfig[];
  reporting: ReportingConfig;
}

export interface MonitoringMetric {
  name: string;
  type: MetricType;
  threshold: number;
  unit: string;
}

export type MetricType = 'COUNTER' | 'GAUGE' | 'HISTOGRAM' | 'TIMER';

export interface AlertConfig {
  condition: string;
  threshold: number;
  severity: AlertSeverity;
  actions: AlertAction[];
}

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AlertAction {
  type: ActionType;
  parameters: Record<string, any>;
  delay: number;
}

export interface ReportingConfig {
  enabled: boolean;
  frequency: ReportingFrequency;
  recipients: string[];
  format: ReportFormat;
}

export type ReportingFrequency = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type ReportFormat = 'PDF' | 'HTML' | 'JSON' | 'CSV';

export interface ScalingConfig {
  autoScaling: boolean;
  minInstances: number;
  maxInstances: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
}

export interface StorageConfig {
  provider: StorageProvider;
  buckets: StorageBucket[];
  cdn: CDNConfig;
  backup: BackupConfig;
}

export type StorageProvider = 'AWS_S3' | 'GOOGLE_CLOUD' | 'AZURE' | 'CLOUDFLARE' | 'LOCAL';

export interface StorageBucket {
  name: string;
  region: string;
  accessLevel: AccessLevel;
  encryption: boolean;
  versioning: boolean;
}

export type AccessLevel = 'PUBLIC' | 'PRIVATE' | 'RESTRICTED' | 'AUTHENTICATED';

export interface CDNConfig {
  enabled: boolean;
  provider: CDNProvider;
  regions: string[];
  caching: CDNCaching;
}

export type CDNProvider = 'CLOUDFLARE' | 'AWS_CLOUDFRONT' | 'GOOGLE_CDN' | 'AZURE_CDN';

export interface CDNCaching {
  ttl: number;
  compression: boolean;
  optimization: boolean;
  purging: PurgingPolicy;
}

export interface PurgingPolicy {
  automatic: boolean;
  triggers: PurgeTrigger[];
  retention: number;
}

export interface PurgeTrigger {
  event: string;
  condition: string;
  delay: number;
}

export interface BackupConfig {
  enabled: boolean;
  frequency: BackupFrequency;
  retention: number;
  encryption: boolean;
  verification: boolean;
}

export type BackupFrequency = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface IntegrationConfig {
  gameEngine: GameEngineIntegration;
  ui: UIIntegration;
  api: APIIntegration;
  external: ExternalIntegration[];
}

export interface GameEngineIntegration {
  enabled: boolean;
  engine: string;
  version: string;
  features: IntegrationFeature[];
}

export interface IntegrationFeature {
  name: string;
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface UIIntegration {
  framework: string;
  components: UIComponent[];
  theming: ThemingIntegration;
}

export interface UIComponent {
  name: string;
  type: ComponentType;
  properties: ComponentProperty[];
  events: ComponentEvent[];
}

export type ComponentType = 
  | 'IMAGE_VIEWER' | 'VIDEO_PLAYER' | 'GALLERY' | 'CAROUSEL'
  | 'MODAL' | 'TOOLTIP' | 'OVERLAY' | 'WIDGET';

export interface ComponentProperty {
  name: string;
  type: PropertyType;
  defaultValue: any;
  required: boolean;
}

export type PropertyType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'OBJECT' | 'ARRAY' | 'FUNCTION';

export interface ComponentEvent {
  name: string;
  description: string;
  parameters: EventParameter[];
}

export interface EventParameter {
  name: string;
  type: PropertyType;
  description: string;
}

export interface ThemingIntegration {
  enabled: boolean;
  themes: ThemeDefinition[];
  customization: ThemeCustomization;
}

export interface ThemeDefinition {
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, number>;
  components: Record<string, any>;
}

export interface ThemeCustomization {
  userCustomization: boolean;
  dynamicTheming: boolean;
  contextualTheming: boolean;
  accessibility: ThemeAccessibility;
}

export interface ThemeAccessibility {
  highContrast: boolean;
  colorBlindSupport: boolean;
  reducedMotion: boolean;
  largeText: boolean;
}

export interface APIIntegration {
  endpoints: APIEndpoint[];
  authentication: AuthenticationConfig;
  rateLimit: RateLimitConfig;
  versioning: VersioningConfig;
}

export interface APIEndpoint {
  path: string;
  method: HTTPMethod;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APIParameter {
  name: string;
  type: PropertyType;
  required: boolean;
  description: string;
  validation: ValidationRule[];
}

export interface ValidationRule {
  type: ValidationType;
  value: any;
  message: string;
}

export type ValidationType = 'REQUIRED' | 'MIN' | 'MAX' | 'PATTERN' | 'ENUM' | 'CUSTOM';

export interface APIResponse {
  status: number;
  description: string;
  schema: ResponseSchema;
  examples: ResponseExample[];
}

export interface ResponseSchema {
  type: PropertyType;
  properties: Record<string, SchemaProperty>;
  required: string[];
}

export interface SchemaProperty {
  type: PropertyType;
  description: string;
  format?: string;
  enum?: any[];
}

export interface ResponseExample {
  description: string;
  value: any;
}

export interface AuthenticationConfig {
  required: boolean;
  methods: AuthMethod[];
  tokenExpiry: number;
  refreshEnabled: boolean;
}

export type AuthMethod = 'API_KEY' | 'JWT' | 'OAUTH' | 'BASIC' | 'CUSTOM';

export interface RateLimitConfig {
  enabled: boolean;
  requests: number;
  window: number; // seconds
  burst: number;
  strategy: RateLimitStrategy;
}

export type RateLimitStrategy = 'FIXED_WINDOW' | 'SLIDING_WINDOW' | 'TOKEN_BUCKET' | 'LEAKY_BUCKET';

export interface VersioningConfig {
  strategy: VersioningStrategy;
  currentVersion: string;
  supportedVersions: string[];
  deprecationPolicy: DeprecationPolicy;
}

export type VersioningStrategy = 'URL_PATH' | 'HEADER' | 'QUERY_PARAM' | 'CONTENT_TYPE';

export interface DeprecationPolicy {
  warningPeriod: number; // days
  supportPeriod: number; // days
  migrationGuide: string;
}

export interface ExternalIntegration {
  name: string;
  type: IntegrationType;
  enabled: boolean;
  configuration: IntegrationConfiguration;
  healthCheck: HealthCheckConfig;
}

export type IntegrationType = 
  | 'AI_SERVICE' | 'STORAGE_SERVICE' | 'CDN_SERVICE' | 'ANALYTICS_SERVICE'
  | 'MONITORING_SERVICE' | 'NOTIFICATION_SERVICE' | 'CUSTOM_SERVICE';

export interface IntegrationConfiguration {
  endpoint: string;
  authentication: AuthenticationConfig;
  timeout: number;
  retries: number;
  customSettings: Record<string, any>;
}

export interface HealthCheckConfig {
  enabled: boolean;
  interval: number; // seconds
  timeout: number; // seconds
  healthyThreshold: number;
  unhealthyThreshold: number;
}
