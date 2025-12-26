import { BaseEntity } from "../../shared/baseEntity.js";
import { Client } from "../../client/interface/client.entity.js";
import { Service } from "../../service/interface/service.entity.js";
import { Cascade, Collection, DateTimeType, Entity, ManyToMany, ManyToOne, OneToMany, Property, type Rel } from "@mikro-orm/core";
import { Payment, Sign } from "./payment.entity.js";


export enum State
{
  Confirmated = "C",
  Finished = "F",
  Canceled = "X"
}

@Entity()
export class Appointment extends BaseEntity {

  @Property({ type: DateTimeType })
  dateTime?: Date = new Date() 

  @Property({ type: DateTimeType })
  dateTimeAppointment!: Date

  @Property({nullable: true, default: State.Confirmated})
  state?: State

  @ManyToOne( ()=> Client, {nullable: true})
  client?: Rel<Client>

  @ManyToMany(() => Service, (service) => service.appointment)
  service = new Collection<Service>(this)

  @OneToMany(() => Payment, (payment) => payment.appointment, {
    nullable: true, cascade: [Cascade.ALL]
  })payment? = new Collection<Payment>(this);

  @OneToMany(() => Sign, (sign) => sign.appointment, { 
    nullable: true, cascade: [Cascade.ALL]
  }) sign? = new Collection<Sign>(this); 

}