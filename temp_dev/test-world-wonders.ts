#!/usr/bin/env npx tsx

import { Pool } from 'pg';
import { WonderService } from '../src/server/wonders/wonderService.js';
import { WondersSchema, WonderType } from '../src/server/storage/wondersSchema.js';

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

class WorldWondersTest {
  private wonderService: WonderService;
  private wondersSchema: WondersSchema;
  private results: TestResult[] = [];
  private testCampaignId = Math.floor(Math.random() * 100000) + 1000; // Use a random test campaign ID

  constructor() {
    this.wonderService = new WonderService(pool);
    this.wondersSchema = new WondersSchema(pool);
  }

  async runAllTests(): Promise<void> {
    console.log('🏛️ WORLD WONDERS SYSTEM COMPREHENSIVE TEST');
    console.log('==========================================\n');

    try {
      // Test 1: Database Schema Initialization
      await this.testSchemaInitialization();
      
      // Test 2: Wonder Templates Seeding
      await this.testWonderTemplatesSeeding();
      
      // Test 3: Available Wonder Templates Retrieval
      await this.testGetAvailableWonders();
      
      // Test 4: Start Wonder Construction
      const wonderId = await this.testStartWonderConstruction();
      
      // Test 5: Resource Investment and Progress
      if (wonderId) {
        await this.testResourceInvestment(wonderId);
        
        // Test 6: Construction Progress Tracking
        await this.testConstructionProgress(wonderId);
        
        // Test 7: Construction History
        await this.testConstructionHistory(wonderId);
        
        // Test 8: Pause and Resume Construction
        await this.testPauseResumeConstruction(wonderId);
      }
      
      // Test 9: Multiple Wonders in Campaign
      await this.testMultipleWonders();
      
      // Test 10: Wonder Completion and Benefits
      await this.testWonderCompletion();
      
      // Test 11: Construction Cancellation
      await this.testConstructionCancellation();
      
      // Test 12: Error Handling
      await this.testErrorHandling();

      // Test 13: Performance Test
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
      
      await this.wondersSchema.initializeTables();
      
      // Verify tables exist
      const client = await pool.connect();
      try {
        const tablesResult = await client.query(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('world_wonders', 'wonder_construction_progress', 'wonder_templates')
        `);
        
        const tableNames = tablesResult.rows.map(row => row.table_name);
        const expectedTables = ['world_wonders', 'wonder_construction_progress', 'wonder_templates'];
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

  private async testWonderTemplatesSeeding(): Promise<void> {
    try {
      console.log('🌱 Test 2: Wonder Templates Seeding...');
      
      await this.wondersSchema.seedWonderTemplates();
      
      // Verify templates were seeded
      const templates = await this.wonderService.getAvailableWonders();
      const expectedWonderCount = 10; // We have 10 wonder types
      
      this.results.push({
        testName: 'Wonder Templates Seeding',
        passed: templates.length === expectedWonderCount,
        data: { templatesSeeded: templates.length, expectedCount: expectedWonderCount }
      });
      
      if (templates.length === expectedWonderCount) {
        console.log(`   ✅ All ${expectedWonderCount} wonder templates seeded successfully`);
        console.log(`      Categories: ${[...new Set(templates.map(t => t.wonder_category))].join(', ')}`);
      } else {
        console.log(`   ❌ Expected ${expectedWonderCount} templates, got ${templates.length}`);
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Wonder Templates Seeding',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Templates seeding failed:', error);
    }
  }

  private async testGetAvailableWonders(): Promise<void> {
    try {
      console.log('📋 Test 3: Available Wonder Templates Retrieval...');
      
      const templates = await this.wonderService.getAvailableWonders();
      
      // Verify template structure
      const firstTemplate = templates[0];
      const hasRequiredFields = firstTemplate && 
        firstTemplate.wonder_type && 
        firstTemplate.display_name &&
        firstTemplate.base_cost &&
        firstTemplate.strategic_benefits;
      
      this.results.push({
        testName: 'Get Available Wonders',
        passed: templates.length > 0 && hasRequiredFields,
        data: { templateCount: templates.length, sampleTemplate: firstTemplate }
      });
      
      if (templates.length > 0 && hasRequiredFields) {
        console.log(`   ✅ Retrieved ${templates.length} wonder templates with proper structure`);
        console.log(`      Sample: ${firstTemplate.display_name} (${firstTemplate.wonder_category})`);
      } else {
        console.log('   ❌ Failed to retrieve proper wonder templates');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Get Available Wonders',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Failed to get available wonders:', error);
    }
  }

  private async testStartWonderConstruction(): Promise<string | null> {
    try {
      console.log('🏗️ Test 4: Start Wonder Construction...');
      
      const wonder = await this.wonderService.startWonderConstruction(
        this.testCampaignId,
        WonderType.PYRAMIDS,
        'Test Pyramids'
      );
      
      const isValidWonder = wonder.id && 
        wonder.campaign_id === this.testCampaignId &&
        wonder.wonder_type === WonderType.PYRAMIDS &&
        wonder.construction_status === 'in_progress' &&
        Number(wonder.completion_percentage) === 0;
      
      this.results.push({
        testName: 'Start Wonder Construction',
        passed: isValidWonder,
        data: { wonderId: wonder.id, wonderName: wonder.wonder_name }
      });
      
      if (isValidWonder) {
        console.log(`   ✅ Successfully started construction of ${wonder.wonder_name}`);
        console.log(`      Wonder ID: ${wonder.id}`);
        console.log(`      Status: ${wonder.construction_status}, Progress: ${wonder.completion_percentage}%`);
        return wonder.id;
      } else {
        console.log('   ❌ Invalid wonder created');
        return null;
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Start Wonder Construction',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Failed to start wonder construction:', error);
      return null;
    }
  }

  private async testResourceInvestment(wonderId: string): Promise<void> {
    try {
      console.log('💰 Test 5: Resource Investment and Progress...');
      
      const resources = { stone: 1000, labor: 500, gold: 200 };
      const result = await this.wonderService.investResources(wonderId, resources, 1);
      
      const hasProgress = result.wonder.completion_percentage > 0 &&
        result.progress.progress_percentage > 0 &&
        result.wonder.invested_resources.stone === 1000;
      
      this.results.push({
        testName: 'Resource Investment',
        passed: hasProgress,
        data: { 
          progressGained: result.wonder.completion_percentage,
          investedResources: result.wonder.invested_resources,
          phase: result.wonder.construction_phase
        }
      });
      
      if (hasProgress) {
        console.log(`   ✅ Successfully invested resources`);
        console.log(`      Progress: ${result.wonder.completion_percentage.toFixed(1)}%`);
        console.log(`      Phase: ${result.wonder.construction_phase}`);
        console.log(`      Invested: ${Object.entries(result.wonder.invested_resources).map(([r, a]) => `${r}:${a}`).join(', ')}`);
      } else {
        console.log('   ❌ Resource investment failed to create progress');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Resource Investment',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Resource investment failed:', error);
    }
  }

  private async testConstructionProgress(wonderId: string): Promise<void> {
    try {
      console.log('📊 Test 6: Construction Progress Tracking...');
      
      const wonder = await this.wonderService.getWonderById(wonderId);
      
      // Make another investment to see progress change
      const additionalResources = { stone: 2000, labor: 1000, gold: 500 };
      const result = await this.wonderService.investResources(wonderId, additionalResources, 2);
      
      const progressIncreased = result.wonder.completion_percentage > wonder.completion_percentage;
      const phaseProgressed = result.wonder.construction_phase !== wonder.construction_phase || 
                             result.wonder.completion_percentage > 20;
      
      this.results.push({
        testName: 'Construction Progress Tracking',
        passed: progressIncreased,
        data: { 
          initialProgress: wonder.completion_percentage,
          finalProgress: result.wonder.completion_percentage,
          phaseChange: `${wonder.construction_phase} -> ${result.wonder.construction_phase}`
        }
      });
      
      if (progressIncreased) {
        console.log(`   ✅ Progress tracking working correctly`);
        console.log(`      Progress: ${wonder.completion_percentage.toFixed(1)}% -> ${result.wonder.completion_percentage.toFixed(1)}%`);
        console.log(`      Phase: ${wonder.construction_phase} -> ${result.wonder.construction_phase}`);
      } else {
        console.log('   ❌ Progress tracking not working properly');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Construction Progress Tracking',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Progress tracking failed:', error);
    }
  }

  private async testConstructionHistory(wonderId: string): Promise<void> {
    try {
      console.log('📚 Test 7: Construction History...');
      
      const history = await this.wonderService.getConstructionHistory(wonderId);
      
      const hasHistory = history.length >= 2 && // Should have at least 2 records from previous tests
        history[0].wonder_id === wonderId &&
        history.some(h => h.resources_invested && Object.keys(h.resources_invested).length > 0);
      
      this.results.push({
        testName: 'Construction History',
        passed: hasHistory,
        data: { 
          historyEntries: history.length,
          latestEntry: history[history.length - 1]
        }
      });
      
      if (hasHistory) {
        console.log(`   ✅ Construction history properly recorded`);
        console.log(`      History entries: ${history.length}`);
        console.log(`      Latest phase: ${history[history.length - 1].phase}`);
      } else {
        console.log('   ❌ Construction history not properly recorded');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Construction History',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Construction history test failed:', error);
    }
  }

  private async testPauseResumeConstruction(wonderId: string): Promise<void> {
    try {
      console.log('⏸️ Test 8: Pause and Resume Construction...');
      
      // Pause construction
      const pausedWonder = await this.wonderService.pauseConstruction(wonderId);
      const isPaused = pausedWonder.construction_status === 'paused';
      
      // Resume construction
      const resumedWonder = await this.wonderService.resumeConstruction(wonderId);
      const isResumed = resumedWonder.construction_status === 'in_progress';
      
      this.results.push({
        testName: 'Pause and Resume Construction',
        passed: isPaused && isResumed,
        data: { 
          pauseStatus: pausedWonder.construction_status,
          resumeStatus: resumedWonder.construction_status
        }
      });
      
      if (isPaused && isResumed) {
        console.log(`   ✅ Pause and resume functionality working`);
        console.log(`      Paused: ${pausedWonder.construction_status}, Resumed: ${resumedWonder.construction_status}`);
      } else {
        console.log('   ❌ Pause/resume functionality failed');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Pause and Resume Construction',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Pause/resume test failed:', error);
    }
  }

  private async testMultipleWonders(): Promise<void> {
    try {
      console.log('🏛️ Test 9: Multiple Wonders in Campaign...');
      
      // Start construction of a second wonder
      const secondWonder = await this.wonderService.startWonderConstruction(
        this.testCampaignId,
        WonderType.GREAT_LIBRARY,
        'Test Library'
      );
      
      // Get all campaign wonders
      const campaignWonders = await this.wonderService.getCampaignWonders(this.testCampaignId);
      
      const hasMultipleWonders = campaignWonders.length >= 2 &&
        campaignWonders.some(w => w.wonder_type === WonderType.PYRAMIDS) &&
        campaignWonders.some(w => w.wonder_type === WonderType.GREAT_LIBRARY);
      
      this.results.push({
        testName: 'Multiple Wonders in Campaign',
        passed: hasMultipleWonders,
        data: { 
          wonderCount: campaignWonders.length,
          wonderTypes: campaignWonders.map(w => w.wonder_type)
        }
      });
      
      if (hasMultipleWonders) {
        console.log(`   ✅ Multiple wonders in campaign working`);
        console.log(`      Total wonders: ${campaignWonders.length}`);
        console.log(`      Wonder types: ${campaignWonders.map(w => w.wonder_type).join(', ')}`);
      } else {
        console.log('   ❌ Multiple wonders functionality failed');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Multiple Wonders in Campaign',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Multiple wonders test failed:', error);
    }
  }

  private async testWonderCompletion(): Promise<void> {
    try {
      console.log('🎉 Test 10: Wonder Completion and Benefits...');
      
      // Create a new wonder for completion test
      const wonder = await this.wonderService.startWonderConstruction(
        this.testCampaignId,
        WonderType.TEMPLES,
        'Test Temples'
      );
      
      // Invest massive resources to complete it
      const massiveResources = { stone: 10000, gold: 10000, crystals: 10000 };
      const result = await this.wonderService.investResources(wonder.id, massiveResources, 1, { rush: true });
      
      const isCompleted = Number(result.wonder.completion_percentage) >= 100 &&
        result.wonder.construction_status === 'completed' &&
        result.wonder.completed_at !== null;
      
      this.results.push({
        testName: 'Wonder Completion',
        passed: isCompleted,
        data: { 
          completionPercentage: result.wonder.completion_percentage,
          status: result.wonder.construction_status,
          benefits: result.wonder.strategic_benefits,
          completedAt: result.wonder.completed_at
        }
      });
      
      if (isCompleted) {
        console.log(`   ✅ Wonder completion working correctly`);
        console.log(`      Status: ${result.wonder.construction_status}`);
        console.log(`      Progress: ${result.wonder.completion_percentage}%`);
        console.log(`      Benefits: ${Object.entries(result.wonder.strategic_benefits).map(([k, v]) => `${k}:${v}`).join(', ')}`);
      } else {
        console.log('   ❌ Wonder completion failed');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Wonder Completion',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Wonder completion test failed:', error);
    }
  }

  private async testConstructionCancellation(): Promise<void> {
    try {
      console.log('❌ Test 11: Construction Cancellation...');
      
      // Start a wonder to cancel
      const wonder = await this.wonderService.startWonderConstruction(
        this.testCampaignId,
        WonderType.COLOSSUS,
        'Test Colossus'
      );
      
      // Invest some resources first
      const resources = { metal: 1000, gold: 500, energy: 300 };
      await this.wonderService.investResources(wonder.id, resources, 1);
      
      // Cancel construction
      const recoveryRate = 0.7;
      const result = await this.wonderService.cancelConstruction(wonder.id, recoveryRate);
      
      // Check if resources were recovered
      const expectedMetal = Math.floor(1000 * recoveryRate);
      const actualMetal = result.recoveredResources.metal || 0;
      
      const cancellationWorking = actualMetal === expectedMetal;
      
      this.results.push({
        testName: 'Construction Cancellation',
        passed: cancellationWorking,
        data: { 
          recoveredResources: result.recoveredResources,
          recoveryRate: recoveryRate,
          expectedMetal: expectedMetal,
          actualMetal: actualMetal
        }
      });
      
      if (cancellationWorking) {
        console.log(`   ✅ Construction cancellation working`);
        console.log(`      Recovered: ${Object.entries(result.recoveredResources).map(([r, a]) => `${r}:${a}`).join(', ')}`);
      } else {
        console.log('   ❌ Construction cancellation failed');
      }
      
    } catch (error) {
      this.results.push({
        testName: 'Construction Cancellation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log('   ❌ Construction cancellation test failed:', error);
    }
  }

  private async testErrorHandling(): Promise<void> {
    try {
      console.log('🚨 Test 12: Error Handling...');
      
      let errorsHandled = 0;
      
      // Test 1: Invalid wonder type
      try {
        await this.wonderService.startWonderConstruction(this.testCampaignId, 'invalid_type' as WonderType);
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          errorsHandled++;
        }
      }
      
      // Test 2: Duplicate wonder
      try {
        await this.wonderService.startWonderConstruction(this.testCampaignId, WonderType.PYRAMIDS);
        await this.wonderService.startWonderConstruction(this.testCampaignId, WonderType.PYRAMIDS);
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          errorsHandled++;
        }
      }
      
      // Test 3: Invalid wonder ID
      try {
        await this.wonderService.getWonderById('invalid-uuid');
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
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
      console.log('⚡ Test 13: Performance Test...');
      
      const startTime = Date.now();
      
      // Perform multiple operations
      const operations = [
        () => this.wonderService.getAvailableWonders(),
        () => this.wonderService.getCampaignWonders(this.testCampaignId),
        () => this.wonderService.getAvailableWonders(),
        () => this.wonderService.getCampaignWonders(this.testCampaignId),
      ];
      
      await Promise.all(operations.map(op => op()));
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const performanceOk = totalTime < 2000; // Should complete within 2 seconds
      
      this.results.push({
        testName: 'Performance Test',
        passed: performanceOk,
        data: { executionTime: totalTime, threshold: 2000 }
      });
      
      if (performanceOk) {
        console.log(`   ✅ Performance test passed (${totalTime}ms < 2000ms)`);
      } else {
        console.log(`   ❌ Performance test failed (${totalTime}ms >= 2000ms)`);
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
    console.log('\n🏛️ WORLD WONDERS SYSTEM TEST RESULTS');
    console.log('====================================\n');
    
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
      console.log('🎉 ALL TESTS PASSED! World Wonders system is ready for use.');
    } else {
      console.log(`⚠️ ${total - passed} test(s) failed. Please review and fix issues before deployment.`);
    }
    
    console.log('\n🏛️ World Wonders Test Complete');
    console.log('===============================');
  }
}

// Run the tests
const tester = new WorldWondersTest();
tester.runAllTests().catch(console.error);
