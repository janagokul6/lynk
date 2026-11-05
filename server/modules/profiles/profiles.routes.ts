import { Router } from "express";
import { requireRole } from "../../policies/requireRole.js";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./profiles.controller.js";

export const profilesRouter = Router();

profilesRouter.get("/creators/:id", controller.creator);
profilesRouter.get("/me", requireSession, controller.me);
profilesRouter.put("/brand", requireRole("brand"), controller.saveBrand);
profilesRouter.put("/influencer", requireRole("influencer"), controller.saveInfluencer);
