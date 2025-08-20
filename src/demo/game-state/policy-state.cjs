// ===== POLICY MANAGEMENT SYSTEM =====
const policyGameState = {
  policies: [],
  activeModifiers: [],
  policyCategories: [
    'economic', 'social', 'military', 'research', 'environmental', 
    'diplomatic', 'infrastructure', 'education', 'healthcare', 'security'
  ],
  policyTypes: [
    { id: 'tax_policy', name: 'Tax Policy', category: 'economic', baseImpact: 0.05 },
    { id: 'research_funding', name: 'Research Funding', category: 'research', baseImpact: 0.1 },
    { id: 'military_spending', name: 'Military Spending', category: 'military', baseImpact: 0.08 },
    { id: 'social_welfare', name: 'Social Welfare', category: 'social', baseImpact: 0.06 },
    { id: 'infrastructure_investment', name: 'Infrastructure Investment', category: 'infrastructure', baseImpact: 0.07 },
    { id: 'environmental_protection', name: 'Environmental Protection', category: 'environmental', baseImpact: 0.04 },
    { id: 'education_reform', name: 'Education Reform', category: 'education', baseImpact: 0.09 },
    { id: 'healthcare_expansion', name: 'Healthcare Expansion', category: 'healthcare', baseImpact: 0.08 },
    { id: 'trade_regulation', name: 'Trade Regulation', category: 'economic', baseImpact: 0.05 },
    { id: 'diplomatic_initiative', name: 'Diplomatic Initiative', category: 'diplomatic', baseImpact: 0.03 }
  ],
  modifierTypes: [
    { key: 'production_rate_mult', name: 'Production Rate Multiplier', category: 'economic', min: 0.5, max: 2.0 },
    { key: 'research_rate_mult', name: 'Research Rate Multiplier', category: 'research', min: 0.5, max: 2.5 },
    { key: 'tax_rate', name: 'Tax Rate', category: 'economic', min: 0.0, max: 0.5 },
    { key: 'military_strength_mult', name: 'Military Strength Multiplier', category: 'military', min: 0.5, max: 2.0 },
    { key: 'population_growth_mult', name: 'Population Growth Multiplier', category: 'social', min: 0.5, max: 1.5 },
    { key: 'approval_rating_mult', name: 'Approval Rating Multiplier', category: 'social', min: 0.5, max: 1.5 },
    { key: 'infrastructure_efficiency', name: 'Infrastructure Efficiency', category: 'infrastructure', min: 0.5, max: 1.5 },
    { key: 'trade_income_mult', name: 'Trade Income Multiplier', category: 'economic', min: 0.5, max: 2.0 },
    { key: 'environmental_quality', name: 'Environmental Quality', category: 'environmental', min: 0.0, max: 1.0 },
    { key: 'education_quality', name: 'Education Quality', category: 'education', min: 0.0, max: 1.0 }
  ],
  policyTemplates: [
    {
      id: 'universal_basic_income',
      title: 'Universal Basic Income',
      category: 'social',
      description: 'Provide guaranteed income to all citizens',
      baseModifiers: { tax_rate: 0.15, approval_rating_mult: 1.2, population_growth_mult: 1.1 },
      requirements: { economicOutput: 1000000, approvalRating: 60 }
    },
    {
      id: 'research_acceleration',
      title: 'Research Acceleration Program',
      category: 'research',
      description: 'Massive investment in scientific research and development',
      baseModifiers: { research_rate_mult: 1.5, tax_rate: 0.08 },
      requirements: { researchOutput: 5000, educationQuality: 70 }
    },
    {
      id: 'military_expansion',
      title: 'Military Expansion Initiative',
      category: 'military',
      description: 'Strengthen defense capabilities and military presence',
      baseModifiers: { military_strength_mult: 1.3, tax_rate: 0.12, approval_rating_mult: 0.9 },
      requirements: { militaryStrength: 1000, approvalRating: 50 }
    },
    {
      id: 'green_economy',
      title: 'Green Economy Transition',
      category: 'environmental',
      description: 'Shift towards sustainable and environmentally friendly practices',
      baseModifiers: { environmental_quality: 0.8, production_rate_mult: 0.95, approval_rating_mult: 1.1 },
      requirements: { environmentalQuality: 40, economicOutput: 500000 }
    },
    {
      id: 'free_education',
      title: 'Free Education for All',
      category: 'education',
      description: 'Provide free education from primary to university level',
      baseModifiers: { education_quality: 0.9, tax_rate: 0.1, research_rate_mult: 1.2 },
      requirements: { educationQuality: 50, economicOutput: 750000 }
    }
  ],
  globalPolicyCounter: 1,
  policyHistory: [],
  aiSuggestions: []
};

