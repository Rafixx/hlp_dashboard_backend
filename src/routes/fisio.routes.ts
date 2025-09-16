import { Router } from "express";
import { intColabFisio, intColabFisioPaciente } from "../controllers/fisio.controller";

const router = Router();

// Endpoint para obtener intervenciones de colaboración fisioterapia por NHC
// router.get("/intColabFisioPaciente/:nhc", intColabFisioPaciente);
router.get("/intColabFisioPaciente/:nhc", intColabFisioPaciente);
// Endpoint para obtener todas las intervenciones de colaboración fisioterapia  
router.get("/intColabFisio", intColabFisio);

export { router as fisioRoutes };