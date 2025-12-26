import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, UseFilters } from "@nestjs/common";
import { AppointmentService } from "./appointment.service.js";
import { Appointment, State } from "./interface/appointment.entity.js";
import { AppointmentDTO } from "./dto/appointment.dto.js";
import { ScheduleService } from "../schedule/schedule.service.js";
import { Payment } from "./interface/payment.entity.js";
import { ServiceService } from "../service/service.service.js";
import { Service } from "../service/interface/service.entity.js";
import { AppointmentPaginatioQueryDTO } from "./dto/appointment-pagination.dto.js";
import { Public, Roles, User } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";
import { PaymentCheckoutDTO } from "./dto/payment-checkout.dto.js";
import { PaymentsService } from "../payments/payment.service.js";
import { PaymentDTO } from "./dto/payment.dto.js";


@Controller("appointment")
export class AppointmentController
{
    constructor(
        private readonly service : AppointmentService,
        private readonly scheduleService : ScheduleService,
        private readonly serviceService : ServiceService,
        private readonly payments: PaymentsService
    ){}

    @Roles(Role.Admin)
    @Get('all')
    async findAll() : Promise<Appointment[]> {
        return this.service.findAll();
    }

    @Roles(Role.Admin)
    @Get('search-admin')
    async search(@Query() query: AppointmentPaginatioQueryDTO){
        return this.service.search(query)
    }

    @Roles(Role.User)
    @Get('search-day')
    async searchDay(@Query() query: AppointmentPaginatioQueryDTO){
        if (!query.limit) query.limit = 100;
        const result = await this.service.search(query);
            const items = result.data.map((a: any) => ({
                id: a.id,
                dateTimeAppointment: a.dateTimeAppointment,
                state: a.state,
                service: (a.service ?? []).map((s: any) => ({ duration: Number(s.duration) || 0 })),
            }));
        return { items };
      }

    @Roles(Role.User)
    @Get('search-user')
    async searchByUser(@Query() query: AppointmentPaginatioQueryDTO, @User() user: any){
        query.clientId = user.clientId
        return this.service.search(query)
    }

    @Roles(Role.Admin)
    @Post('payment')
    async createPayment(@Body() dto : PaymentDTO) : Promise<Payment> {
        return this.service.createPayment(dto);
    }

    @Roles(Role.Admin)
    @Get('payment')
    async getPayments(): Promise<Payment[]> {
        return this.service.getAllPayments();
    }

    @Roles(Role.Admin)
    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id : number) : Promise<Appointment> {
        return this.service.findById(id);
    }

    @Roles(Role.User)
    @Post()
    async create(@Body() dto: AppointmentDTO, @User() user: any): Promise<Appointment> {

        if (dto.dateTimeAppointment <= new Date()) {
            throw new ConflictException('Cannot create appointment today or in the past');
        }
        
        // ===== helpers =====
        const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60_000);
        const timeOnDate = (base: Date, hhmm: string) => {
            const [hh, mm] = hhmm.split(':').map(Number);
            const d = new Date(base);
            d.setHours(hh, mm, 0, 0);
            return d;
        };

        const totalMinutesFromServiceIds = async (serviceIds: number[]) => {
            const services = await Promise.all(serviceIds.map(id => this.serviceService.findById(id)));
            // cada servicio.duration está en HORAS (puede ser 0.5, 1.5, etc.)
            const totalHours = services.reduce((acc: number, s: any) => acc + (Number(s.duration) || 0), 0);
            return Math.round(totalHours * 60);
        };

        // ===== 1) inicio/fin solicitados =====
        const start = new Date(dto.dateTimeAppointment);
        const requestedTotalMinutes = await totalMinutesFromServiceIds(dto.service);
        const end = addMinutes(start, requestedTotalMinutes); // [start, end)

        // ===== 2) dentro del horario =====
        const schedule = await this.scheduleService.findByDay(start.getDay());
        const scheduleBeg = schedule ? schedule.beginTime : '99:99';
        const scheduleEnd = schedule ? schedule.endTime   : '00:00';

        const schedBegDate = timeOnDate(start, scheduleBeg);
        const schedEndDate = timeOnDate(start, scheduleEnd);

        if (!(start >= schedBegDate && end <= schedEndDate)) {
            throw new ConflictException('Out of schedule');
        }

        // ===== 3) citas del mismo día =====
        const yyyy = start.getFullYear();
        const mm = (start.getMonth() + 1).toString().padStart(2, '0');
        const dd = start.getDate().toString().padStart(2, '0');
        const date = `${yyyy}-${mm}-${dd}`;

        const appointmentsPreCharge = await this.service.findByDate(date) ?? [];
        // ===== 4) solapamiento [inicio, fin) =====
        for (const appt of appointmentsPreCharge) {
            const otherStart = new Date(appt.dateTimeAppointment);
            const otherMinutes = await totalMinutesFromServiceIds((appt.service.getItems().map((s: Service) => s.id)) as number[]); // getItems() para que la coleccion pase a ser un array normal
            const otherEnd = addMinutes(otherStart, otherMinutes);

            // se pisan sii hay intersección: start < otherEnd && end > otherStart
            if (start < otherEnd && end > otherStart && appt.state !== State.Canceled) {
                throw new ConflictException('Appointment overlaps with an existing appointment');
            }
        }

        return this.service.create(dto, user);
    }

    @Roles(Role.User)
    @Patch("user/:id")
    async updateUser(@Param("id", ParseIntPipe) id : number, @User() user: any) : Promise<Appointment> {
        return this.service.updateUser(id, user); 
    }

    @Roles(Role.Admin)
    @Patch("admin/:id")
    async updateAdmin(@Param("id", ParseIntPipe) id: number) : Promise<Appointment> {
        return this.service.updateAdmin(id); 
    }

    // @Delete(":id")
    // async delete(@Param("id", ParseIntPipe) id : number) : Promise<string> { 
    //     return this.service.delete(id);
    // }


    @Public()
    @Post('payment/checkout')
    async startPayment(@Body() dto: PaymentCheckoutDTO) {
    // No se crea nada en DB: solo pedimos a MP el init_point
        const appointment = await this.service.findById(dto.appointmentId);
        if (appointment.state !== State.Confirmated) {
            throw new ConflictException('Appointment not confirmated');
        }

        if (appointment.payment === null) {
            throw new ConflictException('Payment already exists for this appointment');
        }



        return this.payments.createPreferenceForAppointment(dto.appointmentId, dto.amount);
    }

}