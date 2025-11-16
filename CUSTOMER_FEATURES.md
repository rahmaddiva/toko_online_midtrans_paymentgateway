# Sistem Customer - My Casual

## 📋 Daftar Fitur Customer Yang Telah Ditambahkan

### 1. **Halaman Register (Customer)**

- **File**: `register.html`
- **Fitur**:
  - Form registrasi modern dengan gradient background
  - Field: Nama, Email, No. Telepon, Password, Konfirmasi Password
  - Password toggle untuk visibility
  - Validasi input real-time
  - Link redirect ke login setelah registrasi
  - Responsive design untuk mobile

### 2. **Profil Customer di Header**

- **Lokasi**: `index.html` (pojok kanan atas)
- **Fitur**:
  - Avatar dengan inisial/icon user
  - Dropdown menu yang berisi:
    - Nama dan email customer
    - Menu Profil
    - Menu Pesanan Saya
    - Menu Riwayat Pembelian
    - Tombol Logout
  - Hamburger-style dropdown yang responsive

### 3. **Halaman Profil Customer**

- **File**: `customer-profile.html`
- **Fitur**:
  - Tampilkan informasi pribadi customer
  - Edit profil (nama dan telepon)
  - Statistik pembelian:
    - Total pesanan
    - Pesanan pending
    - Pesanan selesai
    - Total belanja
  - Tombol untuk akses ke halaman pesanan dan riwayat
  - Tombol logout

### 4. **Halaman Pesanan Saya**

- **File**: `customer-orders.html`
- **Fitur**:
  - Tampilkan semua pesanan customer
  - Filter berdasarkan status (Semua, Pending, Selesai, Batal)
  - Card design untuk setiap pesanan dengan:
    - Order ID dan tanggal
    - Status badge
    - Detail item
    - Total pembayaran
    - Aksi: Detail, Bayar (jika pending), Batal (jika pending)
  - Responsive table untuk desktop

### 5. **Halaman Riwayat Pembelian**

- **File**: `customer-history.html`
- **Fitur**:
  - Tampilkan semua pesanan yang sudah selesai/dibayar
  - Search berdasarkan Order ID
  - Card design dengan:
    - Tanggal pembelian
    - Detail item dan harga
    - Summary pembayaran
    - Metode pembayaran (dari Midtrans)
  - Tombol "Lihat Invoice" untuk membuka struk pembelian
  - Sorting otomatis berdasarkan tanggal terbaru

### 6. **Proses Checkout Terintegrasi**

- **Update di**: `app.js`
- **Fitur**:
  - Validasi customer harus login sebelum checkout
  - Pre-fill form dengan data customer yang login
  - Tampilkan subtotal + diskon + total pembayaran
  - Integrasi dengan Midtrans payment gateway
  - Invoice/struk pemesanan otomatis setelah pembayaran
  - Order disimpan di database dengan userId

### 7. **Invoice/Struk Pemesanan**

- **Tampil saat**: Checkout sukses & di halaman riwayat pembelian
- **Isi**:
  - Order ID
  - Tanggal dan status
  - Data pembeli (nama, email, telepon)
  - Detail item (nama, qty, harga)
  - Subtotal, diskon, total
  - Metode pembayaran
  - Design professional berupa "receipt"

### 8. **Backend API Endpoints**

#### Orders

```
GET  /api/orders              - Get semua orders (admin) atau orders milik customer
GET  /api/orders/my-orders    - Get orders milik customer
GET  /api/orders/:orderId     - Get detail order (customer hanya bisa lihat milik sendiri)
DELETE /api/orders/:orderId   - Cancel order (hanya pending yang bisa dibatalkan)
```

#### Users (Admin)

```
GET    /api/users             - Get semua users (admin only)
GET    /api/users/:id         - Get detail user (admin only)
PUT    /api/users/:id         - Update user (admin only)
DELETE /api/users/:id         - Delete user (admin only, tidak bisa hapus last admin)
```

---

## 🔄 Alur Registrasi & Login Customer

### 1. **Registrasi**

```
Customer → register.html → API POST /api/auth/register
→ Save ke DB → Simpan token & user data ke localStorage
→ Auto redirect ke index.html
```

### 2. **Login**

```
Customer → login.html → API POST /api/auth/login
→ Simpan token & user data ke localStorage
→ Redirect ke index.html jika customer, /admin-dashboard.html jika admin
```

### 3. **Dari Login ke Shopping**

```
index.html → App checks localStorage
→ Tampilkan profile dropdown (jika sudah login)
→ Simpan produk ke cart
→ Checkout → Midtrans payment
→ Create order di DB → Invoice → Success
```

---

## 🛒 Alur Pemesanan

### 1. **Customer Browsing Produk**

- Lihat daftar produk di `index.html`
- Produk dimuat dari API: `GET /api/products`
- Setiap produk punya tombol "Tambah" dan "Detail"

### 2. **Tambah ke Keranjang**

- Click tombol "Tambah" → Product added to cart (localStorage)
- Cart badge di header di-update
- Bisa lihat cart di sidebar drawer

### 3. **Checkout**

- Click tombol "Checkout"
- Sistem cek: Customer harus login
- Form pre-filled dengan data customer
- Display total + diskon
- Click "Lanjut Pembayaran"

### 4. **Pembayaran Midtrans**

