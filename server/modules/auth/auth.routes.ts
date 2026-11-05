import { Router } from "express";
import { requireSession } from "../../policies/requireSession.js";
import { exportAccount, getSession, updateRole } from "./auth.controller.js";

export const authRouter = Router();

authRouter.get("/me", getSession);
authRouter.get("/me/export", requireSession, exportAccount);
authRouter.patch("/me/role", requireSession, updateRole);
