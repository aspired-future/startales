#!/usr/bin/env node

/**
 * Character Awareness System Demo (CommonJS version)
 * 
 * Simple demonstration of character awareness features
 */

console.log('🎭 Character Awareness System Demo');
console.log('=================================\n');

// Mock character data
const mockCharacters = [
  {
    id: 'treasury_secretary_001',
    name: { full_display: 'Secretary Elena Rodriguez' },
    profession: { current_job: 'Treasury Secretary', career_level: 'executive' },
    category: 'official',
    attributes: { intelligence: 88, charisma: 75, integrity: 92 },
    personality: { core_traits: ['analytical', 'diplomatic'] },
    skills: { economics: { skills: { fiscal_policy: 95 } } }
  },
  {
    id: 'defense_minister_001',
    name: { full_display: 'Defense Minister Admiral Chen' },
    profession: { current_job: 'Defense Minister', career_level: 'executive' },
    category: 'military',
    attributes: { intelligence: 85, leadership: 95, integrity: 90 },
    personality: { core_traits: ['strategic', 'decisive'] },
    skills: { military: { skills: { strategic_planning: 95 } } }
  },
  {
    id: 'business_leader_001',
    name: { full_display: 'CEO Marcus Thompson' },
    profession: { current_job: 'Chief Executive Officer', career_level: 'executive' },
    category: 'business',
    attributes: { charisma: 88, ambition: 95, leadership: 90 },
    personality: { core_traits: ['ambitious', 'innovative'] },
    skills: { business: { skills: { strategic_management: 90 } } }
  },
  {
    id: 'journalist_001',
    name: { full_display: 'Senior Correspondent Sarah Kim' },
    profession: { current_job: 'Senior Political Correspondent', career_level: 'senior' },
    category: 'media',
    attributes: { intelligence: 85, creativity: 88, empathy: 75 },
    personality: { core_traits: ['curious', 'persistent'] },
    skills: { journalism: { skills: { investigative_reporting: 90 } } }
  }
];

// Mock game state
const mockGameState = {
  gamePhase: 'mid_game',
  playerCivilization: {
    name: 'Terran Federation',
    species: 'Human',
    government_type: 'Democratic Republic',
    total_population: 12500000000,
    military_strength: 85,
    economic_power: 78
  },
  economicSituation: {
    gdp: 45000000000000,
    unemployment_rate: 3.2,
    inflation_rate: 2.1
  },
  socialSituation: {
    population_happiness: 78,
    social_unrest_level: 15
  },
  militarySituation: {
    threat_level: 'moderate',
    military_readiness: 85
  }
};

