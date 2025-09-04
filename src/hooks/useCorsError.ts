import { useState, useCallback } from 'react';

interface CorsError {
  message: string;
  isCorsError: boolean;
  timestamp: number;
}

export const useCorsError = () => {
  const [corsError, setCorsError] = useState<CorsError | null>(null);

  const handleCorsError = useCallback((error: any) => {
    if (error?.isCorsError || (!error.response && error.code === 'ERR_NETWORK')) {
      setCorsError({
        message: error.message || 'Network connection error',
        isCorsError: true,
        timestamp: Date.now()
      });
      return true;
    }
    return false;
  }, []);

  const clearCorsError = useCallback(() => {
    setCorsError(null);
  }, []);

  const retryAfterCorsError = useCallback((retryFn: () => void) => {
    clearCorsError();
    setTimeout(retryFn, 100); // Small delay before retry
  }, [clearCorsError]);

  return {
    corsError,
    handleCorsError,
    clearCorsError,
    retryAfterCorsError,
    hasCorsError: !!corsError
  };
};

export default useCorsError;
