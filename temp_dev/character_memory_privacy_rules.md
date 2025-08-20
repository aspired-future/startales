# Character Memory Privacy Rules & Conversation Types

## 🎯 **Character Memory Scope: What Characters Should Remember**

### ✅ **Store in Character Personal Vector Memory:**

#### 1. **Character ↔ Player Conversations**
- **Direct conversations** between NPCs/Characters and Players
- **Quest dialogues**, **advisor consultations**, **character interactions**
- **Player questions** and **character responses**
- **Character-initiated conversations** with players

#### 2. **Character's Own Witter Posts**
- **Posts authored by the character** (their own thoughts and opinions)
- **Engagement metrics** on their posts (likes, shares, comments from others)
- **Context** of why they posted (game events, emotional state)

#### 3. **Character ↔ Character Conversations**
- **NPC-to-NPC dialogues** that the character participated in
- **Character meetings**, **advisor discussions**, **diplomatic exchanges**
- **AI-generated character interactions**

---

### ❌ **DO NOT Store (Privacy Protected):**

#### 1. **Player ↔ Player Communications**
- **Voice conversations** between players (transcripts)
- **Text messages** between players
- **Private player communications** of any kind

#### 2. **Alliance & Party Communications**
- **Alliance chat** between players
- **Party communications** between players
- **Guild/faction** private discussions
- **Strategic planning** between players

#### 3. **Player Private Actions**
- **Player-only decisions** and internal thoughts
- **Private player notes** and personal strategies
- **Player inventory** and private resource management

---

## 🏗️ **Implementation Architecture**

### **Conversation Classification System**

```typescript
enum ConversationType {
  // ✅ Store in Character Memory
  CHARACTER_PLAYER = 'character_player',           // NPC talks to Player
  CHARACTER_CHARACTER = 'character_character',     // NPC talks to NPC
  CHARACTER_WITT_POST = 'character_witt_post',     // Character's own posts
  CHARACTER_SYSTEM = 'character_system',           // Game events affecting character
  
  // ❌ Do NOT Store (Privacy Protected)
  PLAYER_PLAYER_VOICE = 'player_player_voice',     // Player voice chat
  PLAYER_PLAYER_TEXT = 'player_player_text',       // Player text chat
  ALLIANCE_CHAT = 'alliance_chat',                  // Alliance communications
  PARTY_CHAT = 'party_chat',                       // Party communications
  GUILD_CHAT = 'guild_chat',                       // Guild/faction chat
  PLAYER_PRIVATE = 'player_private'                 // Player private actions
}

interface ConversationMetadata {
  type: ConversationType;
  participants: string[];
  characterId?: string;        // Which character should remember this
  isPrivate: boolean;          // Privacy flag
  storeInMemory: boolean;      // Should this be stored in character memory?
}
```

### **Character Memory Service (Updated)**

