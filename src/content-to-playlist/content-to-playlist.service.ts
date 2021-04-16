import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from 'src/content/entity/content.entity';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { Repository } from 'typeorm';
import { ContentToPlaylists } from './entity/content-to-playlist.entity';

@Injectable()
export class ContentToPlaylistService {
  constructor(
    @InjectRepository(ContentToPlaylists)
     private readonly repository: Repository<ContentToPlaylists>,
  ) {}

  async findContentByPlaylistId(id: Playlist['id']){
    return this.repository.find({
        where: {
            playlist: {
                id
            }
        },
        relations: ['content']
    })
  }

  async save(playlistId: Playlist['id'], contentId: Content['id']){
    const playlistSize = await this.playlistSize(playlistId)

      const order = playlistSize + 1
      return this.repository.save({
          playlistId,
          contentId,
          order
      })
  }

  async moveContent(playlistId: Playlist['id'], contentId: Content['id'], order: number) {
    let playlist = await this.findContentByPlaylistId(playlistId)

    const newPlaylist = playlist.map((it)=> {

        if(it.contentId === contentId){
            return {...it, order}
        }
        else if(it.order >= order && it.id !== contentId){
            return {...it,order:(it.order)+1}
        }

        return it;
    })
    return this.repository.save([
        ...newPlaylist])
  }

  async playlistSize(playlistId: Playlist['id']): Promise<number> {
    return  this.repository.count({
        where: {
            playlist: {
                id: playlistId
            }
        }
    })
  }
}
