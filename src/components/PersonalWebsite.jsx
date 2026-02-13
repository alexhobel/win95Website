import { useState, useEffect } from 'react';
import RecordCollectionView from './RecordCollectionView';
import bandPicture from '../assets/WebsiteMedia/Bandpicture.jpeg';
import './RetroWebsite.css';

const PersonalWebsite = () => {
  const [visitorCount, setVisitorCount] = useState(1337);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRecordCollection, setShowRecordCollection] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Simulate visitor counter increment
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // If showing record collection, render that view
  if (showRecordCollection) {
    return (
      <div className={`retro-website ${isLoaded ? 'loaded' : ''}`}>
        <RecordCollectionView onBack={() => setShowRecordCollection(false)} />
      </div>
    );
  }

  return (
    <div className={`retro-website ${isLoaded ? 'loaded' : ''}`}>
      {/* Animated Background */}
      <div className="retro-bg-pattern"></div>
      
      {/* Medieval Decorative Elements */}
      <div className="medieval-decorations">
        <div className="castle-left">
          <svg width="80" height="100" viewBox="0 0 80 100" className="castle-svg" style={{imageRendering: 'pixelated'}}>
            {/* Castle base - pixelated blocks */}
            <rect x="8" y="70" width="64" height="30" fill="#5a4a3a" stroke="#3a2a1a" strokeWidth="1"/>
            <rect x="8" y="70" width="16" height="30" fill="#4a3a2a"/>
            <rect x="24" y="70" width="16" height="30" fill="#5a4a3a"/>
            <rect x="40" y="70" width="16" height="30" fill="#4a3a2a"/>
            <rect x="56" y="70" width="16" height="30" fill="#5a4a3a"/>
            {/* Left tower - blocky */}
            <rect x="8" y="40" width="16" height="30" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="40" width="8" height="15" fill="#7b6345"/>
            <rect x="16" y="40" width="8" height="15" fill="#8b7355"/>
            {/* Left tower roof - pixelated triangle */}
            <polygon points="8,40 12,32 16,32 20,32 24,40" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="12" y="32" width="4" height="4" fill="#5a4a3a"/>
            {/* Right tower */}
            <rect x="56" y="40" width="16" height="30" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="56" y="40" width="8" height="15" fill="#7b6345"/>
            <rect x="64" y="40" width="8" height="15" fill="#8b7355"/>
            <polygon points="56,40 60,32 64,32 68,32 72,40" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="60" y="32" width="4" height="4" fill="#5a4a3a"/>
            {/* Center gate */}
            <rect x="32" y="60" width="16" height="10" fill="#3a2a1a" stroke="#2a1a0a" strokeWidth="1"/>
            <rect x="36" y="60" width="8" height="10" fill="#2a1a0a"/>
          </svg>
        </div>
        <div className="castle-right">
          <svg width="80" height="100" viewBox="0 0 80 100" className="castle-svg" style={{imageRendering: 'pixelated'}}>
            <rect x="8" y="70" width="64" height="30" fill="#5a4a3a" stroke="#3a2a1a" strokeWidth="1"/>
            <rect x="8" y="70" width="16" height="30" fill="#4a3a2a"/>
            <rect x="24" y="70" width="16" height="30" fill="#5a4a3a"/>
            <rect x="40" y="70" width="16" height="30" fill="#4a3a2a"/>
            <rect x="56" y="70" width="16" height="30" fill="#5a4a3a"/>
            <rect x="8" y="40" width="16" height="30" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="40" width="8" height="15" fill="#7b6345"/>
            <rect x="16" y="40" width="8" height="15" fill="#8b7355"/>
            <polygon points="8,40 12,32 16,32 20,32 24,40" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="12" y="32" width="4" height="4" fill="#5a4a3a"/>
            <rect x="56" y="40" width="16" height="30" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="56" y="40" width="8" height="15" fill="#7b6345"/>
            <rect x="64" y="40" width="8" height="15" fill="#8b7355"/>
            <polygon points="56,40 60,32 64,32 68,32 72,40" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="60" y="32" width="4" height="4" fill="#5a4a3a"/>
            <rect x="32" y="60" width="16" height="10" fill="#3a2a1a" stroke="#2a1a0a" strokeWidth="1"/>
            <rect x="36" y="60" width="8" height="10" fill="#2a1a0a"/>
          </svg>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-shield shield-1">
          <svg width="40" height="50" viewBox="0 0 40 50" className="shield-svg" style={{imageRendering: 'pixelated'}}>
            <path d="M20 5 L5 15 L5 35 Q5 45 20 45 Q35 45 35 35 L35 15 Z" fill="#8b7355" stroke="#5a4a3a" strokeWidth="2"/>
            <path d="M20 10 L10 18 L10 32 Q10 38 20 38 Q30 38 30 32 L30 18 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            <rect x="18" y="20" width="4" height="12" fill="#5a4a3a"/>
          </svg>
        </div>
        <div className="floating-shield shield-2">
          <svg width="40" height="50" viewBox="0 0 40 50" className="shield-svg" style={{imageRendering: 'pixelated'}}>
            <path d="M20 5 L5 15 L5 35 Q5 45 20 45 Q35 45 35 35 L35 15 Z" fill="#8b7355" stroke="#5a4a3a" strokeWidth="2"/>
            <path d="M20 10 L10 18 L10 32 Q10 38 20 38 Q30 38 30 32 L30 18 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            <circle cx="20" cy="24" r="4" fill="#5a4a3a"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="retro-header">
        <div className="crown-icon">
          <svg width="60" height="40" viewBox="0 0 60 40" className="crown-svg" style={{imageRendering: 'pixelated'}}>
            {/* Left peak */}
            <rect x="10" y="25" width="8" height="15" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            <rect x="10" y="25" width="4" height="8" fill="#c49f27"/>
            <rect x="14" y="25" width="4" height="8" fill="#d4af37"/>
            <rect x="12" y="20" width="4" height="5" fill="#8b7355"/>
            {/* Center peak */}
            <rect x="26" y="20" width="8" height="20" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            <rect x="26" y="20" width="4" height="10" fill="#c49f27"/>
            <rect x="30" y="20" width="4" height="10" fill="#d4af37"/>
            <rect x="28" y="15" width="4" height="5" fill="#8b7355"/>
            {/* Right peak */}
            <rect x="37" y="25" width="8" height="15" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            <rect x="37" y="25" width="4" height="8" fill="#c49f27"/>
            <rect x="41" y="25" width="4" height="8" fill="#d4af37"/>
            <rect x="39" y="20" width="4" height="5" fill="#8b7355"/>
            {/* Gems - pixelated */}
            <rect x="17" y="28" width="2" height="2" fill="#8b7355"/>
            <rect x="28" y="23" width="2" height="2" fill="#8b7355"/>
            <rect x="39" y="28" width="2" height="2" fill="#8b7355"/>
          </svg>
        </div>
        <h1 className="retro-title">
          <span className="title-letter">I</span>
          <span className="title-letter"> </span>
          <span className="title-letter">A</span>
          <span className="title-letter">M</span>
          <span className="title-letter"> </span>
          <span className="title-letter">A</span>
          <span className="title-letter">L</span>
          <span className="title-letter">E</span>
          <span className="title-letter">X</span>
        </h1>
        <div className="retro-subtitle">Music Producer & Musician</div>
        <div className="blink-text">[ MY PERSONAL SPACE ]</div>
      </div>

      {/* Animated divider with Medieval Banner */}
      <div className="retro-divider">
        <div className="divider-line"></div>
        <div className="divider-banner">
          <svg width="100" height="40" viewBox="0 0 100 40" className="banner-svg">
            <path d="M10 5 Q50 0 90 5 L90 35 Q50 40 10 35 Z" fill="#8b7355" stroke="#d4af37" strokeWidth="2"/>
            <path d="M15 10 Q50 5 85 10 L85 30 Q50 35 15 30 Z" fill="#5a4a3a"/>
            <text x="50" y="25" textAnchor="middle" fill="#d4af37" fontSize="12" fontFamily="Courier New" fontWeight="bold">⚔ ⚔ ⚔</text>
          </svg>
        </div>
        <div className="divider-line"></div>
      </div>

      {/* Main Content */}
      <div className="retro-content">
        {/* About Section */}
        <div className="retro-section">
          <div className="section-header">
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L20 15 L10 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
            <h2 className="retro-heading">About Me</h2>
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L10 15 L20 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
          </div>
          <div className="section-body">
            <p className="retro-text">
              Hey there! I'm <span className="highlight-red">Alex</span>, a musician and music producer. 
              When I'm not coding, I'm making music, playing in a band, and producing tracks in my studio.
              I love collecting vinyl records and discovering new sounds from different eras.
            </p>
          </div>
        </div>

        {/* Hobbies Section */}
        <div className="retro-section">
          <div className="section-header">
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L20 15 L10 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
            <h2 className="retro-heading">Hobbies</h2>
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L10 15 L20 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
          </div>
          <div className="section-body">
            <div className="hobbies-content">
              <p className="retro-text">
                When I'm not coding, I'm passionate about music! I make music, play in a band, and do music production in my own studio. These are the things I love to do in my free time.
              </p>
              
              {/* Band Section */}
              <div className="hobbies-subsection band-section">
                <h3 className="hobbies-subtitle">My Band</h3>
                <div className="band-content">
                  <div className="band-image-container">
                    <img 
                      src={bandPicture} 
                      alt="Void & The Nothingness" 
                      className="band-picture"
                    />
                    <div className="band-image-border"></div>
                  </div>
                  <div className="band-info">
                    <p className="retro-text">
                      Check out my band <strong>Void & The Nothingness</strong> on Bandcamp!
                    </p>
                    <a 
                      href="https://voidnothingnessdoom.bandcamp.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bandcamp-link retro-button"
                    >
                      <span className="button-icon">🎸</span>
                      Visit Bandcamp Profile
                    </a>
                  </div>
                </div>
              </div>

              {/* Record Collection Section */}
              <div className="hobbies-subsection">
                <h3 className="hobbies-subtitle">Collection Records</h3>
                <p className="retro-text">
                  Browse my vinyl collection sorted by artist. Each record tells a story and represents a moment in music history.
                </p>
                <button 
                  className="retro-button collection-button"
                  onClick={() => setShowRecordCollection(true)}
                >
                  <span className="button-icon">📀</span>
                  Show My Record Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="retro-footer">
        <div className="footer-text">© 2024 Alex | Made with ❤️ and 🎵</div>
        <div className="footer-counter">Visitors: {visitorCount.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default PersonalWebsite;

