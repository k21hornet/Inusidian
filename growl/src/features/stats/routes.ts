import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { requireUser } from "../../middleware/auth.js";
import { ValidationError } from "../../lib/errors.js";
import type { AppEnv } from "../../types.js";
import * as statsService from "./service.js";
import { studiedDaysQuerySchema } from "./schema.js";

export const statsRoutes = new Hono<AppEnv>();

statsRoutes.use("*", requireUser);

statsRoutes.get("/learning-history", async (c) => {
  const history = await statsService.getLearningHistory(c.get("userId"));
  return c.json(history);
});

statsRoutes.get("/card-distribution", async (c) => {
  const distribution = await statsService.getCardSuccessDistribution(
    c.get("userId"),
  );
  return c.json(distribution);
});

statsRoutes.get(
  "/studied-days",
  zValidator("query", studiedDaysQuerySchema, (result) => {
    if (!result.success) {
      throw new ValidationError(
        "Invalid query parameters",
        result.error.issues,
      );
    }
  }),
  async (c) => {
    const { year, month } = c.req.valid("query");
    const studiedDays = await statsService.getStudiedDays(
      c.get("userId"),
      year,
      month,
    );
    return c.json(studiedDays);
  },
);
