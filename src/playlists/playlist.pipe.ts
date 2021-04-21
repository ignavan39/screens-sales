import {
  ArgumentMetadata,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PlaylistCrudService } from './playlists.service';

@Injectable()
export class CheckPlaylistExsist implements PipeTransform {
  constructor(
    @Inject('PlaylistCrudService')
    private readonly playlistService: PlaylistCrudService,
  ) {}

  async transform(value, metadata: ArgumentMetadata) {
    if (value.playlistId) {
      const playlist = await this.playlistService.findOne(value.playlistId);
      if (!playlist) {
        throw new NotFoundException('playlist dont exsist');
      }
    }
    return value;
  }
}
