export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export abstract class EmailSenderPort {
  abstract send(params: SendEmailParams): Promise<void>;
}
