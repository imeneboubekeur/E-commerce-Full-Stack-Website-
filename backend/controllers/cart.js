const pool = require('../database/database');


exports.getCart= async (req,res,next)=>{
try {
    const result = await pool.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.addToCart= async (req,res,next)=>{
     try {
    const { product_id, quantity } = req.body;
    // Check if item exists
    const existing = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existing.rows.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, req.user.id, product_id]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [req.user.id, product_id, quantity]
      );
    }

    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.incrQty=async(req,res,next)=>{
    try {
     

    const { quantity } = req.body;
    const productResult = await pool.query(
      `SELECT p.stock 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = $1 AND c.user_id = $2`,
      [req.params.cart_id, req.user.id]
    );
     if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
     const stock = productResult.rows[0].stock;
    if (quantity > stock) {
      return res.status(400).json({
        message: "Not enough stock available"
      });
    }
    await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3',
      [quantity, req.params.cart_id, req.user.id]
    );
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.deleteItem=async(req,res,next)=>{
    try {
    await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [
      req.params.cart_id,
      req.user.id,
    ]);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}