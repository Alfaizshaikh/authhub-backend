const db = require("../config/db");

exports.createSubscription = (user_id) => {
    const sql = `
        INSERT INTO subscriptions (user_id, plan, post_limit, status) 
        VALUES (?, 'free', 5, 'active')
    `;
    return db.query(sql, [user_id]);
};

exports.getSubscriptionByUser = (user_id) => {
    // Only select the fields you actually need
    const sql = `
        SELECT plan, post_limit, status 
        FROM subscriptions 
        WHERE user_id = ?
    `;
    return db.query(sql, [user_id]);
};