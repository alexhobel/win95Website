import { useState, useEffect } from 'react';
import { TextInput, Button, ProgressBar, ScrollView, Frame } from 'react95';
import './SEOGeoChecker.css';

const SEOGeoChecker = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
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
        } catch {
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

  // Simulate loading progress using react95 ProgressBar pattern
  useEffect(() => {
    if (!loading) return;
    
    let timer;
    let timeoutId;
    
    timer = setInterval(() => {
      setLoadingProgress(previousPercent => {
        if (previousPercent >= 100) {
          // Keep at 100 until loading completes
          return 100;
        }
        const diff = Math.random() * 15 + 5; // 5-20 per interval
        return Math.min(previousPercent + diff, 100);
      });
    }, 100); // 100ms intervals
    
    return () => {
      if (timer) clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  // Reset progress when loading starts
  useEffect(() => {
    if (loading) {
      setLoadingProgress(0);
    } else {
      // Reset progress when loading completes
      setLoadingProgress(0);
    }
  }, [loading]);

  return (
    <div className="seo-checker-container">
     

      {/* Toolbar */}
      <div className="seo-toolbar">
        <Button className="toolbar-button" title="Save Report" disabled>
          <span className="toolbar-icon">Safe</span>
        </Button>
        <Button className="toolbar-button" title="Print" disabled>
          <span className="toolbar-icon">Print</span>
        </Button>
        <div className="toolbar-separator"></div>
        <Button className="toolbar-button" title="Refresh" disabled>
          <span className="toolbar-icon" >↻</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="seo-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ScrollView style={{ width: '100%', flex: 1, minHeight: 0 }}>
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

          {/* Loading Progress Bar */}
          {loading && (
            <div className="loading-section" style={{ margin: '20px 0', padding: '20px', background: '#ffffff', border: '2px inset #c0c0c0' }}>
              <div style={{ marginBottom: '10px', fontSize: '11px', color: '#000', fontFamily: 'MS Sans Serif, sans-serif' }}>
                Analyzing website...
              </div>
              <div style={{ width: '100%', maxWidth: '500px' }}>
                <ProgressBar value={Math.floor(loadingProgress)} style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="analysis-section" style={{ marginTop: '1rem' }}>
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
        </ScrollView>
      </div>

      {/* Status Bar */}
      <Frame variant="well" style={{ padding: '0.1rem 0.25rem', marginTop: '0.5rem' }}>
        <span>{loading ? 'Analyzing website...' : analysis ? 'Analysis complete' : 'Ready'}</span>
      </Frame>
    </div>
  );
};

export default SEOGeoChecker;

