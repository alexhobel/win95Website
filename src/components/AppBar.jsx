import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, MenuList, MenuListItem, Separator } from 'react95';
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

export default function AppBarComponent({ windows = [], onWindowClick }) {
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
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
                  zIndex: 10001
                }}
                onClick={() => setOpen(false)}
              >
                <MenuListItem>
                  <span role='img' aria-label='👨‍💻'>
                    👨‍💻
                  </span>
                  Profile
                </MenuListItem>
                <MenuListItem>
                  <span role='img' aria-label='📁'>
                    📁
                  </span>
                  My account
                </MenuListItem>
                <Separator />
                <MenuListItem disabled>
                  <span role='img' aria-label='🔙'>
                    🔙
                  </span>
                  Logout
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