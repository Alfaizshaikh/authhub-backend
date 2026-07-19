const mysql = require('mysql2/promise');

// Create a connection pool rather than a single connection
const dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'node_auth',
    
    // Pool specific configurations:
    waitForConnections: true,
    connectionLimit: 10, // Max number of concurrent connections
    queueLimit: 0        // Unlimited queueing for pending requests
});

// Optional: Ping the database to ensure the pool is working on startup
dbPool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully.');
        connection.release(); // Always release the connection back to the pool!
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

module.exports = dbPool;