const db = require("../config/db");


exports.createUser = (
    name,
    email,
    password,
    role
) => {

    const sql = `
        INSERT INTO users
        (name,email,password,role)
        VALUES (?,?,?,?)
    `;

    return db.promise().query(
        sql,
        [name, email, password, role]
    );

};


exports.getAllUsers = () => {

    const sql = `
        SELECT
            id,
            name,
            email,
            role
        FROM users
    `;

    return db.promise().query(sql);

};


exports.findUserByEmail = (email) => {

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    return db.promise().query(
        sql,
        [email]
    );

};


exports.findUserById = (id) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            role
        FROM users
        WHERE id = ?
    `;

    return db.promise().query(
        sql,
        [id]
    );

};


exports.updateUserRole = (
    id,
    role
) => {

    const sql = `
        UPDATE users
        SET role = ?
        WHERE id = ?
    `;

    return db.promise().query(
        sql,
        [role, id]
    );

};


exports.deleteUser = (id) => {

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    return db.promise().query(
        sql,
        [id]
    );

};