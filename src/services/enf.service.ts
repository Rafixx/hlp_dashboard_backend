import { EnfRepository } from "../repositories/enf.repository";

export class EnfService {
  constructor(private readonly enfRepo = new EnfRepository()) {}

  async lesionesUPP() {
    const result = await this.enfRepo.lesionesUPP();
    return result;
  }
}