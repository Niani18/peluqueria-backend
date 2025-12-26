import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { Injectable } from "@nestjs/common";
import { Service } from "./interface/service.entity.js";
import { ServiceDTO } from "./dto/service.dto.js";
import { PriceDTO } from "./dto/price.dto.js";
import { Price } from "./interface/price.entity.js";
import { UpdateServiceDTO } from "./dto/updateService.dto.js";
import { ServiceQueryDTO } from "./dto/service-pagination.dto.js";
import { SERVICE_SORT_FIELDS } from "./sort/service-sort.config.js";
import { parseSort } from "../shared/parse-sort.js";

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: EntityRepository<Service>,
    private readonly em: EntityManager,
  ) {}

  async search(query : ServiceQueryDTO) {
    const qb = this.serviceRepository.qb("se");
    qb.leftJoinAndSelect("se.price", "p")
    .leftJoinAndSelect("se.serviceType", "st")
    .leftJoinAndSelect("se.appointment", "ap");

    if(query.serviceType) { qb.andWhere({ serviceType: query.serviceType }); }
    if(query.minDuration) { qb.andWhere("se.duration >= ?", [query.minDuration]); }
    if(query.maxDuration) { qb.andWhere("se.duration <= ?", [query.maxDuration]); }
    if(query.nameLike) { qb.andWhere("se.name LIKE CONCAT('%', ?, '%')", [query.nameLike])}
    if(query.state) { qb.andWhere({state: query.state}) }

    const order = parseSort<typeof SERVICE_SORT_FIELDS>(SERVICE_SORT_FIELDS, query.sort);
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

  async findAll(): Promise<Service[]>{
    return  this.serviceRepository.findAll({populate: ['serviceType', 'price', 'tools', 'supplies', 'appointment']});
  }

  async findById(id: number): Promise<Service | null> {
    return this.serviceRepository.findOneOrFail({id}, {populate: ['serviceType', 'price', 'tools', 'supplies', 'appointment']});
  }

  async createService(dto: ServiceDTO): Promise<Service> {
    const { price, ...serviceData } = dto;
    const service = this.serviceRepository.create(serviceData);
    await this.em.persistAndFlush(service);

    const priceEntity = this.em.create(Price, {
      amount: price.amount,
      service,                 // la relación la seteás acá
    });
    await this.em.persistAndFlush(priceEntity);

    return service;
  }

  async updateService(id: number, dto: UpdateServiceDTO): Promise<Service | null> {
    const service = this.serviceRepository.getReference(id);
    this.serviceRepository.assign(service, dto);
    await this.em.persistAndFlush(service);
    return service;
  }

  async updatePrice(id: number, dtoPrice: PriceDTO): Promise<Price | null> {
    const service = this.serviceRepository.getReference(id);
    const price = this.em.create(Price, {service, ...dtoPrice});
    await this.em.persistAndFlush(price);
    return price;
  }

  async deleteService(id: number): Promise<string> {
    const service = this.serviceRepository.getReference(id);
    const price = await this.em.find(Price, {service});
    for (const p of price) {
      await this.em.removeAndFlush(p);
    }
    await this.em.removeAndFlush(service);
    return 'service  deleted successfully';
  } 

}