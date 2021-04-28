import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  isUUID,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { GroupsContent } from 'src/group-content/group-content.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { User } from 'src/users/user.entity';
import { Content, ContentType } from './content.entity';

export class CreateContentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  contentType: ContentType;

  @IsUUID()
  @IsOptional()
  groupId: GroupsContent['id'];

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

  @IsOptional()
  @ApiProperty()
  @IsPositive()
  width: number;

  @IsOptional()
  @ApiProperty()
  @IsPositive()
  height: number;
}

export class UpdateContentDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsUrl()
  @ApiProperty()
  @IsOptional()
  url?: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsUUID()
  userId: User['id'];

  // REVU: Каким образом это изменит разрешение контента?
  @ApiProperty()
  @IsPositive()
  width?: number;

  @ApiProperty()
  @IsPositive()
  height?: number;
}

// REVU: Лучше называть просто MoveContentDto
export class MoveIncludeContentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  order: number;
}

export class InsertContentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  contentId: Content['id'];
}

// Лучше переместить в модуль плейлиста
export class UpdateDurationDto {
  @ApiProperty()
  @IsPositive()
  duration: number;
}

export class AddContentIntoGroup {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  groupId: GroupsContent['id'];
}
