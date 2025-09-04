import React from 'react';
import AvatarUpload from './AvatarUpload';
import { Card } from '../ui/Card';

interface ProfilePictureSectionProps {
  className?: string;
}

/**
 * Profile picture section component that can be used in profile pages
 * Provides a clean interface for uploading and managing profile pictures
 */
export const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  className = ''
}) => {
  const handleUploadSuccess = () => {
    console.log('Profile picture uploaded successfully!');
    // You can add additional logic here like:
    // - Show success notification
    // - Refresh user data
    // - Update UI state
  };

  const handleUploadError = (error: string) => {
    console.error('Profile picture upload failed:', error);
    // You can add additional logic here like:
    // - Show error notification
    // - Log error for debugging
    // - Provide user guidance
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Profile Picture
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Upload a professional photo to help others recognize you
        </p>
        
        <AvatarUpload
          size="xl"
          showUploadButton={true}
          showDeleteButton={true}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          className="mx-auto"
        />
        
        <div className="mt-4 text-xs text-gray-500">
          <p>• Use a clear, professional headshot</p>
          <p>• Square images work best</p>
          <p>• Maximum file size: 5MB</p>
          <p>• Supported formats: JPG, PNG, WebP</p>
        </div>
      </div>
    </Card>
  );
};

export default ProfilePictureSection;
