# Render Dashboard Configuration

## Manual Configuration Steps

If the `.render.yaml` file doesn't work automatically, configure these settings manually in your Render dashboard:

### Service Settings
- **Name:** `senyokwame-backend`
- **Environment:** `Node`
- **Region:** Choose your preferred region
- **Branch:** `main`
- **Root Directory:** `server`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Environment Variables
Add these environment variables in your Render dashboard:

```
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

### Important Notes
1. **Root Directory MUST be set to `server`** - This is crucial!
2. **Build Command should be `npm install`** (not `npm run build`)
3. **Start Command should be `npm start`**
4. Make sure all environment variables are set before deploying

### Troubleshooting
- If you still get path errors, double-check the Root Directory setting
- Ensure your MongoDB URI is accessible from Render's servers
- Verify all API keys are valid and active
