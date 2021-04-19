import { Content } from 'src/content/entity/content.entity';
import { ContentToPlaylists } from 'src/content-to-playlist/entity/content-to-playlist.entity';
import { Screen } from 'src/screens/entity/screen.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'playlists' })
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  name: string;

  @Column()
  screenId: string;

  @Column({ nullable: true })
  duration: number;

  @Column()
  userId: string;

  @OneToOne(() => Screen, (screen) => screen.playlist)
  screen: Screen;

  @OneToMany(() => ContentToPlaylists, (c) => c.playlist)
  contentToPlaylists: ContentToPlaylists[];

  @ManyToOne(() => User, (user) => user.playlists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