// Character awareness simulation
function simulateCharacterAwareness() {
  console.log('📊 Current Game State:');
  console.log('---------------------');
  console.log(`Civilization: ${mockGameState.playerCivilization.name}`);
  console.log(`Government: ${mockGameState.playerCivilization.government_type}`);
  console.log(`Population: ${mockGameState.playerCivilization.total_population.toLocaleString()}`);
  console.log(`GDP: $${mockGameState.economicSituation.gdp.toLocaleString()}`);
  console.log(`Unemployment: ${mockGameState.economicSituation.unemployment_rate}%`);
  console.log(`Population Happiness: ${mockGameState.socialSituation.population_happiness}/100`);
  console.log(`Threat Level: ${mockGameState.militarySituation.threat_level}\n`);

  console.log('👥 Character Awareness Analysis:');
  console.log('-------------------------------');

  mockCharacters.forEach(character => {
    console.log(`\n📋 ${character.name.full_display}:`);
    
    // Calculate clearance level
    let clearanceLevel = 25; // Base level
    if (character.category === 'official') clearanceLevel = 75;
    else if (character.category === 'military') clearanceLevel = 80;
    else if (character.category === 'business') clearanceLevel = 60;
    else if (character.category === 'media') clearanceLevel = 40;
    
    console.log(`   Profession: ${character.profession.current_job}`);
    console.log(`   Category: ${character.category}`);
    console.log(`   Clearance Level: ${clearanceLevel}/100`);
    
    // Determine access privileges
    const privileges = ['public_information'];
    if (character.category === 'official') {
      privileges.push('government_internal', 'policy_documents', 'budget_details');
    } else if (character.category === 'military') {
      privileges.push('military_intelligence', 'security_briefings');
    } else if (character.category === 'business') {
      privileges.push('market_data', 'industry_reports');
    } else if (character.category === 'media') {
      privileges.push('press_briefings', 'public_records');
    }
    
    console.log(`   Access Privileges: ${privileges.join(', ')}`);
    
    // Show what they know about current situation
    console.log(`   Game State Awareness:`);
    if (clearanceLevel >= 30) {
      console.log(`      • Economic Status: GDP $${mockGameState.economicSituation.gdp.toLocaleString()}, Unemployment ${mockGameState.economicSituation.unemployment_rate}%`);
      console.log(`      • Social Status: Population happiness ${mockGameState.socialSituation.population_happiness}/100`);
    }
    if (clearanceLevel >= 60) {
      console.log(`      • Military Status: Threat level ${mockGameState.militarySituation.threat_level}, Readiness ${mockGameState.militarySituation.military_readiness}/100`);
    }
    if (clearanceLevel >= 80) {
      console.log(`      • Classified Information: Full strategic assessment available`);
    }
  });

  console.log('\n\n💬 Contextual Character Responses:');
  console.log('=================================');

  const testQuestion = "What's your assessment of the current economic situation?";
  console.log(`\n🗣️ Question: "${testQuestion}"`);
  console.log('─'.repeat(60));

  mockCharacters.forEach(character => {
    console.log(`\n👤 ${character.name.full_display} responds:`);
    
    let response = '';
    let confidence = 50;
    let insights = [];
    
    // Generate response based on character type and knowledge
    if (character.category === 'official' && character.profession.current_job.includes('Treasury')) {
      response = `Based on my oversight of budget allocations and current fiscal indicators, the economic situation shows concerning trends. With unemployment at ${mockGameState.economicSituation.unemployment_rate}% and GDP at $${(mockGameState.economicSituation.gdp / 1000000000000).toFixed(1)}T, we need targeted fiscal policy adjustments.`;
      confidence = 90;
      insights = [
        { topic: 'Budget Analysis', expertise: 95, source: 'Government Experience' },
        { topic: 'Fiscal Policy', expertise: 90, source: 'Treasury Oversight' }
      ];
    } else if (character.category === 'military') {
      response = `From a national security perspective, economic stability is crucial for defense readiness. The current economic indicators suggest moderate stability, but we must monitor for potential security implications of economic fluctuations.`;
      confidence = 75;
      insights = [
        { topic: 'Security Assessment', expertise: 88, source: 'Military Analysis' },
        { topic: 'Strategic Planning', expertise: 85, source: 'Defense Experience' }
      ];
    } else if (character.category === 'business') {
      response = `The business environment shows mixed signals. GDP growth is positive, but unemployment levels could impact consumer spending. From an industry perspective, we're seeing opportunities in technology sectors while traditional manufacturing faces challenges.`;
      confidence = 85;
      insights = [
        { topic: 'Market Analysis', expertise: 82, source: 'Industry Experience' },
        { topic: 'Business Strategy', expertise: 80, source: 'Corporate Leadership' }
      ];
    } else if (character.category === 'media') {
      response = `Public sentiment around economic issues is mixed. Based on my coverage of economic policy, there's growing concern about unemployment while business leaders remain cautiously optimistic. The story here is about balancing growth with social stability.`;
      confidence = 70;
      insights = [
        { topic: 'Public Opinion', expertise: 75, source: 'Media Coverage' },
        { topic: 'Political Analysis', expertise: 78, source: 'Journalism Experience' }
      ];
    }
    
    console.log(`   💭 "${response}"`);
    console.log(`   📊 Confidence: ${confidence}/100`);
    
    if (insights.length > 0) {
      console.log(`   🎯 Professional Insights:`);
      insights.forEach(insight => {
        console.log(`      • ${insight.topic}: ${insight.expertise}/100 (${insight.source})`);
      });
    }
    
    // Show professional terminology
    const terminology = [];
    if (character.category === 'official') {
      terminology.push('fiscal policy', 'budget allocation', 'regulatory framework');
    } else if (character.category === 'military') {
      terminology.push('strategic assessment', 'security implications', 'readiness protocols');
    } else if (character.category === 'business') {
      terminology.push('market dynamics', 'consumer spending', 'industry sectors');
    } else if (character.category === 'media') {
      terminology.push('public sentiment', 'policy coverage', 'social stability');
    }
    
    if (terminology.length > 0) {
      console.log(`   📚 Professional Terms: ${terminology.join(', ')}`);
    }
  });

  console.log('\n\n🎮 Simulating Game Event Impact:');
  console.log('===============================');

  const gameEvent = {
    type: 'economic',
    title: 'Budget Crisis',
    description: 'Unexpected budget shortfall discovered in defense spending',
    impact: 'major',
    affected_areas: ['Defense Budget', 'Military Operations', 'Public Spending']
  };

  console.log(`📢 New Event: ${gameEvent.title}`);
  console.log(`Description: ${gameEvent.description}`);
  console.log(`Impact Level: ${gameEvent.impact}`);
  console.log(`Affected Areas: ${gameEvent.affected_areas.join(', ')}\n`);

  console.log('📬 Character Notifications:');
  console.log('---------------------------');

  mockCharacters.forEach(character => {
    let relevanceScore = 0;
    let priority = 'low';
    let notificationType = 'information_update';
    
    // Calculate relevance based on character role
    if (character.category === 'official' && character.profession.current_job.includes('Treasury')) {
      relevanceScore = 95;
      priority = 'urgent';
      notificationType = 'professional_alert';
    } else if (character.category === 'military') {
      relevanceScore = 85;
      priority = 'high';
      notificationType = 'security_briefing';
    } else if (character.category === 'business') {
      relevanceScore = 60;
      priority = 'normal';
      notificationType = 'relevant_event';
    } else if (character.category === 'media') {
      relevanceScore = 75;
      priority = 'high';
      notificationType = 'relevant_event';
    }
    
    if (relevanceScore >= 50) {
      console.log(`📨 ${character.name.full_display}:`);
      console.log(`   Priority: ${priority.toUpperCase()}`);
      console.log(`   Type: ${notificationType}`);
      console.log(`   Relevance: ${relevanceScore}/100`);
      
      let notificationContent = '';
      if (character.category === 'official') {
        notificationContent = 'URGENT: Budget shortfall requires immediate fiscal response. Prepare emergency budget reallocation proposals.';
      } else if (character.category === 'military') {
        notificationContent = 'SECURITY ALERT: Defense budget shortfall may impact operational readiness. Assess critical program priorities.';
      } else if (character.category === 'business') {
        notificationContent = 'MARKET UPDATE: Government budget crisis may affect defense contracts and public spending.';
      } else if (character.category === 'media') {
        notificationContent = 'BREAKING: Major budget crisis developing. Investigate impact on government operations and public services.';
      }
      
      console.log(`   Content: ${notificationContent}\n`);
    }
  });

  console.log('✅ Character Awareness Demo Complete!\n');
  
  console.log('🎯 Key Features Demonstrated:');
  console.log('• Characters have role-appropriate knowledge and clearance levels');
  console.log('• Responses include professional terminology and expertise');
  console.log('• Game events trigger relevant notifications based on character roles');
  console.log('• Information access varies by security clearance and profession');
  console.log('• Professional insights reflect character specialization and experience');
  console.log('• Communication style adapts to character background and personality');
}

// Run the demo
simulateCharacterAwareness();


