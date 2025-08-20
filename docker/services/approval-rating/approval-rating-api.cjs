const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for demo
const approvalData = {
  currentRating: 72.5,
  trend: 'stable', // 'rising', 'falling', 'stable'
  lastUpdated: new Date().toISOString(),
  historicalData: [
    { date: '2025-08-15', rating: 68.2, event: 'Economic Policy Reform' },
    { date: '2025-08-16', rating: 71.1, event: 'Trade Agreement Signed' },
    { date: '2025-08-17', rating: 69.8, event: 'Military Budget Increase' },
    { date: '2025-08-18', rating: 73.2, event: 'Healthcare Initiative Launch' },
    { date: '2025-08-19', rating: 72.5, event: 'Environmental Protection Act' }
  ],
  demographics: {
    byAge: {
      '18-25': 68.3,
      '26-35': 74.1,
      '36-50': 73.8,
      '51-65': 71.2,
      '65+': 69.5
    },
    byCivilization: {
      'Terran Federation': 75.2,
      'Centauri Republic': 69.8,
      'Vegan Collective': 77.1,
      'Sirian Empire': 68.4,
      'Kepler Technocracy': 74.6,
      'Andromedan Alliance': 71.3
    },
    byPlanet: {
      'Earth': 73.8,
      'Mars': 71.2,
      'Europa': 69.5,
      'Centauri Prime': 70.1,
      'Vega Prime': 76.3,
      'Sirius Alpha': 68.9
    },
    byProfession: {
      'Scientists': 78.2,
      'Engineers': 74.5,
      'Traders': 69.1,
      'Military': 71.8,
      'Artists': 73.6,
      'Farmers': 70.3,
      'Miners': 66.7,
      'Pilots': 75.9
    }
  },
  recentFeedback: [
    {
      id: 'fb_001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      rating: 8,
      comment: 'The new healthcare initiative is exactly what we needed! Finally, someone who listens to the people.',
      category: 'Healthcare',
      location: 'Earth - New Geneva',
      anonymous: false,
      citizenId: 'citizen_terra_001',
      citizenName: 'Dr. Sarah Chen'
    },
    {
      id: 'fb_002',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      rating: 6,
      comment: 'Environmental policies are good, but we need more focus on economic growth in the outer colonies.',
      category: 'Economy',
      location: 'Mars - New Olympia',
      anonymous: false,
      citizenId: 'citizen_mars_047',
      citizenName: 'Marcus Rodriguez'
    },
    {
      id: 'fb_003',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      rating: 9,
      comment: 'Best leader we\'ve had in decades! The trade agreements are bringing prosperity to all systems.',
      category: 'Trade',
      location: 'Centauri Prime - Alpha City',
      anonymous: false,
      citizenId: 'citizen_cent_123',
      citizenName: 'Zara Vex'
    },
    {
      id: 'fb_004',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      rating: 4,
      comment: 'Military spending is too high. We should invest more in education and infrastructure.',
      category: 'Military',
      location: 'Vega Prime - Crystal Harbor',
      anonymous: true,
      citizenId: null,
      citizenName: 'Anonymous Citizen'
    },
    {
      id: 'fb_005',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      rating: 7,
      comment: 'Good progress on interstellar relations, but domestic issues need more attention.',
      category: 'Diplomacy',
      location: 'Europa - Ice Station Beta',
      anonymous: false,
      citizenId: 'citizen_europa_089',
      citizenName: 'Commander Lisa Park'
    }
  ],
  activePoll: {
    id: 'poll_2025_08_19',
    question: 'What should be the government\'s top priority for the next quarter?',
    options: [
      { id: 'economy', text: 'Economic Growth & Job Creation', votes: 2847, percentage: 31.2 },
      { id: 'environment', text: 'Environmental Protection', votes: 2156, percentage: 23.6 },
      { id: 'security', text: 'Galactic Security & Defense', votes: 1923, percentage: 21.1 },
      { id: 'healthcare', text: 'Healthcare & Social Services', votes: 1534, percentage: 16.8 },
      { id: 'education', text: 'Education & Research', votes: 672, percentage: 7.3 }
    ],
    totalVotes: 9132,
    startDate: '2025-08-18T00:00:00Z',
    endDate: '2025-08-25T23:59:59Z',
    isActive: true
  },
  policyImpacts: [
    {
      policyId: 'pol_healthcare_001',
      policyName: 'Universal Healthcare Initiative',
      impactScore: +4.2,
      affectedGroups: ['All Citizens', 'Elderly', 'Low Income'],
      timeframe: '2025-08-18',
      description: 'Significant positive impact on approval ratings across all demographics'
    },
    {
      policyId: 'pol_military_002',
      policyName: 'Defense Budget Increase',
      impactScore: -2.1,
      affectedGroups: ['Peace Activists', 'Scientists', 'Artists'],
      timeframe: '2025-08-17',
      description: 'Mixed reactions, with some groups concerned about militarization'
    },
    {
      policyId: 'pol_trade_003',
      policyName: 'Interstellar Trade Agreement',
      impactScore: +3.8,
      affectedGroups: ['Traders', 'Manufacturers', 'Outer Colonies'],
      timeframe: '2025-08-16',
      description: 'Strong positive response from business communities and colonial settlements'
    }
  ]
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'approval-rating-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get current approval rating
app.get('/api/approval/current', (req, res) => {
  res.json({
    rating: approvalData.currentRating,
    trend: approvalData.trend,
    lastUpdated: approvalData.lastUpdated,
    summary: {
      excellent: approvalData.currentRating >= 80 ? 'Excellent leadership approval' :
                approvalData.currentRating >= 70 ? 'Strong public support' :
                approvalData.currentRating >= 60 ? 'Moderate approval rating' :
                approvalData.currentRating >= 50 ? 'Mixed public opinion' : 'Low approval rating',
      recommendation: approvalData.currentRating >= 70 ? 'Continue current policies' :
                     approvalData.currentRating >= 60 ? 'Address citizen concerns' :
                     'Urgent policy review needed'
    }
  });
});

// Get historical approval data
app.get('/api/approval/history', (req, res) => {
  const { days = '7' } = req.query;
  const daysNum = parseInt(days);
  
  const filteredData = approvalData.historicalData.slice(-daysNum);
  
  res.json({
    data: filteredData,
    trend: calculateTrend(filteredData),
    averageRating: filteredData.reduce((sum, item) => sum + item.rating, 0) / filteredData.length
  });
});

// Get demographic breakdown
app.get('/api/approval/demographics', (req, res) => {
  res.json(approvalData.demographics);
});

// Get recent citizen feedback
app.get('/api/approval/feedback', (req, res) => {
  const { limit = '10', category, minRating, maxRating } = req.query;
  const limitNum = Math.min(parseInt(limit) || 10, 50);
  
  let filteredFeedback = [...approvalData.recentFeedback];
  
  if (category && category !== 'all') {
    filteredFeedback = filteredFeedback.filter(fb => 
      fb.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (minRating) {
    filteredFeedback = filteredFeedback.filter(fb => fb.rating >= parseInt(minRating));
  }
  
  if (maxRating) {
    filteredFeedback = filteredFeedback.filter(fb => fb.rating <= parseInt(maxRating));
  }
  
  res.json({
    feedback: filteredFeedback.slice(0, limitNum),
    total: filteredFeedback.length,
    averageRating: filteredFeedback.reduce((sum, fb) => sum + fb.rating, 0) / filteredFeedback.length || 0
  });
});

// Get active poll
app.get('/api/approval/poll', (req, res) => {
  res.json(approvalData.activePoll);
});

// Vote in poll
app.post('/api/approval/poll/vote', (req, res) => {
  const { optionId, citizenId } = req.body;
  
  if (!optionId) {
    return res.status(400).json({ error: 'Option ID is required' });
  }
  
  const option = approvalData.activePoll.options.find(opt => opt.id === optionId);
  if (!option) {
    return res.status(404).json({ error: 'Invalid option' });
  }
  
  // Simulate vote (in real system, would check for duplicate votes)
  option.votes += 1;
  approvalData.activePoll.totalVotes += 1;
  
  // Recalculate percentages
  approvalData.activePoll.options.forEach(opt => {
    opt.percentage = (opt.votes / approvalData.activePoll.totalVotes) * 100;
  });
  
  res.json({
    success: true,
    message: 'Vote recorded successfully',
    poll: approvalData.activePoll
  });
});

// Submit citizen feedback
app.post('/api/approval/feedback', (req, res) => {
  const { rating, comment, category, location, anonymous, citizenId, citizenName } = req.body;
  
  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({ error: 'Rating must be between 1 and 10' });
  }
  
  if (!comment || comment.trim().length < 10) {
    return res.status(400).json({ error: 'Comment must be at least 10 characters' });
  }
  
  const feedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    rating: parseInt(rating),
    comment: comment.trim(),
    category: category || 'General',
    location: location || 'Unknown',
    anonymous: anonymous || false,
    citizenId: anonymous ? null : citizenId,
    citizenName: anonymous ? 'Anonymous Citizen' : citizenName
  };
  
  // Add to recent feedback (keep only latest 50)
  approvalData.recentFeedback.unshift(feedback);
  if (approvalData.recentFeedback.length > 50) {
    approvalData.recentFeedback = approvalData.recentFeedback.slice(0, 50);
  }
  
  // Update approval rating based on feedback (simplified algorithm)
  const impact = (rating - 5.5) * 0.1; // Scale impact
  approvalData.currentRating = Math.max(0, Math.min(100, approvalData.currentRating + impact));
  approvalData.lastUpdated = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Feedback submitted successfully',
    feedback: feedback,
    newApprovalRating: approvalData.currentRating
  });
});

