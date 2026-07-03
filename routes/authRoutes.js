const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.renderLogin);
router.get('/register', authController.renderRegister);

router.post('/login', authController.handleLogin);
router.post('/register', authController.handleRegister);

router.get('/logout', authController.handleLogout);

module.exports = router;