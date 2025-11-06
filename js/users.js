let currentEditIndex = -1;
let isAdmin = false;

window.onload = function () {
  checkAdminAccess();
  if (isAdmin) {
    loadUsers();
    updateStats();
  }
};

function checkAdminAccess() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  if (!currentUser) {
    showAlert("Silakan login terlebih dahulu!").then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  if (currentUser.role !== "Admin") {
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("accessDenied").style.display = "block";
    return;
  }

  isAdmin = true;
}

function loadUsers() {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  dataPengguna.forEach((user, index) => {
    const row = tbody.insertRow();

    const roleClass = user.role === "Admin" ? "badge-admin" : "badge-user";

    row.innerHTML = `
                    <td><strong>${user.id}</strong></td>
                    <td>${user.nama}</td>
                    <td>${user.email}</td>
                    <td><span class="badge ${roleClass}">${user.role}</span></td>
          <td>
            <button class="btn-action btn-edit" onclick="editUser(${index})"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn-action btn-delete" onclick="deleteUser(${index})"><i class="fas fa-trash"></i> Hapus</button>
          </td>
                `;
  });
}

function updateStats() {
  const totalUsers = dataPengguna.length;
  const totalAdmins = dataPengguna.filter((u) => u.role === "Admin").length;
  const totalRegularUsers = dataPengguna.filter(
    (u) => u.role === "User"
  ).length;

  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("totalAdmins").textContent = totalAdmins;
  document.getElementById("totalRegularUsers").textContent = totalRegularUsers;
}

function openModal() {
  document.getElementById("modalTitle").textContent = "Tambah Pengguna Baru";
  document.getElementById("userForm").reset();
  currentEditIndex = -1;
  document.getElementById("userModal").style.display = "block";
}

function closeModal() {
  document.getElementById("userModal").style.display = "none";
}

function handleSubmit(e) {
  e.preventDefault();

  const userData = {
    id:
      currentEditIndex === -1
        ? dataPengguna.length + 1
        : dataPengguna[currentEditIndex].id,
    nama: document.getElementById("nama").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value,
  };

  // Cek email duplikat
  const emailExists = dataPengguna.some((user, index) => {
    return user.email === userData.email && index !== currentEditIndex;
  });

  if (emailExists) {
    showAlert("Email sudah digunakan oleh pengguna lain!");
    return;
  }

  if (currentEditIndex === -1) {
    // Tambah pengguna baru
    dataPengguna.push(userData);
    showAlert("Pengguna berhasil ditambahkan!");
  } else {
    // Update pengguna yang ada
    dataPengguna[currentEditIndex] = userData;
    showAlert("Data pengguna berhasil diupdate!");
  }

  loadUsers();
  updateStats();
  closeModal();
}

function editUser(index) {
  currentEditIndex = index;
  const user = dataPengguna[index];

  document.getElementById("modalTitle").textContent = "Edit Pengguna";
  document.getElementById("nama").value = user.nama;
  document.getElementById("email").value = user.email;
  document.getElementById("password").value = user.password;
  document.getElementById("role").value = user.role;

  document.getElementById("userModal").style.display = "block";
}

function deleteUser(index) {
  const user = dataPengguna[index];

  // Cegah menghapus akun sendiri
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (user.email === currentUser.email) {
    showAlert("Anda tidak dapat menghapus akun Anda sendiri!");
    return;
  }
  showConfirm(
    `Apakah Anda yakin ingin menghapus pengguna "${user.nama}"?`
  ).then((confirmed) => {
    if (!confirmed) return;
    dataPengguna.splice(index, 1);

    // Update ID
    dataPengguna.forEach((u, i) => {
      u.id = i + 1;
    });

    loadUsers();
    updateStats();
    showAlert("Pengguna berhasil dihapus!");
  });
}

window.onclick = function (event) {
  if (event.target.id === "userModal") {
    closeModal();
  }
};
