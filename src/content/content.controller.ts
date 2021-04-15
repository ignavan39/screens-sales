import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { identity } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { ContentCrudService, ContentService } from './content.service';
import { ContentFindByPlaylistId, CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { Content } from './entity/content.entity';


@UseGuards(JwtAuthGuard)
@Controller('contents')
export class ContentController{
  constructor(
    private readonly customService: ContentService,
  ) {}

  @Get('/')
  findMany(@User() user) {
    return this.customService.findManyByUser(user.id);
  }

  @Post('/')
  create(@Body() body: CreateContentDto) {
    return this.customService.save(body);
  }

  @Put('/:id')
  update(@Param('id') id, @Body() body: UpdateContentDto){
    return this.customService.update(body,id)
  }
}
