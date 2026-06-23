const express = require("express");

const router = express.Router();

const verifyToken =
    require("../middleware/verifyToken");

const checkRole =
    require("../middleware/checkRole");
const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require(
    "../controllers/authController"
);


router.get(
    "/admin",
    verifyToken,
    checkRole("admin"),
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);
router.get(
    "/users",
    verifyToken,
    checkRole("admin"),
    getAllUsers
);
router.patch(
    "/users/:id/role",
    verifyToken,
    checkRole("admin"),
    updateUserRole
);
router.delete(
    "/users/:id",
    verifyToken,
    checkRole("admin"),
    deleteUser
);
module.exports = router;