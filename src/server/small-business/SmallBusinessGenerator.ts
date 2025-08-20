/**
 * Small Business Generator
 * 
 * Procedural generation of realistic small businesses with authentic details
 */

import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { SmallBusiness, BusinessCategory, BusinessType, DistributionNetwork } from './smallBusinessInterfaces.js';

export interface BusinessGenerationContext {
  civilization_id: number;
  planet_id: number;
  city_id: number;
  economic_climate: 'recession' | 'stable' | 'growth' | 'boom';
  population_density: number;
  average_income: number;
  technology_level: number;
  regulatory_environment: 'strict' | 'moderate' | 'lenient';
  market_saturation: { [category: string]: number }; // 0-100
  local_preferences: string[];
  seasonal_factors: string[];
}

export interface BusinessTemplate {
  category: BusinessCategory;
  subcategory: string;
  typical_size: 'micro' | 'small' | 'medium';
  startup_cost_range: [number, number];
  revenue_potential: [number, number];
  skill_requirements: string[];
  common_products_services: string[];
  target_demographics: string[];
  seasonal_patterns: boolean;
  technology_dependence: number; // 0-100
  regulatory_complexity: number; // 0-100
  competition_level: number; // 0-100
}

export class SmallBusinessGenerator {
  private pool: Pool;
  private businessTemplates: Map<string, BusinessTemplate> = new Map();
  private businessNames: { [category: string]: string[] } = {};
  private ownerNames: string[] = [];

  constructor(pool: Pool) {
    this.pool = pool;
    this.initializeBusinessTemplates();
    this.initializeNameLists();
  }

  /**
   * Generate a complete small business ecosystem for a city
   */
  async generateCityBusinessEcosystem(
    context: BusinessGenerationContext,
    targetBusinessCount: number = 500,
    seed?: string
  ): Promise<{
    businesses: SmallBusiness[];
    distributionNetworks: DistributionNetwork[];
    totalGenerated: number;
    categoryDistribution: { [category: string]: number };
  }> {
    console.log(`🏪 Generating business ecosystem with ${targetBusinessCount} businesses for city ${context.city_id}`);
    
    const generationSeed = seed || `city_${context.city_id}_${Date.now()}`;
    
    // Calculate business distribution based on context
    const distribution = this.calculateBusinessDistribution(context, targetBusinessCount);
    
    const businesses: SmallBusiness[] = [];
    const categoryDistribution: { [category: string]: number } = {};
    
    // Generate businesses by category
    for (const [category, count] of Object.entries(distribution)) {
      console.log(`📦 Generating ${count} ${category} businesses`);
      
      const categoryBusinesses = await this.generateBusinessesByCategory(
        category as BusinessCategory,
        count,
        context,
        `${generationSeed}_${category}`
      );
      
      businesses.push(...categoryBusinesses);
      categoryDistribution[category] = categoryBusinesses.length;
    }
    
    // Generate distribution networks
    const distributionNetworks = await this.generateDistributionNetworks(
      businesses,
      context,
      `${generationSeed}_networks`
    );
    
    // Create supplier relationships between businesses
    await this.establishSupplierRelationships(businesses, context);
    
    console.log(`✅ Generated ${businesses.length} businesses and ${distributionNetworks.length} distribution networks`);
    
    return {
      businesses,
      distributionNetworks,
      totalGenerated: businesses.length,
      categoryDistribution
    };
  }

  /**
   * Generate businesses for a specific category
   */
  async generateBusinessesByCategory(
    category: BusinessCategory,
    count: number,
    context: BusinessGenerationContext,
    seed: string
  ): Promise<SmallBusiness[]> {
    const businesses: SmallBusiness[] = [];
    const templates = Array.from(this.businessTemplates.values()).filter(t => t.category === category);
    
    if (templates.length === 0) {
      console.warn(`⚠️ No templates found for category: ${category}`);
      return businesses;
    }
    
    for (let i = 0; i < count; i++) {
      try {
        const template = this.selectTemplateByMarketConditions(templates, context);
        const business = await this.generateBusinessFromTemplate(
          template,
          context,
          `${seed}_${i}`
        );
        businesses.push(business);
      } catch (error) {
        console.error(`❌ Error generating business ${i} for category ${category}:`, error);
      }
    }
    
    return businesses;
  }

