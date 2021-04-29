import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import authConfig from './auth.config';
import { JwtStrategy } from './jwt.strategy';
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
