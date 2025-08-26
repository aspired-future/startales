#!/usr/bin/env node

/**
 * Create Test Missions Script
 * 
 * Populates the missions database with test data for demonstration
 */

const testMissions = [
  {
    id: 'mission_001',
    campaignId: 'default_campaign',
    civilizationId: 'Commander_Alpha',
    title: 'Explore Kepler-442 System',
    description: 'Conduct a comprehensive survey of the Kepler-442 system to identify habitable planets and valuable resources. This mission is crucial for our expansion efforts.',
    type: 'exploration',
    priority: 'high',
    status: 'active',
    difficulty: 3,
    storyArc: 'Galactic Expansion',
    gameMasterGenerated: true,
    narrativeImpact: 'major',
    objectives: [
      {
        id: 'obj_001_1',
        description: 'Deploy long-range sensors to scan the system',
        completed: true,
        progress: 100,
        required: true
      },
      {
        id: 'obj_001_2',
        description: 'Analyze planetary compositions and atmospheres',
        completed: false,
        progress: 65,
        required: true
      },
      {
        id: 'obj_001_3',
        description: 'Establish communication relay station',
        completed: false,
        progress: 30,
        required: false
      }
    ],
    rewards: [
      {
        type: 'Research Points',
        amount: 5000,
        description: 'Advanced astronomical data'
      },
      {
        type: 'Credits',
        amount: 250000,
        description: 'Mission completion bonus'
      }
    ],
    risks: [
      {
        type: 'Equipment Failure',
        probability: 15,
        impact: 'Mission delay',
        description: 'Long-range equipment may malfunction'
      }
    ],
    requirements: [
      {
        type: 'Fleet',
        amount: 1,
        description: 'Science vessel required',
        met: true
      }
    ],
    estimatedDuration: 45,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    progress: 65,
    currentPhase: 'Data Analysis',
    assignedCharacters: ['scientist_001', 'navigator_002'],
    assignedFleets: ['science_fleet_alpha'],
    assignedResources: { fuel: 1000, supplies: 500 },
    successProbability: 85,
    gameMasterNotes: 'This system shows promising signs of rare mineral deposits. The crew is performing exceptionally well.'
  },
  {
    id: 'mission_002',
    campaignId: 'default_campaign',
    civilizationId: 'Commander_Alpha',
    title: 'Diplomatic Summit with Vega Federation',
    description: 'Negotiate a comprehensive trade agreement with the Vega Federation to secure access to their advanced technology markets.',
    type: 'diplomatic',
    priority: 'critical',
    status: 'active',
    difficulty: 4,
    storyArc: 'Galactic Politics',
    gameMasterGenerated: true,
    narrativeImpact: 'pivotal',
    objectives: [
      {
        id: 'obj_002_1',
        description: 'Establish initial diplomatic contact',
        completed: true,
        progress: 100,
        required: true
      },
      {
        id: 'obj_002_2',
        description: 'Present trade proposal to Federation Council',
        completed: false,
        progress: 80,
        required: true
      },
      {
        id: 'obj_002_3',
        description: 'Negotiate technology sharing terms',
        completed: false,
        progress: 25,
        required: true
      }
    ],
    rewards: [
      {
        type: 'Technology Access',
        amount: 1,
        description: 'Advanced propulsion technology'
      },
      {
        type: 'Trade Revenue',
        amount: 1000000,
        description: 'Annual trade income increase'
      }
    ],
    risks: [
      {
        type: 'Diplomatic Incident',
        probability: 25,
        impact: 'Relations deterioration',
        description: 'Cultural misunderstandings could damage relations'
      }
    ],
    requirements: [
      {
        type: 'Diplomat',
        amount: 1,
        description: 'Experienced diplomatic envoy required',
        met: true
      }
    ],
    timeLimit: 14,
    estimatedDuration: 21,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    progress: 68,
    currentPhase: 'Formal Negotiations',
    assignedCharacters: ['diplomat_001', 'trade_specialist_001'],
    assignedFleets: ['diplomatic_cruiser_beta'],
    assignedResources: { diplomatic_gifts: 50, security_detail: 10 },
    successProbability: 72,
    gameMasterNotes: 'The Federation is showing genuine interest, but they are concerned about our military expansion. Handle with care.'
  },
  {
    id: 'mission_003',
    campaignId: 'default_campaign',
    civilizationId: 'Commander_Alpha',
    title: 'Secure Asteroid Mining Operation',
    description: 'Establish and defend a mining operation in the resource-rich asteroid belt of the Proxima system.',
    type: 'military',
    priority: 'high',
    status: 'active',
    difficulty: 4,
    storyArc: 'Resource Wars',
    gameMasterGenerated: true,
    narrativeImpact: 'major',
    objectives: [
      {
        id: 'obj_003_1',
        description: 'Deploy mining platforms to asteroid belt',
        completed: true,
        progress: 100,
        required: true
      },
      {
        id: 'obj_003_2',
        description: 'Establish defensive perimeter',
        completed: true,
        progress: 100,
        required: true
      },
      {
        id: 'obj_003_3',
        description: 'Repel pirate attacks and secure operations',
        completed: false,
        progress: 85,
        required: true
      }
    ],
    rewards: [
      {
        type: 'Rare Minerals',
        amount: 10000,
        description: 'High-grade titanium and platinum'
      },
      {
        type: 'Military Experience',
        amount: 500,
        description: 'Combat experience for fleet crews'
      }
    ],
    risks: [
      {
        type: 'Pirate Raids',
        probability: 40,
        impact: 'Equipment loss',
        description: 'Organized pirate groups target mining operations'
      },
      {
        type: 'Equipment Sabotage',
        probability: 20,
        impact: 'Production delays',
        description: 'Hostile factions may attempt sabotage'
      }
    ],
    requirements: [
      {
        type: 'Military Fleet',
        amount: 2,
        description: 'Combat vessels for protection',
        met: true
      },
      {
        type: 'Mining Equipment',
        amount: 5,
        description: 'Automated mining platforms',
        met: true
      }
    ],
    timeLimit: 60,
    estimatedDuration: 90,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    startedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    expiresAt: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 days from now
    progress: 85,
    currentPhase: 'Security Operations',
    assignedCharacters: ['fleet_commander_001', 'mining_engineer_001'],
    assignedFleets: ['battle_group_gamma', 'mining_support_delta'],
    assignedResources: { ammunition: 2000, repair_kits: 100 },
    successProbability: 78,
    gameMasterNotes: 'The operation is proceeding well, but intelligence suggests a major pirate offensive is being planned. Recommend increased security.'
  },
  {
    id: 'mission_004',
    campaignId: 'default_campaign',
    civilizationId: 'Commander_Alpha',
    title: 'Quantum Computing Research Initiative',
    description: 'Develop breakthrough quantum computing technology to advance our civilization\'s computational capabilities.',
    type: 'research',
    priority: 'medium',
    status: 'available',
    difficulty: 5,
    storyArc: 'Technological Advancement',
    gameMasterGenerated: true,
    narrativeImpact: 'major',
    objectives: [
      {
        id: 'obj_004_1',
        description: 'Establish quantum research laboratory',
        completed: false,
        progress: 0,
        required: true
      },
      {
        id: 'obj_004_2',
        description: 'Recruit quantum physics specialists',
        completed: false,
        progress: 0,
        required: true
      },
      {
        id: 'obj_004_3',
        description: 'Develop quantum processor prototype',
        completed: false,
        progress: 0,
        required: true
      }
    ],
    rewards: [
      {
        type: 'Technology Breakthrough',
        amount: 1,
        description: 'Quantum computing technology'
      },
      {
        type: 'Research Points',
        amount: 15000,
        description: 'Advanced physics research data'
      }
    ],
    risks: [
      {
        type: 'Research Failure',
        probability: 35,
        impact: 'Resource loss',
        description: 'Quantum research is highly experimental'
      },
      {
        type: 'Talent Shortage',
        probability: 25,
        impact: 'Project delays',
        description: 'Limited availability of quantum specialists'
      }
    ],
    requirements: [
      {
        type: 'Research Facility',
        amount: 1,
        description: 'Advanced physics laboratory',
        met: false
      },
      {
        type: 'Research Budget',
        amount: 5000000,
        description: 'Funding for equipment and personnel',
        met: true
      }
    ],
    estimatedDuration: 180,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    progress: 0,
    currentPhase: 'Planning',
    assignedCharacters: [],
    assignedFleets: [],
    assignedResources: {},
    successProbability: 45,
    gameMasterNotes: 'This is a high-risk, high-reward research project. Success could provide significant technological advantages.'
  },
  {
    id: 'mission_005',
    campaignId: 'default_campaign',
    civilizationId: 'Commander_Alpha',
    title: 'Humanitarian Relief for Tau Ceti Colony',
    description: 'Provide emergency medical aid and supplies to the Tau Ceti colony following a devastating natural disaster.',
    type: 'humanitarian',
    priority: 'critical',
    status: 'available',
    difficulty: 2,
    storyArc: 'Galactic Community',
    gameMasterGenerated: true,
    narrativeImpact: 'moderate',
    objectives: [
      {
        id: 'obj_005_1',
        description: 'Deploy medical teams and supplies',
        completed: false,
        progress: 0,
        required: true
      },
      {
        id: 'obj_005_2',
        description: 'Establish temporary shelter facilities',
        completed: false,
        progress: 0,
        required: true
      },
      {
        id: 'obj_005_3',
        description: 'Coordinate with local authorities',
        completed: false,
        progress: 0,
        required: false
      }
    ],
    rewards: [
      {
        type: 'Diplomatic Reputation',
        amount: 1000,
        description: 'Improved standing with galactic community'
      },
      {
        type: 'Cultural Exchange',
        amount: 1,
        description: 'Enhanced cultural understanding'
      }
    ],
    risks: [
      {
        type: 'Secondary Disasters',
        probability: 20,
        impact: 'Personnel danger',
        description: 'Aftershocks and environmental hazards'
      }
    ],
    requirements: [
      {
        type: 'Medical Personnel',
        amount: 50,
        description: 'Doctors, nurses, and medical technicians',
        met: true
      },
      {
        type: 'Relief Supplies',
        amount: 1000,
        description: 'Medical supplies, food, and shelter materials',
        met: true
      }
    ],
    timeLimit: 7,
    estimatedDuration: 14,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    progress: 0,
    currentPhase: 'Preparation',
    assignedCharacters: [],
    assignedFleets: [],
    assignedResources: {},
    successProbability: 90,
    gameMasterNotes: 'Time is critical. The colony population is suffering, and quick action will save lives and improve our reputation.'
  },
  {
    id: 'mission_006',
    campaignId: 'default_campaign',
    civilizationId: 'Commander_Alpha',
    title: 'Ancient Artifact Recovery',
    description: 'A recently completed archaeological mission that uncovered valuable alien technology from a precursor civilization.',
    type: 'exploration',
    priority: 'high',
    status: 'completed',
    difficulty: 4,
    storyArc: 'Ancient Mysteries',
    gameMasterGenerated: true,
    narrativeImpact: 'major',
    objectives: [
      {
        id: 'obj_006_1',
        description: 'Locate and excavate ancient ruins',
        completed: true,
        progress: 100,
        required: true
      },
      {
        id: 'obj_006_2',
        description: 'Analyze and catalog discovered artifacts',
        completed: true,
        progress: 100,
        required: true
      },
      {
        id: 'obj_006_3',
        description: 'Secure artifacts for transport',
        completed: true,
        progress: 100,
        required: true
      }
    ],
    rewards: [
      {
        type: 'Ancient Technology',
        amount: 3,
        description: 'Precursor energy manipulation devices'
      },
      {
        type: 'Research Points',
        amount: 8000,
        description: 'Archaeological and technological data'
      }
    ],
    risks: [],
    requirements: [
      {
        type: 'Archaeological Team',
        amount: 1,
        description: 'Specialized excavation crew',
        met: true
      }
    ],
    estimatedDuration: 60,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    startedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000), // 85 days ago
    completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    progress: 100,
    currentPhase: 'Completed',
    assignedCharacters: ['archaeologist_001', 'xenotech_specialist_001'],
    assignedFleets: ['research_vessel_epsilon'],
    assignedResources: {},
    successProbability: 100,
    gameMasterNotes: 'Exceptional success! The artifacts recovered have provided significant technological insights and opened new research avenues.'
  }
];

