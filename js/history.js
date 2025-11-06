 let allTransactions = [];
        let filteredTransactions = [];
        let currentUser = null;

        window.onload = function() {
            checkUser();
            loadTransactions();
            renderTransactions();
            updateStats();
            
            // Set default filter month to current month
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            document.getElementById('filterMonth').value = `${today.getFullYear()}-${month}`;
        }

        function checkUser() {
            currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            
            if (!currentUser) {
                alert('Silakan login terlebih dahulu!');
                window.location.href = 'login.html';
                return;
            }
        }

        function loadTransactions() {
            // Simulasi data transaksi dari localStorage
            const savedTransactions = localStorage.getItem('transactions');
            
            if (savedTransactions) {
                allTransactions = JSON.parse(savedTransactions);
            } else {
                // Data dummy untuk demo
                allTransactions = [
                    {
                        id: 'TRX20250801001',
                        tanggal: '2025-08-01',
                        pelanggan: 'Rina Wulandari',
                        email: 'rina@gmail.com',
                        items: [
                            { nama: 'Pengantar Ilmu Komunikasi', qty: 2, harga: 180000 },
                            { nama: 'Manajemen Keuangan', qty: 1, harga: 220000 }
                        ],
                        subtotal: 580000,
                        ongkir: 15000,
                        total: 595000,
                        status: 'selesai',
                        metodePembayaran: 'Transfer Bank',
                        ekspedisi: 'JNE',
                        alamat: 'Jl. Sudirman No. 123, Jakarta'
                    },
                    {
                        id: 'TRX20250802001',
                        tanggal: '2025-08-02',
                        pelanggan: 'Agus Pranoto',
                        email: 'agus@gmail.com',
                        items: [
                            { nama: 'Kepemimpinan', qty: 3, harga: 150000 }
                        ],
                        subtotal: 450000,
                        ongkir: 12000,
                        total: 462000,
                        status: 'dikirim',
                        metodePembayaran: 'E-Wallet',
                        ekspedisi: 'JNT',
                        alamat: 'Jl. Asia Afrika No. 45, Bandung'
                    },
                    {
                        id: 'TRX20250803001',
                        tanggal: '2025-08-03',
                        pelanggan: 'Siti Marlina',
                        email: 'siti@gmail.com',
                        items: [
                            { nama: 'Mikrobiologi Dasar', qty: 1, harga: 200000 },
                            { nama: 'Perkembangan Anak Usia Dini', qty: 2, harga: 250000 }
                        ],
                        subtotal: 700000,
                        ongkir: 10000,
                        total: 710000,
                        status: 'proses',
                        metodePembayaran: 'Transfer Bank',
                        ekspedisi: 'Pos Indonesia',
                        alamat: 'Jl. Gatot Subroto No. 89, Surabaya'
                    },
                    {
                        id: 'TRX20251001001',
                        tanggal: '2025-10-01',
                        pelanggan: 'Budi Santoso',
                        email: 'budi@gmail.com',
                        items: [
                            { nama: 'Pengantar Ilmu Komunikasi', qty: 1, harga: 180000 }
                        ],
                        subtotal: 180000,
                        ongkir: 13000,
                        total: 193000,
                        status: 'pending',
                        metodePembayaran: 'COD',
                        ekspedisi: 'SiCepat',
                        alamat: 'Jl. Diponegoro No. 56, Semarang'
                    },
                    {
                        id: 'TRX20251105001',
                        tanggal: '2025-11-05',
                        pelanggan: 'Dewi Kusuma',
                        email: 'dewi@gmail.com',
                        items: [
                            { nama: 'Manajemen Keuangan', qty: 2, harga: 220000 },
                            { nama: 'Kepemimpinan', qty: 1, harga: 150000 }
                        ],
                        subtotal: 590000,
                        ongkir: 15000,
                        total: 605000,
                        status: 'selesai',
                        metodePembayaran: 'Transfer Bank',
                        ekspedisi: 'JNE',
                        alamat: 'Jl. Thamrin No. 78, Medan'
                    }
                ];
                
                // Filter berdasarkan role
                if (currentUser.role !== 'Admin') {
                    allTransactions = allTransactions.filter(t => t.email === currentUser.email);
                }
            }
            
            filteredTransactions = [...allTransactions];
        }

        function filterTransactions() {
            const statusFilter = document.getElementById('filterStatus').value;
            const monthFilter = document.getElementById('filterMonth').value;
            
            filteredTransactions = allTransactions.filter(transaction => {
                let matchStatus = statusFilter === 'all' || transaction.status === statusFilter;
                let matchMonth = !monthFilter || transaction.tanggal.startsWith(monthFilter);
                
                return matchStatus && matchMonth;
            });
            
            renderTransactions();
            updateStats();
        }

        function renderTransactions() {
            const tbody = document.getElementById('transactionTableBody');
            tbody.innerHTML = '';

            if (filteredTransactions.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">
                                <div class="empty-state-icon">📭</div>
                                <h3>Tidak ada transaksi</h3>
                                <p>Belum ada data transaksi yang sesuai dengan filter</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            filteredTransactions.forEach((transaction, index) => {
                const row = tbody.insertRow();
                
                const statusClass = {
                    'pending': 'badge-pending',
                    'proses': 'badge-info',
                    'dikirim': 'badge-warning',
                    'selesai': 'badge-success'
                };
                
                const statusText = {
                    'pending': 'Pending',
                    'proses': 'Diproses',
                    'dikirim': 'Dikirim',
                    'selesai': 'Selesai'
                };
                
                const totalItems = transaction.items.reduce((sum, item) => sum + item.qty, 0);
                
                row.innerHTML = `
                    <td><strong>${transaction.id}</strong></td>
                    <td>${formatDate(transaction.tanggal)}</td>
                    <td>${transaction.pelanggan}</td>
                    <td>${totalItems} item</td>
                    <td><strong>Rp ${transaction.total.toLocaleString('id-ID')}</strong></td>
                    <td><span class="badge ${statusClass[transaction.status]}">${statusText[transaction.status]}</span></td>
                    <td><button class="btn-detail" onclick="showDetail(${index})">📄 Detail</button></td>
                `;
            });
        }

        function updateStats() {
            const totalTransaksi = filteredTransactions.length;
            const totalPendapatan = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
            const totalBuku = filteredTransactions.reduce((sum, t) => {
                return sum + t.items.reduce((itemSum, item) => itemSum + item.qty, 0);
            }, 0);
            
            document.getElementById('totalTransaksi').textContent = totalTransaksi;
            document.getElementById('totalPendapatan').textContent = 'Rp ' + totalPendapatan.toLocaleString('id-ID');
            document.getElementById('totalBuku').textContent = totalBuku;
        }

        function showDetail(index) {
            const transaction = filteredTransactions[index];
            
            let itemsHtml = '<div class="items-table"><h3>Daftar Item</h3><table style="width: 100%; margin-top: 10px;"><thead><tr><th>Nama Buku</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead><tbody>';
            
            transaction.items.forEach(item => {
                itemsHtml += `
                    <tr>
                        <td>${item.nama}</td>
                        <td>${item.qty}</td>
                        <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                        <td><strong>Rp ${(item.qty * item.harga).toLocaleString('id-ID')}</strong></td>
                    </tr>
                `;
            });
            
            itemsHtml += '</tbody></table></div>';
            
            const statusText = {
                'pending': 'Pending',
                'proses': 'Diproses',
                'dikirim': 'Dikirim',
                'selesai': 'Selesai'
            };
            
            document.getElementById('detailContent').innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">No. Pesanan</span>
                    <span class="detail-value"><strong>${transaction.id}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tanggal</span>
                    <span class="detail-value">${formatDate(transaction.tanggal)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Pelanggan</span>
                    <span class="detail-value">${transaction.pelanggan}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${transaction.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Alamat</span>
                    <span class="detail-value">${transaction.alamat}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Metode Pembayaran</span>
                    <span class="detail-value">${transaction.metodePembayaran}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ekspedisi</span>
                    <span class="detail-value">${transaction.ekspedisi}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value"><strong>${statusText[transaction.status]}</strong></span>
                </div>
                ${itemsHtml}
                <div class="detail-row" style="margin-top: 20px;">
                    <span class="detail-label">Subtotal</span>
                    <span class="detail-value">Rp ${transaction.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ongkos Kirim</span>
                    <span class="detail-value">Rp ${transaction.ongkir.toLocaleString('id-ID')}</span>
                </div>
                <div class="detail-row" style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 18px;">
                    <span class="detail-label"><strong>Total</strong></span>
                    <span class="detail-value"><strong style="color: #667eea;">Rp ${transaction.total.toLocaleString('id-ID')}</strong></span>
                </div>
            `;
            
            document.getElementById('detailModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('detailModal').style.display = 'none';
        }

        function formatDate(dateStr) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateStr).toLocaleDateString('id-ID', options);
        }

        window.onclick = function(event) {
            if (event.target.id === 'detailModal') {
                closeModal();
            }
        }