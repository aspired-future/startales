import express from 'express';
import { getEconomicEcosystemService } from './EconomicEcosystemService.js';
import { getProceduralCorporationGenerator } from './ProceduralCorporationGenerator.js';
import { getDynamicCityGenerator } from './DynamicCityGenerator.js';
import { getTradePactsService } from './TradePactsService.js';
import corporateLifecycleRouter from './corporateLifecycleRoutes.js';

const router = express.Router();

/**
 * GET /api/economic-ecosystem/overview/:civilization - Get economic ecosystem overview
 */
router.get('/overview/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getEconomicEcosystemService();
    const overview = await service.getMarketOverview(civilizationId);

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching economic ecosystem overview:', error);
    res.status(500).json({
      error: 'Failed to fetch economic ecosystem overview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/product-categories - Get product categories
 */
router.get('/product-categories', async (req, res) => {
  try {
    const strategicOnly = req.query.strategic_only === 'true';
    
    const service = getEconomicEcosystemService();
    const categories = await service.getProductCategories(strategicOnly);

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({
      error: 'Failed to fetch product categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/products/:categoryId - Get products by category
 */
router.get('/products/:categoryId', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    
    const service = getEconomicEcosystemService();
    const products = await service.getProductsByCategory(categoryId);

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      error: 'Failed to fetch products by category',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/materials - Get materials
 */
router.get('/materials', async (req, res) => {
  try {
    const category = req.query.category as string;
    
    const service = getEconomicEcosystemService();
    const materials = await service.getMaterials(category);

    res.json({
      success: true,
      data: materials,
      count: materials.length
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      error: 'Failed to fetch materials',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/markets/:civilization - Get city markets
 */
router.get('/markets/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getEconomicEcosystemService();
    const markets = await service.getCityMarkets(civilizationId);

    res.json({
      success: true,
      data: markets,
      count: markets.length
    });
  } catch (error) {
    console.error('Error fetching city markets:', error);
    res.status(500).json({
      error: 'Failed to fetch city markets',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/markets/:marketId/demand - Get market demand
 */
router.get('/markets/:marketId/demand', async (req, res) => {
  try {
    const marketId = parseInt(req.params.marketId);
    const productId = req.query.product_id ? parseInt(req.query.product_id as string) : undefined;
    
    const service = getEconomicEcosystemService();
    const demand = await service.getMarketDemand(marketId, productId);

    res.json({
      success: true,
      data: demand,
      count: demand.length
    });
  } catch (error) {
    console.error('Error fetching market demand:', error);
    res.status(500).json({
      error: 'Failed to fetch market demand',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/markets/:marketId/supply - Get market supply
 */
router.get('/markets/:marketId/supply', async (req, res) => {
  try {
    const marketId = parseInt(req.params.marketId);
    const productId = req.query.product_id ? parseInt(req.query.product_id as string) : undefined;
    
    const service = getEconomicEcosystemService();
    const supply = await service.getMarketSupply(marketId, productId);

    res.json({
      success: true,
      data: supply,
      count: supply.length
    });
  } catch (error) {
    console.error('Error fetching market supply:', error);
    res.status(500).json({
      error: 'Failed to fetch market supply',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/markets/:marketId/equilibrium/:productId - Calculate market equilibrium
 */
router.get('/markets/:marketId/equilibrium/:productId', async (req, res) => {
  try {
    const marketId = parseInt(req.params.marketId);
    const productId = parseInt(req.params.productId);
    
    const service = getEconomicEcosystemService();
    const equilibrium = await service.calculateMarketEquilibrium(marketId, productId);

    res.json({
      success: true,
      data: equilibrium
    });
  } catch (error) {
    console.error('Error calculating market equilibrium:', error);
    res.status(500).json({
      error: 'Failed to calculate market equilibrium',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/economic-ecosystem/markets/:marketId/prices - Update market prices
 */
router.put('/markets/:marketId/prices', async (req, res) => {
  try {
    const marketId = parseInt(req.params.marketId);
    
    const service = getEconomicEcosystemService();
    await service.updateMarketPrices(marketId);

    res.json({
      success: true,
      message: 'Market prices updated successfully'
    });
  } catch (error) {
    console.error('Error updating market prices:', error);
    res.status(500).json({
      error: 'Failed to update market prices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/production-chains - Get production chains
 */
router.get('/production-chains', async (req, res) => {
  try {
    const corporationId = req.query.corporation_id ? parseInt(req.query.corporation_id as string) : undefined;
    const productId = req.query.product_id ? parseInt(req.query.product_id as string) : undefined;
    
    const service = getEconomicEcosystemService();
    const chains = await service.getProductionChains(corporationId, productId);

    res.json({
      success: true,
      data: chains,
      count: chains.length
    });
  } catch (error) {
    console.error('Error fetching production chains:', error);
    res.status(500).json({
      error: 'Failed to fetch production chains',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/production-chains - Create production chain
 */
router.post('/production-chains', async (req, res) => {
  try {
    const chainData = req.body;
    
    if (!chainData.product_id || !chainData.corporation_id || !chainData.location_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'product_id, corporation_id, and location_id are required'
      });
    }

    const service = getEconomicEcosystemService();
    const chain = await service.createProductionChain(chainData);

    res.json({
      success: true,
      data: chain,
      message: 'Production chain created successfully'
    });
  } catch (error) {
    console.error('Error creating production chain:', error);
    res.status(500).json({
      error: 'Failed to create production chain',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-policies/:civilization - Get trade policies
 */
router.get('/trade-policies/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const targetCivilizationId = req.query.target_civilization_id ? parseInt(req.query.target_civilization_id as string) : undefined;
    
    const service = getEconomicEcosystemService();
    const policies = await service.getTradePolicies(civilizationId, targetCivilizationId);

    res.json({
      success: true,
      data: policies,
      count: policies.length
    });
  } catch (error) {
    console.error('Error fetching trade policies:', error);
    res.status(500).json({
      error: 'Failed to fetch trade policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-policies/:policyId/products - Get product trade policies
 */
router.get('/trade-policies/:policyId/products', async (req, res) => {
  try {
    const policyId = parseInt(req.params.policyId);
    
    const service = getEconomicEcosystemService();
    const productPolicies = await service.getProductTradePolicies(policyId);

    res.json({
      success: true,
      data: productPolicies,
      count: productPolicies.length
    });
  } catch (error) {
    console.error('Error fetching product trade policies:', error);
    res.status(500).json({
      error: 'Failed to fetch product trade policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/tariff-calculation - Calculate tariff impact
 */
router.post('/tariff-calculation', async (req, res) => {
  try {
    const { source_civilization_id, target_civilization_id, product_category_id, trade_value } = req.body;
    
    if (!source_civilization_id || !target_civilization_id || !product_category_id || !trade_value) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'source_civilization_id, target_civilization_id, product_category_id, and trade_value are required'
      });
    }

    const service = getEconomicEcosystemService();
    const tariffImpact = await service.calculateTariffImpact(
      source_civilization_id,
      target_civilization_id,
      product_category_id,
      trade_value
    );

    res.json({
      success: true,
      data: tariffImpact
    });
  } catch (error) {
    console.error('Error calculating tariff impact:', error);
    res.status(500).json({
      error: 'Failed to calculate tariff impact',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/government-contracts/:civilization - Get government contracts
 */
router.get('/government-contracts/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const contractType = req.query.contract_type as string;
    const status = req.query.status as string;
    
    const service = getEconomicEcosystemService();
    const contracts = await service.getGovernmentContracts(civilizationId, contractType, status);

    res.json({
      success: true,
      data: contracts,
      count: contracts.length
    });
  } catch (error) {
    console.error('Error fetching government contracts:', error);
    res.status(500).json({
      error: 'Failed to fetch government contracts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/government-contracts - Create government contract
 */
router.post('/government-contracts', async (req, res) => {
  try {
    const contractData = req.body;
    
    if (!contractData.civilization_id || !contractData.issuing_department || !contractData.contract_type) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'civilization_id, issuing_department, and contract_type are required'
      });
    }

    const service = getEconomicEcosystemService();
    const contract = await service.createGovernmentContract(contractData);

    res.json({
      success: true,
      data: contract,
      message: 'Government contract created successfully'
    });
  } catch (error) {
    console.error('Error creating government contract:', error);
    res.status(500).json({
      error: 'Failed to create government contract',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/industry-statistics/:civilization - Get industry statistics
 */
router.get('/industry-statistics/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const sector = req.query.sector as string;
    const reportingPeriod = req.query.reporting_period ? new Date(req.query.reporting_period as string) : undefined;
    
    const service = getEconomicEcosystemService();
    const statistics = await service.getIndustryStatistics(civilizationId, sector, reportingPeriod);

    res.json({
      success: true,
      data: statistics,
      count: statistics.length
    });
  } catch (error) {
    console.error('Error fetching industry statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch industry statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-balance/:civilization - Get trade balance
 */
router.get('/trade-balance/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const period = req.query.period ? new Date(req.query.period as string) : undefined;
    
    const service = getEconomicEcosystemService();
    const tradeBalance = await service.calculateTradeBalance(civilizationId, period);

    res.json({
      success: true,
      data: tradeBalance
    });
  } catch (error) {
    console.error('Error fetching trade balance:', error);
    res.status(500).json({
      error: 'Failed to fetch trade balance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/skills/:cityId - Get location skills
 */
router.get('/skills/:cityId', async (req, res) => {
  try {
    const cityId = parseInt(req.params.cityId);
    const skillCategory = req.query.skill_category as string;
    
    const service = getEconomicEcosystemService();
    const skills = await service.getLocationSkills(cityId, skillCategory);

    res.json({
      success: true,
      data: skills,
      count: skills.length
    });
  } catch (error) {
    console.error('Error fetching location skills:', error);
    res.status(500).json({
      error: 'Failed to fetch location skills',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/economic-ecosystem/skills/:cityId/:skillCategory/:specificSkill - Update skill availability
 */
router.put('/skills/:cityId/:skillCategory/:specificSkill', async (req, res) => {
  try {
    const cityId = parseInt(req.params.cityId);
    const skillCategory = req.params.skillCategory;
    const specificSkill = req.params.specificSkill;
    const changes = req.body;
    
    const service = getEconomicEcosystemService();
    await service.updateSkillAvailability(cityId, skillCategory, specificSkill, changes);

    res.json({
      success: true,
      message: 'Skill availability updated successfully'
    });
  } catch (error) {
    console.error('Error updating skill availability:', error);
    res.status(500).json({
      error: 'Failed to update skill availability',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/generate-corporation - Generate a new corporation
 */
router.post('/generate-corporation', async (req, res) => {
  try {
    const { exchange_id, sector, size_category, products } = req.body;
    
    if (!exchange_id || !sector) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'exchange_id and sector are required'
      });
    }

    const generator = getProceduralCorporationGenerator();
    const result = await generator.generateAndInsertCorporation(
      exchange_id,
      sector,
      size_category || 'medium',
      products
    );

    res.json({
      success: true,
      data: result,
      message: 'Corporation generated successfully'
    });
  } catch (error) {
    console.error('Error generating corporation:', error);
    res.status(500).json({
      error: 'Failed to generate corporation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/generate-ecosystem/:civilization - Generate complete economic ecosystem
 */
router.post('/generate-ecosystem/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const companiesPerSector = req.body.companies_per_sector || 3;
    
    const generator = getProceduralCorporationGenerator();
    const result = await generator.generateEconomicEcosystem(civilizationId, companiesPerSector);

    res.json({
      success: true,
      data: result,
      message: 'Economic ecosystem generated successfully'
    });
  } catch (error) {
    console.error('Error generating economic ecosystem:', error);
    res.status(500).json({
      error: 'Failed to generate economic ecosystem',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/generate-preview/:sector - Preview generated corporation (without saving)
 */
router.get('/generate-preview/:sector', async (req, res) => {
  try {
    const sector = req.params.sector;
    const sizeCategory = req.query.size_category as 'startup' | 'small' | 'medium' | 'large' | 'mega_corp' || 'medium';
    const products = req.query.products ? (req.query.products as string).split(',') : undefined;
    
    const generator = getProceduralCorporationGenerator();
    const preview = await generator.generateCorporation(1, sector, sizeCategory, products);

    res.json({
      success: true,
      data: preview,
      message: 'Corporation preview generated'
    });
  } catch (error) {
    console.error('Error generating corporation preview:', error);
    res.status(500).json({
      error: 'Failed to generate corporation preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/generate-cities/:civilization - Generate cities for a civilization
 */
router.post('/generate-cities/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const planetId = req.body.planet_id || civilizationId; // Default to same as civilization
    const cityCount = req.body.city_count;
    
    const generator = getDynamicCityGenerator();
    const cities = await generator.generateCivilizationCities(civilizationId, planetId, cityCount);
    const insertedIds = await generator.insertCities(cities);

    res.json({
      success: true,
      data: {
        cities_created: cities.length,
        city_ids: insertedIds,
        cities: cities
      },
      message: 'Cities generated successfully'
    });
  } catch (error) {
    console.error('Error generating cities:', error);
    res.status(500).json({
      error: 'Failed to generate cities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/generate-all-cities - Generate complete city ecosystem
 */
router.post('/generate-all-cities', async (req, res) => {
  try {
    const generator = getDynamicCityGenerator();
    const result = await generator.generateCompleteEcosystem();

    res.json({
      success: true,
      data: result,
      message: 'Complete city ecosystem generated successfully'
    });
  } catch (error) {
    console.error('Error generating complete city ecosystem:', error);
    res.status(500).json({
      error: 'Failed to generate complete city ecosystem',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/generate-city-preview/:civilization - Preview city generation
 */
router.get('/generate-city-preview/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const planetId = req.query.planet_id ? parseInt(req.query.planet_id as string) : civilizationId;
    const specialization = req.query.specialization as string || 'technology';
    const economicTier = req.query.economic_tier as string;
    
    const generator = getDynamicCityGenerator();
    const preview = await generator.generateCity(civilizationId, planetId, specialization, economicTier);

    res.json({
      success: true,
      data: preview,
      message: 'City preview generated'
    });
  } catch (error) {
    console.error('Error generating city preview:', error);
    res.status(500).json({
      error: 'Failed to generate city preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/economic-ecosystem/cities/:cityId/evolve - Evolve city economic tier
 */
router.put('/cities/:cityId/evolve', async (req, res) => {
  try {
    const cityId = parseInt(req.params.cityId);
    
    const generator = getDynamicCityGenerator();
    const success = await generator.evolveCityEconomicTier(cityId);

    if (success) {
      res.json({
        success: true,
        message: 'City economic tier evolved successfully'
      });
    } else {
      res.status(400).json({
        error: 'Failed to evolve city',
        message: 'City may already be at maximum tier or not found'
      });
    }
  } catch (error) {
    console.error('Error evolving city:', error);
    res.status(500).json({
      error: 'Failed to evolve city',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/economic-ecosystem/cities/clear - Clear all cities (for regeneration)
 */
router.delete('/cities/clear', async (req, res) => {
  try {
    const generator = getDynamicCityGenerator();
    await generator.clearAllCities();

    res.json({
      success: true,
      message: 'All cities cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cities:', error);
    res.status(500).json({
      error: 'Failed to clear cities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-pacts - Get trade pacts
 */
router.get('/trade-pacts', async (req, res) => {
  try {
    const civilizationId = req.query.civilization_id ? parseInt(req.query.civilization_id as string) : undefined;
    const status = req.query.status as string;
    const pactType = req.query.pact_type as string;
    
    const service = getTradePactsService();
    const pacts = await service.getTradePacts(civilizationId, status, pactType);

    res.json({
      success: true,
      data: pacts,
      count: pacts.length
    });
  } catch (error) {
    console.error('Error fetching trade pacts:', error);
    res.status(500).json({
      error: 'Failed to fetch trade pacts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-pacts/:pactId - Get trade pact details
 */
router.get('/trade-pacts/:pactId', async (req, res) => {
  try {
    const pactId = parseInt(req.params.pactId);
    
    const service = getTradePactsService();
    const pact = await service.getTradePactDetails(pactId);

    if (!pact) {
      return res.status(404).json({
        error: 'Trade pact not found',
        message: `No trade pact found with ID ${pactId}`
      });
    }

    res.json({
      success: true,
      data: pact
    });
  } catch (error) {
    console.error('Error fetching trade pact details:', error);
    res.status(500).json({
      error: 'Failed to fetch trade pact details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/trade-pacts - Create new trade pact
 */
router.post('/trade-pacts', async (req, res) => {
  try {
    const pactData = req.body;
    
    if (!pactData.pact_name || !pactData.pact_type || !pactData.member_civilizations) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'pact_name, pact_type, and member_civilizations are required'
      });
    }

    const service = getTradePactsService();
    const pact = await service.createTradePact(pactData);

    res.json({
      success: true,
      data: pact,
      message: 'Trade pact created successfully'
    });
  } catch (error) {
    console.error('Error creating trade pact:', error);
    res.status(500).json({
      error: 'Failed to create trade pact',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/trade-pacts/generate - Generate trade pact template
 */
router.post('/trade-pacts/generate', async (req, res) => {
  try {
    const { pact_type, member_civilizations, lead_negotiator } = req.body;
    
    if (!pact_type || !member_civilizations || !lead_negotiator) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'pact_type, member_civilizations, and lead_negotiator are required'
      });
    }

    const service = getTradePactsService();
    const template = await service.generateTradePactTemplate(pact_type, member_civilizations, lead_negotiator);

    res.json({
      success: true,
      data: template,
      message: 'Trade pact template generated successfully'
    });
  } catch (error) {
    console.error('Error generating trade pact template:', error);
    res.status(500).json({
      error: 'Failed to generate trade pact template',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/economic-ecosystem/trade-pacts/:pactId/status - Update trade pact status
 */
router.put('/trade-pacts/:pactId/status', async (req, res) => {
  try {
    const pactId = parseInt(req.params.pactId);
    const { status, ratification_date, effective_date } = req.body;
    
    if (!status) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'status is required'
      });
    }

    const service = getTradePactsService();
    await service.updateTradePactStatus(
      pactId, 
      status, 
      ratification_date ? new Date(ratification_date) : undefined,
      effective_date ? new Date(effective_date) : undefined
    );

    res.json({
      success: true,
      message: 'Trade pact status updated successfully'
    });
  } catch (error) {
    console.error('Error updating trade pact status:', error);
    res.status(500).json({
      error: 'Failed to update trade pact status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-pacts/:pactId/impact/:civilization - Calculate trade pact impact
 */
router.get('/trade-pacts/:pactId/impact/:civilization', async (req, res) => {
  try {
    const pactId = parseInt(req.params.pactId);
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getTradePactsService();
    const impact = await service.calculateTradePactImpact(pactId, civilizationId);

    res.json({
      success: true,
      data: impact
    });
  } catch (error) {
    console.error('Error calculating trade pact impact:', error);
    res.status(500).json({
      error: 'Failed to calculate trade pact impact',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/trade-pacts/:pactId/negotiations - Start negotiation
 */
router.post('/trade-pacts/:pactId/negotiations', async (req, res) => {
  try {
    const pactId = parseInt(req.params.pactId);
    const { participating_civilizations } = req.body;
    
    if (!participating_civilizations) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'participating_civilizations is required'
      });
    }

    const service = getTradePactsService();
    const negotiation = await service.startNegotiation(pactId, participating_civilizations);

    res.json({
      success: true,
      data: negotiation,
      message: 'Trade pact negotiation started successfully'
    });
  } catch (error) {
    console.error('Error starting trade pact negotiation:', error);
    res.status(500).json({
      error: 'Failed to start trade pact negotiation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/trade-pacts/:pactId/compliance - Record compliance data
 */
router.post('/trade-pacts/:pactId/compliance', async (req, res) => {
  try {
    const pactId = parseInt(req.params.pactId);
    const { civilization_id, compliance_data } = req.body;
    
    if (!civilization_id || !compliance_data) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'civilization_id and compliance_data are required'
      });
    }

    const service = getTradePactsService();
    await service.recordCompliance(pactId, civilization_id, compliance_data);

    res.json({
      success: true,
      message: 'Compliance data recorded successfully'
    });
  } catch (error) {
    console.error('Error recording compliance data:', error);
    res.status(500).json({
      error: 'Failed to record compliance data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-pacts/:pactId/compliance - Get compliance report
 */
router.get('/trade-pacts/:pactId/compliance', async (req, res) => {
  try {
    const pactId = parseInt(req.params.pactId);
    const period = req.query.period ? new Date(req.query.period as string) : undefined;
    
    const service = getTradePactsService();
    const compliance = await service.getComplianceReport(pactId, period);

    res.json({
      success: true,
      data: compliance,
      count: compliance.length
    });
  } catch (error) {
    console.error('Error fetching compliance report:', error);
    res.status(500).json({
      error: 'Failed to fetch compliance report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/economic-ecosystem/trade-pacts/disputes - File a dispute
 */
router.post('/trade-pacts/disputes', async (req, res) => {
  try {
    const disputeData = req.body;
    
    if (!disputeData.pact_id || !disputeData.complainant_civilization || !disputeData.respondent_civilization) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'pact_id, complainant_civilization, and respondent_civilization are required'
      });
    }

    const service = getTradePactsService();
    const dispute = await service.fileDispute(disputeData);

    res.json({
      success: true,
      data: dispute,
      message: 'Dispute filed successfully'
    });
  } catch (error) {
    console.error('Error filing dispute:', error);
    res.status(500).json({
      error: 'Failed to file dispute',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-pacts/disputes - Get disputes
 */
router.get('/trade-pacts/disputes', async (req, res) => {
  try {
    const pactId = req.query.pact_id ? parseInt(req.query.pact_id as string) : undefined;
    const civilizationId = req.query.civilization_id ? parseInt(req.query.civilization_id as string) : undefined;
    const status = req.query.status as string;
    
    const service = getTradePactsService();
    const disputes = await service.getDisputes(pactId, civilizationId, status);

    res.json({
      success: true,
      data: disputes,
      count: disputes.length
    });
  } catch (error) {
    console.error('Error fetching disputes:', error);
    res.status(500).json({
      error: 'Failed to fetch disputes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/economic-ecosystem/trade-pacts/analytics/:civilization - Get trade pact analytics
 */
router.get('/trade-pacts/analytics/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getTradePactsService();
    const analytics = await service.getTradePactAnalytics(civilizationId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching trade pact analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch trade pact analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mount Corporate Lifecycle routes
router.use('/lifecycle', corporateLifecycleRouter);

export default router;
