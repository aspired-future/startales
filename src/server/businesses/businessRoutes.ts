/**
 * Business System API Routes
 * Sprint 7: Comprehensive small business and entrepreneurship APIs
 */

import { Router, Request, Response } from 'express';
import { BusinessEngine } from './BusinessEngine.js';
import { MarketDynamics } from './MarketDynamics.js';
import { CitizenEngine } from '../population/CitizenEngine.js';
import { ProfessionEngine } from '../professions/ProfessionEngine.js';

const router = Router();

// Initialize engines
const businessEngine = new BusinessEngine();
const marketDynamics = new MarketDynamics();
const citizenEngine = new CitizenEngine();
const professionEngine = new ProfessionEngine();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'business-system',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Get all businesses
 */
router.get('/businesses', (req: Request, res: Response) => {
  try {
    const { industry, cityId, status, ownerId } = req.query;
    let businesses = businessEngine.getAllBusinesses();
    
    // Apply filters
    if (industry) {
      businesses = businesses.filter(b => b.industry === industry);
    }
    if (cityId) {
      businesses = businesses.filter(b => b.cityId === cityId);
    }
    if (status) {
      businesses = businesses.filter(b => b.status === status);
    }
    if (ownerId) {
      businesses = businesses.filter(b => b.ownerId === ownerId);
    }
    
    res.json({
      success: true,
      data: {
        businesses,
        totalCount: businesses.length,
        industries: [...new Set(businesses.map(b => b.industry))],
        cities: [...new Set(businesses.map(b => b.cityId))],
        summary: {
          totalBusinesses: businesses.length,
          activeBusinesses: businesses.filter(b => b.status === 'operating' || b.status === 'growing').length,
          totalEmployees: businesses.reduce((sum, b) => sum + b.employeeCount, 0),
          totalRevenue: businesses.reduce((sum, b) => sum + b.monthlyRevenue * 12, 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch businesses',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific business details
 */
router.get('/businesses/:businessId', (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const business = businessEngine.getBusiness(businessId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }
    
    // Get business analytics
    const analytics = businessEngine.getBusinessAnalytics(businessId);
    
    // Get competitor analysis
    const allBusinesses = businessEngine.getAllBusinesses();
    const competitors = allBusinesses.filter(b => 
      b.industry === business.industry && 
      b.cityId === business.cityId && 
      b.id !== business.id
    );
    const competitorAnalysis = marketDynamics.analyzeCompetition(business, competitors);
    
    res.json({
      success: true,
      data: {
        business,
        analytics,
        competitors: competitorAnalysis,
        events: businessEngine.getBusinessEvents(businessId).slice(-10) // Last 10 events
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create a new business
 */
router.post('/businesses', (req: Request, res: Response) => {
  try {
    const { 
      ownerId, 
      opportunityId, 
      businessName, 
      initialCapital,
      customization 
    } = req.body;
    
    if (!ownerId || !opportunityId || !businessName || !initialCapital) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: ownerId, opportunityId, businessName, initialCapital'
      });
    }
    
    // Get citizen data
    const citizen = citizenEngine.getCitizen(ownerId);
    if (!citizen) {
      return res.status(404).json({
        success: false,
        error: 'Citizen not found'
      });
    }
    
    // Create business
    const business = businessEngine.createBusiness(
      citizen,
      opportunityId,
      businessName,
      initialCapital,
      customization
    );
    
    if (!business) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create business. Check citizen qualifications and capital requirements.'
      });
    }
    
    res.status(201).json({
      success: true,
      data: {
        business,
        message: `Successfully created ${businessName}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create business',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get business opportunities
 */
router.get('/opportunities', (req: Request, res: Response) => {
  try {
    const { citizenId } = req.query;
    const opportunities = businessEngine.getBusinessOpportunities();
    
    let filteredOpportunities = opportunities;
    
    // Filter by citizen qualifications if provided
    if (citizenId) {
      const citizen = citizenEngine.getCitizen(citizenId as string);
      if (citizen) {
        filteredOpportunities = opportunities.filter(opp => {
          // Check if citizen has required skills
          return opp.requiredSkills.every(skill => 
            (citizen.skills[skill] || 0) >= 5
          );
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        opportunities: filteredOpportunities,
        totalCount: filteredOpportunities.length,
        industries: [...new Set(filteredOpportunities.map(o => o.industry))],
        averageCapital: filteredOpportunities.reduce((sum, o) => sum + o.minimumCapital, 0) / filteredOpportunities.length || 0,
        averageSuccessRate: filteredOpportunities.reduce((sum, o) => sum + o.successProbability, 0) / filteredOpportunities.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business opportunities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Hire employee for a business
 */
router.post('/businesses/:businessId/employees', (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { citizenId, position, salary, employmentType = 'full_time' } = req.body;
    
    if (!citizenId || !position || !salary) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: citizenId, position, salary'
      });
    }
    
    const success = businessEngine.hireEmployee(
      businessId,
      citizenId,
      position,
      salary,
      employmentType as any
    );
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to hire employee. Check business finances and employee availability.'
      });
    }
    
    // Update citizen employment in profession system
    const citizen = citizenEngine.getCitizen(citizenId);
    if (citizen) {
      // This would integrate with the profession system to update employment status
      // For now, we'll just return success
    }
    
    res.json({
      success: true,
      data: {
        message: `Successfully hired ${position}`,
        business: businessEngine.getBusiness(businessId)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to hire employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Fire employee from a business
 */
router.delete('/businesses/:businessId/employees/:citizenId', (req: Request, res: Response) => {
  try {
    const { businessId, citizenId } = req.params;
    
    const success = businessEngine.fireEmployee(businessId, citizenId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found or already terminated'
      });
    }
    
    res.json({
      success: true,
      data: {
        message: 'Employee terminated successfully',
        business: businessEngine.getBusiness(businessId)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to terminate employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Process monthly operations for all businesses
 */
router.post('/operations/monthly', (req: Request, res: Response) => {
  try {
    const events = businessEngine.processMonthlyOperations();
    
    // Also process market dynamics
    const allBusinesses = businessEngine.getAllBusinesses();
    const marketEvents = marketDynamics.simulateMarketDynamics(allBusinesses);
    
    res.json({
      success: true,
      data: {
        businessEvents: events,
        marketEvents,
        totalEvents: events.length + marketEvents.length,
        summary: {
          businessesProcessed: allBusinesses.length,
          eventsGenerated: events.length,
          marketEventsGenerated: marketEvents.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process monthly operations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get market analysis for an industry and city
 */
router.get('/market-analysis/:industry/:cityId', (req: Request, res: Response) => {
  try {
    const { industry, cityId } = req.params;
    
    const allBusinesses = businessEngine.getAllBusinesses();
    const marketAnalysis = marketDynamics.analyzeMarket(
      industry as any,
      cityId,
      allBusinesses
    );
    
    // Get market segments
    const segments = marketDynamics.getMarketSegments()
      .filter(s => s.industry === industry);
    
    // Get industry trends
    const trends = marketDynamics.getIndustryTrends(industry as any);
    
    res.json({
      success: true,
      data: {
        marketAnalysis,
        segments,
        trends,
        businessesInMarket: allBusinesses.filter(b => 
          b.industry === industry && b.cityId === cityId
        ).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze market',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get business analytics and performance metrics
 */
router.get('/businesses/:businessId/analytics', (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    
    const analytics = businessEngine.getBusinessAnalytics(businessId);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get competitor analysis for a business
 */
router.get('/businesses/:businessId/competitors', (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    
    const business = businessEngine.getBusiness(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }
    
    const allBusinesses = businessEngine.getAllBusinesses();
    const competitors = allBusinesses.filter(b => 
      b.industry === business.industry && 
      b.cityId === business.cityId && 
      b.id !== business.id
    );
    
    const competitorAnalysis = marketDynamics.analyzeCompetition(business, competitors);
    
    res.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          marketShare: business.marketShare,
          reputation: business.reputation
        },
        competitors: competitorAnalysis,
        marketSummary: {
          totalCompetitors: competitors.length,
          averageMarketShare: competitors.reduce((sum, c) => sum + c.marketShare, 0) / competitors.length || 0,
          marketLeader: competitors.reduce((leader, c) => 
            c.marketShare > leader.marketShare ? c : leader, competitors[0] || business
          )
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to analyze competitors',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get business events and history
 */
router.get('/businesses/:businessId/events', (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { limit = 20, eventType } = req.query;
    
    let events = businessEngine.getBusinessEvents(businessId);
    
    // Filter by event type if provided
    if (eventType) {
      events = events.filter(e => e.eventType === eventType);
    }
    
    // Limit results
    events = events.slice(-Number(limit));
    
    res.json({
      success: true,
      data: {
        events,
        totalCount: events.length,
        eventTypes: [...new Set(events.map(e => e.eventType))],
        recentEvents: events.slice(-5) // Last 5 events
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get business statistics summary
 */
router.get('/statistics', (req: Request, res: Response) => {
  try {
    const businesses = businessEngine.getAllBusinesses();
    
    // Calculate industry statistics
    const industryStats = businesses.reduce((acc, business) => {
      const industry = business.industry;
      if (!acc[industry]) {
        acc[industry] = {
          count: 0,
          totalRevenue: 0,
          totalEmployees: 0,
          averageMarketShare: 0,
          averageReputation: 0
        };
      }
      
      acc[industry].count++;
      acc[industry].totalRevenue += business.monthlyRevenue * 12;
      acc[industry].totalEmployees += business.employeeCount;
      acc[industry].averageMarketShare += business.marketShare;
      acc[industry].averageReputation += business.reputation;
      
      return acc;
    }, {} as any);
    
    // Calculate averages
    Object.keys(industryStats).forEach(industry => {
      const stats = industryStats[industry];
      stats.averageMarketShare = stats.averageMarketShare / stats.count;
      stats.averageReputation = stats.averageReputation / stats.count;
      stats.averageRevenue = stats.totalRevenue / stats.count;
      stats.averageEmployees = stats.totalEmployees / stats.count;
    });
    
    // Calculate status distribution
    const statusDistribution = businesses.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate growth stage distribution
    const growthStageDistribution = businesses.reduce((acc, b) => {
      acc[b.growthStage] = (acc[b.growthStage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    res.json({
      success: true,
      data: {
        totalBusinesses: businesses.length,
        totalEmployees: businesses.reduce((sum, b) => sum + b.employeeCount, 0),
        totalRevenue: businesses.reduce((sum, b) => sum + b.monthlyRevenue * 12, 0),
        averageEmployeesPerBusiness: businesses.reduce((sum, b) => sum + b.employeeCount, 0) / businesses.length || 0,
        industryStatistics: industryStats,
        statusDistribution,
        growthStageDistribution,
        topBusinesses: businesses
          .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
          .slice(0, 10)
          .map(b => ({
            id: b.id,
            name: b.name,
            industry: b.industry,
            monthlyRevenue: b.monthlyRevenue,
            employeeCount: b.employeeCount,
            marketShare: b.marketShare
          }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get market segments
 */
router.get('/market-segments', (req: Request, res: Response) => {
  try {
    const { industry } = req.query;
    let segments = marketDynamics.getMarketSegments();
    
    if (industry) {
      segments = segments.filter(s => s.industry === industry);
    }
    
    res.json({
      success: true,
      data: {
        segments,
        totalCount: segments.length,
        industries: [...new Set(segments.map(s => s.industry))],
        averageGrowthRate: segments.reduce((sum, s) => sum + s.growthRate, 0) / segments.length || 0,
        averageProfitability: segments.reduce((sum, s) => sum + s.profitability, 0) / segments.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market segments',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
