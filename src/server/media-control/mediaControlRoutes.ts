import { Router } from 'express';
import { Pool } from 'pg';
import { MediaControlService } from './MediaControlService.js';
// Simple media control knobs without enhanced system for now
const defaultMediaControlKnobs = {
  // Press Freedom and Control (1-6)
  press_freedom_level: 0.75,
  censorship_intensity: 0.25,
  government_media_influence: 0.30,
  propaganda_effectiveness: 0.50,
  information_transparency: 0.70,
  journalist_safety_protection: 0.80,
  
  // Content and Editorial Control (7-12)
  editorial_independence: 0.65,
  content_diversity_promotion: 0.60,
  fact_checking_enforcement: 0.70,
  misinformation_countermeasures: 0.55,
  investigative_journalism_support: 0.50,
  public_interest_prioritization: 0.60,
  
  // Regulatory and Legal Framework (13-18)
  licensing_strictness: 0.40,
  ownership_concentration_limits: 0.50,
  foreign_media_restrictions: 0.30,
  media_funding_transparency: 0.65,
  regulatory_enforcement_consistency: 0.70,
  appeal_process_fairness: 0.75,
  
  // Crisis and Emergency Powers (19-24)
  emergency_broadcast_authority: 0.60,
  crisis_information_control: 0.45,
  national_security_exemptions: 0.40,
  wartime_media_restrictions: 0.35,
  public_safety_override_authority: 0.50,
  international_media_coordination: 0.45
};

/**
 * Create Media Control API routes
 */
