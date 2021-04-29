import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Screen } from 'src/screens/screen.entity';

export class CreatePlaylistDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  @IsOptional()
  description: string;

  @IsPositive()
  @IsOptional()
  duration?: number;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  screenId: Screen['id'];
}

export class UpdatePlaylistDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  screenId: Screen['id'];

  @IsPositive()
  @IsOptional()
  duration?: number;
}

export class UpdateDurationDto {
  @ApiProperty()
  @IsPositive()
  duration: number;
}
