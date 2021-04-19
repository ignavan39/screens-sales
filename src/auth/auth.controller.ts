import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/users/user.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CheckUserExsists } from './pipes/checkUserExsist.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignInDto })
  @ApiOperation({ summary: 'Sign in with user credentials' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        user_info: {
          id: '9fed7552-bda8-4e5b-823c-ed2929749ea2',
          email: 'example@gmail.com',
          username: 'example',
          password:
            '$2b$18$w/sw6WAsDYvtT829Bl1A5.VXnbw6LA1Y6ZMHJ/mlQUVz6uGmbR/DR',
          fullName: null,
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Iml2YW4xMjJAZ21haWwuY29tIiwic3ViIjoiOWZlZDc1NTItYmRhOC00ZTViLTgyM2MtZWQyOTI5NzQ5ZWUwIiwiaWF0IjoxNjE4ODMwNTg1LCJleHAiOjE2MTg5MzA1ODV9.c909QZMuBR2yHkmRViZZ4oDPuV8iekRjKJr-rZeCeSQ',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  signIn(@User() user) {
    return this.authService.signIn(user);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        user_info: {
          id: '9fed7552-bda8-4e5b-823c-ed2929749ea2',
          email: 'example@gmail.com',
          username: 'example',
          password:
            '$2b$18$w/sw6WAsDYvtT829Bl1A5.VXnbw6LA1Y6ZMHJ/mlQUVz6uGmbR/DR',
          fullName: null,
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Iml2YW4xMjJAZ21haWwuY29tIiwic3ViIjoiOWZlZDc1NTItYmRhOC00ZTViLTgyM2MtZWQyOTI5NzQ5ZWUwIiwiaWF0IjoxNjE4ODMwNTg1LCJleHAiOjE2MTg5MzA1ODV9.c909QZMuBR2yHkmRViZZ4oDPuV8iekRjKJr-rZeCeSQ',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'User with email already exsist' })
  @ApiOperation({ summary: 'Sign up with user credentials' })
  @ApiBody({ type: SignUpDto })
  @Post('sign-up')
  signUp(@Body(CheckUserExsists) body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
