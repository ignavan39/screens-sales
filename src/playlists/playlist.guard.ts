import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { PlaylistCrudService } from './playlists.service';

@Injectable()
export class PlaylistOwnerGuard implements CanActivate {
  constructor(
    @Inject('PlaylistCrudService')
    private readonly service: PlaylistCrudService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const playlistId = request.params.id;
    const playlist = await this.service.findOne(playlistId);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return userId === playlist.userId;
  }
}
