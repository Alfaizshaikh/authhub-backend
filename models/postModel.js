const db = require("../config/db");

exports.getAllPosts = () => {
    const sql = `
        SELECT 
            posts.id, posts.title, posts.content, posts.image, posts.created_at, posts.user_id, 
            users.name AS username 
        FROM posts 
        LEFT JOIN users ON posts.user_id = users.id 
        ORDER BY posts.id DESC
    `;
    return db.query(sql);
};

exports.createPost = (title, content, user_id, image) => {
    const sql = `
        INSERT INTO posts (title, content, user_id, image) 
        VALUES (?, ?, ?, ?)
    `;
    return db.query(sql, [title, content, user_id, image]);
};

exports.deletePost = (id) => {
    const sql = `DELETE FROM posts WHERE id = ?`;
    return db.query(sql, [id]);
};

exports.findPostById = (id) => {
    const sql = `SELECT * FROM posts WHERE id = ?`;
    return db.query(sql, [id]);
};

exports.getPostsByUser = (user_id) => {
    const sql = `
        SELECT 
            posts.id, posts.title, posts.content, posts.image, posts.created_at, posts.user_id, 
            users.name AS username 
        FROM posts 
        LEFT JOIN users ON posts.user_id = users.id 
        WHERE posts.user_id = ? 
        ORDER BY posts.id DESC
    `;
    return db.query(sql, [user_id]);
};
exports.getPostCountByUser = (user_id) => {
    // Counts the IDs without fetching any post content or joining tables
    const sql = `SELECT COUNT(id) AS postCount FROM posts WHERE user_id = ?`;
    return db.query(sql, [user_id]);
};