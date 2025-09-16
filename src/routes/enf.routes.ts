import { Router } from "express";
import { lesionesUPP } from "../controllers/enf.controller";

const router = Router();

// Endpoint para obtener lesiones por UPP
router.get("/lesionesUPP", lesionesUPP);

export { router as enfRoutes };