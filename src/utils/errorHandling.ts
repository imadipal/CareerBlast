import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class AppError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: any;

  constructor(message: string, code?: string, status?: number, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        return {
          message: data?.message || 'Invalid request. Please check your input.',
          code: 'BAD_REQUEST',
          status,
          details: data?.details,
        };
      case 401:
        return {
          message: 'You are not authorized. Please log in again.',
          code: 'UNAUTHORIZED',
          status,
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          code: 'FORBIDDEN',
          status,
        };
      case 404:
        return {
          message: data?.message || 'The requested resource was not found.',
          code: 'NOT_FOUND',
          status,
        };
      case 409:
        return {
          message: data?.message || 'A conflict occurred. The resource may already exist.',
          code: 'CONFLICT',
          status,
        };
      case 422:
        return {
          message: data?.message || 'Validation failed. Please check your input.',
          code: 'VALIDATION_ERROR',
          status,
          details: data?.details,
        };
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT',
          status,
        };
      case 500:
        return {
          message: 'An internal server error occurred. Please try again later.',
          code: 'INTERNAL_ERROR',
          status,
        };
      case 503:
        return {
          message: 'Service is temporarily unavailable. Please try again later.',
          code: 'SERVICE_UNAVAILABLE',
          status,
        };
      default:
        return {
          message: data?.message || error.message || 'An unexpected error occurred.',
          code: 'UNKNOWN_ERROR',
          status,
        };
    }
  }

  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR',
    };
  }

  return {
    message: 'An unknown error occurred.',
    code: 'UNKNOWN_ERROR',
  };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && !!error.request;
  }
  return false;
};

export const isValidationError = (error: unknown): boolean => {
  const apiError = handleApiError(error);
  return apiError.code === 'VALIDATION_ERROR' || apiError.status === 422;
};

export const isAuthError = (error: unknown): boolean => {
  const apiError = handleApiError(error);
  return apiError.status === 401 || apiError.status === 403;
};

// Error boundary helper
export const logError = (error: Error, errorInfo?: any) => {
  console.error('Application Error:', error);
  if (errorInfo) {
    console.error('Error Info:', errorInfo);
  }

  // In production, you might want to send errors to a logging service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToLoggingService(error, errorInfo);
  }
};

// Retry utility for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) except for 429 (rate limit)
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status && status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
      }

      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError;
};

// Debounce utility for API calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Cache utility for API responses
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl = 5 * 60 * 1000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new SimpleCache();

// Utility to create cache keys
export const createCacheKey = (endpoint: string, params?: Record<string, any>): string => {
  if (!params) return endpoint;
  
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);

  return `${endpoint}:${JSON.stringify(sortedParams)}`;
};
