const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
exports.register = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await userModel.createUser(
            name,
            email,
            hashedPassword,
            "user"
        );

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {

        console.log(error);

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                message: "Email already exists"
            });

        }
        next(error);

    }

};
exports.login = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;

        const [rows] =
            await userModel.findUserByEmail(email);

        if (rows.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const user = rows[0];

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid password"
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        next(error);
    }

};
exports.profile = async (req, res, next) => {

    try {

        const [rows] =
            await userModel.findUserById(
                req.user.id
            );

        res.json(rows[0]);

    }
    catch (error) {
        next(error);
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};
exports.getAllUsers = async (
    req,
    res,
    next
) => {

    try {

        const [users] =
            await userModel.getAllUsers();

        res.json(users);

    }
    catch (error) {
        next(error);
    }

};
exports.updateUserRole = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;
        const { role } = req.body;
        if (
            Number(id) === req.user.id &&
            role === "user"
        ) {
            return res.status(400).json({
                message: "You cannot remove your own admin role"
            });
        }

        if (
            role !== "admin" &&
            role !== "user"
        ) {

            return res.status(400).json({
                message: "Invalid role"
            });

        }

        await userModel.updateUserRole(
            id,
            role
        );

        res.json({
            message: `Role updated to ${role}`
        });

    } catch (error) {
        next(error);
    }

};
exports.deleteUser = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;


        if (Number(id) === req.user.id) {

            return res.status(400).json({
                message: "You cannot delete yourself"
            });

        }


        await userModel.deleteUser(id);

        res.json({
            message: "User deleted"
        });


    } catch (error) {
        next(error);
    }

};