```typescript
// src/server/memory/CharacterMemoryService.ts
export class CharacterMemoryService {
  
  async shouldStoreConversation(conversationMeta: ConversationMetadata): Promise<boolean> {
    // Privacy rules enforcement
    const privateTypes = [
      ConversationType.PLAYER_PLAYER_VOICE,
      ConversationType.PLAYER_PLAYER_TEXT,
      ConversationType.ALLIANCE_CHAT,
      ConversationType.PARTY_CHAT,
      ConversationType.GUILD_CHAT,
      ConversationType.PLAYER_PRIVATE
    ];
    
    return !privateTypes.includes(conversationMeta.type);
  }
  
  async storeCharacterConversation(
    characterId: string, 
    conversation: ConversationData,
    metadata: ConversationMetadata
  ): Promise<void> {
    
    // Check privacy rules
    if (!await this.shouldStoreConversation(metadata)) {
      console.log(`🔒 Privacy: Not storing ${metadata.type} conversation`);
      return;
    }
    
    // Only store if character was a participant
    if (!metadata.participants.includes(characterId)) {
      return;
    }
    
    const collectionName = `character_memory_${characterId}`;
    
    // Generate embedding
    const embedding = await embeddingService.embedSingle(conversation.content);
    
    const memoryEntry: CharacterMemoryEntry = {
      id: `conv_${conversation.id}`,
      type: 'conversation',
      content: conversation.content,
      embedding,
      timestamp: conversation.timestamp,
      metadata: {
        originalId: conversation.id,
        conversationType: metadata.type,
        participants: metadata.participants,
        context: conversation.context,
        entities: conversation.entities || [],
        playerInvolved: metadata.participants.some(p => p.startsWith('player_')),
        relatedMemories: []
      }
    };
    
    await this.qdrantClient.upsert(collectionName, [memoryEntry]);
    
    console.log(`🧠 Stored conversation in ${characterId}'s memory: ${conversation.id}`);
  }
  
  async storeCharacterWittPost(characterId: string, wittPost: WittPost): Promise<void> {
    // Only store the character's own posts
    if (wittPost.authorId !== characterId) {
      return;
    }
    
    const collectionName = `character_memory_${characterId}`;
    
    const embedding = await embeddingService.embedSingle(wittPost.content);
    
    const memoryEntry: CharacterMemoryEntry = {
      id: `witt_${wittPost.id}`,
      type: 'witt_post',
      content: wittPost.content,
      embedding,
      timestamp: wittPost.createdAt,
      metadata: {
        originalId: wittPost.id,
        context: wittPost.gameContext,
        entities: wittPost.relevantEntities,
        socialMetrics: {
          likes: wittPost.likesCount,
          shares: wittPost.sharesCount,
          comments: wittPost.commentsCount
        },
        relatedMemories: []
      }
    };
    
    await this.qdrantClient.upsert(collectionName, [memoryEntry]);
    
    console.log(`📱 Stored Witt post in ${characterId}'s memory: ${wittPost.id}`);
  }
}
```

### **Conversation Capture Middleware (Updated)**

```typescript
// src/server/memory/conversationMiddleware.ts (Updated)
export class ConversationCapture {
  
  async captureConversation(conversationData: any): Promise<void> {
    // Classify conversation type
    const metadata = this.classifyConversation(conversationData);
    
    // Apply privacy rules
    if (!await characterMemoryService.shouldStoreConversation(metadata)) {
      console.log(`🔒 Privacy: Skipping ${metadata.type} conversation`);
      return;
    }
    
    // Store in relevant character memories
    for (const participantId of metadata.participants) {
      if (this.isCharacter(participantId)) {
        await characterMemoryService.storeCharacterConversation(
          participantId, 
          conversationData, 
          metadata
        );
      }
    }
  }
  
  private classifyConversation(conversationData: any): ConversationMetadata {
    const participants = conversationData.participants || [];
    
    // Determine conversation type based on participants
    const playerCount = participants.filter(p => this.isPlayer(p)).length;
    const characterCount = participants.filter(p => this.isCharacter(p)).length;
    
    let type: ConversationType;
    let isPrivate = false;
    
    if (conversationData.channel === 'alliance' || conversationData.channel === 'party') {
      type = conversationData.channel === 'alliance' ? 
        ConversationType.ALLIANCE_CHAT : ConversationType.PARTY_CHAT;
      isPrivate = true;
    } else if (playerCount >= 2 && characterCount === 0) {
      // Player-to-player communication
      type = conversationData.isVoice ? 
        ConversationType.PLAYER_PLAYER_VOICE : ConversationType.PLAYER_PLAYER_TEXT;
      isPrivate = true;
    } else if (playerCount === 1 && characterCount === 1) {
      // Player talking to character
      type = ConversationType.CHARACTER_PLAYER;
      isPrivate = false;
    } else if (playerCount === 0 && characterCount >= 2) {
      // Character-to-character conversation
      type = ConversationType.CHARACTER_CHARACTER;
      isPrivate = false;
    } else {
      // Default to private for safety
      type = ConversationType.PLAYER_PRIVATE;
      isPrivate = true;
    }
    
    return {
      type,
      participants,
      isPrivate,
      storeInMemory: !isPrivate
    };
  }
  
