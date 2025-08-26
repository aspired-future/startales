#!/usr/bin/env node

/**
 * Department Delegation System Test Script
 * 
 * This script demonstrates the enhanced delegation system with department-level controls
 */

console.log('🏢 Department Delegation System Test');
console.log('====================================\n');

// Mock Department Data (matches the implementation)
const mockDepartments = [
  {
    id: 'defense',
    name: 'Department of Defense',
    description: 'Military operations, space defense, and national security',
    head: 'sec-defense',
    members: ['sec-defense', 'deputy-defense', 'military-advisor'],
    isDelegated: true,
    autoMode: false,
    delegationLevel: 'partial',
    permissions: ['military-operations', 'defense-budget', 'strategic-planning'],
    performance: {
      efficiency: 92,
      autonomy: 85,
      compliance: 95
    }
  },
  {
    id: 'treasury',
    name: 'Department of Treasury',
    description: 'Economic policy, budget management, and financial oversight',
    head: 'sec-treasury',
    members: ['sec-treasury', 'deputy-treasury', 'budget-director'],
    isDelegated: true,
    autoMode: true,
    delegationLevel: 'full',
    permissions: ['budget-approval', 'tax-policy', 'economic-planning'],
    performance: {
      efficiency: 88,
      autonomy: 90,
      compliance: 92
    }
  },
  {
    id: 'science',
    name: 'Department of Science',
    description: 'Research coordination, technology development, and innovation',
    head: 'sec-science',
    members: ['sec-science', 'research-director', 'tech-advisor'],
    isDelegated: false,
    autoMode: false,
    delegationLevel: 'none',
    permissions: ['research-funding', 'tech-policy', 'innovation-programs'],
    performance: {
      efficiency: 94,
      autonomy: 75,
      compliance: 89
    }
  }
];

const mockDepartmentDelegations = [
  {
    id: 'dept-del-001',
    departmentId: 'defense',
    delegatedTo: 'sec-defense',
    scope: 'operational',
    permissions: ['military-operations', 'tactical-decisions'],
    isActive: true,
    startDate: '2024-01-01',
    conditions: ['emergency-protocols', 'budget-limits']
  },
  {
    id: 'dept-del-002',
    departmentId: 'treasury',
    delegatedTo: 'sec-treasury',
    scope: 'full',
    permissions: ['budget-approval', 'tax-policy', 'economic-planning', 'expenditure-control'],
    isActive: true,
    startDate: '2024-01-01',
    conditions: ['quarterly-review', 'compliance-audit']
  }
];

// Test Functions
function displayDepartmentOverview() {
  console.log('🏢 DEPARTMENT OVERVIEW');
  console.log('---------------------');
  console.log(`📊 Total Departments: ${mockDepartments.length}`);
  console.log(`🔄 Delegated Departments: ${mockDepartments.filter(d => d.isDelegated).length}`);
  console.log(`⚡ Auto-Mode Departments: ${mockDepartments.filter(d => d.autoMode).length}`);
  console.log(`📈 Average Efficiency: ${Math.round(mockDepartments.reduce((sum, d) => sum + d.performance.efficiency, 0) / mockDepartments.length)}%`);
  console.log('');
}

function displayDepartments() {
  console.log('🏛️ DEPARTMENT STATUS');
  console.log('-------------------');
  
  mockDepartments.forEach(dept => {
    console.log(`🏢 ${dept.name}`);
    console.log(`   📝 ${dept.description}`);
    console.log(`   👤 Head: ${dept.head}`);
    console.log(`   👥 Members: ${dept.members.length}`);
    console.log(`   🔄 Delegation: ${dept.delegationLevel.toUpperCase()}`);
    console.log(`   ⚡ Auto Mode: ${dept.autoMode ? 'ON' : 'OFF'}`);
    console.log(`   📊 Performance:`);
    console.log(`      • Efficiency: ${dept.performance.efficiency}%`);
    console.log(`      • Autonomy: ${dept.performance.autonomy}%`);
    console.log(`      • Compliance: ${dept.performance.compliance}%`);
    console.log(`   🔑 Permissions: ${dept.permissions.join(', ')}`);
    console.log('');
  });
}

function displayDepartmentDelegations() {
  console.log('🤝 DEPARTMENT DELEGATIONS');
  console.log('-------------------------');
  
  mockDepartmentDelegations.forEach(delegation => {
    const dept = mockDepartments.find(d => d.id === delegation.departmentId);
    console.log(`📋 ${dept ? dept.name : delegation.departmentId}`);
    console.log(`   👤 Delegated To: ${delegation.delegatedTo}`);
    console.log(`   🎯 Scope: ${delegation.scope.toUpperCase()}`);
    console.log(`   ✅ Status: ${delegation.isActive ? 'Active' : 'Inactive'}`);
    console.log(`   🔑 Permissions: ${delegation.permissions.join(', ')}`);
    console.log(`   📅 Start Date: ${delegation.startDate}`);
    console.log(`   📋 Conditions: ${delegation.conditions.join(', ')}`);
    console.log('');
  });
}

