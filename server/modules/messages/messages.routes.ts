import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./messages.controller.js";

export const messagesRouter = Router();

messagesRouter.use(requireSession);
messagesRouter.get("/", controller.list);
messagesRouter.post("/", controller.open);
messagesRouter.get("/:id", controller.read);
messagesRouter.post("/:id", controller.send);
