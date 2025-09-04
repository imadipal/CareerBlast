import { api } from './api';
import type {
  ResumeUploadRequest,
  PresignedUploadResponse,
  ResumeUploadCompleteRequest,
  ResumeInfo,
  ResumeDownloadResponse,
  FileValidation,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE
} from '../types/resume';

export const resumeAPI = {
  // Generate presigned URL for upload
  generateUploadUrl: async (request: ResumeUploadRequest): Promise<PresignedUploadResponse> => {
    const response = await api.post('/resume/upload-url', request);
    return response.data.data;
  },

  // Upload file to S3 using presigned URL
  uploadToS3: async (
    presignedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload aborted'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  },

  // Confirm upload completion
  confirmUpload: async (request: ResumeUploadCompleteRequest): Promise<void> => {
    await api.post('/resume/upload-complete', request);
  },

  // Get resume info
  getResumeInfo: async (): Promise<ResumeInfo> => {
    const response = await api.get('/resume/info');
    return response.data.data;
  },

  // Generate download URL
  generateDownloadUrl: async (): Promise<ResumeDownloadResponse> => {
    const response = await api.get('/resume/download-url');
    return response.data.data;
  },

  // Delete resume
  deleteResume: async (): Promise<void> => {
    await api.delete('/resume/delete');
  },

  // Validate file before upload
  validateFile: (file: File): FileValidation => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`
      };
    }

    // Check file type
    const fileExtension = resumeAPI.getFileExtension(file.name);
    if (!fileExtension || !ALLOWED_FILE_TYPES.includes(fileExtension as any)) {
      return {
        isValid: false,
        error: `File type must be one of: ${ALLOWED_FILE_TYPES.join(', ')}`
      };
    }

    return { isValid: true };
  },

  // Get file extension
  getFileExtension: (fileName: string): string | null => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex > 0 && lastDotIndex < fileName.length - 1) {
      return fileName.substring(lastDotIndex + 1).toLowerCase();
    }
    return null;
  },

  // Format file size for display
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Complete upload process
  uploadResume: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    try {
      // Validate file
      const validation = resumeAPI.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate presigned URL
      const uploadResponse = await resumeAPI.generateUploadUrl({
        fileName: file.name,
        fileSize: file.size
      });

      // Upload to S3
      await resumeAPI.uploadToS3(uploadResponse.presignedUrl, file, onProgress);

      // Confirm upload
      await resumeAPI.confirmUpload({
        fileKey: uploadResponse.fileKey,
        fileName: file.name
      });

    } catch (error) {
      console.error('Resume upload failed:', error);
      throw error;
    }
  }
};
