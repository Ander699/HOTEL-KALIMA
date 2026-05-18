import { saveToStorage } from '../services/StorageService.js';

export const initLogin = () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email    = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showError('Por favor, completa todos los campos.');
      return;
    }

    const isAdmin = email.toLowerCase() === 'admin' && password === 'admin';

    if (!isAdmin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) {
        showError('Correo o contraseña incorrectos.');
        return;
      }

      const session = {
        email: found.email,
        fullName: found.fullName,
        idNum: found.idNum,
        isAdmin: false,
        loginDate: new Date().toLocaleString('es-CO')
      };
      saveToStorage('user_session', session);
    } else {
      saveToStorage('user_session', {
        email: 'admin',
        fullName: 'Administrador',
        isAdmin: true,
        loginDate: new Date().toLocaleString('es-CO')
      });
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✦ Bienvenido';
    btn.classList.add('btn-success');

    setTimeout(() => {
      window.location.href = isAdmin ? 'admin.html' : 'index.html';
    }, 800);
  });
};

const showError = (msg) => {
  let err = document.getElementById('login-error');
  if (!err) {
    err = document.createElement('p');
    err.id = 'login-error';
    err.className = 'form-error';
    document.getElementById('login-form').prepend(err);
  }
  err.textContent = msg;
  err.style.animation = 'none';
  requestAnimationFrame(() => { err.style.animation = ''; });
};
