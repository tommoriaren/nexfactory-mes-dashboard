const mysql = require('mysql2');
require('dotenv').config();

// Membuat pool koneksi agar lebih efisien & stabil
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Maksimal 10 koneksi simultan
    queueLimit: 0
});

// Mengubah pool menjadi versi promise agar bisa pakai async/await
const db = pool.promise();

// Cek koneksi saat server dinyalakan
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database Connection Error:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database (NexFactory)');
        connection.release();
    }
});

module.exports = db;