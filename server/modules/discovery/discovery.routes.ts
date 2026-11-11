import { Router } from "express";
import { requireRole } from "../../policies/requireRole.js";
import { getSuggestions, searchInfluencers } from "./discovery.controller.js";

export const discoveryRouter = Router();

discoveryRouter.use(requireRole("brand", "admin"));
discoveryRouter.get("/suggestions", getSuggestions);
discoveryRouter.get("/search", searchInfluencers);
