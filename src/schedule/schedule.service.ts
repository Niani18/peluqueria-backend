import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { Injectable } from "@nestjs/common";
import { Schedule, Week } from "./interface/schedule.entity.js";
import { InjectRepository } from "@mikro-orm/nestjs";
import { ScheduleDTO } from "./dto/schedule.dto.js";
import { ScheduleQueryDTO } from "./dto/pagination.dto.js";
import { parseSort } from "../shared/parse-sort.js";
import { SCHEDULE_SORT_CONFIG } from "./sort/schedule-sort.config.js";
import { ScheduleUpdateDto } from "./dto/schedule-update.dto.js";


@Injectable()
export class ScheduleService {

    constructor(
        @InjectRepository(Schedule) 
        private readonly scheduleRepository : EntityRepository<Schedule>,
        private readonly em : EntityManager
    ){}

    async findAll() : Promise<Schedule[]> {
        return this.scheduleRepository.findAll({});
    }

    async findById(id : number) : Promise<Schedule> {
        return this.scheduleRepository.findOneOrFail({id}, {});
    }

    async findByDay(day : Week) : Promise<Schedule | null>
    {
        return (await this.scheduleRepository.find({ day }))[0];
    }

    async search(query : ScheduleQueryDTO)
    {
        const qb = this.scheduleRepository.qb("s");

        if(query.day){
            qb.andWhere({day: query.day});
        }

        const order = parseSort<typeof SCHEDULE_SORT_CONFIG>(SCHEDULE_SORT_CONFIG, query.sort);
        for (const {column, dir} of order) {
            qb.orderBy({ [column]: dir });
        }

        const [data, total] = await qb
        .limit(query.limit)
        .offset((query.page - 1) * query.limit)
        .getResultAndCount();

        return {
            data,
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / query.limit)),
            sort: order,
        };
    }

    async create(dto : ScheduleDTO) : Promise<Schedule> {
        const schedule = this.scheduleRepository.create(dto);
        await this.em.persistAndFlush(schedule);
        return schedule;
    }

    async update(id: number, dto : ScheduleUpdateDto) : Promise<Schedule | null> {
        const schedule = this.scheduleRepository.getReference(id);
        this.em.assign(schedule, dto);
        await this.em.persistAndFlush(schedule);
        return schedule;
    }

    async delete(id : number) : Promise<string> {
        const ref = this.scheduleRepository.getReference(id);
        this.em.removeAndFlush(ref);
        return "Schedule succesfully deleted";
    }
}