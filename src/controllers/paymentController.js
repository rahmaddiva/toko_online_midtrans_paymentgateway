const { snap, coreApi } = require("../config/midtrans");
const { Order } = require("../models");

// --- DATABASE KUPON SEDERHANA ---
const COUPONS = {
  HEMAT10: { type: "percentage", value: 10 },
  DISKON25K: { type: "fixed", value: 25000 },
  MYCASUAL: { type: "percentage", value: 15 },
};

// Fungsi untuk menghitung diskon
const calculateDiscount = (total, coupon) => {
  if (coupon.type === "percentage") {
    return (total * coupon.value) / 100;
  }
  return coupon.value;
};

// Generate order ID unik
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
};

// Create Transaction - Generate Snap Token
exports.createTransaction = async (req, res, next) => {
  try {
    const { orderId, amount, items, customer, couponCode } = req.body;
    const userId = req.user ? req.user.id : null; // Ambil userId dari middleware protect

    // Validasi input
    if (!amount || !items || !customer) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, items, or customer",
      });
    }

    // Gunakan orderId yang disediakan, jangan generate yang baru
    const finalOrderId = orderId;

    if (!finalOrderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    let gross_amount = amount;
    let discount = 0;

    // Validasi ulang kupon di backend untuk keamanan
    if (couponCode && COUPONS[couponCode]) {
      const coupon = COUPONS[couponCode];
      discount = calculateDiscount(amount, coupon);
      gross_amount = Math.max(0, amount - discount);
    }

    // Cek apakah order sudah ada di database
    let existingOrder = null;
    if (userId) {
      existingOrder = await Order.findOne({
        where: { orderId: finalOrderId },
      });
    }

    // Jika order sudah ada, hanya ambil token dari Midtrans tanpa membuat order baru
    if (existingOrder) {
      console.log(
        "Order already exists, getting token from Midtrans for orderId:",
        finalOrderId
      );

      // Coba ambil transaction status dari Midtrans
      try {
        const statusResponse = await coreApi.transaction.status(finalOrderId);

        // Jika transaksi sudah ada dan belum settlement, ambil token baru
        if (statusResponse && statusResponse.status_code === "200") {
          // Generate token baru untuk order yang sudah ada
          const parameter = {
            transaction_details: {
              order_id: finalOrderId,
              gross_amount: gross_amount,
            },
            item_details: items,
            customer_details: customer,
            callbacks: {
              finish: "http://localhost:5500/payment-success.html",
              error: "http://localhost:5500/payment-error.html",
              pending: "http://localhost:5500/payment-pending.html",
            },
          };

          const transaction = await snap.createTransaction(parameter);

          console.log("Transaction token generated for existing order:", {
            orderId: finalOrderId,
            amount: gross_amount,
            token: transaction.token,
          });

          return res.status(200).json({
            success: true,
            message: "Transaction token generated successfully",
            data: {
              token: transaction.token,
              redirect_url: transaction.redirect_url,
              order_id: finalOrderId,
            },
          });
        }
      } catch (checkError) {
        console.log(
          "Error checking transaction status, creating new:",
          checkError.message
        );
      }
    }

    // Jika order belum ada, buat parameter transaksi baru
    const parameter = {
      transaction_details: {
        order_id: finalOrderId,
        gross_amount: gross_amount,
      },
      item_details: items,
      customer_details: customer,
      callbacks: {
        finish: "http://localhost:5500/payment-success.html",
        error: "http://localhost:5500/payment-error.html",
        pending: "http://localhost:5500/payment-pending.html",
      },
    };

    // Buat transaksi dan dapatkan token
    const transaction = await snap.createTransaction(parameter);

    // Simpan order ke database hanya jika belum ada
    if (userId && !existingOrder) {
      await Order.create({
        orderId: finalOrderId,
        userId: userId,
        items: items,
        subtotal: amount,
        discount: discount,
        total: gross_amount,
        couponCode: couponCode || null,
        status: "pending",
        customerName: customer.first_name + " " + customer.last_name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
      });
    }

    console.log("Transaction created:", {
      orderId: finalOrderId,
      amount: gross_amount,
      token: transaction.token,
    });

    res.status(200).json({
      success: true,
      message: "Transaction token generated successfully",
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id: finalOrderId,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);

    // Handle error khusus untuk order_id yang sudah terpakai
    if (
      error.message &&
      error.message.includes("order_id has already been taken")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID sudah terpakai. Mohon gunakan order ID yang berbeda atau hubungi support.",
        error: error.message,
      });
    }

    next(error);
  }
};

