const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const subscriptionModel = require("../models/subscriptionModel");

// Helper function to throw consistent errors
const throwError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

exports.registerUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // FIXED: Use the new, highly optimized database check
    const [rows] = await userModel.checkIfAnyUserExists();
    
    // If no rows are returned, the DB is empty, make them an admin
    const role = rows.length === 0 ? "admin" : "user";

    try {
        const [result] = await userModel.createUser(name, email, hashedPassword, role);
        await subscriptionModel.createSubscription(result.insertId);
        return { message: "User registered successfully" };
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throwError(400, "Email already exists");
        }
        throw error;
    }
};
exports.loginUser = async (email, password) => {
    const [rows] = await userModel.findUserByEmail(email);
    if (rows.length === 0) throwError(404, "User not found");

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throwError(401, "Invalid password");

    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Fixed: Changed from process.env.JWT_SECRET to standard time string
    );

    return {
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
};

exports.getUserProfile = async (userId) => {
    const [rows] = await userModel.findUserById(userId);
    if (rows.length === 0) throwError(404, "User not found");
    return rows[0];
};

exports.getAllUsers = async () => {
    const [users] = await userModel.getAllUsers();
    return users;
};

exports.updateRole = async (targetId, requesterId, newRole) => {
    if (Number(targetId) === requesterId && newRole === "user") {
        throwError(400, "You cannot remove your own admin role");
    }
    if (newRole !== "admin" && newRole !== "user") {
        throwError(400, "Invalid role");
    }

    await userModel.updateUserRole(targetId, newRole);
    return { message: `Role updated to ${newRole}` };
};

exports.deleteUserAccount = async (targetId, requesterId) => {
    if (Number(targetId) === requesterId) {
        throwError(400, "You cannot delete yourself");
    }
    await userModel.deleteUser(targetId);
    return { message: "User deleted" };
};

exports.changeUserPassword = async (userId, oldPassword, newPassword, confirmPassword) => {
    if (!oldPassword || !newPassword) throwError(400, "Both passwords are required");
    if (newPassword !== confirmPassword) throwError(400, "New passwords do not match");

    const [rows] = await userModel.findUserPassword(userId);
    if (rows.length === 0) throwError(404, "User not found");

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throwError(401, "Old password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(userId, hashedPassword);

    return { message: "✓ Password changed successfully" };
};