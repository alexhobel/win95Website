import { useState, useEffect } from 'react';
import { Monitor, Button, Select, Frame, ScrollView } from 'react95';
import './DisplayProperties.css';
// Import GIF wallpapers
import castleGif from '../assets/Gifs/Castle.gif';
import castleOfDoomGif from '../assets/Gifs/castleofdoom.gif';
import crossGif from '../assets/Gifs/Cross.gif';
import dragonGif from '../assets/Gifs/Dragon.gif';
import dragon2Gif from '../assets/Gifs/Dragon2.gif';
import fackelGif from '../assets/Gifs/Fackel.gif';
import fireandFlameGif from '../assets/Gifs/FireandFlame.gif';
import hexeGif from '../assets/Gifs/Hexe.gif';
import lightningGif from '../assets/Gifs/Lightning.gif';
import lightning2Gif from '../assets/Gifs/lightning2.gif';
import chainGif from '../assets/Gifs/linkschainam.gif';
import magicianGif from '../assets/Gifs/Magician.gif';
import pentagramGif from '../assets/Gifs/Pentagram.gif';
import pumpkinGif from '../assets/Gifs/Pumpkin.gif';
import skeletonGif from '../assets/Gifs/skelette_009.gif';
import skellettonGif from '../assets/Gifs/Skelletton.gif';

