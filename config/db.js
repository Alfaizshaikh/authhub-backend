const mysql = require('mysql2/promise');

// Create a connection pool
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Fix: Added the port variable
    port: parseInt(process.env.DB_PORT) || 3306, 
    
    // Pool specific configurations:
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection on startup
dbPool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully to ' + process.env.DB_HOST);
        connection.release();
    })
    .catch(err => {
        console.error("❌ Database connection failed: ", err.message);
        // This will now crash the app explicitly so you know what is wrong
        process.exit(1);
    });

module.exports = dbPool;