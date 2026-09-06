import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db/client.js";
import { users } from "../../db/schema.js";
import { nowDateTime } from "../../lib/dates.js";
import { generateUserId } from "../../lib/short-id.js";
import type { AppEnv } from "../../types.js";

export const authRoutes = new Hono<AppEnv>();

// 初回ログイン時にユーザーを作成する
authRoutes.post("/signup", async (c) => {
  const email = c.get("userEmail");

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!existing) {
    const id = generateUserId();
    const now = nowDateTime();
    await db.insert(users).values({
      id,
      userName: id,
      email,
      createdAt: now,
      updatedAt: now,
    });
  }

  return c.body(null, 204);
});
