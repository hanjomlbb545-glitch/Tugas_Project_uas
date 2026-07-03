const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db'); // Memakai koneksi database asli punyamu

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasiadapur_uas_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.io = io;
    res.locals.user = req.session.user || null;
    next();
});

io.on('connection', (socket) => {
    console.log('User terhubung ke WebSocket: ' + socket.id);
});

// ========================================================
// JALUR DRIVER LANGSUNG TAMBAH BARANG (PAS DENGAN WORKBENCH LU)
// ========================================================

// 1. Menampilkan Form Tambah Produk
app.get('/seller/products/add', (req, res) => {
    res.render('seller/addProduct', { title: 'Tambah Produk Baru' });
});

app.post('/seller/products/add', async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        const sellerId = req.session.user ? req.session.user.id : 1;

        // QUERY TANPA IMAGE (Hanya 4 kolom yang ada di tabel)
        const queryStr = 'INSERT INTO products (name, price, stock, seller_id) VALUES (?, ?, ?, ?)';
        await db.query(queryStr, [name, parseInt(price), parseInt(stock), sellerId]);

        res.redirect('/seller/sales'); 
    } catch (error) {
        console.error("Gagal simpan:", error);
        res.redirect('/seller/products/add');
    }
});

const authRoutes = require('./routes/authRoutes');
const webRoutes = require('./routes/webRoutes');

app.use('/auth', authRoutes);
app.use('/', webRoutes);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});