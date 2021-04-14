import { Playlist } from 'src/playlists/entity/playlist.entity';
import { User } from 'src/users/entity/user.entity';
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
  userId: string;

  @ManyToMany(() => Playlist, (paylist) => paylist.contents)
  @JoinTable({ name: 'contents_to_playlists' })
  playlists: Playlist[];

  @ManyToOne(() => User, (user) => user.content, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