export function createMediaControlRoutes(pool: Pool): Router {
  const router = Router();
  const mediaControlService = new MediaControlService(pool);

  /**
   * Get media control dashboard
   * GET /api/media-control/dashboard/:campaignId
   */
  router.get('/dashboard/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const dashboard = await mediaControlService.getDashboard(campaignId);
      
      res.json({
        success: true,
        data: dashboard,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching media control dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch media control dashboard'
      });
    }
  });

  /**
   * Get media outlets
   * GET /api/media-control/outlets/:campaignId
   */
  router.get('/outlets/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const outlets = await mediaControlService.getMediaOutlets(campaignId);
      
      res.json({
        success: true,
        data: outlets,
        count: outlets.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching media outlets:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch media outlets'
      });
    }
  });

  /**
   * Get media policies
   * GET /api/media-control/policies/:campaignId
   */
  router.get('/policies/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const policies = await mediaControlService.getMediaPolicies(campaignId);
      
      res.json({
        success: true,
        data: policies,
        count: policies.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching media policies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch media policies'
      });
    }
  });

  /**
   * Get censorship logs
   * GET /api/media-control/censorship/:campaignId
   */
  router.get('/censorship/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await mediaControlService.getCensorshipLogs(campaignId, limit);
      
      res.json({
        success: true,
        data: logs,
        count: logs.length,
        limit,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching censorship logs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch censorship logs'
      });
    }
  });

  /**
   * Get propaganda campaigns
   * GET /api/media-control/propaganda/:campaignId
   */
  router.get('/propaganda/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const campaigns = await mediaControlService.getPropagandaCampaigns(campaignId);
      
      res.json({
        success: true,
        data: campaigns,
        count: campaigns.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching propaganda campaigns:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch propaganda campaigns'
      });
    }
  });

  /**
   * Get media control knobs
   * GET /api/media-control/knobs/:campaignId
   */
  router.get('/knobs/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const knobs = await mediaControlService.getMediaControlKnobs(campaignId);
      
      // Simple response with knobs data
      const response = {
        knobs,
        campaign_id: campaignId,
        timestamp: new Date().toISOString()
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching media control knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch media control knobs'
      });
    }
  });

  /**
   * Update media control knobs
   * POST /api/media-control/knobs/:campaignId
   */
  router.post('/knobs/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const updates = req.body;
      
      // Simple processing - just use the updates as-is for now
      const processedUpdates = updates;
      
      await mediaControlService.updateMediaControlKnobs(campaignId, processedUpdates);
      
      // Get updated knobs
      const updatedKnobs = await mediaControlService.getMediaControlKnobs(campaignId);
      
      res.json({
        success: true,
        data: updatedKnobs,
        updated_fields: Object.keys(processedUpdates),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating media control knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update media control knobs'
      });
    }
  });

  /**
   * Analyze media control impact
   * POST /api/media-control/analyze/:campaignId
   */
  router.post('/analyze/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const { scenario, parameters } = req.body;
      
      // Get current state
      const dashboard = await mediaControlService.getDashboard(campaignId);
      const knobs = await mediaControlService.getMediaControlKnobs(campaignId);
      
      // Simulate impact of changes
      const analysis = {
        scenario,
        current_state: {
          press_freedom: dashboard.pressFreedomMetrics.currentLevel,
          public_trust: dashboard.controlEffectiveness.publicTrustInMedia,
          international_standing: dashboard.pressFreedomMetrics.internationalRanking
        },
        projected_impact: {
          press_freedom_change: calculatePressFreedomImpact(parameters, knobs),
          public_opinion_change: calculatePublicOpinionImpact(parameters, knobs),
          international_relations_change: calculateInternationalImpact(parameters, knobs),
          economic_impact: calculateEconomicImpact(parameters, knobs),
          democratic_stability: calculateDemocraticImpact(parameters, knobs)
        },
        recommendations: generateRecommendations(parameters, knobs, dashboard),
        risks: identifyRisks(parameters, knobs),
        timeline: estimateTimeline(parameters)
      };
      
      res.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error analyzing media control impact:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze media control impact'
      });
    }
  });

  /**
   * Get media freedom report
   * GET /api/media-control/freedom-report/:campaignId
   */
  router.get('/freedom-report/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      
      const dashboard = await mediaControlService.getDashboard(campaignId);
      const outlets = await mediaControlService.getMediaOutlets(campaignId);
      const policies = await mediaControlService.getMediaPolicies(campaignId);
      const censorship = await mediaControlService.getCensorshipLogs(campaignId, 100);
      
      const report = {
        executive_summary: {
          overall_freedom_score: dashboard.pressFreedomMetrics.currentLevel,
          international_ranking: dashboard.pressFreedomMetrics.internationalRanking,
          trend: dashboard.pressFreedomMetrics.trend,
          key_concerns: identifyKeyFreedomConcerns(dashboard, policies, censorship)
        },
        media_landscape: {
          total_outlets: dashboard.overview.totalOutlets,
          independence_distribution: calculateIndependenceDistribution(outlets),
          credibility_assessment: dashboard.mediaLandscape.credibilityDistribution,
          bias_analysis: dashboard.mediaLandscape.politicalBiasSpectrum
        },
        government_control: {
          control_mechanisms: policies.map(p => ({
            policy: p.policyName,
            type: p.policyType,
            intensity: p.controlIntensity,
            compliance: p.complianceRate
          })),
          censorship_activity: {
            recent_actions: censorship.length,
            most_targeted_topics: extractMostTargetedTopics(censorship),
            average_democratic_impact: censorship.reduce((sum, log) => sum + log.democraticImpact, 0) / Math.max(censorship.length, 1)
          }
        },
        recommendations: generateFreedomRecommendations(dashboard, outlets, policies, censorship),
        international_comparison: generateInternationalComparison(dashboard.pressFreedomMetrics.currentLevel)
      };
      
      res.json({
        success: true,
        data: report,
        generated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating freedom report:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate freedom report'
      });
    }
  });

  // Press Conference Routes
  
  // Get press conferences
  router.get('/press-conferences/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const status = req.query.status as string | undefined;
      
      const conferences = await mediaControlService.getPressConferences(campaignId, status);
      
      res.json({
        success: true,
        data: conferences,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching press conferences:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch press conferences'
      });
    }
  });

  // Get press conference questions
  router.get('/press-conferences/:campaignId/:conferenceId/questions', async (req, res) => {
    try {
      const conferenceId = req.params.conferenceId;
      
      const questions = await mediaControlService.getPressConferenceQuestions(conferenceId);
      
      res.json({
        success: true,
        data: questions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching press conference questions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch press conference questions'
      });
    }
  });

  // Get press secretary
  router.get('/press-secretary/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      
      const secretary = await mediaControlService.getPressSecretary(campaignId);
      
      res.json({
        success: true,
        data: secretary,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching press secretary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch press secretary'
      });
    }
  });

  // Schedule press conference
  router.post('/press-conferences/:campaignId', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const data = req.body;
      
      // Validate required fields
      if (!data.title || !data.scheduledDate || !data.presenterType || !data.presenterName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title, scheduledDate, presenterType, presenterName'
        });
      }
      
      const conference = await mediaControlService.schedulePressConference(campaignId, {
        ...data,
        scheduledDate: new Date(data.scheduledDate)
      });
      
      res.json({
        success: true,
        data: conference,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error scheduling press conference:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to schedule press conference'
      });
    }
  });

  // Complete press conference
  router.put('/press-conferences/:campaignId/:conferenceId/complete', async (req, res) => {
    try {
      const conferenceId = req.params.conferenceId;
      const data = req.body;
      
      // Validate required fields
      if (typeof data.questionsAsked !== 'number' || typeof data.questionsAnswered !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: questionsAsked, questionsAnswered'
        });
      }
      
      const conference = await mediaControlService.completePressConference(conferenceId, {
        questionsAsked: data.questionsAsked,
        questionsAnswered: data.questionsAnswered,
        hostileQuestions: data.hostileQuestions || 0,
        followUpQuestions: data.followUpQuestions || 0
      });
      
      res.json({
        success: true,
        data: conference,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error completing press conference:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete press conference'
      });
    }
  });

  return router;
}

