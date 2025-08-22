/**
 * Test Government Bonds System
 */

console.log('🧪 Testing Government Bonds System...');

// Test basic API endpoints
async function testBondsAPI() {
  try {
    console.log('📡 Testing Government Bonds API endpoints...');
    
    // Test health endpoint first
    const healthResponse = await fetch('http://localhost:4000/api/health');
    const health = await healthResponse.json();
    console.log('✅ Health check:', health);

    // Test bonds endpoint
    const bondsResponse = await fetch('http://localhost:4000/api/government-bonds/1');
    const bondsData = await bondsResponse.json();
    console.log('📊 Bonds data:', bondsData);

    if (bondsData.success) {
      console.log('✅ Government Bonds API is working!');
      console.log(`📈 Found ${bondsData.data.length} bonds`);
    } else {
      console.log('❌ Government Bonds API error:', bondsData.error);
    }

    // Test dashboard endpoint
    const dashboardResponse = await fetch('http://localhost:4000/api/government-bonds/dashboard/1');
    const dashboardData = await dashboardResponse.json();
    console.log('📊 Dashboard data:', dashboardData);

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Test bond issuance
async function testBondIssuance() {
  try {
    console.log('💰 Testing bond issuance...');
    
    const bondRequest = {
      civilizationId: '1',
      bondType: 'treasury',
      purpose: 'Test bond issuance for infrastructure development',
      faceValue: 1000,
      couponRate: 0.035,
      maturityYears: 10,
      currencyCode: 'USC',
      totalAmount: 1000000,
      callable: false
    };

    const response = await fetch('http://localhost:4000/api/government-bonds/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bondRequest)
    });

    const result = await response.json();
    console.log('💎 Bond issuance result:', result);

    if (result.success) {
      console.log('✅ Bond issuance successful!');
      console.log(`🆔 New bond ID: ${result.data.bondId}`);
    } else {
      console.log('❌ Bond issuance failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Bond issuance test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testBondsAPI();
  console.log('\n' + '='.repeat(50) + '\n');
  await testBondIssuance();
}

runTests();