function initializePolicySystem() {
  // Create some initial policies
  const initialPolicies = [
    {
      id: 'pol_1',
      title: 'Economic Stimulus Package',
      body: 'Comprehensive economic stimulus to boost production and create jobs across all sectors',
      category: 'economic',
      scope: 'galactic',
      status: 'active',
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      modifiers: { production_rate_mult: 1.05, tax_rate: 0.08 },
      impact: { economicGrowth: 0.03, jobsCreated: 15000, approvalChange: 5 },
      author: 'Economic Council',
      votes: { for: 85, against: 15, abstain: 0 }
    },
    {
      id: 'pol_2',
      title: 'Research Excellence Initiative',
      body: 'Increased funding for scientific research and technology development programs',
      category: 'research',
      scope: 'galactic',
      status: 'active',
      created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      modifiers: { research_rate_mult: 1.15, tax_rate: 0.05 },
      impact: { researchBoost: 0.15, innovationIndex: 12, approvalChange: 8 },
      author: 'Science Ministry',
      votes: { for: 92, against: 8, abstain: 0 }
    },
    {
      id: 'pol_3',
      title: 'Infrastructure Modernization',
      body: 'Large-scale infrastructure upgrades across all star systems and colonies',
      category: 'infrastructure',
      scope: 'galactic',
      status: 'proposed',
      created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      modifiers: { infrastructure_efficiency: 1.2, tax_rate: 0.12 },
      impact: { infrastructureImprovement: 0.2, jobsCreated: 25000, approvalChange: 3 },
      author: 'Infrastructure Department',
      votes: { for: 0, against: 0, abstain: 0 }
    }
  ];

  policyGameState.policies = initialPolicies;
  policyGameState.activeModifiers = initialPolicies
    .filter(p => p.status === 'active')
    .flatMap(p => Object.entries(p.modifiers).map(([key, value]) => ({
      key,
      value,
      policyId: p.id,
      policyTitle: p.title
    })));

  console.log(`Policy system initialized with ${policyGameState.policies.length} policies`);
}

function createPolicy(policyData) {
  const policy = {
    id: `pol_${policyGameState.globalPolicyCounter++}`,
    title: policyData.title || 'Untitled Policy',
    body: policyData.body || '',
    category: policyData.category || 'general',
    scope: policyData.scope || 'galactic',
    status: policyData.status || 'proposed',
    created: new Date(),
    modifiers: policyData.modifiers || {},
    impact: policyData.impact || {},
    author: policyData.author || 'Unknown',
    votes: policyData.votes || { for: 0, against: 0, abstain: 0 },
    requirements: policyData.requirements || {},
    duration: policyData.duration || 'permanent',
    priority: policyData.priority || 'medium'
  };

  return policy;
}

function inferSuggestionsFromBody(body) {
  const text = (body || '').toLowerCase();
  const suggestions = {};
  
  // Economic keywords
  if (text.includes('tax') || text.includes('revenue')) {
    suggestions.tax_rate = Math.random() * 0.1 + 0.05; // 5-15%
  }
  if (text.includes('production') || text.includes('manufacturing')) {
    suggestions.production_rate_mult = Math.random() * 0.2 + 1.05; // 1.05-1.25x
  }
  if (text.includes('trade') || text.includes('commerce')) {
    suggestions.trade_income_mult = Math.random() * 0.3 + 1.1; // 1.1-1.4x
  }
  
  // Research keywords
  if (text.includes('research') || text.includes('science') || text.includes('innovation')) {
    suggestions.research_rate_mult = Math.random() * 0.4 + 1.1; // 1.1-1.5x
  }
  if (text.includes('education') || text.includes('university') || text.includes('school')) {
    suggestions.education_quality = Math.random() * 0.2 + 0.7; // 0.7-0.9
  }
  
  // Military keywords
  if (text.includes('military') || text.includes('defense') || text.includes('security')) {
    suggestions.military_strength_mult = Math.random() * 0.3 + 1.1; // 1.1-1.4x
  }
  
  // Social keywords
  if (text.includes('welfare') || text.includes('social') || text.includes('citizen')) {
    suggestions.approval_rating_mult = Math.random() * 0.2 + 1.05; // 1.05-1.25x
  }
  if (text.includes('population') || text.includes('growth') || text.includes('immigration')) {
    suggestions.population_growth_mult = Math.random() * 0.2 + 1.05; // 1.05-1.25x
  }
  
  // Environmental keywords
  if (text.includes('environment') || text.includes('green') || text.includes('sustainable')) {
    suggestions.environmental_quality = Math.random() * 0.3 + 0.6; // 0.6-0.9
  }
  
  // Infrastructure keywords
  if (text.includes('infrastructure') || text.includes('construction') || text.includes('building')) {
    suggestions.infrastructure_efficiency = Math.random() * 0.2 + 1.1; // 1.1-1.3
  }
  
  // Default suggestion if no keywords found
  if (Object.keys(suggestions).length === 0) {
    suggestions.production_rate_mult = 1.02; // Small production boost
  }
  
  return suggestions;
}

function activatePolicy(policyId) {
  const policy = policyGameState.policies.find(p => p.id === policyId);
  if (!policy) return null;
  
  policy.status = 'active';
  policy.activated = new Date();
  
  // Add modifiers to active list
  const newModifiers = Object.entries(policy.modifiers).map(([key, value]) => ({
    key,
    value,
    policyId: policy.id,
    policyTitle: policy.title
  }));
  
  policyGameState.activeModifiers.push(...newModifiers);
  
  // Log to history
  policyGameState.policyHistory.push({
    action: 'activate',
    policyId: policy.id,
    policyTitle: policy.title,
    timestamp: new Date(),
    impact: policy.impact
  });
  
  return policy;
}

function deactivatePolicy(policyId) {
  const policy = policyGameState.policies.find(p => p.id === policyId);
  if (!policy) return null;
  
  policy.status = 'inactive';
  policy.deactivated = new Date();
  
  // Remove modifiers from active list
  policyGameState.activeModifiers = policyGameState.activeModifiers.filter(
    m => m.policyId !== policyId
  );
  
  // Log to history
  policyGameState.policyHistory.push({
    action: 'deactivate',
    policyId: policy.id,
    policyTitle: policy.title,
    timestamp: new Date()
  });
  
  return policy;
}

function generateAIPolicyRecommendations(gameState) {
  const recommendations = [];
  
  // Analyze current game state and suggest policies
  if (gameState.economicOutput < 500000) {
    recommendations.push({
      id: 'ai_rec_1',
      title: 'Economic Recovery Plan',
      category: 'economic',
      priority: 'high',
      reasoning: 'Economic output is below optimal levels',
      suggestedModifiers: { production_rate_mult: 1.15, tax_rate: 0.06 },
      estimatedImpact: { economicGrowth: 0.08, jobsCreated: 20000 }
    });
  }
  
  if (gameState.approvalRating < 60) {
    recommendations.push({
      id: 'ai_rec_2',
      title: 'Citizen Satisfaction Initiative',
      category: 'social',
      priority: 'high',
      reasoning: 'Approval rating needs improvement',
      suggestedModifiers: { approval_rating_mult: 1.2, tax_rate: -0.02 },
      estimatedImpact: { approvalChange: 15, socialStability: 0.1 }
    });
  }
  
  if (gameState.researchOutput < 10000) {
    recommendations.push({
      id: 'ai_rec_3',
      title: 'Innovation Boost Program',
      category: 'research',
      priority: 'medium',
      reasoning: 'Research output could be enhanced for competitive advantage',
      suggestedModifiers: { research_rate_mult: 1.3, education_quality: 0.8 },
      estimatedImpact: { researchBoost: 0.25, innovationIndex: 18 }
    });
  }
  
  return recommendations;
}

function simulatePolicyImpact(policy, gameState) {
  const impact = {};
  
  Object.entries(policy.modifiers).forEach(([key, value]) => {
    switch (key) {
      case 'production_rate_mult':
        impact.economicGrowth = (value - 1) * 0.5; // 50% of multiplier becomes growth
        impact.jobsCreated = Math.floor((value - 1) * 50000);
        break;
      case 'research_rate_mult':
        impact.researchBoost = (value - 1) * 0.8;
        impact.innovationIndex = Math.floor((value - 1) * 100);
        break;
      case 'tax_rate':
        impact.governmentRevenue = value * gameState.economicOutput * 0.1;
        impact.approvalChange = -value * 100; // Higher taxes reduce approval
        break;
      case 'military_strength_mult':
        impact.defenseCapability = (value - 1) * 0.6;
        impact.securityIndex = Math.floor((value - 1) * 80);
        break;
      case 'approval_rating_mult':
        impact.approvalChange = (value - 1) * 50;
        impact.socialStability = (value - 1) * 0.3;
        break;
    }
  });
  
  return impact;
}

function getPolicyAnalytics() {
  const analytics = {
    totalPolicies: policyGameState.policies.length,
    activePolicies: policyGameState.policies.filter(p => p.status === 'active').length,
    proposedPolicies: policyGameState.policies.filter(p => p.status === 'proposed').length,
    inactivePolicies: policyGameState.policies.filter(p => p.status === 'inactive').length,
    categoryBreakdown: {},
    activeModifiers: policyGameState.activeModifiers.length,
    recentActivity: policyGameState.policyHistory.slice(-10)
  };
  
  // Calculate category breakdown
  policyGameState.policyCategories.forEach(category => {
    analytics.categoryBreakdown[category] = policyGameState.policies.filter(
      p => p.category === category
    ).length;
  });
  
  return analytics;
}

// Initialize the policy system
initializePolicySystem();

module.exports = {
  policyGameState,
  createPolicy,
  inferSuggestionsFromBody,
  activatePolicy,
  deactivatePolicy,
  generateAIPolicyRecommendations,
  simulatePolicyImpact,
  getPolicyAnalytics,
  initializePolicySystem
};

