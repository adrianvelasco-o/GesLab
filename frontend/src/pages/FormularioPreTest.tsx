import React, { useState, useEffect } from 'react';
import { getPreTests, createPreTest, updatePreTest, deletePreTest, type PreTest } from '../services/api';

const FormularioPreTest = () => {
  const [pretests, setPretests] = useState<PreTest[]>([]);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState<number | ''>(18);
  const [experiencia, setExperiencia] = useState('Intermedio');
  const [obs, setObs] = useState('');
  const [pretestEditando, setPretestEditando] = useState<PreTest | null>(null);

  const cargarPretests = async () => {
    try {
      const res = await getPreTests();
      setPretests(res.data);
    } catch (error) {
      console.error('Error al cargar pre-tests:', error);
    }
  };

  useEffect(() => {
    cargarPretests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nombre_participante: nombre,
      edad: Number(edad),
      experiencia_tecnologica: experiencia,
      observaciones: obs
    };

    try {
      if (pretestEditando && pretestEditando.id) {
        await updatePreTest(pretestEditando.id, payload);
      } else {
        await createPreTest(payload);
      }
      limpiarFormulario();
      cargarPretests();
    } catch (error) {
      console.error('Error al procesar pre-test:', error);
    }
  };

  const handleEditar = (item: PreTest) => {
    setPretestEditando(item);
    setNombre(item.nombre_participante);
    setEdad(item.edad);
    setExperiencia(item.experiencia_tecnologica);
    setObs(item.observaciones || '');
  };

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    if (confirm('¿Estás seguro de que deseas eliminar este registro de Pre-Test?')) {
      try {
        await deletePreTest(id);
        cargarPretests();
      } catch (error) {
        console.error('Error al eliminar pre-test:', error);
      }
    }
  };

  const limpiarFormulario = () => {
    setPretestEditando(null);
    setNombre('');
    setEdad(18);
    setExperiencia('Intermedio');
    setObs('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h2>[HU15] Formulario Pre-Test (Evaluador)</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
        <input 
          placeholder="Nombre del Participante" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Edad" 
          value={edad} 
          onChange={(e) => setEdad(e.target.value === '' ? '' : Number(e.target.value))} 
          required 
        />
        <select value={experiencia} onChange={(e) => setExperiencia(e.target.value)}>
          <option value="Bajo">Bajo</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
        <textarea 
          placeholder="Observaciones iniciales" 
          value={obs} 
          onChange={(e) => setObs(e.target.value)} 
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, backgroundColor: pretestEditando ? '#4CAF50' : '#008CBA', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
            {pretestEditando ? 'Actualizar Pre-Test' : 'Registrar Pre-Test'}
          </button>
          {pretestEditando && (
            <button type="button" onClick={limpiarFormulario} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Registros de Pre-Test Realizados</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pretests.map((p) => (
          <li key={p.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{p.nombre_participante}</strong> ({p.edad} años) - Exp: <em>{p.experiencia_tecnologica}</em>
              {p.observaciones && <p style={{ margin: '5px 0 0 0', color: '#666' }}>Obs: {p.observaciones}</p>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEditar(p)} style={{ padding: '5px 10px', backgroundColor: '#ff9800', border: 'none', color: 'white', cursor: 'pointer' }}>
                Editar
              </button>
              <button onClick={() => handleEliminar(p.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', border: 'none', color: 'white', cursor: 'pointer' }}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormularioPreTest;