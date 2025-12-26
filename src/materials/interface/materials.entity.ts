import { Entity, Enum, ManyToMany, Property, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.js";
import { Service } from "../../service/interface/service.entity.js";

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: { tools: 'Tools', supplies: 'Supplies' },
  abstract: true
})
export abstract class Material extends BaseEntity{

  @Enum()
  type?: 'tools'|'supplies'

}

@Entity()
export class Tools extends Material {

  constructor() {
    super();
    this.type = 'tools';
  }
  
  @Property({nullable: false})
  name!: string;

  @Property({nullable: false})
  description!: string

  @Property({nullable: true, default: true})
  state?: boolean;

  @ManyToMany(() => Service, (service) => service.tools)
  service ? = new Collection<Service>(this);
  
}

@Entity()
export class Supplies extends Material {

  constructor() {
    super();
    this.type = 'supplies';
  }

  @Property({nullable: false})
  name!: string;

  @Property({nullable: false})
  description!: string

  @Property({nullable: true, default: true})
  stock!: number

  @ManyToMany(() => Service, (service) => service.supplies)
  service ? = new Collection<Service>(this);

}