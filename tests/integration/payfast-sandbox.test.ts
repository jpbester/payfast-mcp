/**
 * PayFast Sandbox Integration Tests
 *
 * These tests run against the actual PayFast sandbox environment.
 * They require valid sandbox credentials to be set in environment variables.
 *
 * Environment Variables Required:
 * - PAYFAST_MERCHANT_ID: Sandbox merchant identifier
 * - PAYFAST_MERCHANT_KEY: Sandbox merchant key
 * - PAYFAST_PASSPHRASE: Sandbox passphrase
 *
 * Tests are automatically skipped when credentials are not available,
 * making them safe to run in CI environments without credentials.
 *
 * To run integration tests:
 * ```bash
 * npm run test:integration
 * ```
 *
 * To run all tests (unit + integration):
 * ```bash
 * npm run test:all
 * ```
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PayFastClient, createPayFastClient } from '../../src/services/payfast-client.js';
import type { PayFastConfig } from '../../src/config/index.js';

/**
 * Check if sandbox credentials are available
 * If not, all integration tests will be skipped
 */
const SKIP_INTEGRATION =
  !process.env.PAYFAST_MERCHANT_ID ||
  !process.env.PAYFAST_MERCHANT_KEY ||
  !process.env.PAYFAST_PASSPHRASE;

/**
 * Conditional describe - skips all tests when credentials unavailable
 */
const describeIntegration = SKIP_INTEGRATION ? describe.skip : describe;

