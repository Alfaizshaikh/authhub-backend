// server.js
require('dotenv').config(); // Load environment variables first
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan'); // For HTTP request logging
const path = require('path');

// Import Middleware
const { globalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize App
const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARE (Security & Parsing)
// ==========================================
app.use(cors({
    origin: 'https://authhub-frontend-2uwl.onrender.com', // Replace with your actual frontend URL
    credentials: true
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));
app.use(express.json());

// Expose the uploads folder so the browser can download the images
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Log HTTP requests to the console
app.use(morgan('dev'));

// Apply global rate limiting to all requests
app.use(globalLimiter);

// Serve static files from the uploads directory (if using local storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 2. ROUTERS
// ==========================================

// Mount route files to specific API paths
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all for undefined routes (404)
app.use('*', (req, res, next) => {
    const error = new Error(`Cannot find ${req.originalUrl} on this server`);
    error.status = 404;
    next(error);
});

// ==========================================
// 3. ERROR HANDLING
// ==========================================

// Centralized error handler (Must be the last middleware!)
app.use(errorHandler);
// TEMPORARY SETUP ROUTE - Run this ONCE to create tables
app.get('/api/setup-database', async (req, res) => {
    const db = require('./db'); 
    
    try {
        // Create Users Table first
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create Posts Table second
        await db.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        res.send("✅ Tables created successfully!");
    } catch (err) {
        res.status(500).send("❌ Error: " + err.message);
    }
});
// ==========================================
// 4. SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
});