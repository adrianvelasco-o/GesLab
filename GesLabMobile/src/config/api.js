/**
 * Configuración de URLs para conexión con el Backend GesLab
 *
 * Guía de conexión:
 * 1. Emulador Android (Android Studio): Usar 'http://10.0.2.2:3000/api'
 * 2. Teléfono Físico en Red Local: Usar 'http://<TU_IP_LOCAL>:3000/api' (ej: 'http://192.168.1.15:3000/api')
 * 3. iOS Simulator: Usar 'http://localhost:3000/api'
 */

export const API_CONFIG = Object.freeze({
  BASE_URL_EMULADOR: 'http://10.0.2.2:3000/api',
  BASE_URL_LOCALHOST: 'http://localhost:3000/api',
  BASE_URL_RED_LOCAL: 'http://192.168.1.7:3000/api',

  // URL Activa para peticiones en el cliente móvil
  URL_ACTIVA: 'http://10.0.2.2:3000/api'
});
