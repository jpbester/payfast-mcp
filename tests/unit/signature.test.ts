import { describe, it, expect } from 'vitest';
import { generateParamString, generateSignature } from '../../src/utils/signature.js';

describe('signature utility', () => {
  describe('generateParamString', () => {
    it('should generate correct param string with known PayFast test values', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
        item_name: 'Test Product',
      };

      const paramString = generateParamString(params);

      // Parameters should be sorted alphabetically
      expect(paramString).toBe('amount=100.00&item_name=Test+Product&merchant_id=10000100&merchant_key=46f0cd694581a');
    });

    it('should URL-encode values with spaces as + (not %20)', () => {
      const params = {
        item_name: 'Test Product Name',
        item_description: 'A product with spaces',
      };

      const paramString = generateParamString(params);

      // Spaces should be encoded as + not %20
      expect(paramString).toContain('Test+Product+Name');
      expect(paramString).toContain('A+product+with+spaces');
      expect(paramString).not.toContain('%20');
    });

    it('should exclude empty string values', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        optional_field: '',
        amount: '100.00',
      };

      const paramString = generateParamString(params);

      expect(paramString).not.toContain('optional_field');
      expect(paramString).toBe('amount=100.00&merchant_id=10000100&merchant_key=46f0cd694581a');
    });

    it('should exclude null values', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        optional_field: null as any,
        amount: '100.00',
      };

      const paramString = generateParamString(params);

      expect(paramString).not.toContain('optional_field');
      expect(paramString).toBe('amount=100.00&merchant_id=10000100&merchant_key=46f0cd694581a');
    });

    it('should exclude undefined values', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        optional_field: undefined as any,
        amount: '100.00',
      };

      const paramString = generateParamString(params);

      expect(paramString).not.toContain('optional_field');
      expect(paramString).toBe('amount=100.00&merchant_id=10000100&merchant_key=46f0cd694581a');
    });

    it('should append passphrase at the end when provided', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
        item_name: 'Test Product',
      };

      const paramString = generateParamString(params, 'myPassphrase');

      // Passphrase should be at the end, after sorted params
      expect(paramString).toBe(
        'amount=100.00&item_name=Test+Product&merchant_id=10000100&merchant_key=46f0cd694581a&passphrase=myPassphrase'
      );
    });

    it('should not append passphrase when empty string', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
      };

      const paramString = generateParamString(params, '');

      expect(paramString).not.toContain('passphrase');
      expect(paramString).toBe('amount=100.00&merchant_id=10000100&merchant_key=46f0cd694581a');
    });

    it('should handle special characters in values', () => {
      const params = {
        item_name: 'Product & Service',
        description: 'Email: test@example.com',
        url: 'https://example.com/path?query=1',
      };

      const paramString = generateParamString(params);

      // Special characters should be URL-encoded
      expect(paramString).toContain('Product+%26+Service');
      expect(paramString).toContain('test%40example.com');
      expect(paramString).toContain('https%3A%2F%2Fexample.com%2Fpath%3Fquery%3D1');
    });

    it('should sort parameters alphabetically by key', () => {
      const params = {
        z_last: 'value1',
        a_first: 'value2',
        m_middle: 'value3',
      };

      const paramString = generateParamString(params);

      // Should be alphabetically sorted
      expect(paramString).toBe('a_first=value2&m_middle=value3&z_last=value1');
    });

    it('should handle single parameter', () => {
      const params = {
        merchant_id: '10000100',
      };

      const paramString = generateParamString(params);

      expect(paramString).toBe('merchant_id=10000100');
    });

    it('should handle empty object', () => {
      const params = {};

      const paramString = generateParamString(params);

      expect(paramString).toBe('');
    });
  });

  describe('generateSignature', () => {
    it('should generate MD5 hash in lowercase hexadecimal', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
        item_name: 'Test Product',
      };

      const signature = generateSignature(params);

      // Should be a 32-character hex string (MD5)
      expect(signature).toMatch(/^[a-f0-9]{32}$/);
    });

    it('should generate consistent signatures for same input', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
        item_name: 'Test Product',
      };

      const signature1 = generateSignature(params);
      const signature2 = generateSignature(params);

      expect(signature1).toBe(signature2);
    });

    it('should generate different signatures for different inputs', () => {
      const params1 = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
      };

      const params2 = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '200.00',
      };

      const signature1 = generateSignature(params1);
      const signature2 = generateSignature(params2);

      expect(signature1).not.toBe(signature2);
    });

    it('should generate different signatures with and without passphrase', () => {
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
      };

      const signatureWithoutPassphrase = generateSignature(params);
      const signatureWithPassphrase = generateSignature(params, 'myPassphrase');

      expect(signatureWithoutPassphrase).not.toBe(signatureWithPassphrase);
    });

    it('should generate correct signature with known test data', () => {
      // Known test case from PayFast documentation
      const params = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
        item_name: 'Test Product',
      };

      const signature = generateSignature(params, 'jt7NOE43FZPn');

      // Expected MD5 hash of: amount=100.00&item_name=Test+Product&merchant_id=10000100&merchant_key=46f0cd694581a&passphrase=jt7NOE43FZPn
      // This is a known value from PayFast test suite
      expect(signature).toBe('a263c66733a931a805da8f64d681db89');
    });

    it('should handle empty params object', () => {
      const params = {};

      const signature = generateSignature(params);

      // Should still generate a valid MD5 hash (of empty string)
      expect(signature).toMatch(/^[a-f0-9]{32}$/);
      expect(signature).toBe('d41d8cd98f00b204e9800998ecf8427e'); // MD5 of empty string
    });

    it('should exclude empty values from signature calculation', () => {
      const params1 = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        optional: '',
        amount: '100.00',
      };

      const params2 = {
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        amount: '100.00',
      };

      const signature1 = generateSignature(params1);
      const signature2 = generateSignature(params2);

      // Should be identical since empty string is excluded
      expect(signature1).toBe(signature2);
    });
  });
});
