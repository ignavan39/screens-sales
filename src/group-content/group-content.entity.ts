import { ConflictException } from '@nestjs/common';
import { Content } from 'src/content/content.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'group_content' })
export class GroupsContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @OneToMany(() => Content, (content) => content.group)
  contents: Content[];

  @ManyToOne(() => User, (user) => user.groups)
  user: User;
}
