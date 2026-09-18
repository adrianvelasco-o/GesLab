import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Interfaz exportada para HU14
export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  duracion_estimada_min: number;
  creado_en?: string;
}

// Interfaz exportada para HU15
export interface PreTest {
  id?: number;
  nombre_participante: string;
  edad: number;
  experiencia_tecnologica: string;
  observaciones: string;
  creado_en?: string;
}

// Servicios para HU14 (Tareas)
export const getTareas = () => axios.get<Tarea[]>(`${API_URL}/tareas`);
export const createTarea = (tarea: Omit<Tarea, 'id' | 'creado_en'>) => axios.post<Tarea>(`${API_URL}/tareas`, tarea);
export const updateTarea = (id: number, tarea: Omit<Tarea, 'id' | 'creado_en'>) => axios.put<Tarea>(`${API_URL}/tareas/${id}`, tarea);
export const deleteTarea = (id: number) => axios.delete(`${API_URL}/tareas/${id}`);

// Servicios para HU15 (PreTest)
export const getPreTests = () => axios.get<PreTest[]>(`${API_URL}/pretests`);
export const createPreTest = (pretest: Omit<PreTest, 'id' | 'creado_en'>) => axios.post<PreTest>(`${API_URL}/pretests`, pretest);
export const updatePreTest = (id: number, pretest: Omit<PreTest, 'id' | 'creado_en'>) => axios.put<PreTest>(`${API_URL}/pretests/${id}`, pretest);
export const deletePreTest = (id: number) => axios.delete(`${API_URL}/pretests/${id}`);