import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { User } from 'src/users/entity/user.entity';
import { Content, ContentType } from '../entity/content.entity';

export class CreateContentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  contentType: ContentType;

  @IsPositive()
  @IsOptional()
  duration?: number;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  playlistId: Playlist['id'];

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  userId: User['id'];
}

export class UpdateContentDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  userId: User['id'];
}

export class MoveIncludeContentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  order: number;

  @IsPositive()
  @IsOptional()
  duration?: number;
}

export class InsertContentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  contentId: Content['id'];
}

export class UpdateDurationDto {
  @ApiProperty()
  @IsPositive()
  duration: number;
}
