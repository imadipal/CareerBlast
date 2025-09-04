export interface ResumeUploadRequest {
  fileName: string;
  fileSize: number;
}

export interface PresignedUploadResponse {
  presignedUrl: string;
  fileKey: string;
  expiresIn: number;
  uploadFields?: Record<string, string>;
}

export interface ResumeUploadCompleteRequest {
  fileKey: string;
  fileName: string;
}

export interface ResumeInfo {
  hasResume: boolean;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  lastModified?: string;
}

export interface ResumeDownloadResponse {
  downloadUrl: string;
  fileName: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
}

export const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx'] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type AllowedFileType = typeof ALLOWED_FILE_TYPES[number];
