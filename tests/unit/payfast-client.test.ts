import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PayFastClient } from '../../src/services/payfast-client.js';
import { PayFastConfig } from '../../src/config/index.js';
import { PayFastAPIError, PayFastAuthError } from '../../src/utils/errors.js';

describe('PayFastClient', () => {
  let client: PayFastClient;
  let mockConfig: PayFastConfig;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Set up mock config
    mockConfig = {
      merchantId: '10000100',
      merchantKey: '46f0cd694581a',
      passphrase: 'test_passphrase',
      environment: 'sandbox',
      baseUrl: 'https://api.payfast.co.za',
      apiVersion: 'v1',
    };

    // Create client instance
    client = new PayFastClient(mockConfig);

    // Store original fetch
    originalFetch = global.fetch;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('generateHeaders', () => {
    it('should produce correct header structure', () => {
      const params = {
        amount: '100.00',
        item_name: 'Test Product',
      };

      const headers = client.generateHeaders(params);

      expect(headers).toHaveProperty('merchant-id');
      expect(headers).toHaveProperty('version');
      expect(headers).toHaveProperty('timestamp');
      expect(headers).toHaveProperty('signature');
    });

    it('should include merchant-id from config', () => {
      const params = { amount: '100.00' };
      const headers = client.generateHeaders(params);

      expect(headers['merchant-id']).toBe('10000100');
    });

    it('should include version from config', () => {
      const params = { amount: '100.00' };
      const headers = client.generateHeaders(params);

      expect(headers.version).toBe('v1');
    });

    it('should include ISO timestamp', () => {
      const params = { amount: '100.00' };
      const headers = client.generateHeaders(params);

      // PayFast requires timestamp without milliseconds or trailing Z
      expect(headers.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    it('should generate MD5 signature', () => {
      const params = { amount: '100.00' };
      const headers = client.generateHeaders(params);

      // Should be a 32-character hex string (MD5)
      expect(headers.signature).toMatch(/^[a-f0-9]{32}$/);
    });

    it('should include params in signature generation', () => {
      const params1 = { amount: '100.00' };
      const params2 = { amount: '200.00' };

      const headers1 = client.generateHeaders(params1);
      const headers2 = client.generateHeaders(params2);

      // Different params should produce different signatures
      expect(headers1.signature).not.toBe(headers2.signature);
    });

    it('should include merchant credentials in signature', () => {
      const params = { amount: '100.00' };
      const headers = client.generateHeaders(params);

      // The signature should be deterministic for same params and credentials
      expect(headers.signature).toBeDefined();
      expect(headers.signature.length).toBe(32);
    });
  });

  describe('request method - URL construction', () => {
    it('should construct correct URL for GET request', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.request('GET', '/test-endpoint', { param1: 'value1' });

      expect(capturedUrl).toContain('https://api.payfast.co.za/test-endpoint');
      expect(capturedUrl).toContain('param1=value1');
    });

    it('should append query string for GET requests', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.request('GET', '/transactions/history', {
        from: '2024-01-01',
        to: '2024-01-31',
      });

      expect(capturedUrl).toContain('?');
      expect(capturedUrl).toContain('from=2024-01-01');
      expect(capturedUrl).toContain('to=2024-01-31');
    });

    it('should construct URL without query string when no params', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.request('GET', '/ping');

      // Sandbox mode appends ?testing=true even with no other params
      expect(capturedUrl).toBe('https://api.payfast.co.za/ping?testing=true');
    });
  });

  describe('request method - POST body', () => {
    it('should send correct body for POST request', async () => {
      let capturedBody: string = '';

      global.fetch = vi.fn((url, options) => {
        capturedBody = options?.body as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.request('POST', '/process', {
        token: 'abc123',
        amount: '100.00',
      });

      expect(capturedBody).toContain('token=abc123');
      expect(capturedBody).toContain('amount=100.00');
    });

    it('should set Content-Type header for POST requests', async () => {
      let capturedHeaders: Record<string, string> = {};

      global.fetch = vi.fn((url, options) => {
        capturedHeaders = options?.headers as Record<string, string>;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.request('POST', '/process', { token: 'abc123' });

      expect(capturedHeaders['Content-Type']).toBe('application/x-www-form-urlencoded');
    });

    it('should send body for PUT requests', async () => {
      let capturedBody: string = '';

      global.fetch = vi.fn((url, options) => {
        capturedBody = options?.body as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.request('PUT', '/subscriptions/token123/pause', { cycles: '2' });

      expect(capturedBody).toContain('cycles=2');
    });

    it('should send body for PATCH requests', async () => {
      let capturedBody: string = '';

      global.fetch = vi.fn((url, options) => {
        capturedBody = options?.body as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.request('PATCH', '/subscriptions/token123/update', { amount: '150.00' });

      expect(capturedBody).toContain('amount=150.00');
    });
  });

  describe('request method - retry logic', () => {
    it('should retry on 5xx server errors', async () => {
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.resolve(
            new Response(JSON.stringify({ error: 'Server Error' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            })
          );
        }
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      const result = await client.request('GET', '/test');

      expect(attemptCount).toBe(3);
      expect(result).toEqual({ success: true });
    });

    it('should retry up to 3 times total', async () => {
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Server Error' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await expect(client.request('GET', '/test')).rejects.toThrow(PayFastAPIError);

      expect(attemptCount).toBe(3);
    });

    it('should not retry on 4xx client errors', async () => {
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Bad Request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await expect(client.request('GET', '/test')).rejects.toThrow(PayFastAPIError);

      expect(attemptCount).toBe(1);
    });

    it('should not retry on 401 errors', async () => {
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await expect(client.request('GET', '/test')).rejects.toThrow(PayFastAuthError);

      expect(attemptCount).toBe(1);
    });

    it('should retry on network failures', async () => {
      let attemptCount = 0;

      global.fetch = vi.fn(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.reject(new Error('fetch failed'));
        }
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      const result = await client.request('GET', '/test');

      expect(attemptCount).toBe(3);
      expect(result).toEqual({ success: true });
    });
  });

  describe('request method - error handling', () => {
    it('should throw PayFastAuthError on 401 response', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await expect(client.request('GET', '/test')).rejects.toThrow(PayFastAuthError);
      await expect(client.request('GET', '/test')).rejects.toThrow('PayFast API authentication failed');
    });

    it('should throw PayFastAuthError on 403 response', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await expect(client.request('GET', '/test')).rejects.toThrow(PayFastAuthError);
    });

    it('should throw PayFastAPIError on 4xx errors', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Bad Request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await expect(client.request('GET', '/test')).rejects.toThrow(PayFastAPIError);
    });

    it('should throw PayFastAPIError on 5xx errors after retries', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await expect(client.request('GET', '/test')).rejects.toThrow(PayFastAPIError);
    });

    it('should include endpoint in PayFastAPIError', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      try {
        await client.request('GET', '/transactions/query');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(PayFastAPIError);
        expect((error as PayFastAPIError).endpoint).toBe('/transactions/query');
      }
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn(() => {
        return Promise.reject(new Error('Network error'));
      });

      await expect(client.request('GET', '/test')).rejects.toThrow('Network error');
    });

    it('should handle non-JSON response bodies', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response('Plain text error', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          })
        );
      });

      try {
        await client.request('GET', '/test');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(PayFastAPIError);
        expect((error as PayFastAPIError).responseBody).toBe('Plain text error');
      }
    });
  });

  describe('API methods', () => {
    it('should call ping endpoint', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ status: 'ok' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.ping();

      expect(capturedUrl).toContain('/ping');
    });

    it('should call getTransactionHistory with correct params', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ transactions: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.getTransactionHistory({
        from: '2024-01-01',
        to: '2024-01-31',
        offset: 0,
        limit: 10,
      });

      expect(capturedUrl).toContain('/transactions/history');
      expect(capturedUrl).toContain('from=2024-01-01');
      expect(capturedUrl).toContain('to=2024-01-31');
      expect(capturedUrl).toContain('offset=0');
      expect(capturedUrl).toContain('limit=10');
    });

    it('should call getTransaction with payment ID', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ transaction: {} }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.getTransaction('1234567');

      expect(capturedUrl).toContain('/process/query/1234567');
    });

    it('should call chargeTokenizedCard with correct endpoint and params', async () => {
      let capturedUrl: string = '';
      let capturedBody: string = '';

      global.fetch = vi.fn((url, options) => {
        capturedUrl = url as string;
        capturedBody = options?.body as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.chargeTokenizedCard({
        token: 'token123',
        amount: 1628,
        item_name: 'Test Product',
        item_description: 'Description',
      });

      // Token should be in the URL path, not body
      expect(capturedUrl).toContain('/subscriptions/token123/adhoc');
      // Amount should be in cents (integer)
      expect(capturedBody).toContain('amount=1628');
      expect(capturedBody).toContain('item_name=Test+Product');
      expect(capturedBody).toContain('item_description=Description');
      // Token should NOT be in the body
      expect(capturedBody).not.toContain('token=token123');
    });

    it('should call createRefund with correct endpoint and params in cents', async () => {
      let capturedUrl: string = '';
      let capturedBody: string = '';

      global.fetch = vi.fn((url, options) => {
        capturedUrl = url as string;
        capturedBody = options?.body as string;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.createRefund('1234567', 5075, 'Customer request');

      expect(capturedUrl).toContain('/refunds/1234567');
      // Amount should be in cents (integer)
      expect(capturedBody).toContain('amount=5075');
      expect(capturedBody).toContain('reason=Customer+request');
      expect(capturedBody).toContain('notify_buyer=1');
    });

    it('should call queryRefund with correct endpoint', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ status: 'REFUNDABLE' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.queryRefund('1234567');

      expect(capturedUrl).toContain('/refunds/query/1234567');
    });

    it('should call getRefundDetails with correct endpoint', async () => {
      let capturedUrl: string = '';

      global.fetch = vi.fn((url) => {
        capturedUrl = url as string;
        return Promise.resolve(
          new Response(JSON.stringify({ available_balance: 6800 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await client.getRefundDetails('1234567');

      expect(capturedUrl).toContain('/refunds/1234567');
      // Should NOT be the query endpoint
      expect(capturedUrl).not.toContain('/refunds/query/');
    });
  });

  describe('response parsing', () => {
    it('should parse JSON responses', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ data: 'test' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      const result = await client.request('GET', '/test');

      expect(result).toEqual({ data: 'test' });
    });

    it('should handle text responses', async () => {
      global.fetch = vi.fn(() => {
        return Promise.resolve(
          new Response('Success', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
          })
        );
      });

      const result = await client.request('GET', '/test');

      expect(result).toBe('Success');
    });
  });
});
