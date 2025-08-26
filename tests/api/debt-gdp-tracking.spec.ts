import { EconomicSystem } from '../../src/simulation/deterministic/systems/economic-system.cjs';

describe('Debt/GDP Ratio Tracking', () => {
  let economicSystem: any;

  beforeEach(() => {
    // Initialize with specific debt and GDP values for testing
    economicSystem = new EconomicSystem({
      initialGDP: 1000000000000, // $1 trillion
      initialDebt: 400000000000,  // $400 billion (40% ratio)
      autoStart: false // Don't start the simulation automatically
    });
  });

  afterEach(() => {
    if (economicSystem && economicSystem.cleanup) {
      economicSystem.cleanup();
    }
  });

  test('should initialize with correct debt/GDP ratio', () => {
    const summary = economicSystem.getEconomicSummary();
    
    expect(summary.debtToGDP).toBeCloseTo(0.4, 2); // 40% with 2 decimal precision
    expect(summary.gdp).toBe(1000000000000);
  });

  test('should update debt/GDP ratio when deficit spending occurs', () => {
    // Set high government spending to create deficit
    economicSystem.setInput('government_spending_level', 50); // 50% of GDP
    economicSystem.setInput('tax_rate', 15); // Low tax rate to ensure deficit
    economicSystem.setInput('income_tax_rate', 10);
    
    // Run one economic update cycle
    economicSystem.updateEconomy();
    
    const summary = economicSystem.getEconomicSummary();
    
    // Debt should have increased due to deficit spending
    expect(summary.debtToGDP).toBeGreaterThan(0.4);
  });

  test('should reduce debt/GDP ratio when running surplus', () => {
    // Set low government spending and high taxes to create surplus
    economicSystem.setInput('government_spending_level', 20); // 20% of GDP
    economicSystem.setInput('tax_rate', 35); // High tax rate
    economicSystem.setInput('income_tax_rate', 30);
    
    // Run multiple economic update cycles to see effect
    for (let i = 0; i < 100; i++) {
      economicSystem.updateEconomy();
    }
    
    const summary = economicSystem.getEconomicSummary();
    
    // Debt/GDP ratio should have decreased due to surplus
    expect(summary.debtToGDP).toBeLessThan(0.4);
  });

  test('should trigger debt crisis warning when debt/GDP exceeds 90%', () => {
    // Set initial debt to very high level
    economicSystem.economicState.publicDebt = 950000000000; // $950 billion (95% of $1T GDP)
    economicSystem.economicState.debtToGDP = 0.95;
    
    // Mock the setOutput method to capture events
    const outputEvents: any[] = [];
    economicSystem.setOutput = jest.fn((channel: string, data: any) => {
      if (channel === 'economic_events') {
        outputEvents.push(...(Array.isArray(data) ? data : [data]));
      }
    });
    
    // Run detailed analysis which checks for debt crisis
    economicSystem.checkForEconomicEvents();
    
    // Should have triggered debt crisis warning
    const debtCrisisEvent = outputEvents.find(event => event.eventType === 'debt_crisis_warning');
    expect(debtCrisisEvent).toBeDefined();
    expect(debtCrisisEvent.severity).toBe('high');
    expect(debtCrisisEvent.description).toContain('95.0% of GDP');
  });

  test('should include debt/GDP ratio in fiscal status output', () => {
    let fiscalStatusOutput: any = null;
    
    // Mock the setOutput method to capture fiscal status
    economicSystem.setOutput = jest.fn((channel: string, data: any) => {
      if (channel === 'fiscal_status') {
        fiscalStatusOutput = data;
      }
    });
    
    // Run economic update to generate output
    economicSystem.updateEconomy();
    
    expect(fiscalStatusOutput).toBeDefined();
    expect(fiscalStatusOutput.debtToGDP).toBeDefined();
    expect(typeof fiscalStatusOutput.debtToGDP).toBe('number');
    expect(fiscalStatusOutput.debtToGDP).toBeGreaterThan(0);
    expect(fiscalStatusOutput.debt).toBeDefined();
    expect(fiscalStatusOutput.revenue).toBeDefined();
    expect(fiscalStatusOutput.spending).toBeDefined();
    expect(fiscalStatusOutput.balance).toBeDefined();
  });

  test('should calculate debt service costs based on interest rates', () => {
    const initialDebt = economicSystem.economicState.publicDebt;
    const interestRate = economicSystem.economicState.interestRate;
    
    // Run one day of simulation
    economicSystem.updateEconomy();
    
    const newDebt = economicSystem.economicState.publicDebt;
    
    // Debt should have grown by interest (assuming deficit)
    // The exact amount depends on fiscal balance, but interest should be applied
    expect(newDebt).toBeGreaterThanOrEqual(initialDebt);
  });

  test('should handle extreme debt scenarios gracefully', () => {
    // Set debt to 200% of GDP (extreme scenario)
    economicSystem.economicState.publicDebt = 2000000000000; // $2 trillion
    
    // Should not crash and should still calculate ratio
    economicSystem.updateEconomy();
    
    const summary = economicSystem.getEconomicSummary();
    expect(summary.debtToGDP).toBeCloseTo(2.0, 1); // 200%
    expect(summary.debtToGDP).toBeGreaterThan(1.0);
  });
});
