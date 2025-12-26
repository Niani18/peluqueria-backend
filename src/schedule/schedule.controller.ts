import { Public, Roles } from "../shared/decorators.js";
import { ScheduleQueryDTO } from "./dto/pagination.dto.js";
import { ScheduleUpdateDto } from "./dto/schedule-update.dto.js";
import { ScheduleDTO } from "./dto/schedule.dto.js";
import { Schedule, Week } from "./interface/schedule.entity.js";
import { ScheduleService } from "./schedule.service.js";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UsePipes } from "@nestjs/common";
import { Role } from "../auth/role.enum.js";



@Controller("schedule")
export class ScheduleController
{
    constructor(
        private readonly serv : ScheduleService
    ){}

    @Get("all")
    @Public()
    async findAll() : Promise<Schedule[]> {
        return this.serv.findAll();
    }

    @Get("day/:day")
    @Public()
    async findByDay(@Param("day", ParseIntPipe) day : number) : Promise<Schedule | null> {
        return await this.serv.findByDay(day as Week);
    }

    @Get("search")
    @Public()
    async search(@Query() query : ScheduleQueryDTO) {
        return this.serv.search(query);
    }

    @Get(":id")
    @Public()
    async findOne(@Param("id", ParseIntPipe) id : number) : Promise<Schedule> {
        return this.serv.findById(id);
    }

    @Post()
    @Roles(Role.Admin)
    async create(@Body() dto : ScheduleDTO) : Promise<Schedule> {
        return this.serv.create(dto);
    }

    @Patch(":id")
    @Roles(Role.Admin)
    async update(@Param("id", ParseIntPipe) id : number, @Body() dto : ScheduleUpdateDto) : Promise<Schedule | null> {
        return this.serv.update(id, dto);
    }

    @Delete(":id")
    @Roles(Role.Admin)
    async delete(@Param("id", ParseIntPipe) id : number) : Promise<void> {
        this.serv.delete(id);
    }
}