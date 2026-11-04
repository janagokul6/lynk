import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./profiles.controller.js";

export const profilesRouter = Router();

profilesRouter.get("/creators/:id", controller.creator);
profilesRouter.get("/me", requireSession, controller.me);
profilesRouter.put("/brand", requireSession, controller.saveBrand);
profilesRouter.put("/influencer", requireSession, controller.saveInfluencer);
