/**
 * Channel-Wide Summit Scheduling Demo
 * Shows how the enhanced summit scheduler works with channel context
 */

// Mock channel data for demonstration
const channels = [
  {
    id: 'channel_cabinet',
    name: 'Cabinet',
    type: 'cabinet',
    description: 'High-level government discussions',
    participants: [
      { id: 'player_001', name: 'President Johnson', type: 'player', availability: 'available' },
      { id: 'player_002', name: 'Vice President Smith', type: 'player', availability: 'available' },
      { id: 'char_diplomat_001', name: 'Secretary of State Elena', type: 'character', availability: 'available' },
      { id: 'char_economist_001', name: 'Treasury Secretary Chen', type: 'character', availability: 'busy' },
      { id: 'char_commander_001', name: 'Defense Secretary Alpha', type: 'character', availability: 'available' }
    ]
  },
  {
    id: 'channel_defense',
    name: 'Defense',
    type: 'department',
    description: 'Military and security coordination',
    participants: [
      { id: 'player_001', name: 'President Johnson', type: 'player', availability: 'available' },
      { id: 'player_003', name: 'General Martinez', type: 'player', availability: 'available' },
      { id: 'char_commander_001', name: 'Defense Secretary Alpha', type: 'character', availability: 'available' },
      { id: 'char_intelligence_001', name: 'Intel Director Black', type: 'character', availability: 'available' }
    ]
  },
  {
    id: 'channel_crisis',
    name: 'Crisis Response',
    type: 'emergency',
    description: 'Emergency coordination channel',
    participants: [
      { id: 'player_001', name: 'President Johnson', type: 'player', availability: 'available' },
      { id: 'player_002', name: 'Vice President Smith', type: 'player', availability: 'available' },
      { id: 'player_004', name: 'Emergency Director Wilson', type: 'player', availability: 'available' },
      { id: 'char_commander_001', name: 'Defense Secretary Alpha', type: 'character', availability: 'available' },
      { id: 'char_health_001', name: 'Health Secretary Dr. Kim', type: 'character', availability: 'available' }
    ]
  }
];

// Simulate bulk selection functions
function simulateBulkSelection(channel) {
  console.log(`\n🏛️ Channel: #${channel.name}`);
  console.log('=' .repeat(40));
  
  const allParticipants = channel.participants;
  const playersOnly = allParticipants.filter(p => p.type === 'player');
  const charactersOnly = allParticipants.filter(p => p.type === 'character');
  const availableOnly = allParticipants.filter(p => p.availability === 'available');
  const busyParticipants = allParticipants.filter(p => p.availability === 'busy');
  
  console.log(`📊 Channel Statistics:`);
  console.log(`   • Total participants: ${allParticipants.length}`);
  console.log(`   • Players: ${playersOnly.length}`);
  console.log(`   • Characters: ${charactersOnly.length}`);
  console.log(`   • Available: ${availableOnly.length}`);
  console.log(`   • Busy: ${busyParticipants.length}`);
  
  console.log(`\n🎯 Bulk Selection Options:`);
  
  // Option 1: All Channel Players
  console.log(`\n1️⃣ "All Channel Players" (${playersOnly.length} participants):`);
  playersOnly.forEach(p => {
    console.log(`   👥 ${p.name} (${p.availability})`);
  });
  
  // Option 2: Entire Channel
  console.log(`\n2️⃣ "Entire #${channel.name}" (${allParticipants.length} participants):`);
  allParticipants.forEach(p => {
    const icon = p.type === 'player' ? '👥' : '🤖';
    const status = p.availability === 'available' ? '✅' : '⚠️';
    console.log(`   ${icon} ${p.name} ${status}`);
  });
  
  // Option 3: All Available
  console.log(`\n3️⃣ "All Available" (${availableOnly.length} participants):`);
  availableOnly.forEach(p => {
    const icon = p.type === 'player' ? '👥' : '🤖';
    console.log(`   ${icon} ${p.name} ✅`);
  });
  
  // Show what would be auto-populated
  console.log(`\n📝 Auto-populated Summit Details:`);
  console.log(`   • Title: "${channel.name} Summit"`);
  console.log(`   • Description: "Strategic meeting for all members of the ${channel.name} channel"`);
  console.log(`   • Type: Hybrid (Voice + Text)`);
  console.log(`   • Priority: ${channel.type === 'emergency' ? 'Critical' : channel.type === 'cabinet' ? 'High' : 'Medium'}`);
  
  return {
    channelId: channel.id,
    channelName: channel.name,
    allParticipants: allParticipants.length,
    playersOnly: playersOnly.length,
    availableOnly: availableOnly.length
  };
}

