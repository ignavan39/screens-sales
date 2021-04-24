import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findOne({
      email: request.oidc.user.email,
    });
    if (!user) {
      return false;
    }
    return request.params.id === user.id;
  }
}
