function searchTracking(e) {
  e.preventDefault();

  const searchValue = document.getElementById("searchInput").value.trim();
  const trackingData = dataTracking[searchValue];

  // Reset display
  document.getElementById("resultCard").style.display = "none";
  document.getElementById("noResult").style.display = "none";

  if (trackingData) {
    displayTrackingResult(trackingData);
  } else {
    document.getElementById("noResult").style.display = "block";
  }
}

function displayTrackingResult(data) {
  // Tampilkan card result
  document.getElementById("resultCard").style.display = "block";

  // Set informasi dasar
  document.getElementById("nomorDO").textContent = data.nomorDO;
  document.getElementById("namaPemesan").textContent = data.nama;
  document.getElementById("ekspedisi").textContent = data.ekspedisi;
  document.getElementById("tanggalKirim").textContent = formatDate(
    data.tanggalKirim
  );
  document.getElementById("jenisPaket").textContent = data.paket;
  document.getElementById("totalBayar").textContent = data.total;

  // Set status badge
  const statusBadge = document.getElementById("statusBadge");
  statusBadge.textContent = data.status;

  if (data.status === "Dikirim") {
    statusBadge.className = "status-badge status-delivered";
    setProgress(100);
  } else {
    statusBadge.className = "status-badge status-progress";
    setProgress(60);
  }

  // Render timeline
  renderTimeline(data.perjalanan);
}

function renderTimeline(perjalanan) {
  const container = document.getElementById("timelineContainer");
  container.innerHTML = "";

  perjalanan.forEach((item, index) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";

    timelineItem.innerHTML = `
                    <div class="timeline-dot">${index + 1}</div>
                    <div class="timeline-content">
                        <div class="timeline-time">📅 ${item.waktu}</div>
                        <div class="timeline-desc">${item.keterangan}</div>
                    </div>
                `;

    container.appendChild(timelineItem);
  });
}

function setProgress(percentage) {
  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = percentage + "%";
  progressFill.textContent = percentage + "%";
}

function formatDate(dateStr) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("id-ID", options);
}
