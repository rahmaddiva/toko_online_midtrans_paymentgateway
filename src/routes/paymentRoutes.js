const express = require("express");
const router = express.Router();
const {
  createTransaction,
  paymentNotification,
  checkTransactionStatus,
  cancelTransaction,
  checkMultipleTransactionStatus,
  validateCoupon, // Impor fungsi validateCoupon
} = require("../controllers/paymentController");

// POST - Create transaction and get snap token
router.post("/create-transaction", createTransaction);
// POST - Webhook untuk notifikasi pembayaran dari Midtrans
router.post("/notification", paymentNotification);
// GET - Check status transaksi
router.get("/status/:orderId", checkTransactionStatus);
// POST - Cancel transaksi
router.post("/cancel/:orderId", cancelTransaction);
// POST - Check status beberapa transaksi sekaligus
router.post("/status/bulk", checkMultipleTransactionStatus);
// POST - Validasi kupon diskon
router.post("/validate-coupon", validateCoupon);

module.exports = router;
