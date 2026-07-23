const express=require('express')
const router=express.Router()
const verifyToken = require('../middleware/verifyToken');

const cart=require('../controllers/cart')
router.post('/cart/add',verifyToken,cart.addToCart)
router.get('/cart',verifyToken,cart.getCart)
router.put('/cart/:cart_id',verifyToken,cart.incrQty)
router.delete('/cart/:cart_id',verifyToken,cart.deleteItem)

module.exports=router; 