console.log('🎯 Test Missions Data Generated');
console.log('==============================\n');

console.log(`Generated ${testMissions.length} test missions:`);
testMissions.forEach((mission, index) => {
  console.log(`${index + 1}. ${mission.title}`);
  console.log(`   Type: ${mission.type} | Priority: ${mission.priority} | Status: ${mission.status}`);
  console.log(`   Progress: ${mission.progress}% | Difficulty: ${mission.difficulty}/5`);
  console.log(`   Objectives: ${mission.objectives.length} | Rewards: ${mission.rewards.length}`);
  console.log('');
});

console.log('📊 Mission Statistics:');
console.log('---------------------');
const statusCounts = testMissions.reduce((acc, mission) => {
  acc[mission.status] = (acc[mission.status] || 0) + 1;
  return acc;
}, {});

const typeCounts = testMissions.reduce((acc, mission) => {
  acc[mission.type] = (acc[mission.type] || 0) + 1;
  return acc;
}, {});

const priorityCounts = testMissions.reduce((acc, mission) => {
  acc[mission.priority] = (acc[mission.priority] || 0) + 1;
  return acc;
}, {});

console.log('Status Distribution:');
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});

console.log('\nType Distribution:');
Object.entries(typeCounts).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\nPriority Distribution:');
Object.entries(priorityCounts).forEach(([priority, count]) => {
  console.log(`  ${priority}: ${count}`);
});

console.log('\n✅ Test missions ready for API integration!');
console.log('\n🔧 To use this data:');
console.log('1. Ensure the Missions API server is running');
console.log('2. POST each mission to /api/missions/create');
console.log('3. Or integrate this data into your database initialization');
console.log('4. Navigate to the Live HUD to see missions in action');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testMissions };
}


