# MongoDB Indexes Documentation

## Overview

This document describes the MongoDB indexing strategy for the CareerBlast application. Proper indexing is crucial for query performance, especially as the application scales.

## Index Strategy

### 1. Users Collection (`users`)

**Primary Queries:**
- Find user by email (login)
- Filter users by role
- Filter active users
- Analytics queries by creation date

**Indexes:**
```javascript
// Unique index on email (most frequent query)
{ "email": 1 } - unique

// Role-based queries
{ "role": 1 }

// Active user filtering
{ "isActive": 1 }

// Email verification status
{ "isEmailVerified": 1 }

// Compound indexes for common query patterns
{ "role": 1, "isActive": 1 }
{ "email": 1, "isActive": 1 }

// Analytics and sorting
{ "createdAt": -1 }
```

### 2. Jobs Collection (`jobs`)

**Primary Queries:**
- Find active jobs
- Jobs by company
- Job search with filters (category, location, salary, etc.)
- Featured jobs
- Full-text search

**Indexes:**
```javascript
// Most frequent filter
{ "isActive": 1 }

// Company-specific queries
{ "companyId": 1 }

// Search filters
{ "jobCategory": 1 }
{ "location": 1 }
{ "jobType": 1 }
{ "experienceLevel": 1 }
{ "isRemote": 1 }
{ "isFeatured": -1 }

// Sorting
{ "createdAt": -1 }
{ "applicationDeadline": 1 }

// Compound indexes for common query patterns
{ "isActive": 1, "companyId": 1, "createdAt": -1 }
{ "isActive": 1, "jobCategory": 1, "location": 1 }
{ "isActive": 1, "salaryMin": 1, "salaryMax": 1 }

// Full-text search
{ "title": "text", "description": "text", "requirements": "text", "responsibilities": "text" }
```

### 3. Companies Collection (`companies`)

**Primary Queries:**
- Find company by user
- Company search by name
- Filter by industry
- Featured/verified companies

**Indexes:**
```javascript
// User-company relationship
{ "userId": 1 }

// Company search
{ "name": 1 }

// Filtering
{ "industry": 1 }
{ "isVerified": -1 }
{ "isFeatured": -1 }

// Full-text search
{ "name": "text", "description": "text" }
```

### 4. User Profiles Collection (`user_profiles`)

**Primary Queries:**
- Find profile by user
- Matching queries (experience, salary, skills)
- Filter by completion status

**Indexes:**
```javascript
// User-profile relationship (unique)
{ "userId": 1 } - unique

// Matching queries
{ "matchingEnabled": 1 }
{ "isProfileComplete": 1 }
{ "experienceYears": 1 }
{ "expectedSalary": 1 }
{ "skills": 1 }

// Compound index for matching
{ "matchingEnabled": 1, "experienceYears": 1, "expectedSalary": 1 }
```

### 5. Job Applications Collection (`job_applications`)

**Primary Queries:**
- User's applications
- Job's applications
- Filter by status
- Prevent duplicate applications

**Indexes:**
```javascript
// User's applications
{ "userId": 1 }

// Job's applications
{ "jobId": 1 }

// Status filtering
{ "status": 1 }

// Sorting
{ "appliedAt": -1 }

// Prevent duplicates (unique compound)
{ "userId": 1, "jobId": 1 } - unique

// Job applications by status
{ "jobId": 1, "status": 1, "appliedAt": -1 }
```

### 6. Subscriptions Collection (`subscriptions`)

**Primary Queries:**
- User's subscriptions
- Active subscriptions
- Expiration checks

**Indexes:**
```javascript
// User's subscriptions
{ "userId": 1 }

// Active subscription queries
{ "isActive": 1 }

// Plan-based queries
{ "plan": 1 }

// Expiration checks
{ "endDate": 1 }

// Analytics
{ "createdAt": -1 }

// Active subscriptions by user
{ "userId": 1, "isActive": 1, "endDate": -1 }
```

### 7. Skills Collection (`skills`)

**Primary Queries:**
- Skill search by name
- Filter by category
- Popular skills

**Indexes:**
```javascript
// Skill name search
{ "name": 1 }

// Category filtering
{ "category": 1 }

// Popular skills
{ "usageCount": -1 }

// Full-text search
{ "name": "text", "description": "text" }
```

## Index Management

### Automatic Index Creation

Indexes are automatically created when the application starts via `MongoIndexConfig.java`.

### Manual Index Management

Use the admin endpoints to manage indexes:

```bash
# Get all indexes
GET /admin/mongo/indexes

# Get indexes for specific collection
GET /admin/mongo/indexes/jobs

# Validate indexes
GET /admin/mongo/indexes/validate

# Get index statistics
GET /admin/mongo/indexes/jobs/stats
```

### Performance Monitoring

Monitor index performance using:

1. **Health Check**: `/actuator/health/mongoIndexHealth`
2. **Index Statistics**: Admin endpoints
3. **MongoDB Compass**: Visual index analysis
4. **Application Logs**: Index creation and validation logs

## Best Practices

### 1. Query Patterns
- Always include `isActive: true` in job queries
- Use compound indexes for multi-field queries
- Leverage text indexes for search functionality

### 2. Index Maintenance
- Monitor index usage with MongoDB tools
- Remove unused indexes periodically
- Update indexes when query patterns change

### 3. Performance Considerations
- Limit the number of indexes (each index has overhead)
- Use selective indexes where possible
- Consider partial indexes for large collections

### 4. Development Guidelines
- Test queries with `explain()` to verify index usage
- Monitor slow queries in production
- Use appropriate sort orders in compound indexes

## Troubleshooting

### Common Issues

1. **Slow Queries**
   - Check if appropriate indexes exist
   - Verify query uses indexes with `explain()`
   - Consider adding compound indexes

2. **Index Creation Failures**
   - Check for duplicate key errors
   - Verify field names match entity definitions
   - Ensure sufficient disk space

3. **Memory Issues**
   - Monitor index size
   - Consider partial indexes for large datasets
   - Remove unused indexes

### Monitoring Commands

```javascript
// Check index usage
db.jobs.aggregate([{$indexStats: {}}])

// Explain query execution
db.jobs.find({isActive: true}).explain("executionStats")

// Check index sizes
db.stats()
```

## Future Considerations

1. **Sharding**: Plan for horizontal scaling
2. **Partial Indexes**: For large collections with sparse data
3. **TTL Indexes**: For time-based data cleanup
4. **Geospatial Indexes**: For location-based features
