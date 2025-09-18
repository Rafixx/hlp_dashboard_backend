import { Router } from "express";
import { 
  cuidadores, 
  problemasAsociados, 
  escalasRealizadas,
  heridas,
  lesiones,
  procedimientos,
  terapeutica,
  aisladosAhora,
  escalas
} from "../controllers/gen.controller";

const router = Router();

router.get("/cuidadores", cuidadores);
router.get("/problemasAsociados/:nhc", problemasAsociados );
router.get('/escalasRealizadas/:numicu', escalasRealizadas );
router.get("/heridas", heridas);
router.get("/lesiones", lesiones);
router.get("/procedimientos", procedimientos);
router.get("/terapeutica", terapeutica);
router.get("/aisladosAhora", aisladosAhora);
router.get("/escalas", escalas);

export { router as genRoutes };