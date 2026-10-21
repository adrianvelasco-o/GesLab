/**
 * Configuración centralizada de variables de entorno del Frontend
 */
export const CONFIG = Object.freeze({
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  MODO: import.meta.env.MODE || 'development'
});
