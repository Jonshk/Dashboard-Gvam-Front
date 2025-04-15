// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:8000',
  bypassAuthGuards: true  // Establece a true durante el desarrollo
};
// Puedes cambiar esto a false en producción
// para habilitar las protecciones de autenticación
// y autorización en las rutas de la aplicación.
// Recuerda que esto es solo para fines de desarrollo
// y no debe usarse en producción.