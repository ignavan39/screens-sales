import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContentToPlaylists } from "./entity/content-to-playlist.entity";


@Injectable()
export class ContentToPlaylistService {
    constructor(@InjectRepository(ContentToPlaylists) repository:Repository<ContentToPlaylists>){}

    
}