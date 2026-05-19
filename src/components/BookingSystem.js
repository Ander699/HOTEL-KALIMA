import { getFromStorage, saveToStorage } from '../services/StorageService.js';
import { updateHeaderBadge } from './HotelHeader.js';

let allRooms = [];

export const initBookingSystem = async () => {
  await loadRooms();
  renderSearchForm();
  renderRooms(allRooms, null, null, 0);
};

const loadRooms = async () => {
  try {
    const res = await fetch('./src/data/rooms.json');
    allRooms = await res.json();
  } catch (e) {
    allRooms = [
      { id:101, name:"Suite Presidencial", price:250, description:"El máximo nivel de confort.", img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600", badge:"Top Pick", beds:2, maxPeople:4, amenities:["Jacuzzi","Internet","Minibar","Smart TV"] },
      { id:102, name:"Habitación Doble Deluxe", price:120, description:"Espaciosa y luminosa.", img:"https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600", badge:"Popular", beds:1, maxPeople:2, amenities:["Cama King","Internet","Minibar"] },
      { id:103, name:"Estándar Single", price:80, description:"Funcional y acogedora.", img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600", badge:null, beds:1, maxPeople:1, amenities:["Cama Queen","Internet","AC"] },
      { id:104, name:"Suite Junior", price:175, description:"Sofisticación compacta.", img:"https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600", badge:"Nuevo", beds:2, maxPeople:3, amenities:["Terraza","Minibar","Internet"] }
    ];
  }
};

const renderSearchForm = () => {
  const section = document.getElementById('rooms');
  if (!section) return;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const formHTML = `
    <div class="search-bar fade-in-up">
      <div class="search-field">
        <label>Check-in</label>
        <input type="date" id="search-checkin" value="${today}" min="${today}">
      </div>
      <div class="search-field">
        <label>Check-out</label>
        <input type="date" id="search-checkout" value="${tomorrow}" min="${tomorrow}">
      </div>
      <div class="search-field">
        <label>Personas</label>
        <select id="search-people">
          <option value="1">1 persona</option>
          <option value="2">2 personas</option>
          <option value="3">3 personas</option>
          <option value="4">4 personas</option>
          <option value="5">5 personas</option>
          <option value="6">6 personas</option>
        </select>
      </div>
      <button id="btn-search" class="btn-gold">Buscar Disponibilidad</button>
    </div>
    <div id="search-result-info" class="search-result-info" style="display:none"></div>
  `;

  section.insertAdjacentHTML('afterbegin', formHTML);

  document.getElementById('search-checkin').addEventListener('change', syncCheckout);
  document.getElementById('btn-search').addEventListener('click', doSearch);
};

const syncCheckout = () => {
  const ci = document.getElementById('search-checkin').value;
  const co = document.getElementById('search-checkout');
  if (ci && co.value <= ci) {
    const next = new Date(ci);
    next.setDate(next.getDate() + 1);
    co.value = next.toISOString().split('T')[0];
  }
  co.min = new Date(new Date(ci).getTime() + 86400000).toISOString().split('T')[0];
};

const doSearch = () => {
  const checkIn  = document.getElementById('search-checkin').value;
  const checkOut = document.getElementById('search-checkout').value;
  const people   = parseInt(document.getElementById('search-people').value);

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    showToast('⚠️ Selecciona fechas válidas (salida debe ser posterior a entrada)', 'warn');
    return;
  }

  const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  const available = allRooms.filter(r => r.maxPeople >= people && isRoomAvailable(r.id, checkIn, checkOut));

  const infoEl = document.getElementById('search-result-info');
  infoEl.style.display = 'block';

  if (available.length === 0) {
    infoEl.innerHTML = `<p class="search-none">No hay habitaciones disponibles para ${people} persona(s) del ${formatDate(checkIn)} al ${formatDate(checkOut)}. Prueba otras fechas.</p>`;
  } else {
    infoEl.innerHTML = `<p class="search-found">✦ ${available.length} habitación(es) disponible(s) para <strong>${people} persona(s)</strong> — ${nights} noche(s)</p>`;
  }

  renderRooms(available, checkIn, checkOut, nights, people);

  const btn = document.getElementById('btn-search');
  btn.textContent = `${available.length} disponible(s)`;
  setTimeout(() => { btn.textContent = 'Buscar Disponibilidad'; }, 3000);
};

const isRoomAvailable = (roomId, checkIn, checkOut) => {
  const reservas = getFromStorage('reservas') || [];
  return !reservas.some(r => {
    if (r.roomId !== roomId) return false;
    // Overlap: existing [rCI, rCO] overlaps [checkIn, checkOut] if rCI < checkOut && rCO > checkIn
    return r.checkIn < checkOut && r.checkOut > checkIn;
  });
};

const renderRooms = (rooms, checkIn, checkOut, nights, people) => {
  const container = document.getElementById('rooms-container');
  if (!container) return;

  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🔍</span>
        <h3>Sin resultados</h3>
        <p>Prueba con otras fechas o menor número de personas.</p>
      </div>`;
    return;
  }

  container.innerHTML = rooms.map((r, i) => {
    const amenitiesHTML = (r.amenities || []).map(a => `<span class="amenity">${a}</span>`).join('');
    const totalPrice = nights > 0 ? `<span class="price-total">Total: $${(r.price * nights).toLocaleString()} (${nights} noche${nights > 1 ? 's' : ''})</span>` : '';
    return `
    <article class="room-card fade-in-up" style="animation-delay:${i*0.1}s" data-id="${r.id}">
      <div class="room-img-wrap">
        <img src="${r.img}" alt="${r.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/600x400/1a1a1a/c9a84c?text=Habitación'">
        ${r.badge ? `<span class="room-badge">${r.badge}</span>` : ''}
      </div>
      <div class="room-body">
        <h3 class="room-name">${r.name}</h3>
        <p class="room-desc">${r.description}</p>
        <div class="room-meta">
          <span class="meta-item">🛏 ${r.beds} cama${r.beds > 1 ? 's' : ''}</span>
          <span class="meta-item">👥 Hasta ${r.maxPeople} persona${r.maxPeople > 1 ? 's' : ''}</span>
        </div>
        <div class="room-amenities">${amenitiesHTML}</div>
        <div class="room-footer">
          <div class="room-price">
            <span class="price-amount">$${r.price.toLocaleString()}</span>
            <span class="price-label">/ noche</span>
            ${totalPrice}
          </div>
          <button class="btn-gold btn-reserve"
            data-id="${r.id}"
            data-checkin="${checkIn || ''}"
            data-checkout="${checkOut || ''}"
            data-people="${people || 1}"
            data-nights="${nights}">
            ${checkIn ? 'Reservar' : 'Seleccionar fechas ↑'}
          </button>
        </div>
      </div>
    </article>`;
  }).join('');

  container.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', handleReserve);
  });
};

const handleReserve = (e) => {
  const btn = e.currentTarget;
  const id       = parseInt(btn.dataset.id);
  const checkIn  = btn.dataset.checkin;
  const checkOut = btn.dataset.checkout;
  const people   = parseInt(btn.dataset.people) || 1;
  const nights   = parseInt(btn.dataset.nights) || 0;

  if (!checkIn || !checkOut) {
    showToast('⚠️ Primero selecciona las fechas de tu estadía', 'warn');
    document.getElementById('search-checkin')?.focus();
    return;
  }

  const user = getFromStorage('user_session');
  if (!user || !user.email) {
    if (confirm('Debes iniciar sesión para reservar. ¿Ir al login?')) {
      window.location.href = 'login.html';
    }
    return;
  }

  const room = allRooms.find(r => r.id === id);
  if (!room) return;

  // Re-verificar disponibilidad justo antes de confirmar
  if (!isRoomAvailable(id, checkIn, checkOut)) {
    showToast('❌ Lo sentimos, esta habitación ya no está disponible para esas fechas.', 'error');
    doSearch(); // Refresh results
    return;
  }

  const total = room.price * nights;
  const confirmMsg = `¿Confirmar reserva?\n\n🏨 ${room.name}\n📅 ${formatDate(checkIn)} → ${formatDate(checkOut)}\n👥 ${people} persona(s)\n🌙 ${nights} noche(s)\n💰 Total: $${total.toLocaleString()}`;

  if (!confirm(confirmMsg)) return;

  const reservas = getFromStorage('reservas') || [];
  const nueva = {
    id: Date.now(),
    roomId: room.id,
    hotel: room.name,
    precio: room.price,
    total,
    nights,
    people,
    img: room.img,
    checkIn,
    checkOut,
    fechaReserva: new Date().toLocaleDateString('es-CO'),
    userEmail: user.email,
    userName: user.fullName || user.email,
    estado: 'confirmada'
  };

  reservas.push(nueva);
  saveToStorage('reservas', reservas);
  updateHeaderBadge();

  showToast(`✦ Reserva confirmada para ${room.name}!`);
  doSearch(); // Refresh to show room as unavailable
};

const formatDate = (d) => {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

const showToast = (msg, type = 'success') => {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-show'));
  setTimeout(() => {
    t.classList.remove('toast-show');
    setTimeout(() => t.remove(), 400);
  }, 3500);
};