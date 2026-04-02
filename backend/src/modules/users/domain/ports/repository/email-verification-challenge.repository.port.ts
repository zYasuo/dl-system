export type ActiveEmailVerificationChallengeRow = {
  uuid: string;
  codeHash: string;
  expiresAt: Date;
  attemptCount: number;
};

export abstract class EmailVerificationChallengeRepositoryPort {
  abstract deletePendingForUser(userInternalId: number): Promise<void>;
  abstract create(params: {
    uuid: string;
    userInternalId: number;
    codeHash: string;
    expiresAt: Date;
  }): Promise<void>;
  abstract findLatestActiveForUser(
    userInternalId: number,
  ): Promise<ActiveEmailVerificationChallengeRow | null>;
  abstract incrementAttempts(challengeUuid: string): Promise<void>;
  abstract markConsumed(challengeUuid: string): Promise<void>;
}
