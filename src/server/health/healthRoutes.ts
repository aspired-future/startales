import { Router } from 'express';
import { getHealthService } from './HealthService.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = Router();

// Enhanced AI Knobs for Health System
const healthKnobsData = {
  // Healthcare System Organization
  healthcare_system_centralization: 0.6,  // Healthcare system centralization vs decentralization
  public_private_healthcare_balance: 0.7, // Public vs private healthcare provision balance
  healthcare_universal_coverage: 0.8,     // Universal healthcare coverage and accessibility
  
  // Healthcare Funding & Resources
  healthcare_budget_allocation: 0.8,      // Healthcare budget allocation and spending priority
  medical_research_investment: 0.7,       // Medical research and development investment
  healthcare_infrastructure_investment: 0.8, // Healthcare infrastructure and facility investment
  
  // Public Health & Prevention
  preventive_care_emphasis: 0.8,          // Preventive care and health promotion emphasis
  public_health_surveillance: 0.9,       // Public health monitoring and disease surveillance
  health_education_programs: 0.8,        // Health education and awareness programs
  
  // Healthcare Quality & Standards
  medical_quality_standards: 0.9,        // Medical care quality standards and regulation
  healthcare_professional_standards: 0.9, // Healthcare professional licensing and standards
  patient_safety_protocols: 0.9,         // Patient safety protocols and error prevention
  
  // Healthcare Access & Equity
  healthcare_geographic_equity: 0.7,     // Healthcare access equity across geographic regions
  healthcare_socioeconomic_equity: 0.8,  // Healthcare access equity across socioeconomic groups
  minority_health_programs: 0.7,         // Minority and vulnerable population health programs
  
  // Mental Health & Behavioral Health
  mental_health_service_integration: 0.7, // Mental health service integration and accessibility
  substance_abuse_treatment: 0.7,        // Substance abuse treatment and prevention programs
  behavioral_health_support: 0.8,        // Behavioral health support and community programs
  
  // Emergency Preparedness & Response
  health_emergency_preparedness: 0.9,    // Health emergency preparedness and response capability
  pandemic_response_capability: 0.8,     // Pandemic and epidemic response capability
  medical_emergency_coordination: 0.8,   // Medical emergency coordination and disaster response
  
  // Healthcare Technology & Innovation
  health_technology_adoption: 0.7,       // Healthcare technology adoption and digitization
  telemedicine_infrastructure: 0.6,      // Telemedicine and remote healthcare infrastructure
  health_data_management: 0.8,           // Health data management and electronic health records
  
  // Pharmaceutical & Medical Devices
  pharmaceutical_regulation: 0.9,        // Pharmaceutical safety and efficacy regulation
  drug_pricing_control: 0.6,             // Drug pricing regulation and affordability measures
  medical_device_oversight: 0.8,         // Medical device safety and approval oversight
  
  // International Health Cooperation
  global_health_engagement: 0.6,         // Global health cooperation and international engagement
  health_diplomacy_participation: 0.5,   // Health diplomacy and multilateral health initiatives
  medical_humanitarian_assistance: 0.7,  // Medical humanitarian assistance and aid programs
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Health
const healthKnobSystem = new EnhancedKnobSystem(healthKnobsData);

// Apply health knobs to game state
function applyHealthKnobsToGameState() {
  const knobs = healthKnobSystem.knobs;
  
  // Apply healthcare system organization settings
  const healthcareSystemOrganization = (knobs.healthcare_system_centralization + knobs.public_private_healthcare_balance + 
    knobs.healthcare_universal_coverage) / 3;
  
  // Apply healthcare funding settings
  const healthcareFunding = (knobs.healthcare_budget_allocation + knobs.medical_research_investment + 
    knobs.healthcare_infrastructure_investment) / 3;
  
  // Apply public health settings
  const publicHealth = (knobs.preventive_care_emphasis + knobs.public_health_surveillance + 
    knobs.health_education_programs) / 3;
  
  // Apply healthcare quality settings
  const healthcareQuality = (knobs.medical_quality_standards + knobs.healthcare_professional_standards + 
    knobs.patient_safety_protocols) / 3;
  
  // Apply healthcare access settings
  const healthcareAccess = (knobs.healthcare_geographic_equity + knobs.healthcare_socioeconomic_equity + 
    knobs.minority_health_programs) / 3;
  
  // Apply emergency preparedness settings
  const emergencyPreparedness = (knobs.health_emergency_preparedness + knobs.pandemic_response_capability + 
    knobs.medical_emergency_coordination) / 3;
  
  console.log('Applied health knobs to game state:', {
    healthcareSystemOrganization,
    healthcareFunding,
    publicHealth,
    healthcareQuality,
    healthcareAccess,
    emergencyPreparedness
  });
}

// Health Secretary Management Routes
router.post('/secretary/hire', async (req, res) => {
  try {
    const { campaignId, secretaryData } = req.body;
    
    if (!campaignId || !secretaryData) {
      return res.status(400).json({ error: 'Campaign ID and secretary data are required' });
    }

    const healthService = getHealthService();
    const secretary = await healthService.createHealthSecretary(campaignId, secretaryData);
    
    res.json({ 
      success: true, 
      secretary,
      message: `${secretary.full_name} has been appointed as Secretary of Health and Human Services`
    });
  } catch (error) {
    console.error('Error hiring Health Secretary:', error);
    res.status(500).json({ error: 'Failed to hire Health Secretary' });
  }
});

router.get('/secretary/:campaignId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const healthService = getHealthService();
    const secretary = await healthService.getCurrentHealthSecretary(campaignId);
    
    if (!secretary) {
      return res.status(404).json({ error: 'No active Health Secretary found' });
    }
    
    res.json({ secretary });
  } catch (error) {
    console.error('Error getting Health Secretary:', error);
    res.status(500).json({ error: 'Failed to get Health Secretary' });
  }
});

