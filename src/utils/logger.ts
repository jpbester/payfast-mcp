/**
 * Logger utility for PayFast MCP Server
 *
 * CRITICAL: This MCP server uses STDIO transport.
 * stdout is reserved for MCP protocol messages.
 * ALL logging MUST go to stderr using console.error().
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const SENSITIVE_FIELDS = ['merchantKey', 'passphrase', 'password', 'token', 'signature'];

/**
 * Get the configured log level from environment variable
 */
function getLogLevel(): LogLevel {
  const level = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
  return LOG_LEVELS[level] !== undefined ? level : 'info';
}

const currentLogLevel = getLogLevel();

/**
 * Sanitize an object by redacting sensitive fields
 * @param obj - Object to sanitize
 * @returns Sanitized copy of the object
 */
export function sanitize(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item));
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_FIELDS.some(field =>
      lowerKey.includes(field.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Format a log message with level and timestamp
 */
function formatMessage(level: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${level.toUpperCase()}] [${timestamp}] ${message}`;
}

/**
 * Convert a value to a loggable string
 */
function valueToString(value: any): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Error) {
    const errorObj = {
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...(value as any), // Include any custom properties
    };
    return JSON.stringify(sanitize(errorObj));
  }

  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(sanitize(value));
    } catch (err) {
      return '[Circular or Non-Serializable Object]';
    }
  }

  return String(value);
}

/**
 * Check if a message should be logged based on current log level
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

/**
 * Write a log message to stderr
 */
function log(level: LogLevel, ...args: any[]): void {
  if (!shouldLog(level)) {
    return;
  }

  const message = args.map(valueToString).join(' ');
  const formattedMessage = formatMessage(level, message);

  // CRITICAL: Write to stderr, never stdout
  console.error(formattedMessage);
}

/**
 * Logger instance with level-specific methods
 */
export const logger = {
  /**
   * Log debug information (most verbose)
   */
  debug(...args: any[]): void {
    log('debug', ...args);
  },

  /**
   * Log informational messages
   */
  info(...args: any[]): void {
    log('info', ...args);
  },

  /**
   * Log warning messages
   */
  warn(...args: any[]): void {
    log('warn', ...args);
  },

  /**
   * Log error messages (least verbose, always shown unless silenced)
   */
  error(...args: any[]): void {
    log('error', ...args);
  },
};

export default logger;
