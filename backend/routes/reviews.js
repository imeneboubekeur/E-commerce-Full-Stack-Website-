const express=require('express')
const router=express.Router()
const verifyToken = require('../middleware/verifyToken');

const reviews=require('../controllers/reviews')

router.get("/reviews/product/:product_id", reviews.getProductReviews);
router.post("/reviews",  reviews.addReview);
router.delete("/reviews/:review_id", reviews.removeReview);
router.put("/reviews/:review_id", reviews.updateReview);

module.exports=router;