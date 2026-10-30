import { Router } from "express";
import { requireSession } from "./campaigns.middleware.js";
import * as controller from "./campaigns.controller.js";

export const campaignsRouter = Router();

campaignsRouter.use(requireSession);

campaignsRouter.post("/", controller.create);
campaignsRouter.get("/", controller.list);
campaignsRouter.get("/:id", controller.getOne);
campaignsRouter.patch("/:id", controller.update);
campaignsRouter.post("/:id/publish", controller.publish);
