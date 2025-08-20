/**
 * Business Engine - Core business creation and lifecycle management system
 * Sprint 7: Comprehensive small business ecosystem with financial tracking and market dynamics
 */

import { 
  Business, 
  BusinessType, 
  BusinessIndustry, 
  LegalStructure,
  BusinessStatus,
  RiskLevel,
  GrowthStage,
  BusinessModel,
  BusinessEmployee,
  Product,
  Service,
  MonthlyBusinessMetrics,
  BusinessOpportunity,
  BusinessEvent,
  BusinessEventType,
  EmploymentType,
  ProductCategory,
  ServiceCategory,
  CompetitionLevel,
  BarrierToEntry,
  PricingType
} from './types.js';
import { Citizen } from '../population/types.js';
import { Employment } from '../professions/types.js';

export class BusinessEngine {
  private businesses: Map<string, Business> = new Map();
  private businessOpportunities: Map<string, BusinessOpportunity> = new Map();
  private businessEvents: BusinessEvent[] = [];
  private monthlyMetrics: Map<string, MonthlyBusinessMetrics[]> = new Map();

  constructor() {
    this.initializeBusinessOpportunities();
  }

  /**
   * Initialize available business opportunities based on market conditions
   */
  private initializeBusinessOpportunities(): void {
    const opportunities: BusinessOpportunity[] = [
      // Technology Sector
      {
        id: 'software_consulting',
        businessType: BusinessType.LLC,
        industry: BusinessIndustry.TECHNOLOGY,
        marketSize: 500000,
        competition: CompetitionLevel.MODERATE,
        barriers: [BarrierToEntry.SPECIALIZED_KNOWLEDGE, BarrierToEntry.ESTABLISHED_COMPETITION],
        minimumCapital: 25000,
        requiredSkills: ['programming', 'project_management', 'communication'],
        timeToBreakeven: 8,
        projectedRevenue: 150000,
        projectedProfit: 45000,
        successProbability: 0.7,
        riskFactors: ['Technology changes', 'Client acquisition', 'Competition from larger firms']
      },

      // Retail Sector
      {
        id: 'local_coffee_shop',
        businessType: BusinessType.SOLE_PROPRIETORSHIP,
        industry: BusinessIndustry.FOOD_SERVICE,
        marketSize: 200000,
        competition: CompetitionLevel.HIGH,
        barriers: [BarrierToEntry.HIGH_CAPITAL_REQUIREMENTS, BarrierToEntry.LOCATION_ADVANTAGES],
        minimumCapital: 75000,
        requiredSkills: ['customer_service', 'business_management', 'food_safety'],
        timeToBreakeven: 18,
        projectedRevenue: 180000,
        projectedProfit: 25000,
        successProbability: 0.4,
        riskFactors: ['High competition', 'Location dependency', 'Seasonal variations', 'Supply costs']
      },

      // Professional Services
      {
        id: 'accounting_practice',
        businessType: BusinessType.LLC,
        industry: BusinessIndustry.PROFESSIONAL_SERVICES,
        marketSize: 300000,
        competition: CompetitionLevel.MODERATE,
        barriers: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
        minimumCapital: 15000,
        requiredSkills: ['accounting', 'tax_preparation', 'client_relations'],
        timeToBreakeven: 12,
        projectedRevenue: 120000,
        projectedProfit: 60000,
        successProbability: 0.8,
        riskFactors: ['Regulatory changes', 'Technology automation', 'Seasonal demand']
      },

      // Healthcare Services
      {
        id: 'physical_therapy_clinic',
        businessType: BusinessType.LLC,
        industry: BusinessIndustry.HEALTHCARE,
        marketSize: 400000,
        competition: CompetitionLevel.LOW,
        barriers: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
        minimumCapital: 100000,
        requiredSkills: ['physical_therapy', 'healthcare_management', 'patient_care'],
        timeToBreakeven: 24,
        projectedRevenue: 250000,
        projectedProfit: 75000,
        successProbability: 0.6,
        riskFactors: ['Insurance reimbursement', 'Regulatory compliance', 'Equipment costs']
      },

      // Manufacturing
      {
        id: 'custom_furniture',
        businessType: BusinessType.LLC,
        industry: BusinessIndustry.MANUFACTURING,
        marketSize: 150000,
        competition: CompetitionLevel.MODERATE,
        barriers: [BarrierToEntry.HIGH_CAPITAL_REQUIREMENTS, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
        minimumCapital: 50000,
        requiredSkills: ['woodworking', 'design', 'business_management'],
        timeToBreakeven: 15,
        projectedRevenue: 100000,
        projectedProfit: 30000,
        successProbability: 0.5,
        riskFactors: ['Material costs', 'Custom order dependency', 'Seasonal demand']
      }
    ];

    opportunities.forEach(opportunity => {
      this.businessOpportunities.set(opportunity.id, opportunity);
    });
  }

  /**
   * Create a new business for a citizen entrepreneur
   */
  createBusiness(
    owner: Citizen,
    opportunityId: string,
    businessName: string,
    initialCapital: number,
    customization?: Partial<Business>
  ): Business | null {
    const opportunity = this.businessOpportunities.get(opportunityId);
    if (!opportunity) {
      throw new Error(`Business opportunity ${opportunityId} not found`);
    }

    // Validate citizen qualifications
    if (!this.validateBusinessQualifications(owner, opportunity)) {
      return null;
    }

    // Validate capital requirements
    if (initialCapital < opportunity.minimumCapital) {
      throw new Error(`Insufficient capital. Minimum required: $${opportunity.minimumCapital}`);
    }

    // Generate business ID
    const businessId = `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create business entity
    const business: Business = {
      id: businessId,
      name: businessName,
      businessType: opportunity.businessType,
      industry: opportunity.industry,
      description: `${opportunity.industry} business founded by ${owner.name}`,
      
      // Ownership & Management
      ownerId: owner.id,
      foundedDate: new Date(),
      legalStructure: this.mapBusinessTypeToLegalStructure(opportunity.businessType),
      
      // Location & Operations
      cityId: owner.cityId,
      operatingHours: this.getDefaultOperatingHours(opportunity.industry),
      businessModel: this.getDefaultBusinessModel(opportunity.industry),
      
      // Financial Information
      initialCapital,
      currentCapital: initialCapital,
      monthlyRevenue: 0,
      monthlyExpenses: this.calculateInitialExpenses(opportunity, initialCapital),
      profitMargin: 0,
      
      // Business Metrics
      employeeCount: 1, // Owner
      customerBase: 0,
      marketShare: 0,
      reputation: 0.5, // Starting neutral reputation
      
      // Business Status
      status: BusinessStatus.STARTUP,
      riskLevel: this.calculateInitialRisk(opportunity, owner, initialCapital),
      growthStage: GrowthStage.SEED,
      
      // Operational Details
      products: this.generateInitialProducts(opportunity.industry),
      services: this.generateInitialServices(opportunity.industry),
      employees: [{
        citizenId: owner.id,
        position: 'Owner/Founder',
        salary: 0, // Owner takes profits
        hireDate: new Date(),
        performanceRating: 0.8,
        responsibilities: ['Management', 'Operations', 'Sales'],
        employmentType: EmploymentType.FULL_TIME
      }],
      
      // Market Position
      competitorIds: [],
      targetMarket: this.generateTargetMarket(opportunity),
      pricingStrategy: {
        strategy: PricingType.COMPETITIVE,
        markup: 0.3, // 30% markup
        competitiveFactor: 0.7,
        demandElasticity: 0.5
      },
      
      // Performance History
      monthlyMetrics: [],
      
      // Timestamps
      createdAt: new Date(),
      lastUpdated: new Date(),
      
      // Apply customizations
      ...customization
    };

    // Store business
    this.businesses.set(businessId, business);

    // Record business founding event
    this.recordBusinessEvent(businessId, BusinessEventType.FOUNDED, 
      `${owner.name} founded ${businessName}`, {
        financial: 0,
        operational: 1,
        reputation: 0.1,
        strategic: 1
      });

    return business;
  }

  /**
   * Validate if a citizen qualifies to start a specific business
   */
  private validateBusinessQualifications(citizen: Citizen, opportunity: BusinessOpportunity): boolean {
    // Check required skills
    for (const requiredSkill of opportunity.requiredSkills) {
      const citizenSkillLevel = citizen.skills[requiredSkill] || 0;
      if (citizenSkillLevel < 5) { // Minimum skill level of 5
        return false;
      }
    }

    // Check age (must be 18+)
    if (citizen.age < 18) {
      return false;
    }

    // Check if citizen already owns a business
    const existingBusiness = Array.from(this.businesses.values())
      .find(b => b.ownerId === citizen.id && b.status !== BusinessStatus.CLOSED);
    if (existingBusiness) {
      return false; // One business per citizen for now
    }

    return true;
  }

  /**
   * Process monthly business operations for all businesses
   */
  processMonthlyOperations(): BusinessEvent[] {
    const events: BusinessEvent[] = [];

    for (const business of this.businesses.values()) {
      if (business.status === BusinessStatus.OPERATING || 
          business.status === BusinessStatus.GROWING ||
          business.status === BusinessStatus.STARTUP) {
        
        const monthlyEvents = this.processBusinessMonth(business);
        events.push(...monthlyEvents);
      }
    }

    return events;
  }

  /**
   * Process one month of operations for a specific business
   */
  private processBusinessMonth(business: Business): BusinessEvent[] {
    const events: BusinessEvent[] = [];

    // Calculate monthly revenue
    const monthlyRevenue = this.calculateMonthlyRevenue(business);
    
    // Calculate monthly expenses
    const monthlyExpenses = this.calculateMonthlyExpenses(business);
    
    // Update business metrics
    business.monthlyRevenue = monthlyRevenue;
    business.monthlyExpenses = monthlyExpenses;
    business.currentCapital += (monthlyRevenue - monthlyExpenses);
    business.profitMargin = monthlyRevenue > 0 ? (monthlyRevenue - monthlyExpenses) / monthlyRevenue : 0;
    
    // Update customer base and market share
    this.updateMarketPosition(business);
    
    // Update reputation based on performance
    this.updateReputation(business);
    
    // Assess risk level
    business.riskLevel = this.assessRiskLevel(business);
    
    // Update growth stage
    business.growthStage = this.assessGrowthStage(business);
    
    // Record monthly metrics
    const metrics: MonthlyBusinessMetrics = {
      month: new Date(),
      revenue: monthlyRevenue,
      expenses: monthlyExpenses,
      profit: monthlyRevenue - monthlyExpenses,
      employeeCount: business.employeeCount,
      customerCount: business.customerBase,
      marketShare: business.marketShare,
      reputation: business.reputation,
      cashFlow: monthlyRevenue - monthlyExpenses
    };
    
    business.monthlyMetrics.push(metrics);
    
    // Keep only last 24 months of metrics
    if (business.monthlyMetrics.length > 24) {
      business.monthlyMetrics = business.monthlyMetrics.slice(-24);
    }
    
    // Check for business failure
    if (business.currentCapital < -business.monthlyExpenses * 3) { // 3 months of negative cash
      business.status = BusinessStatus.CLOSING;
      events.push(this.recordBusinessEvent(business.id, BusinessEventType.BANKRUPTCY,
        `${business.name} filed for bankruptcy due to insufficient capital`, {
          financial: -1,
          operational: -1,
          reputation: -0.5,
          strategic: -1
        }));
    }
    
    // Check for growth opportunities
    if (business.profitMargin > 0.2 && business.currentCapital > business.initialCapital * 2) {
      if (Math.random() < 0.1) { // 10% chance per month
        events.push(this.recordBusinessEvent(business.id, BusinessEventType.EXPANSION,
          `${business.name} is expanding operations`, {
            financial: 0.2,
            operational: 0.3,
            reputation: 0.1,
            strategic: 0.5
          }));
      }
    }
    
    business.lastUpdated = new Date();
    
    return events;
  }

  /**
   * Calculate monthly revenue for a business
   */
  private calculateMonthlyRevenue(business: Business): number {
    let revenue = 0;
    
    // Product sales
    for (const product of business.products) {
      const monthlySales = this.calculateProductSales(business, product);
      revenue += monthlySales;
    }
    
    // Service sales
    for (const service of business.services) {
      const monthlySales = this.calculateServiceSales(business, service);
      revenue += monthlySales;
    }
    
    // Apply market factors
    revenue *= (1 + business.reputation - 0.5); // Reputation bonus/penalty
    revenue *= this.getSeasonalMultiplier(business.industry);
    revenue *= (1 + Math.random() * 0.2 - 0.1); // ±10% random variation
    
    return Math.max(0, revenue);
  }

  /**
   * Calculate monthly expenses for a business
   */
  private calculateMonthlyExpenses(business: Business): number {
    let expenses = 0;
    
    // Employee salaries
    expenses += business.employees.reduce((sum, emp) => sum + emp.salary, 0);
    
    // Rent (based on business size and location)
    expenses += this.calculateRent(business);
    
    // Utilities
    expenses += this.calculateUtilities(business);
    
    // Supplies and inventory
    expenses += this.calculateSupplyCosts(business);
    
    // Marketing
    expenses += business.monthlyRevenue * 0.05; // 5% of revenue on marketing
    
    // Insurance
    expenses += this.calculateInsurance(business);
    
    // Other operational expenses
    expenses += business.initialCapital * 0.01; // 1% of initial capital monthly
    
    return expenses;
  }

  /**
   * Hire an employee for a business
   */
  hireEmployee(
    businessId: string, 
    citizenId: string, 
    position: string, 
    salary: number,
    employmentType: EmploymentType = EmploymentType.FULL_TIME
  ): boolean {
    const business = this.businesses.get(businessId);
    if (!business) {
      throw new Error(`Business ${businessId} not found`);
    }

    // Check if business can afford the employee
    if (salary > business.currentCapital * 0.1) { // Can't spend more than 10% of capital on one salary
      return false;
    }

    // Check if citizen is already employed by this business
    const existingEmployee = business.employees.find(emp => emp.citizenId === citizenId);
    if (existingEmployee) {
      return false;
    }

    // Add employee
    const employee: BusinessEmployee = {
      citizenId,
      position,
      salary,
      hireDate: new Date(),
      performanceRating: 0.6, // Starting performance
      responsibilities: this.getPositionResponsibilities(position),
      employmentType
    };

    business.employees.push(employee);
    business.employeeCount = business.employees.length;
    business.lastUpdated = new Date();

    // Record hiring event
    this.recordBusinessEvent(businessId, BusinessEventType.HIRED_EMPLOYEE,
      `Hired new ${position}`, {
        financial: -0.1, // Increased expenses
        operational: 0.2, // Improved operations
        reputation: 0.05,
        strategic: 0.1
      });

    return true;
  }

  /**
   * Fire an employee from a business
   */
  fireEmployee(businessId: string, citizenId: string): boolean {
    const business = this.businesses.get(businessId);
    if (!business) {
      throw new Error(`Business ${businessId} not found`);
    }

    const employeeIndex = business.employees.findIndex(emp => emp.citizenId === citizenId);
    if (employeeIndex === -1) {
      return false;
    }

    const employee = business.employees[employeeIndex];
    business.employees.splice(employeeIndex, 1);
    business.employeeCount = business.employees.length;
    business.lastUpdated = new Date();

    // Record firing event
    this.recordBusinessEvent(businessId, BusinessEventType.FIRED_EMPLOYEE,
      `Terminated ${employee.position}`, {
        financial: 0.05, // Reduced expenses
        operational: -0.1, // Reduced capacity
        reputation: -0.02,
        strategic: -0.05
      });

    return true;
  }

  /**
   * Get business analytics and performance metrics
   */
  getBusinessAnalytics(businessId: string): any {
    const business = this.businesses.get(businessId);
    if (!business) {
      throw new Error(`Business ${businessId} not found`);
    }

    const metrics = business.monthlyMetrics;
    const recentMetrics = metrics.slice(-12); // Last 12 months

    return {
      business,
      performance: {
        monthlyRevenue: business.monthlyRevenue,
        monthlyExpenses: business.monthlyExpenses,
        profitMargin: business.profitMargin,
        cashFlow: business.monthlyRevenue - business.monthlyExpenses,
        returnOnInvestment: business.currentCapital > 0 ? 
          (business.currentCapital - business.initialCapital) / business.initialCapital : 0
      },
      trends: {
        revenueGrowth: this.calculateGrowthRate(recentMetrics.map(m => m.revenue)),
        profitGrowth: this.calculateGrowthRate(recentMetrics.map(m => m.profit)),
        customerGrowth: this.calculateGrowthRate(recentMetrics.map(m => m.customerCount)),
        marketShareGrowth: this.calculateGrowthRate(recentMetrics.map(m => m.marketShare))
      },
      risks: {
        cashFlowRisk: business.currentCapital < business.monthlyExpenses * 2,
        competitionRisk: business.marketShare < 0.05,
        reputationRisk: business.reputation < 0.3,
        growthRisk: business.monthlyRevenue < business.monthlyExpenses * 1.1
      },
      opportunities: {
        expansionReady: business.profitMargin > 0.15 && business.currentCapital > business.initialCapital * 1.5,
        hiringRecommended: business.monthlyRevenue > business.monthlyExpenses * 1.3,
        newProductOpportunity: business.reputation > 0.7 && business.marketShare > 0.1
      }
    };
  }

  // Helper methods
  private mapBusinessTypeToLegalStructure(businessType: BusinessType): LegalStructure {
    switch (businessType) {
      case BusinessType.SOLE_PROPRIETORSHIP: return LegalStructure.SOLE_PROPRIETORSHIP;
      case BusinessType.LLC: return LegalStructure.LLC;
      case BusinessType.CORPORATION: return LegalStructure.C_CORP;
      case BusinessType.PARTNERSHIP: return LegalStructure.GENERAL_PARTNERSHIP;
      default: return LegalStructure.LLC;
    }
  }

  private getDefaultOperatingHours(industry: BusinessIndustry): any {
    const standardHours = {
      open: '09:00',
      close: '17:00',
      closed: false
    };

    const closedDay = {
      open: '00:00',
      close: '00:00',
      closed: true
    };

    switch (industry) {
      case BusinessIndustry.FOOD_SERVICE:
        return {
          monday: { open: '07:00', close: '20:00', closed: false },
          tuesday: { open: '07:00', close: '20:00', closed: false },
          wednesday: { open: '07:00', close: '20:00', closed: false },
          thursday: { open: '07:00', close: '20:00', closed: false },
          friday: { open: '07:00', close: '21:00', closed: false },
          saturday: { open: '08:00', close: '21:00', closed: false },
          sunday: { open: '08:00', close: '18:00', closed: false }
        };
      case BusinessIndustry.RETAIL:
        return {
          monday: standardHours,
          tuesday: standardHours,
          wednesday: standardHours,
          thursday: standardHours,
          friday: { open: '09:00', close: '21:00', closed: false },
          saturday: { open: '09:00', close: '21:00', closed: false },
          sunday: { open: '11:00', close: '18:00', closed: false }
        };
      default:
        return {
          monday: standardHours,
          tuesday: standardHours,
          wednesday: standardHours,
          thursday: standardHours,
          friday: standardHours,
          saturday: closedDay,
          sunday: closedDay
        };
    }
  }

  private getDefaultBusinessModel(industry: BusinessIndustry): BusinessModel {
    switch (industry) {
      case BusinessIndustry.RETAIL: return BusinessModel.B2C_RETAIL;
      case BusinessIndustry.FOOD_SERVICE: return BusinessModel.B2C_RETAIL;
      case BusinessIndustry.PROFESSIONAL_SERVICES: return BusinessModel.B2B_SERVICES;
      case BusinessIndustry.TECHNOLOGY: return BusinessModel.B2B_SERVICES;
      case BusinessIndustry.HEALTHCARE: return BusinessModel.B2C_RETAIL;
      case BusinessIndustry.MANUFACTURING: return BusinessModel.MANUFACTURING;
      default: return BusinessModel.B2B_SERVICES;
    }
  }

  private calculateInitialExpenses(opportunity: BusinessOpportunity, capital: number): number {
    // Estimate monthly expenses as percentage of initial capital
    return capital * 0.15; // 15% of capital as monthly expenses
  }

  private calculateInitialRisk(opportunity: BusinessOpportunity, owner: Citizen, capital: number): RiskLevel {
    let riskScore = 0;

    // Capital adequacy
    if (capital < opportunity.minimumCapital * 1.5) riskScore += 2;
    if (capital < opportunity.minimumCapital * 1.2) riskScore += 1;

    // Owner experience (based on age and skills)
    if (owner.age < 25) riskScore += 1;
    const avgSkill = Object.values(owner.skills).reduce((sum, skill) => sum + skill, 0) / Object.keys(owner.skills).length;
    if (avgSkill < 6) riskScore += 2;

    // Market competition
    if (opportunity.competition === CompetitionLevel.HIGH) riskScore += 2;
    if (opportunity.competition === CompetitionLevel.INTENSE) riskScore += 3;

    // Success probability
    if (opportunity.successProbability < 0.5) riskScore += 2;

    if (riskScore >= 6) return RiskLevel.VERY_HIGH;
    if (riskScore >= 4) return RiskLevel.HIGH;
    if (riskScore >= 2) return RiskLevel.MODERATE;
    if (riskScore >= 1) return RiskLevel.LOW;
    return RiskLevel.VERY_LOW;
  }

  private generateInitialProducts(industry: BusinessIndustry): Product[] {
    switch (industry) {
      case BusinessIndustry.FOOD_SERVICE:
        return [
          {
            id: 'coffee',
            name: 'Coffee',
            category: ProductCategory.FOOD_BEVERAGE,
            price: 3.50,
            cost: 1.20,
            margin: 0.66,
            demand: 0.8,
            quality: 0.7,
            description: 'Freshly brewed coffee'
          },
          {
            id: 'pastries',
            name: 'Pastries',
            category: ProductCategory.FOOD_BEVERAGE,
            price: 4.00,
            cost: 1.50,
            margin: 0.63,
            demand: 0.6,
            quality: 0.7,
            description: 'Fresh baked pastries'
          }
        ];
      case BusinessIndustry.RETAIL:
        return [
          {
            id: 'general_merchandise',
            name: 'General Merchandise',
            category: ProductCategory.CONSUMER_GOODS,
            price: 25.00,
            cost: 15.00,
            margin: 0.40,
            demand: 0.5,
            quality: 0.6,
            description: 'Various consumer goods'
          }
        ];
      default:
        return [];
    }
  }

  private generateInitialServices(industry: BusinessIndustry): Service[] {
    switch (industry) {
      case BusinessIndustry.PROFESSIONAL_SERVICES:
        return [
          {
            id: 'consulting',
            name: 'Business Consulting',
            category: ServiceCategory.PROFESSIONAL,
            hourlyRate: 150,
            cost: 50,
            margin: 0.67,
            demand: 0.6,
            quality: 0.7,
            description: 'Professional business consulting services'
          }
        ];
      case BusinessIndustry.TECHNOLOGY:
        return [
          {
            id: 'software_development',
            name: 'Software Development',
            category: ServiceCategory.PROFESSIONAL,
            hourlyRate: 125,
            cost: 40,
            margin: 0.68,
            demand: 0.8,
            quality: 0.8,
            description: 'Custom software development services'
          }
        ];
      case BusinessIndustry.HEALTHCARE:
        return [
          {
            id: 'physical_therapy',
            name: 'Physical Therapy Session',
            category: ServiceCategory.HEALTHCARE,
            hourlyRate: 100,
            cost: 30,
            margin: 0.70,
            demand: 0.7,
            quality: 0.8,
            description: 'Professional physical therapy treatment'
          }
        ];
      default:
        return [];
    }
  }

  private generateTargetMarket(opportunity: BusinessOpportunity): any {
    return {
      demographics: {
        ageGroups: { '25-34': 0.3, '35-44': 0.4, '45-54': 0.3 },
        incomeGroups: { 'middle': 0.6, 'upper_middle': 0.4 },
        educationLevels: { 'bachelors': 0.5, 'masters': 0.3, 'high_school': 0.2 },
        occupations: { 'professional': 0.7, 'management': 0.3 }
      },
      psychographics: ['quality_conscious', 'convenience_seeking', 'price_sensitive'],
      geographicScope: 'city' as any,
      marketSize: opportunity.marketSize,
      averageSpending: 100
    };
  }

  private recordBusinessEvent(
    businessId: string, 
    eventType: BusinessEventType, 
    description: string, 
    impact: any
  ): BusinessEvent {
    const event: BusinessEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      businessId,
      eventType,
      description,
      impact,
      timestamp: new Date(),
      isOngoing: false
    };

    this.businessEvents.push(event);
    return event;
  }

  // Additional helper methods would be implemented here...
  private calculateProductSales(business: Business, product: Product): number {
    const baseSales = business.customerBase * product.demand * product.price * 0.1;
    return baseSales * (0.8 + Math.random() * 0.4); // ±20% variation
  }

  private calculateServiceSales(business: Business, service: Service): number {
    const baseHours = business.customerBase * service.demand * 2; // 2 hours per customer per month
    return baseHours * service.hourlyRate * (0.8 + Math.random() * 0.4);
  }

  private getSeasonalMultiplier(industry: BusinessIndustry): number {
    const month = new Date().getMonth();
    switch (industry) {
      case BusinessIndustry.RETAIL:
        return month === 11 ? 1.5 : month >= 9 ? 1.2 : 1.0; // Holiday boost
      case BusinessIndustry.FOOD_SERVICE:
        return month >= 5 && month <= 8 ? 1.1 : 0.95; // Summer boost
      default:
        return 1.0;
    }
  }

  private calculateRent(business: Business): number {
    const baseRent = business.initialCapital * 0.05; // 5% of initial capital
    return baseRent;
  }

  private calculateUtilities(business: Business): number {
    return business.employeeCount * 200; // $200 per employee
  }

  private calculateSupplyCosts(business: Business): number {
    return business.monthlyRevenue * 0.3; // 30% of revenue
  }

  private calculateInsurance(business: Business): number {
    return business.initialCapital * 0.002; // 0.2% of capital monthly
  }

  private updateMarketPosition(business: Business): void {
    // Simplified market share calculation
    business.customerBase = Math.max(0, business.customerBase + Math.floor(business.reputation * 10 - 5));
    business.marketShare = Math.min(0.5, business.customerBase / 10000); // Max 50% market share
  }

  private updateReputation(business: Business): void {
    const performanceScore = business.profitMargin > 0 ? 0.01 : -0.02;
    const serviceScore = business.employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / business.employees.length * 0.01;
    
    business.reputation = Math.max(0, Math.min(1, business.reputation + performanceScore + serviceScore));
  }

  private assessRiskLevel(business: Business): RiskLevel {
    let riskScore = 0;

    if (business.currentCapital < business.monthlyExpenses) riskScore += 3;
    if (business.profitMargin < 0) riskScore += 2;
    if (business.reputation < 0.3) riskScore += 2;
    if (business.marketShare < 0.01) riskScore += 1;

    if (riskScore >= 6) return RiskLevel.CRITICAL;
    if (riskScore >= 4) return RiskLevel.VERY_HIGH;
    if (riskScore >= 3) return RiskLevel.HIGH;
    if (riskScore >= 2) return RiskLevel.MODERATE;
    if (riskScore >= 1) return RiskLevel.LOW;
    return RiskLevel.VERY_LOW;
  }

  private assessGrowthStage(business: Business): GrowthStage {
    const monthsInOperation = Math.floor((Date.now() - business.foundedDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsInOperation < 6) return GrowthStage.SEED;
    if (monthsInOperation < 24) return GrowthStage.STARTUP;
    if (business.profitMargin > 0.15 && business.monthlyRevenue > business.initialCapital * 0.1) return GrowthStage.GROWTH;
    if (business.profitMargin > 0.2) return GrowthStage.EXPANSION;
    if (business.profitMargin > 0) return GrowthStage.MATURITY;
    return GrowthStage.DECLINE;
  }

  private getPositionResponsibilities(position: string): string[] {
    const responsibilities: Record<string, string[]> = {
      'Manager': ['Team leadership', 'Operations oversight', 'Strategic planning'],
      'Sales': ['Customer acquisition', 'Revenue generation', 'Client relations'],
      'Marketing': ['Brand promotion', 'Lead generation', 'Market analysis'],
      'Accountant': ['Financial reporting', 'Tax preparation', 'Budget management'],
      'Developer': ['Software development', 'System maintenance', 'Technical support'],
      'Designer': ['Creative design', 'Brand development', 'User experience']
    };

    return responsibilities[position] || ['General operations', 'Task completion', 'Team support'];
  }

  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;
    const first = values[0] || 1;
    const last = values[values.length - 1] || 1;
    return (last - first) / first;
  }

  // Getter methods
  getBusiness(businessId: string): Business | undefined {
    return this.businesses.get(businessId);
  }

  getAllBusinesses(): Business[] {
    return Array.from(this.businesses.values());
  }

  getBusinessesByOwner(ownerId: string): Business[] {
    return Array.from(this.businesses.values()).filter(b => b.ownerId === ownerId);
  }

  getBusinessesByIndustry(industry: BusinessIndustry): Business[] {
    return Array.from(this.businesses.values()).filter(b => b.industry === industry);
  }

  getBusinessOpportunities(): BusinessOpportunity[] {
    return Array.from(this.businessOpportunities.values());
  }

  getBusinessEvents(businessId?: string): BusinessEvent[] {
    if (businessId) {
      return this.businessEvents.filter(e => e.businessId === businessId);
    }
    return this.businessEvents;
  }
}
