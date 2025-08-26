import { describe, it, expect } from 'vitest'

// Load CJS module dynamically to avoid ESM issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EconomicSystem } = require('../../src/simulation/deterministic/systems/economic-system.cjs')

describe('EconomicSystem Business Cycle', () => {
  it('progresses through phases and modulates GDP growth', async () => {
    const econ = new EconomicSystem({ autoStart: false })

    // Force deterministic conditions
    econ.economicState.marketVolatility = 0

    // Helper to tick a day
    const tick = () => econ.updateEconomy()

    // Snapshot baseline
    const gdpStart = econ.economicState.gdp

    // Expansion for 30 days
    econ.businessCycle.phase = 'expansion'
    econ.businessCycle.phaseDayCounter = 0
    econ.businessCycle.phaseLengthDays = 30
    for (let i = 0; i < 30; i++) tick()
    const gdpAfterExpansion = econ.economicState.gdp

    // Contraction for 30 days
    econ.businessCycle.phase = 'contraction'
    econ.businessCycle.phaseDayCounter = 0
    econ.businessCycle.phaseLengthDays = 30
    for (let i = 0; i < 30; i++) tick()
    const gdpAfterContraction = econ.economicState.gdp

    const expansionGrowth = (gdpAfterExpansion - gdpStart) / gdpStart
    const contractionGrowth = (gdpAfterContraction - gdpAfterExpansion) / gdpAfterExpansion

    // Expect expansion positive and contraction lower (can be negative)
    expect(expansionGrowth).toBeGreaterThan(0)
    expect(contractionGrowth).toBeLessThan(expansionGrowth)

    // Ensure business_cycle output is present
    const cycleOut = econ.getOutput('business_cycle')
    expect(cycleOut?.data?.phase).toBeDefined()
  })
})


