import { Injectable } from "@nestjs/common";
import { Tools } from "./interface/materials.entity.js";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { ToolsDto } from "./dto/tools.dto.js";
import { ToolsQueryDto } from "./dto/paginationTools.dto.js";
import { TOOLS_SORT_CONFIG } from "./sort/tools-sort.config.js";
import { parseSort } from "../shared/parse-sort.js";
import { ToolUpdateDto } from "./dto/tool-update.dto.js";

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(Tools)
    private readonly toolsRepository: EntityRepository<Tools>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Tools[]> {
    return this.toolsRepository.findAll();
  }

  async search(query: ToolsQueryDto){

    const qb = this.toolsRepository.qb('t').distinct()

    if(query.name) qb.andWhere ({name: query.name}) 
    if(query.serviceName) qb.leftJoinAndSelect('t.service', 's', {'s.name': query.name})
    else qb.leftJoinAndSelect('t.service', 's')
    if(query.state) qb.andWhere ({state: query.state})

    const order = parseSort<typeof TOOLS_SORT_CONFIG>(TOOLS_SORT_CONFIG, query.sort)
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

  async findById(id: number): Promise<Tools | null> {
    return this.toolsRepository.findOne({ id });
  }

  async createTools(dto: ToolsDto): Promise<Tools> {
    const tools = this.toolsRepository.create(dto);
    await this.em.persistAndFlush(tools);
    return tools;
  }

  async updateTools(id: number, dto: ToolUpdateDto): Promise<Tools | null> {
    const tools = this.toolsRepository.getReference(id);
    this.toolsRepository.assign(tools, dto);
    await this.em.persistAndFlush(tools);
    return tools;
  }

  async deleteTools(id: number): Promise<string> {
    const tools = this.toolsRepository.getReference(id);
    await this.em.removeAndFlush(tools);
    return 'Tools deleted successfully';
  }

}


