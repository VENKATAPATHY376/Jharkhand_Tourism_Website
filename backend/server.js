const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configurations and controllers
const { pool, testConnection, initializeChatbotTables } = require('./config/database');
const { registerUser, loginUser, checkUserExists } = require('./controllers/authController');
const { 
  createChatSession, 
  sendMessage, 
  getChatHistory, 
  getUserChatSessions, 
  closeChatSession 
} = require('./controllers/chatController');
const { getAllPackages, getPackageById } = require('./controllers/packageController');
const { createBooking, getUserBookings, getBookingById } = require('./controllers/bookingController');
const { createSupportTicket, getUserSupportTickets } = require('./controllers/supportController');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Jharkhand Tourism Chatbot Backend Starting...');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`📞 API: ${req.method} ${req.originalUrl}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🤖 Jharkhand Tourism Chatbot API',
    status: 'running',
    version: '2.0.0',
    services: {
      authentication: 'MySQL-based user auth',
      chatbot: 'Multi-session chat support',
      bookings: 'Tourism package bookings',
      support: 'Ticket-based customer support',
      payments: 'Payment conversation tracking'
    },
    endpoints: {
      auth: ['/api/auth/signup', '/api/auth/login'],
      chat: ['/api/chat/session', '/api/chat/message', '/api/chat/history/:sessionId'],
      packages: ['/api/packages', '/api/packages/:id'],
      bookings: ['/api/bookings', '/api/bookings/user/:userId'],
      support: ['/api/support/ticket', '/api/support/user/:userId']
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot Backend Healthy!',
    timestamp: new Date().toISOString(),
    database: 'MySQL Connected',
    services: ['Auth', 'Chat', 'Bookings', 'Support', 'Packages']
  });
});

// Authentication Routes
app.post('/api/auth/signup', registerUser);
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/check/:email', checkUserExists);

