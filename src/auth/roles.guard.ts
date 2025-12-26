import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "./role.enum.js";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../shared/decorators.js";



@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly reflector : Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY, [context.getHandler(), context.getClass()]
        );

        if(!requiredRoles || requiredRoles.length === 0) return true;
        

        const { user } = context.switchToHttp().getRequest();
        if (!user?.role) throw new UnauthorizedException("No roles found for the current user.");
        

        const hasPermissions = requiredRoles.some((role : Role) => user?.role?.includes(role));
        if (!hasPermissions) throw new UnauthorizedException("Access restricted.");


        return true;
    }
}