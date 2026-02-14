import { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Button, MenuList, MenuListItem, Separator } from 'react95';
import browserIcon from '../assets/windows98-icons/ico/internet_connection_wiz.ico';
import folderIcon from '../assets/windows98-icons/ico/directory_closed_cool.ico';
import mailIcon from '../assets/windows98-icons/ico/mailbox_world.ico';
import musicMakerIcon from '../assets/windows98-icons/ico/loudspeaker_wave.ico';
import seoCheckerIcon from '../assets/windows98-icons/ico/magnifying_glass.ico';
import settingsIcon from '../assets/windows98-icons/ico/settings_gear.ico';
import infoIcon from '../assets/windows98-icons/ico/msg_information.ico';
import './AppBar.css';

// Windows 95-style logo with 4 colored panes (red, green, blue, yellow)
const WindowsLogo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" style={{ marginRight: 4 }}>
    <rect x="2" y="2" width="7" height="7" fill="#FF0000" />
    <rect x="11" y="2" width="7" height="7" fill="#00FF00" />
    <rect x="2" y="11" width="7" height="7" fill="#0000FF" />
    <rect x="11" y="11" width="7" height="7" fill="#FFFF00" />
  </svg>
);

export default function AppBarComponent({ windows = [], onWindowClick, onOpenWindow }) {
  const [open, setOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef(null);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setProgramsOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handleMenuClick = (serviceId) => {
    if (onOpenWindow) {
      onOpenWindow(serviceId);
    }
    setOpen(false);
    setProgramsOpen(false);
  };

  const toggleFullscreen = () => {
    // Check if fullscreen is supported and not on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

  // Check initial fullscreen state and show tooltip if not in fullscreen
  useEffect(() => {
    const checkFullscreen = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      if (!isFullscreen) {
        setShowTooltip(true);
        // Hide after 3 seconds
        setTimeout(() => {
          setShowTooltip(false);
        }, 3000);
      }
    };
    
    // Check on mount
    checkFullscreen();
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('msfullscreenchange', checkFullscreen);
    
    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('msfullscreenchange', checkFullscreen);
    };
  }, []);

  // Position tooltip above button
  useEffect(() => {
    if (showTooltip && buttonRef.current && tooltipRef.current) {
      const updatePosition = () => {
        if (!buttonRef.current || !tooltipRef.current) return;
        
        const buttonRect = buttonRef.current.getBoundingClientRect();
        
        // Position above the button, centered
        const tooltipWidth = 220; // Approximate width of tooltip text
        const left = buttonRect.left + (buttonRect.width / 2) - (tooltipWidth / 2);
        const bottom = window.innerHeight - buttonRect.top + 8; // 8px above button
        const constrainedLeft = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));
        
        tooltipRef.current.style.position = 'fixed';
        tooltipRef.current.style.left = `${constrainedLeft}px`;
        tooltipRef.current.style.bottom = `${bottom}px`;
        tooltipRef.current.style.zIndex = '10003';
      };
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        updatePosition();
        // Also update after a small delay to account for text rendering
        setTimeout(updatePosition, 0);
      });
    }
  }, [showTooltip]);
  
  return (
    <AppBar 
      fixed 
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        top: 'auto',
        backgroundColor: '#c0c0c0',
        zIndex: 10000,
        height: '40px'
      }}
    >
      <Toolbar style={{ justifyContent: 'space-between', padding: '0 4px', height: '100%', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
          <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
            <Button
              onClick={() => setOpen(!open)}
              active={open}
              style={{ 
                fontWeight: 'bold', 
                height: '32px', 
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <WindowsLogo />
              Start
            </Button>
            {open && (
              <MenuList
                className="start-menu"
                style={{
                  position: 'absolute',
                  left: '0',
                  bottom: '100%',
                  marginBottom: '4px',
                  zIndex: 10001,
                  minWidth: '200px'
                }}
              >
                <div
                  onMouseEnter={() => setProgramsOpen(true)}
                  onMouseLeave={() => setProgramsOpen(false)}
                  style={{ position: 'relative' }}
                >
                  <MenuListItem 
                    className={programsOpen ? 'menu-item-highlighted' : ''}
                    style={{ 
                      position: 'relative', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      backgroundColor: programsOpen ? '#000080' : 'transparent',
                      color: programsOpen ? '#ffffff' : '#000000'
                    }}
                  >
                    <img src={folderIcon} alt="Folder" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                    Programs
                  </MenuListItem>
                  {programsOpen && (
                    <MenuList
                      onMouseEnter={() => setProgramsOpen(true)}
                      onMouseLeave={() => setProgramsOpen(false)}
                      style={{
                        position: 'absolute',
                        left: '100%',
                        top: '0',
                        marginLeft: '4px',
                        zIndex: 10002,
                        minWidth: '180px'
                      }}
                    >
                      <MenuListItem onClick={() => handleMenuClick('browser')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={browserIcon} alt="Internet" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                        Internet
                      </MenuListItem>
                      <MenuListItem onClick={() => handleMenuClick('music-maker')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={musicMakerIcon} alt="Music Maker" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                        Music Maker
                      </MenuListItem>
                      <MenuListItem onClick={() => handleMenuClick('contact')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={mailIcon} alt="Mail" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                        Contact me
                      </MenuListItem>
                      <MenuListItem onClick={() => handleMenuClick('seo-checker')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={seoCheckerIcon} alt="SEO Checker" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                        SEO Checker
                      </MenuListItem>
                    </MenuList>
                  )}
                </div>
                <MenuListItem onClick={() => handleMenuClick('personal-documents')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={folderIcon} alt="Folder" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                  Documents
                </MenuListItem>
                <Separator />
                <MenuListItem onClick={() => handleMenuClick('display-properties')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={settingsIcon} alt="Settings" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
                  Settings
                </MenuListItem>
                <Separator />
                <MenuListItem disabled>
                  <span role='img' aria-label='❓' style={{ fontSize: '24px' }}>
                    ❓
                  </span>
                  Help
                </MenuListItem>
                <MenuListItem disabled>
                  <span role='img' aria-label='▶️' style={{ fontSize: '24px' }}>
                    ▶️
                  </span>
                  Run...
                </MenuListItem>
                <Separator />
                <MenuListItem disabled>
                  <span role='img' aria-label='⏻' style={{ fontSize: '24px' }}>
                    ⏻
                  </span>
                  Shut Down...
                </MenuListItem>
              </MenuList>
            )}
          </div>

          {/* Window tabs - matching Windows 95 taskbar style */}
          <div className="appbar-windows" style={{ display: 'flex', gap: '4px', marginLeft: '4px', flex: 1, overflow: 'hidden' }}>
            {windows.map((window) => {
              // Find the window with highest zIndex that's not minimized (the focused window)
              const maxZIndex = Math.max(...windows.filter(w => !w.minimized).map(w => w.zIndex || 0), 0);
              const isFocused = !window.minimized && window.zIndex === maxZIndex;
              
              return (
                <button
                  key={window.id}
                  className={`appbar-window-button ${isFocused ? 'focused' : window.minimized ? 'minimized' : 'inactive'}`}
                  onClick={() => onWindowClick && onWindowClick(window.id)}
                  style={{
                    height: '28px',
                    padding: '0 12px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px',
                    fontStyle: window.minimized ? 'italic' : 'normal',
                    flexShrink: 0,
                    background: '#c0c0c0',
                    color: '#000',
                    cursor: 'pointer',
                    fontFamily: 'MS Sans Serif, sans-serif'
                  }}
                >
                  {window.title}
                </button>
              );
            })}
          </div>
        </div>
  
        {/* Information icon and Time display */}
        <div className="appbar-time-container" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <div
              onMouseEnter={() => {
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                setShowTooltip(false);
              }}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <button
                ref={buttonRef}
                onClick={toggleFullscreen}
                style={{
                  height: '32px',
                  width: '32px',
                  padding: '0',
                  background: '#c0c0c0',
                  border: '2px outset #c0c0c0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.border = '2px inset #c0c0c0';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.border = '2px outset #c0c0c0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '2px outset #c0c0c0';
                }}
              >
                <img 
                  src={infoIcon} 
                  alt="Information" 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    imageRendering: 'pixelated' 
                  }} 
                />
              </button>
              {showTooltip && (
                <div
                  ref={tooltipRef}
                  className="custom-tooltip"
                  style={{
                    position: 'fixed',
                    background: '#ffffe1',
                    border: '1px solid #000',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontFamily: 'MS Sans Serif, sans-serif',
                    color: '#000',
                    whiteSpace: 'nowrap',
                    zIndex: 10003,
                    pointerEvents: 'none',
                    boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Full Screen for Better Experience
                </div>
              )}
            </div>
          </div>
          
          {/* Time display matching Windows 95 style - recessed/flat appearance */}
          <div className="appbar-time" style={{
            height: '32px',
            padding: '0 8px',
            background: '#c0c0c0',
            border: '2px inset #c0c0c0',
            display: 'flex',
            alignItems: 'center',
            fontSize: '11px',
            color: '#000',
            fontWeight: 'normal',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontFamily: 'MS Sans Serif, sans-serif'
          }}>
            {formattedTime}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}