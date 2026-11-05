import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./collab.controller.js";

export const collabRouter = Router();

collabRouter.use(requireSession);
collabRouter.get("/:id", controller.detail);
collabRouter.post("/:id/submissions", controller.submitContent);
collabRouter.post("/:id/revision", controller.revision);
collabRouter.post("/:id/approve", controller.approve);
collabRouter.post("/:id/proof", controller.proof);
collabRouter.post("/:id/ratings", controller.rate);
