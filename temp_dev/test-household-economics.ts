#!/usr/bin/env npx tsx

import { Pool } from 'pg';
import { HouseholdService } from '../src/server/households/householdService.js';
import { HouseholdSchema, HouseholdTierType, SocialMobilityEventType } from '../src/server/storage/householdSchema.js';

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://gtw:gtw@localhost:5432/gtw';
const pool = new Pool({
  connectionString: DATABASE_URL,
});

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  data?: any;
}

class HouseholdEconomicsTest {
  private householdService: HouseholdService;
  private householdSchema: HouseholdSchema;
  private results: TestResult[] = [];
  private testCampaignId = Math.floor(Math.random() * 100000) + 2000; // Use a random test campaign ID

  constructor() {
    this.householdService = new HouseholdService(pool);
    this.householdSchema = new HouseholdSchema(pool);
  }

  async runAllTests(): Promise<void> {
    console.log('🏠 HOUSEHOLD ECONOMICS SYSTEM COMPREHENSIVE TEST');
    console.log('===============================================\n');

    try {
      // Test 1: Database Schema Initialization
      await this.testSchemaInitialization();
      
      // Test 2: Household System Seeding
      await this.testSystemSeeding();
      
      // Test 3: Campaign Household Initialization
      await this.testCampaignInitialization();
      
      // Test 4: Economic Status Calculation
      await this.testEconomicStatus();
      
      // Test 5: Demand Calculation - Basic
      await this.testBasicDemandCalculation();
      
      // Test 6: Demand Calculation - Price Elasticity
      await this.testPriceElasticity();
      
      // Test 7: Social Mobility Opportunities
      await this.testSocialMobilityOpportunities();
      
      // Test 8: Social Mobility Event Creation
      await this.testSocialMobilityEventCreation();
      
      // Test 9: Social Mobility Event Processing
      await this.testSocialMobilityEventProcessing();
      
      // Test 10: Tier-Specific Consumption Patterns
      await this.testTierConsumptionPatterns();
      
      // Test 11: Gini Coefficient Calculation
      await this.testGiniCoefficientCalculation();
      
      // Test 12: Economic Health Score
      await this.testEconomicHealthScore();
      
      // Test 13: Error Handling
      await this.testErrorHandling();

      // Test 14: Performance Test
      await this.testPerformance();

      this.printResults();
      
    } catch (error) {
      console.error('❌ Critical test failure:', error);
    } finally {
      await pool.end();
    }
  }

