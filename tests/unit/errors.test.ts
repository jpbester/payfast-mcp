import { describe, it, expect } from 'vitest';
import {
  PayFastAPIError,
  PayFastAuthError,
  PayFastValidationError,
  PayFastConfigError,
  isPayFastError,
  getErrorMessage,
  errorToJSON,
} from '../../src/utils/errors.js';

describe('error utilities', () => {
  describe('PayFastAPIError', () => {
    it('should construct with all fields', () => {
      const error = new PayFastAPIError(
        'API request failed',
        500,
        { error: 'Internal Server Error' },
        '/transactions/history'
      );

      expect(error.name).toBe('PayFastAPIError');
      expect(error.message).toBe('API request failed');
      expect(error.statusCode).toBe(500);
      expect(error.responseBody).toEqual({ error: 'Internal Server Error' });
      expect(error.endpoint).toBe('/transactions/history');
      expect(error.timestamp).toBeDefined();
      expect(error.stack).toBeDefined();
    });

    it('should serialize to JSON correctly', () => {
      const error = new PayFastAPIError(
        'API request failed',
        404,
        { error: 'Not Found' },
        '/transactions/query'
      );

      const json = error.toJSON();

      expect(json).toEqual({
        name: 'PayFastAPIError',
        message: 'API request failed',
        statusCode: 404,
        responseBody: { error: 'Not Found' },
        endpoint: '/transactions/query',
        timestamp: error.timestamp,
      });
    });

    it('should sanitize sensitive data in toJSON', () => {
      const error = new PayFastAPIError(
        'API request failed',
        400,
        {
          error: 'Invalid request',
          merchantKey: 'secret123',
          passphrase: 'supersecret',
        },
        '/process'
      );

      const json = error.toJSON();

      expect(json.responseBody.merchantKey).toBe('[REDACTED]');
      expect(json.responseBody.passphrase).toBe('[REDACTED]');
      expect(json.responseBody.error).toBe('Invalid request');
    });
  });

  describe('PayFastAuthError', () => {
    it('should construct with required fields', () => {
      const error = new PayFastAuthError(
        'Authentication failed',
        'Invalid credentials'
      );

      expect(error.name).toBe('PayFastAuthError');
      expect(error.message).toBe('Authentication failed');
      expect(error.reason).toBe('Invalid credentials');
      expect(error.details).toBeUndefined();
      expect(error.timestamp).toBeDefined();
    });

    it('should construct with optional details', () => {
      const error = new PayFastAuthError(
        'Authentication failed',
        'Invalid signature',
        'Signature mismatch: expected ABC, got XYZ'
      );

      expect(error.details).toBe('Signature mismatch: expected ABC, got XYZ');
    });

    it('should serialize to JSON correctly', () => {
      const error = new PayFastAuthError(
        'Authentication failed',
        'Unauthorized',
        'Invalid merchant ID'
      );

      const json = error.toJSON();

      expect(json).toEqual({
        name: 'PayFastAuthError',
        message: 'Authentication failed',
        reason: 'Unauthorized',
        details: 'Invalid merchant ID',
        timestamp: error.timestamp,
      });
    });
  });

  describe('PayFastValidationError', () => {
    it('should construct with all fields', () => {
      const error = new PayFastValidationError(
        'Invalid amount format',
        'amount',
        'decimal number with 2 decimal places',
        'abc'
      );

      expect(error.name).toBe('PayFastValidationError');
      expect(error.message).toBe('Invalid amount format');
      expect(error.fieldName).toBe('amount');
      expect(error.expectedFormat).toBe('decimal number with 2 decimal places');
      expect(error.receivedValue).toBe('abc');
      expect(error.timestamp).toBeDefined();
    });

    it('should construct without receivedValue', () => {
      const error = new PayFastValidationError(
        'Missing required field',
        'item_name',
        'non-empty string'
      );

      expect(error.receivedValue).toBeUndefined();
    });

    it('should serialize to JSON correctly', () => {
      const error = new PayFastValidationError(
        'Invalid date format',
        'run_date',
        'YYYY-MM-DD',
        '01/15/2024'
      );

      const json = error.toJSON();

      expect(json).toEqual({
        name: 'PayFastValidationError',
        message: 'Invalid date format',
        fieldName: 'run_date',
        expectedFormat: 'YYYY-MM-DD',
        receivedValue: '01/15/2024',
        timestamp: error.timestamp,
      });
    });

    it('should sanitize sensitive receivedValue in toJSON', () => {
      const error = new PayFastValidationError(
        'Invalid credentials',
        'credentials',
        'valid merchant credentials',
        {
          merchantKey: 'secret123',
          passphrase: 'supersecret',
        }
      );

      const json = error.toJSON();

      expect(json.receivedValue.merchantKey).toBe('[REDACTED]');
      expect(json.receivedValue.passphrase).toBe('[REDACTED]');
    });
  });

  describe('PayFastConfigError', () => {
    it('should construct with missing vars array', () => {
      const error = new PayFastConfigError(
        'Configuration validation failed',
        ['PAYFAST_MERCHANT_ID', 'PAYFAST_MERCHANT_KEY']
      );

      expect(error.name).toBe('PayFastConfigError');
      expect(error.message).toBe('Configuration validation failed');
      expect(error.missingVars).toEqual(['PAYFAST_MERCHANT_ID', 'PAYFAST_MERCHANT_KEY']);
      expect(error.configKey).toBeUndefined();
      expect(error.timestamp).toBeDefined();
    });

    it('should construct with config key', () => {
      const error = new PayFastConfigError(
        'Invalid environment value',
        undefined,
        'PAYFAST_ENVIRONMENT'
      );

      expect(error.missingVars).toBeUndefined();
      expect(error.configKey).toBe('PAYFAST_ENVIRONMENT');
    });

    it('should serialize to JSON correctly', () => {
      const error = new PayFastConfigError(
        'Missing required configuration',
        ['PAYFAST_PASSPHRASE'],
        'passphrase'
      );

      const json = error.toJSON();

      expect(json).toEqual({
        name: 'PayFastConfigError',
        message: 'Missing required configuration',
        missingVars: ['PAYFAST_PASSPHRASE'],
        configKey: 'passphrase',
        timestamp: error.timestamp,
      });
    });
  });

  describe('isPayFastError type guard', () => {
    it('should return true for PayFastAPIError', () => {
      const error = new PayFastAPIError('Error', 500, {}, '/test');
      expect(isPayFastError(error)).toBe(true);
    });

    it('should return true for PayFastAuthError', () => {
      const error = new PayFastAuthError('Error', 'reason');
      expect(isPayFastError(error)).toBe(true);
    });

    it('should return true for PayFastValidationError', () => {
      const error = new PayFastValidationError('Error', 'field', 'format');
      expect(isPayFastError(error)).toBe(true);
    });

    it('should return true for PayFastConfigError', () => {
      const error = new PayFastConfigError('Error');
      expect(isPayFastError(error)).toBe(true);
    });

    it('should return false for standard Error', () => {
      const error = new Error('Standard error');
      expect(isPayFastError(error)).toBe(false);
    });

    it('should return false for non-error objects', () => {
      expect(isPayFastError({ message: 'Not an error' })).toBe(false);
      expect(isPayFastError('error string')).toBe(false);
      expect(isPayFastError(null)).toBe(false);
      expect(isPayFastError(undefined)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error instance', () => {
      const error = new Error('Something went wrong');
      expect(getErrorMessage(error)).toBe('Something went wrong');
    });

    it('should extract message from PayFast error', () => {
      const error = new PayFastAPIError('API Error', 500, {}, '/test');
      expect(getErrorMessage(error)).toBe('API Error');
    });

    it('should return string as-is', () => {
      expect(getErrorMessage('Error message')).toBe('Error message');
    });

    it('should return default message for unknown types', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
      expect(getErrorMessage(123)).toBe('An unknown error occurred');
      expect(getErrorMessage({ foo: 'bar' })).toBe('An unknown error occurred');
    });
  });

  describe('errorToJSON', () => {
    it('should serialize PayFastAPIError using toJSON method', () => {
      const error = new PayFastAPIError('API Error', 500, { error: 'details' }, '/test');
      const json = errorToJSON(error);

      expect(json).toEqual({
        name: 'PayFastAPIError',
        message: 'API Error',
        statusCode: 500,
        responseBody: { error: 'details' },
        endpoint: '/test',
        timestamp: error.timestamp,
      });
    });

    it('should serialize PayFastAuthError using toJSON method', () => {
      const error = new PayFastAuthError('Auth Error', 'Unauthorized', 'details');
      const json = errorToJSON(error);

      expect(json).toEqual({
        name: 'PayFastAuthError',
        message: 'Auth Error',
        reason: 'Unauthorized',
        details: 'details',
        timestamp: error.timestamp,
      });
    });

    it('should serialize standard Error', () => {
      const error = new Error('Standard error');
      const json = errorToJSON(error);

      expect(json.name).toBe('Error');
      expect(json.message).toBe('Standard error');
      expect(json.stack).toBeDefined();
      expect(json.timestamp).toBeDefined();
    });

    it('should handle string errors', () => {
      const json = errorToJSON('Error string');

      expect(json.name).toBe('UnknownError');
      expect(json.message).toBe('Error string');
      expect(json.timestamp).toBeDefined();
    });

    it('should handle unknown error types', () => {
      const json = errorToJSON({ custom: 'error object' });

      expect(json.name).toBe('UnknownError');
      expect(json.message).toBe('An unknown error occurred');
      expect(json.error).toEqual({ custom: 'error object' });
      expect(json.timestamp).toBeDefined();
    });

    it('should sanitize sensitive data in unknown errors', () => {
      const json = errorToJSON({
        merchantKey: 'secret123',
        passphrase: 'supersecret',
        data: 'public',
      });

      expect(json.error.merchantKey).toBe('[REDACTED]');
      expect(json.error.passphrase).toBe('[REDACTED]');
      expect(json.error.data).toBe('public');
    });
  });
});
