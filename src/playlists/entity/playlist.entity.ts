import { Content } from 'src/content/entity/content.entity';
import { ContentToPlaylists } from 'src/content/entity/content-to-playlist.entity';
import { Screen } from 'src/screens/entity/screen.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
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

  @Column()
  userId: string;

  @OneToOne(() => Screen, (screen) => screen.playlist)
  screen: Screen;

  @ManyToMany(() => Content, (content) => content.playlists)
  contents: Content[];

  @ManyToOne(() => User, (user) => user.playlists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
