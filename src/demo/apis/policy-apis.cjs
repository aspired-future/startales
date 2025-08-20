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
}

module.exports = { setupPolicyAPIs };

