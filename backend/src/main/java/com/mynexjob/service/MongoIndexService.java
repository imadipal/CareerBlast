package com.mynexjob.service;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class MongoIndexService {

    private final MongoTemplate mongoTemplate;

    /**
     * Get index information for all collections
     */
    public Map<String, List<IndexInfo>> getAllIndexes() {
        Map<String, List<IndexInfo>> allIndexes = new HashMap<>();
        
        String[] collections = {"users", "jobs", "companies", "user_profiles", 
                               "job_applications", "subscriptions", "skills"};
        
        for (String collection : collections) {
            try {
                IndexOperations indexOps = mongoTemplate.indexOps(collection);
                List<IndexInfo> indexes = indexOps.getIndexInfo();
                allIndexes.put(collection, indexes);
                log.info("Collection '{}' has {} indexes", collection, indexes.size());
            } catch (Exception e) {
                log.warn("Could not get indexes for collection '{}': {}", collection, e.getMessage());
            }
        }
        
        return allIndexes;
    }

    /**
     * Get index information for a specific collection
     */
    public List<IndexInfo> getIndexesForCollection(String collectionName) {
        try {
            IndexOperations indexOps = mongoTemplate.indexOps(collectionName);
            List<IndexInfo> indexes = indexOps.getIndexInfo();
            log.info("Collection '{}' has {} indexes", collectionName, indexes.size());
            return indexes;
        } catch (Exception e) {
            log.error("Error getting indexes for collection '{}': {}", collectionName, e.getMessage());
            throw new RuntimeException("Failed to get indexes for collection: " + collectionName, e);
        }
    }

    /**
     * Drop all indexes for a collection (except _id)
     */
    public void dropAllIndexes(String collectionName) {
        try {
            IndexOperations indexOps = mongoTemplate.indexOps(collectionName);
            indexOps.dropAllIndexes();
            log.info("Dropped all indexes for collection '{}'", collectionName);
        } catch (Exception e) {
            log.error("Error dropping indexes for collection '{}': {}", collectionName, e.getMessage());
            throw new RuntimeException("Failed to drop indexes for collection: " + collectionName, e);
        }
    }

    /**
     * Drop a specific index by name
     */
    public void dropIndex(String collectionName, String indexName) {
        try {
            IndexOperations indexOps = mongoTemplate.indexOps(collectionName);
            indexOps.dropIndex(indexName);
            log.info("Dropped index '{}' for collection '{}'", indexName, collectionName);
        } catch (Exception e) {
            log.error("Error dropping index '{}' for collection '{}': {}", indexName, collectionName, e.getMessage());
            throw new RuntimeException("Failed to drop index: " + indexName, e);
        }
    }

    /**
     * Get index statistics and performance metrics
     */
    public Map<String, Object> getIndexStats(String collectionName) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get basic index information
            List<IndexInfo> indexes = getIndexesForCollection(collectionName);
            stats.put("indexCount", indexes.size());
            stats.put("indexes", indexes);
            
            // You can add more detailed statistics here using MongoDB aggregation
            // For example, index usage statistics, size, etc.
            
        } catch (Exception e) {
            log.error("Error getting index stats for collection '{}': {}", collectionName, e.getMessage());
            stats.put("error", e.getMessage());
        }
        
        return stats;
    }

    /**
     * Validate that all expected indexes exist
     */
    public Map<String, Boolean> validateIndexes() {
        Map<String, Boolean> validation = new HashMap<>();
        
        // Define expected indexes for each collection
        Map<String, String[]> expectedIndexes = Map.of(
            "users", new String[]{"email_1", "role_1", "isActive_1"},
            "jobs", new String[]{"isActive_1", "companyId_1", "jobCategory_1", "location_1"},
            "companies", new String[]{"userId_1", "name_1", "industry_1"},
            "user_profiles", new String[]{"userId_1", "matchingEnabled_1", "experienceYears_1"},
            "job_applications", new String[]{"userId_1", "jobId_1", "status_1"},
            "subscriptions", new String[]{"userId_1", "isActive_1", "endDate_1"},
            "skills", new String[]{"name_1", "category_1", "usageCount_-1"}
        );
        
        for (Map.Entry<String, String[]> entry : expectedIndexes.entrySet()) {
            String collection = entry.getKey();
            String[] expected = entry.getValue();
            
            try {
                List<IndexInfo> actualIndexes = getIndexesForCollection(collection);
                boolean allExist = true;
                
                for (String expectedIndex : expected) {
                    boolean exists = actualIndexes.stream()
                            .anyMatch(index -> index.getName().equals(expectedIndex));
                    if (!exists) {
                        allExist = false;
                        log.warn("Missing expected index '{}' in collection '{}'", expectedIndex, collection);
                    }
                }
                
                validation.put(collection, allExist);
                
            } catch (Exception e) {
                log.error("Error validating indexes for collection '{}': {}", collection, e.getMessage());
                validation.put(collection, false);
            }
        }
        
        return validation;
    }

    /**
     * Get collection statistics including document count and average document size
     */
    public Map<String, Object> getCollectionStats(String collectionName) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get document count
            long count = mongoTemplate.getCollection(collectionName).countDocuments();
            stats.put("documentCount", count);
            
            // You can add more collection statistics here
            stats.put("collectionName", collectionName);
            
        } catch (Exception e) {
            log.error("Error getting collection stats for '{}': {}", collectionName, e.getMessage());
            stats.put("error", e.getMessage());
        }
        
        return stats;
    }

    /**
     * Log index information for debugging
     */
    public void logIndexInformation() {
        log.info("=== MongoDB Index Information ===");
        
        Map<String, List<IndexInfo>> allIndexes = getAllIndexes();
        
        for (Map.Entry<String, List<IndexInfo>> entry : allIndexes.entrySet()) {
            String collection = entry.getKey();
            List<IndexInfo> indexes = entry.getValue();
            
            log.info("Collection: {}", collection);
            for (IndexInfo index : indexes) {
                log.info("  - Index: {} | Keys: {} | Unique: {}", 
                        index.getName(), 
                        index.getIndexFields(), 
                        index.isUnique());
            }
        }
        
        log.info("=== End Index Information ===");
    }
}
