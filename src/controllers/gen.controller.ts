import { GenService } from "../services/gen.service";

const genService = new GenService();

export const cuidadores = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await genService.cuidadores();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const problemasAsociados = async (
  req: any,
  res: any,
  next: any
) => {
  const nhc = req.params.nhc;
  try {
    const result = await genService.problemasAsociados( nhc)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}  

export const escalasRealizadas = async (
  req: any,
  res: any,
  next: any,
) => {
  const numicu = req.params.numicu
  try{
    const result = await genService.escalasRealizadas( numicu)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const heridas = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await genService.heridas();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const lesiones = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await genService.lesiones();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const procedimientos = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await genService.procedimientos();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const terapeutica = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await genService.terapeutica();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const aisladosAhora = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await genService.aisladosAhora();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const escalas = async (
  req: any,
  res: any,
  next: any
) => {
  const { dtDesde, dtHasta } = req.query;
  try {
    if (!dtDesde || !dtHasta) {
      return res.status(400).json({ error: 'Los parámetros dtDesde y dtHasta son requeridos' });
    }
    const result = await genService.escalas(dtDesde as string, dtHasta as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}  