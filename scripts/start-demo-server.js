#!/usr/bin/env node

/**
 * Demo Server Startup Script
 * 
 * Starts the comprehensive demo server with all completed systems:
 * - Sprint 1: Core Simulation Engine
 * - Sprint 2: Persistence & Event Sourcing  
 * - Sprint 3: Policies & Advisors
 * - Sprint 4: Trade & Economy
 * - Sprint 5: Population & Demographics Engine
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Startales Demo Server...\n');

console.log('📋 Available Systems:');
console.log('✅ Sprint 1: Core Simulation Engine');
console.log('✅ Sprint 2: Persistence & Event Sourcing');
console.log('✅ Sprint 3: Policies & Advisors');
console.log('✅ Sprint 4: Trade & Economy');
console.log('✅ Sprint 5: Population & Demographics Engine');
console.log('');

console.log('🎮 Demo Endpoints:');
console.log('• Main HUD Demo: http://localhost:4010/demo/hud');
console.log('• Persistence Demo: http://localhost:4010/demo/persistence');
console.log('• Policies Demo: http://localhost:4010/demo/policies');
console.log('• Trade Demo: http://localhost:4010/demo/trade');
console.log('• Population Demo: http://localhost:4010/demo/population');
console.log('');

console.log('🔗 API Endpoints:');
console.log('• Simulation API: http://localhost:4010/api/sim/*');
console.log('• Campaign API: http://localhost:4010/api/campaigns/*');
console.log('• Policy API: http://localhost:4010/api/policies/*');
console.log('• Trade API: http://localhost:4010/api/trade/*');
console.log('• Population API: http://localhost:4010/api/population/*');
console.log('');

// Change to src directory and start the demo
process.chdir(path.join(__dirname, '..', 'src'));

console.log('🔧 Starting demo server on port 4010...\n');

console.log('Demo server has been removed. Use main server instead.');
process.exit(0);
// const demo = spawn('npx', ['tsx', 'demo/index.ts'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: '4010',
    NODE_ENV: 'development'
  }
});

demo.on('error', (error) => {
  console.error('❌ Failed to start demo server:', error.message);
  process.exit(1);
});

demo.on('close', (code) => {
  console.log(`\n📊 Demo server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down demo server...');
  demo.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down demo server...');
  demo.kill('SIGTERM');
});
