import { describe, it, expect } from 'vitest';
import { sanitize } from '../../src/utils/logger.js';

describe('logger utility', () => {
  describe('sanitize', () => {
    it('should redact merchantKey field', () => {
      const obj = {
        merchantKey: 'secret123',
        publicData: 'visible',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.merchantKey).toBe('[REDACTED]');
      expect(sanitized.publicData).toBe('visible');
    });

    it('should redact passphrase field', () => {
      const obj = {
        passphrase: 'supersecret',
        amount: '100.00',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.passphrase).toBe('[REDACTED]');
      expect(sanitized.amount).toBe('100.00');
    });

    it('should redact password field', () => {
      const obj = {
        password: 'mypassword123',
        username: 'john',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.username).toBe('john');
    });

    it('should redact token field', () => {
      const obj = {
        token: 'abc123xyz',
        userId: '12345',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.userId).toBe('12345');
    });

    it('should redact signature field', () => {
      const obj = {
        signature: 'md5hash123',
        timestamp: '2024-01-01T00:00:00Z',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.signature).toBe('[REDACTED]');
      expect(sanitized.timestamp).toBe('2024-01-01T00:00:00Z');
    });

    it('should redact fields with case-insensitive matching', () => {
      const obj = {
        MerchantKey: 'secret1',
        PASSPHRASE: 'secret2',
        Password: 'secret3',
        Token: 'secret4',
        SIGNATURE: 'secret5',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.MerchantKey).toBe('[REDACTED]');
      expect(sanitized.PASSPHRASE).toBe('[REDACTED]');
      expect(sanitized.Password).toBe('[REDACTED]');
      expect(sanitized.Token).toBe('[REDACTED]');
      expect(sanitized.SIGNATURE).toBe('[REDACTED]');
    });

    it('should redact fields containing sensitive keywords', () => {
      const obj = {
        userPassword: 'secret1',
        apiToken: 'secret2',
        merchantKeyValue: 'secret3',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.userPassword).toBe('[REDACTED]');
      expect(sanitized.apiToken).toBe('[REDACTED]');
      expect(sanitized.merchantKeyValue).toBe('[REDACTED]');
    });

    it('should handle nested objects', () => {
      const obj = {
        user: {
          name: 'John',
          password: 'secret123',
        },
        config: {
          merchantKey: 'key123',
          environment: 'sandbox',
        },
      };

      const sanitized = sanitize(obj);

      expect(sanitized.user.name).toBe('John');
      expect(sanitized.user.password).toBe('[REDACTED]');
      expect(sanitized.config.merchantKey).toBe('[REDACTED]');
      expect(sanitized.config.environment).toBe('sandbox');
    });

    it('should handle deeply nested objects', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              passphrase: 'secret',
              data: 'visible',
            },
          },
        },
      };

      const sanitized = sanitize(obj);

      expect(sanitized.level1.level2.level3.passphrase).toBe('[REDACTED]');
      expect(sanitized.level1.level2.level3.data).toBe('visible');
    });

    it('should handle arrays', () => {
      const obj = {
        users: [
          { name: 'John', password: 'secret1' },
          { name: 'Jane', password: 'secret2' },
        ],
      };

      const sanitized = sanitize(obj);

      expect(sanitized.users[0].name).toBe('John');
      expect(sanitized.users[0].password).toBe('[REDACTED]');
      expect(sanitized.users[1].name).toBe('Jane');
      expect(sanitized.users[1].password).toBe('[REDACTED]');
    });

    it('should handle arrays of primitives', () => {
      const obj = {
        values: ['value1', 'value2', 'value3'],
      };

      const sanitized = sanitize(obj);

      expect(sanitized.values).toEqual(['value1', 'value2', 'value3']);
    });

    it('should handle mixed arrays', () => {
      const obj = {
        items: [
          'string',
          123,
          { token: 'secret', data: 'public' },
          null,
        ],
      };

      const sanitized = sanitize(obj);

      expect(sanitized.items[0]).toBe('string');
      expect(sanitized.items[1]).toBe(123);
      expect(sanitized.items[2].token).toBe('[REDACTED]');
      expect(sanitized.items[2].data).toBe('public');
      expect(sanitized.items[3]).toBe(null);
    });

    it('should leave non-sensitive fields unchanged', () => {
      const obj = {
        merchant_id: '10000100',
        amount: '100.00',
        item_name: 'Test Product',
        email: 'test@example.com',
        timestamp: '2024-01-01T00:00:00Z',
      };

      const sanitized = sanitize(obj);

      expect(sanitized).toEqual(obj);
    });

    it('should handle null values', () => {
      const sanitized = sanitize(null);
      expect(sanitized).toBe(null);
    });

    it('should handle undefined values', () => {
      const sanitized = sanitize(undefined);
      expect(sanitized).toBe(undefined);
    });

    it('should handle primitive types', () => {
      expect(sanitize('string')).toBe('string');
      expect(sanitize(123)).toBe(123);
      expect(sanitize(true)).toBe(true);
      expect(sanitize(false)).toBe(false);
    });

    it('should handle empty object', () => {
      const sanitized = sanitize({});
      expect(sanitized).toEqual({});
    });

    it('should handle empty array', () => {
      const sanitized = sanitize([]);
      expect(sanitized).toEqual([]);
    });

    it('should not mutate original object', () => {
      const obj = {
        password: 'secret',
        data: 'public',
      };

      const original = { ...obj };
      const sanitized = sanitize(obj);

      // Original should be unchanged
      expect(obj).toEqual(original);
      expect(obj.password).toBe('secret');

      // Sanitized should be redacted
      expect(sanitized.password).toBe('[REDACTED]');
    });

    it('should handle complex real-world PayFast object', () => {
      const obj = {
        merchant_id: '10000100',
        merchantKey: 'secret_key_123',
        passphrase: 'secret_passphrase',
        amount: '100.00',
        item_name: 'Test Product',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel',
        notify_url: 'https://example.com/notify',
        signature: 'md5_hash_value',
        timestamp: '2024-01-01T00:00:00Z',
      };

      const sanitized = sanitize(obj);

      expect(sanitized.merchant_id).toBe('10000100');
      expect(sanitized.merchantKey).toBe('[REDACTED]');
      expect(sanitized.passphrase).toBe('[REDACTED]');
      expect(sanitized.amount).toBe('100.00');
      expect(sanitized.item_name).toBe('Test Product');
      expect(sanitized.return_url).toBe('https://example.com/return');
      expect(sanitized.signature).toBe('[REDACTED]');
      expect(sanitized.timestamp).toBe('2024-01-01T00:00:00Z');
    });
  });
});
