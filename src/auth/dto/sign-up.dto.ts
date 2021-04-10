
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  
  @ApiProperty()
  @IsOptional()
  fullName?: string;
}