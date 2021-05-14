import { Playlist } from 'src/playlists/playlist.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Content } from '../content/content.entity';

@Entity({ name: 'contents_to_playlists' })
@Unique(['contentId', 'playlistId'])
export class ContentToPlaylists {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order: number;

  @Column()
  contentId: string;

  @Column({ nullable: true })
  duration: number;

  @Column()
  playlistId: string;

  @ManyToOne(() => Content, (c) => c.contentToPlaylists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  content: Content;

  @ManyToOne(() => Playlist, (p) => p.contentToPlaylists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  playlist: Playlist;
}