  /**
   * Generate a single business from a template
   */
  async generateBusinessFromTemplate(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): Promise<SmallBusiness> {
    const businessId = uuidv4();
    
    // Generate basic business info
    const name = this.generateBusinessName(template, context, seed);
    const businessType = this.selectBusinessType(template, context);
    const location = this.generateBusinessLocation(template, context, seed);
    const owner = this.generateBusinessOwner(template, context, seed);
    
    // Generate financial information
    const financialInfo = this.generateFinancialInfo(template, context, seed);
    
    // Generate operations
    const operations = this.generateOperations(template, context, seed);
    
    // Generate products/services
    const productsServices = this.generateProductsServices(template, context, seed);
    
    // Generate employees
    const employees = this.generateEmployees(template, context, seed);
    
    // Generate market presence
    const marketPresence = this.generateMarketPresence(template, context, seed);
    
    // Generate business health metrics
    const businessHealth = this.calculateBusinessHealth(template, context, financialInfo, operations);
    
    // Generate growth metrics
    const growthMetrics = this.generateGrowthMetrics(template, context, seed);
    
    // Generate compliance status
    const compliance = this.generateComplianceStatus(template, context, seed);
    
    // Generate lifecycle information
    const lifecycle = this.generateLifecycle(template, context, seed);
    
    const business: SmallBusiness = {
      id: businessId,
      name,
      business_type: businessType,
      category: template.category,
      subcategory: template.subcategory,
      civilization_id: context.civilization_id,
      planet_id: context.planet_id,
      city_id: context.city_id,
      location,
      owner,
      employees,
      financial_info: financialInfo,
      operations,
      products_services: productsServices,
      suppliers: [], // Will be populated later
      customers: this.generateCustomerBase(template, context, seed),
      market_presence: marketPresence,
      business_health: businessHealth,
      growth_metrics: growthMetrics,
      compliance,
      lifecycle,
      metadata: {
        created_at: new Date(),
        last_updated: new Date(),
        data_sources: ['procedural_generation'],
        confidence_score: 85,
        update_frequency: 'weekly',
        tags: [template.category, template.subcategory, businessType],
        notes: [`Generated from template: ${template.category}_${template.subcategory}`]
      }
    };
    
    return business;
  }

  // Private helper methods

  private initializeBusinessTemplates(): void {
    // Retail businesses
    this.businessTemplates.set('retail_general', {
      category: 'retail',
      subcategory: 'general_store',
      typical_size: 'small',
      startup_cost_range: [25000, 75000],
      revenue_potential: [150000, 500000],
      skill_requirements: ['customer_service', 'inventory_management', 'basic_accounting'],
      common_products_services: ['groceries', 'household_items', 'personal_care', 'snacks'],
      target_demographics: ['families', 'young_adults', 'seniors'],
      seasonal_patterns: true,
      technology_dependence: 40,
      regulatory_complexity: 30,
      competition_level: 70
    });

    this.businessTemplates.set('retail_clothing', {
      category: 'retail',
      subcategory: 'clothing_store',
      typical_size: 'small',
      startup_cost_range: [30000, 100000],
      revenue_potential: [120000, 400000],
      skill_requirements: ['fashion_sense', 'customer_service', 'visual_merchandising'],
      common_products_services: ['casual_wear', 'formal_wear', 'accessories', 'alterations'],
      target_demographics: ['young_adults', 'professionals', 'fashion_conscious'],
      seasonal_patterns: true,
      technology_dependence: 35,
      regulatory_complexity: 25,
      competition_level: 80
    });

    // Food service businesses
    this.businessTemplates.set('food_restaurant', {
      category: 'food_service',
      subcategory: 'restaurant',
      typical_size: 'small',
      startup_cost_range: [50000, 200000],
      revenue_potential: [200000, 800000],
      skill_requirements: ['cooking', 'food_safety', 'customer_service', 'inventory_management'],
      common_products_services: ['meals', 'beverages', 'takeout', 'catering'],
      target_demographics: ['families', 'workers', 'tourists', 'food_enthusiasts'],
      seasonal_patterns: true,
      technology_dependence: 50,
      regulatory_complexity: 70,
      competition_level: 85
    });

    this.businessTemplates.set('food_cafe', {
      category: 'food_service',
      subcategory: 'cafe',
      typical_size: 'micro',
      startup_cost_range: [20000, 80000],
      revenue_potential: [80000, 300000],
      skill_requirements: ['barista_skills', 'customer_service', 'food_preparation'],
      common_products_services: ['coffee', 'pastries', 'light_meals', 'wifi_workspace'],
      target_demographics: ['students', 'remote_workers', 'coffee_lovers', 'casual_meetings'],
      seasonal_patterns: false,
      technology_dependence: 45,
      regulatory_complexity: 50,
      competition_level: 75
    });

    // Professional services
    this.businessTemplates.set('professional_consulting', {
      category: 'professional_services',
      subcategory: 'business_consulting',
      typical_size: 'micro',
      startup_cost_range: [5000, 25000],
      revenue_potential: [60000, 300000],
      skill_requirements: ['business_analysis', 'communication', 'industry_expertise'],
      common_products_services: ['strategy_consulting', 'process_improvement', 'training', 'auditing'],
      target_demographics: ['small_businesses', 'startups', 'corporations'],
      seasonal_patterns: false,
      technology_dependence: 70,
      regulatory_complexity: 40,
      competition_level: 60
    });

    this.businessTemplates.set('professional_accounting', {
      category: 'professional_services',
      subcategory: 'accounting_services',
      typical_size: 'small',
      startup_cost_range: [15000, 50000],
      revenue_potential: [80000, 400000],
      skill_requirements: ['accounting', 'tax_preparation', 'financial_analysis', 'compliance'],
      common_products_services: ['bookkeeping', 'tax_preparation', 'financial_planning', 'payroll'],
      target_demographics: ['small_businesses', 'individuals', 'freelancers'],
      seasonal_patterns: true,
      technology_dependence: 80,
      regulatory_complexity: 90,
      competition_level: 55
    });

    // Personal services
    this.businessTemplates.set('personal_salon', {
      category: 'personal_services',
      subcategory: 'beauty_salon',
      typical_size: 'micro',
      startup_cost_range: [20000, 60000],
      revenue_potential: [60000, 200000],
      skill_requirements: ['hair_styling', 'customer_service', 'beauty_techniques'],
      common_products_services: ['haircuts', 'styling', 'coloring', 'beauty_treatments'],
      target_demographics: ['women', 'men', 'professionals', 'special_occasions'],
      seasonal_patterns: true,
      technology_dependence: 30,
      regulatory_complexity: 60,
      competition_level: 70
    });

    // Technology services
    this.businessTemplates.set('technology_repair', {
      category: 'technology',
      subcategory: 'device_repair',
      typical_size: 'micro',
      startup_cost_range: [10000, 40000],
      revenue_potential: [50000, 150000],
      skill_requirements: ['technical_repair', 'diagnostics', 'customer_service'],
      common_products_services: ['phone_repair', 'computer_repair', 'data_recovery', 'upgrades'],
      target_demographics: ['tech_users', 'students', 'professionals', 'seniors'],
      seasonal_patterns: false,
      technology_dependence: 90,
      regulatory_complexity: 30,
      competition_level: 65
    });

    console.log(`📋 Initialized ${this.businessTemplates.size} business templates`);
  }