router.post('/secretary/:campaignId/fire', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const healthService = getHealthService();
    
    await healthService.fireHealthSecretary(campaignId);
    
    res.json({ 
      success: true, 
      message: 'Health Secretary has been dismissed from office'
    });
  } catch (error) {
    console.error('Error firing Health Secretary:', error);
    res.status(500).json({ error: 'Failed to fire Health Secretary' });
  }
});

// Surgeon General Management Routes
router.post('/surgeon-general/hire', async (req, res) => {
  try {
    const { campaignId, surgeonData } = req.body;
    
    if (!campaignId || !surgeonData) {
      return res.status(400).json({ error: 'Campaign ID and surgeon data are required' });
    }

    const healthService = getHealthService();
    const surgeonGeneral = await healthService.createSurgeonGeneral(campaignId, surgeonData);
    
    res.json({ 
      success: true, 
      surgeonGeneral,
      message: `${surgeonGeneral.full_name} has been appointed as Surgeon General`
    });
  } catch (error) {
    console.error('Error hiring Surgeon General:', error);
    res.status(500).json({ error: 'Failed to hire Surgeon General' });
  }
});

router.get('/surgeon-general/:campaignId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const healthService = getHealthService();
    const surgeonGeneral = await healthService.getCurrentSurgeonGeneral(campaignId);
    
    if (!surgeonGeneral) {
      return res.status(404).json({ error: 'No active Surgeon General found' });
    }
    
    res.json({ surgeonGeneral });
  } catch (error) {
    console.error('Error getting Surgeon General:', error);
    res.status(500).json({ error: 'Failed to get Surgeon General' });
  }
});

router.post('/surgeon-general/:campaignId/fire', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const healthService = getHealthService();
    
    await healthService.fireSurgeonGeneral(campaignId);
    
    res.json({ 
      success: true, 
      message: 'Surgeon General has been dismissed from office'
    });
  } catch (error) {
    console.error('Error firing Surgeon General:', error);
    res.status(500).json({ error: 'Failed to fire Surgeon General' });
  }
});

