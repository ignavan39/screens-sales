import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CRYPTO_ROUND } from 'src/constants';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validatePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
  async signIn(user: User) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { user_info: { ...user }, access_token: token };
  }

  async signUp(signUpDto: SignUpDto) {
    const hashPass = await bcrypt.hash(signUpDto.password, CRYPTO_ROUND);
    const savedUser = await this.usersService.save(
      signUpDto.username,
      hashPass,
      signUpDto.email,
      signUpDto.fullName,
    );
    const payload = { email: signUpDto.email, sub: savedUser.id };
    return {
      user_info: { ...savedUser },
      access_token: this.jwtService.sign(payload),
    };
  }
}
