import * as pretestsService from './pretests.service.js';

export const getPretests = async (req, res, next) => {
  try {
    const datos = await pretestsService.getPretests();
    res.json(datos);
  } catch (error) {
    next(error);
  }
};

export const createPretest = async (req, res, next) => {
  try {
    const nuevo = await pretestsService.createPretest(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

export const updatePretest = async (req, res, next) => {
  try {
    const actualizado = await pretestsService.updatePretest(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
};

export const deletePretest = async (req, res, next) => {
  try {
    await pretestsService.deletePretest(req.params.id);
    res.json({ message: 'Pre-test eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};