  private initializeNameLists(): void {
    this.businessNames = {
      retail: [
        'Corner Market', 'City General Store', 'Neighborhood Mart', 'Quick Stop Shop',
        'Daily Essentials', 'Community Corner', 'Local Choice', 'Handy Store'
      ],
      food_service: [
        'Hometown Diner', 'Corner Cafe', 'Family Kitchen', 'Local Flavors',
        'Neighborhood Grill', 'City Bistro', 'Comfort Food Co', 'Daily Bread'
      ],
      professional_services: [
        'Professional Solutions', 'Expert Advisors', 'Business Partners', 'Strategic Consulting',
        'Professional Group', 'Advisory Services', 'Expert Solutions', 'Business Support'
      ],
      personal_services: [
        'Style Studio', 'Beauty Corner', 'Personal Care', 'Wellness Center',
        'Lifestyle Services', 'Care & Comfort', 'Personal Touch', 'Service Plus'
      ],
      technology: [
        'Tech Solutions', 'Digital Services', 'Tech Support', 'Innovation Hub',
        'Tech Corner', 'Digital Solutions', 'Tech Experts', 'Cyber Services'
      ]
    };

    this.ownerNames = [
      'Alex Chen', 'Maria Rodriguez', 'James Wilson', 'Sarah Kim', 'David Thompson',
      'Lisa Zhang', 'Michael Brown', 'Jennifer Lee', 'Robert Garcia', 'Emily Davis',
      'Christopher Martinez', 'Amanda Johnson', 'Daniel Anderson', 'Jessica Taylor',
      'Matthew White', 'Ashley Miller', 'Andrew Jackson', 'Stephanie Moore'
    ];
  }