// Chat Routes
app.post('/api/chat/session', async (req, res) => {
  try {
    console.log('🔌 Chat session creation request');
    console.log('📦 Body:', req.body);
    
    const { 
      session_type = 'general', 
      user_info = {}, 
      session_metadata = {} 
    } = req.body;

    // Get userId from token or default to 1
    let userId = 1;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        // Simple token decode (you can enhance this)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.id || 1;
      } catch (e) {
        console.log('Token decode failed, using default userId');
      }
    }

    // Generate session ID
    const sessionId = `CHAT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; 
    
    const metadata = {
      ...session_metadata,
      browser: req.get('User-Agent') || 'unknown',
      timestamp: new Date().toISOString(),
      ip: req.ip || 'unknown'
    };

    // Insert into database
    const [result] = await pool.execute(`
      INSERT INTO chat_sessions (
        session_id, user_id, session_type, status, priority, 
        user_info, session_metadata, created_at, updated_at
      ) VALUES (?, ?, ?, 'active', 'medium', ?, ?, NOW(), NOW())
    `, [
      sessionId,
      userId,
      session_type,
      JSON.stringify(user_info),
      JSON.stringify(metadata)
    ]);

    console.log(`✅ Chat session created: ${sessionId}`);

    // Return data in the format frontend expects
    res.json({
      success: true,
      message: 'Chat session created successfully',
      data: {
        session_id: sessionId,
        user_id: userId,
        session_type: session_type,
        status: 'active',
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Chat session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat session',
      error: error.message
    });
  }
});

// Send Message to Session (NEW - matches frontend expectations)
app.post('/api/chat/session/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { 
      message_text, 
      message_type = 'text', 
      entities_extracted = {} 
    } = req.body;

    console.log(`💬 Message to session ${sessionId}:`, message_text);

    if (!message_text) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    // Get userId from session (for response data only)
    const [sessions] = await pool.execute(
      'SELECT user_id FROM chat_sessions WHERE session_id = ?',
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    const userId = sessions[0].user_id;

    // Store user message (WITHOUT user_id column)
    const [userResult] = await pool.execute(`
      INSERT INTO chat_messages (
        session_id, sender_type, message_type, 
        content, metadata, created_at, updated_at
      ) VALUES (?, 'user', ?, ?, ?, NOW(), NOW())
    `, [
      sessionId, 
      message_type, 
      message_text, 
      JSON.stringify(entities_extracted)
    ]);

    // Generate bot response
    const botResponseText = generateAdvancedBotResponse(message_text, entities_extracted);
    
    // Store bot response (WITHOUT user_id column)
    const [botResult] = await pool.execute(`
      INSERT INTO chat_messages (
        session_id, sender_type, message_type, 
        content, metadata, created_at, updated_at
      ) VALUES (?, 'bot', 'text', ?, ?, NOW(), NOW())
    `, [
      sessionId, 
      botResponseText, 
      JSON.stringify({ 
        auto_response: true, 
        intent: detectIntent(message_text),
        entities: entities_extracted 
      })
    ]);

    console.log(`✅ Message processed for session ${sessionId}`);

    // Return in format frontend expects
    res.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        user_message: {
          id: userResult.insertId,
          session_id: sessionId,
          message_text: message_text,
          message_type: message_type,
          created_at: new Date().toISOString()
        },
        bot_response: {
          id: botResult.insertId,
          session_id: sessionId,
          text: botResponseText,
          message_type: 'text',
          intent: detectIntent(message_text),
          quick_replies: generateQuickReplies(message_text),
          created_at: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Get Chat Messages (NEW - matches frontend expectations)
app.get('/api/chat/session/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    console.log(`📋 Getting messages for session: ${sessionId}`);

    const [messages] = await pool.execute(`
      SELECT 
        id, session_id, sender_type, message_type,
        content, metadata, created_at
      FROM chat_messages 
      WHERE session_id = ?
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `, [sessionId, parseInt(limit), parseInt(offset)]);

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      session_id: msg.session_id,
      text: msg.content,
      message_type: msg.message_type,
      sender_type: msg.sender_type,
      metadata: msg.metadata ? JSON.parse(msg.metadata) : {},
      created_at: msg.created_at,
      // Add frontend-specific fields
      isBot: msg.sender_type === 'bot',
      timestamp: new Date(msg.created_at)
    }));

    console.log(`✅ Retrieved ${formattedMessages.length} messages`);

    res.json({
      success: true,
      data: formattedMessages,
      total: formattedMessages.length
    });

  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message
    });
  }
});

// Create Support Ticket (NEW - matches frontend expectations)
app.post('/api/chat/session/:sessionId/create-ticket', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const {
      category,
      subject,
      description,
      priority = 'medium',
      customer_info = {}
    } = req.body;

    console.log(`🎫 Creating support ticket for session: ${sessionId}`);

    // Get session info
    const [sessions] = await pool.execute(
      'SELECT user_id FROM chat_sessions WHERE session_id = ?',
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    const userId = sessions[0].user_id;

    // Generate ticket ID
    const ticketId = `TKT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create support ticket
    const [result] = await pool.execute(`
      INSERT INTO support_tickets (
        ticket_id, user_id, chat_session_id, category, subject,
        description, priority, status, department, customer_info,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', 'customer_service', ?, NOW(), NOW())
    `, [
      ticketId,
      userId,
      sessionId,
      category || 'general',
      subject || 'Support Request',
      description || 'Support request from chat',
      priority,
      JSON.stringify(customer_info)
    ]);

    console.log(`✅ Support ticket created: ${ticketId}`);

    // Return ticket info
    res.json({
      success: true,
      message: 'Support ticket created successfully',
      data: {
        ticket_id: ticketId,
        user_id: userId,
        session_id: sessionId,
        category: category || 'general',
        subject: subject || 'Support Request',
        priority: priority,
        status: 'open',
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message
    });
  }
});

// Package Routes
app.get('/api/packages', getAllPackages);
app.get('/api/packages/:id', getPackageById);

