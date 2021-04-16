import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentToPlaylistService } from 'src/content-to-playlist/content-to-playlist.service';
import { PlaylistCrudService } from '../playlists.service';

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

@Injectable()
export class CheckOrderInPlaylistGuard implements CanActivate {
  constructor(
    @Inject('ContentToPlaylistService')
    private readonly service: ContentToPlaylistService,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const  playlistId  = request.params.id
    const playlistSize = await this.service.playlistSize(playlistId)
    if(request.body.order < 0 || request.body.order > playlistSize){
      throw new BadRequestException("Incorrect order")
    }

    return true;
  }
}