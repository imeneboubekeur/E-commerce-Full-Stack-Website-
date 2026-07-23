const pool = require('../database/database');

exports.getProductReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.id AS user_id,
        u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
      `,
      [req.params.product_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    await pool.query(
      `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      `,
      [req.user.id, product_id, rating, comment]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.removeReview = async (req, res) => {
  try {
    await pool.query(
      `
      DELETE FROM reviews
      WHERE user_id = $1 AND id = $2
      `,
      [req.user.id, req.params.review_id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    await pool.query(
      `
      UPDATE reviews
      SET rating = $1,
          comment = $2
      WHERE user_id = $3 AND id = $4
      `,
      [rating, comment, req.user.id, req.params.review_id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
