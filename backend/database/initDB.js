const pool = require('./database');

const initializeDB = async () => {
  try {
    
    await pool.query(`
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT,
    image_public_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) 
`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category_id INT REFERENCES categories(id),        stock INTEGER DEFAULT 0,
        sku VARCHAR(100) UNIQUE,
         image_url TEXT,
        image_public_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `); 
    
    pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    image_url TEXT,
    image_public_id VARCHAR(255),
    reset_token TEXT,
    reset_token_expiry TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)

   pool.query(`
    CREATE TABLE IF NOT EXISTS cart (
     id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
)`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', 
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
)`) 
pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)`)
pool.query(`
   CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)

)`)

await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        key VARCHAR(100) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,          
  comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`);
    await pool.query(`
      INSERT INTO settings (category, key, value)
      VALUES
        ('store', 'store_info', '{
          "name": "My Furniture Shop",
          "email": "contact@shop.com",
          "phone": "+90 555 000 0000",
          "currency": "USD",
          "timezone": "Europe/Istanbul"
        }'),
        ('payment', 'stripe', '{
          "enabled": true,
          "testMode": true
        }'),
        ('shipping', 'shipping_rules', '{
          "flatRate": 10,
          "freeShippingOver": 100
        }'),
        ('media', 'cloudinary', '{
          "cloudName": "",
          "uploadPreset": "",
          "maxSizeMB": 5,
          "formats": ["jpg", "png", "webp"]
        }')
      ON CONFLICT (key) DO NOTHING
    `);

  
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

module.exports = initializeDB;