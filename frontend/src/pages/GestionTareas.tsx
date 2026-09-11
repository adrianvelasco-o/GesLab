import React, { useState, useEffect } from 'react';
import { getTareas, createTarea, type Tarea } from '../services/api';

const GestionTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState(0);

  const cargarTareas = async () => {
    try {
      const res = await getTareas();
      setTareas(res.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTarea({
        titulo,
        descripcion,
        duracion_estimada_min: duracion
      });
      setTitulo('');
      setDescripcion('');
      setDuracion(0);
      cargarTareas();
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>[HU14] Registro de Tareas de Prueba</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <input 
          placeholder="Título de la tarea" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Descripción del paso a paso" 
          value={descripcion} 
          onChange={(e) => setDescripcion(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Duración estimada (min)" 
          value={duracion || ''} 
          onChange={(e) => setDuracion(Number(e.target.value))} 
          required 
        />
        <button type="submit">Guardar Tarea</button>
      </form>

      <h3>Tareas Registradas</h3>
      <ul>
        {tareas.map((t) => (
          <li key={t.id}>
            <strong>{t.titulo}</strong> ({t.duracion_estimada_min} min) - {t.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionTareas;