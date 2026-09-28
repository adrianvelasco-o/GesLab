import * as tareasService from './tareas.service.js';

export const getTareas = async (req, res, next) => {
  try {
    const tareas = await tareasService.getTareas();
    res.json(tareas);
  } catch (error) {
    next(error);
  }
};

export const createTarea = async (req, res, next) => {
  try {
    const nuevaTarea = await tareasService.createTarea(req.body);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
};

export const updateTarea = async (req, res, next) => {
  try {
    const tareaActualizada = await tareasService.updateTarea(req.params.id, req.body);
    res.json(tareaActualizada);
  } catch (error) {
    next(error);
  }
};

export const deleteTarea = async (req, res, next) => {
  try {
    await tareasService.deleteTarea(req.params.id);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};