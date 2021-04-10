import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { CheckUserExsists } from './pipes/checkUserExsist.pipe';


@Controller('auth')
export class AuthController {
    
  constructor(private authService: AuthService ) {}

  @ApiBody({ type: SignInDto })
  @ApiOperation({ summary: 'Sign in with user credentials' })
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @ApiOperation({ summary: 'Sign up with user credentials' })
  @ApiBody({ type: SignUpDto })
  @Post('sign-up')
  signUp(@Body(CheckUserExsists) body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
