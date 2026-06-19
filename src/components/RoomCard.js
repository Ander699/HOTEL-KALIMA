export const renderRoomCard = (room) => {
    const amenitiesHTML = room.amenities
      ? room.amenities.map(a => `<span class="amenity">${a}</span>`).join('')
      : '';
  
    return `
      <article class="room-card" data-id="${room.id}">
        <div class="room-img-wrap">
          <img src="${room.img}" alt="${room.name}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/600x400/1a1a1a/c9a84c?text=Habitación'">
          ${room.badge ? `<span class="room-badge">${room.badge}</span>` : ''}
        </div>
        <div class="room-body">
          <h3 class="room-name">${room.name}</h3>
          <p class="room-desc">${room.description}</p>
          <div class="room-amenities">${amenitiesHTML}</div>
          <div class="room-footer">
            <div class="room-price">
              <span class="price-amount">$${room.price}</span>
              <span class="price-label">/ noche</span>
            </div>
            <button class="btn-gold btn-reserve" data-id="${room.id}">
              Reservar
            </button>
          </div>
        </div>
      </article>
    `;
  };