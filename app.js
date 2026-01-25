// --- KONFIGURASI DAN DATA ---

// Data Produk - akan diisi dari API
let PRODUCTS = [];

// Konfigurasi URL API backend untuk pembayaran
const API_URL = "http://localhost:3000/api/payment";
const API_BASE_URL = "http://localhost:3000";

// --- FUNGSI BANTU ---

// Fungsi untuk memformat angka menjadi format mata uang Rupiah (IDR)
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
// Fungsi shortcut untuk memilih elemen DOM menggunakan selector CSS
const $ = (sel) => document.querySelector(sel);

// Fungsi untuk load produk dari API
async function loadProductsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    const result = await response.json();

    if (result.success) {
      PRODUCTS = result.data;
      console.log(
        "Produk berhasil dimuat dari API:",
        PRODUCTS.length,
        "produk"
      );
    } else {
      console.warn(
        "Gagal load produk dari API, gunakan data default atau ulangi"
      );
    }
  } catch (error) {
    console.error("Error loading products from API:", error);
    console.warn("Menggunakan data produk default atau ulangi load");
  }
}

// --- ELEMEN DOM ---

// Memilih elemen-elemen DOM yang akan dimanipulasi
const productGrid = $("#productGrid"); // Grid untuk menampilkan produk
const cartDrawer = $("#cartDrawer"); // Panel samping keranjang belanja
const backdrop = $("#backdrop"); // Latar belakang gelap saat keranjang terbuka
const cartCount = $("#cartCount"); // Badge jumlah item di ikon keranjang
const cartItems = $("#cartItems"); // Kontainer untuk daftar item di keranjang
const cartSubtotal = $("#cartSubtotal"); // Elemen untuk subtotal
const cartDiscount = $("#cartDiscount"); // Elemen untuk diskon
const discountRow = $("#discountRow"); // Baris diskon
const cartTotal = $("#cartTotal"); // Elemen untuk total akhir
const couponInfo = $("#couponInfo"); // Info pesan kupon

// --- MANAJEMEN STATE KERANJANG ---

// Variabel untuk menyimpan data keranjang belanja di memori
// (localStorage tidak didukung di lingkungan ini, jadi menggunakan variabel biasa)
let cartData = [];
let appliedCoupon = null; // State untuk kupon yang diterapkan

// --- FUNGSI-FUNGSI UTAMA ---

/**
 * Merender (menampilkan) semua produk ke dalam grid di halaman.
 */
