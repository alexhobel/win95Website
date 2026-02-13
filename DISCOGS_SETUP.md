# Discogs API Setup Instructions

## Quick Start

1. **Install backend dependencies:**
   ```bash
   npm install express cors
   ```

2. **Start the proxy server:**
   ```bash
   node discogs-proxy.js
   ```
   The server will run on `http://localhost:3001`

3. **Start your frontend (in a separate terminal):**
   ```bash
   npm run dev
   ```

## How It Works

The Discogs API requires OAuth authentication and has CORS restrictions. To work around this:

1. **Backend Proxy Server** (`discogs-proxy.js`):
   - Runs on port 3001
   - Handles OAuth authentication with Discogs
   - Proxies requests from your frontend to Discogs API
   - Adds CORS headers so your frontend can access it

2. **Frontend Component** (`VinylCollection.jsx`):
   - Makes requests to your local proxy server
   - Displays your vinyl collection in a retro style

## API Credentials

Your Discogs API credentials are stored in `discogs-proxy.js`:
- Consumer Key: `wPKqrVaGRhFpxDxTcmoQ`
- Consumer Secret: `iVmTbTVQGZespmarIBbIswMLLsplfkLy`
- Username: `Alex_Hobel`

## Troubleshooting

- **CORS errors**: Make sure the proxy server is running on port 3001
- **401/403 errors**: Check that your API credentials are correct
- **No data**: Verify your Discogs username is correct and you have records in your collection

## Production Deployment

For production, you'll need to:
1. Deploy the proxy server (e.g., on Heroku, Vercel, or your own server)
2. Update the `PROXY_URL` in `VinylCollection.jsx` to point to your deployed proxy
3. Consider using environment variables for API credentials

