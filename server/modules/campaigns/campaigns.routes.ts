import { Router } from "express";
import { requireRole } from "../../policies/requireRole.js";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./campaigns.controller.js";

export const campaignsRouter = Router();

campaignsRouter.use(requireSession);

campaignsRouter.post("/", requireRole("brand", "admin"), controller.create);
campaignsRouter.get("/", controller.list);
campaignsRouter.get("/:id", controller.getOne);
campaignsRouter.patch("/:id", requireRole("brand", "admin"), controller.update);
campaignsRouter.post("/:id/publish", requireRole("brand", "admin"), controller.publish);
