/**
 * PayFast API Client Service
 *
 * Provides a typed, authenticated HTTP client for interacting with the PayFast API.
 * Handles signature generation, request formatting, error handling, and retry logic.
 *
 * Features:
 * - Automatic signature generation for all requests
 * - Retry logic with exponential backoff for transient errors
 * - Comprehensive error handling with custom error types
 * - Sanitized debug logging
 * - Support for all PayFast API endpoints (transactions, subscriptions, refunds)
 */

import { PayFastConfig } from '../config/index.js';
import { generateSignature } from '../utils/signature.js';
import { logger, sanitize } from '../utils/logger.js';
import { PayFastAPIError, PayFastAuthError } from '../utils/errors.js';

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * PayFast API Client
 *
 * Provides authenticated access to PayFast API endpoints with automatic
 * signature generation, error handling, and retry logic.
 */
export class PayFastClient {
  private readonly config: PayFastConfig;
  private readonly merchantId: string;
  private readonly merchantKey: string;
  private readonly passphrase: string;

  constructor(config: PayFastConfig) {
    this.config = config;
    this.merchantId = config.merchantId;
    this.merchantKey = config.merchantKey;
    this.passphrase = config.passphrase;

    logger.info('PayFastClient initialized', {
      environment: config.environment,
      baseUrl: config.baseUrl,
      apiVersion: config.apiVersion,
    });
  }

  /**
   * Generates PayFast API authentication headers
   *
   * Creates the required headers for PayFast API requests:
   * - merchant-id: PayFast merchant identifier
   * - version: API version (v1)
   * - timestamp: ISO 8601 timestamp
   * - signature: MD5 signature of params + passphrase
   *
   * @param params - Request parameters to include in signature
   * @returns Object containing authentication headers
   */
  generateHeaders(params: Record<string, string>): Record<string, string> {
    // PayFast requires timestamp without milliseconds or trailing Z
    const timestamp = new Date().toISOString().split('.')[0];

    const headers: Record<string, string> = {
      'merchant-id': this.merchantId,
      version: this.config.apiVersion,
      timestamp,
    };

    // Signature is computed from: request data + headers + passphrase (all sorted alphabetically)
    // Note: merchant_key is NOT included — only merchant-id via headers
    const signatureParams = {
      ...params,
      ...headers,
      passphrase: this.passphrase,
    };

    // Pass passphrase in params (sorted alphabetically), not as a separate arg
    const signature = generateSignature(signatureParams);
    headers.signature = signature;

    logger.debug('Generated headers', sanitize(headers));

    return headers;
  }

  /**
   * Makes an authenticated HTTP request to the PayFast API
   *
   * Features:
   * - Automatic signature generation and header injection
   * - Retry logic with exponential backoff (3 attempts for 5xx and network errors)
   * - Structured error handling with custom error types
   * - Debug logging of requests and responses
   *
   * @param method - HTTP method (GET, POST, PUT, PATCH)
   * @param endpoint - API endpoint path (e.g., '/transactions/history')
   * @param params - Optional request parameters
   * @returns Parsed JSON response
   * @throws {PayFastAPIError} API returned an error response
   * @throws {PayFastAuthError} Authentication failed
   */
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH',
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    const requestParams = params || {};
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeRequest<T>(method, endpoint, requestParams);
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const shouldRetry = this.shouldRetryError(error);

