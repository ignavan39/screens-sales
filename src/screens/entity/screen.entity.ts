import { Event } from 'src/events/entity/event.entity';
import { Playlist } from 'src/playlists/entity/playlist.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'screens' })
export class Screen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column()
  eventId: string;

  @Column({ nullable: true })
  playlistId: string;

  @ManyToOne(() => User, (user) => user.screens, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Event, (event) => event.screens, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  event: Event;

  @OneToOne(() => Playlist, (playlist) => playlist.screen)
  playlist: Playlist;
}
