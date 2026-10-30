import { Router } from "express";
import { list } from "./marketplace.controller.js";

export const marketplaceRouter = Router();

marketplaceRouter.get("/", list);
