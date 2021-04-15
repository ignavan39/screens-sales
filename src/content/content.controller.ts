import { Body, Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { ContentCrudService, ContentService } from './content.service';
import { ContentFindByPlaylistId, CreateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';

@Crud({
  model: {
    type: Content,
  },
})
@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController implements CrudController<Content> {
  constructor(
    public readonly service: ContentCrudService,
    private readonly customService: ContentService,
  ) {}

  @Override('getManyBase')
  findMany(@User() user) {
    return this.customService.findManyByUser(user.id);
  }

  @Override('createOneBase')
  create(@Body() body: CreateContentDto) {
    return this.customService.save(body);
  }
}
