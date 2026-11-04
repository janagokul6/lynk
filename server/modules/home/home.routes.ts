import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import { getHome } from "./home.controller.js";

export const homeRouter = Router();

homeRouter.get("/", requireSession, getHome);