// Helper functions for analysis

function calculatePressFreedomImpact(parameters: any, knobs: any): number {
  // Simulate press freedom impact based on parameter changes
  let impact = 0;
  
  if (parameters.press_freedom_level !== undefined) {
    impact += (parameters.press_freedom_level - knobs.pressFreedomLevel) * 50;
  }
  
  if (parameters.censorship_intensity !== undefined) {
    impact -= (parameters.censorship_intensity - knobs.censorshipIntensity) * 40;
  }
  
  if (parameters.government_media_influence !== undefined) {
    impact -= (parameters.government_media_influence - knobs.governmentMediaInfluence) * 30;
  }
  
  return Math.round(impact);
}

function calculatePublicOpinionImpact(parameters: any, knobs: any): number {
  // Simulate public opinion change
  let impact = 0;
  
  if (parameters.information_transparency !== undefined) {
    impact += (parameters.information_transparency - knobs.informationTransparency) * 20;
  }
  
  if (parameters.propaganda_effectiveness !== undefined) {
    impact += (parameters.propaganda_effectiveness - knobs.propagandaEffectiveness) * 15;
  }
  
  return Math.round(impact);
}

function calculateInternationalImpact(parameters: any, knobs: any): number {
  // Simulate international relations impact
  let impact = 0;
  
  if (parameters.press_freedom_level !== undefined) {
    impact += (parameters.press_freedom_level - knobs.pressFreedomLevel) * 25;
  }
  
  if (parameters.journalist_safety_protection !== undefined) {
    impact += (parameters.journalist_safety_protection - knobs.journalistSafetyProtection) * 20;
  }
  
  return Math.round(impact);
}

function calculateEconomicImpact(parameters: any, knobs: any): number {
  // Simulate economic impact of media control changes
  const freedomChange = calculatePressFreedomImpact(parameters, knobs);
  return Math.round(freedomChange * 0.3); // Press freedom affects business confidence
}

function calculateDemocraticImpact(parameters: any, knobs: any): number {
  // Simulate democratic stability impact
  let impact = 0;
  
  if (parameters.editorial_independence !== undefined) {
    impact += (parameters.editorial_independence - knobs.editorialIndependence) * 30;
  }
  
  if (parameters.investigative_journalism_support !== undefined) {
    impact += (parameters.investigative_journalism_support - knobs.investigativeJournalismSupport) * 25;
  }
  
  return Math.round(impact);
}

