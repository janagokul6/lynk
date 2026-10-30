import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import { getSession, updateRole } from "./auth.controller.js";

export const authRouter = Router();

authRouter.get("/me", getSession);
authRouter.patch("/me/role", requireSession, updateRole);
