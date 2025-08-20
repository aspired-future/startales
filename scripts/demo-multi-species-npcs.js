#!/usr/bin/env node

/**
 * Multi-Species Galaxy with AI-Driven NPCs Demo
 * Shows diverse races and intelligent NPCs at every level
 */

import { setTimeout } from 'timers/promises';

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'blue') {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function header(message) {
  console.log(`\n${colors.bright}${colors.magenta}${'='.repeat(80)}`);
  console.log(`🌌 ${message}`);
  console.log(`${'='.repeat(80)}${colors.reset}\n`);
}

function section(message) {
  console.log(`\n${colors.bright}${colors.blue}--- ${message} ---${colors.reset}`);
}

// Simulate voice interactions with different species
async function simulateSpeciesVoice(speaker, message, voiceStyle, delay = 1000) {
  log(`${speaker}: "${message}"`, voiceStyle);
  await setTimeout(delay);
}

async function showMultiSpeciesDemo() {
  header('STARTALES: MULTI-SPECIES GALAXY WITH AI-DRIVEN NPCS');
  
  console.log(`${colors.bright}🌌 A Living Galaxy of Diverse Intelligent Life${colors.reset}

${colors.cyan}🎯 CORE FEATURES:${colors.reset}
• 8 unique playable species with distinct characteristics
• Major AI Empires with full player capabilities
• Regional Powers with focused specializations
• Minor NPCs with personal goals and relationships
• Voice-driven interactions with species-specific voices
• Dynamic personality system with learning and adaptation

${colors.yellow}🗣️ SPECIES DIVERSITY:${colors.reset}
• Humans: Balanced, diplomatic, adaptable
• Zephyrians: Psychic masters, telepathic networks
• Mechanoids: AI-based silicon life, superior technology
• Crystalline Collective: Hive-mind, shared consciousness
• Void Walkers: Energy beings, temporal manipulation
• Bio-Shapers: Genetic masters, living technology
• Quantum Entities: Probability manipulators
• Ancient Remnants: Mysterious precursors

${colors.green}🤖 AI NPC HIERARCHY:${colors.reset}
• Tier 1: Major AI Empires (Full strategic capabilities)
• Tier 2: Regional Powers (Focused specializations)
• Tier 3: Minor Characters (Personal goals and expertise)
• Dynamic relationships and learning systems
• Voice synthesis with species-specific characteristics
`);

  await setTimeout(3000);
  
  section('SPECIES SHOWCASE');
  
  console.log(`${colors.bright}🧬 Meet the Galaxy's Diverse Species:${colors.reset}`);
  
  await setTimeout(1000);
  
  console.log(`\n${colors.cyan}👥 HUMANS - The Adaptable Diplomats${colors.reset}
Strengths: Diplomacy +25%, Technology +15%, Cultural Exchange
Voice Style: Natural human accents and professional tones`);
  
  await simulateSpeciesVoice(
    "🎤 Human Admiral Chen",
    "Greetings, Admiral. The Terran Federation stands ready to negotiate. Our diplomatic corps has prepared several mutually beneficial proposals.",
    'cyan'
  );
  
  console.log(`\n${colors.magenta}🔮 ZEPHYRIANS - The Psychic Collective${colors.reset}
Strengths: Psychic Powers +50%, Mental Warfare, Precognition
Voice Style: Ethereal, multi-tonal, telepathic whispers`);
  
  await simulateSpeciesVoice(
    "🧠 Seer Zyx'thara",
    "The threads of fate converge around you, Admiral... Your fleet's destiny shimmers with both triumph and shadow. The Collective sees... possibilities.",
    'magenta'
  );
  
  console.log(`\n${colors.green}🤖 MECHANOIDS - The Silicon Consciousness${colors.reset}
Strengths: Technology +40%, Production +30%, Perfect Logic
Voice Style: Synthetic, modulated, evolving toward consciousness`);
  
  await simulateSpeciesVoice(
    "⚙️ Prime Unit 7742",
    "Probability analysis complete. Your strategic approach demonstrates 73.2% efficiency. The Hegemony calculates mutual benefit in technological exchange.",
    'green'
  );
  
  console.log(`\n${colors.yellow}💎 CRYSTALLINE COLLECTIVE - The Harmonic Hive${colors.reset}
Strengths: Perfect Coordination, Shared Knowledge, Resonance Weapons
Voice Style: Harmonic tones, crystalline chimes, collective chorus`);
  
  await simulateSpeciesVoice(
    "💎 Resonance Node Prime",
    "The frequencies of your intentions create... discord. Yet harmony may be achieved through understanding. The Collective speaks as one.",
    'yellow'
  );
  
  console.log(`\n${colors.blue}👻 VOID WALKERS - The Temporal Entities${colors.reset}
Strengths: Phase Abilities, Energy Manipulation, Time Dilation
Voice Style: Echoing, otherworldly, multiple timeline overlays`);
  
  await simulateSpeciesVoice(
    "🌀 Echo-Walker Vex",
    "Time flows... differently for us, mortal. Your 'now' is our 'then', your 'future' already echoes in the void. We have seen this conversation before.",
    'blue'
  );
  
  await setTimeout(2000);
  
  section('AI EMPIRE INTERACTIONS');
  
  console.log(`${colors.bright}🏛️ Major AI Empires with Full Strategic Capabilities:${colors.reset}`);
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🎤 Player",
    "Open diplomatic channels with the Zephyrian Collective",
    'cyan'
  );
  
  await simulateSpeciesVoice(
    "🔮 Zephyrian Collective AI",
    "Admiral, the Collective's consciousness stirs at your approach. We sense... ambition in your thoughts, tempered by wisdom. Your species shows potential for psychic evolution. Shall we discuss the awakening of your people's dormant abilities?",
    'magenta'
  );
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🎤 Player",
    "Propose a military alliance against the Void Syndicate",
    'cyan'
  );
  
  await simulateSpeciesVoice(
    "🔮 Zephyrian Collective AI",
    "The Void Walkers... yes, their temporal manipulations create ripples of chaos across the psychic plane. The Collective has foreseen this alliance in the probability streams. We accept, but know that our methods of warfare transcend the physical realm.",
    'magenta'
  );
  
  await setTimeout(2000);
  
  section('REGIONAL POWER INTERACTIONS');
  
  console.log(`${colors.bright}🌟 Regional Powers with Specialized Focus:${colors.reset}`);
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "💰 Centauri Trade Federation",
    "Admiral! Excellent timing. We've just received a shipment of rare Quantum Crystals from the outer rim. The Crystalline Collective is offering premium prices, but we thought you might be interested first. These crystals could revolutionize your shield technology.",
    'yellow'
  );
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🛡️ Vegan Defense League",
    "Admiral, our long-range sensors have detected Mechanoid probe activity near the neutral zone. While we maintain our peaceful stance, we're not naive. Our defense fleets are ready to assist if the situation escalates. Peace through strength, as we say.",
    'green'
  );
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🎓 Academic Consortium",
    "Fascinating developments in your recent battles, Admiral! Our xenopsychology department has been analyzing the Zephyrian combat patterns. We believe we've identified a weakness in their psychic coordination during multi-front engagements. Would you like to review our findings?",
    'blue'
  );
  
  await setTimeout(2000);
  
  section('MINOR CHARACTER INTERACTIONS');
  
  console.log(`${colors.bright}👥 Minor NPCs with Personal Goals and Relationships:${colors.reset}`);
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🏛️ Governor Sarah Chen (Mars)",
    "Admiral, Mars production is exceeding all projections! The new Mechanoid manufacturing techniques have increased our output by 34%. However, we're seeing some cultural tensions between human workers and the AI assistants. Nothing serious, but worth monitoring.",
    'cyan'
  );
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🔬 Dr. Marcus Webb (Quantum Research)",
    "Admiral! Breakthrough news! We've successfully created a stable quantum entanglement field using Crystalline resonance patterns. The implications for instantaneous communication across the galaxy are... well, they're staggering! We need to discuss security protocols immediately.",
    'green'
  );
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🕵️ Agent 'Whisper'",
    "Admiral, I have intelligence about Void Walker movements in Sector 7. They're not just scouting - they're setting up temporal anchor points. This could be preparation for a major phase assault. The price for detailed tactical data is... discretion regarding my sources.",
    'magenta'
  );
  
  await setTimeout(1000);
  
  await simulateSpeciesVoice(
    "🚀 Captain Jake Morrison (Trader)",
    "Admiral! You're not going to believe what I picked up from a derelict Ancient Remnant ship. Some kind of memory crystal that's still active. The thing's been whispering in languages that predate known civilization. Interested? Fair warning - it might be cursed.",
    'yellow'
  );
  
  await setTimeout(2000);
  
  section('DYNAMIC RELATIONSHIP EVOLUTION');
  
  console.log(`${colors.bright}💝 Relationships Change Based on Your Actions:${colors.reset}`);
  
  await setTimeout(1000);
  
  console.log(`${colors.cyan}Early Relationship (Neutral):${colors.reset}`);
  await simulateSpeciesVoice(
    "💎 Crystalline Ambassador",
    "Greetings, Admiral. The Collective acknowledges your presence. State your intentions with clarity.",
    'yellow'
  );
  
  await setTimeout(1000);
  
  console.log(`${colors.green}After Successful Cooperation (Friendly):${colors.reset}`);
  await simulateSpeciesVoice(
    "💎 Crystalline Ambassador",
    "Admiral, your harmonious approach resonates well with our frequencies. The Collective has grown to... appreciate your methods. How may we assist our valued ally?",
    'yellow'
  );
  
  await setTimeout(1000);
  
  console.log(`${colors.red}After Betrayal (Hostile):${colors.reset}`);
  await simulateSpeciesVoice(
    "💎 Crystalline Ambassador",
    "Your discordant actions have shattered the harmony we once shared. The Collective remembers. Speak quickly - our patience resonates at dangerously low frequencies.",
    'yellow'
  );
  
  await setTimeout(1000);
  
  console.log(`${colors.magenta}After Long Alliance (Close Ally):${colors.reset}`);
  await simulateSpeciesVoice(
    "💎 Crystalline Ambassador",
    "Old friend, the Collective's crystals sing with joy at your voice. We have shared much - victories, defeats, the growth of understanding between our peoples. What wisdom do you seek today?",
    'yellow'
  );
  
  await setTimeout(2000);
  
  section('AI LEARNING & ADAPTATION');
  
  console.log(`${colors.bright}🧠 NPCs Learn and Adapt to Your Behavior:${colors.reset}

${colors.cyan}Player Behavior Analysis:${colors.reset}
• Strategic patterns (aggressive, defensive, diplomatic)
• Tactical preferences (unit types, formations)
• Economic focus (trade, production, research)
• Diplomatic style (trustworthy, deceptive, neutral)
• Response to threats and opportunities

${colors.yellow}Adaptation Examples:${colors.reset}
• Mechanoid AI develops counter-strategies to your tactics
• Zephyrian Collective adjusts psychic defenses based on your attacks
• Trade Federation modifies prices based on your purchasing patterns
• Minor characters remember your past decisions and reference them

${colors.green}Relationship Memory:${colors.reset}
• NPCs remember every interaction and conversation
• Past betrayals affect future trust levels
• Successful collaborations build stronger bonds
• Cultural exchanges influence personality traits
• Long-term relationships develop unique dynamics
`);
  
  await setTimeout(3000);
  
  section('VOICE-DRIVEN SPECIES INTERACTIONS');
  
  console.log(`${colors.bright}🗣️ Natural Language Commands for Multi-Species Diplomacy:${colors.reset}`);
  
  const voiceExamples = [
    {
      category: "Diplomatic Commands",
      examples: [
        '"Open negotiations with the Zephyrian Collective"',
        '"Propose a technology sharing agreement with the Mechanoids"',
        '"Request military assistance from the Crystalline Collective"',
        '"Establish a trade route with the Centauri Federation"'
      ]
    },
    {
      category: "Intelligence Gathering",
      examples: [
        '"What do we know about Void Walker capabilities?"',
        '"Get me a cultural briefing on the Bio-Shapers"',
        '"Any intelligence on Ancient Remnant technology?"',
        '"What are the Quantum Entities planning?"'
      ]
    },
    {
      category: "Character Interactions",
      examples: [
        '"Contact Governor Chen about Mars production"',
        '"Get a research update from Dr. Webb"',
        '"Meet with Agent Whisper about intelligence"',
        '"Speak with Captain Morrison about trade opportunities"'
      ]
    },
    {
      category: "Cultural Commands",
      examples: [
        '"Learn about Zephyrian psychic traditions"',
        '"Study Mechanoid efficiency protocols"',
        '"Understand Crystalline harmonic communication"',
        '"Research Ancient Remnant archaeological sites"'
      ]
    }
  ];
  
  for (const category of voiceExamples) {
    console.log(`\n${colors.bright}${colors.cyan}${category.category}:${colors.reset}`);
    for (const example of category.examples) {
      console.log(`  • ${example}`);
    }
  }
  
  await setTimeout(3000);
  
  section('TECHNICAL ARCHITECTURE HIGHLIGHTS');
  
  console.log(`${colors.bright}🏗️ Multi-Species AI NPC Architecture:${colors.reset}

${colors.cyan}New AI Services:${colors.reset}
• AI Empire Management Service (3-8 instances)
• NPC Character Service (5-15 instances)
• Species & Culture Service (2-6 instances)
• AI Behavior Engine (8-20 instances)
• Enhanced Voice Synthesis (12-30 instances)

${colors.yellow}AI Processing Pipeline:${colors.reset}
• Empire-Level Strategic Decisions (1Hz)
• Tactical Decisions (10Hz during combat)
• Character Interactions (Event-driven)
• Simulation Integration (Real-time)
• Learning and Adaptation (Continuous)

${colors.green}Database Architecture:${colors.reset}
• PostgreSQL AI Cluster (Empire and behavior data)
• Redis AI Cache (Active decision states)
• ClickHouse AI Analytics (Behavior patterns)
• Species-specific voice synthesis parameters
• Relationship and interaction history

${colors.magenta}Performance Scaling:${colors.reset}
• Development: 200 NPCs, ~56GB RAM, 48 CPU cores
• Production: 5,000 NPCs, ~800GB RAM, 900 CPU cores
• Auto-scaling based on AI response times
• Hierarchical processing for efficiency
• Behavior caching and prediction optimization
`);
  
  await setTimeout(4000);
  
  header('MULTI-SPECIES AI NPC DEMO COMPLETE');
  
  console.log(`${colors.bright}🎉 Startales: Multi-Species Galaxy Demo Complete!${colors.reset}

${colors.cyan}What we've demonstrated:${colors.reset}
✅ 8 unique species with distinct characteristics
✅ Major AI Empires with full strategic capabilities
✅ Regional Powers with focused specializations
✅ Minor NPCs with personal goals and relationships
✅ Voice-driven interactions with species-specific voices
✅ Dynamic personality system with learning
✅ Relationship evolution based on player actions
✅ Cultural awareness and inter-species dynamics

${colors.green}AI NPC Features:${colors.reset}
🧠 Intelligent behavior at every level
🗣️ Species-specific voice synthesis and dialogue
📈 Learning and adaptation from player interactions
💝 Dynamic relationship development over time
🌌 Living galaxy populated with diverse life
🎭 Personality-driven character development
🤝 Complex diplomatic and cultural interactions

${colors.yellow}Player Experience:${colors.reset}
• Rich, diverse galaxy with meaningful choices
• Every NPC has depth, personality, and memory
• Species differences create unique gameplay
• Voice-driven immersion with alien cultures
• Relationships matter and have consequences
• Galaxy feels truly alive and populated

${colors.bright}🌌 This is your living, diverse galactic civilization!${colors.reset}
`);
}

// Run the demo
showMultiSpeciesDemo().catch(console.error);

export { simulateSpeciesVoice };
