import { CLIENT_RENEG_LIMIT } from "tls"
import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class PreveRepository {
  async aislaIncidencia(dtDesde: string, dtHasta: string){
    const sentenciaSQL = `
      -- INCIDENCIA AISLAMIENTO
      SELECT
        p.paci_nd as NHC,
        p.paci_sip as SIP,
        e.numicu as numicu,
        c.cod_cama_key,
        mt2.mati_desc as tipo_aislamiento,
        to_char(apa.fec_ini_aisla,'%d/%m/%Y') as inicio_aislamiento,
        to_char(apa.fec_fin_aisla,'%d/%m/%Y') as fin_aislamiento,
        mm.mamo_desc as motivo_aislamiento ,
        mt4.mati_desc as origen,
        mt3.mati_desc as microorganismo,
        to_char(mic.fec_ini_mo,'%d/%m/%Y') as fecha_inicio_microorganismo,
        to_char(mic.fec_fin_mo,'%d/%m/%Y') as fecha_fin_microorganismo
      FROM orion_dba.paciente_preventivista pp
        INNER JOIN orion_dba.maestro_estados me on me.maes_key = pp.maes_key
        INNER JOIN orion_dba.area_paciente_preventivista ap on ap.pac_prev_key = pp.pac_prev_key
        INNER JOIN orion_dba.maestro_tipos mt on mt.mati_key = ap.tpap_key
        INNER JOIN orion_dba.maestro_estados me2 on me2.maes_key = ap.est_area_pa_prev
        INNER JOIN orion_dba.regla_paciente_preventivista rp on rp.area_pac_prev_key = ap.area_pac_prev_key
        INNER JOIN orion_dba.apartado_precaucion_aislamiento_preventivista apa on apa.regla_key = rp.reg_pa_prev_key
        LEFT JOIN orion_dba.microorganismo_aislamiento_preventivista mic on mic.apartado_key = apa.apap_key
        LEFT JOIN orion_dba.maestro_tipos mt2 on mt2.mati_key = apa.tiap_key
        LEFT JOIN orion_dba.maestro_tipos mt3 on mt3.mati_key = mic.mati_key
        LEFT JOIN orion_dba.maestro_motivos mm on mm.mamo_key = mic.mamo_key
        LEFT JOIN orion_dba.maestro_tipos mt4 on mt4.mati_key = mic.tipinf_key
        INNER JOIN episodios e on e.epi_key = pp.epi_key
        INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on c.cama_key = oc.cama_key
        INNER JOIN pacientes p on e.paci_key = p.paci_key
      WHERE
          mt.mati_cod = 'PREAIS'
      AND ap.est_area_pa_prev <> 38
      AND apa.fec_ini_aisla BETWEEN  TO_DATE('${dtDesde}', '%Y-%m-%d') and TO_DATE('${dtHasta}', '%Y-%m-%d')
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async aislaPrevalencia(dtDesde: string, dtHasta: string){  
    const sentenciaSQL = `
      -- PREVALENCIA AISLAMIENTO
      SELECT
        p.paci_nd as NHC,
        p.paci_sip as SIP,
        e.numicu as numicu,
        c.cod_cama_key,
        mt2.mati_desc as tipo_aislamiento,
        to_char(apa.fec_ini_aisla,'%d/%m/%Y') as inicio_aislamiento,
        to_char(apa.fec_fin_aisla,'%d/%m/%Y') as fin_aislamiento,
        mm.mamo_desc as motivo_aislamiento ,
        mt4.mati_desc as origen,
        mt3.mati_desc as microorganismo,
        to_char(mic.fec_ini_mo,'%d/%m/%Y') as fecha_inicio_microorganismo,
        to_char(mic.fec_fin_mo,'%d/%m/%Y') as fecha_fin_microorganismo
      FROM orion_dba.paciente_preventivista pp
        INNER JOIN orion_dba.maestro_estados me on me.maes_key = pp.maes_key
        INNER JOIN orion_dba.area_paciente_preventivista ap on ap.pac_prev_key = pp.pac_prev_key
        INNER JOIN orion_dba.maestro_tipos mt on mt.mati_key = ap.tpap_key
        INNER JOIN orion_dba.maestro_estados me2 on me2.maes_key = ap.est_area_pa_prev
        INNER JOIN orion_dba.regla_paciente_preventivista rp on rp.area_pac_prev_key = ap.area_pac_prev_key
        INNER JOIN orion_dba.apartado_precaucion_aislamiento_preventivista apa on apa.regla_key = rp.reg_pa_prev_key
        LEFT JOIN orion_dba.microorganismo_aislamiento_preventivista mic on mic.apartado_key = apa.apap_key
        LEFT JOIN orion_dba.maestro_tipos mt2 on mt2.mati_key = apa.tiap_key
        LEFT JOIN orion_dba.maestro_tipos mt3 on mt3.mati_key = mic.mati_key
        LEFT JOIN orion_dba.maestro_motivos mm on mm.mamo_key = mic.mamo_key
        LEFT JOIN orion_dba.maestro_tipos mt4 on mt4.mati_key = mic.tipinf_key
        INNER JOIN episodios e on e.epi_key = pp.epi_key
        INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on c.cama_key = oc.cama_key
        INNER JOIN pacientes p on e.paci_key = p.paci_key
      WHERE
          mt.mati_cod = 'PREAIS'
      AND ap.est_area_pa_prev <> 38
      AND apa.fec_ini_aisla <= TO_DATE('${dtHasta}', '%Y-%m-%d')
      AND ((apa.fec_fin_aisla >= TO_DATE('${dtDesde}', '%Y-%m-%d') OR (apa.fec_fin_aisla IS NULL))
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  } 

  async colonoPrevalente(dtDesde: string, dtHasta: string){
    const sentenciaSQL = `
      -- PREVALENCIA COLONIZACIÓN
      SELECT
        p.paci_nd as NHC,
        p.paci_sip as SIP,
        e.numicu as numicu,
        c.cod_cama_key as cama,
        mm.mamo_desc as motivo_aislamiento ,
        to_char(mic.fec_ini_mo,'%d/%m/%Y') as inicio_microorganismo,
        CASE
          WHEN mic.fec_fin_mo IS NULL THEN '' ELSE to_char(mic.fec_fin_mo,'%d/%m/%Y')
        END AS fin_microorganismo,
        mt4.mati_desc as origen,
        mt3.mati_desc as microorganismo,
        CASE
          WHEN e.epi_fecha_alta IS NULL THEN '' ELSE to_char(e.epi_fecha_alta,'%d/%m/%Y')
        END AS ALTA,
        secc.secc_short_desc AS PROGRAMA,
        to_char(con.cont_fecha_inicio,'%d/%m/%Y') as PRORAMA_DESDE
      FROM paciente_preventivista pp
        INNER JOIN maestro_estados me on me.maes_key = pp.maes_key
        INNER JOIN area_paciente_preventivista ap on ap.pac_prev_key = pp.pac_prev_key
        INNER JOIN maestro_tipos mt on mt.mati_key = ap.tpap_key
        INNER JOIN maestro_estados me2 on me2.maes_key = ap.est_area_pa_prev
        INNER JOIN regla_paciente_preventivista rp on rp.area_pac_prev_key = ap.area_pac_prev_key
        INNER JOIN apartado_precaucion_aislamiento_preventivista apa on apa.regla_key = rp.reg_pa_prev_key
        LEFT JOIN microorganismo_aislamiento_preventivista mic on mic.apartado_key = apa.apap_key
        LEFT JOIN maestro_tipos mt2 on mt2.mati_key = apa.tiap_key
        LEFT JOIN maestro_tipos mt3 on mt3.mati_key = mic.mati_key
        LEFT JOIN maestro_motivos mm on mm.mamo_key = mic.mamo_key
        LEFT JOIN maestro_tipos mt4 on mt4.mati_key = mic.tipinf_key
        INNER JOIN episodios e on e.epi_key = pp.epi_key
        INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on c.cama_key = oc.cama_key
        INNER JOIN pacientes p on e.paci_key = p.paci_key
        INNER JOIN orion_dba.contactos con ON con.epis_key = e.epi_key
        INNER JOIN orion_dba.secciones secc ON secc.secc_key = con.secc_key
      WHERE
          mt.mati_cod = 'PREAIS'
      AND ap.est_area_pa_prev <> 38
      AND mic.fec_ini_mo <= TO_DATE('${dtHasta}', '%Y-%m-%d')
      AND ((mic.fec_fin_mo >= TO_DATE('${dtDesde}', '%Y-%m-%d') OR (mic.fec_fin_mo IS NULL))
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async frotisPendientes(){
    const sentenciaSQL = `
      -- FROTIS PENDIENTES
			SELECT DISTINCT
					p.paci_sip,
					p.paci_nd,
					c.cod_cama_key,
					p.paci_nombre || ' ' || p.paci_primer_apellido AS PACIENTE,
					to_char(LT.litr_fecha_prescripcion,'%Y/%m/%d') AS Prescripcion,
					TO_CHAR(lt.litr_fecha_inicio,'%Y/%m/%d') AS INICIO,
					lti.ltin_descripcion
			FROM pacientes p
					INNER JOIN episodios e on p.paci_key = e.paci_key
					INNER JOIN hojas_tratamiento ht on ht.paci_key = p.paci_key
					INNER JOIN lineas_tratamiento lt on lt.hotr_key = ht.hotr_key
					INNER JOIN lt_intervenciones_colaboracion lti on lti.litr_key = lt.litr_key
					INNER JOIN profesionales pro on pro.prof_key = lt.litr_prof_prescriptor_original
					INNER JOIN secciones s on s.secc_key = pro.secc_key
					LEFT JOIN registros_administracion ra on ra.litr_key = lt.litr_key
					LEFT JOIN ocupacion_camas oc on oc.epi_key = e.epi_key
					LEFT JOIN camas c on oc.cama_key = c.cama_key
			WHERE
					lt.tltr_key = 4
			AND lt.eltr_key IN (17,18,19)
			AND (ra.erad_key IN (3,5,15) OR ra.erad_key is null)
			AND s.ctma_tipo = 'TSECC9'
			AND (lti.ltin_descripcion like '%frotis%'  OR  lti.ltin_descripcion like '%Frotis%')
			AND oc.fecha_ocupa_fin IS NULL
			AND oc.cama_ocupada = 1
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async heridas(){
    const sentenciaSQL = `
      -- HERIDAS
      SELECT
        cui.cuen_les_key as id_herida,
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
        u.usu_nombre as autor,
        u.usu_primer_apellido as apellido_autor,
        u.usu_segundo_apellido as segundo_apellido_autor,
        cp.carg_long_desc as perfil_profesional
      FROM
        episodios e
        INNER JOIN informes i on i.epi_key = e.epi_key
        INNER JOIN cuidados_enfermeria cu on cu.informe_key = i.informe_key
        INNER JOIN cuidados_enfermeria_lesiones cui on cui.cuen_key = cu.cuen_key
        INNER JOIN orion_dba.campos_tablas_maestras ctm on ctm.ctma_key = cui.ctma_tip_les_enf
        LEFT JOIN orion_dba.campos_tablas_maestras ctm2 on ctm2.ctma_key = cui.ctma_tip_qui_enf
        LEFT JOIN orion_dba.campos_tablas_maestras ctm3 on ctm3.ctma_key = cui.ctma_tip_ulc_enf
        LEFT JOIN orion_dba.campos_tablas_maestras ctm4 on ctm4.ctma_key = cui.ctma_tipo_traumatica
        LEFT JOIN orion_dba.campos_tablas_maestras ctm5 on ctm5.ctma_key = cui.cuen_les_localizacion
        LEFT JOIN orion_dba.campos_tablas_maestras ctm6 on ctm6.ctma_key = cui.ctma_ulcera_lado
        LEFT JOIN orion_dba.campos_tablas_maestras ctm7 on ctm7.ctma_key = cui.ctma_gra_que_enf
        LEFT JOIN orion_dba.maestro_tipos mt on mt.mati_key = cui.cuen_les_procedencia
        INNER JOIN orion_dba.profesionales pro on pro.prof_key = cui.prof_key
        INNER JOIN orion_dba.usuarios u on u.usu_key = pro.usu_key
        INNER JOIN secciones s on s.secc_key = pro.secc_key
        INNER JOIN orion_dba.cargos_profesionales cp on cp.carg_key = pro.carg_key
        INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on oc.cama_key = c.cama_key
      WHERE
          i.tip_informe_key = 'TIPINF28'
      AND cui.cuen_les_eliminado = 0
      AND cui.cuen_les_fecha >= oc.fecha_ocupa_ini
      AND (cui.cuen_les_fecha >= oc.fecha_ocupa_fin OR oc.fecha_ocupa_fin is null)
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async infecciones(dtDesde: string, dtHasta: string){
    const sentenciaSQL = `
      -- INFECCIONES
      SELECT
        p.paci_nd as NHC,
        p.paci_sip as SIP,
        e.numicu as numicu,
        c.cod_cama_key as cama,
        mt5.mati_desc as localizacion_infeccion ,
        to_char(li.fec_ini_loc,'%d/%m/%Y') as fecha_inicio_localizacion,
        mt4.mati_desc as tipo_infeccion,
        mt6.mati_desc as microorganismo,
        mt2.mati_desc as factor_riesgo_intrinsecio,
        mt7.mati_desc as factor_riesgo_extrinsecio,
        to_char(fl.fec_ini,'%d/%m/%Y') as fecha_ini_factor_riesgo_ext,
        to_char(fl.fec_fin,'%d/%m/%Y') as fecha_fin_factor_riesgo_ext,
        secc.secc_short_desc AS PROGRAMA,
        to_char(con.cont_fecha_inicio,'%d/%m/%Y') as PRORAMA_DESDE
      FROM orion_dba.paciente_preventivista pp
        INNER JOIN orion_dba.maestro_estados me on me.maes_key = pp.maes_key
        INNER JOIN orion_dba.area_paciente_preventivista ap on ap.pac_prev_key = pp.pac_prev_key
        INNER JOIN orion_dba.maestro_tipos mt on mt.mati_key = ap.tpap_key
        INNER JOIN orion_dba.maestro_estados me2 on me2.maes_key = ap.est_area_pa_prev
        INNER JOIN orion_dba.regla_paciente_preventivista rp on rp.area_pac_prev_key = ap.area_pac_prev_key
        INNER JOIN orion_dba.apartado_infeccion_nocosomial_preventivista apa on apa.regla_key = rp.reg_pa_prev_key
        LEFT JOIN apartadonocosomial_friesgointrinseco apf on apf.apartado_key = apa.ainp_key
        LEFT JOIN  localizacion_infeccion_preventivista li on li.apartado_key = apa.ainp_key
        LEFT JOIN orion_dba.maestro_tipos mt2 on mt2.mati_key = apf.tipfri_key
        LEFT JOIN orion_dba.maestro_tipos mt4 on mt4.mati_key = li.tipinf_key
        LEFT JOIN orion_dba.maestro_tipos mt5 on mt5.mati_key = li.tiploc_key
        LEFT JOIN orion_dba.localizacion_microorganismo lm on lm.loc_key = li.locinp_key
        LEFT JOIN orion_dba.maestro_tipos mt6 on mt6.mati_key = lm.tipmic_key
        LEFT JOIN friesgo_extrinseco_localizacion_infeccion_preventivista fl on fl.loc_fre_key = li.locinp_key
        LEFT JOIN orion_dba.maestro_tipos mt7 on mt7.mati_key = fl.tipfre_key
        INNER JOIN episodios e on e.epi_key = pp.epi_key
        INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on c.cama_key = oc.cama_key
        INNER JOIN pacientes p on e.paci_key = p.paci_key
        INNER JOIN orion_dba.contactos con ON con.epis_key = e.epi_key
        INNER JOIN orion_dba.secciones secc ON secc.secc_key = con.secc_key    
      WHERE
    --      ap.est_area_pa_prev <> 38 AND
          mt.mati_cod = 'INFNOSO'
      AND li.fec_ini_loc between TO_DATE('${dtDesde}', '%Y-%m-%d') and TO_DATE('${dtHasta}', '%Y-%m-%d')
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async intervencioinesColaboracion(){
    const sentenciaSQL = `
      -- INTERVENCIONES COLABORACIÓN
      SELECT DISTINCT
        c.cod_cama_key as cama,
        lti.ltin_descripcion as descripcion,
        lt.litr_obs_enfermeria as observaciones,
        era.erad_long_desc as estado,
        tma.tmna_long_desc as motivo_no_administracion,
        to_char(ra.read_fecha_modificacion,'%Y/%m/%d %H:%M') as fecha_hora_administracion_o_no_admin,
        s.secc_long_desc as seccion_realizadora,
        cp.carg_long_desc
      FROM pacientes p
        INNER JOIN episodios e on p.paci_key = e.paci_key
        INNER JOIN hojas_tratamiento ht on ht.paci_key = p.paci_key
        INNER JOIN lineas_tratamiento lt on lt.hotr_key = ht.hotr_key
        INNER JOIN lt_intervenciones_colaboracion lti on lti.litr_key = lt.litr_key
        LEFT JOIN registros_administracion ra on ra.litr_key = lt.litr_key
        INNER JOIN ocupacion_camas oc on oc.epi_key = e.epi_key
        INNER JOIN camas c on oc.cama_key = c.cama_key
        LEFT JOIN tipos_motivos_no_administracion tma on tma.tmna_key = ra.tmna_key
        LEFT JOIN estados_registro_administracion era on era.erad_key = ra.erad_key
        LEFT JOIN profesionales pro on pro.prof_key = ra.prof_key
        LEFT JOIN secciones s on s.secc_key = pro.secc_key
        INNER JOIN cargos_profesionales cp on cp.carg_key = pro.carg_key
      WHERE
          lt.tltr_key = 4
      AND e.epi_fecha_alta IS NULL
      AND ra.erad_key not in (3)
      AND lt.litr_fecha_prescripcion >= oc.fecha_ocupa_ini
      AND (lt.litr_fecha_prescripcion >= oc.fecha_ocupa_fin or oc.fecha_ocupa_fin is null)
      AND LT.litr_fecha_prescripcion  BETWEEN DATE(CURRENT) - 30 AND CURRENT
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async vacunas(dtDesde: string, dtHasta: string){
    const sentenciaSQL = `
      -- VACUNAS
          SELECT
    p.paci_nd as NHC,
    p.paci_sip as SIP,
    e.numicu as numicu,
    c.cod_cama_key,
    to_char(e.epi_ini_episodio,'%d/%m/%Y') as ingreso,
    to_char(pvp.fec_presc,'%d/%m/%Y') as fecha_prescripcion_vacuna,
    vcp.nombre as vacuna,
    to_char(rp.fecha_cierre,'%d/%m/%Y') as cierre,
    to_char(e.epi_fecha_alta_admin,'%d/%m/%Y') as fecha_alta
    FROM orion_dba.paciente_preventivista pp
      INNER JOIN orion_dba.maestro_estados me on me.maes_key = pp.maes_key
      INNER JOIN orion_dba.area_paciente_preventivista ap on ap.pac_prev_key = pp.pac_prev_key
      INNER JOIN orion_dba.maestro_tipos mt on mt.mati_key = ap.tpap_key
      INNER JOIN orion_dba.maestro_estados me2 on me2.maes_key = ap.est_area_pa_prev
      INNER JOIN orion_dba.regla_paciente_preventivista rp on rp.area_pac_prev_key = ap.area_pac_prev_key
      INNER JOIN regla_cie_paciente_preventivista rcie on rcie.reg_pa_prev_key = rp.reg_pa_prev_key
      INNER JOIN apartado_vacunas_preventivista avp on avp.avacp_key = rcie.reg_ap_key
      INNER JOIN orion_dba.protocolo_vacunacion_prescripcion_preventivista pvp on pvp.regla_key = rcie.reg_pa_prev_key
      INNER JOIN orion_dba.vacuna_apartado_preventivista vcp on vcp.pv_key = pvp.pvpp_key
      INNER JOIN episodios e on e.epi_key = pp.epi_key
      INNER JOIN orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
      INNER JOIN camas c on c.cama_key = oc.cama_key
      INNER JOIN pacientes p on e.paci_key = p.paci_key
    WHERE
        ap.est_area_pa_prev <> 38 and mt.mati_cod = 'VAC'
		AND pvp.fec_presc between TO_DATE('${dtDesde}', '%Y-%m-%d') and TO_DATE('${dtHasta}', '%Y-%m-%d')
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }
  
async vacunasFechaInicio(){
    const sentenciaSQL = `
      --VACUNAS PDTES CON FECHA INICIO

    SELECT DISTINCT
      c.cod_cama_key AS CAMA,
      P.paci_nd AS NHC,
      TRIM( p.paci_nombre || ' ' ||  p.paci_primer_apellido ) AS PACIENTE,
      p.paci_sip AS SIP,
      TO_CHAR(lt.litr_fecha_prescripcion,'%Y/%m/%d') AS PRESCIPCION,
      TO_CHAR(lt.litr_fecha_inicio,'%Y/%m/%d') AS INICIO,
      lti.ltin_descripcion AS DESCRIPCION,
      lt.litr_obs_del_prescriptor AS OBSERVACIONES
    FROM pacientes p
      INNER JOIN episodios e ON e.paci_key = p.paci_key
      INNER JOIN hojas_tratamiento ht ON ht.paci_key = p.paci_key
      INNER JOIN lineas_tratamiento lt ON lt.hotr_key = ht.hotr_key
      INNER JOIN lt_intervenciones_colaboracion lti ON lti.litr_key = lt.litr_key
      INNER JOIN profesionales pro ON pro.prof_key = lt.litr_prof_prescriptor_original
      INNER JOIN secciones s ON s.secc_key = pro.secc_key

      INNER JOIN paciente_preventivista pp ON pp.epi_key = e.epi_key
      INNER JOIN area_paciente_preventivista ap ON ap.pac_prev_key = pp.pac_prev_key
      INNER JOIN regla_paciente_preventivista rp ON rp.area_pac_prev_key = ap.area_pac_prev_key
      INNER JOIN regla_cie_paciente_preventivista rcie ON rcie.reg_pa_prev_key = rp.reg_pa_prev_key
      INNER JOIN apartado_vacunas_preventivista avp ON avp.avacp_key = rcie.reg_ap_key

      LEFT JOIN registros_administracion ra ON ra.litr_key = lt.litr_key
      LEFT JOIN ocupacion_camas oc ON oc.epi_key = e.epi_key
      LEFT JOIN camas c ON c.cama_key = oc.cama_key
      LEFT JOIN estados_registro_administracion erad ON erad.erad_key = ra.erad_key
      LEFT JOIN estados_linea_tratamiento eltr ON eltr.eltr_key = lt.eltr_key
    WHERE
      lt.tltr_key = 4
    --and lt.eltr_key in (17,18,19)
    --and (ra.erad_key in (3,5,15) or ra.erad_key is null)
    AND s.ctma_tipo = 'TSECC9'
    AND (lti.ltin_descripcion LIKE '%PREV_V%' ) -- sólo aparecen las VACUNAS
    AND oc.fecha_ocupa_fin IS NULL
    AND oc.cama_ocupada = 1
    AND lt.eltr_key <> 21 -- eltr = estado_linea_tratamiento 21 = SUSPENDIDA
    ORDER BY CAMA
  `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }

  async vacunasPendientes(){
    const sentenciaSQL = `
    --VACUNAS PENDIENTES
      SELECT DISTINCT
        p.paci_nd,
        p.paci_sip,
        c.cod_cama_key,
        p.paci_nombre || ' ' || p.paci_primer_apellido as paciente,
        to_char(lt.litr_fecha_prescripcion,'%d/%m/%Y') as prescripcion,
        lti.ltin_descripcion
      FROM pacientes p inner join episodios e on p.paci_key = e.paci_key
        INNER JOIN orion_dba.hojas_tratamiento ht on ht.paci_key = p.paci_key
        INNER JOIN orion_dba.lineas_tratamiento lt on lt.hotr_key = ht.hotr_key
        INNER JOIN orion_dba.lt_intervenciones_colaboracion lti on lti.litr_key = lt.litr_key
        INNER JOIN orion_dba.profesionales pro on pro.prof_key = lt.litr_prof_prescriptor_original
        INNER JOIN secciones s on s.secc_key = pro.secc_key
        LEFT JOIN orion_dba.registros_administracion ra on ra.litr_key = lt.litr_key
        LEFT JOIN  orion_dba.ocupacion_camas oc on oc.epi_key = e.epi_key
        LEFT JOIN camas c on oc.cama_key = c.cama_key
      WHERE
          lt.tltr_key = 4
      AND lt.eltr_key in (17,18,19)
      AND (ra.erad_key in (3,5,15) or ra.erad_key is null)
      AND s.ctma_tipo = 'TSECC9'
      AND (lti.ltin_descripcion not like '%frotis%'  and  lti.ltin_descripcion not like '%Frotis%')
      AND oc.fecha_ocupa_fin is null and oc.cama_ocupada = 1
    `
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }
}