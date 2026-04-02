import { escapeHtml } from './escape-html';
import { sanitizePlainTextEmailOpaque } from './sanitize-plain-text-for-email';

export const PASSWORD_RESET_EMAIL_SUBJECT = 'Password recovery — dl-tickets';

export type PasswordResetEmailParams = {
  resetToken: string;
  expiresInMinutes: number;
};

export function buildPasswordResetEmailText(params: PasswordResetEmailParams): string {
  const resetToken = sanitizePlainTextEmailOpaque(params.resetToken);
  return [
    'You requested a password reset. Use this token to set a new password:',
    '',
    resetToken,
    '',
    `This token expires in ${params.expiresInMinutes} minutes.`,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');
}

export function buildPasswordResetEmailHtml(params: PasswordResetEmailParams): string {
  const token = escapeHtml(sanitizePlainTextEmailOpaque(params.resetToken));
  const minutes = String(params.expiresInMinutes);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password recovery</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden;">
          <tr>
            <td style="padding: 28px 24px 20px; background-color: #18181b; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">Password recovery</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #a1a1aa;">dl-tickets</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #3f3f46;">Use the token below to set a new password. For your security, do not share it with anyone.</p>
              <p style="margin: 0 0 8px; font-size: 13px; color: #71717a; text-transform: uppercase; letter-spacing: 0.04em;">Your reset token</p>
              <p style="margin: 0 0 16px; padding: 12px 14px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; font-size: 14px; word-break: break-all; color: #18181b; font-family: ui-monospace, monospace;">${token}</p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #71717a;">This token expires in <strong style="color: #3f3f46;">${minutes} minutes</strong>.</p>
              <p style="margin: 0; font-size: 15px; color: #3f3f46;">If you did not request this, you can ignore this email.</p>
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
