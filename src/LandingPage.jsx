import React, { useState, useEffect } from "react";
import "./LandingPage.css";
import tourismLogo from "./assets/Tourism logo.jpg";
import AIAssistant from "./AIAssistant";
import api from "./services/api";

const LandingPage = ({ onNavigateLogin, onNavigateBooking, onNavigateARPlaces }) => {
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [heroSearchResult, setHeroSearchResult] = useState('');
  const [isHeroSearching, setIsHeroSearching] = useState(false);
  const [showHeroResult, setShowHeroResult] = useState(false);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load featured packages and destinations from backend
      const [packagesResponse, destinationsResponse] = await Promise.allSettled([
        api.getFeaturedPackages(),
        api.get('/destinations')
      ]);

      if (packagesResponse.status === 'fulfilled' && packagesResponse.value.success) {
        setFeaturedPackages(packagesResponse.value.data || []);
      }

      if (destinationsResponse.status === 'fulfilled' && destinationsResponse.value.success) {
        setDestinations(destinationsResponse.value.data || []);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Failed to load some content. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // AI Response function (same as in AIAssistant but simplified for hero)
  const getHeroAIResponse = (query) => {
    const message = query.toLowerCase();
    
    if (message.includes('destination') || message.includes('place') || message.includes('visit')) {
      return "🏔️ Top Jharkhand Destinations: Ranchi (waterfalls), Netarhat (hill station), Deoghar (temples), Jamshedpur (gardens), Hazaribagh (wildlife). Which interests you most?";
    }
    
    if (message.includes('weather') || message.includes('climate')) {
      return "🌤️ Best time to visit: October to March (5°C-25°C). Summer is hot (20°C-42°C), monsoon brings heavy rains. Plan accordingly!";
    }
    
    if (message.includes('food') || message.includes('cuisine')) {
      return "🍽️ Must-try: Litti Chokha, Dhuska, Rugra mushroom curry, Pittha rice cakes. Experience authentic tribal cuisine and forest delicacies!";
    }
    
    if (message.includes('hotel') || message.includes('stay')) {
      return "🏨 Stay options: Luxury (Radisson, Chanakya), Budget (OYO, Treebo), Eco-resorts, Government guest houses. Book via jharkhandtourism.gov.in!";
    }
    
    if (message.includes('adventure') || message.includes('activity')) {
      return "🎢 Adventures: Trekking (Netarhat), Wildlife safari (Hazaribagh), Water sports (Kanke Dam), Rock climbing, Paragliding. Perfect for thrill-seekers!";
    }
    
    return "ℹ️ I can help with destinations, weather, food, hotels, adventures, and travel tips for Jharkhand. What specific information do you need?";
  };

  const handleHeroSearch = async () => {
    if (!heroSearchQuery.trim()) return;
    
    setIsHeroSearching(true);
    setShowHeroResult(true);
    
    try {
      // Try to get response from backend first, fallback to local AI
      const backendResponse = await api.get(`/tourism/search?q=${encodeURIComponent(heroSearchQuery)}`);
      
      if (backendResponse.success && backendResponse.data) {
        setHeroSearchResult(backendResponse.data.response || backendResponse.data);
      } else {
        // Fallback to local AI response
        const localResponse = getHeroAIResponse(heroSearchQuery);
        setHeroSearchResult(localResponse);
      }
    } catch (error) {
      console.log('Backend search failed, using local AI:', error);
      // Fallback to local AI response
      const localResponse = getHeroAIResponse(heroSearchQuery);
      setHeroSearchResult(localResponse);
    } finally {
      setIsHeroSearching(false);
    }
  };

  const handleHeroKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleHeroSearch();
    }
  };

  const heroQuickQuestions = [
    "Best places to visit in Jharkhand",
    "Weather and best time to travel",
    "Local food and cuisine",
    "Adventure activities available",
    "Budget hotels and accommodation"
  ];

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
          <source src="src/assets/BGvideo-1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="hero-content">
          <h1>
            Adventure & Experience <br /> 
            <span className="highlight-text">Jharkhand Tourism</span>
          </h1>
          
          <p className="hero-subtitle">
            Discover the hidden gems of Jharkhand with our AI-powered travel assistant
          </p>

          {/* AI-Powered Hero Search */}
          <div className="hero-ai-search">
            <div className="search-header">
              <h3>Ask me anything about Jharkhand tourism!</h3>
            </div>
            
            <div className="hero-search-box">
              <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  onKeyPress={handleHeroKeyPress}
                  placeholder="e.g., Best places to visit, Weather info, Local food..."
                  className="hero-search-input"
                />
                <button 
                  onClick={handleHeroSearch}
                  disabled={!heroSearchQuery.trim() || isHeroSearching}
                  className="hero-search-btn"
                >
                  {isHeroSearching ? (
                    <span className="searching">🔍 Searching...</span>
                  ) : (
                    <span>Search ✨</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Questions */}
            <div className="hero-quick-questions">
              <p>Try these popular questions:</p>
              <div className="quick-tags">
                {heroQuickQuestions.map((question, index) => (
                  <button 
                    key={index}
                    className="quick-tag"
                    onClick={() => {
                      setHeroSearchQuery(question);
                      setTimeout(() => handleHeroSearch(), 100);
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Response Area */}
            {showHeroResult && (
              <div className="hero-ai-response">
                <div className="response-header">
                  <span className="ai-avatar">🤖</span>
                  <span className="response-title">Tourism Information</span>
                  <button 
                    className="close-response"
                    onClick={() => setShowHeroResult(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="response-content">
                  {isHeroSearching ? (
                    <div className="response-loading">
                      <div className="loading-dots">
                        <span></span><span></span><span></span>
                      </div>
                      <p>Analyzing your question...</p>
                    </div>
                  ) : (
                    <div className="response-text">
                      <p><strong>Your question:</strong> "{heroSearchQuery}"</p>
                      <div className="ai-answer">{heroSearchResult}</div>
                    </div>
                  )}
                </div>

                <div className="response-actions">
                  <button 
                    className="ask-more-btn"
                    onClick={() => {
                      setHeroSearchQuery('');
                      setShowHeroResult(false);
                    }}
                  >
                    Ask Another Question
                  </button>
                  <button 
                    className="chat-btn"
                    onClick={() => setShowHeroResult(false)}
                  >
                    Open Full Chat 💬
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section id="tours" className="plan-section">
        <div className="plan-cards-container">
          <div className="plan-card card-1" onClick={onNavigateARPlaces}>
            <div className="card-icon">🗺️</div>
            <h3>Discover Jharkhand</h3>
            <p>Explore the hidden gems of Jharkhand - from ancient temples to pristine waterfalls, discover the rich cultural heritage and natural beauty.</p>
            <div className="ar-preview">
              <div className="ar-technology">
                <span className="ar-badge">🥽 AR Experience</span>
                <span className="vr-badge">🌐 360° Virtual Tours</span>
              </div>
              <button className="explore-ar-btn">Experience Virtual Tourism →</button>
            </div>
          </div>
          
          <div className="plan-card card-2" onClick={onNavigateARPlaces}>
            <div className="card-icon">🏔️</div>
            <h3>Adventure Awaits</h3>
            <p>Experience thrilling adventures in the hills and forests of Jharkhand. Trek through scenic trails and discover breathtaking landscapes.</p>
            <div className="ar-preview">
              <div className="ar-technology">
                <span className="ar-badge">🎢 Adventure VR</span>
                <span className="vr-badge">🗻 Mountain 360°</span>
              </div>
              <button className="explore-ar-btn">Explore Adventures →</button>
            </div>
          </div>
          
          <div className="plan-card card-3" onClick={onNavigateARPlaces}>
            <div className="card-icon">🎭</div>
            <h3>Cultural Heritage</h3>
            <p>Immerse yourself in the vibrant tribal culture, traditional festivals, and authentic local experiences that make Jharkhand unique.</p>
            <div className="ar-preview">
              <div className="ar-technology">
                <span className="ar-badge">🎨 Cultural AR</span>
                <span className="vr-badge">🏛️ Heritage 360°</span>
              </div>
              <button className="explore-ar-btn">Experience Culture →</button>
            </div>
          </div>
          
          <div className="plan-card card-4" onClick={onNavigateARPlaces}>
            <div className="card-icon">🌿</div>
            <h3>Nature Retreats</h3>
            <p>Find peace in Jharkhand's serene natural settings. Perfect for relaxation and reconnecting with nature's tranquility.</p>
            <div className="ar-preview">
              <div className="ar-technology">
                <span className="ar-badge">🌲 Nature VR</span>
                <span className="vr-badge">🦋 Wildlife 360°</span>
              </div>
              <button className="explore-ar-btn">Discover Nature →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog-section">
        <div className="blog-container">
          <h2 className="blog-title">Latest Stories & Insights</h2>
          <p className="blog-subtitle">Discover Jharkhand through our curated travel stories and local insights</p>
          
          <div className="blog-grid">
            <article 
              className="blog-card blog-card-1" 
              onClick={() => window.open('https://traveler23d.blogspot.com/2025/09/trekking.html', '_blank')}
              style={{ cursor: 'pointer' }}
            >
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

            <article 
              className="blog-card blog-card-2"
              onClick={() => window.open('https://traveler23d.blogspot.com/2025/09/festivalofJharkhand.html', '_blank')}
              style={{ cursor: 'pointer' }}
            >
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

      {/* Basic Booking Section */}
      <section className="booking-section">
        <div className="booking-container">
          <h2 className="booking-title">Book Your Jharkhand Adventure</h2>
          <p className="booking-subtitle">Choose from our curated tour packages and explore the beauty of Jharkhand</p>
          
          {/* Simple Booking Cards */}
          <div className="booking-grid">
            <div className="booking-card">
              <div className="booking-icon">🏔️</div>
              <h3>Adventure Tours</h3>
              <p>Experience thrilling adventures with guided trekking, rock climbing, and wildlife safaris in Jharkhand's beautiful landscapes.</p>
              <div className="booking-features">
                <span>✓ Expert Guides</span>
                <span>✓ Safety Equipment</span>
                <span>✓ Insurance Included</span>
              </div>
              <button className="booking-btn" onClick={onNavigateBooking}>
                Explore Packages
              </button>
            </div>

            <div className="booking-card">
              <div className="booking-icon">🎭</div>
              <h3>Cultural Experiences</h3>
              <p>Immerse yourself in rich tribal culture, traditional festivals, and authentic local experiences of Jharkhand.</p>
              <div className="booking-features">
                <span>✓ Cultural Guides</span>
                <span>✓ Festival Access</span>
                <span>✓ Local Interactions</span>
              </div>
              <button className="booking-btn" onClick={onNavigateBooking}>
                Explore Packages
              </button>
            </div>

            <div className="booking-card">
              <div className="booking-icon">🌿</div>
              <h3>Nature Retreats</h3>
              <p>Relax in serene natural settings with eco-friendly accommodations and wellness activities in nature's lap.</p>
              <div className="booking-features">
                <span>✓ Eco Lodges</span>
                <span>✓ Wellness Programs</span>
                <span>✓ Nature Walks</span>
              </div>
              <button className="booking-btn" onClick={onNavigateBooking}>
                Explore Packages
              </button>
            </div>
          </div>

          {/* Quick Access */}
          <div className="quick-access">
            <div className="access-content">
              <h3>Ready to Book Your Trip?</h3>
              <p>Discover detailed packages, check availability, and book your perfect Jharkhand adventure</p>
              <button className="main-booking-btn" onClick={onNavigateBooking}>
                🎫 View All Packages & Book Now
              </button>
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

      {/* Professional Government Footer */}
      <footer id="contact" className="government-footer">
        <div className="footer-content">
          <div className="footer-container">
            <div className="footer-grid">
              {/* Government Branding */}
              <div className="footer-section brand-section">
                <div className="footer-logo-section">
                  <img src={tourismLogo} alt="Jharkhand Tourism" className="footer-logo" />
                  <div className="footer-brand">
                    <h3>Jharkhand Tourism</h3>
                    <p className="footer-tagline">Government of Jharkhand</p>
                  </div>
                </div>
                <p className="footer-description">
                  Official tourism portal promoting the cultural heritage and natural beauty of Jharkhand.
                </p>
              </div>

              {/* Quick Navigation */}
              <div className="footer-section">
                <h4 className="footer-heading">Quick Links</h4>
                <ul className="footer-links">
                  <li><a href="#home">Home</a></li>
                  <li><a href="#tours">Tour Packages</a></li>
                  <li><a href="#destinations">Destinations</a></li>
                  <li><a href="https://www.jharkhand.gov.in" target="_blank" rel="noopener noreferrer">Jharkhand Government</a></li>
                </ul>
              </div>

              {/* Essential Contact */}
              <div className="footer-section">
                <h4 className="footer-heading">Contact</h4>
                <div className="footer-contact">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span>Toll Free: 1800-345-6789</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <span>tourism@jharkhand.gov.in</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span>Ranchi, Jharkhand</span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="footer-section">
                <h4 className="footer-heading">Support</h4>
                <div className="support-info">
                  <div className="helpline-item">
                    <span className="helpline-number">1363</span>
                    <span className="helpline-desc">Tourist Helpline</span>
                  </div>
                  <div className="policy-links">
                    <a href="#" target="_blank">Privacy Policy</a>
                    <a href="#" target="_blank">Terms & Conditions</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-container">
            <div className="footer-bottom-content">
              <div className="gov-emblem">
                <span className="emblem-icon">🇮🇳</span>
                <div className="emblem-text">
                  <strong>Government of Jharkhand</strong>
                  <small>Department of Tourism</small>
                </div>
              </div>
              
              <div className="copyright-info">
                <p>© 2025 Jharkhand Tourism. All Rights Reserved.</p>
              </div>
              
              <div className="footer-badges">
                <span className="footer-badge">✓ Secure</span>
                <span className="footer-badge">🔐 SSL</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default LandingPage;
