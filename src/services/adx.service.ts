import { AdxRepository } from "../repositories/adx.repository";

export class AdxService {
  constructor(private readonly adxRepo = new AdxRepository()) {}

  async propuestasCitados(dtDesde: string, dtHasta: string, camaDsd: string, camaHst: string) {
    const result = await this.adxRepo.propuestasCitados(dtDesde, dtHasta, camaDsd, camaHst);
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

  async altasXDpto(desde: string, hasta: string) {
    const result = await this.adxRepo.altasXDpto(desde, hasta);
    return result;
  }

  async pacientesIngresados() {
    const result = await this.adxRepo.pacientesIngresados();
    return result;
  }

  async pendientesCita() {
    const result = await this.adxRepo.pendientesCita();
    return result;
  }

  async prestamosHC() {
    const result = await this.adxRepo.prestamosHC();
    return result;
  }

  async prestamosPdtes() {
    const result = await this.adxRepo.prestamosPdtes();
    return result;
  }
}