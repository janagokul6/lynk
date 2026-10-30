import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { toNodeHandler } from "better-auth/node";
import { apiReference } from "@scalar/express-api-reference";
import { auth } from "./lib/auth.js";
import { getOpenApiSpec } from "./config/openapi.js";
import { requestLogger, errorHandler, generalLimiter, authLimiter } from "./middleware/index.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { discoveryRouter } from "./modules/discovery/discovery.routes.js";
import { campaignsRouter } from "./modules/campaigns/campaigns.routes.js";
import { marketplaceRouter } from "./modules/marketplace/marketplace.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(compression());

app.use("/api/auth", authLimiter);
// Express 5 / path-to-regexp requires a named wildcard (not bare `*`)
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(generalLimiter);
app.use(express.json());
app.use(requestLogger);

app.get("/openapi.json", (_req, res) => {
  res.json(getOpenApiSpec());
});

app.use(
  "/api-docs",
  apiReference({
    theme: "default",
    url: "/openapi.json",
  })
);

app.use("/api/health", healthRouter);
app.use("/api", authRouter);
app.use("/api/discovery", discoveryRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/marketplace", marketplaceRouter);

app.use(errorHandler);

export default app;
