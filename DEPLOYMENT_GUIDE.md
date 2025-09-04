# MyNexJob Deployment Guide - NO CORS ERRORS

## 🎯 **Zero CORS Strategy**

### Option 1: Deploy Backend First (Recommended)
1. **Deploy Backend** → Get backend URL
2. **Update vercel.json** → Point to backend URL
3. **Deploy Frontend** → No CORS errors!

### Option 2: Same Domain Deployment
Deploy both frontend and backend on the same platform (Railway/Render)

## 🚀 Frontend Deployment (Vercel)

### Step 1: Deploy Frontend
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `imadipal/MyNexJob`
3. Configure settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Environment Variables
Add these environment variables in Vercel:

```bash
# For Production (Different Origins - No CORS Issues)
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api/v1
VITE_ENVIRONMENT=production

# Examples for different platforms:
# Railway: https://careerblast-backend-production.up.railway.app/api/v1
# Render: https://careerblast-backend.onrender.com/api/v1
# Heroku: https://careerblast-backend.herokuapp.com/api/v1
```

## 🔧 Backend Deployment Options

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend folder
4. Add environment variables (MongoDB, AWS, etc.)

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `cd backend && ./gradlew build`

### Option 3: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create careerblast-backend`
3. Deploy: `git subtree push --prefix backend heroku main`

### Backend Environment Variables
Add these to your backend deployment platform:

```bash
# CORS Configuration (CRITICAL for No CORS Errors)
CORS_ALLOWED_ORIGINS=https://career-blast.vercel.app,https://career-blast-*.vercel.app,https://*.vercel.app

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRATION=86400000

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_REGION=your-region

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 🚨 CORS Configuration

### Backend CORS Setup (Spring Boot)
Add to your `SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "https://*.vercel.app",
        "http://localhost:*",
        "https://your-domain.com"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## 📋 Deployment Checklist

### Before Deployment:
- [ ] Backend CORS configured
- [ ] Environment variables set
- [ ] Database connection string updated
- [ ] AWS S3 credentials configured
- [ ] Razorpay keys added

### After Frontend Deployment:
- [ ] Update `VITE_API_BASE_URL` to backend URL
- [ ] Test API connections
- [ ] Verify file uploads work
- [ ] Check authentication flow

### Testing:
- [ ] Frontend loads without errors
- [ ] API calls work (check Network tab)
- [ ] No CORS errors in console
- [ ] Authentication works
- [ ] File uploads functional

## 🔍 Troubleshooting

### CORS Errors:
- Check browser console for specific error
- Verify backend CORS configuration
- Ensure API URL is correct
- Check if backend is running

### Build Errors:
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies are installed

### API Connection Issues:
- Check environment variables
- Verify backend is accessible
- Test API endpoints directly