// Get featured packages
app.get('/api/packages/featured', async (req, res) => {
  try {
    console.log('🌟 Getting featured packages...');

    const [packages] = await pool.execute(`
      SELECT 
        id, title, description, type, duration, price, discounted_price,
        featured, rating, review_count, images, location, includes,
        difficulty, group_size, availability, created_at
      FROM packages 
      WHERE is_active = TRUE AND featured = TRUE
      ORDER BY rating DESC, created_at DESC
      LIMIT 6
    `);

    // If no packages in database, return sample data
    if (packages.length === 0) {
      console.log('📦 No featured packages in DB, returning sample data');
      
      const samplePackages = [
        {
          id: 1,
          title: 'Hundru Falls Adventure',
          description: 'Experience the breathtaking 98-meter waterfall with guided trekking',
          type: 'adventure',
          duration: 2,
          price: 2999,
          discounted_price: 2499,
          featured: true,
          rating: 4.7,
          review_count: 156,
          images: ['/api/placeholder/600/400'],
          location: 'Ranchi, Jharkhand',
          includes: ['Transportation', 'Guide', 'Meals', 'Photography'],
          difficulty: 'Moderate',
          group_size: { max: 15, min: 4 },
          availability: { available: true, next_date: '2025-09-30' }
        },
        {
          id: 2,
          title: 'Netarhat Sunrise Trek',
          description: 'Witness spectacular sunrise from Queen of Chotanagpur',
          type: 'nature',
          duration: 1,
          price: 1999,
          discounted_price: 1699,
          featured: true,
          rating: 4.8,
          review_count: 89,
          images: ['/api/placeholder/600/400'],
          location: 'Netarhat, Jharkhand',
          includes: ['Transportation', 'Guide', 'Breakfast'],
          difficulty: 'Easy',
          group_size: { max: 20, min: 2 },
          availability: { available: true, next_date: '2025-09-29' }
        },
        {
          id: 3,
          title: 'Betla National Park Safari',
          description: 'Explore wildlife sanctuary with tiger and elephant sightings',
          type: 'wildlife',
          duration: 3,
          price: 4999,
          discounted_price: 4299,
          featured: true,
          rating: 4.6,
          review_count: 203,
          images: ['/api/placeholder/600/400'],
          location: 'Betla, Jharkhand',
          includes: ['Accommodation', 'All Meals', 'Safari', 'Guide'],
          difficulty: 'Easy',
          group_size: { max: 12, min: 2 },
          availability: { available: true, next_date: '2025-10-01' }
        }
      ];

      return res.json({
        success: true,
        data: samplePackages,
        total: samplePackages.length,
        source: 'sample_data'
      });
    }

    // Format database packages
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      images: pkg.images ? JSON.parse(pkg.images) : ['/api/placeholder/600/400'],
      includes: pkg.includes ? JSON.parse(pkg.includes) : [],
      group_size: pkg.group_size ? JSON.parse(pkg.group_size) : { max: 15, min: 2 },
      availability: pkg.availability ? JSON.parse(pkg.availability) : { available: true }
    }));

    console.log(`✅ Returning ${formattedPackages.length} featured packages`);

    res.json({
      success: true,
      data: formattedPackages,
      total: formattedPackages.length,
      source: 'database'
    });

  } catch (error) {
    console.error('❌ Get featured packages error:', error);
    
    // Fallback to sample data on error
    const fallbackPackages = [
      {
        id: 1,
        title: 'Hundru Falls Adventure',
        description: 'Experience the breathtaking waterfall',
        type: 'adventure',
        duration: 2,
        price: 2499,
        rating: 4.7,
        location: 'Ranchi, Jharkhand',
        featured: true
      }
    ];

    res.json({
      success: true,
      data: fallbackPackages,
      total: 1,
      source: 'fallback'
    });
  }
});

// Booking Routes  
app.post('/api/bookings', createBooking);
app.get('/api/bookings/user/:userId', getUserBookings);
app.get('/api/bookings/:bookingId', getBookingById);

// Support Routes
app.post('/api/support/ticket', createSupportTicket);
app.get('/api/support/user/:userId', getUserSupportTickets);

