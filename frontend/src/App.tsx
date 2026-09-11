import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GestionTareas } from './pages/GestionTareas';
import { FormularioPreTest } from './pages/FormularioPreTest';

export function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', gap: '1rem' }}>
        <Link to="/tareas">HU14: Gestión Tareas</Link>
        <Link to="/pretest">HU15: Pre-Test</Link>
      </nav>

      <Routes>
        <Route path="/tareas" element={<GestionTareas />} />
        <Route path="/pretest" element={<FormularioPreTest />} />
      </Routes>
    </Router>
  );
}

export default App;