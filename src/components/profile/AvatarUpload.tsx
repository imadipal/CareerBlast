import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAvatar } from '../../hooks/useAvatar';
import { Button } from '../ui/Button';

interface AvatarUploadProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadButton?: boolean;
  showDeleteButton?: boolean;
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  size = 'lg',
  showUploadButton = true,
  showDeleteButton = true,
  onUploadSuccess,
  onUploadError,
  className = ''
}) => {
  const {
    avatarInfo,
    isUploading,
    uploadProgress,
    error,
    hasAvatar,
    uploadAvatar,
    deleteAvatar,
    getAvatarUrl,
    validateFile,
    createPreviewUrl,
    revokePreviewUrl
  } = useAvatar();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load avatar URL when avatar info changes
  React.useEffect(() => {
    if (hasAvatar && avatarInfo) {
      getAvatarUrl().then(setAvatarUrl);
    } else {
      setAvatarUrl(null);
    }
  }, [hasAvatar, avatarInfo, getAvatarUrl]);

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-sm' },
    lg: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-base' },
    xl: { container: 'w-32 h-32', icon: 'w-16 h-16', text: 'text-lg' }
  };

  const config = sizeConfig[size];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }

    // Create preview
    const preview = createPreviewUrl(file);
    setPreviewUrl(preview);

    try {
      await uploadAvatar(file);
      onUploadSuccess?.();
      
      // Clean up preview
      revokePreviewUrl(preview);
      setPreviewUrl(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      onUploadError?.(errorMessage);
      
      // Clean up preview on error
      revokePreviewUrl(preview);
      setPreviewUrl(null);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    try {
      await deleteAvatar();
      setAvatarUrl(null);
      setPreviewUrl(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete avatar';
      onUploadError?.(errorMessage);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl || avatarUrl;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="relative">
        <div
          className={`${config.container} rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors`}
          onClick={openFileDialog}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className={`${config.icon} text-gray-400`} />
          )}
          
          {/* Upload overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 rounded-full">
            <Camera className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Upload progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="text-white text-center">
              <Upload className="w-6 h-6 mx-auto mb-1 animate-pulse" />
              <div className={`${config.text} font-medium`}>{uploadProgress}%</div>
            </div>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Action Buttons */}
      {(showUploadButton || showDeleteButton) && (
        <div className="flex space-x-2">
          {showUploadButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={openFileDialog}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>{hasAvatar ? 'Change' : 'Upload'}</span>
            </Button>
          )}
          
          {showDeleteButton && hasAvatar && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isUploading}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </Button>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Display */}
      {hasAvatar && !error && !isUploading && (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Profile picture uploaded</span>
        </div>
      )}

      {/* File Info */}
      {avatarInfo && (
        <div className="text-center text-xs text-gray-500">
          <p>{avatarInfo.fileName}</p>
          <p>{Math.round(avatarInfo.fileSize / 1024)} KB</p>
        </div>
      )}

      {/* Upload Instructions */}
      {!hasAvatar && !isUploading && (
        <div className="text-center text-xs text-gray-500 max-w-xs">
          <p>Click to upload a profile picture</p>
          <p>JPG, PNG, or WebP (max 5MB)</p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
