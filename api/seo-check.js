/* global process */
// Vercel Serverless Function for SEO/GEO Website Analysis
// Analyzes a website's SEO metrics and returns a detailed report

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
      // Create timeout using AbortController for better compatibility
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

    // Parse HTML (simple regex-based parsing for serverless compatibility)
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
}

export function analyzeSEO(html, url) {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  const titleLength = title ? title.length : 0;

  // Extract meta description - handle both single and double quotes, and HTML entities
  const metaDescMatch = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*content\s*=\s*["']([^"']+)["'][^>]*name\s*=\s*["']description["']/i);
  let metaDescription = null;
  if (metaDescMatch) {
    metaDescription = metaDescMatch[1]
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
    if (metaDescription.length === 0) metaDescription = null;
  }
  const descriptionLength = metaDescription ? metaDescription.length : 0;

  // Extract meta keywords
  const metaKeywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
  const metaKeywords = metaKeywordsMatch ? metaKeywordsMatch[1].trim() : null;

  // Extract Open Graph tags
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;

  const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  const ogDescription = ogDescriptionMatch ? ogDescriptionMatch[1].trim() : null;

  // Count headings - handle multiline and nested content
  const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  const h1Count = h1Matches ? h1Matches.length : 0;
  let h1Text = null;
  if (h1Matches && h1Matches.length > 0) {
    h1Text = h1Matches[0]
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    if (h1Text.length === 0) h1Text = null;
  }

  const h2Matches = html.match(/<h2[^>]*>/gi);
  const h2Count = h2Matches ? h2Matches.length : 0;

  const h3Matches = html.match(/<h3[^>]*>/gi);
  const h3Count = h3Matches ? h3Matches.length : 0;

  // Calculate SEO score (0-100)
  let score = 0;
  const recommendations = [];

  if (title) {
    score += 20;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 10;
    } else {
      recommendations.push(titleLength < 30 
        ? 'Title is too short (recommended: 30-60 characters)'
        : 'Title is too long (recommended: 30-60 characters)');
    }
  } else {
    recommendations.push('Add a title tag to your website');
  }

  if (metaDescription) {
    score += 20;
    if (descriptionLength >= 120 && descriptionLength <= 160) {
      score += 10;
    } else {
      recommendations.push(descriptionLength < 120
        ? 'Meta description is too short (recommended: 120-160 characters)'
        : 'Meta description is too long (recommended: 120-160 characters)');
    }
  } else {
    recommendations.push('Add a meta description tag');
  }

  if (h1Count === 1) {
    score += 15;
  } else if (h1Count === 0) {
    recommendations.push('Add exactly one H1 tag to your page');
  } else {
    recommendations.push('Use only one H1 tag per page');
  }

  if (h2Count > 0) {
    score += 5;
  }

  if (ogTitle && ogDescription) {
    score += 15;
  } else {
    recommendations.push('Add Open Graph tags (og:title and og:description) for better social media sharing');
  }

  if (metaKeywords) {
    recommendations.push('Meta keywords tag is deprecated and not recommended for modern SEO');
  }

  // Ensure score doesn't exceed 100
  score = Math.min(score, 100);

  return {
    url,
    title,
    titleLength,
    metaDescription,
    descriptionLength,
    metaKeywords,
    ogTitle,
    ogDescription,
    h1Count,
    h1Text,
    h2Count,
    h3Count,
    seoScore: score,
    recommendations,
  };
}

