import { z } from "zod";

export const SVerifyEmail = z.object({
  email: z.email("Invalid email").max(254),
  code: z.string().regex(/^\d{6}$/, "O código tem de ter exatamente 6 dígitos"),
});

export type VerifyEmailFormValues = z.infer<typeof SVerifyEmail>;
