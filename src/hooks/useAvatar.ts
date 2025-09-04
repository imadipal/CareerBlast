import { useState, useEffect, useCallback } from 'react';
import { avatarAPI, type AvatarInfo } from '../services/avatarAPI';

export const useAvatar = () => {
  const [avatarInfo, setAvatarInfo] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load avatar info on mount
  const loadAvatarInfo = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const info = await avatarAPI.getAvatarInfo();
      setAvatarInfo(info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load avatar info';
      setError(errorMessage);
      console.error('Error loading avatar info:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      await avatarAPI.uploadAvatar(file, (progress) => {
        setUploadProgress(progress);
      });

      // Refresh avatar info after successful upload
      await loadAvatarInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [loadAvatarInfo]);

  // Delete avatar
  const deleteAvatar = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await avatarAPI.deleteAvatar();
      setAvatarInfo(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate download URL
  const getDownloadUrl = useCallback(async (): Promise<string | null> => {
    try {
      if (!avatarInfo) return null;
      return await avatarAPI.generateDownloadUrl();
    } catch (err) {
      console.error('Error generating download URL:', err);
      return null;
    }
  }, [avatarInfo]);

  // Check if user has avatar
  const hasAvatar = avatarInfo !== null;

  // Get avatar URL (either from info or generate new one)
  const getAvatarUrl = useCallback(async (): Promise<string | null> => {
    if (!avatarInfo) return null;
    
    // If we have a download URL in the info, use it
    if (avatarInfo.downloadUrl) {
      return avatarInfo.downloadUrl;
    }
    
    // Otherwise generate a new one
    return await getDownloadUrl();
  }, [avatarInfo, getDownloadUrl]);

  // Load avatar info on component mount
  useEffect(() => {
    loadAvatarInfo();
  }, [loadAvatarInfo]);

  return {
    // State
    avatarInfo,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    hasAvatar,

    // Actions
    uploadAvatar,
    deleteAvatar,
    loadAvatarInfo,
    getDownloadUrl,
    getAvatarUrl,

    // Utilities
    validateFile: avatarAPI.validateFile,
    formatFileSize: avatarAPI.formatFileSize,
    createPreviewUrl: avatarAPI.createPreviewUrl,
    revokePreviewUrl: avatarAPI.revokePreviewUrl,
  };
};
