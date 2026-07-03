const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

// 1. Route Dashboard Jualan lama kalian
router.get('/sales', sellerController.getSalesDashboard);

// 2. PASTIKAN DUA BARIS INI TERTULIS DI ATAS MODULE.EXPORTS YA LEK!
router.get('/products/add', sellerController.getAddProductForm);
router.post('/products/add', sellerController.createProduct);

// Module exports harus selalu berada di baris PALING BAWAH file
module.exports = router;