import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CRYPTO_SALT } from 'src/constants';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({ email });
    console.log(user);
    if (user && this.validatePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  validatePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
  async signIn(signInDto: SignInDto) {
    // AuthGuard('local')
    const user = await this.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new BadRequestException('passwords do not match');
    }
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { user_info: { ...user }, access_token: token };
  }

  async signUp(signUpDto: SignUpDto) {
    const hashPass = await bcrypt.hash(signUpDto.password, CRYPTO_SALT);
    const savedUser = await this.usersService.save(
      signUpDto.username,
      hashPass,
      signUpDto.email,
      signUpDto.fullName,
    );
    const payload = { email: signUpDto.email, sub: savedUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
