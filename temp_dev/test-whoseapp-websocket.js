/**
 * Test script for WhoseApp WebSocket functionality
 */

import WebSocket from 'ws';

console.log('🧪 Testing WhoseApp WebSocket Connection...');

// Test connection to WhoseApp WebSocket
const wsUrl = 'ws://localhost:4000/ws/whoseapp';
console.log(`📡 Connecting to: ${wsUrl}`);

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('✅ WhoseApp WebSocket connected successfully!');
  
  // Send subscription message
  const subscribeMessage = {
    type: 'subscribe',
    payload: {
      civilizationId: 'test-civ-1',
      subscriptions: ['activities', 'conversations', 'character_updates']
    },
    timestamp: new Date()
  };
  
  console.log('📤 Sending subscription message:', JSON.stringify(subscribeMessage, null, 2));
  ws.send(JSON.stringify(subscribeMessage));
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log('📨 Received message:', JSON.stringify(message, null, 2));
  } catch (error) {
    console.log('📨 Received raw message:', data.toString());
  }
});

ws.on('close', () => {
  console.log('🔌 WhoseApp WebSocket connection closed');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('❌ WhoseApp WebSocket error:', error.message);
  process.exit(1);
});

// Keep connection alive for testing
setTimeout(() => {
  console.log('⏰ Test completed, closing connection...');
  ws.close();
}, 10000);

console.log('⏳ Waiting for WebSocket events (10 seconds)...');
