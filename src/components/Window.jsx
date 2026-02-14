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

const Window = ({ window, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, isSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [cursorType, setCursorType] = useState('default');
  const windowRef = useRef(null);
  const RESIZE_THRESHOLD = 8; // pixels from edge to trigger resize

  // Handle resize
  useEffect(() => {
    const handleResizeMove = (e) => {
      if (isResizing && resizeDirection && !window.maximized) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.windowX;
        let newY = resizeStart.windowY;
        
        // Handle horizontal resizing
        if (resizeDirection.includes('e')) {
          newWidth = resizeStart.width + deltaX;
        } else if (resizeDirection.includes('w')) {
          newWidth = resizeStart.width - deltaX;
          newX = resizeStart.windowX + deltaX;
        }
        
        // Handle vertical resizing
        if (resizeDirection.includes('s')) {
          newHeight = resizeStart.height + deltaY;
        } else if (resizeDirection.includes('n')) {
          newHeight = resizeStart.height - deltaY;
          newY = resizeStart.windowY + deltaY;
        }
        
        if (onResize) {
          onResize(newWidth, newHeight, newX, newY);
        }
      }
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      setCursorType('default');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeUp);
      };
    }
  }, [isResizing, resizeDirection, resizeStart, window.maximized, window.x, window.y, onResize]);

  // Handle mouse move for cursor detection
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging || isResizing || window.maximized) return;
      
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;
        
        // Check if near edges
        const nearLeft = x < RESIZE_THRESHOLD;
        const nearRight = x > width - RESIZE_THRESHOLD;
        const nearTop = y < RESIZE_THRESHOLD;
        const nearBottom = y > height - RESIZE_THRESHOLD;
        
        // Determine cursor type
        if (nearTop && nearLeft) {
          setCursorType('nw-resize');
        } else if (nearTop && nearRight) {
          setCursorType('ne-resize');
        } else if (nearBottom && nearLeft) {
          setCursorType('sw-resize');
        } else if (nearBottom && nearRight) {
          setCursorType('se-resize');
        } else if (nearTop) {
          setCursorType('n-resize');
        } else if (nearBottom) {
          setCursorType('s-resize');
        } else if (nearLeft) {
          setCursorType('w-resize');
        } else if (nearRight) {
          setCursorType('e-resize');
        } else {
          setCursorType('default');
        }
      }
    };

    if (!window.maximized) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, isResizing, window.maximized]);

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
      if (isMobile) return;
      
      const rect = windowRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      
      // Check if clicking on resize edge
      const nearLeft = x < RESIZE_THRESHOLD;
      const nearRight = x > width - RESIZE_THRESHOLD;
      const nearTop = y < RESIZE_THRESHOLD;
      const nearBottom = y > height - RESIZE_THRESHOLD;
      
      // Determine resize direction first (before checking title bar)
      let direction = '';
      if (nearTop) direction += 'n';
      if (nearBottom) direction += 's';
      if (nearLeft) direction += 'w';
      if (nearRight) direction += 'e';
      
      // If clicking on a resize edge, always allow resizing (even if in title bar area)
      if (direction) {
        // Start resizing
        setIsResizing(true);
        setResizeDirection(direction);
        setResizeStart({
          mouseX: e.clientX,
          mouseY: e.clientY,
          width: width,
          height: height,
          windowX: window.x,
          windowY: window.y
        });
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Only allow dragging if clicking on title bar (not on edges)
      if (y < 30) {
        // Title bar area - allow dragging
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsDragging(true);
        onFocus();
      }
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
        height: window.height ? `${window.height}px` : undefined,
        cursor: cursorType
      }}
      onClick={onFocus}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="title-bar"
        onTouchStart={handleTouchStart}
        onMouseDown={(e) => {
          // Check if clicking on an edge - if so, let window handle resize
          if (windowRef.current && !window.maximized) {
            const rect = windowRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const nearLeft = x < RESIZE_THRESHOLD;
            const nearRight = x > rect.width - RESIZE_THRESHOLD;
            const nearTop = y < RESIZE_THRESHOLD;
            
            // If on an edge, pass to window's handleMouseDown to handle resize
            if (nearLeft || nearRight || nearTop) {
              handleMouseDown(e);
              return;
            }
          }
          // Otherwise, handle title bar dragging
          handleMouseDown(e);
        }}
        style={{ cursor: 'default' }}
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
