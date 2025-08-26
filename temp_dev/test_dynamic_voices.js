/**
 * Demo script for Dynamic Voice Generation
 * Shows how character voices are generated based on traits
 */

// Mock character data for testing
const testCharacters = [
  {
    id: 'char_diplomat_elena',
    name: 'Ambassador Elena Vasquez',
    gender: 'female',
    age: 45,
    personality: ['diplomatic', 'eloquent', 'authoritative'],
    background: 'Former UN negotiator with 20 years experience',
    role: 'diplomat',
    department: 'Foreign Affairs',
    nationality: 'spanish'
  },
  {
    id: 'char_commander_alpha',
    name: 'Commander Alpha',
    gender: 'male',
    age: 38,
    personality: ['commanding', 'decisive', 'strategic'],
    background: 'Military academy graduate, veteran of multiple campaigns',
    role: 'commander',
    department: 'Defense',
    nationality: 'american'
  },
  {
    id: 'char_scientist_chen',
    name: 'Dr. Sarah Chen',
    gender: 'female',
    age: 32,
    personality: ['analytical', 'precise', 'curious'],
    background: 'PhD in Quantum Physics, research team leader',
    role: 'scientist',
    department: 'Research & Development',
    nationality: 'chinese'
  },
  {
    id: 'char_economist_williams',
    name: 'Dr. James Williams',
    gender: 'male',
    age: 52,
    personality: ['measured', 'analytical', 'cautious'],
    background: 'Former World Bank economist, policy advisor',
    role: 'economist',
    department: 'Treasury',
    nationality: 'british'
  },
  {
    id: 'char_engineer_patel',
    name: 'Chief Engineer Priya Patel',
    gender: 'female',
    age: 29,
    personality: ['practical', 'energetic', 'innovative'],
    background: 'MIT graduate, infrastructure specialist',
    role: 'engineer',
    department: 'Infrastructure',
    nationality: 'indian'
  }
];

// Simulate voice generation results
function simulateVoiceGeneration() {
  console.log('🎭 Dynamic Voice Generation Demo\n');
  console.log('=' .repeat(50));
  
  testCharacters.forEach((character, index) => {
    console.log(`\n${index + 1}. ${character.name}`);
    console.log('-'.repeat(character.name.length + 3));
    
    // Simulate voice parameter calculation
    let rate = 1.0;
    let pitch = 1.0;
    let volume = 0.8;
    
    // Age adjustments
    if (character.age < 30) {
      pitch += 0.1;
      rate += 0.05;
    } else if (character.age > 50) {
      pitch -= 0.1;
      rate -= 0.1;
    }
    
    // Gender adjustments
    if (character.gender === 'female') {
      pitch += 0.15;
    } else {
      pitch -= 0.1;
    }
    
    // Role adjustments
    const roleAdjustments = {
      'diplomat': { rate: 0.9, pitch: 1.05 },
      'commander': { rate: 1.1, pitch: 0.85, volume: 0.9 },
      'scientist': { rate: 0.95, pitch: 1.0 },
      'engineer': { rate: 1.05, pitch: 0.95 },
      'economist': { rate: 1.0, pitch: 0.9 }
    };
    
    const roleAdj = roleAdjustments[character.role];
    if (roleAdj) {
      rate = roleAdj.rate || rate;
      pitch = roleAdj.pitch || pitch;
      volume = roleAdj.volume || volume;
    }
    
    // Personality adjustments
    if (character.personality.includes('energetic')) {
      rate += 0.1;
      volume += 0.1;
    }
    if (character.personality.includes('commanding')) {
      pitch -= 0.05;
      volume += 0.1;
    }
    if (character.personality.includes('calm') || character.personality.includes('measured')) {
      rate -= 0.05;
    }
    
    // Ensure bounds
    rate = Math.max(0.5, Math.min(2.0, rate));
    pitch = Math.max(0.5, Math.min(2.0, pitch));
    volume = Math.max(0.1, Math.min(1.0, volume));
    
    // Generate preview text
    const roleGreetings = {
      'diplomat': `Greetings. I am ${character.name}, representing our diplomatic interests. I look forward to productive discussions.`,
      'commander': `${character.name} reporting for duty. Ready to discuss strategic operations and security matters.`,
      'scientist': `Hello, I'm Dr. ${character.name.split(' ').pop()}. I'm here to share our latest research findings and scientific insights.`,
      'engineer': `${character.name.split(' ')[0]} ${character.name.split(' ').pop()}, Chief Engineer. Let's discuss our technical capabilities and infrastructure needs.`,
      'economist': `Good day. ${character.name} here. I'm ready to analyze our economic situation and financial strategies.`
    };
    
    const previewText = roleGreetings[character.role] || `Hello, I'm ${character.name}. This is my voice preview.`;
    
    console.log(`📊 Traits: ${character.gender}, ${character.age}y, ${character.role}`);
    console.log(`🎯 Personality: ${character.personality.join(', ')}`);
    console.log(`🌍 Nationality: ${character.nationality}`);
    console.log(`🎤 Voice Profile:`);
    console.log(`   Rate: ${rate.toFixed(2)} (${rate > 1 ? 'faster' : rate < 1 ? 'slower' : 'normal'})`);
    console.log(`   Pitch: ${pitch.toFixed(2)} (${pitch > 1 ? 'higher' : pitch < 1 ? 'lower' : 'normal'})`);
    console.log(`   Volume: ${volume.toFixed(2)}`);
    console.log(`💬 Preview: "${previewText}"`);
    
    // Show voice selection logic
    const voiceCategory = `${character.gender}_en`; // Simplified for demo
    console.log(`🔊 Voice Category: ${voiceCategory}`);
    
    // Simulate deterministic voice selection
    const voiceIndex = character.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;
    const mockVoices = [
      'Microsoft Zira - English (United States)',
      'Microsoft David - English (United States)', 
      'Microsoft Hazel - English (Great Britain)',
      'Microsoft George - English (Great Britain)',
      'Microsoft Aria - English (United States)'
    ];
    
    console.log(`🎵 Selected Voice: ${mockVoices[voiceIndex]}`);
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Voice generation complete!');
  console.log('\n📋 Summary:');
  console.log(`   • ${testCharacters.length} characters processed`);
  console.log(`   • Each character gets unique voice parameters`);
  console.log(`   • Voices are deterministic (same character = same voice)`);
  console.log(`   • Parameters based on age, gender, role, personality`);
  console.log(`   • Preview text customized for each role`);
}

// Run the demo
simulateVoiceGeneration();