// Validate Coupon
exports.validateCoupon = async (req, res, next) => {
  try {
    const { couponCode, total } = req.body;

    if (!couponCode || !total) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and total are required",
      });
    }

    const coupon = COUPONS[couponCode.toUpperCase()];

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Kupon tidak valid atau sudah kedaluwarsa.",
      });
    }

    const discount = calculateDiscount(total, coupon);
    const newTotal = total - discount;

    res.status(200).json({
      success: true,
      message: "Kupon berhasil diterapkan!",
      data: { discount, newTotal },
    });
  } catch (error) {
    next(error);
  }
};

// Payment Notification Webhook
exports.paymentNotification = async (req, res, next) => {
  try {
    const notification = req.body;
    console.log("Payment notification received:", notification);

    const statusResponse = await coreApi.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    );

    // Update status di database
    const order = await Order.findOne({ where: { orderId } });

    if (order) {
      let newStatus = transactionStatus;

      if (transactionStatus === "capture" && fraudStatus === "accept") {
        newStatus = "settlement";
      }

      await order.update({
        status: newStatus,
        paymentType: paymentType,
      });

      console.log(`Order ${orderId} status updated to ${newStatus}`);
    }

    res.status(200).json({
      success: true,
      message: "Notification processed",
      data: {
        order_id: orderId,
        status: transactionStatus,
      },
    });
  } catch (error) {
    console.error("Error processing notification:", error);
    next(error);
  }
};

// Check Transaction Status
exports.checkTransactionStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const statusResponse = await coreApi.transaction.status(orderId);

    console.log("Transaction status checked:", {
      orderId: orderId,
      status: statusResponse.transaction_status,
    });

    res.status(200).json({
      success: true,
      message: "Transaction status retrieved",
      data: {
        order_id: statusResponse.order_id,
        transaction_status: statusResponse.transaction_status,
        fraud_status: statusResponse.fraud_status,
        payment_type: statusResponse.payment_type,
        gross_amount: statusResponse.gross_amount,
        transaction_time: statusResponse.transaction_time,
      },
    });
  } catch (error) {
    console.error("Error checking transaction status:", error);
    next(error);
  }
};

// Cancel Transaction
exports.cancelTransaction = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const cancelResponse = await coreApi.transaction.cancel(orderId);

    // Update di database
    const order = await Order.findOne({ where: { orderId } });
    if (order) {
      await order.update({ status: "cancel" });
    }

    console.log("Transaction cancelled:", {
      orderId: orderId,
      status: cancelResponse.transaction_status,
    });

    res.status(200).json({
      success: true,
      message: "Transaction cancelled successfully",
      data: cancelResponse,
    });
  } catch (error) {
    console.error("Error cancelling transaction:", error);
    next(error);
  }
};

// Get Multiple Transaction Statuses
exports.checkMultipleTransactionStatus = async (req, res, next) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "orderIds must be a non-empty array",
      });
    }

    const statusPromises = orderIds.map((orderId) =>
      coreApi.transaction.status(orderId).catch((err) => ({
        order_id: orderId,
        transaction_status: "not_found",
        error: err.message,
      }))
    );

    const statuses = await Promise.all(statusPromises);

    res.status(200).json({
      success: true,
      message: "Transaction statuses retrieved",
      data: statuses,
    });
  } catch (error) {
    console.error("Error checking multiple transaction statuses:", error);
    next(error);
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, paymentType } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await Order.findOne({ where: { orderId } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    // Update order status
    await order.update({
      status: status,
      paymentType: paymentType || order.paymentType,
    });

    console.log(`Order ${orderId} status updated to ${status}`);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    next(error);
  }
};
