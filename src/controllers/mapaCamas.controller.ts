import { MapaCamasService } from "../services/mapaCamas.service";

const mapaCamasService = new MapaCamasService();

export const mapaCamas = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await mapaCamasService.mapaCamas();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const pacientesXServicio = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await mapaCamasService.pacientesXServicio();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const camasInhabilitadas = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await mapaCamasService.camasInhabilitadas();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const camasOcupadas = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await mapaCamasService.camasOcupadas();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const camasGrua = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await mapaCamasService.camasGrua();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const aisladosPreve = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await mapaCamasService.aisladosPreve();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const aisladosEnf = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await mapaCamasService.aisladosEnf();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
