const { Order, User } = require("../models");
const { sendEmail } = require("../utils/emailSender");

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

// Helper: Kirim email notifikasi status order
async function sendOrderStatusEmail(order, statusText) {
  if (!order.customerEmail) return;
  const subject = `Status Order #${order.orderId}: ${statusText}`;
  const html = `
    <h3>Halo ${order.customerName},</h3>
    <p>Status pesanan Anda dengan Order ID <b>${
      order.orderId
    }</b> telah diperbarui menjadi: <b>${statusText}</b>.</p>
    <ul>
      <li><b>Total:</b> Rp${Number(order.total).toLocaleString("id-ID")}</li>
      <li><b>Metode Pembayaran:</b> ${order.paymentType || "-"}</li>
    </ul>
    <p>Terima kasih telah berbelanja di My Casual Store.</p>
    <hr>
    <small>Email ini dikirim otomatis, mohon tidak membalas.</small>
  `;
  try {
    await sendEmail({
      to: order.customerEmail,
      subject,
      html,
    });
  } catch (e) {
    console.error("Gagal mengirim email notifikasi order:", e);
  }
}

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

    // Kirim email notifikasi pembatalan
    await sendOrderStatusEmail(order, "Dibatalkan");

    res.status(200).json({
      success: true,
      message: "Order berhasil dibatalkan dan dihapus",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
