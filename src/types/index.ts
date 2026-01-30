import { z } from 'zod';

/**
 * Tool risk levels for Human-in-the-Loop (HITL) confirmation
 * - low: No confirmation needed, safe operations
 * - medium: May need confirmation based on context
 * - high: Always requires confirmation before execution
 */
export type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Common response wrapper for all tools
 */
export interface ToolResponse {
  success: boolean;
  data?: any;
  error?: string;
  confirmation?: ConfirmationRequest;
}

/**
 * Human-in-the-Loop confirmation request
 * Used for high-risk operations that require explicit user approval
 */
export interface ConfirmationRequest {
  action: string;
  description: string;
  params: Record<string, any>;
  warning: string;
}

// ============================================================================
// Transaction Schemas
// ============================================================================

/**
 * Schema for fetching transaction history
 */
export const TransactionHistoryParamsSchema = z.object({
  from: z.string().optional().describe('Start date (YYYY-MM-DD)'),
  to: z.string().optional().describe('End date (YYYY-MM-DD)'),
  offset: z.number().optional().describe('Pagination offset'),
  limit: z.number().optional().describe('Number of results to return'),
});

export type TransactionHistoryParams = z.infer<typeof TransactionHistoryParamsSchema>;

/**
 * Schema for fetching a single transaction
 */
export const TransactionFetchParamsSchema = z.object({
  pf_payment_id: z.string().describe('PayFast payment ID'),
});

export type TransactionFetchParams = z.infer<typeof TransactionFetchParamsSchema>;

/**
 * Schema for charging a tokenized card
 */
export const TransactionChargeParamsSchema = z.object({
  token: z.string().describe('Tokenized card/subscription token'),
  amount: z.number().positive().describe('Amount in cents (ZAR). e.g., 9999 = R99.99'),
  item_name: z.string().describe('Item name for the charge'),
  item_description: z.string().optional().describe('Item description'),
  confirmed: z.boolean().optional().describe('Set to true to confirm this charge'),
});

export type TransactionChargeParams = z.infer<typeof TransactionChargeParamsSchema>;

// ============================================================================
// Subscription Schemas
// ============================================================================

/**
 * Schema for fetching subscription details
 */
export const SubscriptionFetchParamsSchema = z.object({
  token: z.string().describe('Subscription token'),
});

export type SubscriptionFetchParams = z.infer<typeof SubscriptionFetchParamsSchema>;

/**
 * Schema for pausing a subscription
 */
export const SubscriptionPauseParamsSchema = z.object({
  token: z.string().describe('Subscription token'),
  cycles: z.number().int().positive().describe('Number of billing cycles to pause'),
  confirmed: z.boolean().optional().describe('Set to true to confirm this action'),
});

export type SubscriptionPauseParams = z.infer<typeof SubscriptionPauseParamsSchema>;

/**
 * Schema for unpausing a subscription
 */
export const SubscriptionUnpauseParamsSchema = z.object({
  token: z.string().describe('Subscription token'),
  confirmed: z.boolean().optional().describe('Set to true to confirm this action'),
});

export type SubscriptionUnpauseParams = z.infer<typeof SubscriptionUnpauseParamsSchema>;

/**
 * Schema for canceling a subscription
 */
export const SubscriptionCancelParamsSchema = z.object({
  token: z.string().describe('Subscription token'),
  confirmed: z.boolean().optional().describe('Set to true to confirm this cancellation'),
});

export type SubscriptionCancelParams = z.infer<typeof SubscriptionCancelParamsSchema>;

/**
 * Schema for updating subscription parameters
 */
export const SubscriptionUpdateParamsSchema = z.object({
  token: z.string().describe('Subscription token'),
  amount: z.number().positive().optional().describe('New amount in cents (ZAR). e.g., 1000 = R10.00'),
  cycles: z.number().int().optional().describe('New number of cycles'),
  frequency: z.number().int().optional().describe('New billing frequency'),
  run_date: z.string().optional().describe('New run date (YYYY-MM-DD)'),
  confirmed: z.boolean().optional().describe('Set to true to confirm this update'),
});

export type SubscriptionUpdateParams = z.infer<typeof SubscriptionUpdateParamsSchema>;

/**
 * Schema for ad-hoc subscription charges
 */
export const SubscriptionAdhocParamsSchema = z.object({
  token: z.string().describe('Subscription token'),
  amount: z.number().positive().describe('Ad-hoc charge amount in cents (ZAR). e.g., 1628 = R16.28'),
  item_name: z.string().describe('Item name for the charge'),
  confirmed: z.boolean().optional().describe('Set to true to confirm this charge'),
});

export type SubscriptionAdhocParams = z.infer<typeof SubscriptionAdhocParamsSchema>;

// ============================================================================
// Refund Schemas
// ============================================================================

/**
 * Schema for creating a refund
 */
export const RefundCreateParamsSchema = z.object({
  pf_payment_id: z.string().describe('PayFast payment ID to refund'),
  amount: z.number().positive().describe('Refund amount in cents (ZAR). e.g., 1000 = R10.00'),
  reason: z.string().min(3).max(255).describe('Reason for refund (3-255 characters, required)'),
  notify_buyer: z.boolean().default(true).describe('Whether to notify the buyer of the refund via email'),
  confirmed: z.boolean().optional().describe('Set to true to confirm this refund'),
});

export type RefundCreateParams = z.infer<typeof RefundCreateParamsSchema>;

/**
 * Schema for querying refund information (pre-refund check)
 * Uses GET /refunds/query/:id to get info needed before creating a refund
 */
export const RefundQueryParamsSchema = z.object({
  pf_payment_id: z.string().describe('PayFast payment ID to query refund info for'),
});

export type RefundQueryParams = z.infer<typeof RefundQueryParamsSchema>;

/**
 * Schema for fetching refund transaction details and balance
 * Uses GET /refunds/:id to get available balance and transaction history
 */
export const RefundFetchParamsSchema = z.object({
  pf_payment_id: z.string().describe('PayFast payment ID to get refund details for'),
});

export type RefundFetchParams = z.infer<typeof RefundFetchParamsSchema>;

// ============================================================================
// Credit Card Schemas
// ============================================================================

/**
 * Schema for querying credit card transaction details
 */
export const CreditCardFetchParamsSchema = z.object({
  pf_payment_id: z.string().describe('PayFast payment ID'),
});

export type CreditCardFetchParams = z.infer<typeof CreditCardFetchParamsSchema>;
