import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}

export class UpdateGroupDto {
  @ApiProperty()
  @IsOptional()
  name?: string;
}
