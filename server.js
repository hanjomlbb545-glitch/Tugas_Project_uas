const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db'); // Sesuai dengan file db.js yang kamu edit tadi

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
// JALUR TAMBAH BARANG LANGSUNG MENGGUNAKAN QUERY DATABASE ASLI LU
// ========================================================

// 1. Menampilkan Halaman Form Tambah Produk
app.get('/seller/products/add', async (req, res) => {
    try {
        // Ambil kategori langsung dari tabel categories pake query database kalian
        const [categories] = await db.query('SELECT * FROM categories').catch(() => [[]]);
        
        res.render('seller/addProduct', { 
            title: 'Tambah Produk Baru',
            categories: categories || [],
            success_msg: req.flash ? req.flash('success_msg') : [],
            error_msg: req.flash ? req.flash('error_msg') : []
        });
    } catch (error) {
        console.error(error);
        res.redirect('/seller/sales');
    }
});

// 2. Memproses Simpan Produk Baru ke Database Cloud Railway
app.post('/seller/products/add', async (req, res) => {
    try {
        const { name, price, stock, description, categoryId, image } = req.body;
        const sellerId = req.session.user ? req.session.user.id : null;

        // Query insert manual sesuai struktur tabel SQL kalian
        const queryStr = 'INSERT INTO products (name, price, stock, description, category_id, seller_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const imgUrl = image || '/img/default-product.png';

        await db.query(queryStr, [name, price, stock, description, categoryId, sellerId, imgUrl]);

        res.redirect('/seller/sales');
    } catch (error) {
        console.error("Gagal simpan produk:", error);
        res.redirect('/seller/products/add');
    }
});
// ========================================================

const authRoutes = require('./routes/authRoutes');
const webRoutes = require('./routes/webRoutes');

app.use('/auth', authRoutes);
app.use('/', webRoutes);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});