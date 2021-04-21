import { Screen } from 'src/screens/screen.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  userId: string;

  @OneToMany(() => Screen, (s) => s.event)
  screens: Screen[];

  @ManyToOne(() => User, (user) => user.events, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
