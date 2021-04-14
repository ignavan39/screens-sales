import { Playlist } from 'src/playlists/entity/playlist.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Content } from './content.entity';

@Entity({ name: 'contents_to_playlists' })
export class ContentToPlaylists {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  order: number;

  @ManyToOne(() => Content, (c) => c.contentToPlaylists)
  content: Content;

  @ManyToOne(() => Playlist, (p) => p.contentToPlaylists)
  playlist: Playlist;
}
