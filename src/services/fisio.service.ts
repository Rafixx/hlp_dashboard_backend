import { FisioRepository } from "../repositories/fisio.repository";

export class FisioService {
  constructor(private readonly fisioRepo = new FisioRepository()) {}
  
  async intColabFisioPaciente() {
    // async intColabFisioPaciente(nhc: string) {
    const result = await this.fisioRepo.intColabFisioPaciente();
    // const result = await this.fisioRepo.intColabFisioPaciente(nhc);
    return result;
  }

  async intColabFisio() {
    const result = await this.fisioRepo.intColabFisio();
    return result;
  }
}