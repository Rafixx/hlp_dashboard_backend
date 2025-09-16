import { Router } from "express";
import { propuestasCitados, propuestasDadosDeAlta, propuestasTramitadas } from "../controllers/adx.controller";

const router = Router();

// Endpoint para obtener propuestas citados por NHC
router.get("/propuestasCitados/:nhc", propuestasCitados);
// Endpoint para obtener propuestas dados de alta por NHC
router.get("/propuestasDadosDeAlta/:nhc", propuestasDadosDeAlta);
// Endpoint para obtener propuestas tramitadas por NHC
router.get("/propuestasTramitadas/:nhc", propuestasTramitadas);

export { router as adxRoutes };