const DisplayProperties = ({ onWallpaperChange, onColorChange }) => {
  // Load saved settings from localStorage
  const loadSettings = () => {
    const savedWallpaper = localStorage.getItem('desktopWallpaper') || 'zigzag';
    const savedColor = localStorage.getItem('desktopColor') || '#008080';
    return { wallpaper: savedWallpaper, color: savedColor };
  };

  const [activeTab, setActiveTab] = useState('background');
  const savedSettings = loadSettings();
  const [selectedWallpaper, setSelectedWallpaper] = useState(savedSettings.wallpaper);
  const [customColor, setCustomColor] = useState(savedSettings.color);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('desktopWallpaper', selectedWallpaper);
      localStorage.setItem('desktopColor', customColor);
    }
  }, [selectedWallpaper, customColor]);

  const wallpapers = [
    { value: 'custom', label: '(Custom)' },
    { value: 'rivets', label: 'Rivets' },
    { value: 'zigzag', label: 'Zig-zag' },
    { value: 'purple-squares', label: 'Purple squares' },
    { value: 'honey', label: 'Honey' },
    { value: 'water', label: 'Water' },
    { value: 'noise', label: 'Noise' },
    { value: 'castle', label: 'Castle', gif: castleGif },
    { value: 'castle-of-doom', label: 'Castle of Doom', gif: castleOfDoomGif },
    { value: 'cross', label: 'Cross', gif: crossGif },
    { value: 'dragon', label: 'Dragon', gif: dragonGif },
    { value: 'dragon2', label: 'Dragon 2', gif: dragon2Gif },
    { value: 'fackel', label: 'Fackel', gif: fackelGif },
    { value: 'fire-and-flame', label: 'Fire and Flame', gif: fireandFlameGif },
    { value: 'hexe', label: 'Hexe', gif: hexeGif },
    { value: 'lightning', label: 'Lightning', gif: lightningGif },
    { value: 'lightning2', label: 'Lightning 2', gif: lightning2Gif },
    { value: 'chain', label: 'Chain', gif: chainGif },
    { value: 'magician', label: 'Magician', gif: magicianGif },
    { value: 'pentagram', label: 'Pentagram', gif: pentagramGif },
    { value: 'pumpkin', label: 'Pumpkin', gif: pumpkinGif },
    { value: 'skeleton', label: 'Skeleton', gif: skeletonGif },
    { value: 'skelletton', label: 'Skelletton', gif: skellettonGif },
  ];

  // Convert wallpapers to React95 Select options format
  const wallpaperOptions = wallpapers.map((wp, index) => ({
    value: wp.value,
    label: wp.label
  }));

  // Find current wallpaper index for Select defaultValue
  const currentWallpaperIndex = wallpapers.findIndex(wp => wp.value === selectedWallpaper);

  const handleWallpaperChange = (value) => {
    setSelectedWallpaper(value);
    if (onWallpaperChange) {
      onWallpaperChange(value);
    }
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  // Get background styles for Monitor component
  const getBackgroundStyles = () => {
    if (selectedWallpaper === 'custom') {
      return { background: customColor };
    }
    
    // Check if it's a GIF wallpaper
    const selectedWallpaperData = wallpapers.find(wp => wp.value === selectedWallpaper);
    if (selectedWallpaperData && selectedWallpaperData.gif) {
      return {
        backgroundImage: `url(${selectedWallpaperData.gif})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundColor: '#000'
      };
    }
    
    const patterns = {
      'zigzag': {
        background: 'repeating-linear-gradient(45deg, #00ced1 0px, #00ced1 20px, #9370db 20px, #9370db 40px)'
      },
      'rivets': {
        background: 'radial-gradient(circle at 20px 20px, #808080 2px, transparent 2px), radial-gradient(circle at 60px 60px, #808080 2px, transparent 2px)',
        backgroundSize: '80px 80px',
        backgroundColor: '#c0c0c0'
      },
      'purple-squares': {
        background: 'repeating-linear-gradient(0deg, #9370db 0px, #9370db 20px, #dda0dd 20px, #dda0dd 40px), repeating-linear-gradient(90deg, #9370db 0px, #9370db 20px, #dda0dd 20px, #dda0dd 40px)'
      },
      'honey': {
        background: 'repeating-linear-gradient(60deg, #ffd700 0px, #ffd700 15px, #ffa500 15px, #ffa500 30px)'
      },
      'water': {
        background: 'repeating-linear-gradient(0deg, #00bfff 0px, #00bfff 10px, #1e90ff 10px, #1e90ff 20px, #00bfff 20px, #00bfff 30px)'
      },
      'noise': {
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundColor: '#808080'
      }
    };
    
    return patterns[selectedWallpaper] || patterns['zigzag'];
  };

  return (
    <div className="display-properties-container">
      {/* Tabs */}
      <div className="display-tabs">
        <Button
          active={activeTab === 'background'}
          onClick={() => setActiveTab('background')}
          style={{ marginRight: '4px' }}
        >
          Background
        </Button>
        <Button
          active={activeTab === 'appearance'}
          onClick={() => setActiveTab('appearance')}
          style={{ marginRight: '4px' }}
        >
          Appearance
        </Button>
        <Button
          active={activeTab === 'system'}
          onClick={() => setActiveTab('system')}
        >
          System
        </Button>
      </div>

      {/* Content Area */}
      <Frame variant="inside" style={{ padding: '1rem', marginTop: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'visible' }}>
        <ScrollView style={{ width: '100%', flex: 1 }}>
          {activeTab === 'background' && (
            <div className="background-tab">
              {/* Monitor Preview using react95 Monitor */}
              <div className="monitor-preview">
                <Monitor backgroundStyles={getBackgroundStyles()} />
              </div>

              {/* Wallpaper Selection */}
              <div className="setting-row">
                <label className="setting-label">Wallpaper:</label>
                <div className="setting-control" style={{ overflow: 'visible', zIndex: 10001 }}>
                  <Select
                    defaultValue={currentWallpaperIndex >= 0 ? currentWallpaperIndex : 0}
                    options={wallpaperOptions}
                    menuMaxHeight={160}
                    width={200}
                    onChange={(option) => handleWallpaperChange(option.value)}
                  />
                </div>
              </div>

              {/* Custom Color */}
              <div className="setting-row">
                <label className="setting-label">Custom color:</label>
                <div className="setting-control color-control">
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: customColor }}
                  />
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleColorChange}
                    className="color-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="appearance-tab">
              <p className="tab-placeholder">Appearance settings coming soon...</p>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="system-tab">
              <p className="tab-placeholder">System settings coming soon...</p>
            </div>
          )}
        </ScrollView>
      </Frame>
    </div>
  );
};

export default DisplayProperties;
