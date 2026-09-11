import React, { useState } from 'react';
import { crearPreTest } from '../services/api';

export const FormularioPreTest = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(18);
  const [experiencia, setExperiencia] = useState('Intermedio');
  const [obs, setObs] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearPreTest({ nombreParticipante: nombre, edad, experienciaTecnologica: experiencia, observaciones: obs });
      setMensaje('Pre-Test guardado con éxito');
      setNombre(''); setObs('');
    } catch {
      setMensaje('Error al guardar');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>[HU15] Formulario Pre-Test (Evaluador)</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <input placeholder="Nombre del Participante" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="number" placeholder="Edad" value={edad} onChange={(e) => setEdad(Number(e.target.value))} required />
        <select value={experiencia} onChange={(e) => setExperiencia(e.target.value)}>
          <option value="Bajo">Bajo</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
        <textarea placeholder="Observaciones iniciales" value={obs} onChange={(e) => setObs(e.target.value)} />
        <button type="submit">Registrar Pre-Test</button>
      </form>
    </div>
  );
};