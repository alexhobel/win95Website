import { useState, useEffect } from 'react';
import RecordCollectionView from './RecordCollectionView';
import bandPicture from '../assets/WebsiteMedia/Bandpicture.jpeg';
import './RetroWebsite.css';

const RetroWebsite = () => {
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
            <rect x="16" y="32" width="4" height="4" fill="#7b6345"/>
            {/* Center tower - blocky */}
            <rect x="32" y="25" width="16" height="45" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="32" y="25" width="8" height="22" fill="#7b6345"/>
            <rect x="40" y="25" width="8" height="22" fill="#8b7355"/>
            {/* Center tower roof - pixelated */}
            <polygon points="32,25 36,15 40,15 44,15 48,25" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="36" y="15" width="4" height="4" fill="#5a4a3a"/>
            <rect x="40" y="15" width="4" height="4" fill="#7b6345"/>
            {/* Right tower - blocky */}
            <rect x="56" y="40" width="16" height="30" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="56" y="40" width="8" height="15" fill="#7b6345"/>
            <rect x="64" y="40" width="8" height="15" fill="#8b7355"/>
            {/* Right tower roof - pixelated */}
            <polygon points="56,40 60,32 64,32 68,32 72,40" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="60" y="32" width="4" height="4" fill="#5a4a3a"/>
            <rect x="64" y="32" width="4" height="4" fill="#7b6345"/>
            {/* Windows - pixelated blocks */}
            <rect x="12" y="50" width="4" height="6" fill="#d4af37"/>
            <rect x="12" y="50" width="2" height="3" fill="#f4e4a0"/>
            <rect x="36" y="35" width="4" height="6" fill="#d4af37"/>
            <rect x="36" y="35" width="2" height="3" fill="#f4e4a0"/>
            <rect x="60" y="50" width="4" height="6" fill="#d4af37"/>
            <rect x="60" y="50" width="2" height="3" fill="#f4e4a0"/>
            {/* Gate - blocky */}
            <rect x="36" y="75" width="8" height="20" fill="#3a2a1a" stroke="#1a1a0a" strokeWidth="1"/>
            <rect x="36" y="75" width="4" height="10" fill="#2a1a0a"/>
            <rect x="40" y="75" width="4" height="10" fill="#3a2a1a"/>
            {/* Gate arch - pixelated steps */}
            <rect x="36" y="75" width="2" height="2" fill="#1a1a0a"/>
            <rect x="38" y="73" width="4" height="2" fill="#1a1a0a"/>
            <rect x="42" y="75" width="2" height="2" fill="#1a1a0a"/>
          </svg>
        </div>
        <div className="castle-right">
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
            <rect x="16" y="32" width="4" height="4" fill="#7b6345"/>
            {/* Center tower - blocky */}
            <rect x="32" y="25" width="16" height="45" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="32" y="25" width="8" height="22" fill="#7b6345"/>
            <rect x="40" y="25" width="8" height="22" fill="#8b7355"/>
            {/* Center tower roof - pixelated */}
            <polygon points="32,25 36,15 40,15 44,15 48,25" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="36" y="15" width="4" height="4" fill="#5a4a3a"/>
            <rect x="40" y="15" width="4" height="4" fill="#7b6345"/>
            {/* Right tower - blocky */}
            <rect x="56" y="40" width="16" height="30" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="56" y="40" width="8" height="15" fill="#7b6345"/>
            <rect x="64" y="40" width="8" height="15" fill="#8b7355"/>
            {/* Right tower roof - pixelated */}
            <polygon points="56,40 60,32 64,32 68,32 72,40" fill="#6b5335" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="60" y="32" width="4" height="4" fill="#5a4a3a"/>
            <rect x="64" y="32" width="4" height="4" fill="#7b6345"/>
            {/* Windows - pixelated blocks */}
            <rect x="12" y="50" width="4" height="6" fill="#d4af37"/>
            <rect x="12" y="50" width="2" height="3" fill="#f4e4a0"/>
            <rect x="36" y="35" width="4" height="6" fill="#d4af37"/>
            <rect x="36" y="35" width="2" height="3" fill="#f4e4a0"/>
            <rect x="60" y="50" width="4" height="6" fill="#d4af37"/>
            <rect x="60" y="50" width="2" height="3" fill="#f4e4a0"/>
            {/* Gate - blocky */}
            <rect x="36" y="75" width="8" height="20" fill="#3a2a1a" stroke="#1a1a0a" strokeWidth="1"/>
            <rect x="36" y="75" width="4" height="10" fill="#2a1a0a"/>
            <rect x="40" y="75" width="4" height="10" fill="#3a2a1a"/>
            {/* Gate arch - pixelated steps */}
            <rect x="36" y="75" width="2" height="2" fill="#1a1a0a"/>
            <rect x="38" y="73" width="4" height="2" fill="#1a1a0a"/>
            <rect x="42" y="75" width="2" height="2" fill="#1a1a0a"/>
          </svg>
        </div>
        <div className="shield-decoration shield-1">
          <svg width="40" height="50" viewBox="0 0 40 50" className="shield-svg" style={{imageRendering: 'pixelated'}}>
            {/* Shield shape - pixelated blocks */}
            <rect x="15" y="5" width="10" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="12" y="9" width="16" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="10" y="13" width="20" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="17" width="24" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="21" width="24" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="25" width="24" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="10" y="29" width="20" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="12" y="33" width="16" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="15" y="37" width="10" height="8" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            {/* Inner shield - darker */}
            <rect x="14" y="10" width="12" height="20" fill="#5a4a3a"/>
            {/* Diamond pattern - pixelated */}
            <rect x="18" y="16" width="4" height="4" fill="#d4af37"/>
            <rect x="20" y="18" width="4" height="4" fill="#d4af37"/>
            <rect x="18" y="20" width="4" height="4" fill="#d4af37"/>
            <rect x="20" y="22" width="4" height="4" fill="#d4af37"/>
            {/* Border highlight */}
            <rect x="8" y="17" width="2" height="8" fill="#9b8365"/>
            <rect x="30" y="17" width="2" height="8" fill="#9b8365"/>
          </svg>
        </div>
        <div className="shield-decoration shield-2">
          <svg width="40" height="50" viewBox="0 0 40 50" className="shield-svg" style={{imageRendering: 'pixelated'}}>
            {/* Shield shape - pixelated blocks */}
            <rect x="15" y="5" width="10" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="12" y="9" width="16" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="10" y="13" width="20" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="17" width="24" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="21" width="24" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="8" y="25" width="24" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="10" y="29" width="20" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="12" y="33" width="16" height="4" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            <rect x="15" y="37" width="10" height="8" fill="#8b7355" stroke="#5a4a3a" strokeWidth="1"/>
            {/* Inner shield - darker */}
            <rect x="14" y="10" width="12" height="20" fill="#5a4a3a"/>
            {/* Circle pattern - pixelated blocks */}
            <rect x="16" y="18" width="8" height="8" fill="#d4af37"/>
            <rect x="18" y="20" width="4" height="4" fill="#f4e4a0"/>
            {/* Border highlight */}
            <rect x="8" y="17" width="2" height="8" fill="#9b8365"/>
            <rect x="30" y="17" width="2" height="8" fill="#9b8365"/>
          </svg>
        </div>
      </div>
      
      {/* Header with animated title */}
      <div className="retro-header">
        <div className="header-decoration">
          <span className="decoration-star">★</span>
          <span className="decoration-star">★</span>
          <span className="decoration-star">★</span>
        </div>
        <div className="medieval-icon-container">
          <svg width="60" height="60" viewBox="0 0 60 60" className="medieval-icon" style={{imageRendering: 'pixelated'}}>
            {/* Crown - pixelated blocks */}
            <rect x="15" y="40" width="30" height="8" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            <rect x="15" y="40" width="10" height="8" fill="#c49f27"/>
            <rect x="25" y="40" width="10" height="8" fill="#d4af37"/>
            <rect x="35" y="40" width="10" height="8" fill="#c49f27"/>
            {/* Left peak */}
            <rect x="15" y="25" width="8" height="15" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            <rect x="15" y="25" width="4" height="8" fill="#c49f27"/>
            <rect x="19" y="25" width="4" height="8" fill="#d4af37"/>
            <rect x="17" y="20" width="4" height="5" fill="#8b7355"/>
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
        <div className="retro-subtitle">Web Developer & Freelancer</div>
        <div className="blink-text">[ WELCOME TO MY DIGITAL SPACE ]</div>
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
              Hey there! I'm <span className="highlight-red">Alex</span>, a web developer and freelancer. 
              I build <span className="highlight-tech">modern web applications</span> using cutting-edge technologies,
              but I still love that classic 90s web aesthetic. This site is built with <span className="highlight-code">React</span> and <span className="highlight-code">Node.js</span>.
            </p>
            <div className="code-snippet">
              <div className="code-header">[ CODE.EXE ]</div>
              <pre>{`function buildWebsites() {
  while(alive) {
    code();
    create();
    buildAwesomeWebsites();
  }
  return success;
}`}</pre>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="retro-section">
          <div className="section-header">
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L20 15 L10 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
            <h2 className="retro-heading">My Services</h2>
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L10 15 L20 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
          </div>
          <div className="section-body">
            <div className="services-grid">
              <div className="service-item">
                <div className="service-icon">🌐</div>
                <div className="service-name">Creating Websites</div>
                <div className="service-desc">Custom web solutions</div>
              </div>
              <div className="service-item">
                <div className="service-icon">🔍</div>
                <div className="service-name">SEO Optimization</div>
                <div className="service-desc">Search engine magic</div>
              </div>
              <div className="service-item">
                <div className="service-icon">🎵</div>
                <div className="service-name">Corporate Sound</div>
                <div className="service-desc">Soundlogos & Media</div>
              </div>
              <div className="service-item">
                <div className="service-icon">⚛️</div>
                <div className="service-name">React/Node.js Dev</div>
                <div className="service-desc">Full-stack solutions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="retro-section">
          <div className="section-header">
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L20 15 L10 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
            <h2 className="retro-heading">Tech Stack</h2>
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L10 15 L20 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
          </div>
          <div className="section-body">
            <div className="tech-list">
              <div className="tech-item">
                <span className="tech-label">Frontend:</span>
                <span className="tech-value">React, HTML5, CSS3, JavaScript</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Backend:</span>
                <span className="tech-value">Node.js, Express, REST APIs</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Database:</span>
                <span className="tech-value">MongoDB, PostgreSQL</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Tools:</span>
                <span className="tech-value">Git, Webpack, Vite, npm</span>
              </div>
            </div>
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

        {/* Contact Section */}
        <div className="retro-section">
          <div className="section-header">
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L20 15 L10 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
            <h2 className="retro-heading">Contact</h2>
            <svg width="30" height="30" viewBox="0 0 30 30" className="section-icon-svg">
              <path d="M15 5 L10 15 L20 15 Z" fill="#d4af37" stroke="#8b7355" strokeWidth="1"/>
            </svg>
          </div>
          <div className="section-body">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <a href="mailto:alex@example.com" className="retro-link">alex@example.com</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">GitHub:</span>
                <a href="#" className="retro-link">github.com/alex</a>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Counter */}
        <div className="retro-section counter-section">
          <div className="retro-counter">
            <div className="counter-label">VISITOR COUNTER</div>
            <div className="counter-display">
              <span className="counter-number">{String(visitorCount).padStart(6, '0')}</span>
            </div>
            <div className="counter-subtext">You are visitor #{visitorCount}!</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="retro-section">
          <div className="retro-buttons">
            <button className="retro-button">
              <span className="button-icon">📁</span>
              View Portfolio
            </button>
            <button className="retro-button">
              <span className="button-icon">💻</span>
              Check My Code
            </button>
            <button className="retro-button">
              <span className="button-icon">📧</span>
              Hire Me
            </button>
          </div>
        </div>

        {/* Marquee */}
        <div className="retro-section marquee-section">
          <div className="retro-marquee">
            <marquee behavior="scroll" direction="left" scrollamount="3">
              ⚡ Built with React & Node.js ⚡ Optimized for performance ⚡ Mobile responsive ⚡ SEO friendly ⚡ Retro style ⚡
            </marquee>
          </div>
        </div>

        {/* Footer */}
        <div className="retro-footer">
          <div className="footer-content">
            <p>© 1999-2024 Alex's Dev Site | All Rights Reserved</p>
            <p className="retro-small">Last updated: Today | Built with React & Windows 95 Style</p>
            <div className="retro-badges">
              <span className="retro-badge">[ ACTIVE DEVELOPMENT ]</span>
              <span className="retro-badge">[ BEST VIEWED IN 800x600 ]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements - Medieval Icons */}
      <div className="floating-elements">
        <div className="floating-medieval-icon">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M15 5 L18 12 L25 12 L19 16 L22 23 L15 18 L8 23 L11 16 L5 12 L12 12 Z" fill="#d4af37" opacity="0.6"/>
          </svg>
        </div>
        <div className="floating-medieval-icon">
          <svg width="25" height="25" viewBox="0 0 25 25">
            <circle cx="12.5" cy="12.5" r="10" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.5"/>
            <path d="M12.5 2.5 L12.5 22.5 M2.5 12.5 L22.5 12.5" stroke="#d4af37" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>
        <div className="floating-medieval-icon">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M15 5 L18 12 L25 12 L19 16 L22 23 L15 18 L8 23 L11 16 L5 12 L12 12 Z" fill="#d4af37" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RetroWebsite;
