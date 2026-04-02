export type UserCredentialEntityProps = {
  id: number;
  userId: number;
  passwordHash: string;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserCredentialInput = {
  userId: number;
  passwordHash: string;
};

export class UserCredentialEntity {
  constructor(private readonly props: UserCredentialEntityProps) {}

  get id(): number {
    return this.props.id;
  }

  get userId(): number {
    return this.props.userId;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get failedLoginAttempts(): number {
    return this.props.failedLoginAttempts;
  }

  get lockedUntil(): Date | null {
    return this.props.lockedUntil;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(props: UserCredentialEntityProps): UserCredentialEntity {
    return new UserCredentialEntity(props);
  }
}
