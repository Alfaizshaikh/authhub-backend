const db = require("../config/db");

exports.createUser = (name, email, password, role) => {
    const sql = `
        INSERT INTO users (name, email, password, role) 
        VALUES (?, ?, ?, ?)
    `;
    return db.query(sql, [name, email, password, role]);
};

exports.getAllUsers = () => {
    const sql = `SELECT id, name, email, role FROM users`;
    return db.query(sql);
};

exports.findUserByEmail = (email) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    return db.query(sql, [email]);
};

exports.findUserById = (id) => {
    const sql = `SELECT id, name, email, role FROM users WHERE id = ?`;
    return db.query(sql, [id]);
};

exports.updateUserRole = (id, role) => {
    const sql = `UPDATE users SET role = ? WHERE id = ?`;
    return db.query(sql, [role, id]);
};

exports.deleteUser = (id) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    return db.query(sql, [id]);
};

exports.updatePassword = (id, password) => {
    const sql = `UPDATE users SET password = ? WHERE id = ?`;
    return db.query(sql, [password, id]);
};

exports.findUserPassword = (id) => {
    const sql = `SELECT password FROM users WHERE id = ?`;
    return db.query(sql, [id]);
};

exports.checkIfAnyUserExists = () => {
    // Highly optimized check. Stops at the first row found.
    const sql = "SELECT 1 AS userExists FROM users LIMIT 1";
    return db.query(sql);
};