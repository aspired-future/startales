// Test if Node.js http module works in tsx environment
import http from 'http';

console.log('🧪 Testing Node.js http module in tsx environment...');

const postData = JSON.stringify({
  model: 'llama3.2:1b',
  stream: false,
  messages: [{ role: 'user', content: 'Hello from tsx test' }],
  options: { temperature: 0.7, num_ctx: 50 }
});

const options = {
  hostname: 'localhost',
  port: 11434,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`✅ Response status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ Success! Response:', jsonData.message?.content?.substring(0, 100) + '...');
    } catch (error) {
      console.log('❌ JSON parse error:', error.message);
      console.log('Raw data:', data.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
  console.log('Error code:', error.code);
});

req.write(postData);
req.end();

console.log('📤 Request sent to Ollama...');
