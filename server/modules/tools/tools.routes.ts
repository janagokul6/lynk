import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./tools.controller.js";

export const toolsRouter = Router();

toolsRouter.get("/", requireSession, controller.listTools);
toolsRouter.post("/:name", controller.runTool);
