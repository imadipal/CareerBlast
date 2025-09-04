# Amazon S3 Resume Upload Integration Guide

## Overview

This guide covers the complete implementation of Amazon S3 integration for secure resume uploads in the CareerBlast job portal. The system uses presigned URLs for direct client-to-S3 uploads, ensuring security and scalability.

## 🎯 Key Features

### Security & Performance
- ✅ **Presigned URLs** - Direct client-to-S3 uploads without exposing credentials
- ✅ **File Validation** - Type and size validation before upload
- ✅ **Secure Storage** - Files stored in private S3 bucket with controlled access
- ✅ **Progress Tracking** - Real-time upload progress feedback

### User Experience
- ✅ **Drag & Drop** - Intuitive file upload interface
- ✅ **Resume Management** - View, download, replace, and delete resumes
- ✅ **File Preview** - Display file information and metadata
- ✅ **Error Handling** - Comprehensive error messages and recovery

### Technical Features
- ✅ **File Type Support** - PDF, DOC, DOCX formats
- ✅ **Size Limits** - 10MB maximum file size
- ✅ **Unique Naming** - Automatic file key generation with timestamps
- ✅ **Metadata Storage** - File information stored in database

## 🏗️ Architecture

### Backend Components

#### 1. AWS S3 Configuration (`AwsS3Config.java`)
```java
@Configuration
@ConfigurationProperties(prefix = "app.aws.s3")
public class AwsS3Config {
    private String bucketName;
    private String region;
    private String accessKeyId;
    private String secretAccessKey;
    // ... configuration methods
}
```

#### 2. S3 Service (`S3Service.java`)
- **Presigned URL Generation** - Creates secure upload/download URLs
- **File Management** - Upload, download, delete operations
- **Validation** - File type and size validation
- **Metadata Handling** - File information management

#### 3. Resume Controller (`ResumeController.java`)
- **REST Endpoints** - `/resume/upload-url`, `/resume/upload-complete`, etc.
- **Authentication** - Secured endpoints for authenticated users
- **Error Handling** - Comprehensive error responses

#### 4. Database Integration
- **UserProfile Entity** - Added `resumeUrl` and `resumeFileName` fields
- **Migration Script** - Database schema updates

### Frontend Components

#### 1. Resume Upload Component (`ResumeUpload.tsx`)
- **Drag & Drop Interface** - Intuitive file selection
- **Progress Tracking** - Real-time upload progress
- **Validation** - Client-side file validation
- **Error Display** - User-friendly error messages

#### 2. Resume Manager (`ResumeManager.tsx`)
- **File Information** - Display resume details
- **Action Buttons** - Download, delete, replace options
- **Status Indicators** - Upload success/error states

#### 3. Custom Hook (`useResume.ts`)
- **State Management** - Centralized resume state
- **API Integration** - Simplified API calls
- **Error Handling** - Consistent error management

## 🔧 Setup Instructions

### 1. AWS S3 Setup

#### Create S3 Bucket
```bash
# Using AWS CLI
aws s3 mb s3://careerblast-resumes --region ap-south-1
```

#### Configure Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPresignedUploads",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/careerblast-app"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::careerblast-resumes/*"
    }
  ]
}
```

#### Create IAM User
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:GetObjectMetadata"
      ],
      "Resource": "arn:aws:s3:::careerblast-resumes/*"
    }
  ]
}
```

### 2. Backend Configuration

#### Update `application.yml`
```yaml
app:
  aws:
    s3:
      bucket-name: careerblast-resumes
      region: ap-south-1
      access-key-id: ${AWS_ACCESS_KEY_ID}
      secret-access-key: ${AWS_SECRET_ACCESS_KEY}
      presigned-url-expiration: 3600
      max-file-size: 10485760
      allowed-file-types: pdf,doc,docx
```

#### Environment Variables
```bash
# Backend .env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=careerblast-resumes
AWS_S3_REGION=ap-south-1
```

### 3. Frontend Configuration

#### Environment Variables
```bash
# Frontend .env
REACT_APP_AWS_S3_BUCKET_NAME=careerblast-resumes
REACT_APP_AWS_S3_REGION=ap-south-1
```

## 🔄 Upload Flow

### 1. Client Requests Upload URL
```typescript
const uploadResponse = await resumeAPI.generateUploadUrl({
  fileName: file.name,
  fileSize: file.size
});
```

