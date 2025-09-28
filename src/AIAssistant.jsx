import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API Helper Functions
const chatAPI = {
  async startSession(sessionType = 'general') {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/chat/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          session_type: sessionType,
          user_info: {},
          session_metadata: {
            browser: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to start chat session');
    } catch (error) {
      console.error('Error starting chat session:', error);
      return null;
    }
  },

  async sendMessage(sessionId, messageText, messageType = 'text') {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          message_text: messageText,
          message_type: messageType,
          entities_extracted: extractEntities(messageText)
        })
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  async getChatHistory(sessionId) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}/messages`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to get chat history');
    } catch (error) {
      console.error('Error getting chat history:', error);
      return null;
    }
  },

  async createSupportTicket(sessionId, ticketData) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}/create-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(ticketData)
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      throw new Error(data.message || 'Failed to create support ticket');
    } catch (error) {
      console.error('Error creating support ticket:', error);
      return null;
    }
  }
};

// Extract entities from message text for better AI processing
const extractEntities = (messageText) => {
  const entities = {};
  
  // Extract booking ID pattern
  const bookingIdMatch = messageText.match(/JH202[0-9]{5}/i);
  if (bookingIdMatch) {
    entities.booking_id = bookingIdMatch[0].toUpperCase();
  }
  
  // Extract phone numbers
  const phoneMatch = messageText.match(/(\+91|91)?\s*[6-9]\d{9}/);
  if (phoneMatch) {
    entities.phone_number = phoneMatch[0];
  }
  
  // Extract email
  const emailMatch = messageText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    entities.email = emailMatch[0];
  }
  
  // Extract amount
  const amountMatch = messageText.match(/₹\s*[\d,]+|rs\.?\s*[\d,]+|\d+\s*rupees?/i);
  if (amountMatch) {
    entities.amount = amountMatch[0];
  }
  
  return entities;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeService, setActiveService] = useState('main');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🏛️ Welcome to Jharkhand Tourism Service Center! I'm your digital assistant for:\n\n💰 Payment & Booking Tracking\n🎫 Ticket Reservations\n📞 Customer Support\n🏨 Hotel & Package Management\n🚌 Transport Services\n\nHow can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // connected, connecting, disconnected, error
  const [userInfo, setUserInfo] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session when component opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChatSession();
    }
  }, [isOpen]);

  // Get user info from localStorage
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Try to decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({ 
          id: payload.id, 
          name: payload.name || 'User',
          isAuthenticated: true 
        });
      } catch (error) {
        console.log('No valid user token found');
        setUserInfo({ isAuthenticated: false });
      }
    } else {
      setUserInfo({ isAuthenticated: false });
    }
  }, []);

  const initializeChatSession = async () => {
    setConnectionStatus('connecting');
    try {
      const session = await chatAPI.startSession('general');
      if (session) {
        setSessionId(session.session_id);
        setConnectionStatus('connected');
        
        // Update welcome message with user info
        if (userInfo?.isAuthenticated) {
          const welcomeMessage = {
            id: Date.now(),
            text: `🙏 Welcome back, ${userInfo.name}! I have access to your booking history and can provide personalized assistance.\n\n🎯 Quick Actions:\n• View your bookings\n• Track payments\n• Get support\n• Manage reservations\n\nHow can I help you today?`,
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [welcomeMessage]);
        }
      } else {
        throw new Error('Failed to start session');
      }
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      setConnectionStatus('error');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now(),
        text: "⚠️ Unable to connect to our service center. You can still chat with me, but your conversation won't be saved. Please check your internet connection.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Enhanced service-oriented responses for tourism assistance
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Smart greeting detection
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('namaste')) {
      return "🙏 Namaste! Welcome to Jharkhand Tourism Service Center!\n\nI'm your dedicated service assistant ready to help with:\n\n🎫 Booking Management & Tracking\n💳 Payment Processing & Refunds\n📞 24/7 Customer Support\n🏨 Accommodation Services\n🚌 Transportation Booking\n🗺️ Tourism Information\n\nHow may I assist you today? Feel free to click any quick service button below or type your question!";
    }
    
    // Payment & Booking Services
    if (message.includes('track my booking') || message.includes('booking status') || message.includes('payment') || message.includes('booking') || message.includes('reservation')) {
      return "💰 Payment & Booking Services:\n\n🎫 Track Booking: Enter booking ID (JH2025XXXX)\n💳 Payment Status: Check payment confirmation\n🔄 Modify Booking: Change dates/guest count\n❌ Cancel Booking: Request refund processing\n📧 E-tickets: Resend confirmation emails\n\n💡 Booking ID format: JH2025 + 4 digits\n\n🔍 To track your booking, simply provide:\n• Booking ID: JH2025XXXX\n• Mobile Number: +91XXXXXXXXXX\n\nWhat specific booking service do you need?";
    }
    
    if (message.includes('track') || message.includes('status') || message.includes('confirmation')) {
      return "📍 Smart Booking Tracking System:\n\n🔍 Real-time Status Check:\n• Confirmed ✅ - Ready for your trip!\n• Processing ⏳ - Under verification\n• Cancelled ❌ - Refund initiated\n• Refund Pending 💰 - 3-5 business days\n\n📱 Quick Track Methods:\n• SMS: Send 'TRACK JH2025XXXX' to 56070\n• WhatsApp: +91-9876543210\n• Website: jharkhandtourism.gov.in/track\n\n💡 Have your booking ID ready? Just type it here!\nExample: JH20251234";
    }
    
    if (message.includes('customer support chat') || message.includes('customer') || message.includes('support') || message.includes('help') || message.includes('complaint')) {
      return "📞 24/7 Customer Support Hub:\n\n🎧 Instant Support Options:\n• Live Chat: Right here with me!\n• Video Call: Schedule via app\n• Phone: 1800-123-TOUR (Toll-free)\n• WhatsApp: +91-9876543210\n\n🏢 Physical Support Centers:\n• Ranchi: Main Secretariat\n• Jamshedpur: JTDC Office\n• Dhanbad: Tourist Information\n\n🆘 Emergency Assistance:\n• Tourist Helpline: 1363 (24x7)\n• Police: 100 | Medical: 102\n• Fire: 101 | Disaster: 108\n\nWhat specific issue needs resolution? I'm here to help! 😊";
    }
    
    if (message.includes('payment & refund help') || message.includes('refund') || message.includes('cancel') || message.includes('money')) {
      return "💰 Smart Refund & Cancellation System:\n\n⏰ Flexible Cancellation Policy:\n• 48+ hours: 100% refund (No questions asked)\n• 24-48 hours: 75% refund (Service charges apply)\n• 12-24 hours: 50% refund (Emergency cases)\n• <12 hours: 25% refund (Force majeure only)\n\n� Quick Refund Process:\n• Instant online cancellation\n• Auto-refund in 2-4 hours\n• SMS/Email confirmation\n• Direct bank transfer\n\n� Cancel Now Options:\n• Website: One-click cancellation\n• App: Slide to cancel\n• Call: 1800-123-TOUR\n• Here: Type 'CANCEL [Booking ID]'\n\nNeed immediate cancellation assistance?";
    }
    
    if (message.includes('tour package information') || message.includes('package') || message.includes('tour') || message.includes('itinerary')) {
      return "🌟 Premium Tour Package Collections:\n\n🏞️ Popular Packages (2024-25):\n• Weekend Escape (2D/1N): ₹3,500\n  → Ranchi + Hundru Falls\n• Heritage Trail (3D/2N): ₹6,800\n  → Deoghar + Baidyanath Temple\n• Adventure Quest (4D/3N): ₹9,200\n  → Netarhat + Paragliding\n• Tribal Discovery (5D/4N): ₹12,500\n  → Village stays + Cultural shows\n\n✨ What's Included:\n🏨 Premium accommodation\n🍽️ All meals (Local cuisine)\n🚌 AC transport + Guide\n🎫 All entry tickets\n🛡️ Travel insurance\n📸 Photo sessions\n\n🎯 Custom Packages Available!\nWhich destination interests you most?";
    }
    
    if (message.includes('hotel') || message.includes('accommodation') || message.includes('stay')) {
      return "🏨 Accommodation Options:\n\n• Luxury Hotels: Radisson, Chanakya BNR\n• Budget Hotels: OYO, Treebo properties\n• Government Guest Houses: JTDC properties\n• Eco Resorts: Forest department resorts\n• Homestays: Tribal village experiences\n\nBook through official tourism portal for best rates!";
    }
    
    if (message.includes('transport') || message.includes('travel') || message.includes('reach')) {
      return "🚗 How to Reach Jharkhand:\n\n✈️ Air: Ranchi (Birsa Munda Airport)\n🚂 Rail: Major stations - Ranchi, Jamshedpur, Dhanbad\n🚌 Road: Well connected by NH-33, NH-2\n🚕 Local: Taxis, auto-rickshaws, buses\n\nState transport buses connect all major destinations!";
    }
    
    if (message.includes('adventure') || message.includes('activity')) {
      return "🎢 Adventure Activities:\n\n• Trekking: Netarhat, Parasnath Hills\n• Water Sports: Kanke Dam, Getalsud Dam\n• Wildlife Safari: Hazaribagh, Palamau\n• Rock Climbing: Ranchi Rock Garden\n• Paragliding: Rajrappa Hills\n• River Rafting: Subarnarekha River\n\nPerfect for adventure enthusiasts!";
    }
    
    if (message.includes('booking') || message.includes('book')) {
      return "📱 Easy Booking Options:\n\n• Official Website: jharkhandtourism.gov.in\n• JTDC Offices: In major cities\n• Online Portals: MakeMyTrip, Booking.com\n• Tourist Helpline: 1364 (24x7)\n• Mobile App: Jharkhand Tourism\n\nBook in advance for better deals and availability!";
    }
    
    if (message.includes('help') || message.includes('contact')) {
      return "📞 Tourist Assistance:\n\n• Helpline: 1364 (Toll-free)\n• Emergency: 100, 102, 108\n• Tourist Police: Available at major destinations\n• Information Centers: At airports, stations\n• Email: info@jharkhandtourism.gov.in\n\nWe're here to help 24/7!";
    }
    
    if (message.includes('transport') || message.includes('bus') || message.includes('taxi')) {
      return "🚌 Transport Services:\n\n🚍 Government Bus Booking:\n• AC Volvo: ₹800-1200\n• Semi-deluxe: ₹400-600\n• Regular: ₹200-350\n\n🚗 Private Taxi Services:\n• Airport pickup: ₹500-800\n• City tours: ₹2000/day\n• Outstation: ₹12/km\n\n📱 Book through:\n• JSTC App • Ola/Uber\n• Tourism counter\nNeed transport booking assistance?";
    }

    // Cancel or modify booking
    if (message.includes('cancel or modify booking') || message.includes('modify') || message.includes('change booking')) {
      return "🔄 Booking Modification Center:\n\n✏️ What can be modified:\n• Travel dates (Subject to availability)\n• Guest count (+/- persons)\n• Room category (Upgrade/downgrade)\n• Meal preferences\n• Special requests\n• Add-on services\n\n📅 Modification Policy:\n• Free changes: 48+ hours before\n• Paid changes: 24-48 hours (₹500 fee)\n• Limited changes: <24 hours\n\n🚀 Quick Modification:\n1. Provide booking ID\n2. Select changes needed\n3. Confirm new details\n4. Pay difference (if any)\n5. Get updated confirmation\n\nShare your booking ID to start modifications!\nExample: JH20251234";
    }

    if (message.includes('hotel') || message.includes('accommodation') || message.includes('room')) {
      return "🏨 Smart Accommodation Services:\n\n🌟 JTDC Premium Properties:\n• Palace Hotels: ₹4000-8000 (Heritage)\n• Hill Resorts: ₹3000-5000 (Scenic)\n• Business Hotels: ₹2500-4000 (City)\n• Budget Stays: ₹800-1500 (Comfort)\n\n🔧 Smart Room Features:\n• Contactless check-in/out\n• Mobile room keys\n• Voice-controlled amenities\n• 24/7 room service\n• Free WiFi + streaming\n\n💡 Instant Services:\n• Room upgrade requests\n• Housekeeping on-demand\n• Concierge chat support\n• Local experience booking\n\nNeed accommodation assistance? Share your preferences!";
    }
    
    // Booking ID detection
    // Emergency assistance
    if (message.includes('emergency assistance') || message.includes('emergency') || message.includes('urgent')) {
      return "🚨 Emergency Tourism Support:\n\n📞 Immediate Help Numbers:\n• Tourist Helpline: 1363 (24x7)\n• Police Emergency: 100\n• Medical Emergency: 102\n• Fire Emergency: 101\n• Disaster Management: 108\n\n🏥 Tourist Medical Centers:\n• Ranchi: RIMS Hospital\n• Jamshedpur: TMH Hospital\n• Dhanbad: PMCH Hospital\n\n🆘 Common Emergency Scenarios:\n• Lost documents → Tourist police\n• Medical issues → Nearest hospital\n• Vehicle breakdown → Roadside assistance\n• Safety concerns → Tourist helpline\n\n📍 Share your location for nearest help!\nWhat's your emergency situation?";
    }

    // Download voucher
    if (message.includes('download booking voucher') || message.includes('voucher') || message.includes('download')) {
      return "📄 Booking Voucher Download Center:\n\n💾 Available Download Options:\n• PDF Voucher (Print-ready)\n• Mobile Pass (QR code)\n• Email Forward\n• WhatsApp Share\n\n📱 Quick Download Methods:\n• SMS: Send 'VOUCHER [BookingID]' to 56070\n• Email: Auto-sent to registered email\n• App: Download from 'My Bookings'\n• Website: Login → Downloads\n\n🔍 Need voucher for specific booking?\nProvide your Booking ID (JH2025XXXX) and I'll generate download links instantly!\n\n💡 Vouchers include: QR code, booking details, contact info, emergency numbers";
    }

    // Booking ID detection
    if (message.match(/jh202[0-9]{5}/)) {
      const bookingId = message.match(/jh202[0-9]{5}/)[0].toUpperCase();
      return `📋 Booking Details for ${bookingId}:\n\n✅ Status: CONFIRMED\n👤 Guest: Demo User\n📅 Date: 15-20 Dec 2024\n🏨 Hotel: JTDC Ranchi\n💰 Amount: ₹8,500 (Paid)\n\n📧 Confirmation sent to email\n📱 SMS alerts activated\n\n🔄 Quick Actions:\n• Modify booking\n• Add services\n• Download voucher\n• Contact property\n\nNeed any changes to this booking?`;
    }
    
    // Thank you and goodbye detection
    if (message.includes('thank') || message.includes('thanks') || message.includes('bye') || message.includes('goodbye')) {
      return "🙏 Thank you for choosing Jharkhand Tourism!\n\n✨ It was my pleasure assisting you today.\n\n📱 Remember, I'm available 24/7 for:\n• Booking support\n• Travel assistance\n• Emergency help\n• Tour information\n\n🌟 Have a wonderful journey!\nVisit again for more amazing experiences in Jharkhand! 🏞️";
    }
    
    // Default intelligent response
    return "🤖 Smart Tourism Assistant Ready!\n\nI'm equipped to help you with:\n\n🎫 Instant Booking Management\n💳 Real-time Payment Processing\n📞 Live Customer Support\n🏨 Hotel & Package Bookings\n🚌 Transport Arrangements\n�️ Tourism Information\n📱 Mobile Services\n\n💡 Pro Tips:\n• Type your booking ID (JH2025XXXX) for instant tracking\n• Use voice commands (coming soon!)\n• Ask anything about Jharkhand tourism\n\n🔥 Popular right now:\n'Track my booking' | 'Cancel booking' | 'Best packages'\n\nWhat would you like to explore today? 😊";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue.trim();
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (sessionId && connectionStatus === 'connected') {
        // Send to API
        const response = await chatAPI.sendMessage(sessionId, messageText);
        
        if (response) {
          // Update user message status
          setMessages(prev => prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'sent', apiId: response.user_message.id }
              : msg
          ));

          // Add bot response
          if (response.bot_response) {
            const botMessage = {
              id: Date.now() + 1,
              text: response.bot_response.text,
              isBot: true,
              timestamp: new Date(response.bot_response.created_at),
              apiId: response.bot_response.id,
              quickReplies: response.bot_response.quick_replies || [],
              intent: response.bot_response.intent
            };
            
            setMessages(prev => [...prev, botMessage]);
          }
        } else {
          throw new Error('Failed to send message');
        }
      } else {
        // Fallback to local AI response
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            text: getAIResponse(messageText),
            isBot: true,
            timestamp: new Date(),
            fallback: true
          };

          setMessages(prev => prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'sent' }
              : msg
          ).concat([botResponse]));
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'failed' }
          : msg
      ));

      // Add error message
      const errorMessage = {
        id: Date.now() + 2,
        text: "❌ Sorry, I couldn't process your message. Please try again or contact our support team directly at 1800-123-TOUR.",
        isBot: true,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const serviceOptions = [
    "Track my booking status",
    "Payment & refund help", 
    "Customer support chat",
    "Tour package information",
    "Cancel or modify booking",
    "Emergency assistance",
    "Download booking voucher"
  ];

  const handleQuickQuestion = async (question) => {
    setInputValue(question);
    await handleSendMessage();
  };

  // Function to create support ticket
  const createSupportTicket = async (category, subject, description) => {
    if (!sessionId) return;

    try {
      const ticketData = {
        category,
        subject,
        description,
        priority: 'medium',
        customer_info: userInfo || {}
      };

      const ticket = await chatAPI.createSupportTicket(sessionId, ticketData);
      
      if (ticket) {
        const ticketMessage = {
          id: Date.now(),
          text: `🎫 **Support Ticket Created Successfully!**\n\n**Ticket ID**: ${ticket.ticket_id}\n**Status**: ${ticket.status}\n**Priority**: ${ticket.priority}\n\nOur support team will contact you within 4 hours. You can also call us at 1800-123-TOUR for immediate assistance.\n\n📧 A confirmation email has been sent to your registered email address.`,
          isBot: true,
          timestamp: new Date(),
          ticketInfo: ticket
        };
        
        setMessages(prev => [...prev, ticketMessage]);
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
    }
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <button 
        className={`ai-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Tourism Service Assistant"
      >
        <span className="ai-icon">🏛️</span>
        <span className="ai-text">Services</span>
        {!isOpen && <span className="pulse-dot"></span>}
      </button>

      {/* AI Chat Widget */}
      {isOpen && (
        <div className="ai-chat-widget">
          <div className="chat-header">
            <div className="header-info">
              <span className="ai-avatar">🏛️</span>
              <div>
                <h4>Tourism Service Center</h4>
                <span className={`status ${connectionStatus}`}>
                  {connectionStatus === 'connected' && '🟢 Connected • Data Saved'}
                  {connectionStatus === 'connecting' && '🟡 Connecting...'}
                  {connectionStatus === 'disconnected' && '⚪ Offline Mode'}
                  {connectionStatus === 'error' && '🔴 Connection Error'}
                </span>
              </div>
            </div>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id}>
                <div 
                  className={`message ${message.isBot ? 'bot-message' : 'user-message'} ${message.isError ? 'error-message' : ''} ${message.fallback ? 'fallback-message' : ''}`}
                >
                  {message.isBot && <span className="message-avatar">🤖</span>}
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-meta">
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      {!message.isBot && message.status && (
                        <span className={`message-status ${message.status}`}>
                          {message.status === 'sending' && '⏳'}
                          {message.status === 'sent' && '✓'}
                          {message.status === 'failed' && '❌'}
                        </span>
                      )}
                      {message.fallback && (
                        <span className="fallback-indicator" title="Offline response">📱</span>
                      )}
                      {message.intent && (
                        <span className="intent-tag">{message.intent}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Quick Replies */}
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="quick-replies">
                    {message.quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        className="quick-reply-btn"
                        onClick={() => handleQuickQuestion(reply)}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Support Ticket Actions */}
                {message.ticketInfo && (
                  <div className="ticket-actions">
                    <button 
                      className="ticket-action-btn"
                      onClick={() => window.open('tel:1800123TOUR')}
                    >
                      📞 Call Support
                    </button>
                    <button 
                      className="ticket-action-btn"
                      onClick={() => navigator.clipboard.writeText(message.ticketInfo.ticket_id)}
                    >
                      📋 Copy Ticket ID
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <span className="message-avatar">🏛️</span>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Service Options */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p>Popular services:</p>
              <div className="question-buttons">
                {serviceOptions.map((service, index) => (
                  <button 
                    key={index}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(service)}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Need help with booking, payment, or support?"
              className="message-input"
            />
            <button 
              onClick={handleSendMessage}
              className="send-btn"
              disabled={!inputValue.trim()}
            >
              <span>➤</span>
            </button>
          </div>

          <div className="chat-footer">
            <small>🏛️ Service Center • Government of Jharkhand Tourism</small>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;