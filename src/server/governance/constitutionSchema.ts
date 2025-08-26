import { Pool } from 'pg';

/**
 * Initialize Constitution System database schema
 */
export async function initializeConstitutionSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Constitutions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutions (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        government_type VARCHAR(30) CHECK (government_type IN ('presidential', 'parliamentary', 'semi_presidential', 'constitutional_monarchy')),
        
        -- Constitutional Framework
        preamble TEXT NOT NULL,
        founding_principles JSONB NOT NULL DEFAULT '[]',
        
        -- Political Party System Configuration
        party_system_type VARCHAR(20) CHECK (party_system_type IN ('multiparty', 'two_party', 'single_party', 'no_party')) DEFAULT 'multiparty',
        party_system_description TEXT,
        party_system_constraints JSONB NOT NULL DEFAULT '{}',
        party_system_transition_rules JSONB NOT NULL DEFAULT '{}',
        party_system_historical_context TEXT,
        party_system_advantages JSONB NOT NULL DEFAULT '[]',
        party_system_disadvantages JSONB NOT NULL DEFAULT '[]',
        party_system_stability_factors JSONB NOT NULL DEFAULT '{}',
        
        -- Government Structure
        executive_branch JSONB NOT NULL DEFAULT '{}',
        legislative_branch JSONB NOT NULL DEFAULT '{}',
        judicial_branch JSONB NOT NULL DEFAULT '{}',
        
        -- Rights and Freedoms
        bill_of_rights JSONB NOT NULL DEFAULT '[]',
        
        -- Federal Structure
        federal_structure JSONB DEFAULT NULL,
        
        -- Amendment Process
        amendment_process JSONB NOT NULL DEFAULT '{}',
        
        -- Emergency Powers
        emergency_provisions JSONB NOT NULL DEFAULT '{}',
        
        -- AI-Generated Constitutional Provisions
        ai_generated_provisions JSONB NOT NULL DEFAULT '{}',
        
        -- Constitutional Points System
        constitutional_points JSONB NOT NULL DEFAULT '{"totalPoints": 1000, "allocatedPoints": {}, "pointsHistory": []}',
        
        -- Metadata
        adoption_date TIMESTAMP NOT NULL DEFAULT NOW(),
        last_amended TIMESTAMP,
        ratification_status VARCHAR(20) CHECK (ratification_status IN ('draft', 'pending', 'ratified', 'suspended')) DEFAULT 'draft',
        public_support DECIMAL(5,2) CHECK (public_support BETWEEN 0 AND 100) DEFAULT 50.0,
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Constitutional Amendments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutional_amendments (
        id VARCHAR(50) PRIMARY KEY,
        constitution_id VARCHAR(50) REFERENCES constitutions(id) ON DELETE CASCADE,
        amendment_number INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        text TEXT NOT NULL,
        purpose TEXT NOT NULL,
        
        -- Proposal Details
        proposed_date TIMESTAMP NOT NULL DEFAULT NOW(),
        proposal_method VARCHAR(100) NOT NULL,
        proposed_by VARCHAR(100),
        
        -- Ratification Process
        ratified_date TIMESTAMP,
        status VARCHAR(20) CHECK (status IN ('proposed', 'ratified', 'rejected', 'expired')) DEFAULT 'proposed',
        ratification_votes JSONB NOT NULL DEFAULT '{"for": 0, "against": 0, "abstain": 0}',
        public_support DECIMAL(5,2) CHECK (public_support BETWEEN 0 AND 100) DEFAULT 50.0,
        
        -- Impact Assessment
        impact_assessment JSONB DEFAULT '{}',
        implementation_timeline JSONB DEFAULT '{}',
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        
        UNIQUE(constitution_id, amendment_number)
      )
    `);

    // Constitutional Events table (for tracking constitutional changes and crises)
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutional_events (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        constitution_id VARCHAR(50) REFERENCES constitutions(id) ON DELETE CASCADE,
        
        -- Event Details
        event_type VARCHAR(50) NOT NULL, -- 'amendment_proposed', 'amendment_ratified', 'crisis', 'review', 'violation'
        event_title VARCHAR(200) NOT NULL,
        event_description TEXT NOT NULL,
        event_date TIMESTAMP NOT NULL DEFAULT NOW(),
        
        -- Constitutional Impact
        constitutional_impact JSONB DEFAULT '{}',
        stability_impact INTEGER CHECK (stability_impact BETWEEN -100 AND 100) DEFAULT 0,
        legitimacy_impact INTEGER CHECK (legitimacy_impact BETWEEN -100 AND 100) DEFAULT 0,
        public_support_impact INTEGER CHECK (public_support_impact BETWEEN -100 AND 100) DEFAULT 0,
        
        -- Context
        triggered_by VARCHAR(100),
        related_events JSONB DEFAULT '[]',
        government_response JSONB DEFAULT '{}',
        
        -- Metadata
        severity INTEGER CHECK (severity BETWEEN 1 AND 10) DEFAULT 5,
        public_visibility BOOLEAN DEFAULT TRUE,
        media_coverage BOOLEAN DEFAULT TRUE,
        international_attention BOOLEAN DEFAULT FALSE,
        
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Constitutional Reviews table (for periodic constitutional assessments)
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutional_reviews (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        constitution_id VARCHAR(50) REFERENCES constitutions(id) ON DELETE CASCADE,
        
        -- Review Details
        review_type VARCHAR(30) NOT NULL, -- 'periodic', 'crisis_triggered', 'amendment_review', 'comprehensive'
        review_title VARCHAR(200) NOT NULL,
        review_scope JSONB NOT NULL DEFAULT '[]', -- areas being reviewed
        
        -- Timeline
        initiated_date TIMESTAMP NOT NULL DEFAULT NOW(),
        expected_completion TIMESTAMP,
        completed_date TIMESTAMP,
        
        -- Review Body
        review_body VARCHAR(100) NOT NULL, -- 'constitutional_court', 'legislative_committee', 'citizen_assembly', 'expert_panel'
        reviewers JSONB DEFAULT '[]',
        
        -- Findings and Recommendations
        findings JSONB DEFAULT '{}',
        recommendations JSONB DEFAULT '[]',
        proposed_changes JSONB DEFAULT '[]',
        
        -- Status and Outcomes
        status VARCHAR(20) CHECK (status IN ('initiated', 'in_progress', 'completed', 'suspended', 'cancelled')) DEFAULT 'initiated',
        outcomes JSONB DEFAULT '{}',
        implementation_status JSONB DEFAULT '{}',
        
        -- Public Engagement
        public_consultation BOOLEAN DEFAULT FALSE,
        public_submissions INTEGER DEFAULT 0,
        public_hearings INTEGER DEFAULT 0,
        media_coverage_level INTEGER CHECK (media_coverage_level BETWEEN 1 AND 10) DEFAULT 5,
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Constitutional Interpretations table (for tracking judicial interpretations)
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutional_interpretations (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        constitution_id VARCHAR(50) REFERENCES constitutions(id) ON DELETE CASCADE,
        
        -- Case Details
        case_title VARCHAR(200) NOT NULL,
        case_number VARCHAR(50),
        court_level VARCHAR(30) NOT NULL, -- 'supreme_court', 'constitutional_court', 'appellate_court'
        
        -- Constitutional Provisions
        provisions_interpreted JSONB NOT NULL DEFAULT '[]',
        constitutional_questions JSONB NOT NULL DEFAULT '[]',
        
        -- Decision Details
        decision_date TIMESTAMP,
        decision_summary TEXT,
        majority_opinion TEXT,
        dissenting_opinions JSONB DEFAULT '[]',
        concurring_opinions JSONB DEFAULT '[]',
        
        -- Impact and Precedent
        precedent_value VARCHAR(20) CHECK (precedent_value IN ('binding', 'persuasive', 'limited', 'overruled')) DEFAULT 'binding',
        constitutional_impact JSONB DEFAULT '{}',
        affected_laws JSONB DEFAULT '[]',
        future_implications TEXT,
        
        -- Metadata
        judges_panel JSONB DEFAULT '[]',
        legal_citations JSONB DEFAULT '[]',
        public_reaction JSONB DEFAULT '{}',
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutions_campaign_civ 
      ON constitutions(campaign_id, civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutions_party_system 
      ON constitutions(party_system_type, ratification_status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_amendments_constitution 
      ON constitutional_amendments(constitution_id, status, proposed_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_events_campaign_civ_date 
      ON constitutional_events(campaign_id, civilization_id, event_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_reviews_campaign_civ 
      ON constitutional_reviews(campaign_id, civilization_id, status, initiated_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_interpretations_campaign_civ 
      ON constitutional_interpretations(campaign_id, civilization_id, decision_date DESC);
    `);

    // Insert default constitutional templates
    await client.query(`
      INSERT INTO constitutions (
        id, name, campaign_id, civilization_id, government_type, preamble, founding_principles,
        party_system_type, party_system_description, party_system_constraints,
        party_system_transition_rules, party_system_advantages, party_system_disadvantages,
        party_system_stability_factors, executive_branch, legislative_branch, judicial_branch,
        bill_of_rights, amendment_process, emergency_provisions, ai_generated_provisions,
        constitutional_points, ratification_status
      ) VALUES 
      (
        'multiparty_democratic_template',
        'Multi-Party Democratic Constitution Template',
        0,
        'template',
        'parliamentary',
        'We, the people of this civilization, in order to form a more perfect union, establish justice, ensure domestic tranquility, provide for the common defense, promote the general welfare, and secure the blessings of liberty to ourselves and our posterity, do ordain and establish this Constitution.',
        '["Democratic governance", "Rule of law", "Individual rights", "Separation of powers", "Political pluralism", "Peaceful transition of power"]',
        'multiparty',
        'A competitive multi-party system that allows for unlimited political parties to form, compete in elections, and represent diverse ideological perspectives within the democratic framework.',
        '{
          "maxParties": null,
          "minParties": 2,
          "partyFormationRequirements": {
            "minimumMembers": 1000,
            "registrationProcess": "Submit petition with member signatures, ideological platform, and organizational structure to Electoral Commission",
            "fundingRequirements": 50000,
            "ideologicalRestrictions": ["No parties advocating violent overthrow of government", "No parties promoting discrimination based on protected characteristics"]
          },
          "electionParticipation": {
            "requiresPartyAffiliation": false,
            "independentCandidatesAllowed": true,
            "coalitionFormationAllowed": true
          },
          "partyOperations": {
            "allowedActivities": ["Electoral campaigning", "Policy advocacy", "Public demonstrations", "Fundraising", "Media engagement", "Coalition building"],
            "restrictedActivities": ["Violence or incitement to violence", "Foreign interference", "Corruption or bribery"],
            "dissolutionConditions": ["Violation of constitutional principles", "Engagement in illegal activities", "Foreign control"],
            "stateSupervision": false
          }
        }',
        '{
          "canChangeTo": ["two_party", "single_party"],
          "transitionRequirements": {
            "constitutionalAmendment": true,
            "referendumRequired": true,
            "legislativeSupermajority": true,
            "transitionPeriod": 24
          }
        }',
        '["Diverse representation of political viewpoints", "Competitive elections promote accountability", "Coalition governments encourage compromise", "Protection of minority political voices", "Innovation in policy through competition"]',
        '["Potential for political fragmentation", "Coalition instability", "Increased campaign costs", "Voter confusion with many choices", "Possible extremist party participation"]',
        '{
          "governmentStability": 75,
          "democraticLegitimacy": 90,
          "representationQuality": 85,
          "decisionMakingEfficiency": 70
        }',
        '{"headOfState": "president", "headOfGovernment": "prime_minister", "termLength": 4, "electionMethod": "parliamentary_appointment", "powers": ["Execute laws", "Appoint ministers", "Foreign policy leadership", "Emergency powers"], "impeachmentProcess": {"grounds": ["High crimes", "Misdemeanors", "Violation of oath"], "procedure": "Parliamentary vote of no confidence", "requiredVotes": 60}}',
        '{"structure": "bicameral", "chambers": [{"name": "House of Representatives", "seats": 300, "termLength": 4, "electionMethod": "proportional", "powers": ["Pass legislation", "Budget approval", "Government oversight"], "leadership": {"speakerTitle": "Speaker of the House", "electionMethod": "internal"}}, {"name": "Senate", "seats": 100, "termLength": 6, "electionMethod": "direct", "powers": ["Review legislation", "Confirm appointments", "Constitutional amendments"], "leadership": {"speakerTitle": "Senate President", "electionMethod": "internal"}}], "legislativeProcess": {"billIntroduction": ["Government", "Members of Parliament", "Senate"], "committeeSystem": true, "votingThresholds": {"simple": 50, "supermajority": 67, "constitutional": 75}}}',
        '{"structure": "unified", "courts": [{"level": "supreme", "name": "Constitutional Court", "jurisdiction": ["Constitutional interpretation", "Electoral disputes", "Rights violations"], "judgeSelection": "merit_based", "termLength": null, "judges": 9}], "judicialReview": true, "independenceGuarantees": ["Life tenure", "Salary protection", "Appointment process"]}',
        '[{"category": "Civil Rights", "rights": ["Freedom of speech", "Freedom of assembly", "Freedom of religion", "Right to privacy", "Due process"]}, {"category": "Political Rights", "rights": ["Right to vote", "Right to run for office", "Right to form political parties", "Right to petition government"]}, {"category": "Social Rights", "rights": ["Right to education", "Right to healthcare", "Right to social security", "Right to work"]}]',
        '{"proposalMethods": ["Parliamentary supermajority", "Constitutional convention", "Citizen initiative"], "ratificationMethods": ["Parliamentary vote", "Referendum", "State ratification"], "requiredThresholds": {"proposal": 67, "ratification": 60}}',
        '{"declarationAuthority": "Prime Minister with Parliamentary approval", "scope": ["Suspend certain rights", "Deploy military domestically", "Expedited legislation"], "duration": 30, "legislativeOversight": true, "restrictions": ["Cannot suspend elections", "Cannot dissolve Parliament", "Subject to judicial review"]}',
        '{}',
        '{"totalPoints": 1000, "allocatedPoints": {"executivePower": 150, "legislativePower": 200, "judicialPower": 150, "citizenRights": 200, "federalismBalance": 100, "emergencyPowers": 50, "amendmentDifficulty": 100, "partySystemFlexibility": 50}, "pointsHistory": []}',
        'ratified'
      ),
      (
        'two_party_template',
        'Two-Party System Constitution Template',
        0,
        'template',
        'presidential',
        'We, the people of this civilization, establish this Constitution to create a stable two-party democratic system that ensures effective governance through structured political competition between two major political parties.',
        '["Stable governance", "Clear political choices", "Effective opposition", "Moderate politics", "Governmental accountability"]',
        'two_party',
        'A structured two-party system that legally recognizes and supports exactly two major political parties, with mechanisms to maintain this duopoly while allowing limited third-party participation.',
        '{
          "maxParties": 2,
          "minParties": 2,
          "partyFormationRequirements": {
            "minimumMembers": 5000000,
            "registrationProcess": "Constitutional recognition as one of two major parties, requires historical precedent or replacement of existing major party",
            "fundingRequirements": 10000000,
            "ideologicalRestrictions": ["Must represent broad ideological coalition", "Cannot be single-issue parties"]
          },
          "electionParticipation": {
            "requiresPartyAffiliation": false,
            "independentCandidatesAllowed": true,
            "coalitionFormationAllowed": false
          },
          "partyOperations": {
            "allowedActivities": ["Electoral campaigning", "Policy development", "Candidate recruitment", "Fundraising", "Media engagement"],
            "restrictedActivities": ["Preventing third-party ballot access", "Coordinating with foreign entities"],
            "dissolutionConditions": ["Loss of major party status through electoral performance", "Constitutional violation"],
            "stateSupervision": true
          }
        }',
        '{
          "canChangeTo": ["multiparty", "single_party"],
          "transitionRequirements": {
            "constitutionalAmendment": true,
            "referendumRequired": true,
            "legislativeSupermajority": true,
            "transitionPeriod": 18
          }
        }',
        '["Political stability and predictability", "Clear governing majorities", "Simplified voter choices", "Moderate, centrist policies", "Strong opposition oversight", "Efficient decision-making"]',
        '["Limited political diversity", "Potential for polarization", "Barriers to new political movements", "Reduced representation of minority views", "Risk of political stagnation"]',
        '{
          "governmentStability": 85,
          "democraticLegitimacy": 75,
          "representationQuality": 65,
          "decisionMakingEfficiency": 90
        }',
        '{"headOfState": "president", "headOfGovernment": "president", "termLength": 4, "termLimits": 2, "electionMethod": "direct", "powers": ["Chief executive", "Commander in chief", "Foreign policy", "Veto power"], "impeachmentProcess": {"grounds": ["Treason", "Bribery", "High crimes and misdemeanors"], "procedure": "House impeachment, Senate trial", "requiredVotes": 67}}',
        '{"structure": "bicameral", "chambers": [{"name": "House of Representatives", "seats": 435, "termLength": 2, "electionMethod": "direct", "powers": ["Taxation", "Impeachment", "Budget initiation"], "leadership": {"speakerTitle": "Speaker of the House", "electionMethod": "internal"}}, {"name": "Senate", "seats": 100, "termLength": 6, "electionMethod": "direct", "powers": ["Confirm appointments", "Try impeachments", "Treaty ratification"], "leadership": {"speakerTitle": "Senate Majority Leader", "electionMethod": "internal"}}], "legislativeProcess": {"billIntroduction": ["House members", "Senate members"], "committeeSystem": true, "votingThresholds": {"simple": 50, "supermajority": 60, "constitutional": 67}}}',
        '{"structure": "federal", "courts": [{"level": "supreme", "name": "Supreme Court", "jurisdiction": ["Constitutional law", "Federal law", "Interstate disputes"], "judgeSelection": "appointed", "termLength": null, "judges": 9}], "judicialReview": true, "independenceGuarantees": ["Life tenure", "Salary protection", "Senate confirmation"]}',
        '[{"category": "Fundamental Rights", "rights": ["Freedom of speech", "Freedom of press", "Freedom of religion", "Right to bear arms", "Protection from unreasonable search"]}, {"category": "Legal Rights", "rights": ["Due process", "Equal protection", "Right to counsel", "Jury trial", "Habeas corpus"]}, {"category": "Democratic Rights", "rights": ["Right to vote", "Right to petition", "Right to assembly", "Right to run for office"]}]',
        '{"proposalMethods": ["Congressional supermajority", "Constitutional convention"], "ratificationMethods": ["State legislatures", "State conventions"], "requiredThresholds": {"proposal": 67, "ratification": 75}}',
        '{"declarationAuthority": "President with Congressional notification", "scope": ["Military deployment", "Resource allocation", "Regulatory suspension"], "duration": 60, "legislativeOversight": true, "restrictions": ["Cannot suspend Constitution", "Cannot postpone elections", "Subject to judicial review"]}',
        '{}',
        '{"totalPoints": 1000, "allocatedPoints": {"executivePower": 200, "legislativePower": 180, "judicialPower": 150, "citizenRights": 180, "federalismBalance": 120, "emergencyPowers": 70, "amendmentDifficulty": 80, "partySystemFlexibility": 20}, "pointsHistory": []}',
        'ratified'
      ),
      (
        'single_party_template',
        'Single-Party System Constitution Template',
        0,
        'template',
        'parliamentary',
        'We, the people of this civilization, united under the guidance of the Revolutionary Party, establish this Constitution to build a just society through unified leadership and collective action toward our shared ideological goals.',
        '["Unity of purpose", "Ideological consistency", "Efficient governance", "Social transformation", "Collective leadership", "Revolutionary progress"]',
        'single_party',
        'A single-party system where one political party holds constitutional authority to govern, with internal democracy and mass participation within the party structure, while maintaining ideological unity and revolutionary purpose.',
        '{
          "maxParties": 1,
          "minParties": 1,
          "partyFormationRequirements": {
            "minimumMembers": 10000000,
            "registrationProcess": "Constitutional recognition as the sole governing party representing the people",
            "fundingRequirements": 0,
            "ideologicalRestrictions": ["Must adhere to constitutional revolutionary principles", "Must represent the collective will of the people"]
          },
          "electionParticipation": {
            "requiresPartyAffiliation": true,
            "independentCandidatesAllowed": false,
            "coalitionFormationAllowed": false
          },
          "partyOperations": {
            "allowedActivities": ["Policy development", "Candidate selection", "Mass mobilization", "Ideological education", "Economic planning", "Social organization"],
            "restrictedActivities": ["Opposition party formation", "Counter-revolutionary activities", "Factional organizing"],
            "dissolutionConditions": ["Constitutional violation", "Abandonment of revolutionary principles"],
            "stateSupervision": false
          }
        }',
        '{
          "canChangeTo": ["multiparty", "two_party"],
          "transitionRequirements": {
            "constitutionalAmendment": true,
            "referendumRequired": true,
            "legislativeSupermajority": true,
            "transitionPeriod": 36
          }
        }',
        '["Unity and stability in governance", "Rapid implementation of policies", "Long-term strategic planning", "Ideological consistency", "Efficient resource allocation", "Strong social mobilization"]',
        '["Limited political pluralism", "Potential for authoritarianism", "Reduced individual political expression", "Risk of policy stagnation", "Limited checks on power", "Suppression of dissent"]',
        '{
          "governmentStability": 95,
          "democraticLegitimacy": 60,
          "representationQuality": 70,
          "decisionMakingEfficiency": 95
        }',
        '{"headOfState": "president", "headOfGovernment": "prime_minister", "termLength": 5, "electionMethod": "party_appointment", "powers": ["Execute party decisions", "Represent the state", "Lead government", "Emergency powers"], "impeachmentProcess": {"grounds": ["Betrayal of party principles", "Corruption", "Incompetence"], "procedure": "Party Central Committee review", "requiredVotes": 75}}',
        '{"structure": "unicameral", "chambers": [{"name": "People\\'s Assembly", "seats": 500, "termLength": 5, "electionMethod": "party_selection", "powers": ["Approve party policies", "Budget approval", "Constitutional amendments"], "leadership": {"speakerTitle": "Assembly Chairman", "electionMethod": "party_appointment"}}], "legislativeProcess": {"billIntroduction": ["Party leadership", "Assembly committees"], "committeeSystem": true, "votingThresholds": {"simple": 50, "supermajority": 67, "constitutional": 75}}}',
        '{"structure": "unified", "courts": [{"level": "supreme", "name": "Supreme People\\'s Court", "jurisdiction": ["Constitutional interpretation", "Major criminal cases", "Administrative disputes"], "judgeSelection": "party_appointment", "termLength": 10, "judges": 15}], "judicialReview": true, "independenceGuarantees": ["Party protection", "Salary security", "Ideological alignment"]}',
        '[{"category": "Collective Rights", "rights": ["Right to work", "Right to education", "Right to healthcare", "Right to housing", "Right to social security"]}, {"category": "Political Rights", "rights": ["Right to participate in party activities", "Right to vote in party elections", "Right to petition party leadership", "Right to mass organization membership"]}, {"category": "Cultural Rights", "rights": ["Right to cultural expression", "Right to language", "Right to religious belief", "Right to scientific inquiry"]}]',
        '{"proposalMethods": ["Party Central Committee", "People\\'s Assembly supermajority"], "ratificationMethods": ["Party referendum", "Assembly vote"], "requiredThresholds": {"proposal": 75, "ratification": 67}}',
        '{"declarationAuthority": "Party General Secretary with Central Committee approval", "scope": ["Martial law", "Economic mobilization", "Social reorganization"], "duration": 90, "legislativeOversight": true, "restrictions": ["Cannot violate party constitution", "Cannot harm people\\'s interests", "Subject to party review"]}',
        '{}',
        '{"totalPoints": 1000, "allocatedPoints": {"executivePower": 180, "legislativePower": 160, "judicialPower": 120, "citizenRights": 160, "federalismBalance": 80, "emergencyPowers": 100, "amendmentDifficulty": 120, "partySystemFlexibility": 80}, "pointsHistory": []}',
        'ratified'
      )
      ON CONFLICT (id) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Constitution System schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Constitution System schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
