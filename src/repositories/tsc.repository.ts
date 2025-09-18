import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class TscRepository {
  async listadoIngresados(){
    const sentenciaSQL = `
      --  LISTADOS INGRESADOS
      SELECT
        CASE
          WHEN LEFT(cp.ncama, 3) <= 120 THEN 'PLANTA 1A'
          WHEN LEFT(cp.ncama, 3) >= 201 AND
               LEFT(cp.ncama, 3) <= 214 THEN 'PLANTA 2A'
          WHEN LEFT(cp.ncama, 3) >= 216 AND
               LEFT(cp.ncama, 3) <= 222 THEN 'PLANTA 2B'
          WHEN LEFT(cp.ncama, 3) >= 301 AND
               LEFT(cp.ncama, 3) <= 314 THEN 'PLANTA 3A'
          WHEN LEFT(cp.ncama, 3) >= 315 THEN 'PLANTA 3B'
        END AS PLANTA,
        cp.ncama AS CAMA,
        paci.paci_sip AS SIP,
        CASE
          WHEN paci.apellid2 IS NULL THEN paci.apellid1 || paci.nombre
          WHEN paci.apellid2 <> '' THEN paci.apellid1 || paci.apellid2 ||paci.nombre
        END AS PACIENTE,
        cp.servreal AS SERVICIO,
        pers.nomb || pers.apellido1 AS MEDICO,
        cp.fecha_ingreso AS INGRESO,
        cp.camp_tra AS PUA
      FROM camas_paci cp
        INNER JOIN pacientes paci ON cp.numerohc = paci.numerohc
        INNER JOIN personal pers ON cp.cod_medico = pers.codpers
      ORDER BY ncama
      ;
    ` 
    const result = await executeQueryIRIS(sentenciaSQL)
    return result
  }


}