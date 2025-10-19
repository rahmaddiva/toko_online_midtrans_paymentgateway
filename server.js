// --- IMPOR DEPENDENSI ---

// Mengimpor modul-modul yang diperlukan
const express = require('express'); // Framework web untuk Node.js
const cors = require('cors');       // Middleware untuk mengaktifkan Cross-Origin Resource Sharing
const bodyParser = require('body-parser'); // Middleware untuk mem-parsing body permintaan
require('dotenv').config();         // Memuat variabel lingkungan dari file .env

// Mengimpor rute dan middleware kustom
const paymentRoutes = require('./src/routes/paymentRoutes'); // Rute untuk fungsionalitas pembayaran
const errorHandler = require('./src/middleware/errorHandler'); // Middleware untuk penanganan error global

// --- INISIALISASI APLIKASI ---

const app = express(); // Membuat instance aplikasi Express
const PORT = process.env.PORT || 3000; // Menentukan port server, default ke 3000 jika tidak ada di .env

// --- MIDDLEWARE ---

// Mengaktifkan CORS dengan konfigurasi dari variabel lingkungan
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','), // Mengizinkan permintaan dari origin yang ditentukan
  credentials: true // Mengizinkan pengiriman cookie
}));

// Middleware untuk mem-parsing body permintaan JSON dan URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware sederhana untuk mencatat (log) setiap permintaan yang masuk
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next(); // Lanjutkan ke middleware atau handler berikutnya
});

// --- RUTE (ROUTES) ---

// Rute utama (root) untuk memberikan informasi status API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fashion Store API is running',
    version: '1.0.0',
    endpoints: {
      createTransaction: 'POST /api/payment/create-transaction',
      notification: 'POST /api/payment/notification',
      checkStatus: 'GET /api/payment/status/:orderId',
      cancelTransaction: 'POST /api/payment/cancel/:orderId'
    }
  });
});

// Menggunakan rute pembayaran yang telah diimpor dengan prefix /api/payment
app.use('/api/payment', paymentRoutes);

// --- PENANGANAN ERROR ---

// Handler untuk rute yang tidak ditemukan (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Middleware penanganan error global. Akan menangkap semua error yang terjadi di aplikasi.
app.use(errorHandler);

// --- MEMULAI SERVER ---

// Menjalankan server pada port yang telah ditentukan
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`💳 Midtrans Mode: ${process.env.MIDTRANS_IS_PRODUCTION === 'true' ? 'Production' : 'Sandbox'}`);
  console.log('=================================');
});

// --- PENANGANAN PROMISE REJECTION ---

// Menangani promise rejection yang tidak tertangkap untuk mencegah crash
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1); // Keluar dari proses dengan status error
});