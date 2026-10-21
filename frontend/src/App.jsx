import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Login } from './pages/Login.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import './App.css';

function ContenidoApp() {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Cargando sesión de GesLab...</p>
      </div>
    );
  }

  return autenticado ? <Dashboard /> : <Login />;
}

export function App() {
  return (
    <AuthProvider>
      <ContenidoApp />
    </AuthProvider>
  );
}

export default App;
