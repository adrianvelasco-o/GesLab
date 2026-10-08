import { clienteApi, guardarToken, eliminarToken } from './api.js';

const USUARIO_STORAGE_KEY = 'geslab_usuario';

/**
 * Servicio de Autenticación para GesLab.
 */
export const authService = {
  /**
   * Inicia sesión con credenciales institucionales.
   * @param {string} correoInstitucional
   * @param {string} contrasena
   * @returns {Promise<{token: string, usuario: object}>}
   */
  async iniciarSesion(correoInstitucional, contrasena) {
    const respuesta = await clienteApi('/autenticacion/iniciar-sesion', {
      method: 'POST',
      body: JSON.stringify({ correoInstitucional, contrasena })
    });

    if (respuesta?.datos?.token) {
      guardarToken(respuesta.datos.token);
      localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(respuesta.datos.usuario));
    }

    return respuesta.datos;
  },

  /**
   * Obtiene el perfil del usuario autenticado actual.
   */
  async obtenerMiPerfil() {
    const respuesta = await clienteApi('/autenticacion/perfil', {
      method: 'GET'
    });
    return respuesta.datos;
  },

  /**
   * Cierra la sesión activa y elimina datos del almacenamiento local.
   */
  cerrarSesion() {
    eliminarToken();
    localStorage.removeItem(USUARIO_STORAGE_KEY);
  },

  /**
   * Obtiene el usuario guardado localmente en caché.
   */
  obtenerUsuarioAlmacenado() {
    try {
      const data = localStorage.getItem(USUARIO_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Consulta el estado de salud del servidor Backend.
   */
  async verificarSalud() {
    return clienteApi('/salud', { method: 'GET' });
  }
};
