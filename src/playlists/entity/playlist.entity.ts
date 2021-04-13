import { Screen } from "src/screens/entity/screen.entity";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'playlists'})
export class Playlist{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable:true})
    description: string

    @Column()
    name: string

    @Column()
    screenId: string

    @Column()
    userId: string

    @OneToOne(()=>Screen,(screen)=>screen.playlist)
    screen: Screen

    @ManyToOne(() => User, (user) => user.playlists, {
        cascade: true,
        onDelete: 'CASCADE',
      })
      user: User;
}