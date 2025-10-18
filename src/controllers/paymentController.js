const { snap, coreApi } = require('../config/midtrans');

// Generate order ID unik
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
};

// Create Transaction - Generate Snap Token
exports.createTransaction = async (req, res, next) => {
  try {
    const { orderId, amount, items, customer } = req.body;

    // Validasi input
    if (!amount || !items || !customer) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, items, or customer'
      });
    }

    // Generate order ID jika tidak disediakan
    const finalOrderId = orderId || generateOrderId();

    // Parameter transaksi untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: finalOrderId,
        gross_amount: amount
      },
      item_details: items,
      customer_details: customer,
      callbacks: {
        finish: 'http://localhost:5500/payment-success.html',
        error: 'http://localhost:5500/payment-error.html',
        pending: 'http://localhost:5500/payment-pending.html'
      }
    };

    // Buat transaksi dan dapatkan token
    const transaction = await snap.createTransaction(parameter);

    console.log('Transaction created:', {
      orderId: finalOrderId,
      amount: amount,
      token: transaction.token
    });

    res.status(200).json({
      success: true,
      message: 'Transaction token generated successfully',
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id: finalOrderId
      }
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    next(error);
  }
};

// Payment Notification Webhook
exports.paymentNotification = async (req, res, next) => {
  try {
    const notification = req.body;
    
    console.log('Payment notification received:', notification);

    // Verifikasi notifikasi dari Midtrans
    const statusResponse = await coreApi.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    // Logic berdasarkan status pembayaran
    let orderStatus = '';
    
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        orderStatus = 'success';
        // TODO: Update database - order berhasil
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'success';
      // TODO: Update database - pembayaran selesai
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      orderStatus = 'failed';
      // TODO: Update database - order gagal
    } else if (transactionStatus === 'pending') {
      orderStatus = 'pending';
      // TODO: Update database - menunggu pembayaran
    }

    res.status(200).json({
      success: true,
      message: 'Notification processed',
      data: {
        order_id: orderId,
        status: orderStatus,
        transaction_status: transactionStatus
      }
    });

  } catch (error) {
    console.error('Error processing notification:', error);
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
        message: 'Order ID is required'
      });
    }

    // Cek status transaksi ke Midtrans
    const statusResponse = await coreApi.transaction.status(orderId);

    console.log('Transaction status checked:', {
      orderId: orderId,
      status: statusResponse.transaction_status
    });

    res.status(200).json({
      success: true,
      message: 'Transaction status retrieved',
      data: {
        order_id: statusResponse.order_id,
        transaction_status: statusResponse.transaction_status,
        fraud_status: statusResponse.fraud_status,
        payment_type: statusResponse.payment_type,
        gross_amount: statusResponse.gross_amount,
        transaction_time: statusResponse.transaction_time
      }
    });

  } catch (error) {
    console.error('Error checking transaction status:', error);
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
        message: 'Order ID is required'
      });
    }

    // Cancel transaksi
    const cancelResponse = await coreApi.transaction.cancel(orderId);

    console.log('Transaction cancelled:', {
      orderId: orderId,
      status: cancelResponse.transaction_status
    });

    res.status(200).json({
      success: true,
      message: 'Transaction cancelled successfully',
      data: cancelResponse
    });

  } catch (error) {
    console.error('Error cancelling transaction:', error);
    next(error);
  }
};