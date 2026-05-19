import { getFromStorage, removeFromStorage } from '../services/StorageService.js';

export const initHotelHeader = () => {
  const el = document.getElementById('main-header');
  if (!el) return;

  const render = () => {
    const user = getFromStorage('user_session') || {};
    const reservas = getFromStorage('reservas') || [];
    const misReservas = user.email
      ? reservas.filter(r => r.userEmail === user.email).length
      : 0;
    const name = user.fullName || user.email || null;

    el.innerHTML = `
      <nav class="navbar">
        <div class="nav-logo">
          <a href="index.html">
            <span class="logo-icon">✦</span>
            <span class="logo-text">El Rincón<em>del Carmen</em></span>
          </a>
        </div>

        <button class="nav-toggle" id="nav-toggle" aria-label="Menú">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav-links" id="nav-links">
          <li><a href="index.html">Inicio</a></li>
          <li><a href="reservas.html">Mis Reservas
            ${misReservas > 0 ? `<span class="nav-badge">${misReservas}</span>` : ''}
          </a></li>
          <li><a href="contacto.html">Contacto</a></li>
          ${user.isAdmin ? '<li><a href="admin.html" class="nav-admin">Admin ✦</a></li>' : ''}
        </ul>

        <div class="nav-user">
          ${name
            ? `<span class="nav-greeting">Hola, <strong>${name.split(' ')[0]}</strong></span>
               <button id="btn-logout" class="btn-ghost">Salir</button>`
            : `<a href="login.html" class="btn-gold">Ingresar</a>`
          }
        </div>
      </nav>
    `;

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        removeFromStorage('user_session');
        window.location.href = 'login.html';
      });
    }

    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
      });
    }
  };

  render();
};

export const updateHeaderBadge = () => {
  const user = getFromStorage('user_session') || {};
  const reservas = getFromStorage('reservas') || [];
  const count = user.email ? reservas.filter(r => r.userEmail === user.email).length : 0;
  const badge = document.querySelector('.nav-badge');
  if (badge) badge.textContent = count;
  else {
    const link = document.querySelector('.nav-links a[href="reservas.html"]');
    if (link && count > 0) {
      link.insertAdjacentHTML('beforeend', `<span class="nav-badge">${count}</span>`);
    }
  }
};