// Population Health Routes
router.get('/population/:campaignId/:civilizationId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : undefined;
    
    const healthService = getHealthService();
    const populationHealth = await healthService.getPopulationHealth(campaignId, civilizationId, cityId);
    
    res.json({ populationHealth });
  } catch (error) {
    console.error('Error getting population health:', error);
    res.status(500).json({ error: 'Failed to get population health data' });
  }
});

router.post('/population/:campaignId/:civilizationId/update', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    const { healthData } = req.body;
    
    const healthService = getHealthService();
    const updatedHealth = await healthService.updatePopulationHealth(campaignId, civilizationId, healthData);
    
    res.json({ 
      success: true, 
      populationHealth: updatedHealth,
      message: 'Population health data updated successfully'
    });
  } catch (error) {
    console.error('Error updating population health:', error);
    res.status(500).json({ error: 'Failed to update population health data' });
  }
});

// Chronic Disease Management Routes
router.get('/chronic-diseases/:campaignId/:civilizationId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    
    const healthService = getHealthService();
    const chronicDiseases = await healthService.getChronicDiseases(campaignId, civilizationId);
    
    res.json({ chronicDiseases });
  } catch (error) {
    console.error('Error getting chronic diseases:', error);
    res.status(500).json({ error: 'Failed to get chronic disease data' });
  }
});

router.post('/chronic-diseases/:campaignId/:civilizationId/:diseaseType/update', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    const diseaseType = req.params.diseaseType;
    const { diseaseData } = req.body;
    
    const healthService = getHealthService();
    const updatedDisease = await healthService.updateChronicDisease(campaignId, civilizationId, diseaseType, diseaseData);
    
    res.json({ 
      success: true, 
      chronicDisease: updatedDisease,
      message: `${diseaseType} data updated successfully`
    });
  } catch (error) {
    console.error('Error updating chronic disease:', error);
    res.status(500).json({ error: 'Failed to update chronic disease data' });
  }
});

// Healthcare Infrastructure Routes
router.get('/infrastructure/:campaignId/:civilizationId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : undefined;
    
    const healthService = getHealthService();
    const infrastructure = await healthService.getHealthcareInfrastructure(campaignId, civilizationId, cityId);
    
    res.json({ infrastructure });
  } catch (error) {
    console.error('Error getting healthcare infrastructure:', error);
    res.status(500).json({ error: 'Failed to get healthcare infrastructure data' });
  }
});

router.post('/infrastructure/create', async (req, res) => {
  try {
    const { facilityData } = req.body;
    
    if (!facilityData) {
      return res.status(400).json({ error: 'Facility data is required' });
    }
    
    const healthService = getHealthService();
    const facility = await healthService.createHealthcareFacility(facilityData);
    
    res.json({ 
      success: true, 
      facility,
      message: `${facility.facility_name} has been established`
    });
  } catch (error) {
    console.error('Error creating healthcare facility:', error);
    res.status(500).json({ error: 'Failed to create healthcare facility' });
  }
});

// Health Policy Routes
router.get('/policies/:campaignId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    
    const healthService = getHealthService();
    const policies = await healthService.getHealthPolicies(campaignId);
    
    res.json({ policies });
  } catch (error) {
    console.error('Error getting health policies:', error);
    res.status(500).json({ error: 'Failed to get health policies' });
  }
});

router.post('/policies/create', async (req, res) => {
  try {
    const { policyData } = req.body;
    
    if (!policyData) {
      return res.status(400).json({ error: 'Policy data is required' });
    }
    
    const healthService = getHealthService();
    const policy = await healthService.createHealthPolicy(policyData);
    
    res.json({ 
      success: true, 
      policy,
      message: `Health policy "${policy.policy_name}" has been created`
    });
  } catch (error) {
    console.error('Error creating health policy:', error);
    res.status(500).json({ error: 'Failed to create health policy' });
  }
});

