import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './group-content.dto';
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

  async save(createGroupDto: CreateGroupDto, userId: User['id']) {
    return this.groupRepository.save({ ...createGroupDto, userId });
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
