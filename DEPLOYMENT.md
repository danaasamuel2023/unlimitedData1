# Deployment Guide for Render

## Quick Fix for Current Issue

The deployment error "Cannot find module '/opt/render/project/src/index.js'" occurs because Render is looking for the entry point in the wrong location. Multiple solutions have been provided:

1. **Updated `.render.yaml`** - Uses `rootDir: server` with `npm start`
2. **Root-level package.json** - Modified to handle server deployment from root
3. **Alternative configurations** - `.render-backup.yaml` and `.render-root.yaml`
4. **Deployment script** - `deploy.js` as alternative entry point
5. **Manual configuration options** - For Render dashboard setup

## Deployment Steps

### 1. Environment Variables Setup

Before deploying, make sure to set up these environment variables in your Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key_here
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

**Configuration A (Server Directory):**
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`

**Configuration B (Root Directory):**
- **Root Directory:** `.` (root)
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

### Option 2: Use Alternative Configuration Files
1. **For server directory approach:** Rename `.render-backup.yaml` to `.render.yaml`
2. **For root directory approach:** Rename `.render-root.yaml` to `.render.yaml`

### Option 3: Try Different Start Commands
Try these start commands in order:
1. `npm start` (uses root package.json)
2. `node index.js` (direct execution)
3. `npm run start-alt` (uses deploy.js script)
4. `node deploy.js` (alternative entry point)

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
