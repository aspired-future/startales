// Education System Interfaces

// Core Education Levels
export type EducationLevel = 
  | 'preschool' 
  | 'primary' 
  | 'secondary' 
  | 'middle_school' 
  | 'high_school' 
  | 'trade_school' 
  | 'community_college' 
  | 'college' 
  | 'university' 
  | 'graduate_school';

export type UniversityType = 'public' | 'private' | 'research' | 'liberal_arts' | 'technical' | 'specialized';
export type AccreditationLevel = 'regional' | 'national' | 'international' | 'specialized' | 'provisional';
export type FacultyPosition = 'assistant_professor' | 'associate_professor' | 'full_professor' | 'lecturer' | 'researcher' | 'department_head';
export type TenureStatus = 'tenured' | 'tenure_track' | 'non_tenure' | 'visiting' | 'emeritus';
export type ResearchCategory = 'basic' | 'applied' | 'translational' | 'clinical' | 'theoretical';
export type ProjectStatus = 'proposed' | 'funded' | 'active' | 'completed' | 'suspended' | 'cancelled';
export type FundingSource = 'government' | 'private' | 'industry' | 'international' | 'internal' | 'mixed';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | 'monitoring';
export type ResearchArea = 
  | 'quantum_computing' 
  | 'artificial_intelligence' 
  | 'biotechnology' 
  | 'space_exploration' 
  | 'energy_systems' 
  | 'materials_science' 
  | 'environmental_science' 
  | 'medicine' 
  | 'social_sciences' 
  | 'economics' 
  | 'defense_technology' 
  | 'agriculture' 
  | 'transportation' 
  | 'communications';

// University System
export interface University {
  id: number;
  civilization_id: number;
  name: string;
  location: string;
  founded_year: number;
  university_type: UniversityType;
  accreditation_level: AccreditationLevel;
  total_students: number;
  faculty_count: number;
  endowment: number;
  annual_budget: number;
  research_budget: number;
  tuition_cost: number;
  acceptance_rate: number;
  graduation_rate: number;
  reputation_score: number; // 1-100
  research_output_score: number; // 1-100
  teaching_quality_score: number; // 1-100
  facilities_quality: number; // 1-100
  campus_size_hectares: number;
  established_specializations: string[];
  research_focus_areas: ResearchArea[];
  notable_alumni: string[];
  partnerships: string[];
  created_at: Date;
}

export interface AcademicDepartment {
  id: number;
  university_id: number;
  department_name: string;
  field_of_study: string;
  department_head: string;
  faculty_count: number;
  student_count: number;
  annual_budget: number;
  research_budget: number;
  research_projects: number;
  publications_per_year: number;
  department_ranking: number; // 1-100
  equipment_quality: number; // 1-100
  industry_partnerships: string[];
  created_at: Date;
}

export interface DegreeProgram {
  id: number;
  department_id: number;
  program_name: string;
  degree_type: string; // Bachelor's, Master's, PhD, etc.
  program_duration_years: number;
  credit_hours_required: number;
  enrollment_capacity: number;
  current_enrollment: number;
  graduation_requirements: string[];
  career_outcomes: string[];
  industry_partnerships: string[];
  accreditation_status: string;
  tuition_per_year: number;
  created_at: Date;
}

export interface Student {
  id: number;
  university_id: number;
  department_id: number;
  program_id: number;
  student_name: string;
  age: number;
  enrollment_status: string;
  year_level: number;
  gpa: number;
  major: string;
  minor?: string;
  research_participation: boolean;
  financial_aid_amount: number;
  graduation_date?: Date;
  career_goals: string[];
  extracurricular_activities: string[];
  created_at: Date;
}

export interface Faculty {
  id: number;
  university_id: number;
  department_id: number;
  faculty_name: string;
  position: FacultyPosition;
  tenure_status: TenureStatus;
  specialization: string[];
  education_background: string;
  years_experience: number;
  annual_salary: number;
  research_grants: number;
  publications_count: number;
  teaching_load: number; // courses per semester
  research_focus: string[];
  awards_honors: string[];
  industry_experience: string[];
  created_at: Date;
}

// Research System
export interface ResearchProject {
  id: number;
  university_id: number;
  department_id: number;
  principal_investigator_id: number;
  project_title: string;
  research_area: ResearchArea;
  research_category: ResearchCategory;
  funding_source: FundingSource;
  total_funding: number;
  funding_received: number;
  project_duration_months: number;
  start_date: Date;
  end_date: Date;
  project_status: ProjectStatus;
  research_team_size: number;
  expected_outcomes: string[];
  current_progress: number; // 0-100%
  publications_generated: number;
  patents_filed: number;
  industry_applications: string[];
  collaboration_partners: string[];
  created_at: Date;
}

export interface ResearchGrant {
  id: number;
  civilization_id: number;
  grant_program: string;
  funding_agency: string;
  research_area: ResearchArea;
  priority_level: PriorityLevel;
  total_allocation: number;
  allocated_amount: number;
  remaining_budget: number;
  application_deadline: Date;
  funding_period_years: number;
  eligibility_criteria: string[];
  evaluation_criteria: string[];
  success_rate: number; // percentage
  average_grant_size: number;
  grants_awarded: number;
  applications_received: number;
  created_at: Date;
}

export interface ResearchPriority {
  id: number;
  civilization_id: number;
  research_area: ResearchArea;
  priority_level: number; // 1-10 scale
  funding_percentage: number; // % of total research budget
  strategic_importance: string;
  expected_outcomes: string[];
  timeline_years: number;
  success_metrics: string[];
  leader_notes?: string;
  last_updated: Date;
  created_at: Date;
}

