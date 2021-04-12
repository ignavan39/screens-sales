import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { AuthService } from "../auth.service";
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.userService.findOne({email});
      if(!user){
          throw new BadRequestException("User not found")
      }
      if (!this.authService.validatePassword(password, user.password)) {
        throw new BadRequestException('Invalid password');
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Invalid email or password');
    }
  }
}