function renderProducts() {
  // Mengisi grid produk dengan HTML yang digenerate dari data `PRODUCTS`
  productGrid.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="meta">
        <h4 class="title">${p.name}</h4>
        <p class="small">${p.category}</p>
        <div class="price">${fmt(p.price)}</div>
        <div class="actions">
          <button class="add" data-id="${p.id}">
            <i class="fas fa-cart-plus"></i> Tambah
          </button>
          <button class="detail" data-id="${p.id}">
            <i class="fas fa-info-circle"></i>
          </button>
        </div>
      </div>
    </article>
  `
  ).join("");

  // Menambahkan event listener untuk setiap tombol "Tambah"
  productGrid
    .querySelectorAll(".add")
    .forEach((btn) => btn.addEventListener("click", onAdd));
  // Menambahkan event listener untuk setiap tombol "Detail"
  productGrid
    .querySelectorAll(".detail")
    .forEach((btn) => btn.addEventListener("click", onDetail));
}

/**
 * Membaca data keranjang dari variabel `cartData`.
 * @returns {Array} Array item di keranjang.
 */
function readCart() {
  return cartData;
}

/**
 * Menyimpan data keranjang ke variabel `cartData` dan memperbarui badge.
 * @param {Array} items - Array item keranjang yang baru.
 */
function saveCart(items) {
  cartData = items;
  if (items.length === 0) appliedCoupon = null; // Reset kupon jika keranjang kosong
  updateBadge(); // Memperbarui tampilan jumlah item di ikon keranjang
}

/**
 * Menambahkan produk ke keranjang atau menambah jumlahnya jika sudah ada.
 * @param {number} id - ID produk yang akan ditambahkan.
 */
function addToCart(id) {
  const items = readCart();
  const idx = items.findIndex((it) => it.id === id);

  if (idx > -1) {
    // Jika produk sudah ada, tambah kuantitasnya
    items[idx].qty += 1;
  } else {
    // Jika produk belum ada, tambahkan sebagai item baru
    const p = PRODUCTS.find((x) => x.id === id);
    items.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
  }

  saveCart(items);
  renderCart(); // Perbarui tampilan keranjang

  // Menampilkan notifikasi sukses menggunakan SweetAlert
  const product = PRODUCTS.find((p) => p.id === id);
  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: `${product.name} ditambahkan ke keranjang`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}

/**
 * Menghapus item dari keranjang setelah konfirmasi.
 * @param {number} id - ID produk yang akan dihapus.
 */
function removeFromCart(id) {
  const item = readCart().find((it) => it.id === id);

  // Menampilkan dialog konfirmasi penghapusan
  Swal.fire({
    title: "Hapus item?",
    text: `Hapus ${item.name} dari keranjang?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika dikonfirmasi, filter item dan simpan keranjang baru
      let items = readCart().filter((it) => it.id !== id);
      saveCart(items);
      renderCart(); // Perbarui tampilan keranjang

      // Notifikasi sukses penghapusan
      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Item berhasil dihapus dari keranjang",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

/**
 * Mengatur kuantitas item di keranjang. Jika kuantitas < 1, item akan dihapus.
 * @param {number} id - ID produk.
 * @param {number} qty - Kuantitas baru.
 */
function setQty(id, qty) {
  if (qty < 1) {
    // Jika kuantitas kurang dari 1, hapus item
    removeFromCart(id);
    return;
  }

  // Update kuantitas item yang sesuai
  let items = readCart().map((it) => (it.id === id ? { ...it, qty: qty } : it));
  saveCart(items);
  renderCart(); // Perbarui tampilan keranjang
}

/**
 * Mengosongkan semua item dari keranjang setelah konfirmasi.
 */
function clearCart() {
  const items = readCart();

  if (items.length === 0) {
    // Jika keranjang sudah kosong, tampilkan notifikasi
    Swal.fire({
      icon: "info",
      title: "Keranjang Sudah Kosong",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }

  // Dialog konfirmasi untuk mengosongkan keranjang
  Swal.fire({
    title: "Kosongkan Keranjang?",
    text: "Semua item akan dihapus dari keranjang",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, kosongkan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      saveCart([]); // Kosongkan data keranjang
      renderCart(); // Perbarui tampilan keranjang

      // Notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Keranjang Dikosongkan",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

/**
 * Memvalidasi dan menerapkan kode kupon.
 */
async function applyCoupon() {
  const couponCodeInput = $("#couponCode");
  const code = couponCodeInput.value.trim().toUpperCase();
  if (!code) {
    couponInfo.textContent = "Silakan masukkan kode kupon.";
    couponInfo.className = "coupon-info error";
    return;
  }

  const subtotal = readCart().reduce((sum, it) => sum + it.price * it.qty, 0);
  if (subtotal === 0) {
    couponInfo.textContent = "Keranjang Anda kosong.";
    couponInfo.className = "coupon-info error";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/validate-coupon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode: code, total: subtotal }),
    });

    const result = await response.json();

    if (result.success) {
      appliedCoupon = {
        code: code,
        discount: result.data.discount,
      };
      couponInfo.textContent = result.message;
      couponInfo.className = "coupon-info success";
      couponCodeInput.value = ""; // Kosongkan input
    } else {
      appliedCoupon = null;
      couponInfo.textContent = result.message;
      couponInfo.className = "coupon-info error";
    }
  } catch (error) {
    appliedCoupon = null;
    couponInfo.textContent = "Gagal terhubung ke server.";
    couponInfo.className = "coupon-info error";
    console.error("Error validating coupon:", error);
  } finally {
    renderCart(); // Render ulang keranjang untuk menampilkan diskon
  }
}

/**
 * Mengambil Snap Token dari backend untuk memulai transaksi Midtrans.
 * @param {object} transactionData - Data transaksi (total, item, pelanggan).
 * @returns {Promise<string>} Snap Token dari Midtrans.
 */
async function getSnapToken(transactionData) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    const response = await fetch(`${API_URL}/create-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Gagal membuat transaksi");
    }

    return result.data.token;
  } catch (error) {
    console.error("Error saat mengambil snap token:", error);
    throw error;
  }
}

/**
 * Memperbarui badge yang menunjukkan jumlah total item di keranjang.
 */
function updateBadge() {
  const totalQty = readCart().reduce((a, b) => a + b.qty, 0);
  cartCount.textContent = totalQty;
}

/**
 * Merender (menampilkan) item-item di dalam panel keranjang.
 */
function renderCart() {
  const items = readCart();

  if (items.length === 0) {
    // Jika keranjang kosong, tampilkan pesan
    cartItems.innerHTML =
      '<p style="text-align:center;color:var(--text-light);padding:2rem;">Keranjang kosong</p>';
    cartSubtotal.textContent = fmt(0);
    cartTotal.textContent = fmt(0);
    discountRow.style.display = "none";
    couponInfo.innerHTML = "";
    updateBadge();
    return;
  }

  // Generate HTML untuk setiap item di keranjang
  cartItems.innerHTML = items
    .map(
      (it) => `
    <div class="cart-item">
      <img src="${it.img}" alt="${it.name}">
      <div class="cart-item-info">
        <h5>${it.name}</h5>
        <div class="price">${fmt(it.price)}</div>
      </div>
      <div class="qty">
        <button onclick="decrease(${it.id})">
          <i class="fas fa-minus"></i>
        </button>
        <span>${it.qty}</span>
        <button onclick="increase(${it.id})">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  // Hitung dan tampilkan subtotal, diskon, dan total
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  let finalTotal = subtotal;

  cartSubtotal.textContent = fmt(subtotal);

  if (appliedCoupon && subtotal > 0) {
    finalTotal = Math.max(0, subtotal - appliedCoupon.discount);
    cartDiscount.textContent = `-${fmt(appliedCoupon.discount)}`;
    discountRow.style.display = "flex";
  } else {
    discountRow.style.display = "none";
  }

  cartTotal.textContent = fmt(finalTotal);
  updateBadge(); // Perbarui badge
}

// --- EVENT HANDLERS ---

/**
 * Handler untuk event klik pada tombol "Tambah ke Keranjang".
 * @param {Event} e - Objek event.
 */
function onAdd(e) {
  const id = Number(e.currentTarget.dataset.id);
  addToCart(id);
  openCart(); // Buka panel keranjang setelah menambahkan item
}

/**
 * Handler untuk event klik pada tombol "Detail". Menampilkan modal dengan info produk.
 * @param {Event} e - Objek event.
 */
function onDetail(e) {
  const id = Number(e.currentTarget.dataset.id);
  const product = PRODUCTS.find((p) => p.id === id);

  // Tampilkan modal detail produk menggunakan SweetAlert
  Swal.fire({
    title: product.name,
    html: `
      <img src="${
        product.img
      }" style="width:100%;border-radius:12px;margin-bottom:1rem;" alt="${
      product.name
    }">
      <p style="font-size:1.5rem;color:#10b981;font-weight:700;margin:1rem 0;">${fmt(
        product.price
      )}</p>
      <p style="color:#6b7280;">Kategori: ${product.category}</p>
      <p style="margin-top:1rem;color:#4b5563;">Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.</p>
    `,
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-cart-plus"></i> Tambah ke Keranjang',
    cancelButtonText: "Tutup",
    confirmButtonColor: "#6366f1",
    cancelButtonColor: "#6b7280",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika tombol "Tambah" di modal diklik
      addToCart(id);
      openCart();
    }
  });
}

// --- AKSI KERANJANG (UI) ---

/**
 * Membuka panel samping keranjang belanja.
 */
function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.style.overflow = "hidden"; // Mencegah scroll halaman utama
}

