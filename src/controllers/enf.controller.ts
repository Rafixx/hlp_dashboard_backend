import { EnfService } from "../services/enf.service";

const enfService = new EnfService();

export const lesionesUPP = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const result = await enfService.lesionesUPP();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}