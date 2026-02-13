// Vercel Serverless Function for Discogs API Proxy
// This replaces the localhost proxy server for production

// Discogs API credentials
const CONSUMER_KEY = 'wPKqrVaGRhFpxDxTcmoQ';
const CONSUMER_SECRET = 'iVmTbTVQGZespmarIBbIswMLLsplfkLy';
const DISCOGS_USERNAME = 'Alex_Hobel';
const DISCOGS_API_URL = 'https://api.discogs.com';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Discogs API error:', error);
    res.status(500).json({ error: error.message });
  }
}

