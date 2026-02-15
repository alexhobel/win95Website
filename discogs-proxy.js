// Simple Discogs API Proxy Server
// Run with: node discogs-proxy.js
// This server handles OAuth and CORS for the Discogs API

import express from 'express';
import cors from 'cors';

const app = express();

// Discogs API credentials
const CONSUMER_KEY = 'wPKqrVaGRhFpxDxTcmoQ';
const CONSUMER_SECRET = 'iVmTbTVQGZespmarIBbIswMLLsplfkLy';
const DISCOGS_USERNAME = 'Alex_Hobel';
const DISCOGS_API_URL = 'https://api.discogs.com';

app.use(cors());
app.use(express.json());

// Proxy endpoint for Discogs release details
app.get('/api/discogs/release', async (req, res) => {
  try {
    const releaseId = req.query.id;
    
    if (!releaseId) {
      res.status(400).json({ error: 'Release ID is required' });
      return;
    }
    
    console.log('Proxy: Fetching Discogs release:', releaseId);
    
    // Build Discogs API URL for release details
    // According to Discogs API docs: GET /releases/{release_id}
    const url = `${DISCOGS_API_URL}/releases/${releaseId}?key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;
    
    console.log('Proxy: Discogs API URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RetroWebsite/1.0',
        'Accept': 'application/json',
      }
    });

    console.log('Proxy: Discogs API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Proxy: Discogs API Error:', response.status, errorText);
      throw new Error(`Discogs API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Proxy: Discogs API Success - Release data received');
    res.json(data);
  } catch (error) {
    console.error('Discogs release proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for Discogs collection
app.get('/api/discogs/collection', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const folderId = req.query.folderId || 0;
    
    // Build Discogs API URL - include sort and currency for value estimation
    const url = `${DISCOGS_API_URL}/users/${DISCOGS_USERNAME}/collection/folders/${folderId}/releases?page=${page}&per_page=50&sort=artist&sort_order=asc&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RetroWebsite/1.0',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Discogs API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Enhance releases with estimated values if available
    if (data.releases) {
      // Note: Discogs API may provide estimated_value in the release object
      // If not available, we can try fetching individual release details
      // For now, we'll return what the API provides
    }
    
    res.json(data);
  } catch (error) {
    console.error('Discogs proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Discogs proxy server running on http://localhost:${PORT}`);
  console.log(`Collection endpoint: http://localhost:${PORT}/api/discogs/collection`);
});