// Get policy impacts
app.get('/api/approval/policy-impacts', (req, res) => {
  res.json({
    impacts: approvalData.policyImpacts,
    summary: {
      totalPolicies: approvalData.policyImpacts.length,
      positiveImpacts: approvalData.policyImpacts.filter(p => p.impactScore > 0).length,
      negativeImpacts: approvalData.policyImpacts.filter(p => p.impactScore < 0).length,
      averageImpact: approvalData.policyImpacts.reduce((sum, p) => sum + p.impactScore, 0) / approvalData.policyImpacts.length
    }
  });
});

// Simulate policy impact
app.post('/api/approval/simulate-policy', (req, res) => {
  const { policyName, policyType, expectedImpact } = req.body;
  
  if (!policyName || !policyType) {
    return res.status(400).json({ error: 'Policy name and type are required' });
  }
  
  // Simulate impact calculation based on policy type
  const baseImpacts = {
    'economic': { base: 2.5, variance: 3.0 },
    'social': { base: 1.8, variance: 2.5 },
    'military': { base: -0.5, variance: 4.0 },
    'environmental': { base: 3.2, variance: 2.0 },
    'healthcare': { base: 4.1, variance: 1.5 },
    'education': { base: 2.8, variance: 2.2 }
  };
  
  const impactData = baseImpacts[policyType.toLowerCase()] || { base: 0, variance: 2.0 };
  const simulatedImpact = impactData.base + (Math.random() - 0.5) * impactData.variance;
  const newRating = Math.max(0, Math.min(100, approvalData.currentRating + simulatedImpact));
  
  res.json({
    policyName,
    policyType,
    currentRating: approvalData.currentRating,
    simulatedImpact: Math.round(simulatedImpact * 10) / 10,
    projectedRating: Math.round(newRating * 10) / 10,
    confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
    recommendation: simulatedImpact > 2 ? 'Highly recommended' :
                   simulatedImpact > 0 ? 'Recommended' :
                   simulatedImpact > -2 ? 'Proceed with caution' : 'Not recommended'
  });
});

