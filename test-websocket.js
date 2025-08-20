// Simple test to check if WebSocket server can start
import { createRealtimeGateway } from './src/server/realtime/index.js'

async function testWebSocketServer() {
  try {
    console.log('🚀 Starting WebSocket server test...')
    
    const gateway = createRealtimeGateway(undefined, {
      port: 3001,
      devAuth: true,
      logLevel: 'info'
    })
    
    await gateway.start()
    console.log('✅ WebSocket server started successfully!')
    
    // Test basic functionality
    console.log('📊 Server stats:')
    console.log('- Connections:', gateway.getConnectionCount())
    console.log('- Channels:', gateway.getChannels().length)
    console.log('- Metrics:', Object.keys(gateway.getMetrics()).length, 'metrics tracked')
    
    // Close after test
    setTimeout(async () => {
      console.log('🛑 Stopping server...')
      await gateway.close()
      console.log('✅ Server stopped successfully!')
      process.exit(0)
    }, 2000)
    
  } catch (error) {
    console.error('❌ WebSocket server test failed:', error.message)
    process.exit(1)
  }
}

testWebSocketServer()
