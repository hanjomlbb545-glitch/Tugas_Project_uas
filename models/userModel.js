const mysql = require('mysql2/promise'); // Pastikan pakai mysql2/promise kalau pakai async/await
require('dotenv').config();

// Konfigurasi koneksi langsung menggunakan variabel .env Hayabusa
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Wajib untuk database cloud seperti Railway
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const UserModel = {
    // Fungsi untuk mencari user berdasarkan username saat login
    findByUsername: async (username) => {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0]; // Mengembalikan data user pertama yang cocok
        } catch (error) {
            console.error('Error di UserModel.findByUsername:', error);
            throw error;
        }
    }
};

module.exports = UserModel;