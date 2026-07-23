const express=require('express')
const router=express.Router()
const upload = require("../server.js");
const admin=require('../controllers/admin')
const verifyToken = require("../middleware/verifyToken.js");
const {authorizeRoles}=require("../middleware/authorizeRoles.js")
router.use("/admin", verifyToken, authorizeRoles("admin"));
//router.use(authorizeRoles("admin"));

router.get("/admin/admin",

  admin.getDashboardStats);
router.get("/admin/products",
 admin.getProductStats);
 router.get("/admin/orders",
 admin.getOrderStats);
 router.get("/admin/customers",
 admin.getCustomerStats);
router.post('/admin/add-product',upload.single("image"),admin.addProduct)
router.get('/admin/products/:id',admin.getEdit)
router.put(
  '/admin/products/:id',
  upload.single("image"),
  admin.updateProduct
);
router.delete('/admin/products/:product_id',  admin.deleteProduct);
module.exports=router;