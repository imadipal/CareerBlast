/**
 * Secure Logging Utility
 * Prevents sensitive data from being logged in production
 */

interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

/**
 * Sanitizes data by removing sensitive information
 */
const sanitizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveFields = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'key',
    'authorization',
    'cookie',
    'session',
    'ssn',
    'creditCard',
    'cvv',
    'pin'
  ];

  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  // Recursively sanitize nested objects
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }

  return sanitized;
};

/**
 * Secure logger that only logs in development or logs sanitized data in production
 */
export const secureLog = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },

  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, data);
    } else if (data) {
      // In production, log sanitized data
      console.info(`[INFO] ${message}`, sanitizeData(data));
    } else {
      console.info(`[INFO] ${message}`);
    }
  },

  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data);
    } else if (data) {
      console.warn(`[WARN] ${message}`, sanitizeData(data));
    } else {
      console.warn(`[WARN] ${message}`);
    }
  },

  error: (message: string, error?: Error | any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error);
    } else {
      // In production, only log error message and sanitized data
      const sanitizedError = error instanceof Error 
        ? { message: error.message, name: error.name }
        : sanitizeData(error);
      console.error(`[ERROR] ${message}`, sanitizedError);
    }
  },

  // Special method for API responses (never log in production)
  apiResponse: (message: string, response?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${message}`, response);
    }
    // Never log API responses in production
  },

  // Special method for user actions (log only action, not data)
  userAction: (action: string, userId?: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[USER_ACTION] ${action}`, { userId });
    } else {
      // In production, log action without user ID
      console.log(`[USER_ACTION] ${action}`);
    }
  }
};

/**
 * Performance logging that's safe for production
 */
export const performanceLog = {
  measure: (name: string, startTime: number) => {
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
    }
    
    // In production, only log if performance is concerning
    if (duration > 1000) { // More than 1 second
      console.warn(`[PERF] Slow operation detected: ${duration.toFixed(2)}ms`);
    }
  }
};

export default secureLog;
