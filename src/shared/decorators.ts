import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common"
import { Role } from "../auth/role.enum.js";

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const ROLES_KEY = 'usrRoles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  return request.user;
},
)