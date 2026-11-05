import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import * as controller from "./connections.controller.js";
import * as oauth from "./connections.oauth.js";

export const connectionsRouter = Router();

connectionsRouter.get("/youtube/start", oauth.startYoutube);
connectionsRouter.get("/youtube/callback", oauth.youtubeCallback);
connectionsRouter.get("/instagram/start", oauth.startInstagram);
connectionsRouter.get("/instagram/callback", oauth.instagramCallback);
connectionsRouter.use(requireSession);
connectionsRouter.get("/", controller.list);
connectionsRouter.post("/", controller.upsert);
connectionsRouter.delete("/:platform", controller.remove);
