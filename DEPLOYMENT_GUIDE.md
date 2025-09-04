# CareerBlast Deployment Guide

## 🚀 Frontend Deployment (Vercel)

### Step 1: Deploy Frontend
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `imadipal/CareerBlast`
3. Configure settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Environment Variables
Add these environment variables in Vercel:

```bash
# For Development (Backend running locally)
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENVIRONMENT=development

# For Production (When backend is deployed)
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
VITE_ENVIRONMENT=production
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
