import { Router } from "express";
import { requireRole } from "../../policies/requireRole.js";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./invites.controller.js";

export const invitesRouter = Router();

invitesRouter.post("/", requireRole("brand"), controller.create);
invitesRouter.get("/", requireSession, controller.list);
invitesRouter.post("/:id/accept", requireRole("influencer"), controller.accept);
invitesRouter.post("/:id/decline", requireRole("influencer"), controller.decline);
