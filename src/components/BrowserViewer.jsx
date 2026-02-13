import { useState, useEffect, useRef } from 'react';
import { Toolbar, Button, Frame } from 'react95';
import RetroWebsite from './RetroWebsite';
import browserIcon from '../assets/BrowserIcon.webp';
import './BrowserViewer.css';

const BrowserViewer = ({ onUrlChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [url, setUrl] = useState('http://alexanderhobelsberger.de');
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
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
          }
          setLoadingProgress(100);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        } else {
          setLoadingProgress(progress);
        }
      }, 100);

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

  const handleStop = () => {
    setIsLoading(false);
    setLoadingProgress(0);
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  return (
    <div className="browser-viewer-container">
      {/* Menu Bar */}
      <Toolbar className="browser-menu-bar">
        <Button variant="menu" size="sm">File</Button>
        <Button variant="menu" size="sm">Edit</Button>
        <Button variant="menu" size="sm">View</Button>
        <Button variant="menu" size="sm">Favorites</Button>
        <Button variant="menu" size="sm">Tools</Button>
        <Button variant="menu" size="sm" style={{ marginLeft: 'auto' }}>?</Button>
      </Toolbar>

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
          <Button size="sm" className="toolbar-button-custom" onClick={handleStop}>
            <span className="toolbar-icon">■</span>
            <span className="toolbar-text">Stop</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom" onClick={handleRefresh}>
            <span className="toolbar-icon">↻</span>
            <span className="toolbar-text">Refresh</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">⌂</span>
            <span className="toolbar-text">Home</span>
          </Button>
          <div className="toolbar-separator"></div>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">🔍</span>
            <span className="toolbar-text">Search</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">⭐</span>
            <span className="toolbar-text">Favorites</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">🕐</span>
            <span className="toolbar-text">History</span>
          </Button>
          <div className="toolbar-separator"></div>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">✉</span>
            <span className="toolbar-text">Mail</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom">
            <span className="toolbar-icon">🖨</span>
            <span className="toolbar-text">Print</span>
          </Button>
        </Toolbar>
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
          <RetroWebsite />
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

