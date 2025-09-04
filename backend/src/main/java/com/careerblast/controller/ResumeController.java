package com.careerblast.controller;

import com.careerblast.dto.ApiResponse;
import com.careerblast.entity.User;
import com.careerblast.entity.UserProfile;
import com.careerblast.service.S3Service;
import com.careerblast.service.UserService;
import com.careerblast.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/resume")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Resume Management", description = "APIs for managing candidate resumes")
@ConditionalOnProperty(name = "app.aws.s3.enabled", havingValue = "true", matchIfMissing = false)
public class ResumeController {

    private final S3Service s3Service;
    private final UserService userService;
    private final UserProfileService userProfileService;

    @PostMapping("/upload-url")
    @Operation(summary = "Generate presigned URL for resume upload", 
               description = "Generates a presigned URL for secure resume upload to S3",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<S3Service.PresignedUploadResponse>> generateUploadUrl(
            @RequestBody ResumeUploadRequest request,
            Authentication authentication) {
        try {
            User user = userService.getCurrentUser(authentication);
            
            // Validate request
            if (request.getFileName() == null || request.getFileName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File name is required"));
            }
            
            if (request.getFileSize() == null || request.getFileSize() <= 0) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Valid file size is required"));
            }
            
            // Extract file extension
            String fileName = request.getFileName().trim();
            String fileExtension = getFileExtension(fileName);
            
            if (fileExtension == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File must have a valid extension"));
            }
            
            // Generate presigned URL
            S3Service.PresignedUploadResponse response = s3Service.generatePresignedUploadUrl(
                user.getId().toString(),
                fileName,
                fileExtension,
                request.getFileSize()
            );
            
            log.info("Generated presigned upload URL for user: {} and file: {}", user.getId(), fileName);
            return ResponseEntity.ok(ApiResponse.success(response));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error generating presigned upload URL", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to generate upload URL"));
        }
    }

    @PostMapping("/upload-complete")
    @Operation(summary = "Confirm resume upload completion", 
               description = "Updates user profile with uploaded resume information",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<String>> confirmUpload(
            @RequestBody ResumeUploadCompleteRequest request,
            Authentication authentication) {
        try {
            User user = userService.getCurrentUser(authentication);
            
            // Validate request
            if (request.getFileKey() == null || request.getFileKey().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File key is required"));
            }
            
            // Verify file exists in S3
            if (!s3Service.fileExists(request.getFileKey())) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File not found in storage"));
            }
            
            // Update user profile with resume information
            UserProfile profile = userProfileService.getOrCreateProfile(user.getId());
            
            // Delete old resume if exists
            if (profile.getResumeUrl() != null && !profile.getResumeUrl().isEmpty()) {
                try {
                    String oldFileKey = extractFileKeyFromUrl(profile.getResumeUrl());
                    if (oldFileKey != null) {
                        s3Service.deleteFile(oldFileKey);
                    }
                } catch (Exception e) {
                    log.warn("Failed to delete old resume file", e);
                }
            }
            
            // Update profile with new resume
            profile.setResumeUrl(request.getFileKey());
            profile.setResumeFileName(request.getFileName());
            userProfileService.updateProfile(user.getId(), profile);
            
            log.info("Updated resume for user: {} with file key: {}", user.getId(), request.getFileKey());
            return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully"));
            
        } catch (Exception e) {
            log.error("Error confirming resume upload", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to confirm upload"));
        }
    }

    @GetMapping("/download-url")
    @Operation(summary = "Generate presigned URL for resume download", 
               description = "Generates a presigned URL for secure resume download",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Map<String, String>>> generateDownloadUrl(Authentication authentication) {
        try {
            User user = userService.getCurrentUser(authentication);
            UserProfile profile = userProfileService.getProfile(user.getId());
            
            if (profile == null || profile.getResumeUrl() == null || profile.getResumeUrl().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No resume found"));
            }
            
            String downloadUrl = s3Service.generatePresignedDownloadUrl(profile.getResumeUrl());
            
            Map<String, String> response = Map.of(
                "downloadUrl", downloadUrl,
                "fileName", profile.getResumeFileName() != null ? profile.getResumeFileName() : "resume.pdf"
            );
            
            return ResponseEntity.ok(ApiResponse.success(response));
            
        } catch (Exception e) {
            log.error("Error generating download URL", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to generate download URL"));
        }
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete resume", 
               description = "Deletes the user's resume from storage",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<String>> deleteResume(Authentication authentication) {
        try {
            User user = userService.getCurrentUser(authentication);
            UserProfile profile = userProfileService.getProfile(user.getId());
            
            if (profile == null || profile.getResumeUrl() == null || profile.getResumeUrl().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No resume found to delete"));
            }
            
            // Delete from S3
            s3Service.deleteFile(profile.getResumeUrl());
            
            // Update profile
            profile.setResumeUrl(null);
            profile.setResumeFileName(null);
            userProfileService.updateProfile(user.getId(), profile);
            
            log.info("Deleted resume for user: {}", user.getId());
            return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully"));
            
        } catch (Exception e) {
            log.error("Error deleting resume", e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete resume"));
        }
    }

    @GetMapping("/info")
    @Operation(summary = "Get resume information", 
               description = "Returns information about the user's uploaded resume",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResumeInfo(Authentication authentication) {
        try {
            User user = userService.getCurrentUser(authentication);
            UserProfile profile = userProfileService.getProfile(user.getId());
            
            if (profile == null || profile.getResumeUrl() == null || profile.getResumeUrl().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success(Map.of("hasResume", false)));
            }
            
            // Get file metadata
            S3Service.FileMetadata metadata = s3Service.getFileMetadata(profile.getResumeUrl());
            
            Map<String, Object> response = Map.of(
                "hasResume", true,
                "fileName", profile.getResumeFileName() != null ? profile.getResumeFileName() : "resume.pdf",
                "fileSize", metadata.getContentLength(),
                "contentType", metadata.getContentType(),
                "lastModified", metadata.getLastModified().toString()
            );
            
            return ResponseEntity.ok(ApiResponse.success(response));
            
        } catch (Exception e) {
            log.error("Error getting resume info", e);
            return ResponseEntity.ok(ApiResponse.success(Map.of("hasResume", false)));
        }
    }

    // Helper methods
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1);
        }
        return null;
    }

    private String extractFileKeyFromUrl(String url) {
        // If the URL is actually a file key, return as is
        if (url != null && !url.startsWith("http")) {
            return url;
        }
        // For actual URLs, extract the key part
        // This depends on your URL structure
        return url;
    }

    // Request DTOs
    public static class ResumeUploadRequest {
        private String fileName;
        private Long fileSize;

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    }

    public static class ResumeUploadCompleteRequest {
        private String fileKey;
        private String fileName;

        public String getFileKey() { return fileKey; }
        public void setFileKey(String fileKey) { this.fileKey = fileKey; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
    }
}
