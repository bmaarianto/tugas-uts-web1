let orderItems = [];
let shippingCost = 0;

window.onload = function () {
  loadBookOptions();
  loadUserData();

  // Update shipping cost when ekspedisi changes
  document.getElementById("ekspedisi").addEventListener("change", function () {
    updateShippingCost(this.value);
  });
};

function loadBookOptions() {
  const select = document.getElementById("bookSelect");
  dataKatalogBuku.forEach((book, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${book.namaBarang} - ${book.harga}`;
    select.appendChild(option);
  });
}

function loadUserData() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById("namaPemesan").value = currentUser.nama;
    document.getElementById("emailPemesan").value = currentUser.email;
  }
}

function addItem() {
  const selectEl = document.getElementById("bookSelect");
  const selectedIndex = selectEl.value;

  if (!selectedIndex) {
    showAlert("Silakan pilih buku terlebih dahulu!");
    return;
  }

  const book = dataKatalogBuku[selectedIndex];

  // Cek apakah buku sudah ada di order
  const existingItem = orderItems.find(
    (item) => item.kodeBarang === book.kodeBarang
  );
  if (existingItem) {
    existingItem.qty++;
  } else {
    orderItems.push({
      kodeBarang: book.kodeBarang,
      namaBarang: book.namaBarang,
      harga: parseInt(book.harga.replace(/[^0-9]/g, "")),
      qty: 1,
    });
  }

  renderOrderTable();
  updateSummary();
  selectEl.value = "";
}

function renderOrderTable() {
  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = "";

  if (orderItems.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #999;">Belum ada pesanan</td></tr>';
    return;
  }

  orderItems.forEach((item, index) => {
    const subtotal = item.harga * item.qty;
    const row = tbody.insertRow();
    row.innerHTML = `
                    <td>${item.namaBarang}</td>
                    <td>Rp ${item.harga.toLocaleString("id-ID")}</td>
                    <td><input type="number" class="qty-input" value="${
                      item.qty
                    }" min="1" onchange="updateQty(${index}, this.value)"></td>
                    <td><strong>Rp ${subtotal.toLocaleString(
                      "id-ID"
                    )}</strong></td>
                    <td><button class="btn-remove" onclick="removeItem(${index})">Hapus</button></td>
                `;
  });
}

function updateQty(index, newQty) {
  orderItems[index].qty = parseInt(newQty);
  renderOrderTable();
  updateSummary();
}

function removeItem(index) {
  orderItems.splice(index, 1);
  renderOrderTable();
  updateSummary();
}

function updateShippingCost(ekspedisi) {
  const costs = {
    JNE: 15000,
    "Pos Indonesia": 10000,
    JNT: 12000,
    SiCepat: 13000,
  };
  shippingCost = costs[ekspedisi] || 0;
  updateSummary();
}

function updateSummary() {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );
  const total = subtotal + shippingCost;

  document.getElementById("subtotalValue").textContent =
    "Rp " + subtotal.toLocaleString("id-ID");
  document.getElementById("shippingValue").textContent =
    "Rp " + shippingCost.toLocaleString("id-ID");
  document.getElementById("totalValue").textContent =
    "Rp " + total.toLocaleString("id-ID");
}

function processCheckout() {
  // Validasi
  if (orderItems.length === 0) {
    showAlert("Silakan tambahkan buku ke pesanan!");
    return;
  }

  const nama = document.getElementById("namaPemesan").value;
  const email = document.getElementById("emailPemesan").value;
  const telepon = document.getElementById("telepon").value;
  const alamat = document.getElementById("alamat").value;
  const metodePembayaran = document.getElementById("metodePembayaran").value;
  const ekspedisi = document.getElementById("ekspedisi").value;

  if (
    !nama ||
    !email ||
    !telepon ||
    !alamat ||
    !metodePembayaran ||
    !ekspedisi
  ) {
    showAlert("Mohon lengkapi semua data pesanan!");
    return;
  }

  // Generate nomor pesanan
  const nomorPesanan = "DO" + Date.now();
  const total =
    orderItems.reduce((sum, item) => sum + item.harga * item.qty, 0) +
    shippingCost;

  // Simulasi proses pesanan — tampilkan modal lalu reset
  const message = `Pesanan Berhasil!\n\nNomor Pesanan: ${nomorPesanan}\nTotal Bayar: Rp ${total.toLocaleString(
    "id-ID"
  )}\n\nTerima kasih telah berbelanja di Toko Buku Singkong!`;
  showAlert(message).then(() => {
    // Reset form
    orderItems = [];
    renderOrderTable();
    updateSummary();
    document.getElementById("namaPemesan").value = "";
    document.getElementById("emailPemesan").value = "";
    document.getElementById("telepon").value = "";
    document.getElementById("alamat").value = "";
    document.getElementById("metodePembayaran").value = "";
    document.getElementById("ekspedisi").value = "";

    loadUserData(); // Reload user data
  });
}
