const { pool } = require('../config/database');

// Get all packages
const getAllPackages = async (req, res) => {
  try {
    const { type, featured, limit = 10, offset = 0 } = req.query;

    let query = `
      SELECT 
        id, title, description, type, duration, price, discounted_price,
        featured, rating, review_count, images, location, includes,
        difficulty, group_size, availability, created_at
      FROM packages 
      WHERE is_active = TRUE
    `;
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (featured === 'true') {
      query += ' AND featured = TRUE';
    }

    query += ' ORDER BY featured DESC, rating DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [packages] = await pool.execute(query, params);

    // Parse JSON fields
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      images: pkg.images ? JSON.parse(pkg.images) : [],
      includes: pkg.includes ? JSON.parse(pkg.includes) : [],
      group_size: pkg.group_size ? JSON.parse(pkg.group_size) : {},
      availability: pkg.availability ? JSON.parse(pkg.availability) : {}
    }));

    res.json({
      success: true,
      data: formattedPackages,
      total: formattedPackages.length
    });

  } catch (error) {
    console.error('❌ Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get packages'
    });
  }
};

// Get package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [packages] = await pool.execute(`
      SELECT * FROM packages WHERE id = ? AND is_active = TRUE
    `, [id]);

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const pkg = packages[0];
    const formattedPackage = {
      ...pkg,
      images: pkg.images ? JSON.parse(pkg.images) : [],
      includes: pkg.includes ? JSON.parse(pkg.includes) : [],
      group_size: pkg.group_size ? JSON.parse(pkg.group_size) : {},
      availability: pkg.availability ? JSON.parse(pkg.availability) : {}
    };

    res.json({
      success: true,
      data: formattedPackage
    });

  } catch (error) {
    console.error('❌ Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get package'
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById
};