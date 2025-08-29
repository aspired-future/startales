import fetch from 'node-fetch';

async function testAPI() {
  console.log('🧪 Testing Conversation API...');
  
  try {
    // Test 1: Create conversation
    console.log('\n1. Creating conversation...');
    const createResponse = await fetch('http://localhost:4000/api/ai/create-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId: 'test-char-1',
        characterName: 'Test Character',
        characterRole: 'Test Role',
        characterDepartment: 'Test Dept',
        conversationType: 'individual',
        title: 'Test Conversation'
      })
    });
    
    const createData = await createResponse.json();
    console.log('Create response:', createData);
    
    if (createData.success && createData.conversationId) {
      console.log(`✅ Created conversation: ${createData.conversationId}`);
      
      // Test 2: Store message
      console.log('\n2. Storing message...');
      const messageResponse = await fetch('http://localhost:4000/api/ai/store-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: createData.conversationId,
          characterId: 'test-char-1',
          characterName: 'Test Character',
          characterRole: 'Test Role',
          characterDepartment: 'Test Dept',
          senderId: 'user',
          senderName: 'User',
          senderRole: 'user',
          content: 'Hello, this is a test message',
          messageType: 'text'
        })
      });
      
      const messageData = await messageResponse.json();
      console.log('Message response:', messageData);
      
      if (messageData.success) {
        console.log(`✅ Stored message: ${messageData.messageId}`);
      } else {
        console.log(`❌ Failed to store message: ${messageData.error}`);
      }
    } else {
      console.log(`❌ Failed to create conversation: ${createData.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
