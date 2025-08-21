const { 
  policyGameState, 
  createPolicy, 
  inferSuggestionsFromBody, 
  activatePolicy, 
  deactivatePolicy, 
  generateAIPolicyRecommendations, 
  simulatePolicyImpact, 
  getPolicyAnalytics 
} = require('../game-state/policy-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const policyKnobsData = {
  // Policy Development
  policy_innovation_rate: 0.6,        // AI can accelerate policy development (0.0-1.0)
  evidence_based_policy: 0.8,         // AI can prioritize data-driven policies (0.0-1.0)
  stakeholder_consultation: 0.7,      // AI can increase consultation levels (0.0-1.0)
  policy_experimentation: 0.5,        // AI can enable policy pilots (0.0-1.0)
  
  // Implementation Focus
  implementation_speed: 0.6,           // AI can adjust rollout speed (0.0-1.0)
  enforcement_strictness: 0.5,         // AI can set enforcement levels (0.0-1.0)
  compliance_monitoring: 0.7,          // AI can enhance monitoring (0.0-1.0)
  adaptation_flexibility: 0.6,         // AI can allow policy adjustments (0.0-1.0)
  
  // Political Considerations
  bipartisan_approach: 0.5,            // AI can seek cross-party support (0.0-1.0)
  public_communication: 0.7,           // AI can improve policy communication (0.0-1.0)
  interest_group_balance: 0.6,         // AI can balance competing interests (0.0-1.0)
  
  // Policy Categories (Priority Weighting)
  economic_policy_priority: 0.7,       // AI can prioritize economic policies (0.0-1.0)
  social_policy_priority: 0.6,         // AI can prioritize social policies (0.0-1.0)
  environmental_policy_priority: 0.8,  // AI can prioritize environmental policies (0.0-1.0)
  security_policy_priority: 0.5,       // AI can prioritize security policies (0.0-1.0)
  technology_policy_priority: 0.7,     // AI can prioritize tech policies (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const policyKnobSystem = new EnhancedKnobSystem(policyKnobsData);

// Backward compatibility - expose knobs directly
const policyKnobs = policyKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generatePolicyStructuredOutputs() {
  const policies = [...policyGameState.policies];
  const activePolicies = policies.filter(p => p.status === 'active');
  const pendingPolicies = policies.filter(p => p.status === 'pending');
  
  return {
    // High-level metrics for AI decision-making
    policy_metrics: {
      total_policies: policies.length,
      active_policies: activePolicies.length,
      pending_policies: pendingPolicies.length,
      policy_effectiveness_avg: calculateAveragePolicyEffectiveness(),
      implementation_success_rate: calculateImplementationSuccessRate(),
      public_approval_avg: calculateAveragePublicApproval(),
      policy_innovation_index: calculatePolicyInnovationIndex()
    },
    
    // Policy analysis for AI strategic planning
    policy_analysis: {
      category_distribution: analyzeCategoryDistribution(),
      effectiveness_by_category: analyzeEffectivenessByCategory(),
      implementation_bottlenecks: identifyImplementationBottlenecks(),
      stakeholder_satisfaction: analyzeStakeholderSatisfaction(),
      policy_conflicts: identifyPolicyConflicts()
    },
    
    // Policy impact assessment for AI feedback
    impact_assessment: {
      economic_impact: assessEconomicPolicyImpact(),
      social_impact: assessSocialPolicyImpact(),
      environmental_impact: assessEnvironmentalPolicyImpact(),
      political_capital_usage: assessPoliticalCapitalUsage(),
      unintended_consequences: identifyUnintendedConsequences()
    },
    
    // Policy alerts and recommendations for AI attention
    ai_alerts: generatePolicyAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      regulatory_framework: calculateRegulatoryFramework(),
      compliance_requirements: calculateComplianceRequirements(),
      policy_stability_index: calculatePolicyStabilityIndex(),
      governance_efficiency: calculateGovernanceEfficiency(),
      democratic_legitimacy: calculateDemocraticLegitimacy()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...policyKnobs }
  };
}

