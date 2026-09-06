import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  DATABASE_URL: z.url(),
  AUTH0_ISSUER: z.url(),
  AUTH0_AUDIENCE: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
