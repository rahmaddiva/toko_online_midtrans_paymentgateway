const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// All routes require admin access
router.use(protect, authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
