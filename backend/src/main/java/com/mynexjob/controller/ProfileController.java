package com.mynexjob.controller;

import com.mynexjob.dto.request.AvatarUploadRequest;
import com.mynexjob.dto.request.AvatarUploadCompleteRequest;
import com.mynexjob.dto.response.AvatarInfoResponse;
import com.mynexjob.dto.ApiResponse;
import com.mynexjob.entity.User;
import com.mynexjob.service.S3Service;
import com.mynexjob.service.UserService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "app.aws.s3.enabled", havingValue = "true", matchIfMissing = false)
public class ProfileController {

    private final S3Service s3Service;
    private final UserService userService;

    /**
     * Generate presigned URL for avatar upload
     */
    @PostMapping("/avatar/upload-url")
    public ResponseEntity<ApiResponse<S3Service.PresignedUploadResponse>> generateAvatarUploadUrl(
            @Valid @RequestBody AvatarUploadRequest request,
            @AuthenticationPrincipal User user) {
        
        try {
            log.info("Generating avatar upload URL for user: {} and file: {}", user.getId(), request.getFileName());
            
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
            S3Service.PresignedUploadResponse response = s3Service.generateAvatarUploadUrl(
                user.getId().toString(),
                fileName,
                fileExtension,
                request.getFileSize()
            );
            
            log.info("Generated presigned avatar upload URL for user: {} and file: {}", user.getId(), fileName);
            return ResponseEntity.ok(ApiResponse.success(response));
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid avatar upload request for user: {} - {}", user.getId(), e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error generating avatar upload URL for user: {}", user.getId(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to generate upload URL"));
        }
    }

    /**
     * Confirm avatar upload completion
     */
    @PostMapping("/avatar/upload-complete")
    public ResponseEntity<ApiResponse<Void>> confirmAvatarUpload(
            @Valid @RequestBody AvatarUploadCompleteRequest request,
            @AuthenticationPrincipal User user) {
        
        try {
            log.info("Confirming avatar upload for user: {} and file: {}", user.getId(), request.getFileName());
            
            // Verify file exists in S3
            if (!s3Service.fileExists(request.getFileKey())) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File not found in storage"));
            }
            
            // Generate download URL for the avatar
            String avatarUrl = s3Service.generatePresignedDownloadUrl(request.getFileKey());
            
            // Update user profile with avatar URL
            userService.updateUserAvatar(user.getId(), avatarUrl, request.getFileKey());
            
            log.info("Avatar upload confirmed for user: {} and file: {}", user.getId(), request.getFileName());
            return ResponseEntity.ok(ApiResponse.success(null));
            
        } catch (Exception e) {
            log.error("Error confirming avatar upload for user: {}", user.getId(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to confirm upload"));
        }
    }

    /**
     * Get avatar information
     */
    @GetMapping("/avatar/info")
    public ResponseEntity<ApiResponse<AvatarInfoResponse>> getAvatarInfo(
            @AuthenticationPrincipal User user) {
        
        try {
            log.info("Getting avatar info for user: {}", user.getId());
            
            if (user.getAvatarFileKey() == null || user.getAvatarFileKey().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success(null));
            }
            
            // Check if file exists
            if (!s3Service.fileExists(user.getAvatarFileKey())) {
                log.warn("Avatar file not found for user: {}", user.getId());
                return ResponseEntity.ok(ApiResponse.success(null));
            }
            
            // Get file metadata
            S3Service.FileMetadata metadata = s3Service.getFileMetadata(user.getAvatarFileKey());
            
            // Generate download URL
            String downloadUrl = s3Service.generatePresignedDownloadUrl(user.getAvatarFileKey());
            
            AvatarInfoResponse response = AvatarInfoResponse.builder()
                .fileName(extractFileNameFromKey(user.getAvatarFileKey()))
                .fileKey(user.getAvatarFileKey())
                .fileSize(metadata.getContentLength())
                .contentType(metadata.getContentType())
                .downloadUrl(downloadUrl)
                .uploadedAt(user.getUpdatedAt())
                .lastModified(metadata.getLastModified())
                .build();
            
            return ResponseEntity.ok(ApiResponse.success(response));
            
        } catch (Exception e) {
            log.error("Error getting avatar info for user: {}", user.getId(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get avatar information"));
        }
    }

    /**
     * Delete avatar
     */
    @DeleteMapping("/avatar/delete")
    public ResponseEntity<ApiResponse<Void>> deleteAvatar(
            @AuthenticationPrincipal User user) {
        
        try {
            log.info("Deleting avatar for user: {}", user.getId());
            
            if (user.getAvatarFileKey() == null || user.getAvatarFileKey().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success(null));
            }
            
            // Delete from S3
            s3Service.deleteFile(user.getAvatarFileKey());
            
            // Update user profile
            userService.updateUserAvatar(user.getId(), null, null);
            
            log.info("Avatar deleted for user: {}", user.getId());
            return ResponseEntity.ok(ApiResponse.success(null));
            
        } catch (Exception e) {
            log.error("Error deleting avatar for user: {}", user.getId(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete avatar"));
        }
    }

    /**
     * Generate download URL for avatar
     */
    @GetMapping("/avatar/download-url")
    public ResponseEntity<ApiResponse<String>> generateAvatarDownloadUrl(
            @AuthenticationPrincipal User user) {
        
        try {
            log.info("Generating avatar download URL for user: {}", user.getId());
            
            if (user.getAvatarFileKey() == null || user.getAvatarFileKey().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No avatar found"));
            }
            
            String downloadUrl = s3Service.generatePresignedDownloadUrl(user.getAvatarFileKey());
            
            return ResponseEntity.ok(ApiResponse.success(downloadUrl));
            
        } catch (Exception e) {
            log.error("Error generating avatar download URL for user: {}", user.getId(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to generate download URL"));
        }
    }

    /**
     * Extract file extension from filename
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }
        
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return null;
        }
        
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    /**
     * Extract filename from S3 key
     */
    private String extractFileNameFromKey(String fileKey) {
        if (fileKey == null || fileKey.isEmpty()) {
            return null;
        }
        
        String[] parts = fileKey.split("/");
        if (parts.length > 0) {
            String lastPart = parts[parts.length - 1];
            // Remove timestamp and unique ID prefix
            int lastUnderscoreIndex = lastPart.lastIndexOf('_');
            if (lastUnderscoreIndex != -1 && lastUnderscoreIndex < lastPart.length() - 1) {
                return lastPart.substring(lastUnderscoreIndex + 1);
            }
            return lastPart;
        }
        
        return fileKey;
    }
}
