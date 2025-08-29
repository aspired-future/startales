import { conversationMemoryService } from './src/server/memory/conversationMemoryService.ts';

async function initConversationMemory() {
  console.log('🧠 Initializing Conversation Memory Service...');
  
  try {
    await conversationMemoryService.initialize();
    console.log('✅ Conversation memory service initialized successfully');
    
    // Test creating a conversation
    console.log('\n🧪 Testing conversation creation...');
    const conversationId = await conversationMemoryService.createCharacterConversation(
      'test-char-1',
      'Test Character',
      'Test Role',
      'Test Department',
      'individual',
      [],
      'Test Conversation'
    );
    
    console.log(`✅ Created test conversation: ${conversationId}`);
    
    // Test adding a message
    console.log('\n🧪 Testing message storage...');
    const messageId = await conversationMemoryService.addCharacterMessage({
      conversationId,
      characterId: 'test-char-1',
      senderId: 'user',
      senderName: 'User',
      senderRole: 'user',
      content: 'Hello, this is a test message',
      messageType: 'text'
    });
    
    console.log(`✅ Added test message: ${messageId}`);
    
    console.log('\n🎉 Conversation memory system is working!');
    
  } catch (error) {
    console.error('❌ Failed to initialize conversation memory:', error);
  }
}

initConversationMemory();
