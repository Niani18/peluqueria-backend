import { Cascade, DateTimeType, Entity, ManyToOne, Property, Unique, type Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.js";
import { Appointment } from "./appointment.entity.js";

@Entity()
export class Payment extends BaseEntity {
    
    @Property({ type: 'decimal', precision: 10, scale: 2, nullable: false})
    amount!: string

    @Property({ type: DateTimeType, nullable: true})
    paymentDate?: Date = new Date();

    @ManyToOne(() => Appointment, { cascade: [Cascade.ALL] })
    appointment!: Rel<Appointment>;

    @Property({ nullable: true })
    @Unique()
    mpPaymentId?: string; 
};

@Entity()
export class Sign extends Payment {};