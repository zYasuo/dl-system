export type HttpSuccessEnvelope<T> = {
  success: true;
  timestamp: string;
  data: T;
};

export type HttpErrorEnvelope = {
  success: false;
  timestamp: string;
  statusCode: number;
  error: string;
  message: string | string[];
  code?: string;
  details?: unknown;
};
