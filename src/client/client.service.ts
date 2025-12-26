import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/mysql'; 
import { InjectRepository } from '@mikro-orm/nestjs';
import { Client } from './interface/client.entity.js';
import { CreateClientDto } from './dto/client.dto.js';
import { ClientQueryDto } from './dto/pagination.dto.js';
import { parseSort } from '../shared/parse-sort.js';
import { CLIENT_SORT_FILDS } from './sort/client-sort.config.js';
import { ClientUpdateDTO } from './dto/client-update.dto.js';

@Injectable()
export class ClientService {
  constructor(
  @InjectRepository(Client)
  private readonly clientRepo: EntityRepository<Client>,
  private readonly em: EntityManager,
) {}

  async createClient(client: CreateClientDto): Promise<Client> {
    const clientNew = this.clientRepo.create(client);
    await this.em.persistAndFlush(clientNew);
    return clientNew;
  }

  async search(query: ClientQueryDto){
    const qb = this.clientRepo.qb('c')
    .distinct()

    if(query.name) qb.andWhere( {name: query.name} )
    if(query.surname) qb.andWhere( {surname: query.surname} )
    if(query.state) qb.leftJoinAndSelect('c.appointment', 'a', {'a.state': query.state})
    else qb.leftJoinAndSelect('c.appointment', 'a')

    const order = parseSort<typeof CLIENT_SORT_FILDS>(CLIENT_SORT_FILDS, query.sort);
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

  async findAll(): Promise< Client[] > {
    const clients = await this.clientRepo.findAll({populate: ['appointment']});
    return clients;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.clientRepo.findOneOrFail({email}, {
      failHandler:  () => { throw new NotFoundException("Client not found."); }
    });
    return client;
  }

  async updateClient(id: number, dto: ClientUpdateDTO): Promise<Client | null> {
    const client = this.clientRepo.getReference(id);
    this.clientRepo.assign(client, dto);
    await this.em.persistAndFlush(client);
    return client;
  }

  async deleteClient(id: number): Promise<string> {
    const client = this.clientRepo.getReference(id);
    await this.em.removeAndFlush(client);
    return 'client deleted successfully';
  }
}