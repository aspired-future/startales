// Test script for Constitution API
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testConstitutionAPI() {
  console.log('🧪 Testing Constitution API...\n');

  try {
    // Test 1: Get party system options
    console.log('1. Testing party system options endpoint...');
    const optionsResponse = await fetch(`${BASE_URL}/api/constitution/party-systems/options`);
    const optionsData = await optionsResponse.json();
    
    if (optionsData.success) {
      console.log('✅ Party system options retrieved successfully');
      console.log(`   Found ${Object.keys(optionsData.data).length} party system types`);
    } else {
      console.log('❌ Failed to get party system options');
    }

    // Test 2: Get constitutional templates
    console.log('\n2. Testing constitutional templates endpoint...');
    const templatesResponse = await fetch(`${BASE_URL}/api/constitution/templates/all`);
    const templatesData = await templatesResponse.json();
    
    if (templatesData.success) {
      console.log('✅ Constitutional templates retrieved successfully');
      console.log(`   Found ${templatesData.data.length} templates`);
      templatesData.data.forEach(template => {
        console.log(`   - ${template.name} (${template.politicalPartySystem.type})`);
      });
    } else {
      console.log('❌ Failed to get constitutional templates');
    }

    // Test 3: Try to get constitution for a civilization (should return 404 for non-existent)
    console.log('\n3. Testing civilization constitution endpoint...');
    const civResponse = await fetch(`${BASE_URL}/api/constitution/civilization/1/test_civ`);
    
    if (civResponse.status === 404) {
      console.log('✅ Correctly returns 404 for non-existent civilization constitution');
    } else if (civResponse.ok) {
      const civData = await civResponse.json();
      console.log('✅ Found existing constitution for test civilization');
      console.log(`   Constitution: ${civData.data.name}`);
    } else {
      console.log('❌ Unexpected response from civilization endpoint');
    }

    // Test 4: Create a new constitution
    console.log('\n4. Testing constitution creation...');
    const createData = {
      name: 'Test Constitution',
      campaignId: 1,
      civilizationId: 'test_civ',
      governmentType: 'parliamentary',
      foundingPrinciples: ['Democracy', 'Justice', 'Liberty'],
      partySystemType: 'multiparty',
      executiveStructure: {
        headOfState: 'president',
        headOfGovernment: 'prime_minister',
        termLength: 4
      },
      legislativeStructure: {
        structure: 'bicameral',
        chambers: []
      },
      judicialStructure: {
        structure: 'unified',
        courts: []
      },
      billOfRights: [
        { category: 'Civil Rights', rights: ['Freedom of speech', 'Freedom of assembly'] }
      ]
    };

    const createResponse = await fetch(`${BASE_URL}/api/constitution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData)
    });

    const createResult = await createResponse.json();
    
    if (createResult.success) {
      console.log('✅ Constitution created successfully');
      console.log(`   Constitution ID: ${createResult.data.id}`);
      console.log(`   Party System: ${createResult.data.politicalPartySystem.type}`);
      
      // Test 5: Update party system
      console.log('\n5. Testing party system update...');
      const updateResponse = await fetch(`${BASE_URL}/api/constitution/${createResult.data.id}/party-system`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPartySystemType: 'two_party',
          reason: 'Testing party system change functionality'
        })
      });

      const updateResult = await updateResponse.json();
      
      if (updateResult.success) {
        console.log('✅ Party system updated successfully');
        console.log(`   New party system: ${updateResult.data.politicalPartySystem.type}`);
      } else {
        console.log('❌ Failed to update party system');
        console.log(`   Error: ${updateResult.error}`);
      }

    } else {
      console.log('❌ Failed to create constitution');
      console.log(`   Error: ${createResult.error}`);
    }

  } catch (error) {
    console.log('❌ API test failed with error:', error.message);
    console.log('   Make sure the server is running on port 3001');
  }

  console.log('\n🏁 Constitution API test completed');
}

// Run the test
testConstitutionAPI();
