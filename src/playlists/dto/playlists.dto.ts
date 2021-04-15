import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Screen } from 'src/screens/entity/screen.entity';

export class CreatePlaylistDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  screenId: Screen['id'];
}

export class UpdatePlaylistDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  screenId: Screen['id'];
}
