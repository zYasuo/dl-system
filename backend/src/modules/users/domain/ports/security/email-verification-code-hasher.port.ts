export abstract class EmailVerificationCodeHasherPort {
  abstract hash(code: string, challengeUuid: string): string;
  abstract verify(code: string, challengeUuid: string, codeHash: string): boolean;
}
