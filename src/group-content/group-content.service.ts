import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { GroupsContent } from './group-content.entity';

@Injectable()
export class GroupContentService {
  constructor(
    @InjectRepository(GroupsContent)
    private readonly groupRepository: Repository<GroupsContent>,
  ) {}

  async findOne(id: GroupsContent['id']): Promise<GroupsContent> {
    return this.groupRepository.findOne(id);
  }

  async findMany(userId: User['id']) {
    return this.groupRepository.find({
      where: {
        userId,
      },
    });
  }

  async save(userId: User['id']) {
    return this.groupRepository.save({ userId });
  }

  async groupSize(groupId: GroupsContent['id']) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: ['contents'],
    });
    return group.contents.length;
  }
}

@Injectable()
export class GroupContentCrudService extends TypeOrmCrudService<GroupsContent> {
  constructor(
    @InjectRepository(GroupsContent)
    groupRepository: Repository<GroupsContent>,
  ) {
    super(groupRepository);
  }
}
