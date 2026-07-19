const validator = require("validator");

exports.validateRegister = (req, res, next) => {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Sanitize: remove leading/trailing whitespace
    name = name.trim();
    email = email.trim();

    // Validate Email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Validate Password strength (e.g., minimum 6 characters)
    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Reassign sanitized values back to req.body
    req.body.name = name;
    req.body.email = email;
    
    next();
};

exports.validateLogin = (req, res, next) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    email = email.trim();

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    req.body.email = email;

    next();
};