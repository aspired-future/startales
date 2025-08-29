import { Pool } from 'pg';
import { CorporationTemplate, LeaderTemplate, NamePattern } from './economicEcosystemSchema';

export class ProceduralCorporationGenerator {
  constructor(private pool: Pool) {}

  // Corporation Name Generation
  private corporationNamePatterns = {
    technology: {
      prefixes: ['Quantum', 'Neural', 'Cyber', 'Digital', 'Smart', 'Advanced', 'Future', 'Next', 'Ultra', 'Meta'],
      descriptors: ['Tech', 'Systems', 'Solutions', 'Dynamics', 'Labs', 'Works', 'Core', 'Logic', 'Soft', 'Ware'],
      suffixes: ['Corp', 'Inc', 'Ltd', 'Technologies', 'Industries', 'Enterprises', 'Group', 'Holdings']
    },
    healthcare: {
      prefixes: ['Bio', 'Med', 'Life', 'Gene', 'Nano', 'Regen', 'Vital', 'Health', 'Cure', 'Heal'],
      descriptors: ['Tech', 'Care', 'Systems', 'Solutions', 'Labs', 'Research', 'Therapeutics', 'Pharma', 'Medical'],
      suffixes: ['Corp', 'Inc', 'Ltd', 'Biotech', 'Pharmaceuticals', 'Medical', 'Healthcare', 'Life Sciences']
    },
    energy: {
      prefixes: ['Fusion', 'Solar', 'Quantum', 'Power', 'Energy', 'Clean', 'Green', 'Stellar', 'Cosmic', 'Atomic'],
      descriptors: ['Power', 'Energy', 'Dynamics', 'Systems', 'Solutions', 'Grid', 'Cell', 'Source', 'Flow'],
      suffixes: ['Corp', 'Inc', 'Energy', 'Power', 'Utilities', 'Systems', 'Solutions', 'Dynamics']
    },
    manufacturing: {
      prefixes: ['Robo', 'Auto', 'Smart', 'Advanced', 'Precision', 'Industrial', 'Mega', 'Prime', 'Elite'],
      descriptors: ['Tech', 'Manufacturing', 'Industries', 'Systems', 'Works', 'Production', 'Assembly', 'Fabrication'],
      suffixes: ['Corp', 'Inc', 'Industries', 'Manufacturing', 'Works', 'Systems', 'Solutions', 'Group']
    },
    transportation: {
      prefixes: ['Warp', 'Hyper', 'Quantum', 'Star', 'Galactic', 'Interstellar', 'Cosmic', 'Space', 'Fast'],
      descriptors: ['Drive', 'Transport', 'Logistics', 'Shipping', 'Lines', 'Express', 'Cargo', 'Fleet'],
      suffixes: ['Corp', 'Inc', 'Logistics', 'Transportation', 'Lines', 'Express', 'Shipping', 'Fleet']
    },
    financial: {
      prefixes: ['Galactic', 'Universal', 'Quantum', 'Digital', 'Stellar', 'Prime', 'Elite', 'Global', 'Mega'],
      descriptors: ['Bank', 'Financial', 'Capital', 'Investment', 'Credit', 'Wealth', 'Asset', 'Fund'],
      suffixes: ['Corp', 'Inc', 'Bank', 'Financial', 'Capital', 'Investment', 'Group', 'Holdings']
    },
    software: {
      prefixes: ['Quantum', 'Neural', 'AI', 'Smart', 'Digital', 'Virtual', 'Cloud', 'Data', 'Cyber', 'Code'],
      descriptors: ['Soft', 'Systems', 'Solutions', 'Logic', 'Code', 'Data', 'Cloud', 'AI', 'Intelligence'],
      suffixes: ['Corp', 'Inc', 'Software', 'Systems', 'Solutions', 'Technologies', 'Labs', 'Studio']
    }
  };

