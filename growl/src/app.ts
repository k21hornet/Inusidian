import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env.js";
import { AppError, ValidationError } from "./lib/errors.js";
import { verifyJwt } from "./middleware/auth.js";
import { authRoutes } from "./features/auth/routes.js";
import { decksRoutes } from "./features/decks/routes.js";
import { statsRoutes } from "./features/stats/routes.js";
import type { AppEnv } from "./types.js";

export const app = new Hono<AppEnv>();

app.use("*", logger());

app.use("/api/*", cors({ origin: env.CORS_ORIGIN }));

app.use("/api/*", verifyJwt);

app.route("/api/auth", authRoutes);
app.route("/api/decks", decksRoutes);
app.route("/api/stats", statsRoutes);

app.onError((err, c) => {
  if (err instanceof AppError) {
    console.warn(
      `[${err.status}] ${c.req.method} ${c.req.path} - ${err.message}`,
    );
    return c.json(
      {
        error: {
          message: err.message,
          ...(err instanceof ValidationError && err.issues
            ? { issues: err.issues }
            : {}),
        },
      },
      err.status,
    );
  }

  console.error(`[500] ${c.req.method} ${c.req.path}`, err);
  return c.json({ error: { message: "Internal Server Error" } }, 500);
});

app.notFound((c) => {
  console.warn(`[404] ${c.req.method} ${c.req.path} - no matching route`);
  return c.json({ error: { message: "Not Found" } }, 404);
});