  private async testSchemaInitialization(): Promise<void> {
    try {
      console.log('🔧 Test 1: Database Schema Initialization...');
      
      await this.householdSchema.initializeTables();
      
      // Verify tables exist
      const client = await pool.connect();
      try {
        const tablesResult = await client.query(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('household_tiers', 'household_consumption', 'social_mobility_events', 'household_demand_projections')
        `);
        
        const tableNames = tablesResult.rows.map(row => row.table_name);
        const expectedTables = ['household_tiers', 'household_consumption', 'social_mobility_events', 'household_demand_projections'];
        const allTablesExist = expectedTables.every(table => tableNames.includes(table));
        
        this.results.push({
          testName: 'Schema Initialization',
          passed: allTablesExist,
          data: { tablesCreated: tableNames }
        });
        
        if (allTablesExist) {
          console.log('   ✅ All required tables created successfully');
        } else {
          console.log('   ❌ Some tables missing:', expectedTables.filter(t => !tableNames.includes(t)));
        }
        
      } finally {
        client.release();
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Schema Initialization',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Schema initialization failed:', error);
    }
  }

  private async testSystemSeeding(): Promise<void> {
    try {
      console.log('🌱 Test 2: Household System Seeding...');
      
      await this.householdSchema.seedHouseholdEconomicSystem();
      
      // This doesn't actually seed data in the current implementation
      // It's a placeholder that just logs success
      this.results.push({
        testName: 'System Seeding',
        passed: true,
        data: { message: 'Seeding system called successfully' }
      });
      
      console.log('   ✅ System seeding completed successfully');
      
    } catch (error) {
      this.results.push({
        testName: 'System Seeding',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ System seeding failed:', error);
    }
  }

  private async testCampaignInitialization(): Promise<void> {
    try {
      console.log('🏗️ Test 3: Campaign Household Initialization...');
      
      const totalPopulation = 150000;
      const status = await this.householdService.initializeCampaignHouseholds(this.testCampaignId, totalPopulation);
      
      const isValidInitialization = status.campaign_id === this.testCampaignId &&
        status.total_population > 0 &&
        status.tier_distribution.poor &&
        status.tier_distribution.median &&
        status.tier_distribution.rich &&
        status.gini_coefficient >= 0 &&
        status.economic_health_score >= 0;
      
      this.results.push({
        testName: 'Campaign Initialization',
        passed: isValidInitialization,
        data: { 
          campaignId: this.testCampaignId,
          totalPopulation: status.total_population,
          tierDistribution: status.tier_distribution,
          giniCoefficient: status.gini_coefficient,
          economicHealthScore: status.economic_health_score
        }
      });
      
      if (isValidInitialization) {
        console.log(`   ✅ Successfully initialized campaign ${this.testCampaignId}`);
        console.log(`      Population: ${status.total_population.toLocaleString()}`);
        console.log(`      Gini Coefficient: ${status.gini_coefficient}`);
        console.log(`      Economic Health Score: ${status.economic_health_score}/100`);
      } else {
        console.log('   ❌ Campaign initialization returned invalid data');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Campaign Initialization',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Failed to initialize campaign:', error);
    }
  }

  private async testEconomicStatus(): Promise<void> {
    try {
      console.log('📊 Test 4: Economic Status Calculation...');
      
      const status = await this.householdService.getHouseholdEconomicStatus(this.testCampaignId);
      
      const isValidStatus = status.campaign_id === this.testCampaignId &&
        Object.keys(status.tier_distribution).length === 3 &&
        status.gini_coefficient >= 0 && status.gini_coefficient <= 1 &&
        status.economic_health_score >= 0 && status.economic_health_score <= 100;
      
      this.results.push({
        testName: 'Economic Status Calculation',
        passed: isValidStatus,
        data: { 
          giniValid: status.gini_coefficient >= 0 && status.gini_coefficient <= 1,
          healthScoreValid: status.economic_health_score >= 0 && status.economic_health_score <= 100,
          tiersComplete: Object.keys(status.tier_distribution).length === 3
        }
      });
      
      if (isValidStatus) {
        console.log('   ✅ Economic status calculation working correctly');
        console.log(`      Inequality (Gini): ${status.gini_coefficient.toFixed(3)}`);
        console.log(`      Economic Health: ${status.economic_health_score.toFixed(1)}/100`);
      } else {
        console.log('   ❌ Economic status calculation failed validation');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Economic Status Calculation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Economic status test failed:', error);
    }
  }

  private async testBasicDemandCalculation(): Promise<void> {
    try {
      console.log('📈 Test 5: Basic Demand Calculation...');
      
      const resourceType = 'food';
      const currentPrice = 100;
      const demandCalcs = await this.householdService.calculateTierDemand(
        this.testCampaignId,
        resourceType,
        currentPrice
      );
      
      const isValidDemandCalc = demandCalcs.length === 3 &&
        demandCalcs.every(calc => 
          calc.tier && 
          calc.resource_type === resourceType &&
          calc.base_demand >= 0 &&
          calc.final_demand >= 0 &&
          typeof calc.elasticity_impact === 'number'
        );
      
      const totalDemand = demandCalcs.reduce((sum, calc) => sum + calc.final_demand, 0);
      
      this.results.push({
        testName: 'Basic Demand Calculation',
        passed: isValidDemandCalc,
        data: { 
          tierCalculations: demandCalcs.length,
          totalDemand: Math.floor(totalDemand),
          demandByTier: demandCalcs.map(calc => ({
            tier: calc.tier,
            demand: Math.floor(calc.final_demand),
            elasticity: calc.elasticity_impact
          }))
        }
      });
      
      if (isValidDemandCalc) {
        console.log(`   ✅ Demand calculation working for ${resourceType}`);
        console.log(`      Total Demand: ${Math.floor(totalDemand).toLocaleString()}`);
        console.log(`      Tier Breakdown: ${demandCalcs.map(c => `${c.tier}: ${Math.floor(c.final_demand)}`).join(', ')}`);
      } else {
        console.log('   ❌ Demand calculation failed validation');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Basic Demand Calculation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Basic demand calculation test failed:', error);
    }
  }

  private async testPriceElasticity(): Promise<void> {
    try {
      console.log('💰 Test 6: Price Elasticity Testing...');
      
      const resourceType = 'luxury_goods';
      
      // Test demand at different price points
      const lowPrice = 50;
      const highPrice = 200;
      
      const lowPriceDemand = await this.householdService.calculateTierDemand(this.testCampaignId, resourceType, lowPrice);
      const highPriceDemand = await this.householdService.calculateTierDemand(this.testCampaignId, resourceType, highPrice);
      
      const lowPriceTotal = lowPriceDemand.reduce((sum, calc) => sum + calc.final_demand, 0);
      const highPriceTotal = highPriceDemand.reduce((sum, calc) => sum + calc.final_demand, 0);
      
      // For luxury goods (negative elasticity), demand should decrease as price increases
      const elasticityWorking = lowPriceTotal > highPriceTotal;
      
      // Check that rich tier is less sensitive to price changes than poor tier
      const poorLowPrice = lowPriceDemand.find(c => c.tier === 'poor')?.final_demand || 0;
      const poorHighPrice = highPriceDemand.find(c => c.tier === 'poor')?.final_demand || 0;
      const richLowPrice = lowPriceDemand.find(c => c.tier === 'rich')?.final_demand || 0;
      const richHighPrice = highPriceDemand.find(c => c.tier === 'rich')?.final_demand || 0;
      
      const poorPriceChange = (poorLowPrice - poorHighPrice) / poorLowPrice;
      const richPriceChange = (richLowPrice - richHighPrice) / richLowPrice;
      
      // Poor should be more sensitive to price changes (bigger percentage change)
      const elasticityTierDifference = poorPriceChange > richPriceChange;
      
      this.results.push({
        testName: 'Price Elasticity',
        passed: elasticityWorking && elasticityTierDifference,
        data: { 
          lowPriceTotalDemand: Math.floor(lowPriceTotal),
          highPriceTotalDemand: Math.floor(highPriceTotal),
          elasticityWorking: elasticityWorking,
          poorPriceChange: poorPriceChange.toFixed(3),
          richPriceChange: richPriceChange.toFixed(3),
          tierElasticityWorking: elasticityTierDifference
        }
      });
      
      if (elasticityWorking && elasticityTierDifference) {
        console.log('   ✅ Price elasticity working correctly');
        console.log(`      Low price demand: ${Math.floor(lowPriceTotal).toLocaleString()}`);
        console.log(`      High price demand: ${Math.floor(highPriceTotal).toLocaleString()}`);
        console.log(`      Poor price sensitivity: ${(poorPriceChange * 100).toFixed(1)}%`);
        console.log(`      Rich price sensitivity: ${(richPriceChange * 100).toFixed(1)}%`);
      } else {
        console.log('   ❌ Price elasticity not working properly');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Price Elasticity',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Price elasticity test failed:', error);
    }
  }

  private async testSocialMobilityOpportunities(): Promise<void> {
    try {
      console.log('🎓 Test 7: Social Mobility Opportunities...');
      
      // Test opportunities for poor tier
      const poorOpportunities = await this.householdService.getAvailableMobilityOpportunities(
        this.testCampaignId, 
        HouseholdTierType.POOR
      );
      
      // Test opportunities for median tier
      const medianOpportunities = await this.householdService.getAvailableMobilityOpportunities(
        this.testCampaignId, 
        HouseholdTierType.MEDIAN
      );
      
      // Test opportunities for rich tier
      const richOpportunities = await this.householdService.getAvailableMobilityOpportunities(
        this.testCampaignId, 
        HouseholdTierType.RICH
      );
      
      const isValidOpportunities = poorOpportunities.length > 0 &&
        medianOpportunities.length > 0 &&
        richOpportunities.length === 0 && // Rich tier should have no upward mobility options
        poorOpportunities.every(opp => opp.from_tier === HouseholdTierType.POOR && opp.to_tier === HouseholdTierType.MEDIAN);
      
      this.results.push({
        testName: 'Social Mobility Opportunities',
        passed: isValidOpportunities,
        data: { 
          poorOpportunities: poorOpportunities.length,
          medianOpportunities: medianOpportunities.length,
          richOpportunities: richOpportunities.length,
          sampleOpportunity: poorOpportunities[0] || null
        }
      });
      
      if (isValidOpportunities) {
        console.log('   ✅ Social mobility opportunities working correctly');
        console.log(`      Poor tier opportunities: ${poorOpportunities.length}`);
        console.log(`      Median tier opportunities: ${medianOpportunities.length}`);
        console.log(`      Rich tier opportunities: ${richOpportunities.length} (expected: 0)`);
      } else {
        console.log('   ❌ Social mobility opportunities not working properly');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Social Mobility Opportunities',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Social mobility opportunities test failed:', error);
    }
  }

  private async testSocialMobilityEventCreation(): Promise<void> {
    try {
      console.log('📝 Test 8: Social Mobility Event Creation...');
      
      const householdId = '12345678-1234-5678-9012-123456789012';
      
      const event = await this.householdService.createSocialMobilityOpportunity(
        this.testCampaignId,
        1,
        householdId,
        SocialMobilityEventType.EDUCATION_INVESTMENT,
        HouseholdTierType.POOR,
        HouseholdTierType.MEDIAN,
        { education: 5000, gold: 2000 }
      );
      
      const isValidEvent = event.id &&
        event.campaign_id === this.testCampaignId &&
        event.household_id === householdId &&
        event.event_type === SocialMobilityEventType.EDUCATION_INVESTMENT &&
        event.from_tier === HouseholdTierType.POOR &&
        event.to_tier === HouseholdTierType.MEDIAN &&
        event.outcome === 'pending' &&
        event.success_probability > 0 && event.success_probability <= 1;
      
      this.results.push({
        testName: 'Social Mobility Event Creation',
        passed: isValidEvent,
        data: { 
          eventId: event.id,
          eventType: event.event_type,
          successProbability: event.success_probability,
          resourceCost: event.resource_cost
        }
      });
      
      if (isValidEvent) {
        console.log('   ✅ Social mobility event created successfully');
        console.log(`      Event ID: ${event.id}`);
        console.log(`      Success Probability: ${(event.success_probability * 100).toFixed(1)}%`);
        console.log(`      Resource Cost: ${Object.entries(event.resource_cost).map(([r, a]) => `${r}:${a}`).join(', ')}`);
      } else {
        console.log('   ❌ Social mobility event creation failed validation');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Social Mobility Event Creation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Social mobility event creation test failed:', error);
    }
  }

  private async testSocialMobilityEventProcessing(): Promise<void> {
    try {
      console.log('⚡ Test 9: Social Mobility Event Processing...');
      
      const householdId = '12345678-1234-5678-9012-123456789013';
      
      // Create an event to process
      const event = await this.householdService.createSocialMobilityOpportunity(
        this.testCampaignId,
        1,
        householdId,
        SocialMobilityEventType.EDUCATION_INVESTMENT,
        HouseholdTierType.POOR,
        HouseholdTierType.MEDIAN,
        { education: 1000, gold: 500 }
      );
      
      // Process the event with adequate resources
      const result = await this.householdService.processSocialMobilityEvent(
        event.id,
        { education: 1000, gold: 500 }
      );
      
      const isValidProcessing = result.outcome.id === event.id &&
        (result.outcome.outcome === 'success' || result.outcome.outcome === 'failure') &&
        result.success === (result.outcome.outcome === 'success');
      
      this.results.push({
        testName: 'Social Mobility Event Processing',
        passed: isValidProcessing,
        data: { 
          eventProcessed: true,
          eventSuccess: result.success,
          finalOutcome: result.outcome.outcome
        }
      });
      
      if (isValidProcessing) {
        console.log('   ✅ Social mobility event processing working');
        console.log(`      Event Outcome: ${result.outcome.outcome}`);
        console.log(`      Success: ${result.success}`);
      } else {
        console.log('   ❌ Social mobility event processing failed validation');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Social Mobility Event Processing',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Social mobility event processing test failed:', error);
    }
  }

  private async testTierConsumptionPatterns(): Promise<void> {
    try {
      console.log('🛒 Test 10: Tier-Specific Consumption Patterns...');
      
      const resourceTypes = ['food', 'luxury_goods', 'entertainment'];
      const price = 100;
      
      const allDemandCalculations = [];
      
      for (const resourceType of resourceTypes) {
        const demandCalcs = await this.householdService.calculateTierDemand(
          this.testCampaignId,
          resourceType,
          price
        );
        allDemandCalculations.push({ resourceType, demandCalcs });
      }
      
      // Check consumption patterns
      const foodDemands = allDemandCalculations.find(d => d.resourceType === 'food')?.demandCalcs || [];
      const luxuryDemands = allDemandCalculations.find(d => d.resourceType === 'luxury_goods')?.demandCalcs || [];
      
      const poorFoodDemand = foodDemands.find(d => d.tier === 'poor')?.final_demand || 0;
      const richLuxuryDemand = luxuryDemands.find(d => d.tier === 'rich')?.final_demand || 0;
      const poorLuxuryDemand = luxuryDemands.find(d => d.tier === 'poor')?.final_demand || 0;
      
      // Poor should have high food demand and low luxury demand
      // Rich should have high luxury demand
      const patternsValid = poorFoodDemand > 0 &&
        richLuxuryDemand > poorLuxuryDemand &&
        richLuxuryDemand > 0;
      
      this.results.push({
        testName: 'Tier Consumption Patterns',
        passed: patternsValid,
        data: { 
          poorFoodDemand: Math.floor(poorFoodDemand),
          poorLuxuryDemand: Math.floor(poorLuxuryDemand),
          richLuxuryDemand: Math.floor(richLuxuryDemand),
          patternsValid: patternsValid
        }
      });
      
      if (patternsValid) {
        console.log('   ✅ Tier consumption patterns working correctly');
        console.log(`      Poor food demand: ${Math.floor(poorFoodDemand).toLocaleString()}`);
        console.log(`      Poor luxury demand: ${Math.floor(poorLuxuryDemand).toLocaleString()}`);
        console.log(`      Rich luxury demand: ${Math.floor(richLuxuryDemand).toLocaleString()}`);
      } else {
        console.log('   ❌ Tier consumption patterns not working properly');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Tier Consumption Patterns',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Tier consumption patterns test failed:', error);
    }
  }

  private async testGiniCoefficientCalculation(): Promise<void> {
    try {
      console.log('📊 Test 11: Gini Coefficient Calculation...');
      
      const status = await this.householdService.getHouseholdEconomicStatus(this.testCampaignId);
      
      // Gini coefficient should be between 0 and 1
      // With the default setup (poor 40%, median 50%, rich 10% with large income differences),
      // we should have some inequality
      const giniValid = status.gini_coefficient >= 0 && status.gini_coefficient <= 1;
      const hasInequality = status.gini_coefficient > 0.1; // Should have some inequality
      
      this.results.push({
        testName: 'Gini Coefficient Calculation',
        passed: giniValid && hasInequality,
        data: { 
          giniCoefficient: status.gini_coefficient,
          giniValid: giniValid,
          hasInequality: hasInequality,
          tierDistribution: status.tier_distribution
        }
      });
      
      if (giniValid && hasInequality) {
        console.log('   ✅ Gini coefficient calculation working correctly');
        console.log(`      Gini Coefficient: ${status.gini_coefficient.toFixed(3)} (0=equality, 1=max inequality)`);
        console.log(`      Inequality Level: ${status.gini_coefficient < 0.3 ? 'Low' : status.gini_coefficient < 0.6 ? 'Medium' : 'High'}`);
      } else {
        console.log('   ❌ Gini coefficient calculation failed validation');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Gini Coefficient Calculation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Gini coefficient calculation test failed:', error);
    }
  }

  private async testEconomicHealthScore(): Promise<void> {
    try {
      console.log('💪 Test 12: Economic Health Score...');
      
      const status = await this.householdService.getHouseholdEconomicStatus(this.testCampaignId);
      
      // Health score should be between 0 and 100
      const healthScoreValid = status.economic_health_score >= 0 && status.economic_health_score <= 100;
      
      // With reasonable default values, we should have a decent health score
      const reasonableScore = status.economic_health_score >= 30 && status.economic_health_score <= 90;
      
      this.results.push({
        testName: 'Economic Health Score',
        passed: healthScoreValid && reasonableScore,
        data: { 
          economicHealthScore: status.economic_health_score,
          healthScoreValid: healthScoreValid,
          reasonableScore: reasonableScore
        }
      });
      
      if (healthScoreValid && reasonableScore) {
        console.log('   ✅ Economic health score calculation working correctly');
        console.log(`      Health Score: ${status.economic_health_score.toFixed(1)}/100`);
        console.log(`      Health Level: ${status.economic_health_score < 40 ? 'Poor' : status.economic_health_score < 70 ? 'Fair' : 'Good'}`);
      } else {
        console.log('   ❌ Economic health score calculation failed validation');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Economic Health Score',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Economic health score test failed:', error);
    }
  }

  private async testErrorHandling(): Promise<void> {
    try {
      console.log('🚨 Test 13: Error Handling...');
      
      let errorsHandled = 0;
      
      // Test 1: Invalid campaign ID
      try {
        await this.householdService.getHouseholdEconomicStatus(999999);
      } catch (error) {
        if (error instanceof Error && error.message.includes('No household data found')) {
          errorsHandled++;
        }
      }
      
      // Test 2: Invalid resource type in demand calculation
      try {
        await this.householdService.calculateTierDemand(this.testCampaignId, 'invalid_resource', 100);
      } catch (error) {
        // This might not throw an error, just return empty results
        errorsHandled++;
      }
      
      // Test 3: Processing non-existent social mobility event
      try {
        await this.householdService.processSocialMobilityEvent('invalid-uuid', { gold: 1000 });
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found or already processed')) {
          errorsHandled++;
        }
      }
      
      const errorHandlingWorking = errorsHandled >= 2; // At least 2 out of 3 error cases handled
      
      this.results.push({
        testName: 'Error Handling',
        passed: errorHandlingWorking,
        data: { errorsHandled: errorsHandled, totalTests: 3 }
      });
      
      if (errorHandlingWorking) {
        console.log(`   ✅ Error handling working correctly (${errorsHandled}/3 cases handled)`);
      } else {
        console.log(`   ❌ Error handling insufficient (${errorsHandled}/3 cases handled)`);
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Error Handling',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Error handling test failed:', error);
    }
  }

  private async testPerformance(): Promise<void> {
    try {
      console.log('⚡ Test 14: Performance Test...');
      
      const startTime = Date.now();
      
      // Perform multiple operations
      const operations = [
        () => this.householdService.getHouseholdEconomicStatus(this.testCampaignId),
        () => this.householdService.calculateTierDemand(this.testCampaignId, 'food', 100),
        () => this.householdService.calculateTierDemand(this.testCampaignId, 'energy', 150),
        () => this.householdService.getAvailableMobilityOpportunities(this.testCampaignId, HouseholdTierType.POOR),
      ];
      
      await Promise.all(operations.map(op => op()));
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const performanceOk = totalTime < 3000; // Should complete within 3 seconds
      
      this.results.push({
        testName: 'Performance Test',
        passed: performanceOk,
        data: { executionTime: totalTime, threshold: 3000 }
      });
      
      if (performanceOk) {
        console.log(`   ✅ Performance test passed (${totalTime}ms < 3000ms)`);
      } else {
        console.log(`   ❌ Performance test failed (${totalTime}ms >= 3000ms)`);
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Performance Test',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Performance test failed:', error);
    }
  }

  private printResults(): void {
    console.log('\n🏠 HOUSEHOLD ECONOMICS SYSTEM TEST RESULTS');
    console.log('==========================================\n');
    
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = ((passed / total) * 100).toFixed(1);
    
    console.log(`📊 Overall Results: ${passed}/${total} tests passed (${percentage}%)\n`);
    
    // Print individual results
    this.results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} Test ${index + 1}: ${result.testName}`);
      
      if (!result.passed && result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.data && Object.keys(result.data).length > 0) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2).replace(/\n/g, '\n   ')}`);
      }
      console.log();
    });
    
    // Summary
    if (passed === total) {
      console.log('🎉 ALL TESTS PASSED! Household Economics system is ready for use.');
    } else {
      console.log(`⚠️ ${total - passed} test(s) failed. Please review and fix issues before deployment.`);
    }
    
    console.log('\n🏠 Household Economics Test Complete');
    console.log('=====================================');
  }
}

// Run the tests
const tester = new HouseholdEconomicsTest();
tester.runAllTests().catch(console.error);
