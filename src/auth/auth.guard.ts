import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class Auth0Guard implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.oidc.user;
    let savedUser = await this.userService.findOne({ email: user.email });
    console.log(savedUser);
    if (!savedUser) {
      savedUser = await this.userService.save(user.sub, user.email);
    }
    return user;
  }
}