  private calculateBusinessDistribution(
    context: BusinessGenerationContext,
    totalBusinesses: number
  ): { [category: string]: number } {
    // Base distribution percentages
    const baseDistribution = {
      retail: 0.35,           // 35% - Essential goods and services
      food_service: 0.20,     // 20% - Restaurants, cafes, food vendors
      professional_services: 0.15, // 15% - Consulting, accounting, legal
      personal_services: 0.12, // 12% - Salons, fitness, personal care
      technology: 0.08,       // 8% - Tech services, repair, software
      manufacturing: 0.05,    // 5% - Small manufacturing, crafts
      healthcare: 0.03,       // 3% - Private clinics, wellness
      education: 0.02         // 2% - Tutoring, training, courses
    };

    // Adjust based on context
    const adjustedDistribution: { [category: string]: number } = {};
    
    for (const [category, percentage] of Object.entries(baseDistribution)) {
      let adjustedPercentage = percentage;
      
      // Adjust based on economic climate
      if (context.economic_climate === 'recession') {
        if (category === 'retail' || category === 'food_service') {
          adjustedPercentage *= 0.8; // Reduce luxury spending categories
        } else if (category === 'professional_services') {
          adjustedPercentage *= 1.2; // Increase consulting/support services
        }
      } else if (context.economic_climate === 'boom') {
        if (category === 'technology' || category === 'personal_services') {
          adjustedPercentage *= 1.3; // Increase high-growth categories
        }
      }
      
      // Adjust based on technology level
      if (context.technology_level > 70) {
        if (category === 'technology') {
          adjustedPercentage *= 1.5;
        }
      }
      
      // Adjust based on population density
      if (context.population_density > 1000) {
        if (category === 'personal_services' || category === 'food_service') {
          adjustedPercentage *= 1.2; // More service businesses in dense areas
        }
      }
      
      adjustedDistribution[category] = Math.floor(totalBusinesses * adjustedPercentage);
    }
    
    // Ensure total adds up
    const total = Object.values(adjustedDistribution).reduce((sum, count) => sum + count, 0);
    if (total < totalBusinesses) {
      adjustedDistribution.retail += (totalBusinesses - total);
    }
    
    return adjustedDistribution;
  }

