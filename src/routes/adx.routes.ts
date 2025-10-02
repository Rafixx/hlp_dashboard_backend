import { Router } from "express";
import { 
  propuestasCitados, 
  propuestasDadosDeAlta, 
  propuestasTramitadas,
  altasXDpto,
  pacientesIngresados,
  pendientesCita,
  prestamosHC,
  prestamosPdtes
} from "../controllers/adx.controller";

const router = Router();

// Endpoint para obtener propuestas citados entre fechas y camas
router.get("/propuestasCitados", propuestasCitados);
// Endpoint para obtener propuestas dados de alta por NHC
router.get("/propuestasDadosDeAlta/:nhc", propuestasDadosDeAlta);
// Endpoint para obtener propuestas tramitadas por NHC
router.get("/propuestasTramitadas/:nhc", propuestasTramitadas);
// Endpoint para obtener altas por departamento con rango de fechas
router.get("/altasXDpto", altasXDpto);
// Endpoint para obtener pacientes ingresados
router.get("/pacientesIngresados", pacientesIngresados);
// Endpoint para obtener pacientes pendientes de cita
router.get("/pendientesCita", pendientesCita);
// Endpoint para obtener préstamos de historias clínicas
router.get("/prestamosHC", prestamosHC);
// Endpoint para obtener préstamos pendientes
router.get("/prestamosPdtes", prestamosPdtes);

export { router as adxRoutes };