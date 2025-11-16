const express = require("express");
const router = express.Router();
const {
  getMyOrders,
  getAllOrders,
  getOrder,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

// Protected routes - admin dan customer
router.get("/", protect, async (req, res, next) => {
  // Jika admin, tampilkan semua orders
  // Jika customer, tampilkan hanya orders mereka
  if (req.user.role === "admin") {
    return getAllOrders(req, res, next);
  } else {
    return getMyOrders(req, res, next);
  }
});

// Customer routes
router.get("/my-orders", protect, getMyOrders);
router.get("/:orderId", protect, getOrder);
router.delete("/:orderId", protect, cancelOrder);

module.exports = router;
