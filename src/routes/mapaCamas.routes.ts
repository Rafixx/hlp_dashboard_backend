import { Router } from "express";
import { 
  mapaCamas,
  pacientesXServicio,
  camasInhabilitadas,
  camasOcupadas,
  camasGrua,
  aisladosPreve,
  aisladosEnf
} from "../controllers/mapaCamas.controller";

const router = Router();

// Endpoint para obtener el mapa de camas
router.get("/mapaCamas", mapaCamas);
// Endpoint para obtener pacientes por servicio
router.get("/pacientesXServicio", pacientesXServicio);
// Endpoint para obtener camas inhabilitadas
router.get("/camasInhabilitadas", camasInhabilitadas);
// Endpoint para obtener camas ocupadas
router.get("/camasOcupadas", camasOcupadas);
// Endpoint para obtener camas con grúa
router.get("/camasGrua", camasGrua);
// Endpoint para obtener pacientes aislados por preventiva
router.get("/aisladosPreve", aisladosPreve);
// Endpoint para obtener pacientes aislados por enfermería
router.get("/aisladosEnf", aisladosEnf);

export { router as mapaCamasRoutes };