  private selectTemplateByMarketConditions(
    templates: BusinessTemplate[],
    context: BusinessGenerationContext
  ): BusinessTemplate {
    // Weight templates based on market conditions
    const weightedTemplates = templates.map(template => {
      let weight = 1.0;
      
      // Adjust weight based on market saturation
      const saturation = context.market_saturation[template.category] || 0;
      if (saturation > 80) {
        weight *= 0.3; // Reduce weight for saturated markets
      } else if (saturation < 30) {
        weight *= 1.5; // Increase weight for unsaturated markets
      }
      
      // Adjust weight based on economic climate
      if (context.economic_climate === 'recession') {
        if (template.startup_cost_range[0] < 30000) {
          weight *= 1.3; // Favor low-cost startups
        }
      }
      
      // Adjust weight based on technology level
      if (context.technology_level < template.technology_dependence) {
        weight *= 0.5; // Reduce weight for high-tech businesses in low-tech areas
      }
      
      return { template, weight };
    });
    
    // Select template using weighted random selection
    const totalWeight = weightedTemplates.reduce((sum, item) => sum + item.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;
    
    for (const item of weightedTemplates) {
      currentWeight += item.weight;
      if (random <= currentWeight) {
        return item.template;
      }
    }
    
    return templates[0]; // Fallback
  }

  private generateBusinessName(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): string {
    const categoryNames = this.businessNames[template.category] || ['Local Business'];
    const baseName = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    
    // Add variation
    const variations = ['', ' Plus', ' Express', ' Pro', ' & Co', ' Solutions'];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    
    return baseName + variation;
  }

  private selectBusinessType(template: BusinessTemplate, context: BusinessGenerationContext): BusinessType {
    const types: BusinessType[] = ['sole_proprietorship', 'partnership', 'llc', 'corporation'];
    const weights = [0.40, 0.20, 0.30, 0.10]; // Typical distribution for small businesses
    
    const random = Math.random();
    let threshold = 0;
    
    for (let i = 0; i < types.length; i++) {
      threshold += weights[i];
      if (random < threshold) {
        return types[i];
      }
    }
    
    return 'sole_proprietorship';
  }

  private generateBusinessLocation(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    const districts = ['Downtown', 'Business District', 'Residential Area', 'Shopping Center', 'Industrial Zone'];
    const district = districts[Math.floor(Math.random() * districts.length)];
    
    return {
      address: `${Math.floor(Math.random() * 9999) + 1} ${district} Street`,
      district,
      coordinates: {
        x: Math.random() * 1000,
        y: Math.random() * 1000
      },
      property_type: Math.random() < 0.7 ? 'leased' : 'owned',
      square_footage: Math.floor(Math.random() * 5000) + 500,
      monthly_rent: Math.random() < 0.7 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
      foot_traffic_score: Math.floor(Math.random() * 100),
      accessibility_rating: Math.floor(Math.random() * 100),
      parking_availability: Math.random() < 0.7,
      public_transport_access: Math.random() < 0.6
    };
  }

  private generateBusinessOwner(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    const name = this.ownerNames[Math.floor(Math.random() * this.ownerNames.length)];
    
    return {
      name,
      age: Math.floor(Math.random() * 30) + 30, // 30-60 years old
      experience_years: Math.floor(Math.random() * 20) + 2,
      education_level: ['High School', 'Associate Degree', 'Bachelor Degree', 'Master Degree'][Math.floor(Math.random() * 4)],
      previous_businesses: Math.floor(Math.random() * 3),
      management_skill: Math.floor(Math.random() * 40) + 50, // 50-90
      financial_literacy: Math.floor(Math.random() * 40) + 40, // 40-80
      industry_knowledge: Math.floor(Math.random() * 50) + 50, // 50-100
      networking_ability: Math.floor(Math.random() * 60) + 30, // 30-90
      risk_tolerance: Math.floor(Math.random() * 80) + 20, // 20-100
      work_life_balance: Math.floor(Math.random() * 60) + 30 // 30-90
    };
  }

  private generateFinancialInfo(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    const startupCost = Math.floor(
      Math.random() * (template.startup_cost_range[1] - template.startup_cost_range[0]) + 
      template.startup_cost_range[0]
    );
    
    const monthlyRevenue = Math.floor(
      Math.random() * (template.revenue_potential[1] - template.revenue_potential[0]) / 12 + 
      template.revenue_potential[0] / 12
    );
    
    const monthlyExpenses = Math.floor(monthlyRevenue * (0.6 + Math.random() * 0.3)); // 60-90% of revenue
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    
    return {
      startup_capital: startupCost,
      current_cash: Math.floor(monthlyProfit * (2 + Math.random() * 4)), // 2-6 months of profit
      monthly_revenue: monthlyRevenue,
      monthly_expenses: monthlyExpenses,
      monthly_profit: monthlyProfit,
      outstanding_loans: [],
      credit_rating: Math.floor(Math.random() * 40) + 50, // 50-90
      tax_obligations: [],
      insurance_policies: [],
      financial_projections: []
    };
  }

  private generateOperations(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    return {
      operating_hours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { closed: true },
        holidays_closed: true,
        seasonal_adjustments: template.seasonal_patterns
      },
      capacity: {
        max_customers_per_hour: Math.floor(Math.random() * 50) + 10,
        max_orders_per_day: Math.floor(Math.random() * 200) + 50,
        production_capacity: Math.floor(Math.random() * 1000) + 100,
        storage_capacity: Math.floor(Math.random() * 5000) + 500,
        current_utilization: Math.floor(Math.random() * 40) + 50 // 50-90%
      },
      efficiency_rating: Math.floor(Math.random() * 30) + 60, // 60-90
      quality_rating: Math.floor(Math.random() * 30) + 65, // 65-95
      customer_service_rating: Math.floor(Math.random() * 25) + 70, // 70-95
      technology_adoption: {
        pos_system: Math.random() < 0.8,
        online_presence: Math.random() < 0.6,
        e_commerce: Math.random() < 0.3,
        digital_payments: Math.random() < 0.7,
        inventory_management: Math.random() < 0.5,
        customer_relationship_management: Math.random() < 0.3,
        social_media_marketing: Math.random() < 0.4,
        automation_level: Math.floor(Math.random() * template.technology_dependence)
      },
      supply_chain: {
        primary_suppliers: Math.floor(Math.random() * 5) + 2,
        backup_suppliers: Math.floor(Math.random() * 3) + 1,
        local_sourcing_percentage: Math.floor(Math.random() * 60) + 30,
        supply_chain_reliability: Math.floor(Math.random() * 30) + 65,
        average_delivery_time: Math.floor(Math.random() * 10) + 2,
        inventory_turnover_rate: Math.random() * 10 + 2
      },
      inventory: {
        total_value: Math.floor(Math.random() * 50000) + 10000,
        items_count: Math.floor(Math.random() * 500) + 50,
        fast_moving_items: template.common_products_services.slice(0, 3),
        slow_moving_items: [],
        stockout_frequency: Math.floor(Math.random() * 5),
        waste_percentage: Math.random() * 10
      },
      seasonal_patterns: template.seasonal_patterns ? [
        {
          season: 'spring',
          revenue_multiplier: 1.0 + (Math.random() * 0.4 - 0.2),
          demand_pattern: 'stable',
          staffing_adjustments: 0,
          inventory_adjustments: 0
        }
      ] : []
    };
  }

