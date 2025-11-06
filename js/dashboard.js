window.onload = function() {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            
            if (!currentUser) {
                alert('Silakan login terlebih dahulu!');
                window.location.href = 'login.html';
                return;
            }

            // Tampilkan nama user dan role
            document.getElementById('userName').textContent = currentUser.nama;
            
            const roleBadge = document.getElementById('roleBadge');
            roleBadge.textContent = currentUser.role;
            
            if (currentUser.role === 'Admin') {
                roleBadge.className = 'role-badge badge-admin';
                // Tampilkan menu admin
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'block';
                });
                // Ubah deskripsi katalog untuk admin
                document.getElementById('katalogDesc').textContent = 'Kelola stok buku (CRUD Operations)';
            } else {
                roleBadge.className = 'role-badge badge-user';
                // Tampilkan menu user
                document.querySelectorAll('.user-only').forEach(el => {
                    el.style.display = 'block';
                });
                // Ubah deskripsi katalog untuk user
                document.getElementById('katalogDesc').textContent = 'Lihat katalog buku yang tersedia';
            }

            // Set greeting berdasarkan waktu
            setGreeting(currentUser.nama);

            // Tampilkan waktu saat ini
            updateTime();
        }

        function setGreeting(nama) {
            const hour = new Date().getHours();
            let greeting = '';

            if (hour >= 5 && hour < 11) {
                greeting = 'Selamat Pagi';
            } else if (hour >= 11 && hour < 15) {
                greeting = 'Selamat Siang';
            } else if (hour >= 15 && hour < 18) {
                greeting = 'Selamat Sore';
            } else {
                greeting = 'Selamat Malam';
            }

            document.getElementById('greeting').textContent = greeting + ', ' + nama + '! 👋';
        }

        function updateTime() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            document.getElementById('currentTime').textContent = now.toLocaleDateString('id-ID', options);
        }

        function logout() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                sessionStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        }

        setInterval(updateTime, 60000);