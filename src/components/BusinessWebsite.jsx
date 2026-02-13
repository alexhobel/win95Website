import { useState, useEffect } from 'react';
import './BusinessWebsite.css';

const BusinessWebsite = () => {
  const [visitorCount, setVisitorCount] = useState(1337);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Simulate visitor counter increment
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`business-website ${isLoaded ? 'loaded' : ''}`}>
      {/* Header */}
      <div className="business-header">
        <div className="header-top-bar"></div>
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-box">AH</div>
            </div>
            <div className="header-title">
              <h1 className="main-title">Alexander Hobelsberger</h1>
              <p className="subtitle">Freelance Web Developer & Consultant</p>
            </div>
          </div>
          <div className="header-right">
            <div className="contact-badge">
              <span className="badge-icon">📧</span>
              <span className="badge-text">Available for Projects</span>
            </div>
          </div>
        </div>
        <div className="header-nav">
          <a href="#about" className="nav-link">About</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#portfolio" className="nav-link">Portfolio</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="business-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Professional Web Development Services</h2>
            <p className="hero-description">
              Building modern, scalable web applications with cutting-edge technologies.
              Specialized in React, Node.js, and full-stack development.
            </p>
            <div className="hero-buttons">
              <button className="cta-button primary">Get Started</button>
              <button className="cta-button secondary">View Portfolio</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="tech-icons-grid">
              <div className="tech-icon">⚛️</div>
              <div className="tech-icon">🟢</div>
              <div className="tech-icon">📦</div>
              <div className="tech-icon">🗄️</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="content-section">
          <div className="section-title-bar">
            <span className="section-number">01</span>
            <h2 className="section-title">About Me</h2>
            <div className="title-line"></div>
          </div>
          <div className="section-content">
            <div className="about-grid">
              <div className="about-text">
                <p className="business-text">
                  I'm <strong>Alex</strong>, a freelance web developer with expertise in modern web technologies.
                  I specialize in creating responsive, performant web applications using React, Node.js, and various databases.
                </p>
                <p className="business-text">
                  With years of experience in both frontend and backend development, I help businesses
                  build robust digital solutions that scale with their growth.
                </p>
              </div>
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Projects Completed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="content-section services-section">
          <div className="section-title-bar">
            <span className="section-number">02</span>
            <h2 className="section-title">My Services</h2>
            <div className="title-line"></div>
          </div>
          <div className="section-content">
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">🌐</div>
                <h3 className="service-title">Web Development</h3>
                <p className="service-description">
                  Custom website development using modern frameworks and best practices.
                  Responsive design, SEO optimization, and performance tuning.
                </p>
                <ul className="service-features">
                  <li>React & Next.js Applications</li>
                  <li>Responsive Design</li>
                  <li>SEO Optimization</li>
                  <li>Performance Optimization</li>
                </ul>
              </div>
              <div className="service-card">
                <div className="service-icon">🔍</div>
                <h3 className="service-title">SEO & Optimization</h3>
                <p className="service-description">
                  Search Engine Optimization and Generative Engine Optimization.
                  Improve your visibility and rankings.
                </p>
                <ul className="service-features">
                  <li>SEO Strategy & Implementation</li>
                  <li>Content Optimization</li>
                  <li>Analytics & Reporting</li>
                  <li>Technical SEO</li>
                </ul>
              </div>
              <div className="service-card">
                <div className="service-icon">🎵</div>
                <h3 className="service-title">Corporate Sound</h3>
                <p className="service-description">
                  Soundlogos, jingles, and audio branding for your business.
                  Professional audio production services.
                </p>
                <ul className="service-features">
                  <li>Soundlogo Creation</li>
                  <li>Social Media Audio</li>
                  <li>Audio Branding</li>
                  <li>Music Production</li>
                </ul>
              </div>
              <div className="service-card">
                <div className="service-icon">⚛️</div>
                <h3 className="service-title">Full-Stack Development</h3>
                <p className="service-description">
                  End-to-end web application development.
                  From database design to frontend implementation.
                </p>
                <ul className="service-features">
                  <li>Node.js & Express</li>
                  <li>Database Design</li>
                  <li>API Development</li>
                  <li>System Architecture</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div id="portfolio" className="content-section tech-section">
          <div className="section-title-bar">
            <span className="section-number">03</span>
            <h2 className="section-title">Tech Stack</h2>
            <div className="title-line"></div>
          </div>
          <div className="section-content">
            <div className="tech-categories">
              <div className="tech-category">
                <h3 className="category-title">Frontend</h3>
                <div className="tech-tags">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">HTML5</span>
                  <span className="tech-tag">CSS3</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">TypeScript</span>
                </div>
              </div>
              <div className="tech-category">
                <h3 className="category-title">Backend</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Node.js</span>
                  <span className="tech-tag">Express</span>
                  <span className="tech-tag">REST APIs</span>
                  <span className="tech-tag">GraphQL</span>
                </div>
              </div>
              <div className="tech-category">
                <h3 className="category-title">Database</h3>
                <div className="tech-tags">
                  <span className="tech-tag">MongoDB</span>
                  <span className="tech-tag">PostgreSQL</span>
                  <span className="tech-tag">MySQL</span>
                </div>
              </div>
              <div className="tech-category">
                <h3 className="category-title">Tools & DevOps</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Git</span>
                  <span className="tech-tag">Docker</span>
                  <span className="tech-tag">Vite</span>
                  <span className="tech-tag">Webpack</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="content-section contact-section">
          <div className="section-title-bar">
            <span className="section-number">04</span>
            <h2 className="section-title">Get In Touch</h2>
            <div className="title-line"></div>
          </div>
          <div className="section-content">
            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">hobelsbergeralex@gmail.com</div>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💼</span>
                  <div>
                    <div className="contact-label">Availability</div>
                    <div className="contact-value">Available for new projects</div>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <div>
                    <div className="contact-label">Location</div>
                    <div className="contact-value">Remote & On-site</div>
                  </div>
                </div>
              </div>
              <div className="contact-cta">
                <p className="cta-text">Ready to start your project?</p>
                <p className="cta-subtext">Let's discuss how I can help bring your ideas to life.</p>
                <button className="cta-button primary large">Contact Me</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="business-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">AH</div>
            <div className="footer-text">© 2024 Alexander Hobelsberger. All rights reserved.</div>
          </div>
          <div className="footer-right">
            <div className="footer-stats">
              <span className="footer-stat">Visitors: {visitorCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessWebsite;

