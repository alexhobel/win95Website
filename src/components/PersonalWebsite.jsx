import { useState, useEffect } from 'react';
import RecordCollectionView from './RecordCollectionView';
import bandPicture from '../assets/WebsiteMedia/Bandpicture.jpeg';
import lightningGif from '../assets/Gifs/Lightning.gif';
import lightning2Gif from '../assets/Gifs/lightning2.gif';
import chainGif from '../assets/Gifs/linkschainam.gif';
import castleGif from '../assets/Gifs/Castle.gif';
import hexeGif from '../assets/Gifs/Hexe.gif';
import dragonGif from '../assets/Gifs/Dragon.gif';
import magicianGif from '../assets/Gifs/Magician.gif';
import fireandFlameGif from '../assets/Gifs/FireandFlame.gif';
import './RetroWebsite.css';

const PersonalWebsite = () => {
  const [visitorCount, setVisitorCount] = useState(1337);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRecordCollection, setShowRecordCollection] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const handleOpenContact = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const event = new CustomEvent('openContactForm', { bubbles: true });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    // Defer setState to avoid synchronous state update
    setTimeout(() => {
      setIsLoaded(true);
    }, 0);
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
    <div className={`retro-website gothic-theme ${isLoaded ? 'loaded' : ''}`}>
      {/* Header with A.L.E.X and Lightning */}
      <div className="gothic-header">
        <div className="lightning-group-left">
          <img src={lightningGif} alt="lightning" className="header-lightning header-lightning-left" />
          <img src={lightning2Gif} alt="lightning" className="header-lightning header-lightning-left" />
        </div>
        <div className="header-content">
          <h1 className="gothic-title">A.L.E.X</h1>
          <div className="header-subtitle">Welcome to my Site</div>
        </div>
        <div className="lightning-group-right">
          <img src={lightning2Gif} alt="lightning" className="header-lightning header-lightning-right" />
          <img src={lightningGif} alt="lightning" className="header-lightning header-lightning-right" />
        </div>
      </div>

      {/* Chain Separator - Above Menu */}
      <div className="chain-separator">
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
      </div>

      {/* Navigation Menu */}
      <nav className="gothic-menu">
        <button 
          className={`gothic-menu-item ${activeSection === 'about' ? 'active' : ''}`}
          onClick={() => setActiveSection('about')}
        >
          About Me
        </button>
        <button 
          className={`gothic-menu-item ${activeSection === 'music' ? 'active' : ''}`}
          onClick={() => setActiveSection('music')}
        >
          Music
        </button>
        <button 
          className={`gothic-menu-item ${activeSection === 'record' ? 'active' : ''}`}
          onClick={() => setShowRecordCollection(true)}
        >
          Record Collector
        </button>
      </nav>

      {/* Chain Separator - Below Menu */}
      <div className="chain-separator">
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
        <img src={chainGif} alt="chain" className="chain-gif" />
      </div>

      {/* Main Content Sections */}
      <div className="gothic-content">
        {/* About Me Section */}
        {activeSection === 'about' && (
          <>
            <div className="gothic-section">
              <div className="section-gif-left">
                {Array.from({ length: 2 }).map((_, i) => (
                  <img key={i} src={castleGif} alt="castle" className="section-gif" />
                ))}
              </div>
              <div className="section-content">
                <h2 className="gothic-heading">About Me</h2>
                <p className="gothic-text">
                  I'm Alex, a Web Developer. 
                  If you want to talk about creative projects,{' '}
                  <a href="#" className="cta-link" onClick={handleOpenContact}>
                    text me
                  </a>
                </p>
                <p className="gothic-text">
                  I collect records and play music.{' '}
                  <button 
                    className="gothic-button"
                    onClick={() => setShowRecordCollection(true)}
                  >
                    Show My Record Collection
                  </button>
                </p>
              </div>
              <div className="section-gif-right">
                {Array.from({ length: 2 }).map((_, i) => (
                  <img key={i} src={magicianGif} alt="magician" className="section-gif" />
                ))}
              </div>
            </div>

          </>
        )}

        {/* Music Section */}
        {activeSection === 'music' && (
          <>
            <div className="gothic-section">
              <div className="section-gif-left">
                {Array.from({ length: 5 }).map((_, i) => (
                  <img key={i} src={hexeGif} alt="hexe" className="section-gif" />
                ))}
              </div>
              <div className="section-content">
                <h2 className="gothic-heading">Music</h2>
                <p className="gothic-text">
                  When I'm not coding, I'm passionate about music! I make music, play in a band, and do music production.
                </p>
                
                {/* Band Section */}
                <div className="band-section">
                  <h3 className="gothic-subheading">My Band</h3>
                  <div className="band-content">
                    <div className="band-image-container">
                      <img 
                        src={bandPicture} 
                        alt="Void & The Nothingness" 
                        className="band-picture"
                      />
                    </div>
                    <div className="band-info">
                      <div className="bandcamp-embeds">
                        <div className="bandcamp-embed-wrapper">
                          <iframe 
                            style={{border: 0, width: '100%', height: '120px'}} 
                            src="https://bandcamp.com/EmbeddedPlayer/album=2413986700/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/" 
                            seamless
                            title="Ride Out / Witching Hour"
                          ><a href="https://voidnothingnessdoom.bandcamp.com/album/ride-out-witching-hour">Ride Out / Witching Hour by Void &amp; The Nothingness</a></iframe>
                        </div>
                        <div className="bandcamp-embed-wrapper">
                          <iframe 
                            style={{border: 0, width: '100%', height: '120px'}} 
                            src="https://bandcamp.com/EmbeddedPlayer/album=786884318/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/" 
                            seamless
                            title="Void & The Nothingness"
                          ><a href="https://voidnothingnessdoom.bandcamp.com/album/void-the-nothingness">Void &amp; The Nothingness by Void &amp; The Nothingness</a></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section-gif-right">
                {Array.from({ length: 5 }).map((_, i) => (
                  <img key={i} src={dragonGif} alt="dragon" className="section-gif" />
                ))}
              </div>
            </div>

          </>
        )}

      </div>

      {/* Spotify Embed - Global */}
      <div className="spotify-embed-container">
        <div className="spotify-embed-wrapper">
          <div className="spotify-flames">
            <div className="spotify-flame-column">
              {Array.from({ length: 4 }).map((_, i) => (
                <img key={i} src={fireandFlameGif} alt="flame" className="spotify-flame" />
              ))}
            </div>
            <div className="spotify-iframe-container">
              <iframe 
                data-testid="embed-iframe" 
                style={{borderRadius: '12px'}} 
                src="https://open.spotify.com/embed/playlist/07J2uE4csQ5AXH8a2OpEfy?utm_source=generator&theme=0&autoplay=true" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="spotify-iframe"
              ></iframe>
            </div>
            <div className="spotify-flame-column">
              {Array.from({ length: 4 }).map((_, i) => (
                <img key={i} src={fireandFlameGif} alt="flame" className="spotify-flame" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="gothic-footer">
        <div className="footer-text">© 2024 Alex | Made with ❤️ and 🎵</div>
        <div className="footer-counter">Visitors: {visitorCount.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default PersonalWebsite;
