import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class MapaCamasRepository {
  async mapaCamas() {
    const sentenciaSQL = `
      SELECT
        CASE
          WHEN TRIM( s.secc_short_desc ) = 'UHE1' THEN '1A'
          WHEN TRIM( s.secc_short_desc ) = 'UHE2' THEN '2A'
          WHEN TRIM( s.secc_short_desc ) = 'UHE3' THEN '3A'
          WHEN TRIM( s.secc_short_desc ) = 'UHE4' THEN '2B'
          WHEN TRIM( s.secc_short_desc ) = 'UHE5' THEN '3B'
        END AS PLANTA,
        c.cod_cama_key AS CAMA
      FROM
        camas c
        LEFT JOIN tipos_aislamiento ta ON ta.tais_key = c.tais_key
        JOIN orion_dba.secciones s ON s.secc_key = c.secc_key
      WHERE
        c.ctma_estado <> 'INHABILITA'
      ORDER BY cama
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async pacientesXServicio() {
    const sentenciaSQL = `
      -- INGRESOS POR SERVICIOS
      SELECT
        COUNT(*), s2.secc_short_desc AS TOTAL_SERV_MED
      FROM
        camas c
        LEFT JOIN orion_dba.secciones s1 ON s1.secc_key = c.secc_fisi_cama
        LEFT JOIN orion_dba.ocupacion_camas oc ON oc.cama_key = c.cama_key
        LEFT JOIN orion_dba.episodios epi ON epi.epi_key = oc.epi_key
        LEFT JOIN orion_dba.pacientes paci ON paci.paci_key =  epi.paci_key
        LEFT JOIN orion_dba.contactos con ON con.epis_key = epi.epi_key
        LEFT JOIN orion_dba.secciones s2 ON s2.secc_key = con.secc_key
      WHERE
        oc.cama_ocupada = 1  -- oc.cama_ocupada =  SI
        AND oc.fecha_ocupa_fin IS NULL	
        AND con.tico_key = 4     -- con.tico_key = Contacto Hospitalizacion
        AND con.cont_is_activo = 1
      GROUP BY s2.secc_short_desc
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async camasInhabilitadas() {
    const sentenciaSQL = `
      -- CAMAS INHABILITADAS
      SELECT 
        cf.nhabitacion AS habitacion,
        cf.ncama AS cama            
      FROM camas_fisi cf
      WHERE cf.inhabilitada = 'S'
      ORDER BY cf.nhabitacion, cf.ncama
    `
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async camasOcupadas() {
    const sentenciaSQL = `
      -- CAMAS OCUPADAS
      SELECT
        c.cod_cama_key AS CAMA,
        CASE
          WHEN paci.paci_sexo = 'SEX1' THEN 'Hombre'
          WHEN paci.paci_sexo = 'SEX2' THEN 'Mujer'
        END AS SEXO,
        s2.secc_short_desc AS SERV_MED,
        paci.paci_nd AS NHC,
        CASE 
          WHEN paci.paci_segundo_apellido IS NULL THEN paci.paci_nombre || ' ' || paci.paci_primer_apellido 
          WHEN paci.paci_primer_apellido IS NULL THEN paci.paci_nombre
          ELSE paci.paci_nombre || ' ' || paci.paci_primer_apellido || ' ' || paci.paci_segundo_apellido 
        END AS PACIENTE
      FROM
        camas c
        LEFT JOIN orion_dba.secciones s1 ON s1.secc_key = c.secc_fisi_cama
        LEFT JOIN orion_dba.ocupacion_camas oc ON oc.cama_key = c.cama_key
        LEFT JOIN orion_dba.episodios epi ON epi.epi_key = oc.epi_key
        LEFT JOIN orion_dba.pacientes paci ON paci.paci_key =  epi.paci_key
        LEFT JOIN orion_dba.contactos con ON con.epis_key = epi.epi_key
        LEFT JOIN orion_dba.secciones s2 ON s2.secc_key = con.secc_key
      WHERE
        oc.cama_ocupada = 1  -- oc.cama_ocupada =  SI
        AND oc.fecha_ocupa_fin IS NULL			
        AND con.tico_key = 4     -- con.tico_key = Contacto Hospitalizacion
        AND con.cont_is_activo = 1
      ORDER BY CAMA
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async camasGrua() {
    const sentenciaSQL = `
      SELECT
        c.cod_cama_key AS CAMA,
        TO_CHAR( tc.toma_fecha,'%d/%m/%Y') AS FECHA
      FROM
        camas c
        LEFT JOIN orion_dba.ocupacion_camas oc ON oc.cama_key = c.cama_key
        LEFT JOIN orion_dba.episodios epi ON epi.epi_key = oc.epi_key
        LEFT JOIN orion_dba.pacientes paci ON paci.paci_key =  epi.paci_key
        LEFT JOIN orion_dba.toma_constantes tc ON tc.toma_paciente_key = paci.paci_key
      WHERE
        oc.cama_ocupada = 1  -- oc.cama_ocupada =  SI
        AND oc.fecha_ocupa_fin IS NULL			
        AND tc.toma_cnte_key = 563 -- GRUA
        AND tc.toma_valor = 'SI'
        AND tc.toma_fecha IN (  SELECT MAX(tc2.toma_fecha)
                              from orion_dba.toma_constantes tc2
                              WHERE tc2.toma_cnte_key = 563 -- GRUA
                              AND tc2.toma_paciente_key = tc.toma_paciente_key
                              GROUP BY tc2.toma_paciente_key )
      ORDER BY CAMA
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async aisladosPreve() {
    const sentenciaSQL = `
      -- CAMAS CON PACIENTES AISLADOS POR PREVENTIVA
      SELECT
         c.cod_cama_key AS CAMA,
         mt2.mati_desc AS AISLA_PREVE
      FROM
         camas c
         LEFT JOIN orion_dba.secciones s ON s.secc_key = c.secc_key
         LEFT JOIN orion_dba.ocupacion_camas oc ON oc.cama_key = c.cama_key
         LEFT JOIN orion_dba.episodios epi ON epi.epi_key = oc.epi_key
         LEFT JOIN paciente_preventivista pp ON pp.epi_key = epi.epi_key
         LEFT JOIN area_paciente_preventivista ap ON ap.pac_prev_key = pp.pac_prev_key
         LEFT JOIN regla_paciente_preventivista rp ON rp.area_pac_prev_key = ap.area_pac_prev_key
         LEFT JOIN apartado_precaucion_aislamiento_preventivista apa ON apa.regla_key = rp.reg_pa_prev_key
         LEFT JOIN maestro_tipos mt2 ON mt2.mati_key = apa.tiap_key
      WHERE
          oc.cama_ocupada = 1
      -- AND c.ctma_estado = 'OPERATIVA'
      AND  apa.fec_ini_aisla IS NOT NULL
      AND  apa.fec_fin_aisla IS NULL
      ORDER BY CAMA
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async aisladosEnf() {
    const sentenciaSQL = `
      -- CAMAS CON PACIENTES AISLADOS POR ENFERMERÍA
      SELECT
        c.cod_cama_key AS CAMA,
        CASE
          WHEN mati.mati_desc  IS NULL THEN '-'
          WHEN mati.mati_desc  IS NOT NULL THEN mati.mati_desc
        END AS AISLA_ENF,
        CASE
          WHEN chosp.coho_otro_mot_uso_indiv_hab  IS NULL THEN '-'
          WHEN chosp.coho_otro_mot_uso_indiv_hab  = '' THEN '-'
          WHEN chosp.coho_otro_mot_uso_indiv_hab  IS NOT NULL THEN chosp.coho_otro_mot_uso_indiv_hab
        END AS OTRO
      FROM
         camas c
         LEFT JOIN orion_dba.ocupacion_camas oc ON oc.cama_key = c.cama_key
         LEFT JOIN orion_dba.episodios epi ON epi.epi_key = oc.epi_key
         LEFT JOIN orion_dba.contactos con ON con.epis_key = epi.epi_key
         JOIN orion_dba.contacto_hospitalizacion chosp ON chosp.cont_key = con.cont_key
         LEFT JOIN orion_dba.maestro_tipos mati ON mati.mati_key =  chosp.mati_uso_indiv_habitacion_key
      WHERE
          oc.cama_ocupada = 1  -- oc.cama_ocupada =  SI
      AND oc.fecha_ocupa_fin IS NULL		
      AND con.cont_is_activo = 1
      ORDER BY CAMA
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }
}
