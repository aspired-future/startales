import { step } from '../server/sim/engine';

async function testSimulationEngine() {
  console.log('Testing Simulation Engine...\n');
  
  try {
    // Test basic simulation step
    const result = await step({
      campaignId: 1,
      seed: 'test-seed-123',
      actions: []
    });
    
    console.log('✅ Simulation step completed successfully');
    console.log('Step:', result.step);
    console.log('Resources:', result.resources);
    console.log('Buildings:', result.buildings);
    console.log('KPIs:', Object.keys(result.kpis).length, 'metrics calculated');
    console.log('Events:', result.veziesEvents.length, 'events generated');
    
    // Test determinism
    const result2 = await step({
      campaignId: 1,
      seed: 'test-seed-123',
      actions: []
    });
    
    const resourcesMatch = JSON.stringify(result.resources) === JSON.stringify(result2.resources);
    const kpisMatch = JSON.stringify(result.kpis) === JSON.stringify(result2.kpis);
    
    if (resourcesMatch && kpisMatch) {
      console.log('✅ Determinism test passed - same seed produces identical results');
    } else {
      console.log('❌ Determinism test failed - results differ with same seed');
    }
    
    // Test different seed
    const result3 = await step({
      campaignId: 1,
      seed: 'different-seed-456',
      actions: []
    });
    
    const resourcesDiffer = JSON.stringify(result.resources) !== JSON.stringify(result3.resources);
    
    if (resourcesDiffer) {
      console.log('✅ Variation test passed - different seeds produce different results');
    } else {
      console.log('❌ Variation test failed - different seeds produce identical results');
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSimulationEngine();
}

export { testSimulationEngine };
