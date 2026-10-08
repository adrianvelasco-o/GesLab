import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export function Login() {
  const { login } = useAuth();
  const [correoInstitucional, setCorreoInstitucional] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje(null);

    if (!correoInstitucional.trim() || !contrasena) {
      setErrorMensaje('Por favor ingrese su correo institucional y contraseña.');
      return;
    }

    setCargando(true);
    try {
      await login(correoInstitucional.trim(), contrasena);
    } catch (err) {
      setErrorMensaje(err.message || 'Credenciales inválidas. Verifique su correo y contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Cabecera azul institucional estilo Unicolmayor */}
        <div className="login-card-header">
          <div className="unicolmayor-shield">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h1 className="login-brand-title">GesLab</h1>
          <p className="login-brand-subtitle">
            Institución Universitaria Colegio Mayor del Cauca
          </p>
        </div>

        {/* Cuerpo del formulario de ingreso */}
        <div className="login-card-body">
          <div className="login-welcome">
            <h2>Ingreso al Sistema</h2>
            <p>Use sus credenciales institucionales de correo y contraseña</p>
          </div>

          {errorMensaje && (
            <div className="login-alert-error" role="alert">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMensaje}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-fields-form">
            <div className="input-group">
              <label htmlFor="correoInstitucional">Correo Electrónico Institucional</label>
              <input
                id="correoInstitucional"
                type="email"
                required
                autoComplete="email"
                placeholder="ejemplo@unicolmayor.edu.co"
                value={correoInstitucional}
                onChange={(e) => setCorreoInstitucional(e.target.value)}
                disabled={cargando}
              />
            </div>

            <div className="input-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                disabled={cargando}
              />
            </div>

            <button type="submit" className="btn-login-submit" disabled={cargando}>
              {cargando ? (
                <span>Iniciando sesión...</span>
              ) : (
                <>
                  <svg
                    className="lock-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Iniciar Sesión Seguro
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Pie de página institucional */}
      <footer className="login-page-footer">
        © 2026 GesLab - Institución Universitaria Colegio Mayor del Cauca. Todos los derechos reservados.
      </footer>
    </div>
  );
}
