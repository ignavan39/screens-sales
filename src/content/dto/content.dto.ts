import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { User } from 'src/users/entity/user.entity';
import { ContentType } from '../entity/content.entity';

export class CreateContentDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  contentType: ContentType;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  playlistsId: Playlist['id'];

  @IsNotEmpty()
  @ApiProperty()
  userId: User['id'];
}

export class UpdateContentDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  contentType?: ContentType;

  @ApiProperty()
  @IsOptional()
  playlistsId?: Playlist['id'];

  @IsOptional()
  @IsPositive()
  @IsNumber()
  order?: number;

  @IsNotEmpty()
  @ApiProperty()
  userId: User['id'];
}

export class ContentFindByPlaylistId {
  @ApiProperty()
  @IsNotEmpty()
  playlistId: Playlist['id'];
}
