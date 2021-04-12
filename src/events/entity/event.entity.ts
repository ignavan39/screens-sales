
import { User } from "src/users/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "events"})
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string

    @Column()
    userId: string

    @ManyToOne(()=>User,(user)=> user.events ,{
        cascade: true,
        onDelete: 'CASCADE',
    })
    user: User
}