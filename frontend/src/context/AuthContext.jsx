import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';
import { obtenerToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar y verificar sesión activa
  useEffect(() => {
    async function inicializarSesion() {
      const token = obtenerToken();
      if (!token) {
        setCargando(false);
        return;
      }

      // Cargar usuario guardado para respuesta instantánea en UI
      const usuarioLocal = authService.obtenerUsuarioAlmacenado();
      if (usuarioLocal) {
        setUsuario(usuarioLocal);
      }

      // Validar token contra el backend
      try {
        const perfilActualizado = await authService.obtenerMiPerfil();
        setUsuario(perfilActualizado);
      } catch (err) {
        console.warn('Sesión previa inválida o expirada:', err.message);
        authService.cerrarSesion();
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    }

    inicializarSesion();
  }, []);

  const login = useCallback(async (correoInstitucional, contrasena) => {
    setError(null);
    try {
      const datos = await authService.iniciarSesion(correoInstitucional, contrasena);
      setUsuario(datos.usuario);
      return datos;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.cerrarSesion();
    setUsuario(null);
    setError(null);
  }, []);

  const valor = {
    usuario,
    autenticado: !!usuario,
    cargando,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
