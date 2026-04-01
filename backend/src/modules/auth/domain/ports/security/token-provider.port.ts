export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export abstract class TokenProviderPort {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<AccessTokenPayload>;
  abstract generateRefreshToken(): string;
  abstract hashToken(token: string): string;
}
