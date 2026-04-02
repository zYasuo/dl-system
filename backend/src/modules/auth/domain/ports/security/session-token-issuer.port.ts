export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type IssueSessionTokensInput = {
  userUuid: string;
  email: string;
  internalUserId: number;
  familyId: string;
};

export abstract class SessionTokenIssuerPort {
  abstract issue(input: IssueSessionTokensInput): Promise<SessionTokens>;
}
