import { Router } from "express";
import { getSession } from "./auth.controller.js";

export const authRouter = Router();

authRouter.get("/me", getSession);
