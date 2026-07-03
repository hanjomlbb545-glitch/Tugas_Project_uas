// 1. Middleware untuk mengecek apakah user sudah login atau belum
const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // Jika sudah login, izinkan lanjut ke halaman yang dituju
    }
    // Jika belum login, tendang ke halaman login
    res.redirect('/auth/login');
};

// 2. Middleware khusus untuk mengunci halaman Pembeli (Buyer)
const isBuyer = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'buyer') {
        return next(); // Izinkan akses jika rolenya memang 'buyer'
    }
    // Jika ada yang coba-coba masuk tapi bukan pembeli, tolak aksesnya
    res.status(403).send('Akses Ditolak! Halaman ini khusus untuk Pembeli.');
};

// 3. Middleware khusus untuk mengunci halaman Penjual (Seller)
const isSeller = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'seller') {
        return next(); // Izinkan akses jika rolenya memang 'seller'
    }
    // Jika pembeli nakal mau ngintip dashboard penjualan, kunci gerbangnya
    res.status(403).send('Akses Ditolak! Halaman ini khusus untuk Penjual.');
};

// Export semua fungsi middleware agar bisa dibaca di webRoutes.js
module.exports = {
    isLoggedIn,
    isBuyer,
    isSeller
};