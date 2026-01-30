import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

/**
 * Zod schema for validating PayFast configuration
 */
const configSchema = z.object({
  merchantId: z.string().min(1, "PAYFAST_MERCHANT_ID is required"),
  merchantKey: z.string().min(1, "PAYFAST_MERCHANT_KEY is required"),
  passphrase: z.string().min(1, "PAYFAST_PASSPHRASE is required"),
  environment: z
    .enum(["sandbox", "production"])
    .default("sandbox")
    .describe("PayFast environment to use"),
});

/**
 * TypeScript type derived from the Zod schema
 */
type ConfigSchema = z.infer<typeof configSchema>;

/**
 * Complete PayFast configuration including derived values
 */
export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  environment: "sandbox" | "production";
  baseUrl: string;
  apiVersion: string;
}

/**
 * Loads and validates PayFast configuration from environment variables
 *
 * @throws {Error} If required environment variables are missing or invalid
 * @returns {PayFastConfig} Validated configuration object with derived values
 *
 * @example
 * ```typescript
 * try {
 *   const config = loadConfig();
 *   console.log(`Using PayFast ${config.environment} environment`);
 * } catch (error) {
 *   console.error('Configuration error:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export function loadConfig(): PayFastConfig {
  try {
    // Parse and validate environment variables
    const rawConfig: Record<string, unknown> = {
      merchantId: process.env.PAYFAST_MERCHANT_ID,
      merchantKey: process.env.PAYFAST_MERCHANT_KEY,
      passphrase: process.env.PAYFAST_PASSPHRASE,
      environment: process.env.PAYFAST_ENVIRONMENT,
    };

    const validatedConfig = configSchema.parse(rawConfig);

    // API base URL is always api.payfast.co.za
    // Sandbox mode is controlled via ?testing=true query parameter, not a different domain
    const baseUrl = "https://api.payfast.co.za";

    // Return complete configuration with derived values
    return {
      merchantId: validatedConfig.merchantId,
      merchantKey: validatedConfig.merchantKey,
      passphrase: validatedConfig.passphrase,
      environment: validatedConfig.environment,
      baseUrl,
      apiVersion: "v1",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors into a readable message
      const missingVars = error.errors.map((err) => {
        const field = err.path.join(".");
        const envVarName = `PAYFAST_${field.toUpperCase().replace(/([A-Z])/g, "_$1")}`.replace("__", "_");
        return `  - ${envVarName}: ${err.message}`;
      });

      throw new Error(
        `PayFast configuration validation failed:\n${missingVars.join("\n")}\n\n` +
          `Please ensure the following environment variables are set:\n` +
          `  - PAYFAST_MERCHANT_ID (required)\n` +
          `  - PAYFAST_MERCHANT_KEY (required)\n` +
          `  - PAYFAST_PASSPHRASE (required)\n` +
          `  - PAYFAST_ENVIRONMENT (optional, defaults to "sandbox", must be "sandbox" or "production")`
      );
    }
    throw error;
  }
}

/**
 * Pre-loaded configuration instance
 * Use this for immediate access to configuration throughout the application
 *
 * @example
 * ```typescript
 * import { config } from './config';
 *
 * console.log(`Merchant ID: ${config.merchantId}`);
 * console.log(`Base URL: ${config.baseUrl}`);
 * ```
 */
export const config = loadConfig();
