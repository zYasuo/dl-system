import { z } from "zod";

export const SForgotPassword = z.object({
  email: z.email("Invalid email"),
});

export type ForgotPasswordFormValues = z.infer<typeof SForgotPassword>;
