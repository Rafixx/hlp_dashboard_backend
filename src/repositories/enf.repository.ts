import { CLIENT_RENEG_LIMIT } from "tls"
import { executeQueryIRIS, executeQueryOC } from "../config/connection"

export class EnfRepository {
  async lesionesUPP(){
    const sentenciaSQL = `
      -- LESIONES UPP

      SELECT
         paci.paci_nd AS NHC,
         c.cod_cama_key AS cama,
         TO_CHAR(cui.cuen_les_fecha,'%Y/%m/%d') AS FECHA_REGISTRO,
         ctm3.ctma_desc AS tip_ulc_enf,
         ctm5.ctma_desc AS les_localizacion,
         ctm6.ctma_desc AS ulcera_lado,
         cui.ctma_ulcera_grado AS grado,
         mt.mati_desc AS les_procedencia,
         s2.secc_short_desc AS SERV_MED
      FROM
         camas c
         LEFT JOIN secciones s1 ON s1.secc_key = c.secc_fisi_cama
         LEFT JOIN ocupacion_camas oc ON oc.cama_key = c.cama_key
         LEFT JOIN episodios epi ON epi.epi_key = oc.epi_key
         LEFT JOIN pacientes paci ON paci.paci_key =  epi.paci_key
         LEFT JOIN contactos con ON con.epis_key = epi.epi_key
         LEFT JOIN secciones s2 ON s2.secc_key = con.secc_key
        INNER JOIN informes inf ON inf.epi_key = epi.epi_key
        INNER JOIN cuidados_enfermeria cu ON cu.informe_key = inf.informe_key
        INNER JOIN cuidados_enfermeria_lesiones cui ON cui.cuen_key = cu.cuen_key
         LEFT JOIN campos_tablas_maestras ctm1 ON ctm1.ctma_key = cui.ctma_tip_les_enf
         LEFT JOIN campos_tablas_maestras ctm2 ON ctm2.ctma_key = cui.ctma_tip_qui_enf
         LEFT JOIN campos_tablas_maestras ctm3 ON ctm3.ctma_key = cui.ctma_tip_ulc_enf
         LEFT JOIN campos_tablas_maestras ctm4 ON ctm4.ctma_key = cui.ctma_tipo_traumatica
         LEFT JOIN campos_tablas_maestras ctm5 ON ctm5.ctma_key = cui.cuen_les_localizacion
         LEFT JOIN campos_tablas_maestras ctm6 ON ctm6.ctma_key = cui.ctma_ulcera_lado
         LEFT JOIN campos_tablas_maestras ctm7 ON ctm7.ctma_key = cui.ctma_gra_que_enf
         LEFT JOIN maestro_tipos mt ON mt.mati_key = cui.cuen_les_procedencia
  
      WHERE
          oc.cama_ocupada = 1  -- oc.cama_ocupada =  SI
      AND con.tico_key = 4     -- con.tico_key = Contacto Hospitalizacion
      AND con.cont_is_activo = 1
      AND inf.tip_informe_key = 'TIPINF28'
      AND cui.cuen_les_eliminado = 0
      AND ctm3.ctma_key = 'UHD_UTIP1'
      ORDER BY CAMA
        ;
    ` 
    const result = await executeQueryOC(sentenciaSQL)
    return result
  }
}