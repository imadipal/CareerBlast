import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

interface CorsErrorBannerProps {
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const CorsErrorBanner: React.FC<CorsErrorBannerProps> = ({ onRetry, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            Connection Error
          </h3>
          <p className="text-sm text-red-700 mb-3">
            Unable to connect to the backend server. This might be due to:
          </p>
          <ul className="text-sm text-red-700 list-disc list-inside mb-3 space-y-1">
            <li>Backend server is not running</li>
            <li>CORS configuration issues</li>
            <li>Network connectivity problems</li>
            <li>Incorrect API URL configuration</li>
          </ul>
          <div className="flex space-x-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="text-red-700 hover:bg-red-100"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorsErrorBanner;
