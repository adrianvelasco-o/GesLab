import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import GestionTareas from './pages/GestionTareas';
import FormularioPreTest from './pages/FormularioPreTest';
import { getSalud, subirDocumentoPdf } from './services/api';

// Componente para probar la subida de documentos PDF
function SubirDocumento() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [practicaId, setPracticaId] = useState<number>(1);
  const [mensaje, setMensaje] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  const handleSubir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      setMensaje('Por favor selecciona un archivo PDF primero.');
      return;
    }
    setCargando(true);
    setMensaje('');
    try {
      const res = await subirDocumentoPdf(archivo, practicaId);
      setMensaje(res.data?.mensaje || '¡Documento PDF subido con éxito!');
    } catch (err: any) {
      setMensaje(err.response?.data?.mensaje || 'Error al subir el archivo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px 0' }}>
      <h2>Carga de Documentos (PDF)</h2>
      <form onSubmit={handleSubir} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>ID de Práctica: </label>
          <input
            type="number"
            value={practicaId}
            onChange={(e) => setPracticaId(Number(e.target.value))}
            min="1"
            style={{ padding: '4px 8px', width: '80px' }}
          />
        </div>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)}
        />

        <button type="submit" disabled={cargando} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {cargando ? 'Subiendo...' : 'Subir PDF'}
        </button>
      </form>
      {mensaje && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  );
}

// Componente para consultar el estado del Backend (/api/salud) con Badge Visual
function EstadoSalud() {
  const [estaActivo, setEstaActivo] = useState<boolean | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    getSalud()
      .then((res) => {
        // Verifica si la API respondió con exito === true
        if (res.data?.exito) {
          setEstaActivo(true);
        } else {
          setEstaActivo(false);
        }
      })
      .catch(() => {
        setEstaActivo(false);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
      <h2>Estado del Backend (Endpoint)</h2>

      {cargando ? (
        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Verificando conexión...</span>
      ) : (
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
          {/* Punto indicador con luz */}
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
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <nav style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/tareas" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0066cc' }}>
            [HU14] Gestión de Tareas
          </Link>
          <Link to="/pretest" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0066cc' }}>
            [HU15] Cuestionario Pre-Test
          </Link>
          <Link to="/documentos" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0066cc' }}>
            Carga de Documentos
          </Link>
          <Link to="/salud" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0066cc' }}>
            Estado API
          </Link>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<h2>Selecciona una opción del menú superior</h2>} />
          <Route path="/tareas" element={<GestionTareas />} />
          <Route path="/pretest" element={<FormularioPreTest />} />
          <Route path="/documentos" element={<SubirDocumento />} />
          <Route path="/salud" element={<EstadoSalud />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;