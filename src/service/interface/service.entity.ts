import { Cascade, Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, Property, type Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.js"
import { ServiceType } from "./serviceType.entity.js";
import { Price } from "./price.entity.js";
import { Appointment } from "../../appointment/interface/appointment.entity.js";
import { Supplies, Tools } from "../../materials/interface/materials.entity.js";

@Entity()
export class Service extends BaseEntity {

  @Property()
  name!: string

  @Property()
  description!: string

  @Property()
  duration!: number

  @Property({default: true})
  state?: boolean

  @ManyToOne(() => ServiceType, {nullable: false})
  serviceType!: Rel<ServiceType>

  @OneToMany(() => Price, (price) => price.service, {cascade:[Cascade.ALL], nullable:true})
  price ? = new Collection<Price>(this)

  @ManyToMany(() => Supplies, (supplies) => supplies.service, {cascade: [Cascade.ALL], owner:true})
  supplies = new Collection<Supplies>(this)

  @ManyToMany(() => Tools, (tools) => tools.service, {cascade: [Cascade.ALL], owner:true})
  tools = new Collection<Tools>(this)

  @ManyToMany(() => Appointment, (appointment) => appointment.service, {cascade: [Cascade.ALL], owner:true, nullable:true})
  appointment ? = new Collection<Appointment>(this)

}