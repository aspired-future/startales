import { Pool } from 'pg';

/**
 * Initialize Supreme Court Advisory System database schema
 */
export async function initializeSupremeCourtSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Constitutional Reviews
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutional_reviews (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        review_type VARCHAR(50) NOT NULL, -- 'law_review', 'policy_analysis', 'amendment_review', 'emergency_powers', etc.
        review_title VARCHAR(200) NOT NULL,
        subject_matter TEXT NOT NULL,
        constitutional_provisions JSONB NOT NULL DEFAULT '[]',
        legal_precedents JSONB NOT NULL DEFAULT '[]',
        constitutional_analysis TEXT NOT NULL,
        legal_reasoning TEXT NOT NULL,
        rights_impact_assessment TEXT NOT NULL,
        recommendation_summary TEXT NOT NULL,
        detailed_opinion TEXT NOT NULL,
        constitutional_compliance VARCHAR(20) CHECK (constitutional_compliance IN ('compliant', 'questionable', 'non_compliant', 'requires_modification')),
        confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
        urgency_level VARCHAR(20) CHECK (urgency_level IN ('routine', 'important', 'urgent', 'emergency')),
        alternative_approaches JSONB NOT NULL DEFAULT '[]',
        implementation_guidance TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'modified', 'rejected')),
        leader_response TEXT,
        leader_decision VARCHAR(20) CHECK (leader_decision IN ('accept', 'modify', 'reject', 'defer')),
        leader_modifications TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        reviewed_at TIMESTAMP,
        decided_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Supreme Court Justices
    await client.query(`
      CREATE TABLE IF NOT EXISTS supreme_court_justices (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        justice_name VARCHAR(100) NOT NULL,
        appointment_date TIMESTAMP NOT NULL,
        judicial_philosophy VARCHAR(50) NOT NULL, -- 'originalist', 'living_constitution', 'textualist', 'pragmatist', etc.
        specialization JSONB NOT NULL DEFAULT '[]', -- Areas of legal expertise
        tenure_status VARCHAR(20) DEFAULT 'active' CHECK (tenure_status IN ('active', 'senior', 'retired', 'deceased')),
        appointment_authority VARCHAR(50) NOT NULL, -- Who appointed them
        confirmation_process JSONB NOT NULL DEFAULT '{}',
        judicial_record JSONB NOT NULL DEFAULT '{}',
        notable_opinions JSONB NOT NULL DEFAULT '[]',
        recusal_patterns JSONB NOT NULL DEFAULT '[]',
        public_approval_rating DECIMAL(4,1) CHECK (public_approval_rating BETWEEN 0 AND 100),
        legal_scholarship INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Legal Precedents
    await client.query(`
      CREATE TABLE IF NOT EXISTS legal_precedents (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        case_name VARCHAR(200) NOT NULL,
        case_citation VARCHAR(100) NOT NULL,
        decision_date TIMESTAMP NOT NULL,
        court_level VARCHAR(50) NOT NULL, -- 'supreme_court', 'appellate_court', 'trial_court'
        case_type VARCHAR(50) NOT NULL, -- 'constitutional', 'criminal', 'civil', 'administrative', etc.
        legal_issues JSONB NOT NULL DEFAULT '[]',
        constitutional_provisions JSONB NOT NULL DEFAULT '[]',
        case_summary TEXT NOT NULL,
        legal_holding TEXT NOT NULL,
        legal_reasoning TEXT NOT NULL,
        dissenting_opinions TEXT,
        concurring_opinions TEXT,
        precedential_value VARCHAR(20) CHECK (precedential_value IN ('binding', 'persuasive', 'distinguishable', 'overruled')),
        cited_precedents JSONB NOT NULL DEFAULT '[]',
        citing_cases JSONB NOT NULL DEFAULT '[]',
        impact_assessment TEXT,
        overruling_case VARCHAR(100),
        current_status VARCHAR(20) DEFAULT 'active' CHECK (current_status IN ('active', 'limited', 'overruled', 'superseded')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Constitutional Interpretations
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutional_interpretations (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        constitutional_provision TEXT NOT NULL,
        interpretation_type VARCHAR(50) NOT NULL, -- 'textual', 'historical', 'structural', 'prudential', etc.
        interpretation_summary TEXT NOT NULL,
        detailed_analysis TEXT NOT NULL,
        historical_context TEXT,
        comparative_analysis TEXT,
        evolution_over_time TEXT,
        current_application TEXT NOT NULL,
        related_precedents JSONB NOT NULL DEFAULT '[]',
        scholarly_consensus VARCHAR(20) CHECK (scholarly_consensus IN ('strong', 'moderate', 'weak', 'disputed')),
        practical_implications TEXT NOT NULL,
        alternative_interpretations JSONB NOT NULL DEFAULT '[]',
        confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
        last_review_date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Judicial Opinions
    await client.query(`
      CREATE TABLE IF NOT EXISTS judicial_opinions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        opinion_type VARCHAR(30) NOT NULL, -- 'majority', 'dissenting', 'concurring', 'advisory'
        case_id INTEGER REFERENCES legal_precedents(id),
        review_id INTEGER REFERENCES constitutional_reviews(id),
        authoring_justice VARCHAR(100) NOT NULL,
        joining_justices JSONB NOT NULL DEFAULT '[]',
        opinion_summary TEXT NOT NULL,
        legal_analysis TEXT NOT NULL,
        constitutional_reasoning TEXT NOT NULL,
        precedent_discussion TEXT,
        policy_implications TEXT,
        future_guidance TEXT,
        scholarly_reception VARCHAR(20) CHECK (scholarly_reception IN ('positive', 'mixed', 'negative', 'controversial')),
        citation_frequency INTEGER DEFAULT 0,
        influence_score INTEGER CHECK (influence_score BETWEEN 1 AND 100),
        opinion_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Leader-Court Interactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS leader_court_interactions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        interaction_type VARCHAR(50) NOT NULL, -- 'consultation', 'constitutional_question', 'appointment', 'override', etc.
        interaction_summary TEXT NOT NULL,
        constitutional_issue TEXT,
        court_position TEXT NOT NULL,
        leader_position TEXT NOT NULL,
        legal_discussion JSONB NOT NULL DEFAULT '[]',
        constitutional_analysis TEXT,
        agreements_reached JSONB NOT NULL DEFAULT '[]',
        disagreements JSONB NOT NULL DEFAULT '[]',
        compromise_solutions JSONB NOT NULL DEFAULT '[]',
        interaction_outcome VARCHAR(50) NOT NULL,
        constitutional_implications TEXT,
        precedent_impact TEXT,
        public_disclosure BOOLEAN DEFAULT FALSE,
        interaction_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Court Analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS court_analytics (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        analytics_date TIMESTAMP NOT NULL,
        total_reviews INTEGER DEFAULT 0,
        reviews_accepted INTEGER DEFAULT 0,
        reviews_rejected INTEGER DEFAULT 0,
        leader_acceptance_rate DECIMAL(4,1) CHECK (leader_acceptance_rate BETWEEN 0 AND 100),
        constitutional_compliance_score INTEGER CHECK (constitutional_compliance_score BETWEEN 0 AND 100),
        judicial_independence_score INTEGER CHECK (judicial_independence_score BETWEEN 0 AND 100),
        public_confidence_in_court DECIMAL(4,1) CHECK (public_confidence_in_court BETWEEN 0 AND 100),
        legal_consistency_score INTEGER CHECK (legal_consistency_score BETWEEN 0 AND 100),
        precedent_stability_score INTEGER CHECK (precedent_stability_score BETWEEN 0 AND 100),
        justice_performance JSONB NOT NULL DEFAULT '{}',
        case_type_distribution JSONB NOT NULL DEFAULT '{}',
        constitutional_area_activity JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_reviews_campaign_status 
      ON constitutional_reviews(campaign_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_reviews_urgency_type 
      ON constitutional_reviews(urgency_level, review_type);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_supreme_court_justices_campaign_status 
      ON supreme_court_justices(campaign_id, tenure_status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_legal_precedents_campaign_type 
      ON legal_precedents(campaign_id, case_type, current_status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_interpretations_campaign 
      ON constitutional_interpretations(campaign_id, last_review_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_judicial_opinions_campaign_date 
      ON judicial_opinions(campaign_id, opinion_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leader_court_interactions_campaign_date 
      ON leader_court_interactions(campaign_id, interaction_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_court_analytics_campaign_date 
      ON court_analytics(campaign_id, analytics_date DESC);
    `);

    // Insert default Supreme Court justices
    await client.query(`
      INSERT INTO supreme_court_justices (
        campaign_id, justice_name, appointment_date, judicial_philosophy, specialization,
        appointment_authority, confirmation_process, judicial_record, public_approval_rating
      ) VALUES 
      (
        1, 'Chief Justice Elena Rodriguez', '2150-01-15', 'living_constitution',
        '["Constitutional Law", "Civil Rights", "Administrative Law"]',
        'Leader Appointment', 
        '{"confirmation_vote": "87-13", "confirmation_date": "2150-02-01", "hearings": 5}',
        '{"years_served": 7, "major_opinions": 45, "concurrences": 23, "dissents": 12}',
        78.5
      ),
      (
        1, 'Justice Marcus Chen', '2148-03-20', 'originalist',
        '["Criminal Law", "Constitutional History", "Federalism"]',
        'Leader Appointment',
        '{"confirmation_vote": "72-28", "confirmation_date": "2148-04-10", "hearings": 4}',
        '{"years_served": 9, "major_opinions": 52, "concurrences": 31, "dissents": 18}',
        65.2
      ),
      (
        1, 'Justice Sarah Thompson', '2152-09-12', 'textualist',
        '["Commercial Law", "Property Rights", "Contract Law"]',
        'Leader Appointment',
        '{"confirmation_vote": "68-32", "confirmation_date": "2152-10-05", "hearings": 6}',
        '{"years_served": 5, "major_opinions": 28, "concurrences": 19, "dissents": 8}',
        71.8
      ),
      (
        1, 'Justice David Kim', '2149-11-08', 'pragmatist',
        '["International Law", "Human Rights", "Comparative Constitutional Law"]',
        'Leader Appointment',
        '{"confirmation_vote": "79-21", "confirmation_date": "2149-12-01", "hearings": 3}',
        '{"years_served": 8, "major_opinions": 41, "concurrences": 27, "dissents": 15}',
        82.3
      ),
      (
        1, 'Justice Maria Santos', '2151-05-30', 'living_constitution',
        '["Environmental Law", "Technology Law", "Privacy Rights"]',
        'Leader Appointment',
        '{"confirmation_vote": "74-26", "confirmation_date": "2151-06-20", "hearings": 4}',
        '{"years_served": 6, "major_opinions": 33, "concurrences": 22, "dissents": 11}',
        75.6
      ),
      (
        1, 'Justice Robert Hayes', '2147-07-14', 'originalist',
        '["Second Amendment", "Religious Freedom", "States Rights"]',
        'Leader Appointment',
        '{"confirmation_vote": "65-35", "confirmation_date": "2147-08-10", "hearings": 7}',
        '{"years_served": 10, "major_opinions": 58, "concurrences": 35, "dissents": 22}',
        58.9
      ),
      (
        1, 'Justice Lisa Park', '2153-02-18', 'pragmatist',
        '["Healthcare Law", "Social Policy", "Equal Protection"]',
        'Leader Appointment',
        '{"confirmation_vote": "81-19", "confirmation_date": "2153-03-15", "hearings": 3}',
        '{"years_served": 4, "major_opinions": 21, "concurrences": 14, "dissents": 6}',
        79.4
      ),
      (
        1, 'Justice Thomas Wright', '2150-08-25', 'textualist',
        '["Immigration Law", "National Security", "Executive Power"]',
        'Leader Appointment',
        '{"confirmation_vote": "69-31", "confirmation_date": "2150-09-20", "hearings": 5}',
        '{"years_served": 7, "major_opinions": 39, "concurrences": 25, "dissents": 13}',
        67.1
      ),
      (
        1, 'Justice Jordan Miller', '2154-01-10', 'living_constitution',
        '["Digital Rights", "AI Ethics", "Future Technologies"]',
        'Leader Appointment',
        '{"confirmation_vote": "76-24", "confirmation_date": "2154-02-05", "hearings": 4}',
        '{"years_served": 3, "major_opinions": 15, "concurrences": 9, "dissents": 4}',
        73.2
      ) ON CONFLICT DO NOTHING
    `);

    // Insert sample constitutional reviews
    await client.query(`
      INSERT INTO constitutional_reviews (
        campaign_id, review_type, review_title, subject_matter, constitutional_provisions,
        legal_precedents, constitutional_analysis, legal_reasoning, rights_impact_assessment,
        recommendation_summary, detailed_opinion, constitutional_compliance, confidence_level, urgency_level
      ) VALUES 
      (
        1, 'law_review', 'Interstellar Infrastructure Investment Act Constitutional Review',
        'Analysis of proposed infrastructure legislation for constitutional compliance and federal authority limits',
        '["Commerce Clause", "Spending Power", "General Welfare Clause", "Interstate Commerce"]',
        '["National Infrastructure Development v. State Autonomy (2145)", "Federal Spending Authority Precedent (2148)", "Interstate Commerce Modern Interpretation (2151)"]',
        'The proposed Interstellar Infrastructure Investment Act falls within constitutional bounds under the Commerce Clause and federal spending power. The legislation addresses interstate and interplanetary commerce, clearly within federal jurisdiction.',
        'Federal authority to regulate interstate commerce extends to interplanetary infrastructure that affects multiple planetary systems. The spending power allows for infrastructure investment that promotes general welfare across the civilization.',
        'No significant constitutional rights concerns identified. The legislation includes proper due process protections for property acquisition and environmental review processes that respect individual and collective rights.',
        'CONSTITUTIONAL COMPLIANCE: The Act is constitutionally sound with minor procedural recommendations for enhanced due process protections during property acquisition phases.',
        'This Court finds the Interstellar Infrastructure Investment Act to be within constitutional bounds. The federal government possesses clear authority under the Commerce Clause to regulate infrastructure that affects interstate and interplanetary commerce. The spending provisions are justified under the General Welfare Clause. We recommend minor procedural enhancements to ensure robust due process protections during any property acquisition phases, but these do not affect the fundamental constitutional validity of the legislation.',
        'compliant', 8, 'important'
      ),
      (
        1, 'policy_analysis', 'Emergency Powers During Crisis Situations',
        'Constitutional analysis of executive emergency powers and their proper limits during civilization-wide emergencies',
        '["Executive Power", "Emergency Authority", "Due Process", "Separation of Powers", "Individual Rights"]',
        '["Emergency Powers Doctrine (2142)", "Crisis Authority Limits (2146)", "Individual Rights During Emergencies (2149)", "Separation of Powers in Crisis (2152)"]',
        'Executive emergency powers must be balanced against constitutional protections. While broad emergency authority exists, it is not unlimited and must respect fundamental constitutional principles and individual rights.',
        'The Constitution grants significant emergency powers to the executive but requires that such powers be exercised within constitutional bounds. Emergency authority cannot suspend fundamental rights or eliminate judicial review entirely.',
        'Emergency powers may temporarily limit some individual rights but cannot eliminate core constitutional protections. Due process, equal protection, and judicial review must remain available even during emergencies.',
        'CONSTITUTIONAL GUIDANCE: Emergency powers are broad but not unlimited. Fundamental constitutional rights and judicial oversight must be preserved even during crisis situations.',
        'While the Constitution grants substantial emergency powers to the executive branch during crisis situations, these powers are not without limits. The Court emphasizes that even during emergencies, fundamental constitutional principles must be preserved. Emergency authority cannot be used to suspend core constitutional rights, eliminate judicial review, or circumvent essential checks and balances. Any emergency measures must be temporary, proportionate to the threat, and subject to ongoing constitutional oversight.',
        'requires_modification', 9, 'urgent'
      ),
      (
        1, 'amendment_review', 'Proposed Digital Rights Amendment Analysis',
        'Constitutional analysis of proposed amendment establishing digital privacy and AI rights protections',
        '["Privacy Rights", "Technology Regulation", "Individual Liberty", "Government Surveillance", "AI Ethics"]',
        '["Digital Privacy Foundations (2150)", "Technology and Constitutional Rights (2152)", "AI Personhood Questions (2153)", "Government Surveillance Limits (2154)"]',
        'The proposed Digital Rights Amendment addresses emerging constitutional questions regarding digital privacy, AI interactions, and technology regulation. The amendment language is generally sound but requires clarification on enforcement mechanisms.',
        'Constitutional amendments must address fundamental rights and governmental structure. The digital rights amendment addresses legitimate constitutional concerns about privacy and technology that existing constitutional text does not adequately cover.',
        'The amendment would significantly enhance individual privacy rights and establish important protections against government surveillance and AI-related rights violations. Implementation must balance security needs with privacy protections.',
        'CONSTITUTIONAL RECOMMENDATION: The amendment addresses legitimate constitutional gaps but requires refinement of enforcement language and clarification of the balance between security and privacy.',
        'The proposed Digital Rights Amendment addresses important constitutional questions that have emerged with advancing technology. While the core principles are sound and address legitimate gaps in current constitutional protections, the Court recommends refinement of the enforcement mechanisms and clearer guidance on balancing digital privacy rights with legitimate security concerns. The amendment should specify the role of judicial oversight in digital surveillance and establish clear standards for AI-related constitutional questions.',
        'requires_modification', 7, 'important'
      ) ON CONFLICT DO NOTHING
    `);

    // Insert sample legal precedents
    await client.query(`
      INSERT INTO legal_precedents (
        campaign_id, case_name, case_citation, decision_date, court_level, case_type,
        legal_issues, constitutional_provisions, case_summary, legal_holding, legal_reasoning,
        precedential_value, impact_assessment
      ) VALUES 
      (
        1, 'Galactic Commerce Authority v. Independent Traders Union', 'GCA v. ITU, 2152 SC 47',
        '2152-06-15', 'supreme_court', 'constitutional',
        '["Interstate Commerce", "Federal Regulation", "Trade Authority", "Economic Liberty"]',
        '["Commerce Clause", "Due Process", "Equal Protection"]',
        'Challenge to federal regulation of independent interplanetary traders under the Commerce Clause. The Independent Traders Union argued that federal oversight exceeded constitutional authority and violated economic liberty rights.',
        'Federal authority to regulate interplanetary commerce is broad and includes oversight of independent traders when their activities substantially affect interstate commerce. Economic liberty is subject to reasonable regulation.',
        'The Commerce Clause grants Congress broad authority to regulate activities that substantially affect interstate commerce. Interplanetary trade clearly falls within this authority. While economic liberty is protected, it is not absolute and may be subject to reasonable regulation that serves legitimate governmental interests.',
        'binding',
        'This decision significantly expanded federal regulatory authority over interplanetary commerce and established important precedent for economic regulation in the space age. The ruling affects all independent traders and establishes framework for future commerce regulation.'
      ),
      (
        1, 'Citizens for Privacy v. Planetary Security Agency', 'CFP v. PSA, 2153 SC 23',
        '2153-03-22', 'supreme_court', 'constitutional',
        '["Privacy Rights", "Government Surveillance", "National Security", "Fourth Amendment"]',
        '["Fourth Amendment", "Privacy Rights", "National Security Exception"]',
        'Constitutional challenge to planetary-wide surveillance program implemented for security purposes. Citizens argued the program violated Fourth Amendment privacy protections without adequate judicial oversight.',
        'Government surveillance programs must include meaningful judicial oversight and cannot operate as general warrants. National security interests must be balanced against constitutional privacy protections.',
        'While national security is a compelling government interest, surveillance programs must comply with Fourth Amendment requirements. General surveillance without individualized suspicion or judicial oversight violates constitutional privacy protections, even when conducted for security purposes.',
        'binding',
        'This landmark privacy decision established important limits on government surveillance and required judicial oversight for security programs. The ruling affects all government surveillance activities and strengthens Fourth Amendment protections in the digital age.'
      ),
      (
        1, 'Interplanetary Environmental Coalition v. Mining Consortium', 'IEC v. MC, 2151 SC 89',
        '2151-11-08', 'supreme_court', 'constitutional',
        '["Environmental Protection", "Property Rights", "Regulatory Authority", "Sustainable Development"]',
        '["Property Rights", "General Welfare", "Environmental Protection"]',
        'Constitutional challenge to environmental regulations limiting mining operations on outer planets. Mining companies argued regulations constituted taking of property without compensation and exceeded federal authority.',
        'Environmental regulations that substantially advance legitimate governmental interests do not constitute unconstitutional takings when they leave economically viable use of property. Federal environmental authority is broad.',
        'Environmental protection is a legitimate exercise of governmental authority under the General Welfare Clause. Regulations that prevent environmental harm while leaving economically viable property use do not constitute compensable takings under the Constitution.',
        'binding',
        'This environmental law precedent established broad federal authority for environmental protection and clarified the relationship between property rights and environmental regulation. The decision affects all environmental regulation and property development.'
      ) ON CONFLICT DO NOTHING
    `);

    // Insert initial court analytics
    await client.query(`
      INSERT INTO court_analytics (
        campaign_id, analytics_date, total_reviews, reviews_accepted, reviews_rejected,
        leader_acceptance_rate, constitutional_compliance_score, judicial_independence_score,
        public_confidence_in_court, legal_consistency_score, precedent_stability_score,
        justice_performance, case_type_distribution, constitutional_area_activity
      ) VALUES (
        1, NOW(), 3, 0, 0, 0.0, 88, 82, 74.5, 85, 91,
        '{
          "Chief Justice Elena Rodriguez": {"opinions_authored": 15, "agreement_rate": 78, "influence_score": 92},
          "Justice Marcus Chen": {"opinions_authored": 18, "agreement_rate": 65, "influence_score": 85},
          "Justice Sarah Thompson": {"opinions_authored": 12, "agreement_rate": 71, "influence_score": 79},
          "Justice David Kim": {"opinions_authored": 16, "agreement_rate": 82, "influence_score": 88},
          "Justice Maria Santos": {"opinions_authored": 13, "agreement_rate": 75, "influence_score": 81},
          "Justice Robert Hayes": {"opinions_authored": 19, "agreement_rate": 58, "influence_score": 76},
          "Justice Lisa Park": {"opinions_authored": 9, "agreement_rate": 79, "influence_score": 83},
          "Justice Thomas Wright": {"opinions_authored": 14, "agreement_rate": 67, "influence_score": 77},
          "Justice Jordan Miller": {"opinions_authored": 6, "agreement_rate": 73, "influence_score": 74}
        }',
        '{
          "constitutional": 3,
          "criminal": 0,
          "civil": 0,
          "administrative": 0,
          "environmental": 0,
          "commercial": 0
        }',
        '{
          "commerce_clause": 1,
          "privacy_rights": 1,
          "environmental_protection": 1,
          "emergency_powers": 1,
          "digital_rights": 1
        }'
      ) ON CONFLICT DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Supreme Court Advisory System schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Supreme Court schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
