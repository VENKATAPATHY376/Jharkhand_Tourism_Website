import React, { useState, useEffect } from 'react';
import './BookingPage.css';

const BookingPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    checkin: '',
    checkout: '',
    guests: '1',
    packageType: '',
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Navigation function to go back to home
  const navigateToHome = () => {
    if (window.navigateToHome) {
      window.navigateToHome();
    } else {
      // Fallback for direct URL access
      window.location.href = '/';
    }
  };

  // Keyboard and gesture handling
  useEffect(() => {
    // Detect touch device and add visual indicators
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
      
      // Show touch gesture hint briefly on load
      setTimeout(() => {
        const bookingPage = document.querySelector('.booking-page');
        if (bookingPage) {
          bookingPage.classList.add('touch-ready');
          
          // Hide after 3 seconds
          setTimeout(() => {
            bookingPage.classList.remove('touch-ready');
          }, 3000);
        }
      }, 1000);
    }

    const handleKeyPress = (e) => {
      // ESC key to go back to home
      if (e.key === 'Escape') {
        navigateToHome();
      }
      // Alt + Left Arrow to go back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToHome();
      }
      // Ctrl + Home to go to home
      if (e.ctrlKey && e.key === 'Home') {
        e.preventDefault();
        navigateToHome();
      }
      // Backspace (when not in input) to go back
      if (e.key === 'Backspace' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        navigateToHome();
      }
    };

    // Touch gesture handling for swipe right to go back
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 100; // Minimum distance for swipe
      const swipeDistance = touchEndX - touchStartX;
      
      // Swipe right to go back (only if swipe starts from left edge)
      if (swipeDistance > swipeThreshold && touchStartX < 50) {
        navigateToHome();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.checkin) errors.checkin = 'Check-in date is required';
    if (!formData.checkout) errors.checkout = 'Check-out date is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    return errors;
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      ...formData,
      packageType: pkg.type
    });
    setCurrentStep(2);
    // Smooth scroll to form
    setTimeout(() => {
      document.querySelector('.booking-form-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3);
      // Scroll to confirmation
      setTimeout(() => {
        document.querySelector('.confirmation-section')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }, 2000);
  };

  const resetBooking = () => {
    setSelectedPackage(null);
    setCurrentStep(1);
    setFormData({
      destination: '',
      checkin: '',
      checkout: '',
      guests: '1',
      packageType: '',
      name: '',
      email: '',
      phone: '',
      specialRequests: ''
    });
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const packages = [
    {
      id: 1,
      type: 'adventure',
      title: 'Adventure Tours',
      icon: '🏔️',
      price: 9999,
      duration: '3D/2N',
      description: 'Experience thrilling adventures with guided trekking, rock climbing, and wildlife safaris.',
      features: ['Expert Guides', 'Safety Equipment', 'Insurance Included', 'All Meals'],
      location: 'Netarhat + Ranchi',
      accommodation: '3-Star Hotel',
      badge: 'Most Popular'
    },
    {
      id: 2,
      type: 'cultural',
      title: 'Cultural Experiences',
      icon: '🎭',
      price: 7499,
      duration: '2D/1N',
      description: 'Immerse yourself in tribal culture, traditional festivals, and authentic local experiences.',
      features: ['Cultural Guides', 'Festival Access', 'Local Interactions', 'Traditional Meals'],
      location: 'Deoghar + Villages',
      accommodation: 'Heritage Stay'
    },
    {
      id: 3,
      type: 'nature',
      title: 'Nature Retreats',
      icon: '🌿',
      price: 6999,
      duration: '2D/1N',
      description: 'Relax in serene natural settings with eco-friendly accommodations and wellness activities.',
      features: ['Eco Lodges', 'Wellness Programs', 'Nature Walks', 'Organic Meals'],
      location: 'Hazaribagh Wildlife',
      accommodation: 'Eco Resort'
    },
    {
      id: 4,
      type: 'wildlife',
      title: 'Wildlife Safari',
      icon: '🐅',
      price: 12999,
      duration: '4D/3N',
      description: 'Explore Jharkhand\'s wildlife sanctuaries and national parks with expert naturalists.',
      features: ['Safari Vehicles', 'Naturalist Guide', 'Photography Tips', 'Forest Lodge'],
      location: 'Palamau Tiger Reserve',
      accommodation: 'Forest Lodge'
    },
    {
      id: 5,
      type: 'heritage',
      title: 'Heritage Tours',
      icon: '🏛️',
      price: 8499,
      duration: '3D/2N',
      description: 'Discover ancient temples, historical sites, and architectural marvels of Jharkhand.',
      features: ['Heritage Guide', 'Temple Access', 'Historical Sites', 'Cultural Shows'],
      location: 'Deoghar + Palamu',
      accommodation: 'Heritage Hotel'
    },
    {
      id: 6,
      type: 'family',
      title: 'Family Packages',
      icon: '👨‍👩‍👧‍👦',
      price: 11999,
      duration: '4D/3N',
      description: 'Perfect family getaway with activities for all ages and comfortable accommodations.',
      features: ['Family Activities', 'Kid-Friendly', 'Comfortable Stay', 'All Meals'],
      location: 'Ranchi + Netarhat',
      accommodation: 'Family Resort'
    }
  ];

  return (
    <div className="booking-page">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button 
          className="back-button" 
          onClick={navigateToHome}
          aria-label="Go back to home page"
          title="Go back to home (ESC key, Alt+←, Ctrl+Home, or swipe right from left edge)"
        >
          <span className="back-icon">←</span>
          <span className="back-text">Back to Home</span>
        </button>
        <div className="navigation-shortcuts">
          <div className="shortcuts-group">
            <span className="shortcuts-label">Quick Exit:</span>
            <span className="shortcut-hint">ESC</span>
            <span className="shortcut-separator">•</span>
            <span className="shortcut-hint">Alt+←</span>
            <span className="shortcut-separator">•</span>
            <span className="shortcut-hint">Swipe →</span>
          </div>
        </div>
      </div>

      {/* Professional Header */}
      <header className="booking-header">
        <div className="header-container">
          <div className="header-content">
            <div className="government-branding">
              <div className="official-seal">
                <div className="seal-icon">🏛️</div>
                <div className="seal-text">
                  <span className="govt-name">Government of Jharkhand</span>
                  <span className="dept-name">Department of Tourism</span>
                </div>
              </div>
              <div className="certification-badges">
                <span className="cert-badge">✓ Verified</span>
                <span className="cert-badge">✓ Secure</span>
                <span className="cert-badge">✓ Official</span>
              </div>
            </div>
            
            <div className="header-title-section">
              <h1>Tourism Booking Portal</h1>
              <p>Experience Authentic Jharkhand • Secure Online Reservations</p>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span className="trust-text">SSL Secured</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span className="trust-text">Instant Booking</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🎫</span>
                <span className="trust-text">E-Tickets</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">📞</span>
                <span className="trust-text">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-icon">1</div>
            <span>Select Package</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-icon">2</div>
            <span>Fill Details</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-icon">3</div>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="booking-content">
        {/* Search Form */}
        <section className="search-section">
          <div className="search-container">
            <div className="section-header">
              <h2>🔍 Find Your Perfect Package</h2>
              <p>Filter packages based on your preferences and travel dates</p>
            </div>
            <form className="search-form">
              <div className="search-grid">
                <div className="form-group">
                  <label>📍 Destination</label>
                  <select name="destination" value={formData.destination} onChange={handleInputChange}>
                    <option value="">All Destinations</option>
                    <option value="ranchi">Ranchi - Capital City</option>
                    <option value="netarhat">Netarhat - Hill Station</option>
                    <option value="deoghar">Deoghar - Temple Town</option>
                    <option value="jamshedpur">Jamshedpur - Steel City</option>
                    <option value="hazaribagh">Hazaribagh - Wildlife Safari</option>
                    <option value="dhanbad">Dhanbad - Coal Capital</option>
                    <option value="palamau">Palamau - Tiger Reserve</option>
                    <option value="bokaro">Bokaro - Modern City</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>📅 Check-in Date</label>
                  <input 
                    type="date" 
                    name="checkin" 
                    value={formData.checkin} 
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>📅 Check-out Date</label>
                  <input 
                    type="date" 
                    name="checkout" 
                    value={formData.checkout} 
                    onChange={handleInputChange}
                    min={formData.checkin || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>👥 Travelers</label>
                  <select name="guests" value={formData.guests} onChange={handleInputChange}>
                    <option value="1">1 Traveler</option>
                    <option value="2">2 Travelers</option>
                    <option value="3">3 Travelers</option>
                    <option value="4">4 Travelers</option>
                    <option value="5">5+ Travelers</option>
                  </select>
                </div>

                <div className="form-group">
                  <button type="button" className="search-btn">
                    🔍 Filter Packages
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="packages-section">
          <div className="packages-container">
            <div className="section-header">
              <h2>✨ Available Packages</h2>
              <p>Choose from our carefully crafted experiences across Jharkhand</p>
              <div className="package-filter-tags">
                <span className="filter-tag active">All Packages</span>
                <span className="filter-tag">Adventure</span>
                <span className="filter-tag">Cultural</span>
                <span className="filter-tag">Nature</span>
                <span className="filter-tag">Wildlife</span>
              </div>
            </div>
            <div className="packages-grid">
              {packages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className={`package-card ${pkg.badge ? 'premium' : ''} ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  {pkg.badge && <div className="package-badge">{pkg.badge}</div>}
                  <div className="package-header">
                    <div className="package-icon">{pkg.icon}</div>
                    <div className="package-rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-text">4.8 (127 reviews)</span>
                    </div>
                  </div>
                  <h3>{pkg.title}</h3>
                  <div className="package-price">
                    <span className="price">₹{pkg.price.toLocaleString()}</span>
                    <span className="duration">{pkg.duration}</span>
                    <span className="price-per">per person</span>
                  </div>
                  <p>{pkg.description}</p>
                  <div className="package-highlights">
                    <h4>Package Highlights:</h4>
                    <div className="highlights-grid">
                      {pkg.features.map((feature, index) => (
                        <span key={index} className="highlight-item">
                          <i className="check-icon">✓</i> {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="package-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{pkg.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🏨</span>
                      <span className="detail-text">{pkg.accommodation}</span>
                    </div>
                  </div>
                  <div className="package-actions">
                    <button className={`select-btn ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}>
                      {selectedPackage?.id === pkg.id ? '✅ Selected' : '🎯 Select This Package'}
                    </button>
                    <button className="view-details-btn">👁️ View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Form */}
        {selectedPackage && currentStep === 2 && (
          <section className="booking-form-section">
            <div className="form-container">
              <div className="section-header">
                <h2>📝 Complete Your Booking</h2>
                <p>Please provide your details to confirm the reservation</p>
              </div>
              
              <div className="booking-summary-card">
                <div className="summary-header">
                  <h3>📋 Booking Summary</h3>
                </div>
                <div className="selected-package-info">
                  <div className="package-info-left">
                    <div className="package-mini-card">
                      <span className="mini-icon">{selectedPackage.icon}</span>
                      <div className="mini-details">
                        <h4>{selectedPackage.title}</h4>
                        <p>{selectedPackage.duration} • {selectedPackage.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="package-info-right">
                    <div className="price-breakdown">
                      <div className="price-item">
                        <span>Package Price:</span>
                        <span>₹{selectedPackage.price.toLocaleString()}</span>
                      </div>
                      <div className="price-item">
                        <span>Travelers:</span>
                        <span>{formData.guests} person(s)</span>
                      </div>
                      <div className="price-item total">
                        <span>Total Amount:</span>
                        <span>₹{(selectedPackage.price * parseInt(formData.guests)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-section">
                  <h3>👤 Personal Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={formErrors.name ? 'error' : ''}
                      />
                      {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className={formErrors.email ? 'error' : ''}
                      />
                      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit phone number"
                        className={formErrors.phone ? 'error' : ''}
                      />
                      {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label>Number of Travelers</label>
                      <select name="guests" value={formData.guests} onChange={handleInputChange}>
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5+ People</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>📅 Travel Dates</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Check-in Date *</label>
                      <input 
                        type="date" 
                        name="checkin" 
                        value={formData.checkin} 
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={formErrors.checkin ? 'error' : ''}
                      />
                      {formErrors.checkin && <span className="error-message">{formErrors.checkin}</span>}
                    </div>

                    <div className="form-group">
                      <label>Check-out Date *</label>
                      <input 
                        type="date" 
                        name="checkout" 
                        value={formData.checkout} 
                        onChange={handleInputChange}
                        min={formData.checkin || new Date().toISOString().split('T')[0]}
                        className={formErrors.checkout ? 'error' : ''}
                      />
                      {formErrors.checkout && <span className="error-message">{formErrors.checkout}</span>}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>💬 Additional Information</h3>
                  <div className="form-group">
                    <label>Special Requests (Optional)</label>
                    <textarea 
                      name="specialRequests" 
                      value={formData.specialRequests} 
                      onChange={handleInputChange}
                      placeholder="Any special requirements, dietary restrictions, or preferences..."
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={() => setCurrentStep(1)}>
                    ← Back to Packages
                  </button>
                  <button type="submit" className="book-now-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>💳 Confirm Booking - ₹{(selectedPackage.price * parseInt(formData.guests)).toLocaleString()}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Confirmation Section */}
        {currentStep === 3 && (
          <section className="confirmation-section">
            <div className="confirmation-container">
              <div className="success-animation">
                <div className="success-checkmark">✅</div>
                <h2>Booking Confirmed!</h2>
                <p>Your Jharkhand adventure is all set. Get ready for an amazing experience!</p>
              </div>
              
              <div className="confirmation-details">
                <h3>📋 Booking Details</h3>
                <div className="confirmation-info">
                  <div className="info-row">
                    <span>Booking ID:</span>
                    <span className="booking-id">JH{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="info-row">
                    <span>Package:</span>
                    <span>{selectedPackage.title}</span>
                  </div>
                  <div className="info-row">
                    <span>Traveler Name:</span>
                    <span>{formData.name}</span>
                  </div>
                  <div className="info-row">
                    <span>Email:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="info-row">
                    <span>Phone:</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div className="info-row">
                    <span>Check-in:</span>
                    <span>{new Date(formData.checkin).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span>Check-out:</span>
                    <span>{new Date(formData.checkout).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row total">
                    <span>Total Amount:</span>
                    <span>₹{(selectedPackage.price * parseInt(formData.guests)).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="next-steps">
                  <h4>📧 What's Next?</h4>
                  <ul>
                    <li>You'll receive a confirmation email within 5 minutes</li>
                    <li>Our team will contact you within 24 hours</li>
                    <li>Payment can be made online or at our office</li>
                    <li>Full refund available up to 48 hours before travel</li>
                  </ul>
                </div>
                
                <div className="confirmation-actions">
                  <button className="new-booking-btn" onClick={resetBooking}>
                    🎫 Book Another Trip
                  </button>
                  <button className="home-btn" onClick={navigateToHome}>
                    🏠 Back to Home
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Support Information */}
        <section className="support-section">
          <div className="support-container">
            <div className="support-grid">
              <div className="support-card">
                <div className="support-icon">📞</div>
                <div className="support-content">
                  <h5>24/7 Support</h5>
                  <p>1800-123-TOUR</p>
                </div>
              </div>
              <div className="support-card">
                <div className="support-icon">💳</div>
                <div className="support-content">
                  <h5>Secure Payment</h5>
                  <p>SSL Encrypted</p>
                </div>
              </div>
              <div className="support-card">
                <div className="support-icon">✅</div>
                <div className="support-content">
                  <h5>Instant Confirmation</h5>
                  <p>SMS & Email</p>
                </div>
              </div>
              <div className="support-card">
                <div className="support-icon">🔄</div>
                <div className="support-content">
                  <h5>Free Cancellation</h5>
                  <p>Up to 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Professional Footer */}
      <footer className="booking-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="govt-footer-seal">
                <span className="footer-seal-icon">🏛️</span>
                <div className="footer-seal-text">
                  <strong>Government of Jharkhand</strong>
                  <span>Department of Tourism</span>
                </div>
              </div>
            </div>
            
            <div className="footer-section">
              <h6>Quick Links</h6>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/destinations">Destinations</a></li>
                <li><a href="/packages">Tour Packages</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h6>Support</h6>
              <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/booking-policy">Booking Policy</a></li>
                <li><a href="/cancellation">Cancellation</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h6>Contact Information</h6>
              <div className="contact-info">
                <p>📞 1800-123-TOUR (Toll Free)</p>
                <p>📧 tourism@jharkhand.gov.in</p>
                <p>🕒 24/7 Customer Support</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Government of Jharkhand. All Rights Reserved.</p>
            <div className="footer-badges">
              <span className="footer-badge">Secure Booking</span>
              <span className="footer-badge">Verified Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookingPage;