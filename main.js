import { initHotelHeader }      from './src/components/HotelHeader.js';
import { initBookingSystem }    from './src/components/BookingSystem.js';
import { initCarousel }         from './src/components/Carousel.js';
import { initAdminPanel }       from './src/components/AdminPanel.js';
import { initLogin }            from './src/components/UserLogin.js';
import { initRegister }         from './src/components/UserRegister.js';
import { initUserReservations } from './src/components/UserReservations.js';

const app = () => {
  initHotelHeader();

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '' || page === '/') {
    initBookingSystem();
    initCarousel();
  } else if (page === 'admin.html') {
    initAdminPanel();
  } else if (page === 'login.html') {
    initLogin();
  } else if (page === 'registro.html') {
    initRegister();
  } else if (page === 'reservas.html') {
    initUserReservations();
  } else if (page === 'contacto.html') {
    initContacto();
  }
};

const initContacto = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✦ Mensaje enviado';
    btn.classList.add('btn-success');
    setTimeout(() => {
      btn.textContent = 'Enviar Mensaje';
      btn.classList.remove('btn-success');
      form.reset();
    }, 2500);
  });
};

document.addEventListener('DOMContentLoaded', app);