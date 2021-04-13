import { Event } from 'src/events/entity/event.entity';
import { Screen } from 'src/screens/entity/screen.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName?: string;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => Screen, (screen) => screen.user)
  screens: Screen[];
}
