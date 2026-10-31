import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./storage.controller.js";

export const storageRouter = Router();

storageRouter.post("/sign", requireSession, controller.sign);
storageRouter.put("/upload", controller.uploadLocal);
storageRouter.get("/files/{*key}", requireSession, controller.getFile);
