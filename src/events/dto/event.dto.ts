import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { User } from 'src/users/entity/user.entity';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class UpdateEventDto {
  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: User['id'];
}
