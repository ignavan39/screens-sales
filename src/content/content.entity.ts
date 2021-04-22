import { GroupsContent } from 'src/group-content/group-content.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TreeLevelColumn,
} from 'typeorm';
import { ContentToPlaylists } from '../content-to-playlist/content-to-playlist.entity';

export enum ContentType {
  VIDEO = 'Video',
  HTML = 'HTML',
  MUSIC = 'MUSIC',
  IMAGE = 'IMAGE',
}

@Entity({ name: 'contents' })
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  contentType: ContentType;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  groupId: string;

  @OneToMany(() => ContentToPlaylists, (c) => c.content)
  contentToPlaylists: ContentToPlaylists[];

  @ManyToOne(() => GroupsContent, (group) => group.contents)
  group: GroupsContent;

  @ManyToOne(() => User, (user) => user.content, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