router.post('/policies/:policyId/approve', async (req, res) => {
  try {
    const policyId = parseInt(req.params.policyId);
    const { approverType } = req.body;
    
    if (!['secretary', 'surgeon_general', 'leader'].includes(approverType)) {
      return res.status(400).json({ error: 'Invalid approver type' });
    }
    
    const healthService = getHealthService();
    const policy = await healthService.approveHealthPolicy(policyId, approverType);
    
    res.json({ 
      success: true, 
      policy,
      message: `Policy approved by ${approverType.replace('_', ' ')}`
    });
  } catch (error) {
    console.error('Error approving health policy:', error);
    res.status(500).json({ error: 'Failed to approve health policy' });
  }
});

// Health Emergency Routes
router.get('/emergencies/:campaignId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const activeOnly = req.query.activeOnly === 'true';
    
    const healthService = getHealthService();
    const emergencies = await healthService.getHealthEmergencies(campaignId, activeOnly);
    
    res.json({ emergencies });
  } catch (error) {
    console.error('Error getting health emergencies:', error);
    res.status(500).json({ error: 'Failed to get health emergencies' });
  }
});

router.post('/emergencies/declare', async (req, res) => {
  try {
    const { emergencyData } = req.body;
    
    if (!emergencyData) {
      return res.status(400).json({ error: 'Emergency data is required' });
    }
    
    const healthService = getHealthService();
    const emergency = await healthService.declareHealthEmergency(emergencyData);
    
    res.json({ 
      success: true, 
      emergency,
      message: `Health emergency declared: ${emergency.emergency_type}`
    });
  } catch (error) {
    console.error('Error declaring health emergency:', error);
    res.status(500).json({ error: 'Failed to declare health emergency' });
  }
});

router.post('/emergencies/:emergencyId/resolve', async (req, res) => {
  try {
    const emergencyId = parseInt(req.params.emergencyId);
    const { lessonsLearned } = req.body;
    
    const healthService = getHealthService();
    const emergency = await healthService.resolveHealthEmergency(emergencyId, lessonsLearned || []);
    
    res.json({ 
      success: true, 
      emergency,
      message: 'Health emergency has been resolved'
    });
  } catch (error) {
    console.error('Error resolving health emergency:', error);
    res.status(500).json({ error: 'Failed to resolve health emergency' });
  }
});

// Health Budget Routes
router.get('/budget/:campaignId/:fiscalYear', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const fiscalYear = parseInt(req.params.fiscalYear);
    
    const healthService = getHealthService();
    const budget = await healthService.getHealthBudget(campaignId, fiscalYear);
    
    const totalAllocated = budget.reduce((sum, item) => sum + Number(item.allocated_amount), 0);
    const totalSpent = budget.reduce((sum, item) => sum + Number(item.spent_amount), 0);
    
    res.json({ 
      budget,
      summary: {
        totalAllocated,
        totalSpent,
        remainingBalance: totalAllocated - totalSpent,
        utilizationRate: totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Error getting health budget:', error);
    res.status(500).json({ error: 'Failed to get health budget' });
  }
});

router.post('/budget/allocate', async (req, res) => {
  try {
    const { budgetData } = req.body;
    
    if (!budgetData) {
      return res.status(400).json({ error: 'Budget data is required' });
    }
    
    const healthService = getHealthService();
    const budget = await healthService.allocateHealthBudget(budgetData);
    
    res.json({ 
      success: true, 
      budget,
      message: `Budget allocated for ${budget.category}${budget.subcategory ? ` - ${budget.subcategory}` : ''}`
    });
  } catch (error) {
    console.error('Error allocating health budget:', error);
    res.status(500).json({ error: 'Failed to allocate health budget' });
  }
});

router.post('/budget/:campaignId/:fiscalYear/:category/:subcategory/spend', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const fiscalYear = parseInt(req.params.fiscalYear);
    const category = req.params.category;
    const subcategory = req.params.subcategory;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid spending amount is required' });
    }
    
    const healthService = getHealthService();
    const budget = await healthService.spendHealthBudget(campaignId, fiscalYear, category, subcategory, amount);
    
    res.json({ 
      success: true, 
      budget,
      message: `$${amount.toLocaleString()} spent from ${category} - ${subcategory}`
    });
  } catch (error) {
    console.error('Error spending health budget:', error);
    res.status(500).json({ error: 'Failed to spend health budget' });
  }
});

