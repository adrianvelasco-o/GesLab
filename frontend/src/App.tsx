import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import GestionTareas from './pages/GestionTareas';
import FormularioPreTest from './pages/FormularioPreTest';

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <nav style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
          <Link to="/tareas" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0066cc' }}>
            [HU14] Gestión de Tareas
          </Link>
          <Link to="/pretest" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0066cc' }}>
            [HU15] Cuestionario Pre-Test
          </Link>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<h2>Selecciona una opción del menú superior</h2>} />
          <Route path="/tareas" element={<GestionTareas />} />
          <Route path="/pretest" element={<FormularioPreTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;