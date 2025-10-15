# Deployment Guide for Render

## Quick Fix for Current Issue

The deployment error occurs because Render is looking for a `package.json` file in the root directory. This has been fixed by:

1. Creating a root `package.json` file that handles the monorepo structure
2. Adding `rootDir: .` to the `.render.yaml` configuration
3. Providing an alternative backend-only deployment option

## Deployment Steps

### 1. Environment Variables Setup

Before deploying, make sure to set up these environment variables in your Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
MNOTIFY_API_KEY=your_mnotify_api_key
ARKESEL_API_KEY=your_arkesel_api_key
```

### 2. Render Configuration

The project now includes:
- Root `package.json` with proper build and start scripts
- `.render.yaml` configuration file
- Fixed server start script

### 3. Build Configuration

**Build Command:** `npm run build`
**Start Command:** `npm start`

### 4. What the Root package.json Does

- Installs dependencies for both client and server
- Builds the Next.js client application
- Starts the Node.js server

### 5. Deployment Process

1. Push your changes to your Git repository
2. Connect your repository to Render
3. Set the environment variables in Render dashboard
4. Deploy using the configuration in `.render.yaml`

## Alternative: Backend-Only Deployment

If you're still having issues with the monorepo approach, you can deploy just the backend:

### Option 1: Use .render-backend.yaml
1. Rename `.render-backend.yaml` to `.render.yaml`
2. This will deploy only the backend from the `server/` directory
3. **Root Directory:** `server/`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`

### Option 2: Manual Backend Deployment
- **Root Directory:** `server/`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Frontend Only Deployment (for static hosting)
- **Root Directory:** `Client/`
- **Build Command:** `npm run build`
- **Publish Directory:** `out` (if using static export)

## Troubleshooting

If you still encounter issues:

1. Check that all environment variables are set
2. Verify the MongoDB connection string
3. Ensure all API keys are valid
4. Check the Render logs for specific error messages

## Notes

- The current setup deploys the backend API
- The frontend (Next.js) can be deployed separately to Vercel or Netlify
- Make sure your MongoDB database is accessible from Render's servers
