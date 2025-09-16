import { AdxService } from "../services/adx.service";

const adxService = new AdxService();

export const propuestasCitados = async (
  req: any,
  res: any,
  next: any
) => {
  const nhc = req.params.nhc;
  try {
    const result = await adxService.propuestasCitados(nhc);
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