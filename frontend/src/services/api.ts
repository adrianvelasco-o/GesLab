import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  duracionEstimada: number;
}

export interface PreTest {
  id?: number;
  nombreParticipante: string;
  edad: number;
  experienciaTecnologica: string;
  observaciones: string;
}

export const crearTarea = (data: Tarea) => axios.post(`${API_URL}/tareas`, data);
export const obtenerTareas = () => axios.get(`${API_URL}/tareas`);
export const crearPreTest = (data: PreTest) => axios.post(`${API_URL}/pretest`, data);