// Simulate summit scheduling scenarios
function simulateSummitScenarios() {
  console.log('📅 Channel-Wide Summit Scheduling Demo');
  console.log('=' .repeat(50));
  
  const scenarios = [
    {
      name: 'Emergency Crisis Response',
      channel: channels.find(c => c.id === 'channel_crisis'),
      description: 'All players need to coordinate immediate response to natural disaster',
      selectionType: 'All Channel Players'
    },
    {
      name: 'Full Cabinet Meeting',
      channel: channels.find(c => c.id === 'channel_cabinet'),
      description: 'Complete cabinet including all characters for policy discussion',
      selectionType: 'Entire Channel'
    },
    {
      name: 'Defense Strategy Session',
      channel: channels.find(c => c.id === 'channel_defense'),
      description: 'Only available participants for urgent military planning',
      selectionType: 'All Available'
    }
  ];
  
  scenarios.forEach((scenario, index) => {
    console.log(`\n🎯 Scenario ${index + 1}: ${scenario.name}`);
    console.log('-'.repeat(scenario.name.length + 15));
    console.log(`📋 Context: ${scenario.description}`);
    console.log(`🎛️ Selection: ${scenario.selectionType}`);
    
    const stats = simulateBulkSelection(scenario.channel);
    
    // Show expected outcome
    let selectedCount = 0;
    if (scenario.selectionType === 'All Channel Players') {
      selectedCount = stats.playersOnly;
    } else if (scenario.selectionType === 'Entire Channel') {
      selectedCount = stats.allParticipants;
    } else if (scenario.selectionType === 'All Available') {
      selectedCount = stats.availableOnly;
    }
    
    console.log(`\n🎉 Summit Result:`);
    console.log(`   • ${selectedCount} participants selected with one click`);
    console.log(`   • Auto-populated title and description`);
    console.log(`   • Ready for timing and review steps`);
  });
}

// Simulate the user experience flow
function simulateUserFlow() {
  console.log('\n\n👤 User Experience Flow');
  console.log('=' .repeat(30));
  
  const steps = [
    '1. User opens WhoseApp → Channels tab',
    '2. User selects a channel (e.g., #Cabinet)',
    '3. User clicks "Schedule Summit" button',
    '4. Summit Scheduler opens with channel context',
    '   • Title pre-filled: "Cabinet Summit"',
    '   • Description pre-filled with channel context',
    '5. User moves to Participants step',
    '6. Bulk selection options appear:',
    '   • 👥 All Channel Players (2)',
    '   • 🏛️ Entire #Cabinet (5)',
    '   • ✅ All Available (4)',
    '   • ❌ Clear All',
    '7. User clicks "All Channel Players"',
    '   • Instantly selects all player participants',
    '   • Shows breakdown: "2 players, 0 characters"',
    '8. User proceeds through timing and review',
    '9. Summit scheduled with all channel players',
    '10. All participants receive notifications'
  ];
  
  steps.forEach(step => {
    console.log(step);
  });
  
  console.log('\n✨ Key Benefits:');
  console.log('   • One-click selection of all channel players');
  console.log('   • Context-aware summit creation');
  console.log('   • No manual participant hunting');
  console.log('   • Automatic conflict detection');
  console.log('   • Channel-specific summit titles');
}

// Run the demo
function runDemo() {
  simulateSummitScenarios();
  simulateUserFlow();
  
  console.log('\n\n🎊 Channel-Wide Summit Features Summary:');
  console.log('=' .repeat(45));
  console.log('✅ Bulk participant selection');
  console.log('✅ Channel context integration');
  console.log('✅ Auto-populated summit details');
  console.log('✅ Player vs character filtering');
  console.log('✅ Availability-based selection');
  console.log('✅ One-click channel-wide summits');
  console.log('✅ Enhanced user experience');
  console.log('✅ Conflict detection with existing summits');
  
  console.log('\n🚀 Ready for integration into WhoseApp!');
}

// Execute the demo
runDemo();

