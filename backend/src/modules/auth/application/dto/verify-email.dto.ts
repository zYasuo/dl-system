import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';
import { Email } from 'src/modules/users/domain/vo/email.vo';

export const SVerifyEmail = z.object({
  email: z.email().max(Email.MAX_LENGTH, 'Email must be less than 254 characters'),
  code: z.string().regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

export type VerifyEmailBody = z.infer<typeof SVerifyEmail>;

export class VerifyEmailBodyDto extends createZodDto(SVerifyEmail) {}
