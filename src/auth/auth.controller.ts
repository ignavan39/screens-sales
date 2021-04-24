import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in with user credentials' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        user_info: {
          id: 'id',
          email: 'example@gmail.com',
          username: 'example',
          password: 'password',
          fullName: null,
        },
        access_token: 'token',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  @Post('sign-in')
  signIn(@Res() res, @User() user) {
    this.authService.signIn(user);
    return res.signIn();
  }
}
