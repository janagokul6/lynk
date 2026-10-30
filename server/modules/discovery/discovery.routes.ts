import { Router } from "express";
import { getSuggestions, searchInfluencers } from "./discovery.controller.js";

export const discoveryRouter = Router();

discoveryRouter.get("/suggestions", getSuggestions);
discoveryRouter.get("/search", searchInfluencers);

