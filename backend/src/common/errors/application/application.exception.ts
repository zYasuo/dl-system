export class ApplicationException extends Error {
  readonly name = 'ApplicationException';

  constructor(
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}
