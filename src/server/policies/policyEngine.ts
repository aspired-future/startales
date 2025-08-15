export interface PolicyModifier {
  id: string;
  type: 'resource' | 'building' | 'research' | 'military' | 'population' | 'trade';
  target: string; // What is being modified (e.g., 'credits', 'factory_efficiency', 'research_speed')
  operation: 'multiply' | 'add' | 'set';
  value: number;
  cap: number; // Maximum absolute effect
  duration?: number; // Steps the policy lasts (undefined = permanent)
  description: string;
}

export interface Policy {
  id: string;
  campaignId: number;
  title: string;
  description: string;
  rawText: string; // Original free-form input
  modifiers: PolicyModifier[];
  status: 'draft' | 'pending_approval' | 'active' | 'rejected' | 'expired';
  createdAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  approvalRequired: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedImpact: string;
}

export interface PolicyParseResult {
  success: boolean;
  policy?: Omit<Policy, 'id' | 'campaignId' | 'createdAt' | 'status'>;
  error?: string;
  warnings?: string[];
}

/**
 * AI-powered policy parser that converts free-form text into structured modifiers
 */
export class PolicyEngine {
  private static readonly MAX_MODIFIER_CAP = 2.0; // 200% max effect
  private static readonly HIGH_RISK_THRESHOLD = 1.5; // 150% effect = high risk
  
  /**
   * Parse free-form policy text into structured policy with capped modifiers
   */
  static async parsePolicy(
    rawText: string,
    campaignId: number,
    options: { requireApproval?: boolean } = {}
  ): Promise<PolicyParseResult> {
    try {
      // This would normally call an AI service, but for demo we'll use rule-based parsing
      const result = await this.parseWithRules(rawText, campaignId);
      
      if (!result.success || !result.policy) {
        return result;
      }
      
      // Apply caps and calculate risk
      const cappedPolicy = this.applyCapsAndRisk(result.policy);
      cappedPolicy.approvalRequired = options.requireApproval ?? cappedPolicy.riskLevel !== 'low';
      
      return {
        success: true,
        policy: cappedPolicy,
        warnings: result.warnings
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error parsing policy'
      };
    }
  }
  
  /**
   * Rule-based policy parsing (demo implementation)
   */
  private static async parseWithRules(rawText: string, campaignId: number): Promise<PolicyParseResult> {
    const text = rawText.toLowerCase().trim();
    const modifiers: PolicyModifier[] = [];
    const warnings: string[] = [];
    
    let title = 'New Policy';
    let description = rawText;
    let estimatedImpact = 'Minimal impact expected';
    
    // Extract title from first line if it looks like a title
    const lines = rawText.split('\n');
    if (lines.length > 1 && lines[0].length < 100 && !lines[0].includes('.')) {
      title = lines[0].trim();
      description = lines.slice(1).join('\n').trim();
    }
    
    // Tax policies
    if (text.includes('tax') || text.includes('taxation')) {
      if (text.includes('increase') || text.includes('raise') || text.includes('higher')) {
        modifiers.push({
          id: 'tax_increase',
          type: 'resource',
          target: 'credits',
          operation: 'multiply',
          value: 1.2,
          cap: 1.5,
          description: 'Increased tax revenue'
        });
        estimatedImpact = 'Moderate increase in government revenue';
      } else if (text.includes('decrease') || text.includes('lower') || text.includes('cut')) {
        modifiers.push({
          id: 'tax_cut',
          type: 'resource',
          target: 'credits',
          operation: 'multiply',
          value: 0.8,
          cap: 0.5,
          description: 'Reduced tax burden'
        });
        estimatedImpact = 'Reduced government revenue, potential economic stimulus';
      }
    }
    
    // Industrial policies
    if (text.includes('industry') || text.includes('manufacturing') || text.includes('factory')) {
      if (text.includes('subsidies') || text.includes('support') || text.includes('boost')) {
        modifiers.push({
          id: 'industrial_boost',
          type: 'building',
          target: 'factory_efficiency',
          operation: 'multiply',
          value: 1.3,
          cap: 1.8,
          description: 'Enhanced industrial productivity'
        });
        estimatedImpact = 'Significant boost to manufacturing output';
      }
    }
    
    // Research policies
    if (text.includes('research') || text.includes('science') || text.includes('innovation')) {
      if (text.includes('funding') || text.includes('invest') || text.includes('boost')) {
        modifiers.push({
          id: 'research_funding',
          type: 'research',
          target: 'research_speed',
          operation: 'multiply',
          value: 1.25,
          cap: 1.6,
          description: 'Accelerated research progress'
        });
        estimatedImpact = 'Faster technological advancement';
      }
    }
    
    // Military policies
    if (text.includes('military') || text.includes('defense') || text.includes('army')) {
      if (text.includes('spending') || text.includes('budget') || text.includes('increase')) {
        modifiers.push({
          id: 'military_spending',
          type: 'military',
          target: 'military_readiness',
          operation: 'multiply',
          value: 1.4,
          cap: 2.0,
          description: 'Enhanced military capabilities'
        });
        modifiers.push({
          id: 'military_cost',
          type: 'resource',
          target: 'credits',
          operation: 'multiply',
          value: 0.9,
          cap: 0.7,
          description: 'Increased military expenditure'
        });
        estimatedImpact = 'Stronger defense at the cost of government funds';
      }
    }
    
    // Infrastructure policies
    if (text.includes('infrastructure') || text.includes('roads') || text.includes('transport')) {
      modifiers.push({
        id: 'infrastructure_investment',
        type: 'building',
        target: 'logistics_efficiency',
        operation: 'multiply',
        value: 1.2,
        cap: 1.5,
        description: 'Improved logistics and transport'
      });
      estimatedImpact = 'Better resource distribution and economic efficiency';
    }
    
    // Trade policies
    if (text.includes('trade') || text.includes('import') || text.includes('export')) {
      if (text.includes('tariff') || text.includes('protect')) {
        modifiers.push({
          id: 'trade_protection',
          type: 'trade',
          target: 'trade_efficiency',
          operation: 'multiply',
          value: 0.8,
          cap: 0.5,
          description: 'Trade protectionism'
        });
        estimatedImpact = 'Protected domestic industry, reduced trade efficiency';
      } else if (text.includes('free') || text.includes('open')) {
        modifiers.push({
          id: 'free_trade',
          type: 'trade',
          target: 'trade_efficiency',
          operation: 'multiply',
          value: 1.3,
          cap: 1.8,
          description: 'Enhanced trade relations'
        });
        estimatedImpact = 'Increased trade efficiency and economic growth';
      }
    }
    
    if (modifiers.length === 0) {
      return {
        success: false,
        error: 'Could not identify any policy effects from the provided text. Please be more specific about the intended policy changes.'
      };
    }
    
    // Add warnings for potentially problematic policies
    if (modifiers.some(m => Math.abs(m.value - 1) > 0.4)) {
      warnings.push('This policy has significant effects that may require careful consideration');
    }
    
    return {
      success: true,
      policy: {
        title,
        description,
        rawText,
        modifiers,
        approvalRequired: false, // Will be set later based on risk
        riskLevel: 'low', // Will be calculated later
        estimatedImpact
      },
      warnings
    };
  }
  
