const pool = require('../database/database');

exports.getCategories = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM categories ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
   try {
    const { name } = req.body;
if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
const imageUrl = req.file.path;
const imagePublicId = req.file.filename;
    const { rows } = await pool.query(
      `INSERT INTO categories (name, image_url)
       VALUES ($1, $2)
       RETURNING *`,
      [name, imageUrl]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Category already exists" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image_url } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           image_url = COALESCE($2, image_url)
       WHERE id = $3
       RETURNING *`,
      [name, image_url, id]
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};