  private generateProductsServices(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any[] {
    const products = [];
    const count = Math.floor(Math.random() * 8) + 3; // 3-10 products/services
    
    for (let i = 0; i < count && i < template.common_products_services.length; i++) {
      const productName = template.common_products_services[i];
      const price = Math.floor(Math.random() * 100) + 10;
      const cost = Math.floor(price * (0.4 + Math.random() * 0.3)); // 40-70% of price
      
      products.push({
        id: uuidv4(),
        name: productName,
        type: template.category === 'professional_services' ? 'service' : 'product',
        category: template.subcategory,
        description: `Quality ${productName} for our customers`,
        price,
        cost_to_produce: cost,
        profit_margin: ((price - cost) / price) * 100,
        popularity_score: Math.floor(Math.random() * 60) + 40,
        quality_rating: Math.floor(Math.random() * 30) + 70,
        seasonal_demand: template.seasonal_patterns,
        customizable: Math.random() < 0.3,
        delivery_options: ['pickup', 'local_delivery'],
        warranty_period: template.category === 'technology' ? 90 : undefined,
        certifications: []
      });
    }
    
    return products;
  }

  private generateEmployees(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any[] {
    const employees = [];
    const employeeCount = template.typical_size === 'micro' ? 
      Math.floor(Math.random() * 3) + 1 : // 1-3 employees
      Math.floor(Math.random() * 8) + 2;   // 2-9 employees
    
    for (let i = 0; i < employeeCount; i++) {
      const name = this.ownerNames[Math.floor(Math.random() * this.ownerNames.length)];
      const positions = ['Assistant', 'Sales Associate', 'Technician', 'Manager', 'Specialist'];
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      employees.push({
        id: uuidv4(),
        name,
        position,
        employment_type: Math.random() < 0.7 ? 'full_time' : 'part_time',
        hourly_wage: Math.floor(Math.random() * 20) + 15, // $15-35/hour
        hours_per_week: Math.random() < 0.7 ? 40 : Math.floor(Math.random() * 20) + 20,
        skill_level: Math.floor(Math.random() * 40) + 50,
        productivity: Math.floor(Math.random() * 30) + 65,
        job_satisfaction: Math.floor(Math.random() * 40) + 55,
        tenure_months: Math.floor(Math.random() * 36) + 1,
        benefits_package: Math.random() < 0.5 ? ['health_insurance'] : []
      });
    }
    
    return employees;
  }

  private generateMarketPresence(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    return {
      market_share: Math.floor(Math.random() * 15) + 1, // 1-15%
      brand_recognition: Math.floor(Math.random() * 60) + 20, // 20-80%
      online_reviews: {
        average_rating: Math.random() * 2 + 3, // 3.0-5.0
        total_reviews: Math.floor(Math.random() * 200) + 10,
        recent_reviews_trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
        response_rate: Math.floor(Math.random() * 60) + 30,
        sentiment_analysis: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)]
      },
      marketing_channels: [
        {
          channel_type: 'social_media',
          monthly_spend: Math.floor(Math.random() * 500) + 100,
          reach: Math.floor(Math.random() * 5000) + 500,
          conversion_rate: Math.floor(Math.random() * 10) + 2,
          roi: Math.random() * 3 + 1,
          effectiveness_score: Math.floor(Math.random() * 40) + 50
        }
      ],
      competitive_position: {
        direct_competitors: Math.floor(Math.random() * 8) + 2,
        competitive_advantage: ['price', 'quality', 'service', 'location'][Math.floor(Math.random() * 4)],
        market_threats: ['new_competitors', 'economic_downturn', 'changing_preferences'],
        differentiation_factors: ['customer_service', 'local_focus', 'quality_products'],
        price_positioning: ['budget', 'competitive', 'premium'][Math.floor(Math.random() * 3)]
      },
      growth_opportunities: []
    };
  }

  private calculateBusinessHealth(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    financialInfo: any,
    operations: any
  ): any {
    const profitMargin = (financialInfo.monthly_profit / financialInfo.monthly_revenue) * 100;
    const financialHealth = Math.min(100, Math.max(0, profitMargin * 3 + 40));
    const operationalHealth = (operations.efficiency_rating + operations.quality_rating) / 2;
    const marketHealth = Math.floor(Math.random() * 30) + 60;
    
    const overallScore = (financialHealth + operationalHealth + marketHealth) / 3;
    
    return {
      overall_score: Math.floor(overallScore),
      financial_health: Math.floor(financialHealth),
      operational_health: Math.floor(operationalHealth),
      market_health: Math.floor(marketHealth),
      owner_satisfaction: Math.floor(Math.random() * 30) + 65,
      employee_satisfaction: Math.floor(Math.random() * 40) + 55,
      customer_satisfaction: Math.floor(Math.random() * 25) + 70,
      sustainability_score: Math.floor(Math.random() * 60) + 40,
      risk_factors: [],
      warning_indicators: []
    };
  }

