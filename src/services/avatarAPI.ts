import { api } from './api';

export interface AvatarUploadRequest {
  fileName: string;
  fileSize: number;
  contentType?: string;
}

export interface AvatarUploadCompleteRequest {
  fileKey: string;
  fileName: string;
  contentType?: string;
}

export interface PresignedUploadResponse {
  presignedUrl: string;
  fileKey: string;
  expiresIn: number;
  uploadFields: Record<string, string>;
}

export interface AvatarInfo {
  fileName: string;
  fileKey: string;
  fileSize: number;
  contentType: string;
  downloadUrl: string;
  uploadedAt: string;
  lastModified: string;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
}

// Constants
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp'] as const;
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
] as const;

export const avatarAPI = {
  // Generate presigned URL for upload
  generateUploadUrl: async (request: AvatarUploadRequest): Promise<PresignedUploadResponse> => {
    const response = await api.post('/profile/avatar/upload-url', request);
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
  confirmUpload: async (request: AvatarUploadCompleteRequest): Promise<void> => {
    await api.post('/profile/avatar/upload-complete', request);
  },

  // Get avatar info
  getAvatarInfo: async (): Promise<AvatarInfo | null> => {
    try {
      const response = await api.get('/profile/avatar/info');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No avatar uploaded
      }
      throw error;
    }
  },

  // Generate download URL
  generateDownloadUrl: async (): Promise<string> => {
    const response = await api.get('/profile/avatar/download-url');
    return response.data.data;
  },

  // Delete avatar
  deleteAvatar: async (): Promise<void> => {
    await api.delete('/profile/avatar/delete');
  },

  // Validate file before upload
  validateFile: (file: File): FileValidation => {
    // Check file size
    if (file.size > MAX_AVATAR_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${Math.round(MAX_AVATAR_SIZE / (1024 * 1024))}MB`
      };
    }

    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
      return {
        isValid: false,
        error: `File type must be one of: ${ALLOWED_IMAGE_TYPES.join(', ')}`
      };
    }

    return { isValid: true };
  },

  // Get file extension from filename
  getFileExtension: (fileName: string): string | null => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
      return null;
    }
    return fileName.substring(lastDotIndex + 1).toLowerCase();
  },

  // Format file size for display
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Check if file is an image
  isImageFile: (file: File): boolean => {
    return file.type.startsWith('image/');
  },

  // Create image preview URL
  createPreviewUrl: (file: File): string => {
    return URL.createObjectURL(file);
  },

  // Revoke preview URL to free memory
  revokePreviewUrl: (url: string): void => {
    URL.revokeObjectURL(url);
  },

  // Complete upload process
  uploadAvatar: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    try {
      // Validate file
      const validation = avatarAPI.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate presigned URL
      const uploadResponse = await avatarAPI.generateUploadUrl({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type
      });

      // Upload to S3
      await avatarAPI.uploadToS3(uploadResponse.presignedUrl, file, onProgress);

      // Confirm upload
      await avatarAPI.confirmUpload({
        fileKey: uploadResponse.fileKey,
        fileName: file.name,
        contentType: file.type
      });

    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  }
};

export default avatarAPI;
