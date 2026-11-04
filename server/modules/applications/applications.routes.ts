import { Router } from "express";
import { requireRole } from "../../policies/requireRole.js";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./applications.controller.js";

export const applicationsRouter = Router();

applicationsRouter.post("/", requireRole("influencer"), controller.create);
applicationsRouter.get("/", requireSession, controller.list);
applicationsRouter.post("/:id/withdraw", requireRole("influencer"), controller.withdraw);
applicationsRouter.post("/:id/accept", requireRole("brand"), controller.accept);
applicationsRouter.post("/:id/reject", requireRole("brand"), controller.reject);
