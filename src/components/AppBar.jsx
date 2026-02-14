import { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Button, MenuList, MenuListItem, Separator } from 'react95';
import browserIcon from '../assets/windows98-icons/ico/internet_connection_wiz.ico';
import folderIcon from '../assets/windows98-icons/ico/directory_closed_cool.ico';
import mailIcon from '../assets/windows98-icons/ico/mailbox_world.ico';
import musicMakerIcon from '../assets/windows98-icons/ico/loudspeaker_wave.ico';
import seoCheckerIcon from '../assets/windows98-icons/ico/magnifying_glass.ico';
import settingsIcon from '../assets/windows98-icons/ico/settings_gear.ico';
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
  const menuRef = useRef(null);

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
                        SEO/Geo Checker
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
      </Toolbar>
    </AppBar>
  );
}