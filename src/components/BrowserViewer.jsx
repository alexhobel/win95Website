import { useState, useEffect, useRef } from 'react';
import { Toolbar, Button, Frame } from 'react95';
import PersonalWebsite from './PersonalWebsite';
import BusinessWebsite from './BusinessWebsite';
import browserIcon from '../assets/BrowserIcon.webp';
import './BrowserViewer.css';

const BrowserViewer = ({ onUrlChange }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [url, setUrl] = useState('http://alexanderhobelsberger.de/personal');
  const loadingIntervalRef = useRef(null);

  // Notify parent of URL changes
  useEffect(() => {
    if (onUrlChange) {
      onUrlChange(url);
    }
  }, [url, onUrlChange]);

  // Simulate loading state
  useEffect(() => {
    if (isLoading) {
      let progress = 0;
      
      // Reset progress in next tick to avoid synchronous setState
      setTimeout(() => {
        setLoadingProgress(0);
      }, 0);
      
      loadingIntervalRef.current = setInterval(() => {
        progress += Math.random() * 20 + 12; // Moderate progress: 12-32 per interval
        if (progress >= 100) {
          progress = 100;
          if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
          }
          setLoadingProgress(100);
          setTimeout(() => {
            setIsLoading(false);
          }, 200); // Moderate delay before showing content
        } else {
          setLoadingProgress(progress);
        }
      }, 80); // Moderate interval: 80ms

      return () => {
        if (loadingIntervalRef.current) {
          clearInterval(loadingIntervalRef.current);
          loadingIntervalRef.current = null;
        }
      };
    }
  }, [isLoading]);


  const handleRefresh = () => {
    setIsLoading(true);
    setLoadingProgress(0);
  };

  return (
    <div className="browser-viewer-container">
      {/* Toolbar */}
      <div className="browser-toolbar-container">
        <Toolbar className="browser-toolbar">
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">◀</span>
            <span className="toolbar-text">Back</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">▶</span>
            <span className="toolbar-text">Forward</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom" onClick={handleRefresh}>
            <span className="toolbar-icon">↻</span>
            <span className="toolbar-text">Refresh</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">⌂</span>
            <span className="toolbar-text">Home</span>
          </Button>
        </Toolbar>
      </div>

      {/* Tabs */}
      <div className="browser-tabs">
        <button
          className={`browser-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => {
            const newUrl = 'http://alexanderhobelsberger.de/personal';
            setActiveTab('personal');
            setUrl(newUrl);
            if (onUrlChange) {
              setTimeout(() => onUrlChange(newUrl), 0);
            }
            // Don't show loading when switching tabs after initial load
          }}
        >
          <span className="tab-icon">🎵</span>
          <span className="tab-text">Personal</span>
          {activeTab === 'personal' && <span className="tab-close">×</span>}
        </button>
        <button
          className={`browser-tab ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => {
            const newUrl = 'http://alexanderhobelsberger.de/business';
            setActiveTab('business');
            setUrl(newUrl);
            if (onUrlChange) {
              setTimeout(() => onUrlChange(newUrl), 0);
            }
            // Don't show loading when switching tabs after initial load
          }}
        >
          <span className="tab-icon">💼</span>
          <span className="tab-text">Business</span>
          {activeTab === 'business' && <span className="tab-close">×</span>}
        </button>
      </div>

      {/* Address Bar */}
      <div className="browser-address-bar">
        <label className="address-label">Address:</label>
        <input 
          type="text" 
          className="address-input" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleRefresh();
            }
          }}
        />
        <Button size="sm" onClick={handleRefresh}>Go</Button>
      </div>

      {/* Content Area */}
      <div className="browser-content">
        {isLoading ? (
          <div className="browser-loading">
            <div className="ie-loading-container">
              <div className="ie-logo-container">
                <img src={browserIcon} alt="Internet Explorer" className="ie-browser-icon" />
              </div>
              <div className="ie-loading-text">Opening page...</div>
              <div className="ie-progress-container">
                <div className="ie-progress-bar" style={{ width: `${loadingProgress}%` }}>
                  <div className="ie-progress-segments">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="ie-progress-segment"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ie-status-text">
                {loadingProgress < 100 ? `Loading ${Math.round(loadingProgress)}%...` : 'Done'}
              </div>
            </div>
          </div>
        ) : (
          activeTab === 'personal' ? <PersonalWebsite /> : <BusinessWebsite />
        )}
      </div>

      {/* Status Bar */}
      <Frame variant="well" className="browser-status-bar">
        <div className="status-left">
          {isLoading ? 'Loading...' : ''}
        </div>
        <div className="status-right">
          <span className="status-icon">🌐</span>
          <span className="status-text">Internet</span>
          <span className="status-time">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </Frame>
    </div>
  );
};

export default BrowserViewer;

