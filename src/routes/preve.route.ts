import { Router } from "express";
import {
  aislaIncidencia,
  aislaPrevalencia,
  colonoPrevalente,
  frotisPendientes,
  heridas,
  infecciones,
  intervencioinesColaboracion,
  vacunas,
  vacunasFechaInicio,
  vacunasPendientes
} from "../controllers/preve.controller";

const router = Router();

router.get("/aislaIncidencias", aislaIncidencia);
router.get("/aislaPrevalencia", aislaPrevalencia);
router.get("/colonoPrevalente", colonoPrevalente);
router.get("/frotisPendientes", frotisPendientes);
router.get("/heridas", heridas);
router.get("/infecciones", infecciones);
router.get("/intervencioinesColaboracion", intervencioinesColaboracion);
router.get("/vacunas", vacunas);
router.get("/vacunasFechaInicio", vacunasFechaInicio);
router.get("/vacunasPendientes", vacunasPendientes);

export { router as preveRoutes };