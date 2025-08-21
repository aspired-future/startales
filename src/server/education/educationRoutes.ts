import express from 'express';
import { Pool } from 'pg';
import { getEducationService } from './EducationService.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Education System
const educationKnobsData = {
  // Education System Structure
  education_system_centralization: 0.6,  // Education system centralization vs local control
  public_private_education_balance: 0.7, // Public vs private education provision balance
  education_funding_adequacy: 0.8,       // Education funding adequacy and resource allocation
  
  // Early Childhood & Primary Education
  early_childhood_education_access: 0.8, // Early childhood education access and quality
  primary_education_universality: 0.9,   // Universal primary education access and completion
  primary_curriculum_standards: 0.8,     // Primary education curriculum standards and quality
  
  // Secondary Education
  secondary_education_completion_rate: 0.8, // Secondary education completion and retention rate
  vocational_education_integration: 0.7, // Vocational and technical education integration
  college_preparatory_programs: 0.7,     // College preparatory and advanced placement programs
  
  // Higher Education & Universities
  higher_education_accessibility: 0.7,   // Higher education accessibility and affordability
  university_research_emphasis: 0.8,     // University research and innovation emphasis
  higher_education_quality_standards: 0.8, // Higher education quality standards and accreditation
  
  // Teacher Quality & Professional Development
  teacher_training_standards: 0.8,       // Teacher training and certification standards
  teacher_professional_development: 0.8, // Teacher professional development and support
  teacher_compensation_competitiveness: 0.6, // Teacher compensation and career attractiveness
  
  // Educational Technology & Innovation
  education_technology_integration: 0.7, // Educational technology integration and digital literacy
  online_learning_infrastructure: 0.6,   // Online and distance learning infrastructure
  digital_divide_mitigation: 0.7,        // Digital divide mitigation and equal access
  
  // Special Education & Inclusion
  special_education_support: 0.8,        // Special education services and inclusion support
  learning_disability_accommodation: 0.8, // Learning disability accommodation and support
  gifted_education_programs: 0.6,        // Gifted and talented education programs
  
  // Educational Equity & Access
  education_socioeconomic_equity: 0.8,   // Educational equity across socioeconomic groups
  rural_education_support: 0.7,          // Rural and remote area education support
  minority_education_programs: 0.7,      // Minority and disadvantaged group education programs
  
  // Curriculum & Standards
  curriculum_relevance_modernization: 0.7, // Curriculum relevance and modernization
  critical_thinking_emphasis: 0.8,       // Critical thinking and problem-solving emphasis
  stem_education_priority: 0.8,          // STEM education priority and investment
  
  // International Education & Cooperation
  international_education_exchange: 0.6, // International education exchange and cooperation
  global_competency_development: 0.7,    // Global competency and cultural awareness development
  foreign_language_education: 0.6,       // Foreign language education and multilingual support
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Education
const educationKnobSystem = new EnhancedKnobSystem(educationKnobsData);

// Apply education knobs to game state
function applyEducationKnobsToGameState() {
  const knobs = educationKnobSystem.knobs;
  
  // Apply education system structure settings
  const educationSystemStructure = (knobs.education_system_centralization + knobs.public_private_education_balance + 
    knobs.education_funding_adequacy) / 3;
  
  // Apply early childhood and primary education settings
  const earlyPrimaryEducation = (knobs.early_childhood_education_access + knobs.primary_education_universality + 
    knobs.primary_curriculum_standards) / 3;
  
  // Apply higher education settings
  const higherEducation = (knobs.higher_education_accessibility + knobs.university_research_emphasis + 
    knobs.higher_education_quality_standards) / 3;
  
  // Apply teacher quality settings
  const teacherQuality = (knobs.teacher_training_standards + knobs.teacher_professional_development + 
    knobs.teacher_compensation_competitiveness) / 3;
  
  // Apply educational equity settings
  const educationalEquity = (knobs.education_socioeconomic_equity + knobs.rural_education_support + 
    knobs.minority_education_programs) / 3;
  
  // Apply curriculum and standards settings
  const curriculumStandards = (knobs.curriculum_relevance_modernization + knobs.critical_thinking_emphasis + 
    knobs.stem_education_priority) / 3;
  
  console.log('Applied education knobs to game state:', {
    educationSystemStructure,
    earlyPrimaryEducation,
    higherEducation,
    teacherQuality,
    educationalEquity,
    curriculumStandards
  });
}

/**
 * GET /api/education/universities - Get all universities
 */
router.get('/universities', async (req, res) => {
  try {
    const civilizationId = req.query.civilization_id ? parseInt(req.query.civilization_id as string) : undefined;
    
    const service = getEducationService();
    const universities = await service.getAllUniversities(civilizationId);
    
    res.json({
      success: true,
      data: universities
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch universities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/education/universities/:id - Get university by ID
 */
router.get('/universities/:id', async (req, res) => {
  try {
    const universityId = parseInt(req.params.id);
    
    const service = getEducationService();
    const university = await service.getUniversityById(universityId);
    
    if (!university) {
      return res.status(404).json({
        success: false,
        error: 'University not found'
      });
    }
    
    res.json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch university',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/education/universities - Create new university
 */
router.post('/universities', async (req, res) => {
  try {
    const service = getEducationService();
    const university = await service.createUniversity(req.body);
    
    res.status(201).json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error creating university:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create university',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/education/research/projects - Get research projects
 */
router.get('/research/projects', async (req, res) => {
  try {
    const universityId = req.query.university_id ? parseInt(req.query.university_id as string) : undefined;
    const researchArea = req.query.research_area as string;
    const civilizationId = req.query.civilization_id ? parseInt(req.query.civilization_id as string) : undefined;
    
    const service = getEducationService();
    let projects;
    
    if (universityId) {
      projects = await service.getResearchProjectsByUniversity(universityId);
    } else if (researchArea) {
      projects = await service.getResearchProjectsByArea(researchArea, civilizationId);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either university_id or research_area must be provided'
      });
    }
    
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching research projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/education/research/projects - Create new research project
 */
router.post('/research/projects', async (req, res) => {
  try {
    const service = getEducationService();
    const project = await service.createResearchProject(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating research project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create research project',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/education/research/grants/:civilizationId - Get research grants
 */
router.get('/research/grants/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    const service = getEducationService();
    const grants = await service.getResearchGrants(civilizationId);
    
    res.json({
      success: true,
      data: grants
    });
  } catch (error) {
    console.error('Error fetching research grants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research grants',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/education/research/grants - Create new research grant
 */
router.post('/research/grants', async (req, res) => {
  try {
    const service = getEducationService();
    const grant = await service.createResearchGrant(req.body);
    
    res.status(201).json({
      success: true,
      data: grant
    });
  } catch (error) {
    console.error('Error creating research grant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create research grant',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/education/research/priorities/:civilizationId - Get research priorities
 */
router.get('/research/priorities/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    const service = getEducationService();
    const priorities = await service.getResearchPriorities(civilizationId);
    
    res.json({
      success: true,
      data: priorities
    });
  } catch (error) {
    console.error('Error fetching research priorities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research priorities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/education/research/priorities/:civilizationId - Set research priorities
 */
router.put('/research/priorities/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const priorities = req.body.priorities || [];
    
    const service = getEducationService();
    const updatedPriorities = await service.setResearchPriorities(civilizationId, priorities);
    
    res.json({
      success: true,
      data: updatedPriorities
    });
  } catch (error) {
    console.error('Error setting research priorities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set research priorities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/education/research/budget/:civilizationId - Get research budget
 */
router.get('/research/budget/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const fiscalYear = req.query.fiscal_year ? parseInt(req.query.fiscal_year as string) : undefined;
    
    const service = getEducationService();
    const budget = await service.getResearchBudget(civilizationId, fiscalYear);
    
    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Error fetching research budget:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research budget',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/education/research/budget/:civilizationId/:fiscalYear - Update research budget
 */
router.put('/research/budget/:civilizationId/:fiscalYear', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const fiscalYear = parseInt(req.params.fiscalYear);
    
    const service = getEducationService();
    const budget = await service.updateResearchBudget(civilizationId, fiscalYear, req.body);
    
    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Error updating research budget:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update research budget',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/education/research/dashboard/:civilizationId - Get research dashboard
 */
router.get('/research/dashboard/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    const service = getEducationService();
    const dashboard = await service.getResearchDashboard(civilizationId);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Error fetching research dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research dashboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/education/secretary/:civilizationId - Get education secretary
 */
router.get('/secretary/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    const service = getEducationService();
    const secretary = await service.getEducationSecretary(civilizationId);
    
    res.json({
      success: true,
      data: secretary
    });
  } catch (error) {
    console.error('Error fetching education secretary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch education secretary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/education/secretary/:civilizationId - Update education secretary
 */
router.put('/secretary/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    const service = getEducationService();
    const secretary = await service.updateEducationSecretary(civilizationId, req.body);
    
    res.json({
      success: true,
      data: secretary
    });
  } catch (error) {
    console.error('Error updating education secretary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update education secretary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

let educationService: any;

export async function initializeEducationRoutes(pool: Pool): Promise<void> {
  // Service initialization is handled in EducationService.ts
  console.log('✅ Education routes initialized');
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'education', educationKnobSystem, applyEducationKnobsToGameState);

export default router;
