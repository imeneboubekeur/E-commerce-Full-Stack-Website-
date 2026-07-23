require('dotenv').config();
const path= require('path');
const express = require('express');
const Stripe=require('stripe');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initializeDB = require('./database/initDB');
const { createStore } =require('../furniture-react/src/shared/store');
const { renderer } = require('../dist/server.js');
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();
const isProduction = process.env.NODE_ENV === "production";
const {
    apiLimiter
} = require("./middleware/rateLimit");
app.set("trust proxy", 1);

app.use("/api/webhook", bodyParser.raw({ type: "application/json" }));

app.use(cors({
  origin:  process.env.BASE_URL,
  credentials: true,
}));
const publicPath = path.resolve(process.cwd(), "public");

app.use(express.static(publicPath));
initializeDB();  

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(
  "/styles", 
  express.static(
    path.resolve("furniture-react/src/shared/styles")
  )
);
app.use(
  "/styles",
  express.static(
    path.resolve("furniture-react/src/shared/styles")
  )
);
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",          // folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" },
    ],
  },
});

const upload = multer({ storage });


module.exports = upload;



app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:3000','http://localhost:5173', 'https://yourdomain.com', process.env.BASE_URL];

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});




const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/order');
const customersRoutes = require('./routes/customers');
const settingsRoutes = require('./routes/settings');
const reviewsRoutes = require('./routes/reviews');

const render = require("../dist/server.js").default;
//app.use("/api", apiLimiter);
app.use('/api', adminRoutes);
app.use('/api', authRoutes);
app.use('/api', productsRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', cartRoutes);
app.use('/api', ordersRoutes);
app.use('/api', customersRoutes);
app.use('/api', reviewsRoutes);
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin/settings', settingsRoutes);

app.use(async (req, res,next) => {
  try {
   

  if (req.url.includes(".")) {
    return next();
  } 
    const html =await  renderer(req,res);
     if (!html) return;
    res.send(html);
    
  } catch (error) {
     if (error.status === 401) {
      return res.redirect("/login");
    }
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});


const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
}); 