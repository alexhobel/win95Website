// Vercel Serverless Function for Discogs Release Details
// GET /api/discogs/release?id={release_id}

// Discogs API credentials
const CONSUMER_KEY = 'wPKqrVaGRhFpxDxTcmoQ';
const CONSUMER_SECRET = 'iVmTbTVQGZespmarIBbIswMLLsplfkLy';
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
    const releaseId = req.query.id;

    if (!releaseId) {
      res.status(400).json({ error: 'Release ID is required' });
      return;
    }

    console.log('Fetching Discogs release:', releaseId);

    // Build Discogs API URL for release details
    // According to Discogs API docs: GET /releases/{release_id}
    const url = `${DISCOGS_API_URL}/releases/${releaseId}?key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;
    
    console.log('Discogs API URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RetroWebsite/1.0',
        'Accept': 'application/json',
      }
    });

    console.log('Discogs API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discogs API Error:', response.status, errorText);
      throw new Error(`Discogs API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Discogs API Success - Release data received');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Discogs release API error:', error);
    res.status(500).json({ error: error.message });
  }
}

