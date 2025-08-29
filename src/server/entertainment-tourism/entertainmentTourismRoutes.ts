/**
 * Entertainment, Culture & Tourism API Routes
 * Handles all entertainment industry, cultural development, and tourism endpoints
 */

import express from 'express';
import { Pool } from 'pg';
import { EntertainmentTourismSimulationIntegration } from './EntertainmentTourismSimulationIntegration';
import { DEFAULT_ENTERTAINMENT_TOURISM_KNOBS, ENTERTAINMENT_TOURISM_AI_PROMPTS, ENTERTAINMENT_TOURISM_KNOB_CATEGORIES } from './entertainmentTourismKnobs';

const router = express.Router();

// Initialize simulation integration
let entertainmentTourismSimulation: EntertainmentTourismSimulationIntegration;

export function createEntertainmentTourismRoutes(pool: Pool): express.Router {
  entertainmentTourismSimulation = new EntertainmentTourismSimulationIntegration(pool);
  
  // Cultural Development Endpoints
  
  /**
   * GET /api/entertainment-tourism/cultural/heritage/:civilizationId
   * Get cultural heritage data for a civilization
   */
  router.get('/cultural/heritage/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const state = entertainmentTourismSimulation.getSimulationState(civilizationId);
      
      if (!state) {
        return res.status(404).json({ 
          success: false, 
          error: 'Civilization not found in entertainment/tourism simulation' 
        });
      }
      
      res.json({
        success: true,
        data: {
          civilizationId,
          culturalHeritage: state.culturalHeritage,
          lastUpdated: state.lastUpdated
        }
      });
    } catch (error) {
      console.error('Error getting cultural heritage:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get cultural heritage data' 
      });
    }
  });
  
  /**
   * POST /api/entertainment-tourism/cultural/events/:civilizationId
   * Create or schedule cultural events
   */
  router.post('/cultural/events/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { eventType, duration, budget, description } = req.body;
      
      // Mock cultural event creation
      const culturalEvent = {
        id: `event_${Date.now()}`,
        type: eventType || 'festival',
        civilizationId,
        duration: duration || 7,
        budget: budget || 100000,
        description: description || 'Cultural celebration event',
        status: 'scheduled',
        expectedImpact: {
          cultural: 15,
          economic: 8,
          social: 12,
          tourism: 10
        },
        createdAt: new Date()
      };
      
      res.json({
        success: true,
        data: {
          event: culturalEvent,
          message: 'Cultural event scheduled successfully'
        }
      });
    } catch (error) {
      console.error('Error creating cultural event:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create cultural event' 
      });
    }
  });
  
  /**
   * GET /api/entertainment-tourism/cultural/sites/:civilizationId
   * Get cultural sites and attractions
   */
  router.get('/cultural/sites/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      // Mock cultural sites data
      const culturalSites = [
        {
          id: 'site_001',
          name: 'Ancient Temple Complex',
          type: 'historical',
          significance: 'high',
          condition: 85,
          visitorCapacity: 5000,
          annualVisitors: 120000,
          maintenanceCost: 50000,
          touristRating: 4.6
        },
        {
          id: 'site_002', 
          name: 'Traditional Arts District',
          type: 'cultural',
          significance: 'medium',
          condition: 92,
          visitorCapacity: 8000,
          annualVisitors: 200000,
          maintenanceCost: 30000,
          touristRating: 4.3
        },
        {
          id: 'site_003',
          name: 'Natural Heritage Park',
          type: 'natural',
          significance: 'high',
          condition: 78,
          visitorCapacity: 15000,
          annualVisitors: 350000,
          maintenanceCost: 80000,
          touristRating: 4.8
        }
      ];
      
      res.json({
        success: true,
        data: {
          civilizationId,
          sites: culturalSites,
          totalSites: culturalSites.length,
          totalAnnualVisitors: culturalSites.reduce((sum, site) => sum + site.annualVisitors, 0),
          averageRating: culturalSites.reduce((sum, site) => sum + site.touristRating, 0) / culturalSites.length
        }
      });
    } catch (error) {
      console.error('Error getting cultural sites:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get cultural sites data' 
      });
    }
  });
  
  // Entertainment Industry Endpoints
  
  /**
   * GET /api/entertainment-tourism/entertainment/industry/:civilizationId
   * Get entertainment industry data
   */
  router.get('/entertainment/industry/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const state = entertainmentTourismSimulation.getSimulationState(civilizationId);
      
      if (!state) {
        return res.status(404).json({ 
          success: false, 
          error: 'Civilization not found in entertainment/tourism simulation' 
        });
      }
      
      res.json({
        success: true,
        data: {
          civilizationId,
          entertainmentIndustry: state.entertainmentIndustry,
          lastUpdated: state.lastUpdated
        }
      });
    } catch (error) {
      console.error('Error getting entertainment industry data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get entertainment industry data' 
      });
    }
  });
  
  /**
   * GET /api/entertainment-tourism/entertainment/venues/:civilizationId
   * Get entertainment venues and facilities
   */
  router.get('/entertainment/venues/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      // Mock entertainment venues data
      const venues = [
        {
          id: 'venue_001',
          name: 'Grand Performance Hall',
          type: 'theater',
          capacity: 2500,
          utilizationRate: 78,
          annualEvents: 180,
          averageTicketPrice: 45,
          annualRevenue: 2025000,
          employeeCount: 85
        },
        {
          id: 'venue_002',
          name: 'Sports Arena Complex',
          type: 'sports',
          capacity: 25000,
          utilizationRate: 65,
          annualEvents: 45,
          averageTicketPrice: 75,
          annualRevenue: 8437500,
          employeeCount: 200
        },
        {
          id: 'venue_003',
          name: 'Digital Entertainment Hub',
          type: 'gaming',
          capacity: 500,
          utilizationRate: 85,
          annualEvents: 300,
          averageTicketPrice: 25,
          annualRevenue: 3750000,
          employeeCount: 120
        },
        {
          id: 'venue_004',
          name: 'Concert Amphitheater',
          type: 'music',
          capacity: 15000,
          utilizationRate: 72,
          annualEvents: 60,
          averageTicketPrice: 55,
          annualRevenue: 3564000,
          employeeCount: 95
        }
      ];
      
      const totalCapacity = venues.reduce((sum, venue) => sum + venue.capacity, 0);
      const totalRevenue = venues.reduce((sum, venue) => sum + venue.annualRevenue, 0);
      const totalEmployees = venues.reduce((sum, venue) => sum + venue.employeeCount, 0);
      const averageUtilization = venues.reduce((sum, venue) => sum + venue.utilizationRate, 0) / venues.length;
      
      res.json({
        success: true,
        data: {
          civilizationId,
          venues,
          summary: {
            totalVenues: venues.length,
            totalCapacity,
            totalRevenue,
            totalEmployees,
            averageUtilization
          }
        }
      });
    } catch (error) {
      console.error('Error getting entertainment venues:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get entertainment venues data' 
      });
    }
  });
  
  /**
   * POST /api/entertainment-tourism/entertainment/content/:civilizationId
   * Create or manage entertainment content
   */
  router.post('/entertainment/content/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { contentType, title, genre, budget, targetAudience, description } = req.body;
      
      // Mock content creation
      const content = {
        id: `content_${Date.now()}`,
        type: contentType || 'film',
        title: title || 'Untitled Production',
        genre: genre || 'drama',
        civilizationId,
        budget: budget || 1000000,
        targetAudience: targetAudience || 'general',
        description: description || 'Entertainment content production',
        status: 'in_development',
        expectedRevenue: budget * 1.5,
        productionTime: 12, // months
        createdAt: new Date()
      };
      
      res.json({
        success: true,
        data: {
          content,
          message: 'Entertainment content project created successfully'
        }
      });
    } catch (error) {
      console.error('Error creating entertainment content:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create entertainment content' 
      });
    }
  });
  
  // Tourism Sector Endpoints
  
  /**
   * GET /api/entertainment-tourism/tourism/performance/:civilizationId
   * Get tourism performance metrics
   */
  router.get('/tourism/performance/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const state = entertainmentTourismSimulation.getSimulationState(civilizationId);
      
      if (!state) {
        return res.status(404).json({ 
          success: false, 
          error: 'Civilization not found in entertainment/tourism simulation' 
        });
      }
      
      res.json({
        success: true,
        data: {
          civilizationId,
          tourismSector: state.tourismSector,
          lastUpdated: state.lastUpdated
        }
      });
    } catch (error) {
      console.error('Error getting tourism performance:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get tourism performance data' 
      });
    }
  });
  
  /**
   * GET /api/entertainment-tourism/tourism/attractions/:civilizationId
   * Get tourist attractions and their performance
   */
  router.get('/tourism/attractions/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      // Mock tourist attractions data
      const attractions = [
        {
          id: 'attraction_001',
          name: 'Starfall Observatory',
          category: 'scientific',
          type: 'observatory',
          popularityRating: 4.7,
          annualVisitors: 180000,
          ticketPrice: 35,
          operatingCosts: 250000,
          profitMargin: 0.45,
          seasonalVariation: 0.2,
          accessibilityRating: 85
        },
        {
          id: 'attraction_002',
          name: 'Crystal Caves Network',
          category: 'natural',
          type: 'geological',
          popularityRating: 4.9,
          annualVisitors: 320000,
          ticketPrice: 28,
          operatingCosts: 180000,
          profitMargin: 0.65,
          seasonalVariation: 0.35,
          accessibilityRating: 70
        },
        {
          id: 'attraction_003',
          name: 'Heritage Village',
          category: 'cultural',
          type: 'living_history',
          popularityRating: 4.4,
          annualVisitors: 150000,
          ticketPrice: 22,
          operatingCosts: 200000,
          profitMargin: 0.35,
          seasonalVariation: 0.15,
          accessibilityRating: 90
        },
        {
          id: 'attraction_004',
          name: 'Adventure Sports Complex',
          category: 'recreational',
          type: 'adventure',
          popularityRating: 4.6,
          annualVisitors: 95000,
          ticketPrice: 65,
          operatingCosts: 320000,
          profitMargin: 0.55,
          seasonalVariation: 0.45,
          accessibilityRating: 60
        }
      ];
      
      const totalVisitors = attractions.reduce((sum, attr) => sum + attr.annualVisitors, 0);
      const totalRevenue = attractions.reduce((sum, attr) => sum + (attr.annualVisitors * attr.ticketPrice), 0);
      const averageRating = attractions.reduce((sum, attr) => sum + attr.popularityRating, 0) / attractions.length;
      
      res.json({
        success: true,
        data: {
          civilizationId,
          attractions,
          summary: {
            totalAttractions: attractions.length,
            totalVisitors,
            totalRevenue,
            averageRating,
            categoryCounts: {
              natural: attractions.filter(a => a.category === 'natural').length,
              cultural: attractions.filter(a => a.category === 'cultural').length,
              scientific: attractions.filter(a => a.category === 'scientific').length,
              recreational: attractions.filter(a => a.category === 'recreational').length
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting tourist attractions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get tourist attractions data' 
      });
    }
  });
  
  /**
   * POST /api/entertainment-tourism/tourism/marketing/:civilizationId
   * Launch tourism marketing campaigns
   */
  router.post('/tourism/marketing/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { campaignType, budget, duration, targetMarkets, message } = req.body;
      
      // Mock marketing campaign creation
      const campaign = {
        id: `campaign_${Date.now()}`,
        type: campaignType || 'digital',
        civilizationId,
        budget: budget || 500000,
        duration: duration || 90, // days
        targetMarkets: targetMarkets || ['domestic', 'regional'],
        message: message || 'Discover the wonders of our civilization',
        status: 'active',
        expectedReach: budget * 10, // people reached
        expectedConversionRate: 0.02,
        expectedNewVisitors: Math.floor(budget * 10 * 0.02),
        launchedAt: new Date()
      };
      
      res.json({
        success: true,
        data: {
          campaign,
          message: 'Tourism marketing campaign launched successfully'
        }
      });
    } catch (error) {
      console.error('Error launching marketing campaign:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to launch marketing campaign' 
      });
    }
  });
  
  // Economic Impact Endpoints
  
  /**
   * GET /api/entertainment-tourism/economic/impact/:civilizationId
   * Get economic impact analysis
   */
  router.get('/economic/impact/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const state = entertainmentTourismSimulation.getSimulationState(civilizationId);
      
      if (!state) {
        return res.status(404).json({ 
          success: false, 
          error: 'Civilization not found in entertainment/tourism simulation' 
        });
      }
      
      res.json({
        success: true,
        data: {
          civilizationId,
          economicImpact: state.economicImpact,
          lastUpdated: state.lastUpdated
        }
      });
    } catch (error) {
      console.error('Error getting economic impact:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get economic impact data' 
      });
    }
  });
  
  /**
   * GET /api/entertainment-tourism/economic/employment/:civilizationId
   * Get employment data for entertainment and tourism sectors
   */
  router.get('/economic/employment/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      // Mock employment data
      const employmentData = {
        entertainment: {
          totalJobs: 12500,
          sectors: {
            performing_arts: 3200,
            sports: 2800,
            gaming: 2100,
            film_tv: 1900,
            music: 1500,
            other: 1000
          },
          averageSalary: 45000,
          jobGrowthRate: 0.08,
          skillLevels: {
            entry: 0.35,
            mid: 0.45,
            senior: 0.20
          }
        },
        tourism: {
          totalJobs: 18700,
          sectors: {
            hospitality: 7200,
            food_service: 4500,
            transportation: 2800,
            attractions: 2100,
            retail: 1600,
            other: 500
          },
          averageSalary: 38000,
          jobGrowthRate: 0.12,
          skillLevels: {
            entry: 0.50,
            mid: 0.35,
            senior: 0.15
          }
        },
        combined: {
          totalJobs: 31200,
          percentOfTotalEmployment: 8.7,
          economicMultiplier: 2.3,
          indirectJobsCreated: 40560
        }
      };
      
      res.json({
        success: true,
        data: {
          civilizationId,
          employment: employmentData,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error getting employment data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get employment data' 
      });
    }
  });
  
  // Simulation & Management Endpoints
  
  /**
   * POST /api/entertainment-tourism/simulate/:civilizationId
   * Run entertainment/tourism simulation
   */
  router.post('/simulate/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { knobSettings } = req.body;
      
      // Get current knobs or use defaults
      const currentKnobs = entertainmentTourismSimulation.getKnobStates(civilizationId);
      const knobs = { ...currentKnobs, ...knobSettings };
      
      // Run simulation
      const simulationResult = await entertainmentTourismSimulation.runOrchestratorSimulation({
        civilization_id: civilizationId,
        knobs
      });
      
      res.json({
        success: true,
        data: {
          civilizationId,
          simulationResult,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error running entertainment/tourism simulation:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to run simulation' 
      });
    }
  });
  
  /**
   * GET /api/entertainment-tourism/knobs/:civilizationId
   * Get current knob settings
   */
  router.get('/knobs/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const knobs = entertainmentTourismSimulation.getKnobStates(civilizationId);
      
      res.json({
        success: true,
        data: {
          civilizationId,
          knobs,
          categories: ENTERTAINMENT_TOURISM_KNOB_CATEGORIES,
          aiPrompts: ENTERTAINMENT_TOURISM_AI_PROMPTS
        }
      });
    } catch (error) {
      console.error('Error getting knobs:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get knob settings' 
      });
    }
  });
  
  /**
   * PUT /api/entertainment-tourism/knobs/:civilizationId
   * Update knob settings
   */
  router.put('/knobs/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { knobUpdates } = req.body;
      
      // Validate knob values (0-100)
      const validatedKnobs: any = {};
      for (const [key, value] of Object.entries(knobUpdates)) {
        if (typeof value === 'number' && value >= 0 && value <= 100) {
          validatedKnobs[key] = value;
        }
      }
      
      // Update knobs
      entertainmentTourismSimulation.updateKnobStates(civilizationId, validatedKnobs);
      
      res.json({
        success: true,
        data: {
          civilizationId,
          updatedKnobs: validatedKnobs,
          message: 'Knob settings updated successfully'
        }
      });
    } catch (error) {
      console.error('Error updating knobs:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update knob settings' 
      });
    }
  });
  
  /**
   * GET /api/entertainment-tourism/events/:civilizationId
   * Get entertainment/tourism events
   */
  router.get('/events/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const events = entertainmentTourismSimulation.generateEvents(civilizationId);
      
      res.json({
        success: true,
        data: {
          civilizationId,
          events,
          eventCount: events.length
        }
      });
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get events' 
      });
    }
  });
  
  /**
   * GET /api/entertainment-tourism/analytics/:civilizationId
   * Get comprehensive analytics dashboard data
   */
  router.get('/analytics/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const state = entertainmentTourismSimulation.getSimulationState(civilizationId);
      
      if (!state) {
        return res.status(404).json({ 
          success: false, 
          error: 'Civilization not found in entertainment/tourism simulation' 
        });
      }
      
      // Compile comprehensive analytics
      const analytics = {
        overview: {
          totalSectorValue: state.entertainmentIndustry.industrySize + state.tourismSector.tourismRevenue,
          gdpContribution: state.economicImpact.totalGdpContribution,
          totalEmployment: state.economicImpact.employmentContribution,
          touristSatisfaction: state.tourismSector.touristSatisfactionIndex,
          culturalVitality: state.culturalHeritage.heritageScore
        },
        trends: {
          touristArrivals: state.tourismSector.touristArrivals,
          tourismRevenue: state.tourismSector.tourismRevenue,
          entertainmentGrowth: state.entertainmentIndustry.innovationIndex,
          culturalParticipation: state.socialMetrics.culturalParticipationRate
        },
        performance: {
          entertainmentIndustry: state.entertainmentIndustry,
          tourismSector: state.tourismSector,
          culturalHeritage: state.culturalHeritage,
          economicImpact: state.economicImpact,
          socialMetrics: state.socialMetrics
        },
        lastUpdated: state.lastUpdated
      };
      
      res.json({
        success: true,
        data: {
          civilizationId,
          analytics
        }
      });
    } catch (error) {
      console.error('Error getting analytics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get analytics data' 
      });
    }
  });
  
  return router;
}

export default createEntertainmentTourismRoutes;
