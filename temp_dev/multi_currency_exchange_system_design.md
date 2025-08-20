# Multi-Currency Exchange System - Design Document

## Overview
The Multi-Currency Exchange System enables each civilization to maintain monetary sovereignty through independent currencies while facilitating inter-civilization trade and economic cooperation. The system supports both independent national currencies and optional common currency unions, with realistic exchange rate mechanisms driven by economic fundamentals.

## Core Objectives

### Monetary Sovereignty
- **Independent Currencies**: Each civilization issues and controls its own currency
- **Monetary Policy Independence**: Central banks can set interest rates and money supply
- **Currency Naming**: Civilizations can name their currencies (e.g., "Galactic Credits", "Stellar Dollars", "Quantum Coins")
- **Fiscal-Monetary Coordination**: Currency policy integrates with government fiscal policy

### Exchange Rate Mechanisms
- **Floating Exchange Rates**: Market-determined rates based on supply and demand
- **Fixed Exchange Rates**: Government-pegged rates with intervention requirements
- **Managed Float**: Hybrid system with periodic interventions
- **Currency Unions**: Optional common currencies between allied civilizations

### Economic Integration
- **Trade Settlement**: Multi-currency trade with automatic conversion
- **Capital Flows**: Investment and lending across currencies
- **Reserve Management**: Central bank foreign currency reserves
- **Crisis Management**: Currency crises and intervention mechanisms

## System Architecture

### Database Schema

