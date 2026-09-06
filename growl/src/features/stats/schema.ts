import { z } from "zod";

export const studiedDaysQuerySchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int(),
});
