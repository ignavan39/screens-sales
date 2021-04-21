import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @ApiProperty()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  @IsOptional()
  fullName?: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  @IsOptional()
  username?: string;
}
