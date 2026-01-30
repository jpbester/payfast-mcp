/**
 * Tool Registration Module
 *
 * This module registers all MCP tools with the server instance.
 * Tools are organized by category:
 * - Connectivity: ping
 * - Transactions: history, fetch, charge
 * - Subscriptions: fetch, pause, unpause, cancel, update, adhoc
 * - Refunds: create, fetch
 * - Credit Cards: query
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PayFastClient } from '../services/payfast-client.js';
import { logger } from '../utils/logger.js';
import { errorToJSON } from '../utils/errors.js';
import { registerTransactionTools } from './transaction.js';
import { registerSubscriptionTools } from './subscription.js';
import { registerCreditCardTools } from './creditcard.js';
import { registerRefundTools } from './refund.js';

/**
 * Registers all PayFast tools with the MCP server
 *
 * @param server - MCP server instance
 * @param client - Configured PayFastClient instance
 */
export function registerTools(server: McpServer, client: PayFastClient): void {
  logger.info('Registering PayFast MCP tools');

  // ============================================================================
  // Connectivity Tools
  // ============================================================================

  server.tool(
    'ping',
    'Test connectivity to the PayFast API and verify credentials are valid',
    {},
    async () => {
      try {
        logger.info('Executing ping tool');
        await client.ping();

        const response = {
          success: true,
          message: 'Successfully connected to PayFast API. Credentials are valid.',
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error('Ping tool failed', errorToJSON(error));

        const response = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          details: errorToJSON(error),
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ============================================================================
  // Transaction Tools
  // ============================================================================

  registerTransactionTools(server, client);

  // ============================================================================
  // Subscription Tools
  // ============================================================================

  registerSubscriptionTools(server, client);

  // ============================================================================
  // Credit Card Tools
  // ============================================================================

  registerCreditCardTools(server, client);

  // ============================================================================
  // Refund Tools
  // ============================================================================

  registerRefundTools(server, client);

  logger.info('All PayFast MCP tools registered successfully');
}