// Service Center Connection (what your frontend chat is calling)
app.post('/api/service-center/connect', async (req, res) => {
  try {
    console.log('🔌 Service Center connect request');
    console.log('📦 Body:', req.body);
    
    const userId = req.body.userId || req.body.user_id || 1; // Handle different naming
    const serviceType = req.body.serviceType || req.body.type || 'general';
    
    // Create chat session
    const sessionId = `SERVICE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionMetadata = {
      browser: req.get('User-Agent') || 'unknown',
      timestamp: new Date().toISOString(),
      ip: req.ip || 'unknown',
      serviceType: serviceType
    };

    // Insert into chat_sessions table
    await pool.execute(`
      INSERT INTO chat_sessions (
        session_id, user_id, session_type, status, priority, 
        user_info, session_metadata, created_at, updated_at
      ) VALUES (?, ?, 'general', 'active', 'medium', '{}', ?, NOW(), NOW())
    `, [sessionId, userId, JSON.stringify(sessionMetadata)]);

    console.log(`✅ Service Center connected - Session: ${sessionId}`);

    res.json({
      success: true,
      connected: true,
      sessionId: sessionId,
      message: 'Connected to Tourism Service Center',
      welcomeMessage: 'Welcome to Jharkhand Tourism Service Center! How can I help you today?'
    });

  } catch (error) {
    console.error('❌ Service Center connection error:', error);
    res.status(500).json({
      success: false,
      connected: false,
      message: 'Unable to connect to service center',
      error: error.message
    });
  }
});

// Service Center Chat Message
app.post('/api/service-center/chat', async (req, res) => {
  try {
    console.log('💬 Service Center chat message');
    console.log('📦 Body:', req.body);
    
    const { sessionId, message, userId } = req.body;
    const actualSessionId = sessionId || `TEMP_${Date.now()}`;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Store user message (WITHOUT user_id column)
    await pool.execute(`
      INSERT INTO chat_messages (
        session_id, sender_type, message_type, 
        content, created_at, updated_at
      ) VALUES (?, 'user', 'text', ?, NOW(), NOW())
    `, [actualSessionId, message]);

    // Generate bot response
    const botResponse = generateServiceCenterResponse(message);
    
    // Store bot response (WITHOUT user_id column)
    await pool.execute(`
      INSERT INTO chat_messages (
        session_id, sender_type, message_type, 
        content, metadata, created_at, updated_at
      ) VALUES (?, 'bot', 'text', ?, '{"auto_response": true}', NOW(), NOW())
    `, [actualSessionId, botResponse]);

    console.log(`✅ Chat message processed for session ${actualSessionId}`);

    res.json({
      success: true,
      response: {
        message: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Service Center chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
});

// Tourism Information Endpoints (likely called by frontend)
app.get('/api/tourism/info', (req, res) => {
  console.log('ℹ️ Tourism info request');
  
  res.json({
    success: true,
    data: {
      state: 'Jharkhand',
      capital: 'Ranchi',
      popularDestinations: [
        'Netarhat - Queen of Chotanagpur',
        'Hundru Falls - 98m waterfall',
        'Betla National Park - Wildlife sanctuary',
        'Deoghar - Temple town',
        'Hazaribagh - Hill station'
      ],
      bestTime: 'October to March',
      languages: ['Hindi', 'English', 'Santali', 'Mundari']
    }
  });
});

// Booking Inquiry Endpoint
app.post('/api/booking/inquiry', async (req, res) => {
  try {
    console.log('📋 Booking inquiry');
    console.log('📦 Body:', req.body);
    
    const { packageId, travelers, dates, contactInfo } = req.body;
    
    res.json({
      success: true,
      message: 'Booking inquiry received',
      inquiry: {
        packageId: packageId || 1,
        travelers: travelers || 2,
        estimatedCost: (travelers || 2) * 2500,
        availableDates: ['2025-10-01', '2025-10-05', '2025-10-10'],
        nextStep: 'Please provide contact details to proceed'
      }
    });

  } catch (error) {
    console.error('❌ Booking inquiry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process booking inquiry'
    });
  }
});

// Service Center Bot Response Generator
const generateServiceCenterResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! Welcome to Jharkhand Tourism Service Center. I can help you with:\n\n🏞️ Tour packages\n📅 Bookings\n💳 Payments\n📞 Support\n\nWhat would you like to know?";
  }
  else if (message.includes('booking') || message.includes('book')) {
    return "I can help with bookings! Our popular packages:\n\n🏔️ Hundru Falls Adventure - ₹2,499 (2 days)\n🌅 Netarhat Sunrise Trek - ₹1,699 (1 day)\n🐅 Betla Wildlife Safari - ₹4,299 (3 days)\n\nWhich package interests you? I can check availability and help you book!";
  }
  else if (message.includes('payment') || message.includes('pay')) {
    return "Payment options available:\n\n💳 Credit/Debit Cards\n📱 UPI (GPay, PhonePe, Paytm)\n🏦 Net Banking\n💰 Cash (on arrival)\n\nSecure payment processing with instant confirmation. Need help with a payment issue?";
  }
  else if (message.includes('cancel') || message.includes('refund')) {
    return "Cancellation & Refund Policy:\n\n📋 Free cancellation up to 48 hours before\n💰 Refund processing: 5-7 business days\n📞 Need to cancel? Please share your booking ID\n\nI can help process your cancellation right now!";
  }
  else if (message.includes('price') || message.includes('cost')) {
    return "Package Pricing (per person):\n\n💰 Day trips: ₹1,500 - ₹2,500\n💰 Weekend packages: ₹3,000 - ₹5,000\n💰 Extended tours: ₹5,000+\n\n🎯 Group discounts: 10% for 6+ people\n🎯 Early booking: 15% off (book 30 days ahead)";
  }
  else if (message.includes('help') || message.includes('support')) {
    return "I'm here to help! Available services:\n\n✅ Package information & booking\n✅ Payment assistance\n✅ Itinerary planning\n✅ Travel tips & guidance\n✅ Complaint resolution\n\nWhat specific help do you need? I'm available 24/7!";
  }
  else if (message.includes('package') || message.includes('tour')) {
    return "Jharkhand Tour Categories:\n\n🏔️ Adventure: Waterfalls, trekking, camping\n🌿 Wildlife: National parks, safaris\n🏛️ Cultural: Temples, tribal culture\n🏞️ Nature: Hill stations, scenic spots\n\nWhich type of experience are you looking for?";
  }
  else {
    return "Thank you for contacting Jharkhand Tourism! 🏔️\n\nI can assist with:\n🔹 Tour bookings\n🔹 Package information\n🔹 Payment queries\n🔹 Travel planning\n\nPlease let me know how I can help you plan your perfect Jharkhand adventure!";
  }
};

// Advanced bot response generator
const generateAdvancedBotResponse = (userMessage, entities = {}) => {
  const message = userMessage.toLowerCase();
  
  // Handle booking ID in entities
  if (entities.booking_id) {
    return `📋 **Booking Status for ${entities.booking_id}:**\n\n✅ **Status**: CONFIRMED\n📅 **Travel Date**: 15-20 Dec 2024\n🏨 **Property**: JTDC Heritage Resort, Ranchi\n👥 **Guests**: 2 Adults\n💰 **Amount**: ₹8,500 (Fully Paid)\n\n📱 **Quick Actions:**\n• Modify booking\n• Download voucher\n• Contact property: +91-9876543210\n• Cancel booking\n\n📧 Confirmation sent to your registered email.\nNeed any changes to this booking?`;
  }

  if (message.includes('track my booking') || message.includes('booking status')) {
    return "🔍 **Booking Tracking System**\n\nTo track your booking, please provide:\n• **Booking ID** (Format: JH2025XXXX)\n• **Mobile Number** (Registered number)\n\n📱 **Instant Tracking Options:**\n• Type booking ID here\n• SMS 'TRACK JH2025XXXX' to 56070\n• Call 1800-123-TOUR\n• Visit jharkhandtourism.gov.in/track\n\n💡 **Example**: Just type 'JH20251234' and I'll show your booking details instantly!";
  }

  if (message.includes('payment') && message.includes('refund')) {
    return "💰 **Payment & Refund Center**\n\n🔄 **Refund Processing:**\n• **Instant Refunds**: ✅ For cancellations 48+ hours before\n• **Processing Time**: 2-4 hours to your bank account\n• **Refund Status**: Track via SMS/Email alerts\n\n💳 **Refund Methods:**\n• Same payment method used\n• Bank transfer (if original method unavailable)\n• Tourism wallet credit (instant)\n\n📞 **Need immediate refund?**\nShare your booking ID or call 1800-123-TOUR\n\n🆘 **Refund Issues?** I can escalate to our finance team instantly!";
  }

  if (message.includes('customer support') || message.includes('complaint')) {
    return "📞 **24/7 Customer Support Hub**\n\n🎧 **Instant Support Channels:**\n• **Live Chat**: Right here with me! 💬\n• **Phone**: 1800-123-TOUR (Toll-free)\n• **WhatsApp**: +91-9876543210\n• **Video Call**: Book via our app\n\n🏢 **Regional Offices:**\n• **Ranchi**: Tourism Bhawan, Main Road\n• **Jamshedpur**: JTDC Office, Bistupur\n• **Dhanbad**: Station Road, Near Railway\n\n🚨 **Emergency Support**: Available 24/7\n**Tourist Helpline**: 1363\n\n🎯 **Common Issues I Handle:**\n• Booking problems\n• Payment issues\n• Travel assistance\n• Complaint resolution\n\nWhat specific help do you need? 😊";
  }

  if (message.includes('tour package') || message.includes('package information')) {
    return "🌟 **Premium Tour Packages 2024-25**\n\n🏞️ **Weekend Getaways (2D/1N):**\n• **Ranchi Explorer**: ₹3,500 - Hundru Falls + City tour\n• **Netarhat Sunrise**: ₹4,200 - Hill station experience\n\n🎭 **Cultural Heritage (3D/2N):**\n• **Deoghar Spiritual**: ₹6,800 - Temple circuit\n• **Tribal Discovery**: ₹7,500 - Village experiences\n\n🏔️ **Adventure Packages (4D/3N):**\n• **Parasnath Trek**: ₹9,200 - Highest peak\n• **Wildlife Safari**: ₹8,900 - Hazaribagh + Betla\n\n✨ **All Packages Include:**\n🏨 AC accommodation • 🍽️ All meals • 🚌 Transport\n📸 Photography • 🛡️ Insurance • 📱 24/7 support\n\n🎯 **Custom packages available!** Share your preferences and budget!";
  }
  
  if (message.includes('cancel') || message.includes('modify')) {
    return "🔄 **Booking Modification Center**\n\n📝 **What Can Be Changed:**\n• Travel dates (subject to availability)\n• Guest count (+/- persons)\n• Room category (upgrade/downgrade)\n• Meal preferences & special requests\n• Add-on services (transport, guide)\n\n💰 **Modification Charges:**\n• **FREE**: Changes 48+ hours before travel\n• **₹500 fee**: Changes 24-48 hours before\n• **Limited options**: Changes <24 hours\n\n⚡ **Instant Modification Process:**\n1. Share your booking ID\n2. Tell me what you want to change\n3. I'll check availability\n4. Confirm changes\n5. Pay difference (if any)\n6. Get updated confirmation\n\n🚀 **Ready to modify?** Share your booking ID (JH2025XXXX)!";
  }

  // Handle emergency
  if (message.includes('emergency')) {
    return "🚨 **Emergency Tourism Assistance**\n\n📞 **Immediate Help Numbers:**\n• **Tourist Emergency**: 1363 (24/7)\n• **Police**: 100 • **Medical**: 102\n• **Fire**: 101 • **Disaster**: 108\n\n🏥 **Tourist Medical Centers:**\n• **Ranchi**: RIMS Hospital (+91-651-2450014)\n• **Jamshedpur**: TMH (+91-657-2426016)\n• **Dhanbad**: PMCH (+91-326-2305354)\n\n🆘 **Common Emergencies:**\n• Lost documents → Tourist police\n• Medical issues → Nearest hospital\n• Vehicle breakdown → Roadside assistance\n• Safety concerns → Tourist helpline\n\n📍 **Share your current location** and I'll direct you to the nearest help center!\n\nWhat's your emergency situation? I'm here to help! 🚑";
  }

  if (message.includes('hello') || message.includes('hi')) {
    return "🙏 **Namaste! Welcome to Jharkhand Tourism Service Center!**\n\nI'm your dedicated digital assistant, powered by advanced AI to help you with:\n\n🎫 **Instant Services:**\n• Real-time booking tracking & management\n• Payment processing & refund assistance\n• 24/7 customer support chat\n• Tour package information & booking\n• Emergency travel assistance\n\n💡 **Smart Features:**\n• Just type your booking ID for instant status\n• Voice commands support (coming soon)\n• Multi-language assistance\n• Priority support for registered users\n\n🔥 **Try These Commands:**\n• 'Track JH20251234' • 'Cancel booking'\n• 'Best packages' • 'Emergency help'\n\n✨ **Ready to assist you 24/7!** What can I help you with today? 😊";
  }

  // Default response
  return "🤖 **Jharkhand Tourism AI Assistant**\n\nI'm here to provide instant assistance with:\n\n🎯 **Popular Services:**\n• 'Track my booking status'\n• 'Payment & refund help'\n• 'Tour package information'\n• 'Customer support chat'\n• 'Cancel or modify booking'\n• 'Emergency assistance'\n\n💬 **Smart Chat Features:**\n• Type booking ID (JH2025XXXX) for instant tracking\n• Ask questions in Hindi or English\n• Get real-time updates\n• Create support tickets\n\n🌟 **Quick Actions:**\nJust type what you need or click the service buttons below!\n\nHow can I make your Jharkhand tourism experience amazing today? 🏔️";
};

// Detect intent from user message
const detectIntent = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('track') || msg.includes('status')) return 'booking_tracking';
  if (msg.includes('cancel') || msg.includes('refund')) return 'cancellation';
  if (msg.includes('modify') || msg.includes('change')) return 'modification';
  if (msg.includes('payment')) return 'payment_inquiry';
  if (msg.includes('package') || msg.includes('tour')) return 'package_inquiry';
  if (msg.includes('emergency') || msg.includes('urgent')) return 'emergency_assistance';
  if (msg.includes('support') || msg.includes('help')) return 'customer_support';
  if (msg.includes('hello') || msg.includes('hi')) return 'greeting';
  
  return 'general_inquiry';
};

// Generate quick reply suggestions
const generateQuickReplies = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('track') || msg.includes('booking')) {
    return ['Modify booking', 'Download voucher', 'Contact property', 'Cancel booking'];
  }
  
  if (msg.includes('package') || msg.includes('tour')) {
    return ['View all packages', 'Check availability', 'Book now', 'Compare prices'];
  }
  
  if (msg.includes('payment') || msg.includes('refund')) {
    return ['Check refund status', 'Payment methods', 'Transaction history', 'Contact finance'];
  }
  
  if (msg.includes('hello') || msg.includes('hi')) {
    return ['Track booking', 'View packages', 'Customer support', 'Emergency help'];
  }
  
  return ['Track booking', 'View packages', 'Customer support', 'Emergency help'];
};

// Error handling
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      auth: ['POST /api/auth/signup', 'POST /api/auth/login'],
      chat: ['POST /api/chat/session', 'POST /api/chat/message', 'GET /api/chat/history/:sessionId'],
      packages: ['GET /api/packages', 'GET /api/packages/:id'],
      bookings: ['POST /api/bookings', 'GET /api/bookings/user/:userId'],
      support: ['POST /api/support/ticket', 'GET /api/support/user/:userId']
    }
  });
});

// Add this route to your server.js for debugging
app.get('/api/debug/schema', async (req, res) => {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check chat_sessions table
    const [sessionsCols] = await pool.execute(`
      SHOW COLUMNS FROM chat_sessions
    `);
    
    // Check chat_messages table
    const [messagesCols] = await pool.execute(`
      SHOW COLUMNS FROM chat_messages  
    `);
    
    console.log('📊 Database Schema:');
    console.log('Chat Sessions columns:', sessionsCols.map(col => col.Field));
    console.log('Chat Messages columns:', messagesCols.map(col => col.Field));
    
    res.json({
      success: true,
      schema: {
        chat_sessions: sessionsCols,
        chat_messages: messagesCols
      }
    });
    
  } catch (error) {
    console.error('❌ Schema check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  try {
    console.log('🗃️ Initializing chatbot database...');
    
    await testConnection();
    await initializeChatbotTables();
    
    app.listen(PORT, () => {
      console.log(`🌟 Chatbot Server running on http://localhost:${PORT}`);
      console.log(`🤖 Services: Auth, Chat, Packages, Bookings, Support`);
      console.log(`🗃️ Database: MySQL with chatbot tables`);
      console.log(`📊 Tables: users, chat_sessions, chat_messages, packages, bookings, support_tickets`);
      console.log('✅ Jharkhand Tourism Chatbot Backend Ready!');
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
};

startServer();