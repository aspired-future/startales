/**
 * Entertainment, Culture & Tourism Industry Knobs
 * Controls various aspects of cultural development, entertainment venues, and tourism
 */

export interface EntertainmentTourismKnobs {
  // Cultural Development
  cultural_heritage_preservation: number;     // 0-100: Investment in preserving cultural sites and traditions
  artistic_expression_freedom: number;       // 0-100: Freedom for artists and cultural creators
  cultural_diversity_promotion: number;      // 0-100: Support for diverse cultural expressions
  traditional_arts_funding: number;          // 0-100: Government funding for traditional arts
  modern_arts_innovation: number;            // 0-100: Support for contemporary and experimental arts
  cultural_education_emphasis: number;       // 0-100: Integration of culture in education systems
  
  // Entertainment Industry
  entertainment_venue_development: number;   // 0-100: Investment in theaters, stadiums, arenas
  entertainment_content_regulation: number;  // 0-100: Government oversight of entertainment content
  celebrity_culture_influence: number;       // 0-100: Impact of celebrity culture on society
  sports_industry_investment: number;        // 0-100: Funding for professional sports and facilities
  gaming_industry_support: number;           // 0-100: Support for video game and digital entertainment
  live_performance_promotion: number;        // 0-100: Support for concerts, theater, live events
  
  // Tourism Infrastructure
  tourism_infrastructure_investment: number; // 0-100: Hotels, transport, tourist facilities
  natural_attraction_conservation: number;   // 0-100: Protecting natural tourist sites
  historical_site_maintenance: number;       // 0-100: Upkeep of historical and cultural sites
  tourist_safety_measures: number;           // 0-100: Security and safety for tourists
  tourism_marketing_budget: number;          // 0-100: Promotion and advertising for tourism
  sustainable_tourism_practices: number;     // 0-100: Environmental responsibility in tourism
  
  // Economic Integration
  entertainment_tax_incentives: number;      // 0-100: Tax benefits for entertainment businesses
  tourism_visa_accessibility: number;        // 0-100: Ease of obtaining tourist visas
  cultural_export_promotion: number;         // 0-100: Promoting cultural products internationally
  entertainment_employment_programs: number; // 0-100: Job training in entertainment/tourism
  tourism_revenue_reinvestment: number;      // 0-100: Reinvesting tourism profits into infrastructure
  cultural_intellectual_property: number;    // 0-100: Protection of cultural and artistic IP
  
  // Social Impact
  community_cultural_participation: number;  // 0-100: Encouraging local cultural involvement
  cultural_identity_strengthening: number;   // 0-100: Reinforcing national/regional identity
  intercultural_exchange_programs: number;   // 0-100: Programs for cultural exchange
  entertainment_accessibility: number;       // 0-100: Making entertainment accessible to all citizens
  cultural_tourism_authenticity: number;     // 0-100: Maintaining authentic cultural experiences
  entertainment_industry_ethics: number;     // 0-100: Ethical standards in entertainment business
  
  // Innovation & Technology
  digital_entertainment_platforms: number;   // 0-100: Support for streaming, VR, digital content
  cultural_technology_integration: number;   // 0-100: Using tech to preserve and share culture
  virtual_tourism_development: number;       // 0-100: VR/AR tourism experiences
  entertainment_data_analytics: number;      // 0-100: Using data to understand audience preferences
  cultural_ai_applications: number;          // 0-100: AI in cultural preservation and creation
  smart_tourism_systems: number;             // 0-100: IoT and smart systems for tourism
  
  lastUpdated: number;
}

export const DEFAULT_ENTERTAINMENT_TOURISM_KNOBS: EntertainmentTourismKnobs = {
  // Cultural Development
  cultural_heritage_preservation: 70,
  artistic_expression_freedom: 75,
  cultural_diversity_promotion: 65,
  traditional_arts_funding: 60,
  modern_arts_innovation: 55,
  cultural_education_emphasis: 65,
  
  // Entertainment Industry
  entertainment_venue_development: 60,
  entertainment_content_regulation: 40,
  celebrity_culture_influence: 50,
  sports_industry_investment: 55,
  gaming_industry_support: 45,
  live_performance_promotion: 60,
  
  // Tourism Infrastructure
  tourism_infrastructure_investment: 65,
  natural_attraction_conservation: 75,
  historical_site_maintenance: 70,
  tourist_safety_measures: 80,
  tourism_marketing_budget: 50,
  sustainable_tourism_practices: 60,
  
  // Economic Integration
  entertainment_tax_incentives: 45,
  tourism_visa_accessibility: 60,
  cultural_export_promotion: 50,
  entertainment_employment_programs: 55,
  tourism_revenue_reinvestment: 65,
  cultural_intellectual_property: 70,
  
  // Social Impact
  community_cultural_participation: 60,
  cultural_identity_strengthening: 65,
  intercultural_exchange_programs: 55,
  entertainment_accessibility: 60,
  cultural_tourism_authenticity: 70,
  entertainment_industry_ethics: 65,
  
  // Innovation & Technology
  digital_entertainment_platforms: 50,
  cultural_technology_integration: 45,
  virtual_tourism_development: 35,
  entertainment_data_analytics: 40,
  cultural_ai_applications: 30,
  smart_tourism_systems: 40,
  
  lastUpdated: Date.now()
};

export const ENTERTAINMENT_TOURISM_AI_PROMPTS = {
  cultural_heritage_preservation: "How should we balance preserving our cultural heritage with modern development needs?",
  artistic_expression_freedom: "What level of artistic freedom should we allow while maintaining social cohesion?",
  cultural_diversity_promotion: "How can we celebrate cultural diversity while maintaining national unity?",
  traditional_arts_funding: "Should we prioritize funding for traditional arts or let market forces decide?",
  modern_arts_innovation: "How much should we invest in experimental and contemporary artistic expressions?",
  cultural_education_emphasis: "How important is cultural education in our overall education strategy?",
  
  entertainment_venue_development: "What types of entertainment venues should we prioritize for development?",
  entertainment_content_regulation: "How much should we regulate entertainment content for social values?",
  celebrity_culture_influence: "Should we encourage or limit the influence of celebrity culture on society?",
  sports_industry_investment: "How much should we invest in professional sports and athletic facilities?",
  gaming_industry_support: "Should we support the gaming industry as a legitimate entertainment sector?",
  live_performance_promotion: "How can we best support live entertainment and performance arts?",
  
  tourism_infrastructure_investment: "What tourism infrastructure investments will provide the best returns?",
  natural_attraction_conservation: "How do we balance tourism development with environmental conservation?",
  historical_site_maintenance: "What's the right level of investment in maintaining historical sites?",
  tourist_safety_measures: "How can we ensure tourist safety without creating an oppressive atmosphere?",
  tourism_marketing_budget: "How much should we spend on promoting our civilization as a tourist destination?",
  sustainable_tourism_practices: "How can we develop tourism that doesn't harm our environment or culture?",
  
  entertainment_tax_incentives: "Should we offer tax incentives to attract entertainment businesses?",
  tourism_visa_accessibility: "How easy should it be for tourists to visit our civilization?",
  cultural_export_promotion: "How can we best promote our cultural products in international markets?",
  entertainment_employment_programs: "Should we create special job training programs for entertainment industries?",
  tourism_revenue_reinvestment: "How much tourism revenue should we reinvest in tourism infrastructure?",
  cultural_intellectual_property: "How strictly should we protect our cultural and artistic intellectual property?",
  
  community_cultural_participation: "How can we encourage more citizens to participate in cultural activities?",
  cultural_identity_strengthening: "How important is it to strengthen our unique cultural identity?",
  intercultural_exchange_programs: "Should we promote cultural exchange with other civilizations?",
  entertainment_accessibility: "How can we make entertainment accessible to all economic classes?",
  cultural_tourism_authenticity: "How do we maintain authentic cultural experiences for tourists?",
  entertainment_industry_ethics: "What ethical standards should we enforce in the entertainment industry?",
  
  digital_entertainment_platforms: "How should we support digital and streaming entertainment platforms?",
  cultural_technology_integration: "How can technology help us preserve and share our culture?",
  virtual_tourism_development: "Should we invest in virtual reality tourism experiences?",
  entertainment_data_analytics: "How can we use data to better understand and serve entertainment audiences?",
  cultural_ai_applications: "What role should AI play in cultural preservation and creation?",
  smart_tourism_systems: "How can smart technology improve the tourist experience?"
};

export const ENTERTAINMENT_TOURISM_KNOB_CATEGORIES = {
  "Cultural Development": [
    "cultural_heritage_preservation",
    "artistic_expression_freedom", 
    "cultural_diversity_promotion",
    "traditional_arts_funding",
    "modern_arts_innovation",
    "cultural_education_emphasis"
  ],
  "Entertainment Industry": [
    "entertainment_venue_development",
    "entertainment_content_regulation",
    "celebrity_culture_influence", 
    "sports_industry_investment",
    "gaming_industry_support",
    "live_performance_promotion"
  ],
  "Tourism Infrastructure": [
    "tourism_infrastructure_investment",
    "natural_attraction_conservation",
    "historical_site_maintenance",
    "tourist_safety_measures", 
    "tourism_marketing_budget",
    "sustainable_tourism_practices"
  ],
  "Economic Integration": [
    "entertainment_tax_incentives",
    "tourism_visa_accessibility",
    "cultural_export_promotion",
    "entertainment_employment_programs",
    "tourism_revenue_reinvestment", 
    "cultural_intellectual_property"
  ],
  "Social Impact": [
    "community_cultural_participation",
    "cultural_identity_strengthening",
    "intercultural_exchange_programs",
    "entertainment_accessibility",
    "cultural_tourism_authenticity",
    "entertainment_industry_ethics"
  ],
  "Innovation & Technology": [
    "digital_entertainment_platforms",
    "cultural_technology_integration", 
    "virtual_tourism_development",
    "entertainment_data_analytics",
    "cultural_ai_applications",
    "smart_tourism_systems"
  ]
};
