const express = require('express');
const authController = require('../controllers/auth');
const verifyToken = require('../middleware/verifyToken');
const {
    loginLimiter, signupLimiter
} = require("../middleware/rateLimit");


const router = express.Router();
const upload = require("../server.js");

router.post('/auth/signup',signupLimiter, authController.signUp);
router.post('/auth/login',loginLimiter, authController.login);
//router.get('/auth/me', verifyToken, authController.getCurrentUser);
//router.put('/auth/profile', verifyToken, authController.updateProfile);
router.post('/auth/logout', verifyToken, authController.logout);
router.get("/auth/me", verifyToken, authController.getMe);
router.put("/auth/profile",upload.single("image"), authController.updateProfile);
router.put("/auth/change-password", verifyToken, authController.changePassword);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);
module.exports = router; 