#!/usr/bin/env node

/**
 * Character Awareness System Demonstration
 * 
 * This script demonstrates how characters become aware of game state
 * and respond with contextual knowledge based on their specialties.
 */

import { GameStateAwarenessService } from '../src/server/characters/GameStateAwareness.js';
import { ContextualCharacterAI } from '../src/server/characters/ContextualCharacterAI.js';
import { GameStateIntegration } from '../src/server/characters/GameStateIntegration.js';

// Mock character data for demonstration
const mockCharacters = [
  {
    id: 'treasury_secretary_001',
    name: {
      first: 'Elena',
      last: 'Rodriguez',
      title: 'Secretary',
      full_display: 'Secretary Elena Rodriguez'
    },
    category: 'official',
    subcategory: 'government_official',
    profession: {
      current_job: 'Treasury Secretary',
      job_title: 'Secretary of Treasury',
      employer: 'Federal Government',
      industry: 'government',
      career_level: 'executive'
    },
    attributes: {
      intelligence: 88,
      charisma: 75,
      integrity: 92,
      leadership: 85,
      technical_skill: 70
    },
    personality: {
      core_traits: ['analytical', 'diplomatic', 'detail-oriented'],
      values: ['fiscal_responsibility', 'transparency', 'public_service'],
      communication_style: 'formal_professional'
    },
    skills: {
      economics: { category: 'economics', skills: { 'fiscal_policy': 95, 'budget_analysis': 90 } },
      government: { category: 'government', skills: { 'policy_development': 85, 'public_administration': 80 } }
    },
    location: {
      current: 'Capital Region',
      home: 'Capital Region',
      workplace: 'Treasury Building'
    }
  },
  {
    id: 'defense_minister_001',
    name: {
      first: 'Admiral',
      last: 'Chen',
      title: 'Minister',
      full_display: 'Defense Minister Admiral Chen'
    },
    category: 'military',
    subcategory: 'defense_official',
    profession: {
      current_job: 'Defense Minister',
      job_title: 'Minister of Defense',
      employer: 'Federal Government',
      industry: 'military',
      career_level: 'executive'
    },
    attributes: {
      intelligence: 85,
      charisma: 70,
      integrity: 90,
      leadership: 95,
      technical_skill: 80
    },
    personality: {
      core_traits: ['strategic', 'decisive', 'disciplined'],
      values: ['national_security', 'military_honor', 'strategic_thinking'],
      communication_style: 'direct_military'
    },
    skills: {
      military: { category: 'military', skills: { 'strategic_planning': 95, 'tactical_analysis': 90 } },
      security: { category: 'security', skills: { 'threat_assessment': 92, 'intelligence_analysis': 85 } }
    },
    location: {
      current: 'Defense Headquarters',
      home: 'Capital Region',
      workplace: 'Defense Ministry'
    }
  },
  {
    id: 'business_leader_001',
    name: {
      first: 'Marcus',
      last: 'Thompson',
      title: 'CEO',
      full_display: 'CEO Marcus Thompson'
    },
    category: 'business',
    subcategory: 'corporate_executive',
    profession: {
      current_job: 'Chief Executive Officer',
      job_title: 'CEO',
      employer: 'Stellar Industries Corp',
      industry: 'manufacturing',
      career_level: 'executive'
    },
    attributes: {
      intelligence: 82,
      charisma: 88,
      ambition: 95,
      leadership: 90,
      technical_skill: 75
    },
    personality: {
      core_traits: ['ambitious', 'innovative', 'results-oriented'],
      values: ['business_growth', 'innovation', 'market_leadership'],
      communication_style: 'confident_business'
    },
    skills: {
      business: { category: 'business', skills: { 'strategic_management': 90, 'market_analysis': 85 } },
      technology: { category: 'technology', skills: { 'innovation_management': 80, 'tech_strategy': 75 } }
    },
    location: {
      current: 'Industrial Sector',
      home: 'Capital Region',
      workplace: 'Stellar Industries HQ'
    }
  },
  {
    id: 'journalist_001',
    name: {
      first: 'Sarah',
      last: 'Kim',
      title: 'Senior Correspondent',
      full_display: 'Senior Correspondent Sarah Kim'
    },
    category: 'media',
    subcategory: 'journalist',
    profession: {
      current_job: 'Senior Political Correspondent',
      job_title: 'Senior Correspondent',
      employer: 'Galactic News Network',
      industry: 'media',
      career_level: 'senior'
    },
    attributes: {
      intelligence: 85,
      charisma: 80,
      creativity: 88,
      empathy: 75,
      social_influence: 82
    },
    personality: {
      core_traits: ['curious', 'persistent', 'ethical'],
      values: ['truth', 'public_interest', 'press_freedom'],
      communication_style: 'engaging_investigative'
    },
    skills: {
      journalism: { category: 'journalism', skills: { 'investigative_reporting': 90, 'political_analysis': 85 } },
      communication: { category: 'communication', skills: { 'public_speaking': 80, 'writing': 92 } }
    },
    location: {
      current: 'Media District',
      home: 'Capital Region',
      workplace: 'GNN Headquarters'
    }
  }
];

