import React from 'react';

export function EstadoBackend({ estadoSalud, cargando, error }) {
  const estaActivo = estadoSalud?.exito && !error;

  if (cargando) {
    return <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Verificando conexión...</span>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '15px 0' }}>
      {/* Insignia visual (Badge) */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 20px',
          borderRadius: '25px',
          fontWeight: 'bold',
          fontSize: '1rem',
          backgroundColor: estaActivo ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${estaActivo ? '#22c55e' : '#ef4444'}`,
          color: estaActivo ? '#4ade80' : '#f87171',
        }}
      >
        {/* Punto indicador con luz/brillo */}
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: estaActivo ? '#22c55e' : '#ef4444',
            boxShadow: `0 0 8px ${estaActivo ? '#22c55e' : '#ef4444'}`,
          }}
        />
        {estaActivo ? 'Activo' : 'Desconectado'}
      </div>

      {/* Timestamp legible si existe */}
      {estadoSalud?.timestamp && (
        <span style={{ fontSize: '0.8rem', color: '#888' }}>
          Última verificación: {new Date(estadoSalud.timestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}