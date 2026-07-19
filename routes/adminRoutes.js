const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const authController = require("../controllers/authController");

// Apply verifyToken and checkRole to ALL routes in this file automatically
router.use(verifyToken, checkRole("admin"));

// Dashboard/Ping route
router.get("/", (req, res) => {
    res.json({ message: "Welcome Admin" });
});

router.get("/users", authController.getAllUsers);
router.patch("/users/:id/role", authController.updateUserRole);
router.delete("/users/:id", authController.deleteUser);

module.exports = router;