const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const checkPostLimit = require("../middleware/checkPostLimit");
const upload = require("../middleware/upload");
const postController = require("../controllers/postController");

// Public Routes
// FIX: Changed from "/posts" to "/"
router.get("/", postController.getPosts);

// Protected Routes
router.use(verifyToken); 

// This combined with server.js makes it /api/posts/my-posts
router.get("/my-posts", postController.getMyPosts);

// FIX: Changed from "/posts" to "/"
router.post("/", checkPostLimit, upload.single("image"), postController.createPost);

// FIX: Changed from "/posts/:id" to "/:id"
router.delete("/:id", postController.deletePost);

module.exports = router;