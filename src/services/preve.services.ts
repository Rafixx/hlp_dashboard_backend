import { PreveRepository } from "../repositories/preve.repository";

export class PreveService {
  constructor(private readonly preveRepo = new PreveRepository()){}

  async aislaIncidencia( dtDesde: string, dtHasta: string) {
    const result = await this.preveRepo.aislaIncidencia(dtDesde, dtHasta)
    return result;
  }
  async aislaPrevalencia(dtDesde: string, dtHasta: string){  
    const result = await this.preveRepo.aislaPrevalencia(dtDesde, dtHasta)
    return result;
  }
  async colonoPrevalente(dtDesde: string, dtHasta: string){
    const result = await this.preveRepo.colonoPrevalente(dtDesde, dtHasta)
    return result;
  }
  async frotisPendientes(){
    const result = await this.preveRepo.frotisPendientes()
    return result;
  }
  async heridas(){
    const result = await this.preveRepo.heridas()
    return result;
  }
  async infecciones(dtDesde: string, dtHasta: string){
    const result = await this.preveRepo.infecciones(dtDesde, dtHasta)
    return result;
  }
  async intervencioinesColaboracion(){
    const result = await this.preveRepo.intervencioinesColaboracion()
    return result;
  }
  async vacunas(dtDesde: string, dtHasta: string){
    const result = await this.preveRepo.vacunas(dtDesde, dtHasta)
    return result;
  }
  async vacunasFechaInicio(){
    const result = await this.preveRepo.vacunasFechaInicio()
    return result;
  }
  async vacunasPendientes(){
    const result = await this.preveRepo.vacunasPendientes()
    return result;
  }
}