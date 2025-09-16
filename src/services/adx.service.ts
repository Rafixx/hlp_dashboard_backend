import { AdxRepository } from "../repositories/adx.repository";

export class AdxService {
  constructor(private readonly adxRepo = new AdxRepository()) {}

  async propuestasCitados(nhc: string) {
    const result = await this.adxRepo.propuestasCitados(nhc);
    return result;
  }

  async propuestasDadosDeAlta(nhc: string) {
    const result = await this.adxRepo.propuestasDadosDeAlta(nhc);
    return result;
  }

  async propuestasTramitadas(nhc: string) {
    const result = await this.adxRepo.propuestasTramitadas(nhc);
    return result;
  }
}