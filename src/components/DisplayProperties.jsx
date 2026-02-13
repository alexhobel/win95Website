import { useState, useEffect } from 'react';
import { Monitor } from 'react95';
import './DisplayProperties.css';

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
  ];

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
        <button
          className={`display-tab ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => setActiveTab('background')}
        >
          Background
        </button>
        <button
          className={`display-tab ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance
        </button>
        <button
          className={`display-tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System
        </button>
      </div>

      {/* Content Area */}
      <div className="display-content">
        {activeTab === 'background' && (
          <div className="background-tab">
            {/* Monitor Preview using react95 Monitor */}
            <div className="monitor-preview">
              <Monitor backgroundStyles={getBackgroundStyles()} />
            </div>

            {/* Wallpaper Selection */}
            <div className="setting-row">
              <label className="setting-label">Wallpaper:</label>
              <div className="setting-control">
                <select
                  value={selectedWallpaper}
                  onChange={(e) => handleWallpaperChange(e.target.value)}
                  className="wallpaper-select"
                >
                  {wallpapers.map(wp => (
                    <option key={wp.value} value={wp.value}>{wp.label}</option>
                  ))}
                </select>
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
      </div>
    </div>
  );
};

export default DisplayProperties;
