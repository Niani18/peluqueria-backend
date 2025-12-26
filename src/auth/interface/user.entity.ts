import { Cascade, Entity, EnumType, OneToOne, Property, type Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../../shared/baseEntity.js";
import { Client } from "../../client/interface/client.entity.js";
import { Role } from "../../auth/role.enum.js";


@Entity()
export class User extends BaseEntity {

    @Property({ nullable: false, unique: true})
    username!: string;

    @Property({ nullable: false })
    password!: string;

    @Property({ nullable: true })
    role?: Role[];

    @OneToOne(() => Client, (client) => client.user, { nullable: true, owner: true, cascade: [ Cascade.ALL ] }) 
    client?: Rel<Client>
}