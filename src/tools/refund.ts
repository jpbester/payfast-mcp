/**
 * Refund Tools Module
 *
 * Provides MCP tools for managing PayFast refunds:
 * - refund.create: Create a refund for a transaction (HIGH risk - requires confirmation)
 * - refund.query: Query refund info before creating a refund (pre-refund check)
 * - refund.fetch: Fetch refund transaction details and balance
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PayFastClient } from '../services/payfast-client.js';
import { logger } from '../utils/logger.js';
import { errorToJSON } from '../utils/errors.js';
import {
  RefundCreateParamsSchema,
  RefundQueryParamsSchema,
  RefundFetchParamsSchema,
  RefundCreateParams,
  RefundQueryParams,
  RefundFetchParams,
} from '../types/index.js';

/**
 * Registers all refund-related tools with the MCP server
 *
 * @param server - MCP server instance
 * @param client - Configured PayFastClient instance
 */
export function registerRefundTools(server: McpServer, client: PayFastClient): void {
  logger.info('Registering refund tools');

  // ============================================================================
  // refund.create - Create a refund for a transaction
  // ============================================================================

  server.tool(
    'refund.create',
    'Create a refund for a PayFast transaction. This will return money to the customer\'s original payment method.',
    RefundCreateParamsSchema.shape,
    async (params: RefundCreateParams) => {
      try {
        logger.info('Executing refund.create tool', { params });

        // HIGH RISK: Requires confirmation
        if (!params.confirmed) {
          logger.info('Refund creation requires confirmation');

          const amountRands = (params.amount / 100).toFixed(2);
          const response = {
            status: 'confirmation_required',
            action: 'refund.create',
            description: `Refund R${amountRands} (${params.amount} cents) for transaction ${params.pf_payment_id}`,
            reason: params.reason,
            warning: `This will initiate a refund of R${amountRands} to the customer's original payment method. This action may not be reversible.`,
            params: {
              pf_payment_id: params.pf_payment_id,
              amount: params.amount,
              reason: params.reason,
              notify_buyer: params.notify_buyer,
            },
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        }

        // Execute refund creation
        logger.info('Creating refund (confirmed)');
        const result = await client.createRefund(
          params.pf_payment_id,
          params.amount,
          params.reason,
          params.notify_buyer
        );

        const amountRands = (params.amount / 100).toFixed(2);
        const response = {
          success: true,
          message: `Refund of R${amountRands} (${params.amount} cents) created successfully for transaction ${params.pf_payment_id}`,
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
        logger.error('refund.create tool failed', errorToJSON(error));

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
  // refund.query - Query refund info (pre-refund check)
  // ============================================================================

  server.tool(
    'refund.query',
    'Query refund availability for a transaction BEFORE creating a refund. Returns available amounts, refund methods (credit card or bank payout), and required parameters. Use this first to check if a refund is possible.',
    RefundQueryParamsSchema.shape,
    async (params: RefundQueryParams) => {
      try {
        logger.info('Executing refund.query tool', { params });

        const result = await client.queryRefund(params.pf_payment_id);

        const response = {
          success: true,
          message: `Refund query info retrieved for transaction ${params.pf_payment_id}`,
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
        logger.error('refund.query tool failed', errorToJSON(error));

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
  // refund.fetch - Fetch refund transaction details and balance
  // ============================================================================

  server.tool(
    'refund.fetch',
    'Fetch refund transaction history and available balance for a payment that has ALREADY been refunded. Returns 404 if no refund exists yet — use refund.query first to check availability.',
    RefundFetchParamsSchema.shape,
    async (params: RefundFetchParams) => {
      try {
        logger.info('Executing refund.fetch tool', { params });

        const result = await client.getRefundDetails(params.pf_payment_id);

        const response = {
          success: true,
          message: `Refund details retrieved for transaction ${params.pf_payment_id}`,
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
        logger.error('refund.fetch tool failed', errorToJSON(error));

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

  logger.info('Registered 3 refund tool(s): refund.create, refund.query, refund.fetch');
}
