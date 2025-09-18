import { TscService } from "../services/tsc.service";

const tscService = new TscService()

export const listadoIngresados = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await tscService.listadoIngresados()
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
