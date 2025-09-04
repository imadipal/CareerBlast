package com.mynexjob.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.Bucket;
import com.mynexjob.dto.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/s3-test")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "S3 Test", description = "S3 configuration testing endpoints")
@ConditionalOnProperty(name = "app.aws.s3.enabled", havingValue = "true", matchIfMissing = false)
public class S3TestController {

    private final AmazonS3 amazonS3;

    @Value("${S3_RESUMES_BUCKET}")
    private String resumesBucket;

    @GetMapping("/status")
    @Operation(summary = "Check S3 configuration status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkS3Status() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            // Test S3 connection
            List<Bucket> buckets = amazonS3.listBuckets();
            status.put("s3Connected", true);
            status.put("totalBuckets", buckets.size());
            
            // Check if our specific bucket exists
            boolean bucketExists = amazonS3.doesBucketExistV2(resumesBucket);
            status.put("resumesBucketExists", bucketExists);
            status.put("resumesBucketName", resumesBucket);
            
            if (!bucketExists) {
                status.put("message", "S3 connected but resume bucket doesn't exist. Creating bucket...");
                try {
                    amazonS3.createBucket(resumesBucket);
                    status.put("bucketCreated", true);
                    log.info("Created S3 bucket: {}", resumesBucket);
                } catch (Exception e) {
                    status.put("bucketCreated", false);
                    status.put("bucketCreationError", e.getMessage());
                    log.error("Failed to create S3 bucket: {}", resumesBucket, e);
                }
            }
            
            // List available buckets
            status.put("availableBuckets", buckets.stream().map(Bucket::getName).collect(Collectors.toList()));
            
            return ResponseEntity.ok(ApiResponse.success("S3 status check completed", status));
            
        } catch (Exception e) {
            log.error("S3 configuration test failed", e);
            status.put("s3Connected", false);
            status.put("error", e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("S3 status check failed", status));
        }
    }

    @GetMapping("/bucket-info")
    @Operation(summary = "Get bucket information")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBucketInfo() {
        Map<String, Object> info = new HashMap<>();
        
        try {
            boolean bucketExists = amazonS3.doesBucketExistV2(resumesBucket);
            info.put("bucketName", resumesBucket);
            info.put("bucketExists", bucketExists);
            
            if (bucketExists) {
                String bucketLocation = amazonS3.getBucketLocation(resumesBucket);
                info.put("bucketLocation", bucketLocation);
                
                // Get bucket policy (if any)
                try {
                    String bucketPolicy = amazonS3.getBucketPolicy(resumesBucket).getPolicyText();
                    info.put("hasBucketPolicy", true);
                } catch (Exception e) {
                    info.put("hasBucketPolicy", false);
                }
            }
            
            return ResponseEntity.ok(ApiResponse.success("Bucket information retrieved", info));
            
        } catch (Exception e) {
            log.error("Failed to get bucket information", e);
            info.put("error", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error("Failed to get bucket information"));
        }
    }
}
