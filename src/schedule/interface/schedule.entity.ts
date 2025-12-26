import { Entity, Property } from "@mikro-orm/mysql";
import { BaseEntity } from "../../shared/baseEntity.js";



export enum Week {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}

@Entity()
export class Schedule extends BaseEntity
{
    @Property({ nullable : false, unique: true }) day!: Week;

    @Property({ nullable : false }) beginTime!: string;

    @Property({ nullable : false }) endTime!: string;
}