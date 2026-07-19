const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Fails if no header OR doesn't start with "Bearer "
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid or missing authorization header" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        // Verify and attach user payload to request
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = verifyToken;