/**
 * Menutup panel samping keranjang belanja.
 */
function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.style.overflow = ""; // Mengizinkan scroll kembali
}

// --- PROSES CHECKOUT ---

/**
 * Menangani seluruh proses checkout, mulai dari pengumpulan data pelanggan hingga pembayaran via Midtrans.
 */
async function checkout() {
  const items = readCart();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Validasi customer login
  if (!token || !user.id) {
    Swal.fire({
      icon: "warning",
      title: "Harus Login",
      text: "Silakan login terlebih dahulu untuk melakukan pemesanan",
      confirmButtonColor: "#6366f1",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login.html";
      }
    });
    return;
  }

  if (items.length === 0) {
    // Jika keranjang kosong, tampilkan peringatan
    Swal.fire({
      icon: "warning",
      title: "Keranjang Kosong",
      text: "Silakan tambahkan produk terlebih dahulu",
      confirmButtonColor: "#6366f1",
    });
    return;
  }

  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const finalTotal = appliedCoupon
    ? Math.max(0, subtotal - appliedCoupon.discount)
    : subtotal;

  // Pre-fill form dengan data customer yang login
  const defaultName = user.name || "";
  const defaultEmail = user.email || "";
  const defaultPhone = user.phone || "";

  // Menampilkan modal untuk konfirmasi pembayaran
  const { value: formValues } = await Swal.fire({
    title: "Konfirmasi Pembayaran",
    html: `
      <div style="text-align:left;margin:1rem 0;">
        <p style="margin:0.5rem 0;"><strong>Total Item:</strong> ${itemCount} pcs</p>
        <p style="margin:0.5rem 0;"><strong>Subtotal:</strong> ${fmt(
          subtotal
        )}</p>
        ${
          appliedCoupon
            ? `<p style="margin:0.5rem 0;color:#10b981;"><strong>Diskon:</strong> -${fmt(
                appliedCoupon.discount
              )}</p>`
            : ""
        }
        <p style="margin:0.5rem 0;border-top:1px solid #e5e7eb;padding-top:0.5rem;"><strong>Total Pembayaran:</strong> ${fmt(
          finalTotal
        )}</p>
      </div>
      <div style="margin-top:1.5rem;">
        <input id="name" class="swal2-input" placeholder="Nama Lengkap" value="${defaultName}" required>
        <input id="email" class="swal2-input" placeholder="Email" type="email" value="${defaultEmail}" required>
        <input id="phone" class="swal2-input" placeholder="No. Telepon" value="${defaultPhone}" required>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: '<i class="fas fa-credit-card"></i> Lanjut Pembayaran',
    cancelButtonText: "Batal",
    preConfirm: () => {
      // Validasi input sebelum konfirmasi
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;

      if (!name || !email || !phone) {
        Swal.showValidationMessage("Semua field harus diisi!");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.showValidationMessage("Format email tidak valid!");
        return false;
      }

      return { name, email, phone };
    },
  });

  if (!formValues) return; // Jika pengguna membatalkan, hentikan proses

  try {
    // Tampilkan loading indicator
    Swal.fire({
      title: "Memproses Pembayaran...",
      html: "Mohon tunggu, sedang menghubungkan ke payment gateway",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Generate Order ID unik
    const generateOrderId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `ORDER-${timestamp}-${random}`;
    };

    // Siapkan data transaksi untuk dikirim ke backend
    const transactionData = {
      orderId: generateOrderId(), // Generate order ID unik untuk setiap transaksi
      amount: subtotal, // Kirim subtotal, biarkan backend menghitung diskon
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
      })),
      customer: {
        first_name: formValues.name.split(" ")[0],
        last_name:
          formValues.name.split(" ").slice(1).join(" ") ||
          formValues.name.split(" ")[0],
        email: formValues.email,
        phone: formValues.phone,
      },
      couponCode: appliedCoupon ? appliedCoupon.code : null,
    };

    // Ambil Snap Token dari backend
    const snapToken = await getSnapToken(transactionData);

    Swal.close(); // Tutup loading indicator

    // Buka halaman pembayaran Midtrans Snap
    window.snap.pay(snapToken, {
      onSuccess: async function (result) {
        // Callback saat pembayaran sukses
        console.log("Pembayaran sukses:", result);

        // Update order status di backend
        try {
          const token = localStorage.getItem("token");
          await fetch(`${API_BASE_URL}/api/payment/status/${result.order_id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "settlement",
              paymentType: result.payment_type,
            }),
          });
        } catch (error) {
          console.error("Error updating order status:", error);
        }

        saveTransactionToHistory(result, finalTotal, items, appliedCoupon);
        showInvoice(result, finalTotal, items, formValues, appliedCoupon);
        saveCart([]); // Kosongkan keranjang
        renderCart();
        closeCart();
      },
      onPending: function (result) {
        // Callback saat pembayaran tertunda
        console.log("Pembayaran tertunda:", result);
        saveTransactionToHistory(result, finalTotal, items, appliedCoupon);
        closeCart();
        Swal.fire({
          icon: "info",
          title: "Pembayaran Tertunda",
          html: `
            <p>Menunggu konfirmasi pembayaran</p>
            <p style="color:#6b7280;font-size:0.9rem;margin-top:1rem;">Order ID: ${result.order_id}</p>
            <p style="color:#6b7280;font-size:0.9rem;">Silakan selesaikan pembayaran Anda</p>
          `,
          confirmButtonColor: "#6366f1",
          confirmButtonText: "OK",
        });
      },
      onError: function (result) {
        // Callback saat terjadi error pembayaran
        console.error("Error pembayaran:", result);
        Swal.fire({
          icon: "error",
          title: "Pembayaran Gagal",
          html: `
            <p>Terjadi kesalahan saat memproses pembayaran</p>
            <p style="color:#6b7280;font-size:0.9rem;margin-top:1rem;">Silakan coba lagi</p>
          `,
          confirmButtonColor: "#ef4444",
          confirmButtonText: "OK",
        });
      },
      onClose: function () {
        // Callback saat popup pembayaran ditutup
        console.log("Popup pembayaran ditutup");
      },
    });
  } catch (error) {
    // Tangani error jika gagal menghubungi backend
    console.error("Error checkout:", error);
    Swal.fire({
      icon: "error",
      title: "Terjadi Kesalahan",
      text:
        error.message ||
        "Tidak dapat menghubungkan ke server. Pastikan backend sudah berjalan.",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "OK",
    });
  }
}