export interface ResearchBudget {
  id: number;
  civilization_id: number;
  fiscal_year: number;
  total_research_budget: number;
  allocated_budget: number;
  spent_budget: number;
  emergency_reserve: number;
  international_collaboration_fund: number;
  infrastructure_investment: number;
  talent_development_fund: number;
  innovation_incentives: number;
  budget_categories: ResearchBudgetCategory[];
  created_at: Date;
}

export interface ResearchBudgetCategory {
  id: number;
  budget_id: number;
  research_area: ResearchArea;
  allocated_amount: number;
  spent_amount: number;
  committed_amount: number;
  priority_level: number;
  projects_funded: number;
  success_rate: number;
}

export interface ResearchOutput {
  id: number;
  university_id: number;
  project_id: number;
  faculty_id: number;
  output_type: string; // publication, patent, prototype, etc.
  title: string;
  description: string;
  publication_date: Date;
  journal_conference?: string;
  impact_factor?: number;
  citations_count: number;
  commercial_potential: string; // high, medium, low
  technology_readiness_level: number; // 1-9
  industry_interest: string[];
  collaboration_partners: string[];
  created_at: Date;
}

// Grant Application System
export interface GrantApplication {
  id: number;
  grant_id: number;
  university_id: number;
  principal_investigator_id: number;
  application_title: string;
  requested_amount: number;
  project_duration_months: number;
  application_status: string;
  submission_date: Date;
  review_score?: number;
  reviewer_comments?: string;
  funding_decision?: string;
  awarded_amount?: number;
  project_abstract: string;
  methodology: string;
  expected_impact: string;
  budget_breakdown: any; // JSON
  team_qualifications: string[];
  created_at: Date;
}

export interface ResearchEvaluation {
  id: number;
  project_id: number;
  evaluation_date: Date;
  evaluator_name: string;
  evaluation_type: string; // annual, final, milestone
  progress_score: number; // 1-10
  quality_score: number; // 1-10
  impact_score: number; // 1-10
  budget_efficiency: number; // 1-10
  timeline_adherence: number; // 1-10
  recommendations: string[];
  concerns: string[];
  future_funding_recommendation: string;
  created_at: Date;
}

// Education Metrics and Analytics
export interface EducationMetrics {
  id: number;
  civilization_id: number;
  metric_date: Date;
  total_universities: number;
  total_students: number;
  total_faculty: number;
  graduation_rate: number;
  employment_rate: number;
  research_output_index: number;
  innovation_index: number;
  international_ranking: number;
  education_spending_gdp: number;
  research_spending_gdp: number;
  literacy_rate: number;
  stem_graduates_percentage: number;
  skills_gap_index: number;
  created_at: Date;
}

export interface EducationPolicy {
  id: number;
  civilization_id: number;
  policy_name: string;
  policy_type: string;
  description: string;
  implementation_date: Date;
  target_outcomes: string[];
  success_metrics: string[];
  budget_allocation: number;
  affected_institutions: string[];
  policy_status: string;
  effectiveness_score?: number;
  created_at: Date;
}

// International Collaboration
export interface InternationalCollaboration {
  id: number;
  university_id: number;
  partner_civilization_id: number;
  partner_institution: string;
  collaboration_type: string;
  research_areas: ResearchArea[];
  start_date: Date;
  end_date?: Date;
  collaboration_status: string;
  joint_projects: number;
  student_exchanges: number;
  faculty_exchanges: number;
  shared_funding: number;
  publications_joint: number;
  benefits_achieved: string[];
  challenges_faced: string[];
  created_at: Date;
}

// Skills Development and Workforce Alignment
export interface SkillsDevelopment {
  id: number;
  civilization_id: number;
  skill_category: string;
  current_supply: number;
  projected_demand: number;
  skills_gap: number;
  training_programs: number;
  success_rate: number;
  industry_partnerships: string[];
  funding_allocated: number;
  graduates_placed: number;
  salary_outcomes: number;
  created_at: Date;
}

// Education Secretary (Cabinet Member)
export interface EducationSecretary {
  id: number;
  civilization_id: number;
  secretary_name: string;
  appointment_date: Date;
  background: string;
  education_credentials: string[];
  previous_experience: string[];
  policy_priorities: string[];
  key_initiatives: string[];
  budget_authority: number;
  performance_metrics: any; // JSON
  achievements: string[];
  challenges_faced: string[];
  approval_rating: number;
  term_end_date?: Date;
  created_at: Date;
}

// Comprehensive Views and Dashboards
export interface UniversityProfile {
  university: University;
  departments: AcademicDepartment[];
  research_projects: ResearchProject[];
  faculty_highlights: Faculty[];
  student_demographics: any;
  research_output: ResearchOutput[];
  rankings: any;
  financial_summary: any;
}

export interface ResearchDashboard {
  total_projects: number;
  total_funding: number;
  active_grants: ResearchGrant[];
  research_priorities: ResearchPriority[];
  budget_allocation: ResearchBudgetCategory[];
  recent_outputs: ResearchOutput[];
  collaboration_stats: any;
  innovation_metrics: any;
}

export interface EducationOverview {
  system_metrics: EducationMetrics;
  universities: University[];
  research_summary: any;
  policy_status: EducationPolicy[];
  budget_summary: ResearchBudget | null;
  international_rankings: any;
  workforce_alignment: any;
}
