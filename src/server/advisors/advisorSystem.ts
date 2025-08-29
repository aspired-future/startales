import { CampaignState } from '../../simulation/engine/engine';
import { Policy, PolicyEngine } from '../policies/policyEngine';

export interface AdvisorDomain {
  id: string;
  name: string;
  description: string;
  expertise: string[];
  personality: 'conservative' | 'moderate' | 'progressive' | 'pragmatic';
}

export interface AdvisorQuery {
  domain: string;
  question: string;
  context?: any;
}

export interface AdvisorResponse {
  success: boolean;
  advisor: AdvisorDomain;
  response: string;
  confidence: number; // 0-1
  sources?: string[];
  followUpQuestions?: string[];
  error?: string;
}

export interface PolicyProposal {
  success: boolean;
  advisor: AdvisorDomain;
  proposal: {
    title: string;
    rationale: string;
    policyText: string;
    urgency: 'low' | 'medium' | 'high';
    expectedOutcome: string;
    risks: string[];
    alternatives?: string[];
  };
  error?: string;
}

/**
 * Advisor system that provides domain expertise and policy recommendations
 */
export class AdvisorSystem {
  
  private static readonly ADVISORS: AdvisorDomain[] = [
    {
      id: 'economic',
      name: 'Economic Advisor',
      description: 'Specialist in fiscal policy, taxation, and economic development',
      expertise: ['taxation', 'budget', 'trade', 'industry', 'employment'],
      personality: 'pragmatic'
    },
    {
      id: 'military',
      name: 'Defense Secretary',
      description: 'Expert in military strategy, defense spending, and national security',
      expertise: ['military', 'defense', 'security', 'readiness', 'strategy'],
      personality: 'conservative'
    },
    {
      id: 'science',
      name: 'Science Advisor',
      description: 'Leading authority on research policy, innovation, and technological advancement',
      expertise: ['research', 'science', 'technology', 'innovation', 'education'],
      personality: 'progressive'
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Minister',
      description: 'Oversees transportation, logistics, and public works development',
      expertise: ['infrastructure', 'transport', 'logistics', 'construction', 'urban planning'],
      personality: 'moderate'
    },
    {
      id: 'foreign',
      name: 'Foreign Minister',
      description: 'Handles international relations, diplomacy, and trade agreements',
      expertise: ['diplomacy', 'trade', 'international', 'relations', 'treaties'],
      personality: 'moderate'
    }
  ];
  
  /**
   * Get all available advisors
   */
  static getAdvisors(): AdvisorDomain[] {
    return [...this.ADVISORS];
  }
  
  /**
   * Get advisor by domain ID
   */
  static getAdvisor(domainId: string): AdvisorDomain | null {
    return this.ADVISORS.find(advisor => advisor.id === domainId) || null;
  }
  
