import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type AuthUser = {
  sub: string;
  email: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as Request & { user: AuthUser }).user;
  },
);
