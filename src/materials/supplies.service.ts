import { Injectable } from "@nestjs/common";
import { Supplies } from "./interface/materials.entity.js";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { SuppliesDto } from "./dto/supplies.dto.js";
import { SuppliesQueryDto } from "./dto/paginationSupplies.dto.js";
import { parseSort } from "../shared/parse-sort.js";
import { SUPPLIES_SORT_CONFIG } from "./sort/supplies-sort.config.js";
import { SupplyUpdateDto } from "./dto/supply-update.dto.js";

@Injectable()
export class SuppliesService {
  constructor(
    @InjectRepository(Supplies)
    private readonly suppliesRepository: EntityRepository<Supplies>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Supplies[]> {
    return this.suppliesRepository.findAll();
  }

   async search(query: SuppliesQueryDto){
  
      const qb = this.suppliesRepository.qb('t').distinct()
  
      if(query.name) qb.andWhere ({name: query.name}) 
      if(query.serviceName) qb.leftJoinAndSelect('t.service', 's', {'s.name': query.name})
      else qb.leftJoinAndSelect('t.service', 's')
  
      const order = parseSort<typeof SUPPLIES_SORT_CONFIG>(SUPPLIES_SORT_CONFIG, query.sort)
      for (const {column, dir} of order){
        qb.orderBy({[column]:dir})
      }
  
      const[data, total] = await qb
      .limit(query.limit)
      .offset((query.page - 1) * query.limit)
      .getResultAndCount()
  
      return {
        data,
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
        sort: order,
      };
      
    }

  async findById(id: number): Promise<Supplies | null> {
    return this.suppliesRepository.findOne({ id });
  }

  async createSupplies(dto: SuppliesDto): Promise<Supplies> {
    const supplies = this.suppliesRepository.create(dto);
    await this.em.persistAndFlush(supplies);
    return supplies;
  }

  async updateSupplies(id: number, dto: SupplyUpdateDto): Promise<Supplies | null> {
    const supplies = this.suppliesRepository.getReference(id);
    this.suppliesRepository.assign(supplies, dto);
    await this.em.persistAndFlush(supplies);
    return supplies;
  }

  async deleteSupplies(id: number): Promise<string> {
    const supplies = this.suppliesRepository.getReference(id);
    await this.em.removeAndFlush(supplies);
    return 'supplies deleted successfully';
  }

}


