# 🏨 Hotel El Rincón del Carmen — Sitio Web

Sitio web completo para el Hotel El Rincón del Carmen, desarrollado con HTML5, CSS3 y JavaScript ES6+ con arquitectura modular.

## 📁 Estructura del Proyecto

```
El Rincon/
├── index.html          # Landing page (carrusel, servicios, disponibilidad)
├── reservas.html       # Historial y cancelación de reservas del usuario
├── contacto.html       # Datos de contacto, mapa y formulario
├── login.html          # Inicio de sesión
├── registro.html       # Registro de nuevos usuarios
├── admin.html          # Panel de administración (solo admin)
├── main.js             # Punto de entrada y router
└── src/
    ├── styles.css
    ├── components/
    │   ├── HotelHeader.js       # Navbar responsive
    │   ├── BookingSystem.js     # Búsqueda y reserva de habitaciones
    │   ├── Carousel.js          # Carrusel de galería
    │   ├── AdminPanel.js        # Panel admin (reservas + gestión de habitaciones)
    │   ├── UserLogin.js
    │   ├── UserRegister.js
    │   ├── UserReservations.js  # Ver y cancelar reservas propias
    │   └── RoomCard.js
    ├── data/
    │   └── rooms.json           # Datos de habitaciones
    └── services/
        └── StorageService.js    # Abstracción de localStorage
```

## 🚀 Cómo ejecutar

Debido al uso de módulos ES6 (`type="module"`), se requiere un servidor local:

```bash
# Con Python
python -m http.server 8080

# Con Node.js / npx
npx serve .

# Con Live Server en VS Code
# Clic derecho → Open with Live Server
```

Luego abre: `http://localhost:8080`

## 👤 Credenciales de prueba

| Rol           | Correo / Usuario | Contraseña |
|---------------|------------------|------------|
| Administrador | `admin`          | `admin`    |
| Cliente       | Registrate en `/registro.html` | — |

## ✅ Funcionalidades implementadas

### Sitio público
- **Landing page** con hero, carrusel de galería, servicios e instalaciones
- **Búsqueda de disponibilidad** con filtros de fecha y número de personas
- **Tarjetas de habitación** con camas, capacidad, servicios y precio total por estadía
- **Prevención de solapamiento** de reservas (una habitación no puede reservarse dos veces en las mismas fechas)
- **Re-verificación** de disponibilidad al momento de confirmar la reserva

### Usuarios
- **Registro completo**: número de identificación, nombre completo, nacionalidad, correo, teléfono y contraseña
- **Historial de reservas** con fecha de check-in/out, personas, noches y total
- **Cancelación de reservas** por el propio usuario (la habitación vuelve a estar disponible)

### Panel de administración
- **Estadísticas**: total de reservas, reservas activas, ingresos estimados, huéspedes únicos
- **Tabla de reservas** con todos los datos y opción de cancelar
- **Gestión de habitaciones**: modificar precio, número de camas, capacidad máxima y servicios

### Contacto
- Mapa embebido de Google Maps (Girón, Santander)
- Múltiples medios: teléfono, email, WhatsApp
- Formulario de contacto

## 🛠 Tecnologías

- HTML5 semántico
- CSS3 con variables, grid, flexbox y animaciones
- JavaScript ES6+ con módulos nativos
- `localStorage` como capa de persistencia simulada

## 💾 Almacenamiento local (localStorage)

| Clave          | Contenido                              |
|----------------|----------------------------------------|
| `users`        | Array de usuarios registrados          |
| `user_session` | Sesión activa del usuario              |
| `reservas`     | Array de todas las reservas            |
| `admin_rooms`  | Modificaciones admin a habitaciones    |