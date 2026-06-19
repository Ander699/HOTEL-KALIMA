import { getFromStorage, saveToStorage } from '../services/StorageService.js';
import { updateHeaderBadge } from './HotelHeader.js';

export const initUserReservations = () => {
  const container = document.getElementById('user-reservations-list');
  if (!container) return;

  const user = getFromStorage('user_session');
  if (!user || !user.email) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🔐</span>
        <h3>Inicia sesión para ver tus reservas</h3>
        <a href="login.html" class="btn-gold" style="margin-top:1rem;display:inline-block;">Iniciar Sesión</a>
      </div>`;
    return;
  }

  const render = () => {
    const todas = getFromStorage('reservas') || [];
    const mias = todas.filter(r => r.userEmail === user.email);

    if (mias.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">✦</span>
          <h3>Sin reservas aún</h3>
          <p>Explora nuestras habitaciones y vive una experiencia única.</p>
          <a href="index.html#rooms" class="btn-gold" style="margin-top:1rem;display:inline-block;">Ver Habitaciones</a>
        </div>`;
      return;
    }

    container.innerHTML = mias.map((r, i) => {
      const isPast = r.checkOut < new Date().toISOString().split('T')[0];
      const statusClass = isPast ? 'res-badge-past' : 'res-badge-active';
      const statusText = isPast ? 'Completada' : 'Confirmada ✦';

      return `
      <article class="reservation-card fade-in-up" style="animation-delay:${i*0.1}s">
        <div class="res-img-wrap">
          <img src="${r.img || 'https://via.placeholder.com/300x200/1a1a1a/c9a84c?text=Hotel'}"
               alt="${r.hotel}" loading="lazy">
        </div>
        <div class="res-body">
          <span class="res-badge ${statusClass}">${statusText}</span>
          <h3>${r.hotel}</h3>
          <div class="res-details">
            <p>📅 Reservado: <strong>${r.fechaReserva}</strong></p>
            <p>✅ Check-in: <strong>${formatDate(r.checkIn)}</strong></p>
            <p>🏁 Check-out: <strong>${formatDate(r.checkOut)}</strong></p>
            <p>👥 Personas: <strong>${r.people || 1}</strong></p>
            <p>🌙 Noches: <strong>${r.nights || 1}</strong></p>
          </div>
          <p class="res-price">
            $${(r.precio || 0).toLocaleString()} <span>/ noche</span>
            ${r.total ? `<br><strong>Total: $${r.total.toLocaleString()}</strong>` : ''}
          </p>
          ${!isPast ? `<button class="btn-danger btn-cancel-user" data-id="${r.id}" style="margin-top:1rem;width:100%;">Cancelar Reserva</button>` : ''}
        </div>
      </article>`;
    }).join('');

    container.querySelectorAll('.btn-cancel-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
          const todas = getFromStorage('reservas') || [];
          const nuevas = todas.filter(r => r.id !== id);
          saveToStorage('reservas', nuevas);
          updateHeaderBadge();
          render();
          showToast('Reserva cancelada correctamente.');
        }
      });
    });
  };

  render();
};

const formatDate = (d) => {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

const showToast = (msg) => {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-show'));
  setTimeout(() => {
    t.classList.remove('toast-show');
    setTimeout(() => t.remove(), 400);
  }, 3000);
};