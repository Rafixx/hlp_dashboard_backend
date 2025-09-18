import { MedService } from "../services/med.service";

const medService = new MedService()

export const informeTerapeutica = async (
  req: any,
  res: any,
  next: any
) => {
  const nhc = req.params.nhc;
  try {
    const result = await medService.informeTerapeutica(nhc)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
