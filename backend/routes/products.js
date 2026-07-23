const express=require('express')
const router=express.Router()
const bodyParser=require("body-parser") ;
const verifyToken = require('../middleware/verifyToken');

const products=require('../controllers/products')
router.get('/products/search',products.searchProducts)
router.get('/products/:id',products.getSingleProd)
router.get('/products',products.getProducts)
router.post('/create-payment-intent',verifyToken,products.payment)
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  products.webhook
);

module.exports=router;