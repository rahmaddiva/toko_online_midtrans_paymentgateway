// --- KONFIGURASI DAN DATA ---

// Data Produk - Daftar item fashion/pakaian
const PRODUCTS = [
  {
    id: 1,
    name: "Kemeja Kasual Pria",
    price: 189000,
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    category: "Pria"
  },
  {
    id: 2,
    name: "Dress Casual Wanita",
    price: 245000,
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
    category: "Wanita"
  },
  {
    id: 3,
    name: "Jaket Denim Klasik",
    price: 320000,
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    category: "Unisex"
  },
  {
    id: 4,
    name: "Kaos Polos Premium",
    price: 125000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    category: "Unisex"
  },
  {
    id: 5,
    name: "Celana Jeans Slim Fit",
    price: 275000,
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
    category: "Pria"
  },
  {
    id: 6,
    name: "Blouse Elegan",
    price: 198000,
    img: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&q=80",
    category: "Wanita"
  },
  {
    id: 7,
    name: "Sweater Rajut",
    price: 215000,
    img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
    category: "Unisex"
  },
  {
    id: 8,
    name: "Rok Mini Modern",
    price: 165000,
    img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80",
    category: "Wanita"
  },
  {
    id: 9,
    name: "Hoodie Streetwear",
    price: 289000,
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    category: "Unisex"
  },
  {
    id: 10,
    name: "Kemeja Flanel",
    price: 175000,
    img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80",
    category: "Pria"
  },
  {
    id: 11,
    name: "Cardigan Wanita",
    price: 235000,
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    category: "Wanita"
  },
  {
    id: 12,
    name: "Celana Chino",
    price: 265000,
    img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
    category: "Pria"
  },
  {
    id: 13,
    name: "Jumpsuit Casual",
    price: 315000,
    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80",
    category: "Wanita"
  },
  {
    id: 14,
    name: "Bomber Jacket",
    price: 385000,
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    category: "Unisex"
  },
  {
    id: 15,
    name: "Polo Shirt Premium",
    price: 155000,
    img: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80",
    category: "Pria"
  },
  {
    id: 16,
    name: "Tunik Batik Modern",
    price: 225000,
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80",
    category: "Wanita"
  }
];

// Konfigurasi URL API backend untuk pembayaran
const API_URL = 'http://localhost:3000/api/payment';

// --- FUNGSI BANTU ---

// Fungsi untuk memformat angka menjadi format mata uang Rupiah (IDR)
const fmt = n => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(n);
// Fungsi shortcut untuk memilih elemen DOM menggunakan selector CSS
const $ = sel => document.querySelector(sel);

// --- ELEMEN DOM ---

// Memilih elemen-elemen DOM yang akan dimanipulasi
const productGrid = $("#productGrid"); // Grid untuk menampilkan produk
const cartDrawer = $("#cartDrawer");   // Panel samping keranjang belanja
const backdrop = $("#backdrop");       // Latar belakang gelap saat keranjang terbuka
const cartCount = $("#cartCount");     // Badge jumlah item di ikon keranjang
const cartItems = $("#cartItems");     // Kontainer untuk daftar item di keranjang
const cartTotal = $("#cartTotal");     // Elemen untuk menampilkan total harga

// --- MANAJEMEN STATE KERANJANG ---

// Variabel untuk menyimpan data keranjang belanja di memori
// (localStorage tidak didukung di lingkungan ini, jadi menggunakan variabel biasa)
let cartData = [];

// --- FUNGSI-FUNGSI UTAMA ---

/**
 * Merender (menampilkan) semua produk ke dalam grid di halaman.
 */
function renderProducts() {
  // Mengisi grid produk dengan HTML yang digenerate dari data `PRODUCTS`
  productGrid.innerHTML = PRODUCTS.map(p => `
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
  `).join("");
  
  // Menambahkan event listener untuk setiap tombol "Tambah"
  productGrid.querySelectorAll(".add").forEach(btn => 
    btn.addEventListener("click", onAdd)
  );
  // Menambahkan event listener untuk setiap tombol "Detail"
  productGrid.querySelectorAll(".detail").forEach(btn => 
    btn.addEventListener("click", onDetail)
  );
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
  updateBadge(); // Memperbarui tampilan jumlah item di ikon keranjang
}

/**
 * Menambahkan produk ke keranjang atau menambah jumlahnya jika sudah ada.
 * @param {number} id - ID produk yang akan ditambahkan.
 */
