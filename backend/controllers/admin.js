const pool = require('../database/database');

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, stock, sku } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!category_id) {
      return res.status(400).json({ message: "Category is required" });
    }

    const imageUrl = req.file.path;
    const imagePublicId = req.file.filename;

    const result = await pool.query(
      `
      INSERT INTO products
      (name, description, price, category_id, stock, sku, image_url, image_public_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        name,
        description || "",
        price,
        category_id,
        stock || 0,
        sku || null,
        imageUrl,
        imagePublicId,
      ]
    );

    res.status(201).json({
      message: "Product added successfully!",
      product: result.rows[0],
    });

  } catch (error) {
    res.status(400).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

exports.getEdit= async (req, res) => {
  try {
    const { id } = req.params;

    // Query database for product with specific ID
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    // Check if product exists
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching product', 
      error: error.message 
    });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category_id,
      stock,
      sku
    } = req.body;

    // 1️⃣ Check if product exists
    const existing = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Keep old image if no new one uploaded
    let imageUrl = existing.rows[0].image_url;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 3️⃣ Update product
    const result = await pool.query(
      `
      UPDATE products
      SET 
        name = $1,
        description = $2,
        price = $3,
        category_id = $4,
        stock = $5,
        sku = $6,
        image_url = $7
      WHERE id = $8
      RETURNING *
      `,
      [name, description, price, category_id, stock, sku, imageUrl, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({
      message: "Error updating product",
      error: err.message
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    await pool.query(
      'DELETE FROM products WHERE id = $1',
      [product_id]
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM orders) AS total_orders,

        (SELECT COALESCE(SUM(total_price), 0)
         FROM orders
         WHERE status = 'confirmed') AS total_revenue,


        (SELECT COUNT(*)
         FROM users
         WHERE created_at >= NOW() - INTERVAL '30 days') AS new_customers
    `;

    const { rows } = await pool.query(statsQuery);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getProductStats = async (req, res) => {
  try {
    const statsQuery = `
  SELECT
    COUNT(*) AS total_products,

    COUNT(*) FILTER (WHERE stock > 10) AS in_stock,

    COUNT(*) FILTER (WHERE stock > 0 AND stock <= 10) AS low_stock,

    COUNT(*) FILTER (WHERE stock = 0) AS out_of_stock

  FROM products
`;

    const { rows } = await pool.query(statsQuery);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getOrderStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) AS total_orders,

        COUNT(*) FILTER (WHERE status = 'pending') AS pending_orders,

        COUNT(*) FILTER (WHERE status = 'processing') AS processing_orders,

        COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_orders

      FROM orders
    `;

    const { rows } = await pool.query(statsQuery);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT
  COUNT(*) AS total_customers,

  COUNT(*) FILTER (
    WHERE created_at >= NOW() - INTERVAL '30 days'
  ) AS new_customers

FROM users
    `;

    const { rows } = await pool.query(statsQuery);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};