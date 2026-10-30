import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./connections.controller.js";

export const connectionsRouter = Router();

connectionsRouter.use(requireSession);
connectionsRouter.get("/", controller.list);
connectionsRouter.post("/", controller.upsert);
connectionsRouter.delete("/:platform", controller.remove);
