import { SendOtpVerificationEmailUseCase } from './send-otp-verification-email.use-case';
import type { EmailSenderPort } from '../../domain/ports/email/email-sender.port';

describe('SendOtpVerificationEmailUseCase', () => {
  let useCase: SendOtpVerificationEmailUseCase;
  let emailSender: { send: jest.Mock };

  beforeEach(() => {
    emailSender = { send: jest.fn().mockResolvedValue(undefined) };
    useCase = new SendOtpVerificationEmailUseCase(emailSender as unknown as EmailSenderPort);
  });

  it('sends OTP email via EmailSenderPort', async () => {
    await useCase.execute({
      to: 'u@example.com',
      name: 'Pat',
      code: '042069',
      expiresInMinutes: 15,
    });

    expect(emailSender.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'u@example.com',
        subject: expect.stringContaining('Confirm'),
      }),
    );
    const payload = emailSender.send.mock.calls[0][0];
    expect(payload.html).toContain('042069');
  });
});
