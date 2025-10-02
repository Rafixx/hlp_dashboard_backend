
import { AdxService } from "../services/adx.service";
import { isValidISODate } from "../utils/helper";

const adxService = new AdxService();

export const propuestasCitados = async (
  req: any,
  res: any,
  next: any
) => {
  const dtDesde = req.query.dtDesde;
  const dtHasta = req.query.dtHasta;
  const camaDsd = req.query.camaDsd;
  const camaHst = req.query.camaHst;

  if (!dtDesde || !dtHasta || !camaDsd || !camaHst) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }
  if (!isValidISODate(dtDesde) || !isValidISODate(dtHasta)) {
    return res.status(400).json({ error: 'El formato de fecha debe ser YYYY-MM-DD' });
  }

  try {
    const result = await adxService.propuestasCitados(dtDesde, dtHasta, camaDsd, camaHst);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const propuestasDadosDeAlta = async (
  req: any,
  res: any,
  next: any
) => {
  const nhc = req.params.nhc;
  try {
    const result = await adxService.propuestasDadosDeAlta(nhc);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const propuestasTramitadas = async (
  req: any,
  res: any,
  next: any
) => {
  const nhc = req.params.nhc;
  try {
    const result = await adxService.propuestasTramitadas(nhc);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const altasXDpto = async (
  req: any,
  res: any,
  next: any
) => {
  const dtDesde = req.query.dtDesde;
  const dtHasta = req.query.dtHasta;
  if (!dtDesde || !dtHasta) {
    return res.status(400).json({ error: 'Los parámetros desde y hasta son requeridos' });
  }
  if (!isValidISODate(dtDesde) || !isValidISODate(dtHasta)) {
    return res.status(400).json({ error: 'El formato de fecha debe ser YYYY-MM-DD' });
  }
  try {
    const result = await adxService.altasXDpto(dtDesde as string, dtHasta as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const pacientesIngresados = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await adxService.pacientesIngresados();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const pendientesCita = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await adxService.pendientesCita();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const prestamosHC = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await adxService.prestamosHC();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const prestamosPdtes = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await adxService.prestamosPdtes();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}