function generateRecommendations(parameters: any, knobs: any, dashboard: any): string[] {
  const recommendations: string[] = [];
  
  if (dashboard.pressFreedomMetrics.currentLevel < 50) {
    recommendations.push('Consider increasing press freedom levels to improve international standing');
    recommendations.push('Reduce censorship intensity to build public trust in media');
  }
  
  if (dashboard.controlEffectiveness.publicTrustInMedia < 40) {
    recommendations.push('Enhance fact-checking enforcement to rebuild media credibility');
    recommendations.push('Increase transparency in media funding and ownership');
  }
  
  if (dashboard.pressFreedomMetrics.internationalRanking > 100) {
    recommendations.push('Strengthen journalist safety protections to improve international perception');
    recommendations.push('Review and potentially relax foreign media restrictions');
  }
  
  return recommendations;
}

function identifyRisks(parameters: any, knobs: any): string[] {
  const risks: string[] = [];
  
  if (parameters.censorship_intensity > 0.7) {
    risks.push('High censorship may trigger international sanctions');
    risks.push('Excessive control could lead to underground media networks');
  }
  
  if (parameters.press_freedom_level < 0.3) {
    risks.push('Low press freedom may harm foreign investment');
    risks.push('Reduced media independence could increase corruption risks');
  }
  
  if (parameters.propaganda_effectiveness > 0.8) {
    risks.push('Heavy propaganda may cause public backlash');
    risks.push('Over-reliance on state messaging could reduce credibility');
  }
  
  return risks;
}

function estimateTimeline(parameters: any): string {
  // Estimate implementation timeline based on parameter changes
  const changeCount = Object.keys(parameters).length;
  
  if (changeCount <= 3) return '2-4 weeks';
  if (changeCount <= 6) return '1-2 months';
  if (changeCount <= 12) return '2-4 months';
  return '4-6 months';
}

function identifyKeyFreedomConcerns(dashboard: any, policies: any[], censorship: any[]): string[] {
  const concerns: string[] = [];
  
  if (dashboard.pressFreedomMetrics.currentLevel < 40) {
    concerns.push('Severely restricted press freedom');
  }
  
  if (censorship.length > 20) {
    concerns.push('High frequency of censorship actions');
  }
  
  const strictPolicies = policies.filter(p => p.controlIntensity > 0.7);
  if (strictPolicies.length > 3) {
    concerns.push('Multiple highly restrictive media policies');
  }
  
  return concerns;
}

function calculateIndependenceDistribution(outlets: any[]): Record<string, number> {
  const distribution: Record<string, number> = {
    'Fully Independent': 0,
    'Mostly Independent': 0,
    'Mixed Control': 0,
    'Government Controlled': 0
  };
  
  outlets.forEach(outlet => {
    if (outlet.governmentStake <= 10) {
      distribution['Fully Independent']++;
    } else if (outlet.governmentStake <= 30) {
      distribution['Mostly Independent']++;
    } else if (outlet.governmentStake <= 60) {
      distribution['Mixed Control']++;
    } else {
      distribution['Government Controlled']++;
    }
  });
  
  return distribution;
}

function extractMostTargetedTopics(censorship: any[]): string[] {
  const topicCounts: Record<string, number> = {};
  
  censorship.forEach(log => {
    log.sensitiveTopics.forEach((topic: string) => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });
  
  return Object.entries(topicCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([topic]) => topic);
}

function generateFreedomRecommendations(dashboard: any, outlets: any[], policies: any[], censorship: any[]): string[] {
  const recommendations: string[] = [];
  
  // Add specific recommendations based on analysis
  if (dashboard.pressFreedomMetrics.currentLevel < 60) {
    recommendations.push('Establish independent media oversight body');
    recommendations.push('Create legal protections for investigative journalism');
  }
  
  if (outlets.filter((o: any) => o.governmentStake > 50).length > outlets.length * 0.6) {
    recommendations.push('Encourage private media ownership to increase diversity');
    recommendations.push('Implement transparent media funding mechanisms');
  }
  
  return recommendations;
}

function generateInternationalComparison(currentScore: number): any {
  return {
    peer_countries: {
      'Similar Score': currentScore,
      'Regional Average': Math.max(30, currentScore + Math.random() * 20 - 10),
      'Global Average': 65,
      'Top Performers': 85
    },
    ranking_context: currentScore >= 80 ? 'Top Tier' : 
                    currentScore >= 60 ? 'Upper Middle' :
                    currentScore >= 40 ? 'Lower Middle' : 'Bottom Tier'
  };
}
