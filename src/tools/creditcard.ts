/**
 * Credit Card Query Tool
 *
 * Provides tools for querying credit card transaction details from PayFast.
 * These are read-only operations that retrieve additional payment information.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PayFastClient } from '../services/payfast-client.js';
import { CreditCardFetchParamsSchema } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { errorToJSON } from '../utils/errors.js';

/**
 * Registers credit card query tools with the MCP server
 *
 * Tools:
 * - creditcard.fetch: Query credit card transaction details
 *
 * @param server - MCP server instance
 * @param client - Configured PayFastClient instance
 */
export function registerCreditCardTools(
  server: McpServer,
  client: PayFastClient
): void {
  logger.info('Registering credit card tools');

  // ============================================================================
  // creditcard.fetch - Query credit card transaction details
  // ============================================================================

  server.tool(
    'creditcard.fetch',
    'Query credit card transaction details for a specific PayFast payment',
    CreditCardFetchParamsSchema.shape,
    async (params) => {
      try {
        // Validate parameters
        const validated = CreditCardFetchParamsSchema.parse(params);

        logger.info('Executing creditcard.fetch tool', {
          pf_payment_id: validated.pf_payment_id,
        });

        // Fetch credit card transaction details
        const result = await client.getCreditCardTransaction(
          validated.pf_payment_id
        );

        const response = {
          success: true,
          data: result,
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
        logger.error('creditcard.fetch tool failed', errorToJSON(error));

        const response = {
          success: false,
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
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

  logger.info('Registered 1 credit card tool(s): creditcard.fetch');
}
