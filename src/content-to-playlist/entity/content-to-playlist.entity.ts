import { Playlist } from 'src/playlists/entity/playlist.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Content } from '../../content/entity/content.entity';

@Entity({ name: 'contents_to_playlists' })
export class ContentToPlaylists {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order: number;

  @Column()
  contentId: string;

  @Column()
  playlistId: string;

  @ManyToOne(() => Content, (c) => c.contentToPlaylists)
  content: Content;

  @ManyToOne(() => Playlist, (p) => p.contentToPlaylists)
  playlist: Playlist;
}
