import { Router } from "express";
import { informeTerapeutica } from "../controllers/med.controller";

const router = Router();

router.get("/informeTerapeutica/:nhc", informeTerapeutica);

export { router as medRoutes };