/**
 * Subscription Tools Module
 *
 * Registers PayFast subscription management tools with the MCP server.
 * Provides functionality for fetching, pausing, unpausing, canceling,
 * updating, and processing ad-hoc charges on subscriptions.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PayFastClient } from '../services/payfast-client.js';
import { logger } from '../utils/logger.js';
import { errorToJSON, isPayFastError } from '../utils/errors.js';
import {
  SubscriptionFetchParamsSchema,
  SubscriptionPauseParamsSchema,
  SubscriptionUnpauseParamsSchema,
  SubscriptionCancelParamsSchema,
  SubscriptionUpdateParamsSchema,
  SubscriptionAdhocParamsSchema,
  type SubscriptionFetchParams,
  type SubscriptionPauseParams,
  type SubscriptionUnpauseParams,
  type SubscriptionCancelParams,
  type SubscriptionUpdateParams,
  type SubscriptionAdhocParams,
} from '../types/index.js';

/**
 * Registers all subscription tools with the MCP server
 *
 * @param server - MCP server instance
 * @param client - Configured PayFastClient instance
 */
export function registerSubscriptionTools(server: McpServer, client: PayFastClient): void {
  logger.info('Registering subscription tools');

  // ============================================================================
  // subscription.fetch - Fetch subscription details
  // ============================================================================

  server.tool(
    'subscription.fetch',
    'Fetch details of a PayFast subscription by its token',
    SubscriptionFetchParamsSchema.shape,
    async (params) => {
      try {
        const validated = SubscriptionFetchParamsSchema.parse(params);
        logger.info('Executing subscription.fetch tool', { token: validated.token });

        const result = await client.getSubscription(validated.token);

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
        logger.error('subscription.fetch tool failed', errorToJSON(error));

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
  // subscription.pause - Pause a subscription
  // ============================================================================

  server.tool(
    'subscription.pause',
    'Pause a PayFast subscription for a specified number of billing cycles. This stops charges temporarily.',
    SubscriptionPauseParamsSchema.shape,
    async (params) => {
      try {
        const validated = SubscriptionPauseParamsSchema.parse(params);
        logger.info('Executing subscription.pause tool', {
          token: validated.token,
          cycles: validated.cycles,
          confirmed: validated.confirmed,
        });

        // Check if confirmation is required
        if (!validated.confirmed) {
          const response = {
            success: false,
            confirmation: {
              action: 'subscription.pause',
              description: `Pause subscription ${validated.token} for ${validated.cycles} billing cycle(s)`,
              params: {
                token: validated.token,
                cycles: validated.cycles,
              },
              warning: `This will pause the subscription for ${validated.cycles} billing cycle(s). No charges will occur during this period.`,
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

        // Execute the pause operation
        const result = await client.pauseSubscription(validated.token, validated.cycles);

        const response = {
          success: true,
          message: `Subscription paused for ${validated.cycles} billing cycle(s)`,
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
        logger.error('subscription.pause tool failed', errorToJSON(error));

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
  // subscription.unpause - Resume a paused subscription
  // ============================================================================

  server.tool(
    'subscription.unpause',
    'Resume a previously paused PayFast subscription. Billing will resume on the next cycle.',
    SubscriptionUnpauseParamsSchema.shape,
    async (params) => {
      try {
        const validated = SubscriptionUnpauseParamsSchema.parse(params);
        logger.info('Executing subscription.unpause tool', {
          token: validated.token,
          confirmed: validated.confirmed,
        });

        // Check if confirmation is required
        if (!validated.confirmed) {
          const response = {
            success: false,
            confirmation: {
              action: 'subscription.unpause',
              description: `Resume paused subscription ${validated.token}`,
              params: {
                token: validated.token,
              },
              warning:
                'This will resume the subscription. Billing will resume on the next billing cycle.',
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

        // Execute the unpause operation
        const result = await client.unpauseSubscription(validated.token);

        const response = {
          success: true,
          message: 'Subscription resumed successfully',
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
        logger.error('subscription.unpause tool failed', errorToJSON(error));

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
  // subscription.cancel - Permanently cancel a subscription
  // ============================================================================

  server.tool(
    'subscription.cancel',
    'Permanently cancel a PayFast subscription. This cannot be undone.',
    SubscriptionCancelParamsSchema.shape,
    async (params) => {
      try {
        const validated = SubscriptionCancelParamsSchema.parse(params);
        logger.info('Executing subscription.cancel tool', {
          token: validated.token,
          confirmed: validated.confirmed,
        });

        // Check if confirmation is required
        if (!validated.confirmed) {
          const response = {
            success: false,
            confirmation: {
              action: 'subscription.cancel',
              description: `Permanently cancel subscription ${validated.token}`,
              params: {
                token: validated.token,
              },
              warning:
                'This will PERMANENTLY cancel the subscription. This action cannot be undone. All future charges will stop.',
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

        // Execute the cancel operation
        const result = await client.cancelSubscription(validated.token);

        const response = {
          success: true,
          message: 'Subscription cancelled successfully',
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
        logger.error('subscription.cancel tool failed', errorToJSON(error));

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
  // subscription.update - Update subscription parameters
  // ============================================================================

  server.tool(
    'subscription.update',
    "Update a PayFast subscription's parameters (amount, cycles, frequency, or run date)",
    SubscriptionUpdateParamsSchema.shape,
    async (params) => {
      try {
        const validated = SubscriptionUpdateParamsSchema.parse(params);
        logger.info('Executing subscription.update tool', {
          token: validated.token,
          confirmed: validated.confirmed,
        });

        // Check if confirmation is required
        if (!validated.confirmed) {
          const changes: string[] = [];
          if (validated.amount !== undefined) changes.push(`amount to R${(validated.amount / 100).toFixed(2)} (${validated.amount} cents)`);
          if (validated.cycles !== undefined) changes.push(`cycles to ${validated.cycles}`);
          if (validated.frequency !== undefined)
            changes.push(`frequency to ${validated.frequency}`);
          if (validated.run_date) changes.push(`run date to ${validated.run_date}`);

          const changesDescription = changes.length > 0 ? changes.join(', ') : 'no changes';

          const response = {
            success: false,
            confirmation: {
              action: 'subscription.update',
              description: `Update subscription ${validated.token}`,
              params: {
                token: validated.token,
                amount: validated.amount,
                cycles: validated.cycles,
                frequency: validated.frequency,
                run_date: validated.run_date,
              },
              warning: `This will update the subscription with the following changes: ${changesDescription}.`,
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

        // Execute the update operation
        const updateParams: {
          amount?: number;
          cycles?: number;
          frequency?: number;
          run_date?: string;
        } = {};

        if (validated.amount !== undefined) updateParams.amount = validated.amount;
        if (validated.cycles !== undefined) updateParams.cycles = validated.cycles;
        if (validated.frequency !== undefined) updateParams.frequency = validated.frequency;
        if (validated.run_date) updateParams.run_date = validated.run_date;

        const result = await client.updateSubscription(validated.token, updateParams);

        const response = {
          success: true,
          message: 'Subscription updated successfully',
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
        logger.error('subscription.update tool failed', errorToJSON(error));

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
  // subscription.adhoc - Process an ad-hoc charge
  // ============================================================================

  server.tool(
    'subscription.adhoc',
    'Process an ad-hoc (one-time) charge on an existing PayFast subscription',
    SubscriptionAdhocParamsSchema.shape,
    async (params) => {
      try {
        const validated = SubscriptionAdhocParamsSchema.parse(params);
        logger.info('Executing subscription.adhoc tool', {
          token: validated.token,
          amount: validated.amount,
          item_name: validated.item_name,
          confirmed: validated.confirmed,
        });

        // Check if confirmation is required
        if (!validated.confirmed) {
          const response = {
            success: false,
            confirmation: {
              action: 'subscription.adhoc',
              description: `Process ad-hoc charge on subscription ${validated.token}`,
              params: {
                token: validated.token,
                amount: validated.amount,
                item_name: validated.item_name,
              },
              warning: `This will charge R${(validated.amount / 100).toFixed(2)} (${validated.amount} cents) to the subscription for '${validated.item_name}'.`,
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

        // Execute the ad-hoc charge
        const result = await client.chargeSubscriptionAdhoc(
          validated.token,
          validated.amount,
          validated.item_name
        );

        const response = {
          success: true,
          message: `Ad-hoc charge of R${(validated.amount / 100).toFixed(2)} (${validated.amount} cents) processed successfully`,
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
        logger.error('subscription.adhoc tool failed', errorToJSON(error));

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

  logger.info(
    'Registered 6 subscription tools: fetch, pause, unpause, cancel, update, adhoc'
  );
}
