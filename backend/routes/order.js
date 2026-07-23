const express=require('express')
const router=express.Router()
const verifyToken = require('../middleware/verifyToken');

const orders=require('../controllers/order')
router.post('/orders',verifyToken,orders.postOrder)
router.get('/orders',verifyToken,orders.getOrders)
router.get('/orders/:id',verifyToken,orders.getSingle)

module.exports=router; 