import { Event } from "src/events/entity/event.entity";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'screens'})
export class Screen {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    userId: string

    @Column()
    eventId: string

    @ManyToOne(()=>User,(user)=>user.screens,{
        cascade: true,
        onDelete: 'CASCADE',
    })
    user: User

    @ManyToOne(()=>Event,(event)=>event.screens,{
        cascade: true,
        onDelete: 'CASCADE',
    })
    event: Event
}