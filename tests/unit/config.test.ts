import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('config utility', () => {
  // Store original env vars to restore after each test
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original env
    originalEnv = { ...process.env };

    // Clear the module cache to ensure loadConfig re-reads environment
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  describe('loadConfig', () => {
    it('should throw when PAYFAST_MERCHANT_ID is missing', async () => {
      // Set up environment with missing merchant ID
      process.env.PAYFAST_MERCHANT_ID = '';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      // Import will trigger loadConfig(), which should throw
      await expect(async () => {
        await import('../../src/config/index.js');
      }).rejects.toThrow(/PAYFAST_MERCHANT_ID is required/);
    });

    it('should throw when PAYFAST_MERCHANT_KEY is missing', async () => {
      // Set up environment with missing merchant key
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      await expect(async () => {
        await import('../../src/config/index.js');
      }).rejects.toThrow(/PAYFAST_MERCHANT_KEY is required/);
    });

    it('should throw when PAYFAST_PASSPHRASE is missing', async () => {
      // Set up environment with missing passphrase
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = '';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      await expect(async () => {
        await import('../../src/config/index.js');
      }).rejects.toThrow(/PAYFAST_PASSPHRASE is required/);
    });

    it('should throw when multiple required vars are missing', async () => {
      // Set up environment with multiple missing values
      process.env.PAYFAST_MERCHANT_ID = '';
      process.env.PAYFAST_MERCHANT_KEY = '';
      process.env.PAYFAST_PASSPHRASE = '';

      await expect(async () => {
        await import('../../src/config/index.js');
      }).rejects.toThrow(/configuration validation failed/i);
    });

    it('should default environment to "sandbox" when not specified', async () => {
      // Set up environment without PAYFAST_ENVIRONMENT
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      delete process.env.PAYFAST_ENVIRONMENT;

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.environment).toBe('sandbox');
    });

    it('should accept "sandbox" as valid environment', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.environment).toBe('sandbox');
    });

    it('should accept "production" as valid environment', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'production';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.environment).toBe('production');
    });

    it('should throw on invalid environment value', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'invalid';

      await expect(async () => {
        await import('../../src/config/index.js');
      }).rejects.toThrow(/configuration validation failed/i);
    });

    it('should set correct baseUrl for sandbox environment', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.baseUrl).toBe('https://api.payfast.co.za');
    });

    it('should set correct baseUrl for production environment', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'production';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.baseUrl).toBe('https://api.payfast.co.za');
    });

    it('should return complete config object with all fields', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config).toHaveProperty('merchantId');
      expect(config).toHaveProperty('merchantKey');
      expect(config).toHaveProperty('passphrase');
      expect(config).toHaveProperty('environment');
      expect(config).toHaveProperty('baseUrl');
      expect(config).toHaveProperty('apiVersion');
    });

    it('should set apiVersion to "v1"', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.apiVersion).toBe('v1');
    });

    it('should return merchantId from environment', async () => {
      process.env.PAYFAST_MERCHANT_ID = '12345678';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.merchantId).toBe('12345678');
    });

    it('should return merchantKey from environment', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = 'my_secret_key';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.merchantKey).toBe('my_secret_key');
    });

    it('should return passphrase from environment', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'my_secret_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.passphrase).toBe('my_secret_passphrase');
    });

    it('should include helpful error message with missing vars', async () => {
      process.env.PAYFAST_MERCHANT_ID = '';
      process.env.PAYFAST_MERCHANT_KEY = '';
      process.env.PAYFAST_PASSPHRASE = 'test_passphrase';

      try {
        await import('../../src/config/index.js');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const message = (error as Error).message;
        expect(message).toContain('PAYFAST_MERCHANT_ID');
        expect(message).toContain('PAYFAST_MERCHANT_KEY');
        expect(message).toContain('required');
      }
    });

    it('should not trim whitespace from environment variables', async () => {
      process.env.PAYFAST_MERCHANT_ID = '  10000100  ';
      process.env.PAYFAST_MERCHANT_KEY = '  46f0cd694581a  ';
      process.env.PAYFAST_PASSPHRASE = '  test_passphrase  ';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      // Note: Zod doesn't auto-trim, so this test verifies current behavior
      // If values have whitespace, they should be considered valid (non-empty)
      const config = loadConfig();

      expect(config.merchantId).toBe('  10000100  ');
      expect(config.merchantKey).toBe('  46f0cd694581a  ');
      expect(config.passphrase).toBe('  test_passphrase  ');
    });

    it('should handle valid production configuration', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'production_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'production';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.merchantId).toBe('10000100');
      expect(config.merchantKey).toBe('46f0cd694581a');
      expect(config.passphrase).toBe('production_passphrase');
      expect(config.environment).toBe('production');
      expect(config.baseUrl).toBe('https://api.payfast.co.za');
      expect(config.apiVersion).toBe('v1');
    });

    it('should handle valid sandbox configuration', async () => {
      process.env.PAYFAST_MERCHANT_ID = '10000100';
      process.env.PAYFAST_MERCHANT_KEY = '46f0cd694581a';
      process.env.PAYFAST_PASSPHRASE = 'sandbox_passphrase';
      process.env.PAYFAST_ENVIRONMENT = 'sandbox';

      const { loadConfig } = await import('../../src/config/index.js');
      const config = loadConfig();

      expect(config.merchantId).toBe('10000100');
      expect(config.merchantKey).toBe('46f0cd694581a');
      expect(config.passphrase).toBe('sandbox_passphrase');
      expect(config.environment).toBe('sandbox');
      expect(config.baseUrl).toBe('https://api.payfast.co.za');
      expect(config.apiVersion).toBe('v1');
    });
  });
});
