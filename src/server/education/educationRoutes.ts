import express from 'express';
import { Pool } from 'pg';
import { getEducationService } from './EducationService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

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

// Root education endpoint that returns all education data
router.get('/', async (req, res) => {
  try {
    // Return comprehensive education data structure that matches frontend expectations
    const educationData = {
      metrics: {
        totalStudents: 2456789,
        totalInstitutions: 12456,
        totalTeachers: 234567,
        literacyRate: 98.7,
        graduationRate: 94.2,
        totalBudget: 45600000000,
        averageClassSize: 22,
        teacherStudentRatio: 1.2
      },
      levels: [
        {
          level: 'Pre-K (Ages 3-5)',
          students: 156789,
          institutions: 2345,
          teachers: 12456,
          budget: 2300000000,
          graduationRate: 99.1,
          averageAge: '4 years',
          description: 'Early childhood education focusing on social skills, basic literacy, and cognitive development'
        },
        {
          level: 'Elementary (K-5)',
          students: 567890,
          institutions: 3456,
          teachers: 45678,
          budget: 8900000000,
          graduationRate: 98.5,
          averageAge: '6-11 years',
          description: 'Foundation education covering reading, writing, mathematics, science, and social studies'
        },
        {
          level: 'Middle School (6-8)',
          students: 345678,
          institutions: 1789,
          teachers: 34567,
          budget: 6700000000,
          graduationRate: 96.8,
          averageAge: '12-14 years',
          description: 'Transitional education with specialized subjects and preparation for high school'
        },
        {
          level: 'High School (9-12)',
          students: 456789,
          institutions: 2134,
          teachers: 56789,
          budget: 12300000000,
          graduationRate: 94.2,
          averageAge: '15-18 years',
          description: 'Advanced secondary education with college prep, career tracks, and specialized programs'
        },
        {
          level: 'Community Colleges',
          students: 234567,
          institutions: 456,
          teachers: 23456,
          budget: 4500000000,
          graduationRate: 87.3,
          averageAge: '19-25 years',
          description: 'Two-year institutions offering associate degrees, certificates, and transfer programs'
        },
        {
          level: 'Universities',
          students: 456789,
          institutions: 234,
          teachers: 45678,
          budget: 15600000000,
          graduationRate: 89.7,
          averageAge: '18-22 years',
          description: 'Four-year institutions offering bachelor\'s, master\'s, and doctoral degrees'
        },
        {
          level: 'Trade Schools',
          students: 123456,
          institutions: 567,
          teachers: 12345,
          budget: 2300000000,
          graduationRate: 92.1,
          averageAge: '18-30 years',
          description: 'Specialized vocational training for specific trades and technical skills'
        }
      ],
      institutions: [
        {
          id: 'inst-1',
          name: 'Capital University',
          type: 'university',
          publicPrivate: 'Public',
          location: 'Capital City',
          rating: 9.2,
          students: 45678,
          teachers: 2345,
          established: 1895,
          specializations: ['Engineering', 'Medicine', 'Business', 'Arts']
        },
        {
          id: 'inst-2',
          name: 'Metropolitan Community College',
          type: 'community-college',
          publicPrivate: 'Public',
          location: 'Metro District',
          rating: 8.7,
          students: 23456,
          teachers: 1234,
          established: 1965,
          specializations: ['Technology', 'Healthcare', 'Business', 'Liberal Arts']
        },
        {
          id: 'inst-3',
          name: 'Stellar High School',
          type: 'high',
          publicPrivate: 'Public',
          location: 'Stellar District',
          rating: 8.9,
          students: 2345,
          teachers: 156,
          established: 1950,
          specializations: ['STEM', 'Arts', 'Athletics', 'College Prep']
        }
      ],
      curriculum: [
        {
          level: 'Elementary',
          subjects: ['Mathematics', 'Reading', 'Writing', 'Science', 'Social Studies', 'Physical Education', 'Arts'],
          requirements: ['Core Math', 'Language Arts', 'Basic Science', 'History', 'Physical Education'],
          electives: ['Music', 'Art', 'Computer Science', 'Foreign Language'],
          assessments: ['Standardized Testing', 'Portfolio Assessment', 'Teacher Evaluation']
        },
        {
          level: 'High School',
          subjects: ['Advanced Mathematics', 'Literature', 'Biology', 'Chemistry', 'Physics', 'History', 'Government', 'Economics'],
          requirements: ['Algebra I & II', 'English I-IV', 'Biology', 'Chemistry', 'US History', 'Government', 'Physical Education'],
          electives: ['Advanced Placement', 'International Baccalaureate', 'Career Technical Education', 'Fine Arts', 'Foreign Languages'],
          assessments: ['Standardized Testing', 'AP Exams', 'Portfolio Assessment', 'College Entrance Exams']
        }
      ],
      teachers: [
        {
          id: 'teacher-1',
          name: 'Dr. Sarah Johnson',
          level: 'University',
          institution: 'Capital University',
          rating: 9.1,
          subjects: ['Mathematics', 'Statistics'],
          experience: '15 years',
          qualifications: ['PhD Mathematics', 'Teaching Certificate', 'Research Experience']
        },
        {
          id: 'teacher-2',
          name: 'Prof. Michael Chen',
          level: 'High School',
          institution: 'Stellar High School',
          rating: 8.8,
          subjects: ['Physics', 'Chemistry'],
          experience: '12 years',
          qualifications: ['Masters Physics', 'Teaching Certificate', 'STEM Specialist']
        }
      ]
    };

    res.json({
      success: true,
      data: educationData
    });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch education data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

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
