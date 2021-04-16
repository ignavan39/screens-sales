import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { MoveIncludeContentDto } from 'src/content/dto/content.dto';
import { PlaylistCrudService } from '../playlists.service';

@Injectable()
export class CheckPlaylistExsist implements PipeTransform {
  constructor(
    @Inject('PlaylistCrudService')
    private readonly playlistService: PlaylistCrudService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    const playlist = await this.playlistService.findOne(
      value.parsed.paramsFilter[0].value,
    );
    if (!playlist) {
      throw new BadRequestException('playlist dont exsist');
    }
    return value;
  }
}
