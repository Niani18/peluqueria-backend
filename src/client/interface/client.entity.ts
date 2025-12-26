import { Cascade, Collection, Entity, OneToMany, OneToOne, Property, type Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../../shared/baseEntity.js";
import { Appointment } from "../../appointment/interface/appointment.entity.js";
import { User } from "../../auth/interface/user.entity.js";

@Entity()
export class Client extends BaseEntity {
  @Property({nullable:false})
  name!: string;

  @Property({nullable:false})
  surname!: string;

  @Property({nullable:false, unique: true})
  email!: string;

  @Property({nullable:false})
  phone!: string;

  @OneToMany(() => Appointment, (appointment) => appointment.client, {cascade: [Cascade.ALL], nullable: true}) 
  appointment ?= new Collection<Appointment>(this)

  @OneToOne(() => User, (user) => user.client, {nullable: false}) 
  user!: Rel<User>;

}
