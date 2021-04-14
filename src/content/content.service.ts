import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';

 @Injectable()
 export class ContentCrudService extends TypeOrmCrudService<Content> {
    constructor(
        @InjectRepository(Content)
        repository: Repository<Content>
    ){
        super(repository)
    }
 }


@Injectable()
export class ContentService {
    constructor(@InjectRepository(Content) private readonly repository: Repository<Content>){}

    async findManyByUser(userId: User['id']):Promise<Content[]> {
        return this.repository.find({
            where: {
                userId
            }
        })
    }

    async findMany(playlistId: Playlist['id']){
        return this.repository.find({
            relations: ['playlists'],
            where: {
                playlists:{
                    id: playlistId
                }
            }
        })
    }


     async save(createDto: CreateContentDto):Promise<Content>{
         const currentPlaylist = await this.findMany(createDto.playlistsId)

         const order = currentPlaylist.length === 0 ? 1 : currentPlaylist.length
         return this.repository.save({
             ...createDto,
             order
         })
     }

    async update(updateDto: UpdateContentDto) {
         if(updateDto.order){

         const currentPlaylist = await this.findMany(updateDto.playlistsId)
            // add checking
            // const idx = currentPlaylist.findIndex(item => item.order === updateDto.order)
            console.log(currentPlaylist)  
         }
      }
   
}
