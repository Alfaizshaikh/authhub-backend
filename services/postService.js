const postModel = require("../models/postModel");

const throwError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

exports.getAllPosts = async () => {
    const [posts] = await postModel.getAllPosts();
    return posts;
};

exports.createPost = async (title, content, userId, imageFilename) => {
    if (!title || !content) throwError(400, "Title and content required");
    
    await postModel.createPost(title, content, userId, imageFilename);
    return { message: "Post created successfully" };
};

exports.deletePost = async (postId, user) => {
    const [rows] = await postModel.findPostById(postId);
    if (rows.length === 0) throwError(404, "Post not found");

    const post = rows[0];
    const isOwner = post.user_id === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) throwError(403, "Access denied");

    await postModel.deletePost(postId);
    return { message: "Post deleted successfully" };
};

exports.getUserPosts = async (user) => {
    const isAdmin = user.role === "admin";
    let posts;

    if (isAdmin) {
        [posts] = await postModel.getAllPosts();
    } else {
        [posts] = await postModel.getPostsByUser(user.id);
    }
    return posts;
};