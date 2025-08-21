const { chromium } = require('playwright');

async function testEnhancedCommunicationAPI() {
  console.log('🧪 Testing Enhanced Communication API...');
  
  try {
    // Test 1: Check if enhanced conversations endpoint exists
    console.log('\n📡 Testing initialize-enhanced endpoint...');
    const response = await fetch('http://localhost:4003/api/communication/initialize-enhanced', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Initialize-enhanced endpoint works:', data.message);
      console.log(`📊 Conversations added: ${data.conversationsAdded}`);
    } else {
      const errorData = await response.json();
      console.log('❌ Initialize-enhanced endpoint failed:', errorData.message);
      console.log('Available routes:', errorData.availableRoutes);
    }
    
    // Test 2: Check conversations data
    console.log('\n📡 Testing conversations endpoint...');
    const conversationsResponse = await fetch('http://localhost:4003/api/communication/conversations/player_1');
    
    if (conversationsResponse.ok) {
      const conversationsData = await conversationsResponse.json();
      console.log(`📊 Found ${conversationsData.conversations.length} conversations`);
      
      // Check for enhanced data
      const enhancedConversations = conversationsData.conversations.filter(conv => 
        conv.description && (conv.name.includes('Cabinet') || conv.name.includes('Council') || conv.name.includes('Federation'))
      );
      
      if (enhancedConversations.length > 0) {
        console.log('✅ Enhanced conversations found:');
        enhancedConversations.forEach(conv => {
          console.log(`  - ${conv.name}: ${conv.description}`);
        });
      } else {
        console.log('❌ No enhanced conversations found');
        console.log('Sample conversation:', conversationsData.conversations[0]);
      }
    } else {
      console.log('❌ Failed to fetch conversations');
    }
    
    // Test 3: Test diplomatic relationships endpoint
    console.log('\n📡 Testing diplomatic relationships endpoint...');
    const diplomaticResponse = await fetch('http://localhost:4003/api/communication/diplomatic-relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        relationshipType: 'trade_federation',
        participants: ['player_1', 'player_2', 'player_3'],
        creatorId: 'player_1',
        relationshipName: 'Test Trade Alliance'
      })
    });
    
    if (diplomaticResponse.ok) {
      const diplomaticData = await diplomaticResponse.json();
      console.log('✅ Diplomatic relationships endpoint works:', diplomaticData.message);
      console.log(`📊 Created channel: ${diplomaticData.diplomaticChannel.name}`);
    } else {
      const errorData = await diplomaticResponse.json();
      console.log('❌ Diplomatic relationships endpoint failed:', errorData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEnhancedCommunicationAPI();
