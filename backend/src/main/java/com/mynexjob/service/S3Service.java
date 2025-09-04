package com.mynexjob.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "app.aws.s3.enabled", havingValue = "true", matchIfMissing = false)
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${AWS_S3_BUCKET_NAME}")
    private String bucketName;

    /**
     * Generate presigned URL for uploading resume
     */
    public PresignedUploadResponse generatePresignedUploadUrl(String userId, String fileName, String fileExtension, long fileSize) {
        // Validate file type
        if (!isFileTypeAllowed(fileExtension)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: pdf, doc, docx");
        }

        // Validate file size (10MB limit)
        if (fileSize > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB");
        }

        // Generate unique key for the file
        String fileKey = generateFileKey(userId, fileName, fileExtension);

        try {
            // Set expiration time (1 hour)
            Date expiration = new Date();
            long expTimeMillis = expiration.getTime();
            expTimeMillis += 1000 * 60 * 60; // 1 hour
            expiration.setTime(expTimeMillis);

            // Generate presigned URL for PUT
            GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, fileKey)
                    .withMethod(HttpMethod.PUT)
                    .withExpiration(expiration);

            URL presignedUrl = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

            log.info("Generated presigned upload URL for user: {} and file: {}", userId, fileName);

            return PresignedUploadResponse.builder()
                    .presignedUrl(presignedUrl.toString())
                    .fileKey(fileKey)
                    .expiresIn(3600L) // 1 hour in seconds
                    .uploadFields(new HashMap<>())
                    .build();

        } catch (Exception e) {
            log.error("Error generating presigned upload URL for user: {} and file: {}", userId, fileName, e);
            throw new RuntimeException("Failed to generate presigned upload URL", e);
        }
    }

    /**
     * Generate presigned URL for downloading resume
     */
    public String generatePresignedDownloadUrl(String fileKey) {
        try {
            // Set expiration time (1 hour)
            Date expiration = new Date();
            long expTimeMillis = expiration.getTime();
            expTimeMillis += 1000 * 60 * 60; // 1 hour
            expiration.setTime(expTimeMillis);

            // Generate presigned URL for GET
            GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, fileKey)
                    .withMethod(HttpMethod.GET)
                    .withExpiration(expiration);

            URL presignedUrl = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

            log.info("Generated presigned download URL for file: {}", fileKey);
            return presignedUrl.toString();

        } catch (Exception e) {
            log.error("Error generating presigned download URL for file: {}", fileKey, e);
            throw new RuntimeException("Failed to generate presigned download URL", e);
        }
    }

    /**
     * Check if file exists in S3
     */
    public boolean fileExists(String fileKey) {
        try {
            return amazonS3.doesObjectExist(bucketName, fileKey);
        } catch (Exception e) {
            log.error("Error checking if file exists: {}", fileKey, e);
            return false;
        }
    }

    /**
     * Delete file from S3
     */
    public void deleteFile(String fileKey) {
        try {
            amazonS3.deleteObject(bucketName, fileKey);
            log.info("Deleted file from S3: {}", fileKey);
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", fileKey, e);
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    /**
     * Get file metadata
     */
    public FileMetadata getFileMetadata(String fileKey) {
        try {
            ObjectMetadata metadata = amazonS3.getObjectMetadata(bucketName, fileKey);

            return FileMetadata.builder()
                    .fileKey(fileKey)
                    .contentType(metadata.getContentType())
                    .contentLength(metadata.getContentLength())
                    .lastModified(metadata.getLastModified().toInstant())
                    .metadata(metadata.getUserMetadata())
                    .build();

        } catch (Exception e) {
            log.error("Error getting file metadata: {}", fileKey, e);
            throw new RuntimeException("Failed to get file metadata", e);
        }
    }

    /**
     * Generate unique file key
     */
    private String generateFileKey(String userId, String fileName, String fileExtension) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String sanitizedFileName = sanitizeFileName(fileName);
        
        return String.format("resumes/%s/%s_%s_%s.%s", 
            userId, timestamp, uniqueId, sanitizedFileName, fileExtension);
    }

    /**
     * Sanitize file name for S3 key
     */
    private String sanitizeFileName(String fileName) {
        // Remove file extension if present
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            fileName = fileName.substring(0, lastDotIndex);
        }
        
        // Replace special characters with underscores
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    /**
     * Check if file type is allowed
     */
    private boolean isFileTypeAllowed(String fileExtension) {
        String[] allowedTypes = {"pdf", "doc", "docx"};
        if (fileExtension == null) return false;

        String lowerCaseExtension = fileExtension.toLowerCase();
        for (String allowedType : allowedTypes) {
            if (allowedType.equals(lowerCaseExtension)) {
                return true;
            }
        }
        return false;
    }



    // Response DTOs
    public static class PresignedUploadResponse {
        private String presignedUrl;
        private String fileKey;
        private Long expiresIn;
        private Map<String, String> uploadFields;

        public static PresignedUploadResponseBuilder builder() {
            return new PresignedUploadResponseBuilder();
        }

        // Getters and setters
        public String getPresignedUrl() { return presignedUrl; }
        public void setPresignedUrl(String presignedUrl) { this.presignedUrl = presignedUrl; }
        public String getFileKey() { return fileKey; }
        public void setFileKey(String fileKey) { this.fileKey = fileKey; }
        public Long getExpiresIn() { return expiresIn; }
        public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
        public Map<String, String> getUploadFields() { return uploadFields; }
        public void setUploadFields(Map<String, String> uploadFields) { this.uploadFields = uploadFields; }

        public static class PresignedUploadResponseBuilder {
            private String presignedUrl;
            private String fileKey;
            private Long expiresIn;
            private Map<String, String> uploadFields;

            public PresignedUploadResponseBuilder presignedUrl(String presignedUrl) {
                this.presignedUrl = presignedUrl;
                return this;
            }

            public PresignedUploadResponseBuilder fileKey(String fileKey) {
                this.fileKey = fileKey;
                return this;
            }

            public PresignedUploadResponseBuilder expiresIn(Long expiresIn) {
                this.expiresIn = expiresIn;
                return this;
            }

            public PresignedUploadResponseBuilder uploadFields(Map<String, String> uploadFields) {
                this.uploadFields = uploadFields;
                return this;
            }

            public PresignedUploadResponse build() {
                PresignedUploadResponse response = new PresignedUploadResponse();
                response.setPresignedUrl(presignedUrl);
                response.setFileKey(fileKey);
                response.setExpiresIn(expiresIn);
                response.setUploadFields(uploadFields);
                return response;
            }
        }
    }

    public static class FileMetadata {
        private String fileKey;
        private String contentType;
        private Long contentLength;
        private java.time.Instant lastModified;
        private Map<String, String> metadata;

        public static FileMetadataBuilder builder() {
            return new FileMetadataBuilder();
        }

        // Getters and setters
        public String getFileKey() { return fileKey; }
        public void setFileKey(String fileKey) { this.fileKey = fileKey; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        public Long getContentLength() { return contentLength; }
        public void setContentLength(Long contentLength) { this.contentLength = contentLength; }
        public java.time.Instant getLastModified() { return lastModified; }
        public void setLastModified(java.time.Instant lastModified) { this.lastModified = lastModified; }
        public Map<String, String> getMetadata() { return metadata; }
        public void setMetadata(Map<String, String> metadata) { this.metadata = metadata; }

        public static class FileMetadataBuilder {
            private String fileKey;
            private String contentType;
            private Long contentLength;
            private java.time.Instant lastModified;
            private Map<String, String> metadata;

            public FileMetadataBuilder fileKey(String fileKey) {
                this.fileKey = fileKey;
                return this;
            }

            public FileMetadataBuilder contentType(String contentType) {
                this.contentType = contentType;
                return this;
            }

            public FileMetadataBuilder contentLength(Long contentLength) {
                this.contentLength = contentLength;
                return this;
            }

            public FileMetadataBuilder lastModified(java.time.Instant lastModified) {
                this.lastModified = lastModified;
                return this;
            }

            public FileMetadataBuilder metadata(Map<String, String> metadata) {
                this.metadata = metadata;
                return this;
            }

            public FileMetadata build() {
                FileMetadata fileMetadata = new FileMetadata();
                fileMetadata.setFileKey(fileKey);
                fileMetadata.setContentType(contentType);
                fileMetadata.setContentLength(contentLength);
                fileMetadata.setLastModified(lastModified);
                fileMetadata.setMetadata(metadata);
                return fileMetadata;
            }
        }
    }
}
