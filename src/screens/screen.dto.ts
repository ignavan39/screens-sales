import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Event } from 'src/events/event.entity';
import { User } from 'src/users/user.entity';

export class CreateScreenDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  eventId: Event['id'];

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: User['id'];

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  width: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  height: number;
}

export class UpdateScreenDto {
  @ApiProperty()
  @MinLength(4)
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  eventId?: Event['id'];

  @ApiProperty()
  @IsNotEmpty()
  userId?: User['id'];
}

export class FindByEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  eventId: Event['id'];
}