  // Leader Name Generation
  private leaderNames = {
    first_names: {
      male: ['Alexander', 'Marcus', 'James', 'David', 'Michael', 'Robert', 'William', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian'],
      female: ['Elena', 'Sarah', 'Maria', 'Jennifer', 'Lisa', 'Karen', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Emily', 'Kimberly', 'Deborah', 'Dorothy'],
      neutral: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn', 'Sage', 'River']
    },
    last_names: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Chen', 'Kim', 'Nakamura', 'Tanaka', 'Yamamoto', 'Singh', 'Patel', 'Kumar', 'Sharma', 'Gupta', 'Vasquez', 'Morrison', 'Torres', 'O\'Connor', 'Murphy', 'Sullivan'],
    titles: ['Dr.', 'Professor', 'Admiral', 'Captain', 'Colonel', 'General', 'Director', 'Chief']
  };

  // Personality and Background Templates
  private personalityArchetypes = {
    visionary_innovator: {
      traits: ['Visionary', 'Innovative', 'Risk-taking', 'Inspiring', 'Forward-thinking'],
      leadership_style: 'Transformational',
      communication_style: 'Inspiring and future-focused',
      backgrounds: ['Former researcher', 'Serial entrepreneur', 'Academic turned business leader', 'Technology pioneer'],
      interests: ['Cutting-edge technology', 'Future trends', 'Innovation', 'Disruption']
    },
    pragmatic_operator: {
      traits: ['Pragmatic', 'Efficient', 'Results-oriented', 'Disciplined', 'Methodical'],
      leadership_style: 'Operational Excellence',
      communication_style: 'Direct and practical',
      backgrounds: ['Former military officer', 'Operations specialist', 'Process improvement expert', 'Supply chain veteran'],
      interests: ['Efficiency optimization', 'Process improvement', 'Logistics', 'Operations']
    },
    analytical_strategist: {
      traits: ['Analytical', 'Strategic', 'Detail-oriented', 'Logical', 'Systematic'],
      leadership_style: 'Strategic Planning',
      communication_style: 'Data-driven and methodical',
      backgrounds: ['Management consultant', 'Financial analyst', 'Strategic planner', 'Research director'],
      interests: ['Data analysis', 'Strategic planning', 'Market research', 'Competitive intelligence']
    },
    charismatic_leader: {
      traits: ['Charismatic', 'Persuasive', 'Energetic', 'Inspiring', 'Collaborative'],
      leadership_style: 'Inspirational',
      communication_style: 'Energetic and motivating',
      backgrounds: ['Sales executive', 'Marketing leader', 'Public speaker', 'Team builder'],
      interests: ['Team building', 'Public speaking', 'Networking', 'Mentoring']
    }
  };

  // Generate Corporation Name
  generateCorporationName(sector: string): string {
    const patterns = this.corporationNamePatterns[sector as keyof typeof this.corporationNamePatterns] || 
                    this.corporationNamePatterns.technology;

    const prefix = patterns.prefixes[Math.floor(Math.random() * patterns.prefixes.length)];
    const descriptor = patterns.descriptors[Math.floor(Math.random() * patterns.descriptors.length)];
    const suffix = patterns.suffixes[Math.floor(Math.random() * patterns.suffixes.length)];

    // 70% chance of prefix + descriptor + suffix, 30% chance of just descriptor + suffix
    if (Math.random() < 0.7) {
      return `${prefix}${descriptor} ${suffix}`;
    } else {
      return `${descriptor} ${suffix}`;
    }
  }

  // Generate Corporation Symbol
  generateCorporationSymbol(companyName: string): string {
    // Extract meaningful parts from company name
    const words = companyName.split(' ');
    let symbol = '';

    if (words.length >= 2) {
      // Take first 2-3 letters from first two words
      symbol = words[0].substring(0, 2) + words[1].substring(0, 2);
    } else {
      // Take first 4 letters from single word
      symbol = words[0].substring(0, 4);
    }

    return symbol.toUpperCase();
  }

  // Generate Leader Name
  generateLeaderName(includeTitle: boolean = false): { full_name: string; title?: string } {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const firstName = this.leaderNames.first_names[gender][Math.floor(Math.random() * this.leaderNames.first_names[gender].length)];
    const lastName = this.leaderNames.last_names[Math.floor(Math.random() * this.leaderNames.last_names.length)];
    
    let fullName = `${firstName} ${lastName}`;
    let title = undefined;

    if (includeTitle && Math.random() < 0.3) {
      title = this.leaderNames.titles[Math.floor(Math.random() * this.leaderNames.titles.length)];
      fullName = `${title} ${firstName} ${lastName}`;
    }

    return { full_name: fullName, title };
  }

  // Generate Leader Personality
  generateLeaderPersonality(archetype?: string): {
    personality_archetype: string;
    traits: string[];
    leadership_style: string;
    communication_style: string;
    background: string;
    interests: string[];
  } {
    const archetypeKey = archetype || Object.keys(this.personalityArchetypes)[
      Math.floor(Math.random() * Object.keys(this.personalityArchetypes).length)
    ] as keyof typeof this.personalityArchetypes;

    const template = this.personalityArchetypes[archetypeKey as keyof typeof this.personalityArchetypes];
    
    // Select 3-4 traits randomly
    const selectedTraits = template.traits
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 3);

    // Select background and interests
    const background = template.backgrounds[Math.floor(Math.random() * template.backgrounds.length)];
    const selectedInterests = template.interests
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 2);

