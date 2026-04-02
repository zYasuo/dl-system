import { escapeHtml } from './escape-html';
import {
  sanitizePlainTextEmailDisplay,
  sanitizePlainTextEmailOpaque,
} from './sanitize-plain-text-for-email';

export const OTP_VERIFICATION_EMAIL_SUBJECT = 'Confirm your email — dl-tickets';

export type OtpVerificationEmailParams = {
  name: string;
  code: string;
  expiresInMinutes: number;
};

export function buildOtpVerificationEmailText(params: OtpVerificationEmailParams): string {
  const name = sanitizePlainTextEmailDisplay(params.name);
  const code = sanitizePlainTextEmailOpaque(params.code);
  return [
    `Hi ${name},`,
    '',
    `Your verification code is: ${code}`,
    '',
    `This code expires in ${params.expiresInMinutes} minutes.`,
    '',
    'If you did not create an account, you can ignore this email.',
  ].join('\n');
}

export function buildOtpVerificationEmailHtml(params: OtpVerificationEmailParams): string {
  const name = escapeHtml(sanitizePlainTextEmailDisplay(params.name));
  const code = escapeHtml(sanitizePlainTextEmailOpaque(params.code));
  const minutes = String(params.expiresInMinutes);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 28px 24px 20px; background-color: #18181b; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">Confirm your email</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #a1a1aa;">Welcome to dl-tickets</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #3f3f46;">Hi ${name},</p>
              <p style="margin: 0 0 12px; font-size: 15px; color: #3f3f46;">Your verification code is:</p>
              <p style="margin: 0 0 20px; text-align: center;">
                <span style="display: inline-block; padding: 14px 28px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px; font-size: 26px; font-weight: 600; letter-spacing: 0.28em; color: #18181b; font-family: ui-monospace, monospace;">${code}</span>
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #71717a; text-align: center;">Valid for <strong style="color: #3f3f46;">${minutes} minutes</strong>.</p>
              <p style="margin: 0; font-size: 15px; color: #3f3f46;">If you did not create an account, you can ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 24px; background-color: #fafafa; border-top: 1px solid #e4e4e7; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">This is an automated message. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
