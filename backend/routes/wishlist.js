const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const wishlistController = require('../controllers/wishlist');

router.get('/', verifyToken, wishlistController.getWishlist);
router.post('/add', verifyToken, wishlistController.addToWishlist);
router.delete('/:product_id', verifyToken, wishlistController.removeFromWishlist);

module.exports = router;