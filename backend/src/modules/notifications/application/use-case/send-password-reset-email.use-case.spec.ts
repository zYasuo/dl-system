import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';
import type { EmailSenderPort } from '../../domain/ports/email/email-sender.port';

describe('SendPasswordResetEmailUseCase', () => {
  let useCase: SendPasswordResetEmailUseCase;
  let emailSender: { send: jest.Mock };

  beforeEach(() => {
    emailSender = { send: jest.fn().mockResolvedValue(undefined) };
    useCase = new SendPasswordResetEmailUseCase(emailSender as unknown as EmailSenderPort);
  });

  it('sends transactional email via EmailSenderPort', async () => {
    await expect(
      useCase.execute({
        email: 'u@example.com',
        resetToken: 'secret-token',
        expiresInMinutes: 60,
      }),
    ).resolves.toBeUndefined();

    expect(emailSender.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'u@example.com',
        subject: expect.stringContaining('Password'),
      }),
    );
    const payload = emailSender.send.mock.calls[0][0];
    expect(payload.html).toContain('secret-token');
    expect(payload.html).toContain('60');
  });
});
