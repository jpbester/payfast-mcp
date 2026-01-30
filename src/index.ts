#!/usr/bin/env node

/**
 * PayFast MCP Server Entry Point
 *
 * This is the main entry point for the PayFast Model Context Protocol (MCP) server.
 * It initializes the server, loads configuration, creates the PayFast API client,
 * registers all tools, and starts the STDIO transport for communication with MCP clients.
 *
 * The server exposes PayFast functionality as MCP tools, allowing AI assistants
 * to interact with the PayFast payment gateway API.
 *
 * Environment Variables Required:
 * - PAYFAST_MERCHANT_ID: Your PayFast merchant ID
 * - PAYFAST_MERCHANT_KEY: Your PayFast merchant key
 * - PAYFAST_PASSPHRASE: Your PayFast passphrase
 * - PAYFAST_ENVIRONMENT: Either "sandbox" or "production" (defaults to "sandbox")
 * - LOG_LEVEL: Optional, one of "debug", "info", "warn", "error" (defaults to "info")
 *
 * Usage:
 *   node dist/index.js
 *   or
 *   npm start
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './config/index.js';
import { createPayFastClient } from './services/payfast-client.js';
import { registerTools } from './tools/index.js';
import { logger } from './utils/logger.js';
import { errorToJSON } from './utils/errors.js';

/**
 * Main server initialization and startup
 */
async function main(): Promise<void> {
  try {
    logger.info('Starting PayFast MCP Server');

    // Step 1: Create MCP Server instance
    const server = new McpServer(
      {
        name: 'payfast-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    logger.info('MCP Server instance created', {
      name: 'payfast-mcp',
      version: '0.1.0',
    });

    // Step 2: Load and validate configuration
    logger.info('Loading PayFast configuration');
    const config = loadConfig();
    logger.info('Configuration loaded successfully', {
      environment: config.environment,
      merchantId: config.merchantId.substring(0, 4) + '****', // Partial mask for logging
    });

    // Step 3: Create PayFast API client
    logger.info('Creating PayFast API client');
    const client = createPayFastClient(config);

    // Step 4: Register all tools
    logger.info('Registering tools');
    registerTools(server, client);

    // Step 5: Create STDIO transport
    logger.info('Creating STDIO transport');
    const transport = new StdioServerTransport();

    // Step 6: Connect server to transport
    logger.info('Connecting server to transport');
    await server.connect(transport);

    // Server is now running
    logger.info('PayFast MCP Server started successfully');
    logger.info('Server is ready to accept requests via STDIO');

    // Log environment info
    logger.debug('Server environment', {
      nodeVersion: process.version,
      platform: process.platform,
      pid: process.pid,
    });
  } catch (error) {
    // Log the error with full context
    logger.error('Failed to start PayFast MCP Server', errorToJSON(error));

    // Exit with error code
    process.exit(1);
  }
}

// ============================================================================
// Global Error Handlers
// ============================================================================

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception', errorToJSON(error));
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled promise rejection', {
    reason: reason instanceof Error ? errorToJSON(reason) : reason,
  });
  process.exit(1);
});

/**
 * Handle SIGINT (Ctrl+C)
 */
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

/**
 * Handle SIGTERM
 */
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

// ============================================================================
// Start the Server
// ============================================================================

main().catch((error) => {
  logger.error('Fatal error in main()', errorToJSON(error));
  process.exit(1);
});
