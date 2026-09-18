import React, { useState, useEffect } from 'react';
import { getTareas, createTarea, updateTarea, deleteTarea, type Tarea } from '../services/api';

const GestionTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState(0);
  
  // Estado para controlar qué tarea se está editando (null si se está creando una nueva)
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);

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
      if (tareaEditando && tareaEditando.id) {
        // Modo Edición
        await updateTarea(tareaEditando.id, {
          titulo,
          descripcion,
          duracion_estimada_min: duracion
        });
        setTareaEditando(null);
      } else {
        // Modo Creación
        await createTarea({
          titulo,
          descripcion,
          duracion_estimada_min: duracion
        });
      }
      limpiarFormulario();
      cargarTareas();
    } catch (error) {
      console.error('Error al procesar tarea:', error);
    }
  };

  const handleEditar = (tarea: Tarea) => {
    setTareaEditando(tarea);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setDuracion(tarea.duracion_estimada_min);
  };

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await deleteTarea(id);
        cargarTareas();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
      }
    }
  };

  const limpiarFormulario = () => {
    setTareaEditando(null);
    setTitulo('');
    setDescripcion('');
    setDuracion(0);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>[HU14] Registro y Edición de Tareas de Prueba</h2>
      
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
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, backgroundColor: tareaEditando ? '#4CAF50' : '#008CBA', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
            {tareaEditando ? 'Actualizar Tarea' : 'Guardar Tarea'}
          </button>
          {tareaEditando && (
            <button type="button" onClick={limpiarFormulario} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Tareas Registradas</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas.map((t) => (
          <li key={t.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{t.titulo}</strong> ({t.duracion_estimada_min} min)
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>{t.descripcion}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEditar(t)} style={{ padding: '5px 10px', backgroundColor: '#ff9800', border: 'none', color: 'white', cursor: 'pointer' }}>
                Editar
              </button>
              <button onClick={() => handleEliminar(t.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', border: 'none', color: 'white', cursor: 'pointer' }}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionTareas;