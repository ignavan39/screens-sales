import { Playlist } from "src/playlists/entity/playlist.entity";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum ContentType {
    VIDEO = "Video",
    HTML = "HTML",
    MUSIC = "MUSIC",
    IMAGE = "IMAGE"
}

@Entity({name: 'contents'})
export class Content {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'enum',
        enum: ContentType
    })
    contentType: ContentType
    
    @Column()
    name: string

    @Column()
    userId: string

    @Column({type:'unsigned big int'})
    priority: number

    @ManyToMany(()=>Playlist,{
        cascade:true,
        onDelete: 'CASCADE'
    })
    playlists: Playlist[]

    @ManyToOne(()=>User,(user)=>user.content,{
        cascade:true,
        onDelete: 'CASCADE'
    })
    user: User
}