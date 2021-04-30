import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateEventDto {
  @IsString()
  @MinLength(5)
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class UpdateEventDto {
  @IsString()
  @MinLength(5)
  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: User['id'];
}
