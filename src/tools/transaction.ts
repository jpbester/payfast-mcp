/**
 * Transaction Tools Module
 *
 * Provides MCP tools for PayFast transaction operations:
 * - transaction.fetch: Retrieve details of a specific transaction
 * - transaction.history: Get transaction history with filtering
 * - transaction.charge: Process charges on tokenized cards
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PayFastClient } from '../services/payfast-client.js';
import { logger } from '../utils/logger.js';
import { errorToJSON } from '../utils/errors.js';
import {
  TransactionFetchParamsSchema,
  TransactionHistoryParamsSchema,
  TransactionChargeParamsSchema,
  type TransactionFetchParams,
  type TransactionHistoryParams,
  type TransactionChargeParams,
} from '../types/index.js';

/**
 * Registers transaction-related tools with the MCP server
 *
 * @param server - MCP server instance
 * @param client - Configured PayFastClient instance
 */
export function registerTransactionTools(server: McpServer, client: PayFastClient): void {
  logger.info('Registering transaction tools');

  // ============================================================================
  // transaction.fetch - Fetch details of a specific transaction
  // ============================================================================

  server.tool(
    'transaction.fetch',
    'Fetch details of a specific PayFast transaction by payment ID',
    TransactionFetchParamsSchema.shape,
    async (params) => {
      try {
        logger.info('Executing transaction.fetch tool', { params });

        const validatedParams = TransactionFetchParamsSchema.parse(params) as TransactionFetchParams;
        const transaction = await client.getTransaction(validatedParams.pf_payment_id);

        const response = {
          success: true,
          data: transaction,
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
        logger.error('transaction.fetch tool failed', errorToJSON(error));

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
  // transaction.history - Get transaction history with filtering
  // ============================================================================

  server.tool(
    'transaction.history',
    'Get PayFast transaction history with optional date range and pagination',
    TransactionHistoryParamsSchema.shape,
    async (params) => {
      try {
        logger.info('Executing transaction.history tool', { params });

        const validatedParams = TransactionHistoryParamsSchema.parse(params) as TransactionHistoryParams;
        const history = await client.getTransactionHistory(validatedParams);

        const response = {
          success: true,
          data: history,
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
        logger.error('transaction.history tool failed', errorToJSON(error));

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
  // transaction.charge - Process a charge on a tokenized card
  // ============================================================================

  server.tool(
    'transaction.charge',
    'Process a charge on a tokenized card. This creates a real payment. Requires confirmation.',
    TransactionChargeParamsSchema.shape,
    async (params) => {
      try {
        logger.info('Executing transaction.charge tool', { params });

        const validatedParams = TransactionChargeParamsSchema.parse(params) as TransactionChargeParams;

        // Check if confirmation is required
        if (!validatedParams.confirmed) {
          const amountRands = (validatedParams.amount / 100).toFixed(2);
          const confirmationResponse = {
            status: 'confirmation_required',
            action: 'transaction.charge',
            description: `Charge R${amountRands} (${validatedParams.amount} cents) to tokenized card for "${validatedParams.item_name}"`,
            warning: 'This will process a real payment. Call this tool again with confirmed: true to proceed.',
            params: {
              token: validatedParams.token,
              amount: validatedParams.amount,
              item_name: validatedParams.item_name,
              item_description: validatedParams.item_description,
            },
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(confirmationResponse, null, 2),
              },
            ],
          };
        }

        // Process the charge
        logger.info('Processing confirmed charge', {
          amount: validatedParams.amount,
          item_name: validatedParams.item_name,
        });

        const chargeResult = await client.chargeTokenizedCard({
          token: validatedParams.token,
          amount: validatedParams.amount,
          item_name: validatedParams.item_name,
          item_description: validatedParams.item_description,
        });

        const amountRands = (validatedParams.amount / 100).toFixed(2);
        const response = {
          success: true,
          data: chargeResult,
          message: `Successfully charged R${amountRands} (${validatedParams.amount} cents) for "${validatedParams.item_name}"`,
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
        logger.error('transaction.charge tool failed', errorToJSON(error));

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

  logger.info('Registered 3 transaction tool(s): transaction.fetch, transaction.history, transaction.charge');
}
