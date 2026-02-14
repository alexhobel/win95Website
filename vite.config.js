import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite plugin to handle SEO check API route
function seoCheckPlugin() {
  return {
    name: 'seo-check-api',
    configureServer(server) {
      server.middlewares.use('/api/seo-check', async (req, res, next) => {
        // Only handle POST requests
        if (req.method !== 'POST') {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 200;
            res.end();
            return;
          }
          return next();
        }

        try {
          // Read request body
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const { url } = JSON.parse(body);

              if (!url) {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'URL is required' }));
                return;
              }

              // Validate URL
              let targetUrl;
              try {
                targetUrl = new URL(url);
              } catch {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid URL format' }));
                return;
              }

              // Fetch the website HTML
              let html;
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

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
                let errorMessage = 'Failed to fetch website';
                if (fetchError.name === 'AbortError' || fetchError.message.includes('aborted')) {
                  errorMessage = 'Request timed out. The website may be slow or unreachable.';
                } else if (fetchError.message.includes('CORS') || fetchError.message.includes('Failed to fetch') || fetchError.message.includes('fetch failed')) {
                  errorMessage = 'Cannot access website. Some websites block automated requests or require authentication.';
                } else if (fetchError.message.includes('Invalid URL') || fetchError.message.includes('URL')) {
                  errorMessage = 'Invalid URL format. Please include http:// or https://';
                } else {
                  errorMessage = `Failed to fetch website: ${fetchError.message}`;
                }
                
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.statusCode = 500;
                res.end(JSON.stringify({ error: errorMessage }));
                return;
              }

              // Import and use analyzeSEO function
              const apiPath = new URL('./api/seo-check.js', import.meta.url).href;
              const { analyzeSEO } = await import(apiPath);
              const analysis = analyzeSEO(html, targetUrl.toString());

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 200;
              res.end(JSON.stringify(analysis));
            } catch (error) {
              console.error('SEO check error:', error);
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.statusCode = 500;
              res.end(JSON.stringify({ 
                error: error.message || 'Failed to analyze website'
              }));
            }
          });
        } catch (error) {
          console.error('Request parsing error:', error);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to process request' }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoCheckPlugin()],
})
