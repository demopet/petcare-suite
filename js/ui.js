let currentUser = null;
let currentView = 'dashboard';
let cart = [];

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function fmtRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function statusBadge(status) {
  const map = {
    confirmed: ['badge-success', 'Konfirmasi'],
    waiting: ['badge-warning', 'Menunggu'],
    completed: ['badge-success', 'Selesai'],
    cancelled: ['badge-danger', 'Batal'],
    active: ['badge-success', 'Aktif'],
    inactive: ['badge-danger', 'Nonaktif'],
    paid: ['badge-success', 'Lunas'],
    unpaid: ['badge-warning', 'Belum Bayar'],
    valid: ['badge-success', 'Valid'],
    due: ['badge-warning', 'Jatuh Tempo'],
    overdue: ['badge-danger', 'Terlambat'],
    'follow-up': ['badge-info', 'Follow Up'],
    'in-progress': ['badge-info', 'Proses'],
    owner: ['badge-success', 'Owner'],
    doctor: ['badge-info', 'Dokter'],
    staff: ['badge-warning', 'Staff'],
    customer: ['badge-soft', 'Customer'],
  };
  const [cls, label] = map[status] || ['badge-soft', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.closest('.modal-overlay') && !target.closest('.modal')) {
    target.closest('.modal-overlay')?.classList.remove('open');
  }

  if (target.closest('.faq-item')) {
    const button = target.closest('.faq-item');
    const id = button.dataset.faq;
    const panel = document.querySelector(`.faq-panel[data-panel="${id}"]`);
    button.classList.toggle('active');
    panel?.classList.toggle('active');
  }
});

function mountRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  reveals.forEach((item) => observer.observe(item));
}

function mountCountUp() {
  const items = document.querySelectorAll('[data-target]');
  items.forEach((el) => {
    const target = Number(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.round(target / 36));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(interval);
      } else {
        el.textContent = current;
      }
    }, 20);
  });
}

function initLandingPage() {
  if (document.querySelector('.page-landing')) {
    mountRevealAnimations();
    mountCountUp();
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Pesan Anda telah dikirim. Kami akan menghubungi segera.');
    form.reset();
  });
}

function attachSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('sidebar-collapsed'));
}

function attachDemoAccountButtons() {
  const cards = document.querySelectorAll('.demo-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const email = card.dataset.email;
      const role = card.dataset.role;
      document.getElementById('login-email').value = email;
      document.getElementById('login-role').value = role;
      showToast(`Akun ${role.charAt(0).toUpperCase() + role.slice(1)} dipilih`, 'info');
    });
  });
}

function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  const existing = sessionStorage.getItem('petcareUser');
  if (existing) {
    window.location.href = 'dashboard.html';
    return;
  }
  attachDemoAccountButtons();
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const role = document.getElementById('login-role').value;
    if (!email || !password) {
      showToast('Lengkapi email dan password', 'danger');
      return;
    }
    if (password !== 'demo123') {
      showToast('Password salah', 'danger');
      return;
    }
    if (!USERS[email]) {
      showToast('Akun tidak ditemukan', 'danger');
      return;
    }
    currentUser = { ...USERS[email], role, roleLabel: { owner: 'Owner', doctor: 'Doctor', staff: 'Staff', customer: 'Customer' }[role] };
    sessionStorage.setItem('petcareUser', JSON.stringify(currentUser));
    window.location.href = 'dashboard.html';
  });
}

function mountLucideIcons() {
  if (window.lucide?.replace) {
    lucide.replace();
  }
}

function init() {
  mountLucideIcons();
  initLandingPage();
  initContactForm();
  initLoginPage();
  attachSidebarToggle();
}

document.addEventListener('DOMContentLoaded', init);
