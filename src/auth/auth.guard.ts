import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class Auth0Guard implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.oidc.user;
    console.log(user);
    console.log(request.headers);
    if (!user) {
      throw new UnauthorizedException();
    }
    let savedUser = await this.userService.findOne({ email: user.email });
    if (!savedUser) {
      savedUser = await this.userService.save(user.sub, user.email);
    }
    return user;
  }
}
