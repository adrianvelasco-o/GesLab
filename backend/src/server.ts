import express from 'express';
import cors from 'cors';
import { pool } from './db';

const app = express();
app.use(cors());
app.use(express.json());

// --- [HU14] GESTIÓN DE TAREAS ---

// Obtener todas las tareas
app.get('/api/tareas', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('--- ERROR PG (GET /api/tareas) ---', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
  const { titulo, descripcion, duracion_estimada_min } = req.body;
  if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });

  try {
    const result = await pool.query(
      'INSERT INTO tareas (titulo, descripcion, duracion_estimada_min) VALUES ($1, $2, $3) RETURNING *',
      [titulo, descripcion, duracion_estimada_min]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('--- ERROR PG (POST /api/tareas) ---', error);
    res.status(500).json({ error: 'Error al registrar tarea' });
  }
});

// Actualizar (Editar) una tarea por ID
app.put('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, duracion_estimada_min } = req.body;

  if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });

  try {
    const result = await pool.query(
      'UPDATE tareas SET titulo = $1, descripcion = $2, duracion_estimada_min = $3 WHERE id = $4 RETURNING *',
      [titulo, descripcion, duracion_estimada_min, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('--- ERROR PG (PUT /api/tareas/:id) ---', error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// Eliminar una tarea por ID
app.delete('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tareas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('--- ERROR PG (DELETE /api/tareas/:id) ---', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// --- [HU15] FORMULARIO PRE-TEST ---

// Obtener todos los pre-tests
app.get('/api/pretests', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pretests ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('--- ERROR PG (GET /api/pretests) ---', error);
    res.status(500).json({ error: 'Error al obtener pre-tests' });
  }
});

// Crear un pre-test
app.post('/api/pretests', async (req, res) => {
  const { nombre_participante, edad, experiencia_tecnologica, observaciones } = req.body;
  if (!nombre_participante) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    const result = await pool.query(
      'INSERT INTO pretests (nombre_participante, edad, experiencia_tecnologica, observaciones) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre_participante, edad, experiencia_tecnologica, observaciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('--- ERROR PG (POST /api/pretests) ---', error);
    res.status(500).json({ error: 'Error al registrar pre-test' });
  }
});

// Actualizar (Editar) un pre-test por ID
app.put('/api/pretests/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_participante, edad, experiencia_tecnologica, observaciones } = req.body;

  if (!nombre_participante) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    const result = await pool.query(
      'UPDATE pretests SET nombre_participante = $1, edad = $2, experiencia_tecnologica = $3, observaciones = $4 WHERE id = $5 RETURNING *',
      [nombre_participante, edad, experiencia_tecnologica, observaciones, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pre-test no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('--- ERROR PG (PUT /api/pretests/:id) ---', error);
    res.status(500).json({ error: 'Error al actualizar el pre-test' });
  }
});

// Eliminar un pre-test por ID
app.delete('/api/pretests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM pretests WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pre-test no encontrado' });
    }
    res.json({ message: 'Pre-test eliminado correctamente' });
  } catch (error) {
    console.error('--- ERROR PG (DELETE /api/pretests/:id) ---', error);
    res.status(500).json({ error: 'Error al eliminar el pre-test' });
  }
});

app.listen(3001, () => console.log('Backend escuchando en http://localhost:3001'));