  /**
   * Apply caps and calculate risk level for a policy
   */
  private static applyCapsAndRisk(policy: Omit<Policy, 'id' | 'campaignId' | 'createdAt' | 'status'>): Omit<Policy, 'id' | 'campaignId' | 'createdAt' | 'status'> {
    const cappedPolicy = { ...policy };
    let maxRisk = 0;
    
    // Apply caps and calculate risk
    cappedPolicy.modifiers = policy.modifiers.map(modifier => {
      const capped = { ...modifier };
      
      // Apply global maximum cap
      if (modifier.operation === 'multiply') {
        if (modifier.value > 1) {
          // Positive multiplier - cap the boost
          capped.value = Math.min(modifier.value, this.MAX_MODIFIER_CAP);
          capped.cap = Math.min(modifier.cap, this.MAX_MODIFIER_CAP);
        } else {
          // Negative multiplier - cap the reduction
          capped.value = Math.max(modifier.value, 1 - this.MAX_MODIFIER_CAP);
          capped.cap = Math.max(modifier.cap, 1 - this.MAX_MODIFIER_CAP);
        }
      }
      
      // Calculate risk based on deviation from 1.0
      const deviation = Math.abs(capped.value - 1);
      maxRisk = Math.max(maxRisk, deviation);
      
      return capped;
    });
    
    // Determine risk level
    if (maxRisk >= this.HIGH_RISK_THRESHOLD - 1) {
      cappedPolicy.riskLevel = 'high';
    } else if (maxRisk >= 0.2) {
      cappedPolicy.riskLevel = 'medium';
    } else {
      cappedPolicy.riskLevel = 'low';
    }
    
    return cappedPolicy;
  }
  
  /**
   * Apply policy modifiers to simulation state
   */
  static applyPolicyModifiers(baseValue: number, modifiers: PolicyModifier[], target: string): number {
    let result = baseValue;
    
    for (const modifier of modifiers) {
      if (modifier.target === target) {
        switch (modifier.operation) {
          case 'multiply':
            result *= modifier.value;
            break;
          case 'add':
            result += modifier.value;
            break;
          case 'set':
            result = modifier.value;
            break;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Get policy impact summary for display
   */
  static getPolicyImpactSummary(policy: Policy): string {
    const impacts = policy.modifiers.map(mod => {
      const change = mod.operation === 'multiply' 
        ? `${((mod.value - 1) * 100).toFixed(0)}%`
        : `${mod.value > 0 ? '+' : ''}${mod.value}`;
      
      return `${mod.target}: ${change}`;
    });
    
    return impacts.join(', ');
  }
}
