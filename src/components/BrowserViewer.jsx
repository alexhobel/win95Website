import { useState, useEffect } from 'react';
import { Toolbar, Button, Frame, ProgressBar, TextInput, ScrollView } from 'react95';
import PersonalWebsite from './PersonalWebsite';
import browserIcon from '../assets/BrowserIcon.webp';
import homeIcon from '../assets/windows98-icons/ico/homepage_alt.ico';
import refreshIcon from '../assets/windows98-icons/ico/replace_file.ico';
import './BrowserViewer.css';

const BrowserViewer = ({ onUrlChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [url, setUrl] = useState('http://alexanderhobelsberger.de/personal');

  // Notify parent of URL changes
  useEffect(() => {
    if (onUrlChange) {
      onUrlChange(url);
    }
  }, [url, onUrlChange]);

  // Simulate loading state using react95 ProgressBar pattern - faster loading
  useEffect(() => {
    if (!isLoading) return;
    
    let timer;
    let timeoutId;
    
    timer = setInterval(() => {
      setLoadingProgress(previousPercent => {
        if (previousPercent >= 100) {
          // When reaching 100%, directly open the page (no reset to 0)
          clearInterval(timer);
          timeoutId = setTimeout(() => {
            setIsLoading(false);
          }, 100);
          return 100; // Keep at 100, don't reset
        }
        const diff = Math.random() * 15 + 5; // Faster: 5-20 per interval
        return Math.min(previousPercent + diff, 100);
      });
    }, 100); // Faster: 100ms intervals instead of 500ms
    
    return () => {
      if (timer) clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);


  const handleRefresh = () => {
    setLoadingProgress(0);
    setIsLoading(true);
  };

  const handleHome = () => {
    setUrl('http://alexanderhobelsberger.de/personal');
    handleRefresh();
  };

  return (
    <div className="browser-viewer-container">
      {/* Toolbar */}
      <div className="browser-toolbar-container">
        <Toolbar className="browser-toolbar">
          <Button size="sm" className="toolbar-button-custom" onClick={handleRefresh}>
            <img
              src={refreshIcon}
              alt="Refresh"
              className="toolbar-icon-image"
            />
            <span className="toolbar-text">Refresh</span>
          </Button>
          <Button size="sm" className="toolbar-button-custom" onClick={handleHome}>
            <img
              src={homeIcon}
              alt="Home"
              className="toolbar-icon-image"
            />
            <span className="toolbar-text">Home</span>
          </Button>
        </Toolbar>
      </div>

      {/* Address Bar */}
      <div className="browser-address-bar">
        <label className="address-label">Address:</label>
        <TextInput
          variant="flat"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleRefresh();
            }
          }}
          style={{ flex: 1 }}
        />
        <Button size="sm" onClick={handleRefresh}>Go</Button>
      </div>

      {/* Content Area */}
      <div className="browser-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {isLoading ? (
          <div className="browser-loading">
            <div className="ie-loading-container">
              <div className="ie-logo-container">
                <img src={browserIcon} alt="Internet Explorer" className="ie-browser-icon" />
              </div>
              <div className="ie-loading-text">Opening page...</div>
              <div className="ie-progress-container" style={{ width: '100%', maxWidth: '400px', margin: '20px auto' }}>
                <ProgressBar value={Math.floor(loadingProgress)} style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        ) : (
          <ScrollView style={{ width: '100%', flex: 1, minHeight: 0 }}>
            <PersonalWebsite />
          </ScrollView>
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

