import { Router } from "express";
import { requireAgentOrSession } from "../../policies/requireAgentOrSession.js";
import * as controller from "./tools.controller.js";

export const toolsRouter = Router();

toolsRouter.use(requireAgentOrSession);
toolsRouter.get("/", controller.listTools);
toolsRouter.post("/:name", controller.runTool);
