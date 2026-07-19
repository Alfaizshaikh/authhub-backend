// Accepts either a single role ("admin") or an array (["admin", "superadmin"])
const checkRole = (roles) => {
    return (req, res, next) => {
        // Safety check: ensure user object exists
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized. User identity missing." });
        }

        // Convert single role to array for uniform checking
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }

        next();
    };
};

module.exports = checkRole;