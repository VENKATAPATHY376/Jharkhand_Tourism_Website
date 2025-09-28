const { pool } = require('../config/database');

// Create support ticket
const createSupportTicket = async (req, res) => {
  try {
    const {
      userId,
      chatSessionId,
      category,
      subcategory,
      subject,
      description,
      priority = 'medium',
      bookingReference,
      customerInfo = {}
    } = req.body;

    // Generate ticket ID
    const ticketId = `TKT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const [result] = await pool.execute(`
      INSERT INTO support_tickets (
        ticket_id, user_id, chat_session_id, category, subcategory,
        subject, description, priority, status, department,
        booking_reference, customer_info, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', 'customer_service', ?, ?, NOW(), NOW())
    `, [
      ticketId, userId, chatSessionId, category, subcategory,
      subject, description, priority, bookingReference,
      JSON.stringify(customerInfo)
    ]);

    console.log(`🎫 Support ticket created: ${ticketId}`);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket: {
        id: result.insertId,
        ticketId,
        userId,
        category,
        subject,
        priority,
        status: 'open'
      }
    });

  } catch (error) {
    console.error('❌ Create support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket'
    });
  }
};

// Get user support tickets
const getUserSupportTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const [tickets] = await pool.execute(`
      SELECT 
        id, ticket_id, category, subcategory, subject, 
        priority, status, assigned_to, booking_reference,
        customer_satisfaction, created_at, updated_at
      FROM support_tickets 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error('❌ Get user tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get support tickets'
    });
  }
};

module.exports = {
  createSupportTicket,
  getUserSupportTickets
};