function setupPolicyAPIs(app) {
  // Get all policies
  app.get('/api/policies', (req, res) => {
    const { status, category, limit = 50 } = req.query;
    
    let filteredPolicies = [...policyGameState.policies];
    
    if (status) {
      filteredPolicies = filteredPolicies.filter(p => p.status === status);
    }
    
    if (category) {
      filteredPolicies = filteredPolicies.filter(p => p.category === category);
    }
    
    // Sort by creation date (newest first)
    filteredPolicies.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    // Apply limit
    filteredPolicies = filteredPolicies.slice(0, parseInt(limit));
    
    res.json({
      policies: filteredPolicies,
      total: policyGameState.policies.length,
      filtered: filteredPolicies.length
    });
  });

  // Get specific policy
  app.get('/api/policies/:policyId', (req, res) => {
    const policy = policyGameState.policies.find(p => p.id === req.params.policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    
    res.json(policy);
  });

  // Create new policy
  app.post('/api/policies', (req, res) => {
    try {
      const { title, body, category, scope, author } = req.body;
      
      if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
      }
      
      const suggestions = inferSuggestionsFromBody(body);
      
      const policyData = {
        title,
        body,
        category: category || 'general',
        scope: scope || 'galactic',
        author: author || 'Policy Department',
        modifiers: suggestions
      };
      
      const policy = createPolicy(policyData);
      policyGameState.policies.unshift(policy);
      
      res.status(201).json({
        policy,
        suggestions,
        message: 'Policy created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create policy', details: error.message });
    }
  });

  // Update policy
  app.put('/api/policies/:policyId', (req, res) => {
    const policy = policyGameState.policies.find(p => p.id === req.params.policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    
    const { title, body, category, scope, modifiers, priority } = req.body;
    
    if (title) policy.title = title;
    if (body) {
      policy.body = body;
      // Re-generate suggestions based on new body
      policy.modifiers = { ...policy.modifiers, ...inferSuggestionsFromBody(body) };
    }
    if (category) policy.category = category;
    if (scope) policy.scope = scope;
    if (modifiers) policy.modifiers = { ...policy.modifiers, ...modifiers };
    if (priority) policy.priority = priority;
    
    policy.lastModified = new Date();
    
    res.json({
      policy,
      message: 'Policy updated successfully'
    });
  });

  // Delete policy
  app.delete('/api/policies/:policyId', (req, res) => {
    const policyIndex = policyGameState.policies.findIndex(p => p.id === req.params.policyId);
    if (policyIndex === -1) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    
    const policy = policyGameState.policies[policyIndex];
    
    // If policy is active, deactivate it first
    if (policy.status === 'active') {
      deactivatePolicy(policy.id);
    }
    
    policyGameState.policies.splice(policyIndex, 1);
    
    res.json({
      message: 'Policy deleted successfully',
      deletedPolicy: policy
    });
  });

  // Activate policy
  app.post('/api/policies/:policyId/activate', (req, res) => {
    try {
      const policy = activatePolicy(req.params.policyId);
      if (!policy) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      
      res.json({
        policy,
        activeModifiers: policyGameState.activeModifiers,
        message: `Policy "${policy.title}" activated successfully`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to activate policy', details: error.message });
    }
  });

  // Deactivate policy
  app.post('/api/policies/:policyId/deactivate', (req, res) => {
    try {
      const policy = deactivatePolicy(req.params.policyId);
      if (!policy) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      
      res.json({
        policy,
        activeModifiers: policyGameState.activeModifiers,
        message: `Policy "${policy.title}" deactivated successfully`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to deactivate policy', details: error.message });
    }
  });

  // Get active modifiers
  app.get('/api/policies/active', (req, res) => {
    res.json({
      modifiers: policyGameState.activeModifiers,
      count: policyGameState.activeModifiers.length,
      activePolicies: policyGameState.policies.filter(p => p.status === 'active')
    });
  });

  // Set active modifiers (for manual override)
  app.post('/api/policies/activate', (req, res) => {
    try {
      const { modifiers = [] } = req.body;
      
      const parsed = Array.isArray(modifiers)
        ? modifiers.map((m) => ({
            key: String(m.key),
            value: Number(m.value),
            capMin: m.capMin ?? null,
            capMax: m.capMax ?? null,
            policyId: m.policyId || 'manual',
            policyTitle: m.policyTitle || 'Manual Override'
          }))
        : [];
      
      policyGameState.activeModifiers = parsed;
      
      res.json({
        success: true,
        modifiers: policyGameState.activeModifiers,
        message: 'Active modifiers updated successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update modifiers', details: error.message });
    }
  });

  // Get policy categories and types
  app.get('/api/policies/metadata', (req, res) => {
    res.json({
      categories: policyGameState.policyCategories,
      policyTypes: policyGameState.policyTypes,
      modifierTypes: policyGameState.modifierTypes,
      templates: policyGameState.policyTemplates
    });
  });

  // Get AI policy recommendations
  app.post('/api/policies/recommendations', (req, res) => {
    try {
      const gameState = req.body.gameState || {
        economicOutput: 750000,
        approvalRating: 65,
        researchOutput: 8500,
        militaryStrength: 1200
      };
      
      const recommendations = generateAIPolicyRecommendations(gameState);
      
      res.json({
        recommendations,
        count: recommendations.length,
        gameState,
        message: 'AI recommendations generated successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate recommendations', details: error.message });
    }
  });

  // Simulate policy impact
  app.post('/api/policies/:policyId/simulate', (req, res) => {
    try {
      const policy = policyGameState.policies.find(p => p.id === req.params.policyId);
      if (!policy) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      
      const gameState = req.body.gameState || {
        economicOutput: 750000,
        approvalRating: 65,
        researchOutput: 8500,
        militaryStrength: 1200
      };
      
      const impact = simulatePolicyImpact(policy, gameState);
      
      res.json({
        policy: {
          id: policy.id,
          title: policy.title,
          category: policy.category
        },
        currentGameState: gameState,
        simulatedImpact: impact,
        modifiers: policy.modifiers,
        message: 'Policy impact simulation completed'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to simulate policy impact', details: error.message });
    }
  });

  // Get policy analytics
  app.get('/api/policies/analytics', (req, res) => {
    try {
      const analytics = getPolicyAnalytics();
      
      res.json({
        analytics,
        timestamp: new Date(),
        message: 'Policy analytics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get analytics', details: error.message });
    }
  });

  // Vote on policy
  app.post('/api/policies/:policyId/vote', (req, res) => {
    try {
      const policy = policyGameState.policies.find(p => p.id === req.params.policyId);
      if (!policy) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      
      const { vote, voter } = req.body; // vote: 'for', 'against', 'abstain'
      
      if (!['for', 'against', 'abstain'].includes(vote)) {
        return res.status(400).json({ error: 'Invalid vote. Must be "for", "against", or "abstain"' });
      }
      
      // Record the vote
      policy.votes[vote] += 1;
      
      // Log the vote
      if (!policy.voteHistory) policy.voteHistory = [];
      policy.voteHistory.push({
        vote,
        voter: voter || 'Anonymous',
        timestamp: new Date()
      });
      
      // Calculate vote percentages
      const totalVotes = policy.votes.for + policy.votes.against + policy.votes.abstain;
      const votePercentages = {
        for: totalVotes > 0 ? (policy.votes.for / totalVotes * 100).toFixed(1) : 0,
        against: totalVotes > 0 ? (policy.votes.against / totalVotes * 100).toFixed(1) : 0,
        abstain: totalVotes > 0 ? (policy.votes.abstain / totalVotes * 100).toFixed(1) : 0
      };
      
      res.json({
        policy: {
          id: policy.id,
          title: policy.title,
          votes: policy.votes,
          votePercentages
        },
        message: `Vote "${vote}" recorded successfully`,
        totalVotes
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to record vote', details: error.message });
    }
  });

  // Get policy history
  app.get('/api/policies/history', (req, res) => {
    const { limit = 20 } = req.query;
    
    const history = policyGameState.policyHistory
      .slice(-parseInt(limit))
      .reverse(); // Most recent first
    
    res.json({
      history,
      total: policyGameState.policyHistory.length,
      returned: history.length
    });
  });

  // Create policy from template
  app.post('/api/policies/from-template/:templateId', (req, res) => {
    try {
      const template = policyGameState.policyTemplates.find(t => t.id === req.params.templateId);
      if (!template) {
        return res.status(404).json({ error: 'Policy template not found' });
      }
      
      const { customizations = {} } = req.body;
      
      const policyData = {
        title: customizations.title || template.title,
        body: customizations.body || template.description,
        category: template.category,
        scope: customizations.scope || 'galactic',
        author: customizations.author || 'Policy Department',
        modifiers: { ...template.baseModifiers, ...customizations.modifiers },
        requirements: template.requirements,
        priority: customizations.priority || 'medium'
      };
      
      const policy = createPolicy(policyData);
      policyGameState.policies.unshift(policy);
      
      res.status(201).json({
        policy,
        template: template,
        message: `Policy created from template "${template.title}"`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create policy from template', details: error.message });
    }
  });

  // Helper functions for policy structured outputs (streamlined)
  function calculateAveragePolicyEffectiveness() {
    const policies = [...policyGameState.policies];
    const activePolicies = policies.filter(p => p.status === 'active');
    return activePolicies.reduce((sum, p) => sum + (p.effectiveness || 0.5), 0) / activePolicies.length || 0.5;
  }

  function calculateImplementationSuccessRate() {
    const policies = [...policyGameState.policies];
    const implementedPolicies = policies.filter(p => p.status === 'active' || p.status === 'completed');
    return policies.length > 0 ? implementedPolicies.length / policies.length : 0.5;
  }

  function calculateAveragePublicApproval() {
    const policies = [...policyGameState.policies];
    return policies.reduce((sum, p) => sum + (p.publicApproval || 50), 0) / policies.length / 100 || 0.5;
  }

  function calculatePolicyInnovationIndex() {
    return policyKnobs.policy_innovation_rate * policyKnobs.evidence_based_policy * policyKnobs.policy_experimentation;
  }

  function analyzeCategoryDistribution() {
    const policies = [...policyGameState.policies];
    const distribution = {};
    policies.forEach(p => {
      distribution[p.category] = (distribution[p.category] || 0) + 1;
    });
    return distribution;
  }

  function analyzeEffectivenessByCategory() {
    const policies = [...policyGameState.policies];
    const categories = {};
    policies.forEach(p => {
      if (!categories[p.category]) categories[p.category] = { total: 0, effectiveness: 0 };
      categories[p.category].total++;
      categories[p.category].effectiveness += (p.effectiveness || 0.5);
    });
    
    Object.keys(categories).forEach(cat => {
      categories[cat].avg_effectiveness = categories[cat].effectiveness / categories[cat].total;
    });
    return categories;
  }

  function identifyImplementationBottlenecks() {
    const bottlenecks = [];
    if (policyKnobs.implementation_speed < 0.4) bottlenecks.push('slow_implementation');
    if (policyKnobs.enforcement_strictness < 0.3) bottlenecks.push('weak_enforcement');
    if (policyKnobs.compliance_monitoring < 0.5) bottlenecks.push('poor_monitoring');
    return bottlenecks;
  }

  function analyzeStakeholderSatisfaction() {
    const consultation = policyKnobs.stakeholder_consultation;
    const balance = policyKnobs.interest_group_balance;
    const communication = policyKnobs.public_communication;
    return { consultation_level: consultation, interest_balance: balance, communication_quality: communication };
  }

  function identifyPolicyConflicts() {
    const policies = [...policyGameState.policies].filter(p => p.status === 'active');
    const conflicts = policies.filter(p => p.conflicts && p.conflicts.length > 0).length;
    return { conflicting_policies: conflicts, conflict_rate: policies.length > 0 ? conflicts / policies.length : 0 };
  }

  function assessEconomicPolicyImpact() {
    const policies = [...policyGameState.policies].filter(p => p.category === 'economic');
    const priority = policyKnobs.economic_policy_priority;
    const avgEffectiveness = policies.reduce((sum, p) => sum + (p.effectiveness || 0.5), 0) / policies.length || 0.5;
    return { policy_count: policies.length, priority_weight: priority, impact_score: priority * avgEffectiveness };
  }

  function assessSocialPolicyImpact() {
    const policies = [...policyGameState.policies].filter(p => p.category === 'social');
    const priority = policyKnobs.social_policy_priority;
    const avgEffectiveness = policies.reduce((sum, p) => sum + (p.effectiveness || 0.5), 0) / policies.length || 0.5;
    return { policy_count: policies.length, priority_weight: priority, impact_score: priority * avgEffectiveness };
  }

  function assessEnvironmentalPolicyImpact() {
    const policies = [...policyGameState.policies].filter(p => p.category === 'environmental');
    const priority = policyKnobs.environmental_policy_priority;
    const avgEffectiveness = policies.reduce((sum, p) => sum + (p.effectiveness || 0.5), 0) / policies.length || 0.5;
    return { policy_count: policies.length, priority_weight: priority, impact_score: priority * avgEffectiveness };
  }

  function assessPoliticalCapitalUsage() {
    const policies = [...policyGameState.policies];
    const controversialPolicies = policies.filter(p => (p.publicApproval || 50) < 40).length;
    const bipartisan = policyKnobs.bipartisan_approach;
    return { controversial_policies: controversialPolicies, bipartisan_approach: bipartisan, capital_efficiency: bipartisan * 0.8 };
  }

  function identifyUnintendedConsequences() {
    const policies = [...policyGameState.policies];
    const problematicPolicies = policies.filter(p => p.unintendedEffects && p.unintendedEffects.length > 0).length;
    return { policies_with_issues: problematicPolicies, issue_rate: policies.length > 0 ? problematicPolicies / policies.length : 0 };
  }

  function generatePolicyAIAlerts() {
    const alerts = [];
    const policies = [...policyGameState.policies];
    
    // Policy effectiveness alert
    const avgEffectiveness = calculateAveragePolicyEffectiveness();
    if (avgEffectiveness < 0.4) {
      alerts.push({ type: 'low_effectiveness', severity: 'high', message: 'Policy effectiveness below acceptable levels' });
    }
    
    // Implementation bottleneck alert
    if (policyKnobs.implementation_speed < 0.3) {
      alerts.push({ type: 'implementation_crisis', severity: 'high', message: 'Critical implementation speed issues detected' });
    }
    
    // Public approval alert
    const avgApproval = calculateAveragePublicApproval();
    if (avgApproval < 0.3) {
      alerts.push({ type: 'public_disapproval', severity: 'medium', message: 'Low public approval for current policies' });
    }
    
    return alerts;
  }

  function calculateRegulatoryFramework() {
    const policies = [...policyGameState.policies].filter(p => p.status === 'active');
    const regulatoryPolicies = policies.filter(p => p.type === 'regulation' || p.category === 'regulatory').length;
    return { total_regulations: regulatoryPolicies, framework_strength: regulatoryPolicies / 20 }; // Normalized
  }

  function calculateComplianceRequirements() {
    const enforcement = policyKnobs.enforcement_strictness;
    const monitoring = policyKnobs.compliance_monitoring;
    return { enforcement_level: enforcement, monitoring_intensity: monitoring, compliance_burden: enforcement * monitoring };
  }

  function calculatePolicyStabilityIndex() {
    const flexibility = policyKnobs.adaptation_flexibility;
    const bipartisan = policyKnobs.bipartisan_approach;
    return { stability_score: (1 - flexibility) * bipartisan, adaptability: flexibility };
  }

  function calculateGovernanceEfficiency() {
    const speed = policyKnobs.implementation_speed;
    const effectiveness = calculateAveragePolicyEffectiveness();
    const innovation = policyKnobs.policy_innovation_rate;
    return { efficiency_index: (speed + effectiveness + innovation) / 3 };
  }

  function calculateDemocraticLegitimacy() {
    const consultation = policyKnobs.stakeholder_consultation;
    const communication = policyKnobs.public_communication;
    const approval = calculateAveragePublicApproval();
    return { legitimacy_score: (consultation + communication + approval) / 3 };
  }

  // Apply AI knobs to actual policy game state
  function applyPolicyKnobsToGameState() {
    const policies = [...policyGameState.policies];
    
    // Apply policy innovation rate to new policy generation
    if (policyKnobs.policy_innovation_rate > 0.7) {
      // High innovation increases policy effectiveness
      policies.forEach(policy => {
        if (policy.status === 'pending' || policy.status === 'draft') {
          const innovationBonus = (policyKnobs.policy_innovation_rate - 0.7) * 0.3;
          policy.effectiveness = Math.min(1.0, (policy.effectiveness || 0.5) + innovationBonus);
        }
      });
    }
    
    // Apply evidence-based policy approach
    if (policyKnobs.evidence_based_policy > 0.6) {
      policies.forEach(policy => {
        const evidenceBonus = (policyKnobs.evidence_based_policy - 0.6) * 0.25;
        policy.effectiveness = Math.min(1.0, (policy.effectiveness || 0.5) + evidenceBonus);
      });
    }
    
    // Apply stakeholder consultation to public approval
    policies.forEach(policy => {
      const consultationBonus = policyKnobs.stakeholder_consultation * 20; // Up to 20 points
      policy.publicApproval = Math.min(100, (policy.publicApproval || 50) + consultationBonus);
    });
    
    // Apply implementation speed to policy status transitions
    const speedMultiplier = policyKnobs.implementation_speed;
    policies.forEach(policy => {
      if (policy.status === 'pending' && speedMultiplier > 0.8) {
        // Fast implementation - some pending policies become active
        if (Math.random() < 0.3) {
          policy.status = 'active';
          policy.implementationDate = new Date();
        }
      }
    });
    
    // Apply enforcement strictness to policy compliance
    const enforcement = policyKnobs.enforcement_strictness;
    policies.forEach(policy => {
      if (policy.status === 'active') {
        policy.complianceRate = Math.min(1.0, (policy.complianceRate || 0.7) + enforcement * 0.2);
      }
    });
    
    console.log('🎛️ Policy knobs applied to game state:', {
      innovation_rate: policyKnobs.policy_innovation_rate,
      evidence_based: policyKnobs.evidence_based_policy,
      implementation_speed: policyKnobs.implementation_speed,
      enforcement_strictness: policyKnobs.enforcement_strictness
    });
  }

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/policies/knobs', (req, res) => {
    const knobData = policyKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'policy',
      description: 'AI-adjustable parameters for policy system with enhanced input support',
      input_help: policyKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/policies/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: policyKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = policyKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyPolicyKnobsToGameState();
    } catch (error) {
      console.error('Error applying policy knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'policy',
      ...updateResult,
      message: 'Policy knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/policies/knobs/help', (req, res) => {
    res.json({
      system: 'policy',
      help: policyKnobSystem.getKnobDescriptions(),
      current_values: policyKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/policies/ai-data', (req, res) => {
    const structuredData = generatePolicyStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured policy data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/policies/cross-system', (req, res) => {
    const outputs = generatePolicyStructuredOutputs();
    res.json({
      regulatory_data: outputs.cross_system_data.regulatory_framework,
      compliance_data: outputs.cross_system_data.compliance_requirements,
      stability_data: outputs.cross_system_data.policy_stability_index,
      governance_data: outputs.cross_system_data.governance_efficiency,
      legitimacy_data: outputs.cross_system_data.democratic_legitimacy,
      policy_summary: outputs.policy_metrics,
      timestamp: outputs.timestamp
    });
  });
}

module.exports = { setupPolicyAPIs };

