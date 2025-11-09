// --- KONFIGURASI ---
const API_URL = "http://localhost:3000/api/payment";

// --- FUNGSI BANTU ---
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
const $ = (sel) => document.querySelector(sel);

/**
 * Mendapatkan status badge berdasarkan status transaksi.
 * @param {string} status - Status transaksi dari Midtrans.
 * @returns {string} HTML untuk badge status.
 */
function getStatusBadge(status) {
  switch (status) {
    case "settlement":
    case "capture":
      return '<span class="badge success">Success</span>';
    case "pending":
      return '<span class="badge pending">Pending</span>';
    case "expire":
      return '<span class="badge expired">Expired</span>';
    case "cancel":
    case "deny":
      return '<span class="badge failed">Failed</span>';
    case "not_found":
      return '<span class="badge warning">Not Found</span>';
    default:
      return `<span class="badge default">${status}</span>`;
  }
}

/**
 * Merender item histori pembelian ke halaman.
 * @param {Array} history - Array data histori.
 */
function renderHistory(history) {
  const historyBody = $("#purchaseHistory");
  const noHistoryMessage = $("#noHistoryMessage");
  const table = $("#historyTable");

  if (!history || history.length === 0) {
    noHistoryMessage.style.display = "block";
    if (table) table.style.display = "none";
    historyBody.innerHTML = "";
    return;
  }

  noHistoryMessage.style.display = "none";
  if (table) table.style.display = "";

  historyBody.innerHTML = history
    .map(
      (entry) => `
      <tr data-order-id="${entry.orderId}">
        <td>${new Date(entry.date).toLocaleString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</td>
        <td>${entry.orderId}</td>
        <td>
          <ul class="item-list">
            ${entry.items
              .map(
                (item) =>
                  `<li>${item.name} (x${item.quantity || item.qty})</li>`
              )
              .join("")}
          </ul>
          ${
            entry.coupon
              ? `<div class="history-discount">
                   Diskon (${entry.coupon.code}): -${fmt(entry.coupon.discount)}
                 </div>`
              : ""
          }
        </td>
        <td>${fmt(entry.amount)}</td>
        <td>${
          entry.paymentType ? entry.paymentType.replace(/_/g, " ") : "-"
        }</td>
        <td id="status-${entry.orderId}">${getStatusBadge(entry.status)}</td>
      </tr>
    `
    )
    .join("");
}
/**
 * Initializes the DataTable plugin on the history table.
 */
function initializeDataTable() {
  // Use jQuery to initialize DataTables
  $("#historyTable").DataTable();
}

/**
 * Memperbarui status transaksi dengan data terbaru dari server.
 * @param {Array} history - Array data histori dari localStorage.
 */
async function updateStatusesFromServer(history) {
  if (!history || history.length === 0) return;

  const orderIds = history.map((entry) => entry.orderId);

  try {
    const response = await fetch(`${API_URL}/status/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds }),
    });

    if (!response.ok) {
      console.error("Gagal mengambil status dari server");
      return;
    }

    const result = await response.json();

    if (result.success) {
      let historyUpdated = false;
      const updatedHistory = history.map((entry) => {
        const serverStatus = result.data.find(
          (s) => s.order_id === entry.orderId
        );
        if (serverStatus && entry.status !== serverStatus.transaction_status) {
          entry.status = serverStatus.transaction_status;
          // Jika ada payment_type, perbarui juga
          if (serverStatus.payment_type) {
            entry.paymentType = serverStatus.payment_type;
          }
          historyUpdated = true;
        }
        return entry;
      });

      if (historyUpdated) {
        localStorage.setItem("purchaseHistory", JSON.stringify(updatedHistory));
        renderHistory(updatedHistory); // Render ulang dengan status baru
        console.log("Status histori diperbarui dari server.");
      }
    }
  } catch (error) {
    console.error("Error saat memperbarui status:", error);
  }
}

/**
 * Fungsi utama yang dijalankan saat halaman dimuat.
 */
function main() {
  // Baca histori dari localStorage
  const purchaseHistory =
    JSON.parse(localStorage.getItem("purchaseHistory")) || [];

  // Urutkan berdasarkan tanggal terbaru
  purchaseHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Tampilkan histori awal
  renderHistory(purchaseHistory);

  // Inisialisasi DataTables setelah merender histori
  if (purchaseHistory.length > 0) initializeDataTable();

  // Perbarui status dari server di latar belakang
  updateStatusesFromServer(purchaseHistory);
}

// --- INISIALISASI ---
document.addEventListener("DOMContentLoaded", main);