// Health Workflow Routes
router.get('/workflows/:campaignId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const status = req.query.status as string;
    
    const healthService = getHealthService();
    const workflows = await healthService.getHealthWorkflows(campaignId, status);
    
    res.json({ workflows });
  } catch (error) {
    console.error('Error getting health workflows:', error);
    res.status(500).json({ error: 'Failed to get health workflows' });
  }
});

router.post('/workflows/create', async (req, res) => {
  try {
    const { workflowData } = req.body;
    
    if (!workflowData) {
      return res.status(400).json({ error: 'Workflow data is required' });
    }
    
    const healthService = getHealthService();
    const workflow = await healthService.createHealthWorkflow(workflowData);
    
    res.json({ 
      success: true, 
      workflow,
      message: `Health workflow "${workflow.title}" has been created`
    });
  } catch (error) {
    console.error('Error creating health workflow:', error);
    res.status(500).json({ error: 'Failed to create health workflow' });
  }
});

router.post('/workflows/:workflowId/status', async (req, res) => {
  try {
    const workflowId = parseInt(req.params.workflowId);
    const { status, completedDate } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const healthService = getHealthService();
    const workflow = await healthService.updateWorkflowStatus(
      workflowId, 
      status, 
      completedDate ? new Date(completedDate) : undefined
    );
    
    res.json({ 
      success: true, 
      workflow,
      message: `Workflow status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating workflow status:', error);
    res.status(500).json({ error: 'Failed to update workflow status' });
  }
});

// Health Dashboard Route
router.get('/dashboard/:campaignId/:civilizationId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    
    const healthService = getHealthService();
    const dashboard = await healthService.getHealthDashboard(campaignId, civilizationId);
    
    res.json({ dashboard });
  } catch (error) {
    console.error('Error getting health dashboard:', error);
    res.status(500).json({ error: 'Failed to get health dashboard' });
  }
});

// Character Generation Routes
router.post('/generate/secretary', async (req, res) => {
  try {
    const { civilizationName, leadershipStyle } = req.body;
    
    // Generate realistic Health Secretary character
    const secretaryProfiles = [
      {
        full_name: "Dr. Sarah Chen-Martinez",
        background: "Former hospital administrator and public health expert with 20 years of experience in healthcare policy and emergency preparedness.",
        personality_traits: ["Strategic", "Compassionate", "Data-driven", "Collaborative"],
        leadership_style: "Transformational Healthcare Leadership",
        policy_priorities: ["Universal Healthcare Access", "Chronic Disease Prevention", "Mental Health Reform", "Healthcare Innovation"],
        management_approach: "Evidence-based policy implementation with stakeholder engagement",
        public_health_philosophy: "Health is a fundamental right that requires comprehensive, equitable, and sustainable healthcare systems",
        previous_experience: "Director of Regional Health Authority, Chief Medical Officer at Metropolitan Hospital System, WHO Health Policy Advisor",
        education: "MD from Johns Hopkins, MPH from Harvard School of Public Health, MBA in Healthcare Management"
      },
      {
        full_name: "Dr. Michael Thompson-Kim",
        background: "Renowned epidemiologist and former CDC director with expertise in infectious disease control and health system resilience.",
        personality_traits: ["Analytical", "Decisive", "Empathetic", "Innovative"],
        leadership_style: "Crisis-Ready Public Health Leadership",
        policy_priorities: ["Pandemic Preparedness", "Health Equity", "Preventive Care", "Global Health Security"],
        management_approach: "Rapid response protocols with community-centered healthcare delivery",
        public_health_philosophy: "Prevention is the cornerstone of effective healthcare, supported by robust emergency response capabilities",
        previous_experience: "CDC Director, State Health Commissioner, Emergency Medicine Physician, International Health Consultant",
        education: "MD/PhD in Epidemiology from Emory University, Master's in Public Administration from Harvard Kennedy School"
      }
    ];
    
    const profile = secretaryProfiles[Math.floor(Math.random() * secretaryProfiles.length)];
    
    res.json({ 
      success: true, 
      secretaryProfile: profile,
      message: "Health Secretary profile generated successfully"
    });
  } catch (error) {
    console.error('Error generating Health Secretary:', error);
    res.status(500).json({ error: 'Failed to generate Health Secretary profile' });
  }
});

router.post('/generate/surgeon-general', async (req, res) => {
  try {
    const { civilizationName, healthPriorities } = req.body;
    
    // Generate realistic Surgeon General character
    const surgeonProfiles = [
      {
        full_name: "Dr. Elena Rodriguez-Patel",
        medical_degree: "MD, MPH, FACP",
        specialization: "Infectious Diseases & Global Health",
        background: "Leading infectious disease specialist with extensive experience in epidemic response and international health cooperation.",
        personality_traits: ["Authoritative", "Clear Communicator", "Evidence-based", "Calm Under Pressure"],
        communication_style: "Direct, educational, and reassuring public health messaging",
        medical_expertise: ["Infectious Disease Control", "Epidemic Response", "Vaccine Development", "Global Health Policy"],
        policy_positions: ["Science-based Public Health", "Health Equity Advocacy", "International Cooperation", "Community Engagement"],
        public_health_focus: ["Disease Prevention", "Health Education", "Emergency Preparedness", "Health Disparities"],
        previous_roles: ["WHO Regional Director", "University Medical School Dean", "Hospital Chief of Medicine", "CDC Epidemic Intelligence Service"],
        education: "MD from Stanford University, MPH from Johns Hopkins Bloomberg School of Public Health, Fellowship in Infectious Diseases at NIH",
        witter_handle: "@SurgeonGeneral_Rodriguez",
        contact_availability: "high"
      },
      {
        full_name: "Dr. James Wilson-Chang",
        medical_degree: "MD, ScD, FACPM",
        specialization: "Preventive Medicine & Health Policy",
        background: "Public health physician and researcher focused on chronic disease prevention and population health improvement.",
        personality_traits: ["Thoughtful", "Passionate Advocate", "Research-oriented", "Collaborative"],
        communication_style: "Educational, data-driven, and inspiring health promotion messaging",
        medical_expertise: ["Chronic Disease Prevention", "Population Health", "Health Behavior Change", "Healthcare Quality"],
        policy_positions: ["Preventive Care Priority", "Social Determinants Focus", "Health System Reform", "Evidence-based Medicine"],
        public_health_focus: ["Chronic Disease Prevention", "Healthy Lifestyle Promotion", "Healthcare Access", "Health System Quality"],
        previous_roles: ["State Health Officer", "Academic Medical Center Director", "Public Health Research Institute Head", "Medical Advisory Board Chair"],
        education: "MD from University of California San Francisco, ScD in Health Policy from Harvard, Residency in Preventive Medicine at Johns Hopkins",
        witter_handle: "@SurgeonGeneral_Wilson",
        contact_availability: "medium"
      }
    ];
    
    const profile = surgeonProfiles[Math.floor(Math.random() * surgeonProfiles.length)];
    
    res.json({ 
      success: true, 
      surgeonProfile: profile,
      message: "Surgeon General profile generated successfully"
    });
  } catch (error) {
    console.error('Error generating Surgeon General:', error);
    res.status(500).json({ error: 'Failed to generate Surgeon General profile' });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'health', healthKnobSystem, applyHealthKnobsToGameState);

export default router;