function addToCart(id) {
  const items = readCart();
  const idx = items.findIndex(it => it.id === id);
  
  if (idx > -1) {
    // Jika produk sudah ada, tambah kuantitasnya
    items[idx].qty += 1;
  } else {
    // Jika produk belum ada, tambahkan sebagai item baru
    const p = PRODUCTS.find(x => x.id === id);
    items.push({id: p.id, name: p.name, price: p.price, img: p.img, qty: 1});
  }
  
  saveCart(items);
  renderCart(); // Perbarui tampilan keranjang
  
  // Menampilkan notifikasi sukses menggunakan SweetAlert
  const product = PRODUCTS.find(p => p.id === id);
  Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: `${product.name} ditambahkan ke keranjang`,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
}

/**
 * Menghapus item dari keranjang setelah konfirmasi.
 * @param {number} id - ID produk yang akan dihapus.
 */
function removeFromCart(id) {
  const item = readCart().find(it => it.id === id);
  
  // Menampilkan dialog konfirmasi penghapusan
  Swal.fire({
    title: 'Hapus item?',
    text: `Hapus ${item.name} dari keranjang?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika dikonfirmasi, filter item dan simpan keranjang baru
      let items = readCart().filter(it => it.id !== id);
      saveCart(items);
      renderCart(); // Perbarui tampilan keranjang
      
      // Notifikasi sukses penghapusan
      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Item berhasil dihapus dari keranjang',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
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
  let items = readCart().map(it => it.id === id ? {...it, qty: qty} : it);
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
      icon: 'info',
      title: 'Keranjang Sudah Kosong',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
    return;
  }
  
  // Dialog konfirmasi untuk mengosongkan keranjang
  Swal.fire({
    title: 'Kosongkan Keranjang?',
    text: 'Semua item akan dihapus dari keranjang',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, kosongkan',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      saveCart([]); // Kosongkan data keranjang
      renderCart(); // Perbarui tampilan keranjang
      
      // Notifikasi sukses
      Swal.fire({
        icon: 'success',
        title: 'Keranjang Dikosongkan',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    }
  });
}

/**
 * Mengambil Snap Token dari backend untuk memulai transaksi Midtrans.
 * @param {object} transactionData - Data transaksi (total, item, pelanggan).
 * @returns {Promise<string>} Snap Token dari Midtrans.
 */
async function getSnapToken(transactionData) {
  try {
    const response = await fetch(`${API_URL}/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Gagal membuat transaksi');
    }

    return result.data.token;
  } catch (error) {
    console.error('Error saat mengambil snap token:', error);
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
    cartItems.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:2rem;">Keranjang kosong</p>';
    cartTotal.textContent = fmt(0);
    updateBadge();
    return;
  }
  
  // Generate HTML untuk setiap item di keranjang
  cartItems.innerHTML = items.map(it => `
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
  `).join("");
  
  // Hitung dan tampilkan total harga
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  cartTotal.textContent = fmt(total);
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
  const product = PRODUCTS.find(p => p.id === id);
  
  // Tampilkan modal detail produk menggunakan SweetAlert
  Swal.fire({
    title: product.name,
    html: `
      <img src="${product.img}" style="width:100%;border-radius:12px;margin-bottom:1rem;" alt="${product.name}">
      <p style="font-size:1.5rem;color:#10b981;font-weight:700;margin:1rem 0;">${fmt(product.price)}</p>
      <p style="color:#6b7280;">Kategori: ${product.category}</p>
      <p style="margin-top:1rem;color:#4b5563;">Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.</p>
    `,
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-cart-plus"></i> Tambah ke Keranjang',
    cancelButtonText: 'Tutup',
    confirmButtonColor: '#6366f1',
    cancelButtonColor: '#6b7280'
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
  document.body.style.overflow = 'hidden'; // Mencegah scroll halaman utama
}

/**
 * Menutup panel samping keranjang belanja.
 */
function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.style.overflow = ''; // Mengizinkan scroll kembali
}

// --- PROSES CHECKOUT ---

/**
 * Menangani seluruh proses checkout, mulai dari pengumpulan data pelanggan hingga pembayaran via Midtrans.
 */
async function checkout() {
  const items = readCart();
  
  if (items.length === 0) {
    // Jika keranjang kosong, tampilkan peringatan
    Swal.fire({
      icon: 'warning',
      title: 'Keranjang Kosong',
      text: 'Silakan tambahkan produk terlebih dahulu',
      confirmButtonColor: '#6366f1'
    });
    return;
  }

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);

  // Menampilkan modal untuk mengisi informasi pembeli
  const { value: formValues } = await Swal.fire({
    title: 'Informasi Pembeli',
    html: `
      <div style="text-align:left;margin:1rem 0;">
        <p style="margin:0.5rem 0;"><strong>Total Item:</strong> ${itemCount} pcs</p>
        <p style="margin:0.5rem 0;"><strong>Total Harga:</strong> ${fmt(total)}</p>
      </div>
      <div style="margin-top:1.5rem;">
        <input id="name" class="swal2-input" placeholder="Nama Lengkap" required>
        <input id="email" class="swal2-input" placeholder="Email" type="email" required>
        <input id="phone" class="swal2-input" placeholder="No. Telepon" required>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '<i class="fas fa-credit-card"></i> Lanjut Pembayaran',
    cancelButtonText: 'Batal',
    preConfirm: () => {
      // Validasi input sebelum konfirmasi
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;

      if (!name || !email || !phone) {
        Swal.showValidationMessage('Semua field harus diisi!');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.showValidationMessage('Format email tidak valid!');
        return false;
      }

      return { name, email, phone };
    }
  });

  if (!formValues) return; // Jika pengguna membatalkan, hentikan proses

  try {
    // Tampilkan loading indicator
    Swal.fire({
      title: 'Memproses Pembayaran...',
      html: 'Mohon tunggu, sedang menghubungkan ke payment gateway',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Siapkan data transaksi untuk dikirim ke backend
    const transactionData = {
      amount: total,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty
      })),
      customer: {
        first_name: formValues.name.split(' ')[0],
        last_name: formValues.name.split(' ').slice(1).join(' ') || formValues.name.split(' ')[0],
        email: formValues.email,
        phone: formValues.phone
      }
    };

    // Ambil Snap Token dari backend
    const snapToken = await getSnapToken(transactionData);

    Swal.close(); // Tutup loading indicator

    // Buka halaman pembayaran Midtrans Snap
    window.snap.pay(snapToken, {
      onSuccess: function(result) {
        // Callback saat pembayaran sukses
        console.log('Pembayaran sukses:', result);
        saveCart([]); // Kosongkan keranjang
        renderCart();
        closeCart();
        Swal.fire({
          icon: 'success',
          title: 'Pembayaran Berhasil!',
          html: `
            <p>Terima kasih atas pembelian Anda</p>
            <p style="color:#6b7280;font-size:0.9rem;margin-top:1rem;">Order ID: ${result.order_id}</p>
            <p style="color:#6b7280;font-size:0.9rem;">Total: ${fmt(total)}</p>
            <p style="color:#6b7280;font-size:0.9rem;">Pesanan akan segera diproses</p>
          `,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'OK'
        });
      },
      onPending: function(result) {
        // Callback saat pembayaran tertunda
        console.log('Pembayaran tertunda:', result);
        closeCart();
        Swal.fire({
          icon: 'info',
          title: 'Pembayaran Tertunda',
          html: `
            <p>Menunggu konfirmasi pembayaran</p>
            <p style="color:#6b7280;font-size:0.9rem;margin-top:1rem;">Order ID: ${result.order_id}</p>
            <p style="color:#6b7280;font-size:0.9rem;">Silakan selesaikan pembayaran Anda</p>
          `,
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'OK'
        });
      },
      onError: function(result) {
        // Callback saat terjadi error pembayaran
        console.error('Error pembayaran:', result);
        Swal.fire({
          icon: 'error',
          title: 'Pembayaran Gagal',
          html: `
            <p>Terjadi kesalahan saat memproses pembayaran</p>
            <p style="color:#6b7280;font-size:0.9rem;margin-top:1rem;">Silakan coba lagi</p>
          `,
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'OK'
        });
      },
      onClose: function() {
        // Callback saat popup pembayaran ditutup
        console.log('Popup pembayaran ditutup');
      }
    });

  } catch (error) {
    // Tangani error jika gagal menghubungi backend
    console.error('Error checkout:', error);
    Swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan',
      text: error.message || 'Tidak dapat menghubungkan ke server. Pastikan backend sudah berjalan.',
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK'
    });
  }
}

// --- INISIALISASI ---

// Membuat fungsi global yang bisa diakses dari atribut `onclick` di HTML
window.increase = id => setQty(id, readCart().find(it => it.id === id).qty + 1);
window.decrease = id => {
  const item = readCart().find(it => it.id === id);
  if (item.qty === 1) {
    removeFromCart(id); // Hapus jika kuantitas akan menjadi 0
  } else {
    setQty(id, item.qty - 1);
  }
};

// Menjalankan kode setelah seluruh konten halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
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
  const backdropEl = document.getElementById("backdrop");
  
  if (openCartBtn) openCartBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
  if (clearBtn) clearBtn.addEventListener("click", clearCart);
  if (backdropEl) backdropEl.addEventListener("click", closeCart);
});