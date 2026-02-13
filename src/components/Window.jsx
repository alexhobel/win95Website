import { useState, useRef, useEffect } from 'react';
import PDFViewer from './PDFViewer';
import BrowserViewer from './BrowserViewer';
import FolderViewer from './FolderViewer';
import MusicMaker from './MusicMaker';
import MixerWindow from './MixerWindow';
import ContactForm from './ContactForm';
import SEOGeoChecker from './SEOGeoChecker';
import DisplayProperties from './DisplayProperties';
import './Window.css';

const Window = ({ window, onClose, onMinimize, onMaximize, onFocus, onMove, isSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !window.maximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onMove(newX, newY);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && !window.maximized) {
        e.preventDefault();
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        onMove(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset, window.maximized, onMove]);

  const handleMouseDown = (e) => {
    if (windowRef.current && !window.maximized) {
      const isMobile = window.innerWidth <= 768;
      // Disable dragging on mobile
      if (isMobile) return;
      
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onFocus();
    }
  };

  const handleTouchStart = (e) => {
    if (windowRef.current && !window.maximized) {
      const isMobile = window.innerWidth <= 768;
      // Disable dragging on mobile
      if (isMobile) return;
      
      const touch = e.touches[0];
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
      setIsDragging(true);
      onFocus();
    }
  };

  return (
    <div
      ref={windowRef}
      className={`window ${window.content.isPDF ? 'pdf-window' : ''} ${window.content.isBrowser ? 'browser-window' : ''} ${window.content.isFolder ? 'folder-window' : ''} ${window.content.isMusicMaker ? 'music-maker-window' : ''} ${window.content.isMixer ? 'mixer-window' : ''} ${window.content.isContactForm ? 'contact-form-window' : ''} ${window.content.isSEOChecker ? 'seo-checker-window' : ''} ${window.content.isDisplayProperties ? 'display-properties-window' : ''} ${window.maximized ? 'maximized' : ''} ${window.minimized ? 'minimized' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${window.x}px`,
        top: `${window.y}px`,
        zIndex: window.zIndex,
        width: window.width ? `${window.width}px` : undefined,
        height: window.height ? `${window.height}px` : undefined
      }}
      onClick={onFocus}
    >
      <div 
        className="title-bar"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {window.content.isBrowser ? (
          <div className="title-bar-text browser-title-text">
            <span className="browser-title-icon">🌐</span>
            {window.content.browserUrl || 'http://alexanderhobelsberger.de'} - Microsoft Internet Explorer
          </div>
        ) : (
          <div className="title-bar-text">{window.title}</div>
        )}
        <div className="title-bar-controls">
          <button
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            <span style={{ fontSize: '12px', lineHeight: '1', fontWeight: 'bold' }}>_</span>
          </button>
          <button
            aria-label={window.maximized ? "Restore" : "Maximize"}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
          >
            <span style={{ fontSize: '10px', lineHeight: '1' }}>{window.maximized ? '❐' : '□'}</span>
          </button>
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <span style={{ fontSize: '12px', lineHeight: '1', fontWeight: 'bold' }}>×</span>
          </button>
        </div>
      </div>
      <div className={`window-body ${window.content.isPDF ? 'pdf-window-body' : ''} ${window.content.isBrowser ? 'browser-window-body' : ''} ${window.content.isFolder ? 'folder-window-body' : ''} ${window.content.isMusicMaker ? 'music-maker-window-body' : ''} ${window.content.isMixer ? 'mixer-window-body' : ''} ${window.content.isContactForm ? 'contact-form-window-body' : ''} ${window.content.isSEOChecker ? 'seo-checker-window-body' : ''} ${window.content.isDisplayProperties ? 'display-properties-window-body' : ''}`}>
        {window.content.isPDF ? (
          <PDFViewer pdfPath={window.content.pdfPath} />
        ) : window.content.isBrowser ? (
          <BrowserViewer />
        ) : window.content.isFolder ? (
          <FolderViewer 
            files={window.content.files || []}
            onFileOpen={window.content.onFileOpen}
          />
        ) : window.content.isMusicMaker ? (
          <MusicMaker 
            drumVolume={window.content.drumVolume}
            synthVolume={window.content.synthVolume}
            onOpenMixer={window.content.onOpenMixer}
          />
        ) : window.content.isMixer ? (
          <MixerWindow
            drumVolume={window.content.drumVolume}
            synthVolume={window.content.synthVolume}
            onDrumVolumeChange={window.content.onDrumVolumeChange}
            onSynthVolumeChange={window.content.onSynthVolumeChange}
          />
        ) : window.content.isContactForm ? (
          <ContactForm />
        ) : window.content.isSEOChecker ? (
          <SEOGeoChecker />
        ) : window.content.isDisplayProperties ? (
          <DisplayProperties 
            onWallpaperChange={window.content.onWallpaperChange}
            onColorChange={window.content.onColorChange}
          />
        ) : (
          <div className="window-content">
            <h2>{window.content.title}</h2>
            <p>{window.content.description}</p>
            {window.content.features && (
              <div className="features-list">
                <h3>Services Include:</h3>
                <ul>
                  {window.content.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="window-footer">
              <button className="window-button">Contact Me</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Window;
