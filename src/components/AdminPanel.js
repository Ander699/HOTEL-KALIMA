import { getFromStorage, saveToStorage } from '../services/StorageService.js';

export const initAdminPanel = () => {
  const user = getFromStorage('user_session') || {};

  if (!user.isAdmin) {
    document.querySelector('main').innerHTML = `
      <div class="access-denied">
        <span class="denied-icon">✦</span>
        <h2>Acceso Restringido</h2>
        <p>Solo administradores pueden ver esta página.</p>
        <a href="login.html" class="btn-gold">Iniciar Sesión</a>
      </div>`;
    return;
  }

  renderAdmin();
};

const renderAdmin = () => {
  const tbody = document.getElementById('admin-table-body');
  const stats = document.getElementById('admin-stats');
  const roomsSection = document.getElementById('admin-rooms-section');

  refreshReservations(tbody, stats);
  loadRoomsPanel(roomsSection);
};

const refreshReservations = (tbody, stats) => {
  const reservas = getFromStorage('reservas') || [];

  // Stats
  if (stats) {
    const total    = reservas.length;
    const ingresos = reservas.reduce((s, r) => s + (Number(r.total) || Number(r.precio) || 0), 0);
    const usuarios = [...new Set(reservas.map(r => r.userEmail))].length;
    const activas  = reservas.filter(r => r.checkOut >= new Date().toISOString().split('T')[0]).length;

    stats.innerHTML = `
      <div class="stat-card">
        <span class="stat-num">${total}</span>
        <span class="stat-label">Reservas totales</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${activas}</span>
        <span class="stat-label">Reservas activas</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">$${ingresos.toLocaleString()}</span>
        <span class="stat-label">Ingresos estimados</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${usuarios}</span>
        <span class="stat-label">Huéspedes únicos</span>
      </div>`;
  }

  if (!tbody) return;

  if (reservas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-row">No hay reservas en el sistema.</td></tr>';
    return;
  }

  tbody.innerHTML = reservas.map((r, i) => {
    const isPast = r.checkOut < new Date().toISOString().split('T')[0];
    return `
    <tr class="fade-in-up" style="animation-delay:${i*0.04}s">
      <td>${i + 1}</td>
      <td><strong>${r.hotel || r.name || 'N/A'}</strong></td>
      <td>${r.userName || r.userEmail || 'Invitado'}<br><small style="opacity:.6">${r.userEmail || ''}</small></td>
      <td>${formatDate(r.checkIn)}</td>
      <td>${formatDate(r.checkOut)}</td>
      <td>${r.people || 1} pers. / ${r.nights || 1} noche${(r.nights||1)>1?'s':''}</td>
      <td>$${(r.total || r.precio || 0).toLocaleString()}</td>
      <td>
        ${!isPast ? `<button class="btn-danger btn-cancel" data-id="${r.id}" data-index="${i}">Cancelar</button>` : '<span style="opacity:.5">Finalizada</span>'}
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id  = parseInt(e.currentTarget.dataset.id);
      const idx = parseInt(e.currentTarget.dataset.index);
      if (confirm('¿Cancelar esta reserva? La habitación quedará disponible.')) {
        const actuales = getFromStorage('reservas') || [];
        // Remove by id if available, otherwise by index
        const nuevas = id ? actuales.filter(r => r.id !== id) : actuales.filter((_, i) => i !== idx);
        saveToStorage('reservas', nuevas);
        const tbody2 = document.getElementById('admin-table-body');
        const stats2 = document.getElementById('admin-stats');
        refreshReservations(tbody2, stats2);
      }
    });
  });
};

const loadRoomsPanel = async (section) => {
  if (!section) return;

  let rooms = [];
  try {
    const res = await fetch('./src/data/rooms.json');
    rooms = await res.json();
  } catch (e) { rooms = []; }

  // Merge with any admin overrides stored locally
  const overrides = getFromStorage('admin_rooms') || {};
  rooms = rooms.map(r => ({ ...r, ...(overrides[r.id] || {}) }));

  section.innerHTML = `
    <h2 class="section-title" style="margin-top:3rem">Gestión de Habitaciones</h2>
    <div class="section-line"></div>
    <div class="rooms-admin-grid">
      ${rooms.map(r => `
        <div class="room-admin-card">
          <img src="${r.img}" alt="${r.name}" style="width:100%;height:160px;object-fit:cover;border-radius:8px;">
          <h4>${r.name} <span style="font-size:.8em;opacity:.6">#${r.id}</span></h4>
          <div class="room-admin-fields" data-roomid="${r.id}">
            <label>Precio/noche ($)
              <input type="number" class="ra-price" value="${r.price}" min="0">
            </label>
            <label>Camas
              <input type="number" class="ra-beds" value="${r.beds || 1}" min="1" max="10">
            </label>
            <label>Máx. personas
              <input type="number" class="ra-maxpeople" value="${r.maxPeople || 2}" min="1" max="20">
            </label>
            <label>Servicios (separados por coma)
              <input type="text" class="ra-amenities" value="${(r.amenities || []).join(', ')}">
            </label>
            <button class="btn-gold btn-save-room" data-roomid="${r.id}">Guardar cambios</button>
          </div>
        </div>`).join('')}
    </div>`;

  section.querySelectorAll('.btn-save-room').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = parseInt(e.currentTarget.dataset.roomid);
      const wrap   = section.querySelector(`.room-admin-fields[data-roomid="${roomId}"]`);
      const price     = parseFloat(wrap.querySelector('.ra-price').value);
      const beds      = parseInt(wrap.querySelector('.ra-beds').value);
      const maxPeople = parseInt(wrap.querySelector('.ra-maxpeople').value);
      const amenities = wrap.querySelector('.ra-amenities').value.split(',').map(s => s.trim()).filter(Boolean);

      const overrides = getFromStorage('admin_rooms') || {};
      overrides[roomId] = { price, beds, maxPeople, amenities };
      saveToStorage('admin_rooms', overrides);

      btn.textContent = '✦ Guardado';
      btn.classList.add('btn-success');
      setTimeout(() => { btn.textContent = 'Guardar cambios'; btn.classList.remove('btn-success'); }, 2000);
    });
  });
};

const formatDate = (d) => {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};