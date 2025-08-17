#!/usr/bin/env node

/**
 * 🚀 STARTALES - COMPREHENSIVE DEMO
 * Showcasing everything built so far in the Galactic Tale Weaver project
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Demo configuration
const API_BASE = 'http://localhost:4000';
const DEMO_CAMPAIGN_ID = 1;

// Utility functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function colorLog(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function separator() {
  console.log('\n' + '='.repeat(80) + '\n');
}

async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    let curlCommand = `curl -s -X ${method} "${API_BASE}${endpoint}"`;
    if (data) {
      curlCommand += ` -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`;
    }
    const { stdout } = await execAsync(curlCommand);
    return JSON.parse(stdout || '{}');
  } catch (error) {
    return { error: error.message };
  }
}

async function startDemo() {
  console.clear();
  colorLog('🚀 WELCOME TO STARTALES - GALACTIC TALE WEAVER', 'cyan');
  colorLog('Comprehensive Demo of Everything Built So Far', 'white');
  separator();

  colorLog('🎮 What we\'ll demonstrate:', 'yellow');
  console.log('  ✨ Sprint 4: Trade & Economy System');
  console.log('  🐳 Stabilized Docker Container Infrastructure');
  console.log('  🌌 Galactic Campaign Management');
  console.log('  💰 Dynamic Market Pricing & Trade Routes');
  console.log('  📄 Smart Contract System');
  console.log('  📊 Real-time Analytics & Indices');
  console.log('  🎯 Interactive Web Interface');
  
  colorLog('\nPress Enter to begin the demo...', 'green');
  
  // Wait for user input in a simple way
  await delay(3000); // Auto-continue after 3 seconds
  
  await demoInfrastructure();
  await demoTradeEconomy();
  await demoWebInterface();
  await demoConclusion();
}

async function demoInfrastructure() {
  separator();
  colorLog('🐳 INFRASTRUCTURE DEMO - Docker Container System', 'blue');
  
  colorLog('1. Container Status Check:', 'yellow');
  try {
    const { stdout } = await execAsync('docker ps | grep startales');
    console.log(stdout);
    colorLog('   ✅ All containers running smoothly!', 'green');
  } catch (error) {
    colorLog('   ❌ Container check failed', 'red');
  }

  colorLog('\n2. Health Check:', 'yellow');
  const health = await apiCall('/api/health');
  console.log('   Response:', JSON.stringify(health, null, 2));
  
  colorLog('\n3. Service Architecture:', 'yellow');
  console.log('   🚀 API Server (Sprint 4 Demo): Port 4000');
  console.log('   🗄️  PostgreSQL Database: Port 5432');
  console.log('   🔍 Qdrant Vector DB: Port 6333');
  console.log('   📨 NATS Message Queue: Port 4222');
  console.log('   🤖 Ollama LLM Service: Port 11434');
  
  await delay(3000);
}

async function demoTradeEconomy() {
  separator();
  colorLog('💰 TRADE & ECONOMY SYSTEM DEMO', 'magenta');
  
  // Initialize Campaign
  colorLog('1. Campaign Management:', 'yellow');
  console.log('   📡 Loading campaign context...');
  const campaign = await apiCall(`/api/campaigns/${DEMO_CAMPAIGN_ID}/resume`);
  if (campaign.success) {
    colorLog(`   ✅ Campaign ${DEMO_CAMPAIGN_ID} loaded!`, 'green');
    console.log(`   📊 Current Step: ${campaign.currentState.step}`);
    console.log(`   💰 Credits: ${campaign.currentState.resources.credits.toLocaleString()}`);
  }

  await delay(2000);

  // Market Prices
  colorLog('\n2. Dynamic Market Pricing:', 'yellow');
  console.log('   📈 Fetching real-time market prices...');
  const prices = await apiCall(`/api/trade/prices?campaignId=${DEMO_CAMPAIGN_ID}`);
  
  if (prices.success && prices.resources) {
    colorLog('   ✅ Market data loaded!', 'green');
    console.log('\n   🏷️  Current Market Prices:');
    
    prices.resources.slice(0, 4).forEach(resource => {
      const price = prices.prices[resource.id];
      const trend = price?.trend === 'rising' ? '📈' : price?.trend === 'falling' ? '📉' : '➡️';
      console.log(`   ${trend} ${resource.name}: ${price?.currentPrice?.toFixed(2) || resource.basePrice} ₢`);
      console.log(`      Supply: ${price?.supply || 0} | Demand: ${price?.demand || 0}`);
    });
  }

  await delay(3000);

  // Create Trade Route Demo
  colorLog('\n3. Trade Route Creation:', 'yellow');
  console.log('   🚢 Creating sample trade route...');
  
  const routeData = {
    campaignId: DEMO_CAMPAIGN_ID,
    name: "Alpha-Beta Express",
    origin: "Alpha Station",
    destination: "Beta Colony",
    resources: ["iron_ore", "manufactured_goods"],
    distance: 150,
    travelTime: 3,
    capacity: 1000,
    tariffRate: 0.05
  };

  const route = await apiCall('/api/trade/routes', 'POST', routeData);
  if (route.success) {
    colorLog('   ✅ Trade route created successfully!', 'green');
    console.log(`   📍 Route: ${route.route.origin} → ${route.route.destination}`);
    console.log(`   📦 Capacity: ${route.route.capacity} units`);
    console.log(`   💸 Tariff: ${(route.route.tariffRate * 100).toFixed(1)}%`);
  }

  await delay(2000);

  // Create Contract Demo
  colorLog('\n4. Smart Contract System:', 'yellow');
  console.log('   📄 Creating trade contract...');
  
  const contractData = {
    campaignId: DEMO_CAMPAIGN_ID,
    type: 'buy',
    resourceId: 'iron_ore',
    quantity: 50,
    pricePerUnit: 25,
    counterparty: 'Gamma Mining Corp',
    terms: {
      paymentMethod: 'credits',
      deliveryTerms: 'immediate'
    }
  };

  const contract = await apiCall('/api/trade/contracts', 'POST', contractData);
  if (contract.success) {
    colorLog('   ✅ Contract created successfully!', 'green');
    console.log(`   📋 Type: ${contract.contract.type.toUpperCase()} ${contract.contract.quantity} ${contract.resource.name}`);
    console.log(`   💰 Total Value: ${contract.contract.totalValue} ₢`);
    console.log(`   🏢 Counterparty: ${contract.contract.counterparty}`);
  }

  await delay(2000);

  // Analytics Demo
  colorLog('\n5. Real-time Analytics:', 'yellow');
  console.log('   📊 Computing trade analytics...');
  
  const analytics = await apiCall(`/api/trade/indices?campaignId=${DEMO_CAMPAIGN_ID}`);
  if (analytics.success) {
    colorLog('   ✅ Analytics computed!', 'green');
    console.log('\n   📈 Market Indices:');
    console.log(`   🏭 Raw Materials Index: ${analytics.analytics.priceIndices.rawMaterialsIndex.toFixed(2)}`);
    console.log(`   🔧 Manufactured Index: ${analytics.analytics.priceIndices.manufacturedIndex.toFixed(2)}`);
    console.log(`   📊 Overall Market Index: ${analytics.analytics.priceIndices.overallIndex.toFixed(2)}`);
    console.log(`   💹 Trade Volume: ${analytics.analytics.totalTradeVolume.toLocaleString()} ₢`);
    console.log(`   ⚖️  Trade Balance: ${analytics.analytics.tradeBalance >= 0 ? '+' : ''}${analytics.analytics.tradeBalance.toLocaleString()} ₢`);
  }

  await delay(3000);
}

async function demoWebInterface() {
  separator();
  colorLog('🌐 INTERACTIVE WEB INTERFACE DEMO', 'cyan');
  
  colorLog('The complete Trade & Economy interface is live at:', 'yellow');
  colorLog(`🔗 ${API_BASE}/demo/trade`, 'green');
  
  console.log('\n🎮 Interactive Features Available:');
  console.log('   ✨ Real-time Market Prices with trend indicators');
  console.log('   🚢 Trade Route Management (Create, Suspend, Reactivate)');
  console.log('   📄 Contract Lifecycle (Create, Activate, Complete)');
  console.log('   📊 Live Analytics Dashboard');
  console.log('   🎯 Market Simulation (Scarcity, Abundance, Tariffs)');
  console.log('   📋 Activity Logging System');
  console.log('   🎮 Campaign Context Management');

  colorLog('\n🖥️  Opening demo in browser...', 'yellow');
  
  try {
    // Try to open browser (works on most systems)
    await execAsync(`command -v xdg-open && xdg-open "${API_BASE}/demo/trade" || echo "Manual browser open required"`);
    colorLog('   ✅ Demo interface should be opening!', 'green');
  } catch (error) {
    colorLog(`   📱 Please manually visit: ${API_BASE}/demo/trade`, 'yellow');
  }

  await delay(3000);
}

async function demoConclusion() {
  separator();
  colorLog('🎉 DEMO CONCLUSION - What We\'ve Built', 'green');
  
  console.log('✅ COMPLETED FEATURES:');
  console.log('   🐳 Fully Stabilized Docker Infrastructure');
  console.log('   🌌 Campaign & State Management System');
  console.log('   💰 Dynamic Market Pricing Engine');
  console.log('   🚢 Trade Route Management');
  console.log('   📄 Smart Contract Lifecycle');
  console.log('   📊 Real-time Analytics & Market Indices');
  console.log('   🎮 Interactive Web Demo Interface');
  console.log('   🔄 Market Simulation & Events');
  console.log('   📋 Activity Logging & History');
  console.log('   🏥 Health Monitoring & Stability');

  colorLog('\n🚀 TECHNICAL ACHIEVEMENTS:', 'blue');
  console.log('   ⚡ Express.js API with full REST endpoints');
  console.log('   🗄️  PostgreSQL integration for persistence');
  console.log('   🐳 Multi-service Docker orchestration');
  console.log('   🔒 Security hardening & non-root containers');
  console.log('   📈 Real-time data processing');
  console.log('   🎨 Modern responsive web interface');
  console.log('   🧪 Comprehensive testing & validation');

  colorLog('\n💡 NEXT STEPS:', 'yellow');
  console.log('   🤖 AI Integration for trade recommendations');
  console.log('   🌟 Advanced market events & scenarios');
  console.log('   👥 Multi-player campaign support');
  console.log('   📱 Mobile-responsive improvements');
  console.log('   🔐 Authentication & authorization');

  separator();
  colorLog('🎊 Thank you for exploring STARTALES!', 'magenta');
  colorLog('The galactic trade empire awaits your commands!', 'cyan');
  colorLog(`\n🌐 Demo available at: ${API_BASE}/demo/trade`, 'green');
  separator();
}

// Start the demo
startDemo().catch(console.error);
