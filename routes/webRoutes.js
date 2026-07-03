const express = require('express');
const router = express.Router();

// Import Controller dengan jalur yang benar (titik dua karena keluar dari folder routes)
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

// Import Middleware
const { isLoggedIn, isBuyer, isSeller } = require('../middleware/authMiddleware');

// ==========================================
// RUTE UNTUK PEMBELI (BUYER)
// ==========================================
// Halaman Katalog Produk
router.get('/products', isLoggedIn, isBuyer, productController.renderKatalog);

// Proses Pembelian Produk (RTC Terkandung di Sini)
router.post('/products/buy', isLoggedIn, isBuyer, orderController.handlePurchase);

// ==========================================
// RUTE UNTUK PENJUAL (SELLER)
// ==========================================
// Halaman Dashboard Penjual
router.get('/seller/sales', isLoggedIn, isSeller, productController.renderSales);

module.exports = router;