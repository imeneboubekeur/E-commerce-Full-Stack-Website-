const express=require('express')
const router=express.Router()

const customers=require('../controllers/customers')
//router.post('/admin/add-product',admin.addProduct)
router.get('/customers',customers.getCustomers)

module.exports=router;