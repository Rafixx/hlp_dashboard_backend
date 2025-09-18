import { CLIENT_RENEG_LIMIT } from "tls"
import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class AdxRepository {
  async propuestasCitados( dtDesde: string, dtHasta: string, camaDsd: string, camaHst: string ) {
    const sentenciaSQL = `
      -- PROPUESTAS CITADOS
    SELECT
      ncama AS CAMA,
      CASE
        WHEN nlcx_fecresu IS NULL THEN 'Sin resultado'
        ELSE to_char(nlcx_fecresu,'%Y/%m/%d')
      END AS RESULTADO,
      CASE
        WHEN TRIM(presta) = 'E2.1' THEN 'Primera'
        WHEN TRIM(presta) = 'E2.2' THEN 'Sucesiva'
        WHEN TRIM(presta) = 'E2.3' THEN 'Prueba'
        WHEN TRIM(presta) = 'ET.1' THEN 'Telf Pri'
        WHEN TRIM(presta) = 'ET.2' THEN 'Telf Suc'
      END AS PRESTACION,
      CASE
        WHEN tecnica IS NULL THEN '' ELSE tecnica
      END AS TECNICA,
      numerohc AS NHC,
      nombre || ' ' || apellid12 AS Paciente,
      nlcx_ser_des AS SERVICIO,
      nomhospital AS HOSPITAL_DESTINO,
      nomserv AS SERVICIO_DESTINO,
      to_char(fechac,'%Y/%m/%d') AS FECHA_CITA,
      nlcx_horcita AS HORA_CITA,
      apellido1 AS GESTOR
    FROM v_prop_cext_pac_ingr
    WHERE
        fechac IS NOT NULL
    AND nlcx_ser_des NOT IN ( 'XFON', 'XADX' )
    AND LEFT( ncama, 3) BETWEEN '${camaDsd}' AND '${camaHst}'
    AND fechac between '${dtDesde}' and '${dtHasta}'
    ORDER BY fechac, nlcx_horcita      ;
    ` 
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async propuestasDadosDeAlta( nhc: string ){
    const sentenciaSQL = `
      -- PROPUESTAS DADOS DE ALTA
      SELECT DISTINCT
        CASE
          WHEN TRIM(nl1.presta) = 'E2.1' THEN 'Primera'
          WHEN TRIM(nl1.presta) = 'E2.2' THEN 'Sucesiva'
          WHEN TRIM(nl1.presta) = 'E2.3' THEN 'Prueba'
        END AS PRESTACION,
        CASE
          WHEN nl1.nlcx_des_pro IS NULL THEN '' ELSE TRIM( nl1.nlcx_des_pro )
        END AS TECNICA,
        hosp.nomhospital AS HOSPITAL_DESTINO,
        serv.nomserv AS SERVICIO_DESTINO,
        CASE
          WHEN TRIM(nl1.prior) = 'P' THEN 'Sí'
          WHEN TRIM(nl1.prior) = 'N' THEN 'No'
        END AS PREFERENTE,
        to_char(nl1.fechac,'%Y/%m/%d') AS FECHA_CITA,
        nl1.nlcx_horcita AS HORA_CITA,
        to_char(nl1.nlcx_fec_sal,'%Y/%m/%d') AS FECHA_SALIDA,
        per.apellido1 AS GESTOR,
        nl1.nlcx_fecresu AS RESULTADOS,
        nl1.obs1 AS OBS1,
        nl1.obs2 AS OBS2,
        nl1.obs3 AS OBS3
      FROM iriexp.no_lecex1 nl1
        INNER JOIN iriexp.histo_paci hp ON hp.numerohc = nl1.numerohc
        INNER JOIN iriexp.hospitales hosp ON hosp.codhospi = nl1.nlcx_cen_des
        INNER JOIN iriexp.servicios serv ON serv.codserv = nl1.nlcx_ser_des
        INNER JOIN iriexp.personal per ON per.codpers = nl1.medip
      WHERE
        hp.numerohc = '${nhc}'
      ORDER BY SERVICIO_DESTINO, HOSPITAL_DESTINO, PRESTACION, TECNICA
      ;        
    ` 
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async propuestasTramitadas( nhc: string ){
    const sentenciaSQL = `
      -- PROPUESTAS TRAMITADAS
      SELECT DISTINCT
        CASE
          WHEN TRIM(vista.presta) = 'E2.1' THEN 'Primera'
          WHEN TRIM(vista.presta) = 'E2.2' THEN 'Sucesiva'
          WHEN TRIM(vista.presta) = 'E2.3' THEN 'Prueba'
        END AS PRESTACION,
        CASE
          WHEN vista.tecnica IS NULL THEN '' ELSE tecnica
        END AS TECNICA,
        vista.servp AS ORIGEN,
        vista.nomhospital AS HOSPITAL_DESTINO,
        vista.nomserv AS SERVICIO_DESTINO,
        to_char(vista.fechac, '%Y/%m/%d') AS FECHA_CITA,
        to_char(vista.nlcx_horcita, '%H:%M') AS HORA_CITA,
        CASE
          WHEN TRIM(nl1.prior) = 'P' THEN 'Sí'
          WHEN TRIM(nl1.prior) = 'N' THEN 'No'
        END AS PREFERENTE,
        per.apellido1 AS PETICIONARIO,
        vista.apellido1 AS GESTOR
      FROM iriexp.v_prop_cext_pac_ingr vista
        INNER JOIN iriexp.personal per ON vista.medip = per.codpers
        INNER JOIN iriexp.no_lecex1 nl1 ON vista.numerohc = nl1.numerohc
      WHERE
          vista.fechac IS NULL
      AND vista.servp IN ('CONV', 'ULE', 'UCPA', 'UDC')
      AND vista.nlcx_fecresu IS NULL
      AND vista.fechrech IS NULL
      AND vista.numerohc = '${nhc}'
      ORDER BY 4
        ;        
    ` 
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async altasXDpto(desde: string, hasta: string) {
    const sentenciaSQL = `
      -- ALTAS POR HOSPITAL DE REFERENCIA (DPTO)

      SELECT
        pa.paci_sip AS SIP,
        TRIM( pa.nombre ) || ' ' || TRIM( pa.apellid12 ) AS PACIENTE,
        hosp.nomhospital AS HOSPITAL,
        to_char(hp.fecha_alta,'%Y/%m/%d') AS ALTA,
        da.descri AS DESTINO
      FROM iriexp.histo_paci hp
        INNER JOIN iriexp.pacientes pa ON pa.numerohc = hp.numerohc
        INNER JOIN iriexp.horefpac hop ON hop.paci_sip = pa.paci_sip
        INNER JOIN iriexp.hospitales hosp ON hosp.hosp_cod_crc = hop.hosp_cod_crc
        INNER JOIN iriexp.des_althos da ON da.codigo = hp.dest_alta
      WHERE
      --  hp.fecha_alta BETWEEN TODAY -7 AND TODAY
        hp.fecha_alta BETWEEN '${desde}' AND '${hasta}'
        AND hop.hosp_cod_crc = ( SELECT hop2.hosp_cod_crc
                                  FROM horefpac hop2
                                  WHERE hop2.paci_sip = pa.paci_sip
                                  AND ( ( (hop2.fec_desde <= hp.fecha_alta ) AND (hop2.fec_hasta >= hp.fecha_alta ))
                                      OR ( (hop2.fec_desde <= hp.fecha_alta ) AND (hop2.fec_hasta IS NULL) ))
                                )
      ORDER BY HOSPITAL, ALTA
    `
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async pacientesIngresados(){
    const sentenciaSQL = `
      -- PACIENTES INGRESADOS
      SELECT
            CASE
              WHEN cp.camp_inf = 'S' THEN 'S'
              WHEN cp.camp_inf = 'N' THEN 'NO'
            END AS INFORMAR,
            paci.numerohc AS NHC,
            paci.paci_sip AS SIP,
            cp.ncama AS CAMA,
            CASE
              WHEN paci.apellid2 IS NULL THEN paci.apellid1 || paci.nombre
              WHEN paci.apellid2 IS NOT NULL THEN paci.apellid1 || paci.apellid2 ||paci.nombre
            END AS PACIENTE,
            LEFT( pob.nompobla, 15 ) AS MUNICIPIO,
            pers.nomb || pers.apellido1 AS MEDICO,
            cp.servreal AS SERVICIO,
            cp.fecha_ingreso AS INGRESO
      FROM camas_paci cp
      INNER JOIN pacientes paci ON cp.numerohc = paci.numerohc
      INNER JOIN personal pers ON cp.cod_medico = pers.codpers
      INNER JOIN poblaciones pob ON pob.codpobla = paci.poblares AND pob.codiprov = paci.provresi
      ORDER BY ncama
    `
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async pendientesCita() {
    const sentenciaSQL = `
    -- PACIENTES PENDIENTES DE CITA
			SELECT DISTINCT
				vista.ncama AS CAMA,
				nl1.numerohc AS NHC,
				TRIM( nl1.apellid12 ) || ', ' || TRIM( nl1.nombre ) AS NOMBRE,
				vista.servp AS SERVICIO,
				vista.nomserv AS SERVICIO_DESTINO,
				CASE
					WHEN TRIM(vista.presta) = 'E2.1' THEN 'Primera'
					WHEN TRIM(vista.presta) = 'E2.2' THEN 'Sucesiva'
					WHEN TRIM(vista.presta) = 'E2.3' THEN 'Prueba'
				END AS PRESTACION,
				CASE
					WHEN vista.tecnica IS NULL THEN '' ELSE tecnica
				END AS TECNICA,
				CASE
					WHEN TRIM(nl1.prior) = 'P' THEN 'Sí'
					WHEN TRIM(nl1.prior) = 'N' THEN 'No'
				END AS PREFERENTE,
				TO_CHAR(vista.nlcx_fec_sal, '%Y/%m/%d') AS FECHA_SALIDA,
				per.apellido1 AS PETICIONARIO,
				vista.apellido1 AS GESTOR
			FROM iriexp.v_prop_cext_pac_ingr vista
				INNER JOIN iriexp.personal per ON vista.medip = per.codpers
				INNER JOIN iriexp.no_lecex1 nl1 ON vista.numerohc = nl1.numerohc
			WHERE
					vista.fechac IS NULL
			AND vista.servp IN ('CONV', 'ULE', 'UCPA', 'UDC', 'UDCA' )
			AND vista.nlcx_fec_sal = nl1.nlcx_fec_sal
			AND vista.nlcx_fecresu IS NULL
			AND vista.fechrech IS NULL
   `
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async prestamosHC() {
    const sentenciaSQL = `
      -- DEMORA: DÍAS DEMORA HISTORIAS HOSPI
      SELECT noPrestados.numerohc, noPrestados.datasale, ultimoAlta.maxAlta, TODAY - maxAlta AS diasDemora
      FROM (
              SELECT pr.numerohc, pr.datasale
              FROM prestamos pr
                LEFT JOIN camas_paci cp ON cp.numerohc = pr.numerohc
              WHERE cp.numerohc IS NULL
      ) noPrestados
      INNER JOIN (
              SELECT hp.numerohc, MAX( hp.fecha_alta ) AS maxAlta
              FROM histo_paci hp
              GROUP BY hp.numerohc
      ) ultimoAlta ON noPrestados.numerohc = ultimoAlta.numerohc
      WHERE ultimoAlta.maxAlta > noPrestados.datasale
    `
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }

  async prestamosPdtes() {
    const sentenciaSQL = `
      -- PRESTAMOS: CAMAS_PACI NO COINCIDENTES CON PRESTAMOS
			SELECT
			  cp.numerohc
			FROM camas_paci cp
			    LEFT JOIN prestamos pr ON pr.numerohc = cp.numerohc
			WHERE pr.numerohc IS NULL
    `
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }


}