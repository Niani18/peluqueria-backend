import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.js";
import { Service } from "./service.entity.js";


@Entity()
export class ServiceType extends BaseEntity {

    @Property({nullable: false, unique: true})
    name!: string;

    @Property({nullable: true})
    description!: string;

    @OneToMany(()=> Service, (service) => service.serviceType, {
        cascade: [Cascade.ALL]
    }) services = new Collection<Service>(this);
}