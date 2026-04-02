import { registerAs } from '@nestjs/config';

export interface IEmailConfig {
  resendApiKey: string;
  emailFrom: string;
  otpPepper: string;
}

export const emailConfig = registerAs(
  'email',
  (): IEmailConfig => ({
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    emailFrom: process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || '',
    otpPepper: process.env.OTP_PEPPER ?? '',
  }),
);
