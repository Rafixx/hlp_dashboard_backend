import { Router } from "express";
import { citasIngresados, intColabFisio, intColabFisioPaciente } from "../controllers/fisio.controller";

const router = Router();

// Endpoint para obtener intervenciones de colaboración fisioterapia por NHC
// router.get("/intColabFisioPaciente/:nhc", intColabFisioPaciente);
router.get("/intColabFisioPaciente/:nhc", intColabFisioPaciente);
// Endpoint para obtener todas las intervenciones de colaboración fisioterapia  
router.get("/intColabFisio", intColabFisio);
// Endpoint para obtener citas de ingresados en un rango de fechas
router.get("/citasIngresados", citasIngresados);

export { router as fisioRoutes };