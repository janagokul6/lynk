import { Router } from "express";
import { requireRole } from "../../policies/requireRole.js";
import * as controller from "./shortlist.controller.js";

export const shortlistRouter = Router();

shortlistRouter.use(requireRole("brand"));
shortlistRouter.get("/", controller.list);
shortlistRouter.post("/", controller.add);
shortlistRouter.delete("/:id", controller.removeItem);
shortlistRouter.post("/groups", controller.createGroup);
shortlistRouter.delete("/groups/:id", controller.removeGroup);
