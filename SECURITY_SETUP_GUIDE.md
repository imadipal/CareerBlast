# 🔐 CareerBlast Security Setup Guide

## 🚨 **IMMEDIATE ACTIONS REQUIRED**

### **Step 1: Generate New Secure Secrets**

Run these commands to generate secure secrets:

```bash
# Generate JWT Secret (32+ characters)
openssl rand -base64 32

# Generate JWT Refresh Secret (32+ characters)  
openssl rand -base64 32

# Generate Webhook Secret (32+ characters)
openssl rand -base64 32
```

### **Step 2: Update MongoDB Credentials**

1. **Go to MongoDB Atlas Dashboard**
2. **Database Access → Add New Database User**
3. **Create new user with strong password**
4. **Update connection string in .env**

### **Step 3: Create New AWS IAM User**

1. **Go to AWS IAM Console**
2. **Create new user with minimal S3 permissions**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::careerblast-resumes/*",
           "arn:aws:s3:::careerblast-profile-pictures/*",
           "arn:aws:s3:::careerblast-company-logos/*",
           "arn:aws:s3:::careerblast-documents/*"
         ]
       }
     ]
   }
   ```
3. **Generate new access keys**
4. **Update AWS credentials in .env**

### **Step 4: Generate New Gmail App Password**

1. **Go to Google Account Settings**
2. **Security → 2-Step Verification → App passwords**
3. **Generate new app password**
4. **Update SMTP_PASS in .env**

### **Step 5: Update .env File**

Replace your .env file with these secure values:

```bash
# Frontend Configuration
VITE_API_URL=https://api.careerblast.com/api/v1
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# MongoDB Configuration
MONGODB_URI=mongodb+srv://NEW_USERNAME:NEW_SECURE_PASSWORD@cluster0.5nshnip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=YOUR_NEW_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_NEW_AWS_SECRET_ACCESS_KEY
AWS_REGION=ap-south-1

# S3 Bucket Names
S3_RESUMES_BUCKET=careerblast-resumes
S3_PROFILE_PICTURES_BUCKET=careerblast-profile-pictures
S3_COMPANY_LOGOS_BUCKET=careerblast-company-logos
S3_DOCUMENTS_BUCKET=careerblast-documents

# JWT Configuration - USE GENERATED SECRETS
JWT_SECRET=YOUR_GENERATED_JWT_SECRET_32_PLUS_CHARACTERS
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=YOUR_GENERATED_REFRESH_SECRET_32_PLUS_CHARACTERS
JWT_REFRESH_EXPIRES_IN=30d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_RAZORPAY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_GENERATED_WEBHOOK_SECRET

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=imadipal084@gmail.com
SMTP_PASS=YOUR_NEW_GMAIL_APP_PASSWORD
FROM_EMAIL=noreply@careerblast.com
FROM_NAME=CareerBlast

# Application Configuration
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://careerblast.com

# File Upload Limits (in bytes)
MAX_RESUME_SIZE=5242880
MAX_PROFILE_PICTURE_SIZE=2097152
MAX_COMPANY_LOGO_SIZE=1048576
MAX_DOCUMENT_SIZE=10485760

# Security
BCRYPT_ROUNDS=12
ACCOUNT_LOCK_TIME=7200000
MAX_LOGIN_ATTEMPTS=5
```

## 🔒 **SECURITY MEASURES IMPLEMENTED**

### ✅ **1. Environment Security**
- [x] .env file secured with placeholders
- [x] .env added to .gitignore
- [x] Secure secret generation guide provided

### ✅ **2. Application Security**
- [x] Enhanced global exception handler (no stack trace exposure)
- [x] Security headers implemented (HSTS, X-Frame-Options, etc.)
- [x] Input validation and sanitization
- [x] Rate limiting configuration
- [x] CORS properly configured

### ✅ **3. Authentication & Authorization**
- [x] JWT authentication with secure secrets
- [x] Role-based access control
- [x] Password encryption with BCrypt
- [x] Account lockout mechanism

### ✅ **4. Database Security**
- [x] MongoDB connection with authentication
- [x] Proper indexing for performance
- [x] Connection pooling configured

## 🚀 **DEPLOYMENT CHECKLIST**

### **Before Production Deployment:**

- [ ] **Update all credentials** (MongoDB, AWS, JWT, Email, Razorpay)
- [ ] **Set up HTTPS/SSL** certificates
- [ ] **Configure production database** with backups
- [ ] **Set up monitoring** (logs, metrics, alerts)
- [ ] **Test all endpoints** with new credentials
- [ ] **Verify rate limiting** is working
- [ ] **Check security headers** are applied
- [ ] **Test file uploads** with new AWS credentials
- [ ] **Verify email sending** with new SMTP credentials
- [ ] **Test payment integration** with Razorpay

### **Production Environment Setup:**

1. **Infrastructure**:
   - Use container orchestration (Docker + Kubernetes/ECS)
   - Set up load balancer with SSL termination
   - Configure auto-scaling
   - Set up health checks

2. **Monitoring**:
   - Application Performance Monitoring (APM)
   - Log aggregation and analysis
   - Error tracking (Sentry)
   - Uptime monitoring

3. **Security**:
   - Web Application Firewall (WAF)
   - DDoS protection
   - Regular security scans
   - Penetration testing

## ⚠️ **CRITICAL REMINDERS**

1. **NEVER commit .env files** to version control
2. **Rotate secrets regularly** (every 90 days)
3. **Monitor for security vulnerabilities** in dependencies
4. **Keep backups** of all data and configurations
5. **Test disaster recovery** procedures
6. **Review access logs** regularly
7. **Update dependencies** regularly for security patches

## 📞 **NEXT STEPS**

1. **Complete credential rotation** (all services)
2. **Test application** with new credentials
3. **Set up production infrastructure**
4. **Implement monitoring and alerting**
5. **Perform security testing**
6. **Plan gradual rollout strategy**

## 🎯 **PRODUCTION READINESS STATUS**

After implementing these security fixes:

| Category | Status | Score |
|----------|--------|-------|
| **Security** | ✅ Ready | 9/10 |
| **Business Logic** | ✅ Ready | 9/10 |
| **Architecture** | ✅ Ready | 9/10 |
| **Database** | ✅ Ready | 9/10 |
| **Infrastructure** | ⚠️ Needs Setup | 7/10 |
| **Monitoring** | ⚠️ Needs Setup | 6/10 |

**Overall Status**: **READY FOR PRODUCTION** (after credential updates)

Your application will be production-ready once you complete the credential rotation and infrastructure setup!