/**
 * Helper function untuk mengubah transaction status menjadi label yang readable
 */
function getStatusLabel(transactionStatus) {
  const statusMap = {
    settlement: "Selesai",
    capture: "Selesai",
    pending: "Pending",
    cancel: "Dibatalkan",
    expire: "Kadaluarsa",
    deny: "Ditolak",
  };
  return statusMap[transactionStatus] || transactionStatus.toUpperCase();
}

/**
 * Menampilkan invoice pemesanan
 */
function showInvoice(result, total, items, customer, coupon) {
  const invoiceHTML = `
    <div style="text-align: left; font-family: monospace; background: #f9fafb; padding: 2rem; border-radius: 8px; max-width: 400px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #6366f1; padding-bottom: 1rem;">
        <h3 style="margin: 0; color: #1f2937;">INVOICE</h3>
        <p style="margin: 0.5rem 0 0 0; color: #6b7280; font-size: 0.9rem;">My Casual Store</p>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <p style="margin: 0.3rem 0;"><strong>Order ID:</strong> ${
          result.order_id
        }</p>
        <p style="margin: 0.3rem 0;"><strong>Tanggal:</strong> ${new Date().toLocaleString(
          "id-ID"
        )}</p>
      </div>

      <div style="margin-bottom: 1.5rem; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 1rem 0;">
        <p style="margin: 0.3rem 0;"><strong>Nama:</strong> ${customer.name}</p>
        <p style="margin: 0.3rem 0;"><strong>Email:</strong> ${
          customer.email
        }</p>
        <p style="margin: 0.3rem 0;"><strong>Telepon:</strong> ${
          customer.phone
        }</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <p style="margin: 0.5rem 0; font-weight: bold; border-bottom: 1px solid #d1d5db;">DETAIL PEMBELIAN</p>
        ${items
          .map(
            (item) => `
          <div style="display: flex; justify-content: space-between; margin: 0.3rem 0; font-size: 0.9rem;">
            <span>${item.name} (x${item.qty})</span>
            <span>${fmt(item.price * item.qty)}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="margin-bottom: 1.5rem; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
        <div style="display: flex; justify-content: space-between; margin: 0.3rem 0;">
          <span>Subtotal:</span>
          <span>${fmt(
            items.reduce((sum, it) => sum + it.price * it.qty, 0)
          )}</span>
        </div>
        ${
          coupon
            ? `
          <div style="display: flex; justify-content: space-between; margin: 0.3rem 0; color: #10b981;">
            <span>Diskon (${coupon.code}):</span>
            <span>-${fmt(coupon.discount)}</span>
          </div>
        `
            : ""
        }
        <div style="display: flex; justify-content: space-between; margin: 0.5rem 0; font-weight: bold; font-size: 1.1rem; border-top: 1px solid #d1d5db; padding-top: 0.5rem;">
          <span>TOTAL:</span>
          <span style="color: #6366f1;">${fmt(total)}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.85rem;">
        <p style="margin: 0.3rem 0;">Status: <span style="color: #10b981; font-weight: bold;">${getStatusLabel(
          result.transaction_status
        )}</span></p>
        <p style="margin: 0.3rem 0;">Metode Pembayaran: ${
          result.payment_type
            ? result.payment_type.replace(/_/g, " ").toUpperCase()
            : "MIDTRANS"
        }</p>
        <p style="margin: 1rem 0 0 0; font-size: 0.8rem;">Terima kasih telah berbelanja</p>
      </div>
    </div>
  `;

  Swal.fire({
    title: "Pembayaran Berhasil!",
    html: invoiceHTML,
    icon: "success",
    confirmButtonColor: "#6366f1",
    confirmButtonText: "Tutup",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

/**
 * Menyimpan data transaksi ke localStorage.
 * @param {object} result - Objek hasil dari Midtrans.
 * @param {number} total - Total harga transaksi.
 * @param {Array} cartItems - Item dalam keranjang.
 */
function saveTransactionToHistory(result, total, cartItems, coupon) {
  const transactionRecord = {
    orderId: result.order_id,
    status: result.transaction_status,
    paymentType: result.payment_type,
    amount: total,
    items: cartItems,
    coupon: coupon, // Simpan informasi kupon
    subtotal: cartItems.reduce((sum, it) => sum + it.price * it.qty, 0),
    date: new Date().toISOString(),
  };
  const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
  history.unshift(transactionRecord); // Tambahkan ke awal array
  localStorage.setItem("purchaseHistory", JSON.stringify(history));
}

// --- CUSTOMER PROFILE MANAGEMENT ---

/**
 * Initialize customer profile dari localStorage
 */
function initializeCustomerProfile() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const customerProfile = document.getElementById("customerProfile");
  const loginLink = document.getElementById("loginLink");
  const profileMenuBtn = document.getElementById("profileMenuBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  if (token && user.id && user.role === "customer") {
    // Show customer profile
    if (customerProfile) customerProfile.style.display = "flex";
    if (loginLink) loginLink.style.display = "none";

    // Update profile info
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if (profileName) profileName.textContent = user.name;
    if (profileEmail) profileEmail.textContent = user.email;

    // Profile menu toggle
    if (profileMenuBtn) {
      profileMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (profileDropdown) {
          profileDropdown.classList.toggle("active");
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        profileDropdown &&
        !profileDropdown.contains(e.target) &&
        e.target !== profileMenuBtn
      ) {
        profileDropdown.classList.remove("active");
      }
    });

    // Logout handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleCustomerLogout);
    }
  } else {
    // Show login link
    if (customerProfile) customerProfile.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
  }
}

/**
 * Handle customer logout
 */
async function handleCustomerLogout() {
  try {
    const token = localStorage.getItem("token");

    // Call logout endpoint
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    Swal.fire({
      icon: "success",
      title: "Logout Berhasil",
      text: "Anda telah keluar dari akun",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "/login.html";
    });
  } catch (error) {
    console.error("Logout error:", error);
    // Force logout anyway
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
  }
}

// --- END CUSTOMER PROFILE MANAGEMENT ---

// --- INISIALISASI ---

// Membuat fungsi global yang bisa diakses dari atribut `onclick` di HTML
window.increase = (id) =>
  setQty(id, readCart().find((it) => it.id === id).qty + 1);
window.decrease = (id) => {
  const item = readCart().find((it) => it.id === id);
  if (item.qty === 1) {
    removeFromCart(id); // Hapus jika kuantitas akan menjadi 0
  } else {
    setQty(id, item.qty - 1);
  }
};

// Menjalankan kode setelah seluruh konten halaman dimuat
document.addEventListener("DOMContentLoaded", async () => {
  // Load produk dari API terlebih dahulu
  await loadProductsFromAPI();

  // Initialize customer profile
  initializeCustomerProfile();

  // Render awal
  renderProducts();
  renderCart();
  updateBadge();

  // Mengatur tahun saat ini di footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menambahkan event listener untuk kontrol keranjang
  const openCartBtn = document.getElementById("openCart");
  const closeCartBtn = document.getElementById("closeCart");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearBtn = document.getElementById("clearBtn");
  const applyCouponBtn = document.getElementById("applyCouponBtn");
  const backdropEl = document.getElementById("backdrop");

  if (openCartBtn) openCartBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
  if (clearBtn) clearBtn.addEventListener("click", clearCart);
  if (applyCouponBtn) applyCouponBtn.addEventListener("click", applyCoupon);
  if (backdropEl) backdropEl.addEventListener("click", closeCart);
});
