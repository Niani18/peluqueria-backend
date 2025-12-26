import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query, Patch } from "@nestjs/common";
import { ClientService } from "./client.service.js";
import { Client } from "./interface/client.entity.js";
import { CreateClientDto } from "./dto/client.dto.js";
import { ClientQueryDto } from "./dto/pagination.dto.js";
import { ClientUpdateDTO } from "./dto/client-update.dto.js";
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";


@Controller('client')
@Roles(Role.Admin)
export class ClientController {
  constructor(
    private readonly clientService: ClientService
  ) {}


  @Get('all')
  async findAllClients(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get('search')
  async search (@Query() query: ClientQueryDto){
    return this.clientService.search(query);
  }

  @Get(':email')
  async findClientByEmail(@Param('email') email: string): Promise<Client | null> {
    return this.clientService.findByEmail(email);
  }

  @Post()
  async addClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return await this.clientService.createClient(createClientDto);
  }

  @Patch(':id')
  async updateClient(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: ClientUpdateDTO): Promise<Client | null> {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Delete(':id')
  async deleteClient(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.clientService.deleteClient(id);
  }
}