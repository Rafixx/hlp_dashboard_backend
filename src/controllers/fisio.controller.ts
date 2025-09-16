import { FisioService } from "../services/fisio.service";

const fisioService = new FisioService();

export const intColabFisioPaciente = async (
  req: any,
  res: any,
  next: any
) => {
  // const nhc = req.params.nhc;
  try {
    const result = await fisioService.intColabFisioPaciente();
    // const result = await fisioService.intColabFisioPaciente(nhc);
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