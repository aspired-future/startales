# Gifting & Tribute System Architecture

## Overview

This document outlines the comprehensive gifting and tribute system that enables resource transfers, diplomatic gifts, and tribute payments between empires, alliances, heroes, and parties. All transfers maintain strict money conservation and provide full audit trails.

## Core Principles

1. **Money Conservation**: All transfers are tracked with source/destination accounting
2. **Diplomatic Significance**: Gifts and tribute affect relationships and reputation
3. **Economic Impact**: Large transfers influence market dynamics and inflation
4. **Security & Validation**: Prevent fraud, duplication, and unauthorized transfers
5. **Cultural Context**: Different gift types have varying diplomatic meanings
6. **Audit Trails**: Complete transaction history for all transfers

## System Components

### 1. Gift & Tribute Types

#### **Resource Categories**
- **Currency**: Empire currencies, alliance tokens, universal credits
- **Raw Materials**: Minerals, energy, food, rare elements
- **Manufactured Goods**: Equipment, technology, luxury items
- **Information**: Intelligence reports, research data, maps
- **Services**: Military support, trade agreements, diplomatic favors
- **Unique Items**: Artifacts, hero equipment, special technologies

#### **Transfer Types**
- **Gifts**: Voluntary transfers to improve relationships
- **Tribute**: Mandatory payments (peace treaties, protection, vassalage)
- **Trade**: Equal value exchanges with negotiated terms
- **Loans**: Temporary transfers with repayment terms and interest
- **Reparations**: Compensation for damages or losses
- **Dowries**: Marriage alliance payments and ceremonial gifts

### 2. Transfer Mechanisms

#### **Empire-to-Empire Transfers**
```typescript
interface EmpireTransfer {
  id: string
  fromEmpireId: number
  toEmpireId: number
  transferType: 'gift' | 'tribute' | 'trade' | 'loan' | 'reparation'
  resources: ResourceBundle[]
  diplomaticContext: string
  conditions?: TransferCondition[]
  scheduledDelivery?: Date
  status: 'pending' | 'approved' | 'delivered' | 'rejected'
  relationshipImpact: number
  economicImpact: number
}
```

#### **Alliance-to-Alliance Transfers**
```typescript
interface AllianceTransfer {
  id: string
  fromAllianceId: number
  toAllianceId: number
  transferType: 'diplomatic_gift' | 'tribute' | 'trade_agreement' | 'reparation'
  resources: ResourceBundle[]
  approvalRequired: boolean
  votingThreshold: number
  memberContributions: MemberContribution[]
  diplomaticSignificance: 'minor' | 'major' | 'historic'
}
```

#### **Hero-to-Hero Transfers**
```typescript
interface HeroTransfer {
  id: string
  fromHeroId: number
  toHeroId: number
  transferType: 'gift' | 'trade' | 'loan' | 'party_share'
  items: HeroItem[]
  currency: number
  personalRelationship: number
  partyContext?: number // party_id if within same party
  conditions?: string[]
}
```

#### **Cross-Level Transfers**
- **Empire → Hero**: Royal rewards, quest sponsorship, noble patronage
- **Hero → Empire**: Tribute from successful quests, loyalty payments
- **Alliance → Hero Party**: Sponsored expeditions, diplomatic missions
- **Hero Party → Alliance**: Intelligence reports, artifact discoveries

### 3. Diplomatic & Economic Effects

#### **Relationship Impact Calculations**
```typescript
interface RelationshipImpact {
  baseValue: number
  culturalModifier: number // Different cultures value different gifts
  timingModifier: number // Gifts during crises have more impact
  reciprocityModifier: number // Previous gift history affects value
  publicityModifier: number // Public vs private gifts
  scarcityModifier: number // Rare items have higher impact
  finalImpact: number
}
```

#### **Economic Market Effects**
- **Inflation Impact**: Large currency transfers affect exchange rates
- **Supply/Demand**: Resource gifts influence market prices
- **Trade Route Changes**: Tribute payments can alter trade patterns
- **Economic Dependencies**: Regular tribute creates economic relationships

### 4. Tribute Systems

#### **Tribute Types**
- **Protection Tribute**: Payments for military protection
- **Vassalage Tribute**: Regular payments from subordinate empires
- **Peace Tribute**: Payments to maintain peace treaties
- **Access Tribute**: Payments for trade route or territory access
- **Cultural Tribute**: Payments for cultural exchange privileges

#### **Tribute Scheduling**
```typescript
interface TributeSchedule {
  id: string
  payerEmpireId: number
  receiverEmpireId: number
  tributeType: string
  amount: ResourceBundle
  frequency: 'monthly' | 'quarterly' | 'annually' | 'per_event'
  startDate: Date
  endDate?: Date
  conditions: TributeCondition[]
  penalties: TributePenalty[]
  autoRenewal: boolean
}
```

#### **Tribute Enforcement**
- **Automatic Collection**: Scheduled tribute payments
- **Penalty Systems**: Consequences for missed payments
- **Renegotiation**: Ability to modify tribute terms
- **Liberation**: Mechanisms to end tribute relationships

### 5. Gift Ceremonies & Cultural Context

#### **Ceremonial Gifts**
- **State Gifts**: High-value diplomatic presents between empires
- **Alliance Founding Gifts**: Ceremonial exchanges during alliance formation
- **Victory Gifts**: Celebrations of military or economic achievements
- **Mourning Gifts**: Condolences and support during crises
- **Festival Gifts**: Cultural celebration exchanges

#### **Cultural Significance**
```typescript
interface CultureGiftPreferences {
  cultureId: number
  preferredGiftTypes: string[]
  tabooGiftTypes: string[]
  ceremonialRequirements: string[]
  reciprocityExpectations: number
  publicDisplayPreference: boolean
  seasonalPreferences: SeasonalGift[]
}
```

### 6. Security & Validation

#### **Transfer Validation**
- **Resource Availability**: Verify sender has sufficient resources
- **Authorization**: Confirm sender has authority to transfer
- **Recipient Validation**: Ensure recipient exists and can receive
- **Fraud Detection**: Identify suspicious transfer patterns
- **Duplicate Prevention**: Prevent double-spending and duplication

#### **Audit Systems**
```typescript
interface TransferAudit {
  transferId: string
  timestamp: Date
  auditorId: number
  validationChecks: ValidationCheck[]
  riskAssessment: RiskLevel
  approvalRequired: boolean
  auditTrail: AuditEntry[]
}
```

### 7. User Interface & Experience

#### **Gift Selection Interface**
- **Resource Browser**: Easy selection of available resources
- **Diplomatic Context**: Suggested gifts based on relationship status
- **Impact Preview**: Show expected relationship and economic effects
- **Cultural Guidance**: Recommendations based on recipient culture
- **Ceremony Options**: Choose presentation style and publicity

#### **Tribute Management Dashboard**
- **Tribute Calendar**: Schedule and track tribute payments
- **Relationship Monitor**: Track tribute effects on relationships
- **Economic Impact**: Monitor tribute effects on empire economy
- **Negotiation Tools**: Interface for tribute renegotiation
- **Historical Analysis**: Review past tribute relationships

## Technical Implementation

### Database Schema Extensions

```sql
-- Gift and tribute transactions
CREATE TABLE resource_transfers (
    id SERIAL PRIMARY KEY,
    transfer_type VARCHAR(50) NOT NULL, -- gift, tribute, trade, loan, reparation
    from_entity_type VARCHAR(20) NOT NULL, -- empire, alliance, hero, party
    from_entity_id INT NOT NULL,
    to_entity_type VARCHAR(20) NOT NULL,
    to_entity_id INT NOT NULL,
    resources TEXT NOT NULL, -- JSON with resource details
    diplomatic_context TEXT,
    relationship_impact NUMERIC DEFAULT 0,
    economic_impact NUMERIC DEFAULT 0,
    ceremony_type VARCHAR(50),
    publicity_level VARCHAR(20) DEFAULT 'private',
    conditions TEXT, -- JSON with transfer conditions
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_delivery TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tribute schedules and recurring payments
CREATE TABLE tribute_schedules (
    id SERIAL PRIMARY KEY,
    payer_empire_id INT REFERENCES empires(id),
    receiver_empire_id INT REFERENCES empires(id),
    tribute_type VARCHAR(50) NOT NULL,
    amount TEXT NOT NULL, -- JSON with resource amounts
    frequency VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    conditions TEXT, -- JSON with tribute conditions
    penalties TEXT, -- JSON with penalty structure
    auto_renewal BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cultural gift preferences
CREATE TABLE culture_gift_preferences (
    culture_id INT PRIMARY KEY,
    preferred_gifts TEXT, -- JSON array of preferred gift types
    taboo_gifts TEXT, -- JSON array of taboo gift types
    ceremonial_requirements TEXT, -- JSON with ceremony preferences
    reciprocity_expectations NUMERIC DEFAULT 1.0,
    public_display_preference BOOLEAN DEFAULT true,
    seasonal_preferences TEXT -- JSON with seasonal gift preferences
);

-- Transfer audit trail
CREATE TABLE transfer_audit_log (
    id SERIAL PRIMARY KEY,
    transfer_id INT REFERENCES resource_transfers(id),
    audit_timestamp TIMESTAMP DEFAULT NOW(),
    auditor_id INT,
    validation_checks TEXT, -- JSON with validation results
    risk_assessment VARCHAR(20),
    approval_status VARCHAR(20),
    notes TEXT
);
```

### API Endpoints

#### Gift Management
- `POST /api/gifts/send` - Send a gift to another entity
- `GET /api/gifts/received` - List received gifts
- `GET /api/gifts/sent` - List sent gifts
- `POST /api/gifts/respond` - Accept/reject a gift
- `GET /api/gifts/suggestions` - Get gift suggestions based on relationship

#### Tribute Management
- `POST /api/tribute/schedule` - Create tribute schedule
- `GET /api/tribute/schedules` - List tribute schedules
- `POST /api/tribute/pay` - Make tribute payment
- `POST /api/tribute/renegotiate` - Request tribute renegotiation
- `GET /api/tribute/history` - View tribute payment history

#### Cultural Context
- `GET /api/culture/:id/gift-preferences` - Get cultural gift preferences
- `GET /api/gifts/cultural-guidance` - Get cultural guidance for gifts
- `POST /api/gifts/ceremony` - Plan gift ceremony

#### Audit & Security
- `GET /api/transfers/audit/:id` - Get transfer audit trail
- `POST /api/transfers/validate` - Validate transfer before execution
- `GET /api/transfers/suspicious` - List suspicious transfer patterns

### Integration Points

#### Economic Engine Integration
- **Money Conservation**: All transfers update economic balances
- **Market Impact**: Large transfers affect supply/demand
- **Inflation Tracking**: Currency transfers influence exchange rates
- **Economic Dependencies**: Track tribute-based economic relationships

#### Diplomatic System Integration
- **Relationship Updates**: Gifts and tribute affect diplomatic standings
- **Treaty Integration**: Tribute requirements in peace treaties
- **Alliance Benefits**: Alliance members get gift/tribute bonuses
- **Cultural Diplomacy**: Gift preferences affect diplomatic success

#### Intelligence System Integration
- **Gift Intelligence**: Track gift patterns for strategic insights
- **Tribute Monitoring**: Monitor tribute relationships for opportunities
- **Economic Espionage**: Gather intelligence on resource transfers
- **Diplomatic Intelligence**: Analyze gift patterns for relationship insights

This comprehensive gifting and tribute system adds rich diplomatic and economic depth while maintaining strict resource conservation and providing meaningful player interactions across all levels of the game.
