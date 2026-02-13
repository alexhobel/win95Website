import { useState } from 'react';
import { TextInput, Button } from 'react95';
import './SEOGeoChecker.css';

const SEOGeoChecker = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    let checkUrl = url.trim();
    if (!checkUrl.startsWith('http://') && !checkUrl.startsWith('https://')) {
      checkUrl = 'https://' + checkUrl;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      const response = await fetch('/api/seo-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: checkUrl }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to analyze website';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      setAnalysis(data);
      setError(null);
    } catch (err) {
      console.error('SEO check error:', err);
      setError(err.message || 'An error occurred while checking the website. Please check the URL and try again.');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="seo-checker-container">
      {/* Menu Bar */}
      <div className="seo-menu-bar">
        <button className="menu-item">File</button>
        <button className="menu-item">Edit</button>
        <button className="menu-item">View</button>
        <button className="menu-item">Tools</button>
        <button className="menu-item">Help</button>
      </div>

      {/* Toolbar */}
      <div className="seo-toolbar">
        <button className="toolbar-button" title="New Check">
          <span className="toolbar-icon">📄</span>
        </button>
        <button className="toolbar-button" title="Save Report">
          <span className="toolbar-icon">💾</span>
        </button>
        <button className="toolbar-button" title="Print">
          <span className="toolbar-icon">🖨</span>
        </button>
        <div className="toolbar-separator"></div>
        <button className="toolbar-button" title="Refresh">
          <span className="toolbar-icon">↻</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="seo-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="section-header">
            <h2 className="section-title">🔍 SEO/GEO Website Analyzer</h2>
          </div>
          <div className="input-group">
            <label className="input-label">Website URL:</label>
            <div className="url-input-container">
              <TextInput
                variant="flat"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com"
                className="url-input"
                fullWidth
                disabled={loading}
              />
              <Button 
                onClick={handleCheck}
                disabled={loading || !url.trim()}
                className="check-button"
              >
                {loading ? 'Analyzing...' : '🔍 Analyze'}
              </Button>
            </div>
            <div className="input-hint">
              Enter a website URL to analyze SEO and GEO metrics
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="analysis-section">
            <div className="section-header">
              <h2 className="section-title">📊 Analysis Results</h2>
            </div>

            {/* Basic Info */}
            <div className="result-group">
              <h3 className="result-title">Basic Information</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">URL:</span>
                  <span className="result-value">{analysis.url}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Title:</span>
                  <span className={`result-value ${!analysis.title ? 'missing' : ''}`}>
                    {analysis.title || '❌ Missing'}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Title Length:</span>
                  <span className={`result-value ${analysis.titleLength < 30 || analysis.titleLength > 60 ? 'warning' : 'good'}`}>
                    {analysis.titleLength} characters {analysis.titleLength < 30 ? '(too short)' : analysis.titleLength > 60 ? '(too long)' : '(optimal)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="result-group">
              <h3 className="result-title">Meta Tags</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Meta Description:</span>
                  <span className={`result-value ${!analysis.metaDescription ? 'missing' : ''}`}>
                    {analysis.metaDescription || '❌ Missing'}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Description Length:</span>
                  <span className={`result-value ${analysis.descriptionLength < 120 || analysis.descriptionLength > 160 ? 'warning' : 'good'}`}>
                    {analysis.descriptionLength} characters {analysis.descriptionLength < 120 ? '(too short)' : analysis.descriptionLength > 160 ? '(too long)' : '(optimal)'}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Meta Keywords:</span>
                  <span className={`result-value ${!analysis.metaKeywords ? 'missing' : 'info'}`}>
                    {analysis.metaKeywords || '⚠️ Not recommended (modern SEO)'}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Open Graph Title:</span>
                  <span className={`result-value ${!analysis.ogTitle ? 'missing' : ''}`}>
                    {analysis.ogTitle || '❌ Missing'}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Open Graph Description:</span>
                  <span className={`result-value ${!analysis.ogDescription ? 'missing' : ''}`}>
                    {analysis.ogDescription || '❌ Missing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Headings */}
            <div className="result-group">
              <h3 className="result-title">Headings Structure</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">H1 Tags:</span>
                  <span className={`result-value ${analysis.h1Count === 0 ? 'missing' : analysis.h1Count > 1 ? 'warning' : 'good'}`}>
                    {analysis.h1Count} {analysis.h1Count === 0 ? '(missing)' : analysis.h1Count > 1 ? '(multiple - not ideal)' : '(good)'}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">H2 Tags:</span>
                  <span className="result-value">{analysis.h2Count}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">H3 Tags:</span>
                  <span className="result-value">{analysis.h3Count}</span>
                </div>
                {analysis.h1Text && (
                  <div className="result-item full-width">
                    <span className="result-label">H1 Text:</span>
                    <span className="result-value">{analysis.h1Text}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Score */}
            <div className="result-group">
              <h3 className="result-title">SEO Score</h3>
              <div className="score-container">
                <div className="score-circle" style={{ '--score': analysis.seoScore }}>
                  <span className="score-number">{analysis.seoScore}</span>
                  <span className="score-label">/100</span>
                </div>
                <div className="score-details">
                  <div className="score-item">
                    <span className="score-item-label">Title Tag:</span>
                    <span className={`score-item-value ${analysis.title ? 'good' : 'bad'}`}>
                      {analysis.title ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-item-label">Meta Description:</span>
                    <span className={`score-item-value ${analysis.metaDescription ? 'good' : 'bad'}`}>
                      {analysis.metaDescription ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-item-label">H1 Tag:</span>
                    <span className={`score-item-value ${analysis.h1Count === 1 ? 'good' : 'bad'}`}>
                      {analysis.h1Count === 1 ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-item-label">Open Graph:</span>
                    <span className={`score-item-value ${analysis.ogTitle && analysis.ogDescription ? 'good' : 'bad'}`}>
                      {analysis.ogTitle && analysis.ogDescription ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="result-group">
                <h3 className="result-title">💡 Recommendations</h3>
                <ul className="recommendations-list">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="recommendation-item">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="seo-status-bar">
        <span>{loading ? 'Analyzing website...' : analysis ? 'Analysis complete' : 'Ready'}</span>
      </div>
    </div>
  );
};

export default SEOGeoChecker;