    return {
      personality_archetype: archetypeKey,
      traits: selectedTraits,
      leadership_style: template.leadership_style,
      communication_style: template.communication_style,
      background,
      interests: selectedInterests
    };
  }

  // Generate Witter Handle
  generateWitterHandle(fullName: string, companyName: string): string {
    const nameParts = fullName.replace(/^(Dr\.|Professor|Admiral|Captain|Colonel|General|Director|Chief)\s/, '').split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    const companyWords = companyName.split(' ');
    const companyAbbrev = companyWords[0].substring(0, 3);

    // Generate different handle patterns
    const patterns = [
      `@${firstName}${lastName}_CEO`,
      `@${firstName}_${companyAbbrev}`,
      `@${firstName}${lastName.substring(0, 1)}_${companyAbbrev}`,
      `@CEO_${firstName}${lastName.substring(0, 1)}`,
      `@${firstName}_CEO`
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  // Generate Business Description
  generateBusinessDescription(sector: string, products: string[]): string {
    const sectorDescriptions = {
      technology: 'cutting-edge technology solutions and innovative digital products',
      healthcare: 'advanced medical treatments and biotechnology innovations',
      energy: 'clean energy solutions and power generation systems',
      manufacturing: 'precision manufacturing and industrial automation systems',
      transportation: 'advanced transportation and logistics solutions',
      financial: 'comprehensive financial services and investment solutions',
      software: 'enterprise software solutions and digital platforms',
      defense: 'defense systems and security solutions',
      materials: 'advanced materials and resource extraction',
      consumer: 'consumer products and retail solutions'
    };

    const baseDescription = sectorDescriptions[sector as keyof typeof sectorDescriptions] || 
                           'innovative products and services';

    const productList = products.slice(0, 3).join(', ');
    
    return `Leading company specializing in ${baseDescription}, with focus on ${productList} and related technologies for both civilian and commercial applications.`;
  }

  // Generate Competitive Advantages
  generateCompetitiveAdvantages(sector: string, technologyLevel: number): string[] {
    const advantagesBySector = {
      technology: ['Proprietary algorithms', 'Advanced R&D capabilities', 'Patent portfolio', 'Quantum computing expertise', 'AI/ML leadership'],
      healthcare: ['Clinical trial expertise', 'Regulatory approval track record', 'Biotech patents', 'Medical device innovation', 'Therapeutic breakthroughs'],
      energy: ['Clean energy technology', 'Efficient power generation', 'Grid integration expertise', 'Energy storage solutions', 'Renewable energy patents'],
      manufacturing: ['Automated production lines', 'Quality control systems', 'Supply chain optimization', 'Advanced robotics', 'Lean manufacturing'],
      transportation: ['Fleet management systems', 'Route optimization', 'Safety record', 'Interstellar experience', 'Logistics network'],
      financial: ['Risk management expertise', 'Regulatory compliance', 'Multi-currency operations', 'Investment algorithms', 'Client relationships'],
      software: ['Scalable architecture', 'User experience design', 'Security expertise', 'Cloud infrastructure', 'API ecosystem'],
      defense: ['Security clearances', 'Military contracts', 'Advanced weapons systems', 'Cybersecurity expertise', 'Strategic partnerships'],
      materials: ['Resource extraction technology', 'Processing efficiency', 'Quality assurance', 'Supply chain control', 'Environmental compliance']
    };

    const baseAdvantages = advantagesBySector[sector as keyof typeof advantagesBySector] || 
                          ['Industry expertise', 'Operational efficiency', 'Customer relationships'];

    // Higher technology level = more advanced advantages
    const technologyAdvantages = technologyLevel >= 8 ? 
      ['Breakthrough technology', 'First-mover advantage', 'Exclusive partnerships'] : 
      ['Proven technology', 'Cost efficiency', 'Market presence'];

    const allAdvantages = [...baseAdvantages, ...technologyAdvantages];
    
    // Return 3-4 random advantages
    return allAdvantages
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 3);
  }

  // Generate Recent Developments
  generateRecentDevelopments(sector: string, companyName: string): string {
    const developmentTemplates = {
      technology: [
        'Launched breakthrough quantum computing platform with 99.9% uptime',
        'Secured $50B government contract for advanced AI systems',
        'Opened new R&D facility with 500 additional researchers',
        'Achieved major breakthrough in neural interface technology',
        'Formed strategic partnership with leading defense contractor'
      ],
      healthcare: [
        'FDA approved revolutionary gene therapy treatment',
        'Completed successful Phase III clinical trials',
        'Opened new regenerative medicine facility',
        'Achieved breakthrough in anti-aging research',
        'Launched personalized medicine platform'
      ],
      energy: [
        'Completed construction of largest fusion power plant',
        'Achieved record efficiency in solar energy conversion',
        'Secured exclusive Helium-3 mining rights',
        'Deployed first commercial fusion reactor',
        'Announced expansion to three new star systems'
      ],
      manufacturing: [
        'Achieved full automation in primary production line',
        'Launched new generation of self-programming robots',
        'Opened advanced manufacturing facility',
        'Implemented zero-defect quality system',
        'Secured major supply contract with government'
      ],
      transportation: [
        'Achieved new speed record for commercial warp travel',
        'Opened direct route to newly discovered system',
        'Launched autonomous cargo delivery service',
        'Expanded fleet with 50 new vessels',
        'Implemented quantum navigation system'
      ],
      software: [
        'Released next-generation enterprise platform',
        'Achieved 99.99% system uptime across all services',
        'Launched AI-powered analytics suite',
        'Secured major cloud infrastructure contract',
        'Opened new development center with 200 engineers'
      ]
    };

    const templates = developmentTemplates[sector as keyof typeof developmentTemplates] || 
                     ['Expanded operations significantly', 'Achieved major operational milestone', 'Launched new product line'];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Generate Complete Corporation
  async generateCorporation(
    exchangeId: number,
    sector: string,
    sizeCategory: 'startup' | 'small' | 'medium' | 'large' | 'mega_corp' = 'medium',
    products?: string[]
  ): Promise<{
    company: any;
    leaders: any[];
  }> {
    const companyName = this.generateCorporationName(sector);
    const companySymbol = this.generateCorporationSymbol(companyName);
    
    // Generate market metrics based on size category
    const sizeMultipliers = {
      startup: { marketCap: 0.001, employees: 0.01, revenue: 0.001 },
      small: { marketCap: 0.01, employees: 0.1, revenue: 0.01 },
      medium: { marketCap: 0.1, employees: 1, revenue: 0.1 },
      large: { marketCap: 1, employees: 5, revenue: 1 },
      mega_corp: { marketCap: 10, employees: 20, revenue: 10 }
    };

    const multiplier = sizeMultipliers[sizeCategory];
    const baseMarketCap = 100000000000; // $100B base
    const baseEmployees = 50000;
    const baseRevenue = 50000000000; // $50B base

    const marketCap = baseMarketCap * multiplier.marketCap * (0.5 + Math.random());
    const employees = Math.floor(baseEmployees * multiplier.employees * (0.5 + Math.random()));
    const revenue = baseRevenue * multiplier.revenue * (0.5 + Math.random());
    const sharesOutstanding = Math.floor(marketCap / (50 + Math.random() * 400)); // $50-450 per share range
    const currentPrice = marketCap / sharesOutstanding;

    const technologyLevel = Math.floor(Math.random() * 3) + (sector === 'technology' ? 8 : 6);
    const competitiveAdvantages = this.generateCompetitiveAdvantages(sector, technologyLevel);
    const recentDevelopments = this.generateRecentDevelopments(sector, companyName);
    const businessDescription = this.generateBusinessDescription(sector, products || []);

    const company = {
      exchange_id: exchangeId,
      company_symbol: companySymbol,
      company_name: companyName,
      sector: sector,
      subsector: products?.[0] || sector,
      market_cap: marketCap,
      shares_outstanding: sharesOutstanding,
      current_price: currentPrice,
      previous_close: currentPrice * (0.98 + Math.random() * 0.04), // ±2% from current
      daily_change_percent: (Math.random() - 0.5) * 6, // ±3% daily change
      pe_ratio: 15 + Math.random() * 30, // 15-45 P/E range
      dividend_yield: Math.random() * 0.06, // 0-6% dividend yield
      beta: 0.5 + Math.random() * 1.5, // 0.5-2.0 beta range
      founded_year: 2350 + Math.floor(Math.random() * 50), // Founded 2350-2400
      headquarters_location: `${companyName.split(' ')[0]} District, Civilization Prime`,
      employee_count: employees,
      annual_revenue: revenue,
      business_description: businessDescription,
      competitive_advantages: competitiveAdvantages,
      recent_developments: recentDevelopments
    };

    // Generate 1-3 leaders for the company
    const leaderCount = Math.floor(Math.random() * 3) + 1;
    const leaders = [];
    const positions = ['Chief Executive Officer', 'Chief Technology Officer', 'Chief Operating Officer', 'Chief Financial Officer'];

    for (let i = 0; i < leaderCount && i < positions.length; i++) {
      const leaderName = this.generateLeaderName(Math.random() < 0.3);
      const personality = this.generateLeaderPersonality();
      const witterHandle = this.generateWitterHandle(leaderName.full_name, companyName);
      
      const leader = {
        full_name: leaderName.full_name,
        position: positions[i],
        age: 35 + Math.floor(Math.random() * 25), // 35-60 years old
        background: `${personality.background} with extensive experience in ${sector} industry`,
        personality_traits: personality.traits,
        leadership_style: personality.leadership_style,
        education: this.generateEducation(sector),
        career_highlights: this.generateCareerHighlights(sector, positions[i]),
        personal_interests: personality.interests,
        communication_style: personality.communication_style,
        public_statements: this.generatePublicStatements(companyName, sector),
        witter_handle: witterHandle,
        contact_availability: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        influence_level: Math.floor(Math.random() * 4) + (i === 0 ? 7 : 5) // CEO gets 7-10, others 5-8
      };

      leaders.push(leader);
    }

    return { company, leaders };
  }

  private generateEducation(sector: string): string {
    const educationTemplates = {
      technology: ['PhD in Computer Science from MIT', 'MS in Electrical Engineering from Stanford', 'PhD in Physics from Caltech'],
      healthcare: ['MD/PhD from Harvard Medical School', 'PhD in Biotechnology from Johns Hopkins', 'MS in Biomedical Engineering from Duke'],
      energy: ['PhD in Nuclear Engineering from MIT', 'MS in Energy Systems from Stanford', 'BS in Physics from Caltech'],
      manufacturing: ['MS in Industrial Engineering from Georgia Tech', 'MBA from Wharton', 'BS in Mechanical Engineering from MIT'],
      transportation: ['BS in Aerospace Engineering from MIT', 'Commercial Pilot License', 'MS in Logistics from Northwestern'],
      financial: ['MBA from Harvard Business School', 'CFA Charter', 'MS in Finance from Wharton'],
      software: ['MS in Computer Science from Carnegie Mellon', 'BS in Software Engineering from Stanford', 'PhD in AI from MIT']
    };

    const templates = educationTemplates[sector as keyof typeof educationTemplates] || 
                     ['MBA from top business school', 'BS in relevant engineering field'];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateCareerHighlights(sector: string, position: string): string[] {
    const highlights = [
      `Led successful ${sector} transformation initiative`,
      `Increased company revenue by 300% over 5 years`,
      `Pioneered breakthrough technology in ${sector}`,
      `Built world-class team of 500+ professionals`,
      `Secured major government contracts worth $10B+`
    ];

    if (position === 'Chief Executive Officer') {
      highlights.push('Successfully took company public', 'Led major acquisition strategy');
    } else if (position === 'Chief Technology Officer') {
      highlights.push('Holds 20+ patents in field', 'Led breakthrough research project');
    }

    return highlights
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 3);
  }

  private generatePublicStatements(companyName: string, sector: string): string[] {
    const statementTemplates = {
      technology: [
        'The future belongs to those who embrace quantum computing today',
        'AI should augment human intelligence, not replace it',
        'Innovation is not just about technology - it\'s about solving human problems'
      ],
      healthcare: [
        'Every breakthrough brings us closer to conquering disease',
        'Healthcare is a human right that technology can help deliver',
        'The future of medicine is personalized and precise'
      ],
      energy: [
        'Clean energy is not just environmental - it\'s economic independence',
        'The fusion revolution will power humanity\'s expansion to the stars',
        'Energy abundance will unlock human potential'
      ]
    };

    const templates = statementTemplates[sector as keyof typeof statementTemplates] || 
                     [`${companyName} is committed to excellence and innovation`];

    return templates.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  // Main generation method
  async generateAndInsertCorporation(
    exchangeId: number,
    sector: string,
    sizeCategory: 'startup' | 'small' | 'medium' | 'large' | 'mega_corp' = 'medium',
    products?: string[]
  ): Promise<{ companyId: number; leaderIds: number[] }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const generated = await this.generateCorporation(exchangeId, sector, sizeCategory, products);

      // Insert company
      const companyQuery = `
        INSERT INTO listed_companies (
          exchange_id, company_symbol, company_name, sector, subsector, market_cap, shares_outstanding,
          current_price, previous_close, daily_change_percent, pe_ratio, dividend_yield, beta,
          founded_year, headquarters_location, employee_count, annual_revenue, business_description,
          competitive_advantages, recent_developments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING id
      `;

      const companyResult = await client.query(companyQuery, [
        generated.company.exchange_id,
        generated.company.company_symbol,
        generated.company.company_name,
        generated.company.sector,
        generated.company.subsector,
        generated.company.market_cap,
        generated.company.shares_outstanding,
        generated.company.current_price,
        generated.company.previous_close,
        generated.company.daily_change_percent,
        generated.company.pe_ratio,
        generated.company.dividend_yield,
        generated.company.beta,
        generated.company.founded_year,
        generated.company.headquarters_location,
        generated.company.employee_count,
        generated.company.annual_revenue,
        generated.company.business_description,
        JSON.stringify(generated.company.competitive_advantages),
        generated.company.recent_developments
      ]);

      const companyId = companyResult.rows[0].id;
      const leaderIds = [];

      // Insert leaders
      for (const leader of generated.leaders) {
        const leaderQuery = `
          INSERT INTO corporate_leaders (
            company_id, full_name, position, age, background, personality_traits,
            leadership_style, education, career_highlights, personal_interests,
            communication_style, public_statements, witter_handle, contact_availability, influence_level
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING id
        `;

        const leaderResult = await client.query(leaderQuery, [
          companyId,
          leader.full_name,
          leader.position,
          leader.age,
          leader.background,
          JSON.stringify(leader.personality_traits),
          leader.leadership_style,
          leader.education,
          JSON.stringify(leader.career_highlights),
          JSON.stringify(leader.personal_interests),
          leader.communication_style,
          JSON.stringify(leader.public_statements),
          leader.witter_handle,
          leader.contact_availability,
          leader.influence_level
        ]);

        leaderIds.push(leaderResult.rows[0].id);
      }

      await client.query('COMMIT');
      return { companyId, leaderIds };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Batch generation for game setup
  async generateEconomicEcosystem(civilizationId: number, companiesPerSector: number = 3): Promise<{
    companies_created: number;
    leaders_created: number;
    sectors_populated: string[];
  }> {
    const sectors = ['technology', 'healthcare', 'energy', 'manufacturing', 'transportation', 'financial', 'software', 'defense', 'materials'];
    const sizeCategories: ('startup' | 'small' | 'medium' | 'large' | 'mega_corp')[] = ['startup', 'small', 'medium', 'large', 'mega_corp'];
    
    let totalCompanies = 0;
    let totalLeaders = 0;
    const populatedSectors = [];

    // Get exchange for this civilization
    const exchangeQuery = 'SELECT id FROM stock_exchanges WHERE civilization_id = $1 LIMIT 1';
    const exchangeResult = await this.pool.query(exchangeQuery, [civilizationId]);
    
    if (exchangeResult.rows.length === 0) {
      throw new Error(`No stock exchange found for civilization ${civilizationId}`);
    }

    const exchangeId = exchangeResult.rows[0].id;

    for (const sector of sectors) {
      for (let i = 0; i < companiesPerSector; i++) {
        const sizeCategory = sizeCategories[Math.floor(Math.random() * sizeCategories.length)];
        
        try {
          const result = await this.generateAndInsertCorporation(exchangeId, sector, sizeCategory);
          totalCompanies++;
          totalLeaders += result.leaderIds.length;
          
          if (!populatedSectors.includes(sector)) {
            populatedSectors.push(sector);
          }
        } catch (error) {
          console.error(`Failed to generate corporation in ${sector}:`, error);
        }
      }
    }

    return {
      companies_created: totalCompanies,
      leaders_created: totalLeaders,
      sectors_populated: populatedSectors
    };
  }
}

// Service instance
let proceduralCorporationGenerator: ProceduralCorporationGenerator | null = null;

export function getProceduralCorporationGenerator(): ProceduralCorporationGenerator {
  if (!proceduralCorporationGenerator) {
    throw new Error('ProceduralCorporationGenerator not initialized. Call initializeProceduralCorporationGenerator first.');
  }
  return proceduralCorporationGenerator;
}

export function initializeProceduralCorporationGenerator(pool: Pool): void {
  proceduralCorporationGenerator = new ProceduralCorporationGenerator(pool);
}
