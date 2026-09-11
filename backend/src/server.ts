import express from 'express';
import cors from 'cors';
import { pool } from './db';

const app = express();
app.use(cors());
app.use(express.json());

// --- [HU14] GESTIÓN DE TAREAS ---
app.get('/api/tareas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

app.post('/api/tareas', async (req, res) => {
  const { titulo, descripcion, duracionEstimada } = req.body;
  if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });

  try {
    const result = await pool.query(
      'INSERT INTO tareas (titulo, descripcion, duracion_estimada_min) VALUES ($1, $2, $3) RETURNING *',
      [titulo, descripcion, duracionEstimada]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar tarea' });
  }
});

// --- [HU15] FORMULARIO PRE-TEST ---
app.post('/api/pretest', async (req, res) => {
  const { nombreParticipante, edad, experienciaTecnologica, observaciones } = req.body;
  if (!nombreParticipante) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    const result = await pool.query(
      'INSERT INTO pretests (nombre_participante, edad, experiencia_tecnologica, observaciones) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombreParticipante, edad, experienciaTecnologica, observaciones]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar pre-test' });
  }
});

app.listen(3001, () => console.log('Backend escuchando en http://localhost:3001'));