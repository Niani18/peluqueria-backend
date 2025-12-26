import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { ServiceType } from "./interface/serviceType.entity.js";
import { Injectable } from "@nestjs/common";
import { ServiceTypeDTO } from "./dto/serviceType.dto.js";

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: EntityRepository<ServiceType>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<ServiceType[]>{
    return  this.serviceTypeRepository.findAll({populate: ['services']});
  }

  async findById(id: number): Promise<ServiceType | null> {
    return this.serviceTypeRepository.findOne({id}, {populate: ['services']});
  }
  
  async createServiceType(dto: ServiceTypeDTO): Promise<ServiceType> {
    const serviceType = this.serviceTypeRepository.create(dto);
    await this.em.persistAndFlush(serviceType);
    return serviceType;
  }

  async updateServiceType(id: number, dto: ServiceTypeDTO): Promise<ServiceType | null> {
    const serviceType = this.serviceTypeRepository.getReference(id);
    this.serviceTypeRepository.assign(serviceType, dto);
    await this.em.persistAndFlush(serviceType);
    return serviceType;
  }

  async deleteServiceType(id: number): Promise<string> {
    const serviceType = this.serviceTypeRepository.getReference(id);
    await this.em.removeAndFlush(serviceType);
    return 'service type deleted successfully';
  } 

}