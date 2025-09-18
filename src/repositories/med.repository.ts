import { CLIENT_RENEG_LIMIT } from "tls"
import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class MedRepository {
  async informeTerapeutica( nhc: string ){
    const sentenciaSQL = `
      -- INFORME TERAPÉUTICA
      SELECT
        C.cod_cama_key AS Cama ,
        N.nemo_short_desc AS Nemonico,
        round(LT.litr_dosis_medic,2) AS DOSIS,
        va.viad_long_desc as VIA,
        round(hfa.hofr_frecuencia,2) AS FRECUENCIA,
        elt.eltr_long_desc AS ESTADO,
        to_char(LT.litr_fecha_prescripcion,'%Y/%m/%d %H:%M') AS Prescripcion,
        to_char(LT.litr_fecha_ultima_modificacion,'%Y/%m/%d %H:%M') AS Modificacion,
        U.usu_nombre  || ' ' ||	U.usu_primer_apellido AS facultativo
      FROM orion_dba.lineas_tratamiento LT
        INNER JOIN orion_dba.episodios EP on LT.epi_key = EP.epi_key
        INNER JOIN orion_dba.pacientes P on EP.paci_key = P.paci_key
        INNER JOIN orion_dba.nemonicos N on LT.nemo_key_principal = N.nemo_key
        INNER JOIN orion_dba.profesionales PF on LT.prof_key_prescriptor = PF.prof_key
        INNER JOIN orion_dba.usuarios U on PF.usu_key = U.usu_key
        INNER JOIN orion_dba.ocupacion_camas OC on LT.epi_key = OC.epi_key
        INNER JOIN orion_dba.camas C on OC.cama_key = C.cama_key
        INNER JOIN orion_dba.estados_linea_tratamiento ELT on LT.eltr_key = ELT.eltr_key
        --INNER JOIN orion_dba.campos_tablas_maestras CTMA on EP.esta_epi_key = CTMA.ctma_key
        INNER JOIN orion_dba.horas_frecuentes_admon hfa on lt.hofr_key= hfa.hofr_key
        INNER JOIN orion_dba.vias_administracion va on n.viad_key = va.viad_key
      WHERE
        oc.fecha_ocupa_fin is null
        AND LT.litr_fecha_prescripcion  BETWEEN '2018-06-05 00:00:00' AND CURRENT
        AND P.paci_nd = '${nhc}'
      ;
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }


}