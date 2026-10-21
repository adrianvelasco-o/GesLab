import { CONFIG } from '../config/ambiente.js';

const TOKEN_STORAGE_KEY = 'geslab_token';

/**
 * Obtiene el token JWT almacenado.
 */
export function obtenerToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Guarda el token JWT en el almacenamiento local.
 */
export function guardarToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

/**
 * Elimina el token JWT almacenado.
 */
export function eliminarToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Cliente HTTP universal para peticiones a la API de GesLab.
 * @param {string} ruta - Endpoint relativo (ej: '/autenticacion/iniciar-sesion')
 * @param {RequestInit} [opciones] - Opciones de fetch (método, body, etc.)
 */
export async function clienteApi(ruta, opciones = {}) {
  const url = `${CONFIG.API_URL}${ruta.startsWith('/') ? ruta : `/${ruta}`}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(opciones.headers || {})
  };

  const token = obtenerToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const configuracion = {
    ...opciones,
    headers
  };

  try {
    const respuesta = await fetch(url, configuracion);
    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      const mensajeError =
        datos?.mensaje ||
        datos?.error ||
        `Error en la petición: HTTP ${respuesta.status}`;
      const error = new Error(mensajeError);
      error.status = respuesta.status;
      error.datos = datos;
      throw error;
    }

    return datos;
  } catch (error) {
    // Si la sesión expiró o el token es inválido (401), limpiar token
    if (error.status === 401 && !ruta.includes('/autenticacion/iniciar-sesion')) {
      eliminarToken();
    }
    throw error;
  }
}
