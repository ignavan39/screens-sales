import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
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
  userId: User['id'];

  @IsOptional()
  @ApiProperty()
  // @IsPositive()
  width: string;

  @IsOptional()
  @ApiProperty()
  // @IsPositive()
  height: string;
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
}

export class MoveContentDto {
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

export class AddContentIntoGroup {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  groupId: GroupsContent['id'];
}
