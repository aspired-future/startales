// Financial AI Module - Economic Analysis and Market Prediction

class FinancialAI {
    constructor(config = {}) {
        this.config = {
            modelEndpoint: config.modelEndpoint || 'http://localhost:11434/api/generate',
            model: config.model || 'llama2',
            temperature: config.temperature || 0.3, // Lower temperature for financial decisions
            maxTokens: config.maxTokens || 800,
            ...config
        };

        this.economicIndicators = [
            'gdp_growth', 'inflation_rate', 'unemployment_rate', 'interest_rates',
            'trade_balance', 'currency_strength', 'market_volatility', 'consumer_confidence'
        ];

        this.investmentTypes = [
            'stocks', 'bonds', 'real_estate', 'commodities', 'cryptocurrency',
            'business_ventures', 'education', 'technology', 'infrastructure'
        ];

        this.riskLevels = {
            conservative: { min: 0, max: 30, description: 'Low risk, stable returns' },
            moderate: { min: 30, max: 70, description: 'Balanced risk and return' },
            aggressive: { min: 70, max: 100, description: 'High risk, high potential return' }
        };
    }

    async initialize() {
        console.log('Initializing Financial AI module...');
        try {
            await this.testConnection();
            console.log('Financial AI module initialized successfully');
        } catch (error) {
            console.warn('Financial AI model not available, using fallback logic');
            this.useFallback = true;
        }
    }

    async analyzeDecision(action) {
        if (this.useFallback) {
            return this.getFallbackAnalysis(action);
        }

        try {
            const prompt = this.buildAnalysisPrompt(action);
            const response = await this.callAIModel(prompt);
            return this.parseAnalysisResponse(response, action);
        } catch (error) {
            console.error('Financial AI analysis error:', error);
            return this.getFallbackAnalysis(action);
        }
    }

    buildAnalysisPrompt(action) {
        const marketContext = this.describeMarketContext(action.marketData);
        const characterContext = this.describeCharacterFinances(action.character);
        const actionContext = this.describeAction(action);

        return {
            model: this.config.model,
            prompt: `You are a financial AI advisor in a galactic civilization simulation. Analyze the following economic decision:

MARKET CONTEXT:
${marketContext}

CHARACTER FINANCIAL PROFILE:
${characterContext}

PROPOSED ACTION:
${actionContext}

Provide a comprehensive financial analysis considering:

1. Market conditions and trends
2. Risk assessment for this specific action
3. Expected return on investment (ROI)
4. Impact on character's financial position
5. Alternative investment options
6. Market timing considerations
7. Long-term financial implications
8. Diversification effects

Respond in the following JSON format:
{
  "analysis": {
    "recommendation": "approve|reject|modify",
    "confidence": 0.85,
    "expected_roi": 0.12,
    "risk_level": "low|medium|high",
    "time_horizon": "short|medium|long",
    "reasoning": "detailed explanation of the recommendation"
  },
  "market_assessment": {
    "current_trend": "bullish|bearish|sideways",
    "volatility": "low|medium|high",
    "key_factors": ["factor1", "factor2", "factor3"],
    "timing_score": 0.75
  },
  "risk_analysis": {
    "primary_risks": ["risk1", "risk2"],
    "risk_mitigation": ["strategy1", "strategy2"],
    "worst_case_scenario": "description",
    "best_case_scenario": "description"
  },
  "alternatives": [
    {
      "option": "alternative investment",
      "expected_roi": 0.08,
      "risk_level": "medium",
      "reasoning": "why this might be better"
    }
  ],
  "portfolio_impact": {
    "diversification_effect": "positive|negative|neutral",
    "liquidity_impact": "improved|reduced|unchanged",
    "overall_risk_change": "increased|decreased|unchanged"
  }
}`,
            options: {
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }
        };
    }

    async predictMarketTrends(marketData, timeHorizon = 'medium') {
        if (this.useFallback) {
            return this.getFallbackMarketPrediction(marketData, timeHorizon);
        }

        const prompt = this.buildMarketPredictionPrompt(marketData, timeHorizon);
        const response = await this.callAIModel(prompt);
        return this.parseMarketPrediction(response);
    }

