import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'contents_to_playlists' })
export class ContentToPlaylists {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  order: number;
}
