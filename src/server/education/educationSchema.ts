import { Pool } from 'pg';

export async function initializeEducationSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create universities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        name VARCHAR(200) NOT NULL,
        location VARCHAR(200) NOT NULL,
        founded_year INTEGER NOT NULL,
        university_type VARCHAR(50) NOT NULL CHECK (university_type IN ('public', 'private', 'research', 'liberal_arts', 'technical', 'specialized')),
        accreditation_level VARCHAR(50) NOT NULL CHECK (accreditation_level IN ('regional', 'national', 'international', 'specialized', 'provisional')),
        total_students INTEGER DEFAULT 0,
        faculty_count INTEGER DEFAULT 0,
        endowment BIGINT DEFAULT 0,
        annual_budget BIGINT DEFAULT 0,
        research_budget BIGINT DEFAULT 0,
        tuition_cost INTEGER DEFAULT 0,
        acceptance_rate DECIMAL(5,2) DEFAULT 50.0,
        graduation_rate DECIMAL(5,2) DEFAULT 75.0,
        reputation_score INTEGER DEFAULT 50 CHECK (reputation_score >= 1 AND reputation_score <= 100),
        research_output_score INTEGER DEFAULT 50 CHECK (research_output_score >= 1 AND research_output_score <= 100),
        teaching_quality_score INTEGER DEFAULT 50 CHECK (teaching_quality_score >= 1 AND teaching_quality_score <= 100),
        facilities_quality INTEGER DEFAULT 50 CHECK (facilities_quality >= 1 AND facilities_quality <= 100),
        campus_size_hectares INTEGER DEFAULT 100,
        established_specializations JSONB DEFAULT '[]',
        research_focus_areas JSONB DEFAULT '[]',
        notable_alumni JSONB DEFAULT '[]',
        partnerships JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create academic_departments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS academic_departments (
        id SERIAL PRIMARY KEY,
        university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
        department_name VARCHAR(200) NOT NULL,
        field_of_study VARCHAR(100) NOT NULL,
        department_head VARCHAR(200),
        faculty_count INTEGER DEFAULT 0,
        student_count INTEGER DEFAULT 0,
        annual_budget BIGINT DEFAULT 0,
        research_budget BIGINT DEFAULT 0,
        research_projects INTEGER DEFAULT 0,
        publications_per_year INTEGER DEFAULT 0,
        department_ranking INTEGER DEFAULT 50 CHECK (department_ranking >= 1 AND department_ranking <= 100),
        equipment_quality INTEGER DEFAULT 50 CHECK (equipment_quality >= 1 AND equipment_quality <= 100),
        industry_partnerships JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create degree_programs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS degree_programs (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES academic_departments(id) ON DELETE CASCADE,
        program_name VARCHAR(200) NOT NULL,
        degree_type VARCHAR(50) NOT NULL,
        program_duration_years INTEGER DEFAULT 4,
        credit_hours_required INTEGER DEFAULT 120,
        enrollment_capacity INTEGER DEFAULT 100,
        current_enrollment INTEGER DEFAULT 0,
        graduation_requirements JSONB DEFAULT '[]',
        career_outcomes JSONB DEFAULT '[]',
        industry_partnerships JSONB DEFAULT '[]',
        accreditation_status VARCHAR(50) DEFAULT 'accredited',
        tuition_per_year INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create students table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
        department_id INTEGER REFERENCES academic_departments(id) ON DELETE CASCADE,
        program_id INTEGER REFERENCES degree_programs(id) ON DELETE CASCADE,
        student_name VARCHAR(200) NOT NULL,
        age INTEGER NOT NULL,
        enrollment_status VARCHAR(50) DEFAULT 'active',
        year_level INTEGER DEFAULT 1,
        gpa DECIMAL(3,2) DEFAULT 0.0,
        major VARCHAR(100) NOT NULL,
        minor VARCHAR(100),
        research_participation BOOLEAN DEFAULT false,
        financial_aid_amount INTEGER DEFAULT 0,
        graduation_date DATE,
        career_goals JSONB DEFAULT '[]',
        extracurricular_activities JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create faculty table
    await client.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id SERIAL PRIMARY KEY,
        university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
        department_id INTEGER REFERENCES academic_departments(id) ON DELETE CASCADE,
        faculty_name VARCHAR(200) NOT NULL,
        position VARCHAR(50) NOT NULL CHECK (position IN ('assistant_professor', 'associate_professor', 'full_professor', 'lecturer', 'researcher', 'department_head')),
        tenure_status VARCHAR(50) NOT NULL CHECK (tenure_status IN ('tenured', 'tenure_track', 'non_tenure', 'visiting', 'emeritus')),
        specialization JSONB DEFAULT '[]',
        education_background TEXT,
        years_experience INTEGER DEFAULT 0,
        annual_salary INTEGER DEFAULT 60000,
        research_grants BIGINT DEFAULT 0,
        publications_count INTEGER DEFAULT 0,
        teaching_load INTEGER DEFAULT 3,
        research_focus JSONB DEFAULT '[]',
        awards_honors JSONB DEFAULT '[]',
        industry_experience JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create research_projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_projects (
        id SERIAL PRIMARY KEY,
        university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
        department_id INTEGER REFERENCES academic_departments(id) ON DELETE CASCADE,
        principal_investigator_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
        project_title VARCHAR(300) NOT NULL,
        research_area VARCHAR(50) NOT NULL,
        research_category VARCHAR(50) NOT NULL CHECK (research_category IN ('basic', 'applied', 'translational', 'clinical', 'theoretical')),
        funding_source VARCHAR(50) NOT NULL CHECK (funding_source IN ('government', 'private', 'industry', 'international', 'internal', 'mixed')),
        total_funding BIGINT DEFAULT 0,
        funding_received BIGINT DEFAULT 0,
        project_duration_months INTEGER DEFAULT 12,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        project_status VARCHAR(50) DEFAULT 'proposed' CHECK (project_status IN ('proposed', 'funded', 'active', 'completed', 'suspended', 'cancelled')),
        research_team_size INTEGER DEFAULT 1,
        expected_outcomes JSONB DEFAULT '[]',
        current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0 AND current_progress <= 100),
        publications_generated INTEGER DEFAULT 0,
        patents_filed INTEGER DEFAULT 0,
        industry_applications JSONB DEFAULT '[]',
        collaboration_partners JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create research_grants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_grants (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        grant_program VARCHAR(200) NOT NULL,
        funding_agency VARCHAR(200) NOT NULL,
        research_area VARCHAR(50) NOT NULL,
        priority_level VARCHAR(50) NOT NULL CHECK (priority_level IN ('critical', 'high', 'medium', 'low', 'monitoring')),
        total_allocation BIGINT DEFAULT 0,
        allocated_amount BIGINT DEFAULT 0,
        remaining_budget BIGINT DEFAULT 0,
        application_deadline DATE NOT NULL,
        funding_period_years INTEGER DEFAULT 3,
        eligibility_criteria JSONB DEFAULT '[]',
        evaluation_criteria JSONB DEFAULT '[]',
        success_rate DECIMAL(5,2) DEFAULT 25.0,
        average_grant_size INTEGER DEFAULT 500000,
        grants_awarded INTEGER DEFAULT 0,
        applications_received INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create research_priorities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_priorities (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        research_area VARCHAR(50) NOT NULL,
        priority_level INTEGER DEFAULT 5 CHECK (priority_level >= 1 AND priority_level <= 10),
        funding_percentage DECIMAL(5,2) DEFAULT 10.0,
        strategic_importance TEXT,
        expected_outcomes JSONB DEFAULT '[]',
        timeline_years INTEGER DEFAULT 5,
        success_metrics JSONB DEFAULT '[]',
        leader_notes TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create research_budgets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_budgets (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        fiscal_year INTEGER NOT NULL,
        total_research_budget BIGINT DEFAULT 0,
        allocated_budget BIGINT DEFAULT 0,
        spent_budget BIGINT DEFAULT 0,
        emergency_reserve BIGINT DEFAULT 0,
        international_collaboration_fund BIGINT DEFAULT 0,
        infrastructure_investment BIGINT DEFAULT 0,
        talent_development_fund BIGINT DEFAULT 0,
        innovation_incentives BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, fiscal_year)
      )
    `);

    // Create research_budget_categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_budget_categories (
        id SERIAL PRIMARY KEY,
        budget_id INTEGER REFERENCES research_budgets(id) ON DELETE CASCADE,
        research_area VARCHAR(50) NOT NULL,
        allocated_amount BIGINT DEFAULT 0,
        spent_amount BIGINT DEFAULT 0,
        committed_amount BIGINT DEFAULT 0,
        priority_level INTEGER DEFAULT 5 CHECK (priority_level >= 1 AND priority_level <= 10),
        projects_funded INTEGER DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0
      )
    `);

    // Create research_outputs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_outputs (
        id SERIAL PRIMARY KEY,
        university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
        project_id INTEGER REFERENCES research_projects(id) ON DELETE CASCADE,
        faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
        output_type VARCHAR(50) NOT NULL,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        publication_date DATE NOT NULL,
        journal_conference VARCHAR(200),
        impact_factor DECIMAL(6,3),
        citations_count INTEGER DEFAULT 0,
        commercial_potential VARCHAR(50) DEFAULT 'medium',
        technology_readiness_level INTEGER DEFAULT 1 CHECK (technology_readiness_level >= 1 AND technology_readiness_level <= 9),
        industry_interest JSONB DEFAULT '[]',
        collaboration_partners JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create grant_applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS grant_applications (
        id SERIAL PRIMARY KEY,
        grant_id INTEGER REFERENCES research_grants(id) ON DELETE CASCADE,
        university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
        principal_investigator_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
        application_title VARCHAR(300) NOT NULL,
        requested_amount BIGINT NOT NULL,
        project_duration_months INTEGER DEFAULT 12,
        application_status VARCHAR(50) DEFAULT 'submitted',
        submission_date DATE NOT NULL,
        review_score DECIMAL(3,1),
        reviewer_comments TEXT,
        funding_decision VARCHAR(50),
        awarded_amount BIGINT,
        project_abstract TEXT NOT NULL,
        methodology TEXT NOT NULL,
        expected_impact TEXT NOT NULL,
        budget_breakdown JSONB DEFAULT '{}',
        team_qualifications JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create research_evaluations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_evaluations (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES research_projects(id) ON DELETE CASCADE,
        evaluation_date DATE NOT NULL,
        evaluator_name VARCHAR(200) NOT NULL,
        evaluation_type VARCHAR(50) NOT NULL,
        progress_score INTEGER CHECK (progress_score >= 1 AND progress_score <= 10),
        quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
        impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
        budget_efficiency INTEGER CHECK (budget_efficiency >= 1 AND budget_efficiency <= 10),
        timeline_adherence INTEGER CHECK (timeline_adherence >= 1 AND timeline_adherence <= 10),
        recommendations JSONB DEFAULT '[]',
        concerns JSONB DEFAULT '[]',
        future_funding_recommendation VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create education_metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS education_metrics (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        metric_date DATE NOT NULL,
        total_universities INTEGER DEFAULT 0,
        total_students INTEGER DEFAULT 0,
        total_faculty INTEGER DEFAULT 0,
        graduation_rate DECIMAL(5,2) DEFAULT 0,
        employment_rate DECIMAL(5,2) DEFAULT 0,
        research_output_index DECIMAL(6,2) DEFAULT 0,
        innovation_index DECIMAL(6,2) DEFAULT 0,
        international_ranking INTEGER DEFAULT 0,
        education_spending_gdp DECIMAL(5,2) DEFAULT 0,
        research_spending_gdp DECIMAL(5,2) DEFAULT 0,
        literacy_rate DECIMAL(5,2) DEFAULT 0,
        stem_graduates_percentage DECIMAL(5,2) DEFAULT 0,
        skills_gap_index DECIMAL(6,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create education_policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS education_policies (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        policy_name VARCHAR(200) NOT NULL,
        policy_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        implementation_date DATE NOT NULL,
        target_outcomes JSONB DEFAULT '[]',
        success_metrics JSONB DEFAULT '[]',
        budget_allocation BIGINT DEFAULT 0,
        affected_institutions JSONB DEFAULT '[]',
        policy_status VARCHAR(50) DEFAULT 'active',
        effectiveness_score INTEGER CHECK (effectiveness_score >= 1 AND effectiveness_score <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create international_collaborations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS international_collaborations (
        id SERIAL PRIMARY KEY,
        university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
        partner_civilization_id INTEGER NOT NULL,
        partner_institution VARCHAR(200) NOT NULL,
        collaboration_type VARCHAR(100) NOT NULL,
        research_areas JSONB DEFAULT '[]',
        start_date DATE NOT NULL,
        end_date DATE,
        collaboration_status VARCHAR(50) DEFAULT 'active',
        joint_projects INTEGER DEFAULT 0,
        student_exchanges INTEGER DEFAULT 0,
        faculty_exchanges INTEGER DEFAULT 0,
        shared_funding BIGINT DEFAULT 0,
        publications_joint INTEGER DEFAULT 0,
        benefits_achieved JSONB DEFAULT '[]',
        challenges_faced JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create skills_development table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills_development (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        skill_category VARCHAR(100) NOT NULL,
        current_supply INTEGER DEFAULT 0,
        projected_demand INTEGER DEFAULT 0,
        skills_gap INTEGER DEFAULT 0,
        training_programs INTEGER DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0,
        industry_partnerships JSONB DEFAULT '[]',
        funding_allocated BIGINT DEFAULT 0,
        graduates_placed INTEGER DEFAULT 0,
        salary_outcomes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create education_secretaries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS education_secretaries (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        secretary_name VARCHAR(200) NOT NULL,
        appointment_date DATE NOT NULL,
        background TEXT,
        education_credentials JSONB DEFAULT '[]',
        previous_experience JSONB DEFAULT '[]',
        policy_priorities JSONB DEFAULT '[]',
        key_initiatives JSONB DEFAULT '[]',
        budget_authority BIGINT DEFAULT 0,
        performance_metrics JSONB DEFAULT '{}',
        achievements JSONB DEFAULT '[]',
        challenges_faced JSONB DEFAULT '[]',
        approval_rating INTEGER DEFAULT 50 CHECK (approval_rating >= 0 AND approval_rating <= 100),
        term_end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_universities_civilization ON universities(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_universities_type ON universities(university_type);
      CREATE INDEX IF NOT EXISTS idx_universities_reputation ON universities(reputation_score);
      
      CREATE INDEX IF NOT EXISTS idx_departments_university ON academic_departments(university_id);
      CREATE INDEX IF NOT EXISTS idx_departments_field ON academic_departments(field_of_study);
      
      CREATE INDEX IF NOT EXISTS idx_students_university ON students(university_id);
      CREATE INDEX IF NOT EXISTS idx_students_status ON students(enrollment_status);
      
      CREATE INDEX IF NOT EXISTS idx_faculty_university ON faculty(university_id);
      CREATE INDEX IF NOT EXISTS idx_faculty_position ON faculty(position);
      
      CREATE INDEX IF NOT EXISTS idx_research_projects_university ON research_projects(university_id);
      CREATE INDEX IF NOT EXISTS idx_research_projects_area ON research_projects(research_area);
      CREATE INDEX IF NOT EXISTS idx_research_projects_status ON research_projects(project_status);
      
      CREATE INDEX IF NOT EXISTS idx_research_grants_civilization ON research_grants(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_research_grants_area ON research_grants(research_area);
      CREATE INDEX IF NOT EXISTS idx_research_grants_priority ON research_grants(priority_level);
      
      CREATE INDEX IF NOT EXISTS idx_research_priorities_civilization ON research_priorities(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_research_budgets_civilization ON research_budgets(civilization_id, fiscal_year);
      
      CREATE INDEX IF NOT EXISTS idx_research_outputs_university ON research_outputs(university_id);
      CREATE INDEX IF NOT EXISTS idx_research_outputs_date ON research_outputs(publication_date);
      
      CREATE INDEX IF NOT EXISTS idx_grant_applications_grant ON grant_applications(grant_id);
      CREATE INDEX IF NOT EXISTS idx_grant_applications_university ON grant_applications(university_id);
      
      CREATE INDEX IF NOT EXISTS idx_education_metrics_civilization ON education_metrics(civilization_id, metric_date);
      CREATE INDEX IF NOT EXISTS idx_education_policies_civilization ON education_policies(civilization_id);
      
      CREATE INDEX IF NOT EXISTS idx_collaborations_university ON international_collaborations(university_id);
      CREATE INDEX IF NOT EXISTS idx_skills_development_civilization ON skills_development(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_education_secretaries_civilization ON education_secretaries(civilization_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Education System schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Education System schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
