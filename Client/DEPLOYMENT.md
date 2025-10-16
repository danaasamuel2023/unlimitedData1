# Frontend Deployment Guide

## Pre-Deployment Checklist

### ✅ Completed Tasks

1. **Dependencies Installed**: All npm packages are installed and up to date
2. **Build Configuration**: Next.js config optimized for production
3. **Environment Variables**: Template created with required variables
4. **Security Headers**: Configured in next.config.mjs
5. **Build Test**: Successfully built locally (46 pages generated)
6. **Performance Optimizations**: Compression, image optimization, and standalone output enabled

### 🔧 Configuration Files

#### next.config.mjs
- Standalone output for Render compatibility
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Image optimization with WebP/AVIF support
- Compression enabled
- Powered-by header removed

#### package.json
- Production build scripts added
- Bundle analyzer script available
- Type checking script added

#### Environment Variables Required
```env
NEXT_PUBLIC_API_URL=https://unlimiteddatagh.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://unlimiteddatagh.onrender.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_APP_NAME=DataHustle
NEXT_PUBLIC_APP_URL=https://www.datahustle.shop
```

## Deployment Steps

### For Render.com

1. **Create Static Site**:
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your repository

2. **Configure Build Settings**:
   - **Build Command**: `cd Client && npm install && npm run build`
   - **Publish Directory**: `Client/out` (if using export) or `Client/.next` (for standalone)
   - **Node Version**: 18.x or higher

3. **Environment Variables**:
   - Add all NEXT_PUBLIC_* variables in Render dashboard
   - Ensure API URLs point to your backend

4. **Custom Domain** (Optional):
   - Add your custom domain in Render settings
   - Configure DNS records as instructed

### For Vercel

1. **Import Project**:
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `Client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables**:
   - Add all environment variables in Vercel dashboard

### For Netlify

1. **Deploy Settings**:
   - **Base Directory**: `Client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `Client/out` (for static export) or `Client/.next/standalone` (for standalone)

2. **Environment Variables**:
   - Add in Site settings → Environment variables

## Build Analysis

### Current Build Stats
- **Total Pages**: 46 pages generated
- **Largest Page**: `/payment/callback` (40.2 kB)
- **Shared JS**: 102 kB
- **Build Time**: ~45 seconds

### Performance Recommendations

1. **Code Splitting**: Already implemented by Next.js
2. **Image Optimization**: Configured for WebP/AVIF
3. **Compression**: Enabled in next.config.mjs
4. **Security**: Headers configured

## Monitoring & Maintenance

### Post-Deployment

1. **Test All Routes**: Ensure all 46 pages load correctly
2. **Check API Connections**: Verify backend connectivity
3. **Monitor Performance**: Use tools like Lighthouse
4. **Security Scan**: Run security checks

### Performance Monitoring

- Use Next.js Analytics (if enabled)
- Monitor Core Web Vitals
- Check bundle size regularly
- Monitor API response times

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**:
   - Ensure all NEXT_PUBLIC_* variables are set
   - Check variable names match exactly

3. **API Connection Issues**:
   - Verify API URLs are correct
   - Check CORS settings on backend
   - Ensure backend is running

### Security Considerations

- All environment variables are client-side (NEXT_PUBLIC_*)
- No sensitive data should be in frontend environment
- Security headers are configured
- XSS protection enabled

## Rollback Plan

1. **Previous Deployment**: Keep previous successful deployment
2. **Database**: No database changes in frontend
3. **Environment**: Keep environment variable backups
4. **Monitoring**: Set up alerts for deployment failures

## Next Steps

1. Set up CI/CD pipeline
2. Configure monitoring and alerts
3. Set up staging environment
4. Implement automated testing
5. Configure CDN for static assets
