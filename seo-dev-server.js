// Development server for SEO checker API
// Run this with: node seo-dev-server.js
// Then access the API at http://localhost:3002/api/seo-check

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3002;

// Enable CORS
app.use(cors());
app.use(express.json());

// Import the analyzeSEO function directly
import { analyzeSEO } from './api/seo-check.js';

// SEO check endpoint
app.post('/api/seo-check', async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    // Validate URL
    let targetUrl;
    try {
      targetUrl = new URL(url);
    } catch {
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    // Fetch the website HTML
    let html;
    try {
      // Create timeout using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const fetchResponse = await fetch(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status} - ${fetchResponse.statusText}`);
      }

      html = await fetchResponse.text();
      
      if (!html || html.length === 0) {
        throw new Error('Website returned empty content');
      }
    } catch (fetchError) {
      // Handle CORS, network, or timeout errors
      if (fetchError.name === 'AbortError' || fetchError.message.includes('aborted')) {
        throw new Error('Request timed out. The website may be slow or unreachable.');
      }
      if (fetchError.message.includes('CORS') || fetchError.message.includes('Failed to fetch') || fetchError.message.includes('fetch failed')) {
        throw new Error('Cannot access website. Some websites block automated requests or require authentication.');
      }
      if (fetchError.message.includes('Invalid URL') || fetchError.message.includes('URL')) {
        throw new Error('Invalid URL format. Please include http:// or https://');
      }
      throw new Error(`Failed to fetch website: ${fetchError.message}`);
    }

    // Parse HTML
    const analysis = analyzeSEO(html, targetUrl.toString());

    res.status(200).json(analysis);
  } catch (error) {
    console.error('SEO check error:', error);
    const errorMessage = error.message || 'Failed to analyze website';
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Handle OPTIONS preflight
app.options('/api/seo-check', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`SEO Dev Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/seo-check`);
});