// Generate approval report
app.get('/api/approval/report', (req, res) => {
  const report = {
    timestamp: new Date().toISOString(),
    currentRating: approvalData.currentRating,
    trend: approvalData.trend,
    demographics: approvalData.demographics,
    recentFeedback: {
      total: approvalData.recentFeedback.length,
      averageRating: approvalData.recentFeedback.reduce((sum, fb) => sum + fb.rating, 0) / approvalData.recentFeedback.length,
      categories: getCategories(approvalData.recentFeedback)
    },
    activePoll: {
      question: approvalData.activePoll.question,
      totalVotes: approvalData.activePoll.totalVotes,
      leadingOption: approvalData.activePoll.options.reduce((max, opt) => opt.votes > max.votes ? opt : max)
    },
    policyImpacts: {
      recent: approvalData.policyImpacts.slice(-3),
      totalImpact: approvalData.policyImpacts.reduce((sum, p) => sum + p.impactScore, 0)
    },
    recommendations: generateRecommendations(approvalData)
  };
  
  res.json(report);
});

// Helper functions
function calculateTrend(data) {
  if (data.length < 2) return 'stable';
  
  const recent = data.slice(-3);
  const older = data.slice(-6, -3);
  
  const recentAvg = recent.reduce((sum, item) => sum + item.rating, 0) / recent.length;
  const olderAvg = older.reduce((sum, item) => sum + item.rating, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 1) return 'rising';
  if (diff < -1) return 'falling';
  return 'stable';
}