- Snap token dihasilkan dari backend
- Popup Midtrans terbuka
- Customer pilih metode pembayaran
- Bayar

### 5. **After Payment**

- Success → Order di-create di DB
- Invoice/Struk ditampilkan
- Customer bisa lihat order di "Pesanan Saya"
- Admin bisa lihat order di admin dashboard

---

## 📊 Order Status Flow

```
pending (menunggu pembayaran)
    ↓
settlement / capture (pembayaran berhasil)
    atau
cancel (customer batal, hanya saat pending)
    atau
expire / deny (pembayaran gagal/kadaluarsa)
```

Customer hanya bisa cancel order yang statusnya "pending".

---

## 🔐 Security & Access Control

### Frontend Protection

- `login.html` → Cek token, auto-redirect jika sudah login
- `customer-profile.html` → Cek token & role, redirect ke login jika tidak ada
- `customer-orders.html` → Cek token & role, redirect ke login jika tidak ada
- `customer-history.html` → Cek token & role, redirect ke login jika tidak ada
- `index.html` → Show profile dropdown hanya jika logged in customer

### Backend Protection

- `protect` middleware → Validasi token JWT
- `authorize("customer")` → Validasi role customer
- Order owner check → Customer hanya bisa lihat/cancel order mereka sendiri
- Coupon validation → Double-check di backend

---

## 💾 Data Storage

### localStorage

```javascript
{
  token: "jwt_token_here",
  user: {
    id: 1,
    name: "Customer Name",
    email: "customer@email.com",
    phone: "081234567890",
    role: "customer"
  }
}
```

### Database (Order Model)

```javascript
{
  id: 1,
  orderId: "ORDER-1234567890-123",
  userId: 1,  // Link to customer
  items: [...],
  subtotal: 500000,
  discount: 50000,
  total: 450000,
  couponCode: "HEMAT10",
  status: "pending|settlement|cancel|expire",
  paymentType: "credit_card|bank_transfer|etc",
  customerName: "Customer Name",
  customerEmail: "customer@email.com",
  customerPhone: "081234567890",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🎯 Testing Checklist

### Customer Registration

- [ ] Buka `register.html`
- [ ] Isi form (nama, email, phone, password)
- [ ] Password toggle works
- [ ] Validasi password match
- [ ] Submit → Auto login & redirect ke index.html

### Customer Login

- [ ] Buka `login.html`
- [ ] Test login dengan customer akun
- [ ] Auto redirect ke index.html
- [ ] Profile dropdown muncul di header

### Profile Management

- [ ] Click profile dropdown → pilih "Profil"
- [ ] Lihat data pribadi
- [ ] Click "Edit Profil" → ubah nama/phone
- [ ] Statistik pembelian terupdate

### Pemesanan

- [ ] Browse produk di index.html
- [ ] Tambah produk ke cart
- [ ] Open cart drawer
- [ ] Verify cart items
- [ ] Click checkout
- [ ] Confirm order detail
- [ ] Go through Midtrans payment (gunakan test credentials)
- [ ] After payment → invoice muncul
- [ ] Check "Pesanan Saya" untuk lihat order baru

### Riwayat Pembelian

- [ ] Click "Riwayat Pembelian" di menu
- [ ] Lihat semua orders yang sudah dibayar
- [ ] Search order by ID
- [ ] Click "Lihat Invoice" untuk lihat struk

### Admin Dashboard

- [ ] Login dengan admin akun
- [ ] View customer orders di "Orders" section
- [ ] Lihat status order dari customer
- [ ] View customer list di "Users" section

---

## 🚀 Deployment Notes

Sebelum deploy ke production:

1. **Environment Variables** (update di `.env`)

   - `NODE_ENV=production`
   - `MIDTRANS_IS_PRODUCTION=true` (untuk production gateway)
   - Update URLs ke domain production

2. **Midtrans Configuration**

   - Update Snap client key di HTML
   - Update server key di backend .env
   - Test dengan test credentials dulu

3. **CORS Settings**

   - Update allowed origins ke domain production
   - Di `server.js`: tambah production domain ke CORS whitelist

4. **SSL/HTTPS**

   - Pastikan HTTPS di production
   - Update all HTTP URLs ke HTTPS

5. **Database**
   - Run migrations
   - Seed initial data jika diperlukan

---

## 📝 Catatan Penting

1. **Password Hashing**: Password di-hash otomatis di model User (bcrypt)
2. **Token Expiry**: Token berlaku 7 hari
3. **Coupon Codes**: HEMAT10, DISKON25K, MYCASUAL (hardcoded di paymentController)
4. **Midtrans Test Mode**: Gunakan test credentials saat development
5. **Cart Persistence**: Cart disimpan di localStorage (bukan DB)

---

## 🎨 UI/UX Features

- **Gradient Colors**: #6366f1 (Indigo) → #10b981 (Teal) - consistent across all pages
- **Responsive**: Mobile, Tablet, Desktop
- **Animations**: Smooth transitions, hover effects
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Notifications**: SweetAlert2 untuk feedback user

---

## 📞 Support & Debugging

Jika ada error:

1. **Check browser console** untuk error messages
2. **Check Network tab** untuk API calls
3. **Check backend logs** untuk server errors
4. **Verify token** di localStorage
5. **Verify API endpoints** sudah running

---

Semua fitur customer sudah siap! Silakan test end-to-end flow. 🎉
