import { Body, Controller } from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { ContentCrudService, ContentService } from './content.service';
import { ContentFindByPlaylistId } from './dto/content.dto';
import { Content } from './entity/content.entity';

@Crud({
    model: {
        type: Content
    },
     
})
@Controller('content')
export class ContentController implements CrudController<Content> {
    constructor(public readonly service:ContentCrudService,
        private readonly customService: ContentService ){}

    @Override()
    findMany(@Body() body:ContentFindByPlaylistId){
        return this.customService.findMany(body.playlistId)
    }
}
