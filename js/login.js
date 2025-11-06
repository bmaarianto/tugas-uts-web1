function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validasi dengan data dari data.js
  const user = dataPengguna.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    // Simpan data user ke sessionStorage
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    showAlert("Login berhasil! Selamat datang, " + user.nama).then(() => {
      window.location.href = "dashboard.html";
    });
  } else {
    showAlert("Email/password yang Anda masukkan salah!");
  }
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value;
  showAlert("Link reset password telah dikirim ke " + email).then(() => {
    closeModal("forgotModal");
  });
}

function handleRegister(e) {
  e.preventDefault();
  const nama = document.getElementById("regNama").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  showAlert("Pendaftaran berhasil! Silakan login dengan akun Anda.").then(
    () => {
      closeModal("registerModal");
    }
  );
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};
