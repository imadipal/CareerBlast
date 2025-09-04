import React from 'react';
import ResumeManager from './ResumeManager';
import { Card } from '../ui/Card';
import { FileText, Upload, CheckCircle } from 'lucide-react';

interface ResumeSectionProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
  className?: string;
  compact?: boolean;
}

/**
 * Complete resume section component that can be used anywhere in the app
 * Provides a clean interface for uploading and managing resumes
 */
export const ResumeSection: React.FC<ResumeSectionProps> = ({
  title = "Resume",
  description = "Upload your resume to help employers find you and understand your background",
  showTitle = true,
  className = '',
  compact = false
}) => {
  const handleUploadSuccess = () => {
    console.log('Resume uploaded successfully!');
    // You can add additional logic here like:
    // - Show success notification
    // - Refresh user data
    // - Update profile completion percentage
  };

  const handleUploadError = (error: string) => {
    console.error('Resume upload failed:', error);
    // You can add additional logic here like:
    // - Show error notification
    // - Log error for debugging
    // - Provide user guidance
  };

  if (compact) {
    return (
      <div className={className}>
        <ResumeManager
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      {showTitle && (
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
      )}
      
      <ResumeManager
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Resume Tips:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Use a professional format (PDF preferred)</li>
              <li>• Keep it concise (1-2 pages)</li>
              <li>• Include relevant keywords for your industry</li>
              <li>• Update regularly with new experiences</li>
              <li>• Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResumeSection;
