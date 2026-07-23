const pool = require('../database/database');
const Stripe=require('stripe')
require("dotenv").config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort = "newest",
      page = 1,
      limit = 10
    } = req.query;

    let query = `
      SELECT
    p.*,

    c.id AS category_id,
    c.name AS category_name,
    c.image_url AS category_image,

    COALESCE(r.review_count, 0) AS review_count,
    COALESCE(r.avg_rating, 0) AS avg_rating

FROM products p

LEFT JOIN categories c
    ON p.category_id = c.id

LEFT JOIN (
    SELECT
        product_id,
        COUNT(*) AS review_count,
        AVG(rating)::numeric(10,2) AS avg_rating
    FROM reviews
    GROUP BY product_id
) r
    ON r.product_id = p.id

WHERE 1=1
    `;

    const params = [];

    // 🔎 Search
    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }

    // 📦 Category
    if (category && category !== "all") {
      params.push(category);
      query += ` AND p.category_id = $${params.length}`;
    }

    // 💰 Price filters
    if (minPrice) {
      params.push(minPrice);
      query += ` AND p.price >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND p.price <= $${params.length}`;
    }

    // 📊 Sorting
    if (sort === "price_asc") {
      query += ` ORDER BY p.price ASC`;
    } else if (sort === "price_desc") {
      query += ` ORDER BY p.price DESC`;
    } else if (sort === "oldest") {
      query += ` ORDER BY p.created_at ASC`;
    } else {
      query += ` ORDER BY p.created_at DESC`; // newest default
    }

    // 📄 Pagination
    const offset = (page - 1) * limit;

    params.push(limit);
    query += ` LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);

    // 🔢 Total count (for pagination UI)
    let countQuery = `
      SELECT COUNT(*) FROM products p WHERE 1=1
    `;

    const countParams = [];

    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND p.name ILIKE $${countParams.length}`;
    }

    if (category && category !== "all") {
      countParams.push(category);
      countQuery += ` AND p.category_id = $${countParams.length}`;
    }

    if (minPrice) {
      countParams.push(minPrice);
      countQuery += ` AND p.price >= $${countParams.length}`;
    }

    if (maxPrice) {
      countParams.push(maxPrice);
      countQuery += ` AND p.price <= $${countParams.length}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    res.json({
      products: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleProd= async (req, res) => {
    try {
      const { id } = req.params;
 const query = `
      SELECT 
        p.*,
        c.id AS category_id,
        c.name AS category_name,
        c.image_url AS category_image,

        COALESCE(r.review_count, 0) AS review_count,
        COALESCE(r.avg_rating, 0) AS avg_rating

      FROM products p

      LEFT JOIN categories c 
        ON p.category_id = c.id

      LEFT JOIN (
        SELECT 
          product_id,
          COUNT(*) AS review_count,
          AVG(rating)::numeric(10,2) AS avg_rating
        FROM reviews
        GROUP BY product_id
      ) r 
        ON r.product_id = p.id

      WHERE p.id = $1
    `;

    const result = await pool.query(query, [id]);    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
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


exports.searchProducts=async(req,res)=>{
 try {
    const { q, limit } = req.query;

    // Return empty results if no search query
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        products: [],
        count: 0,
      });
    }

    const searchTerm = `%${q.trim()}%`;
    const exactMatch = q.trim().toLowerCase();
    const startsWith = `${q.trim().toLowerCase()}%`;
 let values = [
      searchTerm,  // $1
      exactMatch,  // $2
      startsWith,  // $3
    ];

    let limitClause = '';
    if (limit !== undefined) {
      const limitNum = parseInt(limit, 10);

      if (!isNaN(limitNum) && limitNum > 0) {
        values.push(limitNum);
        limitClause = `LIMIT $${values.length}`;
      }
    }
   
     const searchQuery = `
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.image_url,
    c.name AS category_name

  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id

  WHERE LOWER(p.name) LIKE LOWER($1)

  ORDER BY
    CASE
      WHEN LOWER(p.name) = $2 THEN 1
      WHEN LOWER(p.name) LIKE $3 THEN 2
      WHEN LOWER(p.name) LIKE $1 THEN 3
      ELSE 4
    END,
    p.name ASC

  ${limitClause}
`;

    const result = await pool.query(searchQuery,values)

    res.json({
      success: true,
      products: result.rows,
      count: result.rows.length,
      query: q,
    });

  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message,
    });
  }
}
exports.payment=async (req,res)=>{

 const client = await pool.connect();

  try {
    const { items, shipping_address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    await client.query("BEGIN");

    // ✅ Calculate total price safely
    const subtotal = items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const tax = subtotal * 0.05;
const shipping = 20;

const total_price = subtotal + tax + shipping;
    // ✅ Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_price, shipping_address, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, total_price, shipping_address, "pending"]
    );

    const order = orderResult.rows[0];

    // ✅ Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id,  item.product_id ?? item.id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    // 💳 Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${order.id}`,
            },
            unit_amount: Math.round(total_price * 100), // cents
          },
          quantity: 1,
        },
      ],

      // ✅ VERY IMPORTANT → link Stripe ↔ Order
      metadata: {
        orderId: order.id.toString(),
        userId: req.user.id.toString(),
      },

success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.BASE_URL}/checkout`,
    });
  
    res.status(201).json({
      success: true,
      order,
      url: session.url,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);

    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });

  } finally {
    client.release();
  }
}

exports.webhook=async(req,res)=>{
const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const orderId = session.metadata.orderId;


    try {
      await pool.query(
        `UPDATE orders SET status = 'confirmed', updated_at = NOW()
         WHERE id = $1`,
        [orderId]
      );

    } catch (dbErr) {
      console.error('❌ DB update failed:', dbErr);
    }
  }

  res.json({ received: true });
}