function getCategories(feedback) {
  const categories = {};
  feedback.forEach(fb => {
    if (!categories[fb.category]) {
      categories[fb.category] = { count: 0, averageRating: 0, totalRating: 0 };
    }
    categories[fb.category].count++;
    categories[fb.category].totalRating += fb.rating;
    categories[fb.category].averageRating = categories[fb.category].totalRating / categories[fb.category].count;
  });
  return categories;
}

function generateRecommendations(data) {
  const recommendations = [];
  
  if (data.currentRating < 60) {
    recommendations.push({
      priority: 'high',
      category: 'urgent',
      message: 'Approval rating is critically low. Immediate policy review and public engagement required.'
    });
  }
  
  // Find lowest demographic approval
  const lowestDemo = Object.entries(data.demographics.byCivilization)
    .reduce((min, [civ, rating]) => rating < min.rating ? { civ, rating } : min, { civ: '', rating: 100 });
  
  if (lowestDemo.rating < 65) {
    recommendations.push({
      priority: 'medium',
      category: 'demographic',
      message: `Focus on ${lowestDemo.civ} concerns - approval rating is ${lowestDemo.rating.toFixed(1)}%`
    });
  }
  
  // Check recent feedback trends
  const recentNegative = data.recentFeedback.filter(fb => fb.rating <= 4).length;
  if (recentNegative > data.recentFeedback.length * 0.3) {
    recommendations.push({
      priority: 'medium',
      category: 'feedback',
      message: 'High volume of negative feedback. Consider addressing common citizen concerns.'
    });
  }
  
  return recommendations;
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/approval/current',
      'GET /api/approval/history',
      'GET /api/approval/demographics',
      'GET /api/approval/feedback',
      'GET /api/approval/poll',
      'POST /api/approval/poll/vote',
      'POST /api/approval/feedback',
      'GET /api/approval/policy-impacts',
      'POST /api/approval/simulate-policy',
      'GET /api/approval/report'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🏛️ Approval Rating API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Current rating: http://localhost:${PORT}/api/approval/current`);
  console.log(`💬 Citizen feedback: http://localhost:${PORT}/api/approval/feedback`);
});

