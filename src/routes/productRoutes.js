const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

// Public endpoints
router.get("/", productController.getAllProducts); // List produk
router.get("/categories", productController.getCategories); // List kategori unik
router.get("/:id", productController.getProduct); // Detail produk

// Admin endpoints (protected)
router.post("/", protect, authorize("admin"), productController.createProduct);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  productController.updateProduct
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  productController.deleteProduct
);

module.exports = router;
