import { BadRequestException, Injectable, NotFoundException, ParseIntPipe } from "@nestjs/common";
import { Appointment, State } from "./interface/appointment.entity.js";
import { AppointmentDTO } from "./dto/appointment.dto.js";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, t } from "@mikro-orm/mysql";
import { Payment, Sign } from "./interface/payment.entity.js";
import { PaymentDTO } from "./dto/payment.dto.js";
import { AppointmentPaginatioQueryDTO } from "./dto/appointment-pagination.dto.js";
import { APPOINTMENT_SORT_FIELDS } from "./sort/appointment-sort.config.js";
import { parseSort } from "../shared/parse-sort.js";
import { Service } from "../service/interface/service.entity.js";
import { SuppliesService } from "../materials/supplies.service.js";




@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: EntityRepository<Appointment>,
        private readonly em: EntityManager,
        private readonly supplyService: SuppliesService
    ) { }

    async findAll(): Promise<Appointment[]> {
        return this.appointmentRepository.findAll({ populate: ["payment", "sign", "client", "service"] });
    }

    async search(query: AppointmentPaginatioQueryDTO) {
        const qb = this.appointmentRepository.qb('a');
        qb.leftJoinAndSelect('a.client', 'c')
        .leftJoinAndSelect('a.service', 's')
        .leftJoinAndSelect('a.payment', 'p')
        .leftJoinAndSelect('a.sign', 'sg')
        .distinct();

        if (query.from) qb.andWhere({ dateTimeAppointment: { $gte: new Date(query.from) } });
        if (query.to)   qb.andWhere({ dateTimeAppointment: { $lte: new Date(query.to) } });
        if (query.clientId) qb.andWhere({ client: +query.clientId });
        if (query.serviceId) qb.andWhere({ service: +query.serviceId }); // ver punto 4
        if (query.state) qb.andWhere({ state: query.state });

        const order = parseSort<typeof APPOINTMENT_SORT_FIELDS>(APPOINTMENT_SORT_FIELDS, query.sort);
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

    async findById(id: number): Promise<Appointment> {
        return this.appointmentRepository.findOneOrFail({ id }, { populate: ["payment", "sign", "client", "service"] });
    }

    async create(dto: AppointmentDTO, user: any): Promise<Appointment> {
        const { sign, ...appointmentData } = dto;

        for (const serviceId of appointmentData.service){
            
            const service = await this.em.findOneOrFail(Service, {id: serviceId})
            if(service.state === false){
                throw new BadRequestException('El servicio seleccionado está deshabilitado');
            }
            for (const supId of (service.supplies.getItems().map(s => s.id)) as number[]){
                const supplies = await this.supplyService.findById(supId);
                if (supplies){
                    supplies.stock = supplies.stock -1;
                    if (supplies.stock < 0){
                        throw new BadRequestException(`No hay stock suficiente del insumo: ${supplies.name}`);
                    }
                    await this.em.persistAndFlush(supplies);
                }
            }     

        }
        const appointment = this.appointmentRepository.create(appointmentData);
        appointment.client = this.em.getReference('Client', user.clientId);
        await this.em.persistAndFlush(appointment);

        const signCreate = this.em.create(Sign, {
            amount: sign.amount,
            appointment,
        });
        await this.em.persistAndFlush(signCreate);

        return appointment;
    }


    async getAllPayments(): Promise<Payment[]> {
        return this.em.findAll(Payment, { populate: ['appointment'] });
    }

    async createPayment(dto: PaymentDTO): Promise<Payment> {
        const appointment = await this.appointmentRepository.findOneOrFail({ id: dto.appointment });
        const py = await this.em.findOne(Payment, { appointment: appointment });
        if (py) {
            throw new NotFoundException('Payment for this appointment already exists');
        }

        if (appointment.state === State.Canceled) {
            throw new BadRequestException("Cannot create payment for non-confirmed appointment");
        }

        const payment = this.em.create(Payment, dto);
        await this.em.persistAndFlush(payment);
        return payment;
    }

    async findByDate(dateISO: string) {
        const [y, m, d] = dateISO.split('-').map(Number);
        const start = new Date(y, m - 1, d, 0, 0, 0, 0);     
        const end = new Date(y, m - 1, d + 1, 0, 0, 0, 0);

        return this.appointmentRepository.find(
            { dateTimeAppointment: { $gte: start, $lt: end } },
            {
            orderBy: { dateTimeAppointment: 'asc' },
            populate: ['service'],
            },
        );
    }


    async updateAdmin(id : number) : Promise<Appointment> { //solo puede cambiar cosas propias de el turno, nada relacionado con cliente, pago, etc
        const appointment = await this.appointmentRepository.findOneOrFail({id}, 
            {
                failHandler: () => {throw new NotFoundException("Appointment not found")
            }}); 

        if (appointment.state !== State.Confirmated) {
            throw new BadRequestException("You can only finish pending appointments");
        }
        appointment.state = State.Finished; //cancelo el turno              
        await this.em.persistAndFlush(appointment);                           
        return appointment;                                                            
    }

    async updateUser(id : number, user: any) : Promise<Appointment> { //solo puede cambiar cosas propias de el turno, nada relacionado con cliente, pago, etc
        const appointment = await this.appointmentRepository.findOneOrFail({id}, 
            {

                failHandler: () => {throw new NotFoundException("Appointment not found")

            }});  

        if (appointment.client?.id !== user.clientId) {
            throw new BadRequestException("this isn't your fucking matter");
        }

        if (appointment.state !== State.Confirmated) {
            throw new BadRequestException("You can only cancel pending appointments");
        }

        const day = new Date();
        day.setDate(day.getDate() - 1); //24 horas de anticipacion


        if (appointment.dateTimeAppointment <=  day) {
            throw new BadRequestException("You can only cancel appointments at least 24 hours in advance, call to number 0800-555-PELU");
        }

        appointment.state = State.Canceled; //cancelo el turno              
        await this.em.persistAndFlush(appointment);                           
        return appointment;                                                            
    }

    // async delete(id: number) : Promise<string> {
    //     const apointment = this.appointmentRepository.getReference(id); <-- lo mismo que con la update
    //     await this.em.removeAndFlush(apointment);
    //     return "Apointment successfully deleted";
    // }
}
