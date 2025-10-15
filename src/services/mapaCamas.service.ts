import { MapaCamasRepository } from "../repositories/mapaCamas.repository";

export class MapaCamasService {
  constructor(private readonly mapaCamasRepo = new MapaCamasRepository()) {}

  async mapaCamas() {
    const result = await this.mapaCamasRepo.mapaCamas();
    return result;
  }

  async pacientesXServicio() {
    const result = await this.mapaCamasRepo.pacientesXServicio();
    return result;
  }

  async camasInhabilitadas() {
    const result = await this.mapaCamasRepo.camasInhabilitadas();
    return result;
  }

  async camasOcupadas() {
    const result = await this.mapaCamasRepo.camasOcupadas();
    return result;
  }

  async camasGrua() {
    const result = await this.mapaCamasRepo.camasGrua();
    return result;
  }

  async aisladosPreve() {
    const result = await this.mapaCamasRepo.aisladosPreve();
    return result;
  }

  async aisladosEnf() {
    const result = await this.mapaCamasRepo.aisladosEnf();
    return result;
  }
}
