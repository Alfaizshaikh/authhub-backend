const rateLimit = require('express-rate-limit');

// General rate limiter for the entire API
exports.globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { 
        status: 429, 
        message: "Too many requests from this IP, please try again after 15 minutes" 
    }
});

// Stricter rate limiter specifically for authentication routes
exports.authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 5 login/register requests per hour
    message: { 
        status: 429, 
        message: "Too many login attempts from this IP, please try again after an hour" 
    }
});