export const initRegister = () => {
    const form = document.getElementById('register-form');
    if (!form) return;
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const idNum      = document.getElementById('reg-id').value.trim();
      const fullName   = document.getElementById('reg-name').value.trim();
      const nationality= document.getElementById('reg-nationality').value;
      const phone      = document.getElementById('reg-phone').value.trim();
      const email      = document.getElementById('reg-email').value.trim();
      const password   = document.getElementById('reg-password').value;
      const confirm    = document.getElementById('reg-confirm').value;
  
      if (!idNum || !fullName || !nationality || !phone || !email || !password || !confirm) {
        showError('Completa todos los campos.'); return;
      }
      if (!/^\d{6,12}$/.test(idNum)) {
        showError('El número de identificación debe tener entre 6 y 12 dígitos.'); return;
      }
      if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres.'); return;
      }
      if (password !== confirm) {
        showError('Las contraseñas no coinciden.'); return;
      }
  
      const users = JSON.parse(localStorage.getItem('users') || '[]');
  
      if (users.find(u => u.idNum === idNum)) {
        showError('Ese número de identificación ya está registrado.'); return;
      }
      if (users.find(u => u.email === email)) {
        showError('Ese correo ya está registrado.'); return;
      }
  
      users.push({ idNum, fullName, nationality, phone, email, password, role: 'client' });
      localStorage.setItem('users', JSON.stringify(users));
  
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '✦ Cuenta creada';
      btn.classList.add('btn-success');
  
      setTimeout(() => { window.location.href = 'login.html'; }, 900);
    });
  };
  
  const showError = (msg) => {
    let err = document.getElementById('reg-error');
    if (!err) {
      err = document.createElement('p');
      err.id = 'reg-error';
      err.className = 'form-error';
      document.getElementById('register-form').prepend(err);
    }
    err.textContent = msg;
  };