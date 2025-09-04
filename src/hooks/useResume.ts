import { useState, useEffect, useCallback } from 'react';
import { resumeAPI } from '../services/resumeAPI';
import type { ResumeInfo } from '../types/resume';

interface UseResumeReturn {
  resumeInfo: ResumeInfo | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
  uploadResume: (file: File) => Promise<void>;
  downloadResume: () => Promise<void>;
  deleteResume: () => Promise<void>;
  refreshResumeInfo: () => Promise<void>;
  clearError: () => void;
}

export const useResume = (): UseResumeReturn => {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Load resume info on hook initialization
  useEffect(() => {
    loadResumeInfo();
  }, []);

  const loadResumeInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await resumeAPI.getResumeInfo();
      setResumeInfo(info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load resume information';
      setError(errorMessage);
      console.error('Error loading resume info:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadResume = useCallback(async (file: File) => {
    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      await resumeAPI.uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      // Refresh resume info after successful upload
      await loadResumeInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [loadResumeInfo]);

  const downloadResume = useCallback(async () => {
    try {
      setError(null);
      const downloadResponse = await resumeAPI.generateDownloadUrl();
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadResponse.downloadUrl;
      link.download = downloadResponse.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download resume';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteResume = useCallback(async () => {
    try {
      setError(null);
      await resumeAPI.deleteResume();
      
      // Refresh resume info after deletion
      await loadResumeInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete resume';
      setError(errorMessage);
      throw err;
    }
  }, [loadResumeInfo]);

  const refreshResumeInfo = useCallback(async () => {
    await loadResumeInfo();
  }, [loadResumeInfo]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resumeInfo,
    loading,
    error,
    uploadProgress,
    isUploading,
    uploadResume,
    downloadResume,
    deleteResume,
    refreshResumeInfo,
    clearError,
  };
};
