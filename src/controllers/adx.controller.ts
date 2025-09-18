import { AdxService } from "../services/adx.service";

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
  const { desde, hasta } = req.query;
  try {
    if (!desde || !hasta) {
      return res.status(400).json({ error: 'Los parámetros desde y hasta son requeridos' });
    }
    const result = await adxService.altasXDpto(desde as string, hasta as string);
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