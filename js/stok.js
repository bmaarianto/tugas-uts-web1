let currentEditIndex = -1;

function checkUserAccess() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    showAlert("Silakan login terlebih dahulu!").then(() => {
      window.location.href = "login.html";
    });
    return false;
  }
  return currentUser;
}

window.onload = function () {
  const currentUser = checkUserAccess();
  if (!currentUser) return;

  // Hide CRUD elements for non-admin users
  if (currentUser.role !== "Admin") {
    document.querySelector(".btn-add").style.display = "none";
    document.querySelector("th:last-child").style.display = "none";
  }

  loadBooks();
};

function loadBooks() {
  const tbody = document.getElementById("bookTableBody");
  tbody.innerHTML = "";
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const isAdmin = currentUser && currentUser.role === "Admin";

  dataKatalogBuku.forEach((book, index) => {
    const row = tbody.insertRow();

    const stockStatus = book.stok > 200 ? "badge-success" : "badge-warning";
    const stockLabel = book.stok > 200 ? "Tersedia" : "Terbatas";

    row.innerHTML = `
                    <td><img src="${book.cover}" alt="${
      book.namaBarang
    }" class="book-cover" onerror="this.src='https://via.placeholder.com/60x80?text=No+Image'"></td>
                    <td>${book.kodeBarang}</td>
                    <td><strong>${book.namaBarang}</strong></td>
                    <td>${book.jenisBarang}</td>
                    <td>Edisi ${book.edisi}</td>
                    <td><span class="badge ${stockStatus}">${
      book.stok
    } (${stockLabel})</span></td>
                    <td><strong>${book.harga}</strong></td>
                    ${
                      isAdmin
                        ? `<td>
                        <button class="btn-action btn-edit" onclick="editBook(${index})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteBook(${index})"><i class="fas fa-trash"></i> Hapus</button>
                    </td>`
                        : ""
                    }
                `;
  });
}

function openModal() {
  document.getElementById("modalTitle").textContent = "Tambah Buku Baru";
  document.getElementById("bookForm").reset();
  currentEditIndex = -1;
  document.getElementById("bookModal").style.display = "block";
}

function closeModal() {
  document.getElementById("bookModal").style.display = "none";
}

function handleSubmit(e) {
  e.preventDefault();

  const bookData = {
    kodeBarang: document.getElementById("kodeBarang").value,
    namaBarang: document.getElementById("namaBarang").value,
    jenisBarang: document.getElementById("jenisBarang").value,
    edisi: document.getElementById("edisi").value,
    stok: parseInt(document.getElementById("stok").value),
    harga:
      "Rp " +
      parseInt(document.getElementById("harga").value).toLocaleString("id-ID"),
    cover:
      document.getElementById("cover").value ||
      "https://via.placeholder.com/60x80?text=No+Image",
  };

  if (currentEditIndex === -1) {
    // Tambah buku baru
    dataKatalogBuku.push(bookData);
    showAlert("Buku berhasil ditambahkan!");
  } else {
    // Update buku yang ada
    dataKatalogBuku[currentEditIndex] = bookData;
    showAlert("Buku berhasil diupdate!");
  }

  loadBooks();
  closeModal();
}

function editBook(index) {
  currentEditIndex = index;
  const book = dataKatalogBuku[index];

  document.getElementById("modalTitle").textContent = "Edit Buku";
  document.getElementById("kodeBarang").value = book.kodeBarang;
  document.getElementById("namaBarang").value = book.namaBarang;
  document.getElementById("jenisBarang").value = book.jenisBarang;
  document.getElementById("edisi").value = book.edisi;
  document.getElementById("stok").value = book.stok;
  document.getElementById("harga").value = book.harga.replace(/[^0-9]/g, "");
  document.getElementById("cover").value = book.cover;

  document.getElementById("bookModal").style.display = "block";
}

function deleteBook(index) {
  showConfirm("Apakah Anda yakin ingin menghapus buku ini?").then(
    (confirmed) => {
      if (!confirmed) return;
      dataKatalogBuku.splice(index, 1);
      loadBooks();
      showAlert("Buku berhasil dihapus!");
    }
  );
}

window.onclick = function (event) {
  if (event.target.id === "bookModal") {
    closeModal();
  }
};
