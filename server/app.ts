import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { toNodeHandler } from "better-auth/node";
import { apiReference } from "@scalar/express-api-reference";
import { auth } from "./lib/auth.js";
import { env } from "./config/env.js";
import { getOpenApiSpec } from "./config/openapi.js";
import { requestLogger, errorHandler, rateLimitByRoute } from "./middleware/index.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { discoveryRouter } from "./modules/discovery/discovery.routes.js";
import { campaignsRouter } from "./modules/campaigns/campaigns.routes.js";
import { marketplaceRouter } from "./modules/marketplace/marketplace.routes.js";
import { creatorsRouter } from "./modules/creators/creators.routes.js";
import { connectionsRouter } from "./modules/connections/connections.routes.js";
import { storageRouter } from "./modules/storage/storage.routes.js";
import { toolsRouter } from "./modules/tools/tools.routes.js";
import { applicationsRouter } from "./modules/applications/applications.routes.js";
import { shortlistRouter } from "./modules/shortlist/shortlist.routes.js";
import { homeRouter } from "./modules/home/home.routes.js";
import { profilesRouter } from "./modules/profiles/profiles.routes.js";
import { notificationsRouter } from "./modules/notifications/notifications.routes.js";
import { invitesRouter } from "./modules/invites/invites.routes.js";
import { collabRouter } from "./modules/collab/collab.routes.js";
import { messagesRouter } from "./modules/messages/messages.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { configRouter, devRouter } from "./modules/config/config.routes.js";

const app = express();

app.set("trust proxy", env.TRUST_PROXY);

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());

app.use(rateLimitByRoute);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json({ limit: "2mb" }));
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
app.use("/api/config", configRouter);
app.use("/api/dev", devRouter);
app.use("/api", authRouter);
app.use("/api/discovery", discoveryRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/shortlist", shortlistRouter);
app.use("/api/home", homeRouter);
app.use("/api/marketplace", marketplaceRouter);
app.use("/api/creators", creatorsRouter);
app.use("/api/connections", connectionsRouter);
app.use("/api/storage", storageRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/invites", invitesRouter);
app.use("/api/collab", collabRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export default app;
