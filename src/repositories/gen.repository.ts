import { CLIENT_RENEG_LIMIT } from "tls"
import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class GenRepository {
  // async intColabFisioPaciente( nhc: string ){
  async cuidadores(){
    const sentenciaSQL = `
      -- CUIDADORES
      SELECT
        CASE
          WHEN TRIM( s.secc_short_desc ) = 'UHE1' THEN '1A'
          WHEN TRIM( s.secc_short_desc ) = 'UHE2' THEN '2A'
          WHEN TRIM( s.secc_short_desc ) = 'UHE3' THEN '3A'
          WHEN TRIM( s.secc_short_desc ) = 'UHE4' THEN '2B'
          WHEN TRIM( s.secc_short_desc ) = 'UHE5' THEN '3B'
        END AS PLANTA,
        c.cod_cama_key AS CAMA,
        paci.paci_nd as NHC,
        paci.paci_sip as SIP,
        TRIM( paci.paci_nombre || ' ' ||  paci.paci_primer_apellido ) AS PACIENTE,
        CASE
          WHEN cui.apellido1 IS NULL THEN TRIM( cui.nombre )
          WHEN cui.apellido1 IS NOT NULL THEN TRIM( cui.nombre || ' ' ||  cui.apellido1 )
        END AS CUIDADOR,
        cui.telefono AS TELF_1,
        cui.telefono2 AS TELF_2,
        cui.telefono3 AS TELF_3
      FROM
        orion_dba.ocupacion_camas oc
        INNER JOIN orion_dba.camas c ON oc.cama_key = c.cama_key
        INNER JOIN orion_dba.secciones s ON s.secc_key = c.secc_key
        INNER JOIN orion_dba.episodios epi ON epi.epi_key = oc.epi_key
        INNER JOIN orion_dba.pacientes paci ON epi.paci_key = paci.paci_key
        INNER JOIN orion_dba.uhd_cuidador cui ON cui.paci_key = paci.paci_key
      WHERE
        oc.cama_ocupada = 1
      ORDER BY CAMA
      ;
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async problemasAsociados( nhc: string ){
    const sentenciaSQL = `
      -- PROBLEMAS ASOCIADOS
      SELECT
          LEFT( diag.diag_desc, 100 ) AS PROBLEMA_MEDICO,
          mt3.mati_desc AS PERFIL,
          to_char(d_pro.dpre_fecha_creacion,'%Y/%m/%d') AS INCLUSION,
          mt2.mati_desc AS DIMENSION,
          mt1.mati_desc AS TIPO,
          CASE
            WHEN d_pro.dpre_activo = 0 THEN 'RESUELTO'
            WHEN d_pro.dpre_activo = 1 THEN 'ACTIVO'
          END AS ESTADO,
          CASE
            WHEN mm.mamo_desc IS NULL THEN '' ELSE mm.mamo_desc
          END AS MOTIVO_CIERRE,
          CASE
            WHEN d_pro.dpre_fecha_cierre IS NULL THEN '' ELSE to_char(d_pro.dpre_fecha_cierre,'%Y/%m/%d')
          END AS CIERRE
      FROM
          datos_problema_episodio d_pro
          LEFT JOIN maestro_tipos mt1 ON d_pro.mati_problema_key = mt1.mati_key
          LEFT JOIN maestro_tipos mt2 ON d_pro.mati_dimension_key = mt2.mati_key
          LEFT JOIN maestro_tipos mt3 ON d_pro.mati_perfil_key = mt3.mati_key
          LEFT JOIN maestro_motivos mm ON d_pro.mamo_cierre_key = mm.mamo_key
          LEFT JOIN problemas_as pro ON d_pro.dpre_key = pro.datprobl_key
          LEFT JOIN campos_tablas_maestras ctma ON pro.ctma_tipo_problema_key = ctma.ctma_key

          INNER JOIN diagnosticos_episodios diagep on diagep.datprobl_key = d_pro.dpre_key
          INNER JOIN diagnosticos diag ON diagep.diag_key = diag.diag_key

          INNER JOIN episodios epi ON epi.epi_key = d_pro.epi_key
          INNER JOIN pacientes paci ON paci.paci_key = epi.paci_key
      WHERE
          paci.paci_nd =  '${nhc}'

      UNION
      SELECT
          LEFT( mNanda.maenan_descripcion, 100 ) AS PROBLEMA_ENFERMERIA,
          mt3.mati_desc AS PERFIL,
          to_char(d_pro.dpre_fecha_creacion,'%Y/%m/%d') AS INCLUSION,
          mt2.mati_desc AS DIMENSION,
          mt1.mati_desc AS TIPO,
          CASE
            WHEN d_pro.dpre_activo = 0 THEN 'RESUELTO'
            WHEN d_pro.dpre_activo = 1 THEN 'ACTIVO'
          END AS ESTADO,
          CASE
            WHEN mm.mamo_desc IS NULL THEN '' ELSE mm.mamo_desc
          END AS MOTIVO_CIERRE,
          CASE
            WHEN d_pro.dpre_fecha_cierre IS NULL THEN '' ELSE to_char(d_pro.dpre_fecha_cierre,'%Y/%m/%d')
          END AS CIERRE
      FROM
          datos_problema_episodio d_pro
          LEFT JOIN maestro_tipos mt1 ON d_pro.mati_problema_key = mt1.mati_key
          LEFT JOIN maestro_tipos mt2 ON d_pro.mati_dimension_key = mt2.mati_key
          LEFT JOIN maestro_tipos mt3 ON d_pro.mati_perfil_key = mt3.mati_key
          LEFT JOIN maestro_motivos mm ON d_pro.mamo_cierre_key = mm.mamo_key
          LEFT JOIN problemas_as pro ON d_pro.dpre_key = pro.datprobl_key
          LEFT JOIN campos_tablas_maestras ctma ON pro.ctma_tipo_problema_key = ctma.ctma_key

          INNER JOIN uhd_diagnostico_enfermeria_contacto denfc on denfc.datprobl_key = d_pro.dpre_key
          INNER JOIN diagnosticos_enfermeria diag_enf ON denfc.diag_enf_key = diag_enf.diag_enf_key
          INNER JOIN maestro_nanda mNanda ON diag_enf.maenan_key = mNanda.maenan_key

          INNER JOIN episodios epi ON epi.epi_key = d_pro.epi_key
          INNER JOIN pacientes paci ON paci.paci_key = epi.paci_key
      WHERE
          paci.paci_nd =  '${nhc}'

      UNION
      SELECT
          LEFT( prore.probl_rehab_desc, 100 ) AS PROBLEMA_TRANSVERSAL,
          mt3.mati_desc AS PERFIL,
          to_char(d_pro.dpre_fecha_creacion,'%Y/%m/%d') AS INCLUSION,
          mt2.mati_desc AS DIMENSION,
          mt1.mati_desc AS TIPO,
          CASE
            WHEN d_pro.dpre_activo = 0 THEN 'RESUELTO'
            WHEN d_pro.dpre_activo = 1 THEN 'ACTIVO'
          END AS ESTADO,
          CASE
            WHEN mm.mamo_desc IS NULL THEN '' ELSE mm.mamo_desc
          END AS MOTIVO_CIERRE,
          CASE
            WHEN d_pro.dpre_fecha_cierre IS NULL THEN '' ELSE to_char(d_pro.dpre_fecha_cierre,'%Y/%m/%d')
          END AS CIERRE
      FROM
          datos_problema_episodio d_pro
          LEFT JOIN maestro_tipos mt1 ON d_pro.mati_problema_key = mt1.mati_key
          LEFT JOIN maestro_tipos mt2 ON d_pro.mati_dimension_key = mt2.mati_key
          LEFT JOIN maestro_tipos mt3 ON d_pro.mati_perfil_key = mt3.mati_key
          LEFT JOIN maestro_motivos mm ON d_pro.mamo_cierre_key = mm.mamo_key
          LEFT JOIN problemas_as pro ON d_pro.dpre_key = pro.datprobl_key
          LEFT JOIN campos_tablas_maestras ctma ON pro.ctma_tipo_problema_key = ctma.ctma_key

          INNER JOIN problemas_rehabilitacion prore on prore.probl_rehab_datprobl_key = d_pro.dpre_key

          INNER JOIN episodios epi ON epi.epi_key = d_pro.epi_key
          INNER JOIN pacientes paci ON paci.paci_key = epi.paci_key
      WHERE
          paci.paci_nd =  '${nhc}'

      UNION
      SELECT
          LEFT( cts.cots_short_desc, 100 ) AS PROBLEMA_TSOCIAL,
          mt3.mati_desc AS PERFIL,
          to_char(d_pro.dpre_fecha_creacion,'%Y/%m/%d') AS INCLUSION,
          mt2.mati_desc AS DIMENSION,
          mt1.mati_desc AS TIPO,
          CASE
            WHEN d_pro.dpre_activo = 0 THEN 'RESUELTO'
            WHEN d_pro.dpre_activo = 1 THEN 'ACTIVO'
          END AS ESTADO,
          CASE
            WHEN mm.mamo_desc IS NULL THEN '' ELSE mm.mamo_desc
          END AS MOTIVO_CIERRE,
          CASE
            WHEN d_pro.dpre_fecha_cierre IS NULL THEN '' ELSE to_char(d_pro.dpre_fecha_cierre,'%Y/%m/%d')
          END AS CIERRE
      FROM
          datos_problema_episodio d_pro
          LEFT JOIN maestro_tipos mt1 ON d_pro.mati_problema_key = mt1.mati_key
          LEFT JOIN maestro_tipos mt2 ON d_pro.mati_dimension_key = mt2.mati_key
          LEFT JOIN maestro_tipos mt3 ON d_pro.mati_perfil_key = mt3.mati_key
          LEFT JOIN maestro_motivos mm ON d_pro.mamo_cierre_key = mm.mamo_key
          LEFT JOIN problemas_as pro ON d_pro.dpre_key = pro.datprobl_key
          LEFT JOIN campos_tablas_maestras ctma ON pro.ctma_tipo_problema_key = ctma.ctma_key

          INNER JOIN codificacion_trabajo_social cts ON pro.cots_key = cts.cots_key

          INNER JOIN episodios epi ON epi.epi_key = d_pro.epi_key
          INNER JOIN pacientes paci ON paci.paci_key = epi.paci_key
      WHERE
          paci.paci_nd =  '${nhc}'
      ;
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }  

  async escalasRealizadas( numicu: string ){
    const sentenciaSQL = `
      -- ESCALAS REALIZADAS
      SELECT  DISTINCT
          '+',
          mesc.nombre_esc AS nombre_escala,
          TO_CHAR(rdoesc.urdoesc_fecha,'%Y/%m/%d') AS realizada,
          substring_index(rdoesc.urdoesc_resultado, '/', 1)  AS resultado,
          substring_index(substring_index(substring_index(rdoesc.urdoesc_resultado, '-',1),'- ',1),'/', -1 ) AS puntuacion_maxima,
          substring_index(rdoesc.urdoesc_resultado, '-', -1)  AS interpretacion,
          secc.secc_long_desc AS SECCION,
          cp.carg_long_desc AS perfil,
          CASE
            WHEN (rdoesc.rees_observaciones IS NULL)
              OR (rdoesc.rees_observaciones = '')
            THEN 'NO OBS' ELSE 'SI'
          END AS OBSERVACIONES,
          rdoesc.rees_observaciones AS obs
      FROM
          uhd_rdo_escala rdoesc
          INNER JOIN uhd_maestro_escalas mesc ON  mesc.esc_key = rdoesc.esc_key
          INNER JOIN episodios epi ON epi.epi_key = rdoesc.epi_key
          INNER JOIN pacientes paci ON paci.paci_key = epi.paci_key
          INNER JOIN profesionales prof ON prof.prof_key = rdoesc.prof_key
          INNER JOIN cargos_profesionales cp ON cp.carg_key = prof.carg_key
          INNER JOIN secciones secc ON secc.secc_key = prof.secc_key
      WHERE
          epi.numicu = '" . $numicu . "'
    ;
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }  
}