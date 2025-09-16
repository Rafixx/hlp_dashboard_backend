import { CLIENT_RENEG_LIMIT } from "tls"
import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class AdxRepository {
  async propuestasCitados( nhc: string ){
    const sentenciaSQL = `
      -- PROPUESTAS CITADOS
      SELECT
        vista.numerohc AS NHC,
        CASE
          WHEN TRIM(vista.presta) = 'E2.1' THEN 'Primera'
          WHEN TRIM(vista.presta) = 'E2.2' THEN 'Sucesiva'
          WHEN TRIM(vista.presta) = 'E2.3' THEN 'Prueba'
        END AS PRESTACION,
        CASE
          WHEN tecnica IS NULL THEN '' ELSE vista.tecnica
        END AS TECNICA,
        per.apellido1 AS PETICIONARIO,
        vista.nlcx_ser_des AS SERVICIO,
        vista.nomhospital AS HOSPITAL_DESTINO,
        vista.nomserv AS SERVICIO_DESTINO,
        to_char(vista.fechac,'%Y/%m/%d') AS FECHA_CITA,
        vista.nlcx_horcita AS HORA_CITA,
        vista.apellido1 AS GESTOR
      FROM v_prop_cext_pac_ingr vista
    --      INNER JOIN iriexp.no_lecex1 nl1 ON vista.numerohc = nl1.numerohc
        INNER JOIN iriexp.personal per ON vista.medip = per.codpers
      WHERE
          vista.fechac IS NOT NULL
      AND vista.nlcx_ser_des NOT IN ( 'XFON', 'XADX' )
      AND vista.fechac >= TODAY
    --    AND vista.fechac = nl1.fechac
      AND vista.numerohc = '${nhc}'
      ORDER BY vista.fechac, vista.nlcx_horcita
      ;
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
        nl1.obs1 AS OBSERVACIONES,
        nl1.obs2 AS OBSERVACIONES,
        nl1.obs3 AS OBSERVACIONES
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
}