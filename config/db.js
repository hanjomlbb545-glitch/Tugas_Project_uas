const mysql = require('mysql2');
require('dotenv').config();

// Membuat connection pool ke database Hayabusa Railway
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // === BARIS SAKRAL BIAR TIDAK TIMEOUT ===
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mengekspor promise pool agar bisa dipakai pakai keyword 'await' di controller-mu
module.exports = pool.promise();