async function demonstrateCharacterAwareness() {
  console.log('🎭 Character Awareness System Demonstration');
  console.log('==========================================\n');

  // Initialize services
  const gameStateService = new GameStateAwarenessService();
  const contextualAI = new ContextualCharacterAI();
  const gameStateIntegration = new GameStateIntegration();

  try {
    // 1. Show initial game state
    console.log('📊 Current Game State Overview:');
    console.log('------------------------------');
    const gameState = await gameStateService.getCurrentGameState('demo_campaign');
    
    console.log(`Game Phase: ${gameState.gamePhase}`);
    console.log(`Civilization: ${gameState.playerCivilization.name} (${gameState.playerCivilization.species})`);
    console.log(`Government: ${gameState.playerCivilization.government_type}`);
    console.log(`Population: ${gameState.playerCivilization.total_population.toLocaleString()}`);
    console.log(`GDP: $${gameState.economicSituation.gdp.toLocaleString()}`);
    console.log(`Unemployment: ${gameState.economicSituation.unemployment_rate}%`);
    console.log(`Population Happiness: ${gameState.socialSituation.population_happiness}/100`);
    console.log(`Military Readiness: ${gameState.militarySituation.military_readiness}/100`);
    console.log(`Threat Level: ${gameState.militarySituation.threat_level}\n`);

    // 2. Register characters for awareness
    console.log('👥 Registering Characters for Game State Awareness:');
    console.log('--------------------------------------------------');
    for (const character of mockCharacters) {
      gameStateIntegration.registerCharacter(character.id, character);
      console.log(`✅ ${character.name.full_display} (${character.profession.current_job})`);
    }
    console.log('');

    // 3. Demonstrate character awareness contexts
    console.log('🧠 Character Awareness Analysis:');
    console.log('--------------------------------');
    
    for (const character of mockCharacters) {
      console.log(`\n📋 ${character.name.full_display}:`);
      
      // Get character's awareness context
      const awarenessContext = await gameStateService.createCharacterContext(
        character.id,
        character,
        'demo_campaign'
      );
      
      console.log(`   Profession: ${awarenessContext.specialtyKnowledge.profession.field}`);
      console.log(`   Expertise Level: ${awarenessContext.specialtyKnowledge.profession.expertise_level}/100`);
      console.log(`   Clearance Level: ${awarenessContext.character.clearance_level}/100`);
      console.log(`   Access Privileges: ${awarenessContext.character.access_privileges.join(', ')}`);
      console.log(`   Information Networks: ${awarenessContext.character.information_networks.join(', ')}`);
      
      // Show specialty knowledge
      if (awarenessContext.specialtyKnowledge.government) {
        console.log(`   🏛️ Government Knowledge: ${awarenessContext.specialtyKnowledge.government.department}`);
        console.log(`      Policy Areas: ${awarenessContext.specialtyKnowledge.government.policy_areas.join(', ')}`);
      }
      
      if (awarenessContext.specialtyKnowledge.military) {
        console.log(`   ⚔️ Military Knowledge: ${awarenessContext.specialtyKnowledge.military.branch}`);
        console.log(`      Rank: ${awarenessContext.specialtyKnowledge.military.rank}`);
        console.log(`      Security Clearance: ${awarenessContext.specialtyKnowledge.military.security_clearance}`);
      }
      
      if (awarenessContext.specialtyKnowledge.business) {
        console.log(`   💼 Business Knowledge: ${awarenessContext.specialtyKnowledge.business.industry}`);
        console.log(`      Company Size: ${awarenessContext.specialtyKnowledge.business.company_size}`);
        console.log(`      Market Position: ${awarenessContext.specialtyKnowledge.business.market_position}`);
      }
      
      if (awarenessContext.specialtyKnowledge.media) {
        console.log(`   📰 Media Knowledge: ${awarenessContext.specialtyKnowledge.media.outlet}`);
        console.log(`      Beat: ${awarenessContext.specialtyKnowledge.media.beat.join(', ')}`);
      }
    }

    // 4. Demonstrate contextual interactions
    console.log('\n\n💬 Contextual Character Interactions:');
    console.log('====================================');

    const testPrompts = [
      {
        prompt: "What's your assessment of the current economic situation?",
        topic: "Economic Analysis"
      },
      {
        prompt: "How do you view the recent budget allocation changes?",
        topic: "Budget Policy"
      },
      {
        prompt: "What are the security implications of current events?",
        topic: "Security Assessment"
      }
    ];

    for (const testPrompt of testPrompts) {
      console.log(`\n🗣️ Question: "${testPrompt.prompt}"`);
      console.log('─'.repeat(60));

      for (const character of mockCharacters) {
        console.log(`\n👤 ${character.name.full_display} responds:`);
        
        try {
          const interactionRequest = {
            characterId: character.id,
            prompt: testPrompt.prompt,
            interactionType: 'consultation',
            context: {
              conversationId: `demo_${Date.now()}`,
              participantId: 'player',
              topic: testPrompt.topic,
              context: 'Demonstration conversation',
              previousMessages: [],
              relationship_status: 'professional',
              conversation_goals: ['information_gathering']
            },
            urgency: 'normal',
            confidentiality: 'public'
          };

          const response = await contextualAI.processCharacterInteraction(
            character,
            interactionRequest
          );

          console.log(`   💭 "${response.response.response_text}"`);
          console.log(`   📊 Confidence: ${response.response.confidence_level}/100`);
          console.log(`   😊 Tone: ${response.response.emotional_tone}`);
          
          if (response.response.specialty_insights.length > 0) {
            console.log(`   🎯 Professional Insights:`);
            response.response.specialty_insights.forEach(insight => {
              console.log(`      • ${insight.topic}: ${insight.insight} (${insight.expertise_level}/100)`);
            });
          }
          
          if (response.response.professional_terminology.length > 0) {
            console.log(`   📚 Professional Terms: ${response.response.professional_terminology.join(', ')}`);
          }

        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    }

    // 5. Demonstrate real-time game state changes
    console.log('\n\n🎮 Real-time Game State Changes:');
    console.log('===============================');

    // Set up event listeners
    gameStateIntegration.on('gameStateChange', (change) => {
      console.log(`📢 Game State Change: ${change.description}`);
      console.log(`   Type: ${change.type}, Impact: ${change.impact_level}`);
      console.log(`   Affected Areas: ${change.affected_areas.join(', ')}`);
    });

    gameStateIntegration.on('characterNotifications', (notifications) => {
      console.log(`\n📬 Character Notifications (${notifications.length}):`);
      notifications.forEach(notification => {
        console.log(`   📨 ${notification.characterId}: ${notification.title}`);
        console.log(`      Priority: ${notification.priority}, Type: ${notification.notificationType}`);
        console.log(`      Content: ${notification.content.substring(0, 100)}...`);
      });
    });

    // Inject some game events
    console.log('\n🔄 Injecting test game events...');
    
    await gameStateIntegration.injectGameEvent({
      type: 'economic',
      category: 'Budget Crisis',
      description: 'Unexpected budget shortfall discovered in defense spending',
      impact_level: 'major',
      affected_areas: ['Defense Budget', 'Military Operations', 'Public Spending'],
      timestamp: new Date(),
      data: { shortfall_amount: 50000000000 }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await gameStateIntegration.injectGameEvent({
      type: 'political',
      category: 'Diplomatic Crisis',
      description: 'Trade negotiations with neighboring civilization have stalled',
      impact_level: 'moderate',
      affected_areas: ['Foreign Relations', 'Trade', 'Economic Growth'],
      timestamp: new Date(),
      data: { affected_trade_volume: 15000000000 }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await gameStateIntegration.injectGameEvent({
      type: 'technological',
      category: 'Research Breakthrough',
      description: 'Major breakthrough in energy efficiency technology achieved',
      impact_level: 'major',
      affected_areas: ['Technology Sector', 'Energy Policy', 'Economic Growth'],
      timestamp: new Date(),
      data: { efficiency_improvement: 25 }
    });

    // 6. Show updated character responses after events
    console.log('\n\n🔄 Character Responses After Game Events:');
    console.log('========================================');

    const postEventPrompt = "Given recent developments, what's your current assessment of the situation?";
    console.log(`\n🗣️ Question: "${postEventPrompt}"`);
    console.log('─'.repeat(60));

    for (const character of mockCharacters) {
      console.log(`\n👤 ${character.name.full_display} (updated response):`);
      
      try {
        const interactionRequest = {
          characterId: character.id,
          prompt: postEventPrompt,
          interactionType: 'briefing',
          context: {
            conversationId: `demo_post_events_${Date.now()}`,
            participantId: 'player',
            topic: 'Situation Assessment',
            context: 'Post-event briefing',
            previousMessages: [],
            relationship_status: 'professional',
            conversation_goals: ['situation_assessment']
          },
          urgency: 'high',
          confidentiality: 'internal'
        };

        const response = await contextualAI.processCharacterInteraction(
          character,
          interactionRequest
        );

        console.log(`   💭 "${response.response.response_text}"`);
        console.log(`   📊 Confidence: ${response.response.confidence_level}/100`);
        console.log(`   😊 Tone: ${response.response.emotional_tone}`);
        
        if (response.response.references_to_recent_events.length > 0) {
          console.log(`   📰 Recent Event References: ${response.response.references_to_recent_events.join(', ')}`);
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }

    // 7. Show monitoring status
    console.log('\n\n📊 System Status:');
    console.log('================');
    const monitoringStatus = gameStateIntegration.getMonitoringStatus();
    console.log(`Monitoring Active: ${monitoringStatus.is_monitoring}`);
    console.log(`Active Characters: ${monitoringStatus.active_characters}`);
    console.log(`Last Update: ${monitoringStatus.last_update}`);
    console.log(`Registered Characters: ${monitoringStatus.registered_characters.join(', ')}`);

    // 8. Show interaction statistics
    console.log('\n📈 Character Interaction Statistics:');
    console.log('-----------------------------------');
    for (const character of mockCharacters) {
      const stats = contextualAI.getInteractionStats(character.id);
      console.log(`${character.name.full_display}:`);
      console.log(`   Total Conversations: ${stats.total_conversations}`);
      console.log(`   Has Personality Profile: ${stats.has_personality_profile}`);
      console.log(`   Active Context Entries: ${stats.active_context_entries}`);
    }

    console.log('\n✅ Character Awareness System Demonstration Complete!');
    console.log('\n🎯 Key Features Demonstrated:');
    console.log('• Characters have specialized knowledge based on their profession');
    console.log('• Game state awareness varies by security clearance and role');
    console.log('• Responses include professional terminology and insights');
    console.log('• Real-time game events update character knowledge');
    console.log('• Characters receive relevant notifications based on their expertise');
    console.log('• Personality traits affect communication style and confidence');
    console.log('• Contextual interactions consider relationship and confidentiality');

  } catch (error) {
    console.error('❌ Demonstration error:', error);
  }
}

// Run the demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateCharacterAwareness()
    .then(() => {
      console.log('\n🎉 Demonstration completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Demonstration failed:', error);
      process.exit(1);
    });
}

export { demonstrateCharacterAwareness };
