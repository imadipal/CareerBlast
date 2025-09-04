import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// AWS S3 Configuration
const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
};

const s3 = new AWS.S3(s3Config);

// S3 Bucket Configuration
export const S3_BUCKETS = {
  RESUMES: process.env.S3_RESUMES_BUCKET || 'careerblast-resumes',
  PROFILE_PICTURES: process.env.S3_PROFILE_PICTURES_BUCKET || 'careerblast-profile-pictures',
  COMPANY_LOGOS: process.env.S3_COMPANY_LOGOS_BUCKET || 'careerblast-company-logos',
  DOCUMENTS: process.env.S3_DOCUMENTS_BUCKET || 'careerblast-documents',
};

// File type configurations
export const FILE_CONFIGS = {
  RESUME: {
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: 'resumes/',
  },
  PROFILE_PICTURE: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB
    folder: 'profile-pictures/',
  },
  COMPANY_LOGO: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'],
    maxSize: 1 * 1024 * 1024, // 1MB
    folder: 'company-logos/',
  },
  DOCUMENT: {
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'documents/',
  },
};

export class S3Service {
  /**
   * Upload file to S3
   */
  static async uploadFile(
    file: Buffer | Uint8Array | string,
    fileName: string,
    fileType: keyof typeof FILE_CONFIGS,
    userId?: string
  ): Promise<{ url: string; key: string }> {
    const config = FILE_CONFIGS[fileType];
    const bucket = this.getBucketForFileType(fileType);
    
    // Generate unique file name
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${config.folder}${userId ? `${userId}/` : ''}${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: bucket,
      Key: uniqueFileName,
      Body: file,
      ContentType: this.getContentType(fileName),
      ACL: 'public-read', // Make files publicly accessible
    };

    try {
      const result = await s3.upload(uploadParams).promise();
      return {
        url: result.Location,
        key: result.Key,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(key: string, fileType: keyof typeof FILE_CONFIGS): Promise<void> {
    const bucket = this.getBucketForFileType(fileType);

    const deleteParams = {
      Bucket: bucket,
      Key: key,
    };

    try {
      await s3.deleteObject(deleteParams).promise();
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error('Failed to delete file from S3');
    }
  }

  /**
   * Generate presigned URL for secure file access
   */
  static async getPresignedUrl(
    key: string,
    fileType: keyof typeof FILE_CONFIGS,
    expiresIn: number = 3600
  ): Promise<string> {
    const bucket = this.getBucketForFileType(fileType);

    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn,
    };

    try {
      return await s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('S3 presigned URL error:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  /**
   * Get direct upload URL for frontend
   */
  static async getUploadUrl(
    fileName: string,
    fileType: keyof typeof FILE_CONFIGS,
    userId?: string
  ): Promise<{ uploadUrl: string; key: string }> {
    const config = FILE_CONFIGS[fileType];
    const bucket = this.getBucketForFileType(fileType);
    
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${config.folder}${userId ? `${userId}/` : ''}${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: bucket,
      Key: uniqueFileName,
      ContentType: this.getContentType(fileName),
      ACL: 'public-read',
      Expires: 300, // 5 minutes
    };

    try {
      const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
      return {
        uploadUrl,
        key: uniqueFileName,
      };
    } catch (error) {
      console.error('S3 upload URL error:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(
    file: { size: number; type: string; name: string },
    fileType: keyof typeof FILE_CONFIGS
  ): { isValid: boolean; error?: string } {
    const config = FILE_CONFIGS[fileType];

    // Check file size
    if (file.size > config.maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${config.maxSize / (1024 * 1024)}MB limit`,
      };
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Get bucket name for file type
   */
  private static getBucketForFileType(fileType: keyof typeof FILE_CONFIGS): string {
    switch (fileType) {
      case 'RESUME':
        return S3_BUCKETS.RESUMES;
      case 'PROFILE_PICTURE':
        return S3_BUCKETS.PROFILE_PICTURES;
      case 'COMPANY_LOGO':
        return S3_BUCKETS.COMPANY_LOGOS;
      case 'DOCUMENT':
        return S3_BUCKETS.DOCUMENTS;
      default:
        return S3_BUCKETS.DOCUMENTS;
    }
  }

  /**
   * Get content type from file name
   */
  private static getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const contentTypes: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      svg: 'image/svg+xml',
    };

    return contentTypes[extension || ''] || 'application/octet-stream';
  }

  /**
   * List files in a folder
   */
  static async listFiles(
    fileType: keyof typeof FILE_CONFIGS,
    userId?: string,
    maxKeys: number = 100
  ): Promise<AWS.S3.Object[]> {
    const config = FILE_CONFIGS[fileType];
    const bucket = this.getBucketForFileType(fileType);
    const prefix = userId ? `${config.folder}${userId}/` : config.folder;

    const params = {
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    };

    try {
      const result = await s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      console.error('S3 list files error:', error);
      throw new Error('Failed to list files from S3');
    }
  }

  /**
   * Copy file within S3
   */
  static async copyFile(
    sourceKey: string,
    destinationKey: string,
    fileType: keyof typeof FILE_CONFIGS
  ): Promise<void> {
    const bucket = this.getBucketForFileType(fileType);

    const params = {
      Bucket: bucket,
      CopySource: `${bucket}/${sourceKey}`,
      Key: destinationKey,
      ACL: 'public-read',
    };

    try {
      await s3.copyObject(params).promise();
    } catch (error) {
      console.error('S3 copy error:', error);
      throw new Error('Failed to copy file in S3');
    }
  }
}

export default S3Service;
