const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST - Create transaction and get snap token
router.post('/create-transaction', paymentController.createTransaction);

// POST - Webhook untuk notifikasi pembayaran dari Midtrans
router.post('/notification', paymentController.paymentNotification);

// GET - Check status transaksi
router.get('/status/:orderId', paymentController.checkTransactionStatus);

// POST - Cancel transaksi
router.post('/cancel/:orderId', paymentController.cancelTransaction);

module.exports = router;