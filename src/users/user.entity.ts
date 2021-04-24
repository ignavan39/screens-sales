import { Content } from 'src/content/content.entity';
import { Event } from 'src/events/event.entity';
import { GroupsContent } from 'src/group-content/group-content.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Screen } from 'src/screens/screen.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullName?: string;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => Screen, (screen) => screen.user)
  screens: Screen[];

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @OneToMany(() => Content, (content) => content.user)
  content: Content[];

  @OneToMany(() => GroupsContent, (group) => group.user)
  groups: GroupsContent[];
}
