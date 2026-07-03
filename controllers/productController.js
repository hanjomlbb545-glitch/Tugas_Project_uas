const db = require('../config/db'); //  Harus titik dua

// 1. Menampilkan Katalog Produk (Untuk Pembeli)
const renderKatalog = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.render('products/list', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal mengambil data produk.');
    }
};

// 2. Menampilkan Daftar Barang Terjual (Untuk Penjual)
const renderSales = async (req, res) => {
    try {
        // Query join untuk mengambil riwayat transaksi yang sukses terjual
        const query = `
            SELECT t.id, p.name AS nama_produk, p.price, t.quantity, u.username AS nama_pembeli, t.created_at 
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.buyer_id = u.id
            WHERE t.status = 'terjual'
            ORDER BY t.created_at DESC
        `;
        const [salesData] = await db.query(query);
        
        // Render halaman sales milik penjual
        res.render('seller/sales', { salesData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal memuat data penjualan.');
    }
};

module.exports = {
    renderKatalog,
    renderSales
};