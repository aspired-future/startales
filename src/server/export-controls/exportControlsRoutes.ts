/**
 * Export Controls API Routes
 * RESTful API for export policy management and license processing
 */

import express from 'express';
import { Pool } from 'pg';
import ExportControlsService from './ExportControlsService';
import { EXPORT_CONTROLS_KNOBS, EXPORT_CONTROLS_AI_PROMPTS } from './exportControlsKnobs';

export function createExportControlsRoutes(pool: Pool): express.Router {
  const router = express.Router();
  const exportControlsService = new ExportControlsService(pool);

  // ===== ENHANCED KNOB SYSTEM (MUST BE FIRST TO AVOID CONFLICTS) =====

  // Get export controls knob settings
  router.get('/knobs', async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          defaultKnobs: EXPORT_CONTROLS_KNOBS,
          descriptions: getExportControlsKnobDescriptions(),
          presets: getExportControlsKnobPresets()
        },
        message: 'Export controls knobs retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting export controls knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve export controls knobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update export controls knob settings
  router.put('/knobs', async (req, res) => {
    try {
      const { knobs } = req.body;
      
      // Validate knob values (0-100)
      for (const [key, value] of Object.entries(knobs)) {
        if (typeof value !== 'number' || value < 0 || value > 100) {
          return res.status(400).json({
            success: false,
            error: `Invalid knob value for ${key}: must be between 0 and 100`
          });
        }
      }

      // In a real implementation, you would store these settings
      res.json({
        success: true,
        data: { updatedKnobs: knobs },
        message: 'Export controls knobs updated successfully'
      });
    } catch (error) {
      console.error('Error updating export controls knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update export controls knobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get export controls AI prompts
  router.get('/ai-prompts', async (req, res) => {
    try {
      res.json({
        success: true,
        data: EXPORT_CONTROLS_AI_PROMPTS,
        message: 'Export controls AI prompts retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting export controls AI prompts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve export controls AI prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===== CORE EXPORT CONTROLS ENDPOINTS =====

  // Get all export control policies for a civilization
  router.get('/civilization/:campaignId/:civilizationId/policies', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { status, type } = req.query;

      let policies = await exportControlsService.getPolicies(campaignId, civilizationId, status as any);

      // Apply additional filters
      if (type) {
        policies = policies.filter(p => p.type === type);
      }

      res.json({
        success: true,
        data: policies,
        message: `Retrieved ${policies.length} export control policies`
      });
    } catch (error) {
      console.error('Error getting export control policies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve export control policies',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create new export control policy
  router.post('/civilization/:campaignId/:civilizationId/policies', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const policyData = {
        ...req.body,
        campaignId,
        civilizationId
      };

      const policy = await exportControlsService.createPolicy(policyData);

      res.status(201).json({
        success: true,
        data: policy,
        message: 'Export control policy created successfully'
      });
    } catch (error) {
      console.error('Error creating export control policy:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create export control policy',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Apply for export license
  router.post('/civilization/:campaignId/:civilizationId/licenses/apply', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const applicationData = {
        ...req.body,
        campaignId,
        civilizationId
      };

      const license = await exportControlsService.applyForLicense(applicationData);

      res.status(201).json({
        success: true,
        data: license,
        message: 'Export license application submitted successfully'
      });
    } catch (error) {
      console.error('Error applying for export license:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit export license application',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Review export license application
  router.post('/licenses/:licenseId/review', async (req, res) => {
    try {
      const { licenseId } = req.params;
      const { reviewerId, decision, conditions, restrictions } = req.body;

      if (!['approved', 'denied'].includes(decision)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid decision. Must be "approved" or "denied"'
        });
      }

      const license = await exportControlsService.reviewLicense(
        licenseId,
        reviewerId,
        decision,
        conditions,
        restrictions
      );

      res.json({
        success: true,
        data: license,
        message: `License ${decision} successfully`
      });
    } catch (error) {
      console.error('Error reviewing export license:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to review export license',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Check export permission
  router.post('/civilization/:campaignId/:civilizationId/check-permission', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { destinationCivilization, items } = req.body;

      if (!destinationCivilization || !items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: destinationCivilization, items'
        });
      }

      const permission = await exportControlsService.checkExportPermission(
        campaignId,
        civilizationId,
        destinationCivilization,
        items
      );

      res.json({
        success: true,
        data: permission,
        message: 'Export permission check completed'
      });
    } catch (error) {
      console.error('Error checking export permission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check export permission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get export statistics
  router.get('/civilization/:campaignId/:civilizationId/statistics', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const statistics = await exportControlsService.getExportStatistics(campaignId, civilizationId);

      res.json({
        success: true,
        data: statistics,
        message: 'Export statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting export statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve export statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get specific license by ID
  router.get('/licenses/:licenseId', async (req, res) => {
    try {
      const { licenseId } = req.params;
      const license = await exportControlsService.getLicense(licenseId);

      if (!license) {
        return res.status(404).json({
          success: false,
          error: 'License not found'
        });
      }

      res.json({
        success: true,
        data: license,
        message: 'License retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting license:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve license',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Generate AI analysis for export controls
  router.post('/civilization/:campaignId/:civilizationId/ai-analysis', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { promptType, parameters } = req.body;

      if (!promptType || !EXPORT_CONTROLS_AI_PROMPTS[promptType as keyof typeof EXPORT_CONTROLS_AI_PROMPTS]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid prompt type. Available types: ' + Object.keys(EXPORT_CONTROLS_AI_PROMPTS).join(', ')
        });
      }

      const prompt = EXPORT_CONTROLS_AI_PROMPTS[promptType as keyof typeof EXPORT_CONTROLS_AI_PROMPTS];
      
      // Replace parameters in prompt template
      let processedPrompt = prompt;
      if (parameters) {
        Object.entries(parameters).forEach(([key, value]) => {
          processedPrompt = processedPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
        });
      }

      res.json({
        success: true,
        data: {
          promptType,
          processedPrompt,
          parameters,
          // Mock AI response
          aiResponse: `AI analysis for ${promptType} would be generated here based on the current export control situation.`
        },
        message: 'AI analysis generated successfully'
      });
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===== POLICY MANAGEMENT =====

  // Update export control policy
  router.put('/policies/:policyId', async (req, res) => {
    try {
      const { policyId } = req.params;
      const updates = req.body;

      // In a real implementation, you would update the policy
      res.json({
        success: true,
        data: { policyId, updates },
        message: 'Export control policy updated successfully'
      });
    } catch (error) {
      console.error('Error updating export control policy:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update export control policy',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete export control policy
  router.delete('/policies/:policyId', async (req, res) => {
    try {
      const { policyId } = req.params;

      // In a real implementation, you would delete the policy
      res.json({
        success: true,
        message: 'Export control policy deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting export control policy:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete export control policy',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===== COMPLIANCE & MONITORING =====

  // Get compliance reports
  router.get('/civilization/:campaignId/:civilizationId/compliance', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      
      // Mock compliance data
      const complianceData = {
        overallComplianceRate: 94.5,
        activeLicenses: 23,
        recentViolations: 1,
        pendingInvestigations: 0,
        auditsDue: 3,
        complianceScore: 'Excellent',
        recommendations: [
          'Schedule quarterly compliance review',
          'Update risk assessment for high-value exports',
          'Enhance monitoring for dual-use technologies'
        ]
      };

      res.json({
        success: true,
        data: complianceData,
        message: 'Compliance data retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting compliance data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve compliance data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Report compliance violation
  router.post('/civilization/:campaignId/:civilizationId/violations', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const violationData = req.body;

      // In a real implementation, you would create a violation record
      const violationId = `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      res.status(201).json({
        success: true,
        data: { violationId, ...violationData },
        message: 'Compliance violation reported successfully'
      });
    } catch (error) {
      console.error('Error reporting compliance violation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to report compliance violation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}

// Helper functions for knob system
function getExportControlsKnobDescriptions(): Record<string, string> {
  return {
    policyStrictness: "Overall strictness level of export control policies",
    automaticPolicyUpdates: "Frequency of AI-driven policy updates based on threat assessment",
    threatResponseSensitivity: "Sensitivity to emerging security threats and rapid policy adjustments",
    diplomaticConsiderations: "Weight given to diplomatic relations in export decisions",
    economicImpactWeight: "Consideration of economic consequences in policy decisions",
    technologicalAdvantageProtection: "Priority level for protecting technological advantages",
    approvalProcessSpeed: "Speed of license approval process and decision making",
    riskAssessmentThoroughness: "Depth and comprehensiveness of risk assessment analysis",
    aiRecommendationWeight: "Influence of AI recommendations on final decisions",
    humanOversightLevel: "Level of human oversight required in automated processes",
    documentationRequirements: "Strictness of documentation and evidence requirements",
    complianceMonitoringIntensity: "Intensity and frequency of compliance monitoring activities",
    politicalRiskWeight: "Weight assigned to political risk factors in assessments",
    securityRiskWeight: "Weight assigned to security risk factors in assessments",
    economicRiskWeight: "Weight assigned to economic risk factors in assessments",
    technologicalRiskWeight: "Weight assigned to technological risk factors in assessments",
    diplomaticRiskWeight: "Weight assigned to diplomatic risk factors in assessments",
    riskToleranceLevel: "Overall tolerance for risk in export decisions",
    violationDetectionSensitivity: "Sensitivity of systems for detecting compliance violations",
    penaltySeverity: "Severity level of penalties imposed for violations",
    investigationThoroughness: "Thoroughness and depth of violation investigations",
    complianceReportingFrequency: "Frequency of required compliance reporting",
    auditFrequency: "Frequency of compliance audits and inspections",
    enforcementConsistency: "Consistency of enforcement actions across similar cases"
  };
}

function getExportControlsKnobPresets(): Record<string, Partial<typeof EXPORT_CONTROLS_KNOBS>> {
  return {
    high_security: {
      policyStrictness: 90,
      threatResponseSensitivity: 95,
      technologicalAdvantageProtection: 95,
      riskAssessmentThoroughness: 95,
      humanOversightLevel: 90,
      securityRiskWeight: 50
    },
    balanced_approach: {
      policyStrictness: 65,
      diplomaticConsiderations: 70,
      economicImpactWeight: 60,
      approvalProcessSpeed: 70,
      riskToleranceLevel: 50,
      enforcementConsistency: 80
    },
    trade_friendly: {
      policyStrictness: 40,
      approvalProcessSpeed: 85,
      economicImpactWeight: 80,
      diplomaticConsiderations: 85,
      riskToleranceLevel: 70,
      documentationRequirements: 50
    },
    technology_focused: {
      technologicalAdvantageProtection: 95,
      technologicalRiskWeight: 40,
      riskAssessmentThoroughness: 90,
      complianceMonitoringIntensity: 85,
      violationDetectionSensitivity: 90,
      investigationThoroughness: 90
    },
    diplomatic_priority: {
      diplomaticConsiderations: 90,
      diplomaticRiskWeight: 30,
      economicImpactWeight: 70,
      approvalProcessSpeed: 75,
      penaltySeverity: 40,
      enforcementConsistency: 60
    }
  };
}

export default createExportControlsRoutes;

