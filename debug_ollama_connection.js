// Debug script to test Ollama connection from Node.js
console.log('🔍 Testing Ollama connection...');

const testUrls = [
  'http://localhost:11434/api/chat',
  'http://127.0.0.1:11434/api/chat',
  'http://docker-ollama-1:11434/api/chat',
  'http://ollama:11434/api/chat'
];

const testPayload = {
  model: "llama3.2:1b",
  stream: false,
  messages: [{"role": "user", "content": "Hello"}],
  options: {
    temperature: 0.7,
    num_ctx: 100
  }
};

async function testConnection(url) {
  console.log(`\n🌐 Testing: ${url}`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ SUCCESS: ${url}`);
      console.log(`📝 Response: ${data.message?.content?.substring(0, 100)}...`);
      return true;
    } else {
      console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
    console.log(`🔍 Error code: ${error.code}`);
    console.log(`🔍 Error cause: ${error.cause?.message || 'N/A'}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting connection tests...\n');
  
  for (const url of testUrls) {
    const success = await testConnection(url);
    if (success) {
      console.log(`\n🎉 Found working URL: ${url}`);
      break;
    }
  }
  
  console.log('\n✅ Connection test complete');
}

main().catch(console.error);