  private generateGrowthMetrics(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    return {
      revenue_growth_rate: (Math.random() * 30) - 5, // -5% to 25%
      customer_growth_rate: (Math.random() * 20) - 2, // -2% to 18%
      employee_growth_rate: (Math.random() * 15), // 0% to 15%
      market_share_growth: (Math.random() * 10) - 2, // -2% to 8%
      profit_margin_trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
      expansion_plans: [],
      scalability_score: Math.floor(Math.random() * 60) + 30
    };
  }

  private generateComplianceStatus(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    return {
      business_license: {
        license_number: `BL${Math.floor(Math.random() * 100000)}`,
        issue_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        expiration_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        renewal_required: Math.random() < 0.2,
        status: 'active'
      },
      tax_compliance: {
        area: 'taxation',
        status: 'compliant',
        last_inspection: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        next_inspection: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000),
        violations: 0,
        corrective_actions: []
      },
      health_safety: {
        area: 'health_safety',
        status: Math.random() < 0.9 ? 'compliant' : 'pending_review',
        last_inspection: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        next_inspection: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        violations: Math.floor(Math.random() * 2),
        corrective_actions: []
      },
      employment_law: {
        area: 'employment',
        status: 'compliant',
        last_inspection: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        next_inspection: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        violations: 0,
        corrective_actions: []
      },
      environmental_regulations: {
        area: 'environment',
        status: 'compliant',
        last_inspection: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        next_inspection: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        violations: 0,
        corrective_actions: []
      },
      industry_specific: [],
      overall_compliance_score: Math.floor(Math.random() * 20) + 80,
      recent_violations: []
    };
  }

  private generateLifecycle(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    const stages = ['startup', 'growth', 'maturity', 'expansion'];
    const currentStage = stages[Math.floor(Math.random() * stages.length)];
    const foundedDate = new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000); // 0-5 years ago
    
    return {
      founded_date: foundedDate,
      current_stage: currentStage,
      stage_duration_months: Math.floor(Math.random() * 24) + 6,
      previous_stages: [],
      projected_next_stage: stages[Math.min(stages.indexOf(currentStage) + 1, stages.length - 1)],
      stage_transition_probability: Math.floor(Math.random() * 60) + 30,
      lifecycle_events: []
    };
  }

  private generateCustomerBase(
    template: BusinessTemplate,
    context: BusinessGenerationContext,
    seed: string
  ): any {
    const totalCustomers = Math.floor(Math.random() * 1000) + 100;
    
    return {
      total_customers: totalCustomers,
      active_customers: Math.floor(totalCustomers * (0.6 + Math.random() * 0.3)),
      new_customers_monthly: Math.floor(totalCustomers * 0.1),
      customer_retention_rate: Math.floor(Math.random() * 40) + 60,
      average_transaction_value: Math.floor(Math.random() * 100) + 25,
      customer_lifetime_value: Math.floor(Math.random() * 1000) + 200,
      demographics: {
        age_groups: {
          '18-25': Math.floor(Math.random() * 30) + 10,
          '26-35': Math.floor(Math.random() * 30) + 20,
          '36-45': Math.floor(Math.random() * 25) + 15,
          '46-55': Math.floor(Math.random() * 20) + 10,
          '56+': Math.floor(Math.random() * 15) + 5
        },
        income_levels: {
          'low': Math.floor(Math.random() * 30) + 10,
          'medium': Math.floor(Math.random() * 40) + 30,
          'high': Math.floor(Math.random() * 30) + 10
        },
        geographic_distribution: {
          'local': Math.floor(Math.random() * 40) + 50,
          'regional': Math.floor(Math.random() * 30) + 10,
          'tourist': Math.floor(Math.random() * 20) + 5
        },
        customer_types: {
          'regular': Math.floor(Math.random() * 50) + 40,
          'occasional': Math.floor(Math.random() * 30) + 20,
          'one_time': Math.floor(Math.random() * 20) + 10
        }
      },
      satisfaction_score: Math.floor(Math.random() * 30) + 65,
      loyalty_program_members: Math.floor(totalCustomers * 0.2),
      referral_rate: Math.floor(Math.random() * 40) + 20
    };
  }

  private async generateDistributionNetworks(
    businesses: SmallBusiness[],
    context: BusinessGenerationContext,
    seed: string
  ): Promise<DistributionNetwork[]> {
    const networks: DistributionNetwork[] = [];
    
    // Create local distribution network
    const localNetwork: DistributionNetwork = {
      id: uuidv4(),
      name: `City ${context.city_id} Local Distribution Network`,
      network_type: 'local',
      coverage_area: {
        civilization_id: context.civilization_id,
        planets: [context.planet_id],
        cities: [context.city_id],
        districts: ['Downtown', 'Residential', 'Industrial'],
        population_served: context.population_density * 10,
        business_density: businesses.length,
        geographic_challenges: []
      },
      participants: businesses.slice(0, Math.min(50, businesses.length)).map(business => ({
        business_id: business.id,
        business_name: business.name,
        role: this.determineNetworkRole(business),
        participation_level: 'regular',
        contribution_score: Math.floor(Math.random() * 40) + 60,
        reliability_rating: Math.floor(Math.random() * 30) + 70,
        joined_date: new Date(),
        benefits_received: ['reduced_shipping_costs', 'faster_delivery'],
        obligations: ['maintain_quality_standards', 'timely_payments']
      })),
      logistics: {
        transportation_modes: [
          {
            mode_type: 'ground',
            capacity: 1000,
            speed: 50,
            cost_per_unit: 2.5,
            environmental_impact: 60,
            reliability: 85,
            availability: 95
          }
        ],
        warehouse_facilities: [
          {
            facility_id: uuidv4(),
            location: 'Central Warehouse District',
            storage_capacity: 10000,
            current_utilization: 75,
            automation_level: 40,
            temperature_controlled: true,
            security_level: 80,
            operating_costs: 15000
          }
        ],
        delivery_options: [
          {
            option_name: 'Standard Delivery',
            delivery_time: 24,
            cost: 5,
            reliability: 90,
            tracking_available: true,
            special_handling: [],
            customer_rating: 4.2
          }
        ],
        average_delivery_time: 24,
        delivery_success_rate: 92,
        tracking_capability: true,
        cold_chain_capability: true,
        hazardous_materials_capability: false
      },
      performance_metrics: {
        total_volume: Math.floor(Math.random() * 100000) + 50000,
        revenue_generated: Math.floor(Math.random() * 1000000) + 500000,
        cost_efficiency: Math.floor(Math.random() * 30) + 70,
        customer_satisfaction: Math.floor(Math.random() * 20) + 75,
        on_time_delivery_rate: Math.floor(Math.random() * 15) + 85,
        damage_rate: Math.floor(Math.random() * 5) + 1,
        network_utilization: Math.floor(Math.random() * 20) + 70,
        growth_rate: Math.floor(Math.random() * 20) + 5
      },
      cost_structure: {
        transportation_costs: 150000,
        warehousing_costs: 80000,
        technology_costs: 25000,
        administrative_costs: 40000,
        insurance_costs: 15000,
        regulatory_costs: 10000,
        total_operating_costs: 320000,
        cost_per_transaction: 3.2,
        profit_margin: 12
      },
      technology_integration: {
        tracking_systems: true,
        inventory_management: true,
        route_optimization: true,
        predictive_analytics: false,
        automated_sorting: true,
        digital_payments: true,
        customer_portal: true,
        api_integration: false,
        blockchain_verification: false,
        ai_demand_forecasting: false
      },
      sustainability: {
        carbon_footprint: 2500,
        energy_efficiency: 65,
        waste_reduction: 15,
        renewable_energy_usage: 25,
        local_sourcing_preference: 70,
        sustainability_certifications: ['Green Business Certified'],
        environmental_impact_score: 72
      }
    };
    
    networks.push(localNetwork);
    
    return networks;
  }

  private determineNetworkRole(business: SmallBusiness): string {
    if (business.category === 'manufacturing') return 'supplier';
    if (business.category === 'wholesale') return 'distributor';
    if (business.category === 'retail') return 'retailer';
    if (business.category === 'transportation') return 'logistics_provider';
    return 'service_provider';
  }

  private async establishSupplierRelationships(
    businesses: SmallBusiness[],
    context: BusinessGenerationContext
  ): Promise<void> {
    // Create supplier relationships between businesses
    const suppliers = businesses.filter(b => 
      b.category === 'manufacturing' || b.category === 'wholesale'
    );
    
    const retailers = businesses.filter(b => 
      b.category === 'retail' || b.category === 'food_service'
    );
    
    for (const retailer of retailers) {
      const supplierCount = Math.floor(Math.random() * 3) + 1; // 1-3 suppliers
      const selectedSuppliers = suppliers
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(supplierCount, suppliers.length));
      
      retailer.suppliers = selectedSuppliers.map(supplier => ({
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        supplier_type: supplier.category === 'manufacturing' ? 'manufacturer' : 'wholesaler',
        products_services: supplier.products_services.map(p => p.name),
        relationship_strength: Math.floor(Math.random() * 40) + 60,
        payment_terms: 'Net 30',
        delivery_reliability: Math.floor(Math.random() * 20) + 80,
        quality_consistency: Math.floor(Math.random() * 25) + 75,
        price_competitiveness: Math.floor(Math.random() * 30) + 70,
        exclusive_agreement: Math.random() < 0.1
      }));
    }
  }
}
