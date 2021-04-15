// import { ArgumentMetadata, BadRequestException, Inject, Injectable, PipeTransform } from "@nestjs/common";
// import { CreateContentDto, MoveIncludeContentDto, UpdateContentDto } from "src/content/dto/content.dto";
// import { ContentToPlaylistService } from "./content-to-playlist.service";


// @Injectable()
// export class CheckContentOrder implements PipeTransform {
//   constructor(
//     @Inject('ContentToPlaylistService') private readonly service: ContentToPlaylistService,
//   ) {}

//   async transform(value: MoveIncludeContentDto , metadata: ArgumentMetadata) {
//     if(value.order){
//         const playlistSize = await this.service.playlistSize(value.playlistsId)
//         if(value.order < 1 || value.order > playlistSize){
//             throw new BadRequestException("Order is incorrect")
//         }
//     }
//     return value;
//   }
// }