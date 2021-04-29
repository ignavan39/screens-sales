import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupContentService } from './group-content.service';

@Injectable()
export class GroupContentOwnerGuard implements CanActivate {
  constructor(
    @Inject('GroupContentService')
    private readonly groupService: GroupContentService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.oidc.user.sub;
    const groupId = request.params.id;
    const group = await this.groupService.findOne(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group.userId === userId;
  }
}
