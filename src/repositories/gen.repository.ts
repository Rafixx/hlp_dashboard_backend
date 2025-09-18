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

  async heridas() {
    const sentenciaSQL = `
      SELECT
        e.numicu ,
        c.cod_cama_key as cama,
        to_char(cui.cuen_les_fecha,'%Y/%m/%d') as fecha_registro,
        ctm.ctma_desc as clase_herida,
        nvl(nvl (nvl (ctm2.ctma_desc, ctm3.ctma_desc), ctm4.ctma_desc),
        cui.cuen_les_hum_localizacion) as tipo,
        nvl (nvl (ctm5.ctma_desc , cui.cuen_les_localizacion),
        cui.cuen_les_que_localizacion) as localizacion,
        ctm6.ctma_desc as lateralidad,
        nvl (cui.ctma_ulcera_grado,
        ctm7.ctma_desc) as grado ,
        mt.mati_desc as procedencia,
        s.secc_long_desc as seccion_realizadora,
        u.usu_nombre || ' ' || u.usu_primer_apellido as profesioal,
        cp.carg_long_desc as perfil_profesional
      FROM
        episodios e
        INNER JOIN informes i on i.epi_key = e.epi_key
        INNER JOIN cuidados_enfermeria cu on cu.informe_key = i.informe_key
        INNER JOIN cuidados_enfermeria_lesiones cui on cui.cuen_key = cu.cuen_key
        INNER JOIN campos_tablas_maestras ctm on ctm.ctma_key = cui.ctma_tip_les_enf
        LEFT JOIN campos_tablas_maestras ctm2 on ctm2.ctma_key = cui.ctma_tip_qui_enf
        LEFT JOIN campos_tablas_maestras ctm3 on ctm3.ctma_key = cui.ctma_tip_ulc_enf
        LEFT JOIN campos_tablas_maestras ctm4 on ctm4.ctma_key = cui.ctma_tipo_traumatica
        LEFT JOIN campos_tablas_maestras ctm5 on ctm5.ctma_key = cui.cuen_les_localizacion
        LEFT JOIN campos_tablas_maestras ctm6 on ctm6.ctma_key = cui.ctma_ulcera_lado
        LEFT JOIN campos_tablas_maestras ctm7 on ctm7.ctma_key = cui.ctma_gra_que_enf
        LEFT JOIN maestro_tipos mt on mt.mati_key = cui.cuen_les_procedencia
        INNER JOIN profesionales pro on pro.prof_key = cui.prof_key
        INNER JOIN usuarios u on u.usu_key = pro.usu_key
        INNER JOIN secciones s on s.secc_key = pro.secc_key
        INNER JOIN cargos_profesionales cp on cp.carg_key = pro.carg_key
        INNER JOIN ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on oc.cama_key = c.cama_key
      WHERE
          i.tip_informe_key = 'TIPINF28'
      AND cui.cuen_les_eliminado = 0
      AND cui.cuen_les_fecha >= oc.fecha_ocupa_ini
      AND (cui.cuen_les_fecha >= oc.fecha_ocupa_fin OR oc.fecha_ocupa_fin is null)
      ;
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async lesiones() {
    const sentenciaSQL = `
      SELECT
        e.numicu as numicu ,
        c.cod_cama_key as cama ,
        to_char(ui.uinfles_fechacrea,'%Y/%m/%d') as fecha_creacion_informe_lesiones,
        to_char(ui.uinfles_fecha,'%Y/%m/%d') as fecha_modificacion,
        to_char(i.fec_mod_key,'%Y/%m/%d') as fecha_inf_valoracion,
        s.secc_long_desc as seccion_realizadora,
        cp.carg_long_desc as perfil_profesional,
        u.usu_nombre || ' ' || u.usu_primer_apellido as profesioal
      FROM
          episodios e
          INNER JOIN informes i on i.epi_key = e.epi_key
          INNER JOIN cuidados_enfermeria cu on cu.informe_key = i.informe_key
          INNER JOIN cuidados_enfermeria_lesiones cui on cui.cuen_key = cu.cuen_key
          LEFT JOIN orion_dba.uhd_informe_lesiones ui on cui.cuen_les_key = ui.cuen_les_key
          INNER JOIN orion_dba.profesionales pro on pro.prof_key = cui.prof_key
          INNER JOIN orion_dba.usuarios u on u.usu_key = pro.usu_key
          INNER JOIN secciones s on s.secc_key = pro.secc_key
          INNER JOIN orion_dba.cargos_profesionales cp on cp.carg_key = pro.carg_key
          INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
          INNER JOIN camas c on oc.cama_key = c.cama_key
      WHERE
          ui.uinfles_fechacrea >= oc.fecha_ocupa_ini
      AND (ui.uinfles_fechacrea >= oc.fecha_ocupa_fin  OR oc.fecha_ocupa_fin is null)
      ;
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async procedimientos() {
    const sentenciaSQL = `
      SELECT DISTINCT
        p.paci_sip,
        p.paci_nd,
        e.numicu as numicu,
        a.acto_desc as procedimiento,
        cla.clas_key as codigo_CIE,
        ac.fec_insercion_clinico as fecha_registro,
        u.usu_key as autor,
        cp.carg_long_desc as perfil,
        s.secc_long_desc as seccion_profesional
      FROM actos a
        INNER JOIN episodios e on a.epi_key = e.epi_key
        INNER JOIN pacientes p on p.paci_key = a.paci_key
        INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on c.cama_key = oc.cama_key
        INNER JOIN orion_dba.actos_informes ac on ac.acto_key = a.acto_key
        INNER JOIN orion_dba.profesionales pro on pro.prof_key = a.prof_mod_key
        INNER JOIN secciones s on s.secc_key = pro.secc_key
        INNER JOIN usuarios u on u.usu_key = pro.usu_key
        INNER JOIN orion_dba.cargos_profesionales cp on cp.carg_key = pro.carg_key
        LEFT JOIN maestro_actos ma on a.maac_key = ma.maac_key
        LEFT JOIN orion_dba.clasificaciones cla on ma.id_clas_key = cla.id_clas_key
      WHERE
        a.acto_clinico = 1
      AND (cla.ctma_familia = 'FAMCLAS2' OR cla.ctma_familia is null)
      AND e.epi_fecha_alta IS NULL
      ;
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async terapeutica() {
    const sentenciaSQL = `
      SELECT
        P.paci_nd AS NHC,
        C.cod_cama_key AS Cama ,
        P.paci_nombre || ' ' || P.paci_primer_apellido AS paciente,
        N.nemo_short_desc AS Nemonico,
        elt.eltr_long_desc AS ESTADO,
        to_char(LT.litr_fecha_prescripcion,'%Y/%m/%d %H:%M') AS Prescripcion,
        to_char(LT.litr_fecha_ultima_modificacion,'%Y/%m/%d %H:%M') AS Modificacion,
        U.usu_nombre  || ' ' || U.usu_primer_apellido AS facultativo,
        CASE
          when N.nemo_is_fluidoterapia = 1 then 'Fluidoterapia'
          when N.nemo_is_nutricion_parenteral = 1 then 'Nutricion Parenteral'
          when N.nemo_tipo_medicacion = 58 then 'Dietas (SIN CN)'
          when N.nemo_tipo_medicacion = 35 then 'Especialidad Farmaceutica'
          when N.nemo_tipo_medicacion = 56 then 'Nutricion Enteral'
          when N.nemo_tipo_medicacion = 37 then 'Formula Magistral'
          when N.nemo_tipo_medicacion = 50 then 'Dosis Fraccionadas'
          when N.nemo_tipo_medicacion = 51 then 'Productos Alergia'
          when N.nemo_tipo_medicacion = 40 then 'Dietas'
          when N.nemo_tipo_medicacion = 45 then 'EXTRANJERO Y USO COMPASIVO'
          when N.nemo_tipo_medicacion = 46 then 'PREPARADO DE LA INDUSTRIA'
        END AS TIPO
      FROM lineas_tratamiento LT
        INNER JOIN episodios EP on LT.epi_key = EP.epi_key
        INNER JOIN pacientes P on EP.paci_key = P.paci_key
        INNER JOIN nemonicos N on LT.nemo_key_principal = N.nemo_key
        INNER JOIN profesionales PF on LT.prof_key_prescriptor = PF.prof_key
        INNER JOIN usuarios U on PF.usu_key = U.usu_key
        INNER JOIN ocupacion_camas OC on LT.epi_key = OC.epi_key
        INNER JOIN camas C on OC.cama_key = C.cama_key
        INNER JOIN estados_linea_tratamiento ELT on LT.eltr_key = ELT.eltr_key
        INNER JOIN campos_tablas_maestras CTMA on EP.esta_epi_key = CTMA.ctma_key
      WHERE
        oc.fecha_ocupa_fin IS NULL
      AND LT.litr_fecha_prescripcion  BETWEEN '2018-06-05 00:00:00' AND CURRENT
      ;
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async aisladosAhora() {
    const sentenciaSQL = `
      SELECT DISTINCT
       p.paci_nd AS NHC,
       p.paci_sip AS SIP,
       TRIM( p.paci_primer_apellido || ', ' ||  p.paci_nombre ) AS nombre,
       c.cod_cama_key AS cama,
       mt2.mati_desc AS tipo_aislamiento
      FROM
        paciente_preventivista pp
        INNER JOIN area_paciente_preventivista ap ON ap.pac_prev_key = pp.pac_prev_key
        INNER JOIN maestro_tipos mt on mt.mati_key = ap.tpap_key
        INNER JOIN regla_paciente_preventivista rp ON rp.area_pac_prev_key = ap.area_pac_prev_key
        INNER JOIN apartado_precaucion_aislamiento_preventivista apa ON apa.regla_key = rp.reg_pa_prev_key
        LEFT  JOIN microorganismo_aislamiento_preventivista mic ON mic.apartado_key = apa.apap_key
        LEFT  JOIN maestro_tipos mt2 ON mt2.mati_key = apa.tiap_key
        INNER JOIN episodios e ON e.epi_key = pp.epi_key
        INNER JOIN ocupacion_camas oc ON oc.epi_key = e.epi_key
        INNER JOIN camas c ON c.cama_key = oc.cama_key
        INNER JOIN pacientes p ON e.paci_key = p.paci_key
      WHERE
           mt.mati_cod = 'PREAIS'
       AND ap.est_area_pa_prev <> 38
       AND mic.fec_ini_mo IS NOT NULL
       AND mic.fec_fin_mo IS NULL
       AND apa.fec_fin_aisla IS NULL
       AND OC.cama_ocupada = 1
      ORDER BY p.paci_nd
      ;
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async escalas(dtDesde: string, dtHasta: string) {
    const sentenciaSQL = `
      SELECT  distinct
          paci2.paci_sip              AS sip_paciente,
          paci2.paci_nd               AS nhc_paciente,
          epi2.numicu,
          C.cod_cama_key              AS cama,
          mesc.nombre_esc             AS nombre_escala,
          substring_index(rdoesc.urdoesc_resultado, '/', 1)  AS resultado,
          substring_index(substring_index(substring_index(rdoesc.urdoesc_resultado, '-',1),'- ',1),'/', -1 ) AS puntuacion_maxima,
          substring_index(rdoesc.urdoesc_resultado, '-', -1)  AS interpretacion,
          secc2.secc_long_desc,
          to_char(rdoesc.urdoesc_fecha,'%d/%m/%Y  %H:%M') as fecha_realizacion,
          prof2.prof_key as ID_Autor,
          cp.carg_long_desc as perfil_profesional
      FROM
          uhd_rdo_escala rdoesc
      INNER JOIN uhd_maestro_escalas mesc ON  mesc.esc_key = rdoesc.esc_key
      INNER JOIN episodios epi2 ON epi2.epi_key = rdoesc.epi_key
      INNER JOIN pacientes paci2 ON paci2.paci_key = epi2.paci_key
      INNER JOIN profesionales prof2 ON prof2.prof_key = rdoesc.prof_key
      INNER JOIN cargos_profesionales cp ON cp.carg_key = prof2.carg_key
      INNER JOIN secciones secc2 ON secc2.secc_key = prof2.secc_key
      INNER JOIN orion_dba.ocupacion_camas oc on epi2.epi_key = oc.epi_key
      INNER JOIN orion_dba.camas c on oc.cama_key = c.cama_key
      WHERE
      rdoesc.urdoesc_fecha BETWEEN '${dtDesde} 00:00:00' and '${dtHasta} 23:59:59'
      ;
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }
}