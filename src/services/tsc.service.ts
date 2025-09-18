import { TscRepository } from "../repositories/tsc.repository";

export class TscService {
  constructor(private readonly tscRepo = new TscRepository()) {}

  async listadoIngresados() {
    const result = await this.tscRepo.listadoIngresados()
    return result;
  }
}