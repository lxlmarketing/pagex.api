import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request = context.getRequest();

    return request.user;
  },
);
