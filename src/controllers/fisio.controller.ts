import { FisioService } from "../services/fisio.service";
import { isValidISODate } from "../utils/helper";

const fisioService = new FisioService();

export const intColabFisioPaciente = async (
  req: any,
  res: any,
  next: any
) => {
  const nhc = req.params.nhc;
  try {
    // const result = await fisioService.intColabFisioPaciente();
    const result = await fisioService.intColabFisioPaciente(nhc);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const intColabFisio = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await fisioService.intColabFisio();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export const citasIngresados = async (
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
    const result = await fisioService.citasIngresados(dtDesde, dtHasta);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}