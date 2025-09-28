import React, { useState, useEffect } from 'react';
import "./UserLogin.css";
import tourismLogo from "./assets/Tourism logo.jpg";
import { authService } from './services/api';

const UserLogin = ({ onNavigateHome }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // Test API connectivity on component mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing API connectivity...');
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        console.log('✅ API is reachable:', data);
      } catch (error) {
        console.error('❌ API connectivity test failed:', error);
        setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
      }
    };

    testAPI();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        // Login user
        const response = await authService.login(formData.email, formData.password);
        
        if (response.success) {
          setSuccessMessage('Login successful! Welcome back!');
          console.log('User logged in:', response.user);
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            onNavigateHome();
          }, 2000);
        }
      } else {
        // Register user
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match!');
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        if (!formData.phone) {
          setError('Phone number is required');
          setIsLoading(false);
          return;
        }

        const response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });

        if (response.success) {
          setSuccessMessage('Registration successful! Please check your email to verify your account.');
          console.log('User registered:', response.user);
          
          // Clear form and switch to login
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: ''
          });
          
          // Switch to login mode after 3 seconds
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage('');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      {/* Background Video */}
      <video 
        className="login-bg-video" 
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="src/assets/BgVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Header */}
      <header className="login-header">
        <div className="login-logo">
          <span className="login-logo-text">Jharkhand Tourism</span>
          <img src={tourismLogo} alt="Jharkhand Tourism Logo" className="login-logo-image" />
        </div>
        <button onClick={onNavigateHome} className="back-to-home">
          ← Back to Home
        </button>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-content">
          {/* Left Side - Welcome Content */}
          <div className="welcome-content">
            <h1 className="welcome-title">
              Discover the Heart of India
            </h1>
            <p className="welcome-subtitle">
              Join thousands of travelers exploring the untamed beauty and rich cultural heritage of Jharkhand
            </p>
            
            <div className="welcome-features">
              <div className="feature-item">
                <span className="feature-icon">🏔️</span>
                <span>Adventure Tours & Trekking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎭</span>
                <span>Cultural Heritage Experiences</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌿</span>
                <span>Nature Retreats & Wildlife</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📸</span>
                <span>Photography & Scenic Spots</span>
              </div>
            </div>

            <div className="jharkhand-highlights">
              <h3 className="highlights-title">Popular Destinations</h3>
              <div className="highlights-list">
                <div className="highlight-item">• Hundru Falls</div>
                <div className="highlight-item">• Netarhat Hill Station</div>
                <div className="highlight-item">• Betla National Park</div>
                <div className="highlight-item">• Dassam Falls</div>
                <div className="highlight-item">• Rajrappa Temple</div>
                <div className="highlight-item">• Jagannath Temple</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`login-form-container ${isLoading ? 'loading' : ''}`}>
            <div className="form-header">
              <div className="form-icon">
                <img src={tourismLogo} alt="Tourism Icon" />
              </div>
              <h2 className="form-title">
                {isLogin ? 'Welcome Back' : 'Join the Adventure'}
              </h2>
              <p className="form-subtitle">
                {isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
              </p>
            </div>

            {/* Auth Toggle */}
            <div className="auth-toggle">
              <button 
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Login
              </button>
              <button 
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Sign Up
              </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Field (Signup only) */}
              <div className={`form-group name-field ${!isLogin ? 'show' : ''}`}>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required={!isLogin}
                  />
                </div>
              </div>

              {/* Phone Field (Signup only) */}
              <div className={`form-group phone-field ${!isLogin ? 'show' : ''}`}>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required={!isLogin}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Signup only) */}
              {!isLogin && (
                <div className="form-group">
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="forgot-password">
                  <a href="#" className="forgot-link">
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Please wait...' 
                  : isLogin 
                    ? 'Sign In to Adventure' 
                    : 'Begin Your Journey'
                }
              </button>

              {/* Social Login Divider */}
              <div className="social-divider">
                <span className="divider-text">or continue with</span>
              </div>

              {/* Social Login Buttons */}
              <div className="social-buttons">
                <button type="button" className="social-btn">
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </form>

            {/* Toggle Auth Mode */}
            <div className="auth-toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleAuthMode}
                className="toggle-link"
                type="button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Adventure Quote */}
      <div className="adventure-quote">
        <p className="quote-text">
          "Adventure awaits those who dare to explore the unknown landscapes of Jharkhand"
        </p>
      </div>
    </div>
  );
};

export default UserLogin;