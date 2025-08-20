/**
 * Realtime WebSocket Gateway Entry Point
 * Task 3, Subtask 3.2: Server entry and process bootstrap
 */

import { createServer } from 'http'
import { RealtimeGateway } from './server.js'
import { getConfig } from './config.js'

/**
 * Create and start a standalone realtime gateway server
 */
export async function startRealtimeServer(): Promise<RealtimeGateway> {
  const config = getConfig()
  const httpServer = createServer()
  const gateway = new RealtimeGateway(httpServer, config)
  
  // Handle graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`)
    try {
      await gateway.close()
      process.exit(0)
    } catch (error) {
      console.error('Error during shutdown:', error)
      process.exit(1)
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error)
    shutdown('uncaughtException')
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason)
    shutdown('unhandledRejection')
  })

  await gateway.start()
  return gateway
}

/**
 * Create a gateway instance for integration with existing HTTP server
 */
export function createRealtimeGateway(httpServer?: any, options?: any): RealtimeGateway {
  return new RealtimeGateway(httpServer, options)
}

// Export main classes and utilities
export { RealtimeGateway } from './server.js'
export { RealtimeConfig, getConfig, loadConfig, validateConfig } from './config.js'
export type { ConnectionInfo, RealtimeGatewayOptions } from './server.js'

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startRealtimeServer().catch((error) => {
    console.error('Failed to start realtime server:', error)
    process.exit(1)
  })
}
