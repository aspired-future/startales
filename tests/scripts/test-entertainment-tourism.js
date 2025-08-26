#!/usr/bin/env node

/**
 * Test script for Entertainment, Culture & Tourism system
 * Tests API endpoints and basic functionality
 */

const API_BASE = 'http://localhost:4000/api/entertainment-tourism';
const CIVILIZATION_ID = '1';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    if (data.data) {
      console.log(`   Data keys: ${Object.keys(data.data).join(', ')}`);
    }
    console.log('');
    
    return data;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return null;
  }
}

async function runTests() {
  console.log('🎭 Testing Entertainment, Culture & Tourism System\n');
  console.log('=' .repeat(60));
  console.log('');

  // Test cultural heritage endpoint
  await testAPI(`/cultural/heritage/${CIVILIZATION_ID}`);
  
  // Test cultural sites endpoint
  await testAPI(`/cultural/sites/${CIVILIZATION_ID}`);
  
  // Test entertainment industry endpoint
  await testAPI(`/entertainment/industry/${CIVILIZATION_ID}`);
  
  // Test entertainment venues endpoint
  await testAPI(`/entertainment/venues/${CIVILIZATION_ID}`);
  
  // Test tourism performance endpoint
  await testAPI(`/tourism/performance/${CIVILIZATION_ID}`);
  
  // Test tourist attractions endpoint
  await testAPI(`/tourism/attractions/${CIVILIZATION_ID}`);
  
  // Test economic impact endpoint
  await testAPI(`/economic/impact/${CIVILIZATION_ID}`);
  
  // Test employment data endpoint
  await testAPI(`/economic/employment/${CIVILIZATION_ID}`);
  
  // Test knobs endpoint
  await testAPI(`/knobs/${CIVILIZATION_ID}`);
  
  // Test analytics endpoint
  await testAPI(`/analytics/${CIVILIZATION_ID}`);
  
  // Test events endpoint
  await testAPI(`/events/${CIVILIZATION_ID}`);
  
  // Test creating a cultural event
  await testAPI(`/cultural/events/${CIVILIZATION_ID}`, 'POST', {
    eventType: 'festival',
    duration: 7,
    budget: 100000,
    description: 'Annual Cultural Festival'
  });
  
  // Test creating entertainment content
  await testAPI(`/entertainment/content/${CIVILIZATION_ID}`, 'POST', {
    contentType: 'film',
    title: 'Epic Space Adventure',
    genre: 'sci-fi',
    budget: 5000000,
    targetAudience: 'general'
  });
  
  // Test launching marketing campaign
  await testAPI(`/tourism/marketing/${CIVILIZATION_ID}`, 'POST', {
    campaignType: 'digital',
    budget: 500000,
    duration: 90,
    targetMarkets: ['domestic', 'regional'],
    message: 'Discover the wonders of our civilization'
  });
  
  // Test simulation
  await testAPI(`/simulate/${CIVILIZATION_ID}`, 'POST', {
    knobSettings: {
      cultural_heritage_preservation: 80,
      tourism_infrastructure_investment: 75,
      entertainment_venue_development: 70
    }
  });
  
  console.log('🎉 Entertainment & Tourism API tests completed!');
}

// Run the tests
runTests().catch(console.error);
