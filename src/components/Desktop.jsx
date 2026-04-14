import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import AppBarComponent from './AppBar';
import siteInfoPdf from '../assets/Site Information.pdf';
import browserIcon from '../assets/windows98-icons/ico/internet_connection_wiz.ico';
import folderIcon from '../assets/windows98-icons/ico/directory_closed_cool.ico';
import mailIcon from '../assets/windows98-icons/ico/msn_cool.ico';
import musicMakerIcon from '../assets/windows98-icons/ico/loudspeaker_wave.ico';
import seoCheckerIcon from '../assets/windows98-icons/ico/magnifying_glass.ico';
import settingsIcon from '../assets/windows98-icons/ico/settings_gear.ico';
import './Desktop.css';

const Desktop = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const zIndexCounterRef = useRef(100);
  const windowIdCounter = useRef(0);
  const musicMakerWindowIdsRef = useRef(new Map());
  const openWindowRef = useRef(null); // Map service.id -> window.id
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
  }, [savedDesktopSettings.color]);

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
  ], []);

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

  // Helper function to create onOpenMixer callback
  const createOnOpenMixerCallback = useCallback((musicMakerServiceId) => {
    return () => {
      console.log('onOpenMixer callback called for service:', musicMakerServiceId);
      setOpenWindows(prev => {
        // Always find the window dynamically by serviceId - don't rely on ref or closure
        const musicMakerWindow = prev.find(w => 
          w.serviceId === musicMakerServiceId && w.content.isMusicMaker
        );
        
        if (!musicMakerWindow) {
          console.warn('Music Maker window not found for service:', musicMakerServiceId);
          console.log('Available windows:', prev.map(w => ({ id: w.id, serviceId: w.serviceId, isMusicMaker: w.content?.isMusicMaker })));
          return prev;
        }
        
        const currentWindowId = musicMakerWindow.id;
        // Update ref for future use
        musicMakerWindowIdsRef.current.set(musicMakerServiceId, currentWindowId);
        console.log('Found Music Maker window:', currentWindowId);
        
        const existingMixer = prev.find(w => 
          w.parentWindowId === currentWindowId && w.content.isMixer
        );
        
        if (existingMixer) {
          console.log('Bringing existing mixer to front');
          const maxZIndex = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : zIndexCounterRef.current;
          const newZIndex = maxZIndex + 1;
          setZIndexCounter(newZIndex);
          return prev.map(w => 
            w.id === existingMixer.id ? { ...w, zIndex: newZIndex } : w
          );
        } else {
          console.log('Creating new mixer window');
          // Create new mixer subwindow
          const mixerDrumVolume = musicMakerWindow.content.drumVolume ?? 0.7;
          const mixerSynthVolume = musicMakerWindow.content.synthVolume ?? 0.7;

          // Ensure we have working volume callbacks for both channels
          const onDrumVolumeChange =
            musicMakerWindow.content.onDrumVolumeChange ||
            ((volume) => {
              setOpenWindows(prevWindows =>
                prevWindows.map(w =>
                  w.id === currentWindowId
                    ? { ...w, content: { ...w.content, drumVolume: volume } }
                    : w.parentWindowId === currentWindowId && w.content.isMixer
                    ? { ...w, content: { ...w.content, drumVolume: volume } }
                    : w
                )
              );
            });

          const onSynthVolumeChange =
            musicMakerWindow.content.onSynthVolumeChange ||
            ((volume) => {
              setOpenWindows(prevWindows =>
                prevWindows.map(w =>
                  w.id === currentWindowId
                    ? { ...w, content: { ...w.content, synthVolume: volume } }
                    : w.parentWindowId === currentWindowId && w.content.isMixer
                    ? { ...w, content: { ...w.content, synthVolume: volume } }
                    : w
                )
              );
            });
          
          windowIdCounter.current += 1;
          const mixerX = musicMakerWindow.x + 50;
          const mixerY = musicMakerWindow.y + 50;
          const mixerWidth = 1000;
          const mixerHeight = 600;
          const maxZIndex = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : zIndexCounterRef.current;
          const newZIndex = maxZIndex + 1;
          setZIndexCounter(newZIndex);
          
          // Copy handlers from music maker window, but exclude isMusicMaker flag
          const { isMusicMaker: _, ...musicMakerContentWithoutFlag } = musicMakerWindow.content;
          const mixerWindow = {
            id: `mixer-${windowIdCounter.current}`,
            serviceId: 'mixer',
            title: 'Mixer',
            content: {
              ...musicMakerContentWithoutFlag,
              // Override with mixer-specific values
              isMixer: true,
              isMusicMaker: false, // Explicitly set to false to prevent rendering as MusicMaker
              title: 'Mixer',
              description: 'Audio Mixer',
              drumVolume: mixerDrumVolume,
              synthVolume: mixerSynthVolume,
              onDrumVolumeChange,
              onSynthVolumeChange,
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
          
          console.log('Created mixer window:', mixerWindow.id);
          return [...prev, mixerWindow];
        }
      });
    };
  }, [setOpenWindows]);

  // Helper function to create reverb window open callbacks
  const createReverbHandlers = useCallback((musicMakerServiceId) => {
    const createReverbOpener = (channelName) => {
      return () => {
        setOpenWindows(prev => {
          // Find the music maker window
          const musicMakerWindow = prev.find(w => 
            w.serviceId === musicMakerServiceId && w.content.isMusicMaker
          );
          
          if (!musicMakerWindow) {
            console.warn('Music Maker window not found for service:', musicMakerServiceId);
            return prev;
          }
          
          const currentWindowId = musicMakerWindow.id;
          
          // Check if reverb window already exists for this channel
          const existingReverb = prev.find(w => 
            w.parentWindowId === currentWindowId && w.content.isReverb && w.content.channelName === channelName
          );
          
          if (existingReverb) {
            // Bring reverb to front if it exists
            const maxZIndex = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : zIndexCounterRef.current;
            const newZIndex = maxZIndex + 1;
            setZIndexCounter(newZIndex);
            return prev.map(w => 
              w.id === existingReverb.id ? { ...w, zIndex: newZIndex } : w
            );
          } else {
            // Create new reverb window
            windowIdCounter.current += 1;
            const reverbX = musicMakerWindow.x + 100;
            const reverbY = musicMakerWindow.y + 100;
            const reverbWidth = 400;
            const reverbHeight = 500;
            const maxZIndex = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : zIndexCounterRef.current;
            const newZIndex = maxZIndex + 1;
            setZIndexCounter(newZIndex);
            
            // Get reverb state from music maker window
            const enabledKey = `${channelName}ReverbEnabled`;
            const roomSizeKey = `${channelName}ReverbRoomSize`;
            const dampingKey = `${channelName}ReverbDamping`;
            const wetLevelKey = `${channelName}ReverbWetLevel`;
            const dryLevelKey = `${channelName}ReverbDryLevel`;
            
            const enabled = musicMakerWindow.content[enabledKey] ?? false;
            const roomSize = musicMakerWindow.content[roomSizeKey] ?? 0.5;
            const damping = musicMakerWindow.content[dampingKey] ?? 0.5;
            const wetLevel = musicMakerWindow.content[wetLevelKey] ?? 0.3;
            const dryLevel = musicMakerWindow.content[dryLevelKey] ?? 0.7;
            
            // Create handlers for this channel - these will be created fresh each time
            // They need to capture currentWindowId from the closure
            const reverbWindowId = `reverb-${channelName}-${windowIdCounter.current}`;
            
            const onEnabledChange = (value) => {
              setOpenWindows(prevWindows => prevWindows.map(w => 
                w.id === currentWindowId 
                  ? { ...w, content: { ...w.content, [enabledKey]: value } }
                  : w.parentWindowId === currentWindowId && w.content.isMixer
                  ? { ...w, content: { ...w.content, [enabledKey]: value } }
                  : w.id === reverbWindowId
                  ? { ...w, content: { ...w.content, enabled: value } }
                  : w
              ));
            };
            
            const onRoomSizeChange = (value) => {
              setOpenWindows(prevWindows => prevWindows.map(w => 
                w.id === currentWindowId 
                  ? { ...w, content: { ...w.content, [roomSizeKey]: value } }
                  : w.parentWindowId === currentWindowId && w.content.isMixer
                  ? { ...w, content: { ...w.content, [roomSizeKey]: value } }
                  : w.id === reverbWindowId
                  ? { ...w, content: { ...w.content, roomSize: value } }
                  : w
              ));
            };
            
            const onDampingChange = (value) => {
              setOpenWindows(prevWindows => prevWindows.map(w => 
                w.id === currentWindowId 
                  ? { ...w, content: { ...w.content, [dampingKey]: value } }
                  : w.parentWindowId === currentWindowId && w.content.isMixer
                  ? { ...w, content: { ...w.content, [dampingKey]: value } }
                  : w.id === reverbWindowId
                  ? { ...w, content: { ...w.content, damping: value } }
                  : w
              ));
            };
            
            const onWetLevelChange = (value) => {
              setOpenWindows(prevWindows => prevWindows.map(w => 
                w.id === currentWindowId 
                  ? { ...w, content: { ...w.content, [wetLevelKey]: value } }
                  : w.parentWindowId === currentWindowId && w.content.isMixer
                  ? { ...w, content: { ...w.content, [wetLevelKey]: value } }
                  : w.id === reverbWindowId
                  ? { ...w, content: { ...w.content, wetLevel: value } }
                  : w
              ));
            };
            
            const onDryLevelChange = (value) => {
              setOpenWindows(prevWindows => prevWindows.map(w => 
                w.id === currentWindowId 
                  ? { ...w, content: { ...w.content, [dryLevelKey]: value } }
                  : w.parentWindowId === currentWindowId && w.content.isMixer
                  ? { ...w, content: { ...w.content, [dryLevelKey]: value } }
                  : w.id === reverbWindowId
                  ? { ...w, content: { ...w.content, dryLevel: value } }
                  : w
              ));
            };
            
            const reverbWindow = {
              id: `reverb-${channelName}-${windowIdCounter.current}`,
              serviceId: 'reverb',
              title: `${channelName.toUpperCase()} - REVERB`,
              content: {
                title: `${channelName.toUpperCase()} - REVERB`,
                description: 'Reverb Plugin',
                isReverb: true,
                channelName: channelName,
                enabled: enabled,
                roomSize: roomSize,
                damping: damping,
                wetLevel: wetLevel,
                dryLevel: dryLevel,
                onEnabledChange: onEnabledChange,
                onRoomSizeChange: onRoomSizeChange,
                onDampingChange: onDampingChange,
                onWetLevelChange: onWetLevelChange,
                onDryLevelChange: onDryLevelChange,
              },
              x: reverbX,
              y: reverbY,
              zIndex: newZIndex,
              minimized: false,
              maximized: false,
              width: reverbWidth,
              height: reverbHeight,
              originalX: reverbX,
              originalY: reverbY,
              originalWidth: reverbWidth,
              originalHeight: reverbHeight,
              parentWindowId: currentWindowId
            };
            
            return [...prev, reverbWindow];
          }
        });
      };
    };
    
    return {
      onOpenDrumReverb: createReverbOpener('drums'),
      onOpenSynthReverb: createReverbOpener('synth'),
      onOpenMasterReverb: createReverbOpener('master')
    };
  }, []);

  const openWindow = useCallback((service) => {
    // Check if a window for this service is already open
    setOpenWindows(prev => {
      const existingWindow = prev.find(w => w.serviceId === service.id);
      
      if (existingWindow) {
        // Window already exists - restore if minimized and bring to front
        const maxZIndex = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : zIndexCounterRef.current;
        const newZIndex = maxZIndex + 1;
        setZIndexCounter(newZIndex);
        
        // If it's a Music Maker window, update the callbacks to ensure they're fresh
        if (service.content.isMusicMaker && existingWindow.content.isMusicMaker) {
          const musicMakerServiceId = service.id;
          // Always update the ref mapping to match the actual window ID BEFORE creating callback
          musicMakerWindowIdsRef.current.set(musicMakerServiceId, existingWindow.id);
          console.log('Updated ref mapping:', musicMakerServiceId, '->', existingWindow.id);
          // Create fresh callbacks - they will find the window dynamically
          const freshMixerCallback = createOnOpenMixerCallback(musicMakerServiceId);
          const reverbHandlers = createReverbHandlers(musicMakerServiceId);
          return prev.map(w => {
            if (w.id === existingWindow.id) {
              // Update the window with fresh callbacks
              return {
                ...w,
                minimized: false,
                zIndex: newZIndex,
                content: {
                  ...w.content,
                  onOpenMixer: freshMixerCallback,
                  ...reverbHandlers
                }
              };
            }
            return w;
          });
        }
        
        return prev.map(w => 
          w.id === existingWindow.id 
            ? { ...w, minimized: false, zIndex: newZIndex }
            : w
        );
      }
      
      // No existing window - create a new one
      windowIdCounter.current += 1;
      const initialX = 100 + (prev.length * 30);
      const initialY = 100 + (prev.length * 30);
      const windowWidth = service.content.isPDF ? 800 : service.content.isBrowser ? 900 : service.content.isFolder ? 600 : service.content.isMusicMaker ? 800 : service.content.isContactForm ? 700 : service.content.isSEOChecker ? 900 : 500;
      const windowHeight = service.content.isPDF ? 600 : service.content.isBrowser ? 700 : service.content.isFolder ? 500 : service.content.isMusicMaker ? 600 : service.content.isContactForm ? 600 : service.content.isSEOChecker ? 700 : 400;
      
      // Set up file open handler for folders
      let folderContent = service.content;
      if (service.content.isFolder && service.content.files) {
        folderContent = {
          ...service.content,
          onFileOpen: (file) => {
            if (file.isPDF) {
              // Open PDF in a new window - use setOpenWindows directly to avoid recursion
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
              // Call openWindow via ref to avoid recursion issues
              if (openWindowRef.current) {
                openWindowRef.current(pdfService);
              }
            }
          }
        };
      }

      // Constrain initial position to viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 40; // Account for taskbar
      // On mobile, center windows and make them full width
      const isMobile = viewportWidth <= 768;
      
      // Browser should always open maximized
      const isBrowser = service.content.isBrowser;
      const shouldMaximize = isBrowser;
      
      const constrainedX = isMobile ? 0 : Math.max(0, Math.min(initialX, viewportWidth - windowWidth));
      const constrainedY = isMobile ? 0 : Math.max(0, Math.min(initialY, viewportHeight - windowHeight));
      const finalWidth = shouldMaximize ? viewportWidth : (isMobile ? viewportWidth : windowWidth);
      const finalHeight = shouldMaximize ? viewportHeight : (isMobile ? Math.min(windowHeight, viewportHeight) : windowHeight);
      
      const musicMakerWindowId = `${service.id}-${windowIdCounter.current}`;
      
      // Set up Music Maker with mixer subwindow support
      if (service.content.isMusicMaker) {
        // Store the mapping for this service
        musicMakerWindowIdsRef.current.set(service.id, musicMakerWindowId);
        
        // Capture service.id in a const to avoid closure issues
        const musicMakerServiceId = service.id;
        
        // Create all handlers for the music maker window
        const reverbHandlers = createReverbHandlers(musicMakerServiceId);
        
        folderContent = {
          ...service.content,
          drumVolume: 0.7,
          synthVolume: 0.7,
          // Initialize reverb state
          drumReverbEnabled: false,
          drumReverbRoomSize: 0.5,
          drumReverbDamping: 0.5,
          drumReverbWetLevel: 0.3,
          drumReverbDryLevel: 0.7,
          synthReverbEnabled: false,
          synthReverbRoomSize: 0.5,
          synthReverbDamping: 0.5,
          synthReverbWetLevel: 0.3,
          synthReverbDryLevel: 0.7,
          masterReverbEnabled: false,
          masterReverbRoomSize: 0.5,
          masterReverbDamping: 0.5,
          masterReverbWetLevel: 0.3,
          masterReverbDryLevel: 0.7,
          // Volume change handlers
          onDrumVolumeChange: (volume) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, drumVolume: volume } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, drumVolume: volume } }
                : w
            ));
          },
          onSynthVolumeChange: (volume) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, synthVolume: volume } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, synthVolume: volume } }
                : w
            ));
          },
          // Reverb change handlers for drums
          onDrumReverbEnabledChange: (enabled) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, drumReverbEnabled: enabled } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, drumReverbEnabled: enabled } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'drums'
                ? { ...w, content: { ...w.content, enabled } }
                : w
            ));
          },
          onDrumReverbRoomSizeChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, drumReverbRoomSize: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, drumReverbRoomSize: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'drums'
                ? { ...w, content: { ...w.content, roomSize: value } }
                : w
            ));
          },
          onDrumReverbDampingChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, drumReverbDamping: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, drumReverbDamping: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'drums'
                ? { ...w, content: { ...w.content, damping: value } }
                : w
            ));
          },
          onDrumReverbWetLevelChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, drumReverbWetLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, drumReverbWetLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'drums'
                ? { ...w, content: { ...w.content, wetLevel: value } }
                : w
            ));
          },
          onDrumReverbDryLevelChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, drumReverbDryLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, drumReverbDryLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'drums'
                ? { ...w, content: { ...w.content, dryLevel: value } }
                : w
            ));
          },
          // Reverb change handlers for synth
          onSynthReverbEnabledChange: (enabled) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, synthReverbEnabled: enabled } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, synthReverbEnabled: enabled } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'synth'
                ? { ...w, content: { ...w.content, enabled } }
                : w
            ));
          },
          onSynthReverbRoomSizeChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, synthReverbRoomSize: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, synthReverbRoomSize: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'synth'
                ? { ...w, content: { ...w.content, roomSize: value } }
                : w
            ));
          },
          onSynthReverbDampingChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, synthReverbDamping: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, synthReverbDamping: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'synth'
                ? { ...w, content: { ...w.content, damping: value } }
                : w
            ));
          },
          onSynthReverbWetLevelChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, synthReverbWetLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, synthReverbWetLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'synth'
                ? { ...w, content: { ...w.content, wetLevel: value } }
                : w
            ));
          },
          onSynthReverbDryLevelChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, synthReverbDryLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, synthReverbDryLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'synth'
                ? { ...w, content: { ...w.content, dryLevel: value } }
                : w
            ));
          },
          // Reverb change handlers for master
          onMasterReverbEnabledChange: (enabled) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, masterReverbEnabled: enabled } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, masterReverbEnabled: enabled } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'master'
                ? { ...w, content: { ...w.content, enabled } }
                : w
            ));
          },
          onMasterReverbRoomSizeChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, masterReverbRoomSize: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, masterReverbRoomSize: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'master'
                ? { ...w, content: { ...w.content, roomSize: value } }
                : w
            ));
          },
          onMasterReverbDampingChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, masterReverbDamping: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, masterReverbDamping: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'master'
                ? { ...w, content: { ...w.content, damping: value } }
                : w
            ));
          },
          onMasterReverbWetLevelChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, masterReverbWetLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, masterReverbWetLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'master'
                ? { ...w, content: { ...w.content, wetLevel: value } }
                : w
            ));
          },
          onMasterReverbDryLevelChange: (value) => {
            setOpenWindows(prevWindows => prevWindows.map(w => 
              w.id === musicMakerWindowId 
                ? { ...w, content: { ...w.content, masterReverbDryLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isMixer
                ? { ...w, content: { ...w.content, masterReverbDryLevel: value } }
                : w.parentWindowId === musicMakerWindowId && w.content.isReverb && w.content.channelName === 'master'
                ? { ...w, content: { ...w.content, dryLevel: value } }
                : w
            ));
          },
          // Mixer and reverb window open handlers
          onOpenMixer: createOnOpenMixerCallback(musicMakerServiceId),
          ...reverbHandlers
        };
      }
      
      const newWindow = {
        id: musicMakerWindowId,
        serviceId: service.id,
        title: service.content.title,
        content: folderContent,
        x: shouldMaximize ? 0 : constrainedX,
        y: shouldMaximize ? 0 : constrainedY,
        zIndex: zIndexCounter,
        minimized: false,
        maximized: shouldMaximize,
        width: finalWidth,
        height: finalHeight,
        originalX: constrainedX,
        originalY: constrainedY,
        originalWidth: windowWidth,
        originalHeight: windowHeight
      };
      
      setZIndexCounter(prevZ => prevZ + 1);
      return [...prev, newWindow];
    });
  }, [zIndexCounter, createOnOpenMixerCallback, createReverbHandlers]);
  
  // Store openWindow in ref so it can be accessed in callbacks
  useEffect(() => {
    openWindowRef.current = openWindow;
  }, [openWindow]);

  const closeWindow = (windowId) => {
    // Close the window and any subwindows (windows with parentWindowId matching this windowId)
    setOpenWindows(openWindows.filter(w => w.id !== windowId && w.parentWindowId !== windowId));
  };

  const minimizeWindow = (windowId) => {
    setOpenWindows(prev =>
      prev.map(w => 
        w.id === windowId ? { ...w, minimized: !w.minimized } : w
      )
    );
  };

  const bringToFront = useCallback((windowId) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: zIndexCounter } : w
    ));
    setZIndexCounter(prev => prev + 1);
  }, [zIndexCounter]);


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
  }, [services, openWindows, bringToFront, openWindow]);

  const updateWindowPosition = (windowId, x, y) => {
    setOpenWindows(prev =>
      prev.map(w => {
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
      })
    );
  };

  const updateWindowSize = (windowId, width, height, x, y) => {
    setOpenWindows(prev =>
      prev.map(w => {
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
      })
    );
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

  // "Active" window = the frontmost non-minimized one (Windows-like focus).
  const activeWindowId = useMemo(() => {
    let active = null;
    for (const w of openWindows) {
      if (w.minimized) continue;
      if (!active || w.zIndex > active.zIndex) active = w;
    }
    return active?.id ?? null;
  }, [openWindows]);

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
          isActive={activeWindowId === window.id}
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

