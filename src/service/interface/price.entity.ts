import { DateTimeType, Entity, ManyToOne, Property, type Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.js";
import { Service } from "./service.entity.js";

@Entity()
export class Price extends BaseEntity {

  @Property({type: DateTimeType, nullable: true})
  createdAt?: Date = new Date()

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: false})
  amount!: string

  @ManyToOne(() => Service, {nullable:false})
  service!: Rel<Service>

}