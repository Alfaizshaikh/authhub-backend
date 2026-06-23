const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { profile } = require("../controllers/authController");


router.get(
    "/profile",
    verifyToken,
    profile
);


module.exports = router;