  /**
   * Query an advisor for information or advice
   */
  static async queryAdvisor(
    query: AdvisorQuery,
    campaignState: CampaignState
  ): Promise<AdvisorResponse> {
    const advisor = this.getAdvisor(query.domain);
    
    if (!advisor) {
      return {
        success: false,
        advisor: this.ADVISORS[0], // Fallback
        response: '',
        confidence: 0,
        error: `Unknown advisor domain: ${query.domain}`
      };
    }
    
    try {
      // This would normally call an AI service, but for demo we'll use rule-based responses
      const response = await this.generateResponse(advisor, query.question, campaignState);
      
      return {
        success: true,
        advisor,
        response: response.text,
        confidence: response.confidence,
        sources: response.sources,
        followUpQuestions: response.followUp
      };
    } catch (error) {
      return {
        success: false,
        advisor,
        response: '',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Ask an advisor to propose a policy
   */
  static async proposePolicy(
    domainId: string,
    context: { situation?: string; goals?: string[] },
    campaignState: CampaignState
  ): Promise<PolicyProposal> {
    const advisor = this.getAdvisor(domainId);
    
    if (!advisor) {
      return {
        success: false,
        advisor: this.ADVISORS[0], // Fallback
        proposal: {
          title: '',
          rationale: '',
          policyText: '',
          urgency: 'low',
          expectedOutcome: '',
          risks: []
        },
        error: `Unknown advisor domain: ${domainId}`
      };
    }
    
    try {
      const proposal = await this.generatePolicyProposal(advisor, context, campaignState);
      
      return {
        success: true,
        advisor,
        proposal
      };
    } catch (error) {
      return {
        success: false,
        advisor,
        proposal: {
          title: '',
          rationale: '',
          policyText: '',
          urgency: 'low',
          expectedOutcome: '',
          risks: []
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Generate advisor response (demo implementation)
   */
  private static async generateResponse(
    advisor: AdvisorDomain,
    question: string,
    state: CampaignState
  ): Promise<{
    text: string;
    confidence: number;
    sources: string[];
    followUp: string[];
  }> {
    const lowerQuestion = question.toLowerCase();
    
    // Economic advisor responses
    if (advisor.id === 'economic') {
      if (lowerQuestion.includes('tax') || lowerQuestion.includes('revenue')) {
        return {
          text: `Based on current economic conditions, our tax revenue is at ${state.resources.credits} credits. ` +
                `Tax policy should balance revenue generation with economic growth. Higher taxes increase government ` +
                `funding but may reduce private sector investment. Consider graduated approaches and impact on different sectors.`,
          confidence: 0.85,
          sources: ['Treasury Department', 'Economic Analysis Division'],
          followUp: [
            'What specific tax rates are you considering?',
            'How would this affect different income brackets?',
            'What are the projected revenue impacts?'
          ]
        };
      }
      
      if (lowerQuestion.includes('industry') || lowerQuestion.includes('manufacturing')) {
        return {
          text: `Our industrial capacity shows ${Object.entries(state.buildings)
            .filter(([type]) => type.includes('factory'))
            .map(([type, count]) => `${count} ${type}`)
            .join(', ')}. Industrial policy should focus on productivity improvements, ` +
                `supply chain optimization, and workforce development. Subsidies can boost output but require careful cost-benefit analysis.`,
          confidence: 0.80,
          sources: ['Department of Commerce', 'Industrial Development Board'],
          followUp: [
            'Which industries need the most support?',
            'What are the employment implications?',
            'How does this align with our trade strategy?'
          ]
        };
      }
    }
    
    // Military advisor responses
    if (advisor.id === 'military') {
      if (lowerQuestion.includes('defense') || lowerQuestion.includes('military') || lowerQuestion.includes('security')) {
        const readiness = state.kpis.military_readiness || 0;
        return {
          text: `Current military readiness is at ${(readiness * 100).toFixed(0)}%. Defense spending should be calibrated ` +
                `to address immediate threats while maintaining long-term strategic capabilities. Increased funding improves ` +
                `readiness and equipment quality but diverts resources from civilian programs. Regional security analysis suggests ` +
                `maintaining defensive posture while building deterrent capabilities.`,
          confidence: 0.90,
          sources: ['Joint Chiefs of Staff', 'Defense Intelligence Agency'],
          followUp: [
            'What are the primary threat vectors?',
            'How should we prioritize different military branches?',
            'What are the recruitment and training needs?'
          ]
        };
      }
    }
    
    // Science advisor responses
    if (advisor.id === 'science') {
      if (lowerQuestion.includes('research') || lowerQuestion.includes('science') || lowerQuestion.includes('technology')) {
        const scienceProgress = state.kpis.science_progress || 0;
        return {
          text: `Research progress is currently at ${(scienceProgress * 100).toFixed(0)}%. Science policy should prioritize ` +
                `breakthrough technologies while maintaining fundamental research. Increased R&D funding accelerates innovation ` +
                `but requires sustained commitment. Focus areas should include emerging technologies, infrastructure modernization, ` +
                `and human capital development through education.`,
          confidence: 0.88,
          sources: ['National Science Foundation', 'Technology Assessment Office'],
          followUp: [
            'Which research areas offer the highest ROI?',
            'How can we improve university-industry collaboration?',
            'What are the international competitiveness implications?'
          ]
        };
      }
    }
    
    // Generic response for unmatched questions
    return {
      text: `As your ${advisor.name}, I need more specific information to provide detailed guidance. ` +
            `My expertise covers ${advisor.expertise.join(', ')}. Could you clarify what specific aspect ` +
            `you'd like me to address? I can provide analysis on policy options, implementation strategies, ` +
            `or potential outcomes within my domain.`,
      confidence: 0.60,
      sources: [advisor.name],
      followUp: [
        `What specific ${advisor.expertise[0]} issue concerns you most?`,
        'Would you like me to propose policy alternatives?',
        'What are your primary objectives in this area?'
      ]
    };
  }
  
  /**
   * Generate policy proposal (demo implementation)
   */
  private static async generatePolicyProposal(
    advisor: AdvisorDomain,
    context: { situation?: string; goals?: string[] },
    state: CampaignState
  ): Promise<PolicyProposal['proposal']> {
    
    // Economic advisor proposals
    if (advisor.id === 'economic') {
      if (state.resources.credits < 500) {
        return {
          title: 'Emergency Revenue Enhancement Act',
          rationale: 'Current government funds are critically low, threatening essential services and infrastructure maintenance. ' +
                    'Immediate revenue generation is necessary to maintain fiscal stability and public confidence.',
          policyText: 'Implement a temporary 15% increase in corporate taxation and introduce a 5% luxury goods tax. ' +
                     'Establish fast-track collection procedures and close existing tax loopholes.',
          urgency: 'high',
          expectedOutcome: 'Increase government revenue by approximately 20-25% within two fiscal quarters. ' +
                          'Stabilize budget and restore investor confidence.',
          risks: [
            'May reduce business investment in the short term',
            'Could trigger capital flight if poorly implemented',
            'Public resistance to new tax burden'
          ],
          alternatives: [
            'Issue government bonds to raise capital',
            'Implement spending cuts in non-essential programs',
            'Privatize select government assets'
          ]
        };
      } else {
        return {
          title: 'Industrial Competitiveness Initiative',
          rationale: 'With stable finances, we can focus on long-term economic growth through industrial development. ' +
                    'Manufacturing sector shows potential for expansion with proper incentives.',
          policyText: 'Provide 25% tax credits for manufacturing investments, establish industrial development zones ' +
                     'with reduced regulatory burden, and create public-private partnerships for infrastructure.',
          urgency: 'medium',
          expectedOutcome: 'Boost manufacturing output by 30% over 3 years, create jobs, and improve trade balance.',
          risks: [
            'High upfront costs may strain budget',
            'Benefits may take time to materialize',
            'Risk of market distortion through subsidies'
          ]
        };
      }
    }
    
    // Military advisor proposals
    if (advisor.id === 'military') {
      const readiness = state.kpis.military_readiness || 0;
      if (readiness < 0.7) {
        return {
          title: 'Defense Readiness Modernization Program',
          rationale: 'Current military readiness below acceptable thresholds for national security. Equipment aging ' +
                    'and training deficits require immediate attention to maintain defensive capabilities.',
          policyText: 'Increase defense budget by 40%, modernize equipment procurement, expand training programs, ' +
                     'and establish rapid response capabilities. Prioritize cyber defense and intelligence gathering.',
          urgency: 'high',
          expectedOutcome: 'Achieve 90% readiness within 18 months, improve deterrent capability, and enhance national security.',
          risks: [
            'Significant budget impact on other programs',
            'May be perceived as aggressive by neighbors',
            'Risk of military-industrial complex influence'
          ]
        };
      }
    }
    
    // Science advisor proposals
    if (advisor.id === 'science') {
      return {
        title: 'National Innovation Acceleration Act',
        rationale: 'Technological advancement is crucial for long-term competitiveness and economic growth. ' +
                  'Current research infrastructure needs modernization to attract top talent.',
        policyText: 'Double research funding, establish innovation hubs, provide grants for breakthrough technologies, ' +
                   'and create tax incentives for R&D investments. Partner with universities and private sector.',
        urgency: 'medium',
        expectedOutcome: 'Accelerate technological development, improve international competitiveness, and create high-value jobs.',
        risks: [
          'High costs with uncertain returns',
          'Brain drain from other sectors',
          'Risk of funding politically popular but scientifically dubious projects'
        ]
      };
    }
    
    // Default proposal
    return {
      title: `${advisor.name} Policy Recommendation`,
      rationale: 'Based on current conditions and my expertise, targeted intervention is needed in this domain.',
      policyText: `Implement focused reforms in ${advisor.expertise[0]} to address current challenges and opportunities.`,
      urgency: 'medium',
      expectedOutcome: 'Improve performance metrics and address key challenges in this policy area.',
      risks: ['Implementation challenges', 'Unintended consequences', 'Resource allocation concerns']
    };
  }
}
