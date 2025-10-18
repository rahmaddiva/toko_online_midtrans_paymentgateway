# 👕 Fashion Store - E-Commerce with Midtrans Payment Gateway

Sistem toko fashion online sederhana dengan integrasi Midtrans Payment Gateway menggunakan Node.js, Express, dan Vanilla JavaScript.

![Fashion Store](https://img.shields.io/badge/Fashion-Store-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Midtrans](https://img.shields.io/badge/Payment-Midtrans-orange)

## ✨ Features

- 🛍️ Product catalog dengan gambar dan detail
- 🛒 Shopping cart dengan manajemen quantity
- 💳 Integrasi Midtrans Snap untuk berbagai metode pembayaran
- 📱 Responsive design untuk mobile & desktop
- 🎨 Modern UI dengan animasi smooth
- 🔔 Sweet notification menggunakan SweetAlert2
- 🔄 Real-time cart update
- 📊 Payment status tracking

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- SweetAlert2 untuk notifications
- Font Awesome icons
- Midtrans Snap.js

### Backend
- Node.js
- Express.js
- Midtrans Client SDK
- CORS
- dotenv

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- Node.js versi 14 atau lebih baru ([Download](https://nodejs.org/))
- npm (sudah include dengan Node.js)
- Akun Midtrans Sandbox ([Daftar gratis](https://dashboard.sandbox.midtrans.com/register))
- Text editor (VS Code recommended)
- Browser modern (Chrome, Firefox, Edge, Safari)

## 🚀 Installation & Setup

### 1. Clone atau Download Project

```bash
# Clone repository
git clone https://github.com/yourusername/fashion-store.git
cd fashion-store
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd fashion-store-backend

# Install dependencies
npm install

# Copy .env.example dan sesuaikan
cp .env.example .env
```

Edit file `.env`:
```env
PORT=3000
NODE_ENV=development

# Dapatkan dari https://dashboard.sandbox.midtrans.com/
MIDTRANS_SERVER_KEY=SB-Mid-server-YOUR_SERVER_KEY
MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_CLIENT_KEY
MIDTRANS_IS_PRODUCTION=false

CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500
```

### 3. Jalankan Backend

```bash
# Development mode (dengan auto-reload)
npm run dev

# atau Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

### 4. Setup Frontend

```bash
# Kembali ke root folder
cd ..
```

Edit `app.js`, pastikan API_URL sesuai:
```javascript
const API_URL = 'http://localhost:3000/api/payment';
```

Edit `index.html`, sesuaikan `data-client-key`:
```html
<script src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key="YOUR_CLIENT_KEY">
</script>
```

### 5. Jalankan Frontend

Buka `index.html` menggunakan:
- Live Server extension di VS Code
- Atau browser langsung: `file:///path/to/index.html`

## 📱 Usage

### Untuk Customer:

1. **Browse Products** - Lihat katalog produk fashion
2. **Add to Cart** - Klik tombol "Tambah" pada produk
3. **View Cart** - Klik icon cart di header
4. **Adjust Quantity** - Gunakan tombol +/- di cart
5. **Checkout** - Klik "Checkout" dan isi form
6. **Payment** - Pilih metode pembayaran di Midtrans
7. **Complete** - Selesaikan pembayaran

### Testing Payment (Sandbox):

#### Credit Card Test
- **Card Number:** 4811 1111 1111 1114
- **CVV:** 123
- **Exp Date:** 01/25
- **OTP:** 112233

#### Other Methods
Gunakan nomor virtual account atau instruksi yang muncul

## 📁 Project Structure

```
fashion-store/
├── fashion-store-backend/          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── midtrans.js        # Midtrans configuration
│   │   ├── controllers/
│   │   │   └── paymentController.js # Payment logic
│   │   ├── routes/
│   │   │   └── paymentRoutes.js   # API routes
│   │   └── middleware/
│   │       └── errorHandler.js    # Error handling
│   ├── .env                       # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Main server file
│
├── index.html                     # Main HTML
├── style.css                      # Styling
├── app.js                         # Frontend logic
└── README.md                      # Documentation
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3000/api/payment`
