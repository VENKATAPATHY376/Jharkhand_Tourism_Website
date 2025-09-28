const { pool } = require('../config/database');

// Create new chat session - FIXED VERSION
const createChatSession = async (req, res) => {
  try {
    console.log('📦 Request body:', req.body);
    
    const { 
      userId, 
      sessionType = 'general', 
      userInfo = {}, 
      bookingReference,
      priority = 'medium' 
    } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Generate unique session ID
    const sessionId = `CHAT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionMetadata = {
      browser: req.get('User-Agent') || 'unknown',
      timestamp: new Date().toISOString(),
      ip: req.ip || 'unknown'
    };

    console.log('💾 Creating session with:', {
      sessionId,
      userId,
      sessionType,
      priority,
      bookingReference: bookingReference || null
    });

    // Insert with proper null handling
    const [result] = await pool.execute(`
      INSERT INTO chat_sessions (
        session_id, user_id, session_type, status, priority, 
        booking_reference, user_info, session_metadata, created_at, updated_at
      ) VALUES (?, ?, ?, 'active', ?, ?, ?, ?, NOW(), NOW())
    `, [
      sessionId, 
      userId, 
      sessionType, 
      priority,
      bookingReference || null,  // Convert undefined to null
      JSON.stringify(userInfo), 
      JSON.stringify(sessionMetadata)
    ]);

    console.log(`✅ Chat session created: ${sessionId} for user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Chat session created successfully',
      session: {
        id: result.insertId,
        sessionId,
        userId,
        sessionType,
        status: 'active',
        priority
      }
    });

  } catch (error) {
    console.error('❌ Create chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat session',
      error: error.message
    });
  }
};

// Send message - FIXED VERSION
const sendMessage = async (req, res) => {
  try {
    console.log('📦 Message request:', req.body);
    
    const { 
      sessionId, 
      userId, 
      senderType = 'user', 
      messageType = 'text', 
      content, 
      metadata = {} 
    } = req.body;

    // Validation
    if (!sessionId || !userId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, User ID, and content are required'
      });
    }

    console.log('💬 Storing message:', { sessionId, userId, senderType, content });

    const [result] = await pool.execute(`
      INSERT INTO chat_messages (
        session_id, user_id, sender_type, message_type, 
        content, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [sessionId, userId, senderType, messageType, content, JSON.stringify(metadata)]);

    console.log(`💬 Message sent in session ${sessionId} by ${senderType}`);

    // Auto-respond with bot if user message
    let botResponse = null;
    if (senderType === 'user') {
      const botReply = await generateBotResponse(content, sessionId);
      
      const [botResult] = await pool.execute(`
        INSERT INTO chat_messages (
          session_id, user_id, sender_type, message_type, 
          content, metadata, created_at, updated_at
        ) VALUES (?, ?, 'bot', 'text', ?, ?, NOW(), NOW())
      `, [sessionId, userId, botReply, JSON.stringify({ auto_response: true })]);

      botResponse = {
        id: botResult.insertId,
        content: botReply,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
    }

    res.json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.insertId,
      botResponse
    });

  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get chat history - FIXED VERSION
const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    console.log(`📋 Getting chat history for session: ${sessionId}`);

    const [messages] = await pool.execute(`
      SELECT 
        id, session_id, user_id, sender_type, message_type,
        content, metadata, is_read, created_at
      FROM chat_messages 
      WHERE session_id = ?
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `, [sessionId, parseInt(limit), parseInt(offset)]);

    console.log(`📋 Found ${messages.length} messages for session ${sessionId}`);

    res.json({
      success: true,
      messages: messages.map(msg => ({
        ...msg,
        metadata: msg.metadata ? JSON.parse(msg.metadata) : {}
      })),
      total: messages.length
    });

  } catch (error) {
    console.error('❌ Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history',
      error: error.message
    });
  }
};

// Get user's chat sessions - FIXED VERSION
const getUserChatSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`📋 Getting chat sessions for user: ${userId}`);

    const [sessions] = await pool.execute(`
      SELECT 
        id, session_id, session_type, status, priority,
        booking_reference, satisfaction_rating, created_at, updated_at
      FROM chat_sessions 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    console.log(`📋 Found ${sessions.length} sessions for user ${userId}`);

    res.json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error('❌ Get user sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user sessions',
      error: error.message
    });
  }
};

// Close chat session - FIXED VERSION
const closeChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { satisfaction, feedback } = req.body;

    console.log(`🔒 Closing chat session: ${sessionId}`);

    await pool.execute(`
      UPDATE chat_sessions 
      SET status = 'closed', resolved_at = NOW(), 
          satisfaction_rating = ?, feedback = ?, updated_at = NOW()
      WHERE session_id = ?
    `, [satisfaction || null, feedback || null, sessionId]);

    console.log(`✅ Chat session closed: ${sessionId}`);

    res.json({
      success: true,
      message: 'Chat session closed successfully'
    });

  } catch (error) {
    console.error('❌ Close session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close session',
      error: error.message
    });
  }
};

// Simple bot response generator
const generateBotResponse = async (userMessage, sessionId) => {
  const message = userMessage.toLowerCase();

  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! Welcome to Jharkhand Tourism. I'm here to help you with bookings, packages, and travel information. How can I assist you today? 🏔️";
  } else if (message.includes('booking') || message.includes('book')) {
    return "I can help you with bookings! Here are our popular packages:\n\n🏔️ Hundru Falls Adventure - ₹2,499\n🌅 Netarhat Sunrise Trek - ₹1,699\n🐅 Betla National Park Safari - ₹4,299\n\nWhich package interests you?";
  } else if (message.includes('package') || message.includes('tour')) {
    return "Our Jharkhand tourism packages include:\n\n🏔️ Adventure Tours (Waterfalls, Trekking)\n🌿 Nature Tours (Wildlife, Forests)\n🏛️ Cultural Tours (Temples, Heritage)\n\nWould you like details about any specific type?";
  } else if (message.includes('price') || message.includes('cost')) {
    return "Our packages range from ₹1,699 to ₹4,299:\n\n💰 Budget: ₹1,500-₹2,500\n💰 Premium: ₹3,000-₹5,000\n💰 Luxury: ₹5,000+\n\nGroup discounts available! What's your budget?";
  } else if (message.includes('help') || message.includes('support')) {
    return "I'm here to help! I can assist with:\n\n✅ Tour package information\n✅ Booking assistance\n✅ Payment queries\n✅ Travel planning\n✅ General support\n\nWhat do you need help with?";
  } else {
    return "Thank you for your message! I'm here to help with Jharkhand tourism. You can ask me about:\n\n🔸 Tour packages\n🔸 Bookings\n🔸 Prices\n🔸 Travel information\n\nHow can I assist you? 😊";
  }
};

module.exports = {
  createChatSession,
  sendMessage,
  getChatHistory,
  getUserChatSessions,
  closeChatSession
};