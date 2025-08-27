// ===== COMMUNICATION HUB SYSTEM =====
const communicationGameState = {
  status: 'operational',
  activeChannels: 12,
  connectedUsers: 847,
  messagesSent: 15420,
  voiceCallsActive: 3,
  lastUpdate: new Date().toISOString(),
  
  // Communication channels - organized by groups for multi-person conversations
  channels: [
    // === CABINET CHANNELS ===
    {
      id: 'cabinet-full',
      name: 'Full Cabinet Meeting',
      type: 'secure',
      category: 'cabinet',
      participants: ['sec-defense', 'sec-state', 'sec-treasury'],
      participantCount: 3,
      isActive: true,
      encryption: 'quantum',
      description: 'All cabinet members for major policy discussions'
    },
    {
      id: 'national-security',
      name: 'National Security Council',
      type: 'secure',
      category: 'security',
      participants: ['sec-defense', 'cia-director', 'nsa-director', 'joint-chiefs-chair'],
      participantCount: 4,
      isActive: true,
      encryption: 'quantum',
      description: 'Defense and intelligence leadership'
    },
    {
      id: 'economic-council',
      name: 'Economic Advisory Council',
      type: 'secure',
      category: 'economic',
      participants: ['sec-treasury', 'fed-chair', 'chief-advisor'],
      participantCount: 3,
      isActive: true,
      encryption: 'standard',
      description: 'Economic policy and financial oversight'
    },

    // === MILITARY CHANNELS ===
    {
      id: 'joint-chiefs',
      name: 'Joint Chiefs of Staff',
      type: 'secure',
      category: 'military',
      participants: ['joint-chiefs-chair', 'space-force-chief'],
      participantCount: 2,
      isActive: true,
      encryption: 'quantum',
      description: 'Military leadership coordination'
    },
    {
      id: 'defense-command',
      name: 'Defense Command',
      type: 'secure',
      category: 'military',
      participants: ['sec-defense', 'joint-chiefs-chair', 'space-force-chief'],
      participantCount: 3,
      isActive: true,
      encryption: 'quantum',
      description: 'Defense strategy and operations'
    },

    // === INTELLIGENCE CHANNELS ===
    {
      id: 'intelligence-community',
      name: 'Intelligence Community',
      type: 'secure',
      category: 'intelligence',
      participants: ['cia-director', 'nsa-director'],
      participantCount: 2,
      isActive: true,
      encryption: 'quantum',
      description: 'Intelligence sharing and coordination'
    },

    // === LEGISLATIVE CHANNELS ===
    {
      id: 'congressional-leadership',
      name: 'Congressional Leadership',
      type: 'secure',
      category: 'legislative',
      participants: ['senate-majority', 'house-speaker'],
      participantCount: 2,
      isActive: true,
      encryption: 'standard',
      description: 'Legislative coordination and policy discussion'
    },

    // === INDUSTRY CHANNELS ===
    {
      id: 'industry-leaders',
      name: 'Industry Advisory Board',
      type: 'restricted',
      category: 'industry',
      participants: ['tech-ceo', 'mining-ceo'],
      participantCount: 2,
      isActive: true,
      encryption: 'standard',
      description: 'Private sector consultation and partnership'
    },

    // === REGIONAL CHANNELS ===
    {
      id: 'colonial-governors',
      name: 'Colonial Governors Council',
      type: 'secure',
      category: 'regional',
      participants: ['mars-governor', 'europa-mayor'],
      participantCount: 2,
      isActive: true,
      encryption: 'standard',
      description: 'Colonial administration and development'
    },

    // === DIPLOMATIC CHANNELS ===
    {
      id: 'foreign-relations',
      name: 'Foreign Relations',
      type: 'diplomatic',
      category: 'diplomatic',
      participants: ['sec-state', 'centauri-leader', 'vegan-emperor'],
      participantCount: 3,
      isActive: true,
      encryption: 'diplomatic',
      description: 'Interstellar diplomatic communications'
    },

    // === CITIZEN CHANNELS ===
    {
      id: 'citizen-forum',
      name: 'Citizen Forum',
      type: 'public',
      category: 'public',
      participants: ['citizen-1', 'citizen-2'],
      participantCount: 2,
      isActive: true,
      encryption: 'none',
      description: 'Direct communication with citizens'
    },

    // === EMERGENCY CHANNELS ===
    {
      id: 'emergency',
      name: 'Emergency Broadcast',
      type: 'broadcast',
      category: 'emergency',
      participants: [],
      participantCount: 0,
      isActive: false,
      encryption: 'quantum',
      description: 'Galaxy-wide emergency communications'
    },

    // === ADVISOR CHANNELS ===
    {
      id: 'policy-advisors',
      name: 'Policy Advisory Team',
      type: 'secure',
      category: 'advisor',
      participants: ['chief-advisor'],
      participantCount: 1,
      isActive: true,
      encryption: 'standard',
      description: 'Policy development and strategic planning'
    },

    // === ALLIANCE CHANNELS ===
    {
      id: 'terran-alliance',
      name: 'Terran Alliance Council',
      type: 'diplomatic',
      category: 'alliance',
      participants: ['mars-governor', 'europa-mayor'],
      participantCount: 2,
      isActive: true,
      encryption: 'diplomatic',
      description: 'Terran Alliance member coordination and policy'
    },
    {
      id: 'centauri-pact',
      name: 'Centauri Trade Pact',
      type: 'diplomatic',
      category: 'alliance',
      participants: ['sec-state', 'centauri-leader'],
      participantCount: 2,
      isActive: true,
      encryption: 'diplomatic',
      description: 'Trade and diplomatic relations with Centauri Alliance'
    },
    {
      id: 'vegan-confederation',
      name: 'Vegan Confederation Relations',
      type: 'diplomatic',
      category: 'alliance',
      participants: ['sec-state', 'vegan-emperor'],
      participantCount: 2,
      isActive: true,
      encryption: 'diplomatic',
      description: 'Diplomatic communications with Vegan Confederation'
    },

    // === BUSINESS SECTOR CHANNELS ===
    {
      id: 'quantum-tech-sector',
      name: 'Quantum Technology Sector',
      type: 'restricted',
      category: 'business',
      participants: ['tech-ceo', 'sec-technology'],
      participantCount: 2,
      isActive: true,
      encryption: 'standard',
      description: 'Quantum technology industry coordination and policy'
    },
    {
      id: 'mining-sector',
      name: 'Space Mining Consortium',
      type: 'restricted',
      category: 'business',
      participants: ['mining-ceo', 'sec-interior'],
      participantCount: 2,
      isActive: true,
      encryption: 'standard',
      description: 'Space mining industry and resource management'
    },
    {
      id: 'transportation-sector',
      name: 'Interstellar Transportation Guild',
      type: 'restricted',
      category: 'business',
      participants: ['citizen-2', 'sec-commerce'],
      participantCount: 2,
      isActive: true,
      encryption: 'standard',
      description: 'Transportation industry and trade route coordination'
    },

    // === GENERAL CHANNELS ===
    {
      id: 'general',
      name: 'General Communications',
      type: 'public',
      category: 'general',
      participants: [],
      participantCount: 847,
      isActive: true,
      encryption: 'standard',
      description: 'Open communication channel for all personnel'
    }
  ],

  // Contact list for voice communication - Living Characters with Backstories
  contacts: [
    // === CABINET MEMBERS ===
    {
      id: 'sec-defense',
      name: 'General Marcus Stone',
      title: 'Secretary of Defense',
      avatar: 'MS',
      status: 'online',
      location: 'Pentagon Complex',
      clearanceLevel: 'top-secret',
      category: 'cabinet',
      canFire: true,
      canPostToWitter: false,
      backstory: 'Former Marine Corps General with 30 years of service. Led the successful defense of the Outer Rim colonies during the Pirate Wars. Known for his strategic brilliance and unwavering loyalty.',
      personality: 'Direct, tactical, protective, values honor and duty above all else',
      specialties: ['Military Strategy', 'Defense Planning', 'Crisis Management', 'Interstellar Security'],
      civilization: 'Terran Federation',
      homeworld: 'Mars',
      yearsOfService: 30,
      securityClearance: 'Ultra',
      languages: ['English', 'Military Standard', 'Centauri Basic'],
      currentMission: 'Overseeing galactic defense strategy and colonial security',
      lastSeen: new Date().toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Mr. President, our deep space sensors have detected unusual movement in the Neutral Zone. Recommend increasing patrol frequency.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    },
    {
      id: 'sec-state',
      name: 'Ambassador Elena Vasquez',
      title: 'Secretary of State',
      avatar: 'EV',
      status: 'busy',
      location: 'Diplomatic Quarter',
      clearanceLevel: 'top-secret',
      category: 'cabinet',
      canFire: true,
      canPostToWitter: true,
      backstory: 'Former Ambassador to the Centauri Alliance, instrumental in negotiating the Trade Accords of 2387. Speaks 12 languages fluently and has deep understanding of galactic politics.',
      personality: 'Diplomatic, multilingual, culturally sensitive, strategic negotiator',
      specialties: ['Diplomatic Relations', 'Trade Negotiations', 'Cultural Affairs', 'Interstellar Law'],
      lastSeen: new Date(Date.now() - 1800000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The Andromedan Council has requested a formal meeting regarding the mining rights dispute. I recommend we accept.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },
    {
      id: 'sec-treasury',
      name: 'Dr. James Chen',
      title: 'Secretary of the Treasury',
      avatar: 'JC',
      status: 'online',
      location: 'Treasury Building',
      clearanceLevel: 'classified',
      category: 'cabinet',
      canFire: true,
      canPostToWitter: false,
      backstory: 'Former Chief Economist at the Galactic Trade Commission. PhD in Interstellar Economics from Terra University. Architect of the current monetary policy framework.',
      personality: 'Analytical, data-driven, fiscally conservative, detail-oriented',
      specialties: ['Economic Policy', 'Fiscal Management', 'Trade Analysis', 'Monetary Policy'],
      lastSeen: new Date(Date.now() - 900000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The quarterly economic report shows strong growth in the outer colonies. However, inflation is trending upward.',
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },

    // === CENTRAL BANK ===
    {
      id: 'fed-chair',
      name: 'Dr. Sarah Kim',
      title: 'Federal Reserve Chair',
      avatar: 'SK',
      status: 'online',
      location: 'Federal Reserve Complex',
      clearanceLevel: 'classified',
      category: 'financial',
      canFire: true,
      canPostToWitter: false,
      backstory: 'Former professor of Galactic Monetary Theory at Cambridge Stellar. Served as Deputy Chair for 8 years before appointment. Expert in quantum currency systems.',
      personality: 'Methodical, independent, data-focused, speaks in measured tones',
      specialties: ['Monetary Policy', 'Interest Rates', 'Currency Stability', 'Economic Forecasting'],
      lastSeen: new Date(Date.now() - 300000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Mr. President, we\'re considering a 0.25% interest rate adjustment to combat rising inflation. Your thoughts?',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    },

    // === INTELLIGENCE DIRECTORS ===
    {
      id: 'cia-director',
      name: 'Director Michael Torres',
      title: 'CIA Director',
      avatar: 'MT',
      status: 'away',
      location: 'Classified Location',
      clearanceLevel: 'top-secret',
      category: 'intelligence',
      canFire: true,
      canPostToWitter: false,
      backstory: 'Former field operative with 25 years in intelligence. Served in deep cover operations across three star systems. Known for his network of assets and analytical mind.',
      personality: 'Cautious, analytical, speaks in code, trusts few people',
      specialties: ['Human Intelligence', 'Covert Operations', 'Threat Assessment', 'Foreign Intelligence'],
      lastSeen: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Asset Nightingale reports unusual activity in Sector 7. Recommend increased surveillance. Details in classified briefing.',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    },
    {
      id: 'nsa-director',
      name: 'Admiral Lisa Park',
      title: 'NSA Director',
      avatar: 'LP',
      status: 'busy',
      location: 'Fort Meade Complex',
      clearanceLevel: 'top-secret',
      category: 'intelligence',
      canFire: true,
      canPostToWitter: false,
      backstory: 'Former Navy cryptologist and signals intelligence expert. Led the team that cracked the Vegan encryption protocols. Expert in quantum communications security.',
      personality: 'Technical, precise, security-focused, speaks in technical terms',
      specialties: ['Signals Intelligence', 'Cybersecurity', 'Communications Intercept', 'Quantum Encryption'],
      lastSeen: new Date(Date.now() - 1800000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'We\'ve intercepted concerning chatter from the Outer Rim. Possible coordinated activity. Full briefing available.',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },

    // === JOINT CHIEFS OF STAFF ===
    {
      id: 'joint-chiefs-chair',
      name: 'General Patricia Williams',
      title: 'Chairman, Joint Chiefs',
      avatar: 'PW',
      status: 'online',
      location: 'Pentagon War Room',
      clearanceLevel: 'top-secret',
      category: 'military',
      canFire: true,
      canPostToWitter: false,
      backstory: 'First female Chairman of the Joint Chiefs. Rose through the ranks during the Colonial Wars. Expert in multi-domain warfare and interstellar logistics.',
      personality: 'Commanding, strategic, decisive, inspires confidence',
      specialties: ['Joint Operations', 'Strategic Planning', 'Military Logistics', 'Force Readiness'],
      lastSeen: new Date(Date.now() - 600000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'All service branches report ready status. Joint exercise Stellar Shield commences next week.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    },
    {
      id: 'space-force-chief',
      name: 'General Robert Hayes',
      title: 'Space Force Chief of Staff',
      avatar: 'RH',
      status: 'online',
      location: 'Space Command HQ',
      clearanceLevel: 'top-secret',
      category: 'military',
      canFire: true,
      canPostToWitter: false,
      backstory: 'Veteran of the Asteroid Belt campaigns. Pioneer in zero-gravity combat tactics. Led the development of the new Stellar Defense Grid.',
      personality: 'Innovative, forward-thinking, tech-savvy, calm under pressure',
      specialties: ['Space Operations', 'Orbital Defense', 'Stellar Navigation', 'Zero-G Combat'],
      lastSeen: new Date(Date.now() - 1200000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'New deep space monitoring stations are operational. Coverage now extends to the Helix Nebula.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },

    // === LEGISLATIVE LEADERS ===
    {
      id: 'senate-majority',
      name: 'Senator Maria Rodriguez',
      title: 'Senate Majority Leader',
      avatar: 'MR',
      status: 'busy',
      location: 'Capitol Building',
      clearanceLevel: 'restricted',
      category: 'legislative',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Former Governor of the Mars Colony. Champion of colonial rights and infrastructure development. Known for her ability to build bipartisan coalitions.',
      personality: 'Pragmatic, coalition-builder, passionate about colonial issues',
      specialties: ['Legislative Strategy', 'Coalition Building', 'Colonial Affairs', 'Infrastructure Policy'],
      lastSeen: new Date(Date.now() - 2400000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The Infrastructure Bill has enough votes to pass. We should schedule the vote for next week.',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },
    {
      id: 'house-speaker',
      name: 'Representative David Kim',
      title: 'Speaker of the House',
      avatar: 'DK',
      status: 'online',
      location: 'House Chamber',
      clearanceLevel: 'restricted',
      category: 'legislative',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Former tech entrepreneur who sold his quantum computing company to enter politics. Advocates for technological advancement and education reform.',
      personality: 'Tech-savvy, progressive, articulate, future-focused',
      specialties: ['Technology Policy', 'Education Reform', 'Innovation Strategy', 'Digital Rights'],
      lastSeen: new Date(Date.now() - 900000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The Technology Advancement Act is ready for your signature. This will accelerate our quantum research programs.',
          timestamp: new Date(Date.now() - 12600000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    },

    // === SUPREME COURT ===
    {
      id: 'chief-justice',
      name: 'Chief Justice Amanda Foster',
      title: 'Chief Justice, Supreme Court',
      avatar: 'AF',
      status: 'away',
      location: 'Supreme Court Building',
      clearanceLevel: 'classified',
      category: 'judicial',
      canFire: false,
      canPostToWitter: false,
      backstory: 'Former Federal Appeals Court Judge with expertise in interstellar law. Authored the landmark decision on AI rights. Known for her careful deliberation and legal scholarship.',
      personality: 'Thoughtful, principled, scholarly, speaks with legal precision',
      specialties: ['Constitutional Law', 'Interstellar Jurisprudence', 'AI Rights', 'Legal Precedent'],
      lastSeen: new Date(Date.now() - 5400000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The Court will hear arguments on the Colonial Representation case next month. This could impact voting rights.',
          timestamp: new Date(Date.now() - 25200000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },

    // === INDUSTRY LEADERS ===
    {
      id: 'tech-ceo',
      name: 'Dr. Alex Chen',
      title: 'CEO, Quantum Dynamics Corp',
      avatar: 'AC',
      status: 'online',
      location: 'Corporate Headquarters',
      clearanceLevel: 'restricted',
      category: 'industry',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Child prodigy who founded Quantum Dynamics at age 25. Revolutionary work in quantum computing and AI. Major government contractor for defense systems.',
      personality: 'Brilliant, ambitious, innovative, sometimes impatient with bureaucracy',
      specialties: ['Quantum Computing', 'Artificial Intelligence', 'Defense Technology', 'Innovation'],
      lastSeen: new Date(Date.now() - 1800000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Our new quantum processors are ready for government deployment. 1000x faster than current systems.',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    },
    {
      id: 'mining-ceo',
      name: 'Captain Isabella Santos',
      title: 'CEO, Stellar Mining Consortium',
      avatar: 'IS',
      status: 'busy',
      location: 'Asteroid Belt Operations',
      clearanceLevel: 'restricted',
      category: 'industry',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Former asteroid miner who built the largest mining operation in the galaxy. Self-made billionaire with deep knowledge of resource extraction and space logistics.',
      personality: 'Tough, practical, straight-talking, values hard work',
      specialties: ['Resource Extraction', 'Space Logistics', 'Mining Technology', 'Supply Chain'],
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Rare earth deposits discovered in the Vega system. Could revolutionize our manufacturing capabilities.',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },

    // === CITY/PLANET LEADERS ===
    {
      id: 'mars-governor',
      name: 'Governor Rachel Thompson',
      title: 'Governor of Mars',
      avatar: 'RT',
      status: 'online',
      location: 'New Olympia, Mars',
      clearanceLevel: 'restricted',
      category: 'regional',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Former terraforming engineer who led the Mars atmospheric project. Popular governor focused on colonial development and environmental sustainability.',
      personality: 'Environmental advocate, practical problem-solver, colonial pride',
      specialties: ['Terraforming', 'Colonial Development', 'Environmental Policy', 'Infrastructure'],
      lastSeen: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The new atmospheric processors are exceeding expectations. Mars will be fully terraformed ahead of schedule.',
          timestamp: new Date(Date.now() - 28800000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    },
    {
      id: 'europa-mayor',
      name: 'Mayor Chen Wei',
      title: 'Mayor of New Shanghai, Europa',
      avatar: 'CW',
      status: 'away',
      location: 'New Shanghai, Europa',
      clearanceLevel: 'public',
      category: 'regional',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Former urban planner who designed the underwater cities of Europa. Expert in sustainable living and aquatic environments.',
      personality: 'Innovative urban planner, environmentally conscious, community-focused',
      specialties: ['Urban Planning', 'Aquatic Environments', 'Sustainable Development', 'Community Building'],
      lastSeen: new Date(Date.now() - 10800000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The underwater farming initiative is producing 200% more food than projected. Other colonies want to replicate our model.',
          timestamp: new Date(Date.now() - 32400000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },

    // === FOREIGN LEADERS (AI) ===
    {
      id: 'centauri-leader',
      name: 'Prime Minister Zara Al\'thek',
      title: 'Prime Minister, Centauri Alliance',
      avatar: 'ZA',
      status: 'online',
      location: 'Proxima Centauri Prime',
      clearanceLevel: 'diplomatic',
      category: 'foreign-ai',
      canFire: false,
      canPostToWitter: false,
      backstory: 'Leader of the Centauri Alliance, a federation of three star systems. Known for her diplomatic skills and commitment to peaceful coexistence.',
      personality: 'Diplomatic, wise, speaks formally, values honor and tradition',
      specialties: ['Interstellar Diplomacy', 'Trade Relations', 'Cultural Exchange', 'Peaceful Resolution'],
      lastSeen: new Date(Date.now() - 14400000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Honored President, the Alliance Council wishes to discuss the proposed trade corridor through the Neutral Zone.',
          timestamp: new Date(Date.now() - 36000000).toISOString(),
          isVoice: false,
          translated: true,
          originalLanguage: 'Centauri Standard'
        }
      ]
    },
    {
      id: 'vegan-emperor',
      name: 'Emperor Keth\'var the Wise',
      title: 'Emperor of the Vegan Confederation',
      avatar: 'KV',
      status: 'busy',
      location: 'Vega Prime',
      clearanceLevel: 'diplomatic',
      category: 'foreign-ai',
      canFire: false,
      canPostToWitter: false,
      backstory: 'Ancient ruler of the Vegan Confederation, over 300 years old due to life extension technology. Vast knowledge of galactic history and politics.',
      personality: 'Ancient, wise, speaks in metaphors, long-term thinker',
      specialties: ['Galactic History', 'Long-term Strategy', 'Ancient Wisdom', 'Cultural Preservation'],
      lastSeen: new Date(Date.now() - 21600000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Young leader, the stars whisper of changes ahead. Perhaps we should meet to discuss the ancient prophecies.',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          isVoice: true,
          translated: true,
          originalLanguage: 'Ancient Vegan'
        }
      ]
    },

    // === POLICY ADVISORS ===
    {
      id: 'chief-advisor',
      name: 'Dr. Jennifer Walsh',
      title: 'Chief Policy Advisor',
      avatar: 'JW',
      status: 'online',
      location: 'West Wing',
      clearanceLevel: 'top-secret',
      category: 'advisor',
      canFire: true,
      canPostToWitter: false,
      backstory: 'Former Harvard professor of Public Policy with expertise in galactic governance. Served three previous administrations in various advisory roles.',
      personality: 'Intellectual, strategic, speaks in policy terms, detail-oriented',
      specialties: ['Policy Analysis', 'Strategic Planning', 'Governance Theory', 'Political Strategy'],
      lastSeen: new Date(Date.now() - 900000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'The polling data on the Colonial Rights Act looks favorable. I recommend moving forward with the announcement.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },

    // === RANDOM CITIZENS ===
    {
      id: 'citizen-1',
      name: 'Maria Gonzalez',
      title: 'Quantum Engineer, Terra City',
      avatar: 'MG',
      status: 'online',
      location: 'Terra City, Earth',
      clearanceLevel: 'public',
      category: 'citizen',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Works at the Quantum Research Institute. Single mother of two. Concerned about education funding and job security in the tech sector.',
      personality: 'Hardworking, concerned parent, tech-savvy, speaks plainly',
      specialties: ['Quantum Engineering', 'Education Advocacy', 'Working Parent Perspective'],
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'Mr. President, I hope you\'ll consider increasing funding for STEM education. Our kids need better preparation for the quantum age.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isVoice: false,
          translated: false
        }
      ]
    },
    {
      id: 'citizen-2',
      name: 'Captain Jake Morrison',
      title: 'Cargo Pilot, Outer Rim',
      avatar: 'JM',
      status: 'away',
      location: 'Transport Ship Aurora',
      clearanceLevel: 'public',
      category: 'citizen',
      canFire: false,
      canPostToWitter: true,
      backstory: 'Independent cargo pilot who runs supplies to the frontier colonies. Veteran of the Merchant Marine. Concerned about piracy and trade route security.',
      personality: 'Independent, practical, frontier mentality, speaks with spacer slang',
      specialties: ['Space Transportation', 'Frontier Life', 'Trade Route Security'],
      lastSeen: new Date(Date.now() - 18000000).toISOString(),
      messages: [
        {
          id: 1,
          type: 'received',
          content: 'President, the pirates are getting bolder out here in the Rim. We need more patrol ships protecting the trade routes.',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isVoice: true,
          translated: false
        }
      ]
    }
  ],

  // Communication settings
  settings: {
    universalTranslation: true,
    voiceRecognition: true,
    encryption: 'quantum',
    autoTranscription: true,
    emergencyAlerts: true,
    voiceMode: true,
    showDetailedProfiles: true,
    autoJoinChannels: true,
    recordAllConversations: true,
    languages: [
      { code: 'en', name: 'Terran Standard', native: 'English' },
      { code: 'zh', name: 'Sino-Terran', native: '中文' },
      { code: 'es', name: 'Hispanic Standard', native: 'Español' },
      { code: 'ar', name: 'Arabic Federation', native: 'العربية' },
      { code: 'hi', name: 'Indo-Terran', native: 'हिन्दी' },
      { code: 'ru', name: 'Slavic Union', native: 'Русский' },
      { code: 'pt', name: 'Lusitanian', native: 'Português' },
      { code: 'fr', name: 'Franco-Terran', native: 'Français' },
      { code: 'de', name: 'Germanic Alliance', native: 'Deutsch' },
      { code: 'ja', name: 'Neo-Japanese', native: '日本語' },
      { code: 'vg', name: 'Vegan Standard', native: 'Vεγαη' },
      { code: 'ct', name: 'Centauri', native: 'Çεηταυrι' },
      { code: 'and', name: 'Andromedan', native: 'Αηδrομεδαη' }
    ],
    currentLanguage: 'en'
  },

  // Favorites system for frequently contacted characters
  favorites: [
    'sec-defense', 'sec-state', 'fed-chair', 'joint-chiefs-chair', 'cia-director'
  ],

  // User's joined channels
  joinedChannels: [
    'cabinet-full', 'national-security', 'economic-council', 'industry-leaders', 'general'
  ],

  // Conversation transcripts storage
  transcripts: new Map(),

  // Search and filter state
  searchFilters: {
    searchTerm: '',
    categoryFilter: 'all',
    statusFilter: 'all',
    locationFilter: 'all',
    canFireFilter: 'all',
    canPostToWitterFilter: 'all',
    civilizationFilter: 'all'
  },

  // Alliance information for diplomatic channels
  alliances: [
    {
      id: 'terran-alliance',
      name: 'Terran Alliance',
      members: ['earth', 'mars', 'europa', 'titan'],
      leaders: ['mars-governor', 'europa-mayor'],
      status: 'active',
      established: '2385-03-15'
    },
    {
      id: 'centauri-pact',
      name: 'Centauri Trade Pact',
      members: ['centauri-prime', 'proxima-b', 'alpha-centauri-c'],
      leaders: ['centauri-leader'],
      status: 'active',
      established: '2387-07-22'
    },
    {
      id: 'vegan-confederation',
      name: 'Vegan Confederation',
      members: ['vega-prime', 'vega-ii', 'vega-mining-station'],
      leaders: ['vegan-emperor'],
      status: 'active',
      established: '2380-12-01'
    }
  ],

  // Business sectors for industry channels
  businessSectors: [
    {
      id: 'quantum-tech',
      name: 'Quantum Technology',
      leaders: ['tech-ceo'],
      companies: ['Quantum Dynamics Corp', 'Neural Interface Systems', 'Quantum Computing Solutions']
    },
    {
      id: 'space-mining',
      name: 'Space Mining & Resources',
      leaders: ['mining-ceo'],
      companies: ['Stellar Mining Consortium', 'Asteroid Belt Industries', 'Deep Space Resources']
    },
    {
      id: 'transportation',
      name: 'Interstellar Transportation',
      leaders: ['citizen-2'],
      companies: ['Galactic Freight Corp', 'Stellar Express', 'Quantum Jump Lines']
    }
  ],

  // Voice communication features
  voiceFeatures: {
    speechToText: true,
    textToSpeech: true,
    voiceFilters: ['noise-reduction', 'echo-cancellation', 'clarity-enhancement'],
    voiceProfiles: ['command', 'diplomatic', 'casual', 'emergency'],
    currentProfile: 'command'
  },

  // Communication logs
  logs: [
    { timestamp: new Date().toISOString(), event: 'System initialized', type: 'system' },
    { timestamp: new Date(Date.now() - 60000).toISOString(), event: 'Encryption enabled', type: 'security' },
    { timestamp: new Date(Date.now() - 120000).toISOString(), event: 'Voice recognition ready', type: 'voice' },
    { timestamp: new Date(Date.now() - 180000).toISOString(), event: 'Translation services online', type: 'translation' },
    { timestamp: new Date(Date.now() - 240000).toISOString(), event: 'Quantum channel established', type: 'network' }
  ],

  // Message statistics
  statistics: {
    totalMessages: 15420,
    voiceMessages: 3847,
    textMessages: 11573,
    translatedMessages: 2156,
    encryptedMessages: 8934,
    emergencyBroadcasts: 12,
    averageResponseTime: 1.2, // seconds
    uptime: 99.7, // percentage
    bandwidthUsage: 78.3 // percentage
  }
};

// Communication system functions
function getSystemStatus() {
  return {
    status: communicationGameState.status,
    activeChannels: communicationGameState.activeChannels,
    connectedUsers: communicationGameState.connectedUsers,
    messagesSent: communicationGameState.messagesSent,
    voiceCallsActive: communicationGameState.voiceCallsActive,
    lastUpdate: new Date().toISOString()
  };
}

function getContacts() {
  return communicationGameState.contacts.map(contact => ({
    id: contact.id,
    name: contact.name,
    title: contact.title,
    avatar: contact.avatar,
    status: contact.status,
    location: contact.location,
    lastSeen: contact.lastSeen,
    messageCount: contact.messages.length
  }));
}

function getContactMessages(contactId) {
  const contact = communicationGameState.contacts.find(c => c.id === contactId);
  if (!contact) {
    return { error: 'Contact not found' };
  }

  return {
    contact: {
      id: contact.id,
      name: contact.name,
      title: contact.title,
      avatar: contact.avatar,
      status: contact.status,
      location: contact.location,
      clearanceLevel: contact.clearanceLevel
    },
    messages: contact.messages
  };
}

function sendMessage(contactId, content, isVoice = false) {
  const contact = communicationGameState.contacts.find(c => c.id === contactId);
  if (!contact) {
    return { error: 'Contact not found' };
  }

  const newMessage = {
    id: contact.messages.length + 1,
    type: 'sent',
    content: content,
    timestamp: new Date().toISOString(),
    isVoice: isVoice,
    translated: false
  };

  contact.messages.push(newMessage);
  communicationGameState.messagesSent++;
  
  if (isVoice) {
    communicationGameState.statistics.voiceMessages++;
  } else {
    communicationGameState.statistics.textMessages++;
  }

  // Add to communication log
  communicationGameState.logs.unshift({
    timestamp: new Date().toISOString(),
    event: `Message sent to ${contact.name}`,
    type: 'message'
  });

  return { success: true, message: newMessage };
}

function getChannels() {
  return communicationGameState.channels;
}

function joinChannel(channelId, userId) {
  const channel = communicationGameState.channels.find(c => c.id === channelId);
  if (!channel) {
    return { error: 'Channel not found' };
  }

  channel.participants++;
  communicationGameState.connectedUsers++;

  communicationGameState.logs.unshift({
    timestamp: new Date().toISOString(),
    event: `User joined channel: ${channel.name}`,
    type: 'channel'
  });

  return { success: true, channel: channel };
}

function getSettings() {
  return communicationGameState.settings;
}

function updateSettings(newSettings) {
  Object.assign(communicationGameState.settings, newSettings);
  
  communicationGameState.logs.unshift({
    timestamp: new Date().toISOString(),
    event: 'Communication settings updated',
    type: 'settings'
  });

  return { success: true, settings: communicationGameState.settings };
}

function getCommunicationLogs(limit = 50) {
  return communicationGameState.logs.slice(0, limit);
}

function getStatistics() {
  return {
    ...communicationGameState.statistics,
    uptime: Math.min(99.9, communicationGameState.statistics.uptime + Math.random() * 0.1),
    bandwidthUsage: Math.max(50, Math.min(95, communicationGameState.statistics.bandwidthUsage + (Math.random() - 0.5) * 5))
  };
}

function simulateIncomingMessage(contactId) {
  const contact = communicationGameState.contacts.find(c => c.id === contactId);
  if (!contact) {
    return { error: 'Contact not found' };
  }

  const responses = [
    'Roger that, standing by for further instructions.',
    'Message received and understood. Proceeding as directed.',
    'Acknowledged. Will report back with updates.',
    'Copy that. Maintaining current position.',
    'Understood. Initiating requested protocols.',
    'Message confirmed. All systems nominal.',
    'Received. Adjusting course as requested.',
    'Affirmative. Beginning scan sequence now.'
  ];

  const newMessage = {
    id: contact.messages.length + 1,
    type: 'received',
    content: responses[Math.floor(Math.random() * responses.length)],
    timestamp: new Date().toISOString(),
    isVoice: Math.random() > 0.7,
    translated: Math.random() > 0.8
  };

  contact.messages.push(newMessage);
  contact.lastSeen = new Date().toISOString();

  return { success: true, message: newMessage };
}

// Initialize communication system
function initializeCommunicationSystem() {
  // Update last update timestamp
  communicationGameState.lastUpdate = new Date().toISOString();
  
  // Simulate some activity
  setInterval(() => {
    // Randomly update connected users
    const change = Math.floor(Math.random() * 10) - 5;
    communicationGameState.connectedUsers = Math.max(800, Math.min(1000, communicationGameState.connectedUsers + change));
    
    // Update message count
    communicationGameState.messagesSent += Math.floor(Math.random() * 3);
    
    // Update voice calls
    communicationGameState.voiceCallsActive = Math.max(0, Math.min(8, communicationGameState.voiceCallsActive + Math.floor(Math.random() * 3) - 1));
    
    // Update timestamp
    communicationGameState.lastUpdate = new Date().toISOString();
  }, 30000); // Update every 30 seconds

  console.log(`Communication system initialized with ${communicationGameState.contacts.length} contacts and ${communicationGameState.channels.length} channels`);
}

// Initialize the system
initializeCommunicationSystem();

module.exports = {
  communicationGameState,
  getSystemStatus,
  getContacts,
  getContactMessages,
  sendMessage,
  getChannels,
  joinChannel,
  getSettings,
  updateSettings,
  getCommunicationLogs,
  getStatistics,
  simulateIncomingMessage,
  initializeCommunicationSystem
};
