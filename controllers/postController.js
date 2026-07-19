const postService = require("../services/postService");
const catchAsync = require("../utils/catchAsync");

exports.getPosts = catchAsync(async (req, res) => {
    const posts = await postService.getAllPosts();
    res.json(posts);
});

exports.createPost = catchAsync(async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    
    const result = await postService.createPost(title, content, req.user.id, image);
    res.status(201).json(result);
});

exports.deletePost = catchAsync(async (req, res) => {
    const result = await postService.deletePost(req.params.id, req.user);
    res.json(result);
});

exports.getMyPosts = catchAsync(async (req, res) => {
    const posts = await postService.getUserPosts(req.user);
    res.json(posts);
});