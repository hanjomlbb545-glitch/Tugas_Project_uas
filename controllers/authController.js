const db = require('../config/db');

const renderLogin = (req, res) => {
    res.render('auth/login', { message: null });
};

// 2. Menampilkan Halaman Register
const renderRegister = (req, res) => {
    res.render('auth/register', { message: null });
};

// 3. Memproses Login (Penjual & Pembeli)
const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
      
        const [users] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (users.length === 0) {
          
            return res.render('auth/login', { message: 'Username atau Password salah!' });
        }

        const user = users[0];

        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        if (user.role === 'seller') {
            return res.redirect('/seller/sales'); 
        } else {
            return res.redirect('/products'); 
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
};

const handleRegister = async (req, res) => {
    const { username, password, role } = req.body;

    try {
      
        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.render('auth/register', { message: 'Username sudah digunakan!' });
        }

        // Simpan user baru ke database
        await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
        
        // Berhasil daftar, lempar ke halaman login dengan pesan sukses
        res.render('auth/login', { message: 'Registrasi berhasil! Silakan login.' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat registrasi.');
    }
};

const handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

module.exports = {
    renderLogin,
    renderRegister,
    handleLogin,
    handleRegister,
    handleLogout
};