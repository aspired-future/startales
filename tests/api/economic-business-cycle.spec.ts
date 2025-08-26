import { describe, it, expect } from 'vitest'

// Load CJS module dynamically to avoid ESM differences
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EconomicSystem } = require('../../src/simulation/deterministic/systems/economic-system.cjs')

describe('EconomicSystem Business Cycle', () => {
  it('progresses and affects GDP growth between expansion and contraction', () => {
    const econ = new EconomicSystem({ autoStart: false })

    // Reduce randomness
    econ.economicState.marketVolatility = 0

    const tick = () => econ.updateEconomy()

    const gdpStart = econ.economicState.gdp

    // Expansion
    econ.businessCycle.phase = 'expansion'
    econ.businessCycle.phaseDayCounter = 0
    econ.businessCycle.phaseLengthDays = 30
    for (let i = 0; i < 30; i++) tick()
    const gdpAfterExpansion = econ.economicState.gdp

    // Contraction
    econ.businessCycle.phase = 'contraction'
    econ.businessCycle.phaseDayCounter = 0
    econ.businessCycle.phaseLengthDays = 30
    for (let i = 0; i < 30; i++) tick()
    const gdpAfterContraction = econ.economicState.gdp

    const expansionGrowth = (gdpAfterExpansion - gdpStart) / gdpStart
    const contractionGrowth = (gdpAfterContraction - gdpAfterExpansion) / gdpAfterExpansion

    expect(expansionGrowth).toBeGreaterThan(0)
    expect(contractionGrowth).toBeLessThan(expansionGrowth)

    const cycleOut = econ.getOutput('business_cycle')
    expect(cycleOut?.data?.phase).toBeDefined()
  })
})


