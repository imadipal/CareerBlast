package com.careerblast.controller.admin;

import com.careerblast.dto.common.ApiResponse;
import com.careerblast.service.MongoIndexService;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/mongo/indexes")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class MongoIndexController {

    private final MongoIndexService mongoIndexService;

    /**
     * Get all indexes for all collections
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, List<IndexInfo>>>> getAllIndexes() {
        try {
            Map<String, List<IndexInfo>> indexes = mongoIndexService.getAllIndexes();
            return ResponseEntity.ok(ApiResponse.success("Retrieved all indexes successfully", indexes));
        } catch (Exception e) {
            log.error("Error retrieving all indexes: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve indexes: " + e.getMessage()));
        }
    }

    /**
     * Get indexes for a specific collection
     */
    @GetMapping("/{collectionName}")
    public ResponseEntity<ApiResponse<List<IndexInfo>>> getIndexesForCollection(
            @PathVariable String collectionName) {
        try {
            List<IndexInfo> indexes = mongoIndexService.getIndexesForCollection(collectionName);
            return ResponseEntity.ok(ApiResponse.success(
                    "Retrieved indexes for collection: " + collectionName, indexes));
        } catch (Exception e) {
            log.error("Error retrieving indexes for collection {}: {}", collectionName, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve indexes: " + e.getMessage()));
        }
    }

    /**
     * Get index statistics for a collection
     */
    @GetMapping("/{collectionName}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getIndexStats(
            @PathVariable String collectionName) {
        try {
            Map<String, Object> stats = mongoIndexService.getIndexStats(collectionName);
            return ResponseEntity.ok(ApiResponse.success(
                    "Retrieved index stats for collection: " + collectionName, stats));
        } catch (Exception e) {
            log.error("Error retrieving index stats for collection {}: {}", collectionName, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve index stats: " + e.getMessage()));
        }
    }

    /**
     * Validate that all expected indexes exist
     */
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> validateIndexes() {
        try {
            Map<String, Boolean> validation = mongoIndexService.validateIndexes();
            return ResponseEntity.ok(ApiResponse.success("Index validation completed", validation));
        } catch (Exception e) {
            log.error("Error validating indexes: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to validate indexes: " + e.getMessage()));
        }
    }

    /**
     * Get collection statistics
     */
    @GetMapping("/{collectionName}/collection-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCollectionStats(
            @PathVariable String collectionName) {
        try {
            Map<String, Object> stats = mongoIndexService.getCollectionStats(collectionName);
            return ResponseEntity.ok(ApiResponse.success(
                    "Retrieved collection stats for: " + collectionName, stats));
        } catch (Exception e) {
            log.error("Error retrieving collection stats for {}: {}", collectionName, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve collection stats: " + e.getMessage()));
        }
    }

    /**
     * Drop all indexes for a collection (except _id) - USE WITH CAUTION
     */
    @DeleteMapping("/{collectionName}")
    public ResponseEntity<ApiResponse<String>> dropAllIndexes(
            @PathVariable String collectionName,
            @RequestParam(defaultValue = "false") boolean confirm) {
        
        if (!confirm) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Must set confirm=true to drop indexes"));
        }
        
        try {
            mongoIndexService.dropAllIndexes(collectionName);
            return ResponseEntity.ok(ApiResponse.success("success", 
                    "Dropped all indexes for collection: " + collectionName));
        } catch (Exception e) {
            log.error("Error dropping indexes for collection {}: {}", collectionName, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to drop indexes: " + e.getMessage()));
        }
    }

    /**
     * Drop a specific index - USE WITH CAUTION
     */
    @DeleteMapping("/{collectionName}/{indexName}")
    public ResponseEntity<ApiResponse<String>> dropIndex(
            @PathVariable String collectionName,
            @PathVariable String indexName,
            @RequestParam(defaultValue = "false") boolean confirm) {
        
        if (!confirm) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Must set confirm=true to drop index"));
        }
        
        try {
            mongoIndexService.dropIndex(collectionName, indexName);
            return ResponseEntity.ok(ApiResponse.success("success", 
                    "Dropped index " + indexName + " for collection: " + collectionName));
        } catch (Exception e) {
            log.error("Error dropping index {} for collection {}: {}", indexName, collectionName, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to drop index: " + e.getMessage()));
        }
    }

    /**
     * Log index information to console (for debugging)
     */
    @PostMapping("/log")
    public ResponseEntity<ApiResponse<String>> logIndexInformation() {
        try {
            mongoIndexService.logIndexInformation();
            return ResponseEntity.ok(ApiResponse.success("success", 
                    "Index information logged to console"));
        } catch (Exception e) {
            log.error("Error logging index information: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to log index information: " + e.getMessage()));
        }
    }
}
