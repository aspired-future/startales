/**
 * Test Government Bonds Panel - Debug Script
 */

console.log('🧪 Testing Government Bonds Panel...');

async function testBondsPanel() {
  try {
    console.log('📡 Testing server health...');
    const healthResponse = await fetch('http://localhost:4000/api/health');
    const health = await healthResponse.json();
    console.log('✅ Health check:', health);

    console.log('\n📊 Testing Government Bonds endpoints...');

    // Test basic bonds endpoint
    console.log('🔹 Testing GET /api/government-bonds/1');
    try {
      const bondsResponse = await fetch('http://localhost:4000/api/government-bonds/1');
      console.log('Response status:', bondsResponse.status);
      console.log('Response headers:', Object.fromEntries(bondsResponse.headers.entries()));
      
      if (bondsResponse.ok) {
        const bondsData = await bondsResponse.json();
        console.log('✅ Bonds data:', bondsData);
      } else {
        const errorText = await bondsResponse.text();
        console.log('❌ Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Bonds endpoint error:', error.message);
    }

    // Test dashboard endpoint
    console.log('\n🔹 Testing GET /api/government-bonds/dashboard/1');
    try {
      const dashboardResponse = await fetch('http://localhost:4000/api/government-bonds/dashboard/1');
      console.log('Response status:', dashboardResponse.status);
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log('✅ Dashboard data:', dashboardData);
      } else {
        const errorText = await dashboardResponse.text();
        console.log('❌ Dashboard error:', errorText);
      }
    } catch (error) {
      console.error('❌ Dashboard endpoint error:', error.message);
    }

    // Test knobs endpoint
    console.log('\n🔹 Testing GET /api/government-bonds/knobs/1');
    try {
      const knobsResponse = await fetch('http://localhost:4000/api/government-bonds/knobs/1');
      console.log('Response status:', knobsResponse.status);
      
      if (knobsResponse.ok) {
        const knobsData = await knobsResponse.json();
        console.log('✅ Knobs data:', knobsData);
      } else {
        const errorText = await knobsResponse.text();
        console.log('❌ Knobs error:', errorText);
      }
    } catch (error) {
      console.error('❌ Knobs endpoint error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBondsPanel();
