const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http'); 
const { Server } = require('socket.io'); 
const { Product, Category } = require('./models'); // Ambil model database untuk tambah produk

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
// JALUR LANGSUNG (ROUTE DRIVER) UNTUK FITUR TAMBAH BARANG
// ========================================================

// 1. Menampilkan Form Tambah Produk
app.get('/seller/products/add', async (req, res) => {
    try {
        // Ambil semua kategori dari database, kalau kosong set array kosong
        const categories = await Category.findAll().catch(() => []);
        res.render('seller/addProduct', { 
            title: 'Tambah Produk Baru',
            categories: categories || []
        });
    } catch (error) {
        console.error("Error muat halaman:", error);
        res.redirect('/seller/sales');
    }
});

// 2. Memproses Simpan Produk Baru ke Database Cloud
app.post('/seller/products/add', async (req, res) => {
    try {
        const { name, price, stock, description, categoryId, image } = req.body;
        
        if (!name || !price || !stock || !categoryId) {
            return res.redirect('/seller/products/add');
        }

        // Simpan langsung ke database cloud
        await Product.create({
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            description,
            categoryId: parseInt(categoryId),
            image: image || '/img/default-product.png',
            sellerId: req.session.user ? req.session.user.id : 1 // Ambil ID penjual dari session, default ke 1 jika kosong
        });

        res.redirect('/seller/sales'); // Sukses, balikkan ke dashboard
    } catch (error) {
        console.error("Gagal menyimpan produk:", error);
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