### 2. Backend Generates Presigned URL
```java
PutObjectRequest putObjectRequest = PutObjectRequest.builder()
    .bucket(bucketName)
    .key(fileKey)
    .contentType(contentType)
    .build();

PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(
    PutObjectPresignRequest.builder()
        .putObjectRequest(putObjectRequest)
        .signatureDuration(Duration.ofSeconds(expiration))
        .build()
);
```

### 3. Client Uploads to S3
```typescript
await resumeAPI.uploadToS3(presignedUrl, file, onProgress);
```

### 4. Client Confirms Upload
```typescript
await resumeAPI.confirmUpload({
  fileKey: uploadResponse.fileKey,
  fileName: file.name
});
```

### 5. Backend Updates Database
```java
profile.setResumeUrl(request.getFileKey());
profile.setResumeFileName(request.getFileName());
userProfileService.updateProfile(user.getId(), profile);
```

## 📊 File Management

### File Key Structure
```
resumes/{userId}/{timestamp}_{uniqueId}_{sanitizedFileName}.{extension}
```

Example: `resumes/123e4567-e89b-12d3-a456-426614174000/1640995200000_a1b2c3d4_john_doe_resume.pdf`

### Supported File Types
- **PDF** - `application/pdf`
- **DOC** - `application/msword`
- **DOCX** - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### File Size Limits
- **Maximum Size**: 10MB (10,485,760 bytes)
- **Validation**: Both client and server-side

## 🔒 Security Features

### Access Control
- **Authentication Required** - All endpoints require valid JWT token
- **User Isolation** - Users can only access their own resumes
- **Presigned URL Expiration** - URLs expire after 1 hour

### File Validation
- **Type Checking** - Only allowed file types accepted
- **Size Limits** - Maximum file size enforced
- **Sanitization** - File names sanitized for security

### Error Handling
- **Graceful Degradation** - System continues to work if S3 is unavailable
- **Detailed Logging** - Comprehensive error logging for debugging
- **User-Friendly Messages** - Clear error messages for users

## 🧪 Testing

### Backend Tests
```java
@Test
void shouldGeneratePresignedUploadUrl() {
    // Test presigned URL generation
}

@Test
void shouldValidateFileType() {
    // Test file type validation
}

@Test
void shouldHandleUploadCompletion() {
    // Test upload completion flow
}
```

### Frontend Tests
```typescript
describe('ResumeUpload', () => {
  it('should validate file before upload', () => {
    // Test file validation
  });

  it('should show upload progress', () => {
    // Test progress tracking
  });

  it('should handle upload errors', () => {
    // Test error handling
  });
});
```

## 🚀 Usage Examples

### Basic Resume Upload
```typescript
import { useResume } from '../hooks/useResume';

const MyComponent = () => {
  const { uploadResume, isUploading, uploadProgress, error } = useResume();

  const handleFileUpload = async (file: File) => {
    try {
      await uploadResume(file);
      console.log('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <ResumeUpload
      onUploadSuccess={() => console.log('Success!')}
      onUploadError={(error) => console.error(error)}
    />
  );
};
```

### Resume Management
```typescript
import ResumeManager from '../components/resume/ResumeManager';

const ProfilePage = () => {
  return (
    <div>
      <h1>My Profile</h1>
      <ResumeManager className="mt-6" />
    </div>
  );
};
```

## 📈 Monitoring & Analytics

### Metrics to Track
- **Upload Success Rate** - Percentage of successful uploads
- **File Size Distribution** - Average file sizes uploaded
- **File Type Usage** - Most common file types
- **Error Rates** - Types and frequency of errors

### Logging
- **Upload Events** - Log all upload attempts
- **Error Events** - Log all errors with context
- **Performance Metrics** - Track upload times and sizes

## 🔧 Troubleshooting

### Common Issues

#### 1. Upload Fails with 403 Error
- **Cause**: Invalid AWS credentials or bucket permissions
- **Solution**: Verify IAM user permissions and bucket policy

#### 2. Presigned URL Expires
- **Cause**: URL expiration time too short
- **Solution**: Increase expiration time in configuration

#### 3. File Type Not Allowed
- **Cause**: File extension not in allowed list
- **Solution**: Update allowed file types configuration

#### 4. File Size Too Large
- **Cause**: File exceeds maximum size limit
- **Solution**: Compress file or increase size limit

### Debug Steps
1. Check AWS credentials and permissions
2. Verify S3 bucket configuration
3. Review application logs for errors
4. Test with different file types and sizes
5. Validate network connectivity to S3

---

This S3 integration provides a robust, secure, and scalable solution for resume uploads in your job portal! 🎯
