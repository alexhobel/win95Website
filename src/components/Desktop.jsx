import { useState, useRef, useEffect, useMemo } from 'react';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import AppBarComponent from './AppBar';
import siteInfoPdf from '../assets/Site Information.pdf';
import browserIcon from '../assets/windows98-icons/ico/internet_connection_wiz.ico';
import folderIcon from '../assets/windows98-icons/ico/directory_closed_cool.ico';
import mailIcon from '../assets/windows98-icons/ico/mailbox_world.ico';
import musicMakerIcon from '../assets/windows98-icons/ico/loudspeaker_wave.ico';
import seoCheckerIcon from '../assets/windows98-icons/ico/magnifying_glass.ico';
import settingsIcon from '../assets/windows98-icons/ico/settings_gear.ico';
import './Desktop.css';

const Desktop = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const zIndexCounterRef = useRef(100);
  const windowIdCounter = useRef(0);
  const musicMakerWindowIdsRef = useRef(new Map()); // Map service.id -> window.id
  // Load saved settings from localStorage on mount
  const loadDesktopSettings = () => {
    if (typeof window !== 'undefined') {
      const savedWallpaper = localStorage.getItem('desktopWallpaper') || 'zigzag';
      const savedColor = localStorage.getItem('desktopColor') || '#54a8a8';
      return { wallpaper: savedWallpaper, color: savedColor };
    }
    return { wallpaper: 'zigzag', color: '#54a8a8' };
  };

  const savedDesktopSettings = loadDesktopSettings();
  const [desktopWallpaper, setDesktopWallpaper] = useState(savedDesktopSettings.wallpaper);
  const [desktopColor, setDesktopColor] = useState(savedDesktopSettings.color);

  // Initialize CSS custom property on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--custom-focus-color', savedDesktopSettings.color);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('desktopWallpaper', desktopWallpaper);
      localStorage.setItem('desktopColor', desktopColor);
    }
  }, [desktopWallpaper, desktopColor]);

  // Set CSS custom property for focus color
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--custom-focus-color', desktopColor);
    }
  }, [desktopColor]);
  
  // Keep ref in sync with state
  useEffect(() => {
    zIndexCounterRef.current = zIndexCounter;
  }, [zIndexCounter]);
  
  // Desktop selection state
  const [selection, setSelection] = useState(null);
  const [selectedWindowIds, setSelectedWindowIds] = useState(new Set());
  const [selectedIconIds, setSelectedIconIds] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionStartRef = useRef(null);
  const desktopRef = useRef(null);

  const services = useMemo(() => [
    {
      id: 'personal-documents',
      title: 'Documents',
      icon: folderIcon,
      iconType: 'image',
      content: {
        title: 'Documents',
        description: 'My Documents',
        isFolder: true,
        files: [
          {
            id: 'site-info',
            name: 'Site Information.pdf',
            icon: '📄',
            isPDF: true,
            pdfPath: siteInfoPdf
          }
        ],
        onFileOpen: () => {
          // This will be set when opening the folder window
        }
      }
    },
    {
      id: 'browser',
      title: 'Internet',
      icon: browserIcon,
      iconType: 'image',
      content: {
        title: 'Internet',
        description: 'Browse the web',
        isBrowser: true
      }
    },
    {
      id: 'music-maker',
      title: 'Music Maker',
      icon: musicMakerIcon,
      iconType: 'image',
      content: {
        title: 'Music Maker',
        description: 'Create awesome tunes!',
        isMusicMaker: true
      }
    },
    {
      id: 'contact',
      title: 'Contact me',
      icon: mailIcon,
      iconType: 'image',
      content: {
        title: 'Contact me',
        description: 'Send me a message',
        isContactForm: true
      }
    },
    {
      id: 'seo-checker',
      title: 'SEO Checker',
      icon: seoCheckerIcon,
      iconType: 'image',
      content: {
        title: 'SEO Checker',
        description: 'Analyze website SEO',
        isSEOChecker: true
      }
    },
    {
      id: 'display-properties',
      title: 'Display Properties',
      icon: settingsIcon,
      iconType: 'image',
      content: {
        title: 'Display Properties',
        description: 'Change desktop appearance',
        isDisplayProperties: true,
        onWallpaperChange: (wallpaper) => setDesktopWallpaper(wallpaper),
        onColorChange: (color) => setDesktopColor(color)
      }
    }
  ], [desktopWallpaper, desktopColor]);

  // Initialize icon positions state - load from localStorage or use default grid
  const [iconPositions, setIconPositions] = useState(() => {
    // This will be called once on mount, but services might not be fully initialized
    // So we'll load from localStorage if available, otherwise return empty object
    // and let the useMemo below handle the initialization
    if (typeof window !== 'undefined') {
      const savedPositions = localStorage.getItem('desktopIconPositions');
      if (savedPositions) {
        try {
          return JSON.parse(savedPositions);
        } catch (e) {
          console.error('Error parsing saved icon positions:', e);
        }
      }
    }
    return {};
  });
  
  // Compute complete icon positions (merge saved positions with defaults for missing services)
  const completeIconPositions = useMemo(() => {
    const desktopServices = services.filter(service => service.id !== 'display-properties');
    const positions = { ...iconPositions };
    
    desktopServices.forEach(service => {
      if (!positions[service.id]) {
        // Calculate default grid position for missing services
        const index = desktopServices.findIndex(s => s.id === service.id);
        const col = index % 3;
        const row = Math.floor(index / 3);
        positions[service.id] = {
          x: 20 + col * 100,
          y: 20 + row * 100
        };
      }
    });
    
    return positions;
  }, [services, iconPositions]);

  const openWindow = (service) => {
    // Check if a window for this service is already open
    const existingWindow = openWindows.find(w => w.serviceId === service.id);
    
    if (existingWindow) {
      // Window already exists - restore if minimized and bring to front
      setOpenWindows(openWindows.map(w => 
        w.id === existingWindow.id 
          ? { ...w, minimized: false, zIndex: zIndexCounter }
          : w
      ));
      setZIndexCounter(zIndexCounter + 1);
    } else {
      // No existing window - create a new one
      windowIdCounter.current += 1;
      const initialX = 100 + (openWindows.length * 30);
      const initialY = 100 + (openWindows.length * 30);
      const windowWidth = service.content.isPDF ? 800 : service.content.isBrowser ? 900 : service.content.isFolder ? 600 : service.content.isMusicMaker ? 800 : service.content.isContactForm ? 700 : service.content.isSEOChecker ? 900 : 500;
      const windowHeight = service.content.isPDF ? 600 : service.content.isBrowser ? 700 : service.content.isFolder ? 500 : service.content.isMusicMaker ? 600 : service.content.isContactForm ? 600 : service.content.isSEOChecker ? 700 : 400;
      
      // Set up file open handler for folders
      let folderContent = service.content;
      if (service.content.isFolder && service.content.files) {
        folderContent = {
          ...service.content,
          onFileOpen: (file) => {
            if (file.isPDF) {
              // Open PDF in a new window
              const pdfService = {
                id: `pdf-${file.id}`,
                title: file.name,
                icon: file.icon,
                content: {
                  title: file.name,
                  description: file.name,
                  isPDF: true,
                  pdfPath: file.pdfPath
                }
              };
              openWindow(pdfService);
            }
          }
        };
      }

      // Constrain initial position to viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 40; // Account for taskbar
      // On mobile, center windows and make them full width
      const isMobile = viewportWidth <= 768;
      const constrainedX = isMobile ? 0 : Math.max(0, Math.min(initialX, viewportWidth - windowWidth));
      const constrainedY = isMobile ? 0 : Math.max(0, Math.min(initialY, viewportHeight - windowHeight));
      const finalWidth = isMobile ? viewportWidth : windowWidth;
      const finalHeight = isMobile ? Math.min(windowHeight, viewportHeight) : windowHeight;
      
      const musicMakerWindowId = `${service.id}-${windowIdCounter.current}`;
      
      // Set up Music Maker with mixer subwindow support
      if (service.content.isMusicMaker) {
        // Store the mapping for this service
        musicMakerWindowIdsRef.current.set(service.id, musicMakerWindowId);
        
        folderContent = {
          ...service.content,
          drumVolume: 0.7,
          synthVolume: 0.7,
          onOpenMixer: () => {
            // Use functional update to access latest state
            setOpenWindows(prev => {
              // Get the current window ID for this service
              const currentWindowId = musicMakerWindowIdsRef.current.get(service.id);
              if (!currentWindowId) {
                console.warn('Music Maker window ID not found for service:', service.id);
                return prev;
              }
              
              // Check if music maker window still exists
              const musicMakerWindow = prev.find(w => w.id === currentWindowId);
              if (!musicMakerWindow) {
                // Main window is closed, don't open mixer
                console.warn('Music Maker window not found:', currentWindowId);
                return prev;
              }
              
              // Check if mixer window already exists for this music maker
              const existingMixer = prev.find(w => 
                w.parentWindowId === currentWindowId && w.content.isMixer
              );
              
              if (existingMixer) {
                // Bring mixer to front if it exists
                const maxZIndex = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : zIndexCounterRef.current;
                const newZIndex = maxZIndex + 1;
                setZIndexCounter(newZIndex);
                return prev.map(w => 
                  w.id === existingMixer.id ? { ...w, zIndex: newZIndex } : w
                );
              } else {
                // Create new mixer subwindow
                const mixerDrumVolume = musicMakerWindow.content.drumVolume ?? 0.7;
                const mixerSynthVolume = musicMakerWindow.content.synthVolume ?? 0.7;
                
                windowIdCounter.current += 1;
                const mixerX = musicMakerWindow.x + 50;
                const mixerY = musicMakerWindow.y + 50;
                const mixerWidth = 300;
                const mixerHeight = 350;
                const maxZIndex = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : zIndexCounterRef.current;
                const newZIndex = maxZIndex + 1;
                setZIndexCounter(newZIndex);
                
                const mixerWindow = {
                  id: `mixer-${windowIdCounter.current}`,
                  serviceId: 'mixer',
                  title: 'Mixer',
                  content: {
                    title: 'Mixer',
                    description: 'Audio Mixer',
                    isMixer: true,
                    drumVolume: mixerDrumVolume,
                    synthVolume: mixerSynthVolume,
                    onDrumVolumeChange: (volume) => {
                      const windowId = musicMakerWindowIdsRef.current.get(service.id);
                      if (!windowId) return;
                      setOpenWindows(prevWindows => prevWindows.map(w => 
                        w.id === windowId 
                          ? { ...w, content: { ...w.content, drumVolume: volume } }
                          : w.parentWindowId === windowId && w.content.isMixer
                          ? { ...w, content: { ...w.content, drumVolume: volume } }
                          : w
                      ));
                    },
                    onSynthVolumeChange: (volume) => {
                      const windowId = musicMakerWindowIdsRef.current.get(service.id);
                      if (!windowId) return;
                      setOpenWindows(prevWindows => prevWindows.map(w => 
                        w.id === windowId 
                          ? { ...w, content: { ...w.content, synthVolume: volume } }
                          : w.parentWindowId === windowId && w.content.isMixer
                          ? { ...w, content: { ...w.content, synthVolume: volume } }
                          : w
                      ));
                    }
                  },
                  x: mixerX,
                  y: mixerY,
                  zIndex: newZIndex,
                  minimized: false,
                  maximized: false,
                  width: mixerWidth,
                  height: mixerHeight,
                  originalX: mixerX,
                  originalY: mixerY,
                  originalWidth: mixerWidth,
                  originalHeight: mixerHeight,
                  parentWindowId: currentWindowId
                };
                
                return [...prev, mixerWindow];
              }
            });
          }
        };
      }
      
      const newWindow = {
        id: musicMakerWindowId,
        serviceId: service.id,
        title: service.content.title,
        content: folderContent,
        x: constrainedX,
        y: constrainedY,
        zIndex: zIndexCounter,
        minimized: false,
        maximized: false,
        width: finalWidth,
        height: finalHeight,
        originalX: constrainedX,
        originalY: constrainedY,
        originalWidth: finalWidth,
        originalHeight: finalHeight
      };
      setOpenWindows([...openWindows, newWindow]);
      setZIndexCounter(zIndexCounter + 1);
    }
  };

  const closeWindow = (windowId) => {
    // Close the window and any subwindows (windows with parentWindowId matching this windowId)
    setOpenWindows(openWindows.filter(w => w.id !== windowId && w.parentWindowId !== windowId));
  };

  const minimizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(w => 
      w.id === windowId ? { ...w, minimized: !w.minimized } : w
    ));
  };

  const bringToFront = (windowId) => {
    setOpenWindows(openWindows.map(w => 
      w.id === windowId ? { ...w, zIndex: zIndexCounter } : w
    ));
    setZIndexCounter(zIndexCounter + 1);
  };

  // Listen for custom event to open contact form
  useEffect(() => {
    const handleOpenContact = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const contactService = services.find(s => s.id === 'contact');
      if (contactService) {
        // Find if contact window is already open
        const existingWindow = openWindows.find(w => w.content.isContactForm);
        if (existingWindow) {
          // Bring existing window to front
          bringToFront(existingWindow.id);
        } else {
          // Open new contact window
          openWindow(contactService);
        }
      }
    };

    window.addEventListener('openContactForm', handleOpenContact, true);
    return () => {
      window.removeEventListener('openContactForm', handleOpenContact, true);
    };
  }, [services, openWindows]);

  const updateWindowPosition = (windowId, x, y) => {
    setOpenWindows(openWindows.map(w => {
      if (w.id === windowId) {
        // Get window dimensions
        const windowWidth = w.width || 500;
        const windowHeight = w.height || 400;
        
        // Calculate viewport boundaries (accounting for taskbar at bottom)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight - 40; // 40px for taskbar
        
        // On mobile, keep windows at top-left and prevent dragging
        const isMobile = viewportWidth <= 768;
        const constrainedX = isMobile ? 0 : Math.max(0, Math.min(x, viewportWidth - windowWidth));
        const constrainedY = isMobile ? 0 : Math.max(0, Math.min(y, viewportHeight - windowHeight));
        
        return { ...w, x: constrainedX, y: constrainedY };
      }
      return w;
    }));
  };

  const updateWindowSize = (windowId, width, height, x, y) => {
    setOpenWindows(openWindows.map(w => {
      if (w.id === windowId) {
        // Get minimum dimensions based on window type
        const minWidth = w.content.isPDF ? 600 : w.content.isBrowser ? 600 : w.content.isFolder ? 400 : w.content.isMusicMaker ? 600 : w.content.isContactForm ? 500 : w.content.isSEOChecker ? 900 : 400;
        const minHeight = w.content.isPDF ? 400 : w.content.isBrowser ? 400 : w.content.isFolder ? 300 : w.content.isMusicMaker ? 400 : w.content.isContactForm ? 400 : w.content.isSEOChecker ? 700 : 300;
        
        // Calculate viewport boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight - 40; // 40px for taskbar
        
        // Constrain to minimum dimensions
        let constrainedWidth = Math.max(minWidth, width);
        let constrainedHeight = Math.max(minHeight, height);
        
        // Constrain to viewport
        const finalWidth = Math.min(constrainedWidth, viewportWidth);
        const finalHeight = Math.min(constrainedHeight, viewportHeight);
        
        // Adjust position if window would go out of bounds
        let finalX = x !== undefined ? x : w.x;
        let finalY = y !== undefined ? y : w.y;
        
        // Ensure window doesn't go off-screen on the left
        if (finalX < 0) {
          finalX = 0;
        }
        // Ensure window doesn't go off-screen on the top
        if (finalY < 0) {
          finalY = 0;
        }
        // Ensure window doesn't go off-screen on the right
        if (finalX + finalWidth > viewportWidth) {
          finalX = Math.max(0, viewportWidth - finalWidth);
        }
        // Ensure window doesn't go off-screen on the bottom
        if (finalY + finalHeight > viewportHeight) {
          finalY = Math.max(0, viewportHeight - finalHeight);
        }
        
        // If width/height were constrained, adjust position for left/top resizing
        if (width < minWidth && x !== undefined) {
          // Window was resized from left but hit minimum - keep right edge fixed
          finalX = w.x + w.width - finalWidth;
        }
        if (height < minHeight && y !== undefined) {
          // Window was resized from top but hit minimum - keep bottom edge fixed
          finalY = w.y + w.height - finalHeight;
        }
        
        return { 
          ...w, 
          width: finalWidth, 
          height: finalHeight,
          x: finalX,
          y: finalY,
          originalWidth: w.originalWidth || finalWidth,
          originalHeight: w.originalHeight || finalHeight
        };
      }
      return w;
    }));
  };

  const updateIconPosition = (iconId, x, y) => {
    setIconPositions(prev => {
      const updated = {
        ...prev,
        [iconId]: { x, y }
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('desktopIconPositions', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Constrain a window position to viewport
  const constrainWindowPosition = (w) => {
    if (w.maximized) {
      return {
        ...w,
        width: window.innerWidth,
        height: window.innerHeight - 40 // Account for taskbar
      };
    }
    
    const windowWidth = w.width || 500;
    const windowHeight = w.height || 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 40; // 40px for taskbar
    
    const constrainedX = Math.max(0, Math.min(w.x, viewportWidth - windowWidth));
    const constrainedY = Math.max(0, Math.min(w.y, viewportHeight - windowHeight));
    
    // Only update if position changed
    if (constrainedX !== w.x || constrainedY !== w.y) {
      return { ...w, x: constrainedX, y: constrainedY };
    }
    return w;
  };

  const maximizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(w => {
      if (w.id === windowId) {
        if (w.maximized) {
          // Restore to original size and position, then constrain
          const restored = {
            ...w,
            maximized: false,
            x: w.originalX,
            y: w.originalY,
            width: w.originalWidth,
            height: w.originalHeight
          };
          return constrainWindowPosition(restored);
        } else {
          // Save current state and maximize
          return {
            ...w,
            maximized: true,
            originalX: w.x,
            originalY: w.y,
            originalWidth: w.width,
            originalHeight: w.height,
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - 40 // Account for taskbar
          };
        }
      }
      return w;
    }));
  };

  // Handle browser window resize to update maximized windows and constrain all windows
  useEffect(() => {
    const handleResize = () => {
      setOpenWindows(prevWindows => 
        prevWindows.map(constrainWindowPosition)
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop selection handlers
  const handleDesktopMouseDown = (e) => {
    // Only start selection if clicking directly on desktop background (not on windows/icons)
    if (e.target === desktopRef.current || (e.target.closest('.desktop-background') && !e.target.closest('.desktop-icon') && !e.target.closest('.window'))) {
      const rect = desktopRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      selectionStartRef.current = { x, y };
      setSelection({ x, y, width: 0, height: 0 });
      // Clear previous selection when starting a new one
      setSelectedWindowIds(new Set());
      setSelectedIconIds(new Set());
      setIsSelecting(true);
    } else if (e.target.closest('.desktop-icon')) {
      // Clicking on an icon - clear selection after a brief delay to allow icon click to register
      setTimeout(() => {
        setSelectedWindowIds(new Set());
        setSelectedIconIds(new Set());
      }, 100);
    } else {
      // Clicking elsewhere (e.g., on a window) - clear selection immediately
      setSelectedWindowIds(new Set());
      setSelectedIconIds(new Set());
    }
  };

  // Desktop selection event listeners
  useEffect(() => {
    if (!isSelecting) return;

    const handleMove = (e) => {
      if (selectionStartRef.current && desktopRef.current) {
        const rect = desktopRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const x = Math.min(selectionStartRef.current.x, currentX);
        const y = Math.min(selectionStartRef.current.y, currentY);
        const width = Math.abs(currentX - selectionStartRef.current.x);
        const height = Math.abs(currentY - selectionStartRef.current.y);
        
        setSelection({ x, y, width, height });
        
        // Check which windows intersect the selection
        const newSelectedWindows = new Set();
        openWindows.forEach(window => {
          if (!window.minimized && !window.maximized) {
            const windowRect = {
              left: window.x,
              top: window.y,
              right: window.x + (window.width || 500),
              bottom: window.y + (window.height || 400)
            };
            
            if (x < windowRect.right && x + width > windowRect.left &&
                y < windowRect.bottom && y + height > windowRect.top) {
              newSelectedWindows.add(window.id);
            }
          }
        });
        
        // Check which icons intersect the selection (exclude display-properties)
        const newSelectedIcons = new Set();
        services.filter(service => service.id !== 'display-properties').forEach(service => {
          const iconPos = completeIconPositions[service.id];
          if (iconPos) {
            const iconRect = {
              left: iconPos.x,
              top: iconPos.y,
              right: iconPos.x + 100,
              bottom: iconPos.y + 100
            };
            
            if (x < iconRect.right && x + width > iconRect.left &&
                y < iconRect.bottom && y + height > iconRect.top) {
              newSelectedIcons.add(service.id);
            }
          }
        });
        
        setSelectedWindowIds(newSelectedWindows);
        setSelectedIconIds(newSelectedIcons);
      }
    };

    const handleUp = () => {
      // Keep selection visible - don't clear it immediately
      setIsSelecting(false);
      selectionStartRef.current = null;
      // Only clear the selection rectangle, keep selected items highlighted
      setSelection(null);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isSelecting, openWindows, completeIconPositions, services]);

  // Apply wallpaper class and custom color
  const desktopClasses = `desktop wallpaper-${desktopWallpaper}`;
  const desktopStyle = desktopWallpaper === 'custom' 
    ? { backgroundColor: desktopColor }
    : {};

  return (
    <div 
      className={desktopClasses}
      style={desktopStyle}
      ref={desktopRef}
      onMouseDown={handleDesktopMouseDown}
    >
      <div className="desktop-background">
        {services.filter(service => service.id !== 'display-properties').map((service) => (
          <DesktopIcon
            key={service.id}
            icon={service.icon}
            title={service.title}
            position={completeIconPositions[service.id] || { x: 20, y: 20 }}
            onClick={() => openWindow(service)}
            onPositionChange={(x, y) => updateIconPosition(service.id, x, y)}
            isSelected={selectedIconIds.has(service.id)}
          />
        ))}
      </div>

      {/* Selection rectangle */}
      {selection && (
        <div
          className="desktop-selection"
          style={{
            left: `${selection.x}px`,
            top: `${selection.y}px`,
            width: `${selection.width}px`,
            height: `${selection.height}px`
          }}
        />
      )}

      {openWindows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={() => maximizeWindow(window.id)}
          onFocus={() => bringToFront(window.id)}
          onMove={(x, y) => updateWindowPosition(window.id, x, y)}
          onResize={(width, height, x, y) => updateWindowSize(window.id, width, height, x, y)}
          isSelected={selectedWindowIds.has(window.id)}
        />
      ))}

      {/* React95 AppBar with window tabs */}
      <AppBarComponent 
        windows={openWindows}
        onOpenWindow={(serviceId) => {
          const service = services.find(s => s.id === serviceId);
          if (service) {
            openWindow(service);
          }
        }}
        onWindowClick={(windowId) => {
          const window = openWindows.find(w => w.id === windowId);
          if (window) {
            if (window.minimized) {
              // Restore minimized window and bring to front in a single update
              setOpenWindows(openWindows.map(w => 
                w.id === windowId 
                  ? { ...w, minimized: false, zIndex: zIndexCounter }
                  : w
              ));
              setZIndexCounter(zIndexCounter + 1);
            } else {
              // Window is already visible - just bring to front
              bringToFront(windowId);
            }
          }
        }}
      />

{/* 
 <Taskbar 
        windows={openWindows}
        onWindowClick={(windowId) => {
          const window = openWindows.find(w => w.id === windowId);
          if (window) {
            if (window.minimized) {
              // Restore minimized window and bring to front in a single update
              setOpenWindows(openWindows.map(w => 
                w.id === windowId 
                  ? { ...w, minimized: false, zIndex: zIndexCounter }
                  : w
              ));
              setZIndexCounter(zIndexCounter + 1);
            } else {
              // Window is already visible - just bring to front
              bringToFront(windowId);
            }
          }
        }}
      />
*/}
     
    </div>
  );
};

export default Desktop;

