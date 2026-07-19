require('dotenv').config(); 
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan'); 
const path = require('path');

// Import Middleware & Routes
const { globalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db'); // Ensure this matches your ACTUAL file path

// Initialize App
const app = express();

// ==========================================
// 1. AUTO-SETUP: Verify Tables on Startup
// ==========================================
(async () => {
    try {
        console.log("Checking/Creating database tables...");
        await db.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, role ENUM('user', 'admin') DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await db.query(`CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(255) NOT NULL, content TEXT NOT NULL, image VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`);
        await db.query(`CREATE TABLE IF NOT EXISTS subscriptions (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, plan VARCHAR(50), status VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`);
        console.log("✅ Database tables are verified and ready.");
    } catch (err) {
        console.error("❌ Auto-setup failed: ", err.message);
    }
})();

// ==========================================
// 2. GLOBAL MIDDLEWARE
// ==========================================
app.use(cors({ origin: 'https://authhub-frontend-2uwl.onrender.com', credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, crossOriginEmbedderPolicy: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(globalLimiter);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 3. ROUTERS
// ==========================================

// Route for manual setup (Keep this clean and defined once)
app.get('/api/setup-database', async (req, res) => {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, role ENUM('user', 'admin') DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await db.query(`CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(255) NOT NULL, content TEXT NOT NULL, image VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`);
        await db.query(`CREATE TABLE IF NOT EXISTS subscriptions (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, plan VARCHAR(50), status VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`);
        res.send("✅ Success! All tables created.");
    } catch (err) { res.status(500).send("❌ Error: " + err.message); }
});

// Mount Routes (Keeping both paths for safety)
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// ==========================================
// 4. ERROR HANDLING & SERVER INIT
// ==========================================
app.use('*', (req, res, next) => {
    const error = new Error(`Cannot find ${req.originalUrl} on this server`);
    error.status = 404;
    next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});