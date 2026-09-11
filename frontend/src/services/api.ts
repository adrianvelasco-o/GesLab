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

// Servicios de peticiones
export const getTareas = () => axios.get<Tarea[]>(`${API_URL}/tareas`);
export const createTarea = (tarea: Omit<Tarea, 'id' | 'creado_en'>) => axios.post<Tarea>(`${API_URL}/tareas`, tarea);

export const createPreTest = (pretest: Omit<PreTest, 'id' | 'creado_en'>) => axios.post<PreTest>(`${API_URL}/pretests`, pretest);
