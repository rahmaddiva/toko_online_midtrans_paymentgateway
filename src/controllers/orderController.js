const { Order, User } = require("../models");

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:orderId
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { orderId: req.params.orderId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    // Pastikan user hanya bisa melihat ordernya sendiri (kecuali admin)
    if (order.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Tidak memiliki akses ke order ini",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:orderId
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { orderId: req.params.orderId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    // Pastikan user hanya bisa cancel ordernya sendiri
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Tidak memiliki akses untuk cancel order ini",
      });
    }

    // Hanya bisa cancel order yang pending
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Tidak bisa cancel order dengan status ${order.status}`,
      });
    }

    // Hapus order dari database
    await order.destroy();

    res.status(200).json({
      success: true,
      message: "Order berhasil dibatalkan dan dihapus",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