  private isPlayer(participantId: string): boolean {
    return participantId.startsWith('player_') || participantId.startsWith('user_');
  }
  
  private isCharacter(participantId: string): boolean {
    return participantId.startsWith('npc_') || 
           participantId.startsWith('character_') || 
           participantId.startsWith('advisor_');
  }
}
```

---

## 🔐 **Privacy Implementation Examples**

### **✅ Conversations Characters SHOULD Remember:**

#### Example 1: Player asks NPC Advisor about strategy
```typescript
const conversation = {
  id: 'conv_001',
  participants: ['player_commander_alpha', 'npc_advisor_chen'],
  content: 'Player: What do you think about expanding to the Vega system? Advisor: Based on our resources, I recommend focusing on mining operations first.',
  channel: 'direct',
  timestamp: new Date()
};

// Result: Stored in npc_advisor_chen's memory
// Privacy: OK - Character can remember advising the player
```

#### Example 2: Character posts on Witter
```typescript
const wittPost = {
  id: 'witt_001',
  authorId: 'npc_scientist_zara',
  content: 'Fascinating quantum anomaly detected in the Proxima system! This could revolutionize our understanding of space-time.',
  timestamp: new Date()
};

// Result: Stored in npc_scientist_zara's memory
// Privacy: OK - Character remembers their own posts
```

### **❌ Conversations Characters Should NOT Remember:**

#### Example 1: Player-to-player alliance chat
```typescript
const allianceChat = {
  id: 'conv_002',
  participants: ['player_commander_alpha', 'player_admiral_beta'],
  content: 'Alpha: Let\'s coordinate our attack on the Zephyrian fleet. Beta: Agreed, I\'ll flank from the north.',
  channel: 'alliance',
  timestamp: new Date()
};

// Result: NOT stored anywhere
// Privacy: Protected - Alliance strategy remains private
```

#### Example 2: Player voice conversation
```typescript
const voiceChat = {
  id: 'conv_003',
  participants: ['player_commander_alpha', 'player_captain_gamma'],
  content: '[Voice transcript] Discussion about personal real-world topics',
  isVoice: true,
  timestamp: new Date()
};

// Result: NOT stored anywhere
// Privacy: Protected - Player voice chats remain private
```

---

## 📊 **API Endpoints (Updated)**

### **Character Memory APIs**
```typescript
// GET /api/memory/characters/:id/conversations
// Get character's conversation history (only their participated conversations)

// POST /api/memory/characters/:id/search
// Search character's personal memory (conversations + their own posts)

// GET /api/memory/characters/:id/context?query=quantum+research
// Get character's relevant memory context for generating responses
```

### **Privacy-Aware Conversation APIs**
```typescript
// POST /api/conversations/capture
// Automatically classifies and stores only appropriate conversations

// GET /api/conversations/privacy-status/:id
// Check if a conversation is stored or privacy-protected
```

---

## ✅ **Updated Task 72.5: Character Memory Enhancement**

### **Enhanced Requirements:**
1. **Privacy-Aware Conversation Classification** - Automatically detect conversation types
2. **Character Personal Memory** - Store only character-participated conversations and their own Witter posts
3. **Privacy Protection** - Never store player-to-player communications, alliance/party chats
4. **Enhanced Character Responses** - Characters reference their conversation history with players and their own posts
5. **Memory Isolation** - Each character only remembers their own experiences

### **Implementation Components:**
- **Conversation Classification System** with privacy rules
- **Character-specific Vector Collections** for personal memory
- **Privacy-aware Capture Middleware** 
- **Enhanced Character Context Generation** for authentic responses

This ensures characters have rich personal memories while respecting player privacy completely!

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
