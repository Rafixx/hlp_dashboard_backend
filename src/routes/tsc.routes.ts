import { Router } from "express";
import { listadoIngresados } from "../controllers/tsc.controller";

const router = Router();

router.get("/listadoIngresados", listadoIngresados)

export { router as tscRoutes };