const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected to chatbot database: mydb');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

const initializeChatbotTables = async () => {
  try {
    console.log('🏗️ Creating chatbot service tables...');

    // 1. Chat Sessions Table (CORRECTED)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        session_type ENUM('general', 'booking', 'support', 'complaint') DEFAULT 'general',
        status ENUM('active', 'closed', 'pending', 'escalated') DEFAULT 'active',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        booking_reference VARCHAR(255) DEFAULT NULL,
        user_info JSON DEFAULT NULL,
        session_metadata JSON DEFAULT NULL,
        resolved_at TIMESTAMP NULL,
        assigned_agent VARCHAR(255) DEFAULT NULL,
        satisfaction_rating INT DEFAULT NULL,
        feedback TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_session_id (session_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 2. Chat Messages Table (FIXED - Added user_id column)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        sender_type ENUM('user', 'bot', 'agent') NOT NULL,
        message_type ENUM('text', 'image', 'file', 'quick_reply', 'carousel') DEFAULT 'text',
        content TEXT NOT NULL,
        metadata JSON DEFAULT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_session_id (session_id),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 3. Packages Table (Tourism Packages)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type ENUM('adventure', 'nature', 'wildlife', 'cultural', 'religious') NOT NULL,
        duration INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        discounted_price DECIMAL(10,2) DEFAULT NULL,
        featured BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3,2) DEFAULT 0.0,
        review_count INT DEFAULT 0,
        images JSON DEFAULT NULL,
        location VARCHAR(255) NOT NULL,
        includes JSON DEFAULT NULL,
        difficulty ENUM('Easy', 'Moderate', 'Hard') DEFAULT 'Easy',
        group_size JSON DEFAULT NULL,
        availability JSON DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_featured (featured),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 4. Bookings Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        package_id INT NOT NULL,
        travelers INT NOT NULL,
        travel_dates JSON NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        booking_status ENUM('confirmed', 'pending', 'cancelled', 'completed') DEFAULT 'pending',
        special_requests TEXT DEFAULT NULL,
        payment_method VARCHAR(100) DEFAULT NULL,
        transaction_id VARCHAR(255) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_booking_id (booking_id),
        INDEX idx_user_id (user_id),
        INDEX idx_package_id (package_id),
        INDEX idx_status (booking_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 5. Payment Conversations Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS payment_conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        booking_id INT DEFAULT NULL,
        payment_reference VARCHAR(255) DEFAULT NULL,
        conversation_type ENUM('payment_inquiry', 'refund_request', 'payment_issue') NOT NULL,
        amount_discussed DECIMAL(10,2) DEFAULT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        payment_method VARCHAR(100) DEFAULT NULL,
        transaction_id VARCHAR(255) DEFAULT NULL,
        status ENUM('open', 'resolved', 'escalated') DEFAULT 'open',
        resolution_details TEXT DEFAULT NULL,
        conversation_data JSON DEFAULT NULL,
        is_encrypted BOOLEAN DEFAULT FALSE,
        resolved_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_conversation_id (conversation_id),
        INDEX idx_user_id (user_id),
        INDEX idx_booking_id (booking_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 6. Support Tickets Table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        chat_session_id VARCHAR(255) DEFAULT NULL,
        category ENUM('booking', 'payment', 'technical', 'general', 'complaint') NOT NULL,
        subcategory VARCHAR(100) DEFAULT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('open', 'in_progress', 'resolved', 'closed', 'escalated') DEFAULT 'open',
        assigned_to VARCHAR(255) DEFAULT NULL,
        department ENUM('customer_service', 'technical', 'billing', 'operations') DEFAULT 'customer_service',
        booking_reference VARCHAR(255) DEFAULT NULL,
        customer_info JSON DEFAULT NULL,
        resolution TEXT DEFAULT NULL,
        resolution_time TIMESTAMP NULL,
        attachments JSON DEFAULT NULL,
        tags JSON DEFAULT NULL,
        escalation_history JSON DEFAULT NULL,
        customer_satisfaction INT DEFAULT NULL,
        feedback TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ticket_id (ticket_id),
        INDEX idx_user_id (user_id),
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_priority (priority)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ All chatbot service tables created successfully');
    console.log('📊 Tables: chat_sessions, chat_messages, packages, bookings, payment_conversations, support_tickets');

  } catch (error) {
    console.error('❌ Chatbot tables creation failed:', error.message);
    throw error;
  }
};

module.exports = { pool, testConnection, initializeChatbotTables };