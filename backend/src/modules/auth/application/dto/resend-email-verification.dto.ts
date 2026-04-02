import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';
import { Email } from 'src/modules/users/domain/vo/email.vo';

export const SResendEmailVerification = z.object({
  email: z.email().max(Email.MAX_LENGTH, 'Email must be less than 254 characters'),
});

export type ResendEmailVerificationBody = z.infer<typeof SResendEmailVerification>;

export class ResendEmailVerificationBodyDto extends createZodDto(SResendEmailVerification) {}