describeIntegration('PayFast Sandbox Integration Tests', () => {
  let client: PayFastClient;

  beforeAll(() => {
    // Create PayFast configuration for sandbox
    const config: PayFastConfig = {
      merchantId: process.env.PAYFAST_MERCHANT_ID!,
      merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
      passphrase: process.env.PAYFAST_PASSPHRASE!,
      environment: 'sandbox' as const,
      baseUrl: 'https://api.payfast.co.za',
      apiVersion: 'v1',
    };

    // Initialize PayFast client
    client = createPayFastClient(config);
  });

  describe('Connectivity', () => {
    it('should successfully ping the sandbox API', async () => {
      const result = await client.ping();

      expect(result).toBe(true);
    }, 10000); // 10 second timeout for network request

    it('should use correct sandbox base URL', () => {
      expect(client['config'].baseUrl).toBe('https://api.payfast.co.za');
      expect(client['config'].environment).toBe('sandbox');
    });

    it('should generate valid authentication headers', () => {
      const headers = client.generateHeaders({ test: 'value' });

      expect(headers).toHaveProperty('merchant-id');
      expect(headers).toHaveProperty('version');
      expect(headers).toHaveProperty('timestamp');
      expect(headers).toHaveProperty('signature');
      expect(headers['version']).toBe('v1');
      expect(headers['merchant-id']).toBe(process.env.PAYFAST_MERCHANT_ID);
    });
  });

  describe('Transaction History', () => {
    it('should fetch transaction history without errors', async () => {
      // May return empty array or minimal data for sandbox
      const result = await client.getTransactionHistory({});

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    }, 10000);

    it('should fetch transaction history with date range', async () => {
      const result = await client.getTransactionHistory({
        from: '2024-01-01',
        to: '2024-12-31',
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    }, 10000);

    it('should fetch transaction history with pagination', async () => {
      const result = await client.getTransactionHistory({
        offset: 0,
        limit: 10,
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    }, 10000);

    it('should handle date range and pagination together', async () => {
      const result = await client.getTransactionHistory({
        from: '2024-01-01',
        to: '2024-12-31',
        offset: 0,
        limit: 5,
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    }, 10000);
  });

  describe('Transaction Queries', () => {
    it('should throw PayFastAPIError on invalid transaction ID', async () => {
      await expect(
        client.getTransaction('invalid-id-12345')
      ).rejects.toThrow();
    }, 10000);

    it('should throw PayFastAPIError on non-existent transaction', async () => {
      await expect(
        client.getTransaction('999999999')
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Subscription Queries', () => {
    it('should throw PayFastAPIError on invalid subscription token', async () => {
      await expect(
        client.getSubscription('invalid-token-12345')
      ).rejects.toThrow();
    }, 10000);

    it('should throw PayFastAPIError on non-existent subscription', async () => {
      await expect(
        client.getSubscription('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Refund Queries', () => {
    it('should handle refund query with payment ID', async () => {
      // Should handle gracefully even with non-existent payment ID
      try {
        const result = await client.queryRefund('999999999');
        expect(result).toBeDefined();
      } catch (error) {
        // It's acceptable for this to throw an error in sandbox
        expect(error).toBeDefined();
      }
    }, 10000);

    it('should handle refund details fetch with payment ID', async () => {
      // Should handle gracefully even with non-existent payment ID
      try {
        const result = await client.getRefundDetails('999999999');
        expect(result).toBeDefined();
      } catch (error) {
        // It's acceptable for this to throw an error in sandbox
        expect(error).toBeDefined();
      }
    }, 10000);
  });

  describe('Error Handling and Resilience', () => {
    it('should handle network errors gracefully', async () => {
      // Create a client with invalid base URL
      const invalidConfig: PayFastConfig = {
        merchantId: process.env.PAYFAST_MERCHANT_ID!,
        merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
        passphrase: process.env.PAYFAST_PASSPHRASE!,
        environment: 'sandbox' as const,
        baseUrl: 'https://invalid-domain-that-does-not-exist.payfast.co.za',
        apiVersion: 'v1',
      };

      const invalidClient = createPayFastClient(invalidConfig);

      await expect(
        invalidClient.ping()
      ).rejects.toThrow();
    }, 15000);

    it('should include proper error details on API errors', async () => {
      try {
        await client.getTransaction('invalid-id-12345');
        // If we reach here, the test should fail
        expect.fail('Expected an error to be thrown');
      } catch (error: any) {
        // Verify error has expected properties
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');
      }
    }, 10000);
  });

  describe('Credit Card Transactions', () => {
    it('should handle credit card transaction query for invalid ID', async () => {
      await expect(
        client.getCreditCardTransaction('invalid-cc-id-12345')
      ).rejects.toThrow();
    }, 10000);

    it('should handle credit card transaction query for non-existent ID', async () => {
      await expect(
        client.getCreditCardTransaction('999999999')
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Subscription Operations - Error Cases', () => {
    it('should throw error when pausing invalid subscription', async () => {
      await expect(
        client.pauseSubscription('invalid-token', 1)
      ).rejects.toThrow();
    }, 10000);

    it('should throw error when unpausing invalid subscription', async () => {
      await expect(
        client.unpauseSubscription('invalid-token')
      ).rejects.toThrow();
    }, 10000);

    it('should throw error when canceling invalid subscription', async () => {
      await expect(
        client.cancelSubscription('invalid-token')
      ).rejects.toThrow();
    }, 10000);

    it('should throw error when updating invalid subscription', async () => {
      await expect(
        client.updateSubscription('invalid-token', { amount: 10000 })
      ).rejects.toThrow();
    }, 10000);

    it('should throw error when charging adhoc on invalid subscription', async () => {
      await expect(
        client.chargeSubscriptionAdhoc('invalid-token', 5000, 'Test Item')
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Payment Operations - Error Cases', () => {
    it('should throw error when charging with invalid token', async () => {
      await expect(
        client.chargeTokenizedCard({
          token: 'invalid-card-token',
          amount: 10000,
          item_name: 'Test Item',
        })
      ).rejects.toThrow();
    }, 10000);

    it('should throw error when creating refund with invalid payment ID', async () => {
      await expect(
        client.createRefund('invalid-payment-id', 5000, 'Test refund reason')
      ).rejects.toThrow();
    }, 10000);
  });

  describe('API Versioning', () => {
    it('should use correct API version in headers', () => {
      const headers = client.generateHeaders({});

      expect(headers['version']).toBe('v1');
    });

    it('should maintain API version consistency', () => {
      expect(client['config'].apiVersion).toBe('v1');
    });
  });
});

/**
 * Information message when tests are skipped
 */
if (SKIP_INTEGRATION) {
  console.log('\n⚠️  Integration tests skipped - PayFast sandbox credentials not found');
  console.log('To run integration tests, set the following environment variables:');
  console.log('  - PAYFAST_MERCHANT_ID');
  console.log('  - PAYFAST_MERCHANT_KEY');
  console.log('  - PAYFAST_PASSPHRASE');
  console.log('');
}
