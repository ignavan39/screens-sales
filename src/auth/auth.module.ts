import { Module } from '@nestjs/common';
import { JWT_SECRET } from 'src/constants';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import authConfig from './auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [JwtStrategy],
  exports: [PassportModule],
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
})
export class AuthModule {}
