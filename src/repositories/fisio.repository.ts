import { CLIENT_RENEG_LIMIT } from "tls"
import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class FisioRepository {
  // async intColabFisioPaciente( nhc: string ){
  async intColabFisioPaciente(){
    const sentenciaSQL = `
      -- INTERVENCIONES DE COLABORACION DE FISIOTERAPIA POR PACIENTE
      SELECT
      LI.ltin_descripcion AS INTERVENCION,
      hfa.hofr_frecuencia AS FRECUENCIA,
      CASE
        WHEN ( LI.ltin_condicional = 0 OR LI.ltin_condicional IS NULL ) THEN 'NO'
        WHEN LI.ltin_condicional = 1 THEN 'SI'
      END as CONDICIONAL,
      TO_CHAR(LT.litr_fecha_prescripcion, '%Y/%m/%d %H:%M') AS PRESCRIPCION,
      MIN( TO_CHAR( LT.litr_fecha_inicio,'%Y/%m/%d %H:%M' )) AS INICIO_TTO,
      MAX( TO_CHAR( LT.litr_fecha_ultima_modificacion,'%Y/%m/%d %H:%M' )) AS MODIFICACION,
      SC.secc_short_desc AS SECCION
    FROM orion_dba.lt_intervenciones_colaboracion LI
      INNER JOIN lineas_tratamiento LT ON LT.litr_key = LI.litr_key
      INNER JOIN episodios EP ON LT.epi_key = EP.epi_key
      INNER JOIN pacientes PAC ON EP.paci_key = PAC.paci_key
      INNER JOIN profesionales PF ON LT.prof_key_prescriptor = PF.prof_key
      INNER JOIN ocupacion_camas OC ON LT.epi_key = OC.epi_key
      INNER JOIN camas C ON OC.cama_key = C.cama_key
      INNER JOIN horas_frecuentes_admon hfa ON lt.hofr_key= hfa.hofr_key
      INNER JOIN secciones SC ON SC.secc_key=PF.secc_key
      INNER JOIN estados_linea_tratamiento ELTR ON LT.eltr_key = ELTR.eltr_key
    WHERE
      LT.litr_fecha_firma IS NOT NULL
      AND EP.epi_fecha_alta IS NULL
      AND ELTR.eltr_key NOT IN (21, 27, 30)
      AND OC.fecha_ocupa_fin IS NULL
      AND SC.secc_key IN (15, 24, 26, 27, 28)
    GROUP BY INTERVENCION, FRECUENCIA, CONDICIONAL, PRESCRIPCION, SECCION
    ;
    ` 
    // --  AND PAC.paci_nd = '${nhc}'
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async intColabFisio(){
    const sentenciaSQL = `
      -- INTERVENCIONES DE COLABORACION DE FISIOTERAPIA
      SELECT
      pac.paci_nombre || ' ' || pac.paci_primer_apellido AS PACIENTE,
      c.cod_cama_key AS CAMA,
      CASE
        WHEN TRIM( S.secc_short_desc ) = 'UHE1' THEN '1A'
        WHEN TRIM( S.secc_short_desc ) = 'UHE2' THEN '2A'
        WHEN TRIM( S.secc_short_desc ) = 'UHE3' THEN '3A'
        WHEN TRIM( S.secc_short_desc ) = 'UHE4' THEN '2B'
        WHEN TRIM( S.secc_short_desc ) = 'UHE5' THEN '3B'
      END AS PLANTA,
      LI.ltin_descripcion AS INTERVENCION,
      hfa.hofr_frecuencia AS FRECUENCIA,
      CASE
        WHEN ( LI.ltin_condicional = 0 OR LI.ltin_condicional IS NULL ) THEN 'NO'
        WHEN LI.ltin_condicional = 1 THEN 'SI'
      END AS CONDICIONAL,
      TO_CHAR(LT.litr_fecha_prescripcion, '%Y/%m/%d %H:%M') AS PRESCRIPCION,
      SC.secc_short_desc AS SECCION,
      usu.usu_nombre || ' ' || usu.usu_primer_apellido AS PAUTADO_POR
    FROM lt_intervenciones_colaboracion LI
      INNER JOIN lineas_tratamiento LT ON LT.litr_key = LI.litr_key
      INNER JOIN episodios EP ON LT.epi_key = EP.epi_key
      INNER JOIN pacientes PAC ON EP.paci_key = PAC.paci_key
      INNER JOIN profesionales PF ON LT.prof_key_prescriptor = PF.prof_key
      INNER JOIN usuarios usu ON PF.usu_key= usu.usu_key
      INNER JOIN ocupacion_camas OC ON LT.epi_key = OC.epi_key
      INNER JOIN camas C ON OC.cama_key = C.cama_key
      INNER JOIN secciones S ON S.secc_key=C.secc_key
      LEFT OUTER JOIN horas_frecuentes_admon hfa ON lt.hofr_key= hfa.hofr_key 
      INNER JOIN secciones SC ON SC.secc_key=PF.secc_key
      INNER JOIN estados_linea_tratamiento ELTR ON LT.eltr_key = ELTR.eltr_key
    WHERE
      LT.litr_fecha_firma IS NOT NULL
      AND EP.epi_fecha_alta IS NULL
      AND ELTR.eltr_key NOT IN (21, 27, 30)
      AND OC.fecha_ocupa_fin IS NULL
      AND SC.secc_key IN (15, 26,  27, 28)
    ;
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }  
}