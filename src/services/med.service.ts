import { MedRepository  } from "../repositories/med.repository";

export class MedService {
  constructor(private readonly medRepo = new MedRepository()) {}

  async informeTerapeutica(nhc: string) {
    const result = await this.medRepo.informeTerapeutica(nhc);
    return result;
  }
}