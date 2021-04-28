import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto, GetOptimalContent } from './group-content.dto';
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

  // REVU: этот метод написан не читаемо
  // Лучше будет сделать так что группа контента создается
  // автоматически при загрузке видео. Потом при добавлении
  // контента в плейлист смотреть к какому экрану он привязан
  // и выбирать из группы самый подходящий
  async getOptimalContent(id: GroupsContent['id'], dto: GetOptimalContent) {
    const group = await this.findOne(id);
    const sortedContents = group.contents.sort(
      (item1, item2) => item1.height - item2.height,
    );

    let idx = sortedContents.findIndex(
      (item) => item.height === dto.height && item.width === dto.width,
    );

    if (idx === -1) {
      idx = sortedContents.findIndex(
        (item) => dto.height > item.height && dto.width > item.width,
      );
      if (idx === -1) {
        return sortedContents[0];
      }
    }
    return sortedContents[idx];
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
