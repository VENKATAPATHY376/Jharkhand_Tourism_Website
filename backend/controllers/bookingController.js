const { pool } = require('../config/database');

// Create new booking
const createBooking = async (req, res) => {
  try {
    const {
      userId,
      packageId,
      travelers,
      travelDates,
      totalAmount,
      specialRequests,
      paymentMethod
    } = req.body;

    // Generate booking ID
    const bookingId = `JH${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const [result] = await pool.execute(`
      INSERT INTO bookings (
        booking_id, user_id, package_id, travelers, travel_dates,
        total_amount, payment_status, booking_status, special_requests,
        payment_method, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending', ?, ?, NOW(), NOW())
    `, [
      bookingId, userId, packageId, travelers, JSON.stringify(travelDates),
      totalAmount, specialRequests, paymentMethod
    ]);

    console.log(`✅ New booking created: ${bookingId}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: result.insertId,
        bookingId,
        userId,
        packageId,
        travelers,
        totalAmount,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('❌ Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const [bookings] = await pool.execute(`
      SELECT 
        b.*, p.title as package_title, p.location, p.duration
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

    const formattedBookings = bookings.map(booking => ({
      ...booking,
      travel_dates: booking.travel_dates ? JSON.parse(booking.travel_dates) : {}
    }));

    res.json({
      success: true,
      data: formattedBookings
    });

  } catch (error) {
    console.error('❌ Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const [bookings] = await pool.execute(`
      SELECT 
        b.*, p.title as package_title, p.location, p.duration, p.images,
        u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE b.booking_id = ?
    `, [bookingId]);

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookings[0];
    const formattedBooking = {
      ...booking,
      travel_dates: booking.travel_dates ? JSON.parse(booking.travel_dates) : {},
      package_images: booking.images ? JSON.parse(booking.images) : []
    };

    res.json({
      success: true,
      data: formattedBooking
    });

  } catch (error) {
    console.error('❌ Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById
};