        if (!shouldRetry || isLastAttempt) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt - 1);
        logger.warn(
          `Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms`,
          { endpoint, error: error instanceof Error ? error.message : error }
        );

        await sleep(delay);
      }
    }

    // This should never be reached due to throw in loop
    throw new Error('Unexpected retry loop exit');
  }

  /**
   * Executes a single HTTP request (called by request method)
   */
  private async executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH',
    endpoint: string,
    params: Record<string, string>
  ): Promise<T> {
    // Construct full URL
    const url = `${this.config.baseUrl}${endpoint}`;

    // Generate authentication headers
    const headers = this.generateHeaders(params);

    // Prepare request options
    let requestUrl = url;
    let body: string | undefined;

    // Sandbox mode uses ?testing=true query parameter on all requests
    const isSandbox = this.config.environment === 'sandbox';

    if (method === 'GET') {
      // For GET requests, append params as query string
      const queryParams = new URLSearchParams(params);
      if (isSandbox) {
        queryParams.set('testing', 'true');
      }
      const queryString = queryParams.toString();
      if (queryString) {
        requestUrl = `${url}?${queryString}`;
      }
    } else {
      // For POST/PUT/PATCH, send params as form-encoded body
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      body = new URLSearchParams(params).toString();
      // Append ?testing=true as query param (not in the body)
      if (isSandbox) {
        requestUrl = `${url}?testing=true`;
      }
    }

    logger.debug(`${method} ${requestUrl}`, sanitize({ params }));

    // Execute request
    const response = await fetch(requestUrl, {
      method,
      headers,
      body,
    });

    // Read response body
    const contentType = response.headers.get('content-type');
    let responseBody: any;

    try {
      if (contentType?.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }
    } catch (error) {
      logger.warn('Failed to parse response body', { error });
      responseBody = null;
    }

    logger.debug(`Response ${response.status}`, sanitize(responseBody));

    // Handle error responses
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new PayFastAuthError(
          'PayFast API authentication failed',
          response.status === 401 ? 'Unauthorized' : 'Forbidden',
          typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)
        );
      }

      throw new PayFastAPIError(
        `PayFast API error: ${response.statusText}`,
        response.status,
        responseBody,
        endpoint
      );
    }

    return responseBody as T;
  }

  /**
   * Determines if an error should trigger a retry
   * Only retries on 5xx server errors and network errors
   */
  private shouldRetryError(error: unknown): boolean {
    if (error instanceof PayFastAPIError) {
      // Retry on 5xx server errors only
      return error.statusCode >= 500 && error.statusCode < 600;
    }

    if (error instanceof Error) {
      // Retry on network errors
      const networkErrorMessages = [
        'ECONNREFUSED',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ECONNRESET',
        'fetch failed',
      ];

      return networkErrorMessages.some((msg) =>
        error.message.toLowerCase().includes(msg.toLowerCase())
      );
    }

    return false;
  }

  /**
   * Test connectivity and credentials
   *
   * Makes a simple request to verify that the API is accessible
   * and credentials are valid.
   *
   * @returns True if connection successful
   * @throws {PayFastAPIError} If connection fails
   * @throws {PayFastAuthError} If authentication fails
   */
  async ping(): Promise<boolean> {
    logger.info('Testing PayFast API connectivity');

    try {
      // PayFast ping endpoint
      await this.request('GET', '/ping');
      logger.info('PayFast API connectivity test successful');
      return true;
    } catch (error) {
      logger.error('PayFast API connectivity test failed', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   *
   * Retrieves a list of transactions within the specified date range.
   *
   * @param params - Query parameters
   * @param params.from - Start date (YYYY-MM-DD format)
   * @param params.to - End date (YYYY-MM-DD format)
   * @param params.offset - Pagination offset
   * @param params.limit - Number of results to return
   * @returns Transaction history response
   */
  async getTransactionHistory(params: {
    from?: string;
    to?: string;
    offset?: number;
    limit?: number;
  }): Promise<any> {
    logger.info('Fetching transaction history', sanitize(params));

    const queryParams: Record<string, string> = {};

    if (params.from) queryParams.from = params.from;
    if (params.to) queryParams.to = params.to;
    if (params.offset !== undefined) queryParams.offset = params.offset.toString();
    if (params.limit !== undefined) queryParams.limit = params.limit.toString();

    return this.request('GET', '/transactions/history', queryParams);
  }

  /**
   * Get transaction details
   *
   * Retrieves details for a specific transaction by payment ID.
   *
   * @param pfPaymentId - PayFast payment ID
   * @returns Transaction details
   */
  async getTransaction(pfPaymentId: string): Promise<any> {
    logger.info('Fetching transaction', { pfPaymentId });

    return this.request('GET', `/process/query/${pfPaymentId}`);
  }

  /**
   * Charge a tokenized card
   *
   * Processes a payment using a previously tokenized card via the adhoc endpoint.
   * Uses POST /subscriptions/:token/adhoc as per PayFast API docs.
   *
   * @param params - Transaction parameters
   * @param params.token - Card/subscription token
   * @param params.amount - Transaction amount in cents (ZAR)
   * @param params.item_name - Item name/description
   * @param params.item_description - Optional detailed description
   * @returns Transaction response
   */
  async chargeTokenizedCard(params: {
    token: string;
    amount: number;
    item_name: string;
    item_description?: string;
  }): Promise<any> {
    logger.info('Charging tokenized card', sanitize(params));

    const requestParams: Record<string, string> = {
      amount: Math.round(params.amount).toString(),
      item_name: params.item_name,
    };

    if (params.item_description) {
      requestParams.item_description = params.item_description;
    }

    return this.request('POST', `/subscriptions/${params.token}/adhoc`, requestParams);
  }

  /**
   * Get subscription details
   *
   * Retrieves details for a specific subscription by token.
   *
   * @param token - Subscription token
   * @returns Subscription details
   */
  async getSubscription(token: string): Promise<any> {
    logger.info('Fetching subscription', { token });

    return this.request('GET', `/subscriptions/${token}/fetch`);
  }

  /**
   * Pause a subscription
   *
   * Pauses a subscription for a specified number of billing cycles.
   *
   * @param token - Subscription token
   * @param cycles - Number of cycles to pause
   * @returns Pause response
   */
  async pauseSubscription(token: string, cycles: number): Promise<any> {
    logger.info('Pausing subscription', { token, cycles });

    return this.request('PUT', `/subscriptions/${token}/pause`, {
      cycles: cycles.toString(),
    });
  }

  /**
   * Unpause a subscription
   *
   * Resumes a previously paused subscription.
   *
   * @param token - Subscription token
   * @returns Unpause response
   */
  async unpauseSubscription(token: string): Promise<any> {
    logger.info('Unpausing subscription', { token });

    return this.request('PUT', `/subscriptions/${token}/unpause`);
  }

  /**
   * Cancel a subscription
   *
   * Permanently cancels a subscription.
   *
   * @param token - Subscription token
   * @returns Cancellation response
   */
  async cancelSubscription(token: string): Promise<any> {
    logger.info('Canceling subscription', { token });

    return this.request('PUT', `/subscriptions/${token}/cancel`);
  }

  /**
   * Update a subscription
   *
   * Updates subscription parameters such as amount, cycles, frequency, or run date.
   *
   * @param token - Subscription token
   * @param params - Update parameters
   * @param params.amount - New subscription amount
   * @param params.cycles - New number of cycles
   * @param params.frequency - New billing frequency
   * @param params.run_date - New run date (YYYY-MM-DD)
   * @returns Update response
   */
  async updateSubscription(
    token: string,
    params: {
      amount?: number;
      cycles?: number;
      frequency?: number;
      run_date?: string;
    }
  ): Promise<any> {
    logger.info('Updating subscription', { token, params: sanitize(params) });

    const requestParams: Record<string, string> = {};

    if (params.amount !== undefined) {
      requestParams.amount = Math.round(params.amount).toString();
    }
    if (params.cycles !== undefined) {
      requestParams.cycles = params.cycles.toString();
    }
    if (params.frequency !== undefined) {
      requestParams.frequency = params.frequency.toString();
    }
    if (params.run_date) {
      requestParams.run_date = params.run_date;
    }

    return this.request('PATCH', `/subscriptions/${token}/update`, requestParams);
  }

  /**
   * Charge subscription ad-hoc
   *
   * Processes an ad-hoc payment on an active subscription.
   *
   * @param token - Subscription token
   * @param amount - Amount to charge
   * @param item_name - Item name/description
   * @returns Charge response
   */
  async chargeSubscriptionAdhoc(
    token: string,
    amount: number,
    item_name: string
  ): Promise<any> {
    logger.info('Charging subscription ad-hoc', { token, amount, item_name });

    return this.request('POST', `/subscriptions/${token}/adhoc`, {
      amount: Math.round(amount).toString(),
      item_name,
    });
  }

  /**
   * Create a refund
   *
   * Initiates a refund for a transaction.
   *
   * @param pfPaymentId - PayFast payment ID to refund
   * @param amount - Amount to refund
   * @param reason - Optional refund reason
   * @returns Refund response
   */
  async createRefund(
    pfPaymentId: string,
    amount: number,
    reason: string,
    notifyBuyer: boolean = true
  ): Promise<any> {
    logger.info('Creating refund', { pfPaymentId, amount, reason, notifyBuyer });

    const requestParams: Record<string, string> = {
      amount: Math.round(amount).toString(),
      notify_buyer: notifyBuyer ? '1' : '0',
      reason,
    };

    return this.request('POST', `/refunds/${pfPaymentId}`, requestParams);
  }

  /**
   * Query refund information (pre-refund check)
   *
   * Retrieves all information needed before creating a refund, including
   * available amounts, refund methods, and required parameters.
   * Uses GET /refunds/query/:id
   *
   * @param pfPaymentId - PayFast payment ID to query
   * @returns Refund query information (amounts, methods, bank details)
   */
  async queryRefund(pfPaymentId: string): Promise<any> {
    logger.info('Querying refund info', { pfPaymentId });

    return this.request('GET', `/refunds/query/${pfPaymentId}`);
  }

  /**
   * Get refund transaction details and balance
   *
   * Retrieves available balance and transaction history for a refund.
   * Uses GET /refunds/:id
   *
   * @param pfPaymentId - PayFast payment ID
   * @returns Refund details (available_balance, transactions)
   */
  async getRefundDetails(pfPaymentId: string): Promise<any> {
    logger.info('Fetching refund details', { pfPaymentId });

    return this.request('GET', `/refunds/${pfPaymentId}`);
  }

  /**
   * Get credit card transaction details
   *
   * Retrieves detailed credit card information for a transaction.
   *
   * @param pfPaymentId - PayFast payment ID
   * @returns Credit card transaction details
   */
  async getCreditCardTransaction(pfPaymentId: string): Promise<any> {
    logger.info('Fetching credit card transaction', { pfPaymentId });

    return this.request('GET', `/process/query/${pfPaymentId}`);
  }
}

/**
 * Factory function to create a PayFastClient instance
 *
 * @param config - PayFast configuration
 * @returns Configured PayFastClient instance
 *
 * @example
 * ```typescript
 * import { loadConfig } from './config/index.js';
 * import { createPayFastClient } from './services/payfast-client.js';
 *
 * const config = loadConfig();
 * const client = createPayFastClient(config);
 *
 * // Test connectivity
 * await client.ping();
 *
 * // Get transactions
 * const history = await client.getTransactionHistory({
 *   from: '2024-01-01',
 *   to: '2024-01-31'
 * });
 * ```
 */
export function createPayFastClient(config: PayFastConfig): PayFastClient {
  return new PayFastClient(config);
}
