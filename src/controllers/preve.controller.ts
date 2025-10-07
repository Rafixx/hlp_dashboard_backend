import { PreveService } from "../services/preve.services";
import { isValidISODate } from "../utils/helper";

const preveService = new PreveService();

export const aislaIncidencia = async (
  req: any,
  res: any,
  next: any
) => {
  const dtDesde = req.query.dtDesde
  const dtHasta = req.query.dtHasta;

  if (!dtDesde || !dtHasta ) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }
  if (!isValidISODate(dtDesde) || !isValidISODate(dtHasta)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    const result = await preveService.aislaIncidencia(dtDesde, dtHasta);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const aislaPrevalencia = async (
  req: any,
  res: any,
  next: any
) => {
  const dtDesde = req.query.dtDesde
  const dtHasta = req.query.dtHasta;

  if (!dtDesde || !dtHasta ) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }
  if (!isValidISODate(dtDesde) || !isValidISODate(dtHasta)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    const result = await preveService.aislaPrevalencia(dtDesde, dtHasta);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const colonoPrevalente = async (
  req: any,
  res: any,
  next: any
) => {
  const dtDesde = req.query.dtDesde
  const dtHasta = req.query.dtHasta;

  if (!dtDesde || !dtHasta ) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }
  if (!isValidISODate(dtDesde) || !isValidISODate(dtHasta)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    const result = await preveService.colonoPrevalente(dtDesde, dtHasta);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const frotisPendientes = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await preveService.frotisPendientes();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const heridas = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await preveService.heridas();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const infecciones = async (
  req: any,
  res: any,
  next: any
) => {
  const dtDesde = req.query.dtDesde
  const dtHasta = req.query.dtHasta;

  if (!dtDesde || !dtHasta ) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }
  if (!isValidISODate(dtDesde) || !isValidISODate(dtHasta)) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  
  try {
    const result = await preveService.infecciones(dtDesde, dtHasta);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const intervencioinesColaboracion = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await preveService.intervencioinesColaboracion();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const vacunas = async (
  req: any,
  res: any,
  next: any
) => {
  const dtDesde = req.query.dtDesde
  const dtHasta = req.query.dtHasta;

  if (!dtDesde || !dtHasta ) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }
  if (!isValidISODate(dtDesde) || !isValidISODate(dtHasta)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    const result = await preveService.vacunas(dtDesde, dtHasta);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const vacunasFechaInicio = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await preveService.vacunasFechaInicio();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const vacunasPendientes = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await preveService.vacunasPendientes();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}



