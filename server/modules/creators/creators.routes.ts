import { Router } from "express";
import { requireRole } from "../../policies/requireRole.js";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./creators.controller.js";

export const creatorsRouter = Router();

creatorsRouter.get("/match", requireSession, controller.match);
creatorsRouter.post("/sync", requireRole("brand", "admin"), controller.enqueueSync);
