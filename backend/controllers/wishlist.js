const pool = require('../database/database');


exports.getWishlist = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        w.id AS wishlist_id,
        p.id,
        p.name,
        p.price,
        p.image_url
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;

    const result = await pool.query(
      `
      INSERT INTO wishlist (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING *
      `,
      [req.user.id, product_id]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.removeFromWishlist = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2`,
      [req.user.id, req.params.product_id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
