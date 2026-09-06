import { eq } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { env } from "../env.js";
import { UnauthorizedError } from "../lib/errors.js";
import type { AppEnv } from "../types.js";

const EMAIL_CLAIM = "http://claim/email";

const jwks = createRemoteJWKSet(
  new URL(".well-known/jwks.json", env.AUTH0_ISSUER),
);

export const verifyJwt: MiddlewareHandler<AppEnv> = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;
  if (!token) {
    throw new UnauthorizedError("Missing bearer token");
  }

  let email: unknown;
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: env.AUTH0_ISSUER,
      audience: env.AUTH0_AUDIENCE,
    });
    email = payload[EMAIL_CLAIM];
  } catch {
    throw new UnauthorizedError("Invalid token");
  }

  if (typeof email !== "string" || email.length === 0) {
    throw new UnauthorizedError("Token is missing email claim");
  }

  c.set("userEmail", email);
  await next();
};

export const requireUser: MiddlewareHandler<AppEnv> = async (c, next) => {
  const email = c.get("userEmail");
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new UnauthorizedError(
      "User not registered, call /api/auth/signup first",
    );
  }

  c.set("userId", user.id);
  await next();
};