#### Currencies Table
```sql
CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
    currency_code VARCHAR(3) NOT NULL UNIQUE,  -- ISO-style codes (USD, EUR, etc.)
    currency_name VARCHAR(100) NOT NULL,       -- "Galactic Credits", "Stellar Dollars"
    currency_symbol VARCHAR(10) NOT NULL,      -- ₡, $, €, etc.
    base_value DECIMAL(15,6) NOT NULL DEFAULT 1.0,  -- Base purchasing power
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_reserve_currency BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Exchange Rates Table
```sql
CREATE TABLE exchange_rates (
    id SERIAL PRIMARY KEY,
    base_currency_id INTEGER NOT NULL REFERENCES currencies(id),
    quote_currency_id INTEGER NOT NULL REFERENCES currencies(id),
    exchange_rate DECIMAL(15,8) NOT NULL,      -- How much quote currency per base currency
    bid_rate DECIMAL(15,8) NOT NULL,           -- Buy rate (slightly lower)
    ask_rate DECIMAL(15,8) NOT NULL,           -- Sell rate (slightly higher)
    spread DECIMAL(8,6) NOT NULL DEFAULT 0.001, -- Bid-ask spread
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    daily_volume DECIMAL(20,2) DEFAULT 0,      -- Trading volume in base currency
    volatility DECIMAL(8,6) DEFAULT 0,         -- Price volatility measure
    UNIQUE(base_currency_id, quote_currency_id)
);
```

#### Currency Policies Table
```sql
CREATE TABLE currency_policies (
    id SERIAL PRIMARY KEY,
    currency_id INTEGER NOT NULL REFERENCES currencies(id),
    policy_type VARCHAR(50) NOT NULL,          -- 'floating', 'fixed', 'managed_float', 'currency_board'
    target_currency_id INTEGER REFERENCES currencies(id), -- For fixed/pegged systems
    target_rate DECIMAL(15,8),                 -- Target exchange rate for pegs
    intervention_bands JSONB,                  -- Upper/lower intervention thresholds
    reserve_requirements DECIMAL(8,4),         -- Required foreign reserves ratio
    capital_controls JSONB,                    -- Capital flow restrictions
    effective_date TIMESTAMP NOT NULL,
    created_by INTEGER REFERENCES intelligence_directors(id), -- Central bank decision
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Currency Transactions Table
```sql
CREATE TABLE currency_transactions (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(50) NOT NULL,     -- 'trade', 'investment', 'intervention', 'reserve_management'
    from_currency_id INTEGER NOT NULL REFERENCES currencies(id),
    to_currency_id INTEGER NOT NULL REFERENCES currencies(id),
    from_amount DECIMAL(20,2) NOT NULL,
    to_amount DECIMAL(20,2) NOT NULL,
    exchange_rate DECIMAL(15,8) NOT NULL,
    transaction_fee DECIMAL(10,2) DEFAULT 0,
    initiator_type VARCHAR(50) NOT NULL,       -- 'government', 'central_bank', 'corporation', 'trade'
    initiator_id INTEGER,                      -- Reference to specific entity
    settlement_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'settled', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP
);
```

#### Currency Reserves Table
```sql
CREATE TABLE currency_reserves (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
    currency_id INTEGER NOT NULL REFERENCES currencies(id),
    reserve_amount DECIMAL(20,2) NOT NULL DEFAULT 0,
    reserve_type VARCHAR(50) NOT NULL,         -- 'foreign_exchange', 'gold', 'special_drawing_rights'
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(civilization_id, currency_id, reserve_type)
);
```

#### Currency Unions Table
```sql
CREATE TABLE currency_unions (
    id SERIAL PRIMARY KEY,
    union_name VARCHAR(100) NOT NULL,
    common_currency_id INTEGER NOT NULL REFERENCES currencies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE currency_union_members (
    id SERIAL PRIMARY KEY,
    union_id INTEGER NOT NULL REFERENCES currency_unions(id),
    civilization_id INTEGER NOT NULL REFERENCES civilizations(id),
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    voting_weight DECIMAL(5,4) DEFAULT 0.25,  -- Voting power in union decisions
    UNIQUE(union_id, civilization_id)
);
```

#### Exchange Rate History Table
```sql
CREATE TABLE exchange_rate_history (
    id SERIAL PRIMARY KEY,
    base_currency_id INTEGER NOT NULL REFERENCES currencies(id),
    quote_currency_id INTEGER NOT NULL REFERENCES currencies(id),
    exchange_rate DECIMAL(15,8) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    daily_high DECIMAL(15,8),
    daily_low DECIMAL(15,8),
    daily_volume DECIMAL(20,2),
    market_events JSONB                        -- Economic events affecting rate
);
```

### Service Layer Architecture

#### CurrencyExchangeService
- **Currency Management**: Create, update, and manage currencies
- **Exchange Rate Calculation**: Real-time rate computation based on economic factors
- **Transaction Processing**: Handle currency conversions and settlements
- **Policy Implementation**: Apply monetary policies and interventions
- **Reserve Management**: Track and manage foreign currency reserves

#### ExchangeRateEngine
- **Market Dynamics**: Supply/demand-based rate calculations
- **Economic Indicators**: GDP, inflation, trade balance impacts
- **Central Bank Interventions**: Policy-driven rate adjustments
- **Volatility Modeling**: Price movement and stability calculations
- **Historical Analysis**: Trend analysis and forecasting

#### CurrencyUnionService
- **Union Management**: Create and manage currency unions
- **Member Coordination**: Handle multi-civilization currency decisions
- **Common Policy**: Unified monetary policy for union members
- **Stability Mechanisms**: Crisis management and mutual support

## Economic Factors Affecting Exchange Rates

### Fundamental Factors
1. **Economic Growth**: GDP growth rates and economic performance
2. **Inflation Differentials**: Relative inflation rates between currencies
3. **Interest Rate Differentials**: Central bank policy rate differences
4. **Trade Balance**: Export/import ratios and current account balance
5. **Government Debt**: Fiscal health and debt-to-GDP ratios
6. **Political Stability**: Government stability and policy predictability

### Market Factors
1. **Trade Volume**: Inter-civilization trade flows
2. **Capital Flows**: Investment and financial transactions
3. **Speculation**: Market sentiment and speculative trading
4. **Reserve Demand**: Central bank reserve accumulation
5. **Crisis Events**: Economic or political crises affecting confidence

### Policy Factors
1. **Monetary Policy**: Central bank interest rate decisions
2. **Fiscal Policy**: Government spending and taxation
3. **Capital Controls**: Restrictions on currency flows
4. **Intervention**: Central bank market interventions
5. **International Agreements**: Trade deals and monetary cooperation

## Exchange Rate Calculation Algorithm

### Base Rate Calculation
```typescript
calculateBaseExchangeRate(baseCurrency: Currency, quoteCurrency: Currency): number {
    // Start with purchasing power parity (PPP)
    let rate = baseCurrency.base_value / quoteCurrency.base_value;
    
    // Adjust for economic fundamentals
    rate *= getEconomicAdjustment(baseCurrency.civilization_id, quoteCurrency.civilization_id);
    
    // Apply trade balance effects
    rate *= getTradeBalanceAdjustment(baseCurrency.civilization_id, quoteCurrency.civilization_id);
    
    // Factor in interest rate differentials
    rate *= getInterestRateDifferential(baseCurrency.civilization_id, quoteCurrency.civilization_id);
    
    // Apply market sentiment and volatility
    rate *= getMarketSentimentFactor(baseCurrency.id, quoteCurrency.id);
    
    return rate;
}
```

### Policy Adjustments
```typescript
applyPolicyAdjustments(rate: number, policy: CurrencyPolicy): number {
    switch (policy.policy_type) {
        case 'fixed':
            return policy.target_rate;
        case 'managed_float':
            return constrainToInterventionBands(rate, policy.intervention_bands);
        case 'floating':
            return rate; // No intervention
        case 'currency_board':
            return maintainCurrencyBoard(rate, policy);
        default:
            return rate;
    }
}
```

### Volatility and Spread Calculation
```typescript
calculateSpread(baseCurrency: Currency, quoteCurrency: Currency, volume: number): number {
    // Base spread based on currency liquidity
    let spread = 0.001; // 0.1% base spread
    
    // Adjust for trading volume (higher volume = lower spread)
    spread *= Math.max(0.1, 1 / Math.log(volume + 1));
    
    // Adjust for currency stability
    spread *= getCurrencyVolatilityMultiplier(baseCurrency.id, quoteCurrency.id);
    
    // Adjust for economic uncertainty
    spread *= getEconomicUncertaintyMultiplier(baseCurrency.civilization_id, quoteCurrency.civilization_id);
    
    return Math.min(spread, 0.05); // Cap at 5%
}
```

## API Endpoints

### Currency Management
- `GET /api/currencies` - List all active currencies
- `GET /api/currencies/:code` - Get specific currency details
- `POST /api/currencies` - Create new currency (Central Bank authority)
- `PUT /api/currencies/:code` - Update currency properties
- `DELETE /api/currencies/:code` - Deactivate currency

### Exchange Rates
- `GET /api/exchange-rates` - Get current exchange rates
- `GET /api/exchange-rates/:base/:quote` - Get specific currency pair rate
- `GET /api/exchange-rates/:base/:quote/history` - Historical rates
- `POST /api/exchange-rates/calculate` - Calculate conversion amount

### Currency Transactions
- `POST /api/currency-transactions` - Execute currency exchange
- `GET /api/currency-transactions` - List transactions
- `GET /api/currency-transactions/:id` - Get transaction details
- `PUT /api/currency-transactions/:id/settle` - Settle pending transaction

### Currency Policy
- `GET /api/currency-policies/:currency` - Get currency policy
- `POST /api/currency-policies` - Set new currency policy (Central Bank)
- `PUT /api/currency-policies/:id` - Update policy
- `POST /api/currency-policies/:id/intervene` - Execute market intervention

### Currency Unions
- `GET /api/currency-unions` - List currency unions
- `POST /api/currency-unions` - Create currency union
- `POST /api/currency-unions/:id/join` - Join currency union
- `DELETE /api/currency-unions/:id/leave` - Leave currency union

### Reserves Management
- `GET /api/currency-reserves/:civilization` - Get reserve holdings
- `POST /api/currency-reserves/transfer` - Transfer reserves
- `GET /api/currency-reserves/adequacy` - Assess reserve adequacy

## Integration Points

### Central Bank Integration
- **Policy Coordination**: Exchange rate policy aligns with monetary policy
- **Intervention Authority**: Central bank can intervene in currency markets
- **Reserve Management**: Central bank manages foreign currency reserves
- **Crisis Response**: Coordinated response to currency crises

### Trade System Integration
- **Multi-Currency Pricing**: Goods priced in multiple currencies
- **Automatic Conversion**: Trade settlements with real-time conversion
- **Hedging Mechanisms**: Forward contracts and currency risk management
- **Trade Finance**: Letters of credit and trade financing in multiple currencies

### Treasury Integration
- **Government Transactions**: Government payments in foreign currencies
- **Debt Management**: Foreign currency debt and repayment
- **Budget Impact**: Exchange rate effects on government budget
- **Fiscal Policy Coordination**: Currency policy supports fiscal objectives

### Economic Simulation Integration
- **GDP Impact**: Exchange rates affect economic growth calculations
- **Inflation Transmission**: Import price effects on domestic inflation
- **Competitiveness**: Export competitiveness based on exchange rates
- **Capital Flows**: Investment flows based on currency attractiveness

## Demo Interface Features

### Currency Dashboard
- **Live Exchange Rates**: Real-time rate display with charts
- **Currency Strength Index**: Relative currency performance
- **Trading Volume**: Daily trading activity by currency pair
- **Policy Status**: Current exchange rate policies by civilization

### Exchange Rate Charts
- **Historical Trends**: Long-term exchange rate movements
- **Volatility Analysis**: Price stability and risk measures
- **Economic Events**: Major events affecting exchange rates
- **Intervention Markers**: Central bank intervention points

### Currency Union Monitor
- **Union Status**: Active currency unions and membership
- **Common Policy**: Unified monetary policy decisions
- **Member Coordination**: Inter-civilization policy coordination
- **Stability Metrics**: Union stability and crisis indicators

### Transaction Center
- **Currency Converter**: Real-time conversion calculator
- **Transaction History**: Recent currency transactions
- **Settlement Status**: Transaction processing and settlement
- **Fee Calculator**: Transaction costs and spreads

## Implementation Phases

### Phase 1: Core Currency System
1. Database schema implementation
2. Basic currency management (create, update, list)
3. Simple exchange rate calculation
4. Currency transaction processing
5. Basic API endpoints

### Phase 2: Exchange Rate Engine
1. Economic factor integration
2. Market dynamics simulation
3. Volatility and spread calculation
4. Historical rate tracking
5. Rate prediction algorithms

### Phase 3: Policy Framework
1. Currency policy implementation
2. Central bank intervention mechanisms
3. Fixed vs. floating rate systems
4. Capital controls and restrictions
5. Crisis management protocols

### Phase 4: Currency Unions
1. Currency union creation and management
2. Common currency implementation
3. Multi-civilization policy coordination
4. Union stability mechanisms
5. Member voting and governance

### Phase 5: Advanced Features
1. Sophisticated economic modeling
2. Machine learning rate prediction
3. Advanced risk management
4. International monetary cooperation
5. Crisis simulation and response

## Success Metrics

### System Performance
- **Rate Accuracy**: Exchange rates reflect economic fundamentals
- **Transaction Speed**: Fast currency conversion processing
- **System Stability**: Reliable operation under high load
- **Data Integrity**: Accurate transaction and rate recording

### Economic Realism
- **Market Dynamics**: Realistic supply/demand price discovery
- **Policy Effectiveness**: Central bank interventions work as expected
- **Crisis Response**: System handles currency crises appropriately
- **Integration Quality**: Seamless integration with other economic systems

### User Experience
- **Interface Usability**: Intuitive currency management interface
- **Real-time Updates**: Live exchange rate and transaction updates
- **Comprehensive Data**: Complete transaction and policy history
- **Educational Value**: Clear explanation of currency mechanisms

This Multi-Currency Exchange System will provide a sophisticated monetary framework that enhances the economic realism and strategic depth of the civilization simulation while maintaining the balance between monetary sovereignty and economic integration.
