/**
 * Small Business Ecosystem API Routes
 *
 * RESTful API endpoints for the Small Business System
 */

import express from 'express';
import { Pool } from 'pg';
import { SmallBusinessService } from './SmallBusinessService';
import { SmallBusinessGenerator } from './SmallBusinessGenerator';
import { initializeSmallBusinessSchema } from './smallBusinessSchema';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Small Business Ecosystem System
const smallBusinessKnobsData = {
  // Business Formation & Entrepreneurship
  entrepreneurship_encouragement: 0.8,       // Entrepreneurship encouragement and startup promotion
  business_formation_ease: 0.7,              // Business formation ease and regulatory simplification
  innovation_startup_support: 0.7,           // Innovation startup support and incubation programs
  
  // Economic Development & Growth
  local_economic_development: 0.8,           // Local economic development and community growth
  job_creation_emphasis: 0.8,                // Job creation emphasis and employment generation
  economic_diversification_priority: 0.7,    // Economic diversification priority and sector balance
  
  // Financial Support & Access
  small_business_lending_accessibility: 0.7, // Small business lending accessibility and credit availability
  microfinance_program_strength: 0.6,        // Microfinance program strength and micro-lending support
  grant_funding_availability: 0.6,           // Grant funding availability and financial assistance
  
  // Regulatory Environment & Compliance
  regulatory_burden_reduction: 0.7,          // Regulatory burden reduction and compliance simplification
  tax_incentive_generosity: 0.6,             // Tax incentive generosity and small business benefits
  licensing_process_efficiency: 0.8,         // Licensing process efficiency and permit streamlining
  
  // Market Access & Competition
  market_competition_fairness: 0.8,          // Market competition fairness and anti-monopoly enforcement
  procurement_opportunity_access: 0.7,       // Government procurement opportunity access for small businesses
  export_assistance_program_quality: 0.6,    // Export assistance program quality and international market access
  
  // Technology & Digital Transformation
  digital_transformation_support: 0.7,       // Digital transformation support and technology adoption
  e_commerce_platform_integration: 0.7,      // E-commerce platform integration and online market access
  cybersecurity_assistance_provision: 0.7,   // Cybersecurity assistance provision and digital security support
  
  // Workforce Development & Skills
  workforce_training_program_quality: 0.7,   // Workforce training program quality and skill development
  apprenticeship_program_expansion: 0.6,     // Apprenticeship program expansion and hands-on learning
  entrepreneurial_education_emphasis: 0.7,   // Entrepreneurial education emphasis and business skill training
  
  // Community Integration & Social Impact
  community_business_integration: 0.8,       // Community business integration and local engagement
  social_enterprise_support: 0.6,            // Social enterprise support and mission-driven business promotion
  minority_business_development: 0.7,        // Minority business development and inclusive entrepreneurship
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Small Business
const smallBusinessKnobSystem = new EnhancedKnobSystem(smallBusinessKnobsData);

// Apply small business knobs to game state
function applySmallBusinessKnobsToGameState() {
  const knobs = smallBusinessKnobSystem.knobs;
  
  // Apply business formation settings
  const businessFormation = (knobs.entrepreneurship_encouragement + knobs.business_formation_ease + 
    knobs.innovation_startup_support) / 3;
  
  // Apply economic development settings
  const economicDevelopment = (knobs.local_economic_development + knobs.job_creation_emphasis + 
    knobs.economic_diversification_priority) / 3;
  
  // Apply financial support settings
  const financialSupport = (knobs.small_business_lending_accessibility + knobs.microfinance_program_strength + 
    knobs.grant_funding_availability) / 3;
  
  // Apply regulatory environment settings
  const regulatoryEnvironment = (knobs.regulatory_burden_reduction + knobs.tax_incentive_generosity + 
    knobs.licensing_process_efficiency) / 3;
  
  // Apply market access settings
  const marketAccess = (knobs.market_competition_fairness + knobs.procurement_opportunity_access + 
    knobs.export_assistance_program_quality) / 3;
  
  // Apply community integration settings
  const communityIntegration = (knobs.community_business_integration + knobs.social_enterprise_support + 
    knobs.minority_business_development) / 3;
  
  console.log('Applied small business knobs to game state:', {
    businessFormation,
    economicDevelopment,
    financialSupport,
    regulatoryEnvironment,
    marketAccess,
    communityIntegration
  });
}

let businessService: SmallBusinessService;
let businessGenerator: SmallBusinessGenerator;

export function initializeSmallBusinessService(pool: Pool): void {
  businessService = new SmallBusinessService(pool);
  businessGenerator = new SmallBusinessGenerator(pool);
  
  // Initialize database schema
  initializeSmallBusinessSchema(pool).catch(error => {
    console.error('❌ Failed to initialize small business schema:', error);
  });
  
  console.log('✅ Small Business Service initialized');
}

export function getSmallBusinessService(): SmallBusinessService {
  if (!businessService) {
    throw new Error('Small business service not initialized. Call initializeSmallBusinessService first.');
  }
  return businessService;
}

export function getSmallBusinessGenerator(): SmallBusinessGenerator {
  if (!businessGenerator) {
    throw new Error('Small business generator not initialized. Call initializeSmallBusinessService first.');
  }
  return businessGenerator;
}

// Generate business ecosystem for a city
router.post('/generate-ecosystem', async (req, res) => {
  try {
    const { 
      civilizationId, 
      planetId, 
      cityId, 
      targetBusinessCount = 500,
      economicClimate = 'stable',
      seed 
    } = req.body;

    if (!civilizationId || !planetId || !cityId) {
      return res.status(400).json({
        error: 'Missing required parameters: civilizationId, planetId, cityId'
      });
    }

    const context = {
      civilization_id: civilizationId,
      planet_id: planetId,
      city_id: cityId,
      economic_climate: economicClimate,
      population_density: 1000,
      average_income: 50000,
      technology_level: 60,
      regulatory_environment: 'moderate' as const,
      market_saturation: {},
      local_preferences: [],
      seasonal_factors: []
    };

    const ecosystem = await businessGenerator.generateCityBusinessEcosystem(
      context,
      targetBusinessCount,
      seed
    );

    // Store businesses in database
    for (const business of ecosystem.businesses) {
      await businessService.createBusiness(business);
    }

    // Store distribution networks
    for (const network of ecosystem.distributionNetworks) {
      await businessService.createDistributionNetwork(network);
    }

    res.json({
      success: true,
      ecosystem: {
        total_businesses: ecosystem.totalGenerated,
        category_distribution: ecosystem.categoryDistribution,
        distribution_networks: ecosystem.distributionNetworks.length
      },
      message: `Generated ${ecosystem.totalGenerated} businesses and ${ecosystem.distributionNetworks.length} distribution networks`
    });

  } catch (error) {
    console.error('❌ Error generating business ecosystem:', error);
    res.status(500).json({
      error: 'Failed to generate business ecosystem',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get business by ID
router.get('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const business = await businessService.getBusiness(businessId);

    if (!business) {
      return res.status(404).json({
        error: `Business not found: ${businessId}`
      });
    }

    res.json({
      success: true,
      business
    });

  } catch (error) {
    console.error('❌ Error getting business:', error);
    res.status(500).json({
      error: 'Failed to get business',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get businesses by city
router.get('/city/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const { limit = 50, category } = req.query;

    let businesses;
    if (category) {
      businesses = await businessService.getBusinessesByCategory(
        category as string,
        undefined,
        parseInt(limit as string)
      );
      // Filter by city
      businesses = businesses.filter(b => b.city_id === parseInt(cityId));
    } else {
      businesses = await businessService.getBusinessesByCity(
        parseInt(cityId),
        parseInt(limit as string)
      );
    }

    res.json({
      success: true,
      city_id: parseInt(cityId),
      count: businesses.length,
      businesses: businesses.map(b => ({
        id: b.id,
        name: b.name,
        category: b.category,
        subcategory: b.subcategory,
        business_type: b.business_type,
        location: b.location,
        owner: b.owner,
        business_health: b.business_health,
        financial_info: {
          monthly_revenue: b.financial_info.monthly_revenue,
          monthly_profit: b.financial_info.monthly_profit,
          current_cash: b.financial_info.current_cash
        },
        employees_count: b.employees.length,
        products_services_count: b.products_services.length
      }))
    });

  } catch (error) {
    console.error('❌ Error getting businesses by city:', error);
    res.status(500).json({
      error: 'Failed to get businesses',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get businesses by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { civilizationId, limit = 50 } = req.query;

    const businesses = await businessService.getBusinessesByCategory(
      category,
      civilizationId ? parseInt(civilizationId as string) : undefined,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      category,
      civilization_id: civilizationId ? parseInt(civilizationId as string) : 'all',
      count: businesses.length,
      businesses: businesses.map(b => ({
        id: b.id,
        name: b.name,
        subcategory: b.subcategory,
        city_id: b.city_id,
        business_health: b.business_health,
        financial_info: {
          monthly_revenue: b.financial_info.monthly_revenue,
          monthly_profit: b.financial_info.monthly_profit
        },
        market_presence: b.market_presence
      }))
    });

  } catch (error) {
    console.error('❌ Error getting businesses by category:', error);
    res.status(500).json({
      error: 'Failed to get businesses by category',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get business statistics
router.get('/statistics/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const statistics = await businessService.getBusinessStatistics(parseInt(civilizationId));

    res.json({
      success: true,
      civilization_id: parseInt(civilizationId),
      statistics: {
        total_businesses: parseInt(statistics.total_businesses),
        category_breakdown: {
          retail: parseInt(statistics.retail_count),
          food_service: parseInt(statistics.food_service_count),
          professional_services: parseInt(statistics.professional_services_count),
          manufacturing: parseInt(statistics.manufacturing_count),
          technology: parseInt(statistics.technology_count)
        },
        health_metrics: {
          average_business_health: Math.round(parseFloat(statistics.avg_business_health)),
          average_monthly_revenue: Math.round(parseFloat(statistics.avg_monthly_revenue))
        },
        lifecycle_distribution: {
          startup: parseInt(statistics.startup_count),
          growth: parseInt(statistics.growth_count),
          maturity: parseInt(statistics.maturity_count)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting business statistics:', error);
    res.status(500).json({
      error: 'Failed to get business statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get market trends
router.get('/market-trends/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { industryCategory } = req.query;

    const trends = await businessService.getMarketTrends(
      parseInt(civilizationId),
      industryCategory as string
    );

    res.json({
      success: true,
      civilization_id: parseInt(civilizationId),
      industry_category: industryCategory || 'all',
      trends: trends.map(trend => ({
        id: trend.id,
        trend_name: trend.trend_name,
        description: trend.description,
        impact_level: trend.impact_level,
        market_impact_percentage: parseFloat(trend.market_impact_percentage),
        confidence_score: trend.confidence_score,
        start_date: trend.start_date,
        end_date: trend.end_date
      }))
    });

  } catch (error) {
    console.error('❌ Error getting market trends:', error);
    res.status(500).json({
      error: 'Failed to get market trends',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get distribution network
router.get('/distribution/:networkId', async (req, res) => {
  try {
    const { networkId } = req.params;
    const network = await businessService.getDistributionNetwork(networkId);

    if (!network) {
      return res.status(404).json({
        error: `Distribution network not found: ${networkId}`
      });
    }

    res.json({
      success: true,
      network
    });

  } catch (error) {
    console.error('❌ Error getting distribution network:', error);
    res.status(500).json({
      error: 'Failed to get distribution network',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update business
router.put('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const updates = req.body;

    await businessService.updateBusiness(businessId, updates);

    res.json({
      success: true,
      message: `Business ${businessId} updated successfully`
    });

  } catch (error) {
    console.error('❌ Error updating business:', error);
    res.status(500).json({
      error: 'Failed to update business',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete business
router.delete('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;

    await businessService.deleteBusiness(businessId);

    res.json({
      success: true,
      message: `Business ${businessId} deleted successfully`
    });

  } catch (error) {
    console.error('❌ Error deleting business:', error);
    res.status(500).json({
      error: 'Failed to delete business',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get business analytics
router.get('/:businessId/analytics', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { days = 30 } = req.query;

    const analytics = await businessService.getBusinessAnalytics(
      businessId,
      parseInt(days as string)
    );

    res.json({
      success: true,
      business_id: businessId,
      analytics_count: analytics.length,
      analytics
    });

  } catch (error) {
    console.error('❌ Error getting business analytics:', error);
    res.status(500).json({
      error: 'Failed to get business analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'small-business', smallBusinessKnobSystem, applySmallBusinessKnobsToGameState);

export default router;