function simulateDepartmentAutoToggle() {
  console.log('🔄 SIMULATING DEPARTMENT AUTO-TOGGLE');
  console.log('------------------------------------');
  
  // Toggle Science Department auto mode
  const scienceDept = mockDepartments.find(d => d.id === 'science');
  if (scienceDept) {
    const oldAutoMode = scienceDept.autoMode;
    scienceDept.autoMode = !scienceDept.autoMode;
    
    console.log(`✅ ${scienceDept.name}:`);
    console.log(`   🔄 Auto Mode: ${oldAutoMode ? 'ON' : 'OFF'} → ${scienceDept.autoMode ? 'ON' : 'OFF'}`);
    
    if (scienceDept.autoMode) {
      console.log(`   📈 Expected Benefits:`);
      console.log(`      • Faster decision making`);
      console.log(`      • Reduced manual oversight`);
      console.log(`      • Automated task assignment`);
    }
    console.log('');
  }
}

function simulateFullDepartmentDelegation() {
  console.log('🏛️ SIMULATING FULL DEPARTMENT DELEGATION');
  console.log('----------------------------------------');
  
  // Delegate Science Department fully
  const scienceDept = mockDepartments.find(d => d.id === 'science');
  if (scienceDept) {
    const oldDelegationLevel = scienceDept.delegationLevel;
    scienceDept.isDelegated = true;
    scienceDept.delegationLevel = 'full';
    
    // Create new delegation record
    const newDelegation = {
      id: 'dept-del-003',
      departmentId: 'science',
      delegatedTo: 'sec-science',
      scope: 'full',
      permissions: [...scienceDept.permissions, 'strategic-decisions', 'budget-control'],
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      conditions: ['monthly-review', 'performance-targets']
    };
    
    mockDepartmentDelegations.push(newDelegation);
    
    console.log(`✅ ${scienceDept.name}:`);
    console.log(`   🔄 Delegation: ${oldDelegationLevel.toUpperCase()} → ${scienceDept.delegationLevel.toUpperCase()}`);
    console.log(`   👤 Delegated To: ${newDelegation.delegatedTo}`);
    console.log(`   🔑 New Permissions: ${newDelegation.permissions.join(', ')}`);
    console.log(`   📅 Effective: ${newDelegation.startDate}`);
    console.log(`   📋 Conditions: ${newDelegation.conditions.join(', ')}`);
    console.log('');
  }
}

function displayUpdatedMetrics() {
  console.log('📊 UPDATED DEPARTMENT METRICS');
  console.log('-----------------------------');
  
  const totalDepts = mockDepartments.length;
  const delegatedDepts = mockDepartments.filter(d => d.isDelegated).length;
  const autoDepts = mockDepartments.filter(d => d.autoMode).length;
  const fullDelegatedDepts = mockDepartments.filter(d => d.delegationLevel === 'full').length;
  const avgEfficiency = Math.round(mockDepartments.reduce((sum, d) => sum + d.performance.efficiency, 0) / totalDepts);
  const avgAutonomy = Math.round(mockDepartments.reduce((sum, d) => sum + d.performance.autonomy, 0) / totalDepts);
  
  console.log(`🏢 Total Departments: ${totalDepts}`);
  console.log(`🔄 Delegated Departments: ${delegatedDepts} (${Math.round(delegatedDepts/totalDepts*100)}%)`);
  console.log(`⚡ Auto-Mode Departments: ${autoDepts} (${Math.round(autoDepts/totalDepts*100)}%)`);
  console.log(`🎯 Fully Delegated: ${fullDelegatedDepts}`);
  console.log(`📈 Average Efficiency: ${avgEfficiency}%`);
  console.log(`🔧 Average Autonomy: ${avgAutonomy}%`);
  console.log(`📋 Total Delegations: ${mockDepartmentDelegations.length}`);
  console.log('');
}

function displayCapabilities() {
  console.log('🎯 DEPARTMENT DELEGATION CAPABILITIES');
  console.log('------------------------------------');
  
  console.log('✅ Individual Department Auto-Toggle');
  console.log('   • Enable/disable automation per department');
  console.log('   • Real-time performance tracking');
  console.log('   • Autonomous decision making');
  console.log('');
  
  console.log('✅ Flexible Delegation Levels');
  console.log('   • NONE: Manual control only');
  console.log('   • PARTIAL: Limited delegation scope');
  console.log('   • FULL: Complete department autonomy');
  console.log('');
  
  console.log('✅ Granular Permission Control');
  console.log('   • Department-specific permissions');
  console.log('   • Scope-based access control');
  console.log('   • Condition-based restrictions');
  console.log('');
  
  console.log('✅ Performance Monitoring');
  console.log('   • Efficiency tracking');
  console.log('   • Autonomy measurement');
  console.log('   • Compliance monitoring');
  console.log('');
}

// Run the test
function runTest() {
  displayDepartmentOverview();
  displayDepartments();
  displayDepartmentDelegations();
  simulateDepartmentAutoToggle();
  simulateFullDepartmentDelegation();
  displayUpdatedMetrics();
  displayCapabilities();
  
  console.log('✅ DEPARTMENT DELEGATION SYSTEM TEST COMPLETE');
  console.log('=============================================');
  console.log('🎮 Access the full UI at: http://localhost:5175');
  console.log('🏛️ Navigate to: Game HUD → Cabinet → 🏢 Departments Tab');
  console.log('⚡ Toggle department auto-mode and test delegation controls!');
  console.log('🔄 Use individual department panels for specific automation!');
}

// Execute the test
runTest();

