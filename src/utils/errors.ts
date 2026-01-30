/**
 * Custom error classes for PayFast MCP Server
 *
 * These errors provide structured, context-rich error information
 * while ensuring sensitive data is not leaked in logs or responses.
 */

import { sanitize } from './logger.js';

/**
 * Base error class for PayFast errors
 */
abstract class PayFastError extends Error {
  public readonly timestamp: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for structured logging
   * Automatically sanitizes sensitive data
   */
  abstract toJSON(): Record<string, any>;
}

/**
 * Error thrown when PayFast API returns an error response
 */
export class PayFastAPIError extends PayFastError {
  public readonly statusCode: number;
  public readonly responseBody: any;
  public readonly endpoint: string;

  constructor(
    message: string,
    statusCode: number,
    responseBody: any,
    endpoint: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.responseBody = responseBody;
    this.endpoint = endpoint;
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      responseBody: sanitize(this.responseBody),
      endpoint: this.endpoint,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Error thrown when authentication fails
 */
export class PayFastAuthError extends PayFastError {
  public readonly reason: string;
  public readonly details?: string;

  constructor(message: string, reason: string, details?: string) {
    super(message);
    this.reason = reason;
    this.details = details;
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      reason: this.reason,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Error thrown when input validation fails
 */
export class PayFastValidationError extends PayFastError {
  public readonly fieldName: string;
  public readonly expectedFormat: string;
  public readonly receivedValue?: any;

  constructor(
    message: string,
    fieldName: string,
    expectedFormat: string,
    receivedValue?: any
  ) {
    super(message);
    this.fieldName = fieldName;
    this.expectedFormat = expectedFormat;
    this.receivedValue = receivedValue;
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      fieldName: this.fieldName,
      expectedFormat: this.expectedFormat,
      receivedValue: sanitize(this.receivedValue),
      timestamp: this.timestamp,
    };
  }
}

/**
 * Error thrown when configuration is invalid or missing
 */
export class PayFastConfigError extends PayFastError {
  public readonly missingVars?: string[];
  public readonly configKey?: string;

  constructor(message: string, missingVars?: string[], configKey?: string) {
    super(message);
    this.missingVars = missingVars;
    this.configKey = configKey;
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      missingVars: this.missingVars,
      configKey: this.configKey,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Type guard to check if an error is a PayFast error
 */
export function isPayFastError(error: any): error is PayFastError {
  return error instanceof PayFastError;
}

/**
 * Extract a safe error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}

/**
 * Convert any error to a structured object for logging
 */
export function errorToJSON(error: unknown): Record<string, any> {
  if (isPayFastError(error)) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    name: 'UnknownError',
    message: getErrorMessage(error),
    error: sanitize(error),
    timestamp: new Date().toISOString(),
  };
}
