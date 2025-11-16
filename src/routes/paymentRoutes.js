const express = require("express");
const router = express.Router();
const {
  createTransaction,
  paymentNotification,
  checkTransactionStatus,
  cancelTransaction,
  checkMultipleTransactionStatus,
  validateCoupon,
  updateOrderStatus,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

// POST - Create transaction and get snap token (Protected untuk mendapat userId dari token)
router.post("/create-transaction", protect, createTransaction);
// POST - Webhook untuk notifikasi pembayaran dari Midtrans
router.post("/notification", paymentNotification);
// GET - Check status transaksi
router.get("/status/:orderId", checkTransactionStatus);
// PUT - Update order status (after payment success)
router.put("/status/:orderId", protect, updateOrderStatus);
// POST - Cancel transaksi
router.post("/cancel/:orderId", cancelTransaction);
// POST - Check status beberapa transaksi sekaligus
router.post("/status/bulk", checkMultipleTransactionStatus);
// POST - Validasi kupon diskon
router.post("/validate-coupon", validateCoupon);

module.exports = router;
