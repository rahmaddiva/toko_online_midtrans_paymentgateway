# 👕 Fashion Store - E-Commerce with Midtrans Payment Gateway

Sistem toko fashion online sederhana dengan integrasi Midtrans Payment Gateway menggunakan Node.js, Express, dan Vanilla JavaScript.

![Fashion Store](https://img.shields.io/badge/Fashion-Store-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Midtrans](https://img.shields.io/badge/Payment-Midtrans-orange)

## ✨ Features

### 🛍️ Produk & Katalog

- Product catalog dengan gambar dan detail lengkap
- Filter dan search produk
- Kategori produk terorganisir

### 🛒 Shopping Cart & Checkout

- Shopping cart dengan manajemen quantity
- Real-time cart update
- Diskon kupon otomatis
- Form checkout dengan validasi

### 👤 Customer System

- Registrasi customer dengan name, email, phone
- Login/logout authentication
- Customer profile management
- Pesanan Saya (My Orders) dengan status tracking
- Riwayat Pembelian (Purchase History)
- Profile dropdown di header

### 💳 Payment Integration

- Integrasi Midtrans Snap untuk berbagai metode pembayaran
- Multiple payment methods (Credit Card, Bank Transfer, E-wallet)
- Order status tracking (pending → settlement → selesai)
- Bayar pesanan pending di halaman "Pesanan Saya"
- Invoice/Receipt generation
- Automatic status update setelah pembayaran sukses

### 📱 User Interface

- Responsive design untuk mobile & desktop
- Modern UI dengan animasi smooth
- Sweet notification menggunakan SweetAlert2
- Font Awesome icons
- Header dengan profile dropdown
- Hamburger menu untuk mobile

### 🔔 Additional Features

- Automatic order refresh setelah payment
- Cancel pending orders (dan hapus dari database)
- Payment retry untuk pending orders
- Error handling & user feedback
- JWT authentication
- CORS protection

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
- MySQL atau SQLite untuk database
- Akun Midtrans Sandbox ([Daftar gratis](https://dashboard.sandbox.midtrans.com/register))
- Text editor (VS Code recommended)
- Browser modern (Chrome, Firefox, Edge, Safari)
- Git (untuk version control)

## 🚀 Installation & Setup

### 1. Clone atau Download Project

```bash
# Clone repository
git clone https://github.com/yourusername/fashion-store.git
cd fashion-store
```

### 2. Setup Backend

```bash
# Masuk ke folder project
cd toko_online_midtrans_paymentgateway

# Install dependencies
npm install

# Copy .env.example dan sesuaikan
cp .env.example .env
```

Edit file `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Dapatkan dari https://dashboard.sandbox.midtrans.com/
MIDTRANS_SERVER_KEY=SB-Mid-server-YOUR_SERVER_KEY
MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_CLIENT_KEY
MIDTRANS_IS_PRODUCTION=false

# CORS Configuration
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500

# Database MySQL atau SQLite
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mycasual_db
DB_DIALECT=mysql

# JWT Authentication
JWT_SECRET=my_super_secret_key_2024
JWT_EXPIRE=7d
```

### 3. Jalankan Backend

```bash
# Development mode (dengan auto-reload menggunakan nodemon)
npm run dev

# atau Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

### 4. Setup Frontend

Edit `app.js`, pastikan API URLs sesuai:

```javascript
const API_BASE_URL = "http://localhost:3000";
const API_URL = "http://localhost:3000/api/payment";
```

Edit `index.html`, sesuaikan `data-client-key`:

```html
<script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="YOUR_MIDTRANS_CLIENT_KEY"
></script>
```

### 5. Jalankan Frontend

Buka `index.html` menggunakan:

- Live Server extension di VS Code (Recommended)
- Local server: `python -m http.server 5500`
- atau buka langsung di browser: `file:///path/to/index.html`

## 📱 Usage

### Untuk Pengunjung (Belum Login):

1. **Browse Products** - Lihat katalog produk fashion
2. **Add to Cart** - Klik tombol "Tambah" pada produk
3. **View Cart** - Klik icon cart di header
4. **Checkout** - Anda akan diarahkan ke halaman login

### Untuk Customer (Sudah Login):

#### Registrasi

1. Klik link "Daftar" di halaman login
2. Isi form: Name, Email, Phone, Password
3. Klik tombol "Daftar"
4. Anda akan otomatis login

#### Berbelanja & Checkout

1. **Browse Products** - Lihat katalog produk fashion
2. **Add to Cart** - Klik tombol "Tambah" pada produk
3. **View Cart** - Klik icon cart di header
4. **Adjust Quantity** - Gunakan tombol +/- di cart
5. **Apply Coupon** - Masukkan kode kupon (opsional)
6. **Checkout** - Isi form checkout dan klik "Lanjut Pembayaran"
7. **Payment** - Pilih metode pembayaran di Midtrans Snap

#### Manage Orders

1. **View Orders** - Klik "Pesanan Saya" di header/menu
2. **Check Status** - Lihat status pesanan (Pending, Selesai, Batal)
3. **Filter Orders** - Filter berdasarkan status
4. **Pay Pending Order** - Klik tombol "Bayar" untuk pesanan pending
5. **Cancel Order** - Klik tombol "Batal" untuk pesanan pending
6. **View History** - Klik "Riwayat Pembelian" untuk melihat semua order

#### Profile Management

1. **View Profile** - Klik profile dropdown di header
2. **Edit Profile** - Lihat dan update informasi customer
3. **Logout** - Klik tombol logout

### Testing Payment (Sandbox):

#### Test Card

- **Card Number:** 4811 1111 1111 1114
- **CVV:** 123
- **Exp Date:** 01/25 (atau lebih baru)
- **OTP:** 112233

#### Test Coupons

- **HEMAT10** - Diskon 10%
- **DISKON25K** - Diskon Rp 25.000
- **MYCASUAL** - Diskon 15%

#### Payment Flow

1. Checkout with items
2. Masuk ke Midtrans Snap
3. Pilih metode pembayaran
4. Selesaikan pembayaran
5. Status otomatis update ke "Selesai"
6. Order muncul di "Pesanan Saya" dan "Riwayat Pembelian"

## 📁 Project Structure

```
toko_online_midtrans_paymentgateway/
├── src/
│   ├── config/
│   │   ├── database.js            # Database configuration
│   │   └── midtrans.js            # Midtrans setup
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── orderController.js     # Order management
│   │   ├── paymentController.js   # Payment processing
│   │   ├── productController.js   # Product management
│   │   └── userController.js      # User management
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   └── errorHandler.js        # Error handling
│   ├── models/
│   │   ├── User.js                # User model
│   │   ├── Product.js             # Product model
│   │   ├── Order.js               # Order model
│   │   └── index.js               # Model exports
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── orderRoutes.js         # Order endpoints
│   │   ├── paymentRoutes.js       # Payment endpoints
│   │   ├── productRoutes.js       # Product endpoints
│   │   └── userRoutes.js          # User endpoints
│   └── utils/
│       └── seedData.js            # Sample data
├── .env                           # Environment variables
├── .gitignore
├── package.json
├── server.js                      # Main server file
│
├── index.html                     # Home page
├── login.html                     # Login page
├── register.html                  # Registration page
├── customer-profile.html          # Customer profile page
├── customer-orders.html           # Customer orders page
├── customer-history.html          # Purchase history page
├── style.css                      # Main styling
├── app.js                         # Frontend logic
├── history.js                     # History page logic
│
└── img/                           # Product images
    └── *.jpg
```

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register          - Register new customer
POST   /api/auth/login             - Login customer
```

### Product Endpoints

```
GET    /api/products               - Get all products
GET    /api/products/:id           - Get single product
```

### Order Endpoints

```
GET    /api/orders                 - Get customer orders (Protected)
GET    /api/orders/history/:userId - Get order history (Protected)
POST   /api/orders                 - Create new order (Protected)
DELETE /api/orders/:orderId        - Cancel/delete order (Protected)
```

### Payment Endpoints

```
POST   /api/payment/create-transaction        - Create Midtrans transaction (Protected)
POST   /api/payment/notification               - Midtrans webhook
GET    /api/payment/status/:orderId            - Check payment status
PUT    /api/payment/status/:orderId            - Update order status (Protected)
POST   /api/payment/cancel/:orderId            - Cancel payment
POST   /api/payment/validate-coupon           - Validate coupon code
```

### User Endpoints

```
GET    /api/users/profile          - Get user profile (Protected)
PUT    /api/users/profile          - Update user profile (Protected)
```

## 🔐 Authentication

Project menggunakan JWT (JSON Web Token) untuk authentication:

- Token disimpan di `localStorage` setelah login
- Token dikirim di header: `Authorization: Bearer {token}`
- Token expire: 7 hari
- Middleware `protect` mengecek token pada protected routes

## 🎯 Order Status Flow

```
pending (Menunggu Pembayaran)
   ↓
   ├─ Customer bayar → settlement (Dibayar)
   │  ↓
   │  └─ Selesai ✓
   │
   └─ Customer batal → cancel (Dibatalkan)
```

## 💡 Features in Detail

### 1. Customer Registration & Profile

- Registrasi dengan email, nama, dan nomor telepon
- JWT token authentication (7 hari)
- Profile dropdown di header
- Manage profile information

### 2. Shopping & Cart Management

- Add/remove products dari cart
- Adjust quantity untuk setiap item
- Real-time total calculation
- Coupon code validation
- Cart persisted di localStorage

### 3. Payment Integration

- Midtrans Snap integration
- Multiple payment methods
- Automatic order creation
- Order ID auto-generation
- Duplicate order handling
- Status update after payment

### 4. Order Management

- View all orders (Pesanan Saya)
- Filter by status
- Pay pending orders
- Cancel pending orders (hapus dari database)
- View order details
- Purchase history (Riwayat Pembelian)

### 5. Error Handling

- Input validation
- API error responses
- Sweet alerts for notifications
- Unauthorized request handling
- Database error management

## 🐛 Troubleshooting

### Error: "Unauthorized"

- Pastikan token sudah tersimpan di localStorage
- Check apakah token sudah expire (7 hari)
- Re-login dengan akun customer

### Error: "Order ID is required"

- Pastikan orderId di-generate di frontend
- Check network tab untuk melihat request data

### Error: "order_id has already been taken"

- Order ID sudah terpakai
- Sistem akan retry dengan order yang sama
- Gunakan tombol "Bayar" untuk retry pembayaran

### Error: Missing CORS headers

- Check `.env` CORS_ORIGIN configuration
- Frontend URL harus sesuai dengan CORS_ORIGIN

### Database Connection Error

- Check `.env` database configuration
- Pastikan MySQL server running
- Verify database credentials

## 📚 Resources

- [Midtrans Documentation](https://docs.midtrans.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)

## 📝 License

MIT License - feel free to use this project

## 👨‍💻 Author

**Toko Online Midtrans Payment Gateway - Rahmad Diva** - Open Source E-Commerce Solution

---

**Terakhir diupdate:** 25 Januari 2025
