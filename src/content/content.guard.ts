import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentService } from './content.service';

@Injectable()
export class ContentOwnerGuard implements CanActivate {
  constructor(
    @Inject('ContentService')
    private readonly service: ContentService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const contentId = request.params.id;
    const content = await this.service.findOne(contentId);
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return userId === content.userId;
  }
}
