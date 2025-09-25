import React from "react";
import "./LandingPage.css";
import tourismLogo from "./assets/Tourism logo.jpg";

const LandingPage = ({ onNavigateLogin }) => {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <span className="logo-text">Jharkhand Tourism</span>
          <img src={tourismLogo} alt="Jharkhand Tourism Logo" className="logo-image" />
        </div>
        <nav className="nav-links">
          <a href="#home" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a href="#tours" className="nav-link">
            <span className="nav-icon">🎒</span>
            <span>Tours</span>
          </a>
          <a href="#destinations" className="nav-link">
            <span className="nav-icon">🏔️</span>
            <span>Destinations</span>
          </a>
          <a href="#blog" className="nav-link">
            <span className="nav-icon">📝</span>
            <span>Blog</span>
          </a>
          <a href="#contact" className="nav-link">
            <span className="nav-icon">📞</span>
            <span>Contact</span>
          </a>
        </nav>
        <div className="nav-actions">
          <button className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button className="auth-btn" onClick={onNavigateLogin}>
            <span className="auth-icon">👤</span>
            <span>Login / Sign Up</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <video 
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="src/assets/BgVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <h1>
          Adventure&Experience <br /> Travel Now!
        </h1>

        <div className="ai-search-container">
          <div className="ai-search-box">
            <input type="text" placeholder="Ask anything about Jharkhand tourism..." />
            <button className="ai-search-btn">Ask AI</button>
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section id="tours" className="plan-section">
        <div className="plan-cards-container">
          <div className="plan-card card-1">
            <div className="card-icon">🗺️</div>
            <h3>Discover Jharkhand</h3>
            <p>Explore the hidden gems of Jharkhand - from ancient temples to pristine waterfalls, discover the rich cultural heritage and natural beauty.</p>
          </div>
          
          <div className="plan-card card-2">
            <div className="card-icon">🏔️</div>
            <h3>Adventure Awaits</h3>
            <p>Experience thrilling adventures in the hills and forests of Jharkhand. Trek through scenic trails and discover breathtaking landscapes.</p>
          </div>
          
          <div className="plan-card card-3">
            <div className="card-icon">🎭</div>
            <h3>Cultural Heritage</h3>
            <p>Immerse yourself in the vibrant tribal culture, traditional festivals, and authentic local experiences that make Jharkhand unique.</p>
          </div>
          
          <div className="plan-card card-4">
            <div className="card-icon">🌿</div>
            <h3>Nature Retreats</h3>
            <p>Find peace in Jharkhand's serene natural settings. Perfect for relaxation and reconnecting with nature's tranquility.</p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog-section">
        <div className="blog-container">
          <h2 className="blog-title">Latest Stories & Insights</h2>
          <p className="blog-subtitle">Discover Jharkhand through our curated travel stories and local insights</p>
          
          <div className="blog-grid">
            <article className="blog-card blog-card-1">
              <div className="blog-image-container">
                <img src="src/assets/Hiddentrail.avif" alt="Hidden trekking trails in Jharkhand" className="blog-image" />
                <div className="blog-category">Adventure</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-post-title">Trekking Through Jharkhand's Hidden Trails</h3>
                <p className="blog-excerpt">Discover the most scenic trekking routes in Jharkhand, from dense forests to breathtaking hilltops...</p>
                <div className="blog-meta">
                  <span className="blog-date">March 15, 2024</span>
                  <span className="blog-read-time">5 min read</span>
                </div>
              </div>
            </article>

            <article className="blog-card blog-card-2">
              <div className="blog-image-container">
                <img src="src/assets/Festival.jpg" alt="Tribal festivals and cultural celebrations in Jharkhand" className="blog-image" />
                <div className="blog-category">Culture</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-post-title">Tribal Festivals of Jharkhand</h3>
                <p className="blog-excerpt">Immerse yourself in the vibrant tribal culture and traditional festivals that define Jharkhand's heritage...</p>
                <div className="blog-meta">
                  <span className="blog-date">March 12, 2024</span>
                  <span className="blog-read-time">7 min read</span>
                </div>
              </div>
            </article>

            <article className="blog-card blog-card-3">
              <div className="blog-image-container">
                <img src="src/assets/Falls.jpg" alt="Breathtaking waterfalls in Jharkhand" className="blog-image" />
                <div className="blog-category">Nature</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-post-title">Waterfalls That Will Take Your Breath Away</h3>
                <p className="blog-excerpt">Explore the most stunning waterfalls in Jharkhand, perfect for nature lovers and photography enthusiasts...</p>
                <div className="blog-meta">
                  <span className="blog-date">March 10, 2024</span>
                  <span className="blog-read-time">6 min read</span>
                </div>
              </div>
            </article>

            <article className="blog-card blog-card-4">
              <div className="blog-image-container">
                <img src="src/assets/jharkhand foodIMG_6472.webp" alt="Traditional cuisine and local delicacies of Jharkhand" className="blog-image" />
                <div className="blog-category">Food</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-post-title">Traditional Cuisine of Jharkhand</h3>
                <p className="blog-excerpt">Taste the authentic flavors of Jharkhand with our guide to traditional dishes and local delicacies...</p>
                <div className="blog-meta">
                  <span className="blog-date">March 8, 2024</span>
                  <span className="blog-read-time">4 min read</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section">
        <div className="booking-container">
          <h2 className="booking-title">Book Your Jharkhand Adventure</h2>
          <p className="booking-subtitle">Choose from our curated tour packages and trusted service providers</p>
          
          <div className="booking-grid">
            <div className="booking-card">
              <div className="booking-icon">🏔️</div>
              <h3>Adventure Tours</h3>
              <p>Experience thrilling adventures with guided trekking, rock climbing, and wildlife safaris.</p>
              <div className="booking-features">
                <span>✓ Expert Guides</span>
                <span>✓ Safety Equipment</span>
                <span>✓ Insurance Included</span>
              </div>
              <button className="booking-btn">Book Now</button>
            </div>

            <div className="booking-card">
              <div className="booking-icon">🎭</div>
              <h3>Cultural Experiences</h3>
              <p>Immerse yourself in tribal culture, traditional festivals, and authentic local experiences.</p>
              <div className="booking-features">
                <span>✓ Cultural Guides</span>
                <span>✓ Festival Access</span>
                <span>✓ Local Interactions</span>
              </div>
              <button className="booking-btn">Book Now</button>
            </div>

            <div className="booking-card">
              <div className="booking-icon">🌿</div>
              <h3>Nature Retreats</h3>
              <p>Relax in serene natural settings with eco-friendly accommodations and wellness activities.</p>
              <div className="booking-features">
                <span>✓ Eco Lodges</span>
                <span>✓ Wellness Programs</span>
                <span>✓ Nature Walks</span>
              </div>
              <button className="booking-btn">Book Now</button>
            </div>
          </div>
        </div>

        {/* Official Partners Section */}
        <div className="agencies-container">
          <h2 className="agencies-title">Officially Authorized Partners</h2>
          <p className="agencies-subtitle">Trusted by Jharkhand Tourism Development Corporation</p>
          
          <div className="marquee-container">
            <div className="marquee">
              <div className="marquee-content">
                <span className="official-symbol">🏛️</span>
                <span className="official-text">Jharkhand Tourism</span>
                <span className="official-symbol">🦅</span>
                <span className="official-text">Wildlife Department</span>
                <span className="official-symbol">🎭</span>
                <span className="official-text">Cultural Heritage</span>
                <span className="official-symbol">🏔️</span>
                <span className="official-text">Adventure Sports</span>
                <span className="official-symbol">🌿</span>
                <span className="official-text">Eco Tourism</span>
                <span className="official-symbol">🏛️</span>
                <span className="official-text">Archaeological Survey</span>
                <span className="official-symbol">🦅</span>
                <span className="official-text">Forest Department</span>
                <span className="official-symbol">🎭</span>
                <span className="official-text">Tribal Affairs</span>
                <span className="official-symbol">🏔️</span>
                <span className="official-text">Mining Heritage</span>
                <span className="official-symbol">🌿</span>
                <span className="official-text">Rural Tourism</span>
                <span className="official-symbol">🏛️</span>
                <span className="official-text">Jharkhand Tourism</span>
                <span className="official-symbol">🦅</span>
                <span className="official-text">Wildlife Department</span>
                <span className="official-symbol">🎭</span>
                <span className="official-text">Cultural Heritage</span>
                <span className="official-symbol">🏔️</span>
                <span className="official-text">Adventure Sports</span>
                <span className="official-symbol">🌿</span>
                <span className="official-text">Eco Tourism</span>
                <span className="official-symbol">🏛️</span>
                <span className="official-text">Archaeological Survey</span>
                <span className="official-symbol">🦅</span>
                <span className="official-text">Forest Department</span>
                <span className="official-symbol">🎭</span>
                <span className="official-text">Tribal Affairs</span>
                <span className="official-symbol">🏔️</span>
                <span className="official-text">Mining Heritage</span>
                <span className="official-symbol">🌿</span>
                <span className="official-text">Rural Tourism</span>
              </div>
            </div>
          </div>
          
          <div className="contact-buttons">
            <button className="contact-btn primary">Contact Tourism Office</button>
            <button className="contact-btn secondary">General Enquiry</button>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section id="destinations" className="destinations">
        <div className="destination-card">
          {/* Replace with your Jharkhand image */}
          <img src="assets/Falls.jpg" alt="Chirang Fort" />
          <h3>Chirang Fort</h3>
          <p>Discover the historic fort and its cultural significance.</p>
        </div>

        <div className="destination-card">
          {/* Replace with your Jharkhand image */}
          <img src="assets/Pics-2.jpg" alt="Char Phrye" />
          <h3>Char Phrye</h3>
          <p>
            Explore breathtaking views and stunning landscapes of Jharkhand.
          </p>
        </div>

        <div className="destination-card">
          {/* Replace with your Jharkhand image */}
          <img src="assets/Pics-3.jpg" alt="Ranchi" />
          <h3>Ranchi</h3>
          <p>
            The capital city of Jharkhand with waterfalls, culture, and beauty.
          </p>
        </div>
      </section>

      {/* Government Footer */}
      <footer id="contact" className="government-footer">
        {/* Top Footer - Main Content */}
        <div className="footer-top">
          <div className="footer-container">
            <div className="footer-grid">
              {/* About Section */}
              <div className="footer-section">
                <div className="footer-logo-section">
                  <img src={tourismLogo} alt="Jharkhand Tourism" className="footer-logo" />
                  <div className="footer-brand">
                    <h3>Jharkhand Tourism</h3>
                    <p className="footer-tagline">Government of Jharkhand</p>
                  </div>
                </div>
                <p className="footer-description">
                  Official tourism portal of Jharkhand Government promoting cultural heritage, 
                  natural beauty, and adventure tourism in the state.
                </p>
                <div className="footer-certifications">
                  <div className="cert-item">
                    <span className="cert-icon">🏛️</span>
                    <span>ISO 9001:2015 Certified</span>
                  </div>
                  <div className="cert-item">
                    <span className="cert-icon">🔒</span>
                    <span>Secure Government Portal</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="footer-section">
                <h4 className="footer-heading">Quick Links</h4>
                <ul className="footer-links">
                  <li><a href="#home">Home</a></li>
                  <li><a href="#tours">Tour Packages</a></li>
                  <li><a href="#destinations">Destinations</a></li>
                  <li><a href="#blog">Travel Guide</a></li>
                  <li><a href="https://www.jharkhand.gov.in" target="_blank" rel="noopener noreferrer">Jharkhand Government</a></li>
                  <li><a href="#" target="_blank">Tourism Policy</a></li>
                </ul>
              </div>

              {/* Government Links */}
              <div className="footer-section">
                <h4 className="footer-heading">Government Services</h4>
                <ul className="footer-links">
                  <li><a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer">India.gov.in</a></li>
                  <li><a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer">Digital India</a></li>
                  <li><a href="https://www.mygov.in" target="_blank" rel="noopener noreferrer">MyGov.in</a></li>
                  <li><a href="#" target="_blank">RTI Portal</a></li>
                  <li><a href="#" target="_blank">Public Grievances</a></li>
                  <li><a href="#" target="_blank">Tenders</a></li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="footer-section">
                <h4 className="footer-heading">Contact Information</h4>
                <div className="footer-contact">
                  <div className="contact-detail">
                    <span className="contact-icon">📍</span>
                    <div>
                      <strong>Jharkhand Tourism Development Corporation Ltd.</strong><br/>
                      3rd Floor, Transport Bhawan<br/>
                      Doranda, Ranchi - 834002<br/>
                      Jharkhand, India
                    </div>
                  </div>
                  
                  <div className="contact-detail">
                    <span className="contact-icon">📞</span>
                    <div>
                      <strong>Phone:</strong> +91-651-2446775<br/>
                      <strong>Toll Free:</strong> 1800-345-6789<br/>
                      <strong>Helpline:</strong> +91-651-2446346
                    </div>
                  </div>
                  
                  <div className="contact-detail">
                    <span className="contact-icon">✉️</span>
                    <div>
                      <strong>Email:</strong><br/>
                      info@jharkhnadtourism.gov.in<br/>
                      tourism@jharkhand.gov.in
                    </div>
                  </div>

                  <div className="contact-detail">
                    <span className="contact-icon">🌐</span>
                    <div>
                      <strong>Website:</strong><br/>
                      www.jharkhandtourism.gov.in
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Footer - Additional Links */}
        <div className="footer-middle">
          <div className="footer-container">
            <div className="footer-policies">
              <div className="policy-section">
                <h5>Important Links</h5>
                <div className="policy-links">
                  <a href="#" target="_blank">Privacy Policy</a>
                  <a href="#" target="_blank">Terms & Conditions</a>
                  <a href="#" target="_blank">Disclaimer</a>
                  <a href="#" target="_blank">Copyright Policy</a>
                  <a href="#" target="_blank">Hyperlinking Policy</a>
                  <a href="#" target="_blank">Accessibility Statement</a>
                </div>
              </div>
              
              <div className="policy-section">
                <h5>Tourist Helpline</h5>
                <div className="helpline-info">
                  <div className="helpline-item">
                    <span className="helpline-number">1363</span>
                    <span className="helpline-desc">24x7 Tourist Helpline</span>
                  </div>
                  <div className="helpline-item">
                    <span className="helpline-number">1800-111-363</span>
                    <span className="helpline-desc">Incredible India Helpline</span>
                  </div>
                </div>
              </div>
              
              <div className="policy-section">
                <h5>Follow Us</h5>
                <div className="social-links">
                  <a href="#" target="_blank" className="social-link facebook" aria-label="Facebook">
                    <span>📘</span>
                  </a>
                  <a href="#" target="_blank" className="social-link twitter" aria-label="Twitter">
                    <span>🐦</span>
                  </a>
                  <a href="#" target="_blank" className="social-link instagram" aria-label="Instagram">
                    <span>📷</span>
                  </a>
                  <a href="#" target="_blank" className="social-link youtube" aria-label="YouTube">
                    <span>📹</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer - Copyright & Compliance */}
        <div className="footer-bottom">
          <div className="footer-container">
            <div className="footer-bottom-content">
              <div className="copyright-section">
                <div className="gov-emblem">
                  <span className="emblem-icon">🇮🇳</span>
                  <div className="emblem-text">
                    <strong>Government of Jharkhand</strong><br/>
                    <small>Ministry of Tourism & Culture</small>
                  </div>
                </div>
                <div className="copyright-text">
                  <p>© 2024 Jharkhand Tourism Development Corporation Ltd. All Rights Reserved.</p>
                  <p className="compliance-text">
                    This is the official website of Jharkhand Tourism. Content owned by 
                    Jharkhand Tourism Development Corporation Ltd., Government of Jharkhand.
                  </p>
                </div>
              </div>
              
              <div className="footer-compliance">
                <div className="compliance-badges">
                  <div className="badge-item">
                    <span className="badge-icon">✓</span>
                    <span>WCAG 2.1 AA Compliant</span>
                  </div>
                  <div className="badge-item">
                    <span className="badge-icon">🔐</span>
                    <span>SSL Secured</span>
                  </div>
                </div>
                <div className="last-updated">
                  <small>Last Updated: September 25, 2025 | Version 2.1</small><br/>
                  <small>Best viewed in Chrome, Firefox, Safari, Edge (Latest Versions)</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
