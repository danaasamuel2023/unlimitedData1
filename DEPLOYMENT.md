# Deployment Guide for Render

## Quick Fix for Current Issue

The deployment error "Cannot find module '/opt/render/project/src/index.js'" occurs because Render is looking for the entry point in the wrong location. This has been fixed by:

1. Updated `.render.yaml` to use `rootDir: server` and `startCommand: node index.js`
2. Added proper `main` field to `server/package.json`
3. Provided alternative deployment configurations
4. Created backup configuration file `.render-backup.yaml`

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

If you still encounter the "Cannot find module" error:

### Option 1: Manual Configuration in Render Dashboard
Instead of using `.render.yaml`, configure manually in Render dashboard:
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`

### Option 2: Use Backup Configuration
1. Rename `.render-backup.yaml` to `.render.yaml`
2. This uses the same configuration but with a different service name

### Option 3: Alternative Start Command
Try these start commands in order:
1. `node index.js` (current)
2. `npm start`
3. `node server/index.js`

### General Troubleshooting
1. Check that all environment variables are set
2. Verify the MongoDB connection string
3. Ensure all API keys are valid
4. Check the Render logs for specific error messages
5. Verify that `server/index.js` exists and is the correct entry point

## Notes

- The current setup deploys the backend API
- The frontend (Next.js) can be deployed separately to Vercel or Netlify
- Make sure your MongoDB database is accessible from Render's servers
