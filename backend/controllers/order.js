const pool = require('../database/database');


exports.getOrders = async (req, res) => {
  try {
    const {
      search,
      status,
      sort = "newest",
      page = 1,
      limit =10
    } = req.query;

    let query = `
      SELECT 
        o.id AS order_id,
        u.name AS customer,
        o.created_at AS date,
        o.total_price AS amount,
        o.status,
        STRING_AGG(p.name || ' (x' || oi.quantity || ')', ', ') AS products
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE 1=1
    `;

    const params = [];

    // 🔍 SEARCH
    if (search) {
      params.push(`%${search}%`);
      query += ` AND u.name ILIKE $${params.length}`;
    }

    // 📦 STATUS
    if (status && status !== "all") {
      params.push(status);
      query += ` AND o.status = $${params.length}`;
    }

    // 📊 GROUP BY
    query += `
      GROUP BY o.id, u.name, o.created_at, o.total_price, o.status
    `;

    // 🔃 SORT
    if (sort === "oldest") {
      query += ` ORDER BY o.created_at ASC`;
    } else {
      query += ` ORDER BY o.created_at DESC`;
    }

    // 📄 PAGINATION
    const offset = (page - 1) * limit;

    params.push(limit);
    query += ` LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);

    // 🔢 COUNT QUERY (IMPORTANT)
    let countQuery = `
      SELECT COUNT(DISTINCT o.id)
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;

    const countParams = [];

    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND u.name ILIKE $${countParams.length}`;
    }

    if (status && status !== "all") {
      countParams.push(status);
      countQuery += ` AND o.status = $${countParams.length}`;
    }

    const countResult = await pool.query(countQuery, countParams);

    // ✅ FINAL RESPONSE
    res.json({
      orders: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getSingle= async (req,res,next)=>{
    try {
   
    const { id } = req.params;

    // 🧾 Get order + customer info
    const orderResult = await pool.query(
      `
      SELECT 
        o.*,
        u.name  AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 🛒 Get items + product info
    const itemsResult = await pool.query(
      `
      SELECT 
        oi.*,
        p.name      AS product_name,
        p.image_url AS product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      `,
      [id]
    );

    const order = orderResult.rows[0];

    res.json({
      id: order.id,
      status: order.status,
      total_price: order.total_price,
      shipping_address: order.shipping_address,
      created_at: order.created_at,

      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,

      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

exports.postOrder= async (req,res,next)=>{
     const client = await pool.connect();
  try {
    const { items, shipping_address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    await client.query('BEGIN');

    // Calculate total price
    const total_price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_price, shipping_address, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, total_price, shipping_address, 'pending']
    );

    const order = orderResult.rows[0];

    // Create order items
   for (const item of items) {
  await client.query(
    `INSERT INTO order_items (order_id, product_id, quantity, price)
     VALUES ($1, $2, $3, $4)`,
    [order.id, item.product_id, item.quantity, item.price]
      );
    }

    // Clear user's cart (if you have a cart table)
    //await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    // Fetch complete order with items
    const completeOrder = await pool.query(
      `SELECT o.*, 
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name
           
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [order.id]
    );

    res.status(201).json(completeOrder.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
}
 exports.getOrders1=async (req,res,next)=>{
   try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id,
        u.name AS customer,
        o.created_at AS date,
        o.total_price AS amount,
        o.status,
        STRING_AGG(p.name || ' (x' || oi.quantity || ')', ', ') AS products
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, u.name, o.created_at, o.total_price, o.status
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
 }