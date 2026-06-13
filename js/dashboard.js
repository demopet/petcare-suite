let currentBranchIndex = 0;
let currentDoctorExam = null;
let selectedCustomerBooking = { service: 'Pemeriksaan Umum', doctor: 'Dr. Ahmad Fauzi', date: '2024-06-18', time: '09:30' };

function getMenuIcon(iconName) {
  return lucide.icons[iconName]?.toSvg({ width: 18, height: 18, strokeWidth: 2.1 }) || '';
}

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav || !currentUser) return;
  const menus = MENUS[currentUser.role] || [];
  nav.innerHTML = menus.map((item) => {
    if (item.section) {
      return `<p class="sidebar-section">${item.section}</p>`;
    }
    return `<button class="sidebar-item" data-view="${item.id}">${getMenuIcon(item.icon)}<span>${item.label}</span></button>`;
  }).join('');
  nav.querySelectorAll('.sidebar-item').forEach((button) => {
    button.addEventListener('click', () => navigateTo(button.dataset.view));
  });
}

function setTopbar() {
  const name = document.getElementById('sidebar-user-name');
  const role = document.getElementById('sidebar-user-role');
  const date = document.getElementById('topbar-date');
  if (name) name.textContent = currentUser?.name || '';
  if (role) role.textContent = currentUser?.roleLabel || '';
  if (date) date.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function renderView(viewId) {
  const content = document.getElementById('app-content');
  if (!content) return;
  currentView = viewId;
  const titles = {
    dashboard: 'Dashboard', appointments: 'Appointment', 'medical-records': 'Rekam Medis', vaccination: 'Vaksinasi', monitoring: 'Monitoring', inpatient: 'Rawat Inap', customers: 'Pelanggan', pets: 'Data Hewan', grooming: 'Grooming', inventory: 'Inventori', products: 'Produk Petshop', pos: 'Kasir (POS)', invoices: 'Invoice', accounting: 'Akuntansi', reports: 'Laporan', users: 'Pengguna', settings: 'Pengaturan', 'my-pets': 'Hewan Saya', 'my-appointments': 'Jadwal Kunjungan', 'my-medical': 'Rekam Medis', 'my-vaccination': 'Vaksinasi', 'my-invoices': 'Invoice Saya', 'my-profile': 'Profil Saya',
  };
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = titles[viewId] || 'Dashboard';
  content.innerHTML = renderDashboardView(viewId);
  if (viewId === 'pos') attachPOSListeners();
}

function buildBottomNav() {
  const bottomNav = document.getElementById('bottom-nav');
  if (!bottomNav || !currentUser) return;
  const menus = MENUS[currentUser.role] || [];
  const links = menus.filter((item) => item.id).slice(0, 5);
  bottomNav.innerHTML = links.map((item) => `<button class="bottom-item${currentView === item.id ? ' active' : ''}" type="button" data-view="${item.id}">${getMenuIcon(item.icon)}<span>${item.label}</span></button>`).join('');
  bottomNav.querySelectorAll('.bottom-item').forEach((button) => {
    button.addEventListener('click', () => navigateTo(button.dataset.view));
  });
}

function navigateTo(viewId) {
  const items = document.querySelectorAll('.sidebar-item');
  items.forEach((item) => item.classList.toggle('active', item.dataset.view === viewId));
  renderView(viewId);
  buildBottomNav();
}

function renderDashboardView(viewId) {
  switch (viewId) {
    case 'dashboard': return renderDashboard();
    case 'appointments': return renderAppointments();
    case 'medical-records': return renderMedicalRecords();
    case 'vaccination': return renderVaccination();
    case 'monitoring': return renderMonitoring();
    case 'inpatient': return renderInpatient();
    case 'customers': return renderCustomers();
    case 'pets': return renderPets();
    case 'grooming': return renderGrooming();
    case 'inventory': return renderInventory();
    case 'products': return renderProducts();
    case 'pos': return renderPOS();
    case 'invoices': return renderInvoices();
    case 'accounting': return renderAccounting();
    case 'reports': return renderReports();
    case 'users': return renderUsers();
    case 'settings': return renderSettings();
    case 'my-pets': return renderMyPets();
    case 'my-appointments': return renderMyAppointments();
    case 'my-medical': return renderMyMedical();
    case 'my-vaccination': return renderMyVaccination();
    case 'my-invoices': return renderMyInvoices();
    case 'my-profile': return renderMyProfile();
    default: return renderDashboard();
  }
}

function renderDashboard() {
  if (!currentUser) return '<section class="card card-large"><p>Tidak ada data pengguna.</p></section>';
  switch (currentUser.role) {
    case 'owner': return renderOwnerDashboard();
    case 'doctor': return renderDoctorDashboard();
    case 'staff': return renderStaffDashboard();
    case 'customer': return renderCustomerDashboard();
    default: return renderOwnerDashboard();
  }
}

function renderOwnerDashboard() {
  const branch = DATA.branches[currentBranchIndex] || DATA.branches[0];
  const revenueTotal = branch.revenueMonth;
  const revenueDaily = branch.revenueToday;
  const groomingRevenue = branch.groomingRevenue;
  const pharmacyRevenue = branch.pharmacyRevenue;
  const outstanding = branch.outstandingInvoices;
  const activePatients = branch.activePatients;
  const activeCustomers = branch.activeCustomers;

  return `
    <section class="dashboard-welcome">
      <div>
        <p class="eyebrow">Dashboard Eksekutif</p>
        <h2>Ringkasan operasi cabang ${branch.name}</h2>
        <p>Keuangan, pasien, inventaris, dan performa klinik dalam satu tampilan yang siap dipresentasikan.</p>
      </div>
      <div class="quick-actions">
        <button class="quick-action-card" type="button" onclick="showBranchSelector()"><i data-lucide="map-pin"></i><span>Ganti Cabang</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('reports')"><i data-lucide="bar-chart-2"></i><span>Lihat Laporan</span></button>
        <button class="quick-action-card" type="button" onclick="openModal('notif-modal')"><i data-lucide="bell"></i><span>Notifikasi</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('accounting')"><i data-lucide="trending-up"></i><span>Akuntansi</span></button>
      </div>
    </section>
    <div class="branch-pill-wrap">
      ${DATA.branches.map((item, index) => `<button class="branch-pill${index === currentBranchIndex ? ' active' : ''}" type="button" onclick="switchBranch(${index})">${item.name}</button>`).join('')}
    </div>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Revenue Today</div><div class="kpi-value">${fmtRupiah(revenueDaily)}</div><p class="kpi-note">Performa harian cabang ${branch.name}</p></div>
      <div class="kpi-card"><div class="kpi-label">Revenue This Month</div><div class="kpi-value">${fmtRupiah(revenueTotal)}</div><p class="kpi-note">Total pendapatan bulanan cabang</p></div>
      <div class="kpi-card"><div class="kpi-label">Active Patients</div><div class="kpi-value">${activePatients}</div><p class="kpi-note">Hewan dengan layanan aktif saat ini</p></div>
      <div class="kpi-card"><div class="kpi-label">Active Customers</div><div class="kpi-value">${activeCustomers}</div><p class="kpi-note">Pelanggan aktif yang terlayani</p></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Grooming Revenue</div><div class="kpi-value">${fmtRupiah(groomingRevenue)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Pharmacy Revenue</div><div class="kpi-value">${fmtRupiah(pharmacyRevenue)}</div></div>
      <div class="kpi-card"><div class="kpi-label">Outstanding Invoices</div><div class="kpi-value">${outstanding}</div></div>
      <div class="kpi-card"><div class="kpi-label">Inventory Health</div><div class="kpi-value">${branch.inventoryHealth}</div></div>
    </div>
    <div class="content-grid">
      <section class="card card-large">
        <div class="card-title"><h3>Revenue Trend</h3></div>
        <div class="chart-line">${DATA.revenueTrend.map((point) => `<div class="chart-line-point" style="height:${Math.max(30, (point.value / 1300000) * 100)}px"><span>${point.day}</span><small>${fmtRupiah(point.value)}</small></div>`).join('')}</div>
      </section>
      <section class="card card-large">
        <div class="card-title"><h3>Appointments Trend</h3></div>
        <div class="chart-bar">${DATA.appointmentTrend.map((point) => `<div class="chart-bar-segment"><span>${point.day}</span><div style="height:${Math.max(40, point.count * 8)}px"></div><small>${point.count}</small></div>`).join('')}</div>
      </section>
    </div>
    <div class="content-grid">
      <section class="card card-large">
        <div class="card-title"><h3>Top Services</h3></div>
        <div class="chart-list">${DATA.topServices.map((item) => `<div class="chart-list-item"><strong>${item.name}</strong><div class="chart-list-bar" style="width:${Math.min(100, item.value * 2.2)}%"></div><small>${item.value} layanan</small></div>`).join('')}</div>
      </section>
      <section class="card card-large">
        <div class="card-title"><h3>Top Products</h3></div>
        <div class="chart-list">${DATA.topProducts.map((item) => `<div class="chart-list-item"><strong>${item.name}</strong><div class="chart-list-bar" style="width:${Math.min(100, item.sold * 2.5)}%"></div><small>${item.sold} terjual</small></div>`).join('')}</div>
      </section>
    </div>
    <section class="card card-large">
      <div class="card-title"><h3>Doctor Performance</h3></div>
      <div class="table-wrap"><table><thead><tr><th>Nama Dokter</th><th>Case Completed</th><th>Rating</th></tr></thead><tbody>${DATA.doctorPerformance.map((item) => `<tr><td>${item.name}</td><td>${item.completed}</td><td>${item.rating} / 5</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function switchBranch(index) {
  currentBranchIndex = index;
  renderView('dashboard');
}

function showBranchSelector() {
  const branch = DATA.branches[currentBranchIndex];
  document.getElementById('record-modal-title').textContent = `Cabang: ${branch.name}`;
  document.getElementById('record-modal-body').innerHTML = `<div class="form-card"><p>Pilih cabang untuk melihat data executive dashboard.</p>${DATA.branches.map((item, index) => `<button class="btn btn-secondary" type="button" style="margin:8px 4px;" onclick="switchBranch(${index})">${item.name}</button>`).join('')}</div>`;
  openModal('record-modal');
}

function renderDoctorDashboard() {
  const appointmentsToday = DATA.appointments.filter((item) => item.doctor === currentUser.name && item.date === '2024-06-15');
  const upcoming = DATA.appointments.filter((item) => item.doctor === currentUser.name && item.date > '2024-06-15');
  const completed = DATA.appointments.filter((item) => item.doctor === currentUser.name && item.status === 'completed');
  return `
    <section class="dashboard-welcome">
      <div>
        <p class="eyebrow">Dashboard Dokter</p>
        <h2>Agenda medis hari ini untuk ${currentUser.name}</h2>
        <p>Kelola konsultasi, pemeriksaan, vaksinasi, dan rawat inap dengan workflow medis yang terfokus.</p>
      </div>
      <div class="quick-actions">
        <button class="quick-action-card" type="button" onclick="navigateTo('appointments')"><i data-lucide="calendar"></i><span>Agenda Hari Ini</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('medical-records')"><i data-lucide="file-text"></i><span>Rekam Medis</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('vaccination')"><i data-lucide="shield-check"></i><span>Vaksinasi</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('inpatient')"><i data-lucide="heart-pulse"></i><span>Rawat Inap</span></button>
      </div>
    </section>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Today's Appointments</div><div class="kpi-value">${appointmentsToday.length}</div><p class="kpi-note">Jadwal hari ini</p></div>
      <div class="kpi-card"><div class="kpi-label">Upcoming</div><div class="kpi-value">${upcoming.length}</div><p class="kpi-note">Jadwal mendatang</p></div>
      <div class="kpi-card"><div class="kpi-label">Completed</div><div class="kpi-value">${completed.length}</div><p class="kpi-note">Konsultasi selesai</p></div>
      <div class="kpi-card"><div class="kpi-label">Follow-up Due</div><div class="kpi-value">${DATA.medicalRecords.filter((item) => item.status === 'follow-up').length}</div><p class="kpi-note">Rekam medis lanjutan</p></div>
    </div>
    <div class="content-grid">
      <section class="card card-large">
        <div class="card-title"><h3>Jadwal Dokter</h3></div>
        <div class="timeline">${appointmentsToday.map((item) => `<div class="timeline-item"><h4>${item.time} — ${item.pet}</h4><p>${item.type} | ${item.customer}</p><button class="btn btn-secondary" type="button" onclick="openExamination(${item.id})">Mulai Pemeriksaan</button></div>`).join('')}</div>
      </section>
      <section class="card card-large">
        <div class="card-title"><h3>Upcoming Appointments</h3></div>
        ${upcoming.map((item) => `<div class="timeline-item"><h4>${item.date} ${item.time}</h4><p>${item.pet} — ${item.customer}</p></div>`).join('')}
      </section>
    </div>
  `;
}

function openExamination(appointmentId) {
  const appointment = DATA.appointments.find((item) => item.id === appointmentId);
  if (!appointment) return;
  currentDoctorExam = appointment;
  document.getElementById('record-modal-title').textContent = `Pemeriksaan ${appointment.pet}`;
  document.getElementById('record-modal-body').innerHTML = `
    <div class="form-card">
      <label>Chief Complaint</label><textarea id="exam-complaint">${appointment.type}</textarea>
      <label>Vital Signs</label><input id="exam-vital" value="Temperatur 38.2°C, Nafas 24x, Nadi 108x">
      <label>Physical Examination</label><textarea id="exam-physical">Kulit lembab, refleks normal, tidak ada benjolan mencurigakan.</textarea>
      <label>Diagnosis</label><textarea id="exam-diagnosis">${appointment.type === 'Vaksinasi' ? 'Catatan Vaksinasi rutin' : 'Pemeriksaan umum / kontrol lanjutan'}</textarea>
      <label>Treatment Plan</label><textarea id="exam-treatment">${appointment.type === 'Grooming' ? 'Perawatan grooming lengkap' : 'Obat anti-inflamasi dan kontrol ulang 1 minggu'}</textarea>
      <label>Prescription</label><textarea id="exam-prescription">${appointment.type === 'Vaksinasi' ? 'Vaksin Rabies + Distemper' : 'Suplemen pencernaan'}</textarea>
      <label>Follow-up Recommendation</label><textarea id="exam-followup">Kontrol kembali dalam 7 hari.</textarea>
    </div>
  `;
  openModal('record-modal');
  document.querySelector('.modal-footer .btn-primary').onclick = saveExamination;
}

function saveExamination() {
  if (!currentDoctorExam) return;
  const notes = {
    complaint: document.getElementById('exam-complaint')?.value || '',
    vital: document.getElementById('exam-vital')?.value || '',
    physical: document.getElementById('exam-physical')?.value || '',
    diagnosis: document.getElementById('exam-diagnosis')?.value || '',
    treatment: document.getElementById('exam-treatment')?.value || '',
    prescription: document.getElementById('exam-prescription')?.value || '',
    followup: document.getElementById('exam-followup')?.value || '',
  };
  DATA.medicalRecords.push({ id: Date.now(), date: '2024-06-15', pet: currentDoctorExam.pet, owner: currentDoctorExam.customer, doctor: currentDoctorExam.doctor, complaint: notes.complaint, diagnosis: notes.diagnosis, treatment: notes.treatment, status: 'completed' });
  currentDoctorExam.status = 'completed';
  showToast('Rekam medis berhasil disimpan');
  closeModal('record-modal');
  renderView('dashboard');
}

function renderStaffDashboard() {
  const waiting = DATA.appointments.filter((item) => item.status === 'waiting').length;
  const confirmed = DATA.appointments.filter((item) => item.status === 'confirmed').length;
  const called = DATA.appointments.filter((item) => item.status === 'in-consultation').length;
  return `
    <section class="dashboard-welcome">
      <div>
        <p class="eyebrow">Front Desk</p>
        <h2>Kelola antrian dan appointment dengan cepat</h2>
        <p>Dashboard staff menampilkan status antrian, konfirmasi appointment, dan pendaftaran pelanggan baru.</p>
      </div>
      <div class="quick-actions">
        <button class="quick-action-card" type="button" onclick="navigateTo('appointments')"><i data-lucide="calendar"></i><span>Kelola Appointment</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('customers')"><i data-lucide="users"></i><span>Registrasi Pelanggan</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('inpatient')"><i data-lucide="bed"></i><span>Antrian Rawat Inap</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('inventory')"><i data-lucide="box"></i><span>Inventori</span></button>
      </div>
    </section>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Waiting</div><div class="kpi-value">${waiting}</div></div>
      <div class="kpi-card"><div class="kpi-label">Confirmed</div><div class="kpi-value">${confirmed}</div></div>
      <div class="kpi-card"><div class="kpi-label">In Consultation</div><div class="kpi-value">${called}</div></div>
      <div class="kpi-card"><div class="kpi-label">New Customers</div><div class="kpi-value">${DATA.customers.filter((item) => item.status === 'active').length}</div></div>
    </div>
    <section class="card card-large">
      <div class="card-title"><h3>Queue Board</h3></div>
      <div class="queue-grid">
        ${['waiting','confirmed','in-consultation','completed'].map((status) => `<div class="queue-column"><h4>${status.replace(/-/g, ' ')}</h4>${DATA.appointments.filter((item) => item.status === status).map((item) => `<div class="queue-card"><strong>${item.pet}</strong><span>${item.customer}</span><span>${item.time}</span><div class="queue-actions"><button class="btn btn-secondary" type="button" onclick="updateAppointmentStatus(${item.id}, '${status}')">Ubah</button></div></div>`).join('')}</div>`).join('')}
      </div>
    </section>
  `;
}

function updateAppointmentStatus(appointmentId, currentStatus) {
  const appointment = DATA.appointments.find((item) => item.id === appointmentId);
  if (!appointment) return;
  const next = currentStatus === 'waiting' ? 'confirmed' : currentStatus === 'confirmed' ? 'in-consultation' : currentStatus === 'in-consultation' ? 'completed' : 'completed';
  appointment.status = next;
  showToast(`Status appointment ${appointment.pet} dipindahkan ke ${next}`);
  renderView('dashboard');
}

function renderCustomerDashboard() {
  const pets = DATA.customerVisits;
  const upcoming = DATA.bookings?.filter((item) => item.status !== 'completed') || [];
  const remind = DATA.vaccinations.filter((item) => item.status !== 'valid');
  return `
    <section class="dashboard-welcome">
      <div>
        <p class="eyebrow">Customer Portal</p>
        <h2>Semua kebutuhan hewan kesayangan Anda dalam satu portal</h2>
        <p>Lihat kondisi hewan, jadwal kunjungan, invoice, serta pengingat vaksinasi.</p>
      </div>
      <div class="quick-actions">
        <button class="quick-action-card" type="button" onclick="navigateTo('my-pets')"><i data-lucide="paw-print"></i><span>My Pets</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('my-appointments')"><i data-lucide="calendar"></i><span>Booking Appointment</span></button>
        <button class="quick-action-card" type="button" onclick="navigateTo('my-invoices')"><i data-lucide="file"></i><span>Invoice Center</span></button>
        <button class="quick-action-card" type="button" onclick="openModal('notif-modal')"><i data-lucide="bell"></i><span>Vaccination Reminder</span></button>
      </div>
    </section>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Pets</div><div class="kpi-value">${pets.length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Upcoming Visits</div><div class="kpi-value">${upcoming.length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Open Invoices</div><div class="kpi-value">${DATA.customerInvoices.filter((item) => item.status === 'unpaid').length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Vaccine Reminders</div><div class="kpi-value">${remind.length}</div></div>
    </div>
    <section class="card card-large">
      <div class="card-title"><h3>Upcoming Vaccinations</h3></div>
      ${remind.map((item) => `<div class="timeline-item"><h4>${item.pet}</h4><p>${item.vaccine} — due ${item.nextDue}</p></div>`).join('')}
    </section>
  `;
}

function renderAppointments() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Appointment</h3><button class="btn btn-primary" type="button" onclick="openNewAppointment()">+ Buat Appointment</button></div>
      <div class="filter-bar"><div class="search-wrap"><input class="form-control search-input" placeholder="Cari pasien, hewan atau dokter"></div><select class="form-select"><option>Semua Status</option><option>confirmed</option><option>waiting</option><option>completed</option></select></div>
      <div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Jam</th><th>Hewan</th><th>Pemilik</th><th>Dokter</th><th>Status</th></tr></thead><tbody>${DATA.appointments.map((item) => `<tr><td>${item.date}</td><td>${item.time}</td><td>${item.pet}</td><td>${item.customer}</td><td>${item.doctor}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderMedicalRecords() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Rekam Medis</h3><button class="btn btn-primary" type="button" onclick="openNewMedical()">+ Rekam Medis</button></div>
      <div class="filter-bar"><div class="search-wrap"><input class="form-control search-input" placeholder="Cari hewan atau diagnosa"></div><select class="form-select"><option>Semua Status</option><option>completed</option><option>follow-up</option></select></div>
      <div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Hewan</th><th>Pemilik</th><th>Dokter</th><th>Diagnosa</th><th>Status</th></tr></thead><tbody>${DATA.medicalRecords.map((item) => `<tr><td>${item.date}</td><td>${item.pet}</td><td>${item.owner}</td><td>${item.doctor}</td><td>${item.diagnosis}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderVaccination() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Vaksinasi</h3></div>
      <div class="kpi-grid" style="margin-bottom: 24px;"><div class="kpi-card"><div class="kpi-label">Valid</div><div class="kpi-value">${DATA.vaccinations.filter((item) => item.status === 'valid').length}</div></div><div class="kpi-card"><div class="kpi-label">Jatuh Tempo</div><div class="kpi-value">${DATA.vaccinations.filter((item) => item.status === 'due').length}</div></div><div class="kpi-card"><div class="kpi-label">Terlambat</div><div class="kpi-value">${DATA.vaccinations.filter((item) => item.status === 'overdue').length}</div></div></div>
      <div class="table-wrap"><table><thead><tr><th>Hewan</th><th>Pemilik</th><th>Vaksin</th><th>Tanggal</th><th>Jatuh Tempo</th><th>Status</th></tr></thead><tbody>${DATA.vaccinations.map((item) => `<tr><td>${item.pet}</td><td>${item.owner}</td><td>${item.vaccine}</td><td>${item.date}</td><td>${item.nextDue}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderMonitoring() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Monitoring</h3></div>
      ${DATA.inpatients.map((patient) => `<div class="timeline-item"><h4>${patient.pet}</h4><p>${patient.reason} · Hari ke-${patient.days} · ${patient.room}</p></div>`).join('')}
    </section>
  `;
}

function renderInpatient() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Rawat Inap</h3></div>
      <div class="table-wrap"><table><thead><tr><th>Hewan</th><th>Pemilik</th><th>Kamar</th><th>Masuk</th><th>Status</th></tr></thead><tbody>${DATA.inpatients.map((item) => `<tr><td>${item.pet}</td><td>${item.owner}</td><td>${item.room}</td><td>${item.admitted}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderCustomers() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Pelanggan</h3><button class="btn btn-primary" type="button" onclick="openModal('record-modal')">+ Pelanggan Baru</button></div>
      <div class="table-wrap"><table><thead><tr><th>Nama</th><th>HP</th><th>Email</th><th>Hewan</th><th>Status</th></tr></thead><tbody>${DATA.customers.map((item) => `<tr><td>${item.name}</td><td>${item.phone}</td><td>${item.email}</td><td>${item.pets}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderPets() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Data Hewan</h3><button class="btn btn-primary" type="button" onclick="openModal('record-modal')">+ Hewan Baru</button></div>
      <div class="table-wrap"><table><thead><tr><th>Nama</th><th>Spesies</th><th>Ras</th><th>Usia</th><th>Pemilik</th><th>Status</th></tr></thead><tbody>${DATA.pets.map((item) => `<tr><td>${item.name}</td><td>${item.species}</td><td>${item.breed}</td><td>${item.age}</td><td>${item.owner}</td><td>${statusBadge(item.status === 'Sehat' ? 'active' : item.status === 'Rawat Inap' ? 'info' : 'warning')}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderGrooming() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Grooming</h3><button class="btn btn-primary" type="button" onclick="openModal('record-modal')">+ Jadwal Grooming</button></div>
      <div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Hewan</th><th>Pemilik</th><th>Layanan</th><th>Status</th></tr></thead><tbody>${DATA.grooming.map((item) => `<tr><td>${item.date}</td><td>${item.pet}</td><td>${item.owner}</td><td>${item.services}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderInventory() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Inventori</h3><button class="btn btn-primary" type="button" onclick="openModal('record-modal')">+ Item Baru</button></div>
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Total Inventory Value</div><div class="kpi-value">Rp 4.350.000</div></div>
        <div class="kpi-card"><div class="kpi-label">Low Stock Items</div><div class="kpi-value">3</div></div>
        <div class="kpi-card"><div class="kpi-label">Expiring Soon</div><div class="kpi-value">1</div></div>
      </div>
      <div class="table-wrap"><table><thead><tr><th>Nama Item</th><th>Kategori</th><th>Stok</th><th>Min Stok</th><th>Kadaluarsa</th></tr></thead><tbody>${DATA.inventory.map((item) => `<tr><td>${item.name}</td><td>${item.category}</td><td>${item.stock}</td><td>${item.minStock}</td><td>${item.expiry}</td></tr>`).join('')}</tbody></table></div>
    </section>
    <section class="card card-large">
      <div class="card-title"><h3>Purchase Orders</h3></div>
      <div class="table-wrap"><table><thead><tr><th>ID PO</th><th>Vendor</th><th>Tanggal</th><th>Status</th><th>Total</th><th>Aksi</th></tr></thead><tbody>${DATA.purchaseOrders.map((po) => `<tr><td>${po.id}</td><td>${po.vendor}</td><td>${po.date}</td><td>${po.status}</td><td>${po.total}</td><td>${po.status === 'approval' ? `<button class="btn btn-secondary" type="button" onclick="approvePO('${po.id}')">Approve</button>` : po.status === 'pending' ? `<button class="btn btn-secondary" type="button" onclick="receivePO('${po.id}')">Receive</button>` : '<span>Done</span>'}</td></tr>`).join('')}</tbody></table></div>
    </section>
    <section class="card card-large">
      <div class="card-title"><h3>Stock Movement</h3></div>
      <div class="timeline">${DATA.stockMovement.map((item) => `<div class="timeline-item"><h4>${item.type.replace('-', ' ')}</h4><p>${item.item} • ${item.qty} unit • ${item.date}</p><small>${item.note}</small></div>`).join('')}</div>
    </section>
  `;
}

function renderProducts() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Produk Petshop</h3><button class="btn btn-primary" type="button" onclick="openModal('record-modal')">+ Produk Baru</button></div>
      <div class="table-wrap"><table><thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th></tr></thead><tbody>${DATA.products.map((item) => `<tr><td>${item.name}</td><td>${item.category}</td><td>${fmtRupiah(item.price)}</td><td>${item.stock}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderPOS() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Kasir (POS)</h3></div>
      <div class="pos-layout">
        <div>
          <div class="filter-bar"><div class="search-wrap"><input class="form-control search-input" id="pos-search" placeholder="Cari produk..."></div></div>
          <div class="pos-products">${DATA.products.map((item) => `<button class="pos-product" type="button" onclick="addToCart(${item.id})"><span class="pos-product-icon">${item.name[0]}</span><strong>${item.name}</strong><span>${fmtRupiah(item.price)}</span></button>`).join('')}</div>
        </div>
        <div class="pos-cart">
          <div class="pos-cart-header">Keranjang Belanja</div>
          <div class="pos-cart-items" id="cart-items"><div class="empty-state">Pilih produk untuk mulai.</div></div>
          <div class="pos-total"><span>Total</span><span id="cart-total">Rp 0</span></div>
          <button class="btn btn-primary" type="button" onclick="openPaymentModal()">Proses Pembayaran</button>
        </div>
      </div>
    </section>
  `;
}

function renderInvoices() {
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Invoice</h3><button class="btn btn-primary" type="button" onclick="openModal('record-modal')">+ Invoice</button></div>
      <div class="table-wrap"><table><thead><tr><th>No. Invoice</th><th>Tanggal</th><th>Pelanggan</th><th>Total</th><th>Status</th></tr></thead><tbody>${DATA.invoices.map((item) => `<tr><td>${item.id}</td><td>${item.date}</td><td>${item.customer}</td><td>${item.amount}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderAccounting() {
  if (currentUser?.role !== 'owner') {
    return `<section class="card card-large"><div class="empty-state"><p>Hanya Owner yang dapat mengakses modul ini.</p></div></section>`;
  }
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Akuntansi</h3></div>
      <div class="kpi-grid"><div class="kpi-card"><div class="kpi-label">Pendapatan</div><div class="kpi-value">Rp 18.500.000</div></div><div class="kpi-card"><div class="kpi-label">Pengeluaran</div><div class="kpi-value">Rp 6.200.000</div></div><div class="kpi-card"><div class="kpi-label">Profit</div><div class="kpi-value">Rp 12.300.000</div></div></div>
      <div class="table-wrap" style="margin-top: 24px;"><table><thead><tr><th>ID</th><th>Tanggal</th><th>Type</th><th>Deskripsi</th><th>Amount</th></tr></thead><tbody>${DATA.transactions.map((item) => `<tr><td>${item.id}</td><td>${item.date}</td><td>${item.type}</td><td>${item.description}</td><td>${item.amount}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderReports() {
  if (currentUser?.role !== 'owner') {
    return `<section class="card card-large"><div class="empty-state"><p>Hanya Owner yang dapat mengakses modul ini.</p></div></section>`;
  }
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Laporan & Analitik</h3></div>
      <div class="kpi-grid"><div class="kpi-card"><div class="kpi-label">Pasien Bulan Ini</div><div class="kpi-value">187</div></div><div class="kpi-card"><div class="kpi-label">Kunjungan Baru</div><div class="kpi-value">42</div></div><div class="kpi-card"><div class="kpi-label">Produk Terlaris</div><div class="kpi-value">Royal Canin</div></div></div>
      <div class="report-card-grid">
        ${DATA.reportTemplates.map((report) => `<article class="report-card"><h4>${report.title}</h4><p>${report.description}</p><div class="report-actions"><button class="btn btn-secondary" type="button" onclick="previewReport('${report.key}')">Preview</button><button class="btn btn-primary" type="button" onclick="exportReport('${report.key}')">Export</button></div></article>`).join('')}
      </div>
    </section>
  `;
}

function previewReport(key) {
  document.getElementById('record-modal-title').textContent = `Preview Laporan`;
  document.getElementById('record-modal-body').innerHTML = `<div class="form-card"><h4>${DATA.reportTemplates.find((report) => report.key === key)?.title || 'Laporan'}</h4><p>Ringkasan sementara data laporan untuk bagian ini ditampilkan di sini.</p></div>`;
  openModal('record-modal');
}

function exportReport(key) {
  showToast(`Laporan ${DATA.reportTemplates.find((report) => report.key === key)?.title || key} berhasil diekspor`, 'success');
}

function approvePO(poId) {
  const order = DATA.purchaseOrders.find((item) => item.id === poId);
  if (!order) return;
  order.status = 'received';
  showToast(`PO ${poId} disetujui dan diterima`, 'success');
  renderView(currentView);
}

function receivePO(poId) {
  const order = DATA.purchaseOrders.find((item) => item.id === poId);
  if (!order) return;
  order.status = 'received';
  showToast(`PO ${poId} diterima`, 'success');
  renderView(currentView);
}

function renderUsers() {
  if (currentUser?.role !== 'owner') {
    return `<section class="card card-large"><div class="empty-state"><p>Hanya Owner yang dapat mengakses modul ini.</p></div></section>`;
  }
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Manajemen Pengguna</h3></div>
      <div class="table-wrap"><table><thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>${DATA.users.map((item) => `<tr><td>${item.name}</td><td>${item.email}</td><td>${item.role}</td><td>${statusBadge(item.status)}</td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function renderSettings() {
  if (currentUser?.role !== 'owner') {
    return `<section class="card card-large"><div class="empty-state"><p>Hanya Owner yang dapat mengakses modul ini.</p></div></section>`;
  }
  return `<section class="card card-large"><div class="card-title"><h3>Pengaturan</h3></div><p>Konfigurasi klinik disesuaikan untuk demo frontend.</p></section>`;
}

function renderMyPets() {
  const pets = DATA.customerVisits;
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Hewan Saya</h3></div>
      <div class="pet-card-grid">
        ${pets.map((item) => `<article class="pet-card"><div class="pet-card-photo"><span>${item.species[0]}</span></div><div><h4>${item.pet}</h4><p>${item.breed}</p><p>${item.age} • ${item.weight}</p><p>Status: ${item.status}</p></div></article>`).join('')}
      </div>
    </section>
  `;
}

function renderMyAppointments() {
  const appointments = DATA.appointments.filter((item) => item.customer === 'Budi Santoso');
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Jadwal Kunjungan</h3></div>
      <div class="timeline">
        ${appointments.map((item) => `<div class="timeline-item"><h4>${item.pet}</h4><p>${item.date} • ${item.time} • ${statusBadge(item.status)}</p></div>`).join('')}
      </div>
    </section>
    <section class="card card-large">
      <div class="card-title"><h3>Booking Appointment</h3></div>
      <div class="form-card">
        <label>Layanan</label>
        <select id="booking-service" onchange="updateBookingField('service', this.value)">
          <option${selectedCustomerBooking.service === 'Pemeriksaan Umum' ? ' selected' : ''}>Pemeriksaan Umum</option>
          <option${selectedCustomerBooking.service === 'Vaksinasi' ? ' selected' : ''}>Vaksinasi</option>
          <option${selectedCustomerBooking.service === 'Grooming' ? ' selected' : ''}>Grooming</option>
          <option${selectedCustomerBooking.service === 'Konsultasi Kulit' ? ' selected' : ''}>Konsultasi Kulit</option>
        </select>
        <label>Dokter</label>
        <select id="booking-doctor" onchange="updateBookingField('doctor', this.value)">
          <option${selectedCustomerBooking.doctor === 'Dr. Ahmad Fauzi' ? ' selected' : ''}>Dr. Ahmad Fauzi</option>
          <option${selectedCustomerBooking.doctor === 'Dr. Siti Rahma' ? ' selected' : ''}>Dr. Siti Rahma</option>
          <option${selectedCustomerBooking.doctor === 'Dr. Kartika Novi' ? ' selected' : ''}>Dr. Kartika Novi</option>
        </select>
        <label>Tanggal</label>
        <input id="booking-date" type="date" value="${selectedCustomerBooking.date}" onchange="updateBookingField('date', this.value)">
        <label>Waktu</label>
        <select id="booking-time" onchange="updateBookingField('time', this.value)">
          ${DATA.bookingSlots.filter((slot) => slot.available).map((slot) => `<option value="${slot.time}"${selectedCustomerBooking.time === slot.time ? ' selected' : ''}>${slot.date} ${slot.time} - ${slot.service}</option>`).join('')}
        </select>
        <button class="btn btn-primary" type="button" onclick="bookCustomerAppointment()">Konfirmasi Booking</button>
      </div>
    </section>
  `;
}

function updateBookingField(field, value) {
  selectedCustomerBooking = { ...selectedCustomerBooking, [field]: value };
}

function bookCustomerAppointment() {
  const nextId = DATA.appointments.length + 101;
  DATA.appointments.push({ id: nextId, date: selectedCustomerBooking.date, time: selectedCustomerBooking.time, customer: 'Budi Santoso', pet: 'Max (Labrador)', doctor: selectedCustomerBooking.doctor, type: selectedCustomerBooking.service, status: 'waiting' });
  DATA.bookings.push({ id: DATA.bookings.length + 1, customer: 'Budi Santoso', pet: 'Max (Labrador)', service: selectedCustomerBooking.service, doctor: selectedCustomerBooking.doctor, date: selectedCustomerBooking.date, time: selectedCustomerBooking.time, status: 'waiting' });
  showToast('Booking appointment berhasil dibuat');
  renderView('my-appointments');
}

function renderMyMedical() {
  const records = DATA.medicalRecords.filter((item) => item.owner === 'Budi Santoso');
  return `
    <section class="card card-large"><div class="card-title"><h3>Rekam Medis</h3></div>${records.map((item) => `<div class="timeline-item"><h4>${item.pet}</h4><p>${item.date} • ${item.diagnosis}</p></div>`).join('')}</section>
  `;
}

function renderMyVaccination() {
  const vaccinations = DATA.vaccinations.filter((item) => item.owner === 'Budi Santoso');
  return `
    <section class="card card-large"><div class="card-title"><h3>Vaksinasi</h3></div>${vaccinations.map((item) => `<div class="timeline-item"><h4>${item.pet}</h4><p>${item.vaccine} • ${item.nextDue} • ${statusBadge(item.status)}</p></div>`).join('')}</section>
  `;
}

function renderMyInvoices() {
  const invoices = DATA.customerInvoices;
  return `
    <section class="card card-large">
      <div class="card-title"><h3>Invoice Saya</h3></div>
      <div class="table-wrap"><table><thead><tr><th>No. Invoice</th><th>Tanggal</th><th>Jumlah</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${invoices.map((item) => `<tr><td>${item.id}</td><td>${item.date}</td><td>${item.amount}</td><td>${statusBadge(item.status)}</td><td><button class="btn btn-secondary" type="button" onclick="viewInvoiceReceipt('${item.id}')">View</button></td></tr>`).join('')}</tbody></table></div>
    </section>
  `;
}

function viewInvoiceReceipt(invoiceId) {
  const invoice = DATA.customerInvoices.find((item) => item.id === invoiceId);
  if (!invoice) return;
  document.getElementById('record-modal-title').textContent = `Receipt ${invoice.id}`;
  document.getElementById('record-modal-body').innerHTML = `<div class="form-card"><h4>${invoice.description}</h4><p>${invoice.date}</p><p>Total: <strong>${invoice.amount}</strong></p><p>Status: ${invoice.status}</p><button class="btn btn-primary" type="button" onclick="downloadReceipt('${invoice.id}')">Download PDF</button></div>`;
  openModal('record-modal');
}

function downloadReceipt(invoiceId) {
  closeModal('record-modal');
  showToast(`PDF mockup untuk ${invoiceId} siap diunduh`, 'info');
}

function renderMyProfile() {
  return `
    <section class="card card-large"><div class="card-title"><h3>Profil Saya</h3></div><p>Form profile user demo ditampilkan di sini.</p></section>
  `;
}

function openNewAppointment() {
  document.getElementById('record-modal-title').textContent = 'Buat Appointment Baru';
  document.getElementById('record-modal-body').innerHTML = `<div class="form-card"><label>Nama Pelanggan</label><input type="text" placeholder="Budi Santoso"><label>Hewan</label><select><option>Max (Labrador)</option><option>Bella (Shih Tzu)</option></select><label>Tanggal</label><input type="date"><label>Jam</label><input type="time"><label>Jenis Kunjungan</label><select><option>Pemeriksaan</option><option>Vaksinasi</option><option>Grooming</option></select></div>`;
  openModal('record-modal');
}

function openNewMedical() {
  document.getElementById('record-modal-title').textContent = 'Buat Rekam Medis Baru';
  document.getElementById('record-modal-body').innerHTML = `<div class="form-card"><label>Hewan</label><select><option>Max (Labrador)</option><option>Bella (Shih Tzu)</option></select><label>Keluhan</label><textarea></textarea><label>Diagnosa</label><textarea></textarea></div>`;
  openModal('record-modal');
}

function saveRecord() {
  showToast('Data berhasil disimpan', 'success');
  closeModal('record-modal');
}

function attachPOSListeners() {
  renderCart();
  const searchInput = document.getElementById('pos-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const value = searchInput.value.toLowerCase();
      document.querySelectorAll('.pos-product').forEach((button) => {
        const text = button.textContent.toLowerCase();
        button.style.display = text.includes(value) ? 'grid' : 'none';
      });
    });
  }
}

function addToCart(productId) {
  const product = DATA.products.find((item) => item.id === productId);
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
  showToast(`${product.name} ditambahkan ke keranjang`);
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  if (!cartItems || !totalElement) return;
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-state">Keranjang kosong</div>';
    totalElement.textContent = 'Rp 0';
    return;
  }
  cartItems.innerHTML = cart.map((item) => `<div class="pos-cart-item"><span>${item.name}</span><div><button class="qty-btn" type="button" onclick="changeCartQty(${item.id}, -1)">-</button><strong>${item.qty}</strong><button class="qty-btn" type="button" onclick="changeCartQty(${item.id}, 1)">+</button></div><span>${fmtRupiah(item.price * item.qty)}</span></div>`).join('');
  totalElement.textContent = fmtRupiah(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
}

function changeCartQty(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  cart = cart.filter((entry) => entry.qty > 0);
  renderCart();
}

function openPaymentModal() {
  if (!cart.length) {
    showToast('Keranjang masih kosong', 'danger');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('payment-modal-body').innerHTML = `<div class="form-card"><p>Total: <strong>${fmtRupiah(total)}</strong></p><label>Metode Pembayaran</label><select id="payment-method"><option>Tunai</option><option>QRIS</option><option>Debit Card</option><option>Transfer</option></select></div>`;
  openModal('payment-modal');
}

function processPayment() {
  const method = document.getElementById('payment-method')?.value || 'Tunai';
  cart = [];
  renderCart();
  closeModal('payment-modal');
  showToast(`Pembayaran berhasil diproses (${method})`);
}

function toggleUserMenu() {
  const dropdown = document.getElementById('user-menu-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    sessionStorage.removeItem('petcareUser');
    window.location.href = '../pages/login.html';
  }
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('user-menu-dropdown');
  if (userMenu && !userMenu.contains(e.target)) {
    dropdown?.classList.remove('active');
  }
});

function initDashboardPage() {
  if (!document.querySelector('.page-dashboard')) return;
  const stored = sessionStorage.getItem('petcareUser');
  if (!stored) {
    window.location.href = 'login.html';
    return;
  }
  try {
    currentUser = JSON.parse(stored);
  } catch (error) {
    sessionStorage.removeItem('petcareUser');
    window.location.href = 'login.html';
    return;
  }
  setTopbar();
  buildSidebar();
  buildBottomNav();
  renderView(currentView);
  
  // Set up user menu
  const userMenuName = document.getElementById('user-menu-name');
  const userMenuBtn = document.getElementById('user-menu-btn');
  if (userMenuName) userMenuName.textContent = currentUser?.name || 'User';
  if (userMenuBtn) userMenuBtn.addEventListener('click', toggleUserMenu);
  
  // Sidebar logout button (legacy, still works)
  const sidebarLogout = document.querySelector('.sidebar-logout');
  if (sidebarLogout) {
    sidebarLogout.addEventListener('click', handleLogout);
  }
  
  document.getElementById('floating-booking')?.addEventListener('click', () => navigateTo('appointments'));
  renderNotifications();
}

function renderNotifications() {
  const container = document.getElementById('notif-list');
  if (!container) return;
  const items = [
    { title: 'Appointment Baru untuk Max', time: '5 menit lalu' },
    { title: 'Vaksinasi Mochi jatuh tempo besok', time: '1 jam lalu' },
    { title: 'Grooming Luna selesai', time: '2 jam lalu' },
  ];
  container.innerHTML = items.map((item) => `<div class="timeline-item"><h4>${item.title}</h4><p>${item.time}</p></div>`).join('');
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initDashboardPage();
} else {
  document.addEventListener('DOMContentLoaded', initDashboardPage);
}
