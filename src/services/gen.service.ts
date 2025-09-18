import { GenRepository } from "../repositories/gen.repository";

export class GenService {
  constructor(private readonly genRepo = new GenRepository()){}
  
  async cuidadores() {
    const result = await this.genRepo.cuidadores()
    return result;
  }
  
  async problemasAsociados(nhc: string) {
    const result = await this.genRepo.problemasAsociados(nhc)
    return result;
  }

  async escalasRealizadas(numicu: string) {
    const result = await this.genRepo.escalasRealizadas(numicu)
    return result;
  }

  async heridas() {
    const result = await this.genRepo.heridas()
    return result;
  }

  async lesiones() {
    const result = await this.genRepo.lesiones()
    return result;
  }

  async procedimientos() {
    const result = await this.genRepo.procedimientos()
    return result;
  }

  async terapeutica() {
    const result = await this.genRepo.terapeutica()
    return result;
  }

  async aisladosAhora() {
    const result = await this.genRepo.aisladosAhora()
    return result;
  }

  async escalas(dtDesde: string, dtHasta: string) {
    const result = await this.genRepo.escalas(dtDesde, dtHasta)
    return result;
  }
}