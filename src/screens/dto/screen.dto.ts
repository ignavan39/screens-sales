import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Event } from 'src/events/entity/event.entity';
import { User } from 'src/users/entity/user.entity';

export class CreateScreenDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  eventId: Event['id'];

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: User['id'];
}

export class UpdateScreenDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  eventId?: Event['id'];

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId?: User['id'];
}

export class FindByEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  eventId: Event['id'];
}
