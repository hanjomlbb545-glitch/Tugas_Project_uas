const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

// Route Dashboard Jualan lama kalian
router.get('/sales', sellerController.getSalesDashboard);

// TAMBAHKAN JALUR INI LEK
router.get('/products/add', sellerController.getAddProductForm);
router.post('/products/add', sellerController.createProduct);

module.exports = router;