const express = require("express");
const router = express.Router();

// Middleware
const verifyToken = require("../middleware/verifyToken");
const { authLimiter } = require("../middleware/rateLimiter");
const { validateRegister, validateLogin } = require("../validators/authValidator");

// Controllers
const authController = require("../controllers/authController");

// Public Routes (Rate limited & Validated)
router.post("/register", authLimiter, validateRegister, authController.register);
router.post("/login", authLimiter, validateLogin, authController.login);

// Protected Routes (Require Token)
router.get("/profile", verifyToken, authController.profile); // Moved from profileRoutes.js!
router.patch("/change-password", verifyToken, authController.changePassword);

module.exports = router;