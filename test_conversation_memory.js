import { chromium } from 'playwright';

async function testConversationMemory() {
  console.log('🧠 Testing Conversation Memory System...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test different characters and conversation types
    const testCharacters = [
      {
        id: 'char_diplomat_001',
        name: 'Chief Diplomatic Officer',
        role: 'Chief Diplomatic Officer',
        department: 'Diplomacy',
        title: 'Galactic Ambassador'
      },
      {
        id: 'char_commander_001',
        name: 'Military Strategist',
        role: 'Military Strategist',
        department: 'Defense',
        title: 'Fleet Commander'
      },
      {
        id: 'char_economist_001',
        name: 'Economic Policy Director',
        role: 'Economic Policy Director',
        department: 'Treasury & Economic Affairs',
        title: 'Economic Director'
      }
    ];
    
    console.log('💬 Testing individual conversations...');
    
    // Test 1: Individual conversations
    for (let i = 0; i < testCharacters.length; i++) {
      const character = testCharacters[i];
      console.log(`\n👤 Test ${i + 1}: ${character.name} (Individual Conversation)`);
      
      // Create individual conversation
      const createResult = await page.evaluate(async (char) => {
        try {
          const response = await fetch('http://localhost:4000/api/ai/create-conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              characterId: char.id,
              characterName: char.name,
              characterRole: char.role,
              characterDepartment: char.department,
              conversationType: 'individual',
              title: `Private conversation with ${char.name}`
            })
          });
          
          const data = await response.json();
          return {
            success: true,
            conversationId: data.conversationId
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }, character);
      
      if (createResult.success) {
        console.log(`✅ Created individual conversation: ${createResult.conversationId}`);
        
        // Add a message to the conversation
        const messageResult = await page.evaluate(async ({ char, conversationId }) => {
          try {
            const response = await fetch('http://localhost:4000/api/ai/store-message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId,
                characterId: char.id,
                characterName: char.name,
                characterRole: char.role,
                characterDepartment: char.department,
                senderId: 'user',
                senderName: 'User',
                senderRole: 'user',
                content: `Hello ${char.name}, what's the latest on the galactic situation?`,
                messageType: 'text'
              })
            });
            
            const data = await response.json();
            return {
              success: true,
              messageId: data.messageId
            };
          } catch (error) {
            return {
              success: false,
              error: error.message
            };
          }
        }, { char: character, conversationId: createResult.conversationId });
        
        if (messageResult.success) {
          console.log(`✅ Added message: ${messageResult.messageId}`);
        } else {
          console.log(`❌ Failed to add message: ${messageResult.error}`);
        }
      } else {
        console.log(`❌ Failed to create conversation: ${createResult.error}`);
      }
    }
    
    console.log('\n📢 Testing channel conversations...');
    
    // Test 2: Channel conversation
    const channelResult = await page.evaluate(async (characters) => {
      try {
        // Create channel conversation
        const createResponse = await fetch('http://localhost:4000/api/ai/create-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: characters[0].id,
            characterName: characters[0].name,
            characterRole: characters[0].role,
            characterDepartment: characters[0].department,
            conversationType: 'channel',
            participants: characters.map(c => c.id),
            title: 'Galactic Council Channel'
          })
        });
        
        const createData = await createResponse.json();
        
        if (!createData.success) {
          throw new Error('Failed to create channel');
        }
        
        // Add messages from different characters
        const messagePromises = characters.map(async (char, index) => {
          const messageResponse = await fetch('http://localhost:4000/api/ai/store-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId: createData.conversationId,
              characterId: char.id,
              characterName: char.name,
              characterRole: char.role,
              characterDepartment: char.department,
              senderId: char.id,
              senderName: char.name,
              senderRole: char.role,
              content: `This is ${char.name} from ${char.department}. I have important updates to share.`,
              messageType: 'text'
            })
          });
          
          const messageData = await messageResponse.json();
          return {
            character: char.name,
            success: messageData.success,
            messageId: messageData.messageId
          };
        });
        
        const messageResults = await Promise.all(messagePromises);
        
        return {
          success: true,
          conversationId: createData.conversationId,
          messages: messageResults
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }, testCharacters);
    
    if (channelResult.success) {
      console.log(`✅ Created channel conversation: ${channelResult.conversationId}`);
      console.log('📢 Channel messages:');
      channelResult.messages.forEach(msg => {
        console.log(`  - ${msg.character}: ${msg.success ? '✅' : '❌'} ${msg.messageId || msg.error}`);
      });
      
      // Test getting channel participants
      const participantsResult = await page.evaluate(async ({ conversationId }) => {
        try {
          const response = await fetch(`http://localhost:4000/api/ai/channels/${conversationId}/participants`);
          const data = await response.json();
          return {
            success: true,
            participants: data.participants
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }, { conversationId: channelResult.conversationId });
      
      if (participantsResult.success) {
        console.log(`👥 Channel participants: ${participantsResult.participants.join(', ')}`);
      } else {
        console.log(`❌ Failed to get participants: ${participantsResult.error}`);
      }
    } else {
      console.log(`❌ Failed to create channel: ${channelResult.error}`);
    }
    
    console.log('\n🧠 Testing conversation context with memories...');
    
    // Test 3: Get conversation context with memories
    const contextResult = await page.evaluate(async ({ character, conversationId }) => {
      try {
        const response = await fetch('http://localhost:4000/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'What do you remember from our previous conversations?',
            character: character,
            context: {
              conversationId: conversationId
            },
            options: { maxTokens: 100 }
          })
        });
        
        const data = await response.json();
        return {
          success: true,
          content: data.content,
          length: data.content?.length || 0
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }, { character: testCharacters[0], conversationId: channelResult.conversationId });
    
    if (contextResult.success) {
      console.log(`✅ Context-aware response: ${contextResult.content}`);
      console.log(`📏 Length: ${contextResult.length} characters`);
    } else {
      console.log(`❌ Failed to get context: ${contextResult.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testConversationMemory();