    buildMarketPredictionPrompt(marketData, timeHorizon) {
        return {
            model: this.config.model,
            prompt: `You are a financial AI analyzing galactic market trends. Based on the following market data, predict future trends:

CURRENT MARKET DATA:
${JSON.stringify(marketData, null, 2)}

TIME HORIZON: ${timeHorizon} term (${this.getTimeHorizonDescription(timeHorizon)})

Analyze the data and provide predictions for:
1. Overall market direction
2. Sector-specific trends
3. Key economic indicators
4. Potential market disruptions
5. Investment opportunities
6. Risk factors to monitor

Provide your analysis in JSON format:
{
  "prediction": {
    "overall_direction": "bullish|bearish|sideways",
    "confidence": 0.75,
    "key_drivers": ["driver1", "driver2"],
    "timeline": "specific timeframe for prediction"
  },
  "sector_analysis": {
    "technology": {"trend": "up|down|stable", "confidence": 0.8},
    "manufacturing": {"trend": "up|down|stable", "confidence": 0.7},
    "services": {"trend": "up|down|stable", "confidence": 0.6}
  },
  "economic_indicators": {
    "gdp_growth": {"predicted": 0.03, "confidence": 0.7},
    "inflation": {"predicted": 0.025, "confidence": 0.8},
    "unemployment": {"predicted": 0.05, "confidence": 0.6}
  },
  "opportunities": [
    {
      "sector": "sector name",
      "opportunity": "description",
      "potential_return": 0.15,
      "risk_level": "medium"
    }
  ],
  "risks": [
    {
      "risk": "risk description",
      "probability": 0.3,
      "impact": "high|medium|low",
      "mitigation": "suggested mitigation strategy"
    }
  ]
}`,
            options: {
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }
        };
    }

    async assessCreditworthiness(character, loanRequest) {
        if (this.useFallback) {
            return this.getFallbackCreditAssessment(character, loanRequest);
        }

        const prompt = this.buildCreditAssessmentPrompt(character, loanRequest);
        const response = await this.callAIModel(prompt);
        return this.parseCreditAssessment(response);
    }

    buildCreditAssessmentPrompt(character, loanRequest) {
        return {
            model: this.config.model,
            prompt: `You are a financial AI conducting credit analysis for a galactic banking system.

CHARACTER PROFILE:
Name: ${character.name}
Age: ${character.age}
Profession: ${character.profession}
Income: ${character.income} credits/month
Employment History: ${character.employmentHistory?.length || 0} positions
Credit History: ${character.creditHistory?.length || 0} previous loans

FINANCIAL POSITION:
Assets: ${JSON.stringify(character.assets || {}, null, 2)}
Liabilities: ${JSON.stringify(character.liabilities || {}, null, 2)}
Monthly Expenses: ${character.monthlyExpenses} credits
Savings: ${character.savings} credits

LOAN REQUEST:
Amount: ${loanRequest.amount} credits
Purpose: ${loanRequest.purpose}
Term: ${loanRequest.term} months
Proposed Interest Rate: ${loanRequest.proposedRate}%

Conduct a comprehensive credit analysis and provide:

{
  "credit_decision": {
    "approved": true|false,
    "recommended_amount": 50000,
    "recommended_rate": 0.08,
    "recommended_term": 36,
    "conditions": ["condition1", "condition2"]
  },
  "credit_score": {
    "score": 750,
    "rating": "excellent|good|fair|poor",
    "factors": {
      "payment_history": 0.85,
      "credit_utilization": 0.70,
      "length_of_history": 0.60,
      "income_stability": 0.90,
      "debt_to_income": 0.75
    }
  },
  "risk_assessment": {
    "default_probability": 0.05,
    "risk_category": "low|medium|high",
    "key_risks": ["risk1", "risk2"],
    "mitigating_factors": ["factor1", "factor2"]
  },
  "recommendations": [
    {
      "type": "improvement",
      "suggestion": "specific recommendation",
      "impact": "how this would improve creditworthiness"
    }
  ]
}`,
            options: {
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }
        };
    }

    async optimizePortfolio(character, goals, constraints) {
        if (this.useFallback) {
            return this.getFallbackPortfolioOptimization(character, goals, constraints);
        }

        const prompt = this.buildPortfolioOptimizationPrompt(character, goals, constraints);
        const response = await this.callAIModel(prompt);
        return this.parsePortfolioOptimization(response);
    }

    // Utility Methods
    async callAIModel(prompt) {
        const response = await fetch(this.config.modelEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prompt)
        });

        if (!response.ok) {
            throw new Error(`AI model request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response || data.text || data.content;
    }

    parseAnalysisResponse(response, action) {
        try {
            const parsed = JSON.parse(response);
            return {
                ...parsed,
                action_id: action.id,
                timestamp: Date.now(),
                processing_method: 'ai_analysis'
            };
        } catch (error) {
            return this.extractAnalysisFromText(response, action);
        }
    }

    extractAnalysisFromText(text, action) {
        // Simple text extraction as fallback
        let recommendation = 'approve';
        let confidence = 0.5;
        let riskLevel = 'medium';

        if (text.toLowerCase().includes('reject') || text.toLowerCase().includes('not recommend')) {
            recommendation = 'reject';
        }
        if (text.toLowerCase().includes('high risk')) {
            riskLevel = 'high';
        }
        if (text.toLowerCase().includes('low risk')) {
            riskLevel = 'low';
        }

        return {
            analysis: {
                recommendation,
                confidence,
                expected_roi: 0.08,
                risk_level: riskLevel,
                time_horizon: 'medium',
                reasoning: 'Extracted from text analysis'
            },
            action_id: action.id,
            timestamp: Date.now(),
            processing_method: 'text_extraction'
        };
    }

    getFallbackAnalysis(action) {
        // Rule-based fallback analysis
        const amount = action.amount || 0;
        const characterIncome = action.character?.income || 0;
        const characterSavings = action.character?.savings || 0;

        let recommendation = 'approve';
        let riskLevel = 'medium';
        let expectedROI = 0.06;

        // Simple rules
        if (amount > characterIncome * 12) {
            recommendation = 'reject';
            riskLevel = 'high';
        } else if (amount > characterSavings * 2) {
            recommendation = 'modify';
            riskLevel = 'high';
        } else if (amount < characterIncome) {
            riskLevel = 'low';
            expectedROI = 0.08;
        }

        return {
            analysis: {
                recommendation,
                confidence: 0.6,
                expected_roi: expectedROI,
                risk_level: riskLevel,
                time_horizon: 'medium',
                reasoning: 'Rule-based fallback analysis'
            },
            market_assessment: {
                current_trend: 'sideways',
                volatility: 'medium',
                key_factors: ['market_uncertainty'],
                timing_score: 0.5
            },
            risk_analysis: {
                primary_risks: ['market_volatility', 'liquidity_risk'],
                risk_mitigation: ['diversification', 'gradual_investment'],
                worst_case_scenario: 'Potential loss of principal',
                best_case_scenario: 'Moderate returns'
            },
            processing_method: 'fallback_rules'
        };
    }

    describeMarketContext(marketData) {
        if (!marketData) return 'Market data not available';

        const descriptions = [];
        
        if (marketData.indices) {
            descriptions.push(`Market Indices: ${Object.entries(marketData.indices).map(([name, value]) => `${name}: ${value}`).join(', ')}`);
        }
        
        if (marketData.sectors) {
            descriptions.push(`Sector Performance: ${Object.entries(marketData.sectors).map(([sector, perf]) => `${sector}: ${perf}%`).join(', ')}`);
        }
        
        if (marketData.volatility) {
            descriptions.push(`Market Volatility: ${marketData.volatility}`);
        }

        return descriptions.join('\n');
    }

    describeCharacterFinances(character) {
        if (!character) return 'Character financial data not available';

        return `Income: ${character.income || 0} credits/month
Savings: ${character.savings || 0} credits
Assets: ${Object.keys(character.assets || {}).length} asset types
Liabilities: ${Object.keys(character.liabilities || {}).length} liability types
Credit Score: ${character.creditScore || 'Unknown'}
Risk Tolerance: ${character.riskTolerance || 'moderate'}`;
    }

    describeAction(action) {
        return `Action Type: ${action.type}
Amount: ${action.amount} credits
Purpose: ${action.purpose || 'Not specified'}
Timeline: ${action.timeline || 'Not specified'}
Expected Return: ${action.expectedReturn || 'Not specified'}`;
    }

    getTimeHorizonDescription(horizon) {
        const descriptions = {
            short: '1-6 months',
            medium: '6 months - 2 years',
            long: '2+ years'
        };
        return descriptions[horizon] || 'unspecified';
    }

    async testConnection() {
        const testPrompt = {
            model: this.config.model,
            prompt: 'Test connection. Respond with "OK".',
            options: {
                temperature: 0.1,
                max_tokens: 10
            }
        };

        const response = await this.callAIModel(testPrompt);
        if (!response || !response.toLowerCase().includes('ok')) {
            throw new Error('AI model test failed');
        }
    }

    // Fallback methods
    getFallbackMarketPrediction(marketData, timeHorizon) {
        return {
            prediction: {
                overall_direction: 'sideways',
                confidence: 0.4,
                key_drivers: ['market_uncertainty'],
                timeline: this.getTimeHorizonDescription(timeHorizon)
            },
            processing_method: 'fallback_rules'
        };
    }

    getFallbackCreditAssessment(character, loanRequest) {
        const income = character.income || 0;
        const amount = loanRequest.amount || 0;
        const debtToIncomeRatio = amount / (income * 12);

        let approved = debtToIncomeRatio < 0.4;
        let score = Math.max(300, Math.min(850, 700 - (debtToIncomeRatio * 200)));

        return {
            credit_decision: {
                approved,
                recommended_amount: approved ? amount : amount * 0.7,
                recommended_rate: 0.08,
                recommended_term: loanRequest.term || 36,
                conditions: approved ? [] : ['reduce_loan_amount']
            },
            credit_score: {
                score: Math.round(score),
                rating: score > 700 ? 'good' : score > 600 ? 'fair' : 'poor'
            },
            processing_method: 'fallback_rules'
        };
    }

    getFallbackPortfolioOptimization(character, goals, constraints) {
        return {
            recommended_allocation: {
                stocks: 0.6,
                bonds: 0.3,
                cash: 0.1
            },
            expected_return: 0.07,
            risk_level: 'moderate',
            processing_method: 'fallback_rules'
        };
    }
}

module.exports = { AIModule: FinancialAI };

